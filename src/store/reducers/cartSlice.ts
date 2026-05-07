import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  nom: string;
  prix: number;
  image: string;
  category?: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  sessionId: string;
  isSwitchOn: boolean;
  orders: any[];
}

// Generate or retrieve a unique session ID for anonymous cart
function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("cart_session_id");
  if (!sid) {
    sid = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("cart_session_id", sid);
  }
  return sid;
}

const initialState: CartState = {
  items: [],
  sessionId: getOrCreateSessionId(),
  isSwitchOn: false,
  orders: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart(state) {
      state.items = [];
    },
    toggleSwitch(state) {
      state.isSwitchOn = !state.isSwitchOn;
    },
  },
});

export const {
  setItems,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  toggleSwitch,
} = cartSlice.actions;

export default cartSlice.reducer;
