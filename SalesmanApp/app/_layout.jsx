import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // ✅ Required for Drawer
import { StyleSheet } from "react-native";
import { store, setAuth } from "../redux/store";
import { AuthService } from "../api/AuthService";
import { ApiService } from "../api/ApiService";
import { LoginScreen } from "../screens/LoginScreen";
import { SyncPrepareScreen } from "../screens/SyncPrepareScreen";

export default function RootLayout() {
  return (
    // ✅ GestureHandlerRootView MUST wrap everything when using Drawer
    <GestureHandlerRootView style={styles.root}>
      <Provider store={store}>
        <RootLayoutContent />
      </Provider>
    </GestureHandlerRootView>
  );
}

function RootLayoutContent() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [isInitializing, setIsInitializing] = useState(true);
  const [syncComplete, setSyncComplete] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const auth = await AuthService.getAuth();
        if (auth) {
          dispatch(setAuth({ token: auth.token, employee: auth.employee }));
          ApiService.setToken(auth.token);
        }
      } catch (err) {
        console.error("Auth init failed:", err);
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, []);

  // Re-arm sync gate on new login
  useEffect(() => {
    if (token) setSyncComplete(false);
  }, [token]);

  if (isInitializing) {
    return <SyncPrepareScreen />;
  }

  if (!token) {
    return <LoginScreen />;
  }

  if (!syncComplete) {
    return <SyncPrepareScreen onSyncComplete={() => setSyncComplete(true)} />;
  }

  // ✅ Only render the Stack/Drawer tree AFTER auth + sync are done
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
