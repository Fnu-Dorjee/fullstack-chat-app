
import { create } from "zustand";

const savedTheme = localStorage.getItem("chat-theme") || "cupcake";
document.documentElement.setAttribute("data-theme", savedTheme);

export const useThemeStore = create((set) => ({
  theme: savedTheme,
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },
}));
