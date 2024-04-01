import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Context } from "@/context";
import { Dispatch, SetStateAction, useContext, useState } from "react";
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

export type ModalProps = {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function DialogModal({ open, setIsOpen }: ModalProps) {
  const { currentProduct, refetchProducts } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    mode: "onChange",
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
      await commonAPI(currentProduct.id, "POST", validData);
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
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setIsOpen(!open);
        form.reset();
      }}
    >
      <DialogContent>
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
                      defaultValue={currentProduct.name}
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
                      defaultValue={currentProduct.price}
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
                      defaultValue={currentProduct.quantity}
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
                  <FormControl></FormControl>
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
