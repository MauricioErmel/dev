// ===== COMPARE MODULE =====

/**
 * Generate a jQuery script based on template type, CMX label, and value
 */
function generateJQueryScript(templateType, cmxLabel, origValue) {
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

  switch (templateType) {
    case 'text-input':
      return "$(document).ready(function () { var inp = $('label:contains(\"" + cmxLabel + "\")').closest('.dds__form__field').find('input[type=\"text\"]'); var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; nativeSetter.call(inp[0], '" + escapedValue + "'); " + fireNativeEvents + " });";

    case 'select-dropdown':
      return "$(document).ready(function () { var sel = $('label').filter(function () { return $(this).text().trim().replace(/\\s+/g, ' ') === '" + cmxLabel + "'; }).closest('.dds__select').find('select'); var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set; nativeSetter.call(sel[0], '" + escapedValue + "'); var el = sel[0]; el.dispatchEvent(new Event('change', {bubbles:true})); el.dispatchEvent(new Event('blur', {bubbles:true})); });";

    case 'tinymce-textarea':
      return "$(document).ready(function () { var lbl = $('label').filter(function() { return $(this).text().trim().replace(/\\s+/g, ' ') === '" + cmxLabel + "'; }); var tid = lbl.closest('.dds__form__field').find('textarea').attr('id'); if (typeof tinymce !== 'undefined' && tinymce.get(tid)) { var ed = tinymce.get(tid); ed.setContent('" + escapedValue + "'); ed.fire('change'); ed.setDirty(true); } else { lbl.closest('.dds__form__field').find('iframe').contents().find('body').html('<p>" + escapedValue + "</p>'); } });";

    default:
      return '';
  }
}

// ===== HTML PARSING UTILITIES =====

/**
 * Parse HTML source code into a label→value map.
 * Looks for <label> elements and extracts values from their
 * sibling/nearby input, select, or textarea elements.
 * @param {string} html - raw HTML string
 * @returns {object} map of { labelText: value }
 */
function parseHtmlToMap(html) {
  if (!html || !html.trim()) return {};

  var parser = new DOMParser();
  var doc = parser.parseFromString(html, 'text/html');
  var map = {};

  // Find all label elements
  var labels = doc.querySelectorAll('label');
  for (var i = 0; i < labels.length; i++) {
    var labelEl = labels[i];
    var labelText = labelEl.textContent.trim().replace(/\s+/g, ' ');
    if (!labelText) continue;

    // Try to find the associated form field
    var container = labelEl.closest('.dds__form__field') ||
                    labelEl.closest('.dds__select') ||
                    labelEl.parentElement;

    if (!container) continue;

    var value = '';

    // Try: input[type=text]
    var input = container.querySelector('input[type="text"]');
    if (input) {
      value = input.getAttribute('value') || input.value || '';
      map[labelText] = value;
      continue;
    }

    // Try: select
    var select = container.querySelector('select');
    if (select) {
      var selectedOpt = select.querySelector('option[selected]');
      if (selectedOpt) {
        value = selectedOpt.getAttribute('value') || selectedOpt.textContent.trim();
      } else {
        value = select.getAttribute('value') || '';
      }
      map[labelText] = value;
      continue;
    }

    // Try: textarea (including tinymce)
    var textarea = container.querySelector('textarea');
    if (textarea) {
      value = textarea.textContent || textarea.value || '';
      map[labelText] = value;
      continue;
    }

    // Try: iframe (tinymce rendered)
    var iframe = container.querySelector('iframe');
    if (iframe) {
      // Can't access cross-origin iframe content via DOMParser,
      // but the src attribute or data might contain relevant info
      map[labelText] = '(iframe content)';
      continue;
    }

    // Try: any input (hidden, etc)
    var anyInput = container.querySelector('input');
    if (anyInput) {
      value = anyInput.getAttribute('value') || anyInput.value || '';
      map[labelText] = value;
      continue;
    }

    // If label for attribute is set, try by id
    var forId = labelEl.getAttribute('for');
    if (forId) {
      var target = doc.getElementById(forId);
      if (target) {
        value = target.getAttribute('value') || target.textContent || '';
        map[labelText] = value;
      }
    }
  }

  return map;
}

/**
 * Extract image src URLs from HTML source code.
 * @param {string} html - raw HTML string
 * @param {string} mode - 'cs' for Content-Studio, 'cmx' for CMX
 * @returns {string[]} array of src URLs (1st and 2nd occurrences)
 */
function extractSrcUrls(html, mode) {
  if (!html || !html.trim()) return [];

  var urls = [];

  if (mode === 'cs') {
    // Content-Studio: find src= values that appear after "Source: DAM"
    // Pattern: Source: DAM" src="URL"
    var damRegex = /Source:\s*DAM["'][^"']*["']\s*src=["']([^"']+)["']/gi;
    var match;
    while ((match = damRegex.exec(html)) !== null) {
      urls.push(match[1]);
    }

    // Fallback: try simpler pattern if the above didn't match
    if (urls.length === 0) {
      // Try: look for src= after any "Source: DAM" text
      var parts = html.split(/Source:\s*DAM/gi);
      for (var i = 1; i < parts.length; i++) {
        var srcMatch = parts[i].match(/src=["']([^"']+)["']/i);
        if (srcMatch) {
          urls.push(srcMatch[1]);
        }
      }
    }
  } else {
    // CMX: find all src= from img tags
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    var imgs = doc.querySelectorAll('img[src]');
    for (var j = 0; j < imgs.length; j++) {
      var src = imgs[j].getAttribute('src');
      if (src && src.trim()) {
        urls.push(src.trim());
      }
    }

    // Fallback: regex for src= attributes in raw HTML
    if (urls.length === 0) {
      var imgRegex = /src=["']([^"']+)["']/gi;
      var m;
      while ((m = imgRegex.exec(html)) !== null) {
        urls.push(m[1]);
      }
    }
  }

  return urls;
}

/**
 * Main comparison function.
 * Parses HTML from Content-Studio and up to 3 CMX sections (Main, Media, IMM).
 * Only compares sections where the CMX textarea has content.
 *
 * @param {string} csHtml - Content-Studio HTML source
 * @param {string} cmxMainHtml - CMX Main section HTML (can be empty)
 * @param {string} cmxMediaHtml - CMX Media section HTML (can be empty)
 * @param {string} cmxImmHtml - CMX IMM section HTML (can be empty)
 * @returns {{ scripts: string[], warnings: string[], mainDiffs: object[], mediaDiffs: object[], immDiffs: object[] }}
 */
function compareAll(csHtml, cmxMainHtml, cmxMediaHtml, cmxImmHtml) {
  var csMap = parseHtmlToMap(csHtml);
  var scripts = [];
  var warnings = [];
  var mainDiffs = [];
  var mediaDiffs = [];
  var immDiffs = [];

  // ===== MAIN SECTION =====
  var cmxMainMap = parseHtmlToMap(cmxMainHtml);
  var isCmxMainEmpty = !cmxMainHtml || !cmxMainHtml.trim();

  for (var i = 0; i < COMPARISON_RULES.length; i++) {
    var rule = COMPARISON_RULES[i];
    var csValue = csMap[rule.csLabel];
    var cmxValue = cmxMainMap[rule.cmxLabel];

    var isCsEmpty = (csValue === undefined || csValue === '');
    var needsUpdate = false;
    var matchReason = '';

    if (isCsEmpty) {
      needsUpdate = false;
      matchReason = 'Empty in Content-Studio';
    } else if (isCmxMainEmpty || cmxValue === undefined || csValue !== cmxValue) {
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

    mainDiffs.push({
      csLabel: rule.csLabel,
      cmxLabel: rule.cmxLabel,
      csValue: csValue || '(empty)',
      cmxValue: cmxValue || '(empty)',
      needsUpdate: needsUpdate,
      matchReason: matchReason
    });
  }

  // ===== MEDIA SECTION =====
  var hasMedia = cmxMediaHtml && cmxMediaHtml.trim();
  if (hasMedia) {
    var csSrcUrls = extractSrcUrls(csHtml, 'cs');
    var cmxSrcUrls = extractSrcUrls(cmxMediaHtml, 'cmx');

    for (var m = 0; m < MEDIA_RULES.length; m++) {
      var mediaRule = MEDIA_RULES[m];
      var csUrl = csSrcUrls[mediaRule.index] || '';
      var cmxUrl = cmxSrcUrls[mediaRule.index] || '';

      var isCsUrlEmpty = !csUrl;
      var needsMediaUpdate = false;
      var mediaMatchReason = '';

      if (isCsUrlEmpty) {
        needsMediaUpdate = false;
        mediaMatchReason = 'Empty in Content-Studio';
      } else if (!cmxUrl || csUrl !== cmxUrl) {
        needsMediaUpdate = true;
      } else {
        needsMediaUpdate = false;
        mediaMatchReason = 'Values match';
      }

      mediaDiffs.push({
        csLabel: mediaRule.csLabel,
        cmxLabel: mediaRule.cmxLabel,
        csValue: csUrl || '(empty)',
        cmxValue: cmxUrl || '(empty)',
        needsUpdate: needsMediaUpdate,
        matchReason: mediaMatchReason,
        isImage: true
      });
    }
  }

  // ===== IMM SECTION =====
  var hasImm = cmxImmHtml && cmxImmHtml.trim();
  if (hasImm) {
    var cmxImmMap = parseHtmlToMap(cmxImmHtml);

    for (var k = 0; k < IMM_RULES.length; k++) {
      var immRule = IMM_RULES[k];
      var csImmValue = csMap[immRule.csLabel];
      var cmxImmValue = cmxImmMap[immRule.cmxLabel];

      var isCsImmEmpty = (csImmValue === undefined || csImmValue === '');
      var needsImmUpdate = false;
      var immMatchReason = '';

      if (isCsImmEmpty) {
        needsImmUpdate = false;
        immMatchReason = 'Empty in Content-Studio';
      } else if (cmxImmValue === undefined || csImmValue !== cmxImmValue) {
        needsImmUpdate = true;
      } else {
        needsImmUpdate = false;
        immMatchReason = 'Values match';
      }

      // Generate jQuery script only for non-image fields
      if (needsImmUpdate && immRule.templateType !== 'image') {
        var immScript = generateJQueryScript(immRule.templateType, immRule.cmxLabel, csImmValue);
        if (immScript) {
          scripts.push(immScript);
        }
      }

      immDiffs.push({
        csLabel: immRule.csLabel,
        cmxLabel: immRule.cmxLabel,
        csValue: csImmValue || '(empty)',
        cmxValue: cmxImmValue || '(empty)',
        needsUpdate: needsImmUpdate,
        matchReason: immMatchReason,
        isImage: immRule.templateType === 'image'
      });
    }
  }

  return {
    scripts: scripts,
    warnings: warnings,
    mainDiffs: mainDiffs,
    mediaDiffs: mediaDiffs,
    immDiffs: immDiffs
  };
}
