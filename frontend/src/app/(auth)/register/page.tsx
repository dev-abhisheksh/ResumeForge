"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/auth/useRegister";
import { notify } from "@/lib/toast";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { mutate, isError, isPending, error } = useRegister();
  const router = useRouter();

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { fullName, email, password },
      {
        onSuccess: () => {
          notify.success("Registration successful!", "Redirecting to your dashboard...");
          router.push("/dashboard");
        },
        onError: (err: unknown) => {
          const errMsg = err instanceof Error ? err.message : "Failed to create account. Please try again.";
          notify.error("Registration failed", errMsg);
        },
      }
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-background px-4 py-4 antialiased">
      {/* Centered Register Card */}
      <div className="w-full max-w-[400px] glass-card border border-[#E5E7EB] rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] p-6 sm:p-8 animate-in fade-in duration-500 max-h-[95vh] flex flex-col justify-center">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-4 text-center">
          <img
            alt="ResumeForge Logo"
            className="h-10 sm:h-12 w-auto mb-2"
            src="https://lh3.googleusercontent.com/aida/AP1WRLsLkYmD5nLYrGeFit-ajvjbIZn84WCrqm8uVPCzKxMHOYkJWw3c0mir8hstR_12ZLAvVnEaadmvMJqk-tc3RV94X7o0qZMBEsTg-Zt9L6F83MXUeH5bJtN-OGI2KxLfLZUyE0LvRJXnSXApK6Z05M3eCBE0F8IO2HlGd5KvJigxWUaGyEeaw4ZclUCnafk_4xYJnvnbPvmJcTHveZ47877jv3uyMnn0WRUZ30utxjBCmNuxijYiGeY-4N7N"
          />
          <h1 className="font-display text-xl sm:text-2xl font-bold text-on-surface mb-0.5">
            Create your account
          </h1>
          <p className="font-body-md text-xs text-outline">
            Get started with your AI resume builder
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
          <span>Sign up with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-3.5">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/30"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white/90 px-3 text-outline text-[11px] font-medium">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmitForm} className="space-y-3">
          <div className="space-y-1">
            <label
              className={`text-xs font-semibold transition-colors ${
                nameFocused ? "text-primary" : "text-on-surface"
              }`}
              htmlFor="fullName"
            >
              Full Name
            </label>
            <input
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAFAFA] border border-outline-variant/30 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all text-xs sm:text-sm outline-none placeholder:text-outline/50 text-on-surface"
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              required
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
            />
          </div>

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
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAFAFA] border border-outline-variant/30 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all text-xs sm:text-sm outline-none placeholder:text-outline/50 text-on-surface"
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
            <label
              className={`text-xs font-semibold transition-colors ${
                passwordFocused ? "text-primary" : "text-on-surface"
              }`}
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAFAFA] border border-outline-variant/30 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all text-xs sm:text-sm outline-none placeholder:text-outline/50 text-on-surface"
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

          {isError && (
            <div className="p-2.5 rounded-lg bg-error-container text-on-error-container text-xs font-medium border border-error/20">
              {error instanceof Error ? error.message : "Registration failed. Please try again."}
            </div>
          )}

          <button
            className="w-full bg-primary-container hover:bg-primary text-white font-semibold text-xs sm:text-sm py-2.5 rounded-xl shadow-md active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Bottom Switch Link */}
        <div className="mt-3.5 text-center">
          <p className="text-xs text-on-surface-variant">
            Already have an account?{" "}
            <Link className="text-primary font-bold hover:underline" href="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}