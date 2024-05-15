import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { Context } from "@/context";

function AddProduct() {
  const { setIsOpens } = useContext(Context);

  return (
    <Button
      onClick={() => setIsOpens(true)}
      className="text-4xl font-bold p-0 rounded-full aspect-square w-12 h-12 grid place-items-center"
    >
      <span>+</span>
    </Button>
  );
}

export default AddProduct;
