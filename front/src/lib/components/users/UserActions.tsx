import {
    CloseIcon,
    DeleteIcon,
    WarningIcon,
  } from "@/lib/components/icons";
  import Alert from "@/lib/components/ui/Alert";
  import Button from "@/lib/components/ui/Button";
  
  import type { User } from "@/lib/types";
  
  export default function UserActions({
    user,
    onDeleteUser,
  }: {
    user: User;
    onDeleteUser?: () => void;
  }) {
    return (
      <div className="flex flex-row gap-2 justify-center">
        <DeleteUser user={user} onDeleteUser={onDeleteUser} />
      </div>
    );
  }
  
  function DeleteUser({
    user,
    onDeleteUser,
  }: {
    user: User;
    onDeleteUser?: () => void;
  }) {
    return (
      <Alert
        title={
          <>
            <WarningIcon className="inline-block mr-2 w-8 h-8 text-red-500" />
            Are you sure you want to delete this user?
          </>
        }
        button={
          <>
            <DeleteIcon className="inline-block mr-2 w-5 h-5" />
            Delete User
          </>
        }
        mode="text"
        variant="danger"
      >
        {({ close }) => {
          return (
            <>
              <div className="flex flex-col gap-2 text-center">
                <h2 className="p-4 font-extrabold text-center">{user.name}</h2>
                <p>
                  This action cannot be undone. This will permanently delete the user.
                </p>
                <p>Do you want to proceed?</p>
              </div>
              <div className="flex flex-row gap-2 justify-end mt-4">
                <Button
                  tabIndex={0}
                  mode="text"
                  variant="danger"
                  onClick={onDeleteUser}
                >
                  <DeleteIcon className="inline-block mr-2 w-5 h-5" />
                  Delete
                </Button>
                <Button
                  tabIndex={1}
                  mode="outline"
                  variant="primary"
                  onClick={close}
                >
                  <CloseIcon className="inline-block mr-2 w-5 h-5" />
                  Cancel
                </Button>
              </div>
            </>
          );
        }}
      </Alert>
    );
  }
  