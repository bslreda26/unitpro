require('dotenv').config();
const { sequelize, Role, Permission } = require('../models');

const ROLES = ['super_admin', 'employee'];

const PERMISSIONS = [
  { key: 'manage_courses', label: 'Gérer les cours et les classes' },
  { key: 'manage_subscriptions', label: 'Gérer les abonnements et les tarifs' },
  { key: 'manage_clients', label: 'Gérer les clients et leurs abonnements' },
];

async function run() {
  await sequelize.sync();

  for (const name of ROLES) {
    await Role.findOrCreate({ where: { name } });
  }

  for (const permission of PERMISSIONS) {
    await Permission.findOrCreate({ where: { key: permission.key }, defaults: permission });
  }

  console.log('Roles and permissions seeded.');
  await sequelize.close();
}

run().catch((err) => {
  console.error('Seeding roles/permissions failed:', err);
  process.exit(1);
});
