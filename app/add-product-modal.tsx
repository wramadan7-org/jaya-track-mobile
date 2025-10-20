import { StyleSheet } from "react-native";
import { ProductFormComponent } from "../components/form/product-form";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";

export const AddProductModalScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Tambah Product</ThemedText>
      <ProductFormComponent />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
