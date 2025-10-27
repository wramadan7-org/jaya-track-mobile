import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

export type UnitType = "dozens" | "sack";

type Props = {
  selected: UnitType;
  onChange: (value: UnitType) => void;
};

export const UnitRadioButton = ({ selected, onChange }: Props) => {
  return (
    <View style={styles.container}>
      {[
        { label: "Losin", value: "dozens" },
        { label: "Sak", value: "sack" },
      ].map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.optionContainer}
          onPress={() => onChange(option.value as UnitType)}
        >
          <View style={styles.radioOuter}>
            {selected === option.value && <View style={styles.radioInner} />}
          </View>
          <ThemedText
            type="defaultSemiBold"
            style={{
              color: selected === option.value ? "#000" : "#666",
            }}
          >
            {option.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginVertical: 8,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#024908ff",
  },
});
