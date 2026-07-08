const { GroupClass, ClassScheduleSlot } = require('../models');

function serialize(item) {
  return {
    id: item.id,
    classKey: item.classKey,
    emoji: item.emoji,
    name: item.name,
    category: item.category,
    durationMinutes: item.durationMinutes,
    levels: item.levels ?? [],
    description: item.description,
    benefits: item.benefits ?? [],
    idealFor:
      item.idealForLabel || (item.idealForItems ?? []).length > 0
        ? { label: item.idealForLabel, items: item.idealForItems ?? [] }
        : null,
    includes: item.includes ?? [],
    note: item.note,
    time: item.time,
    imageUrl: item.imageUrl,
    showInCatalog: item.showInCatalog,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
  };
}

async function listPublic(req, res) {
  const classes = await GroupClass.findAll({
    where: { isActive: true },
    order: [
      ['sortOrder', 'ASC'],
      ['name', 'ASC'],
    ],
  });
  res.json({ classes: classes.map(serialize) });
}

async function listAdmin(req, res) {
  const classes = await GroupClass.findAll({
    order: [
      ['sortOrder', 'ASC'],
      ['name', 'ASC'],
    ],
  });
  res.json({ classes: classes.map(serialize) });
}

const VALID_CATEGORIES = ['Cardio', 'Strength', 'HIIT', 'Conditioning', 'Recovery'];

function extractFields(body) {
  const {
    classKey,
    emoji,
    name,
    category,
    durationMinutes,
    levels,
    description,
    benefits,
    idealFor = {},
    includes,
    note,
    time,
    imageUrl,
    showInCatalog,
    sortOrder,
    isActive,
  } = body || {};

  return {
    classKey: classKey || null,
    emoji: emoji || null,
    name,
    category,
    durationMinutes: Number.isFinite(durationMinutes) ? durationMinutes : Number(durationMinutes) || 0,
    levels: Array.isArray(levels) ? levels : [],
    description: description ?? null,
    benefits: Array.isArray(benefits) ? benefits : [],
    idealForLabel: idealFor?.label || null,
    idealForItems: Array.isArray(idealFor?.items) ? idealFor.items : [],
    includes: Array.isArray(includes) ? includes : [],
    note: note || null,
    time: time || null,
    imageUrl: imageUrl || null,
    showInCatalog: showInCatalog ?? true,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : Number(sortOrder) || 0,
    isActive: isActive ?? true,
  };
}

async function create(req, res) {
  const fields = extractFields(req.body);

  if (!fields.name) {
    return res.status(400).json({ message: 'Le nom est requis' });
  }
  if (!fields.category || !VALID_CATEGORIES.includes(fields.category)) {
    return res.status(400).json({ message: 'Une catégorie valide est requise' });
  }
  if (!fields.durationMinutes) {
    return res.status(400).json({ message: 'La durée est requise' });
  }

  const created = await GroupClass.create(fields);
  res.status(201).json({ class: serialize(created) });
}

function serializeForUpdate(item) {
  return {
    classKey: item.classKey,
    emoji: item.emoji,
    name: item.name,
    category: item.category,
    durationMinutes: item.durationMinutes,
    levels: item.levels ?? [],
    description: item.description,
    benefits: item.benefits ?? [],
    idealFor: { label: item.idealForLabel, items: item.idealForItems ?? [] },
    includes: item.includes ?? [],
    note: item.note,
    time: item.time,
    imageUrl: item.imageUrl,
    showInCatalog: item.showInCatalog,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
  };
}

async function update(req, res) {
  const { id } = req.params;
  const item = await GroupClass.findByPk(id);

  if (!item) {
    return res.status(404).json({ message: 'Cours introuvable' });
  }

  const fields = extractFields({ ...serializeForUpdate(item), ...req.body });
  await item.update(fields);

  res.json({ class: serialize(item) });
}

async function remove(req, res) {
  const { id } = req.params;
  const item = await GroupClass.findByPk(id);

  if (!item) {
    return res.status(404).json({ message: 'Cours introuvable' });
  }

  await ClassScheduleSlot.destroy({ where: { groupClassId: item.id } });
  await item.destroy();
  res.status(204).send();
}

module.exports = { listPublic, listAdmin, create, update, remove };
