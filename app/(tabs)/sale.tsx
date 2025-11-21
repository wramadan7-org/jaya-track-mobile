import { Pressable, StyleSheet } from "react-native";

import { FlatListScrollView } from "@/components/flatlist-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { EmptyState } from "@/components/ui/empty-state";
import { Fonts } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useSalesStore } from "@/stores/sales-store";
import { Link } from "expo-router";
import { useMemo } from "react";

export default function SaleScreenScreen() {
  const cardBackground = useThemeColor(
    { light: "#fff", dark: "#1c1c1e" },
    "background"
  );
  const subText = useThemeColor({ light: "#666", dark: "#aaa" }, "text");
  const itemRowBackground = useThemeColor(
    { light: "#f8f8f8", dark: "#2c2c2e" },
    "background"
  );
  const { sales, resetSales } = useSalesStore();

  const sortSalesByUpdatedAt = useMemo(() => {
    return sales?.length
      ? [...sales].sort(
          (a, b) => b?.updatedAt?.getTime() - a?.updatedAt?.getTime()
        )
      : [];
  }, [sales]);

  return (
    <FlatListScrollView
      data={sortSalesByUpdatedAt}
      keyExtractor={(item) => item?.id}
      stickyHeader
      headerComponent={
        <ThemedView style={styles.headerContainer}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText
              type="title"
              style={{
                fontFamily: Fonts.rounded,
              }}
            >
              📦 Penjualan
            </ThemedText>
          </ThemedView>
          <Link
            style={[styles.button, styles.buttonAdd, styles.centerText]}
            href="/form-sale-modal"
            asChild
          >
            <ThemedText>Tambah Penjualan</ThemedText>
          </Link>
        </ThemedView>
      }
      contentContainerStyle={{ paddingBottom: 130 }}
      renderItem={({ item }) => (
        <Link
          href={{ pathname: "/detail-sale-modal", params: { id: item?.id } }}
          asChild
        >
          <Pressable>
            <ThemedView
              style={[styles.saleCard, { backgroundColor: cardBackground }]}
            >
              {/* Header toko + total */}
              <ThemedView style={styles.saleHeader}>
                <ThemedText type="defaultSemiBold" style={styles.saleStore}>
                  {item?.store}
                </ThemedText>
                <ThemedText
                  type="defaultSemiBold"
                  style={[
                    styles.saleTotal,
                    {
                      color: "#16A34A",
                    },
                  ]}
                >
                  Rp {item?.totalAmount?.toLocaleString("id-ID")}
                </ThemedText>
              </ThemedView>

              {/* Area */}
              <ThemedText
                type="default"
                style={[styles.saleArea, { color: subText }]}
              >
                Area:{" "}
                <ThemedText type="defaultSemiBold">{item?.area}</ThemedText>
              </ThemedText>

              {/* Item terjual */}
              <ThemedView
                style={[styles.itemContainer, { borderTopColor: "#ccc" }]}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.itemHeader, { color: subText }]}
                >
                  Item Terjual
                </ThemedText>

                {item?.items.map((product, index) => (
                  <ThemedView
                    key={`product-${index}`}
                    style={[
                      styles.itemRow,
                      { backgroundColor: itemRowBackground },
                    ]}
                  >
                    <ThemedView
                      style={{
                        flex: 1,
                        borderRadius: 3,
                        paddingHorizontal: 5,
                        marginHorizontal: -3,
                      }}
                    >
                      <ThemedText type="defaultSemiBold">
                        {product?.name}
                      </ThemedText>
                      <ThemedText
                        type="default"
                        style={[styles.itemDetail, { color: subText }]}
                      >
                        {product?.qtySold}{" "}
                        {product?.unitType === "dozens" ? "losin" : "sak"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedText type="defaultSemiBold" style={styles.itemPrice}>
                      Rp {product?.subtotal?.toLocaleString("id-ID")}
                    </ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>
          </Pressable>
        </Link>
      )}
      ListEmptyComponent={
        <EmptyState
          title="Penjualan belum ada"
          message="Harap tambahkan penjualan"
        />
      }
      footerComponent={
        <ThemedView style={[styles.footerContainer]}>
          <ThemedText
            type="defaultSemiBold"
            style={{
              textAlign: "center",
              fontSize: 15,
              color: "#16A34A",
            }}
          >
            Total Penjualan: Rp{" "}
            {sortSalesByUpdatedAt
              .reduce((sum, sale) => sum + (sale.totalAmount || 0), 0)
              ?.toLocaleString("id-ID")}
          </ThemedText>
          <Pressable
            disabled={!!!sortSalesByUpdatedAt?.length}
            onPress={resetSales}
            style={[
              styles.button,
              !!!sortSalesByUpdatedAt?.length
                ? styles.buttonDisabled
                : styles.buttonRemove,
            ]}
          >
            <ThemedText style={[styles.centerText]}>Hapus semua</ThemedText>
          </Pressable>
        </ThemedView>
      }
      stickyFooter
    />
  );
}

const styles = StyleSheet.create({
  saleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: -10,
    paddingHorizontal: 10,
  },
  saleStore: {
    fontSize: 16,
  },
  saleTotal: {
    fontSize: 15,
  },
  saleArea: {
    fontSize: 14,
  },
  itemContainer: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    gap: 6,
  },
  itemHeader: {
    fontSize: 14,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 8,
    borderRadius: 6,
    gap: 8,
  },
  itemDetail: {
    fontSize: 13,
  },
  itemPrice: {
    fontSize: 14,
    textAlign: "right",
  },
  headerContainer: {
    gap: 16,
    borderColor: "#ccc",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    flex: 1,
  },
  buttonDisabled: {
    backgroundColor: "#A0A0A0",
    borderRadius: 8,
    padding: 10,
    textAlign: "center",
  },
  buttonAdd: {
    backgroundColor: "#007AFF",
  },
  buttonConfirm: {
    backgroundColor: "#34C759",
  },
  buttonRemove: {
    backgroundColor: "#FF3B30",
  },
  saleCard: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    padding: 6,
  },
  iconDisabled: {
    opacity: 0.5,
  },
  centerText: {
    textAlign: "center",
  },
  footerContainer: {
    justifyContent: "center",
    gap: 10,
  },
});
