"use client";

/**
 * Page module for displaying the list of users.
 *
 * This page includes a hero section with the title "Users" and a list of
 * users using the `UserList` component.
 *
 * @module pages/users
 * @see components/users/UserList
 */
import { useRouter } from "next/navigation";

import UserList from "@/app/components/users/UserList";

import Hero from "@/lib/components/ui/Hero";
import { useSession } from "@/app/store/session";

export default function Page() {

  const { user } = useSession();
  const router = useRouter();

  if (!user?.is_superuser) {
    router.push('/'); 
    return null;  
  }

  return (
    <>
      <Hero text="Users" />
      <UserList />
    </>
  );
}
