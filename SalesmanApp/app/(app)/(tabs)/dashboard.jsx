// import { View, Text } from "react-native";

// export default function DashboardPage() {
//   return (
//     <View
//       style={{
//         flex:1,
//         justifyContent:"center",
//         alignItems:"center",
//       }}
//     >
//       <Text>Dashboard</Text>
//     </View>
//   );
// }/

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { setConfig, setLastSyncTime } from "../../../redux/store";
import { SyncService } from "../../../api/SyncService";
import { AuthService } from "../../../api/AuthService";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { lastSyncTime } = useSelector((state) => state.auth);

  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    pendingRecords: 0,
    pendingFiles: 0,
    activities: 0,
  });

  const runSync = useCallback(async () => {
    setSyncing(true);
    setSyncDone(false);
    setSyncError(null);
    try {
      const config = await SyncService.prepareSQLite();
      dispatch(setConfig(config));

      const now = new Date().toISOString();
      await AuthService.saveLastSyncTime(now);
      dispatch(setLastSyncTime(now));

      // If SyncService exposes counts, use them; otherwise default to 0
      setStats({
        pendingRecords: config?.pendingRecords ?? 0,
        pendingFiles: config?.pendingFiles ?? 0,
        activities: config?.activities ?? 0,
      });

      setSyncDone(true);
    } catch (err) {
      setSyncError(err.message || "Sync failed. Check network & try again.");
    } finally {
      setSyncing(false);
    }
  }, [dispatch]);

  // Auto-sync on mount
  useEffect(() => {
    runSync();
  }, [runSync]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await runSync();
    setRefreshing(false);
  }, [runSync]);

  const formatSyncTime = (iso) => {
    if (!iso) return "Never";
    const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#004B87"]}
        />
      }
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f2f4f7" />

      {/* Card */}
      <View style={styles.card}>
        {/* Header row */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Sync Data</Text>
            <Text style={styles.lastSync}>
              Last sync: {formatSyncTime(lastSyncTime)}
            </Text>
          </View>
          {syncDone && !syncError && (
            <View style={styles.syncedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#27ae60" />
              <Text style={styles.syncedText}>Synced</Text>
            </View>
          )}
          {syncError && (
            <View style={[styles.syncedBadge, { backgroundColor: "#fff3f3" }]}>
              <Ionicons name="close-circle" size={14} color="#e74c3c" />
              <Text style={[styles.syncedText, { color: "#e74c3c" }]}>
                Failed
              </Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="cloud-upload-outline" size={22} color="#004B87" />
            <Text style={styles.statNum}>{stats.pendingRecords}</Text>
            <Text style={styles.statLabel}>Pending Records</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Ionicons name="image-outline" size={22} color="#004B87" />
            <Text style={styles.statNum}>{stats.pendingFiles}</Text>
            <Text style={styles.statLabel}>Pending Files</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Ionicons name="calendar-outline" size={22} color="#004B87" />
            <Text style={styles.statNum}>{stats.activities}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>
        </View>

        {/* Sync Button */}
        <TouchableOpacity
          style={[styles.syncBtn, syncing && styles.syncBtnDisabled]}
          onPress={runSync}
          disabled={syncing}
          activeOpacity={0.85}
        >
          <Ionicons
            name={syncing ? "sync" : "sync-outline"}
            size={18}
            color="#fff"
            style={syncing && styles.spinning}
          />
          <Text style={styles.syncBtnText}>
            {syncing ? "Syncing..." : "Sync Now"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status area */}
      {!syncError ? (
        <View style={styles.statusArea}>
          <Ionicons
            name={syncDone ? "checkmark-circle" : "time-outline"}
            size={56}
            color={syncDone ? "#27ae60" : "#ccc"}
          />
          <Text style={[styles.statusTitle, syncDone && { color: "#27ae60" }]}>
            {syncing
              ? "Syncing..."
              : syncDone
                ? "All Data Synced"
                : "Waiting to sync"}
          </Text>
          <Text style={styles.statusDesc}>
            {syncDone
              ? "Your data is up to date with the server"
              : syncing
                ? "Please wait while we sync your data"
                : "Tap Sync Now to start"}
          </Text>
        </View>
      ) : (
        <View style={styles.statusArea}>
          <Ionicons name="cloud-offline-outline" size={56} color="#e74c3c" />
          <Text style={[styles.statusTitle, { color: "#e74c3c" }]}>
            Sync Failed
          </Text>
          <Text style={styles.statusDesc}>{syncError}</Text>
        </View>
      )}

      <Text style={styles.hint}>
        Pull down to refresh. Sync uploads local changes and downloads latest
        data.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f7" },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 0.5,
    borderColor: "#e0e4ea",
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  lastSync: { fontSize: 12, color: "#999", marginTop: 2 },
  syncedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f0faf4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  syncedText: { fontSize: 12, color: "#27ae60", fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#e0e4ea",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    gap: 4,
  },
  statBorder: { borderLeftWidth: 0.5, borderLeftColor: "#e0e4ea" },
  statNum: { fontSize: 22, fontWeight: "700", color: "#111" },
  statLabel: { fontSize: 11, color: "#888", textAlign: "center" },
  syncBtn: {
    backgroundColor: "#004B87",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  syncBtnDisabled: { opacity: 0.7 },
  syncBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  statusArea: { alignItems: "center", paddingVertical: 32, gap: 8 },
  statusTitle: { fontSize: 16, fontWeight: "700", color: "#333" },
  statusDesc: { fontSize: 13, color: "#888", textAlign: "center" },
  hint: {
    fontSize: 12,
    color: "#bbb",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 20,
    marginTop: 8,
  },
});
