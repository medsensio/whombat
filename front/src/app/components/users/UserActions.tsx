import useUser from "@/app/hooks/api/useUser";

import UserActionsBase from "@/lib/components/users/UserActions";

import type { User } from "@/lib/types";

export default function UserActions({
    user,
    onDeleteUser,
}: {
    user: User;
    onDeleteUser?: () => void;
}) {
    const { delete: deleteuser } = useUser({
        id: user.id,
        user,
        onDeleteUser,
    });
    return (
        <UserActionsBase
            user={user}
            onDeleteUser={() => deleteuser.mutate(user)}
        />
    );
}
