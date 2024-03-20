import { commonAPI } from "./services";

export const getProducts = async () => commonAPI();

export const getProduct = async () => commonAPI("65fa712e1872cf2fdb003b2b");

export const deleteProduct = async () =>
  commonAPI("65fa791a6cac9ae1bd09e460", "DELETE");

export const addProduct = async () => commonAPI("", "POST", { name: "Akshay" });

export const updateProduct = async () =>
  commonAPI("65fa79a0dd6c85ea92dc6e8a", "PUT", { name: "Achu" });
