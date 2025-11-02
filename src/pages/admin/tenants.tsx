import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ClipboardCopy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import DataTable from "@/components/table";
import { getAllClients } from "@/api/admin.api";
import AddClientModal from "./modal/add-client-modal";

export default function Tenants() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const { data, isLoading } = useQuery({
    queryKey: ["clients", { page, limit }],
    queryFn: () => getAllClients({ page, limit }),
  });

  console.log({ isLoading, data });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const columns = [
    {
      header: "Name",
      render: (row: any) => <span>{row.name || "N/A"}</span>,
    },
    {
      header: "Client Id",
      render: (row: any) => (
        <span className="flex gap-2">
          {row._id}
          <ClipboardCopy
            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black"
            onClick={() => handleCopyToClipboard(row._id)}
          />
        </span>
      ),
    },
    {
      header: "Email",
      render: (row: any) => row.email || "N/A",
    },
    {
      header: "Color",
      render: (row: any) => (
        <span
          style={{
            backgroundColor: row.color,
          }}
          className="p-2"
        >
          {row.color}
        </span>
      ),
    },
    {
      header: "Logo",
      isStatus: true,
      render: (row: any) => (
        <img src={row.logo} className="w-8 h-8 rounded-full" />
      ),
    },
  ];

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Tenants</h1>
        <Button onClick={openModal}>Add New Client</Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.clients || []}
        isLoading={isLoading}
        noDataMessage="No clients found."
        pagination={data?.pagination}
      />

      <AddClientModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
