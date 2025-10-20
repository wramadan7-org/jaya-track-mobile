import { zustandStorage } from "@/utils/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Product = {
  id: string;
  name: string;
  qty: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

type ProductStore = {
  products: Product[];
  addProduct: (product: Omit<Product, "createdAt" | "updatedAt">) => void;
  updateProduct: (
    id: string,
    updatedProduct: Partial<Omit<Product, "id" | "createdAt">>
  ) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => {
          const now = new Date();
          return {
            products: [
              ...state.products,
              {
                ...product,
                createdAt: now,
                updatedAt: now,
              },
            ],
          };
        }),
      updateProduct: (id, updatedProduct) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, ...updatedProduct, updatedAt: new Date() }
              : product
          ),
        })),
      deleteProduct: (id: string) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
      resetProducts: () => set({ products: [] }),
    }),
    {
      name: "product-store",
      storage: zustandStorage,
      // 🔹 konversi string menjadi Date saat load dari storage
      onRehydrateStorage: () => (state) => {
        if (state?.products) {
          state.products = state.products.map((product) => ({
            ...product,
            createdAt: new Date(product.createdAt),
            updatedAt: new Date(product.updatedAt),
          }));
        }
      },
    }
  )
);
