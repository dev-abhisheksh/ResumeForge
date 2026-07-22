"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Clock,
  CheckCircle2,
  Target,
  Plus,
  BarChart2,
  ChevronRight,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { getDashboardStats } from "@/api/resumeAnalysis.api";

export interface DashboardStatsData {
  totalResumes: number;
  maxResumesLimit: number;
  totalScans: number;
  avgAtsScore: number;
  maxAtsScore: number;
  minAtsScore: number;
  scoreDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  missingSkillGaps: Array<{ skill: string; frequency: number }>;
  recentScans: Array<any>;
}

export default function DashboardPage() {
  const { data: userData } = useCurrentUser();
  const user = userData?.data?.user || userData?.user;

  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live dashboard analytics on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        const statsData = response.data?.stats || response.data;
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const totalResumes = stats?.totalResumes ?? 0;
  const maxLimit = stats?.maxResumesLimit ?? 3;
  const totalScans = stats?.totalScans ?? 0;
  const avgScore = stats?.avgAtsScore ?? 0;
  const maxScore = stats?.maxAtsScore ?? 0;
  const distribution = stats?.scoreDistribution || { high: 0, medium: 0, low: 0 };
  const missingSkills = stats?.missingSkillGaps || [];
  const recentScans = stats?.recentScans || [];

  return (
    <div className="w-full space-y-6 bg-white min-h-screen p-2 sm:p-4 font-sans">
      
      {/* 1. TOP WELCOME BANNER CARD */}
      <div className="w-full bg-white border-2 border-red-600 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-3">
        {/* Top Bar: Greeting on Left, Buttons on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-red-600/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-600 border border-red-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-black bg-red-600 text-white uppercase tracking-wider">
                  Overview
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Personal ATS Performance Hub
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-black text-slate-900 leading-tight mt-0.5">
                Welcome back, <span className="text-red-600">{user?.fullName || "Developer"}</span>! 👋
              </h1>
            </div>
          </div>

          {/* Action CTAs (Side by Side Inline Buttons) */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/resumes"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-white hover:bg-red-50 text-slate-900 text-xs font-black border-2 border-red-600 transition-colors shadow-2xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-red-600" />
              <span>Upload Resume</span>
            </Link>
            <Link
              href="/analysis"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black border-2 border-red-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run AI Scan</span>
            </Link>
          </div>
        </div>

        {/* Subtitle Description */}
        <p className="text-xs font-bold text-slate-600">
          Track your master resumes, monitor ATS match scores across target job postings, and fix skill gaps.
        </p>
      </div>

      {/* Loading Spinner */}
      {isLoading ? (
        <div className="w-full p-12 text-center bg-white border-2 border-red-600/30 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          <p className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Loading dashboard analytics...
          </p>
        </div>
      ) : (
        <>
          {/* 2. RESPONSIVE METRIC CARDS GRID (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            
            {/* Card 1: Master Resumes Used */}
            <div className="p-4 bg-white border-2 border-red-600 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  Master Resumes
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900">{totalResumes}</span>
                  <span className="text-xs font-extrabold text-slate-400">/ {maxLimit} Slots</span>
                </div>
                <p className="text-[11px] font-bold text-red-600 mt-0.5">
                  {totalResumes >= maxLimit ? "Quota Full (3/3)" : `${maxLimit - totalResumes} slots available`}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center font-black shrink-0 border border-red-700 shadow-2xs">
                <FileText className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            {/* Card 2: Total AI Scans */}
            <div className="p-4 bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  Total AI Scans
                </span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {totalScans} <span className="text-xs font-extrabold text-slate-500">Scans</span>
                </span>
                <p className="text-[11px] font-bold text-slate-600 mt-0.5">
                  Evaluated against JDs
                </p>
              </div>
              <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-black shrink-0 shadow-2xs">
                <Sparkles className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            {/* Card 3: Average ATS Score */}
            <div className="p-4 bg-white border-2 border-red-600 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  Average ATS Match
                </span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {avgScore}%
                </span>
                <p className="text-[11px] font-bold text-slate-600 mt-0.5">
                  Across all saved scans
                </p>
              </div>
              <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center font-black shrink-0 border border-red-700 shadow-2xs">
                <TrendingUp className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            {/* Card 4: Best ATS Score */}
            <div className="p-4 bg-white border-2 border-emerald-600 shadow-[3px_3px_0px_0px_rgba(5,150,105,1)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  Highest ATS Match
                </span>
                <span className="text-2xl font-black text-emerald-700 mt-1 block">
                  {maxScore}%
                </span>
                <p className="text-[11px] font-bold text-emerald-800 mt-0.5">
                  Personal Record 🔥
                </p>
              </div>
              <div className="w-10 h-10 bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 border border-emerald-700 shadow-2xs">
                <Award className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* 3. ATS MATCH DISTRIBUTION BAR CARD */}
          <div className="w-full bg-white border-2 border-red-600 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-3">
            <div className="flex items-center justify-between border-b-2 border-red-600/20 pb-2.5">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  ATS Match Compatibility Spread
                </h3>
              </div>
              <span className="text-xs font-extrabold text-slate-500">
                {totalScans} Total Scans Scored
              </span>
            </div>

            {/* Visual Bar Meters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-emerald-50 border border-emerald-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-emerald-800 uppercase block">
                    High Match (≥ 80%)
                  </span>
                  <span className="text-lg font-black text-emerald-900">{distribution.high} Scans</span>
                </div>
                <div className="w-7 h-7 bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  ✓
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-amber-800 uppercase block">
                    Moderate (65% - 79%)
                  </span>
                  <span className="text-lg font-black text-amber-900">{distribution.medium} Scans</span>
                </div>
                <div className="w-7 h-7 bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                  !
                </div>
              </div>

              <div className="p-3 bg-red-50 border border-red-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-red-800 uppercase block">
                    Needs Work (&lt; 65%)
                  </span>
                  <span className="text-lg font-black text-red-900">{distribution.low} Scans</span>
                </div>
                <div className="w-7 h-7 bg-red-600 text-white font-black text-xs flex items-center justify-center">
                  ✗
                </div>
              </div>
            </div>
          </div>

          {/* 4. TWO-COLUMN RESPONSIVE LAYOUT (Skill Gaps & Recent Scans) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
            
            {/* COLUMN 1: TOP MISSING SKILL GAPS */}
            <div className="bg-white border-2 border-red-600 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-red-600/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Top Skill Gaps (Most Missing)
                  </h3>
                </div>
                <span className="text-[11px] font-extrabold text-slate-500">
                  Across Target JDs
                </span>
              </div>

              {missingSkills.length === 0 ? (
                <p className="text-xs font-bold text-slate-500 p-4 bg-slate-50 border border-slate-200">
                  No skill gaps detected yet. Run more AI scans against target job descriptions!
                </p>
              ) : (
                <div className="space-y-2">
                  {missingSkills.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 border-2 border-slate-200 hover:border-red-600 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-red-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-black text-slate-900">{item.skill}</span>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-black bg-red-100 text-red-800 border border-red-300">
                        Missing in {item.frequency} {item.frequency === 1 ? "scan" : "scans"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* COLUMN 2: RECENT SCAN ACTIVITY FEED */}
            <div className="bg-white border-2 border-red-600 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-red-600/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-600" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Recent AI Scan Feed
                  </h3>
                </div>
                <Link
                  href="/analysis"
                  className="text-xs font-black text-red-600 hover:underline flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentScans.length === 0 ? (
                <p className="text-xs font-bold text-slate-500 p-4 bg-slate-50 border border-slate-200">
                  No scan history yet. Upload a resume and run your first AI analysis!
                </p>
              ) : (
                <div className="space-y-2.5">
                  {recentScans.map((scan, idx) => {
                    const score = scan.atsScore ?? 80;
                    const resObj = scan.resume;

                    return (
                      <div
                        key={scan._id || idx}
                        className="p-3 bg-white border-2 border-slate-200 hover:border-red-600 flex items-center justify-between gap-3 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 font-black text-xs flex items-center justify-center shrink-0 border ${
                              score >= 80
                                ? "bg-emerald-600 text-white border-emerald-700"
                                : score >= 65
                                ? "bg-amber-500 text-white border-amber-600"
                                : "bg-red-600 text-white border-red-700"
                            }`}
                          >
                            {score}%
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-slate-900 truncate">
                              {resObj?.title || `Master Resume ${idx + 1}`}
                            </h4>
                            <p className="text-[11px] font-bold text-slate-500 truncate mt-0.5">
                              {scan.company ? `${scan.company} • ` : ""}
                              {scan.role ? `${scan.role}` : "General Scan"}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/analysis/${resObj?._id || scan.resume}`}
                          className="px-2.5 py-1 text-xs font-black bg-slate-100 hover:bg-red-600 text-slate-800 hover:text-white border border-slate-300 hover:border-red-600 transition-colors shrink-0"
                        >
                          Report
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}