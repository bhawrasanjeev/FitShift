import {
  STAPLE_CATEGORIES,
  SUPPORTED_DIET_TYPES,
  SUPPORTED_SUPPLEMENT_PREFERENCES
} from '../../config/diet.config.js';

/**
 * Categorizes food into functional diet groups for eligibility checks.
 */
function isAnimalMeatOrFish(category) {
  const normalized = String(category).trim().toLowerCase();
  return normalized === 'meat' || normalized === 'fish';
}

function isPoultryOrEgg(category, itemName = '') {
  const normalizedCat = String(category).trim().toLowerCase();
  const normalizedName = String(itemName).trim().toLowerCase();
  return normalizedCat === 'poultry' || normalizedName.includes('egg');
}

function isSupplement(category) {
  const normalized = String(category).trim().toLowerCase();
  return normalized === 'supplements';
}

/**
 * Filters food items based on dietary restrictions, supplement preferences, and data validity.
 * 
 * @param {Array<object>} foods - Raw or normalized food items.
 * @param {object} options
 * @param {string} [options.dietType='vegetarian'] - 'vegetarian', 'eggetarian', or 'non_vegetarian'.
 * @param {string} [options.supplementPreference='no_supplements'] - 'no_supplements', 'open_to_supplements', or 'unsure'.
 * @returns {Array<object>} Filtered list of eligible candidate foods.
 */
export function filterEligibleFoods(foods, options = {}) {
  if (!Array.isArray(foods)) {
    return [];
  }

  const dietType = options.dietType ? String(options.dietType).trim().toLowerCase() : 'vegetarian';
  const supplementPref = options.supplementPreference
    ? String(options.supplementPreference).trim().toLowerCase()
    : 'no_supplements';

  if (!SUPPORTED_DIET_TYPES.includes(dietType)) {
    throw new Error(`Unsupported dietType: "${options.dietType}". Expected one of: ${SUPPORTED_DIET_TYPES.join(', ')}.`);
  }

  if (!SUPPORTED_SUPPLEMENT_PREFERENCES.includes(supplementPref)) {
    throw new Error(
      `Unsupported supplementPreference: "${options.supplementPreference}". Expected one of: ${SUPPORTED_SUPPLEMENT_PREFERENCES.join(', ')}.`
    );
  }

  return foods.filter(item => {
    if (!item || typeof item !== 'object') return false;

    // 1. Must have valid non-empty name and category
    const name = item.itemName || item.name;
    const category = item.category;
    if (!name || !category) return false;

    // 2. Exclude staple carbohydrate bases (Grains, Tubers, Bakery, Fruits)
    if (STAPLE_CATEGORIES.some(sc => sc.toLowerCase() === category.toLowerCase())) {
      return false;
    }

    // 3. Must have positive protein and positive price
    const protein = item.proteinClean !== undefined ? item.proteinClean : item.proteinPer100g;
    const price = item.pricePer100g !== undefined ? item.pricePer100g : item.priceClean;
    if (typeof protein !== 'number' || isNaN(protein) || protein <= 0) return false;
    if (typeof price !== 'number' || isNaN(price) || price <= 0) return false;

    // 4. Dietary type filtering
    if (dietType === 'vegetarian') {
      if (isAnimalMeatOrFish(category) || isPoultryOrEgg(category, name)) {
        return false;
      }
    } else if (dietType === 'eggetarian') {
      if (isAnimalMeatOrFish(category)) {
        return false;
      }
    }
    // non_vegetarian allows all above

    // 5. Supplement preference filtering
    if (supplementPref === 'no_supplements' && isSupplement(category)) {
      return false;
    }

    return true;
  });
}

export default filterEligibleFoods;
