import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import toast from "react-hot-toast";

// In-memory cart for mock mode
let mockCart = { items: [] };

const isMockMode = () => !localStorage.getItem("token") || localStorage.getItem("token")?.startsWith("mock-token-");

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  try {
    const { data } = await api.get("/cart");
    return data.cart;
  } catch {
    return mockCart;
  }
});

export const addToCart = createAsyncThunk("cart/add", async (item, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/cart/add", item);
    return data.cart;
  } catch {
    // Mock fallback
    const { MOCK_PRODUCTS } = await import("../../services/mockData");
    const product = MOCK_PRODUCTS.find(p => p._id === item.productId);
    if (!product) return rejectWithValue("Product not found");
    const existing = mockCart.items.find(i => i.product?._id === item.productId);
    if (existing) {
      existing.quantity += (item.quantity || 1);
    } else {
      mockCart.items.push({ _id: "ci-" + Date.now(), product, quantity: item.quantity || 1 });
    }
    return { ...mockCart };
  }
});

export const updateCartItem = createAsyncThunk("cart/update", async ({ itemId, quantity }) => {
  try {
    const { data } = await api.put(`/cart/item/${itemId}`, { quantity });
    return data.cart;
  } catch {
    const item = mockCart.items.find(i => i._id === itemId);
    if (item) item.quantity = quantity;
    return { ...mockCart };
  }
});

export const removeFromCart = createAsyncThunk("cart/remove", async (itemId) => {
  try {
    const { data } = await api.delete(`/cart/item/${itemId}`);
    return data.cart;
  } catch {
    mockCart.items = mockCart.items.filter(i => i._id !== itemId);
    return { ...mockCart };
  }
});

export const clearCartAsync = createAsyncThunk("cart/clear", async () => {
  try {
    await api.delete("/cart/clear");
  } catch {}
  mockCart = { items: [] };
  return { items: [] };
});

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], loading: false, cartOpen: false },
  reducers: {
    toggleCart: (s) => { s.cartOpen = !s.cartOpen; },
    closeCart: (s) => { s.cartOpen = false; },
    openCart: (s) => { s.cartOpen = true; },
  },
  extraReducers: (builder) => {
    const setCart = (s, a) => { s.loading = false; if (a.payload) { s.items = a.payload.items || []; } };
    builder
      .addCase(fetchCart.pending, (s) => { s.loading = true; })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, (s) => { s.loading = false; })
      .addCase(addToCart.pending, (s) => { s.loading = true; })
      .addCase(addToCart.fulfilled, (s, a) => {
        setCart(s, a);
        toast.success("Added to cart! 🛒");
        s.cartOpen = true;
      })
      .addCase(addToCart.rejected, (s, a) => { s.loading = false; toast.error(a.payload || "Failed to add"); })
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeFromCart.fulfilled, (s, a) => { setCart(s, a); toast.success("Item removed"); })
      .addCase(clearCartAsync.fulfilled, (s) => { s.items = []; });
  },
});

export const { toggleCart, closeCart, openCart } = cartSlice.actions;

export const selectCartItemCount = (state) =>
  state.cart.items.filter((i) => !i.savedForLater).reduce((sum, i) => sum + i.quantity, 0);

export const selectCartTotal = (state) =>
  state.cart.items
    .filter((i) => !i.savedForLater)
    .reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

export default cartSlice.reducer;
