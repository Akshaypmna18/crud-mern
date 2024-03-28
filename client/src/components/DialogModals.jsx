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
import { useState } from "react";
import { useContext } from "react";
import { Context } from "@/context";

export default function DialogModal({ open, setIsOpen }) {
  const { refetchProducts } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const addProduct = async (data) => {
    try {
      setIsLoading(true);
      await commonAPI("", "POST", data);
      toast({
        variant: "success",
        title: "Product Added Successfully",
        duration: 2500,
      });
      refetchProducts();
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      form.reset();
    }
  };
  const defaultValues = {
    name: "",
    price: "",
    quantity: "",
  };
  const form = useForm({ defaultValues, mode: "onChange" });
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
            onSubmit={form.handleSubmit(addProduct)}
            className="space-y-4 mt-6"
          >
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: { value: true, message: "This is required*" },
              }}
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
              rules={{
                required: { value: true, message: "This is required*" },
              }}
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
              rules={{
                required: { value: true, message: "This is required*" },
              }}
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
            <Button className="w-full" type="submit">
              {isLoading ? <Loader /> : "Add"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
