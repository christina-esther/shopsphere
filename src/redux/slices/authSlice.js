import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import toast from "react-hot-toast";

// Mock users for demo
const MOCK_USERS = [
  { _id: "u1", name: "Admin User", email: "admin@shopsphere.com", password: "admin123", role: "admin", avatar: null },
  { _id: "u2", name: "John Doe", email: "user@shopsphere.com", password: "user123", role: "user", avatar: null },
];

export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("token", data.token);
    return data.user;
  } catch {
    // Mock login fallback
    const user = MOCK_USERS.find(u => u.email === credentials.email && u.password === credentials.password);
    if (user) {
      const { password, ...safeUser } = user;
      localStorage.setItem("token", "mock-token-" + safeUser._id);
      return safeUser;
    }
    return rejectWithValue("Invalid email or password");
  }
});

export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", userData);
    localStorage.setItem("token", data.token);
    return data.user;
  } catch {
    // Mock register fallback
    if (!userData.name || !userData.email || !userData.password) {
      return rejectWithValue("All fields are required");
    }
    const existing = MOCK_USERS.find(u => u.email === userData.email);
    if (existing) return rejectWithValue("Email already in use");
    const newUser = { _id: "u" + Date.now(), name: userData.name, email: userData.email, role: "user", avatar: null };
    localStorage.setItem("token", "mock-token-" + newUser._id);
    return newUser;
  }
});

export const getMe = createAsyncThunk("auth/getMe", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/auth/me");
    return data.user;
  } catch {
    // Check for mock token
    const token = localStorage.getItem("token");
    if (token && token.startsWith("mock-token-")) {
      const userId = token.replace("mock-token-", "");
      const user = MOCK_USERS.find(u => u._id === userId);
      if (user) {
        const { password, ...safeUser } = user;
        return safeUser;
      }
    }
    localStorage.removeItem("token");
    return rejectWithValue("Not authenticated");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, initialized: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
      try { api.post("/auth/logout"); } catch {}
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; toast.success(`Welcome back, ${a.payload.name}! 👋`); })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; toast.error(a.payload); })
      .addCase(registerUser.pending, (s) => { s.loading = true; })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; toast.success(`Welcome to ShopSphere, ${a.payload.name}! 🎉`); })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; toast.error(a.payload); })
      .addCase(getMe.pending, (s) => { s.loading = true; })
      .addCase(getMe.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.initialized = true; })
      .addCase(getMe.rejected, (s) => { s.loading = false; s.initialized = true; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
