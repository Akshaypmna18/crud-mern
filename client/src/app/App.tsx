"use client";

import React, { useEffect } from "react";
import axios from "axios";

const getProducts = async () => {
  const response = await axios.get("http://localhost:8080/products");
  console.log(response);
};

export default function Home() {
  useEffect(() => {
    getProducts();
  }, []);
  return <></>;
}
