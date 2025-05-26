import { useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { cn } from "../lib/utils";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define Zod schema for form validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsSubmitting(true);
    setError("");

    try {
      await login(data.email, data.password);
      navigate("/app");
    } catch (err: unknown) {
      setIsSubmitting(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to login");
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
          <h1 className="text-3xl font-bold text-primary">BeeFriends Login</h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
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
              placeholder="you@example.com"
              className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
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
              placeholder="Enter password"
              className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
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
            {isSubmitting ? "Loading..." : "Buzz In"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground text-center">
          New to BeeFriends?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Join the Hive
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
