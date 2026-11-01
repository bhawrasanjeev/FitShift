/**
 * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.
 * 
 * Formula:
 * - Male:   (10 × weightKg) + (6.25 × heightCm) - (5 × age) + 5
 * - Female: (10 × weightKg) + (6.25 × heightCm) - (5 × age) - 161
 * 
 * @param {object} params
 * @param {number} params.age - Age in years.
 * @param {string} params.gender - 'male' or 'female'.
 * @param {number} params.heightCm - Height in centimeters.
 * @param {number} params.weightKg - Weight in kilograms.
 * @returns {number} Exact unrounded BMR (kcal/day).
 */
export function calculateBMR({ age, gender, heightCm, weightKg }) {
  const normalizedGender = String(gender).trim().toLowerCase();
  const base = (10 * weightKg) + (6.25 * heightCm) - (5 * age);

  if (normalizedGender === 'male') {
    return base + 5;
  }

  if (normalizedGender === 'female') {
    return base - 161;
  }

  throw new Error(`Unsupported gender: "${gender}". Expected "male" or "female".`);
}

export default calculateBMR;
