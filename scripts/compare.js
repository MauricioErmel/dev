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
 * HTML Sanitizer
 */
function sanitizeNode(node) {
   var temp = document.createElement('div');
   temp.appendChild(node.cloneNode(true));
   var all = temp.querySelectorAll('*');
   for (var i = 0; i < all.length; i++) {
       all[i].removeAttribute('class');
       all[i].removeAttribute('id');
       all[i].removeAttribute('style');
       all[i].removeAttribute('data-mce-style');
       all[i].removeAttribute('dir');
   }
   return temp.innerHTML.trim();
}

/**
 * Robust HTML Block Extractor
 * Converts deeply nested HTML back into linear mapped label/value pairs.
 */
function extractBlocks(html) {
  var container = document.createElement('div');
  container.innerHTML = html;
  
  var blocks = [];
  var currentBlockHtml = [];
  var currentBlockText = [];

  function flush() {
    var txt = currentBlockText.join(' ').trim();
    if (txt) {
      blocks.push({ text: txt.replace(/\s+/g, ' '), html: currentBlockHtml.join('') });
    }
    currentBlockHtml = [];
    currentBlockText = [];
  }

  for (var i = 0; i < container.childNodes.length; i++) {
    var node = container.childNodes[i];
    
    if (node.nodeName === 'BR') {
      flush();
    } else if (node.nodeType === Node.TEXT_NODE) {
      var val = node.textContent;
      if (val.trim()) {
         currentBlockText.push(val);
         currentBlockHtml.push(val);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      var blockTags = ['DIV','P','H1','H2','H3','H4','H5','H6','UL','OL','LI','BLOCKQUOTE','TR','TD'];
      var isBlock = blockTags.indexOf(node.nodeName) !== -1;
      
      if (isBlock) {
         flush();
         var txt = node.textContent.trim();
         if (txt) {
             var cleanHtml = sanitizeNode(node);
             blocks.push({ text: txt.replace(/\s+/g, ' '), html: cleanHtml });
         }
      } else {
         var txt = node.textContent.trim();
         if (txt) {
            currentBlockText.push(txt);
            var temp = document.createElement('div');
            temp.appendChild(node.cloneNode(true));
            currentBlockHtml.push(sanitizeNode(node));
         }
      }
    }
  }
  flush();

  return blocks;
}

/**
 * Parse HTML input blocks (label in one block, value in the next)
 * Returns a Map of label → value
 */
function parseTextToMap(html) {
  var blocks = extractBlocks(html);
  var map = {};

  for (var i = 0; i < blocks.length; i++) {
    var label = blocks[i].text;
    if (label !== '') {
      var valueHtml = (i + 1 < blocks.length) ? blocks[i + 1].html : '';
      map[label] = valueHtml;
    }
  }

  return map;
}

/**
 * Get the HTML value between two labels in the raw HTML blocks
 */
function getValueBetweenLabels(html, startLabel, endLabel) {
  var blocks = extractBlocks(html);
  var startIndex = -1;
  var endIndex = blocks.length;

  for (var i = 0; i < blocks.length; i++) {
    var trimmed = blocks[i].text;
    if (trimmed === startLabel) {
      startIndex = i;
    }
    if (trimmed === endLabel && startIndex !== -1) {
      endIndex = i;
      break;
    }
  }

  if (startIndex === -1) return null;

  var valueHtmls = [];
  for (var j = startIndex + 1; j < endIndex; j++) {
     valueHtmls.push(blocks[j].html);
  }

  return valueHtmls.length > 0 ? valueHtmls.join('<br>') : null;
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
 * Parse Content Studio FAQ HTML into head and items array
 */
function parseCsFaq(html) {
  var blocks = extractBlocks(html);
  var head = { title: '', description: '', header: '' };
  var items = [];
  var state = 'search_head';
  
  for (var i = 0; i < blocks.length; i++) {
    var label = blocks[i].text;
    
    if (state === 'search_head') {
      if (label === 'Title') {
        head.title = blocks[++i] ? blocks[i].html : '';
      } else if (label === 'Description') {
        head.description = blocks[++i] ? blocks[i].html : '';
      } else if (label === 'Header') {
        head.header = blocks[++i] ? blocks[i].html : '';
        state = 'search_items';
      }
    } else if (state === 'search_items' || state === 'read_items') {
      if (label === 'FAQ Question') {
        var q = blocks[++i] ? blocks[i].html : '';
        items.push({ question: q, description: '' });
        state = 'read_items';
      } else if (label === 'Description' && items.length > 0) {
        var descHtmls = [];
        var j = i + 1;
        while (j < blocks.length && blocks[j].text !== 'FAQ Question' && !blocks[j].text.startsWith('(SEOFAQItem)') && !blocks[j].text.startsWith('Version')) {
            descHtmls.push(blocks[j].html);
            j++;
        }
        items[items.length - 1].description = descHtmls.join('<br>');
        i = j - 1;
      }
    }
  }
  return { head: head, items: items };
}

/**
 * Parse CMX FAQ HTML into head and items array
 */
function parseCmxFaq(html) {
  var blocks = extractBlocks(html);
  var head = { title: '', description: '', header: '' };
  var items = [];
  var state = 'search_head';
  
  for (var i = 0; i < blocks.length; i++) {
    var label = blocks[i].text;
    
    if (state === 'search_head') {
      if (label === 'Title') {
        head.title = blocks[++i] ? blocks[i].html : '';
      } else if (label === 'Header') {
        head.header = blocks[++i] ? blocks[i].html : '';
      } else if (label === 'SEO Description') {
        var descHtmls = [];
        var j = i + 1;
        while (j < blocks.length && blocks[j].text !== 'SEO FAQ' && blocks[j].text !== 'Question') {
            descHtmls.push(blocks[j].html);
            j++;
        }
        head.description = descHtmls.join('<br>');
        i = j - 1;
        state = 'search_items';
      }
    } else if (state === 'search_items' || state === 'read_items') {
      if (label === 'Question') {
        var q = blocks[++i] ? blocks[i].html : '';
        items.push({ question: q, description: '' });
        state = 'read_items';
      } else if (label === 'SEO Description' && items.length > 0) {
        var descHtmls = [];
        var j = i + 1;
        while (j < blocks.length && blocks[j].text !== 'Question' && !blocks[j].text.startsWith('Version') && !blocks[j].text.startsWith('© ')) {
            descHtmls.push(blocks[j].html);
            j++;
        }
        items[items.length - 1].description = descHtmls.join('<br>');
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
    
    pushDiff('FAQ Question ' + (i+1), 'Question', csItem.question, cmxItem.question, 'text-input', i);
    pushDiff('FAQ Description ' + (i+1), 'SEO Description', csItem.description, cmxItem.description, 'tinymce-textarea', i + 1);
  }
  
  return { scripts: scripts, warnings: warnings, differences: differences };
}
