import { useState, useCallback, useEffect } from "react";
import Pagination from "@/app/components/Pagination";
import UserCreate from "@/app/components/users/UserCreate";

import useUsers from "@/app/hooks/api/useUsers";

import UserListBase from "@/lib/components/users/UserList";
import Search from "@/lib/components/inputs/Search";

import type { User } from "@/lib/types";

/**
 * Component to display a list of datasets along with search functionality,
 * create and import links.
 */
export default function UserList({
  onCreateUser,
  onClickUser,
  onDeleteUser,
}: {
  onCreateUser?: (user: User) => void;
  onClickUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
}) {
  const { items, pagination, isLoading, filter } = useUsers({
    onCreateUser,
  });

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (items) {
      setUsers(items);
    }
  }, [items]);

  const handleCreateUser = useCallback((newUser: User) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]);
    if (onCreateUser) {
      onCreateUser(newUser);
    }
  }, [onCreateUser]);

  const handleDeleteUser = useCallback((deletedUser: User) => {
    setUsers((prevUsers) => prevUsers.filter(user => user.id !== deletedUser.id));
    if (onDeleteUser) {
      onDeleteUser(deletedUser);
    }
  }, [onDeleteUser]);

  return (
    <UserListBase
      users={users}
      isLoading={isLoading}
      onClickUser={onClickUser}
      UserSearch={
        <Search
          label="Search"
          placeholder="Search user..."
          value={filter.get("search")}
          onChange={(value) => filter.set("search", value as string)}
          onSubmit={filter.submit}
        />
      }
      UserCreate={
        <UserCreate
          onCreateUser={handleCreateUser}
          onClose={() => { }}
        />
      }
      Pagination={<Pagination pagination={pagination} />}
      onDeleteUser={handleDeleteUser}
    />
  );
}
