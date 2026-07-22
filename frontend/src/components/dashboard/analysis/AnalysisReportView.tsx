"use client";

import React from "react";
import { CheckCircle2, XCircle, Target } from "lucide-react";
import { AnalysisResultData } from "@/types/analysis.types";

interface AnalysisReportViewProps {
  analysisResult: AnalysisResultData;
}

export default function AnalysisReportView({ analysisResult }: AnalysisReportViewProps) {
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
    <div id="scan-report-results" className="w-full space-y-6 animate-in fade-in duration-300">
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

      {/* AI Recommendations & Improvement Checklist */}
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
  );
}
