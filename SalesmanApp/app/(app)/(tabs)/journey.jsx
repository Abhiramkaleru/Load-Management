// import { View, Text } from "react-native";

// export default function JourneyPage() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Journey Plan</Text>
//     </View>
//   );
// }

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const TABS = ["All (265)", "Pending (265)", "Visited (0)", "Zero Sal..."];

const CUSTOMERS = [
  {
    id: 1,
    name: "DALIAN FOODSTUFF",
    code: "C40512",
    type: "Traditional Trade",
    dist: "240.07",
    lastVisit: "Never",
    payment: "Cash",
  },
  {
    id: 2,
    name: "ZAKARIYAT GROCERY",
    code: "C42527",
    type: "Traditional Trade",
    dist: "262.81",
    lastVisit: "Never",
    payment: "Cash",
  },
  {
    id: 3,
    name: "RINSHA SUPERMARKET",
    code: "C44874",
    type: "Traditional Trade",
    dist: "240.05",
    lastVisit: "Never",
    payment: "Cash",
  },
  {
    id: 4,
    name: "HEY NEW MART",
    code: "C38901",
    type: "Modern Trade",
    dist: "187.30",
    lastVisit: "12 Jun",
    payment: "Credit",
  },
];

export default function JourneyPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => global.openDrawer?.()}
        style={{ marginRight: 16, padding: 12 }}
      >
        <Ionicons name="menu" size={30} color="#004B87" />
      </TouchableOpacity>
      <StatusBar barStyle="light-content" backgroundColor="#004B87" />

      {/* Route Credit Card */}
      <View style={styles.creditCard}>
        <View style={styles.creditRow}>
          <View style={styles.creditLeft}>
            <Ionicons name="card-outline" size={16} color="#555" />
            <Text style={styles.creditTitle}>Route Credit</Text>
          </View>
          <Text style={styles.creditBadge}>TRI303</Text>
        </View>
        <View style={styles.amountsRow}>
          <View style={styles.amountCol}>
            <Text style={styles.amtLabel}>LIMIT</Text>
            <Text style={styles.amtValue}>QAR 1000</Text>
          </View>
          <View style={styles.amountCol}>
            <Text style={styles.amtLabel}>OUTSTANDING</Text>
            <Text style={[styles.amtValue, { color: "#e67e22" }]}>QAR 165</Text>
          </View>
          <View style={styles.amountCol}>
            <Text style={styles.amtLabel}>AVAILABLE</Text>
            <Text style={[styles.amtValue, { color: "#27ae60" }]}>QAR 835</Text>
          </View>
        </View>
        <View style={styles.progressBg}>
          <View style={styles.progressFill} />
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsBar}
      >
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setActiveTab(i)}
            style={styles.tab}
          >
            <Text style={[styles.tabText, activeTab === i && styles.tabActive]}>
              {tab}
            </Text>
            {activeTab === i && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons
          name="search-outline"
          size={16}
          color="#aaa"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Customer List */}
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((c) => (
          <TouchableOpacity key={c.id} style={styles.card} activeOpacity={0.8}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.cardNum}>#{c.id}</Text>
                <Text style={styles.cardName}>{c.name}</Text>
                <Text style={styles.cardMeta}>
                  {c.code} · {c.type}
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  c.payment === "Cash" ? styles.badgeCash : styles.badgeCredit,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    c.payment === "Cash"
                      ? styles.badgeCashText
                      : styles.badgeCreditText,
                  ]}
                >
                  {c.payment}
                </Text>
              </View>
            </View>
            <View style={styles.cardBottom}>
              <Text style={styles.distText}>Distance (mi): {c.dist}</Text>
              <Text style={styles.visitText}>Last Visit: {c.lastVisit}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f7" },
  creditCard: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 10,
    padding: 14,
    borderWidth: 0.5,
    borderColor: "#e0e4ea",
  },
  creditRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  creditLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  creditTitle: { fontSize: 13, fontWeight: "500", color: "#333" },
  creditBadge: {
    fontSize: 11,
    backgroundColor: "#f0f2f5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    color: "#555",
  },
  amountsRow: { flexDirection: "row" },
  amountCol: { flex: 1 },
  amtLabel: {
    fontSize: 10,
    color: "#aaa",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  amtValue: { fontSize: 13, fontWeight: "500", color: "#222" },
  progressBg: {
    height: 4,
    backgroundColor: "#e8eaed",
    borderRadius: 2,
    marginTop: 10,
  },
  progressFill: {
    height: 4,
    width: "83%",
    backgroundColor: "#27ae60",
    borderRadius: 2,
  },
  tabsBar: {
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e4e8ef",
  },
  tab: { paddingHorizontal: 14, paddingVertical: 10, position: "relative" },
  tabText: { fontSize: 13, color: "#888" },
  tabActive: { color: "#004B87", fontWeight: "500" },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#004B87",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 12,
    marginBottom: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderColor: "#e0e4ea",
  },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 8, fontSize: 13, color: "#333" },
  list: { padding: 12, paddingTop: 6, gap: 8 },
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
    alignItems: "flex-start",
  },
  cardNum: { fontSize: 11, color: "#aaa", fontWeight: "500" },
  cardName: { fontSize: 14, fontWeight: "500", color: "#111", marginTop: 2 },
  cardMeta: { fontSize: 12, color: "#888", marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeCash: { backgroundColor: "#fff3e0" },
  badgeCredit: { backgroundColor: "#e8f5e9" },
  badgeText: { fontSize: 11, fontWeight: "500" },
  badgeCashText: { color: "#e67e22" },
  badgeCreditText: { color: "#27ae60" },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#f0f2f5",
  },
  distText: { fontSize: 12, color: "#555" },
  visitText: { fontSize: 11, color: "#aaa" },
});
