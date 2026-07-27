"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/hooks/resume/useResumes";
import { notify } from "@/lib/toast";
import { AnalysisResultData, AnalysisWorkspaceProps } from "@/types/analysis.types";

import AnalysisHeader from "./analysis/AnalysisHeader";
import AnalysisForm from "./analysis/AnalysisForm";
import RecentAnalysesList from "./analysis/RecentAnalysesList";
import AnalysisLoadingCard from "./analysis/AnalysisLoadingCard";
import AnalysisReportView from "./analysis/AnalysisReportView";
import TailoredLatexModal from "./analysis/TailoredLatexModal";
import { useRecentAnalysis } from "@/hooks/resumeAnalysis/useRecentAnalysis";
import { useAnalyzeWithAi } from "@/hooks/resumeAnalysis/useAnalyzeWithAi";
import { useTailorResume } from "@/hooks/resumeAnalysis/useTailorResume";

export default function AnalysisWorkspace({
  preselectedResumeId,
}: AnalysisWorkspaceProps) {
  const router = useRouter();

  const { data: rawResumesData, isLoading: isLoadingResumes } = useResume();
  const { data: recentAnalyses = [], isLoading: isLoadingRecentAnalysis } = useRecentAnalysis();
  const { isPending: isPendingAnalyzeWithAi, mutate: mutateAnalyzeWithAi } = useAnalyzeWithAi();
  const { isPending: isPendingTailor, mutate: mutateTailor } = useTailorResume();

  // Form State & Collapsible State
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(true);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(
    preselectedResumeId || ""
  );
  const [jobDescription, setJobDescription] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  // Active Report Result State
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultData | null>(null);

  // Tailored LaTeX Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tailorResult, setTailorResult] = useState<{
    latexCode: string;
    atsScore: number;
    tailoredData?: any;
  } | null>(null);

  // Safely extract master resumes array
  const resumeList = Array.isArray(rawResumesData) ? rawResumesData : rawResumesData?.data || rawResumesData?.resumes || [];

  // Sync preselectedId if available
  useEffect(() => {
    if (preselectedResumeId) {
      setSelectedResumeId(preselectedResumeId);
    } else if (resumeList.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumeList[0]._id);
    }
  }, [preselectedResumeId, resumeList]);

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedResumeId) {
      notify.error("Select Resume", "Please select a master raw resume");
      return;
    }

    if (!jobDescription.trim()) {
      notify.error("Missing Job Description", "Please paste the target Job Description");
      return;
    }

    mutateAnalyzeWithAi(
      {
        resumeId: selectedResumeId,
        data: { jobDescription, company, role },
      },
      {
        onSuccess: (res) => {
          const resData =
            res.data?.result ??
            res.data?.analysis ??
            res.data?.data ??
            res.data;

          setAnalysisResult(resData);
          notify.success("Analysis Complete!", "AI ATS feedback generated successfully.");
          setIsFormExpanded(false);

          setTimeout(() => {
            document.getElementById("scan-report-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : "Failed to run AI Analysis";
          notify.error("Analysis Failed", msg);
        },
      }
    );
  };

  const handleRunFastAnalysis = () => {
    if (!selectedResumeId) {
      notify.error("Select Resume", "Please select a master raw resume");
      return;
    }

    if (!jobDescription.trim()) {
      notify.error("Missing Job Description", "Please paste the target Job Description");
      return;
    }

    mutateAnalyzeWithAi(
      {
        resumeId: selectedResumeId,
        data: { jobDescription, company, role, includeRecommendations: false },
      },
      {
        onSuccess: (res) => {
          const resData =
            res.data?.result ??
            res.data?.analysis ??
            res.data?.data ??
            res.data;

          setAnalysisResult(resData);
          notify.success("Instant Score Ready!", "ATS score & keyword match calculated in ~1.5s.");
          setIsFormExpanded(false);

          setTimeout(() => {
            document.getElementById("scan-report-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : "Failed to run Instant ATS Score";
          notify.error("Analysis Failed", msg);
        },
      }
    );
  };

  const handleTailorResume = () => {
    notify.info("Coming Soon 🚀", "The AI LaTeX Tailoring Engine is currently undergoing final quality upgrades!");
  };

  // Load a recent scan from history into active result view
  const handleLoadRecentItem = (item: AnalysisResultData) => {
    const resumeId =
      typeof item.resume === "object" && item.resume !== null
        ? item.resume._id || item.resume.id
        : item.resume;

    setAnalysisResult(item);

    if (resumeId) {
      setSelectedResumeId(String(resumeId));
    }
    if (item.jobDescription) setJobDescription(item.jobDescription);
    if (item.company) setCompany(item.company);
    if (item.role) setRole(item.role);

    setIsFormExpanded(false);
    notify.info("Scan Loaded", "Displaying historical AI analysis report.");

    setTimeout(() => {
      const reportElem = document.getElementById("scan-report-results");
      if (reportElem) {
        reportElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="w-full space-y-6 bg-white min-h-screen p-2 sm:p-4 font-sans">
      {/* 1. Top Header */}
      <AnalysisHeader />

      {/* 2. Setup Scan Requirements Form */}
      <AnalysisForm
        resumeList={resumeList}
        isLoadingResumes={isLoadingResumes}
        selectedResumeId={selectedResumeId}
        setSelectedResumeId={setSelectedResumeId}
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        company={company}
        setCompany={setCompany}
        role={role}
        setRole={setRole}
        isAnalyzing={isPendingAnalyzeWithAi}
        isFormExpanded={isFormExpanded}
        setIsFormExpanded={setIsFormExpanded}
        onSubmit={handleRunAnalysis}
        onSubmitFast={handleRunFastAnalysis}
      />

      {/* 3. Recent AI Scans List */}
      <RecentAnalysesList
        recentAnalyses={recentAnalyses}
        isLoadingRecent={isLoadingRecentAnalysis}
        onSelectScan={handleLoadRecentItem}
      />

      {/* 4. Loading State Card */}
      {isPendingAnalyzeWithAi && <AnalysisLoadingCard />}

      {/* 5. Active Analysis Report View */}
      {analysisResult && !isPendingAnalyzeWithAi && (
        <AnalysisReportView
          analysisResult={analysisResult}
          onTailorResume={handleTailorResume}
          isTailoring={isPendingTailor}
        />
      )}

      {/* 6. Tailored LaTeX Code Modal */}
      {tailorResult && (
        <TailoredLatexModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          latexCode={tailorResult.latexCode}
          atsScore={tailorResult.atsScore}
          tailoredData={tailorResult.tailoredData}
        />
      )}
    </div>
  );
}
