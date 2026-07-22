"use client";

import React, { useState, useEffect } from "react";
import { useResume } from "@/hooks/resume/useResumes";
import { analyzeWithAi } from "@/api/resumeAnalysis.api";
import { notify } from "@/lib/toast";
import { AnalysisResultData, AnalysisWorkspaceProps } from "@/types/analysis.types";

import AnalysisHeader from "./analysis/AnalysisHeader";
import AnalysisForm from "./analysis/AnalysisForm";
import RecentAnalysesList from "./analysis/RecentAnalysesList";
import AnalysisLoadingCard from "./analysis/AnalysisLoadingCard";
import AnalysisReportView from "./analysis/AnalysisReportView";
import { useRecentAnalysis } from "@/hooks/resumeAnalysis/useRecentAnalysis";

export default function AnalysisWorkspace({
  preselectedResumeId,
}: AnalysisWorkspaceProps) {
  const { data: rawResumesData, isLoading: isLoadingResumes } = useResume();
  const {
    data: recentAnalyses = [],
    isLoading: isLoadingRecentAnalysis,
    refetch: refetchRecent,
  } = useRecentAnalysis();

  // Form State & Collapsible State
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(true);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(
    preselectedResumeId || ""
  );
  const [jobDescription, setJobDescription] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  // Active Report Result State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultData | null>(null);

  // Safely extract master resumes array
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

  // Log state updates to console whenever active analysisResult changes
  useEffect(() => {
    if (analysisResult) {
      console.log("📊 Active Analysis Result in React State:", analysisResult);
    }
  }, [analysisResult]);

  // Handle Form Submission for live AI analysis
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

      const resData =
        response.data?.result ||
        response.data?.analysis ||
        response.data?.data ||
        response.data;

      console.log("🚀 Live Analysis API Response Received:", resData);
      setAnalysisResult(resData);

      notify.success("Analysis Complete!", "AI ATS feedback generated successfully.");

      // Auto collapse form and refetch recent scans list via React Query
      setIsFormExpanded(false);
      refetchRecent();

      // Smooth scroll down to scan report results view
      setTimeout(() => {
        const reportElem = document.getElementById("scan-report-results");
        if (reportElem) {
          reportElem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to run AI analysis.";
      notify.error("Analysis Failed", msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load a recent scan from history into active result view
  const handleLoadRecentItem = (item: AnalysisResultData) => {
    console.log("👁️ View Scan Report Clicked. Selected Scan Item Data:", item);

    // Safely extract string resume ID whether item.resume is a populated object or string ID
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

    // Auto collapse setup form to prioritize full screen report view
    setIsFormExpanded(false);
    notify.info("Scan Loaded", "Displaying historical AI analysis report.");

    // Smooth scroll down to results section
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
        isAnalyzing={isAnalyzing}
        isFormExpanded={isFormExpanded}
        setIsFormExpanded={setIsFormExpanded}
        onSubmit={handleRunAnalysis}
      />

      {/* 3. Recent AI Scans List */}
      <RecentAnalysesList
        recentAnalyses={recentAnalyses}
        isLoadingRecent={isLoadingRecentAnalysis}
        onSelectScan={handleLoadRecentItem}
      />

      {/* 4. Loading State Card */}
      {isAnalyzing && <AnalysisLoadingCard />}

      {/* 5. Active Analysis Report View */}
      {analysisResult && !isAnalyzing && (
        <AnalysisReportView analysisResult={analysisResult} />
      )}
    </div>
  );
}
