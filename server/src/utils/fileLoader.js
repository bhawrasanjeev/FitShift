import fs from 'fs';
import path from 'path';

/**
 * Custom error types for dataset access and validation.
 */
export class DatasetNotFoundError extends Error {
  constructor(message, datasetName) {
    super(message);
    this.name = 'DatasetNotFoundError';
    this.datasetName = datasetName;
    this.statusCode = 500;
  }
}

export class DatasetParseError extends Error {
  constructor(message, datasetName) {
    super(message);
    this.name = 'DatasetParseError';
    this.datasetName = datasetName;
    this.statusCode = 500;
  }
}

export class DatasetValidationError extends Error {
  constructor(message, datasetName, validationErrors = []) {
    super(message);
    this.name = 'DatasetValidationError';
    this.datasetName = datasetName;
    this.validationErrors = validationErrors;
    this.statusCode = 500;
  }
}

/**
 * Robust RFC 4180-compliant CSV parser.
 * Handles:
 * - UTF-8 Byte-Order Marks (BOM)
 * - CRLF (\r\n) and LF (\n) line breaks
 * - Delimiters and line breaks enclosed in double quotes
 * - Escaped double quotes ("") inside quoted fields
 * - Cell whitespace trimming
 * 
 * @param {string} content - Raw CSV text.
 * @param {object} options - Parser options.
 * @param {boolean} [options.trim=true] - Whether to trim cell values.
 * @param {string} [options.delimiter=','] - Column delimiter.
 * @param {boolean} [options.hasHeader=true] - Whether first row contains headers.
 * @param {boolean} [options.asObjects=true] - Whether to return array of objects keyed by header.
 * @returns {{ headers: string[], rows: Array<object|string[]> }}
 */
export function parseCsvString(content, options = {}) {
  const trim = options.trim !== false;
  const delimiter = options.delimiter || ',';
  const hasHeader = options.hasHeader !== false;
  const asObjects = options.asObjects !== false;

  if (typeof content !== 'string') {
    throw new DatasetParseError('CSV content must be a string');
  }

  // Strip Byte-Order Mark (BOM) if present
  let text = content;
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  const rawRows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      currentRow.push(trim ? currentCell.trim() : currentCell);
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n in CRLF
      }
      currentRow.push(trim ? currentCell.trim() : currentCell);
      currentCell = '';

      // Ignore empty blank lines (e.g. trailing newlines)
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
        rawRows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentCell += char;
    }
  }

  // Push final cell and row if non-empty
  if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(trim ? currentCell.trim() : currentCell);
    if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
      rawRows.push(currentRow);
    }
  }

  if (rawRows.length === 0) {
    return { headers: [], rows: [] };
  }

  if (!hasHeader) {
    return { headers: [], rows: rawRows };
  }

  const headers = rawRows[0].map(h => (trim ? h.trim() : h));
  const dataRows = rawRows.slice(1);

  if (!asObjects) {
    return { headers, rows: dataRows };
  }

  const objectRows = dataRows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] !== undefined ? row[index] : '';
    });
    return obj;
  });

  return { headers, rows: objectRows };
}

/**
 * Loads and parses a JSON dataset file safely.
 * 
 * @param {string} filePath - Absolute or relative path to JSON file.
 * @param {string} [datasetName='json'] - Label used in error messages.
 * @returns {any} Parsed JSON content.
 */
export function loadJsonFile(filePath, datasetName = 'JSON dataset') {
  if (!fs.existsSync(filePath)) {
    throw new DatasetNotFoundError(`Dataset file not found: ${path.basename(filePath)}`, datasetName);
  }

  let rawContent;
  try {
    rawContent = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    throw new DatasetNotFoundError(`Failed to read dataset file: ${err.message}`, datasetName);
  }

  // Strip BOM if present
  if (rawContent.charCodeAt(0) === 0xFEFF) {
    rawContent = rawContent.slice(1);
  }

  try {
    return JSON.parse(rawContent);
  } catch (err) {
    throw new DatasetParseError(`Malformed JSON in dataset: ${err.message}`, datasetName);
  }
}

/**
 * Loads and parses a CSV dataset file safely.
 * 
 * @param {string} filePath - Absolute or relative path to CSV file.
 * @param {object} [options={}] - Options passed to parseCsvString.
 * @param {string} [datasetName='CSV dataset'] - Label used in error messages.
 * @returns {{ headers: string[], rows: Array<object|string[]> }}
 */
export function loadCsvFile(filePath, options = {}, datasetName = 'CSV dataset') {
  if (!fs.existsSync(filePath)) {
    throw new DatasetNotFoundError(`Dataset file not found: ${path.basename(filePath)}`, datasetName);
  }

  let rawContent;
  try {
    rawContent = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    throw new DatasetNotFoundError(`Failed to read dataset file: ${err.message}`, datasetName);
  }

  try {
    return parseCsvString(rawContent, options);
  } catch (err) {
    throw new DatasetParseError(`Failed to parse CSV dataset: ${err.message}`, datasetName);
  }
}
