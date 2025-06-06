import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import Eye and EyeOff icons
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { tenantResetPassword } from "@/api/tenant.api";

interface ResetPasswordFormInputs {
  newPassword: string;
  confirmPassword: string;
}

export default function TenantResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormInputs>();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: tenantResetPassword,
    onSuccess: () => {
      toast.success("Password reset successful! You can now log in");
      navigate("/client/login");
    },
    onError: (error) => {
      console.error("Error resetting password", error);
      toast.error("Error sending password reset link");
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return;
    }

    const resetData = {
      password: data.newPassword,
      token: token,
    };

    mutation.mutateAsync(resetData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h1 className="text-xl font-bold text-center mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="text-start">
        <div className="mb-4">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 5,
                  message: "Password must be at least 5 characters long",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}{" "}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
