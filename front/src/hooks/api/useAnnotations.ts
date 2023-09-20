import { useMutation } from "@tanstack/react-query";

import api from "@/app/api";
import usePagedQuery from "@/hooks/api/usePagedQuery";
import useFilter from "@/hooks/api/useFilter";
import {
  type Annotation,
  type AnnotationCreate,
  type AnnotationFilter,
} from "@/api/annotations";

export default function useAnnotations({
  filter: initialFilter = {},
  pageSize = 100,
  onCreate,
  onDelete,
  onUpdate,
}: {
  filter?: AnnotationFilter;
  pageSize?: number;
  onCreate?: (annotation: Annotation) => void;
  onDelete?: (annotation: Annotation) => void;
  onUpdate?: (annotation: Annotation) => void;
} = {}) {
  const filter = useFilter<AnnotationFilter>({ fixed: initialFilter });

  const { items, total, pagination, query } = usePagedQuery({
    name: "annotations",
    func: api.annotations.getMany,
    pageSize: pageSize,
    filter: filter.filter,
  });

  const create = useMutation({
    mutationFn: (data: AnnotationCreate) => {
      return api.annotations.create(data);
    },
    onSuccess: (data, _) => {
      query.refetch();
      onCreate?.(data);
    },
  });

  const delete_ = useMutation({
    mutationFn: (annotation_id: number) => {
      return api.annotations.delete(annotation_id);
    },
    onSuccess: (data, _) => {
      query.refetch();
      onDelete?.(data);
    },
  });

  const addTag = useMutation({
    mutationFn: ({
      annotation_id,
      tag_id,
    }: {
      annotation_id: number;
      tag_id: number;
    }) => {
      return api.annotations.addTag(annotation_id, tag_id);
    },
    onSuccess: (data, _) => {
      query.refetch();
      onUpdate?.(data);
    },
  });

  const removeTag = useMutation({
    mutationFn: ({
      annotation_id,
      tag_id,
    }: {
      annotation_id: number;
      tag_id: number;
    }) => {
      return api.annotations.removeTag(annotation_id, tag_id);
    },
    onSuccess: (data, _) => {
      query.refetch();
      onUpdate?.(data);
    },
  });

  const addNote = useMutation({
    mutationFn: ({
      annotation_id,
      message,
      is_issue,
    }: {
      annotation_id: number;
      message: string;
      is_issue: boolean;
    }) => {
      return api.annotations.addNote(annotation_id, message, is_issue);
    },
    onSuccess: (data, _) => {
      query.refetch();
      onUpdate?.(data);
    },
  });

  const removeNote = useMutation({
    mutationFn: ({
      annotation_id,
      note_id,
    }: {
      annotation_id: number;
      note_id: number;
    }) => {
      return api.annotations.removeNote(annotation_id, note_id);
    },
    onSuccess: (data, _) => {
      query.refetch();
      onUpdate?.(data);
    },
  });

  const updateNote = useMutation({
    mutationFn: ({
      annotation_id,
      note_id,
      message,
      is_issue,
    }: {
      annotation_id: number;
      note_id: number;
      message: string;
      is_issue: boolean;
    }) => {
      return api.annotations.updateNote(
        annotation_id,
        note_id,
        message,
        is_issue,
      );
    },
    onSuccess: (data, _) => {
      query.refetch();
      onUpdate?.(data);
    },
  });

  return {
    items,
    total,
    pagination,
    query,
    filter,
    create,
    delete: delete_,
    addTag,
    removeTag,
    addNote,
    removeNote,
    updateNote,
  };
}