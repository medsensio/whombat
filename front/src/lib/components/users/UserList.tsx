import UserComponent from "@/lib/components/users/User";
import { AddIcon, WarningIcon } from "@/lib/components/icons";
import Dialog from "@/lib/components/ui/Dialog";
import Empty from "@/lib/components/ui/Empty";

import type { User } from "@/lib/types";

import ListLayout from "../layouts/List";
import React from "react";

/**
 * Component to display a list of users along with search functionality,
 * create links.
 */
export default function UserList({
  users,
  isLoading = false,
  onClickUser,
  UserSearch,
  UserCreate,
  Pagination,
  onDeleteUser,
}: {
  users: User[];
  isLoading?: boolean;
  onClickUser?: (user: User) => void;
  UserSearch: JSX.Element;
  UserCreate: JSX.Element;
  Pagination: JSX.Element;
  onDeleteUser?: (user: User) => void;
}) {
  return (
    <ListLayout
      isLoading={isLoading}
      isEmpty={users.length === 0}
      Search={UserSearch}
      Empty={<NoUsers />}
      Actions={[
        <Dialog
          key="create"
          mode="text"
          title="Create User"
          label={
            <>
              <AddIcon className="inline-block w-4 h-4 align-middle" /> Create
            </>
          }
        >
          {({ close }) => (
            <div>
              {React.cloneElement(UserCreate, { onClose: close })}
            </div>
          )}
        </Dialog>,
      ]}
      Pagination={Pagination}
      items={users.map((item, index) => (
        <UserComponent
          key={item.id}
          user={item}
          serialNumber={index + 1} 
          onClickUser={() => onClickUser?.(item)}
          onDeleteUser={() => onDeleteUser?.(item)}
        />
      ))}
    />
  );
}

/**
 * Component to display a message when no users are found.
 *
 * @returns JSX element providing information and guidance when no users are
 * found.
 */
function NoUsers() {
  return (
    <Empty>
      <WarningIcon className="w-8 h-8 text-stone-500" />
      <p>No users found.</p>
      <p>
        To create a user, click on the
        <span className="text-emerald-500">
          <AddIcon className="inline-block mr-1 ml-2 w-4 h-4" />
          Create{" "}
        </span>{" "}
        button above.
      </p>
    </Empty>
  );
}
