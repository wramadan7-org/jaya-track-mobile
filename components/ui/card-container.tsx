import { ViewStyle } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { ThemedView } from "../themed-view";

export default function CardContainer({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <ThemedView
      lightColor="#fff"
      darkColor="#151718"
      style={[
        {
          borderRadius: 12,
          padding: moderateScale(10),
          borderColor: "#ccc",
          borderWidth: 1,
        },
        style,
      ]}
    >
      {children}
    </ThemedView>
  );
}
