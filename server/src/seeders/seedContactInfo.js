require('dotenv').config();
const { sequelize, ContactInfo } = require('../models');

// Mirrors the hardcoded values that used to live in src/components/Footer.jsx
// and src/utils/whatsapp.js, so a fresh install's public site content matches
// what admins have been editing since the site went French-only.
const CONTACT_INFO = {
  email: 'hello@unitpro.com',
  phone: '07000000',
  whatsappNumber: '2250702604309',
  hours: 'Lundi a samedi de 9h a 20h · Dimanche de 9h a 16h',
  locationLabel: 'Cocody',
  mapQuery: 'Deux Plateau Abidjan',
};

async function run() {
  await sequelize.sync();

  const existing = await ContactInfo.findOne();
  if (existing) {
    console.log('Contact info already seeded. Skipping.');
    await sequelize.close();
    return;
  }

  await ContactInfo.create(CONTACT_INFO);
  console.log('Contact info seeded.');
  await sequelize.close();
}

run().catch((err) => {
  console.error('Seeding contact info failed:', err);
  process.exit(1);
});
