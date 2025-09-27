"use client";

import ProductCard from "@/components/ProductCard";
import KPICards from "@/components/KPICards";
import DatabaseToggle from "@/components/DatabaseToggle";
import { commonAPI } from "@/lib/services";
import { useEffect, useState } from "react";
import { Context, Product, productToCardProps } from "@/context";
import { Toaster } from "@/components/ui/toaster";
import UpdateForm from "@/components/forms/updateForm";
import AddForm from "@/components/forms/addForm";
import AddProduct from "@/components/AddProduct";
import useToastHook from "@/useToastHook";

export default function Home() {
  const { showErrorToast } = useToastHook();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpens, setIsOpens] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    _id: "",
    name: "",
    price: 0,
    quantity: 0,
    image: "",
  });
  const [image, setImage] = useState<any[]>([]);
  const [currentDatabase, setCurrentDatabase] = useState<"mongodb" | "d1">(
    "mongodb"
  );
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [kpiLoading, setKpiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await commonAPI<Product[]>();
      setProducts(response.data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching products";
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchKPIs = async () => {
    try {
      setKpiLoading(true);
      const response = await commonAPI<KPIData>("kpi");
      setKpiData(response.data as KPIData);
      setError(null);
    } catch (err) {
      console.error("Error fetching KPIs:", err);
      setError("Failed to load KPI data");
    } finally {
      setKpiLoading(false);
    }
  };

  const refetchProducts = () => fetchProducts();
  const refetchKPI = () => fetchKPIs();

  const handleDatabaseChange = (database: "mongodb" | "d1") => {
    setCurrentDatabase(database);
    // Here you can add logic to switch API endpoints or database connections
    console.log(`Switched to ${database} database`);
    // // Refetch products with new database
    // fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
    fetchKPIs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Context.Provider
      value={{
        refetchProducts,
        refetchKPI,
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

        <KPICards kpiData={kpiData} loading={kpiLoading} error={error} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-items-center">
          {isLoading
            ? // Skeleton loading for products
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="group relative w-full max-w-80 mx-auto"
                >
                  <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg overflow-hidden h-[280px] flex flex-col animate-pulse">
                    {/* Image skeleton */}
                    <div className="relative h-32 w-full bg-gray-200"></div>

                    {/* Content skeleton */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        {/* Title skeleton */}
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>

                        {/* Price skeleton */}
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>

                        {/* Quantity skeleton */}
                        <div className="flex items-center justify-between">
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                          <div className="h-3 bg-gray-200 rounded w-12"></div>
                        </div>
                      </div>

                      {/* Buttons skeleton */}
                      <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                        <div className="flex-1 h-8 bg-gray-200 rounded-xl"></div>
                        <div className="flex-1 h-8 bg-gray-200 rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : products?.map((product, index) => {
                const cardProps = productToCardProps(product);
                return (
                  <ProductCard
                    key={product._id}
                    {...cardProps}
                    isPriority={index < 3} // Prioritize first 3 images for LCP
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

interface KPIData {
  totalProducts: number;
  totalValue: number;
  totalUnits: number;
}
