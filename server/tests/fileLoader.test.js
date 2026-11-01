import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  parseCsvString,
  loadJsonFile,
  loadCsvFile,
  DatasetNotFoundError,
  DatasetParseError
} from '../src/utils/fileLoader.js';

describe('File Loader & CSV Parser Unit Tests', () => {
  let tempDir;

  before(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fitshift-loader-test-'));
  });

  after(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('parseCsvString', () => {
    it('should parse standard CSV lines with headers', () => {
      const csv = 'id,name,category\n1,Apple,Fruit\n2,Spinach,Vegetable';
      const result = parseCsvString(csv);

      assert.deepEqual(result.headers, ['id', 'name', 'category']);
      assert.equal(result.rows.length, 2);
      assert.deepEqual(result.rows[0], { id: '1', name: 'Apple', category: 'Fruit' });
      assert.deepEqual(result.rows[1], { id: '2', name: 'Spinach', category: 'Vegetable' });
    });

    it('should strip UTF-8 Byte-Order Mark (BOM)', () => {
      const csvWithBom = '\uFEFFid,name\n1,Test';
      const result = parseCsvString(csvWithBom);

      assert.deepEqual(result.headers, ['id', 'name']);
      assert.equal(result.rows[0].id, '1');
    });

    it('should handle Windows CRLF line endings', () => {
      const csv = 'id,val\r\n1,one\r\n2,two\r\n';
      const result = parseCsvString(csv);

      assert.equal(result.rows.length, 2);
      assert.equal(result.rows[0].val, 'one');
      assert.equal(result.rows[1].val, 'two');
    });

    it('should handle commas and newlines inside quoted values', () => {
      const csv = 'id,title,description\n1,"Big, Deal","Multi-line\nDescription"\n2,"Simple",Normal';
      const result = parseCsvString(csv);

      assert.equal(result.rows.length, 2);
      assert.equal(result.rows[0].title, 'Big, Deal');
      assert.equal(result.rows[0].description, 'Multi-line\nDescription');
    });

    it('should handle escaped double quotes ("")', () => {
      const csv = 'id,quote\n1,"He said ""Lift heavier"" today"';
      const result = parseCsvString(csv);

      assert.equal(result.rows[0].quote, 'He said "Lift heavier" today');
    });

    it('should handle empty input gracefully', () => {
      const result = parseCsvString('');
      assert.deepEqual(result, { headers: [], rows: [] });
    });

    it('should support asObjects: false option', () => {
      const csv = 'a,b\n1,2';
      const result = parseCsvString(csv, { asObjects: false });

      assert.deepEqual(result.headers, ['a', 'b']);
      assert.deepEqual(result.rows, [['1', '2']]);
    });
  });

  describe('loadJsonFile', () => {
    it('should load and parse valid JSON file', () => {
      const testFile = path.join(tempDir, 'valid.json');
      fs.writeFileSync(testFile, JSON.stringify({ test: 123, list: ['a', 'b'] }));

      const data = loadJsonFile(testFile, 'Test');
      assert.deepEqual(data, { test: 123, list: ['a', 'b'] });
    });

    it('should throw DatasetNotFoundError when file does not exist', () => {
      const nonExistent = path.join(tempDir, 'missing.json');
      assert.throws(
        () => loadJsonFile(nonExistent, 'MissingDataset'),
        (err) => {
          assert.ok(err instanceof DatasetNotFoundError);
          assert.equal(err.datasetName, 'MissingDataset');
          return true;
        }
      );
    });

    it('should throw DatasetParseError on malformed JSON', () => {
      const malformedFile = path.join(tempDir, 'malformed.json');
      fs.writeFileSync(malformedFile, '{ "unclosed": "string ');

      assert.throws(
        () => loadJsonFile(malformedFile, 'BadJSON'),
        (err) => {
          assert.ok(err instanceof DatasetParseError);
          assert.equal(err.datasetName, 'BadJSON');
          return true;
        }
      );
    });
  });

  describe('loadCsvFile', () => {
    it('should load and parse valid CSV file', () => {
      const testFile = path.join(tempDir, 'test.csv');
      fs.writeFileSync(testFile, 'colA,colB\nval1,val2');

      const data = loadCsvFile(testFile, {}, 'TestCSV');
      assert.deepEqual(data.headers, ['colA', 'colB']);
      assert.equal(data.rows.length, 1);
      assert.equal(data.rows[0].colA, 'val1');
    });

    it('should throw DatasetNotFoundError when CSV file does not exist', () => {
      const nonExistent = path.join(tempDir, 'non_existent.csv');
      assert.throws(
        () => loadCsvFile(nonExistent, {}, 'MissingCSV'),
        (err) => {
          assert.ok(err instanceof DatasetNotFoundError);
          return true;
        }
      );
    });
  });
});
