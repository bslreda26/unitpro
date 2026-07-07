const { User, Role, Permission } = require('../models');
const { hashPassword } = require('../utils/password');
const { serializeUser } = require('./auth.controller');

async function list(req, res) {
  const users = await User.findAll({
    include: [
      { model: Role, as: 'role' },
      { model: Permission, as: 'permissions' },
    ],
    order: [['createdAt', 'ASC']],
  });
  res.json({ users: users.map(serializeUser) });
}

async function create(req, res) {
  const { name, email, password, permissionKeys = [] } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: 'A user with this email already exists' });
  }

  const employeeRole = await Role.findOne({ where: { name: 'employee' } });
  const passwordHash = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    passwordHash,
    roleId: employeeRole.id,
    createdBy: req.user.id,
  });

  if (permissionKeys.length > 0) {
    const permissions = await Permission.findAll({ where: { key: permissionKeys } });
    await user.setPermissions(permissions);
  }

  const created = await User.findByPk(user.id, {
    include: [
      { model: Role, as: 'role' },
      { model: Permission, as: 'permissions' },
    ],
  });

  res.status(201).json({ user: serializeUser(created) });
}

async function update(req, res) {
  const { id } = req.params;
  const { name, isActive, permissionKeys, password } = req.body || {};

  const user = await User.findByPk(id, {
    include: [{ model: Role, as: 'role' }],
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.role.name === 'super_admin') {
    return res.status(403).json({ message: 'Cannot modify the super admin account' });
  }

  if (name !== undefined) user.name = name;
  if (isActive !== undefined) user.isActive = isActive;
  if (password) user.passwordHash = await hashPassword(password);
  await user.save();

  if (Array.isArray(permissionKeys)) {
    const permissions = await Permission.findAll({ where: { key: permissionKeys } });
    await user.setPermissions(permissions);
  }

  const updated = await User.findByPk(user.id, {
    include: [
      { model: Role, as: 'role' },
      { model: Permission, as: 'permissions' },
    ],
  });

  res.json({ user: serializeUser(updated) });
}

async function remove(req, res) {
  const { id } = req.params;

  const user = await User.findByPk(id, {
    include: [{ model: Role, as: 'role' }],
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.role.name === 'super_admin') {
    return res.status(403).json({ message: 'Cannot delete the super admin account' });
  }

  await user.destroy();
  res.status(204).send();
}

module.exports = { list, create, update, remove };
