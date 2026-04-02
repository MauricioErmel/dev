// Field mapping: Content-Studio label → CMX label
// Each entry also has a jQuery template type for script generation
export const COMPARISON_RULES = [
  {
    csLabel: 'Tab Name',
    cmxLabel: 'Display Name',
    templateType: 'text-input',
  },
  {
    csLabel: 'Hero Subtitle',
    cmxLabel: 'Short Title',
    templateType: 'text-input',
  },
  {
    csLabel: 'Page / Browser Title',
    cmxLabel: 'Browser Title',
    templateType: 'text-input',
  },
  {
    csLabel: 'Page / Browser Title',
    cmxLabel: 'Title',
    templateType: 'text-input',
  },
  {
    csLabel: 'Keywords',
    cmxLabel: 'SEO Keywords',
    templateType: 'text-input',
  },
  {
    csLabel: 'Font Color',
    cmxLabel: 'Font Color',
    templateType: 'select-dropdown',
  },
  {
    csLabel: 'Mobile Background Color',
    cmxLabel: 'Background Color',
    templateType: 'select-dropdown',
  },
  {
    csLabel: 'Tab Icon Code',
    cmxLabel: 'Icon Code',
    templateType: 'text-input',
  },
  {
    csLabel: 'SEO Meta Description',
    cmxLabel: 'SEO Description',
    templateType: 'tinymce-textarea',
  },
];

// Manual-copy fields (show warnings only, no jQuery scripts)
export const MANUAL_FIELDS = [
  {
    csLabel: 'Hero Description',
    csEndLabel: 'Hero Image',
    cmxLabel: 'Description',
    warningText: '"Description" needs to be edited',
  },
  {
    csLabel: 'Deal Great For Text',
    csEndLabel: 'Page / Browser Title',
    cmxLabel: 'Deal Great For Text',
    warningText: '"Deal Great For Text" needs to be edited',
  },
];

// jQuery template generators
// Each returns a jQuery script string with the actual value inserted
export function generateJQueryScript(templateType, cmxLabel, value) {
  // Escape single quotes in the value for safe JS string embedding
  const escapedValue = value.replace(/'/g, "\\'");

  switch (templateType) {
    case 'text-input':
      return `$(document).ready(function () { $('label:contains("${cmxLabel}")').closest('.dds__form__field').find('input[type="text"]').val('${escapedValue}'); });`;

    case 'select-dropdown':
      return `$(document).ready(function () { $('label').filter(function () { return $(this).text().trim().replace(/\\s+/g, ' ') === '${cmxLabel}'; }).closest('.dds__select').find('select').val('${escapedValue}').trigger('change'); });`;

    case 'tinymce-textarea':
      return `$(document).ready(function () { var lbl = $('label').filter(function() { return $(this).text().trim().replace(/\\s+/g, ' ') === '${cmxLabel}'; }); var tid = lbl.closest('.dds__form__field').find('textarea').attr('id'); if (typeof tinymce !== 'undefined' && tinymce.get(tid)) { tinymce.get(tid).setContent('${escapedValue}'); } else { lbl.closest('.dds__form__field').find('iframe').contents().find('body').html('<p>${escapedValue}</p>'); } });`;

    default:
      return '';
  }
}
