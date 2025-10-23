import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Clipboard } from "lucide-react";
import InviteModal from "./modals/invite-modal";
import BulkInviteModal from "./modals/bulk-invite-modal";
import { useSearchParams } from "react-router-dom";
import DataTable from "@/components/table";
import { fetchAllInvites } from "@/api/tenant.api";
import { formatDate, getStatusClasses } from "@/lib/utils";

export default function EmployeeInvites() {
  const [searchParams] = useSearchParams();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isBulkInviteModalOpen, setIsBulkInviteModalOpen] = useState(false);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["invites", page, search],
    queryFn: () => fetchAllInvites({ page, limit: 10, search }),
  });

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  console.log({ data });

  const columns = [
    {
      header: "Email",
      render: (row: any) => row.email || "N/A",
    },
    {
      header: "Expires At",
      accessor: "expiresAt",
      render: (row: any) => formatDate(row?.expiresAt) || "N/A",
    },
    {
      header: "Status",
      isStatus: true,
      render: (row: any) => {
        if (row.expiresAt < Date.now()) {
          return (
            <span className={`capitalize p-2 ${getStatusClasses("expired")}`}>
              Expired
            </span>
          );
        }
        return (
          <span className={`capitalize p-2 ${getStatusClasses(row.status)}`}>
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
    <div className="p-4">
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
