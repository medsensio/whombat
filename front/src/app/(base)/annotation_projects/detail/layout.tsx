"use client";
import { toast } from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import useAnnotationProject from "@/hooks/useAnnotationProject";
import { type ReactNode } from "react";
import Loading from "@/app/loading";
import { AnnotationProjectContext } from "./context";
import ProjectHeader from "../components/ProjectHeader";

export default function Layout({ children }: { children: ReactNode }) {
  const params = useSearchParams();
  const router = useRouter();

  const annotation_project_id = params.get("annotation_project_id");

  // Fetch the annotation project.
  const project = useAnnotationProject({
    annotation_project_id: parseInt(annotation_project_id ?? "-1"),
    onDelete: () => {
      // Go to previous page.
      toast.success("Annotation project deleted.");
      router.back();
    },
    onUpdate: () => {
      toast.success("Annotation project saved.", {
        id: "annotation-project-update",
      });
    },
  });

  // Go to the annotation projects page if the annotation project id is not
  // specified.
  if (annotation_project_id == null) {
    router.push("/annotation_projects/");
    return;
  }

  if (project.query.isError) {
    // If not found, go to the annotation projects page.
    toast.error("Annotation project not found.");
    router.push("/annotation_projects/");
    return;
  }

  if (project.query.isLoading) {
    if (project.query.failureCount === 2) {
      toast.error("Error loading annotation project.");
    }
    return <Loading />;
  }

  return (
    <AnnotationProjectContext.Provider value={project}>
      <ProjectHeader name={project.query.data.name} />
      <div className="p-4">{children}</div>
    </AnnotationProjectContext.Provider>
  );
}