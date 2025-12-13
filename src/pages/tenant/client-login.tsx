import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { clientLogin, validateClientId } from "@/api/tenant.api";
import { toast } from "sonner";
import { useClientActions } from "@/store/use-client-store";
import { Eye, EyeOff } from "lucide-react";

type ClientIdFormInputs = {
  clientId: string;
};

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function ClientLogin() {
  const [isClientIdValid, setIsClientIdValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard/client";

  const { setClient } = useClientActions();

  const {
    register: registerClient,
    handleSubmit: handleClientSubmit,
    formState: { errors: clientErrors },
  } = useForm<ClientIdFormInputs>();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormInputs>();

  const validateClientIdMutation = useMutation({
    mutationFn: (clientId: string) => validateClientId({ clientId }),
    onSuccess: (data) => {
      toast.success(`Client ID validated successfully!`);
      localStorage.setItem("client-id", data.client._id);
      setIsClientIdValid(true);
    },
    onError: (error) => {
      console.error("Tenant validation error:", error);
      toast.error(error.message);
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormInputs) => clientLogin(data),
    onSuccess: ({ client }) => {
      console.log(client);
      setClient(client || null);
      toast.success(`Login successful`);
      navigate(from, { replace: true });
    },
    onError: (error) => {
      console.error("Client login error:", error);
      toast.error(error.message);
    },
  });

  const handleValidateClientId = async (data: ClientIdFormInputs) => {
    validateClientIdMutation.mutateAsync(data.clientId);
  };

  const handleLogin = (data: LoginFormInputs) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Client Login</h2>

      {/* Client ID Input */}
      <form
        onSubmit={handleClientSubmit(handleValidateClientId)}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="clientId" className="block mb-1 font-medium">
            Client ID
          </Label>
          <Input
            id="clientId"
            type="text"
            {...registerClient("clientId", {
              required: "Client ID is required",
            })}
            placeholder="Enter your client ID"
            className="w-full"
          />
          {clientErrors.clientId && (
            <p className="text-red-500 text-sm mt-1">
              {clientErrors.clientId.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={validateClientIdMutation.isPending || isClientIdValid}
          className="w-full"
        >
          {validateClientIdMutation.isPending
            ? "Validating..."
            : "Validate Client ID"}
        </Button>
      </form>

      {/* Login Form */}
      {isClientIdValid && (
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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
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
              {showPassword ? (
                <Eye
                  className="absolute w-5 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <EyeOff
                  className="absolute w-5 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
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
        <Link to="/client/forgot-password" className="font-semibold underline">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}
