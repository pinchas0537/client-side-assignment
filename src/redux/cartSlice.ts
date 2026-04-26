import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Item } from "../types";

export interface CartItem extends Item {
  cartQuantity: number;
}

interface CartState {
  cartItems: CartItem[];
  totalPrice: number;
}

const initialState: CartState = {
  cartItems: [],
  totalPrice: 0,
};

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((total, item) => total + item.price * item.cartQuantity, 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ item: Item; quantity: number }>) => {
      const { item, quantity } = action.payload;
      const existingItem = state.cartItems.find((i) => i._id === item._id);

      if (existingItem) {
        existingItem.cartQuantity += quantity;
      } else {
        state.cartItems.push({ ...item, cartQuantity: quantity });
      }
      
      state.totalPrice = calculateTotal(state.cartItems);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((item) => item._id !== action.payload);
      state.totalPrice = calculateTotal(state.cartItems);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === id);
      
      if (existingItem) {
        if (quantity <= 0) {
          state.cartItems = state.cartItems.filter((item) => item._id !== id);
        } else {
          existingItem.cartQuantity = quantity;
        }
      }
      
      state.totalPrice = calculateTotal(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
