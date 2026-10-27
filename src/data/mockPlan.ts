import {
  OnboardingData,
  WorkoutDay,
  Meal,
  GroceryItem,
  SupplementRecommendation,
  RecoveryGuidance,
  ScheduleEvent,
  TrainingEnvironment,
  Exercise
} from '../types';

export const defaultOnboardingData: OnboardingData = {
  personal: {
    name: 'Aarav',
    age: 26,
    gender: 'male',
    heightCm: 175,
    weightKg: 68,
    goal: 'muscle_gain',
  },
  rhythm: {
    occupation: 'working_professional',
    departureTime: '08:45',
    returnTime: '18:30',
    sleepHours: 7.5,
    wakeUpTime: '06:45',
    activityLevel: 'moderately_active',
  },
  training: {
    environment: 'home',
    durationMinutes: 45,
    preferredTime: 'morning',
    weeklyFrequencyDays: 4,
    experienceLevel: 'intermediate',
    homeEquipment: ['dumbbells', 'resistance_bands', 'yoga_mat'],
    gymEquipmentLevel: 'full_gym',
  },
  food: {
    dietType: 'pure_veg',
    cookingSituation: 'self_cooking',
    mealsPerDay: 4,
    avoidedFoods: [],
    allergies: [],
    indianFoodStyle: 'simple_homestyle',
  },
  budget: {
    tier: 'budget',
    dailyBudgetRupees: 65,
  },
  supplements: {
    preference: 'no_supplements',
  },
};

// Rich exercise database with paired Home/Gym alternatives
export const gymExercises: Exercise[] = [
  {
    id: 'gym-bench-press',
    name: 'Barbell Flat Bench Press',
    targetMuscle: 'Chest & Triceps',
    setsReps: '3 sets × 8–10 reps',
    restSeconds: 90,
    environment: 'gym',
    equipment: 'Barbell & Flat Bench',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    instructions: [
      'Lie flat on the bench with feet firmly pressed into the floor.',
      'Grip the bar slightly wider than shoulder width with wrapped thumbs.',
      'Lower the bar under control to mid-chest while keeping elbows at a 45-degree angle.',
      'Drive the barbell upward smoothly without bouncing off the chest.'
    ],
    commonMistakes: [
      'Flaring elbows out at 90 degrees (strains rotator cuffs)',
      'Bouncing the bar aggressively off the sternum',
      'Lifting hips and lower back off the bench'
    ],
    alternative: {
      id: 'home-pushups-deficit',
      name: 'Tempo Push-Ups / Floor DB Press',
      environment: 'home',
      equipment: 'Bodyweight or Dumbbells',
      note: 'Ideal bodyweight chest movement maintaining progressive overload via tempo.'
    }
  },
  {
    id: 'gym-lat-pulldown',
    name: 'Wide-Grip Lat Pulldown',
    targetMuscle: 'Upper Back & Lats',
    setsReps: '3 sets × 10–12 reps',
    restSeconds: 75,
    environment: 'gym',
    equipment: 'Cable Machine',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    instructions: [
      'Sit comfortably with thigh pads snugly adjusted.',
      'Grasp the bar with hands wider than shoulders, palms facing away.',
      'Retract your shoulder blades and pull the bar down toward your upper chest.',
      'Squeeze your lats at the bottom before controlling the eccentric return.'
    ],
    commonMistakes: [
      'Swinging your torso excessively backward to create momentum',
      'Pulling behind the neck (increases cervical spine strain)',
      'Using primarily forearm biceps instead of back muscles'
    ],
    alternative: {
      id: 'home-resistance-pulldown',
      name: 'Doorway Band Pulldown / Pull-ups',
      environment: 'home',
      equipment: 'Resistance Bands or Pull-up Bar',
      note: 'Engages lats with continuous band tension or standard pull-up progressions.'
    }
  },
  {
    id: 'gym-barbell-squat',
    name: 'Barbell Back Squat',
    targetMuscle: 'Quadriceps, Glutes & Core',
    setsReps: '3 sets × 8–10 reps',
    restSeconds: 120,
    environment: 'gym',
    equipment: 'Squat Rack & Barbell',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
    instructions: [
      'Rest the bar across your upper trapezius, feet shoulder-width apart.',
      'Brace your core, hinge your hips, and bend knees simultaneously.',
      'Descend until thighs are parallel with the floor or comfortable depth.',
      'Drive through the midfoot to return to the starting upright position.'
    ],
    commonMistakes: [
      'Knees caving inward during ascent',
      'Shifting weight onto toes and lifting heels',
      'Rounding the lower back in deep flexion'
    ],
    alternative: {
      id: 'home-goblet-squat',
      name: 'Goblet Squat or Bodyweight Pause Squats',
      environment: 'home',
      equipment: 'Dumbbell or Backpack',
      note: 'Allows deeper hip drive and spine stability with minimal home equipment.'
    }
  },
  {
    id: 'gym-seated-cable-row',
    name: 'Seated Cable Row',
    targetMuscle: 'Mid-Back & Rhomboids',
    setsReps: '3 sets × 10–12 reps',
    restSeconds: 60,
    environment: 'gym',
    equipment: 'Cable Row Station',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    instructions: [
      'Sit with knees slightly bent, grasping the V-handle or straight bar.',
      'Keep back neutral and pull the handle toward your lower ribcage.',
      'Pinch shoulder blades together firmly at peak contraction.',
      'Slowly extend arms without rounding your thoracic spine.'
    ],
    commonMistakes: [
      'Rocking back and forth using momentum',
      'Shrugging shoulders into ears',
      'Locking knees out fully straight'
    ],
    alternative: {
      id: 'home-banded-row',
      name: 'Banded Incline Row / DB Single Arm Row',
      environment: 'home',
      equipment: 'Dumbbells or Heavy Loop Band',
      note: 'Isolates unilateral back strength and posture with zero gym machines.'
    }
  },
  {
    id: 'gym-overhead-press',
    name: 'Dumbbell Overhead Shoulder Press',
    targetMuscle: 'Deltoids & Triceps',
    setsReps: '3 sets × 10–12 reps',
    restSeconds: 75,
    environment: 'gym',
    equipment: 'Dumbbells & Upright Bench',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=600&auto=format&fit=crop&q=80',
    instructions: [
      'Sit upright with dumbbells at shoulder height, palms forward.',
      'Press the dumbbells overhead until arms are extended but not locked.',
      'Lower under control to ear height and repeat.'
    ],
    commonMistakes: [
      'Arching lower back excessively',
      'Pressing dumbbells too far forward'
    ],
    alternative: {
      id: 'home-pike-pushups',
      name: 'Pike Push-ups / Banded Shoulder Press',
      environment: 'home',
      equipment: 'Bodyweight or Resistance Bands',
      note: 'Excellent vertical pressing stimulus using bodyweight leverage.'
    }
  }
];

export const homeExercises: Exercise[] = [
  {
    id: 'home-pushups-deficit',
    name: 'Controlled Tempo Push-Ups',
    targetMuscle: 'Chest, Shoulders & Triceps',
    setsReps: '3 sets × 12–15 reps',
    restSeconds: 60,
    environment: 'home',
    equipment: 'Yoga Mat (Optional books for deficit)',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80',
    instructions: [
      'Place hands slightly wider than shoulders on floor or elevated books.',
      'Keep core braced, body in a strict straight plank line from heels to crown.',
      'Lower chest down over 3 seconds until 1 inch off the ground.',
      'Push firmly back up in 1 second while maintaining plank tension.'
    ],
    commonMistakes: [
      'Sagging hips or piking buttocks into the air',
      'Flaring elbows out perpendicular to torso',
      'Rushing repetitions without controlling the negative phase'
    ],
    alternative: {
      id: 'gym-bench-press',
      name: 'Barbell Flat Bench Press',
      environment: 'gym',
      equipment: 'Barbell & Bench',
      note: 'Gym equivalent allowing targeted load increments.'
    }
  },
  {
    id: 'home-resistance-pulldown',
    name: 'Doorway Resistance Band Lat Pulldown',
    targetMuscle: 'Lats & Upper Back',
    setsReps: '3 sets × 12–15 reps',
    restSeconds: 60,
    environment: 'home',
    equipment: 'Resistance Band (Door Anchor or Top Hinge)',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop&q=80',
    instructions: [
      'Anchor band securely above door or around a high sturdy bar.',
      'Kneel tall, hold both ends of the band with arms extended.',
      'Pull elbows down and slightly back toward your ribcage.',
      'Feel the contraction in your wing muscles (lats), pause 1s, then return slowly.'
    ],
    commonMistakes: [
      'Standing too close or losing band tension at the top',
      'Bending at the waist instead of moving at the shoulder joint'
    ],
    alternative: {
      id: 'gym-lat-pulldown',
      name: 'Wide-Grip Lat Pulldown',
      environment: 'gym',
      equipment: 'Cable Machine',
      note: 'Gym version with fixed adjustable pin resistance.'
    }
  },
  {
    id: 'home-goblet-squat',
    name: 'Dumbbell / Water-Jug Goblet Squat',
    targetMuscle: 'Quadriceps, Glutes & Adductors',
    setsReps: '3 sets × 12–15 reps',
    restSeconds: 75,
    environment: 'home',
    equipment: 'Single Dumbbell or 5L Water Bottle',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&auto=format&fit=crop&q=80',
    instructions: [
      'Hold weight vertically against your chest with both hands under the top.',
      'Set feet shoulder-width apart, toes pointing slightly outward (15–30°).',
      'Squat down between your thighs while keeping your chest upright and spine tall.',
      'Drive through your heels and midfoot back to standing.'
    ],
    commonMistakes: [
      'Letting the weight pull your upper body forward',
      'Knees collapsing inwards',
      'Heels lifting off the ground'
    ],
    alternative: {
      id: 'gym-barbell-squat',
      name: 'Barbell Back Squat',
      environment: 'gym',
      equipment: 'Squat Rack & Barbell',
      note: 'Allows maximal progressive overload in a commercial gym.'
    }
  },
  {
    id: 'home-banded-row',
    name: 'Banded Seated Row or DB Single Arm Row',
    targetMuscle: 'Rhomboids, Lats & Rear Delts',
    setsReps: '3 sets × 12–14 reps',
    restSeconds: 60,
    environment: 'home',
    equipment: 'Loop Band or Dumbbell / Chair',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80',
    instructions: [
      'Loop the band around your feet while seated with straight legs.',
      'Sit tall with chest high and shoulders depressed.',
      'Pull the bands toward your belly button, squeezing your shoulder blades together.',
      'Control the release without letting your upper back hunch forward.'
    ],
    commonMistakes: [
      'Slouching the lumbar spine',
      'Using forearm jerks rather than squeezing the shoulder blades'
    ],
    alternative: {
      id: 'gym-seated-cable-row',
      name: 'Seated Cable Row',
      environment: 'gym',
      equipment: 'Cable Row Station',
      note: 'Commercial gym station with smooth dual pulley mechanics.'
    }
  },
  {
    id: 'home-pike-pushups',
    name: 'Pike Push-ups (Elevated Angle)',
    targetMuscle: 'Anterior & Lateral Deltoids',
    setsReps: '3 sets × 8–10 reps',
    restSeconds: 75,
    environment: 'home',
    equipment: 'Floor / Chair or Sturdy Bed edge',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
    instructions: [
      'Begin in a downward dog or pushup position with hips high in an inverted V.',
      'Look toward your feet and lower the top of your head forward in a tripod shape.',
      'Press the floor away aggressively back to the high hip position.'
    ],
    commonMistakes: [
      'Lowering the head straight down between hands instead of forward',
      'Flaring elbows outward'
    ],
    alternative: {
      id: 'gym-overhead-press',
      name: 'Dumbbell Overhead Shoulder Press',
      environment: 'gym',
      equipment: 'Dumbbells & Bench',
      note: 'Gym seated press removing core balancing requirements.'
    }
  }
];

export const lateTiredExercises: Exercise[] = [
  {
    id: 'tired-cat-cow',
    name: 'Gentle Cat-Cow Spinal Wave',
    targetMuscle: 'Spine, Neck & Core',
    setsReps: '2 sets × 8 gentle cycles',
    restSeconds: 30,
    environment: 'both',
    equipment: 'Yoga Mat or Carpet',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    instructions: [
      'Begin on hands and knees with wrists under shoulders and knees under hips.',
      'Inhale: softly drop your belly toward the mat, look gently forward (Cow).',
      'Exhale: draw your navel toward your spine, tuck your chin, round your back (Cat).',
      'Move fluidly with your natural breathing tempo.'
    ],
    commonMistakes: ['Rushing the breath', 'Forcing the neck backward'],
    alternative: {
      id: 'tired-child-pose',
      name: 'Extended Balasana (Child’s Pose)',
      environment: 'both',
      equipment: 'Mat',
      note: 'Deeply relaxing passive hip and lumbar decompression.'
    }
  },
  {
    id: 'tired-glute-bridge',
    name: 'Isometric Glute Bridge Holds',
    targetMuscle: 'Glutes, Lower Back & Hamstrings',
    setsReps: '2 sets × 30-sec easy holds',
    restSeconds: 30,
    environment: 'both',
    equipment: 'Mat or Bed',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    instructions: [
      'Lie flat on your back with knees bent and feet flat on the floor.',
      'Gently raise hips until thighs and torso align smoothly.',
      'Hold at the top without hyper-arching your lower back.',
      'Lower down slowly and rest.'
    ],
    commonMistakes: ['Pushing into the neck or hyperextending'],
    alternative: {
      id: 'tired-legs-wall',
      name: 'Viparita Karani (Legs Up The Wall)',
      environment: 'both',
      equipment: 'Wall',
      note: 'Lymphatic drainage and parasympathetic nervous system reboot.'
    }
  },
  {
    id: 'tired-doorframe-stretch',
    name: 'Standing Doorway Pec & Posture Release',
    targetMuscle: 'Chest, Anterior Delts & Desk Posture',
    setsReps: '2 sets × 45 seconds each side',
    restSeconds: 20,
    environment: 'both',
    equipment: 'Any Standard Doorframe',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
    instructions: [
      'Place your forearm against the door frame at a 90-degree angle.',
      'Take a small step forward with one leg until you feel a comfortable stretch across the chest.',
      'Breathe deeply into your diaphragm, releasing workday tension.'
    ],
    commonMistakes: ['Twisting the lower back instead of feeling the chest stretch'],
    alternative: {
      id: 'tired-shoulder-rolls',
      name: 'Seated Shoulder Rolls & Chin Tucks',
      environment: 'both',
      equipment: 'None',
      note: 'Relieves upper neck stiffness from screen hours.'
    }
  }
];

// Indian food meal database adapted for budgets & dietary preferences
export const generateMockMeals = (diet: string, _budgetTier: string): Meal[] => {
  if (diet === 'non_veg') {
    return [
      {
        id: 'meal-1',
        mealType: 'breakfast',
        title: 'Masala Boiled Eggs & Whole Wheat Toast / Besan Chilla',
        description: '3 Boiled eggs lightly tossed in cumin & chaat masala with 2 toasted phulkas/brown bread and a cup of ginger tea.',
        ingredients: ['3 Eggs', '2 Whole Wheat Roti/Toast', '1/2 tsp Cumin & Chaat Masala', 'Fresh Mint Chutney'],
        approxProteinG: 22,
        estCalories: 380,
        approxCostRupees: 28,
        prepTimeMinutes: 10,
        cookingTip: 'Boil eggs the previous night to save time on busy mornings.',
        alternatives: [
          {
            id: 'alt-b1',
            name: 'High-Protein Paneer Bhurji with 2 Rotis',
            description: '100g fresh crushed paneer sautéed with onions, green chillies and turmeric.',
            approxProteinG: 20,
            estCalories: 410,
            approxCostRupees: 42,
            ingredients: ['100g Paneer', '2 Phulkas', 'Onions & Tomatoes', '1 tsp Ghee'],
            prepTimeMinutes: 12
          },
          {
            id: 'alt-b2',
            name: 'Sprouted Moong & Roasted Chana Chaat',
            description: '1 cup steamed sprouts with lemon, chopped coriander and roasted black chickpeas.',
            approxProteinG: 16,
            estCalories: 310,
            approxCostRupees: 18,
            ingredients: ['100g Sprouted Moong', '30g Roasted Chana', 'Lemon juice', 'Himalayan salt'],
            prepTimeMinutes: 5
          }
        ]
      },
      {
        id: 'meal-2',
        mealType: 'lunch',
        title: 'Homestyle Chicken Curry / Egg Curry with Rice & Cucumber Curd',
        description: 'Tender chicken pieces cooked in a simple onion-tomato gravy, served with 1 bowl of steamed rice and cooling curd.',
        ingredients: ['150g Chicken breast or thigh', '1 cup Steamed rice (approx 70g dry)', '100g Curd (Dahi)', 'Salad greens'],
        approxProteinG: 34,
        estCalories: 520,
        approxCostRupees: 55,
        prepTimeMinutes: 25,
        cookingTip: 'Use minimal cooking oil (1 tsp mustard or groundnut oil) to keep fats moderate.',
        alternatives: [
          {
            id: 'alt-l1',
            name: 'Kala Chana Curry with 2 Phulkas & Curd',
            description: 'High-fiber black chickpeas slow-simmered in ginger-garlic broth.',
            approxProteinG: 21,
            estCalories: 460,
            approxCostRupees: 26,
            ingredients: ['100g Boiled Kala Chana', '2 Rotis', '100g Curd', 'Green salad'],
            prepTimeMinutes: 20
          },
          {
            id: 'alt-l2',
            name: 'Double Egg Bhurji Curry with Jeera Rice',
            description: 'Speedy egg curry in a lightly spiced gravy over aromatic cumin rice.',
            approxProteinG: 24,
            estCalories: 480,
            approxCostRupees: 32,
            ingredients: ['3 Eggs', '1 cup Rice', 'Spices & Tomatoes', '1 tsp Ghee'],
            prepTimeMinutes: 15
          }
        ]
      },
      {
        id: 'meal-3',
        mealType: 'pre_workout',
        title: 'Banana & Roasted Kala Chana with Black Coffee / Warm Water',
        description: 'A pocket-friendly, fast-digesting carb boost paired with natural clean caffeine for sustained workout stamina.',
        ingredients: ['1 Medium Ripe Banana', '30g Bhuna Chana (Roasted Bengal Gram)', 'Black Coffee / Warm Water'],
        approxProteinG: 7,
        estCalories: 190,
        approxCostRupees: 12,
        prepTimeMinutes: 2,
        cookingTip: 'Eat 30–45 minutes before starting your workout to avoid sluggishness.',
        alternatives: [
          {
            id: 'alt-pre1',
            name: '1 Slice Peanut Butter Roti',
            description: '1 warm roti spread with 1 tbsp unsweetened peanut butter.',
            approxProteinG: 8,
            estCalories: 210,
            approxCostRupees: 15,
            ingredients: ['1 Whole wheat roti', '1 tbsp Peanut butter'],
            prepTimeMinutes: 3
          }
        ]
      },
      {
        id: 'meal-4',
        mealType: 'dinner',
        title: 'Moong Dal Tadka, 2 Phulkas & Soya Chunk Stir-Fry',
        description: 'Light, gut-friendly dinner combining soothing yellow moong dal with pan-toasted soya chunks for complete amino acids.',
        ingredients: ['40g Soya chunks (boiled & squeezed)', '1 bowl Yellow Moong Dal', '2 Whole wheat phulkas', 'Grated beetroot salad'],
        approxProteinG: 28,
        estCalories: 440,
        approxCostRupees: 24,
        prepTimeMinutes: 18,
        cookingTip: 'Soak soya chunks in warm salted water for 8 minutes and squeeze thoroughly before tossing.',
        alternatives: [
          {
            id: 'alt-d1',
            name: 'Paneer Capsicum Bhurji with Dal Khichdi',
            description: 'Wholesome comforting khichdi topped with crumbled cottage cheese.',
            approxProteinG: 22,
            estCalories: 460,
            approxCostRupees: 38,
            ingredients: ['75g Paneer', 'Moong Dal & Rice', 'Bell pepper', 'Pinch of Asafoetida'],
            prepTimeMinutes: 20
          }
        ]
      }
    ];
  }

  // Pure veg default
  return [
    {
      id: 'meal-1',
      mealType: 'breakfast',
      title: 'Bihar Sattu Buttermilk Shake & Sprouted Moong Chaat',
      description: 'Traditional roasted gram flour (Chana Sattu) whipped into salted mint chaas, paired with fresh sprouted green lentils.',
      ingredients: ['40g Roasted Chana Sattu', '200ml Fresh Curd Chaas', '50g Sprouted Moong', 'Black salt & roasted jeera'],
      approxProteinG: 21,
      estCalories: 360,
      approxCostRupees: 22,
      prepTimeMinutes: 6,
      cookingTip: 'Whisk sattu with room temperature water first to prevent lumps, then fold into cool salted chaas.',
      alternatives: [
        {
          id: 'alt-b1',
          name: 'Besan & Paneer Chilla (Savory Gram Crepe)',
          description: 'High-protein chickpea flour crepe stuffed with 50g grated paneer and coriander.',
          approxProteinG: 19,
          estCalories: 380,
          approxCostRupees: 32,
          ingredients: ['50g Besan (Gram flour)', '50g Paneer', 'Onion & Green chillies', 'Mint chutney'],
          prepTimeMinutes: 12
        },
        {
          id: 'alt-b2',
          name: 'Oats & Milk Porridge with Crushed Peanuts',
          description: 'Warm cooked rolled oats in 250ml toned milk with a handful of roasted peanuts.',
          approxProteinG: 17,
          estCalories: 390,
          approxCostRupees: 25,
          ingredients: ['50g Oats', '250ml Toned Milk', '15g Roasted Peanuts', 'Dash of cinnamon'],
          prepTimeMinutes: 8
        }
      ]
    },
    {
      id: 'meal-2',
      mealType: 'lunch',
      title: 'Kala Chana Curry with 2 Phulkas, Curd & Spiced Salad',
      description: 'Slow-simmered black chickpea curry in a light ginger-cumin gravy, served with hand-rolled wheat rotis and fresh dahi.',
      ingredients: ['80g Dry Kala Chana (boiled)', '2 Phulkas (Whole wheat)', '100g Fresh Dahi (Curd)', 'Cucumber & Tomato slices'],
      approxProteinG: 24,
      estCalories: 490,
      approxCostRupees: 26,
      prepTimeMinutes: 20,
      cookingTip: 'Soak kala chana overnight for easy cooking and optimal mineral bioavailability.',
      alternatives: [
        {
          id: 'alt-l1',
          name: 'Rajma Masala with Brown/White Rice & Curd',
          description: 'Classic red kidney bean curry with steamed jeera rice and soothing curd.',
          approxProteinG: 22,
          estCalories: 510,
          approxCostRupees: 30,
          ingredients: ['80g Rajma (Kidney beans)', '1 cup Rice', '100g Curd', 'Ginger-garlic gravy'],
          prepTimeMinutes: 25
        },
        {
          id: 'alt-l2',
          name: 'Paneer Bhurji & Toor Dal with 2 Rotis',
          description: 'Cottage cheese scrambled with peas and tomatoes alongside yellow pigeon-pea dal.',
          approxProteinG: 26,
          estCalories: 530,
          approxCostRupees: 45,
          ingredients: ['80g Paneer', '1 cup Toor Dal', '2 Phulkas', 'Green coriander'],
          prepTimeMinutes: 18
        }
      ]
    },
    {
      id: 'meal-3',
      mealType: 'pre_workout',
      title: '1 Banana & Handful of Roasted Peanuts / Chana',
      description: 'Quick-release clean carbohydrates from banana balanced with long-lasting healthy fats from dry roasted peanuts.',
      ingredients: ['1 Ripe Banana', '25g Dry Roasted Peanuts or Bhuna Chana', 'Warm water with lemon'],
      approxProteinG: 7,
      estCalories: 210,
      approxCostRupees: 10,
      prepTimeMinutes: 2,
      cookingTip: 'Keeps blood sugar stable during heavy sets without causing stomach cramps.',
      alternatives: [
        {
          id: 'alt-p1',
          name: 'Gur & Chana (Jaggery & Roasted Gram)',
          description: 'Timeless Indian pre-workout fuel offering instant iron and glycogen support.',
          approxProteinG: 6,
          estCalories: 180,
          approxCostRupees: 8,
          ingredients: ['15g Pure Jaggery (Gur)', '30g Roasted Chana'],
          prepTimeMinutes: 1
        }
      ]
    },
    {
      id: 'meal-4',
      mealType: 'dinner',
      title: 'Soya Chunks Pulao with Moong Dal & Mint Raita',
      description: 'Flavorful basmati rice cooked with succulent 52% protein soya nuggets, served with gut-friendly yellow moong and curd.',
      ingredients: ['45g Soya Chunks', '60g Rice', '1/2 bowl Moong Dal', '75g Curd with mint', 'Biryani whole spices'],
      approxProteinG: 31,
      estCalories: 480,
      approxCostRupees: 24,
      prepTimeMinutes: 20,
      cookingTip: 'Soya chunks are one of India’s most economical, complete plant protein sources (₹30 for 200g).',
      alternatives: [
        {
          id: 'alt-d1',
          name: 'Moong Dal Khichdi with 100g Curd & Papad',
          description: 'The ultimate restorative Indian dinner, light on digestion before sleep.',
          approxProteinG: 18,
          estCalories: 420,
          approxCostRupees: 20,
          ingredients: ['Yellow Moong & Rice', '100g Curd', '1 tsp Ghee', 'Hing & Jeera'],
          prepTimeMinutes: 15
        },
        {
          id: 'alt-d2',
          name: 'Palak Paneer with 2 Rotis',
          description: 'Iron-rich pureed spinach stew with soft paneer cubes and warm whole wheat rotis.',
          approxProteinG: 23,
          estCalories: 460,
          approxCostRupees: 42,
          ingredients: ['100g Paneer', '200g Fresh Spinach (Palak)', '2 Rotis', 'Garlic & Spices'],
          prepTimeMinutes: 20
        }
      ]
    }
  ];
};

export const mockGroceryList: GroceryItem[] = [
  {
    id: 'g-1',
    name: 'Soya Chunks (Defatted Soy Meal)',
    category: 'Protein Staples',
    estimatedQuantity: '400g (2 packs)',
    approxCostRupees: 65,
    notes: '52g protein per 100g — ₹0.62 per gram of protein'
  },
  {
    id: 'g-2',
    name: 'Kala Chana (Desi Black Chickpeas)',
    category: 'Protein Staples',
    estimatedQuantity: '750g',
    approxCostRupees: 70,
    notes: 'High in soluble fiber & zinc for recovery'
  },
  {
    id: 'g-3',
    name: 'Roasted Chana Sattu Flour',
    category: 'Protein Staples',
    estimatedQuantity: '500g',
    approxCostRupees: 55,
    notes: 'Instant soluble breakfast drink'
  },
  {
    id: 'g-4',
    name: 'Yellow Moong Dal (Split Green Gram)',
    category: 'Protein Staples',
    estimatedQuantity: '500g',
    approxCostRupees: 60,
    notes: 'Easiest pulse on digestion'
  },
  {
    id: 'g-5',
    name: 'Whole Wheat Atta (Chakki Fresh)',
    category: 'Grains & Carbs',
    estimatedQuantity: '2 kg',
    approxCostRupees: 90,
    notes: 'Complex carbs for daily energy'
  },
  {
    id: 'g-6',
    name: 'Brown / Sona Masoori Rice',
    category: 'Grains & Carbs',
    estimatedQuantity: '1.5 kg',
    approxCostRupees: 85,
    notes: 'Clean post-workout carbohydrate source'
  },
  {
    id: 'g-7',
    name: 'Fresh Toned Milk / Curd (Dahi)',
    category: 'Dairy & Fermented',
    estimatedQuantity: '3.5 Litres (Weekly)',
    approxCostRupees: 190,
    notes: 'Natural probiotics, casein protein & calcium'
  },
  {
    id: 'g-8',
    name: 'Fresh Paneer (Cottage Cheese)',
    category: 'Dairy & Fermented',
    estimatedQuantity: '400g',
    approxCostRupees: 140,
    notes: 'Slow-digesting evening protein'
  },
  {
    id: 'g-9',
    name: 'Robusta / Elaichi Bananas',
    category: 'Fruits & Quick Fuel',
    estimatedQuantity: '1 Dozen (12 pcs)',
    approxCostRupees: 60,
    notes: 'Pre-workout potassium & quick carbs'
  },
  {
    id: 'g-10',
    name: 'Spinach (Palak) & Seasonal Sabzi',
    category: 'Vegetables & Greens',
    estimatedQuantity: '1.5 kg assorted',
    approxCostRupees: 80,
    notes: 'Magnesium, iron & dietary roughage'
  },
  {
    id: 'g-11',
    name: 'Cucumbers, Tomatoes & Green Chillies',
    category: 'Vegetables & Greens',
    estimatedQuantity: '1 kg assorted',
    approxCostRupees: 50,
    notes: 'Hydration and digestive enzymes'
  },
  {
    id: 'g-12',
    name: 'Jeera, Haldi & Himalayan Pink Salt',
    category: 'Spices & Pantry Essentials',
    estimatedQuantity: '1 kit (pantry refill)',
    approxCostRupees: 40,
    notes: 'Anti-inflammatory curcumin & electrolytes'
  }
];

export const mockSupplementRecommendations: SupplementRecommendation[] = [
  {
    id: 'supp-1',
    productCategory: 'Strength & Cellular ATP',
    productName: 'Creatine Monohydrate (Creapure / 200 Mesh)',
    whyUseful: 'Increases muscular strength, power output, and cognitive focus during resistance training.',
    estimatedMonthlyCostRupees: 600,
    foodBasedAlternative: 'Found naturally in red meat and fish (3-5g requires ~1kg meat, making low-cost powder highly efficient).',
    recommendedTiming: '3g daily consistently with warm water or buttermilk.',
    cautionNotice: 'Drink at least 2.5–3.5 liters of water daily to support normal cellular hydration.'
  },
  {
    id: 'supp-2',
    productCategory: 'Convenience Protein',
    productName: 'Unflavoured Whey Protein Concentrate (80%)',
    whyUseful: 'Quickly fulfills daily protein target when travelling, working late, or having limited kitchen access.',
    estimatedMonthlyCostRupees: 1600,
    foodBasedAlternative: '200g Sattu + Curd chaas, 100g Paneer, or 4 Egg whites provide equal bioavailable protein at 1/3 the cost.',
    recommendedTiming: 'Within 45 mins post-workout or as a 4 PM desk drink.',
    cautionNotice: 'Supplements are optional convenience; real whole foods remain your dietary foundation.'
  },
  {
    id: 'supp-3',
    productCategory: 'Micronutrient Essential',
    productName: 'Vitamin D3 (60,000 IU monthly or 2,000 IU daily)',
    whyUseful: 'Over 75% of urban Indians are deficient due to indoor desk routines; critical for bone density and testosterone.',
    estimatedMonthlyCostRupees: 120,
    foodBasedAlternative: '15–20 mins of direct morning sun exposure (10 AM to 12 PM) with arms and legs exposed.',
    recommendedTiming: 'Take with a fat-containing meal (like lunch with curd or ghee).',
    cautionNotice: 'Get a 25-OH Vitamin D blood test every 6 months to guide dosage.'
  }
];

export const mockRecoveryGuidance: RecoveryGuidance[] = [
  {
    id: 'rec-1',
    category: 'sleep',
    title: '7–8 Hours of Uninterrupted Sleep',
    tip: 'Growth hormone and muscle protein synthesis peak during slow-wave sleep. Chronic 5-hour nights increase cortisol and slow fat loss.',
    actionableStep: 'Turn off screens 30 minutes before bed or switch devices to night-shift amber mode.'
  },
  {
    id: 'rec-2',
    category: 'hydration',
    title: 'Electrolyte & Water Balance',
    tip: 'Even 2% dehydration drops muscular contraction power by up to 15% and increases perceived exertion.',
    actionableStep: 'Keep a 1-liter steel water bottle at your desk; add a pinch of sendha namak (rock salt) and lemon during hot months.'
  },
  {
    id: 'rec-3',
    category: 'mobility',
    title: 'Desk Decompression',
    tip: 'Sitting for 8+ hours shortens hip flexors and weakens glutes, leading to knee and lower-back discomfort.',
    actionableStep: 'Stand up every 50 minutes for a 2-minute lap or do 10 bodyweight calf raises while waiting for calls.'
  },
  {
    id: 'rec-4',
    category: 'mental',
    title: 'Rest Day Mental Shift',
    tip: 'Rest days are when your body rebuilds stronger—not a sign of laziness or lost momentum.',
    actionableStep: 'Take a relaxed 25-minute evening stroll or spend time on a non-fitness hobby.'
  }
];

// Helper to generate schedule based on user's daily rhythm
export const generateDailySchedule = (user: OnboardingData): ScheduleEvent[] => {
  const wakeTime = user.rhythm.wakeUpTime || '06:30';
  const depTime = user.rhythm.departureTime || '08:30';
  const retTime = user.rhythm.returnTime || '18:30';

  const isMorningWorkout = user.training.preferredTime === 'morning';

  const events: ScheduleEvent[] = [
    {
      id: 'sch-1',
      time: wakeTime,
      title: 'Wake Up & Hydrate',
      type: 'recovery',
      description: 'Drink 400ml room temperature water. Light 2-min joint rotations.',
      duration: '15m'
    }
  ];

  if (isMorningWorkout) {
    events.push({
      id: 'sch-2',
      time: '07:00',
      title: 'Pre-Workout Fuel',
      type: 'meal',
      description: '1 Banana or Warm Sattu Drink + Black Coffee.',
      duration: '15m'
    });
    events.push({
      id: 'sch-3',
      time: '07:30',
      title: `${user.training.durationMinutes}-Min ${user.training.environment === 'home' ? 'Home' : 'Gym'} Training Session`,
      type: 'workout',
      description: 'Primary planned workout session for today.',
      duration: `${user.training.durationMinutes}m`
    });
    events.push({
      id: 'sch-4',
      time: '08:20',
      title: 'Post-Workout Breakfast',
      type: 'meal',
      description: 'High-protein breakfast (e.g. Sattu buttermilk or boiled eggs with roti).',
      duration: '25m'
    });
  } else {
    events.push({
      id: 'sch-2',
      time: '07:30',
      title: 'Wholesome Breakfast',
      type: 'meal',
      description: 'Nutrient-rich start with complex carbs and protein.',
      duration: '20m'
    });
  }

  events.push({
    id: 'sch-5',
    time: depTime,
    title: 'Commute / Work Shift Begins',
    type: 'work',
    description: `Transit to ${user.rhythm.occupation.replace('_', ' ')}. Maintain steady posture.`,
    duration: 'Scheduled'
  });

  events.push({
    id: 'sch-6',
    time: '13:15',
    title: 'Balanced Indian Lunch',
    type: 'meal',
    description: 'Dal, Kala Chana or Chicken with 2 Phulkas, Rice & Curd.',
    duration: '35m'
  });

  if (!isMorningWorkout) {
    events.push({
      id: 'sch-7',
      time: '17:30',
      title: 'Pre-Workout Energy Snack',
      type: 'meal',
      description: 'Roasted Chana, Banana, or Peanut Butter Roti.',
      duration: '15m'
    });
    events.push({
      id: 'sch-8',
      time: retTime,
      title: `${user.training.durationMinutes}-Min ${user.training.environment === 'home' ? 'Home' : 'Gym'} Workout`,
      type: 'workout',
      description: 'Scheduled evening training session after work.',
      duration: `${user.training.durationMinutes}m`
    });
  } else {
    events.push({
      id: 'sch-8',
      time: retTime,
      title: 'Return Home & Decompress',
      type: 'recovery',
      description: 'Switch out of work clothes, 5-minute easy walk or sit without phone.',
      duration: '20m'
    });
  }

  events.push({
    id: 'sch-9',
    time: '20:30',
    title: 'Nourishing Dinner',
    type: 'meal',
    description: 'Moong Dal, Soya Chunks Stir-fry or Paneer Bhurji with light salad.',
    duration: '30m'
  });

  events.push({
    id: 'sch-10',
    time: '22:45',
    title: 'Wind Down & Sleep Preparation',
    type: 'sleep',
    description: 'Cool bedroom, no direct blue screen light, deep nasal breathing.',
    duration: 'Rest'
  });

  return events;
};

// Generates weekly workout plan based on environment, frequency & duration
export const generateWorkoutSchedule = (
  env: TrainingEnvironment,
  frequencyDays: number,
  durationMinutes: number
): WorkoutDay[] => {
  const sourceExercises = env === 'gym' ? gymExercises : homeExercises;

  const days: WorkoutDay[] = [
    {
      dayNumber: 1,
      dayName: 'Monday',
      focus: 'Push & Core Foundations',
      isRestDay: false,
      estimatedMinutes: durationMinutes,
      exercises: [
        sourceExercises[0], // Bench press / Pushups
        sourceExercises[4], // Overhead press / Pike pushups
      ]
    },
    {
      dayNumber: 2,
      dayName: 'Tuesday',
      focus: 'Pull & Upper Back Posture',
      isRestDay: false,
      estimatedMinutes: durationMinutes,
      exercises: [
        sourceExercises[1], // Lat pulldown / Band pulldown
        sourceExercises[3], // Cable row / Band row
      ]
    },
    {
      dayNumber: 3,
      dayName: 'Wednesday',
      focus: 'Active Recovery & Hip Mobility',
      isRestDay: true,
      estimatedMinutes: 20,
      exercises: [],
      restDayGuidance: 'Light 20–30 min stroll, 10 min gentle lower-back stretching, drink 3L water.'
    },
    {
      dayNumber: 4,
      dayName: 'Thursday',
      focus: 'Lower Body & Quadricep Power',
      isRestDay: false,
      estimatedMinutes: durationMinutes,
      exercises: [
        sourceExercises[2], // Squats
        sourceExercises[0], // Push / Core finisher
      ]
    },
    {
      dayNumber: 5,
      dayName: 'Friday',
      focus: frequencyDays >= 4 ? 'Full Body Conditioning' : 'Rest & Muscle Repair',
      isRestDay: frequencyDays < 4,
      estimatedMinutes: frequencyDays >= 4 ? durationMinutes : 15,
      exercises: frequencyDays >= 4 ? [sourceExercises[1], sourceExercises[2]] : [],
      restDayGuidance: 'Foam rolling or legs-up-the-wall relaxation before the weekend.'
    },
    {
      dayNumber: 6,
      dayName: 'Saturday',
      focus: frequencyDays >= 5 ? 'Dynamic Core & Posterior Chain' : 'Light Weekend Walk',
      isRestDay: frequencyDays < 5,
      estimatedMinutes: frequencyDays >= 5 ? durationMinutes : 30,
      exercises: frequencyDays >= 5 ? [sourceExercises[3], sourceExercises[4]] : [],
      restDayGuidance: 'Social walk, hike, or recreational sports.'
    },
    {
      dayNumber: 7,
      dayName: 'Sunday',
      focus: 'Total Rest & Weekly Reset',
      isRestDay: true,
      estimatedMinutes: 0,
      exercises: [],
      restDayGuidance: 'Grocery restock, gentle meal prep, and full recharge for the upcoming week.'
    }
  ];

  return days;
};
