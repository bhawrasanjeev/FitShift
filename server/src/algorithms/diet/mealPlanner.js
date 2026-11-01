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

  if (preferredTime === 'evening') {
    return [
      { time: '7:30 AM', meal: 'Breakfast', description: 'High-protein breakfast to fuel daily focus & cognition' },
      { time: '10:30 AM', meal: isStudent ? 'College snack' : 'Office snack', description: 'Whole-food energizing snack' },
      { time: '1:00 PM', meal: isStudent ? 'College lunch' : 'Lunch', description: 'Macro-balanced complex carb & dal fuel' },
      { time: '4:30 PM', meal: 'Pre-workout snack', description: 'Fast-digesting natural fruit & dates for workout energy' },
      { time: '7:30 PM', meal: 'Post-workout dinner', description: 'High-protein recovery dinner & roti/rice' },
      { time: '9:30 PM', meal: 'Before-bed milk', description: 'Warm toned milk with slow-release casein protein' }
    ];
  }

  // Standard Morning Workout (e.g. 6:00 AM) and 8 AM - 4 PM college / work schedule
  return [
    { time: '5:20 AM', meal: 'Pre-workout', description: 'Quick-release glycogen fuel (banana + dates)' },
    { time: '7:15 AM', meal: 'Post-workout breakfast', description: 'High-protein recovery (chilla/poha + paneer/curd)' },
    { time: '10:30 AM', meal: isStudent ? 'College snack' : 'Work snack', description: 'Crunchy roasted chana, peanuts & fresh fruit' },
    { time: '1:00 PM', meal: isStudent ? 'College lunch' : 'Lunch', description: '3 rotis, dal/rajma/chole, rice, sabzi & curd' },
    { time: '4:30 PM', meal: isStudent ? 'After-college snack' : 'Evening snack', description: 'Milk, banana & peanut butter or sattu drink' },
    { time: '7:30 PM', meal: 'Dinner', description: 'Tissue repair dinner with soya chunks/paneer, roti & veg' },
    { time: '9:30 PM', meal: 'Before-bed milk', description: 'Warm toned milk with slow-release casein protein' }
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

  // Calculate totals per meal
  const meals = mealBuckets.map(bucket => {
    const totalProtein = bucket.foods.reduce((sum, f) => sum + f.proteinGrams, 0);
    const totalCost = bucket.foods.reduce((sum, f) => sum + f.estimatedCost, 0);
    return {
      id: bucket.id,
      mealType: bucket.mealType,
      title: bucket.title,
      totalProteinGrams: totalProtein,
      estimatedCost: totalCost,
      items: bucket.foods
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
