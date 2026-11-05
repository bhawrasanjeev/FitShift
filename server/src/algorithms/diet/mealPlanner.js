import cleanStaplesRepository from '../../repositories/cleanStaples.repository.js';

/**
 * Meal course templates based on user's mealsPerDay preference.
 */
const MEAL_TEMPLATES = {
  3: [
    { type: 'breakfast', title: 'Power Breakfast', role: 'morning_fuel' },
    { type: 'lunch', title: 'Macro-Balanced Lunch', role: 'main_lunch' },
    { type: 'dinner', title: 'Tissue Repair Dinner', role: 'evening_recovery' }
  ],
  4: [
    { type: 'breakfast', title: 'Power Breakfast', role: 'morning_fuel' },
    { type: 'lunch', title: 'Macro-Balanced Lunch', role: 'main_lunch' },
    { type: 'snack', title: 'High-Protein Evening Fuel', role: 'afternoon_snack' },
    { type: 'dinner', title: 'Tissue Repair Dinner', role: 'evening_recovery' }
  ],
  5: [
    { type: 'breakfast', title: 'Power Breakfast', role: 'morning_fuel' },
    { type: 'snack_morning', title: 'Mid-Morning Nutrition Anchor', role: 'morning_snack' },
    { type: 'lunch', title: 'Macro-Balanced Lunch', role: 'main_lunch' },
    { type: 'snack_evening', title: 'Pre/Post-Workout Fuel', role: 'afternoon_snack' },
    { type: 'dinner', title: 'Tissue Repair Dinner', role: 'evening_recovery' }
  ]
};

/**
 * Categorizes food staples into logical meal slots based on authentic Indian eating patterns.
 */
function classifyStapleForMeals(itemName, category) {
  const normName = String(itemName).toLowerCase();
  const normCat = String(category).toLowerCase();

  if (normName.includes('sattu') || normName.includes('oats') || normName.includes('poha') || normName.includes('egg') || normName.includes('bread')) {
    return 'breakfast_or_snack';
  }
  if (normName.includes('roasted chana') || normName.includes('peanut') || normName.includes('chaas') || normName.includes('banana')) {
    return 'snack';
  }
  if (normName.includes('dal') || normName.includes('rajma') || normName.includes('kala chana') || normName.includes('kabuli')) {
    return 'lunch_or_dinner';
  }
  if (normName.includes('chicken') || normName.includes('fish') || normName.includes('soya') || normName.includes('paneer') || normName.includes('tofu')) {
    return 'lunch_or_dinner';
  }
  if (normCat.includes('dairy')) {
    return 'any';
  }
  return 'lunch_or_dinner';
}

/**
 * Selects suitable staple carbohydrate bases from clean_staples.csv to complement the protein plan.
 */
function getComplementaryCarbBases(allStaples, dietType) {
  const carbItems = allStaples.filter(s =>
    ['Grains', 'Bakery', 'Fruits', 'Tubers'].includes(s.category)
  );
  return carbItems;
}

function parseTimeMinutes(str) {
  if (!str || typeof str !== 'string') return null;
  const match = str.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

function formatTime12h(totalMinutes) {
  let m = totalMinutes % (24 * 60);
  if (m < 0) m += 24 * 60;
  const h = Math.floor(m / 60);
  const mins = m % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = mins < 10 ? `0${mins}` : mins;
  return `${displayH}:${displayM} ${ampm}`;
}

/**
 * Generates personalized daily meal timings based on daily rhythm and workout preferences.
 * 
 * @param {object} [rhythm={}] - Daily rhythm parameters (wakeUpTime, departureTime, returnTime, occupation).
 * @param {object} [training={}] - Training setup parameters (preferredTime).
 * @returns {Array<{ time: string, meal: string, description: string }>}
 */
export function generateMealTimings(rhythm = {}, training = {}) {
  const preferredTime = training.preferredTime || 'early_morning';
  const occupation = rhythm.occupation || 'student';
  const isStudent = occupation === 'student';

  const wakeMins = parseTimeMinutes(rhythm.wakeUpTime);
  const retMins = parseTimeMinutes(rhythm.returnTime);

  if (preferredTime === 'evening') {
    const bfastTime = wakeMins !== null ? formatTime12h(wakeMins + 45) : '7:30 AM';
    const postWorkoutDinnerTime = retMins !== null ? formatTime12h(retMins + 60) : '7:30 PM';
    const bedMilkTime = wakeMins !== null && rhythm.sleepHours
      ? formatTime12h(wakeMins - Math.round(Number(rhythm.sleepHours) * 60) - 30)
      : '9:30 PM';

    return [
      { time: bfastTime, meal: 'Breakfast', description: 'High-protein breakfast to fuel daily focus & cognition' },
      { time: '10:30 AM', meal: isStudent ? 'College snack' : 'Office snack', description: 'Whole-food energizing snack' },
      { time: '1:00 PM', meal: isStudent ? 'College lunch' : 'Lunch', description: 'Macro-balanced complex carb & dal fuel' },
      { time: '4:30 PM', meal: 'Pre-workout snack', description: 'Fast-digesting natural fruit & dates for workout energy' },
      { time: postWorkoutDinnerTime, meal: 'Post-workout dinner', description: 'High-protein recovery dinner & roti/rice' },
      { time: bedMilkTime, meal: 'Before-bed milk', description: 'Warm toned milk with slow-release casein protein' }
    ];
  }

  // Standard Morning Workout
  const preWorkoutTime = wakeMins !== null ? formatTime12h(wakeMins + 15) : '5:20 AM';
  const postWorkoutBfastTime = wakeMins !== null ? formatTime12h(wakeMins + 65) : '7:15 AM';
  const dinnerTime = retMins !== null ? formatTime12h(retMins + 60) : '7:30 PM';
  const bedMilkTime = wakeMins !== null && rhythm.sleepHours
    ? formatTime12h(wakeMins - Math.round(Number(rhythm.sleepHours) * 60) - 30)
    : '9:30 PM';

  return [
    { time: preWorkoutTime, meal: 'Pre-workout', description: 'Quick-release glycogen fuel (banana + dates)' },
    { time: postWorkoutBfastTime, meal: 'Post-workout breakfast', description: 'High-protein recovery (chilla/poha + paneer/curd)' },
    { time: '10:30 AM', meal: isStudent ? 'College snack' : 'Work snack', description: 'Crunchy roasted chana, peanuts & fresh fruit' },
    { time: '1:00 PM', meal: isStudent ? 'College lunch' : 'Lunch', description: '3 rotis, dal/rajma/chole, rice, sabzi & curd' },
    { time: '4:30 PM', meal: isStudent ? 'After-college snack' : 'Evening snack', description: 'Milk, banana & peanut butter or sattu drink' },
    { time: dinnerTime, meal: 'Dinner', description: 'Tissue repair dinner with wholesome pulses/paneer, roti & veg' },
    { time: bedMilkTime, meal: 'Before-bed milk', description: 'Warm toned milk with slow-release casein protein' }
  ];
}

/**
 * Generates an authentic, complete 7-day Indian meal plan with rotating daily meals,
 * incorporating fresh fruits, dry fruits, legumes, dairy, and grains.
 * 
 * @param {object} params
 * @param {string} [params.dietType='vegetarian'] - 'vegetarian' | 'eggetarian' | 'non_vegetarian'
 * @param {number} [params.calorieTarget=2600]
 * @param {number} [params.proteinTargetGrams=110]
 * @returns {Array<object>} 7-day meal plan array
 */
export function generateSevenDayMealPlan(params = {}) {
  const dietType = params.dietType || 'vegetarian';
  const calorieTarget = Number(params.calorieTarget) || 2600;
  const proteinTarget = Number(params.proteinTargetGrams) || 110;

  // Format realistic estimated ranges
  const calMin = Math.round((calorieTarget - 50) / 50) * 50;
  const calMax = Math.round((calorieTarget + 50) / 50) * 50;
  const proMin = Math.round(proteinTarget - 5);
  const proMax = Math.round(proteinTarget + 5);

  const calRange = `${calMin.toLocaleString('en-IN')}–${calMax.toLocaleString('en-IN')} kcal`;
  const proRange = `${proMin}–${proMax} g protein`;

  return [
    {
      dayNumber: 1,
      dayName: 'Monday',
      focusTitle: 'High-Protein Vegetarian Kickoff',
      estimatedCalories: calRange,
      estimatedProtein: proRange,
      meals: [
        { time: '5:20 AM', mealName: 'Pre-workout', foodAndQuantity: '1 banana + 2 dates', categoryTag: 'Fruits & Dry Fruits' },
        { time: '7:15 AM', mealName: 'Post-workout breakfast', foodAndQuantity: '2–3 besan chillas (60 g besan), 50 g paneer, 150 g curd', categoryTag: 'High-Protein Breakfast' },
        { time: '10:30 AM', mealName: 'College snack', foodAndQuantity: '30 g roasted chana + 15 g peanuts + 1 guava', categoryTag: 'Healthy Snack & Fruit' },
        { time: '1:00 PM', mealName: 'College lunch', foodAndQuantity: '3 roti + moong dal (35 g dry) + 30 g dry rice + sabzi + 100 g curd', categoryTag: 'Balanced Lunch' },
        { time: '4:30 PM', mealName: 'After-college snack', foodAndQuantity: '250 ml milk + 1 banana + 15 g peanut butter', categoryTag: 'Fuel Stop' },
        { time: '7:30 PM', mealName: 'Dinner', foodAndQuantity: '40 g dry soya chunks curry + 2 roti + vegetables', categoryTag: 'Muscle Repair Dinner' },
        { time: '9:30 PM', mealName: 'Before-bed milk', foodAndQuantity: '250 ml milk', categoryTag: 'Overnight Recovery' }
      ]
    },
    {
      dayNumber: 2,
      dayName: 'Tuesday',
      focusTitle: 'Complex Carbs & Legume Recovery',
      estimatedCalories: calRange,
      estimatedProtein: proRange,
      meals: [
        { time: '5:20 AM', mealName: 'Pre-workout', foodAndQuantity: '1 banana + 2 dates', categoryTag: 'Fruits & Dry Fruits' },
        { time: '7:15 AM', mealName: 'Post-workout breakfast', foodAndQuantity: 'Vegetable poha (80 g dry) + 40 g peas + 15 g peanuts + 200 g curd', categoryTag: 'High-Protein Breakfast' },
        { time: '10:30 AM', mealName: 'College snack', foodAndQuantity: 'Kala chana (40 g dry before soaking) + 1 banana', categoryTag: 'Healthy Snack & Fruit' },
        { time: '1:00 PM', mealName: 'College lunch', foodAndQuantity: 'Rajma (50 g dry) + 70 g dry rice + 2 roti + salad + 100 g curd', categoryTag: 'Balanced Lunch' },
        { time: '4:30 PM', mealName: 'After-college snack', foodAndQuantity: '250 ml milk + 20 g peanuts + 10 g jaggery', categoryTag: 'Fuel Stop' },
        { time: '7:30 PM', mealName: 'Dinner', foodAndQuantity: dietType === 'eggetarian' ? 'Egg bhurji (3 whole eggs) + 2 roti + vegetables' : dietType === 'non_vegetarian' ? 'Chicken curry (120 g chicken breast) + 2 roti + salad' : 'Paneer bhurji (75 g paneer) + 2 roti + vegetables', categoryTag: 'Muscle Repair Dinner' },
        { time: '9:30 PM', mealName: 'Before-bed milk', foodAndQuantity: '250 ml milk', categoryTag: 'Overnight Recovery' }
      ]
    },
    {
      dayNumber: 3,
      dayName: 'Wednesday',
      focusTitle: 'Moong Chilla & Sattu Sustained Power',
      estimatedCalories: calRange,
      estimatedProtein: proRange,
      meals: [
        { time: '5:20 AM', mealName: 'Pre-workout', foodAndQuantity: '1 banana + 2 dates', categoryTag: 'Fruits & Dry Fruits' },
        { time: '7:15 AM', mealName: 'Post-workout breakfast', foodAndQuantity: 'Moong dal chilla (70 g dry moong) + 50 g paneer + 100 g curd', categoryTag: 'High-Protein Breakfast' },
        { time: '10:30 AM', mealName: 'College snack', foodAndQuantity: '200 ml milk + 25 g peanut chikki', categoryTag: 'Healthy Snack & Fruit' },
        { time: '1:00 PM', mealName: 'College lunch', foodAndQuantity: 'Chole (50 g dry chana) + 3 roti + 50 g dry rice + 100 g curd + salad', categoryTag: 'Balanced Lunch' },
        { time: '4:30 PM', mealName: 'After-college snack', foodAndQuantity: '1 banana + 30 g sattu drink + 10 g jaggery', categoryTag: 'Fuel Stop' },
        { time: '7:30 PM', mealName: 'Dinner', foodAndQuantity: 'Soya pulao (40 g dry soya + 60 g dry rice) + vegetables + 100 g curd', categoryTag: 'Muscle Repair Dinner' },
        { time: '9:30 PM', mealName: 'Before-bed milk', foodAndQuantity: '250 ml milk', categoryTag: 'Overnight Recovery' }
      ]
    },
    {
      dayNumber: 4,
      dayName: 'Thursday',
      focusTitle: 'Paneer Parathas & Probiotics',
      estimatedCalories: calRange,
      estimatedProtein: proRange,
      meals: [
        { time: '5:20 AM', mealName: 'Pre-workout', foodAndQuantity: '1 banana + 2 dates', categoryTag: 'Fruits & Dry Fruits' },
        { time: '7:15 AM', mealName: 'Post-workout breakfast', foodAndQuantity: dietType === 'eggetarian' ? '3 boiled eggs + 2 whole wheat rotis + 150 g curd' : '2 paneer parathas (90 g atta + 50 g paneer) + 150 g curd', categoryTag: 'High-Protein Breakfast' },
        { time: '10:30 AM', mealName: 'College snack', foodAndQuantity: '40 g sattu drink + 1 banana', categoryTag: 'Healthy Snack & Fruit' },
        { time: '1:00 PM', mealName: 'College lunch', foodAndQuantity: '3 roti + dal (40 g dry) + 30 g dry rice + sabzi + 200 ml chaas', categoryTag: 'Balanced Lunch' },
        { time: '4:30 PM', mealName: 'After-college snack', foodAndQuantity: '250 ml milk + 25 g roasted chana', categoryTag: 'Fuel Stop' },
        { time: '7:30 PM', mealName: 'Dinner', foodAndQuantity: dietType === 'non_vegetarian' ? 'Rohu fish curry / Chicken (120 g) + 2 roti + salad' : 'Rajma (50 g dry) + 70 g dry rice + 150 g curd + salad', categoryTag: 'Muscle Repair Dinner' },
        { time: '9:30 PM', mealName: 'Before-bed milk', foodAndQuantity: '250 ml milk', categoryTag: 'Overnight Recovery' }
      ]
    },
    {
      dayNumber: 5,
      dayName: 'Friday',
      focusTitle: 'Micronutrient Density & Fiber Anchor',
      estimatedCalories: calRange,
      estimatedProtein: proRange,
      meals: [
        { time: '5:20 AM', mealName: 'Pre-workout', foodAndQuantity: '1 banana + 2 dates', categoryTag: 'Fruits & Dry Fruits' },
        { time: '7:15 AM', mealName: 'Post-workout breakfast', foodAndQuantity: 'Vegetable upma (80 g suji) + 15 g peanuts + 200 g curd', categoryTag: 'High-Protein Breakfast' },
        { time: '10:30 AM', mealName: 'College snack', foodAndQuantity: '40 g roasted chana + 1 orange', categoryTag: 'Healthy Snack & Fruit' },
        { time: '1:00 PM', mealName: 'College lunch', foodAndQuantity: 'Chana dal (45 g dry) + 3 roti + 40 g dry rice + 100 g curd + sabzi', categoryTag: 'Balanced Lunch' },
        { time: '4:30 PM', mealName: 'After-college snack', foodAndQuantity: '250 ml milk + 1 banana + 15 g peanuts', categoryTag: 'Fuel Stop' },
        { time: '7:30 PM', mealName: 'Dinner', foodAndQuantity: 'Paneer bhurji (75 g paneer) + 2 roti + vegetables', categoryTag: 'Muscle Repair Dinner' },
        { time: '9:30 PM', mealName: 'Before-bed milk', foodAndQuantity: '250 ml milk', categoryTag: 'Overnight Recovery' }
      ]
    },
    {
      dayNumber: 6,
      dayName: 'Saturday',
      focusTitle: 'Weekend Mass-Builder Split',
      estimatedCalories: calRange,
      estimatedProtein: proRange,
      meals: [
        { time: '5:20 AM', mealName: 'Pre-workout', foodAndQuantity: '1 banana + 2 dates', categoryTag: 'Fruits & Dry Fruits' },
        { time: '7:15 AM', mealName: 'Post-workout breakfast', foodAndQuantity: '2–3 besan chillas (60 g besan) + 50 g paneer + 100 g curd', categoryTag: 'High-Protein Breakfast' },
        { time: '10:30 AM', mealName: 'College snack', foodAndQuantity: '25 g peanuts + 1 banana', categoryTag: 'Healthy Snack & Fruit' },
        { time: '1:00 PM', mealName: 'College lunch', foodAndQuantity: '3 roti + black chana (50 g dry) + 40 g dry rice + 100 g curd + sabzi', categoryTag: 'Balanced Lunch' },
        { time: '4:30 PM', mealName: 'After-college snack', foodAndQuantity: '250 ml milk + 20 g sattu', categoryTag: 'Fuel Stop' },
        { time: '7:30 PM', mealName: 'Dinner', foodAndQuantity: dietType === 'eggetarian' ? 'Egg curry (3 eggs) + 2 roti + aloo matar' : dietType === 'non_vegetarian' ? 'Chicken pulao (120 g chicken + 60 g rice) + curd + salad' : 'Soya curry (40 g dry soya) + 2 roti + aloo matar', categoryTag: 'Muscle Repair Dinner' },
        { time: '9:30 PM', mealName: 'Before-bed milk', foodAndQuantity: '250 ml milk', categoryTag: 'Overnight Recovery' }
      ]
    },
    {
      dayNumber: 7,
      dayName: 'Sunday',
      focusTitle: 'Restorative Digestion & Wholesome Khichdi',
      estimatedCalories: calRange,
      estimatedProtein: proRange,
      meals: [
        { time: '5:20 AM', mealName: 'Pre-workout', foodAndQuantity: '1 banana + 2 dates', categoryTag: 'Fruits & Dry Fruits' },
        { time: '7:15 AM', mealName: 'Post-workout breakfast', foodAndQuantity: 'Daliya (80 g dry) cooked with 250 ml milk + 10 g nuts', categoryTag: 'High-Protein Breakfast' },
        { time: '10:30 AM', mealName: 'College snack', foodAndQuantity: '30 g roasted chana + 1 guava', categoryTag: 'Healthy Snack & Fruit' },
        { time: '1:00 PM', mealName: 'College lunch', foodAndQuantity: 'Kadhi (40 g besan + 150 g curd) + 3 roti + 40 g dry rice + salad', categoryTag: 'Balanced Lunch' },
        { time: '4:30 PM', mealName: 'After-college snack', foodAndQuantity: '250 ml milk + 1 banana + 15 g peanuts', categoryTag: 'Fuel Stop' },
        { time: '7:30 PM', mealName: 'Dinner', foodAndQuantity: 'Moong khichdi (50 g dry moong + 50 g dry rice) + 50 g paneer + 100 g curd', categoryTag: 'Muscle Repair Dinner' },
        { time: '9:30 PM', mealName: 'Before-bed milk', foodAndQuantity: '250 ml milk', categoryTag: 'Overnight Recovery' }
      ]
    }
  ];
}

/**
 * Generates practical guidance on managing a daily budget using high-value Indian staples.
 * 
 * @param {number} [foodBudget=150]
 * @returns {object}
 */
export function generateBudgetManagementGuide(foodBudget = 150) {
  const budget = Number(foodBudget) || 150;
  return {
    headline: `How to manage your ₹${budget} daily budget`,
    description: 'You do not need expensive foods. Spend more on affordable protein sources rather than fancy health products.',
    guidelines: [
      { food: 'Milk', portion: '500 ml', notes: 'Divided into afternoon snack & bedtime milk (~₹27–30/day)' },
      { food: 'Paneer / Tofu', portion: '50–75 g on selected days', notes: 'High-density casein & calcium source (~₹20–28/day)' },
      { food: 'Soya chunks', portion: '30–40 g on selected days', notes: '52% protein density at ultra-budget cost (~₹5–6/day)' },
      { food: 'Dal / chana / rajma', portion: '40–50 g dry', notes: 'Measured dry before soaking (~₹6–8/day)' },
      { food: 'Roasted chana', portion: '30–40 g', notes: 'Portable college/office snack (~₹5–7/day)' },
      { food: 'Peanuts / Peanut butter', portion: '15–25 g', notes: 'Essential healthy fats & protein (~₹3–5/day)' },
      { food: 'Curd (Dahi)', portion: '150–200 g', notes: 'Probiotic digestion & 7g protein (~₹12–15/day)' },
      { food: 'Banana / seasonal fruit', portion: '2 servings', notes: 'Glycogen energy, potassium & fiber (~₹10–15/day)' },
      { food: 'Atta, rice, vegetables', portion: 'As per plan', notes: '3–5 rotis, rice & seasonal vegetables (~₹25–30/day)' }
    ]
  };
}

/**
 * Helper to determine estimated preparation time in minutes.
 */
function getMealPrepTime(mealType) {
  switch (mealType) {
    case 'breakfast': return 15;
    case 'lunch': return 25;
    case 'snack':
    case 'snack_morning':
    case 'snack_evening': return 5;
    case 'dinner': return 20;
    default: return 15;
  }
}

/**
 * Returns practical Indian kitchen advice based on ingredients in the meal.
 */
function getMealCookingTip(mealType, foods = []) {
  const foodNames = foods.map(f => (f.name || '').toLowerCase()).join(' ');

  if (foodNames.includes('soya')) {
    return 'Boil soya chunks in salted water for 5–7 mins, squeeze out excess water completely, then saute with spices for better texture and flavor absorption.';
  }
  if (foodNames.includes('sattu')) {
    return 'Whisk sattu into water or buttermilk with roasted jeera and lemon. Never heat sattu drink directly to preserve heat-sensitive nutrients.';
  }
  if (foodNames.includes('dal') || foodNames.includes('chana') || foodNames.includes('rajma')) {
    return 'Soak legumes overnight (8 hours) before cooking to break down phytic acid and oligosaccharides, reducing cooking time and eliminating digestive bloating.';
  }
  if (foodNames.includes('paneer')) {
    return 'Add fresh paneer cubes in the last 3 minutes of cooking on low heat to keep them soft and avoid a rubbery texture.';
  }
  if (foodNames.includes('oats')) {
    return 'Toast oats in a dry pan for 2 minutes before adding liquid to bring out a nutty aroma and improve digestion.';
  }
  if (foodNames.includes('egg')) {
    return 'Boil whole eggs for exactly 8 minutes for tender yolks, or cook bhurji on medium heat without over-drying.';
  }
  if (foodNames.includes('chicken') || foodNames.includes('fish')) {
    return 'Marinate protein with curd, turmeric, and ginger-garlic paste for at least 20 minutes to tenderize fibers naturally.';
  }
  return 'Prep dry ingredients ahead of time and weigh portions before soaking to maintain consistent macro accuracy.';
}

/**
 * Generates verified, culturally authentic Indian meal alternatives matching dietType.
 */
function getMealAlternatives(mealType, dietType, currentProtein = 22, currentCost = 20) {
  const isEggetarian = dietType === 'eggetarian';
  const isNonVeg = dietType === 'non_vegetarian';

  if (mealType === 'breakfast') {
    const list = [
      {
        id: 'alt-breakfast-chilla',
        name: 'Paneer Stuffed Besan Chilla with Dahi',
        description: 'Gram flour savory crepes stuffed with grated paneer and served with homemade probiotic curd.',
        approxProteinG: Math.max(20, currentProtein),
        estCalories: 360,
        approxCostRupees: 22,
        prepTimeMinutes: 15,
        cookingTip: 'Whisk batter with ajwain and cook on medium flame until edges crisp up before stuffing.',
        ingredients: ['Besan (60g)', 'Fresh Paneer (50g)', 'Fresh Curd (100g)', 'Spices'],
        items: [
          { name: 'Besan (Bengal Gram Flour)', quantityGrams: 60, proteinGrams: 13, estimatedCost: 8, category: 'Legumes' },
          { name: 'Fresh Paneer (Loose)', quantityGrams: 50, proteinGrams: 9, estimatedCost: 20, category: 'Dairy' },
          { name: 'Fresh Curd (Dahi)', quantityGrams: 100, proteinGrams: 4, estimatedCost: 9, category: 'Dairy' }
        ]
      },
      {
        id: 'alt-breakfast-poha',
        name: 'Sprouted Moong Poha with Peanuts',
        description: 'Flattened rice tempered with mustard seeds, crunchy peanuts, and protein-packed green moong sprouts.',
        approxProteinG: Math.max(18, currentProtein - 2),
        estCalories: 380,
        approxCostRupees: 18,
        prepTimeMinutes: 12,
        cookingTip: 'Rinse poha gently and steam sprouts for 3 minutes before tossing together.',
        ingredients: ['Poha (80g)', 'Moong Sprouts (60g)', 'Peanuts (20g)', 'Curry Leaves'],
        items: [
          { name: 'Poha (Flattened Rice)', quantityGrams: 80, proteinGrams: 6, estimatedCost: 6, category: 'Grains' },
          { name: 'Green Moong Sabut (Sprouts)', quantityGrams: 60, proteinGrams: 14, estimatedCost: 8, category: 'Legumes' },
          { name: 'Raw Peanuts', quantityGrams: 20, proteinGrams: 5, estimatedCost: 3, category: 'Nuts & Seeds' }
        ]
      }
    ];

    if (isEggetarian || isNonVeg) {
      list.push({
        id: 'alt-breakfast-eggs',
        name: '3 Masala Boiled Eggs & Whole Wheat Toast',
        description: 'Hard-boiled whole eggs seasoned with chaat masala alongside 2 toasted whole wheat bread slices.',
        approxProteinG: 24,
        estCalories: 320,
        approxCostRupees: 24,
        prepTimeMinutes: 10,
        cookingTip: 'Place eggs in boiling water for 8 minutes and plunge into cold water for clean peeling.',
        ingredients: ['Eggs (3 whole)', 'Whole Wheat Atta (60g)', 'Chaat Masala'],
        items: [
          { name: 'Eggs (Pack of 6)', quantityGrams: 150, proteinGrams: 20, estimatedCost: 23, category: 'Poultry' },
          { name: 'Whole Wheat Atta', quantityGrams: 60, proteinGrams: 7, estimatedCost: 3, category: 'Grains' }
        ]
      });
    } else {
      list.push({
        id: 'alt-breakfast-sattu',
        name: 'Chana Sattu Buttermilk Cooler & Peanuts',
        description: 'Traditional roasted gram flour dissolved in cold spiced buttermilk with a handful of raw nuts.',
        approxProteinG: 22,
        estCalories: 310,
        approxCostRupees: 16,
        prepTimeMinutes: 5,
        cookingTip: 'Whisk chilled chaas with sattu, roasted cumin, and rock salt for rapid digestive absorption.',
        ingredients: ['Chana Sattu (50g)', 'Chaas (300ml)', 'Peanuts (15g)'],
        items: [
          { name: 'Chana Sattu', quantityGrams: 50, proteinGrams: 13, estimatedCost: 8, category: 'Legumes' },
          { name: 'Chaas (Buttermilk)', quantityGrams: 300, proteinGrams: 5, estimatedCost: 9, category: 'Dairy' },
          { name: 'Raw Peanuts', quantityGrams: 15, proteinGrams: 4, estimatedCost: 3, category: 'Nuts & Seeds' }
        ]
      });
    }

    return list;
  }

  if (mealType === 'lunch') {
    const list = [
      {
        id: 'alt-lunch-kalachana',
        name: 'Kala Chana Curry with 3 Phulkas & Curd',
        description: 'Desi black chickpeas slow-simmered in aromatic onion-tomato gravy, served with hot phulkas and dahi.',
        approxProteinG: Math.max(25, currentProtein),
        estCalories: 510,
        approxCostRupees: 22,
        prepTimeMinutes: 20,
        cookingTip: 'Pressure cook black chana with a bay leaf and black cardamom for richer homestyle aroma.',
        ingredients: ['Kala Chana (60g)', 'Atta (90g)', 'Curd (100g)', 'Onion-Tomato Gravy'],
        items: [
          { name: 'Kala Chana', quantityGrams: 60, proteinGrams: 12, estimatedCost: 6, category: 'Legumes' },
          { name: 'Whole Wheat Atta', quantityGrams: 90, proteinGrams: 9, estimatedCost: 4, category: 'Grains' },
          { name: 'Fresh Curd (Dahi)', quantityGrams: 100, proteinGrams: 4, estimatedCost: 9, category: 'Dairy' }
        ]
      },
      {
        id: 'alt-lunch-moong',
        name: 'Yellow Moong Dal Tadka with Steamed Rice & Dahi',
        description: 'Light and easily digestible yellow split lentils tempered with cumin and ghee, served with rice and cooling curd.',
        approxProteinG: Math.max(22, currentProtein - 2),
        estCalories: 480,
        approxCostRupees: 19,
        prepTimeMinutes: 18,
        cookingTip: 'Add pinch of hing (asafoetida) in cumin tadka to aid digestion and nutrient bioavailability.',
        ingredients: ['Moong Dal (60g)', 'Rice (70g)', 'Curd (150g)', 'Jeera Tadka'],
        items: [
          { name: 'Yellow Moong Dal (Raw)', quantityGrams: 60, proteinGrams: 14, estimatedCost: 8, category: 'Legumes' },
          { name: 'White Rice (Raw)', quantityGrams: 70, proteinGrams: 5, estimatedCost: 4, category: 'Grains' },
          { name: 'Fresh Curd (Dahi)', quantityGrams: 150, proteinGrams: 5, estimatedCost: 13, category: 'Dairy' }
        ]
      }
    ];

    if (isNonVeg) {
      list.push({
        id: 'alt-lunch-chicken',
        name: 'Homestyle Chicken Curry with 3 Rotis & Salad',
        description: 'Tender bone-in chicken pieces in light ginger-garlic and onion-tomato gravy with hot wheat rotis.',
        approxProteinG: 34,
        estCalories: 520,
        approxCostRupees: 35,
        prepTimeMinutes: 25,
        cookingTip: 'Simmer on low heat with covered lid so chicken stays juicy without needing heavy oils.',
        ingredients: ['Chicken Curry Cut (150g)', 'Whole Wheat Atta (90g)', 'Cucumber Salad'],
        items: [
          { name: 'Chicken Curry Cut (Bone-in)', quantityGrams: 150, proteinGrams: 28, estimatedCost: 29, category: 'Meat' },
          { name: 'Whole Wheat Atta', quantityGrams: 90, proteinGrams: 9, estimatedCost: 4, category: 'Grains' }
        ]
      });
    } else if (isEggetarian) {
      list.push({
        id: 'alt-lunch-eggbhurji',
        name: 'Egg Bhurji (3 Eggs) with 3 Multigrain Rotis',
        description: 'Scrambled eggs with onions, green chillies, and fresh coriander served with wholesome rotis.',
        approxProteinG: 28,
        estCalories: 470,
        approxCostRupees: 26,
        prepTimeMinutes: 15,
        cookingTip: 'Add a splash of milk when whisking eggs for extra fluffiness.',
        ingredients: ['Eggs (3 whole)', 'Whole Wheat Atta (90g)', 'Onions & Chillies'],
        items: [
          { name: 'Eggs (Pack of 6)', quantityGrams: 150, proteinGrams: 20, estimatedCost: 23, category: 'Poultry' },
          { name: 'Whole Wheat Atta', quantityGrams: 90, proteinGrams: 9, estimatedCost: 4, category: 'Grains' }
        ]
      });
    } else {
      list.push({
        id: 'alt-lunch-rajma',
        name: 'Rajma Masala with Jeera Rice & Green Salad',
        description: 'Authentic North Indian red kidney beans slow-cooked with spices, paired with fragrant jeera rice.',
        approxProteinG: 24,
        estCalories: 530,
        approxCostRupees: 22,
        prepTimeMinutes: 25,
        cookingTip: 'Mash a small portion of cooked rajma against the pot to thicken gravy naturally without cream.',
        ingredients: ['Rajma (60g)', 'Rice (70g)', 'Curd (100g)', 'Fresh Salad'],
        items: [
          { name: 'Rajma', quantityGrams: 60, proteinGrams: 13, estimatedCost: 8, category: 'Legumes' },
          { name: 'White Rice (Raw)', quantityGrams: 70, proteinGrams: 5, estimatedCost: 4, category: 'Grains' },
          { name: 'Fresh Curd (Dahi)', quantityGrams: 100, proteinGrams: 4, estimatedCost: 9, category: 'Dairy' }
        ]
      });
    }

    return list;
  }

  if (mealType === 'dinner') {
    const list = [
      {
        id: 'alt-dinner-dal',
        name: 'Homestyle Dal Tadka with 2 Phulkas & Curd',
        description: 'Protein-packed yellow or black dal tempered with cumin, garlic, and tomato, served with wheat phulkas and fresh curd.',
        approxProteinG: Math.max(22, currentProtein),
        estCalories: 420,
        approxCostRupees: 18,
        prepTimeMinutes: 20,
        cookingTip: 'Temper dal with a dash of hing and freshly pounded cumin for enhanced digestive assimilation.',
        ingredients: ['Yellow Moong Dal (70g)', 'Atta (60g)', 'Curd (100g)', 'Spices'],
        items: [
          { name: 'Yellow Moong Dal (Raw)', quantityGrams: 70, proteinGrams: 16, estimatedCost: 9, category: 'Legumes' },
          { name: 'Whole Wheat Atta', quantityGrams: 60, proteinGrams: 6, estimatedCost: 3, category: 'Grains' },
          { name: 'Fresh Curd (Dahi)', quantityGrams: 100, proteinGrams: 4, estimatedCost: 9, category: 'Dairy' }
        ]
      },
      {
        id: 'alt-dinner-paneer',
        name: 'Fresh Paneer Matar Curry with 2 Rotis',
        description: 'Soft cottage cheese cubes and sweet green peas simmered in a light homestyle gravy.',
        approxProteinG: 22,
        estCalories: 450,
        approxCostRupees: 35,
        prepTimeMinutes: 20,
        cookingTip: 'Soak paneer in warm water before adding to keep it tender without deep frying.',
        ingredients: ['Fresh Paneer (80g)', 'Whole Wheat Atta (60g)', 'Matar & Spices'],
        items: [
          { name: 'Fresh Paneer (Loose)', quantityGrams: 80, proteinGrams: 14, estimatedCost: 32, category: 'Dairy' },
          { name: 'Whole Wheat Atta', quantityGrams: 60, proteinGrams: 6, estimatedCost: 3, category: 'Grains' }
        ]
      }
    ];

    if (isNonVeg) {
      list.push({
        id: 'alt-dinner-chicken',
        name: 'Pan-Seared Chicken Breast with Stir-Fry Vegetables',
        description: 'Lean boneless chicken breast strips lightly seasoned with pepper, cumin, and roasted bell peppers.',
        approxProteinG: 38,
        estCalories: 430,
        approxCostRupees: 42,
        prepTimeMinutes: 20,
        cookingTip: 'Cook chicken breast for 6–7 minutes total and rest for 3 minutes before slicing.',
        ingredients: ['Chicken Breast (120g)', 'Atta (60g)', 'Bell Peppers & Onion'],
        items: [
          { name: 'Chicken Breast (Boneless)', quantityGrams: 120, proteinGrams: 37, estimatedCost: 34, category: 'Meat' },
          { name: 'Whole Wheat Atta', quantityGrams: 60, proteinGrams: 6, estimatedCost: 3, category: 'Grains' }
        ]
      });
    } else if (isEggetarian) {
      list.push({
        id: 'alt-dinner-eggcurry',
        name: 'Egg Curry (3 Eggs) with Steamed Rice',
        description: 'Hard-boiled eggs pierced and shallow-fried, then simmered in a spiced homestyle curry.',
        approxProteinG: 26,
        estCalories: 440,
        approxCostRupees: 28,
        prepTimeMinutes: 18,
        cookingTip: 'Prick boiled eggs with a fork before adding to curry so flavors penetrate deeply.',
        ingredients: ['Eggs (3 whole)', 'White Rice (70g)', 'Tomato Gravy'],
        items: [
          { name: 'Eggs (Pack of 6)', quantityGrams: 150, proteinGrams: 20, estimatedCost: 23, category: 'Poultry' },
          { name: 'White Rice (Raw)', quantityGrams: 70, proteinGrams: 5, estimatedCost: 4, category: 'Grains' }
        ]
      });
    } else {
      list.push({
        id: 'alt-dinner-tofu',
        name: 'Tofu & Mixed Vegetable Stir-Fry with Roti',
        description: 'Soy paneer cubes stir-fried with capsicum, carrots, and cumin, served with whole wheat rotis.',
        approxProteinG: 20,
        estCalories: 380,
        approxCostRupees: 32,
        prepTimeMinutes: 15,
        cookingTip: 'Press tofu with a kitchen towel for 5 minutes before cubing to give it a firmer texture.',
        ingredients: ['Tofu (120g)', 'Whole Wheat Atta (60g)', 'Mixed Veggies'],
        items: [
          { name: 'Tofu (Soy Paneer)', quantityGrams: 120, proteinGrams: 11, estimatedCost: 33, category: 'Plant Dairy' },
          { name: 'Whole Wheat Atta', quantityGrams: 60, proteinGrams: 6, estimatedCost: 3, category: 'Grains' }
        ]
      });
    }

    return list;
  }

  // Snack / default slot
  return [
    {
      id: 'alt-snack-bhuna',
      name: 'Spicy Roasted Kala Chana & Fresh Chaas',
      description: 'Crunchy dry-roasted Bengal gram with chaat masala paired with cooling probiotic salted buttermilk.',
      approxProteinG: 14,
      estCalories: 250,
      approxCostRupees: 14,
      prepTimeMinutes: 5,
      cookingTip: 'Store roasted chana in an airtight glass jar to maintain maximum crispiness.',
      ingredients: ['Roasted Chana (40g)', 'Chaas (300ml)', 'Black Salt'],
      items: [
        { name: 'Roasted Chana (Bhuna)', quantityGrams: 40, proteinGrams: 8, estimatedCost: 7, category: 'Legumes' },
        { name: 'Chaas (Buttermilk)', quantityGrams: 300, proteinGrams: 5, estimatedCost: 9, category: 'Dairy' }
      ]
    },
    {
      id: 'alt-snack-sattu',
      name: 'Peanut Sattu Energy Shake with Milk',
      description: 'High-protein portable shake blending sattu flour, toned milk, and a spoon of crushed peanuts.',
      approxProteinG: 21,
      estCalories: 330,
      approxCostRupees: 18,
      prepTimeMinutes: 5,
      cookingTip: 'Use a shaker bottle with a spring wire ball for a completely lump-free sattu drink.',
      ingredients: ['Chana Sattu (40g)', 'Toned Milk (200ml)', 'Peanuts (15g)'],
      items: [
        { name: 'Chana Sattu', quantityGrams: 40, proteinGrams: 10, estimatedCost: 6, category: 'Legumes' },
        { name: 'Raw Peanuts', quantityGrams: 15, proteinGrams: 4, estimatedCost: 3, category: 'Nuts & Seeds' },
        { name: 'Toned Milk', quantityGrams: 200, proteinGrams: 6, estimatedCost: 12, category: 'Dairy' }
      ]
    }
  ];
}

/**
 * Calculates estimated meal calories based on proportion of daily calorie target.
 */
function getMealCalories(mealType, calorieTarget = 2500) {
  const target = Number(calorieTarget) || 2500;
  switch (mealType) {
    case 'breakfast': return Math.round(target * 0.25);
    case 'lunch': return Math.round(target * 0.35);
    case 'snack':
    case 'snack_morning':
    case 'snack_evening': return Math.round(target * 0.15);
    case 'dinner': return Math.round(target * 0.25);
    default: return Math.round(target * 0.25);
  }
}

/**
 * Constructs a structured daily meal plan and consolidated grocery list from real food datasets.
 * 
 * @param {object} params
 * @param {Array<object>} params.optimizedFoods - Concentrated protein foods from budget optimizer.
 * @param {number} [params.mealsPerDay=4] - 3, 4, or 5 meals.
 * @param {string} [params.dietType='vegetarian'] - 'vegetarian', 'eggetarian', 'non_vegetarian'.
 * @param {number} [params.calorieTarget=2500] - Total daily energy target.
 * @param {number} [params.proteinTargetGrams=110] - Total daily protein target.
 * @param {number} [params.foodBudget=150] - User food budget.
 * @param {object} [params.rhythm={}] - Daily rhythm parameters.
 * @param {object} [params.training={}] - Workout parameters.
 * @returns {{ meals: Array<object>, groceryList: Array<object>, mealTimings: Array<object>, sevenDayMealPlan: Array<object>, budgetManagement: object }}
 */
export function generateMealPlanAndGrocery(params = {}) {
  const optimizedFoods = Array.isArray(params.optimizedFoods) ? params.optimizedFoods : [];
  const mealsCount = [3, 4, 5].includes(Number(params.mealsPerDay)) ? Number(params.mealsPerDay) : 4;
  const dietType = params.dietType || 'vegetarian';

  cleanStaplesRepository.ensureLoaded();
  const allStaples = cleanStaplesRepository.getAll();
  const carbStaples = getComplementaryCarbBases(allStaples, dietType);

  const mealSlots = MEAL_TEMPLATES[mealsCount] || MEAL_TEMPLATES[4];

  // Distribute allocated protein foods across meal slots
  const mealBuckets = mealSlots.map(slot => ({
    id: `meal-${slot.type}`,
    mealType: slot.type,
    title: slot.title,
    foods: []
  }));

  // Assign each optimized food item to the most fitting meal slot
  optimizedFoods.forEach((food, idx) => {
    const stapleMatch = allStaples.find(s => s.itemName.toLowerCase() === food.name.toLowerCase());
    const slotPreference = classifyStapleForMeals(food.name, stapleMatch ? stapleMatch.category : '');

    let targetBucketIndex;
    if (slotPreference === 'breakfast_or_snack') {
      targetBucketIndex = 0; // Breakfast
    } else if (slotPreference === 'snack') {
      targetBucketIndex = mealBuckets.length > 3 ? 2 : 0; // Snack or Breakfast
    } else if (slotPreference === 'lunch_or_dinner') {
      targetBucketIndex = (idx % 2 === 0) ? 1 : (mealBuckets.length - 1); // Lunch or Dinner
    } else {
      targetBucketIndex = idx % mealBuckets.length;
    }

    mealBuckets[targetBucketIndex].foods.push({
      name: food.name,
      quantityGrams: food.quantityGrams,
      proteinGrams: food.proteinGrams,
      estimatedCost: food.estimatedCost,
      category: stapleMatch ? stapleMatch.category : 'Protein Staples'
    });
  });

  // Complement main meals with real carbohydrate energy staples (Roti Atta / Rice / Oats)
  const atta = carbStaples.find(c => c.itemName.toLowerCase().includes('atta'));
  const rice = carbStaples.find(c => c.itemName.toLowerCase().includes('rice'));
  const oats = carbStaples.find(c => c.itemName.toLowerCase().includes('oats'));

  mealBuckets.forEach(bucket => {
    if (bucket.mealType === 'breakfast' && oats) {
      bucket.foods.push({
        name: oats.itemName,
        quantityGrams: 50,
        proteinGrams: Math.round((oats.proteinClean / 100) * 50),
        estimatedCost: Math.round((oats.pricePer100g / 100) * 50),
        category: oats.category
      });
    } else if (bucket.mealType === 'lunch' && atta) {
      bucket.foods.push({
        name: `${atta.itemName} (2 Phulkas)`,
        quantityGrams: 60,
        proteinGrams: Math.round((atta.proteinClean / 100) * 60),
        estimatedCost: Math.round((atta.pricePer100g / 100) * 60),
        category: atta.category
      });
    } else if (bucket.mealType === 'dinner' && (rice || atta)) {
      const staple = rice || atta;
      bucket.foods.push({
        name: staple.itemName,
        quantityGrams: 75,
        proteinGrams: Math.round((staple.proteinClean / 100) * 75),
        estimatedCost: Math.round((staple.pricePer100g / 100) * 75),
        category: staple.category
      });
    }
  });

  // Calculate totals per meal with rich preparation metadata and verified alternatives
  const meals = mealBuckets.map(bucket => {
    const totalProtein = bucket.foods.reduce((sum, f) => sum + f.proteinGrams, 0);
    const totalCost = bucket.foods.reduce((sum, f) => sum + f.estimatedCost, 0);
    const prepTimeMinutes = getMealPrepTime(bucket.mealType);
    const cookingTip = getMealCookingTip(bucket.mealType, bucket.foods);
    const estCalories = getMealCalories(bucket.mealType, params.calorieTarget);
    const alternatives = getMealAlternatives(bucket.mealType, dietType, totalProtein, totalCost);

    return {
      id: bucket.id,
      mealType: bucket.mealType,
      title: bucket.title,
      totalProteinGrams: totalProtein,
      estimatedCost: totalCost,
      estCalories,
      prepTimeMinutes,
      cookingTip,
      items: bucket.foods,
      alternatives
    };
  });

  // Aggregate into Consolidated Weekly Grocery List directly from foods used
  const foodTotals = new Map();

  meals.forEach(m => {
    m.items.forEach(item => {
      const cleanName = item.name.replace(/\s*\([^)]*\)/g, '').trim();
      if (!foodTotals.has(cleanName)) {
        const stapleInfo = allStaples.find(s => s.itemName.toLowerCase().includes(cleanName.toLowerCase()));
        foodTotals.set(cleanName, {
          name: cleanName,
          category: stapleInfo ? stapleInfo.category : item.category,
          dailyGrams: 0,
          dailyCost: 0,
          pricePer100g: stapleInfo ? stapleInfo.pricePer100g : (item.estimatedCost / Math.max(1, item.quantityGrams)) * 100
        });
      }
      const current = foodTotals.get(cleanName);
      current.dailyGrams += item.quantityGrams;
      current.dailyCost += item.estimatedCost;
    });
  });

  const groceryList = Array.from(foodTotals.values()).map((entry, idx) => {
    const weeklyGrams = entry.dailyGrams * 7;
    const weeklyCost = Math.round(entry.dailyCost * 7);

    // Format human-friendly shopping quantity
    let quantityLabel;
    if (entry.name.toLowerCase().includes('egg')) {
      const eggsPerDay = Math.max(1, Math.round(entry.dailyGrams / 50));
      quantityLabel = `${eggsPerDay * 7} eggs (~${Math.round(weeklyGrams / 1000 * 10) / 10} kg)`;
    } else if (weeklyGrams >= 1000) {
      quantityLabel = `${(weeklyGrams / 1000).toFixed(1)} kg`;
    } else {
      quantityLabel = `${weeklyGrams} g`;
    }

    return {
      id: `grocery-${idx + 1}`,
      name: entry.name,
      category: entry.category,
      weeklyQuantity: quantityLabel,
      weeklyGrams,
      estimatedWeeklyCost: weeklyCost,
      estimatedDailyCost: Math.round(entry.dailyCost),
      checked: false
    };
  });

  const mealTimings = generateMealTimings(params.rhythm, params.training);
  const sevenDayMealPlan = generateSevenDayMealPlan({
    dietType,
    calorieTarget: params.calorieTarget,
    proteinTargetGrams: params.proteinTargetGrams
  });
  const budgetManagement = generateBudgetManagementGuide(params.foodBudget || 150);

  return {
    meals,
    groceryList,
    mealTimings,
    sevenDayMealPlan,
    budgetManagement
  };
}

export default generateMealPlanAndGrocery;
