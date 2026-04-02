// ===== APP MODULE =====
// Main application logic — page routing, rendering, and event handling
(function () {
  'use strict';

  // ===== DOM REFERENCES =====
  var tabDashboard = document.getElementById('tab-dashboard');
  var tabCompare = document.getElementById('tab-compare');
  var pageDashboard = document.getElementById('page-dashboard');
  var pageCompare = document.getElementById('page-compare');
  var navLogo = document.getElementById('nav-logo');

  // Dashboard elements
  var filterCategory = document.getElementById('filter-category');
  var filterProfile = document.getElementById('filter-profile'); // hidden
  var profileSearch = document.getElementById('profile-search');
  var profileOptions = document.getElementById('profile-options');
  var btnClearFilters = document.getElementById('btn-clear-filters');
  var filterCountEl = document.getElementById('filter-count');
  var profileGrid = document.getElementById('profile-grid');
  var emptyState = document.getElementById('empty-state');
  var filterAdmin = document.getElementById('filter-admin');
  var filterNotAdmin = document.getElementById('filter-not-admin');
  var filterImm = document.getElementById('filter-imm');
  var filterFaq = document.getElementById('filter-faq');

  // Comparison Tool elements
  var csTextarea = document.getElementById('cs-textarea');
  var cmxTextarea = document.getElementById('cmx-textarea');
  var btnCompare = document.getElementById('btn-compare');
  var btnClear = document.getElementById('btn-clear');
  var canonicalProfile = document.getElementById('canonical-profile');
  var canonicalUrlOutput = document.getElementById('canonical-url-output');
  var btnCopyCanonical = document.getElementById('btn-copy-canonical');
  var resultsSection = document.getElementById('results-section');
  var alertSuccess = document.getElementById('alert-success');
  var diffContainer = document.getElementById('diff-container');
  var diffCountText = document.getElementById('diff-count-text');
  var diffTableBody = document.getElementById('diff-table-body');
  var scriptsOutput = document.getElementById('scripts-output');
  var warningsContainer = document.getElementById('warnings-container');
  var btnCopyScripts = document.getElementById('btn-copy-scripts');
  var copyBtnText = document.getElementById('copy-btn-text');

  // ===== NAVIGATION =====
  function switchPage(pageName) {
    // Update tabs
    tabDashboard.classList.toggle('active', pageName === 'dashboard');
    tabCompare.classList.toggle('active', pageName === 'compare');

    // Update pages
    pageDashboard.classList.toggle('active', pageName === 'dashboard');
    pageCompare.classList.toggle('active', pageName === 'compare');
  }

  tabDashboard.addEventListener('click', function () { switchPage('dashboard'); });
  tabCompare.addEventListener('click', function () { switchPage('compare'); });
  navLogo.addEventListener('click', function (e) {
    e.preventDefault();
    switchPage('dashboard');
  });

  // ===== DASHBOARD: POPULATE FILTERS =====
  function populateFilters() {
    // Category filter
    ALL_CATEGORIES.forEach(function (cat) {
      var opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = CATEGORY_LABELS[cat];
      filterCategory.appendChild(opt);
    });

    // Profile filter (combobox)
    renderProfileOptions('');

    // Canonical profile dropdown
    profiles.forEach(function (p) {
      var opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.id;
      canonicalProfile.appendChild(opt);
    });
  }

  // ===== DASHBOARD: RENDER PROFILE CARDS =====
  function createProfileCard(profile) {
    var card = document.createElement('div');
    card.className = 'profile-card';
    card.setAttribute('data-profile-id', profile.id);

    var html = '<div class="card-body">';

    // Header row
    html += '<div class="card-header-row">';
    html += '<div class="card-title-group">';
    html += '<h2 class="card-title">' + profile.id + '</h2>';
    if (profile.isAdmin) {
      html += '<span class="badge-admin">ADMIN</span>';
    }
    html += '</div>';

    // Indicators
    html += '<div class="indicators">';
    html += '<span class="indicator" title="IMM Banner">';
    html += profile.hasIMM
      ? '<span class="icon-yes">✓</span>'
      : '<span class="icon-no">✗</span>';
    html += '<span class="label">IMM</span>';
    html += '</span>';
    html += '<span class="indicator" title="FAQ">';
    html += profile.hasFAQ
      ? '<span class="icon-yes">✓</span>'
      : '<span class="icon-no">✗</span>';
    html += '<span class="label">FAQ</span>';
    html += '</span>';
    html += '</div>';
    html += '</div>';

    // State links
    html += '<div class="state-links">';
    html += '<a href="' + getFutureStateUrl(profile.id) + '" target="_blank" rel="noopener noreferrer" class="btn-state btn-future">';
    html += '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>';
    html += 'Future State';
    html += '</a>';
    html += '<a href="' + getCurrentStateUrl(profile.id) + '" target="_blank" rel="noopener noreferrer" class="btn-state btn-current">';
    html += '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" /></svg>';
    html += 'Current State';
    html += '</a>';
    html += '</div>';

    // Divider
    html += '<div class="card-divider">Categories</div>';

    // Category buttons
    html += '<div class="category-list">';
    ALL_CATEGORIES.forEach(function (cat) {
      var url = profile.categories[cat];
      if (url) {
        html += '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="category-btn active">';
        html += '<span class="category-dot"></span>';
        html += CATEGORY_LABELS[cat];
        html += '</a>';
      } else {
        html += '<button class="category-btn disabled" disabled>';
        html += '<span class="category-dot"></span>';
        html += CATEGORY_LABELS[cat];
        html += '</button>';
      }
    });
    html += '</div>';

    html += '</div>';
    card.innerHTML = html;
    return card;
  }

  function renderDashboard() {
    var catFilter = filterCategory.value;
    var profFilter = filterProfile.value;

    var filtered = profiles.filter(function (p) {
      if (profFilter && p.id !== profFilter) return false;
      if (catFilter && !p.categories[catFilter]) return false;

      // Checkbox filters
      if (filterAdmin.checked && !p.isAdmin) return false;
      if (filterNotAdmin.checked && p.isAdmin) return false;
      if (filterImm.checked && !p.hasIMM) return false;
      if (filterFaq.checked && !p.hasFAQ) return false;

      return true;
    });

    // Clear grid
    profileGrid.innerHTML = '';

    if (filtered.length === 0) {
      profileGrid.classList.add('hidden');
      emptyState.classList.remove('hidden');
    } else {
      profileGrid.classList.remove('hidden');
      emptyState.classList.add('hidden');
      filtered.forEach(function (profile) {
        profileGrid.appendChild(createProfileCard(profile));
      });
    }

    // Update count
    filterCountEl.textContent = 'Showing ' + filtered.length + ' of ' + profiles.length + ' profiles';

    // Toggle clear button
    if (catFilter || profFilter || filterAdmin.checked || filterNotAdmin.checked || filterImm.checked || filterFaq.checked) {
      btnClearFilters.classList.add('visible');
    } else {
      btnClearFilters.classList.remove('visible');
    }
  }

  // Filter events
  filterCategory.addEventListener('change', renderDashboard);
  filterAdmin.addEventListener('change', function () {
    if (filterAdmin.checked) filterNotAdmin.checked = false;
    renderDashboard();
  });
  filterNotAdmin.addEventListener('change', function () {
    if (filterNotAdmin.checked) filterAdmin.checked = false;
    renderDashboard();
  });
  filterImm.addEventListener('change', renderDashboard);
  filterFaq.addEventListener('change', renderDashboard);

  // Combobox logic
  profileSearch.addEventListener('focus', function () {
    renderProfileOptions('');
    profileOptions.classList.add('show');
  });

  document.getElementById('profile-combobox').addEventListener('click', function () {
    profileSearch.focus();
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('#profile-combobox')) {
      profileOptions.classList.remove('show');
    }
  });

  profileSearch.addEventListener('input', function () {
    renderProfileOptions(this.value);
    profileOptions.classList.add('show');
  });

  function renderProfileOptions(searchText) {
    profileOptions.innerHTML = '';

    // "All Profiles" option
    if (!searchText) {
      var allOpt = document.createElement('div');
      allOpt.className = 'combobox-option' + (!filterProfile.value ? ' selected' : '');
      allOpt.textContent = 'All Profiles';
      allOpt.addEventListener('click', function () {
        selectProfile('', 'All Profiles');
      });
      profileOptions.appendChild(allOpt);
    }

    var filtered = profiles.filter(function (p) {
      return p.id.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
    });

    filtered.forEach(function (p) {
      var div = document.createElement('div');
      div.className = 'combobox-option' + (filterProfile.value === p.id ? ' selected' : '');

      var textSpan = document.createElement('span');
      textSpan.textContent = p.id;
      div.appendChild(textSpan);

      if (p.isAdmin) {
        var star = document.createElement('span');
        star.className = 'combobox-option-admin';
        star.textContent = '★';
        div.appendChild(star);
      }

      div.addEventListener('click', function () {
        selectProfile(p.id, p.id);
      });
      profileOptions.appendChild(div);
    });
  }

  function selectProfile(value, label) {
    filterProfile.value = value;
    profileSearch.value = value === '' ? '' : label; // Keep empty for All Profiles
    if (value === '') profileSearch.placeholder = 'All Profiles';
    else profileSearch.placeholder = 'Select or search...';

    profileOptions.classList.remove('show');
    renderDashboard();
  }

  btnClearFilters.addEventListener('click', function () {
    filterCategory.value = '';
    filterProfile.value = '';
    profileSearch.value = '';
    profileSearch.placeholder = 'Select or search...';
    renderProfileOptions('');
    filterAdmin.checked = false;
    filterNotAdmin.checked = false;
    filterImm.checked = false;
    filterFaq.checked = false;
    renderDashboard();
  });

  // ===== COMPARISON TOOL =====
  // Enable/disable compare button based on textarea content
  function updateCompareButton() {
    btnCompare.disabled = !csTextarea.value.trim();
  }

  csTextarea.addEventListener('input', updateCompareButton);

  // Compare
  btnCompare.addEventListener('click', function () {
    if (!csTextarea.value.trim()) return;

    var result = compareTexts(csTextarea.value, cmxTextarea.value);

    // Show results section
    resultsSection.classList.remove('hidden');

    var hasScripts = result.scripts.length > 0;
    var hasWarnings = result.warnings.length > 0;

    // Success alert
    if (!hasScripts && !hasWarnings) {
      alertSuccess.classList.remove('hidden');
    } else {
      alertSuccess.classList.add('hidden');
    }

    // Always show differences breakdown
    diffContainer.classList.remove('hidden');
    var fieldsToUpdate = result.differences.filter(function (d) { return d.needsUpdate; }).length;
    diffCountText.textContent = fieldsToUpdate + ' field' + (fieldsToUpdate !== 1 ? 's' : '') + ' need updating out of 11:';

    // Build table rows
    diffTableBody.innerHTML = '';
    result.differences.forEach(function (diff) {
      var tr = document.createElement('tr');
      if (!diff.needsUpdate) {
        tr.className = 'row-no-update';
      }
      var noUpdateBadge = !diff.needsUpdate ? ' <span class="badge-no-update" title="' + escapeAttr(diff.matchReason) + '">No Update</span>' : '';
      tr.innerHTML =
        '<td class="col-label">' + escapeHtml(diff.csLabel) + noUpdateBadge + '</td>' +
        '<td>' + escapeHtml(diff.cmxLabel) + '</td>' +
        '<td class="col-cs-value" title="' + escapeAttr(diff.csValue) + '">' + escapeHtml(diff.csValue) + '</td>' +
        '<td class="col-cmx-value" title="' + escapeAttr(diff.cmxValue) + '">' + escapeHtml(diff.cmxValue) + '</td>';
      diffTableBody.appendChild(tr);
    });

    // Handle scripts
    if (hasScripts) {
      scriptsOutput.classList.remove('hidden');
      btnCopyScripts.style.display = 'inline-flex';

      scriptsOutput.innerHTML = '';
      result.scripts.forEach(function (script, i) {
        if (i > 0) {
          scriptsOutput.appendChild(document.createElement('br'));
        }
        var div = document.createElement('div');
        div.textContent = script;
        scriptsOutput.appendChild(div);
      });

      // Store scripts for copy
      btnCopyScripts._scripts = result.scripts;
    } else {
      scriptsOutput.classList.add('hidden');
      btnCopyScripts.style.display = 'none';
      btnCopyScripts._scripts = [];
    }

    // Warnings
    warningsContainer.innerHTML = '';
    if (hasWarnings) {
      result.warnings.forEach(function (warning) {
        var alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-warning';
        alertDiv.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">' +
          '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />' +
          '</svg>' +
          '<span style="font-weight:500">' + escapeHtml(warning) + '</span>';
        warningsContainer.appendChild(alertDiv);
      });
    }
  });

  // Clear
  btnClear.addEventListener('click', function () {
    csTextarea.value = '';
    cmxTextarea.value = '';
    resultsSection.classList.add('hidden');
    updateCompareButton();
  });

  // Copy all scripts
  btnCopyScripts.addEventListener('click', function () {
    var scripts = btnCopyScripts._scripts;
    if (!scripts || scripts.length === 0) return;

    var allScripts = scripts.join('\n\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(allScripts).then(function () {
        showCopyFeedback();
      }).catch(function () {
        fallbackCopy(allScripts);
      });
    } else {
      fallbackCopy(allScripts);
    }
  });

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showCopyFeedback();
  }

  function showCopyFeedback() {
    btnCopyScripts.classList.remove('btn-primary');
    btnCopyScripts.classList.add('btn-success-state');
    copyBtnText.textContent = 'Copied!';
    setTimeout(function () {
      btnCopyScripts.classList.remove('btn-success-state');
      btnCopyScripts.classList.add('btn-primary');
      copyBtnText.textContent = 'Copy All Scripts';
    }, 2000);
  }

  // Canonical URL updater
  canonicalProfile.addEventListener('change', updateCanonicalUrl);
  function updateCanonicalUrl() {
    var slug = profileToSlug(canonicalProfile.value);
    canonicalUrlOutput.textContent = 'Canonical Url: https://www.dell.com/' + slug + '/shop/deals/dc/';
  }

  // Copy Canonical URL
  btnCopyCanonical.addEventListener('click', function () {
    var urlText = canonicalUrlOutput.textContent.replace('Canonical Url: ', '');

    function showCanonicalCopyFeedback() {
      btnCopyCanonical.classList.add('btn-success-state');
      setTimeout(function () {
        btnCopyCanonical.classList.remove('btn-success-state');
      }, 2000);
    }

    function fallback() {
      var textarea = document.createElement('textarea');
      textarea.value = urlText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showCanonicalCopyFeedback();
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(urlText).then(showCanonicalCopyFeedback).catch(fallback);
    } else {
      fallback();
    }
  });

  // ===== UTILITY =====
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ===== INIT =====
  populateFilters();
  renderDashboard();
  updateCanonicalUrl();

})();
