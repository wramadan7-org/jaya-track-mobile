import React from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { ThemedView } from "../themed-view";

type LoadingProps = {
  text?: string;
  fullscreen?: boolean;
};

const Loading: React.FC<LoadingProps> = ({
  text = "Loading...",
  fullscreen = true,
}) => {
  return (
    <ThemedView style={[styles.container, fullscreen && styles.fullscreen]}>
      <ActivityIndicator size="large" />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </ThemedView>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  fullscreen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 14,
    color: "#555",
  },
});
