import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "./Loader";
import { useContext, useEffect, useState } from "react";
import { ModalProps, updateSchema as addSchema } from "./DialogModal";
import { Context } from "@/context";
import ImageUpload from "./ImageUpload";
import { zodResolver } from "@hookform/resolvers/zod";

export default function DialogModal({ open, setIsOpen }: ModalProps) {
  const { refetchProducts, image, setImage } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const addProduct = async (data: any) => {
    try {
      setIsLoading(true);
      await commonAPI("", "POST", data);
      toast({
        variant: "success",
        title: "Product Added Successfully",
        duration: 2500,
      });
      refetchProducts();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Ohoh Something went wrong",
        description: err.message,
        duration: 2500,
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      form.reset();
      setImage(undefined);
    }
  };
  const defaultValues = {
    name: "",
    price: "",
    quantity: "",
    image: "",
  };
  const form = useForm({
    defaultValues,
    resolver: zodResolver(addSchema),
    mode: "onChange",
  });
  const imageUrl = form.watch("image");
  useEffect(() => {
    form.setValue("image", image?.[0]?.cdnUrl);
  }, [image?.[0]?.cdnUrl]);
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setIsOpen(!open);
        form.reset();
        setImage(undefined);
      }}
    >
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(addProduct)}
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
                    <>
                      <ImageUpload />
                      <Input
                        type="url"
                        className="opacity-0 w-0 h-0 m-0 p-0"
                        {...field}
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={imageUrl ? false : true}
              className="w-full"
              type="submit"
            >
              {isLoading ? <Loader /> : "Add"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
