// ===== COMPARE MODULE =====

/**
 * Generate a jQuery script based on template type, CMX label, and value
 */
function generateJQueryScript(templateType, cmxLabel, origValue, index) {
  var value = origValue;

  // Handle specific formatting requirements for Icon Code
  if (cmxLabel === 'Icon Code') {
    // If the user didn't include a backslash, add it
    if (!value.startsWith('\\')) {
      value = '\\' + value;
    }
  }

  // Escape backslashes and single quotes for safe JS string embedding
  var escapedValue = value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

  // Helper: trigger native DOM events so the form framework detects the change
  var fireNativeEvents = "var el = inp[0]; el.dispatchEvent(new Event('input', {bubbles:true})); el.dispatchEvent(new Event('change', {bubbles:true})); el.dispatchEvent(new Event('blur', {bubbles:true}));";

  var eqStr = (typeof index !== 'undefined' && index !== null) ? ".eq(" + index + ")" : "";

  switch (templateType) {
    case 'text-input':
      return "$(document).ready(function () { var inp = $('label:contains(\"" + cmxLabel + "\")')" + eqStr + ".closest('.dds__form__field').find('input[type=\"text\"]'); var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; nativeSetter.call(inp[0], '" + escapedValue + "'); " + fireNativeEvents + " });";

    case 'select-dropdown':
      return "$(document).ready(function () { var sel = $('label').filter(function () { return $(this).text().trim().replace(/\\s+/g, ' ') === '" + cmxLabel + "'; })" + eqStr + ".closest('.dds__select').find('select'); var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set; nativeSetter.call(sel[0], '" + escapedValue + "'); var el = sel[0]; el.dispatchEvent(new Event('change', {bubbles:true})); el.dispatchEvent(new Event('blur', {bubbles:true})); });";

    case 'tinymce-textarea':
      return "$(document).ready(function () { var lbl = $('label').filter(function() { return $(this).text().trim().replace(/\\s+/g, ' ') === '" + cmxLabel + "'; })" + eqStr + "; var tid = lbl.closest('.dds__form__field').find('textarea').attr('id'); if (typeof tinymce !== 'undefined' && tinymce.get(tid)) { var ed = tinymce.get(tid); ed.setContent('" + escapedValue + "'); ed.fire('change'); ed.setDirty(true); } else { lbl.closest('.dds__form__field').find('iframe').contents().find('body').html('<p>" + escapedValue + "</p>'); } });";

    default:
      return '';
  }
}

/**
 * Parse plain text input (label on one line, value on the next)
 * Returns a Map of label → value
 */
function parseTextToMap(text) {
  var lines = text.split('\n').map(function (line) { return line.replace(/\r$/, ''); });
  var map = {};

  for (var i = 0; i < lines.length; i++) {
    var trimmed = lines[i].trim();
    if (trimmed !== '') {
      var valueLine = (i + 1 < lines.length) ? lines[i + 1].trim() : '';
      map[trimmed] = valueLine;
    }
  }

  return map;
}

/**
 * Get the value between two labels in the raw text
 * (for manual-copy fields like Hero Description)
 */
function getValueBetweenLabels(text, startLabel, endLabel) {
  var lines = text.split('\n').map(function (line) { return line.replace(/\r$/, ''); });
  var startIndex = -1;
  var endIndex = lines.length;

  for (var i = 0; i < lines.length; i++) {
    var trimmed = lines[i].trim();
    if (trimmed === startLabel) {
      startIndex = i;
    }
    if (trimmed === endLabel && startIndex !== -1) {
      endIndex = i;
      break;
    }
  }

  if (startIndex === -1) return null;

  var valueLines = [];
  for (var j = startIndex + 1; j < endIndex; j++) {
    var t = lines[j].trim();
    if (t !== '') {
      valueLines.push(t);
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
function compareTexts(csText, cmxText) {
  var csMap = parseTextToMap(csText);
  var cmxMap = parseTextToMap(cmxText);
  var isCmxEmpty = cmxText.trim() === '';

  var scripts = [];
  var differences = [];

  // Check each comparison rule
  for (var i = 0; i < COMPARISON_RULES.length; i++) {
    var rule = COMPARISON_RULES[i];
    var csValue = csMap[rule.csLabel];
    var cmxValue = cmxMap[rule.cmxLabel];

    var isCsEmpty = (csValue === undefined || csValue === '');
    var needsUpdate = false;
    var matchReason = '';

    if (isCsEmpty) {
      needsUpdate = false;
      matchReason = 'Empty in Content-Studio';
    } else if (isCmxEmpty || cmxValue === undefined || csValue !== cmxValue) {
      needsUpdate = true;
    } else {
      needsUpdate = false;
      matchReason = 'Values match';
    }

    if (needsUpdate) {
      var script = generateJQueryScript(rule.templateType, rule.cmxLabel, csValue);
      if (script) {
        scripts.push(script);
      }
    }

    differences.push({
      csLabel: rule.csLabel,
      cmxLabel: rule.cmxLabel,
      csValue: csValue || '(empty)',
      cmxValue: cmxValue || '(empty)',
      needsUpdate: needsUpdate,
      matchReason: matchReason
    });
  }

  // Check manual-copy fields (generate scripts + differences + warnings)
  var warnings = [];
  for (var j = 0; j < MANUAL_FIELDS.length; j++) {
    var field = MANUAL_FIELDS[j];
    var csVal = getValueBetweenLabels(csText, field.csLabel, field.csEndLabel);
    var cmxVal = cmxMap[field.cmxLabel];

    var isCsEmpty = (csVal === null || csVal === '');
    var needsUpdate = false;
    var matchReason = '';

    if (isCsEmpty) {
      needsUpdate = false;
      matchReason = 'Empty in Content-Studio';
    } else if (isCmxEmpty || cmxVal === undefined || csVal !== cmxVal) {
      needsUpdate = true;
    } else {
      needsUpdate = false;
      matchReason = 'Values match';
    }

    if (needsUpdate) {
      // Generate jQuery script
      var manualScript = generateJQueryScript(field.templateType, field.cmxLabel, csVal);
      if (manualScript) {
        scripts.push(manualScript);
      }
      // Keep warning
      warnings.push(field.warningText);
    }

    differences.push({
      csLabel: field.csLabel,
      cmxLabel: field.cmxLabel,
      csValue: csVal || '(empty)',
      cmxValue: cmxVal || '(empty)',
      needsUpdate: needsUpdate,
      matchReason: matchReason
    });
  }

  return { scripts: scripts, warnings: warnings, differences: differences };
}

/**
 * Parse Content Studio FAQ plain text into head and items array
 */
function parseCsFaq(text) {
  var lines = text.split('\n').map(function (line) { return line.replace(/\r$/, ''); });
  var head = { title: '', description: '', header: '' };
  var items = [];
  var state = 'search_head';

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;

    if (state === 'search_head') {
      if (line === 'Title') {
        head.title = lines[++i] ? lines[i].trim() : '';
      } else if (line === 'Description') {
        head.description = lines[++i] ? lines[i].trim() : '';
      } else if (line === 'Header') {
        head.header = lines[++i] ? lines[i].trim() : '';
        state = 'search_items';
      }
    } else if (state === 'search_items' || state === 'read_items') {
      if (line === 'FAQ Question') {
        var q = lines[++i] ? lines[i].trim() : '';
        items.push({ question: q, description: '' });
        state = 'read_items';
      } else if (line === 'Description' && items.length > 0) {
        var descLines = [];
        var j = i + 1;
        while (j < lines.length && lines[j].trim() !== 'FAQ Question' && !lines[j].trim().startsWith('(SEOFAQItem)') && !lines[j].trim().startsWith('Version')) {
          if (lines[j].trim()) descLines.push(lines[j].trim());
          j++;
        }
        items[items.length - 1].description = descLines.join('\n');
        i = j - 1;
      }
    }
  }
  return { head: head, items: items };
}

/**
 * Parse CMX FAQ plain text into head and items array
 */
function parseCmxFaq(text) {
  var lines = text.split('\n').map(function (line) { return line.replace(/\r$/, ''); });
  var head = { title: '', description: '', header: '' };
  var items = [];
  var state = 'search_head';

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;

    if (state === 'search_head') {
      if (line === 'Title') {
        head.title = lines[++i] ? lines[i].trim() : '';
      } else if (line === 'Header') {
        head.header = lines[++i] ? lines[i].trim() : '';
      } else if (line === 'SEO Description') {
        var descLines = [];
        var j = i + 1;
        while (j < lines.length && lines[j].trim() !== 'SEO FAQ' && lines[j].trim() !== 'Question') {
          if (lines[j].trim()) descLines.push(lines[j].trim());
          j++;
        }
        head.description = descLines.join('\n');
        i = j - 1;
        state = 'search_items';
      }
    } else if (state === 'search_items' || state === 'read_items') {
      if (line === 'Question') {
        var q = lines[++i] ? lines[i].trim() : '';
        items.push({ question: q, description: '' });
        state = 'read_items';
      } else if (line === 'SEO Description' && items.length > 0) {
        var descLines = [];
        var j = i + 1;
        while (j < lines.length && lines[j].trim() !== 'Question' && !lines[j].trim().startsWith('Version') && !lines[j].trim().startsWith('© ')) {
          if (lines[j].trim()) descLines.push(lines[j].trim());
          j++;
        }
        items[items.length - 1].description = descLines.join('\n');
        i = j - 1;
      }
    }
  }

  return { head: head, items: items };
}

/**
 * Comparison function specifically for the FAQ layout
 */
function compareFaqTexts(csText, cmxText) {
  var csData = parseCsFaq(csText);
  var cmxData = parseCmxFaq(cmxText);
  var isCmxEmpty = cmxText.trim() === '';

  var scripts = [];
  var warnings = [];
  var differences = [];

  // 1. Check questions count
  if (!isCmxEmpty) {
    if (csData.items.length > cmxData.items.length) {
      var diff = csData.items.length - cmxData.items.length;
      warnings.push("Content-Studio has " + diff + " question" + (diff > 1 ? "s" : "") + " more than CMX.");
    } else if (csData.items.length < cmxData.items.length) {
      var diff = cmxData.items.length - csData.items.length;
      warnings.push("Content-Studio has " + diff + " question" + (diff > 1 ? "s" : "") + " fewer than CMX.");
    }
  } else {
    warnings.push("CMX text is empty, generating all scripts for " + csData.items.length + " FAQ items.");
  }

  function pushDiff(csLabel, cmxLabel, csValue, cmxValue, templateType, index) {
    var isCsEmpty = (csValue === undefined || csValue === '');
    var needsUpdate = false;
    var matchReason = '';

    if (isCsEmpty) {
      needsUpdate = false;
      matchReason = 'Empty in Content-Studio';
    } else if (isCmxEmpty || typeof cmxValue === 'undefined' || csValue !== cmxValue) {
      needsUpdate = true;
    } else {
      needsUpdate = false;
      matchReason = 'Values match';
    }

    if (needsUpdate) {
      var script = generateJQueryScript(templateType, cmxLabel, csValue, index);
      if (script) {
        scripts.push(script);
      }
    }

    differences.push({
      csLabel: csLabel,
      cmxLabel: cmxLabel,
      csValue: csValue || '(empty)',
      cmxValue: cmxValue || '(empty)',
      needsUpdate: needsUpdate,
      matchReason: matchReason
    });
  }

  // 2. Compare Header
  pushDiff('Title', 'Title', csData.head.title, cmxData.head.title, 'text-input', null);
  pushDiff('Header', 'Header', csData.head.header, cmxData.head.header, 'text-input', null);
  pushDiff('Description (Header)', 'SEO Description', csData.head.description, cmxData.head.description, 'tinymce-textarea', 0);

  // 3. Compare Items
  for (var i = 0; i < csData.items.length; i++) {
    var csItem = csData.items[i];
    var cmxItem = cmxData.items[i] || { question: '', description: '' };

    pushDiff('FAQ Question ' + (i + 1), 'Question', csItem.question, cmxItem.question, 'text-input', i);
    pushDiff('FAQ Description ' + (i + 1), 'SEO Description', csItem.description, cmxItem.description, 'tinymce-textarea', i + 1);
  }

  return { scripts: scripts, warnings: warnings, differences: differences };
}
