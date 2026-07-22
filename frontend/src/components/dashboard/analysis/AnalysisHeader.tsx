"use client";

import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function AnalysisHeader() {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white border-2 border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[10px] font-black bg-red-600 text-white uppercase tracking-wider">
            AI Powered
          </span>
          <span className="text-xs font-bold text-slate-600">
            ATS Resume Optimization Engine
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Resume AI Analysis & ATS Match
        </h1>
        <p className="text-xs font-bold text-slate-600 max-w-2xl">
          Select one of your raw master resumes, paste the target job description, and get instant keyword gaps, ATS scores, and AI recommendations.
        </p>
      </div>

      <Link
        href="/resumes"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-red-50 text-slate-900 hover:text-red-600 text-xs font-black border-2 border-red-600 transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
      >
        <FileText className="w-4 h-4 text-red-600" />
        <span>Manage Master Resumes</span>
      </Link>
    </div>
  );
}
