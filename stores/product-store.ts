import { zustandStorage } from "@/utils/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Product = {
  id: string;
  name: string;
  qty: number;
  price: number;
};

type ProductStore = {
  products: Product[];
  addProduct: (product: Product) => void;
  updateQty: (id: string, qty: number) => void;
  resetProducts: () => void;
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product: Product) =>
        set((state) => ({ products: [...state.products, product] })),
      updateQty: (id: string, qty: number) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, qty } : product
          ),
        })),
      resetProducts: () => set({ products: [] }),
    }),
    {
      name: "product-store",
      storage: zustandStorage,
    }
  )
);
