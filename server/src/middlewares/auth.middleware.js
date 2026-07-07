const { verifyToken } = require('../utils/jwt');
const { User, Role, Permission } = require('../models');

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }

  const user = await User.findByPk(decoded.sub, {
    include: [
      { model: Role, as: 'role' },
      { model: Permission, as: 'permissions' },
    ],
  });

  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Account not found or disabled' });
  }

  req.user = user;
  next();
}

function requireRole(...roleNames) {
  return (req, res, next) => {
    if (!req.user || !roleNames.includes(req.user.role.name)) {
      return res.status(403).json({ message: 'Insufficient role' });
    }
    next();
  };
}

function requirePermission(permissionKey) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (user.role.name === 'super_admin') {
      return next();
    }
    const hasPermission = user.permissions.some((p) => p.key === permissionKey);
    if (!hasPermission) {
      return res.status(403).json({ message: 'Missing required permission' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole, requirePermission };
