const { Permission } = require('../models');

async function list(req, res) {
  const permissions = await Permission.findAll({ order: [['id', 'ASC']] });
  res.json({ permissions: permissions.map((p) => ({ key: p.key, label: p.label })) });
}

module.exports = { list };
