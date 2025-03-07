import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useCallback } from "react";
import toast from "react-hot-toast";

import api from "@/app/api";

import useObject from "@/lib/hooks/utils/useObject";

import type { User, UserUpdate } from "@/lib/types";

/**
 * Custom hook for managing dataset-related state, fetching, and mutations.
 *
 * This hook encapsulates the logic for querying, updating, and deleting
 * dataset information using React Query. It can also fetch and provide
 * additional dataset state if enabled.
 */
export default function useUser({
  id,
  user,
  enabled = true,
  onDeleteUser,
  onError,
}: {
  id: string;
  user?: User;
  enabled?: boolean;
  onDeleteUser?: (deleted: User) => void;
  onError?: (error: AxiosError) => void;
}) {
  if (user !== undefined && user.id !== id) {
    throw new Error("User id does not match");
  }

  const { query, useMutation } = useObject<User>({
    id: id,
    initialData: user,
    name: "users",
    enabled,
    queryFn: api.user.get,
    onError,
  });

  const delete_ = useMutation({
    mutationFn: api.user.delete,
    onSuccess: (data) => {
      toast.success("User deleted");
      onDeleteUser?.(data);
    },
  });

  return {
    ...query,
    delete: delete_,
  };
}
