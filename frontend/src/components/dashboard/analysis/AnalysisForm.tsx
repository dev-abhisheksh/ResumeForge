"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Building,
  Briefcase,
  Loader2,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";

interface AnalysisFormProps {
  resumeList: any[];
  isLoadingResumes: boolean;
  selectedResumeId: string;
  setSelectedResumeId: (id: string) => void;
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  company: string;
  setCompany: (c: string) => void;
  role: string;
  setRole: (r: string) => void;
  isAnalyzing: boolean;
  isFormExpanded: boolean;
  setIsFormExpanded: (val: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AnalysisForm({
  resumeList,
  isLoadingResumes,
  selectedResumeId,
  setSelectedResumeId,
  jobDescription,
  setJobDescription,
  company,
  setCompany,
  role,
  setRole,
  isAnalyzing,
  isFormExpanded,
  setIsFormExpanded,
  onSubmit,
}: AnalysisFormProps) {
  const selectedResumeObj = resumeList.find((r: any) => r._id === selectedResumeId);
  const isValid = selectedResumeId && jobDescription.trim().length >= 10;

  return (
    <div className="w-full bg-white border-2 border-red-600 p-4 sm:p-6 shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] space-y-4">
      {/* Form Header with Expand/Collapse toggle */}
      <div className="flex items-center justify-between gap-3 border-b-2 border-red-600/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-red-600 text-white flex items-center justify-center font-black text-xs">
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            Setup Scan Requirements
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsFormExpanded(!isFormExpanded)}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-red-50 text-slate-900 hover:text-red-600 text-xs font-black border-2 border-red-600 transition-all shadow-2xs cursor-pointer"
        >
          <span>{isFormExpanded ? "Hide Form" : "+ New Scan"}</span>
          {isFormExpanded ? (
            <ChevronUp className="w-4 h-4 text-red-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-red-600" />
          )}
        </button>
      </div>

      {isFormExpanded && (
        <div className="space-y-4 w-full animate-in fade-in duration-200">
          {resumeList.length === 0 && !isLoadingResumes ? (
            <div className="p-5 bg-red-50 border-2 border-red-600 text-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1">
                <h4 className="text-sm font-black">No Master Resumes Found</h4>
                <p className="text-xs font-bold text-slate-700">
                  You need at least one master raw resume uploaded before running an AI analysis.
                </p>
              </div>
              <Link
                href="/resumes"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-black border-2 border-red-700 shadow-2xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Resume First</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4 w-full">
              {/* Field 1: Master Resume Dropdown */}
              <div className="space-y-1.5 w-full">
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                  1. Select Master Resume *
                </label>
                <select
                  required
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 focus:border-red-600 text-slate-900 font-black text-xs sm:text-sm outline-none shadow-2xs"
                >
                  <option value="" disabled>
                    -- Select a Master Resume --
                  </option>
                  {resumeList.map((r: any, idx: number) => (
                    <option key={r._id} value={r._id}>
                      #{idx + 1} - {r.title || `Resume ${idx + 1}`} ({r.fileType?.toUpperCase() || "PDF"})
                    </option>
                  ))}
                </select>
                {selectedResumeObj && (
                  <p className="text-[11px] font-bold text-slate-500">
                    Selected: <span className="text-slate-900 font-extrabold">{selectedResumeObj.title}</span> (Uploaded: {selectedResumeObj.createdAt ? new Date(selectedResumeObj.createdAt).toLocaleDateString() : "Recent"})
                  </p>
                )}
              </div>

              {/* Optional Context: Company & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                    Target Company Name (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Google, Meta, Amazon"
                      className="w-full pl-9 pr-3 py-2 bg-white border-2 border-slate-300 focus:border-red-600 text-slate-900 font-bold text-xs outline-none"
                    />
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                    Target Role Title (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full pl-9 pr-3 py-2 bg-white border-2 border-slate-300 focus:border-red-600 text-slate-900 font-bold text-xs outline-none"
                    />
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Field 2: Target Job Description Textarea */}
              <div className="space-y-1.5 w-full">
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                  2. Paste Target Job Description *
                </label>
                <textarea
                  rows={6}
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job posting requirements, responsibilities, and skills here..."
                  className="w-full p-3.5 bg-slate-50 border-2 border-slate-300 focus:border-red-600 text-slate-900 font-semibold text-xs leading-relaxed outline-none focus:bg-white focus:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] transition-all"
                />
              </div>

              {/* Run Scan Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
                {!isValid ? (
                  <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1.5 border border-amber-300 text-xs font-bold">
                    <span>⚠️ Select a master resume and paste a job description to enable AI scan.</span>
                  </div>
                ) : (
                  <span className="text-xs font-extrabold text-emerald-700">✓ All required fields completed</span>
                )}

                <button
                  type="submit"
                  disabled={isAnalyzing || !isValid}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-xs sm:text-sm font-black border-2 transition-all ${
                    isAnalyzing || !isValid
                      ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed shadow-none opacity-80"
                      : "bg-red-600 hover:bg-red-700 text-white border-red-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      <span>Analyzing Resume with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run AI ATS Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
