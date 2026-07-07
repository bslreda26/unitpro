const { User, Role, Permission } = require('../models');
const { comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
    permissions: user.permissions.map((p) => p.key),
    isActive: user.isActive,
  };
}

async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({
    where: { email },
    include: [
      { model: Role, as: 'role' },
      { model: Permission, as: 'permissions' },
    ],
  });

  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken({ sub: user.id });

  res.json({ token, user: serializeUser(user) });
}

async function me(req, res) {
  res.json({ user: serializeUser(req.user) });
}

module.exports = { login, me, serializeUser };
