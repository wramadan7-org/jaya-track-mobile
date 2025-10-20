import { useProductStore } from "@/stores/product-store";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { ProductFormComponent } from "../components/form/product-form";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";

export default function FormProductModalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { products } = useProductStore();

  const productToEdit = id ? products.find((p) => p.id === id) : undefined;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">
        {id ? "Edit Barang" : "Tambah Barang"}
      </ThemedText>
      <ProductFormComponent
        initialData={productToEdit}
        isEditMode={!!id}
        id={id}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
});
