import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useSalesStore } from "@/stores/sales-store";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

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
      <View style={styles.center}>
        <ThemedText type="default" style={styles.notFound}>
          Data penjualan tidak ditemukan
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔹 Info Penjualan */}
      <View style={[styles.headerCard, { backgroundColor: cardBackground }]}>
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
      </View>

      {/* 🔹 Daftar Item */}
      <FlatList
        data={sale.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.itemCard, { backgroundColor: cardBackground }]}>
            <View style={styles.rowBetween}>
              <ThemedText type="default" style={styles.itemName}>
                {item.name}
              </ThemedText>
              <ThemedText type="default" style={styles.subtotal}>
                Rp {item.subtotal.toLocaleString("id-ID")}
              </ThemedText>
            </View>

            <View style={styles.rowBetween}>
              <ThemedText type="default" style={styles.itemDetail}>
                {item.qtySold} {item.unitType === "dozens" ? "lusin" : "sak"}
              </ThemedText>
              <ThemedText type="default" style={styles.itemPrice}>
                x Rp {item.amountSold.toLocaleString("id-ID")}
              </ThemedText>
            </View>
          </View>
        )}
        ListFooterComponent={<View style={{ height: 80 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFound: {
    fontSize: 16,
    color: "#555",
  },
  headerCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    marginBottom: 2,
  },
  total: {
    fontSize: 16,
    fontWeight: "700",
    color: "#16A34A",
    marginTop: 8,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
  },
  itemDetail: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  subtotal: {
    fontWeight: "700",
  },
});
