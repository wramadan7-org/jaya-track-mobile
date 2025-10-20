import { zustandStorage } from "@/utils/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./product-store";

export type Sale = {
  id: string;
  store: string;
  area: string;
  items: (Product & { qtySold: number; amountSold: number })[];
  totalAmount: number;
  date: string;
};

type SaleStore = {
  sales: Sale[];
  addSale: (sale: Sale) => void;
  getTotalSalesAmount: () => number;
  resetSales: () => void;
};

export const useSalesStore = create<SaleStore>()(
  persist(
    (set, get) => ({
      sales: [],
      addSale: (sale: Sale) =>
        set((state) => ({ sales: [...state.sales, sale] })),
      getTotalSalesAmount: () =>
        get().sales.reduce((total, sale) => total + (sale.totalAmount || 0), 0),
      resetSales: () => set({ sales: [] }),
    }),
    {
      name: "sales-store",
      storage: zustandStorage,
    }
  )
);
