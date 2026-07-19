"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useLogin } from "@/hooks/auth/useLogin";
import { notify } from "@/lib/toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const router = useRouter()

  const { mutate, isPending, isError, error } = useLogin();

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { email, password },
      {
        onSuccess: () => {
          notify.success("Login successful!", "Redirecting to your dashboard...");
           router.push("/dashboard");
        },
        onError: (err: unknown) => {
          const errMsg = err instanceof Error ? err.message : "Invalid credentials. Please try again.";
          notify.error("Login failed", errMsg);
        },
      }
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-background px-4 py-4 antialiased">
      {/* Centered Login Card */}
      <div className="w-full max-w-[400px] glass-card border border-[#E5E7EB] rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] p-6 sm:p-8 animate-in fade-in duration-500 max-h-[95vh] flex flex-col justify-center">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-5 text-center">
          <img
            alt="ResumeForge Logo"
            className="h-10 sm:h-12 w-auto mb-2.5"
            src="https://lh3.googleusercontent.com/aida/AP1WRLsLkYmD5nLYrGeFit-ajvjbIZn84WCrqm8uVPCzKxMHOYkJWw3c0mir8hstR_12ZLAvVnEaadmvMJqk-tc3RV94X7o0qZMBEsTg-Zt9L6F83MXUeH5bJtN-OGI2KxLfLZUyE0LvRJXnSXApK6Z05M3eCBE0F8IO2HlGd5KvJigxWUaGyEeaw4ZclUCnafk_4xYJnvnbPvmJcTHveZ47877jv3uyMnn0WRUZ30utxjBCmNuxijYiGeY-4N7N"
          />
          <h1 className="font-display text-xl sm:text-2xl font-bold text-on-surface mb-0.5">
            Welcome back
          </h1>
          <p className="font-body-md text-xs text-outline">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Google Social Login */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2.5 bg-white border border-outline-variant/30 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-on-surface hover:bg-surface-container-low active:scale-[0.98] transition-all cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/30"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white/90 px-3 text-outline text-[11px] font-medium">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmitForm} className="space-y-3.5">
          <div className="space-y-1">
            <label
              className={`text-xs font-semibold transition-colors ${
                emailFocused ? "text-primary" : "text-on-surface"
              }`}
              htmlFor="email"
            >
              Email address
            </label>
            <input
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] border border-outline-variant/30 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all text-xs sm:text-sm outline-none placeholder:text-outline/50 text-on-surface"
              id="email"
              name="email"
              placeholder="name@company.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label
                className={`text-xs font-semibold transition-colors ${
                  passwordFocused ? "text-primary" : "text-on-surface"
                }`}
                htmlFor="password"
              >
                Password
              </label>
              <Link className="text-[11px] font-medium text-primary hover:underline" href="#">
                Forgot password?
              </Link>
            </div>
            <input
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] border border-outline-variant/30 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all text-xs sm:text-sm outline-none placeholder:text-outline/50 text-on-surface"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <input
              className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer"
              id="remember"
              name="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label className="text-xs text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
              Remember me
            </label>
          </div>

          {isError && (
            <div className="p-2.5 rounded-lg bg-error-container text-on-error-container text-xs font-medium border border-error/20">
              {error instanceof Error ? error.message : "Login failed. Please check your credentials."}
            </div>
          )}

          <button
            className="w-full bg-primary-container hover:bg-primary text-white font-semibold text-xs sm:text-sm py-2.5 rounded-xl shadow-md active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Bottom Switch Link */}
        <div className="mt-4 text-center">
          <p className="text-xs text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link className="text-primary font-bold hover:underline" href="/register">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}