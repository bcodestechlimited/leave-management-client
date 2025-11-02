import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/loader";
import { getAllClients } from "@/api/admin.api";
import { Client } from "@/types/tenant.types";

interface SwitchTenantsProps {
  clientId: string;
  setClientId: (clientId: string) => void;
}

export default function SwitchTenants({
  clientId,
  setClientId,
}: SwitchTenantsProps) {
  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: tenantsError,
  } = useQuery({
    queryFn: () => getAllClients({ page: 1, limit: 10 }),
    queryKey: ["clients"],
  });

  if (clientsLoading) return <Loader isLoading={clientsLoading} />;

  if (tenantsError)
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load clients
      </div>
    );

  return (
    <div className="flex justify-end">
      <Select
        value={clientId || ""}
        onValueChange={(val: string) => {
          setClientId(val);
          localStorage.setItem("client-id", val);
        }}
      >
        <SelectTrigger className="w-fit gap-4">
          <SelectValue placeholder={"Select Client"} className="px-12" />
        </SelectTrigger>
        <SelectContent>
          {clientsData?.clients.map((option: Client) => (
            <SelectItem key={option._id} value={option._id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
