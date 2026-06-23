import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_KEY = "app_auth_token";
const EMPLOYEE_KEY = "app_employee";
const LAST_SYNC_KEY = "app_last_sync_time";

export const AuthService = {
  async saveAuth(token, employee) {
    await AsyncStorage.setItem(AUTH_KEY, token);
    await AsyncStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employee));
  },

  async getAuth() {
    const token = await AsyncStorage.getItem(AUTH_KEY);
    const employee = await AsyncStorage.getItem(EMPLOYEE_KEY);
    return token && employee ? { token, employee: JSON.parse(employee) } : null;
  },

  async clearAuth() {
    await AsyncStorage.removeItem(AUTH_KEY);
    await AsyncStorage.removeItem(EMPLOYEE_KEY);
  },

  async saveLastSyncTime(time) {
    await AsyncStorage.setItem(LAST_SYNC_KEY, time);
  },

  async getLastSyncTime() {
    return await AsyncStorage.getItem(LAST_SYNC_KEY);
  },
};
