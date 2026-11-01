import { calculateProteinCost } from './proteinCost.js';

/**
 * Ranks candidate food items deterministically.
 * 
 * Ranking criteria:
 * 1. Supplement penalty (if supplementPreference === 'unsure', whole foods preferred before supplements)
 * 2. Primary: cost_per_10g_protein ascending (lowest cost per unit of protein first)
 * 3. Secondary: protein density (protein per 100g) descending to favor more concentrated sources
 * 4. Tertiary: ID ascending for deterministic tie-breaking
 * 
 * @param {Array<object>} foods - Filtered eligible food items.
 * @param {object} [options={}]
 * @param {string} [options.supplementPreference='no_supplements']
 * @returns {Array<object>} Sorted list of candidate foods with computed costPer10gProtein.
 */
export function rankFoodsByProteinCost(foods, options = {}) {
  if (!Array.isArray(foods)) return [];

  const supplementPref = options.supplementPreference || 'no_supplements';

  const prepared = foods.map(item => {
    const protein = item.proteinClean !== undefined ? item.proteinClean : item.proteinPer100g;
    const price = item.pricePer100g !== undefined ? item.pricePer100g : item.priceClean;
    const computedCost = calculateProteinCost({ pricePer100g: price, proteinPer100g: protein });
    const costPer10gProtein = item.costPer10gProtein || computedCost;

    return {
      ...item,
      proteinClean: protein,
      pricePer100g: price,
      costPer10gProtein
    };
  });

  return prepared.sort((a, b) => {
    // If user is unsure about supplements, penalize supplements so whole foods rank first
    if (supplementPref === 'unsure') {
      const aIsSupp = a.category && a.category.toLowerCase() === 'supplements';
      const bIsSupp = b.category && b.category.toLowerCase() === 'supplements';
      if (aIsSupp && !bIsSupp) return 1;
      if (!aIsSupp && bIsSupp) return -1;
    }

    // 1. Cost per 10g protein ascending
    if (a.costPer10gProtein !== b.costPer10gProtein) {
      return a.costPer10gProtein - b.costPer10gProtein;
    }

    // 2. Protein density descending
    if (b.proteinClean !== a.proteinClean) {
      return b.proteinClean - a.proteinClean;
    }

    // 3. ID / name ascending for deterministic tie-breaking
    const idA = a.id !== undefined ? a.id : a.itemName || '';
    const idB = b.id !== undefined ? b.id : b.itemName || '';
    if (idA < idB) return -1;
    if (idA > idB) return 1;
    return 0;
  });
}

export default rankFoodsByProteinCost;
