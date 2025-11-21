import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

type State = {
  hasError: boolean;
  error?: Error;
};

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.log("🔥 ErrorBoundary caught an error:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Terjadi Kesalahan 😢</Text>
          <Text style={styles.message}>
            {this.state.error?.message ?? "Error tidak diketahui."}
          </Text>
          <Button title="Coba Muat Ulang" onPress={this.handleReload} />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
});
