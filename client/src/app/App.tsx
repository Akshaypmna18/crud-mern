"use client";

import React, { useEffect } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  console.log(response);
};

export default function Home() {
  useEffect(() => {
    getProducts();
  }, []);
  return <></>;
}
