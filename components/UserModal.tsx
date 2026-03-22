"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { userClient } from "@/clients/UserClient";
import { FormInputItem } from "@/components/input/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ID, User } from "@/types/domain";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .union([
      z.literal(""),
      z.string().min(10, "Password must be at least 10 characters"),
    ])
    .optional(),
});

type FormValues = z.infer<typeof userSchema>;

type Props = {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (user: User) => void;
  onDelete?: (id: ID) => void;
};

export default function UserModal({
  user,
  open,
  onOpenChange,
  onSuccess,
  onDelete,
}: Props) {
  const isEdit = !!user?.id;
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (!open) return;

    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
      });
    }
  }, [user, open, reset]);

  const onFormSubmit = async (data: FormValues) => {
    try {
      if (!isEdit && !data.password) {
        setError("password", {
          type: "required",
          message: "Password is required",
        });
        return;
      }

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password || undefined,
      };

      let result: User;

      if (user?.id) {
        result = await userClient.update(String(user.id), payload);
      } else {
        result = await userClient.create({
          ...payload,
          password: data.password || "",
        });
      }

      onSuccess?.(result);
      await router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteUser = async () => {
    try {
      if (!user?.id) return;

      setIsDeleting(true);
      await userClient.delete(String(user.id));
      onDelete?.(user.id);
      await router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Update" : "Create"} user</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Modify the user details below."
                : "Fill in the details to create a new user."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
              <FormInputItem
                control={form.control}
                name="name"
                label="Name"
                placeholder="User name"
              />

              <FormInputItem
                control={form.control}
                name="email"
                label="Email"
                placeholder="user@email.com"
              />

              <FormInputItem
                control={form.control}
                name="password"
                label={isEdit ? "New password (optional)" : "Password"}
                placeholder={
                  isEdit ? "Leave blank to keep password" : "Password"
                }
                type="password"
              />

              <DialogFooter className="justify-between">
                {isEdit && (
                  <Button
                    type="button"
                    className="bg-red-500"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    isLoading={isDeleting}
                    disabled={isSubmitting || isDeleting}
                  >
                    Delete
                  </Button>
                )}
                <div className="flex gap-2 flex-col-reverse sm:flex-row">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isSubmitting || isDeleting}
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || isDeleting}
                  >
                    {isEdit ? "Update" : "Create"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The user will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={onDeleteUser}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
