// ===== DSA CHECK MODULE =====
// Analyzes pasted CMX query results for blank Display Names and missing profiles
(function () {
  'use strict';

  // Profile code → CMX checkbox label mapping
  var PROFILE_LABELS = {
    'cs/cz': 'Czech - Czech Republic (CS-CZ)',
    'da/dk': 'Danish - Denmark (DA-DK)',
    'de/at': 'German - Austria (DE-AT)',
    'de/ch': 'German - Switzerland (DE-CH)',
    'de/de': 'German - Germany (DE-DE)',
    'el/gr': 'Greek - Greece (EL-GR)',
    'es/es': 'Spanish - Spain (ES-ES)',
    'es/la': 'Spanish - Latin America (Pages & Web Parts) (ES-LA)',
    'es/mx': 'Spanish - Mexico (ES-MX)',
    'fi/fi': 'Finnish - Finland (FI-FI)',
    'fr/be': 'French - Belgium (FR-BE)',
    'fr/ca': 'French - Canada (FR-CA)',
    'fr/ch': 'French - Switzerland (FR-CH)',
    'fr/fr': 'French - France (FR-FR)',
    'hu/hu': 'Hungarian - Hungary (HU-HU)',
    'it/it': 'Italian - Italy (IT-IT)',
    'ja/jp': 'Japanese - Japan (JA-JP)',
    'ko/kr': 'Korean - Korea (KO-KR)',
    'nl/be': 'Dutch - Belgium (NL-BE)',
    'nl/nl': 'Dutch - Netherlands (NL-NL)',
    'no/no': 'Norwegian - Norway (NO-NO)',
    'pl/pl': 'Polish - Poland (PL-PL)',
    'pt/br': 'Portuguese - Brazil (PT-BR)',
    'pt/pt': 'Portuguese - Portugal (PT-PT)',
    'ro/ro': 'Romanian - Romania (RO-RO)',
    'ru/ru': 'Russian - Russia (RU-RU)',
    'ru/ua': 'Russian - Ukraine (RU-UA)',
    'sk/sk': 'Slovak - Slovakia (SK-SK)',
    'sv/se': 'Swedish - Sweden (SV-SE)',
    'tr/tr': 'Turkish - Turkey (TR-TR)',
    'zh/cn': 'Chinese - China (ZH-CN)',
    'zh/hk': 'Chinese - Hong Kong (ZH-HK)',
    'zh/tw': 'Chinese - Taiwan (ZH-TW)'
  };

  // Only these 3 profiles are checked for "missing"
  var DSA_MISSING_PROFILES = ['pt/br', 'fr/fr', 'zh/cn'];

  // DOM references
  var textarea = document.getElementById('dsa-textarea');
  var btnAnalyze = document.getElementById('dsa-btn-analyze');
  var btnClear = document.getElementById('dsa-btn-clear');
  var resultSection = document.getElementById('dsa-result-section');
  var emptyMessage = document.getElementById('dsa-empty-message');
  var emptyDetails = document.getElementById('dsa-empty-details');
  var missingMessage = document.getElementById('dsa-missing-message');
  var missingDetails = document.getElementById('dsa-missing-details');
  var scriptOutput = document.getElementById('dsa-script-output');
  var summaryText = document.getElementById('dsa-summary-text');
  var publishMessage = document.getElementById('dsa-publish-message');
  var publishDetails = document.getElementById('dsa-publish-details');

  var currentScriptContent = '';
  var currentSummaryContent = '';

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

      // Skip en/* profiles — they are source language
      if (profile.indexOf('en/') === 0) continue;

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
      if (entry.hasBlankDisplayName) {
        emptyDisplayNames.push({
          profile: entry.profile,
          segment: getSegmentLabel(entry.segments)
        });
      }
    });

    // 2. Unpublished Profiles — version not ending with '0'
    entries.forEach(function (entry) {
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
   * Format a list of {profile, segment} items into "profile (Segment)" strings.
   */
  function formatProfileList(items) {
    return items.map(function (item) {
      return item.profile + ' (' + item.segment + ')';
    });
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
   * Render the profile detail grid for empty display names.
   */
  function renderEmptyGrid(entries, emptyItems) {
    // Get unique profiles from entries
    var allProfiles = [];
    var seen = {};
    entries.forEach(function (e) {
      var key = e.profile + '|' + getSegmentLabel(e.segments);
      if (!seen[key]) {
        seen[key] = true;
        allProfiles.push({ profile: e.profile, segment: getSegmentLabel(e.segments) });
      }
    });

    var html = '<div class="mp-detail-header">' +
      '<span class="mp-detail-count">' + emptyItems.length + '</span> profile(s) with blank Display Name' +
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
        '<span class="mp-profile-name">' + item.profile + ' <small style="opacity:.6">(' + (item.segment === 'Consumer' ? 'cnsr' : 'comm') + ')</small></span>' +
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
      var key = e.profile + '|' + getSegmentLabel(e.segments);
      if (!seen[key]) {
        seen[key] = true;
        allProfiles.push({ profile: e.profile, segment: getSegmentLabel(e.segments), version: e.version });
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

      html += '<div class="mp-profile-item ' + statusClass + '" title="' + tooltip + '">' +
        '<span class="mp-profile-icon">' + icon + '</span>' +
        '<span class="mp-profile-name">' + item.profile + ' <small style="opacity:.6">(' + (item.segment === 'Consumer' ? 'cnsr' : 'comm') + ')</small></span>' +
        '</div>';
    });
    html += '</div>';

    return html;
  }

  /**
   * Render missing profiles grid.
   */
  function renderMissingGrid(missingItems) {
    if (missingItems.length === 0) return '';

    var html = '<div class="mp-detail-header">' +
      '<span class="mp-detail-count">' + missingItems.length + '</span> missing profile-segment combination(s)' +
      '</div>';

    html += '<div class="mp-detail-grid">';
    DSA_MISSING_PROFILES.forEach(function (profile) {
      // Check consumer
      var missingConsumer = missingItems.some(function (m) {
        return m.profile === profile && (m.segment === 'Consumer' || m.segment === 'Consumer and Commercial');
      });
      var missingCommercial = missingItems.some(function (m) {
        return m.profile === profile && (m.segment === 'Commercial' || m.segment === 'Consumer and Commercial');
      });

      // Consumer entry
      var cClass = missingConsumer ? 'mp-profile-missing' : 'mp-profile-ok';
      var cIcon = missingConsumer ? '✗' : '✓';
      var cTip = missingConsumer ? 'Missing Consumer segment' : 'Has Consumer segment';
      html += '<div class="mp-profile-item ' + cClass + '" title="' + cTip + '">' +
        '<span class="mp-profile-icon">' + cIcon + '</span>' +
        '<span class="mp-profile-name">' + profile + ' <small style="opacity:.6">(cnsr)</small></span>' +
        '</div>';

      // Commercial entry
      var xClass = missingCommercial ? 'mp-profile-missing' : 'mp-profile-ok';
      var xIcon = missingCommercial ? '✗' : '✓';
      var xTip = missingCommercial ? 'Missing Commercial segment' : 'Has Commercial segment';
      html += '<div class="mp-profile-item ' + xClass + '" title="' + xTip + '">' +
        '<span class="mp-profile-icon">' + xIcon + '</span>' +
        '<span class="mp-profile-name">' + profile + ' <small style="opacity:.6">(comm)</small></span>' +
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

    // --- Empty Display Names ---
    if (analysis.emptyDisplayNames.length > 0) {
      var emptyBold = formatProfileListBold(analysis.emptyDisplayNames);
      emptyMessage.innerHTML = 'The profile(s) ' + naturalList(emptyBold) +
        ' have the fields \'Display Name\' empty, they need to be sent for translation!';
      emptyMessage.className = 'mp-message mp-message-warning';
    } else {
      emptyMessage.innerHTML = '✓ All profiles have Display Names filled.';
      emptyMessage.className = 'mp-message mp-message-success';
    }

    // --- Unpublished Profiles ---
    if (analysis.unpublishedProfiles.length > 0) {
      var publishBold = formatProfileListBold(analysis.unpublishedProfiles);
      publishMessage.innerHTML = 'The profile(s) ' + naturalList(publishBold) + ' need to be published!';
      publishMessage.className = 'mp-message mp-message-publish';
    } else {
      publishMessage.innerHTML = '';
    }

    // --- Render publish grid ---
    if (analysis.unpublishedProfiles.length > 0) {
      publishDetails.innerHTML = renderPublishGrid(entries, analysis.unpublishedProfiles);
    } else {
      publishDetails.innerHTML = '';
    }

    emptyDetails.innerHTML = renderEmptyGrid(entries, analysis.emptyDisplayNames);

    // --- Missing Profiles ---
    if (analysis.missingProfiles.length > 0) {
      var missingBold = formatProfileListBold(analysis.missingProfiles);
      missingMessage.innerHTML = 'Missing ' + naturalList(missingBold);
      missingMessage.className = 'mp-message mp-message-warning';
    } else {
      missingMessage.innerHTML = '✓ All 3 target profiles (pt/br, fr/fr, zh/cn) are present for both segments.';
      missingMessage.className = 'mp-message mp-message-success';
    }
    missingDetails.innerHTML = renderMissingGrid(analysis.missingProfiles);

    // --- Collect all affected unique profile codes ---
    var affectedProfiles = {};
    analysis.emptyDisplayNames.forEach(function (item) {
      affectedProfiles[item.profile] = true;
    });
    analysis.missingProfiles.forEach(function (item) {
      affectedProfiles[item.profile] = true;
    });
    var uniqueCodes = Object.keys(affectedProfiles).sort();

    // --- Generate Script ---
    if (uniqueCodes.length > 0) {
      currentScriptContent = generateScript(uniqueCodes);
      scriptOutput.textContent = currentScriptContent;
      scriptOutput.classList.remove('hidden');
      document.getElementById('dsa-script-section').classList.remove('hidden');
    } else {
      currentScriptContent = '';
      scriptOutput.textContent = '';
      scriptOutput.classList.add('hidden');
      document.getElementById('dsa-script-section').classList.add('hidden');
    }

    // --- Generate Summary ---
    var summaryLines = [];

    // Translation line
    var translationAffected = [];
    analysis.emptyDisplayNames.forEach(function (item) {
      translationAffected.push(item.profile + ' (' + item.segment + ')');
    });
    analysis.missingProfiles.forEach(function (item) {
      translationAffected.push(item.profile + ' (' + item.segment + ')');
    });
    var uniqueTranslation = [];
    var seenT = {};
    translationAffected.forEach(function (s) {
      if (!seenT[s]) { seenT[s] = true; uniqueTranslation.push(s); }
    });
    if (uniqueTranslation.length > 0) {
      summaryLines.push('Sent for translation the files for the profiles ' + naturalList(uniqueTranslation));
    }

    // Publish line
    if (analysis.unpublishedProfiles.length > 0) {
      var publishFormatted = formatProfileList(analysis.unpublishedProfiles);
      summaryLines.push('Published the files for the profiles ' + naturalList(publishFormatted));
    }

    if (summaryLines.length > 0) {
      currentSummaryContent = summaryLines.join('\n');
      summaryText.innerHTML = summaryLines.map(function (line) { return '<div>' + line + '</div>'; }).join('');
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
    emptyMessage.innerHTML = '';
    emptyDetails.innerHTML = '';
    publishMessage.innerHTML = '';
    publishDetails.innerHTML = '';
    missingMessage.innerHTML = '';
    missingDetails.innerHTML = '';
    scriptOutput.textContent = '';
    summaryText.innerHTML = '';
    currentScriptContent = '';
    currentSummaryContent = '';
    updateAnalyzeButton();
  });

  // ===== COPY BUTTONS =====
  var btnCopyScript = document.getElementById('dsa-btn-copy-script');
  if (btnCopyScript) {
    btnCopyScript.addEventListener('click', function () {
      copyWithFeedback(currentScriptContent, btnCopyScript);
    });
  }

  var btnCopySummary = document.getElementById('dsa-btn-copy-summary');
  if (btnCopySummary) {
    btnCopySummary.addEventListener('click', function () {
      copyWithFeedback(currentSummaryContent, btnCopySummary);
    });
  }

})();
