import { ApiService } from "./ApiService";
import { SQLiteService } from "./SQLiteService";
import { AuthService } from "./AuthService";
import { NetworkService } from "./NetworkService";

export const SyncService = {
  async prepareSQLite() {
    // try {
    //   const config = await ApiService.syncPrepare();
    //   await SQLiteService.init();

    //   for (const [tableName, rows] of Object.entries(config)) {
    //     console.log({ rows });
    //     await SQLiteService.insertData(tableName, rows);
    //   }

    //   return config;
    // } catch (err) {
    //   console.error("Prepare failed:", err);
    //   throw err;
    // }

    try {
      const online = await NetworkService.isOnline();

      if (!online) {
        throw new Error("DEVICE_OFFLINE");
      }

      const config = await ApiService.syncPrepare();

      await SQLiteService.init();

      for (const [tableName, rows] of Object.entries(config)) {
        await SQLiteService.insertData(tableName, rows);
      }

      return config;
    } catch (err) {
      if (err.message === "DEVICE_OFFLINE") {
        console.log("Working offline");
        return;
      }
      console.error("Prepare failed:", err);
      throw err;
    }
  },

  //   async uploadQueue() {
  //     try {
  //       const unsynced = await SQLiteService.getUnsynced();
  //       if (unsynced.length === 0) return { synced: [] };

  //       const requests = unsynced.map(req => ({
  //         uid: req.uid,
  //         warehouse_id: req.warehouse_id,
  //         lines: req.lines || [],
  //       }));

  //       const { synced } = await ApiService.uploadRequests(requests);

  //       for (const item of synced) {
  //         await SQLiteService.markSynced(item.id);
  //       }

  //       return { synced };
  //     } catch (err) {
  //       console.error('Upload failed:', err);
  //       throw err;
  //     }
  //   },

  async uploadQueue() {
    try {
      const online = await NetworkService.isOnline();

      if (!online) {
        return { synced: [], offline: true };
      }
      const unsynced = await SQLiteService.getUnsynced();
      if (unsynced.length === 0) return { synced: [] };

      // ✅ Fetch lines for each unsynced request
      const requests = await Promise.all(
        unsynced.map(async (req) => {
          const lines = await SQLiteService.getLinesForRequest(req.id);
          return {
            uid: req.uid,
            warehouse_id: req.warehouse_id,
            lines: lines.map((l) => ({
              sku_id: l.sku_id,
              quantity: l.quantity,
              uom: l.uom || "pcs",
            })),
          };
        }),
      );

      const { synced } = await ApiService.uploadRequests(requests);

      // ✅ Match by uid since server returns server id, not local id
      for (const item of synced) {
        await SQLiteService.markSyncedByUid(item.uid);
      }

      return { synced };
    } catch (err) {
      console.error("Upload failed:", err);
      throw err;
    }
  },

  async deltaSync() {
    try {
      const online = await NetworkService.isOnline();

      if (!online) {
        return {
          requests: [],
          lines: [],
          offline: true,
        };
      }

      const lastSync = await AuthService.getLastSyncTime();
      const { requests, lines, timestamp } =
        await ApiService.getChanges(lastSync);

      for (const req of requests) {
        await SQLiteService.updateLoadStatus(
          req.id,
          req.status,
          req.server_modified_time,
        );
      }

      await AuthService.saveLastSyncTime(timestamp);
      return { requests, lines };
    } catch (err) {
      console.error("Delta sync failed:", err);
      throw err;
    }
  },
};
