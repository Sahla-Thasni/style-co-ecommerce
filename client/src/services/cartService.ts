import api from "./api";

export const addToCart = async (variant: number, quantity: number) => {
  const response = await api.post("/cart/add/", {
    variant,
    quantity,
  });

  return response.data;
};

export const getCart = async () => {
  const response = await api.get("/cart/");

  return response.data;
};

export const removeCartItem = async (itemId: number) => {
  const response = await api.delete(`/cart/items/${itemId}/`);

  return response.data;
};

// Make the backend cart match the frontend cart
export const syncCart = async (
  items: {
    variant: number;
    quantity: number;
  }[],
) => {
  // Get existing backend cart
  const backendCart = await getCart();

  // Remove old backend cart items
  if (backendCart.items?.length) {
    await Promise.all(
      backendCart.items.map((item: { id: number }) => removeCartItem(item.id)),
    );
  }

  // Add current frontend cart items
  await Promise.all(
    items.map((item) => addToCart(item.variant, item.quantity)),
  );
};
