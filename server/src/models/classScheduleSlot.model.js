const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ClassScheduleSlot extends Model {}

ClassScheduleSlot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    groupClassId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'group_class_id',
    },
    // 0 = Monday .. 5 = Saturday (Sunday is hidden on the public calendar)
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'day_of_week',
    },
    startHour: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'start_hour',
    },
    startMinute: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'start_minute',
    },
  },
  {
    sequelize,
    modelName: 'ClassScheduleSlot',
    tableName: 'class_schedule_slots',
    timestamps: true,
  }
);

module.exports = ClassScheduleSlot;
