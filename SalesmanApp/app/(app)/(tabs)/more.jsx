import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../../../redux/store";
import { AuthService } from "../../../api/AuthService";

export default function MoreScreen() {
  const dispatch = useDispatch();
  const { employee } = useSelector((state) => state.auth);
  const handleLogout = async () => {
    await AuthService.clearAuth();
    dispatch(clearAuth());
  };

  const menuItems = [
    { title: "Profile" },
    { title: "Settings" },
    { title: "Notifications" },
    { title: "Help & Support" },
    { title: "Privacy Policy" },
    { title: "About App" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>

          <View>
            <Text style={styles.name}>{employee?.name || "Guest User"}</Text>

            <Text style={styles.email}>
              {employee?.email || "No email available"}
            </Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuBorder,
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.menuText}>{item.title}</Text>

              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  container: {
    padding: 20,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 24,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#004B87",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  email: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 20,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },

  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },

  chevron: {
    fontSize: 24,
    color: "#9CA3AF",
  },

  logoutButton: {
    marginTop: 28,
    backgroundColor: "#EF4444",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",

    shadowColor: "#EF4444",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  version: {
    textAlign: "center",
    marginTop: 20,
    color: "#94A3B8",
    fontSize: 13,
  },
});
