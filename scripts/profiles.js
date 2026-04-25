// ===== MISSING PROFILES MODULE =====
// Analyzes pasted CMX query results to find profiles missing the Consumer segment
(function () {
  'use strict';

  // The full list of expected profiles
  var EXPECTED_PROFILES = [
    'cs/cz', 'da/dk', 'de/de', 'el/gr', 'en/us', 'es/es',
    'es/la', 'es/mx', 'fi/fi', 'fr/ca', 'fr/fr', 'hu/hu',
    'it/it', 'ja/jp', 'ko/kr', 'nl/be', 'nl/nl', 'no/no',
    'pl/pl', 'pt/br', 'pt/pt', 'ro/ro', 'ru/ru', 'ru/ua',
    'sk/sk', 'sv/se', 'tr/tr', 'zh/cn', 'zh/hk', 'zh/tw',
  ];

  // DOM references
  var textarea = document.getElementById('mp-textarea');
  var btnAnalyze = document.getElementById('mp-btn-analyze');
  var btnClear = document.getElementById('mp-btn-clear');
  var resultSection = document.getElementById('mp-result-section');
  var resultMessage = document.getElementById('mp-result-message');
  var resultDetails = document.getElementById('mp-result-details');

  // Enable/disable analyze button based on textarea content
  function updateAnalyzeButton() {
    btnAnalyze.disabled = !textarea.value.trim();
  }

  textarea.addEventListener('input', updateAnalyzeButton);

  /**
   * Parse the pasted text and extract profile → segments mapping.
   *
   * The query results follow a repeating 4-line pattern (ignoring blanks):
   *   line 1: file id  (e.g. "internal-storage-ssd")
   *   line 2: file name (e.g. "Internal Storage & SSDs")
   *   line 3: profile   (e.g. "it/it")
   *   line 4: segments  (e.g. "comm-Commercial, ngov-National Government, ...")
   *
   * The text may have header/footer noise that we need to skip.
   */
  function parseResults(rawText) {
    // Split into lines and strip out empty/whitespace-only lines
    var lines = rawText.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(function (l) { return l.length > 0; });

    // We need to find the start of the actual data rows.
    // A valid profile matches "xx/xx" or comma-separated "xx/xx,xx/xx,xx/xx".
    var singleProfile = /^[a-z]{2}\/[a-z]{2}$/;
    var multiProfile = /^[a-z]{2}\/[a-z]{2}(,[a-z]{2}\/[a-z]{2})+$/;

    // Build a map: profile → array of segment strings
    var profileSegments = {};

    // Segment lines contain patterns like "xxxx-Xxxxx" (e.g. "cnsr-Consumer", "comm-Commercial")
    var segmentPattern = /[a-z]{3,4}-[A-Z][a-zA-Z ]+/;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (singleProfile.test(line) || multiProfile.test(line)) {
        // Split comma-separated profiles into individual entries
        var profileList = line.split(',');
        // Search the next few lines for the segments line
        // (sometimes a translated name appears between the profile and segments)
        var segments = '';
        for (var j = 1; j <= 5 && (i + j) < lines.length; j++) {
          if (segmentPattern.test(lines[i + j])) {
            segments = lines[i + j];
            break;
          }
        }
        profileList.forEach(function (profile) {
          profile = profile.trim();
          if (!profileSegments[profile]) {
            profileSegments[profile] = [];
          }
          profileSegments[profile].push(segments);
        });
        // Skip the segments line
        i++;
      }
    }

    return profileSegments;
  }

  /**
   * Check which expected profiles are missing the 'cnsr-Consumer' segment.
   * A profile is "missing Consumer" if:
   *   - It does not appear at all in the parsed results, OR
   *   - It appears but none of its segment entries contain 'cnsr-Consumer'
   */
  function findMissingConsumer(profileSegments) {
    var missing = [];

    EXPECTED_PROFILES.forEach(function (profile) {
      var segmentEntries = profileSegments[profile];

      if (!segmentEntries) {
        // Profile not found at all
        missing.push({ profile: profile, reason: 'not found' });
      } else {
        // Check if any entry contains 'cnsr-Consumer'
        var hasConsumer = segmentEntries.some(function (seg) {
          return seg.indexOf('cnsr-Consumer') !== -1;
        });
        if (!hasConsumer) {
          missing.push({ profile: profile, reason: 'no consumer segment' });
        }
      }
    });

    return missing;
  }

  /**
   * Format the list of missing profiles into a human-readable message.
   */
  function formatMessage(missingList) {
    if (missingList.length === 0) {
      return 'All profiles have a file assigned to the Consumer segment.';
    }

    var profileNames = missingList.map(function (item) { return item.profile; });

    // Build natural language list: "a, b and c"
    var formatted;
    if (profileNames.length === 1) {
      formatted = profileNames[0];
    } else if (profileNames.length === 2) {
      formatted = profileNames[0] + ' and ' + profileNames[1];
    } else {
      formatted = profileNames.slice(0, -1).join(', ') + ' and ' + profileNames[profileNames.length - 1];
    }

    return 'Missing ' + formatted;
  }

  // Analyze button handler
  btnAnalyze.addEventListener('click', function () {
    var rawText = textarea.value.trim();
    if (!rawText) return;

    var profileSegments = parseResults(rawText);
    var missingList = findMissingConsumer(profileSegments);
    var message = formatMessage(missingList);

    // Show results
    resultSection.classList.remove('hidden');

    // Main message
    resultMessage.textContent = message;

    // Apply appropriate styling
    if (missingList.length === 0) {
      resultMessage.className = 'mp-message mp-message-success';
    } else {
      resultMessage.className = 'mp-message mp-message-warning';
    }

    // Detail breakdown
    resultDetails.innerHTML = '';

    if (missingList.length > 0) {
      var detailHtml = '<div class="mp-detail-header">' +
        '<span class="mp-detail-count">' + missingList.length + '</span> of ' + EXPECTED_PROFILES.length + ' profiles missing Consumer segment' +
        '</div>';

      detailHtml += '<div class="mp-detail-grid">';
      EXPECTED_PROFILES.forEach(function (profile) {
        var isMissing = missingList.some(function (m) { return m.profile === profile; });
        var missingItem = missingList.find(function (m) { return m.profile === profile; });
        var statusClass = isMissing ? 'mp-profile-missing' : 'mp-profile-ok';
        var icon = isMissing ? '✗' : '✓';
        var tooltip = isMissing
          ? (missingItem.reason === 'not found' ? 'Profile not found in results' : 'Present but missing Consumer segment')
          : 'Has Consumer segment';

        detailHtml += '<div class="mp-profile-item ' + statusClass + '" title="' + tooltip + '">' +
          '<span class="mp-profile-icon">' + icon + '</span>' +
          '<span class="mp-profile-name">' + profile + '</span>' +
          '</div>';
      });
      detailHtml += '</div>';

      resultDetails.innerHTML = detailHtml;
    }

    // Scroll to results
    setTimeout(function () {
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  });

  // Clear button handler
  btnClear.addEventListener('click', function () {
    textarea.value = '';
    resultSection.classList.add('hidden');
    resultMessage.textContent = '';
    resultDetails.innerHTML = '';
    updateAnalyzeButton();
  });

  // Copy result message
  var btnCopyResult = document.getElementById('mp-btn-copy-result');
  if (btnCopyResult) {
    btnCopyResult.addEventListener('click', function () {
      var text = resultMessage.textContent;
      if (!text) return;

      function showFeedback() {
        btnCopyResult.classList.add('btn-success-state');
        var span = btnCopyResult.querySelector('span');
        var originalText = span ? span.textContent : '';
        if (span) span.textContent = 'Copied!';
        setTimeout(function () {
          btnCopyResult.classList.remove('btn-success-state');
          if (span) span.textContent = originalText;
        }, 2000);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showFeedback).catch(function () {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showFeedback();
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showFeedback();
      }
    });
  }

  // Copy EN/ALL Script button handler
  var btnCopyEnAll = document.getElementById('mp-btn-copy-en-all');
  if (btnCopyEnAll) {
    var enAllScriptContent = "$('dds-label').filter(function () {\n" +
      "    return ['en/ae', 'en/af', 'en/ag', 'en/ai', 'en/al', 'en/ao', 'en/ar', 'en/at', 'en/au', 'en/aw', 'en/ba', 'en/bb', 'en/bd', 'en/be', 'en/bg', 'en/bh', 'en/bm', 'en/bn', 'en/bo', 'en/br', 'en/bs', 'en/bt', 'en/bw', 'en/bz', 'en/ca', 'en/cf', 'en/ch', 'en/ck', 'en/cl', 'en/cn', 'en/co', 'en/cr', 'en/cv', 'en/cy', 'en/cz', 'en/de', 'en/dk', 'en/dm', 'en/do', 'en/dz', 'en/ec', 'en/ee', 'en/eg', 'en/es', 'en/et', 'en/fi', 'en/fj', 'en/fm', 'en/fo', 'en/fr', 'en/gb', 'en/gd', 'en/gh', 'en/gm', 'en/gt', 'en/gu', 'en/gy', 'en/hk', 'en/hn', 'en/hr', 'en/ht', 'en/id', 'en/ie', 'en/il', 'en/in', 'en/iq', 'en/is', 'en/it', 'en/jm', 'en/jo', 'en/jp', 'en/ke', 'en/kh', 'en/ki', 'en/kr', 'en/kn', 'en/kw', 'en/ky', 'en/la', 'en/lb', 'en/lc', 'en/lk', 'en/lr', 'en/ls', 'en/lt', 'en/lv', 'en/ly', 'en/me', 'en/mk', 'en/mm', 'en/mn', 'en/mp', 'en/ms', 'en/mt', 'en/mu', 'en/mv', 'en/mw', 'en/my', 'en/mx', 'en/mz', 'en/na', 'en/ng', 'en/ni', 'en/nl', 'en/no', 'en/np', 'en/nr', 'en/nz', 'en/om', 'en/pa', 'en/pe', 'en/pg', 'en/pl', 'en/ph', 'en/pk', 'en/pr', 'en/pt', 'en/pw', 'en/py', 'en/qa', 'en/rs', 'en/rw', 'en/sa', 'en/sb', 'en/se', 'en/sg', 'en/si', 'en/sk', 'en/sl', 'en/so', 'en/sr', 'en/sv', 'en/sz', 'en/tc', 'en/th', 'en/tl', 'en/to', 'en/tt', 'en/tv', 'en/tw', 'en/tz', 'en/ua', 'en/ug', 'en/uk', 'en/uy', 'en/ve', 'en/vc', 'en/vg', 'en/vi', 'en/vn', 'en/vu', 'en/ws', 'en/ye', 'en/za', 'en/zm', 'en/zw'].includes($(this).attr('title'));\n" +
      "}).each(function () {\n" +
      "    $(this).closest('div').find('input[type=checkbox]:not(:checked)').trigger(\"click\");\n" +
      "});";

    btnCopyEnAll.addEventListener('click', function () {

      function showFeedback() {
        btnCopyEnAll.classList.add('btn-success-state');
        var span = btnCopyEnAll.querySelector('span');
        var originalText = span ? span.textContent : '';
        if (span) span.textContent = 'Copied!';
        setTimeout(function () {
          btnCopyEnAll.classList.remove('btn-success-state');
          if (span) span.textContent = originalText;
        }, 2000);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(enAllScriptContent).then(showFeedback).catch(function () {
          var ta = document.createElement('textarea');
          ta.value = enAllScriptContent;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showFeedback();
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = enAllScriptContent;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showFeedback();
      }
    });
  }

})();
