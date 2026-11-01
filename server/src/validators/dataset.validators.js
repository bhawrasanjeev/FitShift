/**
 * Dataset Validators for FitShift.
 * Performs structural validation and data-quality analysis on raw dataset records.
 */

const VALID_EXERCISE_LEVELS = new Set(['beginner', 'intermediate', 'expert']);

/**
 * Validates the exercises dataset.
 * 
 * @param {any} rawExercises - Raw JSON parsed data.
 * @returns {{ isValid: boolean, recordCount: number, errors: string[], warnings: string[], records: Array }}
 */
export function validateExercises(rawExercises) {
  const errors = [];
  const warnings = [];

  if (!Array.isArray(rawExercises)) {
    return {
      isValid: false,
      recordCount: 0,
      errors: ['Exercises dataset root must be an array of objects'],
      warnings: [],
      records: []
    };
  }

  const seenIds = new Set();
  const noInstructions = [];
  const noImages = [];
  let nullEquipmentCount = 0;
  let nullForceCount = 0;
  let nullMechanicCount = 0;
  const validRecords = [];

  rawExercises.forEach((item, index) => {
    const itemLabel = item && typeof item === 'object' && item.name ? `Exercise "${item.name}" (index ${index})` : `Exercise at index ${index}`;

    if (!item || typeof item !== 'object') {
      errors.push(`${itemLabel}: Record must be a valid JSON object`);
      return;
    }

    // Required fields: id, name, category, level
    if (!item.id || typeof item.id !== 'string' || item.id.trim() === '') {
      errors.push(`${itemLabel}: Missing or empty required field "id"`);
      return;
    }

    if (seenIds.has(item.id)) {
      errors.push(`${itemLabel}: Duplicate exercise ID "${item.id}" detected`);
      return;
    }
    seenIds.add(item.id);

    if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
      errors.push(`${itemLabel}: Missing or empty required field "name"`);
      return;
    }

    if (!item.category || typeof item.category !== 'string' || item.category.trim() === '') {
      errors.push(`${itemLabel}: Missing or empty required field "category"`);
      return;
    }

    if (!item.level || !VALID_EXERCISE_LEVELS.has(item.level.toLowerCase())) {
      errors.push(`${itemLabel}: Invalid or missing "level" (expected beginner, intermediate, or expert; got "${item.level}")`);
      return;
    }

    // Required array fields
    if (!Array.isArray(item.primaryMuscles)) {
      errors.push(`${itemLabel}: "primaryMuscles" must be an array`);
      return;
    }

    if (!Array.isArray(item.secondaryMuscles)) {
      errors.push(`${itemLabel}: "secondaryMuscles" must be an array`);
      return;
    }

    if (!Array.isArray(item.instructions)) {
      errors.push(`${itemLabel}: "instructions" must be an array`);
      return;
    }

    if (!Array.isArray(item.images)) {
      errors.push(`${itemLabel}: "images" must be an array`);
      return;
    }

    // Quality checks (non-fatal warnings)
    if (item.instructions.length === 0) {
      noInstructions.push(item.name);
    }

    if (item.images.length === 0) {
      noImages.push(item.name);
    }

    if (item.equipment === null || item.equipment === undefined) {
      nullEquipmentCount++;
    }

    if (item.force === null || item.force === undefined) {
      nullForceCount++;
    }

    if (item.mechanic === null || item.mechanic === undefined) {
      nullMechanicCount++;
    }

    validRecords.push({
      id: item.id.trim(),
      name: item.name.trim(),
      force: item.force ? item.force.trim() : null,
      level: item.level.trim().toLowerCase(),
      mechanic: item.mechanic ? item.mechanic.trim() : null,
      equipment: item.equipment ? item.equipment.trim() : null,
      primaryMuscles: item.primaryMuscles.map(m => m.trim().toLowerCase()),
      secondaryMuscles: item.secondaryMuscles.map(m => m.trim().toLowerCase()),
      instructions: item.instructions.map(inst => inst.trim()),
      category: item.category.trim().toLowerCase(),
      images: item.images.map(img => img.trim())
    });
  });

  if (noInstructions.length > 0) {
    warnings.push(`${noInstructions.length} exercise(s) have empty instructions: ${noInstructions.join(', ')}`);
  }

  if (noImages.length > 0) {
    warnings.push(`${noImages.length} exercise(s) have empty images: ${noImages.join(', ')}`);
  }

  if (nullEquipmentCount > 0) {
    warnings.push(`${nullEquipmentCount} exercise(s) have null or unspecified equipment`);
  }

  return {
    isValid: errors.length === 0 && validRecords.length > 0,
    recordCount: validRecords.length,
    errors,
    warnings,
    records: validRecords
  };
}

/**
 * Validates the raw food prices dataset.
 * 
 * @param {{ headers: string[], rows: object[] }} csvData - Parsed CSV data.
 * @param {object} [options={}] - Validation options (e.g. source filename warning).
 * @returns {{ isValid: boolean, recordCount: number, errors: string[], warnings: string[], records: Array }}
 */
export function validateFoodPrices(csvData, options = {}) {
  const errors = [];
  const warnings = [];

  if (options.sourceFileName && options.sourceFileName !== 'price_of_food_items.csv') {
    warnings.push(`Dataset loaded from alternative filename "${options.sourceFileName}" instead of "price_of_food_items.csv"`);
  }

  if (!csvData || !Array.isArray(csvData.headers) || !Array.isArray(csvData.rows)) {
    return {
      isValid: false,
      recordCount: 0,
      errors: ['Food prices dataset must contain valid headers and rows'],
      warnings,
      records: []
    };
  }

  const requiredHeaders = ['ID', 'Item Name', 'Category', 'Serving / Pack', 'Price (₹)', 'Protein / 100g', 'Tier'];
  const missingHeaders = requiredHeaders.filter(h => !csvData.headers.includes(h));
  if (missingHeaders.length > 0) {
    return {
      isValid: false,
      recordCount: 0,
      errors: [`Food prices CSV missing required columns: ${missingHeaders.join(', ')}`],
      warnings,
      records: []
    };
  }

  const seenIds = new Set();
  const validRecords = [];

  csvData.rows.forEach((row, index) => {
    const rowNum = index + 2; // 1-based, accounting for header
    const rawId = row['ID'];
    const id = parseInt(rawId, 10);

    if (isNaN(id) || id <= 0) {
      errors.push(`Row ${rowNum}: Invalid or non-positive ID "${rawId}"`);
      return;
    }

    if (seenIds.has(id)) {
      errors.push(`Row ${rowNum}: Duplicate food ID "${id}" detected`);
      return;
    }
    seenIds.add(id);

    const itemName = row['Item Name'];
    if (!itemName || itemName.trim() === '') {
      errors.push(`Row ${rowNum}: Missing or empty "Item Name"`);
      return;
    }

    const category = row['Category'];
    if (!category || category.trim() === '') {
      errors.push(`Row ${rowNum}: Missing or empty "Category"`);
      return;
    }

    const servingPack = row['Serving / Pack'];
    if (!servingPack || servingPack.trim() === '') {
      errors.push(`Row ${rowNum}: Missing or empty "Serving / Pack"`);
      return;
    }

    // Parse Price (₹) - remove currency symbol and commas
    const rawPrice = row['Price (₹)'];
    const cleanPriceStr = String(rawPrice).replace(/[₹,]/g, '').trim();
    const price = parseFloat(cleanPriceStr);
    if (isNaN(price) || price < 0) {
      errors.push(`Row ${rowNum} ("${itemName}"): Invalid price "${rawPrice}"`);
      return;
    }

    // Parse Protein / 100g - remove 'g' suffix
    const rawProtein = row['Protein / 100g'];
    const cleanProteinStr = String(rawProtein).replace(/g/gi, '').trim();
    const proteinPer100g = parseFloat(cleanProteinStr);
    if (isNaN(proteinPer100g) || proteinPer100g < 0) {
      errors.push(`Row ${rowNum} ("${itemName}"): Invalid protein "${rawProtein}"`);
      return;
    }

    const tier = row['Tier'];
    if (!tier || tier.trim() === '') {
      errors.push(`Row ${rowNum}: Missing or empty "Tier"`);
      return;
    }

    validRecords.push({
      id,
      itemName: itemName.trim(),
      category: category.trim(),
      servingPack: servingPack.trim(),
      priceRaw: String(rawPrice).trim(),
      price,
      proteinRaw: String(rawProtein).trim(),
      proteinPer100g,
      tier: tier.trim()
    });
  });

  return {
    isValid: errors.length === 0 && validRecords.length > 0,
    recordCount: validRecords.length,
    errors,
    warnings,
    records: validRecords
  };
}

/**
 * Validates the cleaned staples dataset.
 * 
 * @param {{ headers: string[], rows: object[] }} csvData - Parsed CSV data.
 * @returns {{ isValid: boolean, recordCount: number, errors: string[], warnings: string[], records: Array }}
 */
export function validateCleanStaples(csvData) {
  const errors = [];
  const warnings = [];

  if (!csvData || !Array.isArray(csvData.headers) || !Array.isArray(csvData.rows)) {
    return {
      isValid: false,
      recordCount: 0,
      errors: ['Clean staples dataset must contain valid headers and rows'],
      warnings,
      records: []
    };
  }

  const requiredHeaders = [
    'ID', 'Item Name', 'Category', 'pack_size_g', 'price_clean',
    'protein_clean', 'price_per_100g', 'cost_per_10g_protein', 'Tier'
  ];

  const missingHeaders = requiredHeaders.filter(h => !csvData.headers.includes(h));
  if (missingHeaders.length > 0) {
    return {
      isValid: false,
      recordCount: 0,
      errors: [`Clean staples CSV missing required columns: ${missingHeaders.join(', ')}`],
      warnings,
      records: []
    };
  }

  const seenIds = new Set();
  const validRecords = [];

  csvData.rows.forEach((row, index) => {
    const rowNum = index + 2;
    const id = parseInt(row['ID'], 10);
    if (isNaN(id) || id <= 0) {
      errors.push(`Row ${rowNum}: Invalid ID "${row['ID']}"`);
      return;
    }

    if (seenIds.has(id)) {
      errors.push(`Row ${rowNum}: Duplicate ID "${id}" detected`);
      return;
    }
    seenIds.add(id);

    const itemName = row['Item Name'];
    if (!itemName || itemName.trim() === '') {
      errors.push(`Row ${rowNum}: Missing or empty "Item Name"`);
      return;
    }

    const category = row['Category'];
    if (!category || category.trim() === '') {
      errors.push(`Row ${rowNum}: Missing or empty "Category"`);
      return;
    }

    const packSizeG = parseFloat(row['pack_size_g']);
    if (isNaN(packSizeG) || packSizeG <= 0) {
      errors.push(`Row ${rowNum} ("${itemName}"): Invalid pack_size_g "${row['pack_size_g']}"`);
      return;
    }

    const priceClean = parseFloat(row['price_clean']);
    if (isNaN(priceClean) || priceClean <= 0) {
      errors.push(`Row ${rowNum} ("${itemName}"): Invalid price_clean "${row['price_clean']}"`);
      return;
    }

    const proteinClean = parseFloat(row['protein_clean']);
    if (isNaN(proteinClean) || proteinClean <= 0) {
      errors.push(`Row ${rowNum} ("${itemName}"): Invalid protein_clean "${row['protein_clean']}"`);
      return;
    }

    const pricePer100g = parseFloat(row['price_per_100g']);
    if (isNaN(pricePer100g) || pricePer100g <= 0) {
      errors.push(`Row ${rowNum} ("${itemName}"): Invalid price_per_100g "${row['price_per_100g']}"`);
      return;
    }

    const costPer10gProtein = parseFloat(row['cost_per_10g_protein']);
    if (isNaN(costPer10gProtein) || costPer10gProtein <= 0) {
      errors.push(`Row ${rowNum} ("${itemName}"): Invalid cost_per_10g_protein "${row['cost_per_10g_protein']}"`);
      return;
    }

    const tier = row['Tier'];
    if (!tier || tier.trim() === '') {
      errors.push(`Row ${rowNum} ("${itemName}"): Missing or empty "Tier"`);
      return;
    }

    // Verify derived calculations consistency (within tolerance of 0.05 for rounding)
    const expectedPricePer100g = (priceClean / packSizeG) * 100;
    if (Math.abs(expectedPricePer100g - pricePer100g) > 0.05) {
      warnings.push(`Row ${rowNum} ("${itemName}"): price_per_100g (${pricePer100g}) deviates from expected (${expectedPricePer100g.toFixed(2)})`);
    }

    const expectedCostPer10gProtein = ((priceClean / packSizeG * 100) / proteinClean) * 10;
    if (Math.abs(expectedCostPer10gProtein - costPer10gProtein) > 0.05) {
      warnings.push(`Row ${rowNum} ("${itemName}"): cost_per_10g_protein (${costPer10gProtein}) deviates from expected (${expectedCostPer10gProtein.toFixed(2)})`);
    }

    validRecords.push({
      id,
      itemName: itemName.trim(),
      category: category.trim(),
      packSizeG,
      priceClean,
      proteinClean,
      pricePer100g,
      costPer10gProtein,
      tier: tier.trim().toLowerCase()
    });
  });

  return {
    isValid: errors.length === 0 && validRecords.length > 0,
    recordCount: validRecords.length,
    errors,
    warnings,
    records: validRecords
  };
}

/**
 * Validates the nutrition dataset.
 * 
 * @param {{ headers: string[], rows: object[] }} csvData - Parsed CSV data.
 * @returns {{ isValid: boolean, recordCount: number, errors: string[], warnings: string[], records: Array }}
 */
export function validateNutrition(csvData) {
  const errors = [];
  const warnings = [];

  if (!csvData || !Array.isArray(csvData.headers) || !Array.isArray(csvData.rows)) {
    return {
      isValid: false,
      recordCount: 0,
      errors: ['Nutrition dataset must contain valid headers and rows'],
      warnings,
      records: []
    };
  }

  const requiredHeaders = [
    'Dish Name', 'Calories (kcal)', 'Carbohydrates (g)', 'Protein (g)', 'Fats (g)',
    'Free Sugar (g)', 'Fibre (g)', 'Sodium (mg)', 'Calcium (mg)', 'Iron (mg)',
    'Vitamin C (mg)', 'Folate (µg)'
  ];

  const missingHeaders = requiredHeaders.filter(h => !csvData.headers.includes(h));
  if (missingHeaders.length > 0) {
    return {
      isValid: false,
      recordCount: 0,
      errors: [`Nutrition CSV missing required columns: ${missingHeaders.join(', ')}`],
      warnings,
      records: []
    };
  }

  const seenDishNames = new Set();
  let missingVitaminCCount = 0;
  let missingFolateCount = 0;
  const validRecords = [];

  csvData.rows.forEach((row, index) => {
    const rowNum = index + 2;
    const dishName = row['Dish Name'];

    if (!dishName || dishName.trim() === '') {
      errors.push(`Row ${rowNum}: Missing or empty "Dish Name"`);
      return;
    }

    const trimmedDishName = dishName.trim();
    if (seenDishNames.has(trimmedDishName.toLowerCase())) {
      errors.push(`Row ${rowNum}: Duplicate dish name "${trimmedDishName}" detected`);
      return;
    }
    seenDishNames.add(trimmedDishName.toLowerCase());

    // Helper for mandatory non-negative numeric columns
    const parseMandatoryFloat = (colName) => {
      const rawVal = row[colName];
      if (rawVal === undefined || rawVal === '') {
        errors.push(`Row ${rowNum} ("${trimmedDishName}"): Missing mandatory value for "${colName}"`);
        return null;
      }
      const num = parseFloat(rawVal);
      if (isNaN(num) || num < 0) {
        errors.push(`Row ${rowNum} ("${trimmedDishName}"): Invalid non-negative number for "${colName}" ("${rawVal}")`);
        return null;
      }
      return num;
    };

    const calories = parseMandatoryFloat('Calories (kcal)');
    const carbohydrates = parseMandatoryFloat('Carbohydrates (g)');
    const protein = parseMandatoryFloat('Protein (g)');
    const fats = parseMandatoryFloat('Fats (g)');
    const freeSugar = parseMandatoryFloat('Free Sugar (g)');
    const fibre = parseMandatoryFloat('Fibre (g)');
    const sodium = parseMandatoryFloat('Sodium (mg)');
    const calcium = parseMandatoryFloat('Calcium (mg)');
    const iron = parseMandatoryFloat('Iron (mg)');

    if (calories === null || carbohydrates === null || protein === null || fats === null ||
        freeSugar === null || fibre === null || sodium === null || calcium === null || iron === null) {
      return; // Skip invalid row
    }

    // Optional micronutrient: Vitamin C
    let vitaminC = null;
    const rawVitC = row['Vitamin C (mg)'];
    if (rawVitC === undefined || rawVitC === '') {
      missingVitaminCCount++;
    } else {
      const parsedVitC = parseFloat(rawVitC);
      if (isNaN(parsedVitC) || parsedVitC < 0) {
        errors.push(`Row ${rowNum} ("${trimmedDishName}"): Invalid value for "Vitamin C (mg)" ("${rawVitC}")`);
        return;
      }
      vitaminC = parsedVitC;
    }

    // Optional micronutrient: Folate
    let folate = null;
    const rawFolate = row['Folate (µg)'];
    if (rawFolate === undefined || rawFolate === '') {
      missingFolateCount++;
    } else {
      const parsedFolate = parseFloat(rawFolate);
      if (isNaN(parsedFolate) || parsedFolate < 0) {
        errors.push(`Row ${rowNum} ("${trimmedDishName}"): Invalid value for "Folate (µg)" ("${rawFolate}")`);
        return;
      }
      folate = parsedFolate;
    }

    validRecords.push({
      dishName: trimmedDishName,
      calories,
      carbohydrates,
      protein,
      fats,
      freeSugar,
      fibre,
      sodium,
      calcium,
      iron,
      vitaminC,
      folate
    });
  });

  if (missingVitaminCCount > 0) {
    warnings.push(`${missingVitaminCCount} dish record(s) have missing optional Vitamin C (mg) values`);
  }

  if (missingFolateCount > 0) {
    warnings.push(`${missingFolateCount} dish record(s) have missing optional Folate (µg) values`);
  }

  warnings.push('Serving size or reference weight is not explicitly stated in dataset headers');

  return {
    isValid: errors.length === 0 && validRecords.length > 0,
    recordCount: validRecords.length,
    errors,
    warnings,
    records: validRecords
  };
}
