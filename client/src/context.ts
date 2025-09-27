import { createContext } from "react";

export const Context = createContext<AppContextType | null>(null);

export const productToCardProps = (product: Product) => ({
  id: product._id,
  name: product.name,
  price: String(product.price),
  quantity: String(product.quantity),
  img: product.image,
});

export interface Product {
  _id: string;
  name: string;
  price: string | number;
  quantity: string | number;
  image: string;
}

export interface AppContextType {
  refetchProducts: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setCurrentProduct: (product: Product) => void;
  currentProduct: Product;
  setIsOpens: (isOpens: boolean) => void;
  setImage: (image: any[]) => void;
  image: any[];
}
