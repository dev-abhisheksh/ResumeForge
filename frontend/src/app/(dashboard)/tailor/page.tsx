"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  FileCode2,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  Award,
  Layers,
  FileText,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useResume } from "@/hooks/resume/useResumes";
import { useTailorResume } from "@/hooks/resumeAnalysis/useTailorResume";
import { notify } from "@/lib/toast";

export default function TailorResumePage() {
  const searchParams = useSearchParams();
  const paramResumeId = searchParams.get("resumeId") || "";
  const paramJd = searchParams.get("jobDescription") || searchParams.get("jd") || "";

  const { data: rawResumesData, isLoading: isLoadingResumes } = useResume();
  const { isPending: isTailoring, mutate: mutateTailor } = useTailorResume();

  const resumeList = Array.isArray(rawResumesData)
    ? rawResumesData
    : rawResumesData?.data || rawResumesData?.resumes || [];

  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [copied, setCopied] = useState(false);

  // Result state
  const [tailorResult, setTailorResult] = useState<{
    latexCode: string;
    atsScore: number;
    tailoredData?: any;
  } | null>(null);

  useEffect(() => {
    if (paramResumeId) {
      setSelectedResumeId(paramResumeId);
    } else if (resumeList.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumeList[0]._id);
    }

    if (paramJd && !jobDescription) {
      setJobDescription(paramJd);
    }
  }, [paramResumeId, paramJd, resumeList, selectedResumeId]);

  const handleTailorSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedResumeId) {
      notify.error("Select Resume", "Please select a master resume.");
      return;
    }
    if (!jobDescription.trim()) {
      notify.error("Missing Job Description", "Please paste the target Job Description.");
      return;
    }

    mutateTailor(
      { resumeId: selectedResumeId, jobDescription },
      {
        onSuccess: (res) => {
          const resData = res.data;
          setTailorResult({
            latexCode: resData.latexCode,
            atsScore: resData.atsScore || 92,
            tailoredData: resData.tailoredData,
          });
          notify.success("Resume Tailored!", "Swapped vault projects & generated LaTeX code.");

          setTimeout(() => {
            document.getElementById("tailored-result-workspace")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : "Failed to tailor resume";
          notify.error("Tailoring Failed", msg);
        },
      }
    );
  };

  const handleCopy = () => {
    if (!tailorResult?.latexCode) return;
    navigator.clipboard.writeText(tailorResult.latexCode);
    setCopied(true);
    notify.success("Copied!", "LaTeX code copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6 bg-white min-h-screen p-2 sm:p-4 font-sans">
      
      {/* COMING SOON BANNER */}
      <div className="w-full bg-amber-50 border-2 border-amber-600 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(217,119,6,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 text-white font-black text-lg flex items-center justify-center border-2 border-amber-600 shrink-0">
            🚧
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-black bg-amber-600 text-white uppercase tracking-wider">
                Coming Soon
              </span>
              <span className="text-xs font-extrabold text-amber-900">
                Under Active Enhancement
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
              AI LaTeX Tailoring Engine Upgrades in Progress
            </h3>
            <p className="text-xs font-bold text-slate-600 mt-0.5">
              We are enhancing project swapping accuracy & zero-mutation ATS formatting. Stay tuned!
            </p>
          </div>
        </div>
      </div>

      {/* 1. HEADER BANNER */}
      <div className="w-full bg-white border-2 border-red-600 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-3 opacity-60 pointer-events-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-red-600 border border-red-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 text-[10px] font-black bg-red-600 text-white uppercase tracking-wider whitespace-nowrap">
                AI Tailor Engine
              </span>
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                Zero-Hallucination Project Swapper
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">
              Tailor Resume for Target Job ⚡
            </h1>
          </div>
        </div>
        <p className="text-xs font-bold text-slate-600">
          Paste a target Job Description. Groq AI will select matching projects from your Vault, rephrase bullets using Google's X-Y-Z formula, and export ready-to-compile LaTeX code!
        </p>
      </div>

      {/* 2. TAILOR SETUP FORM */}
      <div className="w-full bg-white border-2 border-red-600 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-4">
        <form onSubmit={handleTailorSubmit} className="space-y-4 w-full">
          
          {/* Select Master Resume Dropdown */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
              Select Master Resume *
            </label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 focus:border-red-600 text-slate-900 font-bold text-xs sm:text-sm outline-none transition-all cursor-pointer"
            >
              {isLoadingResumes ? (
                <option value="">Loading master resumes...</option>
              ) : resumeList.length === 0 ? (
                <option value="">No master resumes uploaded yet</option>
              ) : (
                resumeList.map((res: any) => (
                  <option key={res._id} value={res._id}>
                    📄 {res.title || "Master Resume"} ({res.fileType?.toUpperCase() || "PDF"})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Job Description Textarea */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
              Target Job Description *
            </label>
            <textarea
              rows={5}
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target Job Description text here (e.g. Required skills: Node.js, Express, Redis, Microservices, BullMQ...)"
              className="w-full p-3.5 bg-slate-900 text-slate-100 font-mono text-xs border-2 border-slate-900 focus:border-red-600 outline-none leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isTailoring || !selectedResumeId || !jobDescription.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black border-2 border-red-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isTailoring ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Swapping Projects & Tailoring...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Tailored ATS Resume (LaTeX)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. TAILORED RESULT WORKSPACE */}
      {tailorResult && (
        <div
          id="tailored-result-workspace"
          className="w-full bg-white border-2 border-red-600 p-4 sm:p-5 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] space-y-5 animate-in fade-in duration-300"
        >
          {/* Header Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b-2 border-red-600/20 pb-4">
            
            {/* Score Badge */}
            <div className="p-3.5 bg-emerald-50 border-2 border-emerald-600 flex items-center gap-3 shadow-2xs">
              <div className="w-12 h-12 bg-emerald-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-2xs">
                {tailorResult.atsScore}%
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                    ATS Score
                  </span>
                </div>
                <p className="text-xs font-black text-emerald-950 mt-0.5">
                  Optimized for Target JD
                </p>
              </div>
            </div>

            {/* Swapped Projects Badges */}
            <div className="sm:col-span-2 p-3.5 bg-slate-50 border-2 border-slate-300 flex flex-col justify-center space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-red-600" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
                  Swapped Projects from Vault
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {tailorResult.tailoredData?.selectedProjects?.map((proj: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-black bg-white text-red-700 border border-red-600/40 shadow-2xs"
                  >
                    ✓ {proj.title}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* LaTeX Code Box Container */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <FileCode2 className="w-4 h-4 text-red-600" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  ATS LaTeX Source Code (.tex)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.open("https://www.overleaf.com/project", "_blank")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-black border-2 border-slate-900 shadow-2xs transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Overleaf</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black border-2 border-red-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy LaTeX Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="relative border-2 border-slate-900 bg-slate-900 text-slate-100 p-4 rounded-none overflow-hidden font-mono text-xs max-h-[500px] overflow-y-auto leading-relaxed select-all">
              <pre className="whitespace-pre-wrap break-all">{tailorResult.latexCode}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
