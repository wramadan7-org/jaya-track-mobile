import ParallaxScrollView from "@/components/parallax-scroll-view";
import { useProductStore } from "@/stores/product-store";
import { useLocalSearchParams } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { ProductFormComponent } from "../components/form/product-form";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";

export default function FormProductModalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { products } = useProductStore();

  const productToEdit = id ? products.find((p) => p.id === id) : undefined;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ParallaxScrollView>
          <ThemedView style={styles.container}>
            <ThemedText
              type="title"
              style={{
                padding: 10,
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
        </ParallaxScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});
