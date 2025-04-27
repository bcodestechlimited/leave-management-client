import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { tenantLogin, validateTenantID } from "@/api/tenant.api";
import { toast } from "sonner";
import { useTenantActions } from "@/store/useTenantStore";

type TenantIdFormInputs = {
  tenantId: string;
};

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function TenantLogin() {
  const [isTenantValid, setIsTenantValid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard/tenant";

  const { setTenant } = useTenantActions();

  const {
    register: registerTenant,
    handleSubmit: handleTenantSubmit,
    formState: { errors: tenantErrors },
  } = useForm<TenantIdFormInputs>();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormInputs>();

  const validateTenantMutation = useMutation({
    mutationFn: (tenantId: string) => validateTenantID({ tenantId }),
    onSuccess: () => {
      toast.success(`Client ID validated successfully!`);
      setIsTenantValid(true);
    },
    onError: (error) => {
      console.error("Tenant validation error:", error);
      toast.error(error.message);
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormInputs) => tenantLogin(data),
    onSuccess: ({ tenant }) => {
      console.log(tenant);
      setTenant(tenant || null);
      toast.success(`Login successful`);
      navigate(from, { replace: true });
    },
    onError: (error) => {
      console.error("Tenant login error:", error);
      toast.error(error.message);
    },
  });

  const validateTenantId = (data: TenantIdFormInputs) => {
    validateTenantMutation.mutate(data.tenantId);
  };

  const handleLogin = (data: LoginFormInputs) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Client Login</h2>

      {/* Tenant ID Input */}
      <form
        onSubmit={handleTenantSubmit(validateTenantId)}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="tenantId" className="block mb-1 font-medium">
            Client ID
          </Label>
          <Input
            id="tenantId"
            type="text"
            {...registerTenant("tenantId", {
              required: "Client ID is required",
            })}
            placeholder="Enter your client ID"
            className="w-full"
          />
          {tenantErrors.tenantId && (
            <p className="text-red-500 text-sm mt-1">
              {tenantErrors.tenantId.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={validateTenantMutation.isPending || isTenantValid}
          className="w-full"
        >
          {validateTenantMutation.isPending
            ? "Validating..."
            : "Validate Client ID"}
        </Button>
      </form>

      {/* Login Form */}
      {isTenantValid && (
        <form
          onSubmit={handleLoginSubmit(handleLogin)}
          className="space-y-4 mt-6"
        >
          <div>
            <Label htmlFor="email" className="block mb-1 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...registerLogin("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
              placeholder="Enter your email"
              className="w-full"
            />
            {loginErrors.email && (
              <p className="text-red-500 text-sm mt-1">
                {loginErrors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="password" className="block mb-1 font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...registerLogin("password", {
                required: "Password is required",
                minLength: {
                  value: 5,
                  message: "Password must be at least 6 characters long",
                },
              })}
              placeholder="Enter your password"
              className="w-full"
            />
            {loginErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {loginErrors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      )}
      <div className="pt-4 text-end">
        <Link to="/tenant/forgot-password" className="font-semibold underline">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}
