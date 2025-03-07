import { type ReactNode } from "react";

import {
  CalendarIcon,
  DeleteIcon
} from "@/lib/components/icons";
import Button from "@/lib/components/ui/Button";

import type { User as UserType } from "@/lib/types";
import UserActions from "@/app/components/users/UserActions";

export function Atom({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex flex-row mr-4 space-x-1">
      <div className="text-sm font-medium text-stone-500">{label}</div>
      <div className="text-sm text-stone-700 dark:text-stone-300">{value}</div>
    </div>
  );
}

export default function User({
  user,
  onClickUser,
  serialNumber,
  onDeleteUser,
}: {
  user: UserType;
  onClickUser?: () => void;
  serialNumber: number;
  onDeleteUser?: () => void;
}) {
  return (
    <table className="min-w-full table-auto">
      {serialNumber === 1 && (
        <thead className="border-b border-stone-300 dark:border-stone-600">
          <tr>
            <th className="px-4 w-[10%] text-left text-stone-5004 pb-4">S/N</th>
            <th className="px-4 w-[15%] text-left pb-4">Name</th>
            <th className="px-4 w-[20%] text-left text-sm text-stone-600 dark:text-stone-400 pb-4">Email</th>
            <th className="px-4 w-[15%] text-left text-sm text-stone-600 dark:text-stone-400 pb-4">Username</th>
            <th className="px-4 w-[20%] text-left text-sm text-stone-600 dark:text-stone-400 pb-4">Created On</th>
            <th className="px-4 w-[15%] text-center text-sm text-stone-600 dark:text-stone-400 pb-4">Action</th>
          </tr>
        </thead>
      )}
      <tbody>
        <tr>
          <td className="px-4 w-[10%] text-left text-stone-500">{serialNumber}</td>
          <td className="px-4 w-[15%] text-left">
            {/* <Button
              className="inline-flex p-0 text-stone-900 dark:text-stone-100 font-semibold"
              mode="text"
              onClick={onClickUser}
            >
              {user.name}
            </Button> */}
            {user.name}
          </td>
          <td className="px-4 w-[20%] text-left text-sm text-stone-600 dark:text-stone-400">{user.email}</td>
          <td className="px-4 w-[15%] text-left text-sm text-stone-600 dark:text-stone-400">{user.username}</td>
          <td className="px-4 w-[20%] text-left text-sm text-stone-600 dark:text-stone-400">
            <Atom
              label={<CalendarIcon className="w-4 h-4 align-middle" />}
              value={user.created_on ? user.created_on.toDateString() : "N/A"} 
            />
          </td>
          <td className="px-4 w-[15%] text-left text-sm text-stone-600 dark:text-stone-400">
            <UserActions user={user} onDeleteUser={onDeleteUser} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
