const { ContactInfo } = require('../models');

function serialize(info) {
  return {
    email: info.email,
    phone: info.phone,
    whatsappNumber: info.whatsappNumber,
    hours: info.hours,
    locationLabel: info.locationLabel,
    mapQuery: info.mapQuery,
  };
}

async function getSingleton() {
  let info = await ContactInfo.findOne({ order: [['id', 'ASC']] });
  if (!info) {
    info = await ContactInfo.create({
      email: 'hello@unitpro.com',
      phone: '',
      whatsappNumber: '',
      hours: '',
      locationLabel: '',
      mapQuery: '',
    });
  }
  return info;
}

async function getPublic(req, res) {
  const info = await getSingleton();
  res.json({ contactInfo: serialize(info) });
}

async function getAdmin(req, res) {
  const info = await getSingleton();
  res.json({ contactInfo: serialize(info) });
}

async function update(req, res) {
  const { email, phone, whatsappNumber, hours, locationLabel, mapQuery } = req.body || {};

  if (!email || !phone || !whatsappNumber) {
    return res.status(400).json({ message: 'Email, phone, and WhatsApp number are required' });
  }

  const info = await getSingleton();
  await info.update({
    email,
    phone,
    whatsappNumber,
    hours: hours ?? '',
    locationLabel: locationLabel ?? '',
    mapQuery: mapQuery ?? '',
  });

  res.json({ contactInfo: serialize(info) });
}

module.exports = { getPublic, getAdmin, update };
