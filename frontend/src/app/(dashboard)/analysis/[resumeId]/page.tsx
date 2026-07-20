"use client";

import { useParams } from "next/navigation";
import React from "react";

const AnalyzeWithAi = () => {
  const params = useParams();
  const resumeId = params.resumeId as string;

  console.log("Current Resume ID:", resumeId);

  return (
    <div className="p-6 bg-white border-2 border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
      <h1 className="text-xl font-black text-slate-900">
        AI Analysis for Resume ID: <span className="text-red-600 font-mono">{resumeId}</span>
      </h1>
    </div>
  );
};

export default AnalyzeWithAi;