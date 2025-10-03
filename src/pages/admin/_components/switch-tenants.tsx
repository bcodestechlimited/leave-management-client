import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllTenants } from "@/api/admin.api";
import { useQuery } from "@tanstack/react-query";
import { Tenant } from "@/types/tenant.types";
import { Loader } from "@/components/loader";

interface SwitchTenantsProps {
  tenantId: string;
  setTenantId: (tenantId: string) => void;
}

export default function SwitchTenants({
  tenantId,
  setTenantId,
}: SwitchTenantsProps) {
  const {
    data: tenantsData,
    isLoading: tenantsLoading,
    isError: tenantsError,
  } = useQuery({
    queryFn: () => getAllTenants({ page: 1, limit: 10 }),
    queryKey: ["tenants"],
  });

  if (tenantsLoading) return <Loader isLoading={tenantsLoading} />;

  if (tenantsError)
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load clients
      </div>
    );

  return (
    <div className="flex justify-end">
      <Select
        value={tenantId || ""}
        onValueChange={(val: string) => {
          setTenantId(val);
          localStorage.setItem("tenant-id", val);
        }}
      >
        <SelectTrigger className="w-fit gap-4">
          <SelectValue placeholder={"Select Tenant"} className="px-12" />
        </SelectTrigger>
        <SelectContent>
          {tenantsData?.tenants.map((option: Tenant) => (
            <SelectItem key={option._id} value={option._id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
