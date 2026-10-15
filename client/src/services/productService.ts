import api from "./api";

import type { Product } from "../types/product";

// Get all products
export const getProducts = async (search?: string): Promise<Product[]> => {
  const response = await api.get("/products/", {
    params: search ? { search } : {},
  });

  return response.data;
};

// Get top-selling products
export const getTopSellingProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products/top-selling/");
  return response.data;
};

// Get all categories
export const getCategories = async () => {
  const response = await api.get("/products/categories/");
  return response.data;
};
