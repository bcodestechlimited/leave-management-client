import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Clipboard } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import DataTable from "@/components/table";
import { fetchAllInvites } from "@/api/tenant.api";
import { formatDate, getStatusClasses } from "@/lib/utils";
import InviteModal from "./modals/invite-modal";
import BulkInviteModal from "./modals/bulk-invite-modal";
import SwitchTenants from "../_components/switch-tenants";
import SearchInput from "@/components/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const options = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "accepted",
    label: "Accepted",
  },
  {
    value: "expired",
    label: "Expired",
  },
];

export default function AdminEmployeeInvites() {
  const [clientId, setClientId] = useState<string>(
    () => localStorage.getItem("client-id") || "",
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isBulkInviteModalOpen, setIsBulkInviteModalOpen] = useState(false);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";

  const { data, isLoading } = useQuery({
    queryKey: ["invites", page, search, status, clientId],
    queryFn: () =>
      fetchAllInvites({
        page,
        limit: 10,
        search,
        status: status === "all" ? undefined : status,
        clientId,
      }),
  });

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    setSearchParams((prev: URLSearchParams) => {
      const params = new URLSearchParams(prev);
      if (newStatus === "all") {
        params.delete("status");
      } else {
        params.set("status", newStatus);
      }
      params.set("page", "1");
      return params;
    });
  };

  const columns = [
    {
      header: "Email",
      render: (row: any) => row.email || "N/A",
    },
    {
      header: "Created At",
      render: (row: any) => formatDate(row?.createdAt) || "N/A",
    },
    {
      header: "Expires At",
      render: (row: any) => formatDate(row?.expiresAt) || "N/A",
    },
    {
      header: "Status",
      render: (row: any) => {
        return (
          <span
            className={`capitalize p-2 rounded ${getStatusClasses(row.status)}`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: "URL",
      render: (row: any) => {
        return (
          <div className="flex items-center gap-2">
            <span className="truncate">{row?.url?.slice(0, 20)}</span>
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => copyToClipboard(row.url)}
              aria-label="Copy URL"
            >
              <Clipboard size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <SwitchTenants clientId={clientId} setClientId={setClientId} />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Employee Invites</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsInviteModalOpen(true)}>
            Generate Invite Link
          </Button>
          <Button
            onClick={() => setIsBulkInviteModalOpen(true)}
            variant="outline"
          >
            Bulk Invite
          </Button>
        </div>
      </div>

      <div className="flex gap-2 items-center justify-end pb-4">
        <SearchInput placeholder="Search by email" />
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-fit flex gap-2">
            <SelectValue placeholder={"Status"} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                className="cursor-pointer"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.links || []}
        isLoading={isLoading}
        noDataMessage="No invites found."
        pagination={data?.pagination}
      />

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />

      <BulkInviteModal
        isOpen={isBulkInviteModalOpen}
        onClose={() => setIsBulkInviteModalOpen(false)}
      />
    </div>
  );
}
