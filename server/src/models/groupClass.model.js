const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class GroupClass extends Model {}

GroupClass.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    classKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'class_key',
    },
    emoji: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('Cardio', 'Strength', 'HIIT', 'Conditioning', 'Recovery'),
      allowNull: false,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'duration_minutes',
    },
    levels: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    benefits: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    idealForLabel: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'ideal_for_label',
    },
    idealForItems: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'ideal_for_items',
    },
    includes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image_url',
    },
    showInCatalog: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'show_in_catalog',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    modelName: 'GroupClass',
    tableName: 'group_classes',
    timestamps: true,
  }
);

module.exports = GroupClass;
