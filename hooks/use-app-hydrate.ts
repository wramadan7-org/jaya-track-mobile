import { useProductStore } from "@/stores/product-store";
import { useSalesStore } from "@/stores/sales-store";

export const useAppHydrated = () => {
  const product = useProductStore((s) => s.hasHydrated);
  const sales = useSalesStore((s) => s.hasHydrated);

  return product && sales;
};
