import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
};

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: getInitialTheme(),
    mobileMenuOpen: false,
    searchOpen: false,
    authModalOpen: false,
    authModalTab: "login",
  },
  reducers: {
    toggleTheme: (s) => {
      s.theme = s.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", s.theme);
      document.documentElement.classList.toggle("dark", s.theme === "dark");
    },
    setTheme: (s, a) => {
      s.theme = a.payload;
      localStorage.setItem("theme", a.payload);
      document.documentElement.classList.toggle("dark", a.payload === "dark");
    },
    toggleMobileMenu: (s) => { s.mobileMenuOpen = !s.mobileMenuOpen; },
    closeMobileMenu: (s) => { s.mobileMenuOpen = false; },
    toggleSearch: (s) => { s.searchOpen = !s.searchOpen; },
    closeSearch: (s) => { s.searchOpen = false; },
    openAuthModal: (s, a) => { s.authModalOpen = true; s.authModalTab = a.payload || "login"; },
    closeAuthModal: (s) => { s.authModalOpen = false; },
    setAuthTab: (s, a) => { s.authModalTab = a.payload; },
  },
});

export const {
  toggleTheme, setTheme, toggleMobileMenu, closeMobileMenu,
  toggleSearch, closeSearch, openAuthModal, closeAuthModal, setAuthTab,
} = uiSlice.actions;
export default uiSlice.reducer;
