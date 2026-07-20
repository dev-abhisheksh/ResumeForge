"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  Briefcase,
  Building,
  Target,
  CheckCircle2,
  XCircle,
  BarChart3,
  Loader2,
  Clock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  Plus,
} from "lucide-react";
import { useResume } from "@/hooks/resume/useResumes";
import { analyzeWithAi, getRecentAnalyses } from "@/api/resumeAnalysis.api";
import { notify } from "@/lib/toast";

export interface AnalysisWorkspaceProps {
  preselectedResumeId?: string;
}

export interface AnalysisResultData {
  _id?: string;
  atsScore?: number;
  overallScore?: number;
  keywordScore?: number;
  skillsScore?: number;
  experienceScore?: number;
  educationScore?: number;
  projectScore?: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  suggestions?: string[];
  experienceReasoning?: string;
  projectReasoning?: string;
  recommendations?: string[];
  guide?: string;
  jobDescription?: string;
  company?: string;
  role?: string;
  createdAt?: string;
  resume?: any;
  result?: any;
  [key: string]: any;
}

export default function AnalysisWorkspace({
  preselectedResumeId,
}: AnalysisWorkspaceProps) {
  const { data: rawResumesData, isLoading: isLoadingResumes } = useResume();

  // Form Collapsible State
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(true);

  // Form State
  const [selectedResumeId, setSelectedResumeId] = useState<string>(
    preselectedResumeId || ""
  );
  const [jobDescription, setJobDescription] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  // Analysis & History State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultData | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResultData[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);

  // Safely extract resumes array
  const resumeList = Array.isArray(rawResumesData)
    ? rawResumesData
    : rawResumesData?.data || rawResumesData?.resumes || [];

  // Sync preselectedId if available
  useEffect(() => {
    if (preselectedResumeId) {
      setSelectedResumeId(preselectedResumeId);
    } else if (resumeList.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumeList[0]._id);
    }
  }, [preselectedResumeId, resumeList]);

  // Fetch top 5 recent analyses
  const fetchRecent = async () => {
    setIsLoadingRecent(true);
    try {
      const response = await getRecentAnalyses();
      const list = response.data?.analyses || response.data?.data || response.data || [];
      if (Array.isArray(list)) {
        setRecentAnalyses(list.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to fetch recent analyses:", err);
    } finally {
      setIsLoadingRecent(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  // Handle Form Submission
  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedResumeId) {
      notify.error("Select Resume", "Please select a master raw resume.");
      return;
    }
    if (!jobDescription.trim()) {
      notify.error("Missing Job Description", "Please paste the target job description.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await analyzeWithAi({
        data: {
          jobDescription,
          company,
          role,
        },
        resumeId: selectedResumeId,
      });

      const resData = response.data?.result || response.data?.data || response.data;
      setAnalysisResult(resData);
      notify.success("Analysis Complete!", "AI ATS feedback generated successfully.");
      
      // Auto collapse form after successful scan to save vertical screen space
      setIsFormExpanded(false);
      fetchRecent();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to run AI analysis.";
      notify.error("Analysis Failed", msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load a recent scan from history into active result view
  const handleLoadRecentItem = (item: AnalysisResultData) => {
    setAnalysisResult(item);
    if (item.resume?._id || item.resume) {
      setSelectedResumeId(item.resume?._id || item.resume);
    }
    if (item.jobDescription) setJobDescription(item.jobDescription);
    if (item.company) setCompany(item.company);
    if (item.role) setRole(item.role);

    // Auto collapse setup form to prioritize full screen report view
    setIsFormExpanded(false);
    notify.info("Scan Loaded", "Displaying historical AI analysis report.");
  };

  const selectedResumeObj = resumeList.find((r: any) => r._id === selectedResumeId);

  // Extract score parameters safely across both live AI scan & stored MongoDB documents
  const atsScore =
    analysisResult?.atsScore ??
    analysisResult?.overallScore ??
    analysisResult?.result?.atsScore ??
    analysisResult?.result?.overallScore ??
    85;

  const keywordScore =
    analysisResult?.keywordScore ??
    analysisResult?.result?.keywordScore ??
    80;

  const skillsScore =
    analysisResult?.skillsScore ??
    analysisResult?.result?.skillsScore ??
    85;

  const experienceScore =
    analysisResult?.experienceScore ??
    analysisResult?.result?.experienceScore ??
    75;

  const educationScore =
    analysisResult?.educationScore ??
    analysisResult?.result?.educationScore ??
    90;

  const matchedKeywords =
    analysisResult?.matchedKeywords ||
    analysisResult?.result?.matchedKeywords ||
    [];

  const missingKeywords =
    analysisResult?.missingKeywords ||
    analysisResult?.result?.missingKeywords ||
    [];

  const suggestions =
    analysisResult?.suggestions ||
    analysisResult?.recommendations ||
    analysisResult?.result?.suggestions ||
    analysisResult?.result?.recommendations ||
    [];

  return (
    <div className="w-full space-y-6 bg-white min-h-screen p-2 sm:p-4 font-sans">
      {/* Top Header Box */}
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

      {/* Main Analysis Form Setup Card (COLLAPSIBLE / EXPANDABLE) */}
      <div className="w-full bg-white border-2 border-red-600 p-4 sm:p-6 shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] space-y-4">
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
              <form onSubmit={handleRunAnalysis} className="space-y-4 w-full">
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
                  {(!selectedResumeId || !jobDescription.trim() || jobDescription.trim().length < 10) ? (
                    <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1.5 border border-amber-300 text-xs font-bold">
                      <span>⚠️ Select a master resume and paste a job description to enable AI scan.</span>
                    </div>
                  ) : (
                    <span className="text-xs font-extrabold text-emerald-700">✓ All required fields completed</span>
                  )}

                  <button
                    type="submit"
                    disabled={isAnalyzing || !selectedResumeId || !jobDescription.trim() || jobDescription.trim().length < 10}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-xs sm:text-sm font-black border-2 transition-all ${
                      isAnalyzing || !selectedResumeId || !jobDescription.trim() || jobDescription.trim().length < 10
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

      {/* RECENT ANALYSES SECTION (Top 5 Scans) */}
      <div className="w-full bg-white border-2 border-red-600 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-red-600/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 text-white flex items-center justify-center font-black text-xs">
              <Clock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="text-base font-black text-slate-900">
              Recent AI Scans (Top 5)
            </h2>
          </div>

          <span className="text-xs font-bold text-slate-500">
            {recentAnalyses.length} / 5 Recent Scans Saved
          </span>
        </div>

        {isLoadingRecent ? (
          <div className="p-6 text-center text-xs font-bold text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
            <span>Loading recent scan history...</span>
          </div>
        ) : recentAnalyses.length === 0 ? (
          <p className="text-xs font-bold text-slate-500 p-3 bg-slate-50 border border-slate-200">
            No previous AI scans found. Run your first analysis above!
          </p>
        ) : (
          <div className="flex flex-col gap-2.5 w-full">
            {recentAnalyses.map((item, idx) => {
              const itemScore = item.atsScore ?? item.overallScore ?? 80;
              const resObj = item.resume;

              return (
                <div
                  key={item._id || idx}
                  className="p-3 bg-white border-2 border-slate-200 hover:border-red-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Score Badge */}
                    <div
                      className={`w-9 h-9 font-black text-xs flex items-center justify-center shrink-0 border ${
                        itemScore >= 80
                          ? "bg-emerald-600 text-white border-emerald-700"
                          : itemScore >= 65
                          ? "bg-amber-500 text-white border-amber-600"
                          : "bg-red-600 text-white border-red-700"
                      }`}
                    >
                      {itemScore}%
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-900 truncate">
                          {resObj?.title || `Master Resume ${idx + 1}`}
                        </h4>
                        {item.company && (
                          <span className="px-1.5 py-0.5 text-[9px] font-black uppercase bg-red-50 text-red-700 border border-red-600/30">
                            {item.company}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 truncate mt-0.5">
                        {item.role ? `Role: ${item.role} • ` : ""}
                        Scanned: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLoadRecentItem(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-red-600 text-slate-800 hover:text-white text-xs font-black border-2 border-slate-300 hover:border-red-600 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Scan Report</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Loading Animation Card */}
      {isAnalyzing && (
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
      )}

      {/* RESULTS DISPLAY SECTION */}
      {analysisResult && !isAnalyzing && (
        <div className="w-full space-y-6 animate-in fade-in duration-300">
          
          {/* Top Score Gauge Card */}
          <div className="w-full bg-white border-2 border-red-600 p-5 sm:p-6 shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {/* Score Circular Badge */}
                <div
                  className={`w-20 h-20 border-4 flex flex-col items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                    atsScore >= 80
                      ? "bg-emerald-600 border-emerald-700 text-white"
                      : atsScore >= 65
                      ? "bg-amber-500 border-amber-600 text-white"
                      : "bg-red-600 border-red-700 text-white"
                  }`}
                >
                  <span className="text-2xl font-black leading-none">{atsScore}%</span>
                  <span className="text-[9px] font-black uppercase mt-1">ATS Match</span>
                </div>

                <div>
                  <span className="px-2 py-0.5 text-[10px] font-black bg-red-600 text-white uppercase">
                    Scan Result
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                    {atsScore >= 80
                      ? "🎉 Excellent ATS Compatibility!"
                      : atsScore >= 65
                      ? "⚠️ Moderate ATS Compatibility"
                      : "🚨 Needs Critical Keyword Optimization"}
                  </h3>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    Your master resume has been scored against the target job requirements.
                  </p>
                </div>
              </div>

              {/* Sub Score Meters */}
              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="p-2.5 bg-slate-50 border-2 border-slate-200 text-center min-w-[90px]">
                  <span className="text-[10px] font-black text-slate-500 uppercase block">Keywords</span>
                  <span className="text-sm font-black text-slate-900">{keywordScore}%</span>
                </div>
                <div className="p-2.5 bg-slate-50 border-2 border-slate-200 text-center min-w-[90px]">
                  <span className="text-[10px] font-black text-slate-500 uppercase block">Skills</span>
                  <span className="text-sm font-black text-slate-900">{skillsScore}%</span>
                </div>
                <div className="p-2.5 bg-slate-50 border-2 border-slate-200 text-center min-w-[90px]">
                  <span className="text-[10px] font-black text-slate-500 uppercase block">Experience</span>
                  <span className="text-sm font-black text-slate-900">{experienceScore}%</span>
                </div>
                <div className="p-2.5 bg-slate-50 border-2 border-slate-200 text-center min-w-[90px]">
                  <span className="text-[10px] font-black text-slate-500 uppercase block">Education</span>
                  <span className="text-sm font-black text-slate-900">{educationScore}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Keyword Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            {/* Matched Keywords */}
            <div className="bg-white border-2 border-emerald-600 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(5,150,105,1)] space-y-3">
              <div className="flex items-center gap-2 border-b border-emerald-200 pb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Matched Keywords ({matchedKeywords.length})
                </h4>
              </div>
              
              {matchedKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {matchedKeywords.map((kw: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-600/40"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-bold text-slate-500">No matched keywords detected.</p>
              )}
            </div>

            {/* Missing Keywords */}
            <div className="bg-white border-2 border-red-600 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-3">
              <div className="flex items-center gap-2 border-b border-red-200 pb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Missing Critical Keywords ({missingKeywords.length})
                </h4>
              </div>

              {missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {missingKeywords.map((kw: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-black bg-red-50 text-red-800 border border-red-600/40"
                    >
                      ✗ {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-bold text-emerald-700">Awesome! No major missing keywords.</p>
              )}
            </div>
          </div>

          {/* AI Recommendations & Reasoning */}
          {suggestions.length > 0 && (
            <div className="w-full bg-white border-2 border-red-600 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <Target className="w-5 h-5 text-red-600" />
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  AI Actionable Improvement Checklist
                </h4>
              </div>

              <div className="space-y-2">
                {suggestions.map((item: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border-l-4 border-red-600 text-xs font-bold text-slate-800 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 bg-red-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
