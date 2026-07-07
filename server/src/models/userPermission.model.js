const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class UserPermission extends Model {}

UserPermission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'permission_id',
    },
  },
  {
    sequelize,
    modelName: 'UserPermission',
    tableName: 'user_permissions',
    timestamps: true,
    indexes: [{ unique: true, fields: ['user_id', 'permission_id'] }],
  }
);

module.exports = UserPermission;
