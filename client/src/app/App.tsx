"use client";

import ProductCard from "@/components/ProductCard";
import KPICards from "@/components/KPICards";
import DatabaseToggle from "@/components/DatabaseToggle";
import { commonAPI } from "@/lib/services";
import { useEffect, useState } from "react";
import { Context } from "@/context";
import { Toaster } from "@/components/ui/toaster";
import UpdateForm from "@/components/forms/updateForm";
import AddForm from "@/components/forms/addForm";
import AddProduct from "@/components/AddProduct";
import useToastHook from "@/useToastHook";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpens, setIsOpens] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [image, setImage] = useState();
  const [currentDatabase, setCurrentDatabase] = useState<"mongodb" | "d1">(
    "mongodb"
  );
  const { showErrorToast } = useToastHook();
  const fetchProducts = async () => {
    try {
      const response = await commonAPI();
      setProducts(response.data);
    } catch (err: any) {
      showErrorToast(err.message);
    }
  };
  const refetchProducts = () => fetchProducts();

  const handleDatabaseChange = (database: "mongodb" | "d1") => {
    setCurrentDatabase(database);
    // Here you can add logic to switch API endpoints or database connections
    console.log(`Switched to ${database} database`);
    // // Refetch products with new database
    // fetchProducts();
  };

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
      <section className="p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <DatabaseToggle
            onDatabaseChange={handleDatabaseChange}
            currentDatabase={currentDatabase}
          />
          <AddProduct />
        </div>

        <KPICards />

        <div className="flex flex-wrap gap-4">
          {products.map(({ _id, name, price, quantity, image }) => {
            return (
              <ProductCard
                key={_id}
                id={_id}
                name={name}
                price={price}
                quantity={quantity}
                img={image}
              />
            );
          })}
        </div>
        <UpdateForm open={isOpen} setIsOpen={setIsOpen} />
        <AddForm open={isOpens} setIsOpen={setIsOpens} />
      </section>
    </Context.Provider>
  );
}
