import { Product } from "@/stores/product-store";
import { Sale } from "@/stores/sales-store";
import { Ionicons } from "@expo/vector-icons";
import { memo, useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";
import { ThemedPicker } from "../themed-picker";
import { ThemedText } from "../themed-text";
import { ThemedTextInput } from "../themed-text-input";
import { ThemedView } from "../themed-view";
import { UnitRadioButton, UnitType } from "../ui/unit-type-radio-button";

type SaleItemRowProps = {
  index: number;
  item: {
    id: string;
    name: string;
    qtyDozens: number;
    qtySack: number;
    qtySold: number;
    amountSold: number;
    unitType: UnitType;
  };
  products: Product[];
  formSale: Omit<Sale, "id" | "createdAt" | "updatedAt">;
  onChange: (
    index: number,
    key: keyof (Product & {
      qtySold: number;
      amountSold: number;
      subtotal: number;
      unitType: "dozens" | "sack";
    }),
    value: string | number
  ) => void;
  onRemove: (index: number) => void;
  onPickerChange: (index: number, value: string) => void;
  onUnitChange: (index: number, value: UnitType) => void;
};

const SaleFormItemRow = ({
  index,
  item,
  products,
  formSale,
  onChange,
  onRemove,
  onPickerChange,
  onUnitChange,
}: SaleItemRowProps) => {
  const pickerItems = useMemo(() => {
    const selectedNames = formSale.items
      .filter((_: any, i: number) => i !== index)
      .map((it: any) => it.name)
      .filter(Boolean);

    return products
      .filter((p) => p.qtyDozens > 0)
      .filter((p) => !selectedNames.includes(p.name))
      .map((p) => ({
        id: p.id,
        label: p.name,
        value: p.name,
      }));
  }, [products, formSale.items, index]);

  return (
    <ThemedView
      key={`sale-item-${index}`}
      style={{
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "#ccc",
        padding: 10,
        gap: 10,
      }}
    >
      <ThemedView style={[styles.inputContainer]}>
        <ThemedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ThemedText type="defaultSemiBold">Nama Barang</ThemedText>
          <ThemedText>#{index + 1}</ThemedText>
        </ThemedView>
        <ThemedPicker
          selectedValue={item.name}
          onValueChange={(value) => onPickerChange(index, value)}
          items={pickerItems}
          placeholder="Pilih barang..."
        />
      </ThemedView>
      <ThemedView style={[styles.inputContainer]}>
        <ThemedText type="defaultSemiBold">Qty</ThemedText>
        <ThemedTextInput
          placeholder="5"
          keyboardType="numeric"
          value={item.qtySold ? item.qtySold.toString() : ""}
          onChangeText={(text) => onChange(index, "qtySold", text)}
        />
        {item.name && (
          <ThemedText
            type="default"
            style={{ fontSize: 12, marginTop: -25, color: "#b7b477ff" }}
          >
            Stok tersedia:{" "}
            {item.unitType === "dozens"
              ? item.qtyDozens + " losin"
              : item.qtySack + " sak"}
          </ThemedText>
        )}
      </ThemedView>
      <ThemedView style={[styles.inputContainer]}>
        <ThemedText type="defaultSemiBold">Tipe Satuan</ThemedText>
        <UnitRadioButton
          selected={item.unitType}
          onChange={(value) => onUnitChange(index, value)}
        />
      </ThemedView>
      <ThemedView style={[styles.inputContainer]}>
        <ThemedText type="defaultSemiBold">Harga</ThemedText>
        <ThemedTextInput
          placeholder="15000"
          keyboardType="numeric"
          value={item.amountSold ? item.amountSold.toString() : ""}
          onChangeText={(text) => onChange(index, "amountSold", text)}
        />
      </ThemedView>
      <ThemedView style={styles.iconContainer}>
        <Pressable style={[styles.iconButton]} onPress={() => onRemove(index)}>
          <Ionicons name="trash-outline" size={16} color="#FF3B30" />
          <ThemedText type="default">Hapus</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
};

export default memo(SaleFormItemRow);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "column",
    gap: 10,
    flex: 1,
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
