import { Product, useProductStore } from "@/stores/product-store";
import { useSalesStore, type Sale } from "@/stores/sales-store";
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { ThemedText } from "../themed-text";
import { ThemedTextInput } from "../themed-text-input";
import { ThemedView } from "../themed-view";
import { UnitType } from "../ui/unit-type-radio-button";
import SaleFormItemRow from "./sale-form-item-row";

type SaleFormProps = {
  initialData?: Sale;
  isEditMode?: boolean;
  id?: string;
};

export const SaleFormComponent = ({
  initialData,
  isEditMode = false,
  id,
}: SaleFormProps) => {
  const { addSale, updateSale } = useSalesStore();
  const { products } = useProductStore();

  const [formSale, setFormSale] = useState<
    Omit<Sale, "id" | "createdAt" | "updatedAt">
  >({
    store: "",
    area: "",
    items: [],
    totalAmount: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormSale({
        store: initialData.store,
        area: initialData.area,
        items: initialData.items,
        totalAmount: initialData.totalAmount,
      });
    }
  }, [initialData]);

  const handleAddItem = useCallback(() => {
    const newItem: Product & {
      qtySold: number;
      amountSold: number;
      unitType: "dozens" | "sack";
      subtotal: number;
    } = {
      id: "",
      name: "",
      fillPerSack: 0,
      basePrice: 0,
      qtyDozens: 0,
      qtySack: 0,
      unitType: "dozens",
      qtySold: 0,
      amountSold: 0,
      subtotal: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      targetPricePerDozens: 0,
      targetPricePerSack: 0,
    };

    setFormSale((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  }, []);

  const handleParentChange = useCallback(
    (key: string, value: string | number) => {
      setFormSale({ ...formSale, [key]: value });
    },
    [formSale]
  );

  const handleItemChange = useCallback(
    (
      index: number,
      key: keyof (Product & {
        qtySold: number;
        amountSold: number;
        subtotal: number;
        unitType: "dozens" | "sack";
      }),
      value: string | number
    ) => {
      const items = [...formSale.items];
      const item = items[index];

      // 🔹 ubah tipe data otomatis untuk number
      if (
        key === "qtySold" ||
        key === "amountSold" ||
        key === "subtotal" ||
        key === "fillPerSack" ||
        key === "basePrice" ||
        key === "qtyDozens" ||
        key === "qtySack"
      ) {
        (item[key] as number) = Number(value);
      } else {
        (item[key] as any) = value;
      }

      setFormSale((prev) => ({
        ...prev,
        items,
      }));
    },
    [formSale.items]
  );

  const handleItemPickerChange = useCallback(
    (index: number, value: string) => {
      const items = [...formSale.items];
      let item = items[index];

      const selected = products.find((p) => p.name === value);

      if (!selected) return;

      items[index] = {
        ...selected,
        subtotal: item.subtotal,
        qtySold: item.qtySold,
        amountSold:
          formSale.items[index].unitType === "sack"
            ? selected.targetPricePerSack
            : selected.targetPricePerDozens,
        unitType: item.unitType,
      };

      setFormSale((prev) => ({ ...prev, items }));
    },
    [formSale.items, products]
  );

  const handleItemRadioChange = useCallback(
    (index: number, value: UnitType) => {
      handleItemChange(index, "unitType", value);

      // Jika ganti tipe satuan, update juga harga sesuai tipe
      const selected = products.find(
        (p) => p.name === formSale.items[index].name
      );

      if (!selected) return;

      handleItemChange(
        index,
        "amountSold",
        value === "sack"
          ? selected.targetPricePerSack
          : selected.targetPricePerDozens
      );
    },
    [formSale.items, handleItemChange, products]
  );

  const handleRemoveItem = useCallback(
    (index: number) => {
      const items = [...formSale.items];
      items.splice(index, 1);
      const total = items.reduce(
        (sum, item) => sum + item.qtySold * item.amountSold,
        0
      );
      setFormSale({ ...formSale, items, totalAmount: total });
    },
    [formSale]
  );

  const handleSubmit = () => {
    try {
      if (formSale.items.length === 0) {
        Alert.alert("Error", "Harap tambahkan minimal satu item penjualan");
        return;
      }

      const invalidItem = formSale.items.find(
        (item) => !item.name || item.qtySold <= 0 || item.amountSold <= 0
      );

      if (invalidItem) {
        Alert.alert(
          "Error",
          "Harap lengkapi semua data item penjualan dengan benar"
        );
        return;
      }

      const invalidItemQty = formSale.items.find((item) => {
        const product = products.find((p) => p.name === item.name);
        if (!product) return true;
        if (item.unitType === "dozens") {
          return item.qtySold > product.qtyDozens;
        } else {
          return item.qtySold > product.qtySack;
        }
      });

      if (invalidItemQty) {
        Alert.alert(
          "Error",
          `Stok tidak mencukupi untuk barang: ${invalidItemQty.name}`
        );
        return;
      }

      if (isEditMode && id) {
        updateSale(id, formSale);
        Alert.alert("Sukses", "Penjualan berhasil diperbarui");
      } else {
        const newSale = {
          store: formSale.store,
          area: formSale.area,
          items: formSale.items,
        };
        addSale({ ...newSale, id: Date.now().toString() });
        setFormSale({
          store: "",
          area: "",
          items: [],
          totalAmount: 0,
        });
        Alert.alert("Sukses", "Penjualan berhasil ditambahkan");
      }
    } catch {
      Alert.alert("Error", "Terjadi kesalahan saat menyimpan penjualan");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.inputContainer]}>
        <ThemedText type="defaultSemiBold">Nama Toko</ThemedText>
        <ThemedTextInput
          style={styles.input}
          placeholder="Toko ABC"
          value={formSale.store}
          onChangeText={(text) => handleParentChange("store", text)}
        />
      </View>
      <View style={[styles.inputContainer]}>
        <ThemedText type="defaultSemiBold">Area</ThemedText>
        <ThemedTextInput
          style={styles.input}
          placeholder="Sragen"
          value={formSale.area}
          onChangeText={(text) => handleParentChange("area", text)}
        />
      </View>
      <View style={{ gap: 15 }}>
        {!!formSale.items.length && (
          <ThemedText type="defaultSemiBold">Item Penjualan</ThemedText>
        )}
        {formSale.items.map((item, index) => (
          <SaleFormItemRow
            key={index}
            index={index}
            item={item}
            products={products}
            formSale={formSale}
            onChange={handleItemChange}
            onRemove={handleRemoveItem}
            onPickerChange={handleItemPickerChange}
            onUnitChange={handleItemRadioChange}
          />
        ))}
      </View>
      <Pressable
        onPress={handleAddItem}
        style={[styles.button, styles.buttonAdd]}
      >
        <ThemedText style={[styles.centerText]}>Tambah Item</ThemedText>
      </Pressable>
      <Pressable
        onPress={handleSubmit}
        style={[styles.button, styles.buttonSubmit]}
      >
        <ThemedText style={[styles.centerText]}>Simpan Penjualan</ThemedText>
      </Pressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 15,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(36),
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
  buttonSubmit: {
    backgroundColor: "#34C759",
  },
  centerText: {
    textAlign: "center",
  },
  picker: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    flexDirection: "row",
    padding: 6,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 8,
    backgroundColor: "#eebabaed",
  },
});
