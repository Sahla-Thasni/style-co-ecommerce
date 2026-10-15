import api from "./api";

export interface CheckoutData {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  emirate: string;
  postal_code: string;
  payment_method: string;
  promo_code?: string;
}

export const createOrder = async (checkoutData: CheckoutData) => {
  const response = await api.post("/orders/checkout/", checkoutData);

  return response.data;
};

export const getOrders = async () => {
  const response = await api.get("/orders/");
  return response.data;
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const response = await api.patch(`/orders/${orderId}/status/`, { status });

  return response.data;
};
