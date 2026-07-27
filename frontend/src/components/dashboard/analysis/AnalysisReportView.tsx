"use client";

import React from "react";
import { CheckCircle2, XCircle, Target, Sparkles, Loader2 } from "lucide-react";
import { AnalysisResultData } from "@/types/analysis.types";

interface AnalysisReportViewProps {
  analysisResult: AnalysisResultData;
  onTailorResume?: () => void;
  isTailoring?: boolean;
}

export default function AnalysisReportView({
  analysisResult,
  onTailorResume,
  isTailoring = false,
}: AnalysisReportViewProps) {
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
      <div className="w-full bg-white border-2 border-red-600 p-5 sm:p-6 shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] space-y-5">
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

        {/* PROMINENT TAILOR RESUME ACTION BANNER */}
        {onTailorResume && (
          <div className="p-4 bg-red-50/70 border-2 border-red-600/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-black text-slate-900">
                Want a 92%+ Tailored Resume for this Job Posting? 🎯
              </h4>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                AI will swap matching projects from your Vault & generate ready-to-compile LaTeX code.
              </p>
            </div>
            <button
              type="button"
              onClick={onTailorResume}
              disabled={isTailoring}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black border-2 border-red-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              {isTailoring ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Tailoring & Swapping Projects...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>⚡ Tailor Resume & Export LaTeX</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Grid: Matched vs Missing Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Matched Keywords */}
        <div className="bg-white border-2 border-slate-900 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Matched Skills & Keywords ({matchedKeywords.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {matchedKeywords.map((kw: string, idx: number) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-600/30"
              >
                ✓ {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="bg-white border-2 border-red-600 p-5 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-red-600/20 pb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Missing Critical Keywords ({missingKeywords.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {missingKeywords.map((kw: string, idx: number) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-black bg-red-50 text-red-800 border border-red-600/30"
              >
                ✗ {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      {suggestions.length > 0 && (
        <div className="bg-white border-2 border-slate-900 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2">
            <Target className="w-5 h-5 text-red-600" />
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              AI Actionable Recommendations
            </h4>
          </div>
          <ul className="space-y-2 pt-1">
            {suggestions.map((rec: string, idx: number) => (
              <li
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 bg-red-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tailored Project Ideas for Target Company/JD */}
      {analysisResult?.projectIdeas && analysisResult.projectIdeas.length > 0 && (
        <div className="bg-white border-2 border-red-600 p-5 shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-red-600/20 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-600" />
              <h4 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
                Tailored Project Ideas for This Role & Company 🚀
              </h4>
            </div>
            <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 uppercase">
              AI Recommended
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {analysisResult.projectIdeas.map((idea: any, idx: number) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 border-2 border-slate-900 space-y-3 shadow-2xs hover:border-red-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-xs sm:text-sm font-black text-slate-900">
                    💡 {idea.title}
                  </h5>
                </div>

                {idea.whyItImpresses && (
                  <p className="text-xs font-bold text-slate-700 leading-relaxed bg-amber-50/80 p-2 border border-amber-200">
                    <span className="font-black text-amber-900">Why hiring managers love it:</span>{" "}
                    {idea.whyItImpresses}
                  </p>
                )}

                {idea.techStack && idea.techStack.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Tech:</span>
                    {idea.techStack.map((tech: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 text-[10px] font-extrabold bg-white text-slate-900 border border-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {idea.keyFeatures && idea.keyFeatures.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-600 uppercase block">Key Features to Build:</span>
                    <ul className="space-y-1">
                      {idea.keyFeatures.map((feat: string, fIdx: number) => (
                        <li key={fIdx} className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ATS Score Improvement Roadmap */}
      {analysisResult?.atsScoreRoadmap && analysisResult.atsScoreRoadmap.length > 0 && (
        <div className="bg-white border-2 border-emerald-600 p-5 shadow-[4px_4px_0px_0px_rgba(5,150,105,1)] space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-emerald-600/20 pb-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              ATS Score 90%+ Improvement Roadmap
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {analysisResult.atsScoreRoadmap.map((item: any, idx: number) => (
              <div key={idx} className="p-3 bg-emerald-50/60 border border-emerald-300 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-900 uppercase">
                    Step {idx + 1}: {item.step}
                  </span>
                  {item.expectedScoreBoost && (
                    <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5">
                      {item.expectedScoreBoost}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-700">{item.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
