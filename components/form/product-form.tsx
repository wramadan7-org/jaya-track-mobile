import type { Product } from "@/stores/product-store";
import { useProductStore } from "@/stores/product-store";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";
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
    qtyDozens: 0,
    qtySack: 0,
    basePricePerDozens: 0,
    basePricePerSack: 0,
    targetPricePerDozens: 0,
    targetPricePerSack: 0,
    fillPerSack: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormProduct({
        name: initialData.name,
        qtyDozens: initialData.qtyDozens,
        qtySack: initialData.qtySack,
        basePricePerDozens: initialData.basePricePerDozens,
        basePricePerSack: initialData.basePricePerSack,
        targetPricePerDozens: initialData.targetPricePerDozens,
        targetPricePerSack: initialData.targetPricePerSack,
        fillPerSack: initialData.fillPerSack,
      });
    }
  }, [initialData]);

  const handleChange = (
    field: keyof Omit<Product, "id">,
    value: string | number
  ) => {
    setFormProduct((prev) => {
      const updated = { ...prev, [field]: value };

      // Kalkulasi otomatis antara qtyDozens dan qtySack
      if (field === "qtyDozens" && prev.fillPerSack > 0) {
        const result = Number(value) / prev.fillPerSack;
        updated.qtySack = Math.floor(result * 10) / 10;
      } else if (field === "qtySack" && prev.fillPerSack > 0) {
        const result = Number(value) * prev.fillPerSack;
        updated.qtyDozens = Math.floor(result * 10) / 10;
      }

      return updated;
    });
  };

  const handleChangeFillPerSack = (value: string) => {
    const num = Number(value);
    setFormProduct((prev) => ({
      ...prev,
      fillPerSack: num,
      // Reset qty kalau fillPerSack kosong
      qtyDozens: num ? prev.qtyDozens : 0,
      qtySack: num ? prev.qtySack : 0,
    }));
  };

  const handleSubmit = () => {
    const {
      name,
      qtyDozens,
      qtySack,
      basePricePerDozens,
      basePricePerSack,
      fillPerSack,
    } = formProduct;

    if (!name || !fillPerSack) {
      Alert.alert(
        "Form tidak lengkap",
        "Nama barang dan isi per sak wajib diisi"
      );
      return;
    }

    if (!qtyDozens && !qtySack) {
      Alert.alert("Form tidak lengkap", "Isi jumlah losin atau jumlah sak");
      return;
    }

    if (!basePricePerDozens || !basePricePerSack) {
      Alert.alert("Form tidak lengkap", "Harga barang belum diisi");
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
      qtyDozens: 0,
      qtySack: 0,
      basePricePerDozens: 0,
      basePricePerSack: 0,
      targetPricePerDozens: 0,
      targetPricePerSack: 0,
      fillPerSack: 0,
    });
  };

  const isFillSet = formProduct.fillPerSack > 0;
  const fill = formProduct.fillPerSack;
  const dozens = formProduct.qtyDozens;
  const unitSak = Math.floor(dozens / fill);
  const remaining = dozens % fill;

  const displayText = `${unitSak} sak${
    remaining ? ` lebih ${remaining} losin` : ""
  }`;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.inputContainer]}>
        <ThemedText type="defaultSemiBold">Nama Barang</ThemedText>
        <ThemedTextInput
          style={styles.input}
          placeholder="Serok Jumbo"
          value={formProduct.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        <View style={[styles.inputContainer]}>
          <ThemedText type="defaultSemiBold">
            Isi per sak (satuan: losin)
          </ThemedText>
          <ThemedTextInput
            style={styles.input}
            placeholder="10"
            value={
              formProduct.fillPerSack ? formProduct.fillPerSack.toString() : ""
            }
            onChangeText={(text) => handleChangeFillPerSack(text)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputWrapper}>
          <View style={[styles.inputContainer]}>
            <ThemedText
              type="defaultSemiBold"
              style={!isFillSet && styles.disabledLabel}
            >
              Jumlah losin
            </ThemedText>
            <ThemedTextInput
              style={[styles.input, !isFillSet && styles.disabledInput]}
              editable={isFillSet}
              placeholder="10"
              value={
                formProduct.qtyDozens ? formProduct.qtyDozens.toString() : ""
              }
              onChangeText={(text) => handleChange("qtyDozens", Number(text))}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputContainer]}>
            <ThemedText
              type="defaultSemiBold"
              style={!isFillSet && styles.disabledLabel}
            >
              Jumlah sak
            </ThemedText>
            <ThemedTextInput
              style={[styles.input, !isFillSet && styles.disabledInput]}
              editable={isFillSet}
              placeholder="1"
              value={formProduct.qtySack ? formProduct.qtySack.toString() : ""}
              onChangeText={(text) => handleChange("qtySack", Number(text))}
              keyboardType="numeric"
            />
            {formProduct.qtySack > 0 && remaining > 0 && (
              <ThemedText
                type="subtitle"
                style={{ fontSize: 9, color: "#dbd94eff", marginTop: -22.5 }}
              >
                {displayText}
              </ThemedText>
            )}
          </View>
        </View>
        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold">Harga Dasar</ThemedText>
          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer]}>
              <ThemedText type="defaultSemiBold">Losin</ThemedText>
              <ThemedTextInput
                style={styles.input}
                placeholder="15000"
                value={
                  formProduct.basePricePerDozens
                    ? formProduct.basePricePerDozens.toString()
                    : ""
                }
                onChangeText={(text) =>
                  handleChange("basePricePerDozens", Number(text))
                }
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputContainer]}>
              <ThemedText type="defaultSemiBold">Sak</ThemedText>
              <ThemedTextInput
                style={styles.input}
                placeholder="83000"
                value={
                  formProduct.basePricePerSack
                    ? formProduct.basePricePerSack.toString()
                    : ""
                }
                onChangeText={(text) =>
                  handleChange("basePricePerSack", Number(text))
                }
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold">Harga Target</ThemedText>
          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer]}>
              <ThemedText type="defaultSemiBold">Losin</ThemedText>
              <ThemedTextInput
                style={styles.input}
                placeholder="15000"
                value={
                  formProduct.targetPricePerDozens
                    ? formProduct.targetPricePerDozens.toString()
                    : ""
                }
                onChangeText={(text) =>
                  handleChange("targetPricePerDozens", Number(text))
                }
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputContainer]}>
              <ThemedText type="defaultSemiBold">Sak</ThemedText>
              <ThemedTextInput
                style={styles.input}
                placeholder="83000"
                value={
                  formProduct.targetPricePerSack
                    ? formProduct.targetPricePerSack.toString()
                    : ""
                }
                onChangeText={(text) =>
                  handleChange("targetPricePerSack", Number(text))
                }
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </View>
      <Pressable
        onPress={handleSubmit}
        style={[styles.button, styles.buttonAdd]}
      >
        <ThemedText style={[styles.centerText]}>Simpan Barang</ThemedText>
      </Pressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    gap: 10,
  },
  inputContainer: {
    flexDirection: "column",
    gap: 10,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: "auto",
    flex: 1,
  },
  disabledInput: {
    backgroundColor: "#cac6c6ff",
    color: "#999",
  },
  disabledLabel: {
    color: "#999",
  },
  inputGroup: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    padding: 10,
    gap: 10,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    flex: 1,
  },
  buttonAdd: {
    backgroundColor: "#007AFF",
  },
  centerText: {
    textAlign: "center",
  },
});
