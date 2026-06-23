import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LoadDetailScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#004B87" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Ionicons name="construct-outline" size={90} color="#004B87" />

        <Text style={styles.title}>Coming Soon</Text>

        <Text style={styles.subtitle}>
          Load request details screen is currently under development.
        </Text>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.homeButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },

  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#004B87",
    fontWeight: "600",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#004B87",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },

  homeButton: {
    marginTop: 32,
    backgroundColor: "#004B87",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  homeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
