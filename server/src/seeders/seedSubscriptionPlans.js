require('dotenv').config();
const { sequelize, SubscriptionPlan } = require('../models');

// Mirrors the hardcoded EN/FR content that used to live in src/i18n/translations.js
// (dict.homePricing), so the public site's content doesn't change when this ships.
const PLANS = [
  {
    category: 'day_pass',
    planKey: 'day-pass',
    name: { en: 'Day Pass', fr: 'Pass journée' },
    subtitle: { en: 'Access gym only', fr: 'Accès salle uniquement' },
    bestFor: { en: 'Trying the space or a single visit.', fr: 'Découvrir l’espace ou une visite unique.' },
    price: 8000,
    suffix: { en: '', fr: '' },
    features: {
      en: ['Gym access for one day'],
      fr: ['Accès salle pour une journée'],
    },
    cta: { label: { en: 'Get day pass', fr: 'Pass journée' }, variant: 'outline' },
    featured: false,
    sortOrder: 0,
  },
  {
    category: 'membership',
    planKey: 'starter',
    name: { en: 'Starter', fr: 'Starter' },
    price: 50000,
    suffix: { en: '/ month', fr: '/ mois' },
    features: {
      en: ['Full gym access', '3 group classes per week', 'Fitness assessment', 'Community support'],
      fr: ['Accès salle complet', '3 cours collectifs par semaine', 'Bilan fitness', 'Soutien communauté'],
    },
    bestFor: { en: 'Clients wanting motivation and structure.', fr: 'Motivation et structure.' },
    cta: { label: { en: 'Get started', fr: 'Commencer' }, variant: 'outline' },
    featured: false,
    sortOrder: 0,
  },
  {
    category: 'membership',
    planKey: 'unlimited-studio',
    name: { en: 'Unlimited Studio', fr: 'Studio Illimité' },
    price: 75000,
    suffix: { en: '/ month', fr: '/ mois' },
    features: {
      en: [
        'Unlimited gym access',
        'Unlimited classes',
        'Priority class booking',
        'Monthly body analysis',
        'Access to all studio events',
      ],
      fr: [
        'Accès salle illimité',
        'Cours illimités',
        'Réservation prioritaire',
        'Analyse corporelle mensuelle',
        'Accès à tous les événements studio',
      ],
    },
    bestFor: { en: 'Clients focused on serious transformation.', fr: 'Transformation sérieuse.' },
    cta: { label: { en: 'Go unlimited', fr: 'Passer illimité' }, variant: 'solid' },
    featured: true,
    sortOrder: 1,
  },
  {
    category: 'membership',
    planKey: 'premium-coaching',
    name: { en: 'Premium Coaching', fr: 'Coaching Premium' },
    price: 150000,
    suffix: { en: '/ month', fr: '/ mois' },
    features: {
      en: [
        'Unlimited gym access',
        'Unlimited classes',
        '1 personal training session weekly',
        'Nutrition coaching',
        'Personalized workout plan',
        'Monthly progress tracking',
        'Priority support',
        '1 bottle of water',
      ],
      fr: [
        'Accès salle illimité',
        'Cours illimités',
        '1 séance coaching perso / semaine',
        'Coaching nutrition',
        'Programme personnalisé',
        'Suivi mensuel des progrès',
        'Support prioritaire',
        '1 bouteille d’eau',
      ],
    },
    bestFor: { en: 'Maximum results and long-term achievement.', fr: 'Résultats max et objectifs long terme.' },
    cta: { label: { en: 'Join premium', fr: 'Rejoindre premium' }, variant: 'outline' },
    featured: false,
    sortOrder: 2,
  },
  {
    category: 'membership',
    planKey: 'vip-transformation',
    name: { en: 'VIP Transformation', fr: 'VIP Transformation' },
    price: 250000,
    suffix: { en: '/ month', fr: '/ mois' },
    features: {
      en: [
        'Unlimited gym access',
        'Unlimited classes',
        '3 personal training sessions weekly',
        'Nutrition coaching',
        'Personalized workout plan',
        'Monthly progress tracking',
        'Priority support',
        'Locker access',
        '1 bottle of water + towel service',
      ],
      fr: [
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
    },
    bestFor: { en: 'Maximum results and premium coaching.', fr: 'Résultats max et coaching premium.' },
    cta: { label: { en: 'Apply for VIP', fr: 'Candidature VIP' }, variant: 'outline' },
    featured: false,
    sortOrder: 3,
  },
  {
    category: 'group_class',
    planKey: 'single-class',
    name: { en: 'Single Class', fr: 'Cours unitaire' },
    subtitle: { en: 'Perfect for trying a class.', fr: 'Parfait pour essayer un cours.' },
    price: 8000,
    suffix: { en: '', fr: '' },
    sortOrder: 0,
  },
  {
    category: 'group_class',
    planKey: 'starter-pack',
    name: { en: 'Starter Pack', fr: 'Pack Starter' },
    subtitle: { en: '5 classes · valid for 1 month', fr: '5 cours · valable 1 mois' },
    price: 20000,
    suffix: { en: '', fr: '' },
    sortOrder: 1,
  },
  {
    category: 'group_class',
    planKey: 'transformation-pack',
    name: { en: 'Transformation Pack', fr: 'Pack Transformation' },
    subtitle: { en: '10 classes · valid for 2 months', fr: '10 cours · valable 2 mois' },
    price: 35000,
    suffix: { en: '', fr: '' },
    sortOrder: 2,
  },
  {
    category: 'group_class',
    planKey: 'unlimited-classes',
    name: { en: 'Unlimited Classes', fr: 'Cours illimités' },
    subtitle: { en: 'Unlimited access to all group classes.', fr: 'Accès illimité à tous les cours collectifs.' },
    price: 40000,
    suffix: { en: '/ month', fr: '/ mois' },
    sortOrder: 3,
  },
  {
    category: 'personal_training',
    planKey: 'single-session',
    name: { en: 'Single Session', fr: 'Séance unitaire' },
    price: 20000,
    suffix: { en: '', fr: '' },
    sortOrder: 0,
  },
  {
    category: 'personal_training',
    planKey: 'pack-8',
    name: { en: '8 Session Package', fr: 'Pack 8 séances' },
    price: 120000,
    suffix: { en: '', fr: '' },
    sortOrder: 1,
  },
  {
    category: 'personal_training',
    planKey: 'pack-12',
    name: { en: '12 Session Package', fr: 'Pack 12 séances' },
    price: 150000,
    suffix: { en: '', fr: '' },
    sortOrder: 2,
  },
  {
    category: 'personal_training',
    planKey: 'premium-body',
    name: { en: 'Premium Transformation', fr: 'Transformation Premium' },
    price: 200000,
    suffix: { en: '', fr: '' },
    sortOrder: 3,
  },
  {
    category: 'special_offer',
    planKey: 'first-class',
    name: { en: 'First Class Free', fr: 'Premier cours offert' },
    sortOrder: 0,
  },
  {
    category: 'special_offer',
    planKey: 'bring-friend',
    name: { en: 'Bring a Friend Saturday', fr: 'Ami gratuit le samedi' },
    subtitle: {
      en: 'Train together for free every Saturday.',
      fr: 'Entraînez-vous ensemble gratuitement chaque samedi.',
    },
    sortOrder: 1,
  },
  {
    category: 'special_offer',
    planKey: 'challenge',
    name: { en: '12-Week Transformation Challenge', fr: 'Défi transformation 12 semaines' },
    subtitle: {
      en: 'Body transformation coaching program with prizes.',
      fr: 'Programme coaching transformation avec lots.',
    },
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
      nameEn: plan.name.en,
      nameFr: plan.name.fr,
      subtitleEn: plan.subtitle?.en ?? null,
      subtitleFr: plan.subtitle?.fr ?? null,
      bestForEn: plan.bestFor?.en ?? null,
      bestForFr: plan.bestFor?.fr ?? null,
      price: plan.price ?? null,
      suffixEn: plan.suffix?.en ?? null,
      suffixFr: plan.suffix?.fr ?? null,
      features: plan.features ?? { en: [], fr: [] },
      ctaLabelEn: plan.cta?.label?.en ?? null,
      ctaLabelFr: plan.cta?.label?.fr ?? null,
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
