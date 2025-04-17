import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { tenantSendPasswordResetLink } from "@/api/tenant.api";

interface ForgotPasswordFormInputs {
  email: string;
}

export default function TenantForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>();

  const passwordResetMutation = useMutation({
    mutationFn: tenantSendPasswordResetLink,
    onSuccess: () => {
      toast.success("Password reset link sent successfully!");
      navigate("/client/login");
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error("Failed to send password reset link", error);
    },
  });

  const onSubmit = async (data: { email: string }) => {
    await passwordResetMutation.mutateAsync(data);
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-center mb-4">Forgot Password</h1>
        <form className="text-start" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={passwordResetMutation.isPending}
            className="w-full"
          >
            {passwordResetMutation.isPending
              ? "Requesting..."
              : "Request Password Reset"}
          </Button>
          <div className="py-4 text-center">
            <Link to="/tenant/login" className="font-semibold underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
