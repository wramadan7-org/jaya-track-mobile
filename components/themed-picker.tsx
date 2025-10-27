import { useThemeColor } from "@/hooks/use-theme-color";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, View } from "react-native";

export type ThemedPickerProps = {
  selectedValue: string | number;
  onValueChange: (value: any, index: number) => void;
  items: { label: string; value: string | number }[];
  placeholder?: string;
  lightColor?: string;
  darkColor?: string;
  style?: object;
  enabled?: boolean;
};

export function ThemedPicker({
  selectedValue,
  onValueChange,
  items,
  placeholder = "Pilih...",
  lightColor,
  darkColor,
  style,
  enabled = true,
}: ThemedPickerProps) {
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );
  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#1c1c1e" },
    "background"
  );
  const placeholderColor = useThemeColor(
    { light: "#999", dark: "#888" },
    "text"
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          opacity: enabled ? 1 : 0.5,
        },
        style,
      ]}
    >
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        enabled={enabled}
        style={[styles.picker, { color: textColor }]}
        dropdownIconColor={textColor}
      >
        <Picker.Item label={placeholder} value="" color={placeholderColor} />
        {items.map((item) => (
          <Picker.Item
            key={item.value}
            label={item.label}
            value={item.value}
            color={darkColor}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    justifyContent: "center",
  },
  picker: {
    width: "100%",
  },
});
