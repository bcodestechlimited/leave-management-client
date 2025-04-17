import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { employeeSignIn } from "@/api/employee.api";
import { useEmployeeActions } from "@/store/useEmployeeStore";
import { Employee } from "@/types/employee.types";

interface SignInFormInputs {
  email: string;
  password: string;
}

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const { setAuthEmployee } = useEmployeeActions();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>();

  const { mutate, isPending } = useMutation({
    mutationFn: employeeSignIn,
    onSuccess: (data) => {
      setAuthEmployee(data.data.employee as Employee);
      toast.success("Login successful!");
      navigate("/dashboard/employee");
    },
    onError: (error) => {
      toast.error(error.message || "Login failed.");
    },
  });

  const onSubmit: SubmitHandler<SignInFormInputs> = (data) => {
    mutate(data);
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-center mb-4"> Sign In</h1>
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
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 5,
                  message: "Password must be at least 5 characters long",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Logging in..." : "Login"}
          </Button>
          <div className="py-4 text-end">
            <Link to="/forgot-password" className="font-semibold underline">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
