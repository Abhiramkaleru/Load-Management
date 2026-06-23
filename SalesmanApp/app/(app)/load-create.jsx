import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { SQLiteService } from "../../api/SQLiteService";
import { SyncService } from "../../api/SyncService";
import { AuthService } from "../../api/AuthService";

export default function LoadCreateScreen() {
  const router = useRouter();
  const { employee } = useSelector((s) => s.auth);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWarehousePicker, setShowWarehousePicker] = useState(false);

  useEffect(() => {
    const syncPending = async () => {
      const unsynced = await SQLiteService.getUnsynced();
      if (unsynced.length > 0) {
        for (const req of unsynced) {
          const lines = await SQLiteService.getLoadRequests().then(
            (reqs) => reqs.find((r) => r.id === req.id)?.lines || [],
          );
          try {
            await SyncService.uploadRequests([
              {
                uid: req.uid,
                warehouse_id: req.warehouse_id,
                lines,
              },
            ]);
            await SQLiteService.markSynced(req.id);
          } catch (_) {
            /* offline, try next time */
          }
        }
      }
    };
    syncPending();
  }, []);

  useEffect(() => {
    SQLiteService.getWarehouses().then((w) => {
      setWarehouses(w);
      if (w.length > 0) setSelectedWarehouse(w[0]);
    });
  }, []);

  const params = useLocalSearchParams();
  useEffect(() => {
    if (params.lines) {
      try {
        setLines(JSON.parse(params.lines));
      } catch {}
    }
  }, [params.lines]);

  const removeLine = (skuId) =>
    setLines((prev) => prev.filter((l) => l.sku_id !== skuId));

  // const handleConfirm = async () => {
  //   if (!selectedWarehouse)
  //     return Alert.alert("Error", "Please select a warehouse.");
  //   if (lines.length === 0)
  //     return Alert.alert("Error", "Add at least one product.");
  //   setLoading(true);
  //   try {
  //     const uid = `${employee?.code || "EMP"}LR${Date.now()}`;
  //     const req = await SQLiteService.createLoadRequest(
  //       uid,
  //       selectedWarehouse.id,
  //       employee?.id,
  //       lines,
  //     );
  //     // Try to sync immediately
  //     try {
  //       await SyncService.uploadRequests([
  //         { uid, warehouse_id: selectedWarehouse.id, lines },
  //       ]);
  //       await SQLiteService.markSynced(req.id);
  //     } catch (_) {
  //       /* offline — will sync later */
  //     }
  //     router.replace("/(app)/(tabs)/inventory/load");
  //   } catch (err) {
  //     Alert.alert("Error", err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleConfirm = async () => {
    if (!selectedWarehouse) {
      return Alert.alert("Error", "Please select a warehouse.");
    }

    if (lines.length === 0) {
      return Alert.alert("Error", "Add at least one product.");
    }

    setLoading(true);

    try {
      // Get employee from Redux or AsyncStorage
      const auth = await AuthService.getAuth();

      const employeeId = employee?.id || auth?.employee?.id;

      if (!employeeId) {
        return Alert.alert(
          "Error",
          "Employee information not found. Please login again.",
        );
      }

      const uid = `${employee?.code || "EMP"}LR${Date.now()}`;

      // Save locally first (works offline)
      const req = await SQLiteService.createLoadRequest(
        uid,
        selectedWarehouse.id,
        employeeId,
        lines,
      );

      let synced = false;

      // Try immediate sync
      try {
        await SyncService.uploadQueue();
        synced = true;
      } catch (err) {
        console.log("Offline mode - will sync later");
        synced = false;
      }

      Alert.alert(
        "Success",
        synced
          ? "Load request created and synced successfully."
          : "Load request saved offline and will sync automatically when internet is available.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(app)/(tabs)/inventory");
            },
          },
        ],
      );
    } catch (err) {
      console.error("Create request error:", err);

      Alert.alert("Error", err?.message || "Failed to create load request.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      {/* Warehouse picker */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>LOAD FROM</Text>
        <TouchableOpacity
          style={styles.warehouseRow}
          onPress={() => setShowWarehousePicker(!showWarehousePicker)}
        >
          <Text style={styles.warehouseText}>
            {selectedWarehouse?.name || "Select warehouse..."}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#555" />
        </TouchableOpacity>
        {showWarehousePicker && (
          <View style={styles.dropdown}>
            {warehouses.map((w) => (
              <TouchableOpacity
                key={w.id}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedWarehouse(w);
                  setShowWarehousePicker(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    selectedWarehouse?.id === w.id && {
                      color: "#004B87",
                      fontWeight: "600",
                    },
                  ]}
                >
                  {w.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Product lines */}
      <ScrollView contentContainerStyle={styles.linesList}>
        {lines.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={56} color="#ccc" />
            <Text style={styles.emptyTitle}>No products added</Text>
            <Text style={styles.emptyDesc}>
              Tap the + button to add products
            </Text>
          </View>
        ) : (
          lines.map((line) => (
            <View key={line.sku_id} style={styles.lineCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.lineName}>{line.name}</Text>
                <Text style={styles.lineMeta}>
                  {line.code} · {line.uom} · {line.quantity}
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeLine(line.sku_id)}>
                <Ionicons name="close-circle-outline" size={22} color="#ccc" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Product FAB */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          router.push({
            pathname: "/(app)/load-picker",
            params: { lines: JSON.stringify(lines) },
          })
        }
      >
        <Ionicons name="add" size={18} color="#fff" />
        <Text style={styles.addBtnText}>Add Product</Text>
      </TouchableOpacity>

      {/* Confirm */}
      <TouchableOpacity
        style={[
          styles.confirmBtn,
          (loading || lines.length === 0) && styles.confirmDisabled,
        ]}
        onPress={handleConfirm}
        disabled={loading || lines.length === 0}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmText}>Confirm</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f7" },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e4ea",
  },
  sectionLabel: {
    fontSize: 10,
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  warehouseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  warehouseText: { fontSize: 15, fontWeight: "500", color: "#111" },
  dropdown: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#e0e4ea",
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  dropdownText: { fontSize: 14, color: "#333" },
  linesList: { padding: 16, gap: 8, paddingBottom: 160 },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: "500", color: "#555" },
  emptyDesc: { fontSize: 13, color: "#aaa" },
  lineCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 0.5,
    borderColor: "#e0e4ea",
  },
  lineName: { fontSize: 14, fontWeight: "500", color: "#111" },
  lineMeta: { fontSize: 12, color: "#888", marginTop: 2 },
  addBtn: {
    position: "absolute",
    bottom: 72,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#004B87",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    elevation: 4,
  },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  confirmBtn: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#004B87",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmDisabled: { backgroundColor: "#ccc" },
  confirmText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
