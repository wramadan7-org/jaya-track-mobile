import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, TextInput, type TextInputProps } from "react-native";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  placeholderTextColor,
  ...rest
}: ThemedTextInputProps) {
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
    <TextInput
      style={[{ color: textColor, backgroundColor }, styles.input, style]}
      placeholderTextColor={placeholderTextColor || placeholderColor}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
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
