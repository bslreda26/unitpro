const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ContactInfo extends Model {}

ContactInfo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'whatsapp_number',
    },
    hours: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    locationLabel: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'location_label',
    },
    mapQuery: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'map_query',
    },
  },
  {
    sequelize,
    modelName: 'ContactInfo',
    tableName: 'contact_info',
    timestamps: true,
  }
);

module.exports = ContactInfo;
