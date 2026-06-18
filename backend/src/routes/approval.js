const express = require('express');
const pool = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/queue', authenticate, async (req, res) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Not authorized' });
  }
  
  try {
    const result = await pool.query(
      `SELECT 
         r.id, r.uid, e.name as salesman_name, w.name as warehouse_name, 
         r.status, r.created_at,
         json_agg(json_build_object(
           'id', l.id,
           'sku_id', l.sku_id,
           'quantity', l.quantity,
           'uom', l.uom,
           'sku_name', s.name
         )) as lines
       FROM load_request r
       JOIN employee e ON r.employee_id = e.id
       JOIN warehouse w ON r.warehouse_id = w.id
       LEFT JOIN load_request_line l ON r.id = l.load_request_id
       LEFT JOIN sku s ON l.sku_id = s.id
       WHERE r.status = 'Pending'
       GROUP BY r.id, e.name, w.name
       ORDER BY r.created_at DESC`
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

router.post('/:id/approve', authenticate, async (req, res) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Not authorized' });
  }
  
  try {
    const result = await pool.query(
      `UPDATE load_request 
       SET status = 'Approved', server_modified_time = NOW()
       WHERE id = $1
       RETURNING id, uid, status`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Approval failed' });
  }
});

router.post('/:id/reject', authenticate, async (req, res) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Not authorized' });
  }
  
  try {
    const result = await pool.query(
      `UPDATE load_request 
       SET status = 'Rejected', server_modified_time = NOW()
       WHERE id = $1
       RETURNING id, uid, status`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Rejection failed' });
  }
});

module.exports = router;
