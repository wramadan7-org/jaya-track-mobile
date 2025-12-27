import { Pressable, RefreshControl, StyleSheet } from "react-native";

import { FlatListScrollView } from "@/components/flatlist-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import CardContainer from "@/components/ui/card-container";
import { EmptyState } from "@/components/ui/empty-state";
import Loading from "@/components/ui/loading";
import { Fonts } from "@/constants/theme";
import { useAppHydrated } from "@/hooks/use-app-hydrate";
import { useProductStore } from "@/stores/product-store";
import { remainingProduct } from "@/utils/remaining-product";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { moderateScale } from "react-native-size-matters";

export default function BroughtScreen() {
  const { products, deleteProduct, resetProducts } = useProductStore();
  const ready = useAppHydrated();

  const [disableAction, setDisableAction] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleConfirmation = () => {
    setDisableAction(!disableAction);
  };

  const sortProductsByUpdatedAt = useMemo(() => {
    return products?.length
      ? [...products].sort((a, b) => {
          const aHasStock = a?.qtySack > 0 || a?.qtyDozens > 0;
          const bHasStock = b?.qtySack > 0 || b?.qtyDozens > 0;

          // Barang dengan stok masih ada di atas
          if (aHasStock && !bHasStock) return -1;
          if (!aHasStock && bHasStock) return 1;

          // Jika stok sama-sama ada atau sama-sama habis, urutkan berdasarkan updatedAt
          return b?.updatedAt?.getTime() - a?.updatedAt?.getTime();
        })
      : [];
  }, [products]);

  if (!ready) return <Loading text="Menyiapkan data..." />;

  return (
    <FlatListScrollView
      data={sortProductsByUpdatedAt}
      keyExtractor={(item) => item?.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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
              📦 Muatan Barang
            </ThemedText>
          </ThemedView>
          <Link
            style={[
              styles.button,
              disableAction && styles.buttonDisabled,
              styles.buttonAdd,
              styles.centerText,
            ]}
            disabled={disableAction}
            href="/form-product-modal"
            asChild
          >
            <ThemedText>Tambah Barang</ThemedText>
          </Link>
        </ThemedView>
      }
      renderItem={({ item }) => {
        const { remainingSacks, remainingDozens } = remainingProduct(
          item.qtySack,
          item.qtyDozens,
          item.fillPerSack
        );

        return (
          <CardContainer>
            <ThemedView
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "transparent",
              }}
            >
              <ThemedView style={{ maxWidth: "75%" }}>
                <ThemedText type="defaultSemiBold">
                  {item?.name || "-"}
                </ThemedText>
                <ThemedText type="default" style={{ color: "#666" }}>
                  {item.fillPerSack} losin / sak
                </ThemedText>
                <ThemedText type="defaultSemiBold">
                  <ThemedText
                    style={{ color: "#666", fontSize: moderateScale(12) }}
                  >
                    Stok:{" "}
                  </ThemedText>
                  {Math.floor(remainingSacks) === 0 && remainingDozens > 0
                    ? ``
                    : `${Math.floor(remainingSacks)} sak`}
                  {remainingSacks > 0 && remainingDozens !== 0
                    ? `${remainingDozens} losin`
                    : ""}
                </ThemedText>
              </ThemedView>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  fontSize: moderateScale(12),
                  marginBottom: "auto",
                  textAlign: "right",
                  backgroundColor:
                    item?.qtyDozens === 0 && item?.qtySack === 0
                      ? "#FF3B3020"
                      : "#34C75920",
                  paddingHorizontal: moderateScale(10),
                  paddingVertical: moderateScale(1),
                  borderRadius: 4,
                  color:
                    item?.qtyDozens === 0 && item?.qtySack === 0
                      ? "#FF3B30"
                      : "#34C759",
                }}
              >
                {item?.qtyDozens === 0 && item?.qtySack === 0
                  ? "Habis"
                  : "Tersedia"}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.iconContainer}>
              <Link
                disabled={disableAction}
                href={{
                  pathname: "/form-product-modal",
                  params: { id: item?.id },
                }}
                asChild
              >
                <Pressable
                  style={[
                    styles.iconButton,
                    disableAction && styles.iconDisabled,
                  ]}
                >
                  <Ionicons
                    name="create-outline"
                    size={16}
                    color={disableAction ? "#A0A0A0" : "#007AFF"}
                  />
                </Pressable>
              </Link>
              <Pressable
                disabled={disableAction}
                style={[
                  styles.iconButton,
                  disableAction && styles.iconDisabled,
                ]}
                onPress={() => deleteProduct(item?.id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={disableAction ? "#C0C0C0" : "#FF3B30"}
                />
              </Pressable>
              <ThemedText
                type="defaultSemiBold"
                style={{ fontSize: moderateScale(14), marginLeft: "auto" }}
              >
                <ThemedText
                  style={{
                    color: "#666",
                    fontWeight: "thin",
                    fontSize: moderateScale(12),
                  }}
                >
                  Harga:{" "}
                </ThemedText>
                Rp {item?.price?.toLocaleString("id-ID") || "-"}
              </ThemedText>
            </ThemedView>
          </CardContainer>
        );
      }}
      ListEmptyComponent={
        <EmptyState title="Barang belum ada" message="Harap tambahkan barang" />
      }
      footerComponent={
        <ThemedView style={[styles.footerContainer]}>
          <Pressable
            disabled={!!!sortProductsByUpdatedAt?.length}
            onPress={resetProducts}
            style={[
              styles.button,
              !!!sortProductsByUpdatedAt?.length
                ? styles.buttonDisabled
                : styles.buttonRemove,
            ]}
          >
            <ThemedText style={[styles.centerText]}>Hapus semua</ThemedText>
          </Pressable>
          <Pressable
            disabled={!!!sortProductsByUpdatedAt?.length}
            onPress={handleConfirmation}
            style={[
              styles.button,
              !!!sortProductsByUpdatedAt?.length
                ? styles.buttonDisabled
                : styles.buttonConfirm,
            ]}
          >
            <ThemedText style={[styles.centerText]}>Konfirmasi</ThemedText>
          </Pressable>
        </ThemedView>
      }
      stickyFooter
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    gap: 16,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    borderRadius: 8,
    padding: moderateScale(10),
    flex: 1,
  },
  buttonDisabled: {
    backgroundColor: "#A0A0A0",
    borderRadius: 8,
    padding: moderateScale(10),
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
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    padding: moderateScale(6),
  },
  iconDisabled: {
    opacity: 0.5,
  },
  centerText: {
    textAlign: "center",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
});
