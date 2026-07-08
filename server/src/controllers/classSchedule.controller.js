const { ClassScheduleSlot, GroupClass } = require('../models');

function serialize(slot) {
  return {
    id: slot.id,
    groupClassId: slot.groupClassId,
    dayOfWeek: slot.dayOfWeek,
    startHour: slot.startHour,
    startMinute: slot.startMinute,
    groupClass: slot.groupClass
      ? {
          id: slot.groupClass.id,
          name: slot.groupClass.name,
          emoji: slot.groupClass.emoji,
          category: slot.groupClass.category,
          durationMinutes: slot.groupClass.durationMinutes,
        }
      : null,
  };
}

const includeClass = {
  model: GroupClass,
  as: 'groupClass',
  attributes: ['id', 'name', 'emoji', 'category', 'durationMinutes'],
};

async function listPublic(req, res) {
  const slots = await ClassScheduleSlot.findAll({
    include: [includeClass],
    order: [
      ['dayOfWeek', 'ASC'],
      ['startHour', 'ASC'],
      ['startMinute', 'ASC'],
    ],
  });
  res.json({ slots: slots.map(serialize) });
}

async function listAdmin(req, res) {
  const slots = await ClassScheduleSlot.findAll({
    include: [includeClass],
    order: [
      ['dayOfWeek', 'ASC'],
      ['startHour', 'ASC'],
      ['startMinute', 'ASC'],
    ],
  });
  res.json({ slots: slots.map(serialize) });
}

function extractFields(body) {
  const { groupClassId, dayOfWeek, startHour, startMinute } = body || {};
  return {
    groupClassId: Number(groupClassId) || null,
    dayOfWeek: Number.isFinite(dayOfWeek) ? dayOfWeek : Number(dayOfWeek),
    startHour: Number.isFinite(startHour) ? startHour : Number(startHour),
    startMinute: Number.isFinite(startMinute) ? startMinute : Number(startMinute) || 0,
  };
}

async function create(req, res) {
  const fields = extractFields(req.body);

  if (!fields.groupClassId) {
    return res.status(400).json({ message: 'Un cours est requis' });
  }
  if (
    !Number.isInteger(fields.dayOfWeek) ||
    fields.dayOfWeek < 0 ||
    fields.dayOfWeek > 5
  ) {
    return res.status(400).json({ message: 'Jour invalide' });
  }
  if (!Number.isInteger(fields.startHour) || fields.startHour < 0 || fields.startHour > 23) {
    return res.status(400).json({ message: 'Heure invalide' });
  }

  const groupClass = await GroupClass.findByPk(fields.groupClassId);
  if (!groupClass) {
    return res.status(400).json({ message: 'Cours introuvable' });
  }

  const created = await ClassScheduleSlot.create(fields);
  const withClass = await ClassScheduleSlot.findByPk(created.id, { include: [includeClass] });
  res.status(201).json({ slot: serialize(withClass) });
}

async function update(req, res) {
  const { id } = req.params;
  const slot = await ClassScheduleSlot.findByPk(id);

  if (!slot) {
    return res.status(404).json({ message: 'Créneau introuvable' });
  }

  const fields = extractFields({
    groupClassId: slot.groupClassId,
    dayOfWeek: slot.dayOfWeek,
    startHour: slot.startHour,
    startMinute: slot.startMinute,
    ...req.body,
  });
  await slot.update(fields);

  const withClass = await ClassScheduleSlot.findByPk(slot.id, { include: [includeClass] });
  res.json({ slot: serialize(withClass) });
}

async function remove(req, res) {
  const { id } = req.params;
  const slot = await ClassScheduleSlot.findByPk(id);

  if (!slot) {
    return res.status(404).json({ message: 'Créneau introuvable' });
  }

  await slot.destroy();
  res.status(204).send();
}

module.exports = { listPublic, listAdmin, create, update, remove };
