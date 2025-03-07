import { useCallback, useMemo } from "react";
import { Item } from "react-stately";

import useUsers from "@/app/hooks/api/useUsers";

import Search from "@/lib/components/search/Search";

import type { User } from "@/lib/types";

export default function UserSearch({
  selected,
  onSelect,
  showMax = 10,
}: {
  selected?: User | null;
  onSelect?: (user: User) => void;
  emptyMessage?: string;
  showMax?: number;
}) {
  const filter = useMemo(() => ({ search: "" }), []);

  const {
    isLoading,
    items,
    filter: { set: setFilter },
  } = useUsers({
    pageSize: showMax * 4,
    filter,
  });

  const onChangeSearch = useCallback(
    (search: string) => setFilter("search", search),
    [setFilter],
  );

  return (
    <Search
      label="search-users"
      value={selected}
      options={items}
      fields={["name", "id"]}
      displayValue={(user) => user.name ?? ''}
      getOptionKey={(user) => user.id}
      onChangeSearch={onChangeSearch}
      onSelect={onSelect}
      showMax={showMax}
      isLoading={isLoading}
    >
      {(user) => <Item key={user.id}>{user.name}</Item>}
    </Search>
  );
}
