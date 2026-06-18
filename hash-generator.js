// Generate bcrypt hash for seed data
// Run: node hash-generator.js

const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'password123';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('\n✓ Bcrypt Hash Generated\n');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nUse this hash in schema.sql seed data:\n');
    console.log(`INSERT INTO employee (username, password_hash, name, role) VALUES`);
    console.log(`  ('salesman1', '${hash}', 'John Salesman', 'salesman'),`);
    console.log(`  ('manager1', '${hash}', 'Jane Manager', 'manager');`);
  } catch (err) {
    console.error('Error:', err);
  }
}

generateHash();