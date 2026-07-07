const { SubscriptionPlan } = require('../models');

function serialize(plan) {
  return {
    id: plan.id,
    category: plan.category,
    planKey: plan.planKey,
    name: { en: plan.nameEn, fr: plan.nameFr },
    subtitle: { en: plan.subtitleEn, fr: plan.subtitleFr },
    bestFor: { en: plan.bestForEn, fr: plan.bestForFr },
    price: plan.price,
    suffix: { en: plan.suffixEn, fr: plan.suffixFr },
    features: plan.features ?? { en: [], fr: [] },
    cta: {
      label: { en: plan.ctaLabelEn, fr: plan.ctaLabelFr },
      variant: plan.ctaVariant,
    },
    featured: plan.featured,
    sortOrder: plan.sortOrder,
    isActive: plan.isActive,
  };
}

async function listPublic(req, res) {
  const plans = await SubscriptionPlan.findAll({
    where: { isActive: true },
    order: [
      ['category', 'ASC'],
      ['sortOrder', 'ASC'],
    ],
  });
  res.json({ plans: plans.map(serialize) });
}

async function listAdmin(req, res) {
  const plans = await SubscriptionPlan.findAll({
    order: [
      ['category', 'ASC'],
      ['sortOrder', 'ASC'],
    ],
  });
  res.json({ plans: plans.map(serialize) });
}

function extractFields(body) {
  const {
    category,
    planKey,
    name = {},
    subtitle = {},
    bestFor = {},
    price,
    suffix = {},
    features = {},
    cta = {},
    featured,
    sortOrder,
    isActive,
  } = body || {};

  return {
    category,
    planKey,
    nameEn: name.en,
    nameFr: name.fr,
    subtitleEn: subtitle.en ?? null,
    subtitleFr: subtitle.fr ?? null,
    bestForEn: bestFor.en ?? null,
    bestForFr: bestFor.fr ?? null,
    price: price ?? null,
    suffixEn: suffix.en ?? null,
    suffixFr: suffix.fr ?? null,
    features: {
      en: Array.isArray(features.en) ? features.en : [],
      fr: Array.isArray(features.fr) ? features.fr : [],
    },
    ctaLabelEn: cta.label?.en ?? null,
    ctaLabelFr: cta.label?.fr ?? null,
    ctaVariant: cta.variant ?? 'outline',
    featured: Boolean(featured),
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    isActive: isActive ?? true,
  };
}

const VALID_CATEGORIES = [
  'day_pass',
  'membership',
  'group_class',
  'personal_training',
  'special_offer',
];

async function create(req, res) {
  const fields = extractFields(req.body);

  if (!fields.category || !VALID_CATEGORIES.includes(fields.category)) {
    return res.status(400).json({ message: 'A valid category is required' });
  }
  if (!fields.nameEn || !fields.nameFr) {
    return res.status(400).json({ message: 'Name (EN and FR) is required' });
  }

  const plan = await SubscriptionPlan.create(fields);
  res.status(201).json({ plan: serialize(plan) });
}

async function update(req, res) {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findByPk(id);

  if (!plan) {
    return res.status(404).json({ message: 'Plan not found' });
  }

  const fields = extractFields({ ...serializeForUpdate(plan), ...req.body });
  await plan.update(fields);

  res.json({ plan: serialize(plan) });
}

// Re-shapes the current DB row back into the bilingual request shape so partial
// PATCH bodies can be merged with extractFields without clobbering untouched fields.
function serializeForUpdate(plan) {
  return {
    category: plan.category,
    planKey: plan.planKey,
    name: { en: plan.nameEn, fr: plan.nameFr },
    subtitle: { en: plan.subtitleEn, fr: plan.subtitleFr },
    bestFor: { en: plan.bestForEn, fr: plan.bestForFr },
    price: plan.price,
    suffix: { en: plan.suffixEn, fr: plan.suffixFr },
    features: plan.features ?? { en: [], fr: [] },
    cta: { label: { en: plan.ctaLabelEn, fr: plan.ctaLabelFr }, variant: plan.ctaVariant },
    featured: plan.featured,
    sortOrder: plan.sortOrder,
    isActive: plan.isActive,
  };
}

async function remove(req, res) {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findByPk(id);

  if (!plan) {
    return res.status(404).json({ message: 'Plan not found' });
  }

  await plan.destroy();
  res.status(204).send();
}

module.exports = { listPublic, listAdmin, create, update, remove };
