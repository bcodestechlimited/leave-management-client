import { acceptInvite } from "@/api/employee.api";
import { Loader } from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const isTenantIdValid =
    typeof tenantId === "string" && tenantId.trim() !== "";

  const { isPending, isError, error, data } = useQuery({
    queryKey: ["acceptInvite", tenantId, token], // Unique key for the query
    queryFn: () => {
      if (!token) {
        throw new Error("Link is broken or missing required parameters.");
      }

      if (!isTenantIdValid) {
        throw new Error("Invalid clientId.");
      }

      return acceptInvite({ tenantId, token }); // Call the API function
    },
    retry: false, // Disable retries for this query
  });

  // Handle success side effect
  useEffect(() => {
    if (data) {
      toast.success("Invite Accepted!");
      navigate(`/login`, { replace: true });
    }
  }, [data, navigate]);

  // Handle error side effect
  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  if (isPending) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col justify-center">
        <Loader isLoading={isPending} />
        <p className="py-4 font-semibold">One moment, accepting invite...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <p className="py-4 font-semibold">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <p className="py-4 font-semibold">One moment, processing...</p>
    </div>
  );
}
