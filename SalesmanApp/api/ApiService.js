import axios from "axios";
import { AuthService } from "./AuthService";
import { NetworkService } from "./NetworkService";
// const API_BASE = "http://localhost:3000"; // Replace with actual backend
const API_BASE =
  "https://deployment-maternity-mounted-advancement.trycloudflare.com"; // Replace with actual backend
let token = null;

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(
  async (config) => {
    if (!token) {
      const auth = await AuthService.getAuth();
      if (auth) token = auth.token;
    }
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err),
);
async function ensureOnline() {
  const online = await NetworkService.isOnline();

  if (!online) {
    throw new Error("DEVICE_OFFLINE");
  }
}
export const ApiService = {
  async login(username, password) {
    await ensureOnline();
    const { data } = await api.post("/auth/login", { username, password });
    token = data.token;
    return data;
  },

  async syncPrepare() {
    await ensureOnline();
    const { data } = await api.get("/sync/prepare");
    return data;
  },

  async uploadRequests(requests) {
    await ensureOnline();
    const { data } = await api.post("/sync/upload", { requests });
    return data;
  },

  async getChanges(since) {
    await ensureOnline();
    const { data } = await api.get("/sync/changes", { params: { since } });
    return data;
  },

  setToken(newToken) {
    token = newToken;
  },
};
