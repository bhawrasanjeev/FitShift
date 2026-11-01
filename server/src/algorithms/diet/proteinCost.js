/**
 * Calculates the cost per 10g of protein for a food item.
 * 
 * Formula:
 * - cost_per_10g_protein = (price_per_100g / protein_per_100g) × 10
 * 
 * @param {object} params
 * @param {number} params.pricePer100g - Price in INR per 100g of food.
 * @param {number} params.proteinPer100g - Protein content in grams per 100g of food.
 * @returns {number} Cost per 10g protein in INR rounded to 2 decimal places, or Infinity if protein <= 0.
 */
export function calculateProteinCost({ pricePer100g, proteinPer100g }) {
  if (
    typeof pricePer100g !== 'number' ||
    isNaN(pricePer100g) ||
    pricePer100g < 0 ||
    typeof proteinPer100g !== 'number' ||
    isNaN(proteinPer100g) ||
    proteinPer100g <= 0
  ) {
    return Infinity;
  }

  const cost = (pricePer100g / proteinPer100g) * 10;
  return Number(cost.toFixed(2));
}

export default calculateProteinCost;
