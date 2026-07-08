require('dotenv').config();
const { sequelize, GroupClass } = require('../models');

// Mirrors the French content that used to live in src/data/groupClasses.js
// (fr.catalog + fr.scheduleOnly), so a fresh install's public site content
// matches what admins have been editing since the site went French-only.
// scheduleOnly entries (Burn45, Sculpt, Stretch & Recovery) become classes
// with showInCatalog=false — they only ever appear on the weekly calendar,
// never as a card on the "Cours" tab.
const CLASSES = [
  {
    classKey: 'express-burn',
    emoji: '🔥',
    name: 'Express Burn',
    category: 'Cardio',
    durationMinutes: 30,
    levels: ['Débutant', 'Intermédiaire', 'Avancé'],
    description:
      'Un entraînement complet et dynamique conçu pour maximiser la dépense calorique en seulement 30 minutes. Idéal pour les professionnels pressés qui veulent une séance efficace.',
    benefits: [
      'Brûler les graisses',
      'Améliorer la condition physique',
      'Augmenter l’énergie',
      'Entraînement corps entier',
    ],
    idealForLabel: 'perfectFor',
    idealForItems: ['Pause déjeuner', 'Avant le travail', 'Après le travail'],
    time: 'Lun / mer / ven — 12h30',
    imageUrl:
      'https://images.unsplash.com/photo-1526401485004-2aa7bca48f03?auto=format&fit=crop&w=1600&q=80',
    showInCatalog: true,
    sortOrder: 0,
  },
  {
    classKey: 'core-cardio',
    emoji: '❤️',
    name: 'Core & Cardio',
    category: 'Cardio',
    durationMinutes: 30,
    levels: ['Débutant', 'Intermédiaire'],
    description:
      'Renforcez votre core tout en améliorant votre condition cardiovasculaire grâce à des exercices abdominaux et des intervalles cardio à faible ou modérée intensité.',
    benefits: ['Core plus fort', 'Meilleure posture', 'Endurance accrue', 'Équilibre amélioré'],
    idealForLabel: 'perfectFor',
    idealForItems: ['Perte de poids', 'Débutants', 'Fitness au quotidien'],
    time: 'Mar / jeu — 12h30',
    imageUrl:
      'https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=1600&q=80',
    showInCatalog: true,
    sortOrder: 1,
  },
  {
    classKey: 'strong-workout',
    emoji: '💪',
    name: 'Strong Workout',
    category: 'Strength',
    durationMinutes: 60,
    levels: ['Intermédiaire', 'Avancé'],
    description:
      'Un cours de musculation progressive utilisant barres, haltères, kettlebells, élastiques et poids du corps pour développer la masse musculaire et la force globale.',
    benefits: [
      'Développer la masse maigre',
      'Augmenter la force',
      'Améliorer le métabolisme',
      'Meilleures performances athlétiques',
    ],
    idealForLabel: 'idealFor',
    idealForItems: ['Prise de muscle', 'Développement de la force', 'Transformation corporelle'],
    time: 'Mar / jeu / sam — 8h30 · Lun–ven — 17h30',
    imageUrl:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80',
    showInCatalog: true,
    sortOrder: 2,
  },
  {
    classKey: 'sweat60',
    emoji: '🔥',
    name: 'Sweat60',
    category: 'Conditioning',
    durationMinutes: 60,
    levels: ['Débutant', 'Intermédiaire', 'Avancé'],
    description:
      'Un entraînement conditionnel haute énergie combinant force, cardio, circuits et exercices fonctionnels pour maximiser la dépense calorique.',
    benefits: [
      'Brûler jusqu’à 600–900 calories*',
      'Améliorer l’endurance',
      'Développer la masse maigre',
      'Renforcer le cardio',
    ],
    note: '*La dépense calorique réelle varie selon la personne et l’intensité.',
    idealForLabel: 'idealFor',
    idealForItems: ['Perte de gras', 'Fitness général', 'Transformation corporelle'],
    time: 'Lun / mer / ven — 18h30',
    imageUrl:
      'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1600&q=80',
    showInCatalog: true,
    sortOrder: 3,
  },
  {
    classKey: 'small-group',
    emoji: '👥',
    name: 'Small Group Coaching',
    category: 'Strength',
    durationMinutes: 60,
    levels: ['Tous niveaux'],
    description:
      'Coaching personnel en petit groupe (4–8 personnes). Bénéficiez d’un encadrement expert, de corrections techniques, de progressions personnalisées et d’une vraie motivation collective.',
    benefits: [
      'Coaching individuel',
      'Progressions sur mesure',
      'Meilleurs résultats',
      'Soutien communautaire',
    ],
    idealForLabel: 'idealFor',
    idealForItems: ['Débutants', 'Perte de poids', 'Force', 'Objectifs performance'],
    time: 'Lun–ven — 19h30',
    imageUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=80',
    showInCatalog: true,
    sortOrder: 4,
  },
  {
    classKey: 'booty-legs',
    emoji: '🍑',
    name: 'Booty & Legs Workout',
    category: 'Strength',
    durationMinutes: 60,
    levels: ['Débutant', 'Intermédiaire', 'Avancé'],
    description:
      'Concentrez-vous sur des fessiers et des jambes plus forts grâce à la musculation, aux mouvements fonctionnels et au conditionnement ciblé du bas du corps.',
    benefits: [
      'Fessiers plus forts',
      'Jambes tonifiées',
      'Force du bas du corps',
      'Stabilité et performance athlétique',
    ],
    includes: ['Squats', 'Fentes', 'Hip thrusts', 'Soulevés de terre', 'Activation des fessiers'],
    time: 'Mar / jeu — 17h30 · Sam — 8h30',
    imageUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80',
    showInCatalog: true,
    sortOrder: 5,
  },
  {
    classKey: 'athletic-conditioning',
    emoji: '⚡',
    name: 'Athletic Conditioning',
    category: 'Conditioning',
    durationMinutes: 60,
    levels: ['Intermédiaire', 'Avancé'],
    description:
      'Entraînez-vous comme un athlète avec des exercices de vitesse, agilité, puissance, coordination et endurance pour améliorer vos performances sportives.',
    benefits: [
      'Accélération plus rapide',
      'Agilité améliorée',
      'Puissance accrue',
      'Meilleure endurance',
      'Coordination renforcée',
    ],
    idealForLabel: 'perfectFor',
    idealForItems: ['Joueurs de padel', 'Footballeurs', 'Coureurs', 'Athlètes compétitifs'],
    time: 'Sam — 17h30',
    imageUrl:
      'https://images.unsplash.com/photo-1599058945522-28ba584b6715?auto=format&fit=crop&w=1600&q=80',
    showInCatalog: true,
    sortOrder: 6,
  },
  {
    classKey: 'hiit-rush',
    emoji: '🚀',
    name: 'HIIT Rush',
    category: 'HIIT',
    durationMinutes: 30,
    levels: ['Intermédiaire', 'Avancé'],
    description:
      'Un cours de HIIT avec des efforts maximaux courts suivis de courtes récupérations pour un entraînement intense et efficace.',
    benefits: [
      'Brûler des calories pendant et après la séance',
      'Améliorer le cardio',
      'Augmenter vitesse et endurance',
      'Entraînement rapide',
    ],
    idealForLabel: 'perfectFor',
    idealForItems: ['Perte de gras', 'Emplois du temps chargés', 'Passionnés de fitness'],
    time: 'Mar / jeu — 9h30',
    imageUrl:
      'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=1600&q=80',
    showInCatalog: true,
    sortOrder: 7,
  },
  {
    classKey: 'bootcamp',
    emoji: '🪖',
    name: 'Bootcamp',
    category: 'HIIT',
    durationMinutes: 60,
    levels: ['Débutant', 'Intermédiaire', 'Avancé'],
    description:
      'Un entraînement fonctionnel en équipe mêlant force, cardio, poids du corps et conditionnement type bootcamp pour défier corps et esprit.',
    benefits: [
      'Développer la force',
      'Brûler les graisses',
      'Améliorer l’endurance',
      'Esprit d’équipe et motivation',
    ],
    includes: [
      'Circuits fonctionnels',
      'Poussées de traîneau (si disponible)',
      'Battle ropes',
      'Burpees',
      'Drills de course',
      'Défis en équipe',
    ],
    time: 'Sam — 9h30–10h30',
    imageUrl:
      'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=1600&q=80',
    showInCatalog: true,
    sortOrder: 8,
  },
  // Schedule-only classes: appear on the weekly calendar but not as a card
  // on the "Cours" tab.
  {
    classKey: 'burn45',
    name: 'Burn45',
    category: 'Cardio',
    durationMinutes: 45,
    levels: ['Tous niveaux'],
    description:
      'Entraînement brûle-graisse de 45 minutes : circuits, intervalles cardio, corps entier. Idéal pour débutants et perte de poids.',
    showInCatalog: false,
    sortOrder: 100,
  },
  {
    classKey: 'sculpt',
    name: 'Sculpt',
    category: 'Strength',
    durationMinutes: 45,
    levels: ['Tous niveaux'],
    description: 'Séance de renforcement musculaire corps entier.',
    showInCatalog: false,
    sortOrder: 101,
  },
  {
    classKey: 'stretch-recovery',
    name: 'Stretch & Recovery',
    category: 'Recovery',
    durationMinutes: 60,
    levels: ['Tous niveaux'],
    description:
      'Mobilité et récupération pour améliorer la souplesse et réduire les risques de blessure.',
    showInCatalog: false,
    sortOrder: 102,
  },
];

async function run() {
  await sequelize.sync();

  for (const item of CLASSES) {
    const existing = await GroupClass.findOne({ where: { classKey: item.classKey } });
    if (existing) continue;

    await GroupClass.create({
      classKey: item.classKey,
      emoji: item.emoji ?? null,
      name: item.name,
      category: item.category,
      durationMinutes: item.durationMinutes,
      levels: item.levels ?? [],
      description: item.description ?? null,
      benefits: item.benefits ?? [],
      idealForLabel: item.idealForLabel ?? null,
      idealForItems: item.idealForItems ?? [],
      includes: item.includes ?? [],
      note: item.note ?? null,
      time: item.time ?? null,
      imageUrl: item.imageUrl ?? null,
      showInCatalog: item.showInCatalog ?? true,
      sortOrder: item.sortOrder ?? 0,
      isActive: true,
    });
  }

  console.log(`Group classes seeded (${CLASSES.length} checked, existing ones skipped).`);
  await sequelize.close();
}

run().catch((err) => {
  console.error('Seeding group classes failed:', err);
  process.exit(1);
});
