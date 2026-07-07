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
    nameEn: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name_en',
    },
    nameFr: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name_fr',
    },
    subtitleEn: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'subtitle_en',
    },
    subtitleFr: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'subtitle_fr',
    },
    bestForEn: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'best_for_en',
    },
    bestForFr: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'best_for_fr',
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    suffixEn: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'suffix_en',
    },
    suffixFr: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'suffix_fr',
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: { en: [], fr: [] },
    },
    ctaLabelEn: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'cta_label_en',
    },
    ctaLabelFr: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'cta_label_fr',
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
