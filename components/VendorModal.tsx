"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { assetVendorClient } from "@/clients/AssetVendorClient";
import { FormColorInputItem } from "@/components/input/color";
import { FormInputItem } from "@/components/input/input";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import VendorStyleDrawingPreview from "@/components/VendorStyleDrawingPreview";
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
  bgColor: z.union([
    z.literal(""),
    z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g. #FF5733)"),
  ]),
  accentColor: z.union([
    z.literal(""),
    z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g. #FF5733)"),
  ]),
  secondaryButtonColor: z.union([
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
      bgColor: "",
      accentColor: "",
      secondaryButtonColor: "",
      imageUrl: "",
      description: "",
    },
  });

  const imageUrl = form.watch("imageUrl");
  const vendorName = form.watch("name");
  const textColor = form.watch("color");
  const backgroundColor = form.watch("bgColor");
  const accentColor = form.watch("accentColor");
  const secondaryButtonColor = form.watch("secondaryButtonColor");

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
        bgColor: vendor.style?.bgColor ?? "",
        accentColor: vendor.style?.accentColor ?? "",
        secondaryButtonColor: vendor.style?.secondaryButtonColor ?? "",
        imageUrl: vendor.style?.image ?? "",
        description: vendor.description ?? "",
      });
    } else {
      reset({
        name: "",
        color: "",
        bgColor: "",
        accentColor: "",
        secondaryButtonColor: "",
        imageUrl: "",
        description: "",
      });
    }
  }, [vendor, open, reset]);

  const onFormSubmit = async (data: FormValues) => {
    try {
      const normalizedStyle = {
        color: data.color || null,
        bgColor: data.bgColor || null,
        accentColor: data.accentColor || null,
        secondaryButtonColor: data.secondaryButtonColor || null,
        image: data.imageUrl || null,
      };

      const hasStyleValue = Object.values(normalizedStyle).some(Boolean);

      const payload = {
        name: data.name,
        style: hasStyleValue
          ? normalizedStyle
          : vendor?.id
            ? {
                color: null,
                bgColor: null,
                accentColor: null,
                secondaryButtonColor: null,
                image: null,
              }
            : undefined,
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
        <DialogContent className="sm:w-fit sm:max-w-fit">
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
              <div className="flex flex-col sm:flex-row gap-8 flex-wrap sm:flex-nowrap items-center">
                <div className="flex flex-col gap-4 sm:w-fit items-center sm:items-start">
                  <FormColorInputItem
                    control={form.control}
                    name="color"
                    label="Text color"
                    placeholder="#000000"
                    pickerDefault="#000000"
                    pickerLabel="Color picker"
                  />

                  <FormColorInputItem
                    control={form.control}
                    name="bgColor"
                    label="Background color"
                    placeholder="#ffffff"
                    pickerDefault="#ffffff"
                    pickerLabel="Background color picker"
                  />

                  <FormColorInputItem
                    control={form.control}
                    name="accentColor"
                    label="Accent color"
                    placeholder="#ffffff"
                    pickerDefault="#ffffff"
                    pickerLabel="Accent color picker"
                  />

                  <FormColorInputItem
                    control={form.control}
                    name="secondaryButtonColor"
                    label="Secondary button color"
                    placeholder="#ffffff"
                    pickerDefault="#ffffff"
                    pickerLabel="Secondary button color picker"
                  />
                </div>
                <VendorStyleDrawingPreview
                  vendorName={vendorName}
                  color={textColor}
                  bgColor={backgroundColor}
                  accentColor={accentColor}
                  secondaryButtonColor={secondaryButtonColor}
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

              <ModalActionFooter
                isEdit={isEdit}
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
                submitLabel={isEdit ? "Update" : "Create"}
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
        title="Delete vendor?"
        description="This action cannot be undone. The vendor will be permanently deleted."
        onConfirm={onDeleteVendor}
      />
    </>
  );
}
