"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function AnalysisLoadingCard() {
  return (
    <div className="w-full bg-white border-2 border-red-600 p-8 text-center shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center shadow-2xs">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-900">
          AI Scanner is Evaluating Your Master Resume...
        </h3>
        <p className="text-xs font-bold text-slate-500 max-w-md mx-auto">
          Extracting skills, comparing keywords against ATS algorithms, and calculating match ratings.
        </p>
      </div>
    </div>
  );
}
