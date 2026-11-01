import {
  SOYA_CONSTRAINTS,
  SERVING_CONSTRAINTS
} from '../../config/diet.config.js';
import { filterEligibleFoods } from './foodFilter.js';
import { rankFoodsByProteinCost } from './foodRanker.js';

/**
 * Determines functional food group for dietary balance and deduplication.
 */
function getFunctionalGroup(food) {
  const name = (food.itemName || food.name || '').toLowerCase();
  const cat = (food.category || '').toLowerCase();

  if (name.includes('soya')) return 'soya';
  if (name.includes('egg')) return 'eggs';
  if (cat === 'meat' || cat === 'fish') return 'meat_fish';
  if (cat === 'supplements') return 'supplements';
  if (name.includes('milk') || name.includes('chaas')) return 'dairy_liquid';
  if (cat === 'dairy' || cat === 'plant dairy') return 'dairy_solid';
  if (cat === 'nuts & seeds' || cat === 'spreads') return 'nuts_spreads';
  if (cat === 'legumes') {
    if (name.includes('sattu') || name.includes('roasted')) return 'legume_snack';
    return 'whole_legumes';
  }
  return 'default';
}

/**
 * Resolves serving constraints for a given food item.
 */
function resolveServingConstraints(food) {
  const group = getFunctionalGroup(food);
  const constraint = SERVING_CONSTRAINTS[group] || SERVING_CONSTRAINTS.default;

  // Strict Soya Rule: maximum 50g / day
  if (group === 'soya') {
    return {
      min: Math.min(constraint.min, SOYA_CONSTRAINTS.maxDailyGrams),
      max: SOYA_CONSTRAINTS.maxDailyGrams,
      step: constraint.step || 25
    };
  }

  return {
    min: constraint.min,
    max: constraint.max,
    step: constraint.step
  };
}

/**
 * Deduplicates closely related sibling products (e.g. Chunks vs Granules, Tray vs Pack of eggs).
 * Preserves the single most cost-effective option within each sibling pair.
 */
function deduplicateSiblingFoods(foods) {
  const seenSoya = new Set();
  const seenEggs = new Set();
  const seenMilk = new Set();
  const seenWhey = new Set();
  const seenPaneer = new Set();

  const deduped = [];

  for (const food of foods) {
    const name = (food.itemName || food.name || '').toLowerCase();

    if (name.includes('soya')) {
      if (seenSoya.size > 0) continue;
      seenSoya.add(food.id || name);
    } else if (name.includes('egg')) {
      if (seenEggs.size > 0) continue;
      seenEggs.add(food.id || name);
    } else if (name.includes('milk')) {
      if (seenMilk.size > 0) continue;
      seenMilk.add(food.id || name);
    } else if (name.includes('whey')) {
      if (seenWhey.size > 0) continue;
      seenWhey.add(food.id || name);
    } else if (name.includes('paneer')) {
      if (seenPaneer.size > 0) continue;
      seenPaneer.add(food.id || name);
    }

    deduped.push(food);
  }

  return deduped;
}

/**
 * Deterministic Budget Diet Optimizer.
 * 
 * Objective hierarchy:
 * 1. Meet protein target (targetGrams)
 * 2. Stay within budget (estimatedCost <= foodBudget)
 * 3. Maximize variety across functional food groups
 * 4. Respect serving limits and soya constraints
 * 
 * @param {object} params
 * @param {Array<object>} params.foods - Available clean food staple records.
 * @param {number} params.proteinTargetGrams - Required daily protein target.
 * @param {number} params.foodBudget - Maximum daily food budget in INR.
 * @param {string} [params.dietType='vegetarian']
 * @param {string} [params.supplementPreference='no_supplements']
 * @returns {object} Explainable optimization result.
 */
export function optimizeDiet({
  foods = [],
  proteinTargetGrams,
  foodBudget,
  dietType = 'vegetarian',
  supplementPreference = 'no_supplements'
}) {
  const target = Number(proteinTargetGrams);
  const budget = Number(foodBudget);

  // 1. Filter eligible foods according to dietary rules & supplements
  const eligible = filterEligibleFoods(foods, { dietType, supplementPreference });

  if (eligible.length === 0) {
    return {
      feasible: false,
      reason: 'No eligible foods available for the selected dietary restrictions.',
      budget: {
        dailyLimit: Math.round(budget),
        estimatedCost: 0
      },
      protein: {
        targetGrams: Math.round(target),
        achievedGrams: 0,
        gapGrams: Math.round(target)
      },
      foods: []
    };
  }

  // 2. Rank candidates by protein cost-efficiency
  const ranked = rankFoodsByProteinCost(eligible, { supplementPreference });

  // 3. Deduplicate sibling products (soya chunks vs granules, egg pack vs tray)
  const dedupedCandidates = deduplicateSiblingFoods(ranked);

  // 4. Select candidate foods favoring cross-group variety
  const initialCandidates = [];
  const usedGroups = new Set();
  const maxInitialFoods = 5;

  // Pass A: One candidate per functional group
  for (const food of dedupedCandidates) {
    if (initialCandidates.length >= maxInitialFoods) break;
    const group = getFunctionalGroup(food);
    if (!usedGroups.has(group)) {
      usedGroups.add(group);
      initialCandidates.push(food);
    }
  }

  // Pass B: Fill up to maxInitialFoods with best remaining candidates
  for (const food of dedupedCandidates) {
    if (initialCandidates.length >= maxInitialFoods) break;
    if (!initialCandidates.some(c => (c.id && c.id === food.id) || c.itemName === food.itemName)) {
      initialCandidates.push(food);
    }
  }

  // 5. Build initial plan with minimum baseline servings
  const plan = [];
  let currentCost = 0;
  let currentProtein = 0;

  for (const food of initialCandidates) {
    const constraints = resolveServingConstraints(food);
    const initialGrams = constraints.min;
    const pricePer100g = food.pricePer100g !== undefined ? food.pricePer100g : food.priceClean;
    const proteinClean = food.proteinClean !== undefined ? food.proteinClean : food.proteinPer100g;

    const cost = (initialGrams / 100) * pricePer100g;
    const protein = (initialGrams / 100) * proteinClean;

    if (currentCost + cost <= budget) {
      plan.push({
        food,
        grams: initialGrams,
        cost,
        protein,
        pricePer100g,
        proteinClean,
        constraints
      });
      currentCost += cost;
      currentProtein += protein;
    }
  }

  // 6. Scale up servings greedily by best cost-efficiency up to max limits
  let progress = true;
  while (progress && currentProtein < target) {
    progress = false;

    // Sort active plan items by costPer10gProtein ascending
    plan.sort((a, b) => a.food.costPer10gProtein - b.food.costPer10gProtein);

    for (const item of plan) {
      const { constraints, pricePer100g, proteinClean } = item;
      const step = constraints.step;

      if (item.grams + step <= constraints.max) {
        const addedCost = (step / 100) * pricePer100g;
        if (currentCost + addedCost <= budget) {
          item.grams += step;
          item.cost += addedCost;
          const addedProtein = (step / 100) * proteinClean;
          item.protein += addedProtein;
          currentCost += addedCost;
          currentProtein += addedProtein;
          progress = true;
          if (currentProtein >= target) break;
        }
      }
    }

    // 7. If active foods are maxed out, but budget remains and target is not met, add next candidate
    if (!progress && currentProtein < target && plan.length < 8) {
      for (const food of dedupedCandidates) {
        if (plan.some(p => (p.food.id && p.food.id === food.id) || p.food.itemName === food.itemName)) {
          continue;
        }

        const constraints = resolveServingConstraints(food);
        const pricePer100g = food.pricePer100g !== undefined ? food.pricePer100g : food.priceClean;
        const proteinClean = food.proteinClean !== undefined ? food.proteinClean : food.proteinPer100g;
        const addedCost = (constraints.min / 100) * pricePer100g;

        if (currentCost + addedCost <= budget) {
          const addedProtein = (constraints.min / 100) * proteinClean;
          plan.push({
            food,
            grams: constraints.min,
            cost: addedCost,
            protein: addedProtein,
            pricePer100g,
            proteinClean,
            constraints
          });
          currentCost += addedCost;
          currentProtein += addedProtein;
          progress = true;
          break;
        }
      }
    }
  }

  const roundedAchievedProtein = Math.round(currentProtein);
  const roundedTargetProtein = Math.round(target);
  const roundedCost = Math.round(currentCost);
  const roundedBudget = Math.round(budget);

  const isFeasible = currentProtein >= target && currentCost <= budget;
  const gapGrams = Math.max(0, roundedTargetProtein - roundedAchievedProtein);

  const result = {
    feasible: isFeasible,
    budget: {
      dailyLimit: roundedBudget,
      estimatedCost: roundedCost
    },
    protein: {
      targetGrams: roundedTargetProtein,
      achievedGrams: roundedAchievedProtein,
      gapGrams
    },
    foods: plan.map(item => ({
      name: item.food.itemName || item.food.name,
      quantityGrams: Math.round(item.grams),
      estimatedCost: Math.round(item.cost),
      proteinGrams: Math.round(item.protein)
    }))
  };

  if (!isFeasible) {
    result.reason = 'Protein target cannot be reached within the provided budget using the available foods.';
  }

  return result;
}

export default optimizeDiet;
