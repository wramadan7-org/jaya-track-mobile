import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import CardContainer from "@/components/ui/card-container";
import { useProductStore } from "@/stores/product-store";
import { useSalesStore } from "@/stores/sales-store";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

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
          <ThemedText style={styles.highlightValue}>
            {" "}
            Rp {totalTodayAmount.toLocaleString()}
          </ThemedText>
        </ThemedText>
        <ThemedView style={styles.flexRow}>
          <ThemedView>
            <ThemedText style={styles.cardRow}>Sak Terjual:</ThemedText>
            <ThemedText type="default" style={styles.highlightValue}>
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
            <ThemedText style={styles.cardRow}>Losin Terjual:</ThemedText>
            <ThemedText type="default" style={styles.highlightValue}>
              {totalItemSold.soldDozens} losin
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedText style={styles.cardRow}>
          Total Laba:
          <ThemedText style={[styles.highlightValue, { color: "green" }]}>
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
          const remainingSacks = p.qtySack;
          const remainingDozens =
            p?.qtySack > 0 && p?.qtyDozens % p.fillPerSack !== 0
              ? p?.qtyDozens % p?.fillPerSack
              : 0;

          return (
            <View key={p.id} style={styles.listItem}>
              <ThemedText style={styles.listTitle}>{p.name}</ThemedText>
              <ThemedText style={styles.listSub}>
                Sisa: {Math.floor(remainingSacks)} sak{" "}
                {remainingDozens > 0 && ` / ${remainingDozens} losin`}
              </ThemedText>
            </View>
          );
        })}
      </CardContainer>
      <CardContainer style={{ marginBottom: 18 }}>
        <ThemedText style={styles.cardTitle}>Penjualan Terakhir</ThemedText>
        {!lastSale ? (
          <ThemedText style={styles.emptyText}>Belum ada penjualan</ThemedText>
        ) : (
          <View>
            <ThemedText style={styles.listTitle}>{lastSale.store}</ThemedText>
            <ThemedText style={styles.listSub}>{lastSale.area}</ThemedText>
            <ThemedText style={[styles.cardRow, { marginTop: 6 }]}>
              Total:
              <ThemedText style={styles.highlightValue}>
                {" "}
                Rp {lastSale.totalAmount.toLocaleString()}
              </ThemedText>
            </ThemedText>
          </View>
        )}
      </CardContainer>
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
              <ThemedText style={[styles.listSub, { color: "green" }]}>
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  cardRow: {
    fontSize: 16,
    lineHeight: 22,
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
    fontSize: 15,
    opacity: 0.6,
  },
  listItem: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 0.6,
    borderColor: "#ccc",
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  listSub: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 2,
  },
});
