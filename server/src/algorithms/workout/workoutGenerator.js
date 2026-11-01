import exerciseRepository from '../../repositories/exercise.repository.js';

const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

/**
 * Gender and experience-specific training architectures.
 * 
 * - Men (Intermediate/Advanced): Synergistic 2-muscle pairings (Chest+Triceps, Back+Biceps, Shoulders+Abs/Forearms, Legs+Calves).
 * - Women (Intermediate/Advanced): Posterior chain & glute-dominant 2-muscle pairings (Glutes+Hamstrings, Back+Triceps, Quads+Glutes/Hips, Shoulders+Abs).
 * - Beginners (Men & Women): Foundational full-body / upper-lower linear motor development.
 */
export const SPLIT_ARCHITECTURES = {
  male: {
    beginner: {
      3: [
        { dayIndex: 0, focus: 'Full Body Foundations A (Chest, Quads, Core)', primary: ['chest', 'quadriceps'], secondary: ['abdominals'], isRestDay: false },
        { dayIndex: 1, focus: 'Active Recovery & Mobility', isRestDay: true, restDayGuidance: 'Light 20-min walk, hydration, and gentle mobility stretch.' },
        { dayIndex: 2, focus: 'Full Body Foundations B (Back, Hamstrings, Arms)', primary: ['lats', 'hamstrings'], secondary: ['biceps', 'triceps'], isRestDay: false },
        { dayIndex: 3, focus: 'Rest & Neuromuscular Repair', isRestDay: true, restDayGuidance: 'Restorative sleep, hydration, and foam rolling.' },
        { dayIndex: 4, focus: 'Full Body Foundations C (Shoulders, Glutes, Core)', primary: ['shoulders', 'glutes'], secondary: ['abdominals'], isRestDay: false },
        { dayIndex: 5, focus: 'Rest & Circadian Reset', isRestDay: true, restDayGuidance: 'Light outdoor recreation and full rest.' },
        { dayIndex: 6, focus: 'Rest & Weekly Review', isRestDay: true, restDayGuidance: 'Rest and prepare for the upcoming week.' }
      ],
      4: [
        { dayIndex: 0, focus: 'Upper Body Foundations (Chest & Back Focus)', primary: ['chest', 'lats'], secondary: ['shoulders', 'triceps'], isRestDay: false },
        { dayIndex: 1, focus: 'Lower Body Foundations (Quads & Core)', primary: ['quadriceps', 'hamstrings'], secondary: ['abdominals', 'calves'], isRestDay: false },
        { dayIndex: 2, focus: 'Active Recovery & Regeneration', isRestDay: true, restDayGuidance: 'Parasympathetic breathwork, hydration, and light stretching.' },
        { dayIndex: 3, focus: 'Upper Body Strength (Push & Pull)', primary: ['chest', 'middle back'], secondary: ['biceps', 'triceps'], isRestDay: false },
        { dayIndex: 4, focus: 'Lower Body & Posterior Chain Foundations', primary: ['quadriceps', 'glutes'], secondary: ['hamstrings', 'abdominals'], isRestDay: false },
        { dayIndex: 5, focus: 'Rest & Active Walk', isRestDay: true, restDayGuidance: 'Joint mobility flow and restorative sleep.' },
        { dayIndex: 6, focus: 'Weekly Reset & Rest', isRestDay: true, restDayGuidance: 'Unwind and prepare nutrition for the coming week.' }
      ],
      5: [
        { dayIndex: 0, focus: 'Full Body Foundation Push', primary: ['chest', 'quadriceps'], secondary: ['triceps'], isRestDay: false },
        { dayIndex: 1, focus: 'Full Body Foundation Pull', primary: ['lats', 'hamstrings'], secondary: ['biceps'], isRestDay: false },
        { dayIndex: 2, focus: 'Core & Delts Foundations', primary: ['shoulders'], secondary: ['abdominals'], isRestDay: false },
        { dayIndex: 3, focus: 'Rest Day', isRestDay: true, restDayGuidance: 'Complete rest day to allow muscle repair.' },
        { dayIndex: 4, focus: 'Upper Body Foundations', primary: ['chest', 'lats'], secondary: ['arms'], isRestDay: false },
        { dayIndex: 5, focus: 'Lower Body Foundations', primary: ['quadriceps', 'glutes'], secondary: ['calves', 'abdominals'], isRestDay: false },
        { dayIndex: 6, focus: 'Rest & Recovery', isRestDay: true, restDayGuidance: 'Deep recovery and joint mobility.' }
      ],
      6: [
        { dayIndex: 0, focus: 'Upper Push Foundations', primary: ['chest'], secondary: ['triceps', 'shoulders'], isRestDay: false },
        { dayIndex: 1, focus: 'Upper Pull Foundations', primary: ['lats', 'middle back'], secondary: ['biceps'], isRestDay: false },
        { dayIndex: 2, focus: 'Lower Foundations A', primary: ['quadriceps'], secondary: ['calves', 'abdominals'], isRestDay: false },
        { dayIndex: 3, focus: 'Upper Push Foundations B', primary: ['chest', 'shoulders'], secondary: ['triceps'], isRestDay: false },
        { dayIndex: 4, focus: 'Upper Pull Foundations B', primary: ['lats'], secondary: ['biceps'], isRestDay: false },
        { dayIndex: 5, focus: 'Lower Foundations B', primary: ['hamstrings', 'glutes'], secondary: ['abdominals'], isRestDay: false },
        { dayIndex: 6, focus: 'Complete Rest Day', isRestDay: true, restDayGuidance: 'Nervous system recovery.' }
      ]
    },
    intermediate: {
      3: [
        { dayIndex: 0, focus: 'Chest & Triceps (Push Synergy)', primary: ['chest'], secondary: ['triceps', 'abdominals'], isRestDay: false },
        { dayIndex: 1, focus: 'Rest & Active Recovery', isRestDay: true, restDayGuidance: 'Hydration, light walk, and upper body foam rolling.' },
        { dayIndex: 2, focus: 'Back & Biceps (Pull Synergy)', primary: ['lats', 'middle back'], secondary: ['biceps'], isRestDay: false },
        { dayIndex: 3, focus: 'Rest & Repair', isRestDay: true, restDayGuidance: 'Deep sleep and muscle protein synthesis.' },
        { dayIndex: 4, focus: 'Legs & Shoulders (Lower Power & Delts)', primary: ['quadriceps', 'hamstrings'], secondary: ['shoulders', 'calves'], isRestDay: false },
        { dayIndex: 5, focus: 'Rest Day', isRestDay: true, restDayGuidance: 'Outdoor walk and recovery.' },
        { dayIndex: 6, focus: 'Weekly Reset', isRestDay: true, restDayGuidance: 'Review nutrition and prepare for Monday.' }
      ],
      4: [
        { dayIndex: 0, focus: 'Chest & Triceps (Push Synergy)', primary: ['chest'], secondary: ['triceps'], isRestDay: false },
        { dayIndex: 1, focus: 'Back & Biceps (Pull Synergy)', primary: ['lats', 'middle back'], secondary: ['biceps'], isRestDay: false },
        { dayIndex: 2, focus: 'Rest & Regeneration', isRestDay: true, restDayGuidance: 'Parasympathetic breathwork, hydration, and light stretching.' },
        { dayIndex: 3, focus: 'Legs & Calves (Lower Power)', primary: ['quadriceps', 'hamstrings'], secondary: ['calves'], isRestDay: false },
        { dayIndex: 4, focus: 'Shoulders & Abs / Forearms (Delts & Core)', primary: ['shoulders'], secondary: ['abdominals', 'forearms'], isRestDay: false },
        { dayIndex: 5, focus: 'Active Recovery', isRestDay: true, restDayGuidance: 'Joint mobility flow and restorative sleep.' },
        { dayIndex: 6, focus: 'Rest & Weekly Reset', isRestDay: true, restDayGuidance: 'Unwind and prepare nutrition for the coming week.' }
      ],
      5: [
        { dayIndex: 0, focus: 'Chest & Triceps (Push Synergy)', primary: ['chest'], secondary: ['triceps'], isRestDay: false },
        { dayIndex: 1, focus: 'Back & Biceps (Pull Synergy)', primary: ['lats', 'middle back'], secondary: ['biceps'], isRestDay: false },
        { dayIndex: 2, focus: 'Legs (Quads & Hamstrings Focus)', primary: ['quadriceps', 'hamstrings'], secondary: ['calves'], isRestDay: false },
        { dayIndex: 3, focus: 'Rest & Glycogen Reset', isRestDay: true, restDayGuidance: 'Rest day to prevent central nervous system fatigue.' },
        { dayIndex: 4, focus: 'Shoulders & Abs / Forearms', primary: ['shoulders'], secondary: ['abdominals', 'forearms'], isRestDay: false },
        { dayIndex: 5, focus: 'Arms & Core (Biceps, Triceps & Abs)', primary: ['biceps', 'triceps'], secondary: ['abdominals'], isRestDay: false },
        { dayIndex: 6, focus: 'Full Rest & Recovery', isRestDay: true, restDayGuidance: 'Deep recovery and full tissue repair.' }
      ],
      6: [
        { dayIndex: 0, focus: 'Chest & Triceps (Heavy Push)', primary: ['chest'], secondary: ['triceps'], isRestDay: false },
        { dayIndex: 1, focus: 'Back & Biceps (Heavy Pull)', primary: ['lats', 'middle back'], secondary: ['biceps'], isRestDay: false },
        { dayIndex: 2, focus: 'Legs & Calves (Quads Dominant)', primary: ['quadriceps', 'glutes'], secondary: ['calves'], isRestDay: false },
        { dayIndex: 3, focus: 'Shoulders & Abs / Forearms', primary: ['shoulders'], secondary: ['abdominals', 'forearms'], isRestDay: false },
        { dayIndex: 4, focus: 'Chest & Back (Upper Hypertrophy)', primary: ['chest'], secondary: ['lats', 'middle back'], isRestDay: false },
        { dayIndex: 5, focus: 'Hamstrings & Arms (Posterior & Biceps/Triceps)', primary: ['hamstrings'], secondary: ['biceps', 'triceps'], isRestDay: false },
        { dayIndex: 6, focus: 'Complete Rest Day', isRestDay: true, restDayGuidance: 'Full nervous system reset.' }
      ]
    }
  },
  female: {
    beginner: {
      3: [
        { dayIndex: 0, focus: 'Glutes & Core Foundations (Posterior Chain & Abs)', primary: ['glutes', 'hamstrings'], secondary: ['abdominals'], isRestDay: false },
        { dayIndex: 1, focus: 'Active Recovery & Mobility', isRestDay: true, restDayGuidance: 'Light 20-min walk, hydration, and mobility stretch.' },
        { dayIndex: 2, focus: 'Upper Tone & Posture (Back, Shoulders & Triceps)', primary: ['lats', 'shoulders'], secondary: ['triceps'], isRestDay: false },
        { dayIndex: 3, focus: 'Rest & Repair', isRestDay: true, restDayGuidance: 'Restorative sleep, hydration, and gentle stretching.' },
        { dayIndex: 4, focus: 'Lower Body & Glute Strength (Quads, Glutes & Calves)', primary: ['quadriceps', 'glutes'], secondary: ['calves', 'abdominals'], isRestDay: false },
        { dayIndex: 5, focus: 'Rest & Circadian Reset', isRestDay: true, restDayGuidance: 'Outdoor recreation and light movement.' },
        { dayIndex: 6, focus: 'Weekly Reset', isRestDay: true, restDayGuidance: 'Rest and prepare for the upcoming week.' }
      ],
      4: [
        { dayIndex: 0, focus: 'Glutes & Hamstrings Foundations', primary: ['glutes', 'hamstrings'], secondary: ['abductors'], isRestDay: false },
        { dayIndex: 1, focus: 'Upper Body Toning & Posture (Back & Arms)', primary: ['lats', 'middle back'], secondary: ['triceps', 'shoulders'], isRestDay: false },
        { dayIndex: 2, focus: 'Active Recovery & Regeneration', isRestDay: true, restDayGuidance: 'Parasympathetic breathwork, hydration, and light stretching.' },
        { dayIndex: 3, focus: 'Quads, Glutes & Hips Foundations', primary: ['quadriceps', 'glutes'], secondary: ['abductors', 'calves'], isRestDay: false },
        { dayIndex: 4, focus: 'Core Sculpt & Active Glutes', primary: ['shoulders'], secondary: ['abdominals', 'glutes'], isRestDay: false },
        { dayIndex: 5, focus: 'Rest & Mobility', isRestDay: true, restDayGuidance: 'Joint mobility flow and restorative sleep.' },
        { dayIndex: 6, focus: 'Weekly Reset & Rest', isRestDay: true, restDayGuidance: 'Unwind and prepare nutrition for the coming week.' }
      ],
      5: [
        { dayIndex: 0, focus: 'Glutes & Hamstrings Foundations', primary: ['glutes'], secondary: ['hamstrings'], isRestDay: false },
        { dayIndex: 1, focus: 'Back & Postural Upper Tone', primary: ['lats'], secondary: ['triceps', 'shoulders'], isRestDay: false },
        { dayIndex: 2, focus: 'Quads & Glutes Foundations', primary: ['quadriceps'], secondary: ['glutes'], isRestDay: false },
        { dayIndex: 3, focus: 'Rest Day', isRestDay: true, restDayGuidance: 'Complete rest day to allow muscle adaptation.' },
        { dayIndex: 4, focus: 'Shoulders & Core Sculpt', primary: ['shoulders'], secondary: ['abdominals'], isRestDay: false },
        { dayIndex: 5, focus: 'Glute Activation & Calves', primary: ['glutes'], secondary: ['calves', 'hamstrings'], isRestDay: false },
        { dayIndex: 6, focus: 'Rest & Recovery', isRestDay: true, restDayGuidance: 'Deep recovery and tissue repair.' }
      ],
      6: [
        { dayIndex: 0, focus: 'Glutes & Hamstrings A', primary: ['glutes'], secondary: ['hamstrings'], isRestDay: false },
        { dayIndex: 1, focus: 'Upper Tone & Back A', primary: ['lats'], secondary: ['triceps'], isRestDay: false },
        { dayIndex: 2, focus: 'Quads & Hips A', primary: ['quadriceps'], secondary: ['abductors'], isRestDay: false },
        { dayIndex: 3, focus: 'Glutes & Posterior Chain B', primary: ['glutes'], secondary: ['hamstrings'], isRestDay: false },
        { dayIndex: 4, focus: 'Shoulders & Core Sculpt', primary: ['shoulders'], secondary: ['abdominals'], isRestDay: false },
        { dayIndex: 5, focus: 'Lower Body Pump & Calves', primary: ['quadriceps', 'glutes'], secondary: ['calves'], isRestDay: false },
        { dayIndex: 6, focus: 'Complete Rest Day', isRestDay: true, restDayGuidance: 'Rest and recharge.' }
      ]
    },
    intermediate: {
      3: [
        { dayIndex: 0, focus: 'Glutes & Hamstrings (Posterior Chain Focus)', primary: ['glutes'], secondary: ['hamstrings', 'abductors'], isRestDay: false },
        { dayIndex: 1, focus: 'Rest & Active Mobility', isRestDay: true, restDayGuidance: 'Light 20-min walk, hydration, and mobility stretch.' },
        { dayIndex: 2, focus: 'Upper Body Tone & Core (Back, Shoulders & Abs)', primary: ['lats', 'shoulders'], secondary: ['triceps', 'abdominals'], isRestDay: false },
        { dayIndex: 3, focus: 'Rest & Repair', isRestDay: true, restDayGuidance: 'Restorative sleep and muscle repair.' },
        { dayIndex: 4, focus: 'Quads, Glutes & Calves (Lower Sculpt)', primary: ['quadriceps', 'glutes'], secondary: ['calves', 'abductors'], isRestDay: false },
        { dayIndex: 5, focus: 'Rest & Circadian Reset', isRestDay: true, restDayGuidance: 'Outdoor recreation and light movement.' },
        { dayIndex: 6, focus: 'Weekly Reset', isRestDay: true, restDayGuidance: 'Rest and prepare for the upcoming week.' }
      ],
      4: [
        { dayIndex: 0, focus: 'Glutes & Hamstrings (Posterior Chain Focus)', primary: ['glutes'], secondary: ['hamstrings'], isRestDay: false },
        { dayIndex: 1, focus: 'Back & Triceps (Upper Body Sculpt & Posture)', primary: ['lats', 'middle back'], secondary: ['triceps'], isRestDay: false },
        { dayIndex: 2, focus: 'Rest & Active Recovery', isRestDay: true, restDayGuidance: 'Parasympathetic breathwork, hydration, and light stretching.' },
        { dayIndex: 3, focus: 'Quads & Glutes / Hips (Lower Body Shape)', primary: ['quadriceps'], secondary: ['glutes', 'abductors'], isRestDay: false },
        { dayIndex: 4, focus: 'Shoulders & Abdominals (Hourglass Frame & Core)', primary: ['shoulders'], secondary: ['abdominals'], isRestDay: false },
        { dayIndex: 5, focus: 'Active Recovery', isRestDay: true, restDayGuidance: 'Joint mobility flow and restorative sleep.' },
        { dayIndex: 6, focus: 'Rest & Weekly Reset', isRestDay: true, restDayGuidance: 'Unwind and prepare nutrition for the coming week.' }
      ],
      5: [
        { dayIndex: 0, focus: 'Glutes & Hamstrings (Heavy Posterior Chain)', primary: ['glutes'], secondary: ['hamstrings'], isRestDay: false },
        { dayIndex: 1, focus: 'Back & Triceps (Posture & Arm Tone)', primary: ['lats', 'middle back'], secondary: ['triceps'], isRestDay: false },
        { dayIndex: 2, focus: 'Quads & Glutes / Hips (Leg & Hip Drive)', primary: ['quadriceps'], secondary: ['glutes', 'abductors'], isRestDay: false },
        { dayIndex: 3, focus: 'Rest & Glycogen Reset', isRestDay: true, restDayGuidance: 'Rest day to prevent central nervous system fatigue.' },
        { dayIndex: 4, focus: 'Shoulders & Abdominals (Delts & Core Sculpt)', primary: ['shoulders'], secondary: ['abdominals'], isRestDay: false },
        { dayIndex: 5, focus: 'Glute Hypertrophy & Calves (Peak Contraction & Calves)', primary: ['glutes', 'hamstrings'], secondary: ['calves'], isRestDay: false },
        { dayIndex: 6, focus: 'Full Rest & Recovery', isRestDay: true, restDayGuidance: 'Deep recovery and tissue repair.' }
      ],
      6: [
        { dayIndex: 0, focus: 'Glutes & Hamstrings Focus', primary: ['glutes'], secondary: ['hamstrings'], isRestDay: false },
        { dayIndex: 1, focus: 'Back & Triceps Sculpt', primary: ['lats', 'middle back'], secondary: ['triceps'], isRestDay: false },
        { dayIndex: 2, focus: 'Quads & Glutes Drive', primary: ['quadriceps'], secondary: ['glutes', 'abductors'], isRestDay: false },
        { dayIndex: 3, focus: 'Shoulders & Abdominals', primary: ['shoulders'], secondary: ['abdominals'], isRestDay: false },
        { dayIndex: 4, focus: 'Posterior Chain & Glute Pump', primary: ['glutes'], secondary: ['hamstrings', 'calves'], isRestDay: false },
        { dayIndex: 5, focus: 'Full Upper Body Sculpt & Core', primary: ['lats', 'shoulders'], secondary: ['triceps', 'abdominals'], isRestDay: false },
        { dayIndex: 6, focus: 'Complete Rest Day', isRestDay: true, restDayGuidance: 'Full nervous system reset.' }
      ]
    }
  }
};

// Aliases: 'advanced' and 'expert' inherit the targeted 2-muscle architecture with progressive volume
SPLIT_ARCHITECTURES.male.advanced = SPLIT_ARCHITECTURES.male.intermediate;
SPLIT_ARCHITECTURES.female.advanced = SPLIT_ARCHITECTURES.female.intermediate;

/**
 * Resolves target exercise count based on session duration.
 */
function getTargetExerciseCount(durationMinutes) {
  if (durationMinutes <= 20) return 3;
  if (durationMinutes <= 30) return 4;
  if (durationMinutes <= 45) return 5;
  return 6;
}

/**
 * Computes progressive overload sets, reps, and rest periods based on experience and goal.
 */
function getSetsReps(goal, isCompound, experienceLevel) {
  const normLevel = (experienceLevel || 'intermediate').toLowerCase();

  if (normLevel === 'beginner') {
    return {
      setsReps: '3 sets × 10–12 reps',
      restSeconds: 75
    };
  }

  if (normLevel === 'advanced' || normLevel === 'expert') {
    if (goal === 'muscle_gain') {
      return isCompound
        ? { setsReps: '4 sets × 6–8 reps', restSeconds: 100 }
        : { setsReps: '3-4 sets × 10–12 reps', restSeconds: 50 };
    }
    if (goal === 'fat_loss') {
      return isCompound
        ? { setsReps: '3-4 sets × 10–12 reps', restSeconds: 60 }
        : { setsReps: '3 sets × 15–20 reps', restSeconds: 40 };
    }
    // maintenance
    return { setsReps: '3-4 sets × 8–10 reps', restSeconds: 75 };
  }

  // Intermediate (Default)
  if (goal === 'muscle_gain') {
    return isCompound
      ? { setsReps: '3-4 sets × 8–10 reps', restSeconds: 90 }
      : { setsReps: '3 sets × 10–12 reps', restSeconds: 60 };
  }
  if (goal === 'fat_loss') {
    return isCompound
      ? { setsReps: '3 sets × 12–15 reps', restSeconds: 60 }
      : { setsReps: '3 sets × 15 reps', restSeconds: 45 };
  }
  return { setsReps: '3 sets × 10–12 reps', restSeconds: 60 };
}

/**
 * Formats full image URL from dataset relative image path.
 */
function resolveImageUrl(imageRelativePath) {
  if (!imageRelativePath || typeof imageRelativePath !== 'string') return null;
  return `${IMAGE_BASE_URL}${imageRelativePath.trim()}`;
}

/**
 * Filters the real exercise repository based on training environment, difficulty, and equipment.
 */
function filterCandidateExercises(allExercises, environment, experienceLevel) {
  const normEnv = environment ? environment.toLowerCase() : 'home';
  const normLevel = experienceLevel ? experienceLevel.toLowerCase() : 'intermediate';

  return allExercises.filter(ex => {
    // 1. Environment and equipment matching
    if (normEnv === 'home') {
      // Home workouts allow bodyweight, bands, and equipment:null bodyweight movements
      const homeAllowed = ['body only', 'bands', null];
      if (!homeAllowed.includes(ex.equipment)) {
        return false;
      }
    } else {
      // Gym workouts allow gym gear and bodyweight
      const gymAllowed = ['barbell', 'dumbbell', 'cable', 'machine', 'body only', 'e-z curl bar', 'kettlebells', null];
      if (!gymAllowed.includes(ex.equipment)) {
        return false;
      }
    }

    // 2. Experience level matching
    if (normLevel === 'beginner') {
      if (ex.level === 'expert') return false;
    }

    // 3. Category matching (exclude cardio from lifting routines)
    if (ex.category === 'cardio') {
      return false;
    }

    return true;
  });
}

/**
 * Finds candidate exercises for a given set of target muscles from the candidate pool.
 * Evaluates primary muscles first, then secondary muscles if needed.
 */
function findMatchingExercises(pool, targetMuscles, excludeIds = new Set()) {
  const primaryMatches = pool.filter(ex =>
    !excludeIds.has(ex.id) && targetMuscles.some(m => ex.primaryMuscles.includes(m))
  );

  if (primaryMatches.length > 0) {
    return primaryMatches;
  }

  // Fallback to secondary muscles
  return pool.filter(ex =>
    !excludeIds.has(ex.id) && targetMuscles.some(m => ex.secondaryMuscles && ex.secondaryMuscles.includes(m))
  );
}

/**
 * Generates a complete 7-day workout schedule deterministically from real exercise data.
 * 
 * @param {object} params
 * @param {string} [params.gender='male'] - 'male' | 'female'
 * @param {string} [params.environment='home'] - 'home' | 'gym'
 * @param {number} [params.durationMinutes=45] - 20, 30, 45, 60
 * @param {number} [params.weeklyFrequencyDays=4] - 3, 4, 5, 6
 * @param {string} [params.experienceLevel='intermediate'] - 'beginner' | 'intermediate' | 'advanced' | 'expert'
 * @param {string} [params.goal='muscle_gain'] - 'muscle_gain' | 'fat_loss' | 'maintenance'
 * @returns {Array<object>} 7-day WorkoutDay array.
 */
export function generateWorkoutSchedule(params = {}) {
  const gender = params.gender === 'female' ? 'female' : 'male';
  const environment = params.environment === 'gym' ? 'gym' : 'home';
  const durationMinutes = Number(params.durationMinutes) || 45;
  const weeklyFrequency = [3, 4, 5, 6].includes(Number(params.weeklyFrequencyDays))
    ? Number(params.weeklyFrequencyDays)
    : 4;
  const rawLevel = (params.experienceLevel || 'intermediate').toLowerCase();
  const experienceLevel = ['advanced', 'expert'].includes(rawLevel)
    ? 'advanced'
    : rawLevel === 'beginner'
    ? 'beginner'
    : 'intermediate';
  const goal = params.goal || 'muscle_gain';

  exerciseRepository.ensureLoaded();
  const allExercises = exerciseRepository.getAll();
  const candidatePool = filterCandidateExercises(allExercises, environment, experienceLevel);

  const genderTemplates = SPLIT_ARCHITECTURES[gender] || SPLIT_ARCHITECTURES.male;
  const levelTemplates = genderTemplates[experienceLevel] || genderTemplates.intermediate;
  const splitTemplate = levelTemplates[weeklyFrequency] || levelTemplates[4];

  const targetExerciseCount = getTargetExerciseCount(durationMinutes);

  // Track used exercise IDs across the week to maximize movement variety
  const usedExerciseIds = new Set();

  return splitTemplate.map((dayTemplate, dayIdx) => {
    const dayNumber = dayIdx + 1;
    const dayName = DAYS_OF_WEEK[dayIdx];

    if (dayTemplate.isRestDay) {
      return {
        dayNumber,
        dayName,
        focus: dayTemplate.focus,
        isRestDay: true,
        estimatedMinutes: 0,
        exercises: [],
        restDayGuidance: dayTemplate.restDayGuidance
      };
    }

    const dayRawExercises = [];
    const dayExerciseIds = new Set();
    const primaryMuscles = dayTemplate.primary || ['chest'];
    const secondaryMuscles = dayTemplate.secondary || ['triceps'];

    // For 2-muscle targeted days (Intermediate/Advanced):
    // Allocate ~60% to primary group (compounds first) and ~40% to secondary group (isolation/pump)
    let primaryTargetCount = 3;
    let secondaryTargetCount = 2;

    if (targetExerciseCount <= 3) {
      primaryTargetCount = 2;
      secondaryTargetCount = 1;
    } else if (targetExerciseCount === 4) {
      primaryTargetCount = 2;
      secondaryTargetCount = 2;
    } else if (targetExerciseCount === 5) {
      primaryTargetCount = 3;
      secondaryTargetCount = 2;
    } else if (targetExerciseCount >= 6) {
      primaryTargetCount = 3;
      secondaryTargetCount = 3;
    }

    // 1. Pick Primary Muscle Exercises (prefer compound movements)
    const primaryMatches = findMatchingExercises(candidatePool, primaryMuscles, usedExerciseIds);
    // Sort compounds first for primary group
    const sortedPrimary = [...primaryMatches].sort((a, b) => {
      if (a.mechanic === 'compound' && b.mechanic !== 'compound') return -1;
      if (b.mechanic === 'compound' && a.mechanic !== 'compound') return 1;
      return 0;
    });

    let pIdx = 0;
    while (dayRawExercises.length < primaryTargetCount && pIdx < sortedPrimary.length) {
      const selected = sortedPrimary[(dayIdx * 2 + pIdx) % sortedPrimary.length];
      if (!dayExerciseIds.has(selected.id)) {
        dayRawExercises.push(selected);
        dayExerciseIds.add(selected.id);
        usedExerciseIds.add(selected.id);
      }
      pIdx++;
    }

    // 2. Pick Secondary Muscle Exercises (isolation / targeted accessory)
    const secondaryMatches = findMatchingExercises(candidatePool, secondaryMuscles, usedExerciseIds);
    let sIdx = 0;
    while (dayRawExercises.length < targetExerciseCount && sIdx < secondaryMatches.length) {
      const selected = secondaryMatches[(dayIdx * 2 + sIdx) % secondaryMatches.length];
      if (!dayExerciseIds.has(selected.id)) {
        dayRawExercises.push(selected);
        dayExerciseIds.add(selected.id);
        usedExerciseIds.add(selected.id);
      }
      sIdx++;
    }

    // 3. Fallback: if either group had insufficient unique exercises, fill remainder from combined pool
    if (dayRawExercises.length < targetExerciseCount) {
      const combinedMuscles = [...primaryMuscles, ...secondaryMuscles];
      const fallbackMatches = findMatchingExercises(candidatePool, combinedMuscles, dayExerciseIds);
      let fIdx = 0;
      while (dayRawExercises.length < targetExerciseCount && fIdx < fallbackMatches.length) {
        const selected = fallbackMatches[fIdx % fallbackMatches.length];
        if (!dayExerciseIds.has(selected.id)) {
          dayRawExercises.push(selected);
          dayExerciseIds.add(selected.id);
          usedExerciseIds.add(selected.id);
        }
        fIdx++;
      }
    }

    // 4. Select unique alternative for each exercise that is:
    // - NOT in dayExerciseIds (cannot be an exercise already scheduled today)
    // - NOT already assigned as an alternative to another exercise on this day (usedAltIdsInDay)
    // - Prefers candidate exercises with valid images
    const usedAltIdsInDay = new Set();
    const dayExercises = dayRawExercises.map(rawEx => {
      let altEx = candidatePool.find(c =>
        c.id !== rawEx.id &&
        !dayExerciseIds.has(c.id) &&
        !usedAltIdsInDay.has(c.id) &&
        rawEx.primaryMuscles.some(m => c.primaryMuscles.includes(m)) &&
        c.images && c.images.length > 0
      );

      if (!altEx) {
        altEx = candidatePool.find(c =>
          c.id !== rawEx.id &&
          !dayExerciseIds.has(c.id) &&
          !usedAltIdsInDay.has(c.id) &&
          (c.images && c.images.length > 0)
        );
      }

      if (!altEx) {
        altEx = candidatePool.find(c =>
          c.id !== rawEx.id &&
          !dayExerciseIds.has(c.id)
        );
      }

      if (altEx) {
        usedAltIdsInDay.add(altEx.id);
      }

      return buildExerciseRecord(rawEx, altEx, goal, experienceLevel, environment);
    });

    return {
      dayNumber,
      dayName,
      focus: dayTemplate.focus,
      isRestDay: false,
      estimatedMinutes: durationMinutes,
      exercises: dayExercises
    };
  });
}

/**
 * Builds a formatted exercise object with alternatives, thumbnail URLs, and sets/reps.
 */
function buildExerciseRecord(selectedEx, altEx, goal, experienceLevel, environment) {
  const isCompound = selectedEx.mechanic === 'compound';
  const { setsReps, restSeconds } = getSetsReps(goal, isCompound, experienceLevel);

  const mainThumbnailUrl = selectedEx.images && selectedEx.images.length > 0
    ? resolveImageUrl(selectedEx.images[0])
    : null;

  const altThumbnailUrl = altEx && altEx.images && altEx.images.length > 0
    ? resolveImageUrl(altEx.images[0])
    : (mainThumbnailUrl || null);

  const primaryMuscleLabel = selectedEx.primaryMuscles && selectedEx.primaryMuscles.length > 0
    ? selectedEx.primaryMuscles.join(', ')
    : 'Full Body';

  const altPrimaryMuscleLabel = altEx && altEx.primaryMuscles && altEx.primaryMuscles.length > 0
    ? altEx.primaryMuscles.join(', ')
    : primaryMuscleLabel;

  return {
    id: selectedEx.id,
    name: selectedEx.name,
    targetMuscle: primaryMuscleLabel,
    setsReps,
    restSeconds,
    environment: environment === 'home' ? 'home' : 'gym',
    equipment: selectedEx.equipment || 'body only',
    thumbnailUrl: mainThumbnailUrl,
    instructions: Array.isArray(selectedEx.instructions) ? selectedEx.instructions : [],
    commonMistakes: [
      'Rushing through the eccentric (lowering) phase without control.',
      'Compromising full range of motion to chase higher load or reps.'
    ],
    alternative: altEx
      ? {
          id: altEx.id,
          name: altEx.name,
          targetMuscle: altPrimaryMuscleLabel,
          environment: environment === 'home' ? 'home' : 'gym',
          equipment: altEx.equipment || 'body only',
          note: `Substitutes directly for ${selectedEx.name} targeting ${altPrimaryMuscleLabel}.`,
          thumbnailUrl: altThumbnailUrl,
          instructions: Array.isArray(altEx.instructions) && altEx.instructions.length > 0
            ? altEx.instructions
            : [
                `Perform ${altEx.name} targeting ${altPrimaryMuscleLabel} with controlled cadence.`,
                'Breathe rhythmically and maintain strict joint alignment throughout.'
              ],
          commonMistakes: [
            'Rushing through the eccentric (lowering) phase without control.',
            'Compromising full range of motion to chase higher load or reps.'
          ]
        }
      : {
          id: `${selectedEx.id}-alt`,
          name: `${selectedEx.name} (Slow Tempo Variation)`,
          targetMuscle: primaryMuscleLabel,
          environment: environment === 'home' ? 'home' : 'gym',
          equipment: selectedEx.equipment || 'body only',
          note: '3-second negative eccentric tempo variation.',
          thumbnailUrl: mainThumbnailUrl,
          instructions: Array.isArray(selectedEx.instructions) ? selectedEx.instructions : [],
          commonMistakes: [
            'Rushing through the eccentric (lowering) phase without control.',
            'Compromising full range of motion to chase higher load or reps.'
          ]
        }
  };
}

export default generateWorkoutSchedule;
