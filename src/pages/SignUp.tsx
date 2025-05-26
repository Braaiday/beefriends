import { useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { cn } from "../lib/utils";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define Zod schema including password confirmation validation
const signUpSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Infer the TypeScript type from the schema
type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      await signup(data.email, data.password, data.username);
      navigate("/login");
    } catch (err: unknown) {
      setIsSubmitting(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create account");
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Icon
            icon="noto-v1:honeybee"
            className="text-primary"
            width={32}
            height={32}
          />
          <h1 className="text-3xl font-bold text-primary">BeeFriends Signup</h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor="username"
              className="block mb-1 font-semibold text-foreground"
            >
              Username
            </label>
            <input
              id="username"
              {...register("username")}
              className={`w-full rounded-md border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.username ? "border-red-500" : "border-border"
              }`}
              placeholder="Your bee name"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-semibold text-foreground"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full rounded-md border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.email ? "border-red-500" : "border-border"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 font-semibold text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full rounded-md border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.password ? "border-red-500" : "border-border"
              }`}
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-1 font-semibold text-foreground"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className={`w-full rounded-md border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.confirmPassword ? "border-red-500" : "border-border"
              }`}
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            disabled={isSubmitting}
            type="submit"
            className={cn(
              "cosmic-button w-full flex items-center justify-center gap-2",
              isSubmitting ? "cursor-not-allowed opacity-70" : ""
            )}
          >
            {isSubmitting && (
              <svg
                className="w-5 h-5 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {isSubmitting ? "Loading..." : "Join the Hive"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground text-center">
          Already buzzing here?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Go{" "}
          <Link to="/" className="text-primary hover:underline">
            Home
          </Link>
        </p>
      </div>
    </section>
  );
};
