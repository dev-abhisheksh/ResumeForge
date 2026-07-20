"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
  Copy,
  Check,
  Briefcase,
  AlignLeft,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useResume } from "@/hooks/resume/useResumes";
import { deleteResume } from "@/api/resume.api";
import { notify } from "@/lib/toast";

export interface ResumeItem {
  _id: string;
  title: string;
  fileUrl?: string;
  fileType: "pdf" | "docx" | "latex" | "text";
  extractedText: string;
  jobDescription?: string;
  status?: "processing" | "completed" | "failed";
  createdAt?: string;
  updatedAt?: string;
}

export default function ResumesPage() {
  const { data: rawResumesData, isLoading, refetch } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Safely extract resumes array from API response
  const resumeList: ResumeItem[] = Array.isArray(rawResumesData)
    ? rawResumesData
    : rawResumesData?.data || rawResumesData?.resumes || [];

  const rawCount = resumeList.length;
  const maxAllowed = 3;

  // Toggle expand/collapse card
  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Copy extracted text to clipboard
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    notify.success("Copied to clipboard!", "Extracted text copied.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle resume deletion
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      await deleteResume(id);
      notify.success("Resume deleted", "One raw resume slot is now free.");
      refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete resume.";
      notify.error("Delete failed", msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-5 bg-white font-sans">
      {/* Compact Storage Quota Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-white border-2 border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 border border-red-700 text-white font-black text-xs flex items-center justify-center shrink-0">
            {rawCount}/{maxAllowed}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                My Raw Resumes
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-black bg-red-600 text-white uppercase">
                {rawCount}/{maxAllowed} Used
              </span>
            </div>
            <p className="text-xs font-bold text-slate-600">
              Limit: Max 3 raw master resumes allowed.
            </p>
          </div>
        </div>

        {/* Horizontal Slot Badges */}
        <div className="flex items-center gap-2 shrink-0">
          {[1, 2, 3].map((slotNumber) => {
            const isUsed = slotNumber <= rawCount;
            return (
              <div
                key={slotNumber}
                className={`px-2.5 py-1 border-2 font-black text-xs flex items-center gap-1.5 transition-all ${
                  isUsed
                    ? "bg-red-600 border-red-700 text-white shadow-2xs"
                    : "bg-white border-slate-300 text-slate-400 border-dashed"
                }`}
              >
                <span className="text-[10px] opacity-80">#{slotNumber}</span>
                <span className="text-[11px]">{isUsed ? "USED" : "FREE"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-10 text-center bg-white border-2 border-red-600/30 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-7 h-7 text-red-600 animate-spin" />
          <p className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Loading your resumes...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && rawCount === 0 && (
        <div className="p-8 sm:p-10 text-center bg-white border-2 border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-3">
          <div className="w-12 h-12 bg-red-50 border-2 border-red-600 text-red-600 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">No Raw Resumes Found</h3>
            <p className="text-xs font-bold text-slate-600 max-w-md mx-auto">
              Your uploaded resumes will appear here once saved in the database.
            </p>
          </div>
        </div>
      )}

      {/* Resumes Vertically Aligned List */}
      {!isLoading && rawCount > 0 && (
        <div className="flex flex-col gap-4 w-full">
          {resumeList.map((resume, index) => {
            const isExpanded = expandedId === resume._id;
            const isDeleting = deletingId === resume._id;
            const isCopied = copiedId === resume._id;

            return (
              <div
                key={resume._id || index}
                className={`w-full bg-white border-2 border-red-600 transition-all duration-200 ${
                  isExpanded
                    ? "shadow-[6px_6px_0px_0px_rgba(220,38,38,1)]"
                    : "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(220,38,38,1)]"
                }`}
              >
                {/* Card Top Summary Bar */}
                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100">
                  
                  {/* Left Resume Header Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-red-600 border border-red-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                      #{index + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-black text-slate-900 truncate">
                          {resume.title || `Resume Version ${index + 1}`}
                        </h2>
                        <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-red-50 text-red-700 border border-red-600/40 shrink-0">
                          {resume.fileType || "PDF"}
                        </span>
                        {resume.status && (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-black uppercase border shrink-0 ${
                              resume.status === "completed"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-600"
                                : "bg-amber-50 text-amber-800 border-amber-600"
                            }`}
                          >
                            {resume.status}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                        Uploaded: {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : "Recent"}
                      </p>
                    </div>
                  </div>

                  {/* Right Action Icons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {resume.fileUrl && (
                      <a
                        href={resume.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-white hover:bg-red-50 text-slate-800 hover:text-red-600 border-2 border-slate-300 hover:border-red-600 transition-colors shadow-2xs"
                        title="Download raw file"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDelete(resume._id, resume.title)}
                      className="p-1.5 bg-white hover:bg-red-600 text-slate-800 hover:text-white border-2 border-slate-300 hover:border-red-600 transition-colors shadow-2xs disabled:opacity-50"
                      title="Delete resume"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>

                    <Link
                      href="/analysis"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black border-2 border-red-700 shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze</span>
                    </Link>
                  </div>
                </div>

                {/* Card Bottom Expand / Collapse Toggle Button */}
                <div className="px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-600">
                    {isExpanded ? "Showing Detailed Extracted Content" : "Click expand to view extracted text & job description"}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => toggleExpand(resume._id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-red-50 text-slate-900 hover:text-red-600 text-xs font-black border-2 border-red-600 transition-all shadow-2xs"
                  >
                    <span>{isExpanded ? "Collapse Details" : "Expand Details"}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-red-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-red-600" />
                    )}
                  </button>
                </div>

                {/* EXPANDED SECTION (Remaining Data: Extracted Text & Job Description) */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t-2 border-red-600 bg-white space-y-4 animate-in fade-in duration-200">
                    {/* Target Job Description */}
                    {resume.jobDescription && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-red-600" />
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                            Target Job Description
                          </h4>
                        </div>
                        <div className="p-3 bg-slate-50 border-2 border-slate-300 text-xs font-semibold text-slate-800 leading-relaxed max-h-32 overflow-y-auto">
                          {resume.jobDescription}
                        </div>
                      </div>
                    )}

                    {/* Extracted Text */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlignLeft className="w-4 h-4 text-red-600" />
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                            Extracted Resume Content
                          </h4>
                        </div>

                        {/* Copy Content Button */}
                        {resume.extractedText && (
                          <button
                            type="button"
                            onClick={() => handleCopyText(resume._id, resume.extractedText)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black bg-white hover:bg-red-50 text-slate-800 hover:text-red-600 border border-slate-300 hover:border-red-600 transition-colors"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Scrollable Text Box */}
                      <div className="p-3.5 bg-slate-900 text-slate-100 border-2 border-slate-900 text-xs font-mono leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap select-text">
                        {resume.extractedText || "No text content extracted for this resume."}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}