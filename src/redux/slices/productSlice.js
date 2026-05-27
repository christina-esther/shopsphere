import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { filterMockProducts } from "../../services/mockData";

export const fetchProducts = createAsyncThunk("products/fetchAll", async (params) => {
  try {
    const { data } = await api.get("/products", { params });
    return data;
  } catch {
    // Fallback to mock data when backend is unavailable
    return filterMockProducts(params || {});
  }
});

export const fetchProduct = createAsyncThunk("products/fetchOne", async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data;
  } catch {
    // Mock fallback
    const { MOCK_PRODUCTS } = await import("../../services/mockData");
    const product = MOCK_PRODUCTS.find(p => p._id === id || p.slug === id);
    if (!product) throw new Error("Product not found");
    return { product, reviews: [], related: MOCK_PRODUCTS.filter(p => p.category?.slug === product.category?.slug && p._id !== product._id).slice(0, 4) };
  }
});

export const fetchSearchSuggestions = createAsyncThunk("products/suggestions", async (q) => {
  try {
    const { data } = await api.get("/products/suggestions", { params: { q } });
    return data.suggestions;
  } catch {
    const { MOCK_PRODUCTS } = await import("../../services/mockData");
    return MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6);
  }
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    total: 0,
    pages: 1,
    page: 1,
    currentProduct: null,
    relatedProducts: [],
    reviews: [],
    suggestions: [],
    loading: false,
    productLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentProduct: (s) => { s.currentProduct = null; s.relatedProducts = []; s.reviews = []; },
    clearSuggestions: (s) => { s.suggestions = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.products;
        s.total = a.payload.total;
        s.pages = a.payload.pages;
        s.page = a.payload.page;
      })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(fetchProduct.pending, (s) => { s.productLoading = true; })
      .addCase(fetchProduct.fulfilled, (s, a) => {
        s.productLoading = false;
        s.currentProduct = a.payload.product;
        s.relatedProducts = a.payload.related;
        s.reviews = a.payload.reviews;
      })
      .addCase(fetchProduct.rejected, (s) => { s.productLoading = false; })
      .addCase(fetchSearchSuggestions.fulfilled, (s, a) => { s.suggestions = a.payload; });
  },
});

export const { clearCurrentProduct, clearSuggestions } = productSlice.actions;
export default productSlice.reducer;
