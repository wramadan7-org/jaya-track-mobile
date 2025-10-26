// import { zustandStorage } from "@/utils/storage";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { useProductStore, type Product } from "./product-store";

// export type Sale = {
//   id: string;
//   store: string;
//   area: string;
//   items: (Product & { qtySold: number; amountSold: number })[];
//   totalAmount: number;
//   date: string;
//   createdAt: Date;
//   updatedAt: Date;
// };

// type SaleStore = {
//   sales: Sale[];
//   addSale: (sale: Sale) => void;
//   getTotalSalesAmount: () => number;
//   resetSales: () => void;
// };

// export const useSalesStore = create<SaleStore>()(
//   persist(
//     (set, get) => ({
//       sales: [],
//       addSale: (sale: Sale) =>
//         set((state) => {
//           const newSales = [...state.sales, sale];

//           const productStore = useProductStore.getState();
//           sale.items.forEach((item) => {
//             const currentProduct = productStore.products.find(
//               (p) => p.id === item.id
//             );
//             if (currentProduct) {
//               productStore.updateProduct(item.id, {
//                 qty: currentProduct.qty - item.qtySold,
//               });
//             }
//           });

//           return { sales: newSales };
//         }),
//       getTotalSalesAmount: () =>
//         get().sales.reduce((total, sale) => total + (sale.totalAmount || 0), 0),
//       resetSales: () => set({ sales: [] }),
//     }),
//     {
//       name: "sales-store",
//       storage: zustandStorage,
//       onRehydrateStorage: () => (state) => {
//         if (state?.sales) {
//           state.sales = state.sales.map((sale) => ({
//             ...sale,
//             createdAt: new Date(sale.createdAt),
//             updatedAt: new Date(sale.updatedAt),
//           }));
//         }
//       },
//     }
//   )
// );
