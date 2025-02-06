import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useCallback } from "react";
import toast from "react-hot-toast";

import api from "@/app/api";

import UserCreateBase from "@/lib/components/users/UserCreate";

import type { User, UserCreate } from "@/lib/types";

export default function UserCreate({
    onCreateUser,
    onError,
    onClose,
}: {
    onCreateUser?: (user: User) => void;
    onError?: (error: AxiosError) => void;
    onClose: () => void; 
}) {
    const { mutateAsync } = useMutation({
        mutationFn: api.user.create,
        onError: onError,
        onSuccess: (data) => {
            onCreateUser?.(data);
            onClose(); 
        },
    });

    const handleCreateUser = useCallback(
        async (data: UserCreate) => {
            toast.promise(mutateAsync(data), {
                loading:
                    "Creating user, please wait...",
                success: "User created",
                error: "Failed to create user",
            });
        },
        [mutateAsync],
    );

    return <UserCreateBase onCreateUser={handleCreateUser} />;
}
