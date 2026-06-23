import React, { useEffect, useState, useMemo } from "react";
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SQLiteService } from "../../api/SQLiteService";

export default function LoadPickerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const existingLines = useMemo(() => {
    try { return JSON.parse(params.lines || "[]"); } catch { return []; }
  }, [params.lines]);

  const [skus, setSkus] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selected, setSelected] = useState(() =>
    Object.fromEntries(existingLines.map((l) => [l.sku_id, l.quantity]))
  );

  useEffect(() => { SQLiteService.getSKUs().then(setSkus); }, []);

  const brands = useMemo(() => {
    const b = [...new Set(skus.map((s) => s.brand).filter(Boolean))];
    return ["All", ...b];
  }, [skus]);

  const filtered = useMemo(() => skus.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.code?.toLowerCase().includes(search.toLowerCase());
    const matchBrand = selectedBrand === "All" || s.brand === selectedBrand;
    return matchSearch && matchBrand;
  }), [skus, search, selectedBrand]);

  const toggle = (sku) => {
    setSelected((prev) => {
      if (prev[sku.id]) {
        const next = { ...prev };
        delete next[sku.id];
        return next;
      }
      return { ...prev, [sku.id]: 10 };
    });
  };

  const handleAdd = () => {
    const lines = Object.entries(selected).map(([skuId, qty]) => {
      const sku = skus.find((s) => s.id === skuId);
      return { sku_id: skuId, quantity: qty, uom: sku?.uom || "PCS", name: sku?.name, code: sku?.code };
    });
    router.replace({ pathname: "/(app)/load-create", params: { lines: JSON.stringify(lines) } });
  };

  const selectedCount = Object.keys(selected).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Select Products</Text>
          <Text style={styles.headerSub}>{skus.length} available</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={22} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color="#aaa" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, code..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Brand filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandsBar} contentContainerStyle={{ gap: 8, paddingHorizontal: 12 }}>
        {brands.map((b) => (
          <TouchableOpacity
            key={b}
            style={[styles.brandChip, selectedBrand === b && styles.brandChipActive]}
            onPress={() => setSelectedBrand(b)}
          >
            <Text style={[styles.brandChipText, selectedBrand === b && styles.brandChipTextActive]}>
              {b}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* SKU list */}
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((sku) => {
          const isSelected = !!selected[sku.id];
          return (
            <TouchableOpacity
              key={sku.id}
              style={[styles.skuRow, isSelected && styles.skuRowSelected]}
              onPress={() => toggle(sku)}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.skuName}>{sku.name}</Text>
                <View style={styles.skuMeta}>
                  <Text style={styles.skuCode}>{sku.code}</Text>
                  <View style={styles.uomBadge}>
                    <Text style={styles.uomText}>{sku.uom || "PCS"}</Text>
                  </View>
                  <Text style={styles.skuQty}>{isSelected ? selected[sku.id] : 10}</Text>
                </View>
                <Text style={styles.skuBarcode}>M: {sku.id}</Text>
              </View>
              <View style={[styles.addCircle, isSelected && styles.addCircleSelected]}>
                <Ionicons name={isSelected ? "checkmark" : "add"} size={18} color={isSelected ? "#fff" : "#004B87"} />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetBtn} onPress={() => setSelected({})}>
          <Ionicons name="refresh-outline" size={16} color="#555" />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addBtn, selectedCount === 0 && styles.addBtnDisabled]}
          onPress={handleAdd}
          disabled={selectedCount === 0}
        >
          <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
          <Text style={styles.addBtnText}>Add{selectedCount > 0 ? ` (${selectedCount})` : ""}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: 16, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  headerSub: { fontSize: 12, color: "#888", marginTop: 2 },
  searchWrap: { flexDirection: "row", alignItems: "center", gap: 8, margin: 12, marginBottom: 8, backgroundColor: "#f5f6f8", borderRadius: 8, paddingHorizontal: 12 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 13, color: "#333" },
  brandsBar: { maxHeight: 44, marginBottom: 4 },
  brandChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: "#f0f2f5", alignSelf: "flex-start" },
  brandChipActive: { backgroundColor: "#004B87" },
  brandChipText: { fontSize: 12, color: "#555", fontWeight: "500" },
  brandChipTextActive: { color: "#fff" },
  list: { paddingHorizontal: 12, paddingBottom: 80, gap: 0 },
  skuRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0", gap: 12 },
  skuRowSelected: { backgroundColor: "#f0f6ff" },
  skuName: { fontSize: 13, fontWeight: "500", color: "#111", marginBottom: 4 },
  skuMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  skuCode: { fontSize: 11, color: "#888" },
  uomBadge: { backgroundColor: "#e3f2fd", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 },
  uomText: { fontSize: 10, color: "#1976d2", fontWeight: "600" },
  skuQty: { fontSize: 11, color: "#e67e22", fontWeight: "600" },
  skuBarcode: { fontSize: 10, color: "#bbb", marginTop: 2 },
  addCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: "#004B87", alignItems: "center", justifyContent: "center" },
  addCircleSelected: { backgroundColor: "#004B87", borderColor: "#004B87" },
  footer: { flexDirection: "row", gap: 12, padding: 12, borderTopWidth: 0.5, borderTopColor: "#e0e4ea" },
  resetBtn: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1, justifyContent: "center", borderWidth: 0.5, borderColor: "#e0e4ea", borderRadius: 8, paddingVertical: 12 },
  resetText: { fontSize: 14, color: "#555" },
  addBtn: { flex: 2, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#004B87", borderRadius: 8, paddingVertical: 12 },
  addBtnDisabled: { backgroundColor: "#ccc" },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});