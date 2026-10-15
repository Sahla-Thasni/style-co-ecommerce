import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  variant: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const storedCart = localStorage.getItem("cart");

const initialState: CartState = {
  items: storedCart ? JSON.parse(storedCart) : [],
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.variant === action.payload.variant,
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    // Update the quantity of an existing cart item
    updateQuantity: (
      state,
      action: PayloadAction<{
        variant: number;
        quantity: number;
      }>,
    ) => {
      const item = state.items.find(
        (item) => item.variant === action.payload.variant,
      );

      if (item) {
        item.quantity = action.payload.quantity;
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    // Remove an item from the cart
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.variant !== action.payload,
      );

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    // Clear the cart after a successful order
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
