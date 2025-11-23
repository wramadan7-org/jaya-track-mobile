import { SaleFormComponent } from "@/components/form/sale-form";
import { useSalesStore } from "@/stores/sales-store";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { moderateScale } from "react-native-size-matters";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";

export default function FormSaleModalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { sales } = useSalesStore();

  const saleToEdit = id ? sales.find((s) => s.id === id) : undefined;

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText
          type="title"
          style={{
            paddingTop: moderateScale(36),
          }}
        >
          {id ? "Edit Penjualan" : "Tambah Penjualan"}
        </ThemedText>
        <SaleFormComponent initialData={saleToEdit} isEditMode={!!id} id={id} />
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
