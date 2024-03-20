"use client";

import React, { useEffect } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getProducts = async () => {
  const response = await axios.get(`${API_URL}`);
  console.log(response);
};
// const getProduct = async () => {
//   const response = await axios.get(
//     `${API_URL}/65f9a8af693e1f025eac90ba`
//   );
//   console.log(response);
// };
// const deleteProduct = async () => {
//   const response = await axios.delete(`${API_URL}/65f9a8af693e1f025eac90ba`);
//   console.log(response);
// };

export default function Home() {
  useEffect(() => {
    getProducts();
  }, []);
  return <></>;
}
