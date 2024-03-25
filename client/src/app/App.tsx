"use client";

import ProductCard from "@/components/ProductCard";
import { commonAPI } from "@/lib/services";
import { useEffect, useState } from "react";
import { Context } from "@/context";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    const response = await commonAPI();
    setProducts(response.data);
  };
  const refetchProducts = () => fetchProducts();
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <Context.Provider value={refetchProducts}>
      <Toaster />
      <section className="p-8 flex flex-wrap gap-4 justify-center items-center">
        {products.map(({ _id, name, price, quantity }) => {
          return (
            <ProductCard
              key={_id}
              id={_id}
              name={name}
              price={price}
              quantity={quantity}
              img={
                "https://images.unsplash.com/photo-1682687220989-cbbd30be37e9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
            />
          );
        })}
      </section>
    </Context.Provider>
  );
}
