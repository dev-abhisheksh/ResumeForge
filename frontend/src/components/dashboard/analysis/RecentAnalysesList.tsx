"use client";

import React from "react";
import { Clock, Loader2, Eye } from "lucide-react";
import { AnalysisResultData } from "@/types/analysis.types";

interface RecentAnalysesListProps {
  recentAnalyses: AnalysisResultData[];
  isLoadingRecent: boolean;
  onSelectScan: (item: AnalysisResultData) => void;
}

export default function RecentAnalysesList({
  recentAnalyses,
  isLoadingRecent,
  onSelectScan,
}: RecentAnalysesListProps) {
  return (
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
                  onClick={() => onSelectScan(item)}
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
  );
}
