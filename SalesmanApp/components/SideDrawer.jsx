import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../redux/store";
import { AuthService } from "../api/AuthService";

const DRAWER_WIDTH = Dimensions.get("window").width * 0.82;

export default function SideDrawer({ visible, onClose }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const { employee } = useSelector((state) => state.auth);

  const [inventoryOpen, setInventoryOpen] = useState(true);

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const logout = async () => {
    await AuthService.clearAuth();
    dispatch(clearAuth());
  };

  const navigate = (route) => {
    onClose?.();
    router.push(route);
  };

  if (!visible) return null;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {employee?.name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{employee?.name || "Salesman"}</Text>

            <Text style={styles.userCode}>{employee?.username || ""}</Text>
          </View>

          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.menuLabel}>MENU</Text>

        {/* Dashboard */}
        <MenuItem
          icon="home-outline"
          title="Dashboard"
          onPress={() => navigate("/(app)/(tabs)")}
        />

        {/* Journey */}
        <MenuItem icon="map-outline" title="Journey Plan" selected />

        {/* Customers */}
        <MenuItem
          icon="people-outline"
          title="Customers"
          onPress={() => navigate("/(app)/(tabs)/customers")}
        />

        {/* Summary */}
        <MenuItem icon="bar-chart-outline" title="Summary" />

        {/* Inventory */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setInventoryOpen(!inventoryOpen)}
        >
          <View style={styles.left}>
            <Ionicons name="cube-outline" size={20} color="#004B87" />

            <Text style={styles.menuText}>Inventory</Text>
          </View>

          <Ionicons
            name={inventoryOpen ? "chevron-down" : "chevron-forward"}
            size={18}
            color="#999"
          />
        </TouchableOpacity>

        {inventoryOpen && (
          <View style={styles.subMenu}>
            <SubMenuItem
              title="Van Stock"
              subtitle="View current van inventory"
            />

            <SubMenuItem
              title="Load Management"
              subtitle="Manage load and unload requests"
              onPress={() => navigate("/(app)/(tabs)/inventory")}
            />

            <SubMenuItem
              title="Van Transfer"
              subtitle="Stock transfer between vans"
            />

            <SubMenuItem title="Stock Audit" subtitle="Perform stock audits" />

            {/* <SubMenuItem
              title="Van Stock Conversion"
              subtitle="Reclassify stock on van"
            /> */}
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />

            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

function MenuItem({ icon, title, selected = false, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, selected && styles.selectedItem]}
      onPress={onPress}
    >
      <View style={styles.left}>
        <Ionicons name={icon} size={20} color="#004B87" />

        <Text
          style={[
            styles.menuText,
            selected && {
              color: "#004B87",
              fontWeight: "700",
            },
          ]}
        >
          {title}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#ccc" />
    </TouchableOpacity>
  );
}

function SubMenuItem({ title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.subItem} onPress={onPress}>
      <View>
        <Text style={styles.subTitle}>{title}</Text>

        <Text style={styles.subDesc}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color="#ccc" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  drawer: {
    width: DRAWER_WIDTH,
    height: "100%",
    backgroundColor: "#fff",
  },

  header: {
    backgroundColor: "#004B87",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 55,
    paddingBottom: 20,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4c77a8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  userName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  userCode: {
    color: "#d7e5f3",
    fontSize: 13,
    marginTop: 3,
  },

  menuLabel: {
    fontSize: 11,
    color: "#999",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
    fontWeight: "600",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 10,
  },

  selectedItem: {
    backgroundColor: "#eef5fc",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },

  subMenu: {
    marginLeft: 20,
    marginRight: 12,
  },

  subItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  subTitle: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500",
  },

  subDesc: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },

  footer: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
  },

  logoutBtn: {
    backgroundColor: "#fff1f1",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    marginLeft: 8,
    color: "#ef4444",
    fontWeight: "700",
  },
});
