import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const LOAD_TYPES = [
  { id: "manual", label: "Manual", desc: "Enter quantities manually", icon: "create-outline" },
  { id: "auto",   label: "Auto",   desc: "Auto-calculate based on route", icon: "flash-outline" },
  { id: "asrm",   label: "ASRM Auto", desc: "Auto-calculate using ASRM per-store recommendations", icon: "analytics-outline" },
];

export default function LoadStartScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState("manual");

  return (
    <SafeAreaView style={styles.overlay}>
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>Select Load Type</Text>
          <Text style={styles.subtitle}>Choose how you want to load stock</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        {LOAD_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[styles.option, selected === type.id && styles.optionSelected]}
            onPress={() => setSelected(type.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.radio, selected === type.id && styles.radioSelected]}>
              {selected === type.id && <View style={styles.radioDot} />}
            </View>
            <View style={styles.optionText}>
              <Text style={[styles.optionLabel, selected === type.id && styles.optionLabelSelected]}>
                {type.label}
              </Text>
              <Text style={styles.optionDesc}>{type.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => router.push("/(app)/load-create")}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, paddingBottom: 40,
  },
  handle: { width: 40, height: 4, backgroundColor: "#e0e0e0", borderRadius: 2, alignSelf: "center", marginBottom: 20 },
  header: { marginBottom: 20, position: "relative" },
  title: { fontSize: 17, fontWeight: "700", color: "#111" },
  subtitle: { fontSize: 13, color: "#888", marginTop: 4 },
  closeBtn: { position: "absolute", right: 0, top: 0, padding: 4 },
  option: {
    flexDirection: "row", alignItems: "flex-start", gap: 14,
    padding: 14, borderRadius: 10, borderWidth: 1.5,
    borderColor: "#e0e4ea", marginBottom: 10,
  },
  optionSelected: { borderColor: "#004B87", backgroundColor: "#f0f6ff" },
  radio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: "#ccc", alignItems: "center", justifyContent: "center", marginTop: 1,
  },
  radioSelected: { borderColor: "#004B87" },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#004B87" },
  optionText: { flex: 1 },
  optionLabel: { fontSize: 14, fontWeight: "600", color: "#333" },
  optionLabelSelected: { color: "#004B87" },
  optionDesc: { fontSize: 12, color: "#888", marginTop: 3, lineHeight: 18 },
  continueBtn: {
    backgroundColor: "#004B87", borderRadius: 10,
    paddingVertical: 14, alignItems: "center", marginTop: 8,
  },
  continueBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});