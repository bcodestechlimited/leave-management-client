import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"; // Adjust based on your shadcn setup
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/api/auth.api";
import { IAdminUser } from "@/interfaces/user.interface";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const navigate = useNavigate();

  // const onSubmit = async (data: LoginFormInputs) => {
  //   console.log("Login Data:", data);
  //   await loginAdmin(data, () => {
  //     navigate("/dashboard/admin");
  //   });
  //   // Perform login action (e.g., API call)
  // };

  const mutation = useMutation({
    mutationFn: authService.adminSignIn,
    onSuccess: (user: IAdminUser) => {
      // console.log({ user });

      // Admin
      navigate("/dashboard/admin");
    },
    onError: (error: any) => {
      // toast.error(error.message || "Something went wrong");
      // setError(error.message || "Something went wrong");
      console.log(error);
    },
  });

  /** ---- Submit Handler ---- */
  const onSubmit = (data: LoginFormInputs) => {
    // setError(null);

    mutation.mutateAsync(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <Label htmlFor="email" className="block mb-1 font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email address",
              },
            })}
            placeholder="Enter your email"
            className={`w-full ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <Label htmlFor="password" className="block mb-1 font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 5,
                  message: "Password must be at least 5 characters long",
                },
              })}
              placeholder="Enter your password"
              className={`w-full ${errors.password ? "border-red-500" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
