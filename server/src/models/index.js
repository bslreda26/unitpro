const sequelize = require('../config/database');
const Role = require('./role.model');
const Permission = require('./permission.model');
const User = require('./user.model');
const UserPermission = require('./userPermission.model');
const SubscriptionPlan = require('./subscriptionPlan.model');
const ContactInfo = require('./contactInfo.model');
const GroupClass = require('./groupClass.model');
const ClassScheduleSlot = require('./classScheduleSlot.model');

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

GroupClass.hasMany(ClassScheduleSlot, { foreignKey: 'groupClassId', as: 'scheduleSlots' });
ClassScheduleSlot.belongsTo(GroupClass, { foreignKey: 'groupClassId', as: 'groupClass' });

module.exports = {
  sequelize,
  Role,
  Permission,
  User,
  UserPermission,
  SubscriptionPlan,
  ContactInfo,
  GroupClass,
  ClassScheduleSlot,
};
