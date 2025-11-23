import { useProductStore } from "@/stores/product-store";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { moderateScale } from "react-native-size-matters";
import { ProductFormComponent } from "../components/form/product-form";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";

export default function FormProductModalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { products } = useProductStore();

  const productToEdit = id ? products.find((p) => p.id === id) : undefined;

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText
          type="title"
          style={{
            paddingTop: moderateScale(36),
          }}
        >
          {id ? "Edit Barang" : "Tambah Barang"}
        </ThemedText>
        <ProductFormComponent
          initialData={productToEdit}
          isEditMode={!!id}
          id={id}
        />
      </ThemedView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
