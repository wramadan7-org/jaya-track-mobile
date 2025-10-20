import { FlatList, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useProductStore } from "@/stores/product-store";
import { Link } from "expo-router";

export default function BroughtScreen() {
  const { products } = useProductStore();
  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Barang yang dibawa
        </ThemedText>
      </ThemedView>
      <ThemedView>
        <Link style={styles.buttonLink} href="/add-product-modal">
          <Link.Trigger>
            <ThemedText type="default">Tambah Barang</ThemedText>
          </Link.Trigger>
          <Link.Preview />
        </Link>
      </ThemedView>
      <ThemedView>
        <ThemedText type="defaultSemiBold">📦 Daftar Barang:</ThemedText>
        {products.length && (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ThemedText type="default">
                {item.name} - {item.qty} losin x Rp{item.price.toLocaleString()}
              </ThemedText>
            )}
          />
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  buttonLink: {
    backgroundColor: "blue",
    borderRadius: 8,
    padding: 10,
  },
});
