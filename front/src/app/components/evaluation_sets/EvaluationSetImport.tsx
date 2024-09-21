import api from "@/app/api";
import type { EvaluationSetImport } from "@/lib/api/evaluation_sets";
import EvaluationSetImportBase from "@/lib/components/evaluation_sets/EvaluationSetImport";
import type { EvaluationSet } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useCallback } from "react";
import toast from "react-hot-toast";

export default function EvaluationSetImport({
  onImportEvaluationSet,
  onError,
}: {
  onImportEvaluationSet?: (evaluationSet: EvaluationSet) => void;
  onError?: (error: AxiosError) => void;
}) {
  const { mutateAsync } = useMutation({
    mutationFn: api.evaluationSets.import,
    onError: onError,
    onSuccess: onImportEvaluationSet,
  });

  const handleImportProject = useCallback(
    async (data: EvaluationSetImport) => {
      toast.promise(mutateAsync(data), {
        loading: "Importing evaluation set. Please wait...",
        success: "Evaluation set imported",
        error: "Failed to import evaluation set",
      });
    },
    [mutateAsync],
  );

  return (
    <EvaluationSetImportBase onImportEvaluationSet={handleImportProject} />
  );
}
