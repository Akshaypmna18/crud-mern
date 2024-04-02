"use client";

import ProductCard from "@/components/ProductCard";
import { commonAPI } from "@/lib/services";
import { useEffect, useState } from "react";
import { Context } from "@/context";
import { Toaster } from "@/components/ui/toaster";
import UpdateForm from "@/components/forms/updateForm";
import AddForm from "@/components/forms/addForm";
import AddProduct from "@/components/AddProduct";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpens, setIsOpens] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [image, setImage] = useState();
  const { toast } = useToast();
  const fetchProducts = async () => {
    try {
      const response = await commonAPI();
      setProducts(response.data);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Ohoh Something went wrong",
        description: err.message,
        duration: 2500,
      });
    }
  };
  const refetchProducts = () => fetchProducts();
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <Context.Provider
      value={{
        refetchProducts,
        setIsOpen,
        setCurrentProduct,
        currentProduct,
        setIsOpens,
        setImage,
        image,
      }}
    >
      <Toaster />
      <AddProduct />
      <section className="p-8 flex flex-wrap gap-4 justify-center items-center">
        {products.map(({ _id, name, price, quantity, image }) => {
          return (
            <ProductCard
              key={_id}
              id={_id}
              name={name}
              price={price}
              quantity={quantity}
              img={
                image ||
                "https://media.cheggcdn.com/media/8f8/8f8d8ae8-36b5-447e-947c-076618279a3d/php1KnYTm"
              }
            />
          );
        })}
        <UpdateForm open={isOpen} setIsOpen={setIsOpen} />
        <AddForm open={isOpens} setIsOpen={setIsOpens} />
      </section>
    </Context.Provider>
  );
}
