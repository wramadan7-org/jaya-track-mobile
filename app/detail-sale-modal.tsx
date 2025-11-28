import { FlatListScrollView } from "@/components/flatlist-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import CardContainer from "@/components/ui/card-container";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useSalesStore } from "@/stores/sales-store";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import React from "react";
import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function SaleDetailModalScreen() {
  const cardBackground = useThemeColor(
    { light: "#fff", dark: "#1c1c1e" },
    "background"
  );

  const route = useRoute();
  const { id } = route.params as { id: string };

  const sale = useSalesStore((state) => state.sales.find((s) => s.id === id));

  if (!sale) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="default" style={styles.notFound}>
          Data penjualan tidak ditemukan
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* 🔹 Info Penjualan */}
      <ThemedView
        style={[styles.headerCard, { backgroundColor: cardBackground }]}
      >
        <ThemedText type="default" style={styles.title}>
          Detail Penjualan
        </ThemedText>
        <ThemedText type="default" style={styles.info}>
          Toko: {sale.store}
        </ThemedText>
        <ThemedText type="default" style={styles.info}>
          Area: {sale.area}
        </ThemedText>
        <ThemedText type="default" style={styles.info}>
          Tanggal: {dayjs(sale.createdAt).format("DD MMM YYYY HH:mm")}
        </ThemedText>
        <ThemedText type="default" style={styles.total}>
          Total: Rp {sale.totalAmount.toLocaleString("id-ID")}
        </ThemedText>
      </ThemedView>

      {/* 🔹 Daftar Item */}
      <FlatListScrollView
        data={sale.items}
        keyExtractor={(item) => item.id}
        containerStyle={{ paddingHorizontal: 0, gap: 10 }}
        renderItem={({ item }) => (
          <CardContainer>
            <ThemedView style={styles.rowBetween}>
              <ThemedText type="default" style={styles.itemName}>
                {item.name}
              </ThemedText>
              <ThemedText type="default" style={styles.subtotal}>
                Rp {item.subtotal.toLocaleString("id-ID")}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.rowBetween}>
              <ThemedText type="default" style={styles.itemDetail}>
                {item.qtySold} {item.unitType === "dozens" ? "lusin" : "sak"}
              </ThemedText>
              <ThemedText type="default" style={styles.itemPrice}>
                {item.unitType === "sack" && `x ${item.fillPerSack}`} x Rp{" "}
                {item.amountSold.toLocaleString("id-ID")}
              </ThemedText>
            </ThemedView>
          </CardContainer>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16),
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFound: {
    fontSize: moderateScale(16),
    color: "#555",
  },
  headerCard: {
    borderRadius: 12,
    padding: moderateScale(16),
    marginBottom: moderateScale(16),
    borderColor: "#ccc",
    borderWidth: 1,
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    marginBottom: moderateScale(8),
  },
  info: {
    fontSize: moderateScale(14),
    marginBottom: moderateScale(2),
  },
  total: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: "#16A34A",
    marginTop: moderateScale(8),
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: moderateScale(15),
    fontWeight: "600",
  },
  itemDetail: {
    fontSize: moderateScale(13),
    color: "#666",
    marginTop: moderateScale(4),
  },
  itemPrice: {
    fontSize: moderateScale(13),
    color: "#666",
    marginTop: moderateScale(4),
  },
  subtotal: {
    fontWeight: "700",
  },
});
