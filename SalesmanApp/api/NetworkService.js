import NetInfo from "@react-native-community/netinfo";

export const NetworkService = {
  async isOnline() {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  },

  subscribe(callback) {
    return NetInfo.addEventListener((state) => {
      callback(
        state.isConnected && state.isInternetReachable
      );
    });
  },
};