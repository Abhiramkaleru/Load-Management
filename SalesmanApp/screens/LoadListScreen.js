import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setLoads } from "../redux/store";
import { SQLiteService } from "../api/SQLiteService";
import { SyncService } from "../api/SyncService";

const TABS = ["Requested", "Supervisor", "Gatekeeper", "Collected"];

export function LoadListScreen({ onNavigate }) {
  const dispatch = useDispatch();
  const loads = useSelector((state) => state.loads.requests);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("Requested");
  const isSyncing = useSelector((state) => state.sync.isSyncing);

  const loadData = async () => {
    const requests = await SQLiteService.getLoadRequests();
    dispatch(setLoads(requests));
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await SyncService.uploadQueue();
      await SyncService.deltaSync();
      await loadData();
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredLoads = loads.filter((load) => {
    if (activeTab === "Requested") return load.status === "Pending";
    if (activeTab === "Supervisor") return load.status === "Supervisor";
    if (activeTab === "Gatekeeper") return load.status === "Gatekeeper";
    if (activeTab === "Collected") return load.status === "Approved";
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
            {tab === "Requested" && (
              <Text
                style={[
                  styles.tabBadge,
                  activeTab === tab && styles.tabBadgeActive,
                ]}
              >
                {loads.filter((l) => l.status === "Pending").length}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Load List */}
      <FlatList
        data={filteredLoads}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("CreateLoad", { loadId: item.id })
            }
          >
            <View style={styles.cardTop}>
              <View style={styles.cardInfo}>
                <Text style={styles.loadId}>{item.uid}</Text>
                <View style={styles.cardMeta}>
                  <Text style={styles.status}>{item.status}</Text>
                  <Text style={styles.warehouseName}>{item.warehouse_id}</Text>
                </View>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {item.status === "Pending" ? "Requested" : item.status}
                </Text>
              </View>
            </View>
            <View style={styles.cardBottom}>
              <Text style={styles.itemCount}>
                {item.lines?.length || 0} items
              </Text>
              {item.synced === 0 && (
                <Text style={styles.syncPending}>⬆️ Pending</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No {activeTab.toLowerCase()} loads
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateLoad")}
        disabled={isSyncing}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabsContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingHorizontal: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#004B87",
  },
  tabText: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#004B87",
    fontWeight: "600",
  },
  tabBadge: {
    marginLeft: 6,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
  },
  tabBadgeActive: {
    backgroundColor: "#004B87",
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardInfo: {
    flex: 1,
  },
  loadId: {
    fontSize: 13,
    fontWeight: "600",
    color: "#004B87",
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  status: {
    fontSize: 12,
    color: "#666",
    marginRight: 8,
  },
  warehouseName: {
    fontSize: 12,
    color: "#999",
  },
  badge: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  itemCount: {
    fontSize: 12,
    color: "#666",
  },
  syncPending: {
    fontSize: 11,
    color: "#FFA500",
    fontWeight: "500",
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#004B87",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
  },
});
