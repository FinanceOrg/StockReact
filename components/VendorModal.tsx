"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { assetVendorClient } from "@/clients/AssetVendorClient";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AssetVendor, ID } from "@/types/domain";

const safeImageUrl = z.union([
  z.literal(""),
  z
    .string()
    .url("Must be a valid URL")
    .refine(
      (url) => url.startsWith("https://") || url.startsWith("http://"),
      "Only http:// and https:// URLs are allowed",
    ),
]);

const vendorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.union([
    z.literal(""),
    z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g. #FF5733)"),
  ]),
  imageUrl: safeImageUrl,
  description: z.string().optional(),
});

type FormValues = z.infer<typeof vendorSchema>;

type Props = {
  vendor: AssetVendor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (vendor: AssetVendor) => void;
  onDelete?: (id: ID) => void;
};

export default function VendorModal({
  vendor,
  open,
  onOpenChange,
  onSuccess,
  onDelete,
}: Props) {
  const isEdit = !!vendor?.id;
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: "",
      color: "",
      imageUrl: "",
      description: "",
    },
  });

  const imageUrl = form.watch("imageUrl");

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (!open) return;

    if (vendor) {
      reset({
        name: vendor.name,
        color: vendor.style?.color ?? "",
        imageUrl: vendor.style?.image ?? "",
        description: vendor.description ?? "",
      });
    } else {
      reset({
        name: "",
        color: "",
        imageUrl: "",
        description: "",
      });
    }
  }, [vendor, open, reset]);

  const onFormSubmit = async (data: FormValues) => {
    try {
      const style = {
        color: data.color || undefined,
        image: data.imageUrl || undefined,
      };

      const payload = {
        name: data.name,
        style: style.color || style.image ? style : undefined,
        description: data.description,
      };

      let result: AssetVendor;

      if (vendor?.id) {
        result = await assetVendorClient.update(String(vendor.id), payload);
      } else {
        result = await assetVendorClient.create(payload);
      }

      onSuccess?.(result);
      await router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteVendor = async () => {
    try {
      if (!vendor?.id) return;
      setIsDeleting(true);
      await assetVendorClient.delete(String(vendor.id));
      onDelete?.(vendor.id);
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
            <DialogTitle>{isEdit ? "Update" : "Create"} vendor</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Modify the vendor details below."
                : "Fill in the details to create a new vendor."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
              <FormInputItem
                control={form.control}
                name="name"
                label="Name"
                placeholder="Vendor name"
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <div className="flex gap-3 items-center">
                        <Input
                          placeholder="https://example.com/logo.png"
                          {...field}
                        />
                        {imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl}
                            alt="Vendor preview"
                            className="size-9 rounded object-contain border border-input shrink-0 bg-white"
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                            onLoad={(e) =>
                              (e.currentTarget.style.display = "block")
                            }
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 items-end">
                <FormInputItem
                  control={form.control}
                  name="color"
                  label="Color"
                  placeholder="#000000"
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem className="shrink-0">
                      <FormLabel className="sr-only">Color picker</FormLabel>
                      <FormControl>
                        <input
                          type="color"
                          className="h-9 w-10 cursor-pointer rounded border border-input p-0.5"
                          value={field.value || "#000000"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Optional description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
            <AlertDialogTitle>Delete vendor?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The vendor will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={onDeleteVendor}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
