import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

type EmptyStateProps = {
  /** Judul utama yang ditampilkan */
  title?: string;
  /** Deskripsi tambahan */
  message?: string;
  /** Ikon dari Ionicons (default: cube-outline) */
  iconName?: keyof typeof Ionicons.glyphMap;
};

export function EmptyState({
  title = "Belum ada data",
  message = "Tambahkan data untuk mulai menggunakan fitur ini.",
  iconName = "cube-outline",
}: EmptyStateProps) {
  return (
    <ThemedView style={styles.container}>
      <Ionicons name={iconName} size={48} color="#A0A0A0" />
      <ThemedText type="defaultSemiBold" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText type="default" style={styles.message}>
        {message}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 8,
    flexGrow: 1,
  },
  title: {
    color: "#555",
    fontSize: 16,
    textAlign: "center",
  },
  message: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    maxWidth: 280,
  },
});
