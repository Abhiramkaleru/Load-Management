// const express = require('express');
// const pool = require('../db');
// const { authenticate } = require('../middleware/auth');

// const router = express.Router();

// router.get('/queue', authenticate, async (req, res) => {
//   if (req.user.role !== 'manager') {
//     return res.status(403).json({ error: 'Not authorized' });
//   }

//   try {
//     const result = await pool.query(
//       `SELECT
//          r.id, r.uid, e.name as salesman_name, w.name as warehouse_name,
//          r.status, r.created_at,
//          json_agg(json_build_object(
//            'id', l.id,
//            'sku_id', l.sku_id,
//            'quantity', l.quantity,
//            'uom', l.uom,
//            'sku_name', s.name
//          )) as lines
//        FROM load_request r
//        JOIN employee e ON r.employee_id = e.id
//        JOIN warehouse w ON r.warehouse_id = w.id
//        LEFT JOIN load_request_line l ON r.id = l.load_request_id
//        LEFT JOIN sku s ON l.sku_id = s.id
//        WHERE r.status = 'Pending'
//        GROUP BY r.id, e.name, w.name
//        ORDER BY r.created_at DESC`
//     );

//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch queue' });
//   }
// });

// router.post('/:id/approve', authenticate, async (req, res) => {
//   if (req.user.role !== 'manager') {
//     return res.status(403).json({ error: 'Not authorized' });
//   }

//   try {
//     const result = await pool.query(
//       `UPDATE load_request
//        SET status = 'Approved', server_modified_time = NOW()
//        WHERE id = $1
//        RETURNING id, uid, status`,
//       [req.params.id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Request not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Approval failed' });
//   }
// });

// router.post('/:id/reject', authenticate, async (req, res) => {
//   if (req.user.role !== 'manager') {
//     return res.status(403).json({ error: 'Not authorized' });
//   }

//   try {
//     const result = await pool.query(
//       `UPDATE load_request
//        SET status = 'Rejected', server_modified_time = NOW()
//        WHERE id = $1
//        RETURNING id, uid, status`,
//       [req.params.id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Request not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Rejection failed' });
//   }
// });

// module.exports = router;
const express = require("express");
const pool = require("../db");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

const VALID_STATUSES = ["Pending", "Approved", "Rejected"];

function requireManager(req, res, next) {
  if (req.user.role !== "manager") {
    return res.status(403).json({ error: "Not authorized" });
  }
  next();
}

router.use(authenticate, requireManager);

// GET /approval/counts -> tab badge counts { Pending, Approved, Rejected }
router.get("/counts", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM load_request
       WHERE status = ANY($1)
       GROUP BY status`,
      [VALID_STATUSES],
    );

    const counts = { Pending: 0, Approved: 0, Rejected: 0 };
    result.rows.forEach((row) => {
      counts[row.status] = parseInt(row.count, 10);
    });

    res.json(counts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch counts" });
  }
});

// GET /approval?status=Pending&page=1&limit=20 -> table list
router.get("/", async (req, res) => {
  try {
    const { status = "Pending", page = 1, limit = 20 } = req.query;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status filter" });
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const offset = (pageNum - 1) * limitNum;

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM load_request r WHERE r.status = $1`,
      [status],
    );
    const totalCount = parseInt(countResult.rows[0].count, 10);

    const result = await pool.query(
      `SELECT
         r.id,
         r.uid AS movement_code,
         e.name AS employee_name,
         w.name AS warehouse_name,
         r.status,
         r.created_at
       FROM load_request r
       JOIN employee e ON r.employee_id = e.id
       JOIN warehouse w ON r.warehouse_id = w.id
       WHERE r.status = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [status, limitNum, offset],
    );

    res.json({
      data: result.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalCount,
        totalPages: Math.max(Math.ceil(totalCount / limitNum), 1),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// GET /approval/:id -> full detail incl. lines, for the detail page
router.get("/:id", async (req, res) => {
  try {
    const headResult = await pool.query(
      `SELECT
         r.id,
         r.uid AS movement_code,
         e.name AS employee_name,
         w.name AS warehouse_name,
         r.status,
         r.created_at,
         r.server_modified_time
       FROM load_request r
       JOIN employee e ON r.employee_id = e.id
       JOIN warehouse w ON r.warehouse_id = w.id
       WHERE r.id = $1`,
      [req.params.id],
    );

    if (headResult.rows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    const linesResult = await pool.query(
      `SELECT
         l.id,
         l.sku_id,
         s.code AS sku_code,
         s.name AS sku_name,
         l.uom,
         l.quantity AS requested_qty,
         COALESCE(l.approved_qty, l.quantity) AS approved_qty
       FROM load_request_line l
       JOIN sku s ON l.sku_id = s.id
       WHERE l.load_request_id = $1
       ORDER BY s.name`,
      [req.params.id],
    );

    res.json({ ...headResult.rows[0], lines: linesResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch request detail" });
  }
});

// POST /approval/:id/approve  body: { lines: [{ id, approved_qty }] }
router.post("/:id/approve", async (req, res) => {
  const { id } = req.params;
  const { lines = [] } = req.body;

  if (!Array.isArray(lines) || lines.length === 0) {
    return res.status(400).json({ error: "lines array required" });
  }

  for (const line of lines) {
    if (
      !line.id ||
      typeof line.approved_qty !== "number" ||
      line.approved_qty < 0
    ) {
      return res
        .status(400)
        .json({ error: "Each line needs id and a valid approved_qty" });
    }
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const line of lines) {
      await client.query(
        `UPDATE load_request_line
         SET approved_qty = $1
         WHERE id = $2 AND load_request_id = $3`,
        [line.approved_qty, line.id, id],
      );
    }

    const result = await client.query(
      `UPDATE load_request
       SET status = 'Approved', server_modified_time = NOW()
       WHERE id = $1
       RETURNING id, uid, status`,
      [id],
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Request not found" });
    }

    await client.query("COMMIT");
    res.json(result.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Approval failed" });
  } finally {
    client.release();
  }
});

// POST /approval/:id/reject
router.post("/:id/reject", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE load_request
       SET status = 'Rejected', server_modified_time = NOW()
       WHERE id = $1
       RETURNING id, uid, status`,
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Rejection failed" });
  }
});

module.exports = router;
