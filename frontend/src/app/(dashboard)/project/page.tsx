"use client";

import React, { useState } from "react";
import {
  FolderCode,
  Layers,
  Code,
  Sparkles,
  Loader2,
  CheckCircle2,
  Calendar,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useProjects } from "@/hooks/project/useProjects";
import { addProject } from "@/api/project.api";
import { ProjectsItem } from "@/types/project.types";
import { notify } from "@/lib/toast";

export default function ProjectsPage() {
  const { data: rawProjectsData, isLoading, isError, error, refetch } = useProjects();

  // Collapsible Form State
  const [isFormOpen, setIsFormOpen] = useState(true);

  // Add Project Inputs
  const [title, setTitle] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [rawData, setRawData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safely extract projects array from React Query response
  const projectList: ProjectsItem[] = Array.isArray(rawProjectsData)
    ? rawProjectsData
    : (rawProjectsData as any)?.projects || (rawProjectsData as any)?.data || [];

  const projectCount = projectList.length;
  const maxAllowed = 3;
  const isQuotaFull = projectCount >= maxAllowed;

  // Submit Handler
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isQuotaFull) {
      notify.error("Quota Reached", "Free account is limited to 3 vault projects.");
      return;
    }
    if (!title.trim() || !rawData.trim() || !techStackInput.trim()) {
      notify.error("Missing Fields", "Please fill in title, tech stack, and raw description.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Split comma-separated tech stack input
      const techStack = techStackInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await addProject({
        title: title.trim(),
        techStack,
        rawData: rawData.trim(),
      });

      notify.success("Project Added!", "Groq AI processed summary & bullet points.");

      // Reset Form & Refetch
      setTitle("");
      setTechStackInput("");
      setRawData("");
      setIsFormOpen(false);
      refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add project.";
      notify.error("Add Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6 bg-white min-h-screen p-2 sm:p-4 font-sans">
      
      {/* 1. TOP HEADER & VAULT QUOTA BANNER */}
      <div className="w-full bg-white border-2 border-red-600 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-3">
        {/* Top Bar: Icon + Titles on Left, Quota Badge on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-red-600/20 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-red-600 border border-red-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
              <FolderCode className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 text-[10px] font-black bg-red-600 text-white uppercase tracking-wider whitespace-nowrap">
                  Project Vault
                </span>
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                  Verified Experience Bank
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-black text-slate-900 leading-tight mt-0.5 truncate">
                My Real Projects Library 💻
              </h1>
            </div>
          </div>

          {/* Quota Badge */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <div className="px-3 py-1.5 bg-red-600 text-white border-2 border-red-700 shadow-2xs font-black text-xs flex items-center gap-2 whitespace-nowrap">
              <Layers className="w-4 h-4 shrink-0" />
              <span>{projectCount} / {maxAllowed} Slots Used</span>
            </div>
          </div>
        </div>

        {/* Subtitle Description */}
        <p className="text-xs font-bold text-slate-600">
          Store your authentic projects here. When tailoring resumes for target JDs, AI will swap in relevant projects with zero hallucinations.
        </p>
      </div>

      {/* 2. ADD NEW PROJECT FORM CARD (COLLAPSIBLE) */}
      <div className="w-full bg-white border-2 border-red-600 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-red-600/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 text-white flex items-center justify-center font-black text-xs">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Add New Project to Vault
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-red-50 text-slate-900 hover:text-red-600 text-xs font-black border-2 border-red-600 transition-all shadow-2xs cursor-pointer"
          >
            <span>{isFormOpen ? "Hide Form" : "+ Add Project"}</span>
            {isFormOpen ? (
              <ChevronUp className="w-4 h-4 text-red-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-red-600" />
            )}
          </button>
        </div>

        {isFormOpen && (
          <div>
            {isQuotaFull ? (
              <div className="w-full p-4 bg-red-50 border-2 border-red-600 text-red-900 text-xs font-bold shadow-2xs">
                ⚠️ Vault Storage Quota Full ({projectCount}/3). You can maintain up to 3 projects on the free tier.
              </div>
            ) : (
              <form onSubmit={handleAddProject} className="space-y-4 w-full">
                {/* Title & Tech Stack Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. MindArchive"
                      className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 focus:border-red-600 text-slate-900 font-bold text-xs sm:text-sm outline-none focus:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                      Tech Stack (Comma Separated) <span className="text-red-600 ">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      placeholder="e.g. React, Node.js, Express, Redis, BullMQ"
                      className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 focus:border-red-600 text-slate-900 font-bold text-xs sm:text-sm outline-none focus:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] transition-all"
                    />
                  </div>
                </div>

                {/* Raw Description Textarea */}
                <div className="space-y-1">
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                    Raw Description / Feature Notes *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={rawData}
                    onChange={(e) => setRawData(e.target.value)}
                    placeholder="Paste raw project details, achievements, or features here. Groq AI will parse summary & action-verb bullet points in ~0.4s..."
                    className="w-full p-3.5 bg-slate-900 text-slate-100 font-mono text-xs border-2 border-slate-900 focus:border-red-600 outline-none leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !title.trim() || !rawData.trim()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black border-2 border-red-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing via Groq AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Add & AI Summarize Project</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* 3. LOADING STATE */}
      {isLoading && (
        <div className="w-full p-12 text-center bg-white border-2 border-red-600/30 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          <p className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Fetching project vault...
          </p>
        </div>
      )}

      {/* 4. ERROR STATE */}
      {isError && (
        <div className="w-full p-4 bg-red-50 border-2 border-red-600 text-red-900 text-xs font-bold shadow-2xs">
          ⚠️ {error instanceof Error ? error.message : "Failed to load projects."}
        </div>
      )}

      {/* 5. EMPTY STATE */}
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
                Use the form above to add your first project. Groq AI will format summary & action bullets!
              </p>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-black bg-white border border-red-600 text-red-600 shrink-0 self-start sm:self-auto shadow-2xs">
            0 / 3 Slots
          </span>
        </div>
      )}

      {/* 6. RESPONSIVE PROJECT CARDS LIST */}
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