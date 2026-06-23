import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const customers = [
  {
    id: "1",
    name: "Rajesh Kumar",
    mobile: "+91 9876543210",
    location: "Hyderabad",
    status: "Active",
  },
  {
    id: "2",
    name: "Suresh Reddy",
    mobile: "+91 9123456789",
    location: "Warangal",
    status: "Pending",
  },
  {
    id: "3",
    name: "Anjali Sharma",
    mobile: "+91 9988776655",
    location: "Karimnagar",
    status: "Active",
  },
  {
    id: "4",
    name: "Kiran Kumar",
    mobile: "+91 9012345678",
    location: "Nizamabad",
    status: "Inactive",
  },
];

export default function CustomersPage() {
  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>120</Text>
          <Text style={styles.statLabel}>Customers</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>98</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>22</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Customer List */}
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.mobile}>{item.mobile}</Text>
              <Text style={styles.location}>{item.location}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                item.status === "Active"
                  ? styles.active
                  : item.status === "Pending"
                    ? styles.pending
                    : styles.inactive,
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    elevation: 2,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#004B87",
  },

  statLabel: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#004B87",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  mobile: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  location: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  active: {
    backgroundColor: "#E8F5E9",
  },

  pending: {
    backgroundColor: "#FFF8E1",
  },

  inactive: {
    backgroundColor: "#FFEBEE",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#004B87",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  fabText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "300",
  },
});
