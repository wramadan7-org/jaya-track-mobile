import type { Product } from "@/stores/product-store";
import { useProductStore } from "@/stores/product-store";
import { useState } from "react";
import { Alert, Button, StyleSheet, TextInput } from "react-native";
import { ThemedView } from "../themed-view";

export const ProductFormComponent = () => {
  const { addProduct } = useProductStore();

  const [formProduct, setFormProduct] = useState<Omit<Product, "id">>({
    name: "",
    qty: 0,
    price: 0,
  });

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

    addProduct({
      id: crypto.randomUUID(),
      ...formProduct,
    });

    Alert.alert("Sukses", "Barang berhasil ditambahkan");

    setFormProduct({
      name: "",
      qty: 0,
      price: 0,
    });
  };

  return (
    <ThemedView>
      <TextInput
        style={styles.input}
        placeholder="Nama Barang"
        value={formProduct.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Jumlah (Qty)"
        value={formProduct.qty ? formProduct.qty.toString() : ""}
        onChangeText={(text) => handleChange("qty", Number(text))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Harga per item"
        value={formProduct.price ? formProduct.price.toString() : ""}
        onChangeText={(text) => handleChange("price", Number(text))}
        keyboardType="numeric"
      />
      <Button title="Simpan Barang" onPress={handleSubmit} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});
