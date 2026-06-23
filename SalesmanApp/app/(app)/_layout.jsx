import React, { useState } from "react";
import { Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../redux/store";
import { AuthService } from "../../api/AuthService";
import SideDrawer from "../../components/SideDrawer";

function LogoutButton() {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await AuthService.clearAuth();
    dispatch(clearAuth());
  };
  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
      <Text style={{ color: "#fff", fontWeight: "600" }}>Logout</Text>
    </TouchableOpacity>
  );
}

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  global.openDrawer = () => setDrawerOpen(true);
  return (
    // <Stack screenOptions={{ headerShown: false }}>
    //   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    // </Stack>
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>

      <SideDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
