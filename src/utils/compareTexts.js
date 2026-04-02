import { COMPARISON_RULES, MANUAL_FIELDS, generateJQueryScript } from '../data/comparisonRules';

/**
 * Parse plain text input (label on one line, value on the next)
 * Returns a Map of label → value
 */
function parseTextToMap(text) {
  const lines = text.split('\n').map((line) => line.replace(/\r$/, ''));
  const map = new Map();

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed !== '') {
      // The value is the next non-empty concept:
      // label line, then value line immediately below
      const valueLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      map.set(trimmed, valueLine);
    }
  }

  return map;
}

/**
 * Get the value between two labels in the raw text
 * (for manual-copy fields like Hero Description)
 */
function getValueBetweenLabels(text, startLabel, endLabel) {
  const lines = text.split('\n').map((line) => line.replace(/\r$/, ''));
  let startIndex = -1;
  let endIndex = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === startLabel) {
      startIndex = i;
    }
    if (trimmed === endLabel && startIndex !== -1) {
      endIndex = i;
      break;
    }
  }

  if (startIndex === -1) return null;

  // Get the value line(s) between startLabel and endLabel
  const valueLines = [];
  for (let i = startIndex + 1; i < endIndex; i++) {
    const trimmed = lines[i].trim();
    if (trimmed !== '') {
      valueLines.push(trimmed);
    }
  }

  return valueLines.length > 0 ? valueLines.join('\n') : null;
}

/**
 * Main comparison function
 * @param {string} csText - Content-Studio raw text
 * @param {string} cmxText - CMX raw text (can be empty)
 * @returns {{ scripts: string[], warnings: string[], differences: object[] }}
 */
export function compareTexts(csText, cmxText) {
  const csMap = parseTextToMap(csText);
  const cmxMap = parseTextToMap(cmxText);
  const isCmxEmpty = cmxText.trim() === '';

  const scripts = [];
  const differences = [];

  // Check each comparison rule
  for (const rule of COMPARISON_RULES) {
    const csValue = csMap.get(rule.csLabel);

    // Skip if Content-Studio doesn't have this field
    if (csValue === undefined || csValue === '') continue;

    const cmxValue = cmxMap.get(rule.cmxLabel);

    // Generate script if CMX is empty (fill all) or values differ
    if (isCmxEmpty || cmxValue === undefined || csValue !== cmxValue) {
      const script = generateJQueryScript(rule.templateType, rule.cmxLabel, csValue);
      if (script) {
        scripts.push(script);
        differences.push({
          csLabel: rule.csLabel,
          cmxLabel: rule.cmxLabel,
          csValue,
          cmxValue: cmxValue || '(empty)',
        });
      }
    }
  }

  // Check manual-copy fields
  const warnings = [];
  for (const field of MANUAL_FIELDS) {
    const csValue = getValueBetweenLabels(csText, field.csLabel, field.csEndLabel);
    if (csValue === null) continue; // No data in CS for this field

    const cmxValue = cmxMap.get(field.cmxLabel);

    if (isCmxEmpty || cmxValue === undefined || csValue !== cmxValue) {
      warnings.push(field.warningText);
    }
  }

  return { scripts, warnings, differences };
}
