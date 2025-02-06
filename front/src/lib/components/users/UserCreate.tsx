import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { Group, Input, Submit } from "@/lib/components/inputs/index";

import { UserCreateSchema } from "@/lib/schemas";
import type { UserCreate } from "@/lib/types";

/**
 * Component for creating a new user.
 */
export default function CreateUser({
    onCreateUser,
}: {
    onCreateUser?: (user: UserCreate) => void;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserCreate>({
        resolver: zodResolver(UserCreateSchema),
        mode: "onChange",
    });

    const onSubmit = useCallback(
        (data: UserCreate) => {
            onCreateUser?.(data);
        },
        [onCreateUser],
    );

    return (
        <form className="w-full max-w-full mx-auto p-2 md:p-2" onSubmit={handleSubmit(onSubmit)}>
            <Group
                name="name"
                label="Name"
                help="Please provide the full name."
                error={errors.name?.message}
            >
                <Input {...register("name")} />
            </Group>

            <Group
                name="email"
                label="Email"
                help="Please provide a valid email address."
                error={errors.email?.message}
            >
                <Input type="email" {...register("email")} />
            </Group>

            <Group
                name="username"
                label="Username"
                help="Choose a unique username."
                error={errors.username?.message}
            >
                <Input {...register("username")} />
            </Group>

            <div className="col-span-1 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
                    <Group
                        name="password"
                        label="Password"
                        help="Enter a secure password."
                        error={errors.password?.message}
                    >
                        <Input type="password" {...register("password")} />
                    </Group>

                    <Group
                        name="password_confirm"
                        label="Confirm Password"
                        help="Enter the same password again."
                        error={errors.password_confirm?.message}
                    >
                        <Input type="password" {...register("password_confirm")} />
                    </Group>
                </div>
            </div>

            <div className="col-span-1 md:col-span-2 mt-6 flex justify-end">
                <Submit>Create User</Submit>
            </div>
        </form>
    );
}
