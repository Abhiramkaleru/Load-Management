const express = require('express');
const pool = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/prepare', authenticate, async (req, res) => {
  try {
    const configResult = await pool.query(
      'SELECT table_name, query FROM sync_config ORDER BY table_name'
    );
    
    const result = {};
    
    for (const config of configResult.rows) {
      const { table_name, query } = config;
      const params = query.includes('$1') ? [req.user.id] : [];
      const dataResult = await pool.query(query, params);
      result[table_name] = dataResult.rows;
    }
    
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sync prepare failed' });
  }
});

router.post('/upload', authenticate, async (req, res) => {
  const { requests } = req.body;

  if (!Array.isArray(requests)) {
    return res.status(400).json({ error: 'Requests must be an array' });
  }
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const syncedRequests = [];
    
    for (const request of requests) {
      const { uid, warehouse_id, lines } = request;

      if (!uid || !warehouse_id || !Array.isArray(lines) || lines.length === 0) {
        throw new Error('Invalid load request payload');
      }
      
      let loadResult = await client.query(
        `INSERT INTO load_request (uid, employee_id, warehouse_id, status, server_modified_time)
         VALUES ($1, $2, $3, 'Pending', NOW())
         ON CONFLICT (uid) DO NOTHING
         RETURNING id`,
        [uid, req.user.id, warehouse_id]
      );

      const inserted = loadResult.rows.length > 0;

      if (!inserted) {
        loadResult = await client.query(
          `SELECT id FROM load_request WHERE uid = $1 AND employee_id = $2`,
          [uid, req.user.id]
        );
      }

      if (loadResult.rows.length === 0) {
        throw new Error('Load request uid belongs to another employee or does not exist');
      }
      
      const load_request_id = loadResult.rows[0].id;
      
      if (inserted) {
        for (const line of lines) {
          await client.query(
            `INSERT INTO load_request_line (load_request_id, sku_id, quantity, uom)
             VALUES ($1, $2, $3, $4)`,
            [load_request_id, line.sku_id, line.quantity, line.uom || 'pcs']
          );
        }
      }

      syncedRequests.push({
        uid,
        id: load_request_id,
        inserted,
      });
    }

    await client.query('COMMIT');
    res.json({ synced: syncedRequests });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  } finally {
    client.release();
  }
});

router.get('/changes', authenticate, async (req, res) => {
  const { since } = req.query;
  
  try {
    const sinceDate = since ? new Date(since) : new Date(0);

    if (Number.isNaN(sinceDate.getTime())) {
      return res.status(400).json({ error: 'Invalid since timestamp' });
    }
    
    const changedRequests = await pool.query(
      `SELECT id, uid, warehouse_id, status, server_modified_time 
       FROM load_request 
       WHERE employee_id = $1 AND server_modified_time > $2`,
      [req.user.id, sinceDate]
    );
    
    const requestIds = changedRequests.rows.map(r => r.id);
    const changedLines = [];
    
    if (requestIds.length > 0) {
      const lineResult = await pool.query(
        `SELECT id, load_request_id, sku_id, quantity, uom 
         FROM load_request_line 
         WHERE load_request_id = ANY($1::uuid[])`,
        [requestIds]
      );
      changedLines.push(...lineResult.rows);
    }
    
    res.json({
      requests: changedRequests.rows,
      lines: changedLines,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delta sync failed' });
  }
});

module.exports = router;
