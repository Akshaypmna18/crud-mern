import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { commonAPI } from "@/lib/services";
import { useContext, useState } from "react";
import { Context, Product } from "@/context";
import { Loader } from "./Loader";
import useToastHook from "@/useToastHook";
import deleteIcon from "@/assets/delete-icon.svg";
import editIcon from "@/assets/edit-icon.svg";

export default function ProductCard({
  name,
  quantity = "0",
  price = "0",
  img,
  id,
  isPriority = false,
}: ProductCardProps) {
  const { showErrorToast, showSuccessToast } = useToastHook();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEd, setIsLoadingEd] = useState(false);

  const context = useContext(Context);
  if (!context) {
    throw new Error("ProductCard must be used within a Context Provider");
  }
  const { refetchProducts, setIsOpen, setCurrentProduct } = context;

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await commonAPI(`/${id}`, "DELETE", id);
      showSuccessToast("Product Deleted Successfully");
      refetchProducts();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the product";
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      setIsLoadingEd(true);
      const response = await commonAPI<Product>(`${id}`);
      setCurrentProduct(response.data);
      setIsOpen(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching the product";
      showErrorToast(errorMessage);
    } finally {
      setIsLoadingEd(false);
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <div className="group relative w-full max-w-80 mx-auto">
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden h-[280px] flex flex-col">
        <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={img}
            alt={name}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={isPriority}
          />
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3
              className="text-sm font-semibold text-gray-900 truncate leading-tight"
              title={name}
            >
              {name}
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(price)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Available:</span>
              <span className="font-medium text-gray-900">
                {quantity} units
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
            <Button
              onClick={() => handleEdit(id)}
              disabled={isLoadingEd}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 hover:shadow-md disabled:opacity-50"
              size="sm"
            >
              {isLoadingEd ? (
                <Loader />
              ) : (
                <>
                  <Image src={editIcon} alt="Edit" className="w-3 h-3 mr-1" />
                  Edit
                </>
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isLoading}
                  variant="destructive"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 hover:shadow-md disabled:opacity-50"
                  size="sm"
                >
                  <Image
                    src={deleteIcon}
                    alt="Delete"
                    className="w-3 h-3 mr-1"
                  />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the product &quot;{name}&quot; from your inventory.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(id)}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isLoading ? <Loader /> : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  name: string;
  quantity: string;
  price: string;
  img: string;
  id: string;
  isPriority?: boolean;
}
