import { Pressable, StyleSheet } from "react-native";

import { FlatListScrollView } from "@/components/flatlist-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { EmptyState } from "@/components/ui/empty-state";
import { Fonts } from "@/constants/theme";
import { useProductStore } from "@/stores/product-store";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useMemo, useState } from "react";

export default function BroughtScreen() {
  const { products, deleteProduct, resetProducts } = useProductStore();

  const [disableAction, setDisableAction] = useState(false);

  const handleConfirmation = () => {
    setDisableAction(!disableAction);
  };

  const sortProductsByUpdatedAt = useMemo(() => {
    return [...products].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }, [products]);

  return (
    <FlatListScrollView
      data={sortProductsByUpdatedAt}
      keyExtractor={(item) => item.id}
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
      renderItem={({ item }) => (
        <ThemedView style={styles.productCard}>
          <ThemedText type="defaultSemiBold">Nama: {item.name}</ThemedText>
          <ThemedText type="defaultSemiBold">
            Jumlah: {item.qtyDozens} losin / {Math.floor(item.qtySack)} sak{" "}
            {item.qtySack > 0 && item.qtyDozens % item.fillPerSack !== 0
              ? `(+ ${item.qtyDozens % item.fillPerSack} losin)`
              : ""}
          </ThemedText>
          <ThemedView
            style={{
              gap: 4,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderTopWidth: 1,
              borderColor: "#EEE",
              paddingTop: 8,
              marginTop: 8,
            }}
          >
            <ThemedView>
              <ThemedText type="defaultSemiBold">Harga Dasar</ThemedText>
              <ThemedView style={{ gap: 4 }}>
                <ThemedText type="default">
                  Losin: Rp {item.basePricePerDozens.toLocaleString("id-ID")}
                </ThemedText>
                <ThemedText type="default">
                  Sak: Rp {item.basePricePerSack.toLocaleString("id-ID")}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView
              style={{
                borderEndWidth: 1,
                borderColor: "#EEE",
                width: 1,
                height: 40,
              }}
            />
            <ThemedView>
              <ThemedText type="defaultSemiBold">Harga Target</ThemedText>
              <ThemedView style={{ gap: 4 }}>
                <ThemedText type="default">
                  Losin: Rp {item.targetPricePerDozens.toLocaleString("id-ID")}
                </ThemedText>
                <ThemedText type="default">
                  Sak: Rp {item.targetPricePerSack.toLocaleString("id-ID")}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.iconContainer}>
            <Link
              disabled={disableAction}
              href={{
                pathname: "/form-product-modal",
                params: { id: item.id },
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
              style={[styles.iconButton, disableAction && styles.iconDisabled]}
              onPress={() => deleteProduct(item.id)}
            >
              <Ionicons
                name="trash-outline"
                size={16}
                color={disableAction ? "#C0C0C0" : "#FF3B30"}
              />
            </Pressable>
          </ThemedView>
        </ThemedView>
      )}
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
  productCard: {
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
});
