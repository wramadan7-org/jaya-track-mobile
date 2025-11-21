import { SaleFormComponent } from "@/components/form/sale-form";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { useSalesStore } from "@/stores/sales-store";
import { useLocalSearchParams } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";

export default function FormSaleModalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { sales } = useSalesStore();

  const saleToEdit = id ? sales.find((s) => s.id === id) : undefined;

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
                padding: moderateScale(10),
              }}
            >
              {id ? "Edit Penjualan" : "Tambah Penjualan"}
            </ThemedText>
            <SaleFormComponent
              initialData={saleToEdit}
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
