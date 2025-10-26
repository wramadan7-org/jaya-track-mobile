import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { ReactElement } from "react";
import { FlatList, FlatListProps, StyleSheet, ViewStyle } from "react-native";

type CustomScrollListProps<T> = FlatListProps<T> & {
  /** Konten header yang akan muncul di atas list */
  headerComponent?: ReactElement;
  /** Komponen footer di bawah list */
  footerComponent?: ReactElement;
  /** Apakah header menempel di atas saat di-scroll */
  stickyHeader?: boolean;
  /** Apakah footer menempel di bawah layar */
  stickyFooter?: boolean;
  /** Warna background mengikuti tema */
  containerStyle?: ViewStyle;
};

/**
 * Komponen reusable seperti ParallaxScrollView,
 * tapi berbasis FlatList agar performa tinggi dan bisa sticky header.
 */
export function FlatListScrollView<T>({
  headerComponent,
  footerComponent,
  stickyHeader = false,
  stickyFooter = false,
  containerStyle,
  ...flatListProps
}: CustomScrollListProps<T>) {
  const backgroundColor = useThemeColor({}, "background");

  return (
    <ThemedView style={[styles.container]}>
      <FlatList
        {...flatListProps}
        ListHeaderComponent={
          headerComponent ? (
            <ThemedView style={styles.headerContainer}>
              {headerComponent}
            </ThemedView>
          ) : undefined
        }
        stickyHeaderIndices={stickyHeader && headerComponent ? [0] : undefined}
        contentContainerStyle={[
          styles.contentContainer,
          containerStyle,
          flatListProps.contentContainerStyle,
          stickyFooter ? { paddingBottom: 100 } : null,
        ]}
        style={[{ backgroundColor }, flatListProps.style]}
      />
      {/* Footer sticky */}
      {stickyFooter && footerComponent && (
        <ThemedView style={styles.footerFixed}>{footerComponent}</ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    zIndex: 10,
    paddingVertical: 34,
  },
  contentContainer: {
    paddingHorizontal: 32,
    paddingVertical: 36,
    gap: 16,
  },
  footerContainer: {
    paddingVertical: 24,
    borderWidth: 2,
    borderColor: "red",
  },
  footerFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
});
