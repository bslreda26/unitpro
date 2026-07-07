const sequelize = require('../config/database');
const Role = require('./role.model');
const Permission = require('./permission.model');
const User = require('./user.model');
const UserPermission = require('./userPermission.model');
const SubscriptionPlan = require('./subscriptionPlan.model');

Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

User.belongsToMany(Permission, {
  through: UserPermission,
  foreignKey: 'userId',
  otherKey: 'permissionId',
  as: 'permissions',
});
Permission.belongsToMany(User, {
  through: UserPermission,
  foreignKey: 'permissionId',
  otherKey: 'userId',
  as: 'users',
});

User.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = { sequelize, Role, Permission, User, UserPermission, SubscriptionPlan };
