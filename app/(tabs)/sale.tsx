import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useProductStore } from "@/stores/product-store";
import { useMemo, useState } from "react";

export default function SaleScreenScreen() {
  const { products, deleteProduct } = useProductStore();

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
    <ThemedText>Sales</ThemedText>
    // <FlatListScrollView
    //   data={sortProductsByUpdatedAt}
    //   keyExtractor={(item) => item.id}
    //   stickyHeader
    //   headerComponent={
    //     <ThemedView style={styles.headerContainer}>
    //       <ThemedView style={styles.titleContainer}>
    //         <ThemedText
    //           type="title"
    //           style={{
    //             fontFamily: Fonts.rounded,
    //           }}
    //         >
    //           📦 Barang Terjual
    //         </ThemedText>
    //       </ThemedView>
    //       <Link
    //         style={[
    //           styles.buttonLink,
    //           disableAction && styles.buttonLinkDisabled,
    //         ]}
    //         disabled={disableAction}
    //         href="/form-product-modal"
    //         asChild
    //       >
    //         <Button title="Tambah Barang" />
    //       </Link>
    //     </ThemedView>
    //   }
    //   renderItem={({ item }) => (
    //     <ThemedView style={styles.productCard}>
    //       <ThemedText type="defaultSemiBold">Nama: {item.name}</ThemedText>
    //       <ThemedText type="default">Jumlah: {item.qty}</ThemedText>
    //       <ThemedText type="default">
    //         Harga per losin: Rp {item.price.toLocaleString("id-ID")}
    //       </ThemedText>
    //       <ThemedView style={styles.iconContainer}>
    //         <Link
    //           disabled={disableAction}
    //           href={{
    //             pathname: "/form-product-modal",
    //             params: { id: item.id },
    //           }}
    //           asChild
    //         >
    //           <Pressable
    //             style={[
    //               styles.iconButton,
    //               disableAction && styles.iconDisabled,
    //             ]}
    //           >
    //             <Ionicons
    //               name="create-outline"
    //               size={16}
    //               color={disableAction ? "#A0A0A0" : "#007AFF"}
    //             />
    //           </Pressable>
    //         </Link>
    //         <Pressable
    //           disabled={disableAction}
    //           style={[styles.iconButton, disableAction && styles.iconDisabled]}
    //           onPress={() => deleteProduct(item.id)}
    //         >
    //           <Ionicons
    //             name="trash-outline"
    //             size={16}
    //             color={disableAction ? "#C0C0C0" : "#FF3B30"}
    //           />
    //         </Pressable>
    //       </ThemedView>
    //     </ThemedView>
    //   )}
    //   footerComponent={
    //     <Button title="Konfirmasi" onPress={handleConfirmation} />
    //   }
    //   stickyFooter
    // />
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
  buttonLink: {
    backgroundColor: "blue",
    borderRadius: 8,
    padding: 10,
  },
  buttonLinkDisabled: {
    backgroundColor: "#A0A0A0",
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
});
