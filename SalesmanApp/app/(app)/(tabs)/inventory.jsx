// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   RefreshControl,
//   ActivityIndicator,
// } from "react-native";
// import { useRouter } from "expo-router";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { SQLiteService } from "../../../api/SQLiteService";

// const STATUS_TABS = ["Requested", "Supervisor", "Gatekeeper", "Collected"];

// const STATUS_COLORS = {
//   Pending: { bg: "#fff3e0", text: "#e67e22" },
//   Requested: { bg: "#fff3e0", text: "#e67e22" },
//   Approved: { bg: "#e8f5e9", text: "#27ae60" },
//   Rejected: { bg: "#fdecea", text: "#e74c3c" },
//   Collected: { bg: "#e3f2fd", text: "#1976d2" },
// };

// export default function LoadListScreen() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState(0);
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const load = useCallback(async () => {
//     const data = await SQLiteService.getLoadRequests();
//     setRequests(data);
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await load();
//     setRefreshing(false);
//   };

//   const filtered = requests.filter((r) => {
//     const tab = STATUS_TABS[activeTab];
//     if (tab === "Requested")
//       return r.status === "Pending" || r.status === "Requested";
//     if (tab === "Supervisor") return r.status === "Supervisor";
//     if (tab === "Gatekeeper") return r.status === "Gatekeeper";
//     if (tab === "Collected") return r.status === "Collected";
//     return true;
//   });

//   const counts = STATUS_TABS.map((tab) => {
//     if (tab === "Requested")
//       return requests.filter(
//         (r) => r.status === "Pending" || r.status === "Requested",
//       ).length;
//     return requests.filter((r) => r.status === tab).length;
//   });

//   if (loading)
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator color="#004B87" size="large" />
//       </View>
//     );

//   return (
//     <View style={styles.container}>
//       {/* Top action row */}
//       <View style={styles.actionRow}>
//         {["Load", "Unload", "Van"].map((label, i) => (
//           <TouchableOpacity key={label} style={styles.actionBtn}>
//             <Ionicons
//               name={
//                 i === 0
//                   ? "download-outline"
//                   : i === 1
//                     ? "upload-outline"
//                     : "car-outline"
//               }
//               size={16}
//               color="#004B87"
//             />
//             <Text style={styles.actionBtnText}>{label}</Text>
//           </TouchableOpacity>
//         ))}
//         <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
//           <Ionicons name="refresh-outline" size={18} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Status Tabs */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={styles.tabsBar}
//       >
//         {STATUS_TABS.map((tab, i) => (
//           <TouchableOpacity
//             key={tab}
//             onPress={() => setActiveTab(i)}
//             style={styles.tab}
//           >
//             <Text style={[styles.tabText, activeTab === i && styles.tabActive]}>
//               {tab}
//               {counts[i] > 0 ? ` ${counts[i]}` : ""}
//             </Text>
//             {activeTab === i && <View style={styles.tabIndicator} />}
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* List */}
//       <ScrollView
//         contentContainerStyle={styles.list}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={["#004B87"]}
//           />
//         }
//       >
//         {filtered.length === 0 ? (
//           <View style={styles.empty}>
//             <Ionicons name="cube-outline" size={48} color="#ccc" />
//             <Text style={styles.emptyText}>No requests found</Text>
//           </View>
//         ) : (
//           filtered.map((req) => {
//             const color = STATUS_COLORS[req.status] || STATUS_COLORS.Pending;
//             return (
//               <TouchableOpacity
//                 key={req.id}
//                 style={styles.card}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.cardTop}>
//                   <Text style={styles.cardUid}>{req.uid}</Text>
//                   <View style={[styles.badge, { backgroundColor: color.bg }]}>
//                     <Text style={[styles.badgeText, { color: color.text }]}>
//                       {req.status}
//                     </Text>
//                   </View>
//                 </View>
//                 <View style={styles.cardMeta}>
//                   <Text style={styles.metaText}>
//                     Load · Sellable · Mohd Salimuddin
//                   </Text>
//                   <Text style={styles.metaText}>
//                     {(req.lines || []).length} items
//                   </Text>
//                 </View>
//                 <View style={styles.cardBottom}>
//                   <Text style={styles.dateText}>
//                     Created on{" "}
//                     {req.server_modified_time
//                       ? new Date(req.server_modified_time).toLocaleDateString()
//                       : "—"}
//                   </Text>
//                   <Ionicons name="chevron-forward" size={16} color="#ccc" />
//                 </View>
//               </TouchableOpacity>
//             );
//           })
//         )}
//       </ScrollView>

//       {/* FAB */}
//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => router.push("/(app)/load-start")}
//         activeOpacity={0.85}
//       >
//         <Ionicons name="add" size={28} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f2f4f7" },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   actionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#004B87",
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },
//   actionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "#fff",
//     borderRadius: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//   },
//   actionBtnText: { fontSize: 13, color: "#004B87", fontWeight: "500" },
//   refreshBtn: {
//     marginLeft: "auto",
//     backgroundColor: "rgba(255,255,255,0.2)",
//     borderRadius: 6,
//     padding: 6,
//   },
//   tabsBar: {
//     backgroundColor: "#fff",
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#e4e8ef",
//     maxHeight: 44,
//   },
//   tab: { paddingHorizontal: 16, paddingVertical: 10, position: "relative" },
//   tabText: { fontSize: 13, color: "#888" },
//   tabActive: { color: "#004B87", fontWeight: "600" },
//   tabIndicator: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 2,
//     backgroundColor: "#004B87",
//   },
//   list: { padding: 12, gap: 8, paddingBottom: 80 },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 14,
//     borderWidth: 0.5,
//     borderColor: "#e0e4ea",
//   },
//   cardTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   cardUid: { fontSize: 14, fontWeight: "600", color: "#004B87" },
//   badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
//   badgeText: { fontSize: 11, fontWeight: "600" },
//   cardMeta: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   metaText: { fontSize: 12, color: "#888" },
//   cardBottom: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingTop: 8,
//     borderTopWidth: 0.5,
//     borderTopColor: "#f0f0f0",
//   },
//   dateText: { fontSize: 11, color: "#aaa" },
//   empty: { alignItems: "center", paddingTop: 60, gap: 12 },
//   emptyText: { fontSize: 14, color: "#aaa" },
//   fab: {
//     position: "absolute",
//     bottom: 24,
//     right: 20,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#004B87",
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 4,
//   },
// });

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { setLoads } from "../../../redux/store";
import { SQLiteService } from "../../../api/SQLiteService";
import { SyncService } from "../../../api/SyncService";

const STATUS_TABS = ["Requested", "Supervisor", "Gatekeeper", "Collected"];

const STATUS_COLORS = {
  Pending: { bg: "#fff3e0", text: "#e67e22" },
  Requested: { bg: "#fff3e0", text: "#e67e22" },
  Approved: { bg: "#e8f5e9", text: "#27ae60" },
  Rejected: { bg: "#fdecea", text: "#e74c3c" },
  Collected: { bg: "#e3f2fd", text: "#1976d2" },
};

export default function InventoryScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  // ✅ Redux for persistence across tab switches
  const loads = useSelector((state) => state.loads?.requests || []);
  const isSyncing = useSelector((state) => state.sync?.isSyncing || false);

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const requests = await SQLiteService.getLoadRequests();
    dispatch(setLoads(requests));
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ✅ Sync on refresh from Doc 13
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await SyncService.uploadQueue();
      await SyncService.deltaSync();
    } catch (err) {
      console.error("Refresh error:", err);
    }
    await loadData();
    setRefreshing(false);
  };

  const filtered = loads.filter((r) => {
    const tab = STATUS_TABS[activeTab];
    if (tab === "Requested")
      return r.status === "Pending" || r.status === "Requested";
    if (tab === "Supervisor") return r.status === "Supervisor";
    if (tab === "Gatekeeper") return r.status === "Gatekeeper";
    if (tab === "Collected")
      return r.status === "Collected" || r.status === "Approved";
    return true;
  });

  const counts = STATUS_TABS.map((tab) => {
    if (tab === "Requested")
      return loads.filter(
        (r) => r.status === "Pending" || r.status === "Requested",
      ).length;
    if (tab === "Collected")
      return loads.filter(
        (r) => r.status === "Collected" || r.status === "Approved",
      ).length;
    return loads.filter((r) => r.status === tab).length;
  });

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#004B87" size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Action row */}
  
      <View style={styles.actionRow}>
        {["Load", "Unload", "Van"].map((label, i) => (
          <TouchableOpacity key={label} style={styles.actionBtn}>
            <Ionicons
              name={
                i === 0
                  ? "download-outline"
                  : i === 1
                    ? "upload-outline"
                    : "car-outline"
              }
              size={16}
              color="#004B87"
            />
            <Text style={styles.actionBtnText}>{label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsBar}
      >
        {STATUS_TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(i)}
            style={styles.tab}
          >
            <Text style={[styles.tabText, activeTab === i && styles.tabActive]}>
              {tab}
              {counts[i] > 0 ? ` ${counts[i]}` : ""}
            </Text>
            {activeTab === i && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#004B87"]}
          />
        }
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              No {STATUS_TABS[activeTab].toLowerCase()} requests
            </Text>
          </View>
        ) : (
          filtered.map((req) => {
            const color = STATUS_COLORS[req.status] || STATUS_COLORS.Pending;
            return (
              <TouchableOpacity
                key={req.id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/(app)/load-detail",
                    params: { id: req.id },
                  })
                }
              >
                <View style={styles.cardTop}>
                  <Text style={styles.cardUid}>{req.uid}</Text>
                  <View style={[styles.badge, { backgroundColor: color.bg }]}>
                    <Text style={[styles.badgeText, { color: color.text }]}>
                      {req.status === "Pending" ? "Requested" : req.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.metaText}>Load · Sellable</Text>
                  <Text style={styles.metaText}>
                    {(req.lines || []).length} items
                  </Text>
                </View>
                <View style={styles.cardBottom}>
                  <Text style={styles.dateText}>
                    Created on{" "}
                    {req.server_modified_time
                      ? new Date(req.server_modified_time).toLocaleDateString()
                      : "—"}
                  </Text>
                  {/* ✅ Sync pending indicator from Doc 13 */}
                  {req.synced === 0 && (
                    <Text style={styles.syncPending}>⬆ Pending sync</Text>
                  )}
                  <Ionicons name="chevron-forward" size={16} color="#ccc" />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* FAB — disabled while syncing from Doc 13 */}
      <TouchableOpacity
        style={[styles.fab, isSyncing && { opacity: 0.6 }]}
        onPress={() => router.push("/(app)/load-start")}
        disabled={isSyncing}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f7" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#004B87",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionBtnText: { fontSize: 13, color: "#004B87", fontWeight: "500" },
  refreshBtn: {
    marginLeft: "auto",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 6,
    padding: 6,
  },
  tabsBar: {
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e4e8ef",
    maxHeight: 44,
  },
  tab: { paddingHorizontal: 16, paddingVertical: 10, position: "relative" },
  tabText: { fontSize: 13, color: "#888" },
  tabActive: { color: "#004B87", fontWeight: "600" },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#004B87",
  },
  list: { padding: 12, gap: 8, paddingBottom: 80 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 0.5,
    borderColor: "#e0e4ea",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardUid: { fontSize: 14, fontWeight: "600", color: "#004B87" },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 11, fontWeight: "600" },
  cardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metaText: { fontSize: 12, color: "#888" },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#f0f0f0",
  },
  dateText: { fontSize: 11, color: "#aaa" },
  syncPending: { fontSize: 11, color: "#e67e22", fontWeight: "500" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: "#aaa" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#004B87",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});
