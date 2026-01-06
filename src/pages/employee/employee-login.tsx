import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/api/auth.api";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { CustomAlert } from "@/components/custom-alert";

interface SignInFormInputs {
  email: string;
  password: string;
}

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard/employee";

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignInFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authService.employeeLogin,
    onSuccess: () => {
      toast.success("Login successful!");
      navigate(from, { replace: true });
    },
    onError: (error: any) => {
      // toast.error(error.message || "Login failed.");
      setError(error.message || "Login failed.");
    },
  });

  const onSubmit = (data: SignInFormInputs) => {
    setError(null);
    mutate(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h1 className="text-xl font-bold text-center mb-4">Sign In</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 5,
                message: "Password must be at least 5 characters long",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <CustomAlert variant="error" title={error} />}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Logging in..." : "Login"}
          </Button>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold underline"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
