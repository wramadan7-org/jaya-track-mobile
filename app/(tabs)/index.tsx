import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import CardContainer from "@/components/ui/card-container";
import { useProductStore } from "@/stores/product-store";
import { useSalesStore } from "@/stores/sales-store";
import { remainingProduct } from "@/utils/remaining-product";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function DashboardScreen() {
  const { products } = useProductStore();
  const { sales, getTodayProfit } = useSalesStore();

  const today = new Date().toDateString();
  const todaySales = sales.filter(
    (s) => new Date(s.createdAt).toDateString() === today
  );

  const totalTodayAmount = todaySales.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0
  );

  const totalItemSold = useMemo(() => {
    const soldDozens = todaySales.reduce((sum, sale) => {
      return (
        sum +
        sale.items
          .filter((s) => s.unitType === "dozens")
          .reduce((s, i) => s + i.qtySold, 0)
      );
    }, 0);

    const soldSacks = todaySales.reduce((sum, sale) => {
      return (
        sum +
        sale.items
          .filter((s) => s.unitType === "sack")
          .reduce((s, i) => s + i.qtySold, 0)
      );
    }, 0);
    return { soldDozens, soldSacks };
  }, [todaySales]);

  const lastSale = sales[sales.length - 1];
  const profitToday = getTodayProfit();

  return (
    <ParallaxScrollView>
      <ThemedText type="title">Selamat Datang, Sopir</ThemedText>
      <CardContainer style={{ marginBottom: 18 }}>
        <ThemedText style={styles.cardTitle}>Ringkasan Hari Ini</ThemedText>
        <ThemedText style={styles.cardRow}>
          Total Penjualan:
          <ThemedText style={[styles.highlightValue, { color: "#16A34A" }]}>
            {" "}
            Rp {totalTodayAmount.toLocaleString()}
          </ThemedText>
        </ThemedText>
        <ThemedView style={styles.flexRow}>
          <ThemedView>
            <ThemedText style={styles.cardRow}>Sak Terjual</ThemedText>
            <ThemedText style={styles.highlightValue}>
              {totalItemSold.soldSacks} sak
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              width: 1,
              height: 40,
            }}
          />
          <ThemedView>
            <ThemedText style={styles.cardRow}>Losin Terjual</ThemedText>
            <ThemedText type="default" style={styles.highlightValue}>
              {totalItemSold.soldDozens} losin
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedText style={styles.cardRow}>
          Total Laba:
          <ThemedText style={[styles.highlightValue, { color: "#16A34A" }]}>
            {" "}
            Rp {profitToday.toLocaleString()}
          </ThemedText>
        </ThemedText>
      </CardContainer>
      <CardContainer style={{ marginBottom: 18 }}>
        <ThemedText style={styles.cardTitle}>Stok Barang Dibawa</ThemedText>
        {products.length === 0 && (
          <ThemedText style={styles.emptyText}>Tidak ada produk</ThemedText>
        )}
        {products.map((p) => {
          const { remainingSacks, remainingDozens } = remainingProduct(
            p.qtySack,
            p.qtyDozens,
            p.fillPerSack
          );

          return (
            <View key={p.id} style={styles.listItem}>
              <ThemedText style={styles.listTitle}>{p.name}</ThemedText>
              <ThemedText style={styles.listSub}>
                Sisa:{" "}
                {Math.floor(remainingSacks) === 0 && remainingDozens > 0
                  ? ``
                  : `${Math.floor(remainingSacks)} sak`}
                {remainingSacks > 0 && remainingDozens !== 0
                  ? `${remainingDozens} losin`
                  : ""}
              </ThemedText>
            </View>
          );
        })}
      </CardContainer>
      <Link
        href={{ pathname: "/detail-sale-modal", params: { id: lastSale.id } }}
        asChild
      >
        <Pressable>
          <CardContainer style={{ marginBottom: 18 }}>
            <ThemedView
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <ThemedText style={styles.cardTitle}>
                Penjualan Terakhir
              </ThemedText>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </ThemedView>
            {!lastSale ? (
              <ThemedText style={styles.emptyText}>
                Belum ada penjualan
              </ThemedText>
            ) : (
              <ThemedView>
                <ThemedText style={styles.listTitle}>
                  {lastSale.store}
                </ThemedText>
                <ThemedText style={styles.listSub}>{lastSale.area}</ThemedText>
                <ThemedText style={[styles.cardRow, { marginTop: 6 }]}>
                  Total:
                  <ThemedText
                    style={[styles.highlightValue, { color: "#16A34A" }]}
                  >
                    {" "}
                    Rp {lastSale.totalAmount.toLocaleString()}
                  </ThemedText>
                </ThemedText>
              </ThemedView>
            )}
          </CardContainer>
        </Pressable>
      </Link>
      <CardContainer>
        <ThemedText style={styles.cardTitle}>Laba per Produk</ThemedText>
        {todaySales.length === 0 && (
          <ThemedText style={styles.emptyText}>Tidak ada data</ThemedText>
        )}
        {products.map((p) => {
          let profit = 0;

          todaySales.forEach((sale) => {
            sale.items
              .filter((i) => i.id === p.id)
              .forEach((i) => {
                const basePrice = p.basePrice;
                const fillPerSack = p.fillPerSack;
                profit +=
                  i.unitType === "dozens"
                    ? (i.amountSold - basePrice) * i.qtySold
                    : (i.amountSold * fillPerSack - basePrice * fillPerSack) *
                      i.qtySold;
              });
          });

          return (
            <View key={p.id} style={styles.listItem}>
              <ThemedText style={styles.listTitle}>{p.name}</ThemedText>
              <ThemedText style={[styles.listSub, { color: "#16A34A" }]}>
                Laba: Rp {profit.toLocaleString()}
              </ThemedText>
            </View>
          );
        })}
      </CardContainer>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: 12,
  },
  cardRow: {
    lineHeight: moderateScale(22),
    marginBottom: 4,
  },
  flexRow: {
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
  },
  highlightValue: {
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: moderateScale(15),
    opacity: 0.6,
  },
  listItem: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 0.6,
    borderColor: "#ccc",
  },
  listTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  listSub: {
    fontSize: moderateScale(14),
    opacity: 0.8,
    marginTop: 2,
  },
});
