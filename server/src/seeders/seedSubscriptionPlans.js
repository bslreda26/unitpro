require('dotenv').config();
const { sequelize, SubscriptionPlan } = require('../models');

// Mirrors the French content that used to live in src/i18n/translations.js
// (dict.homePricing), so a fresh install's public site content matches what
// admins have been editing since the site went French-only.
const PLANS = [
  {
    category: 'day_pass',
    planKey: 'day-pass',
    name: 'Pass journée',
    subtitle: 'Accès salle uniquement',
    bestFor: 'Découvrir l’espace ou une visite unique.',
    price: 8000,
    suffix: '',
    features: ['Accès salle pour une journée'],
    cta: { label: 'Pass journée', variant: 'outline' },
    featured: false,
    sortOrder: 0,
  },
  {
    category: 'membership',
    planKey: 'starter',
    name: 'Starter',
    price: 50000,
    suffix: '/ mois',
    features: ['Accès salle complet', '3 cours collectifs par semaine', 'Bilan fitness', 'Soutien communauté'],
    bestFor: 'Motivation et structure.',
    cta: { label: 'Commencer', variant: 'outline' },
    featured: false,
    sortOrder: 0,
  },
  {
    category: 'membership',
    planKey: 'unlimited-studio',
    name: 'Studio Illimité',
    price: 75000,
    suffix: '/ mois',
    features: [
      'Accès salle illimité',
      'Cours illimités',
      'Réservation prioritaire',
      'Analyse corporelle mensuelle',
      'Accès à tous les événements studio',
    ],
    bestFor: 'Transformation sérieuse.',
    cta: { label: 'Passer illimité', variant: 'solid' },
    featured: true,
    sortOrder: 1,
  },
  {
    category: 'membership',
    planKey: 'premium-coaching',
    name: 'Coaching Premium',
    price: 150000,
    suffix: '/ mois',
    features: [
      'Accès salle illimité',
      'Cours illimités',
      '1 séance coaching perso / semaine',
      'Coaching nutrition',
      'Programme personnalisé',
      'Suivi mensuel des progrès',
      'Support prioritaire',
      '1 bouteille d’eau',
    ],
    bestFor: 'Résultats max et objectifs long terme.',
    cta: { label: 'Rejoindre premium', variant: 'outline' },
    featured: false,
    sortOrder: 2,
  },
  {
    category: 'membership',
    planKey: 'vip-transformation',
    name: 'VIP Transformation',
    price: 250000,
    suffix: '/ mois',
    features: [
      'Accès salle illimité',
      'Cours illimités',
      '3 séances coaching perso / semaine',
      'Coaching nutrition',
      'Programme personnalisé',
      'Suivi mensuel des progrès',
      'Support prioritaire',
      'Accès casier',
      '1 bouteille d’eau + serviettes',
    ],
    bestFor: 'Résultats max et coaching premium.',
    cta: { label: 'Candidature VIP', variant: 'outline' },
    featured: false,
    sortOrder: 3,
  },
  {
    category: 'group_class',
    planKey: 'single-class',
    name: 'Cours unitaire',
    subtitle: 'Parfait pour essayer un cours.',
    price: 8000,
    suffix: '',
    sortOrder: 0,
  },
  {
    category: 'group_class',
    planKey: 'starter-pack',
    name: 'Pack Starter',
    subtitle: '5 cours · valable 1 mois',
    price: 20000,
    suffix: '',
    sortOrder: 1,
  },
  {
    category: 'group_class',
    planKey: 'transformation-pack',
    name: 'Pack Transformation',
    subtitle: '10 cours · valable 2 mois',
    price: 35000,
    suffix: '',
    sortOrder: 2,
  },
  {
    category: 'group_class',
    planKey: 'unlimited-classes',
    name: 'Cours illimités',
    subtitle: 'Accès illimité à tous les cours collectifs.',
    price: 40000,
    suffix: '/ mois',
    sortOrder: 3,
  },
  {
    category: 'personal_training',
    planKey: 'single-session',
    name: 'Séance unitaire',
    price: 20000,
    suffix: '',
    sortOrder: 0,
  },
  {
    category: 'personal_training',
    planKey: 'pack-8',
    name: 'Pack 8 séances',
    price: 120000,
    suffix: '',
    sortOrder: 1,
  },
  {
    category: 'personal_training',
    planKey: 'pack-12',
    name: 'Pack 12 séances',
    price: 150000,
    suffix: '',
    sortOrder: 2,
  },
  {
    category: 'personal_training',
    planKey: 'premium-body',
    name: 'Transformation Premium',
    price: 200000,
    suffix: '',
    sortOrder: 3,
  },
  {
    category: 'special_offer',
    planKey: 'first-class',
    name: 'Premier cours offert',
    sortOrder: 0,
  },
  {
    category: 'special_offer',
    planKey: 'bring-friend',
    name: 'Ami gratuit le samedi',
    subtitle: 'Entraînez-vous ensemble gratuitement chaque samedi.',
    sortOrder: 1,
  },
  {
    category: 'special_offer',
    planKey: 'challenge',
    name: 'Défi transformation 12 semaines',
    subtitle: 'Programme coaching transformation avec lots.',
    sortOrder: 2,
  },
];

async function run() {
  await sequelize.sync();

  for (const plan of PLANS) {
    const existing = await SubscriptionPlan.findOne({ where: { planKey: plan.planKey } });
    if (existing) continue;

    await SubscriptionPlan.create({
      category: plan.category,
      planKey: plan.planKey,
      name: plan.name,
      subtitle: plan.subtitle ?? null,
      bestFor: plan.bestFor ?? null,
      price: plan.price ?? null,
      suffix: plan.suffix ?? null,
      features: plan.features ?? [],
      ctaLabel: plan.cta?.label ?? null,
      ctaVariant: plan.cta?.variant ?? 'outline',
      featured: Boolean(plan.featured),
      sortOrder: plan.sortOrder ?? 0,
      isActive: true,
    });
  }

  console.log(`Subscription plans seeded (${PLANS.length} checked, existing ones skipped).`);
  await sequelize.close();
}

run().catch((err) => {
  console.error('Seeding subscription plans failed:', err);
  process.exit(1);
});
