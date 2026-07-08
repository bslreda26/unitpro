require('dotenv').config();
const { sequelize, GroupClass, ClassScheduleSlot } = require('../models');

// Mirrors WEEKLY_SLOTS, which used to be hardcoded in src/pages/ClassesPage.jsx.
// [dayOfWeek (0=Mon..5=Sat), hour, minute, classKey]
const SWEAT60_SLOTS = [
  [0, 18, 30, 'sweat60'],
  [2, 18, 30, 'sweat60'],
  [4, 18, 30, 'sweat60'],
];

const SLOTS = [
  [0, 8, 30, 'burn45'],
  [1, 8, 30, 'strong-workout'],
  [2, 8, 30, 'burn45'],
  [3, 8, 30, 'strong-workout'],
  [4, 8, 30, 'burn45'],
  [5, 8, 30, 'booty-legs'],
  [0, 9, 15, 'sculpt'],
  [2, 9, 15, 'sculpt'],
  [4, 9, 15, 'sculpt'],
  [1, 9, 30, 'hiit-rush'],
  [3, 9, 30, 'hiit-rush'],
  [5, 9, 30, 'bootcamp'],
  [0, 12, 30, 'express-burn'],
  [1, 12, 30, 'core-cardio'],
  [2, 12, 30, 'express-burn'],
  [3, 12, 30, 'core-cardio'],
  [4, 12, 30, 'express-burn'],
  [0, 17, 30, 'strong-workout'],
  [1, 17, 30, 'booty-legs'],
  [2, 17, 30, 'strong-workout'],
  [3, 17, 30, 'booty-legs'],
  [4, 17, 30, 'strong-workout'],
  [5, 17, 30, 'athletic-conditioning'],
  ...SWEAT60_SLOTS,
  [1, 18, 30, 'burn45'],
  [3, 18, 30, 'burn45'],
  [5, 18, 30, 'stretch-recovery'],
  [0, 19, 30, 'small-group'],
  [1, 19, 30, 'small-group'],
  [2, 19, 30, 'small-group'],
  [3, 19, 30, 'small-group'],
  [4, 19, 30, 'small-group'],
];

async function run() {
  await sequelize.sync();

  const existingCount = await ClassScheduleSlot.count();
  if (existingCount > 0) {
    console.log('Class schedule already has rows — skipping (admins own this list now).');
    await sequelize.close();
    return;
  }

  const classes = await GroupClass.findAll();
  const byKey = new Map(classes.map((c) => [c.classKey, c]));

  let created = 0;
  for (const [dayOfWeek, startHour, startMinute, classKey] of SLOTS) {
    const groupClass = byKey.get(classKey);
    if (!groupClass) {
      console.warn(`Skipping slot for unknown classKey "${classKey}" — run seedGroupClasses.js first.`);
      continue;
    }
    await ClassScheduleSlot.create({
      groupClassId: groupClass.id,
      dayOfWeek,
      startHour,
      startMinute,
    });
    created += 1;
  }

  console.log(`Class schedule seeded (${created} slots created).`);
  await sequelize.close();
}

run().catch((err) => {
  console.error('Seeding class schedule failed:', err);
  process.exit(1);
});
