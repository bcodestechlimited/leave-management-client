import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FileUpload from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTenantStore, useTenantActions } from "@/store/useTenantStore";
import { updateTenantProfile } from "@/api/tenant.api";
import { Tenant } from "@/types/tenant.types";

export interface TenantFormInputs {
  name: string | null;
  email: string;
  logo: FileList | null;
  color: string;
}

export default function TenantProfileUpdate() {
  const { tenant } = useTenantStore();
  const { setTenant } = useTenantActions();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantFormInputs>({
    defaultValues: {
      name: tenant?.name,
      email: tenant?.email,
      logo: null,
      color: tenant?.color,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateTenantProfile,
    onSuccess: ({ tenant }) => {
      console.log({ tenant });

      setTenant(tenant as Tenant);
      navigate("/dashboard/tenant/profile");
    },
    onError: (error) => {
      if (error instanceof Error) {
        return toast.error(error.message);
      }
      toast.error("Failed to update profile");
    },
  });

  const onSubmit = (data: TenantFormInputs) => {
    const logo = data.logo?.[0];

    const payload = {
      ...data,
      logo: logo || null,
    };

    mutate(payload);
  };

  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-2xl font-bold mb-4 text-start">
        Update Client Profile
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded-lg p-6 text-start"
      >
        <div className="mb-4">
          <Label className="block font-semibold mb-2">Name</Label>
          <Input
            type="text"
            {...register("name")}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="mb-4">
          <Label className="block font-semibold mb-2">Email</Label>
          <Input
            type="email"
            {...register("email")}
            className="w-full border rounded-lg p-2"
            disabled
          />
        </div>

        <div className="mb-4">
          <Label className="block font-semibold mb-2">Brand Color</Label>
          <Input
            type="color"
            {...register("color")}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="mb-4">
          <FileUpload
            label="Upload Logo"
            register={{ ...register("logo") }}
            error={errors.logo}
            accept=".jpg,.png"
            maxSize={10 * 1024 * 1024}
          />
        </div>

        <div className="flex justify-end">
          <Button disabled={isPending} type="submit">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
