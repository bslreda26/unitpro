const CLASS_IMAGES = {
  'express-burn':
    'https://images.unsplash.com/photo-1526401485004-2aa7bca48f03?auto=format&fit=crop&w=1600&q=80',
  'core-cardio':
    'https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=1600&q=80',
  'strong-workout':
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80',
  sweat60:
    'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1600&q=80',
  'small-group':
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=80',
  'booty-legs':
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80',
  'athletic-conditioning':
    'https://images.unsplash.com/photo-1599058945522-28ba584b6715?auto=format&fit=crop&w=1600&q=80',
  'hiit-rush':
    'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=1600&q=80',
  bootcamp:
    'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=1600&q=80',
}

export const GROUP_CLASSES = {
  en: {
    catalog: [
      {
        id: 'express-burn',
        emoji: '🔥',
        name: 'Express Burn',
        duration: 30,
        category: 'Cardio',
        levels: ['Beginner', 'Intermediate', 'Advanced'],
        description:
          'A fast-paced, full-body workout designed to maximize calorie burn in just 30 minutes. Perfect for busy professionals looking for an efficient training session.',
        benefits: ['Burn fat', 'Improve fitness', 'Increase energy', 'Full-body workout'],
        idealFor: {
          label: 'perfectFor',
          items: ['Lunch breaks', 'Before work', 'After work'],
        },
        time: 'Mon / Wed / Fri — 12:30 PM',
      },
      {
        id: 'core-cardio',
        emoji: '❤️',
        name: 'Core & Cardio',
        duration: 30,
        category: 'Cardio',
        levels: ['Beginner', 'Intermediate'],
        description:
          'Strengthen your core while improving cardiovascular fitness through a combination of abdominal exercises and low to moderate-impact cardio intervals.',
        benefits: ['Stronger core', 'Better posture', 'Increased endurance', 'Improved balance'],
        idealFor: {
          label: 'perfectFor',
          items: ['Weight loss', 'Beginners', 'Everyday fitness'],
        },
        time: 'Tue / Thu — 12:30 PM',
      },
      {
        id: 'strong-workout',
        emoji: '💪',
        name: 'Strong Workout',
        duration: 60,
        category: 'Strength',
        levels: ['Intermediate', 'Advanced'],
        description:
          'A progressive strength-training class using barbells, dumbbells, kettlebells, resistance bands, and bodyweight exercises to build muscle and increase total-body strength.',
        benefits: [
          'Build lean muscle',
          'Increase strength',
          'Improve metabolism',
          'Better athletic performance',
        ],
        idealFor: {
          label: 'idealFor',
          items: ['Muscle building', 'Strength development', 'Body transformation'],
        },
        time: 'Tue / Thu / Sat — 8:30 AM · Mon–Fri — 5:30 PM',
      },
      {
        id: 'sweat60',
        emoji: '🔥',
        name: 'Sweat60',
        duration: 60,
        category: 'Conditioning',
        levels: ['Beginner', 'Intermediate', 'Advanced'],
        description:
          'A high-energy full-body conditioning workout combining strength, cardio, circuits, and functional exercises to maximize calorie burn.',
        benefits: [
          'Burn up to 600–900 calories*',
          'Improve endurance',
          'Build lean muscle',
          'Boost cardiovascular fitness',
        ],
        note: '*Actual calorie burn varies by person and workout intensity.',
        idealFor: {
          label: 'idealFor',
          items: ['Fat loss', 'General fitness', 'Body transformation'],
        },
        time: 'Mon / Wed / Fri — 6:30 PM',
      },
      {
        id: 'small-group',
        emoji: '👥',
        name: 'Small Group Coaching',
        duration: 60,
        category: 'Strength',
        levels: ['All Levels'],
        description:
          'Personal training in a small group (4–8 members). Receive expert coaching, technique correction, personalized progressions, and accountability in a motivating environment.',
        benefits: [
          'Individual coaching',
          'Customized progressions',
          'Better results',
          'Community support',
        ],
        idealFor: {
          label: 'idealFor',
          items: ['Beginners', 'Weight loss', 'Strength', 'Performance goals'],
        },
        time: 'Mon–Fri — 7:30 PM',
      },
      {
        id: 'booty-legs',
        emoji: '🍑',
        name: 'Booty & Legs Workout',
        duration: 60,
        category: 'Strength',
        levels: ['Beginner', 'Intermediate', 'Advanced'],
        description:
          'Focus on developing stronger glutes, legs, and lower-body strength through resistance training, functional movements, and targeted conditioning.',
        benefits: [
          'Build stronger glutes',
          'Tone legs',
          'Improve lower-body strength',
          'Enhance stability and athletic performance',
        ],
        includes: ['Squats', 'Lunges', 'Hip thrusts', 'Deadlifts', 'Glute activation exercises'],
        time: 'Tue / Thu — 5:30 PM · Sat — 8:30 AM',
      },
      {
        id: 'athletic-conditioning',
        emoji: '⚡',
        name: 'Athletic Conditioning',
        duration: 60,
        category: 'Conditioning',
        levels: ['Intermediate', 'Advanced'],
        description:
          'Train like an athlete with speed, agility, power, coordination, and endurance drills designed to improve sports performance and overall fitness.',
        benefits: [
          'Faster acceleration',
          'Improved agility',
          'Greater power',
          'Better endurance',
          'Enhanced coordination',
        ],
        idealFor: {
          label: 'perfectFor',
          items: ['Padel players', 'Footballers', 'Runners', 'Competitive athletes'],
        },
        time: 'Sat — 5:30 PM',
      },
      {
        id: 'hiit-rush',
        emoji: '🚀',
        name: 'HIIT Rush',
        duration: 30,
        category: 'HIIT',
        levels: ['Intermediate', 'Advanced'],
        description:
          'A high-intensity interval training (HIIT) class featuring short bursts of maximum effort followed by brief recovery periods for an efficient and challenging workout.',
        benefits: [
          'Burn calories during and after the workout',
          'Improve cardiovascular fitness',
          'Increase speed and stamina',
          'Time-efficient training',
        ],
        idealFor: {
          label: 'perfectFor',
          items: ['Fat loss', 'Busy schedules', 'Fitness enthusiasts'],
        },
        time: 'Tue / Thu — 9:30 AM',
      },
      {
        id: 'bootcamp',
        emoji: '🪖',
        name: 'Bootcamp',
        duration: 60,
        category: 'HIIT',
        levels: ['Beginner', 'Intermediate', 'Advanced'],
        description:
          'A team-based functional training class that combines strength, cardio, bodyweight exercises, and outdoor-style conditioning to challenge both body and mind.',
        benefits: [
          'Build strength',
          'Burn fat',
          'Improve endurance',
          'Develop teamwork and motivation',
        ],
        includes: [
          'Functional circuits',
          'Sled pushes (if available)',
          'Battle ropes',
          'Burpees',
          'Running drills',
          'Team challenges',
        ],
        time: 'Sat — 9:30–10:30 AM',
      },
    ],
    scheduleOnly: {
      Burn45: {
        category: 'Cardio',
        levels: ['All Levels'],
        description:
          '45-minute fat-burning workout: circuits, cardio intervals, full body. Great for beginners and weight loss.',
      },
      Sculpt: {
        category: 'Strength',
        levels: ['All Levels'],
        description: 'Full-body strength sculpting session.',
      },
      'Stretch & Recovery': {
        category: 'Recovery',
        levels: ['All Levels'],
        description: 'Mobility and recovery to improve flexibility and reduce injury risk.',
      },
    },
  },
  fr: {
    catalog: [
      {
        id: 'express-burn',
        emoji: '🔥',
        name: 'Express Burn',
        duration: 30,
        category: 'Cardio',
        levels: ['Débutant', 'Intermédiaire', 'Avancé'],
        description:
          'Un entraînement complet et dynamique conçu pour maximiser la dépense calorique en seulement 30 minutes. Idéal pour les professionnels pressés qui veulent une séance efficace.',
        benefits: [
          'Brûler les graisses',
          'Améliorer la condition physique',
          'Augmenter l’énergie',
          'Entraînement corps entier',
        ],
        idealFor: {
          label: 'perfectFor',
          items: ['Pause déjeuner', 'Avant le travail', 'Après le travail'],
        },
        time: 'Lun / mer / ven — 12h30',
      },
      {
        id: 'core-cardio',
        emoji: '❤️',
        name: 'Core & Cardio',
        duration: 30,
        category: 'Cardio',
        levels: ['Débutant', 'Intermédiaire'],
        description:
          'Renforcez votre core tout en améliorant votre condition cardiovasculaire grâce à des exercices abdominaux et des intervalles cardio à faible ou modérée intensité.',
        benefits: [
          'Core plus fort',
          'Meilleure posture',
          'Endurance accrue',
          'Équilibre amélioré',
        ],
        idealFor: {
          label: 'perfectFor',
          items: ['Perte de poids', 'Débutants', 'Fitness au quotidien'],
        },
        time: 'Mar / jeu — 12h30',
      },
      {
        id: 'strong-workout',
        emoji: '💪',
        name: 'Strong Workout',
        duration: 60,
        category: 'Strength',
        levels: ['Intermédiaire', 'Avancé'],
        description:
          'Un cours de musculation progressive utilisant barres, haltères, kettlebells, élastiques et poids du corps pour développer la masse musculaire et la force globale.',
        benefits: [
          'Développer la masse maigre',
          'Augmenter la force',
          'Améliorer le métabolisme',
          'Meilleures performances athlétiques',
        ],
        idealFor: {
          label: 'idealFor',
          items: ['Prise de muscle', 'Développement de la force', 'Transformation corporelle'],
        },
        time: 'Mar / jeu / sam — 8h30 · Lun–ven — 17h30',
      },
      {
        id: 'sweat60',
        emoji: '🔥',
        name: 'Sweat60',
        duration: 60,
        category: 'Conditioning',
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
        idealFor: {
          label: 'idealFor',
          items: ['Perte de gras', 'Fitness général', 'Transformation corporelle'],
        },
        time: 'Lun / mer / ven — 18h30',
      },
      {
        id: 'small-group',
        emoji: '👥',
        name: 'Small Group Coaching',
        duration: 60,
        category: 'Strength',
        levels: ['Tous niveaux'],
        description:
          'Coaching personnel en petit groupe (4–8 personnes). Bénéficiez d’un encadrement expert, de corrections techniques, de progressions personnalisées et d’une vraie motivation collective.',
        benefits: [
          'Coaching individuel',
          'Progressions sur mesure',
          'Meilleurs résultats',
          'Soutien communautaire',
        ],
        idealFor: {
          label: 'idealFor',
          items: ['Débutants', 'Perte de poids', 'Force', 'Objectifs performance'],
        },
        time: 'Lun–ven — 19h30',
      },
      {
        id: 'booty-legs',
        emoji: '🍑',
        name: 'Booty & Legs Workout',
        duration: 60,
        category: 'Strength',
        levels: ['Débutant', 'Intermédiaire', 'Avancé'],
        description:
          'Concentrez-vous sur des fessiers et des jambes plus forts grâce à la musculation, aux mouvements fonctionnels et au conditionnement ciblé du bas du corps.',
        benefits: [
          'Fessiers plus forts',
          'Jambes tonifiées',
          'Force du bas du corps',
          'Stabilité et performance athlétique',
        ],
        includes: [
          'Squats',
          'Fentes',
          'Hip thrusts',
          'Soulevés de terre',
          'Activation des fessiers',
        ],
        time: 'Mar / jeu — 17h30 · Sam — 8h30',
      },
      {
        id: 'athletic-conditioning',
        emoji: '⚡',
        name: 'Athletic Conditioning',
        duration: 60,
        category: 'Conditioning',
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
        idealFor: {
          label: 'perfectFor',
          items: ['Joueurs de padel', 'Footballeurs', 'Coureurs', 'Athlètes compétitifs'],
        },
        time: 'Sam — 17h30',
      },
      {
        id: 'hiit-rush',
        emoji: '🚀',
        name: 'HIIT Rush',
        duration: 30,
        category: 'HIIT',
        levels: ['Intermédiaire', 'Avancé'],
        description:
          'Un cours de HIIT avec des efforts maximaux courts suivis de courtes récupérations pour un entraînement intense et efficace.',
        benefits: [
          'Brûler des calories pendant et après la séance',
          'Améliorer le cardio',
          'Augmenter vitesse et endurance',
          'Entraînement rapide',
        ],
        idealFor: {
          label: 'perfectFor',
          items: ['Perte de gras', 'Emplois du temps chargés', 'Passionnés de fitness'],
        },
        time: 'Mar / jeu — 9h30',
      },
      {
        id: 'bootcamp',
        emoji: '🪖',
        name: 'Bootcamp',
        duration: 60,
        category: 'HIIT',
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
      },
    ],
    scheduleOnly: {
      Burn45: {
        category: 'Cardio',
        levels: ['Tous niveaux'],
        description:
          'Entraînement brûle-graisse de 45 minutes : circuits, intervalles cardio, corps entier. Idéal pour débutants et perte de poids.',
      },
      Sculpt: {
        category: 'Strength',
        levels: ['Tous niveaux'],
        description: 'Séance de renforcement musculaire corps entier.',
      },
      'Stretch & Recovery': {
        category: 'Recovery',
        levels: ['Tous niveaux'],
        description:
          'Mobilité et récupération pour améliorer la souplesse et réduire les risques de blessure.',
      },
    },
  },
}

export function getGroupClasses(lang) {
  return GROUP_CLASSES[lang === 'fr' ? 'fr' : 'en']
}

export function formatLevels(levels) {
  return (levels ?? []).join(' • ')
}

export function formatDuration(minutes, lang) {
  const suffix = lang === 'fr' ? ' MIN' : ' MIN'
  return `${minutes}${suffix}`
}

export function catalogWithImages(catalog) {
  return catalog.map((item) => ({
    ...item,
    img: CLASS_IMAGES[item.id],
    level: formatLevels(item.levels),
    durationLabel: `${item.duration} MIN`,
    trainer: 'UNIT PRO Coach',
  }))
}

export function buildClassInfoMap(lang) {
  const { catalog, scheduleOnly } = getGroupClasses(lang)
  const map = {}

  for (const item of catalog) {
    map[item.name] = {
      category: item.category,
      level: formatLevels(item.levels),
      trainer: 'UNIT PRO Coach',
      details: item.description,
      classData: item,
    }
  }

  for (const [name, item] of Object.entries(scheduleOnly)) {
    map[name] = {
      category: item.category,
      level: formatLevels(item.levels),
      trainer: 'UNIT PRO Coach',
      details: item.description,
    }
  }

  return map
}

export function durationMinutes(title, hour, minute) {
  if (title === 'Express Burn') return 30
  if (title === 'Core & Cardio') return 30
  if (title === 'HIIT Rush') return 30
  if (title === 'Burn45') return 45
  if (hour === 9 && minute === 15) return 45
  if (title === 'Sweat60') return 60
  return 60
}
