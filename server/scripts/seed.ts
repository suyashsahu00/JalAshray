import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../src/db.js';

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  // Seed test worker for Raipur
  await pool.query(
    'INSERT INTO users (name, email, password, role, department) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), department = VALUES(department)',
    ['Test Worker', 'worker@test.com', passwordHash, 'worker', 'Raipur Water Board']
  );
  
  // Seed test admin for Raipur
  const adminHash = await bcrypt.hash('admin123', 10);
  await pool.query(
    'INSERT INTO users (name, email, password, role, department) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), department = VALUES(department)',
    ['Test Admin', 'admin@test.com', adminHash, 'admin', 'Raipur Water Management']
  );

  // eslint-disable-next-line no-console
  console.log('Seeded users:');
  // eslint-disable-next-line no-console
  console.log('  - worker@test.com / password123 (Worker)');
  // eslint-disable-next-line no-console
  console.log('  - admin@test.com / admin123 (Admin)');
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

