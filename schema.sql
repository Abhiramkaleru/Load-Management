-- Users / employees who can log in
CREATE TABLE IF NOT EXISTS employee (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Configuration: which tables to sync, and how
CREATE TABLE IF NOT EXISTS sync_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(255) NOT NULL,
  query TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(table_name)
);

-- Master data: products
CREATE TABLE IF NOT EXISTS sku (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  brand VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Master data: warehouses
CREATE TABLE IF NOT EXISTS warehouse (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Load requests: the main business object
CREATE TABLE IF NOT EXISTS load_request (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid VARCHAR(255) UNIQUE NOT NULL,
  employee_id UUID NOT NULL REFERENCES employee(id),
  warehouse_id UUID NOT NULL REFERENCES warehouse(id),
  status VARCHAR(50) DEFAULT 'Pending',
  server_modified_time TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Line items: products in a load request
CREATE TABLE IF NOT EXISTS load_request_line (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_request_id UUID NOT NULL REFERENCES load_request(id) ON DELETE CASCADE,
  sku_id UUID NOT NULL REFERENCES sku(id),
  quantity INTEGER NOT NULL,
  uom VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_load_request_employee ON load_request(employee_id);
CREATE INDEX IF NOT EXISTS idx_load_request_status ON load_request(status);
CREATE INDEX IF NOT EXISTS idx_load_request_modified ON load_request(server_modified_time);
CREATE INDEX IF NOT EXISTS idx_load_request_line_request ON load_request_line(load_request_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_load_request_uid ON load_request(uid);

-- Seed sync_config
INSERT INTO sync_config (table_name, query) VALUES
  ('employee', 'SELECT id, username, name, role FROM employee WHERE id = $1'),
  ('sku', 'SELECT id, code, name, category, brand FROM sku WHERE is_active = true'),
  ('warehouse', 'SELECT id, name, region FROM warehouse'),
  ('load_request', 'SELECT id, uid, warehouse_id, status, server_modified_time FROM load_request WHERE employee_id = $1'),
  ('load_request_line', 'SELECT id, load_request_id, sku_id, quantity, uom FROM load_request_line WHERE load_request_id IN (SELECT id FROM load_request WHERE employee_id = $1)')
ON CONFLICT DO NOTHING;

-- Seed employees (password: password123)
INSERT INTO employee (username, password_hash, name, role) VALUES
  ('salesman1', '$2b$10$tLxDKjj2xMGhA6q3jVvmZOZsF8tPEKfN8x9D5c8p8m6k4l2j9H.eK', 'John Salesman', 'salesman'),
  ('manager1', '$2b$10$tLxDKjj2xMGhA6q3jVvmZOZsF8tPEKfN8x9D5c8p8m6k4l2j9H.eK', 'Jane Manager', 'manager')
ON CONFLICT DO NOTHING;

-- Seed warehouses
INSERT INTO warehouse (name, region) VALUES
  ('Main Warehouse', 'North'),
  ('Secondary', 'South')
ON CONFLICT DO NOTHING;

-- Seed SKUs
INSERT INTO sku (code, name, category, brand) VALUES
  ('SKU001', '100% Mango Juice 1.5L', 'Beverages', 'Brand A'),
  ('SKU002', 'Iced Tea 500ml', 'Beverages', 'Brand B'),
  ('SKU003', 'Coffee Powder 250g', 'Drinks', 'Brand A')
ON CONFLICT DO NOTHING;
