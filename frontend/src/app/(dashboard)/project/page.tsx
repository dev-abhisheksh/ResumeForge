"use client";

import React from "react";
import {
  FolderCode,
  Layers,
  Code,
  Sparkles,
  Loader2,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useProjects } from "@/hooks/project/useProjects";
import { ProjectsItem } from "@/types/project.types";

export default function ProjectsPage() {
  const { data: rawProjectsData, isLoading, isError, error } = useProjects();

  // Safely extract projects array from React Query response
  const projectList: ProjectsItem[] = Array.isArray(rawProjectsData)
    ? rawProjectsData
    : (rawProjectsData as any)?.projects || (rawProjectsData as any)?.data || [];

  const projectCount = projectList.length;
  const maxAllowed = 3;

  return (
    <div className="w-full space-y-6 bg-white min-h-screen p-2 sm:p-4 font-sans">
      
      {/* 1. TOP HEADER & VAULT QUOTA BANNER */}
      <div className="w-full bg-white border-2 border-red-600 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-black bg-red-600 text-white uppercase tracking-wider whitespace-nowrap">
              Project Vault
            </span>
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
              Verified Experience Bank
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">
            My Real Projects Library 💻
          </h1>
          <p className="text-xs font-bold text-slate-600 max-w-xl">
            Store your authentic projects here. When tailoring resumes for target JDs, AI will swap in relevant projects with zero hallucinations.
          </p>
        </div>

        {/* Quota Badge */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <div className="px-3 py-1.5 bg-red-600 text-white border-2 border-red-700 shadow-2xs font-black text-xs flex items-center gap-2 whitespace-nowrap">
            <FolderCode className="w-4 h-4 shrink-0" />
            <span>{projectCount} / {maxAllowed} Slots Used</span>
          </div>
        </div>
      </div>

      {/* 2. LOADING STATE */}
      {isLoading && (
        <div className="w-full p-12 text-center bg-white border-2 border-red-600/30 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          <p className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Fetching project vault...
          </p>
        </div>
      )}

      {/* 3. ERROR STATE */}
      {isError && (
        <div className="w-full p-4 bg-red-50 border-2 border-red-600 text-red-900 text-xs font-bold shadow-2xs">
          ⚠️ {error instanceof Error ? error.message : "Failed to load projects."}
        </div>
      )}

      {/* 4. EMPTY STATE */}
      {!isLoading && !isError && projectCount === 0 && (
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-red-50/40 border-2 border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 border border-red-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Layers className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                No Projects in Vault Yet
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                Add your real projects to enable AI project swapping during resume tailoring.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-black bg-white border border-red-600 text-red-600 shrink-0 self-start sm:self-auto shadow-2xs">
            0 / 3 Slots
          </span>
        </div>
      )}

      {/* 5. RESPONSIVE PROJECT CARDS LIST */}
      {!isLoading && !isError && projectCount > 0 && (
        <div className="flex flex-col gap-5 w-full">
          {projectList.map((project: ProjectsItem, index: number) => (
            <div
              key={project._id || index}
              className="w-full bg-white border-2 border-red-600 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-4 transition-all"
            >
              {/* Card Header: Title, Slot #, Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-red-600/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 border border-red-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    #{index + 1}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {project.title}
                    </h2>
                    {project.createdAt && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mt-0.5">
                        <Calendar className="w-3 h-3 text-red-600" />
                        <span>Added {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tech Stack Badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {project.techStack?.map((tech: string, tIdx: number) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 text-[10px] font-black uppercase bg-red-50 text-red-700 border border-red-600/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Summary Box */}
              {project.summary && (
                <div className="p-3 bg-slate-50 border-2 border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      AI Overview
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">
                    {project.summary}
                  </p>
                </div>
              )}

              {/* AI Generated Bullet Points */}
              {project.bulletPoints && project.bulletPoints.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-red-600" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      Action-Verb Bullet Points
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {project.bulletPoints.map((bullet: string, bIdx: number) => (
                      <li
                        key={bIdx}
                        className="p-2.5 bg-white border border-slate-200 hover:border-red-600 flex items-start gap-2.5 transition-colors text-xs font-bold text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}