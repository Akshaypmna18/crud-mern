import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { Context } from "@/context";
import { PlusIcon } from "@radix-ui/react-icons";

function AddProduct() {
  const { setIsOpens } = useContext(Context);

  return (
    <Button
      onClick={() => setIsOpens(true)}
      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
    >
      <PlusIcon className="w-4 h-4" />
      <span className="font-medium">Add Product</span>
    </Button>
  );
}

export default AddProduct;
