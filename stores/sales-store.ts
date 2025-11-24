import { zustandStorage } from "@/utils/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useProductStore, type Product } from "./product-store";

export type Sale = {
  id: string;
  store: string;
  area: string;
  items: (Product & {
    qtySold: number;
    amountSold: number;
    unitType: "dozens" | "sack";
    subtotal: number;
  })[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

type SaleStore = {
  sales: Sale[];
  addSale: (
    sale: Omit<Sale, "totalAmount" | "createdAt" | "updatedAt">
  ) => void;
  updateSale: (
    id: string,
    newSale: Omit<Sale, "id" | "createdAt" | "updatedAt">
  ) => void;
  deleteSale: (id: string) => void;
  getTodayProfit: () => number;
  getTodayNetProfit: (operationalCost: number) => number;
  resetSales: () => void;
};

export const useSalesStore = create<SaleStore>()(
  persist(
    (set, get) => ({
      sales: [],
      addSale: (sale) =>
        set((state) => {
          const productStore = useProductStore.getState();

          // 🔹 Hitung total amount + update stok produk
          let computedTotal = 0;

          // 🔽 Update stok produk berdasarkan item yang dijual
          sale.items.forEach((item) => {
            let subtotal = 0;
            const currentProduct = productStore.products.find(
              (p) => p?.id === item?.id
            );

            if (!currentProduct) return;

            let newQtyDozens = currentProduct.qtyDozens;
            let newQtySack = currentProduct.qtySack;

            if (item?.unitType === "dozens") {
              // Kalkulasi harga
              subtotal = Number(item?.qtySold) * Number(item?.amountSold);
              computedTotal += subtotal;

              // Kurangi jumlah losin
              newQtyDozens = Math.max(
                0,
                currentProduct.qtyDozens - item?.qtySold
              );

              // Update juga jumlah sak (otomatis ikut turun)
              if (currentProduct.fillPerSack > 0) {
                const result =
                  Number(newQtyDozens) / currentProduct.fillPerSack;
                newQtySack = Math.floor(result * 10) / 10;
              }
            } else if (item?.unitType === "sack") {
              // Kalkulasi harga
              subtotal =
                Number(item?.qtySold) *
                Number(currentProduct.fillPerSack) *
                Number(item?.amountSold);
              computedTotal += subtotal;

              // Kurangi jumlah sak
              newQtySack = Math.max(0, currentProduct.qtySack - item?.qtySold);

              // Update jumlah losin berdasarkan isi per sak
              if (currentProduct.fillPerSack > 0) {
                newQtyDozens = newQtySack * currentProduct.fillPerSack;
              }
            }

            // Update subtotal tiap item
            item.subtotal = subtotal;

            // Update data produk
            productStore.updateProduct(item?.id, {
              qtyDozens: newQtyDozens,
              qtySack: newQtySack,
            });
          });

          const now = new Date();
          const newSale = {
            ...sale,
            totalAmount: computedTotal,
            createdAt: now,
            updatedAt: now,
          };

          return { sales: [...state.sales, newSale] };
        }),
      updateSale: (id, updatedSaleData) =>
        set((state) => {
          const productStore = useProductStore.getState();
          const existingSale = state.sales.find((s) => s.id === id);
          if (!existingSale) return state;

          // 🔹 1️⃣ Rollback stok dari sale lama
          existingSale.items.forEach((oldItem) => {
            const currentProduct = productStore.products.find(
              (p) => p.id === oldItem?.id
            );
            if (!currentProduct) return;

            let rollbackDozens = currentProduct.qtyDozens;
            let rollbackSack = currentProduct.qtySack;

            if (oldItem?.unitType === "dozens") {
              rollbackDozens = currentProduct.qtyDozens + oldItem?.qtySold;
              if (currentProduct.fillPerSack > 0) {
                const result =
                  Number(rollbackDozens) / currentProduct.fillPerSack;
                rollbackSack = Math.floor(result * 10) / 10;
              }
            } else if (oldItem?.unitType === "sack") {
              rollbackSack = currentProduct.qtySack + oldItem?.qtySold;
              if (currentProduct.fillPerSack > 0) {
                rollbackDozens = rollbackSack * currentProduct.fillPerSack;
              }
            }

            productStore.updateProduct(oldItem?.id, {
              qtyDozens: rollbackDozens,
              qtySack: rollbackSack,
            });
          });

          // 🔹 2️⃣ Hitung ulang total baru + update stok
          let computedTotal = 0;
          updatedSaleData.items.forEach((item) => {
            let subtotal = 0;
            const currentProduct = productStore.products.find(
              (p) => p.id === item?.id
            );

            if (!currentProduct) return;

            let newQtyDozens = currentProduct.qtyDozens;
            let newQtySack = currentProduct.qtySack;

            if (item?.unitType === "dozens") {
              subtotal = item?.qtySold * item?.amountSold;
              computedTotal += subtotal;

              newQtyDozens = Math.max(
                0,
                currentProduct.qtyDozens - item?.qtySold
              );
              if (currentProduct.fillPerSack > 0) {
                const result =
                  Number(newQtyDozens) / currentProduct.fillPerSack;
                newQtySack = Math.floor(result * 10) / 10;
              }
            } else if (item?.unitType === "sack") {
              subtotal =
                item?.qtySold * currentProduct.fillPerSack * item?.amountSold;
              computedTotal += subtotal;

              newQtySack = Math.max(0, currentProduct.qtySack - item?.qtySold);
              if (currentProduct.fillPerSack > 0) {
                newQtyDozens = newQtySack * currentProduct.fillPerSack;
              }
            }

            // Update subtotal tiap item
            item.subtotal = subtotal;

            productStore.updateProduct(item?.id, {
              qtyDozens: newQtyDozens,
              qtySack: newQtySack,
            });
          });

          // 🔹 3️⃣ Update sale-nya di store
          const updatedSales = state.sales.map((s) =>
            s.id === id
              ? {
                  ...s,
                  ...updatedSaleData,
                  totalAmount: computedTotal,
                  updatedAt: new Date(),
                }
              : s
          );

          return { sales: updatedSales };
        }),
      deleteSale: (id) =>
        set((state) => {
          const productStore = useProductStore.getState();
          const saleToDelete = state.sales.find((s) => s.id === id);
          if (!saleToDelete) return state;

          // Kembalikan stok
          saleToDelete.items.forEach((item) => {
            const product = productStore.products.find(
              (p) => p.id === item?.id
            );
            if (!product) return;

            if (item?.unitType === "dozens") {
              productStore.updateProduct(item?.id, {
                qtyDozens: product.qtyDozens + item?.qtySold,
              });
            } else {
              productStore.updateProduct(item?.id, {
                qtySack: product.qtySack + item?.qtySold,
              });
            }
          });

          return {
            sales: state.sales.filter((s) => s.id !== id),
          };
        }),
      getTodayProfit: () => {
        const now = new Date().toDateString();
        const salesToday = get().sales.filter(
          (s) => new Date(s.createdAt).toDateString() === now
        );

        let totalProfit = 0;

        salesToday.forEach((sale) => {
          sale.items.forEach((item) => {
            const base = item.basePrice;
            const fill = item.fillPerSack;

            let modal = 0;
            let keuntungan = 0;

            if (item.unitType === "dozens") {
              modal = base; // modal per losin
              keuntungan = (item.amountSold - modal) * item.qtySold;
            } else {
              modal = base * fill; // modal per sak
              keuntungan = (item.amountSold * fill - modal) * item.qtySold;
            }

            totalProfit += keuntungan;
          });
        });

        return totalProfit;
      },
      getTodayNetProfit: (operationalCost = 0) => {
        const labaKotor = get().getTodayProfit();
        return labaKotor - operationalCost;
      },
      resetSales: () => set({ sales: [] }),
    }),
    {
      name: "sales-store",
      storage: zustandStorage,
      onRehydrateStorage: () => (state) => {
        if (state?.sales) {
          state.sales = state.sales.map((sale) => ({
            ...sale,
            createdAt: new Date(sale.createdAt),
            updatedAt: new Date(sale.updatedAt),
          }));
        }
      },
    }
  )
);
