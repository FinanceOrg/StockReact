"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { assetClient } from "@/clients/AssetClient";
import { FormInputItem } from "@/components/input/input";
import { FormSelectItem } from "@/components/input/select";
import DeleteConfirmDialog from "@/components/modal/DeleteConfirmDialog";
import ModalActionFooter from "@/components/modal/ModalActionFooter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { Asset, AssetVendor, Category } from "@/types/domain";

const assetEditSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  categoryId: z.number({ message: "Category is required" }).int(),
  vendorId: z.number({ message: "Vendor is required" }).int(),
});

type FormValues = z.infer<typeof assetEditSchema>;

type Props = {
  asset: Asset;
  categories: Category[];
  vendors: AssetVendor[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (asset: Asset) => void;
};

export default function AssetEditModal({
  asset,
  categories,
  vendors,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(assetEditSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: undefined,
      vendorId: undefined,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (!open) return;
    reset({
      name: asset.name,
      description: asset.description ?? "",
      categoryId: asset.category.id,
      vendorId: asset.vendor.id,
    });
  }, [open, asset, reset]);

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: String(c.id),
  }));

  const vendorOptions = vendors.map((v) => ({
    label: v.name,
    value: String(v.id),
  }));

  const onFormSubmit = async (data: FormValues) => {
    try {
      await assetClient.update(String(asset.id), {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        vendorId: data.vendorId,
      });

      const updatedCategory =
        categories.find((category) => category.id === data.categoryId) ??
        asset.category;
      const updatedVendor =
        vendors.find((vendor) => vendor.id === data.vendorId) ?? asset.vendor;

      onSuccess?.({
        ...asset,
        name: data.name,
        description: data.description,
        category: updatedCategory,
        vendor: updatedVendor,
      });

      onOpenChange(false);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteAsset = async () => {
    try {
      setIsDeleting(true);
      await assetClient.delete(String(asset.id));
      router.push("/");
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
            <DialogTitle>Edit asset</DialogTitle>
            <DialogDescription>
              Update the asset details below.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
              <FormInputItem
                control={form.control}
                name="name"
                label="Name"
                placeholder="Asset name"
              />

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

              <FormSelectItem
                control={form.control}
                name="categoryId"
                label="Category"
                placeholder="Select a category"
                options={categoryOptions}
                parseValue={(v) => Number(v) as FormValues["categoryId"]}
                formatValue={(v) => String(v ?? "")}
              />

              <FormSelectItem
                control={form.control}
                name="vendorId"
                label="Vendor"
                placeholder="Select a vendor"
                options={vendorOptions}
                parseValue={(v) => Number(v) as FormValues["vendorId"]}
                formatValue={(v) => String(v ?? "")}
              />

              <ModalActionFooter
                isEdit={true}
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
                submitLabel="Update"
                onCancel={() => onOpenChange(false)}
                onDelete={() => setIsDeleteConfirmOpen(true)}
              />
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete asset"
        description={`Are you sure you want to delete "${asset.name}"? This action cannot be undone.`}
        onConfirm={onDeleteAsset}
      />
    </>
  );
}
