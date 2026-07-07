// One-off migration: collapse the bilingual (EN/FR) columns on
// subscription_plans and contact_info down to a single French column each.
// The site no longer offers an English toggle, so admins only ever typed
// French anyway going forward — this drops the now-unused English columns
// and renames the French ones to their flat, language-less names.
require('dotenv').config();
const { sequelize } = require('../src/models');
const { DataTypes } = require('sequelize');

async function run() {
  const qi = sequelize.getQueryInterface();

  console.log('Migrating subscription_plans...');
  await qi.addColumn('subscription_plans', 'name', { type: DataTypes.STRING, allowNull: true });
  await qi.addColumn('subscription_plans', 'subtitle', { type: DataTypes.STRING, allowNull: true });
  await qi.addColumn('subscription_plans', 'best_for', { type: DataTypes.STRING, allowNull: true });
  await qi.addColumn('subscription_plans', 'suffix', { type: DataTypes.STRING, allowNull: true });
  await qi.addColumn('subscription_plans', 'cta_label', { type: DataTypes.STRING, allowNull: true });

  await sequelize.query(`
    UPDATE subscription_plans SET
      name = name_fr,
      subtitle = subtitle_fr,
      best_for = best_for_fr,
      suffix = suffix_fr,
      cta_label = cta_label_fr,
      features = JSON_EXTRACT(features, '$.fr')
  `);

  await qi.changeColumn('subscription_plans', 'name', { type: DataTypes.STRING, allowNull: false });

  for (const col of ['name_en', 'name_fr', 'subtitle_en', 'subtitle_fr', 'best_for_en', 'best_for_fr', 'suffix_en', 'suffix_fr', 'cta_label_en', 'cta_label_fr']) {
    await qi.removeColumn('subscription_plans', col);
  }

  console.log('Migrating contact_info...');
  await qi.addColumn('contact_info', 'hours', { type: DataTypes.STRING, allowNull: true });
  await qi.addColumn('contact_info', 'location_label', { type: DataTypes.STRING, allowNull: true });

  await sequelize.query(`
    UPDATE contact_info SET
      hours = hours_fr,
      location_label = location_label_fr
  `);

  await qi.changeColumn('contact_info', 'hours', { type: DataTypes.STRING, allowNull: false });
  await qi.changeColumn('contact_info', 'location_label', { type: DataTypes.STRING, allowNull: false });

  for (const col of ['hours_en', 'hours_fr', 'location_label_en', 'location_label_fr']) {
    await qi.removeColumn('contact_info', col);
  }

  console.log('Migration complete.');
  await sequelize.close();
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
