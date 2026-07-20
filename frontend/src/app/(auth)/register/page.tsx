"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileCheck, ArrowRight, User, Lock, Mail } from "lucide-react";
import { useRegister } from "@/hooks/auth/useRegister";
import { notify } from "@/lib/toast";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          const errMsg =
            err instanceof Error
              ? err.message
              : "Failed to create account. Please try again.";
          notify.error("Registration failed", errMsg);
        },
      }
    );
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 overflow-y-auto antialiased">
      {/* Brand Top Header */}
      <div className="mb-4 sm:mb-6 flex items-center justify-center gap-2">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-600 border-2 border-red-700 flex items-center justify-center text-white shrink-0">
          <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight leading-none">
            Resume<span className="text-red-600">Forge</span>
          </span>
          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-black bg-red-600 text-white border border-red-700">
            PRO
          </span>
        </div>
      </div>

      {/* Responsive Main Register Card */}
      <div className="w-full max-w-[420px] bg-white border-2 border-red-600 p-4 sm:p-8 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] sm:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] my-auto transition-all">
        
        {/* Card Title & Subtitle */}
        <div className="text-center mb-4 sm:mb-5 space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Create account
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            Get started with your AI resume builder
          </p>
        </div>

        {/* Google Social Register Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2.5 bg-white border-2 border-slate-300 hover:border-red-600 text-slate-900 font-extrabold text-xs sm:text-sm h-10 sm:h-11 px-4 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span className="truncate">Sign up with Google</span>
        </button>

        {/* Geometric Divider */}
        <div className="relative my-3.5 sm:my-4">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-red-600/30"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 sm:px-3 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] sm:text-[11px]">
              Or register with email
            </span>
          </div>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmitForm} className="space-y-3 sm:space-y-3.5">
          <div className="space-y-1">
            <label className="block text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wider" htmlFor="fullName">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 h-10 sm:h-11 bg-white border-2 border-slate-300 focus:border-red-600 text-slate-900 font-bold text-xs sm:text-sm outline-none placeholder:text-slate-400 focus:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wider" htmlFor="email">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 h-10 sm:h-11 bg-white border-2 border-slate-300 focus:border-red-600 text-slate-900 font-bold text-xs sm:text-sm outline-none placeholder:text-slate-400 focus:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 h-10 sm:h-11 bg-white border-2 border-slate-300 focus:border-red-600 text-slate-900 font-bold text-xs sm:text-sm outline-none placeholder:text-slate-400 focus:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] transition-all"
              />
            </div>
          </div>

          {isError && (
            <div className="p-2.5 sm:p-3 bg-red-50 border-2 border-red-600 text-red-700 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]">
              {error instanceof Error ? error.message : "Registration failed. Please try again."}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm h-11 sm:h-12 border-2 border-red-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-1 sm:mt-2"
          >
            <span>{isPending ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Bottom Redirect Link */}
        <div className="mt-4 sm:mt-5 text-center border-t-2 border-slate-200 pt-3 sm:pt-4">
          <p className="text-xs font-bold text-slate-600">
            Already have an account?{" "}
            <Link className="text-red-600 font-black hover:underline" href="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}