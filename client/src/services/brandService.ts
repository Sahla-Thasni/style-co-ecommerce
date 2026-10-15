import api from "./api";

export interface Brand {
  id: number;
  name: string;
}

export const getBrands = async () => {
  const response = await api.get("/products/brands/");
  return response.data;
};
