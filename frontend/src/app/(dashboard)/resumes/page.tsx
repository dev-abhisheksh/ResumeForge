"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import Link from "next/link";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
  Copy,
  Check,
  AlignLeft,
  Sparkles,
  Loader2,
  UploadCloud,
  File,
  X,
  Plus,
  Code,
} from "lucide-react";
import { useResume } from "@/hooks/resume/useResumes";
import { deleteResume, uploadMaterial } from "@/api/resume.api";
import { notify } from "@/lib/toast";

export interface ResumeItem {
  _id: string;
  title: string;
  fileUrl?: string;
  fileType: "pdf" | "docx" | "latex" | "text";
  extractedText?: string;
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

  // Upload Mode: "file" or "text"
  const [uploadMode, setUploadMode] = useState<"file" | "text">("file");
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Safely extract resumes array from API response
  const resumeList: ResumeItem[] = Array.isArray(rawResumesData)
    ? rawResumesData
    : rawResumesData?.data || rawResumesData?.resumes || [];

  const rawCount = resumeList.length;
  const maxAllowed = 3;
  const isQuotaFull = rawCount >= maxAllowed;

  // Toggle expand/collapse card
  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Copy text to clipboard
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    notify.success("Copied to clipboard!", "Content copied successfully.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle resume deletion
  const handleDelete = async (id: string, resumeTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${resumeTitle}"?`)) return;

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

  // Drag & Drop Handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isQuotaFull) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isQuotaFull) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/x-tex",
    ];

    if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".tex")) {
      notify.error("Invalid file format", "Please upload a PDF, DOCX, TXT, or TeX file.");
      return;
    }

    setFile(selectedFile);
    if (!title) {
      const nameWithoutExt = selectedFile.name.substring(0, selectedFile.name.lastIndexOf(".")) || selectedFile.name;
      setTitle(nameWithoutExt);
    }
  };

  // Handle Form Submission
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isQuotaFull) {
      notify.error("Quota Exceeded", "You can only store up to 3 raw resumes.");
      return;
    }
    if (!title.trim()) {
      notify.error("Missing Title", "Please enter a resume title.");
      return;
    }
    if (uploadMode === "file" && !file) {
      notify.error("Missing File", "Please select or drop a resume file.");
      return;
    }
    if (uploadMode === "text" && !rawText.trim()) {
      notify.error("Missing Content", "Please enter resume text or LaTeX code.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("jobDescription", "General Master Resume");

      if (uploadMode === "file" && file) {
        formData.append("resume", file);
      } else if (uploadMode === "text") {
        formData.append("text", rawText);
      }

      await uploadMaterial(formData);
      notify.success("Upload successful!", "Resume processed and saved.");

      // Reset Form State
      setTitle("");
      setRawText("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload resume.";
      notify.error("Upload failed", msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full space-y-6 bg-white min-h-screen p-2 sm:p-4">
      {/* Top Storage Quota Meter Box */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-white border-2 border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
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

        {/* Compact Horizontal Slot Badges */}
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

      {/* TOP UPLOAD RESUME CARD (File or Text/LaTeX Upload) */}
      <div className="w-full bg-white border-2 border-red-600 p-4 sm:p-6 shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-red-600/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 text-white flex items-center justify-center font-black text-xs">
              <UploadCloud className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Upload New Raw Resume
            </h2>
          </div>

          {/* Upload Mode Selector (File vs Text/LaTeX) */}
          <div className="flex items-center gap-1 border-2 border-red-600 p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setUploadMode("file")}
              className={`px-3 py-1 text-xs font-black transition-all flex items-center gap-1.5 ${
                uploadMode === "file"
                  ? "bg-red-600 text-white shadow-2xs"
                  : "text-slate-700 hover:text-red-600"
              }`}
            >
              <File className="w-3.5 h-3.5" />
              <span>File Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("text")}
              className={`px-3 py-1 text-xs font-black transition-all flex items-center gap-1.5 ${
                uploadMode === "text"
                  ? "bg-red-600 text-white shadow-2xs"
                  : "text-slate-700 hover:text-red-600"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Text / LaTeX Code</span>
            </button>
          </div>
        </div>

        {isQuotaFull ? (
          <div className="w-full p-4 bg-red-50 border-2 border-red-600 text-red-900 text-xs font-bold shadow-2xs">
            ⚠️ Storage Quota Reached (3/3). Delete an existing raw resume below to upload a new one.
          </div>
        ) : (
          <form onSubmit={handleUploadSubmit} className="space-y-4 w-full">
            {/* Resume Title Input */}
            <div className="space-y-1 w-full">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                Resume Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer 2026"
                className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 focus:border-red-600 text-slate-900 font-bold text-xs sm:text-sm outline-none placeholder:text-slate-400 focus:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] transition-all"
              />
            </div>

            {/* Mode 1: Drag & Drop File Upload */}
            {uploadMode === "file" && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full p-6 sm:p-8 border-2 border-dashed text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-red-600 bg-red-50/80 scale-[1.01]"
                    : file
                    ? "border-emerald-600 bg-emerald-50/50"
                    : "border-slate-300 hover:border-red-600 bg-slate-50/50 hover:bg-red-50/30"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.tex"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <File className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs sm:text-sm font-black text-slate-900 truncate max-w-xs sm:max-w-md">
                        {file.name}
                      </p>
                      <p className="text-[11px] font-bold text-emerald-700">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="p-1 bg-white border border-slate-300 hover:bg-red-600 hover:text-white transition-colors ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-white border-2 border-red-600 text-red-600 mx-auto flex items-center justify-center shadow-2xs">
                      <UploadCloud className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-black text-slate-900">
                        Drag & Drop your resume file here, or{" "}
                        <span className="text-red-600 underline">Browse File</span>
                      </p>
                      <p className="text-[11px] font-bold text-slate-500 mt-1">
                        Supports PDF, DOCX, TXT, and LaTeX (.tex) files
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Raw Text / LaTeX Code Area */}
            {uploadMode === "text" && (
              <div className="space-y-1 w-full">
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                  Raw Text / LaTeX Code *
                </label>
                <textarea
                  rows={6}
                  required
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste your plain text resume content or raw \documentclass{article} LaTeX code here..."
                  className="w-full p-3.5 bg-slate-900 text-slate-100 font-mono text-xs border-2 border-slate-900 focus:border-red-600 outline-none leading-relaxed"
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end w-full">
              <button
                type="submit"
                disabled={isUploading || (uploadMode === "file" && !file) || (uploadMode === "text" && !rawText.trim())}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black border-2 border-red-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing & Saving...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Upload Raw Resume</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="w-full p-12 text-center bg-white border-2 border-red-600/30 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          <p className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Loading your resumes...
          </p>
        </div>
      )}

      {/* Empty State Banner (Horizontal Row Layout) */}
      {!isLoading && rawCount === 0 && (
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-start gap-4 p-4 sm:p-5 bg-red-50/40 border-2 border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
          <div className="w-10 h-10 bg-red-600 border border-red-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-1 gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                No Raw Resumes Found
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                Use the upload form above to add your first master raw resume (up to 3 allowed).
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-black bg-white border border-red-600 text-red-600 shrink-0 self-start sm:self-auto shadow-2xs">
              0 / 3 Used
            </span>
          </div>
        </div>
      )}

      {/* Resumes Vertically Aligned List */}
      {!isLoading && rawCount > 0 && (
        <div className="flex flex-col gap-5 w-full">
          {resumeList.map((resume, index) => {
            const isExpanded = expandedId === resume._id;
            const isDeleting = deletingId === resume._id;
            const isCopied = copiedId === resume._id;
            const textContent = resume.extractedText || resume.jobDescription || "";

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
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-100">
                  
                  {/* Left Resume Header Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-red-600 border border-red-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                      #{index + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">
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
                    {/* File Download Link */}
                    {resume.fileUrl && (
                      <a
                        href={resume.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white hover:bg-red-50 text-slate-800 hover:text-red-600 border-2 border-slate-300 hover:border-red-600 transition-colors shadow-2xs"
                        title="Download raw file"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}

                    {/* Delete Button */}
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDelete(resume._id, resume.title)}
                      className="p-2 bg-white hover:bg-red-600 text-slate-800 hover:text-white border-2 border-slate-300 hover:border-red-600 transition-colors shadow-2xs disabled:opacity-50"
                      title="Delete resume to free up slot"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Analyze CTA Link */}
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
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-600">
                    {isExpanded ? "Showing Detailed Extracted Content" : "Click expand to view extracted text content"}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => toggleExpand(resume._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-red-50 text-slate-900 hover:text-red-600 text-xs font-black border-2 border-red-600 transition-all shadow-2xs"
                  >
                    <span>{isExpanded ? "Collapse Details" : "Expand Details"}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-red-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-red-600" />
                    )}
                  </button>
                </div>

                {/* EXPANDED SECTION (Extracted Content) */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t-2 border-red-600 bg-white space-y-4 animate-in fade-in duration-200">
                    {/* Extracted Text */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlignLeft className="w-4 h-4 text-red-600" />
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                            Extracted Resume Content / Code
                          </h4>
                        </div>

                        {/* Copy Content Button */}
                        {textContent && (
                          <button
                            type="button"
                            onClick={() => handleCopyText(resume._id, textContent)}
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
                        {textContent || "No text content extracted for this resume."}
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