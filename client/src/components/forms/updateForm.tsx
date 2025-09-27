"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Context } from "@/context";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { commonAPI } from "@/lib/services";
import { Loader } from "@/components/Loader";
import ImageUpload from "@/components/ImageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useToastHook from "@/useToastHook";

export default function UpdateForm({ open, setIsOpen }: ModalProps) {
  const context = useContext(Context);
  if (!context) {
    throw new Error("UpdateForm must be used within a Context Provider");
  }
  const { currentProduct, refetchProducts, image, setImage } = context;

  const [isLoading, setIsLoading] = useState(false);

  const { showErrorToast, showSuccessToast } = useToastHook();
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(updateSchema),
  });
  const updateProduct = async (data: any) => {
    try {
      const validData = {
        name: data.name || currentProduct.name,
        image: data.image || currentProduct.image,
        price: data.price || currentProduct.price,
        quantity: data.quantity || currentProduct.quantity,
      };
      setIsLoading(true);
      await commonAPI(currentProduct._id, "PUT", validData);
      showSuccessToast("Product Updated Successfully");
      refetchProducts();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while updating the product";
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      form.reset();
      setImage([]);
    }
  };

  useEffect(() => {
    form.setValue("image", image?.[0]?.cdnUrl);
  }, [image?.[0]?.cdnUrl]);

  useEffect(() => {
    form.setValue("name", currentProduct?.name);
    form.setValue("image", currentProduct?.image);
    form.setValue("price", currentProduct?.price);
    form.setValue("quantity", currentProduct?.quantity);
  }, [currentProduct]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setIsOpen(!open);
        form.reset();
        setImage([]);
      }}
    >
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(updateProduct)}
            className="space-y-4 mt-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    <big>Name</big>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Product Name"
                      // defaultValue={currentProduct.name}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <big className="font-semibold ">Price</big>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Product Price"
                      // defaultValue={currentProduct.price}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    <big>Quantity</big>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Product Quantity"
                      // defaultValue={currentProduct.quantity}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    <big>Image</big>
                  </FormLabel>
                  <FormControl>
                    <ImageUpload />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              {isLoading ? <Loader /> : "Update"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export type ModalProps = {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const updateSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name cannot exceed 50 characters"),
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .gte(0, "Price must be greater than or equal to 0"),
  quantity: z.coerce
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .gte(0, "Quantity must be greater than or equal to 0"),
  image: z
    .string({
      required_error: "URL is required",
    })
    .url("Image must be a valid URL"),
});
