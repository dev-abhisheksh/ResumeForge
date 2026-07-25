"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Award,
  Layers,
  FileCode2,
} from "lucide-react";
import { notify } from "@/lib/toast";

interface TailoredLatexModalProps {
  isOpen: boolean;
  onClose: () => void;
  latexCode: string;
  atsScore: number;
  tailoredData?: {
    selectedProjects?: Array<{ title: string }>;
    professionalSummary?: string;
  };
}

export default function TailoredLatexModal({
  isOpen,
  onClose,
  latexCode,
  atsScore,
  tailoredData,
}: TailoredLatexModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    notify.success("Copied to Clipboard!", "LaTeX resume code copied.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOverleafRedirect = () => {
    window.open("https://www.overleaf.com/project", "_blank");
  };

  const selectedProjects = tailoredData?.selectedProjects || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white border-2 border-red-600 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-white border-b-2 border-red-600 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600 border border-red-700 text-white flex items-center justify-center font-black text-xs shadow-2xs">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-black bg-red-600 text-white uppercase tracking-wider">
                  AI Tailored Resume
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Ready-to-Compile LaTeX Code
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight mt-0.5">
                Swapped Vault Projects & Tailored ATS Resume ⚡
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-800 hover:text-white hover:bg-red-600 border-2 border-red-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Top Highlights: ATS Score Gauge & Swapped Projects */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Boosted ATS Score Badge */}
            <div className="p-3.5 bg-emerald-50 border-2 border-emerald-600 flex items-center gap-3 shadow-2xs">
              <div className="w-12 h-12 bg-emerald-600 text-white border border-emerald-700 font-black text-lg flex items-center justify-center shrink-0 shadow-2xs">
                {atsScore}%
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                    Tailored Match
                  </span>
                </div>
                <p className="text-xs font-black text-emerald-950 mt-0.5">
                  Optimized for Target JD
                </p>
              </div>
            </div>

            {/* Swapped Vault Projects Badges */}
            <div className="sm:col-span-2 p-3.5 bg-slate-50 border-2 border-slate-300 flex flex-col justify-center space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-red-600" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
                  Swapped Projects from Vault
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedProjects.length > 0 ? (
                  selectedProjects.map((proj, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs font-black bg-white text-red-700 border border-red-600/40 shadow-2xs"
                    >
                      ✓ {proj.title}
                    </span>
                  ))
                ) : (
                  <span className="text-xs font-bold text-slate-500">
                    Vault projects matched & tailored
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* LaTeX Code Box Container */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileCode2 className="w-4 h-4 text-red-600" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  ATS LaTeX Source Code (.tex)
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                100% Compatible with Overleaf & PDF Compilers
              </span>
            </div>

            <div className="relative border-2 border-slate-900 bg-slate-900 text-slate-100 p-4 rounded-none overflow-hidden font-mono text-xs max-h-96 overflow-y-auto leading-relaxed select-all">
              <pre className="whitespace-pre-wrap break-all">{latexCode}</pre>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 bg-slate-50 border-t-2 border-red-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleOverleafRedirect}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-black border-2 border-slate-900 shadow-2xs transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-slate-700" />
            <span>Open Overleaf Compiler</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-black border-2 border-slate-300 transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black border-2 border-red-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy LaTeX Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
