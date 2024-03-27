import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Context } from "@/context";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DialogModal({ open, setIsOpen }) {
  const { currentProduct } = useContext(Context);
  const defaultValues = {
    name: currentProduct.name,
    price: currentProduct.price,
    quantity: currentProduct.quantity,
  };
  const form = useForm({ defaultValues, mode: "onChange" });
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        console.log(currentProduct);
        setIsOpen(!open);
        form.reset();
      }}
    >
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              console.log(data);
              setIsOpen(false);
              form.reset();
            })}
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
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
