import { zustandStorage } from "@/utils/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ShopItem = {
  id: string;
  name: string;
  area: string;
  address?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
};

type ShopStore = {
  data: ShopItem[];
  addShop: (shop: Omit<ShopItem, "createdAt" | "updatedAt">) => void;
  updateShop: (
    id: string,
    newShop: Omit<ShopItem, "id" | "createdAt" | "updatedAt">
  ) => void;
  deleteShop: (id: string) => void;
  resetShops: () => void;
};

export const useShopStore = create<ShopStore>()(
  persist(
    (set, get) => ({
      data: [],
      addShop: (shop) => {
        set((state) => ({
          data: [
            ...state.data,
            {
              ...shop,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        }));
      },
      updateShop: (id, newShop) => {
        set((state) => ({
          data: state.data.map((shop) =>
            shop.id === id
              ? {
                  ...shop,
                  ...newShop,
                  updatedAt: new Date(),
                }
              : shop
          ),
        }));
      },
      deleteShop: (id) => {
        set((state) => ({
          data: state.data.filter((shop) => shop.id !== id),
        }));
      },
      resetShops: () => {
        set({ data: [] });
      },
    }),
    {
      name: "shop-storage",
      storage: zustandStorage,
      onRehydrateStorage: () => (state) => {
        if (state?.data) {
          state.data = state.data.map((shop) => ({
            ...shop,
            createdAt: new Date(shop.createdAt),
            updatedAt: new Date(shop.updatedAt),
          }));
        }
      },
    }
  )
);
