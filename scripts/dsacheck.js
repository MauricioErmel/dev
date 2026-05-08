// ===== DSA CHECK MODULE =====
// Analyzes pasted CMX query results for blank Display Names and missing profiles
(function () {
  'use strict';

  // Profile code → CMX checkbox label mapping
  var FULL_TARGETS = [
    "Romanian - Romania (RO-RO)", "French - Canada (FR-CA)", "Hungarian - Hungary (HU-HU)",
    "Slovak - Slovakia (SK-SK)", "Portuguese - Portugal (PT-PT)", "Greek - Greece (EL-GR)",
    "Turkish - Turkey (TR-TR)", "Norwegian - Norway (NO-NO)", "Danish - Denmark (DA-DK)",
    "Swedish - Sweden (SV-SE)", "Finnish - Finland (FI-FI)", "Italian - Italy (IT-IT)",
    "Japanese - Japan (JA-JP)", "Portuguese - Brazil (PT-BR)", "Polish - Poland (PL-PL)",
    "Chinese - China (ZH-CN)", "Korean - Korea (KO-KR)", "Czech - Czech Republic (CS-CZ)",
    "Chinese - Taiwan (ZH-TW)", "German - Germany (DE-DE)", "Dutch - Netherlands (NL-NL)",
    "Dutch - Belgium (NL-BE)", "Chinese - Hong Kong (ZH-HK)", "Russian - Russia (RU-RU)",
    "Spanish - Spain (ES-ES)", "French - France (FR-FR)", "Russian - Ukraine (RU-UA)",
    "Spanish - Mexico (ES-MX)", "Spanish - Latin America (Pages & Web Parts) (ES-LA)",
    "German - Austria (DE-AT)", "German - Switzerland (DE-CH)",
    "French - Belgium (FR-BE)", "French - Switzerland (FR-CH)", "French - Luxembourg (FR-LU)",
    "Spanish - Argentina (ES-AR)", "Spanish - Chile (ES-CL)",
    "Spanish - Colombia (ES-CO)", "Spanish - Peru (ES-PE)", "Spanish - Puerto Rico (ES-PR)",
    "Spanish - United States (ES-US)"
  ];
  var PROFILE_LABELS = {};
  FULL_TARGETS.forEach(function(t) {
    var match = t.match(/\((.*?)\)/);
    if (match) {
      var code = match[1].toLowerCase().replace('-', '/');
      PROFILE_LABELS[code] = t;
    }
  });

  // Only these profiles are checked for "missing"
  var DSA_MISSING_PROFILES = [
    'ro/ro', 'fr/ca', 'hu/hu', 'sk/sk', 'pt/pt', 'el/gr', 'tr/tr', 'no/no', 'da/dk',
    'sv/se', 'fi/fi', 'it/it', 'ja/jp', 'pt/br', 'pl/pl', 'zh/cn', 'ko/kr', 'cs/cz',
    'zh/tw', 'de/de', 'nl/nl', 'nl/be', 'zh/hk', 'ru/ru', 'es/es', 'fr/fr', 'ru/ua',
    'es/mx', 'es/la', 'de/at', 'de/ch', 'fr/be', 'fr/ch', 'fr/lu',
    'es/ar', 'es/cl', 'es/co', 'es/pe', 'es/pr', 'es/us'
  ];

  // DOM references
  var textarea = document.getElementById('dsa-textarea');
  var btnAnalyze = document.getElementById('dsa-btn-analyze');
  var btnClear = document.getElementById('dsa-btn-clear');
  var resultSection = document.getElementById('dsa-result-section');
  var emptyConsDetails = document.getElementById('dsa-empty-consumer-details');
  var emptyCommDetails = document.getElementById('dsa-empty-commercial-details');
  var groupedDisplayNamesDetails = document.getElementById('dsa-grouped-display-names');

  var missingConsDetails = document.getElementById('dsa-missing-consumer-details');
  var missingCommDetails = document.getElementById('dsa-missing-commercial-details');
  
  var scriptOutputEmptyCons = document.getElementById('dsa-script-output-empty-cons');
  var scriptOutputEmptyComm = document.getElementById('dsa-script-output-empty-comm');
  var scriptOutputMissingCons = document.getElementById('dsa-script-output-missing-cons');
  var scriptOutputMissingComm = document.getElementById('dsa-script-output-missing-comm');

  var toggleEmptyCons = document.getElementById('dsa-toggle-script-empty-cons');
  var toggleEmptyComm = document.getElementById('dsa-toggle-script-empty-comm');
  var toggleMissingCons = document.getElementById('dsa-toggle-script-missing-cons');
  var toggleMissingComm = document.getElementById('dsa-toggle-script-missing-comm');

  var summaryText = document.getElementById('dsa-summary-text');
  var publishDetails = document.getElementById('dsa-publish-details');
  var scriptOutputPublish = document.getElementById('dsa-script-output-publish');
  var togglePublish = document.getElementById('dsa-toggle-script-publish');

  var currentScriptEmptyCons = '';
  var currentScriptEmptyComm = '';
  var currentScriptMissingCons = '';
  var currentScriptMissingComm = '';
  var currentScriptPublish = '';
  var currentSummaryContent = '';

  function toggleScript(btn, outputDiv) {
    if (outputDiv.classList.contains('hidden')) {
      outputDiv.classList.remove('hidden');
      btn.textContent = 'Hide Script';
    } else {
      outputDiv.classList.add('hidden');
      btn.textContent = 'Show Script';
    }
  }

  if (toggleEmptyCons) toggleEmptyCons.addEventListener('click', function() { toggleScript(toggleEmptyCons, scriptOutputEmptyCons); });
  if (toggleEmptyComm) toggleEmptyComm.addEventListener('click', function() { toggleScript(toggleEmptyComm, scriptOutputEmptyComm); });
  if (toggleMissingCons) toggleMissingCons.addEventListener('click', function() { toggleScript(toggleMissingCons, scriptOutputMissingCons); });
  if (toggleMissingComm) toggleMissingComm.addEventListener('click', function() { toggleScript(toggleMissingComm, scriptOutputMissingComm); });
  if (togglePublish) togglePublish.addEventListener('click', function() { toggleScript(togglePublish, scriptOutputPublish); });

  // Enable/disable analyze button
  function updateAnalyzeButton() {
    btnAnalyze.disabled = !textarea.value.trim();
  }
  textarea.addEventListener('input', updateAnalyzeButton);

  /**
   * Determine the user-friendly segment label from a raw segment string.
   */
  function getSegmentLabel(rawSegments) {
    if (rawSegments.indexOf('cnsr-Consumer') !== -1) return 'Consumer';
    if (rawSegments.indexOf('comm-Commercial') !== -1) return 'Commercial';
    return rawSegments || 'Unknown';
  }

  /**
   * Parse CMX query text into structured entries.
   * Each entry: { profile, displayName, segments, hasBlankDisplayName }
   */
  function parseDSAResults(rawText) {
    var lines = rawText.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(function (l) { return l.length > 0; });

    var singleProfile = /^[a-z]{2}\/[a-z]{2}$/;
    var segmentPattern = /^[a-z]{3,4}-[A-Z][a-zA-Z ]+/;
    var entries = [];

    var versionPattern = /^\d+\.\d+$/;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (!singleProfile.test(line)) continue;

      var profile = line;
      var displayName = '';
      var segments = '';
      var version = '';
      var hasBlankDisplayName = false;

      // Look ahead for segment pattern
      for (var j = 1; j <= 5 && (i + j) < lines.length; j++) {
        if (segmentPattern.test(lines[i + j])) {
          segments = lines[i + j];
          if (j === 1) {
            // Segment is immediately after profile → no display name
            hasBlankDisplayName = true;
          } else {
            // Line(s) between profile and segment = display name
            displayName = lines[i + 1];
          }
      // Capture version (next line after segment)
      if ((i + j + 1) < lines.length && versionPattern.test(lines[i + j + 1])) {
        version = lines[i + j + 1];
      }
      break;
    }
  }

  entries.push({
        profile: profile,
        displayName: displayName,
        segments: segments,
        version: version,
        hasBlankDisplayName: hasBlankDisplayName
      });
    }

    return entries;
  }

  /**
   * Analyze parsed entries for issues.
   * Returns { emptyDisplayNames, missingProfiles }
   */
  function analyzeDSA(entries) {
    var emptyDisplayNames = [];
    var missingProfiles = [];

    // Group by profile
    var profileMap = {};
    entries.forEach(function (entry) {
      if (!profileMap[entry.profile]) profileMap[entry.profile] = [];
      profileMap[entry.profile].push(entry);
    });

    var unpublishedProfiles = [];

    // 1. Empty Display Names — any profile+segment with blank display name
    entries.forEach(function (entry) {
      if (entry.profile.indexOf('en/') === 0) return; // Skip source language
      if (entry.hasBlankDisplayName) {
        emptyDisplayNames.push({
          profile: entry.profile,
          segment: getSegmentLabel(entry.segments)
        });
      }
    });

    // 2. Unpublished Profiles — version not ending with '0'
    entries.forEach(function (entry) {
      if (entry.profile.indexOf('en/') === 0) return; // Skip source language
      if (entry.version && !entry.version.endsWith('0')) {
        unpublishedProfiles.push({
          profile: entry.profile,
          segment: getSegmentLabel(entry.segments),
          version: entry.version
        });
      }
    });

    // 3. Missing Profiles — only pt/br, fr/fr, zh/cn
    DSA_MISSING_PROFILES.forEach(function (profile) {
      var profileEntries = profileMap[profile] || [];

      var hasConsumer = profileEntries.some(function (e) {
        return e.segments.indexOf('cnsr-Consumer') !== -1;
      });
      var hasCommercial = profileEntries.some(function (e) {
        return e.segments.indexOf('comm-Commercial') !== -1;
      });

      if (!hasConsumer && !hasCommercial) {
        missingProfiles.push({ profile: profile, segment: 'Consumer and Commercial' });
      } else {
        if (!hasConsumer) {
          missingProfiles.push({ profile: profile, segment: 'Consumer' });
        }
        if (!hasCommercial) {
          missingProfiles.push({ profile: profile, segment: 'Commercial' });
        }
      }
    });

    return {
      emptyDisplayNames: emptyDisplayNames,
      unpublishedProfiles: unpublishedProfiles,
      missingProfiles: missingProfiles
    };
  }

  /**
   * Group items by segment type and list their profiles.
   * Returns a list of strings like "Consumer (ro/ro, it/it)".
   */
  function concatenateSegments(items) {
    // 1. Group segments by profile to determine combined state
    var profileSegments = {};
    items.forEach(function (item) {
      if (!profileSegments[item.profile]) {
        profileSegments[item.profile] = {};
      }
      if (item.segment === 'Consumer and Commercial') {
        profileSegments[item.profile]['Consumer'] = true;
        profileSegments[item.profile]['Commercial'] = true;
      } else {
        profileSegments[item.profile][item.segment] = true;
      }
    });

    // 2. Group profiles by their combined segment string
    var segmentGroups = {};
    for (var profile in profileSegments) {
      var segments = Object.keys(profileSegments[profile]);
      var combinedLabel = '';
      if (segments.length === 1) {
        combinedLabel = segments[0];
      } else if (segments.length > 1) {
        var sortedSegs = segments.sort(function(a, b) {
          if (a === 'Consumer') return -1;
          if (b === 'Consumer') return 1;
          return 0;
        });
        combinedLabel = sortedSegs.join(' and ');
      }

      if (!segmentGroups[combinedLabel]) {
        segmentGroups[combinedLabel] = [];
      }
      segmentGroups[combinedLabel].push(profile);
    }

    // 3. Format result in preferred order
    var result = [];
    var order = ['Consumer', 'Commercial', 'Consumer and Commercial'];
    order.forEach(function(label) {
      if (segmentGroups[label] && segmentGroups[label].length > 0) {
        segmentGroups[label].sort();
        result.push(label + ' (' + segmentGroups[label].join(', ') + ')');
        delete segmentGroups[label];
      }
    });

    for (var label in segmentGroups) {
      if (segmentGroups[label].length > 0) {
        segmentGroups[label].sort();
        result.push(label + ' (' + segmentGroups[label].join(', ') + ')');
      }
    }

    return result;
  }

  /**
   * Format profile list with bold HTML tags.
   */
  function formatProfileListBold(items) {
    return items.map(function (item) {
      return '<strong>' + item.profile + ' (' + item.segment + ')</strong>';
    });
  }

  /**
   * Build a natural language list: "a, b and c"
   */
  function naturalList(arr) {
    if (arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr[0] + ' and ' + arr[1];
    return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  }

  /**
   * Generate the checkbox-click script for the given profile codes.
   */
  function generateScript(profileCodes) {
    if (profileCodes.length === 0) return '';

    var targetLines = profileCodes.map(function (code) {
      var label = PROFILE_LABELS[code] || code.toUpperCase();
      return '        "' + label + '"';
    });

    var lines = [
      '(function () {',
      '    const targets = [',
      targetLines.join(',\n'),
      '    ];',
      '    const norm = s => s.replace(/\\s+/g, \' \').trim();',
      '    const targetSet = new Set(targets.map(norm));',
      '    document.querySelectorAll(\'dds-label\').forEach(label => {',
      '        const text = norm(label.textContent || \'\');',
      '        if (targetSet.has(text)) {',
      '            const input = label.querySelector(\'input[type=checkbox]\');',
      '            if (input && !input.checked) {',
      '                input.click();',
      '            }',
      '        }',
      '    });',
      '})();'
    ];
    return lines.join('\n');
  }

  /**
   * Generate the row-selection script for draft profiles (by profile + version).
   */
  function generatePublishScript(unpublishedItems) {
    if (unpublishedItems.length === 0) return '';

    var profileLines = unpublishedItems.map(function(item) {
      return '    "' + item.profile + '"';
    });
    var versionLines = unpublishedItems.map(function(item) {
      return '    "' + item.version + '"';
    });

    var lines = [
      '(function () {',
      '  const profiles = [',
      profileLines.join(',\n'),
      '  ];',
      '  const versions = [',
      versionLines.join(',\n'),
      '  ];',
      '',
      '  const norm = s => (s || \'\').replace(/\\s+/g, \' \').trim().toLowerCase();',
      '  const profileSet = new Set(profiles.map(norm));',
      '  const versionSet = new Set(versions.map(norm));',
      '',
      '  document.querySelectorAll(\'div[role="row"]\').forEach(row => {',
      '    const profile = norm(row.querySelector(\'[col-id="container"] .ag-cell-value\')?.textContent);',
      '    const version = norm(row.querySelector(\'[col-id="version"] .ag-cell-value, [col-id="Version"] .ag-cell-value\')?.textContent);',
      '',
      '    if (profileSet.has(profile) && (versionSet.size === 0 || versionSet.has(version))) {',
      '      const checkbox = row.querySelector(\'[col-id="key"] input.ag-checkbox-input[type="checkbox"]\');',
      '      if (checkbox && !checkbox.checked) checkbox.click();',
      '    }',
      '  });',
      '})();'
    ];
    return lines.join('\n');
  }

  function getFlagForProfile(profileCode) {
    var prefix = profileCode.substring(0, 2).toUpperCase();
    var flags = {
      'RO': '🇷🇴', 'FR': '🇫🇷', 'HU': '🇭🇺', 'SK': '🇸🇰', 'PT': '🇵🇹',
      'EL': '🇬🇷', 'TR': '🇹🇷', 'NO': '🇳🇴', 'DA': '🇩🇰', 'SV': '🇸🇪',
      'FI': '🇫🇮', 'IT': '🇮🇹', 'JA': '🇯🇵', 'PL': '🇵🇱', 'ZH': '🇨🇳',
      'KO': '🇰🇷', 'CS': '🇨🇿', 'DE': '🇩🇪', 'NL': '🇳🇱', 'RU': '🇷🇺',
      'ES': '🇪🇸', 'EN': '🇺🇸'
    };
    return flags[prefix] || '';
  }

  function renderGroupedDisplayNames(entries) {
    var grouped = {};
    entries.forEach(function(e) {
      if (e.displayName && e.displayName.trim() !== '') {
        var dn = e.displayName.trim();
        if (!grouped[dn]) grouped[dn] = [];
        if (grouped[dn].indexOf(e.profile) === -1) {
          grouped[dn].push(e.profile);
        }
      }
    });

    var keys = Object.keys(grouped);
    if (keys.length === 0) return '<div class="mp-detail-header">No Display Names found.</div>';

    var html = '<div class="diff-table-wrapper" style="margin-top: 1rem;">' +
               '<table class="diff-table">' +
               '<thead><tr><th style="width: 30%;">Display Name</th><th>Profiles</th></tr></thead>' +
               '<tbody>';

    keys.forEach(function(dn) {
      html += '<tr>' +
              '<td style="font-weight: 600; color: #0f172a; vertical-align: top;">' + dn + '</td>' +
              '<td>' +
              '<div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">';
      
      grouped[dn].forEach(function(prof) {
        var flag = getFlagForProfile(prof);
        html += '<span style="background: white; border: 1px solid #cbd5e1; padding: 0.1rem 0.3rem; border-radius: 4px; font-size: 0.8rem; color: #475569; display: flex; align-items: center; gap: 0.2rem;">' +
                '<span>' + flag + '</span>' +
                '<span>' + prof + '</span>' +
                '</span>';
      });

      html += '</div></td></tr>';
    });

    html += '</tbody></table></div>';
    return html;
  }

  /**
   * Render the profile detail grid for empty display names.
   */
  function renderEmptyGrid(entries, emptyItems, segmentType) {
    var segmentEntries = entries.filter(function(e) { 
      return getSegmentLabel(e.segments) === segmentType && e.profile.indexOf('en/') !== 0; 
    });
    var allProfiles = [];
    var seen = {};
    segmentEntries.forEach(function (e) {
      var key = e.profile;
      if (!seen[key]) {
        seen[key] = true;
        allProfiles.push({ profile: e.profile, segment: segmentType });
      }
    });

    var html = '<div class="mp-detail-header">' +
      '<span class="mp-detail-count">' + emptyItems.length + '</span> ' + segmentType + ' profile(s) with blank Display Name' +
      '</div>';

    html += '<div class="mp-detail-grid">';
    allProfiles.forEach(function (item) {
      var isEmpty = emptyItems.some(function (e) {
        return e.profile === item.profile && e.segment === item.segment;
      });
      var statusClass = isEmpty ? 'mp-profile-missing' : 'mp-profile-ok';
      var icon = isEmpty ? '✗' : '✓';
      var tooltip = isEmpty ? 'Blank Display Name (' + item.segment + ')' : 'Has Display Name (' + item.segment + ')';

      html += '<div class="mp-profile-item ' + statusClass + '" title="' + tooltip + '">' +
        '<span class="mp-profile-icon">' + icon + '</span>' +
        '<span class="mp-profile-name">' + item.profile + '</span>' +
        '</div>';
    });
    html += '</div>';

    return html;
  }

  /**
   * Render the profile detail grid for unpublished (draft) profiles.
   */
  function renderPublishGrid(entries, unpublishedItems) {
    var allProfiles = [];
    var seen = {};
    entries.forEach(function (e) {
      if (e.profile.indexOf('en/') === 0) return; // Skip source language
      var seg = getSegmentLabel(e.segments);
      if (seg !== 'Consumer' && seg !== 'Commercial') return;

      var key = e.profile + '|' + seg;
      if (!seen[key]) {
        seen[key] = true;
        allProfiles.push({ profile: e.profile, segment: seg, version: e.version });
      }
    });

    var html = '<div class="mp-detail-header">' +
      '<span class="mp-detail-count">' + unpublishedItems.length + '</span> profile(s) in Draft that need to be published:' +
      '</div>';

    html += '<div class="mp-detail-grid">';
    allProfiles.forEach(function (item) {
      var isUnpublished = unpublishedItems.some(function (u) {
        return u.profile === item.profile && u.segment === item.segment;
      });
      var statusClass = isUnpublished ? 'mp-profile-missing' : 'mp-profile-ok';
      var icon = isUnpublished ? '✗' : '✓';
      var tooltip = isUnpublished ? 'Draft v' + item.version + ' (' + item.segment + ')' : 'Published (' + item.segment + ')';
      var segTag = item.segment === 'Consumer' ? 'cnsr' : 'comm';

      html += '<div class="mp-profile-item ' + statusClass + '" title="' + tooltip + '">' +
        '<span class="mp-profile-icon">' + icon + '</span>' +
        '<span class="mp-profile-name">' + item.profile + ' <small style="opacity:.6">(' + segTag + ')</small></span>' +
        '</div>';
    });
    html += '</div>';

    return html;
  }

  /**
   * Render missing profiles grid for a specific segment type.
   */
  function renderMissingGrid(missingItems, segmentType) {
    var segmentMissing = missingItems.filter(function(m) {
      return m.segment === segmentType || m.segment === 'Consumer and Commercial';
    });

    var html = '<div class="mp-detail-header">' +
      '<span class="mp-detail-count">' + segmentMissing.length + '</span> missing ' + segmentType + ' profile(s)' +
      '</div>';

    html += '<div class="mp-detail-grid">';
    DSA_MISSING_PROFILES.forEach(function (profile) {
      var isMissing = segmentMissing.some(function (m) {
        return m.profile === profile;
      });

      var statusClass = isMissing ? 'mp-profile-missing' : 'mp-profile-ok';
      var icon = isMissing ? '✗' : '✓';
      var tooltip = isMissing ? 'Missing ' + segmentType + ' segment' : 'Has ' + segmentType + ' segment';
      html += '<div class="mp-profile-item ' + statusClass + '" title="' + tooltip + '">' +
        '<span class="mp-profile-icon">' + icon + '</span>' +
        '<span class="mp-profile-name">' + profile + '</span>' +
        '</div>';
    });
    html += '</div>';

    return html;
  }

  /**
   * Generic copy-to-clipboard helper with button feedback.
   */
  function copyWithFeedback(text, btn) {
    if (!text) return;

    function showFeedback() {
      btn.classList.add('btn-success-state');
      var span = btn.querySelector('span');
      var originalText = span ? span.textContent : '';
      if (span) span.textContent = 'Copied!';
      setTimeout(function () {
        btn.classList.remove('btn-success-state');
        if (span) span.textContent = originalText;
      }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showFeedback).catch(function () {
        fallbackCopy(text);
        showFeedback();
      });
    } else {
      fallbackCopy(text);
      showFeedback();
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  // ===== ANALYZE =====
  btnAnalyze.addEventListener('click', function () {
    var rawText = textarea.value.trim();
    if (!rawText) return;

    var entries = parseDSAResults(rawText);
    var analysis = analyzeDSA(entries);

    // Show results
    resultSection.classList.remove('hidden');

    // --- Render publish grid ---
    publishDetails.innerHTML = renderPublishGrid(entries, analysis.unpublishedProfiles);

    var emptyCons = analysis.emptyDisplayNames.filter(function(i) { return i.segment === 'Consumer'; });
    var emptyComm = analysis.emptyDisplayNames.filter(function(i) { return i.segment === 'Commercial'; });

    emptyConsDetails.innerHTML = renderEmptyGrid(entries, emptyCons, 'Consumer');
    emptyCommDetails.innerHTML = renderEmptyGrid(entries, emptyComm, 'Commercial');

    // Grouped Display Names
    groupedDisplayNamesDetails.innerHTML = renderGroupedDisplayNames(entries);

    // --- Render missing grids ---
    missingConsDetails.innerHTML = renderMissingGrid(analysis.missingProfiles, 'Consumer');
    missingCommDetails.innerHTML = renderMissingGrid(analysis.missingProfiles, 'Commercial');

    // --- Generate Scripts ---
    var emptyConsProfiles = emptyCons.map(function(i) { return i.profile; }).filter(function(v,i,a) { return a.indexOf(v)===i; });
    var emptyCommProfiles = emptyComm.map(function(i) { return i.profile; }).filter(function(v,i,a) { return a.indexOf(v)===i; });

    var missingConsProfs = analysis.missingProfiles.filter(function(m) { return m.segment === 'Consumer' || m.segment === 'Consumer and Commercial'; }).map(function(i) { return i.profile; }).filter(function(v,i,a) { return a.indexOf(v)===i; });
    var missingCommProfs = analysis.missingProfiles.filter(function(m) { return m.segment === 'Commercial' || m.segment === 'Consumer and Commercial'; }).map(function(i) { return i.profile; }).filter(function(v,i,a) { return a.indexOf(v)===i; });

    currentScriptEmptyCons = generateScript(emptyConsProfiles);
    currentScriptEmptyComm = generateScript(emptyCommProfiles);
    currentScriptMissingCons = generateScript(missingConsProfs);
    currentScriptMissingComm = generateScript(missingCommProfs);

    scriptOutputEmptyCons.textContent = currentScriptEmptyCons || 'No script needed.';
    scriptOutputEmptyComm.textContent = currentScriptEmptyComm || 'No script needed.';
    scriptOutputMissingCons.textContent = currentScriptMissingCons || 'No script needed.';
    scriptOutputMissingComm.textContent = currentScriptMissingComm || 'No script needed.';

    // --- Generate Publish Script ---
    currentScriptPublish = generatePublishScript(analysis.unpublishedProfiles);
    scriptOutputPublish.textContent = currentScriptPublish || 'No script needed.';

    // Hide all scripts by default on new analyze
    scriptOutputEmptyCons.classList.add('hidden');
    if(toggleEmptyCons) toggleEmptyCons.textContent = 'Show Script';
    
    scriptOutputEmptyComm.classList.add('hidden');
    if(toggleEmptyComm) toggleEmptyComm.textContent = 'Show Script';

    scriptOutputMissingCons.classList.add('hidden');
    if(toggleMissingCons) toggleMissingCons.textContent = 'Show Script';

    scriptOutputMissingComm.classList.add('hidden');
    if(toggleMissingComm) toggleMissingComm.textContent = 'Show Script';

    scriptOutputPublish.classList.add('hidden');
    if(togglePublish) togglePublish.textContent = 'Show Script';

    // --- Generate Summary ---
    var summaryLines = [];

    // 1. Display Name Translation
    if (analysis.emptyDisplayNames.length > 0) {
      var emptyFormatted = concatenateSegments(analysis.emptyDisplayNames);
      summaryLines.push('Following profiles were sent for Display name translation only: ' + emptyFormatted.join(', '));
    }

    // 2. Missing Profiles
    if (analysis.missingProfiles.length > 0) {
      var missingFormatted = concatenateSegments(analysis.missingProfiles);
      summaryLines.push('Following profiles sent for translation because they were completely missing: ' + missingFormatted.join(', '));
    }

    // 3. Published line
    if (analysis.unpublishedProfiles.length > 0) {
      var publishFormatted = concatenateSegments(analysis.unpublishedProfiles);
      summaryLines.push('Following profiles were in Draft and are now published: ' + publishFormatted.join(', '));
    }

    if (summaryLines.length > 0) {
      currentSummaryContent = summaryLines.join('. ') + '.';
      summaryText.innerHTML = '<div>' + currentSummaryContent + '</div>';
      document.getElementById('dsa-summary-section').classList.remove('hidden');
    } else {
      currentSummaryContent = '';
      summaryText.innerHTML = 'No actions needed.';
      document.getElementById('dsa-summary-section').classList.add('hidden');
    }

    // Scroll to results
    setTimeout(function () {
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  });

  // ===== CLEAR =====
  btnClear.addEventListener('click', function () {
    textarea.value = '';
    resultSection.classList.add('hidden');
    emptyConsDetails.innerHTML = '';
    emptyCommDetails.innerHTML = '';
    groupedDisplayNamesDetails.innerHTML = '';
    publishDetails.innerHTML = '';
    missingConsDetails.innerHTML = '';
    missingCommDetails.innerHTML = '';
    scriptOutputEmptyCons.textContent = '';
    scriptOutputEmptyComm.textContent = '';
    scriptOutputMissingCons.textContent = '';
    scriptOutputMissingComm.textContent = '';
    scriptOutputPublish.textContent = '';
    summaryText.innerHTML = '';
    currentScriptEmptyCons = '';
    currentScriptEmptyComm = '';
    currentScriptMissingCons = '';
    currentScriptMissingComm = '';
    currentScriptPublish = '';
    currentSummaryContent = '';
    updateAnalyzeButton();
  });

  // ===== COPY BUTTONS =====
  var btnCopyScriptEmptyCons = document.getElementById('dsa-btn-copy-script-empty-cons');
  if (btnCopyScriptEmptyCons) {
    btnCopyScriptEmptyCons.addEventListener('click', function () {
      copyWithFeedback(currentScriptEmptyCons, btnCopyScriptEmptyCons);
    });
  }

  var btnCopyScriptEmptyComm = document.getElementById('dsa-btn-copy-script-empty-comm');
  if (btnCopyScriptEmptyComm) {
    btnCopyScriptEmptyComm.addEventListener('click', function () {
      copyWithFeedback(currentScriptEmptyComm, btnCopyScriptEmptyComm);
    });
  }

  var btnCopyScriptMissingCons = document.getElementById('dsa-btn-copy-script-missing-cons');
  if (btnCopyScriptMissingCons) {
    btnCopyScriptMissingCons.addEventListener('click', function () {
      copyWithFeedback(currentScriptMissingCons, btnCopyScriptMissingCons);
    });
  }

  var btnCopyScriptMissingComm = document.getElementById('dsa-btn-copy-script-missing-comm');
  if (btnCopyScriptMissingComm) {
    btnCopyScriptMissingComm.addEventListener('click', function () {
      copyWithFeedback(currentScriptMissingComm, btnCopyScriptMissingComm);
    });
  }

  var btnCopyScriptPublish = document.getElementById('dsa-btn-copy-script-publish');
  if (btnCopyScriptPublish) {
    btnCopyScriptPublish.addEventListener('click', function () {
      copyWithFeedback(currentScriptPublish, btnCopyScriptPublish);
    });
  }

  var btnCopySummary = document.getElementById('dsa-btn-copy-summary');
  if (btnCopySummary) {
    btnCopySummary.addEventListener('click', function () {
      copyWithFeedback(currentSummaryContent, btnCopySummary);
    });
  }

})();
