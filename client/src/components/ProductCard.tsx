import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { commonAPI } from "@/lib/services";
import { useContext, useState } from "react";
import { Context } from "@/context";
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
}: {
  name: string;
  quantity: string;
  price: string;
  img: string;
  id: string;
}) {
  const { showErrorToast, showSuccessToast } = useToastHook();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEd, setIsLoadingEd] = useState(false);
  const { refetchProducts, setIsOpen, setCurrentProduct } = useContext(Context);
  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await commonAPI(`/${id}`, "DELETE", id);
      showSuccessToast("Product Deleted Successfully");
      refetchProducts();
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleEdit = async (id: string) => {
    try {
      setIsLoadingEd(true);
      const response = await commonAPI(`${id}`);
      setCurrentProduct(response.data);
      setIsOpen(true);
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setIsLoadingEd(false);
    }
  };
  return (
    <CardContainer className="w-[min(100%,20rem)]">
      <CardBody className="bg-secondary relative group/card h-auto rounded-xl p-2 flex gap-x-2 items-center">
        <div className="max-w-[45%]">
          <CardItem translateZ="20">
            <Image
              src={img}
              height="1000"
              width="1000"
              className="object-cover rounded-xl aspect-square group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
        </div>{" "}
        <div>
          <CardItem
            translateZ="10"
            className="text-2xl font-bold capitalize text-center"
          >
            {name}
          </CardItem>
          <div className="flex justify-between gap-4 mt-2 items-center">
            <CardItem translateZ="20" className="text-lg">
              ₹ {price}
            </CardItem>
            <CardItem translateZ="20" className="text-lg">
              Quantity: {quantity}
            </CardItem>
          </div>
          <div className="flex justify-between items-center gap-4">
            <CardItem
              translateZ={10}
              as={Button}
              href="https://twitter.com/mannupaaji"
              target="__blank"
              className="bg-blue-900/90 hover:bg-blue-900"
              onClick={() => handleEdit(id)}
            >
              {isLoadingEd ? (
                <Loader />
              ) : (
                <>
                  <Image src={editIcon} alt="delete-icon" className="mr-1 " />
                  Edit
                </>
              )}
            </CardItem>
            <CardItem
              translateZ={10}
              as={Button}
              className="bg-red-900/90 hover:bg-red-900"
              onClick={() => handleDelete(id)}
            >
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <Image src={deleteIcon} alt="delete-icon" className="mr-1 " />
                  Delete
                </>
              )}
            </CardItem>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
}
