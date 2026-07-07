const { SubscriptionPlan } = require('../models');

function serialize(plan) {
  return {
    id: plan.id,
    category: plan.category,
    planKey: plan.planKey,
    name: plan.name,
    subtitle: plan.subtitle,
    bestFor: plan.bestFor,
    price: plan.price,
    suffix: plan.suffix,
    features: plan.features ?? [],
    cta: {
      label: plan.ctaLabel,
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
    name,
    subtitle,
    bestFor,
    price,
    suffix,
    features,
    cta = {},
    featured,
    sortOrder,
    isActive,
  } = body || {};

  return {
    category,
    planKey,
    name,
    subtitle: subtitle ?? null,
    bestFor: bestFor ?? null,
    price: price ?? null,
    suffix: suffix ?? null,
    features: Array.isArray(features) ? features : [],
    ctaLabel: cta.label ?? null,
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
  if (!fields.name) {
    return res.status(400).json({ message: 'Name is required' });
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

// Re-shapes the current DB row back into the request shape so partial PATCH
// bodies can be merged with extractFields without clobbering untouched fields.
function serializeForUpdate(plan) {
  return {
    category: plan.category,
    planKey: plan.planKey,
    name: plan.name,
    subtitle: plan.subtitle,
    bestFor: plan.bestFor,
    price: plan.price,
    suffix: plan.suffix,
    features: plan.features ?? [],
    cta: { label: plan.ctaLabel, variant: plan.ctaVariant },
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
