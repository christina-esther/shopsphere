import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import toast from "react-hot-toast";

let mockWishlistIds = [];

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async () => {
  try {
    const { data } = await api.get("/wishlist");
    return data.wishlist;
  } catch {
    return [];
  }
});

export const toggleWishlist = createAsyncThunk("wishlist/toggle", async (productId, { getState }) => {
  const wasIn = getState().wishlist.ids.includes(productId);
  try {
    const { data } = await api.post(`/wishlist/toggle/${productId}`);
    toast(wasIn ? "Removed from wishlist" : "Added to wishlist ❤️", { icon: wasIn ? "💔" : "❤️" });
    return { ids: data.wishlist, wasIn };
  } catch {
    // Mock fallback
    if (wasIn) {
      mockWishlistIds = mockWishlistIds.filter(id => id !== productId);
    } else {
      mockWishlistIds.push(productId);
    }
    toast(wasIn ? "Removed from wishlist" : "Added to wishlist ❤️", { icon: wasIn ? "💔" : "❤️" });
    return { ids: [...mockWishlistIds], wasIn };
  }
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], ids: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (s, a) => {
        s.items = a.payload;
        s.ids = a.payload.map ? a.payload.map((p) => p._id || p) : [];
      })
      .addCase(toggleWishlist.fulfilled, (s, a) => {
        s.ids = a.payload.ids || [];
      });
  },
});

export default wishlistSlice.reducer;
