import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { employeeSignIn } from "@/api/employee.api";
import { useEmployeeActions } from "@/store/useEmployeeStore";
import { Employee } from "@/types/employee.types";
import { adminLoginAsEmployee } from "@/api/admin.api";

interface SignInFormInputs {
  email: string;
  password: string;
  employeeEmail: string;
}

export default function AdminLoginAsEmployee() {
  const navigate = useNavigate();
  const { setAuthEmployee } = useEmployeeActions();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard/employee";

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormInputs>({
    defaultValues: {
      email: "",
      employeeEmail: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: adminLoginAsEmployee,
    onSuccess: (data) => {
      setAuthEmployee(data.data.employee as Employee);
      toast.success("Login successful!");
      navigate(from, { replace: true });
    },
    onError: (error: any) => {
      toast.error(error.message || "Login failed.");
    },
  });

  const onSubmit = (values: SignInFormInputs) => {
    mutate(values);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h1 className="text-xl font-bold text-center mb-4">Sign In</h1>

      <div className="text-start">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Admin Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your admin email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Employee Email */}
            <FormField
              control={form.control}
              name="employeeEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter employee email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Logging in..." : "Login"}
            </Button>

            {/* <div className="py-4 text-end">
            <Link to="/forgot-password" className="font-semibold underline">
              Forgot Password?
            </Link>
          </div> */}
          </form>
        </Form>
      </div>
    </div>
  );
}
