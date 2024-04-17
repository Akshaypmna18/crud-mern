import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { Context } from "@/context";

function AddProduct() {
  const { setIsOpens } = useContext(Context);

  return (
    <Button onClick={() => setIsOpens(true)} className="mx-auto mt-8 block">
      Add Product
    </Button>
  );
}

export default AddProduct;
