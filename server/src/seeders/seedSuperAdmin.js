require('dotenv').config();
const { sequelize, Role, User } = require('../models');
const { hashPassword } = require('../utils/password');

async function run() {
  await sequelize.sync();

  const superAdminRole = await Role.findOne({ where: { name: 'super_admin' } });
  if (!superAdminRole) {
    throw new Error('super_admin role not found — run seedRolesAndPermissions.js first');
  }

  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  if (!email || !password) {
    throw new Error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in server/.env');
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    console.log(`Super admin already exists (${email}). Skipping.`);
    await sequelize.close();
    return;
  }

  const passwordHash = await hashPassword(password);
  await User.create({
    name,
    email,
    passwordHash,
    roleId: superAdminRole.id,
    isActive: true,
  });

  console.log(`Super admin created: ${email}`);
  console.log('Log in at /login with the credentials from server/.env, then change the password.');
  await sequelize.close();
}

run().catch((err) => {
  console.error('Seeding super admin failed:', err);
  process.exit(1);
});
