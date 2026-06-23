import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("app.db");

export const SQLiteService = {
  async init() {
    await db.execAsync(`

        CREATE TABLE IF NOT EXISTS employee (
          id TEXT PRIMARY KEY,
          username TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT
        );
        CREATE TABLE IF NOT EXISTS sku (
          id TEXT PRIMARY KEY,
          code TEXT,
          name TEXT NOT NULL,
          category TEXT,
          brand TEXT,
          uom TEXT
        );
        CREATE TABLE IF NOT EXISTS warehouse (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          region TEXT
        );
        CREATE TABLE IF NOT EXISTS load_request (
          id TEXT PRIMARY KEY,
          uid TEXT UNIQUE NOT NULL,
          employee_id TEXT NOT NULL,
          warehouse_id TEXT NOT NULL,
          status TEXT DEFAULT 'Pending',
          server_modified_time TEXT,
          synced INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS load_request_line (
          id TEXT PRIMARY KEY,
          load_request_id TEXT NOT NULL,
          sku_id TEXT NOT NULL,
          quantity INTEGER,
          uom TEXT,
          approved_qty INTEGER
        );
      `);

    // await db.execAsync(`
    //   DROP TABLE IF EXISTS load_request_line;
    //   DROP TABLE IF EXISTS load_request;
    //   DROP TABLE IF EXISTS warehouse;
    //   DROP TABLE IF EXISTS sku;
    //   DROP TABLE IF EXISTS employee;
    // `);
  },
  async insertData(table, rows) {
    if (!rows || rows.length === 0) return;
    const cols = Object.keys(rows[0]).join(",");
    const placeholders = Object.keys(rows[0])
      .map(() => "?")
      .join(",");
    for (const row of rows) {
      const vals = Object.values(row);
      await db.runAsync(
        `INSERT OR REPLACE INTO ${table} (${cols}) VALUES (${placeholders})`,
        vals,
      );
    }
  },

  async getLoadRequests() {
    const result = await db.getAllAsync(
      `SELECT * FROM load_request ORDER BY id DESC`,
    );
    for (const req of result) {
      const lines = await db.getAllAsync(
        `SELECT * FROM load_request_line WHERE load_request_id = ?`,
        [req.id],
      );
      req.lines = lines;
    }
    return result;
  },

  async getWarehouses() {
    return await db.getAllAsync(`SELECT * FROM warehouse`);
  },

  async getSKUs() {
    return await db.getAllAsync(`SELECT * FROM sku`);
  },

  async createLoadRequest(uid, warehouseId, employeeId, lines) {
    if (!employeeId) {
      throw new Error("Employee ID is required");
    }
    const loadId = `load_${Date.now()}`;
    await db.runAsync(
      `INSERT INTO load_request (id, uid, warehouse_id, employee_id, status, synced) VALUES (?, ?, ?, ?, 'Pending', 0)`,
      [loadId, uid, warehouseId, employeeId],
    );
    for (const line of lines) {
      const lineId = `line_${Date.now()}_${Math.random()}`;
      await db.runAsync(
        `INSERT INTO load_request_line (id, load_request_id, sku_id, quantity, uom) VALUES (?, ?, ?, ?, ?)`,
        [lineId, loadId, line.sku_id, line.quantity, line.uom || "pcs"],
      );
    }
    return {
      id: loadId,
      uid,
      warehouse_id: warehouseId,
      status: "Pending",
      lines,
    };
  },

  async getUnsynced() {
    return await db.getAllAsync(`SELECT * FROM load_request WHERE synced = 0`);
  },

  async markSynced(loadId) {
    await db.runAsync(`UPDATE load_request SET synced = 1 WHERE id = ?`, [
      loadId,
    ]);
  },

  async updateLoadStatus(loadId, status, modifiedTime) {
    await db.runAsync(
      `UPDATE load_request SET status = ?, server_modified_time = ? WHERE id = ?`,
      [status, modifiedTime, loadId],
    );
  },

  async getLinesForRequest(loadRequestId) {
    return await db.getAllAsync(
      `SELECT * FROM load_request_line WHERE load_request_id = ?`,
      [loadRequestId],
    );
  },

  async markSyncedByUid(uid) {
    await db.runAsync(`UPDATE load_request SET synced = 1 WHERE uid = ?`, [
      uid,
    ]);
  },
};
