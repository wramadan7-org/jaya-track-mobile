import type { Product } from "@/stores/product-store";
import { useProductStore } from "@/stores/product-store";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet } from "react-native";
import { ThemedTextInput } from "../themed-text-input";
import { ThemedView } from "../themed-view";

type ProductFormProps = {
  initialData?: Product;
  isEditMode?: boolean;
  id?: string;
};

export const ProductFormComponent = ({
  initialData,
  isEditMode = false,
  id,
}: ProductFormProps) => {
  const { addProduct, updateProduct } = useProductStore();

  const [formProduct, setFormProduct] = useState<
    Omit<Product, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    qty: 0,
    price: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormProduct({
        name: initialData.name,
        qty: initialData.qty,
        price: initialData.price,
      });
    }
  }, [initialData]);

  const handleChange = (
    field: keyof Omit<Product, "id">,
    value: string | number
  ) => {
    setFormProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formProduct.name || formProduct.qty <= 0 || formProduct.price <= 0) {
      Alert.alert("Form tidak lengkap", "Semua field harus diisi");
      return;
    }

    if (isEditMode && id) {
      updateProduct(id, formProduct);
      Alert.alert("Sukses", "Barang berhasil diperbarui");
    } else {
      addProduct({
        id: Date.now().toString(),
        ...formProduct,
      });
      Alert.alert("Sukses", "Barang berhasil ditambahkan");
    }

    setFormProduct({
      name: "",
      qty: 0,
      price: 0,
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedTextInput
        style={styles.input}
        placeholder="Nama Barang"
        value={formProduct.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <ThemedTextInput
        style={styles.input}
        placeholder="Jumlah (Qty)"
        value={formProduct.qty ? formProduct.qty.toString() : ""}
        onChangeText={(text) => handleChange("qty", Number(text))}
        keyboardType="numeric"
      />
      <ThemedTextInput
        style={styles.input}
        placeholder="Harga per losin"
        value={formProduct.price ? formProduct.price.toString() : ""}
        onChangeText={(text) => handleChange("price", Number(text))}
        keyboardType="numeric"
      />
      <Button title="Simpan Barang" onPress={handleSubmit} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    width: "auto",
  },
});
