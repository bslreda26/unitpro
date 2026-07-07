const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class SubscriptionPlan extends Model {}

SubscriptionPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.ENUM(
        'day_pass',
        'membership',
        'group_class',
        'personal_training',
        'special_offer',
      ),
      allowNull: false,
    },
    planKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'plan_key',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bestFor: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'best_for',
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    suffix: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    ctaLabel: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'cta_label',
    },
    ctaVariant: {
      type: DataTypes.ENUM('solid', 'outline'),
      allowNull: false,
      defaultValue: 'outline',
      field: 'cta_variant',
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: 'SubscriptionPlan',
    tableName: 'subscription_plans',
    timestamps: true,
  }
);

module.exports = SubscriptionPlan;
