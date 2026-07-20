"use client";

import React from "react";
import { useParams } from "next/navigation";
import AnalysisWorkspace from "@/components/dashboard/AnalysisWorkspace";

export default function DynamicAnalysisPage() {
  const params = useParams();
  const resumeId = params.resumeId as string;

  return <AnalysisWorkspace preselectedResumeId={resumeId} />;
}