import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "@/app/api";

import useFilter from "@/lib/hooks/utils/useFilter";
import usePagedQuery from "@/lib/hooks/utils/usePagedQuery";

import type { User, UserFilter } from "@/lib/types";

const _empty: UserFilter = {};
const _fixed: (keyof UserFilter)[] = [];

export default function useUsers({
  filter: initialFilter = _empty,
  fixed = _fixed,
  pageSize = 10,
  enabled = true,
  onCreateUser,
}: {
  filter?: UserFilter;
  fixed?: (keyof UserFilter)[];
  pageSize?: number;
  enabled?: boolean;
  onCreateUser?: (user: User) => void;
} = {}) {
  const filter = useFilter<UserFilter>({ defaults: initialFilter, fixed });

  const { query, pagination, items, total } = usePagedQuery({
    name: "users",
    queryFn: api.user.getMany,
    pageSize: pageSize,
    filter: filter.filter,
    enabled,
  });

  const create = useMutation({
    mutationFn: api.user.create,
    onSuccess: (data) => {
      toast.success(`User ${data.name} created`);
      onCreateUser?.(data);
      query.refetch();
    },
  });

  return {
    ...query,
    filter,
    pagination,
    items,
    total,
    create,
  } as const;
}
