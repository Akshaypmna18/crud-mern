import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { commonAPI } from "@/lib/services";
import { useContext, useState } from "react";
import { Context } from "@/context";
import { Loader } from "./Loader";
import { useToast } from "@/components/ui/use-toast";

export default function ProductCard({
  name,
  quantity = "0",
  price = "0",
  img,
  id,
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEd, setIsLoadingEd] = useState(false);
  const { refetchProducts, setIsOpen, setCurrentProduct } = useContext(Context);
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await commonAPI(`/${id}`, "DELETE", id);
      toast({
        variant: "success",
        title: "Product Deleted Successfully",
        duration: 2500,
      });
      refetchProducts();
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleEdit = async (id) => {
    try {
      setIsLoadingEd(true);
      const response = await commonAPI(`${id}`);
      setCurrentProduct(response.data);
      setIsOpen(true);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoadingEd(false);
    }
  };
  return (
    <CardContainer>
      <CardBody className="bg-secondary relative group/card border w-auto max-w-[20rem] h-auto rounded-xl pb-6 px-4">
        <CardItem translateZ="20" className="w-full mt-4">
          <Image
            src={img}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <CardItem
          translateZ="10"
          className="text-2xl font-bold mt-4 capitalize text-center"
        >
          {name}
        </CardItem>
        <div className="flex justify-between mt-2 items-center px-8">
          <CardItem translateZ="20" className="text-lg">
            ₹ {price}
          </CardItem>
          <CardItem translateZ="20" className="text-lg">
            Quantity: {quantity}
          </CardItem>
        </div>
        <div className="flex justify-between items-center mt-4">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  fill="currentColor"
                  className="mr-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                </svg>{" "}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  fill="currentColor"
                  className="mr-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
                Delete
              </>
            )}
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
