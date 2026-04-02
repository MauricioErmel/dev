**English Translation & Adaptation of the Requirements**

I need a well-crafted website to help me verify the maintenance of certain pages in the CMS I use at work. The CMS is called CMX, so the support site can be named **Deals Maintenance on CMX Manager**, or simply **DMC Manager**.

Create a complete folder structure to organize the project in the best possible way.

I want to use **React** with **Tailwind CSS** for the front end. Initially I don’t see a need for a back end – if you think it’s necessary, let me know so we can choose a stack for it.

I want to use the **DaisyUI** collection (https://daisyui.com/) with the theme **'silk'**. Feel free to use DaisyUI components as well.

The service I perform is verifying the configuration of category pages in the Deals area. There are 10 possible categories, listed below:

- top-deals
- clearance-deals
- laptop-deals
- desktop-deals
- gaming-pc-deals
- computer-monitor-deals
- pc-accessories-deals
- business-deals
- business-laptop-deals
- business-desktop-deals

The list of possible profiles is:

- en/us
- en/ca
- zh/cn
- en/uk
- pt/br
- en/au
- en/nz
- de/de
- fr/fr
- sv/se
- ja/jp
- en/in
- de/ch
- en/sg
- en/my
- nl/nl
- es/es
- de/at
- fr/be
- da/dk
- en/ie
- it/it
- no/no
- pl/pl
- en/hk
- zh/tw
- ko/kr

The profiles **en/us, en/ca, fr/ca, en/uk, pt/br, de/de, fr/fr, ja/jp** are 'Admin' profiles – they need this identifier to make my verification easier.

There should be two fields marked with a "check" or "X" for each profile. One field is **IMM banner**, the other is **FAQ**. These two fields are not mandatory:

- Profiles that **do not** have IMM banner: ko/kr, zh/hk, en/hk, zh/tw. All other profiles have IMM banner checked.
- Profiles that have FAQ: en/us, en/ca, fr/ca, en/uk, ja/jp.

The **URL.txt** file contains one URL for each category of each profile, please scrape it. At the end of the URL there will be the category name, for example `key=top-deals` indicates that this URL belongs to the top-deals category. The main purpose of this site is to present a button that, when clicked, opens a new browser tab with the URL for that category.

On the main page, present the categories separated by profile.

Create a filter at the top of the page where I can filter by category type or profile, or filter by both simultaneously.

For each profile I need a button with a link to **Future State** and another to **Current State**. Clicking opens a new tab:

- Future State: `https://unifieddeals-md-web-prod.p15.pcf.dell.com/{profile-with-hyphens}/shop/deals/dc/`
- Current State: `https://www.dell.com/{profile-with-hyphens}/shop/deals/`

Replace `en-ca` with the profile in question, converting `/` to `-` (e.g., `en/ca` becomes `en-ca`). This must be present for all profiles.

---

In addition to the category button functionality, I need a second page on this site for data verification. It will have two large text fields for me to input raw data. I want a JavaScript script to compare the two texts and report differences according to the rules below. Another function of this second page is to generate jQuery scripts for form filling.

One text field is called **Content-Studio**, the other **CMX**. When using the compare option, the system should indicate if there are discrepancies based on the comparison rules I'll provide next, and propose jQuery scripts to fill the form. If the CMX field is blank, the system should assume that it should generate the jQuery to fill in all fields.

**Comparison rules:**

| Content-Studio            | CMX                    |
|---------------------------|------------------------|
| Tab Name                  | Display Name           |
| Hero Subtitle             | Short Title            |
| Page / Browser Title      | Browser Title          |
| Page / Browser Title      | Title                  |
| Keywords                  | SEO Keywords           |
| Font Color                | Font Color             |
| Mobile Background Color   | Background Color       |
| Tab Icon Code             | Icon Code              |
| SEO Meta Description      | SEO Description        |

Following the guide above, create a JavaScript script that compares the text entered in the Content-Studio field with the text entered in the CMX field, always considering the line immediately below each field, ignoring leading/trailing spaces. If they differ, generate a script below to replace the text of that field in CMX, using the label as the CMX version from the guide above.

The possible jQuery scripts are:
```
$(document).ready(function () { $('label:contains("Display Name")').closest('.dds__form__field').find('input[type="text"]').val('Content Placeholder'); });

$(document).ready(function () { $('label:contains("Short Title")').closest('.dds__form__field').find('input[type="text"]').val('Content Placeholder'); });

$(document).ready(function () { $('label:contains("Browser Title")').closest('.dds__form__field').find('input[type="text"]').val('Content Placeholder'); });

$(document).ready(function () { $('label:contains("Title")').closest('.dds__form__field').find('input[type="text"]').val('Content Placeholder'); });

$(document).ready(function () { $('label:contains("SEO Keywords")').closest('.dds__form__field').find('input[type="text"]').val('Content Placeholder'); });

$(document).ready(function () { $('label').filter(function () { return $(this).text().trim().replace(/\s+/g, ' ') === 'Font Color'; }).closest('.dds__select').find('select').val('Content Placeholder').trigger('change'); });

$(document).ready(function () { $('label').filter(function () { return $(this).text().trim().replace(/\s+/g, ' ') === 'Background Color'; }).closest('.dds__select').find('select').val('Content Placeholder').trigger('change'); });

$(document).ready(function () { $('label:contains("Icon Code")').closest('.dds__form__field').find('input[type="text"]').val('Content Placeholder'); });

$(document).ready(function () { var lbl = $('label').filter(function() { return $(this).text().trim().replace(/\s+/g, ' ') === 'SEO Description'; }); var tid = lbl.closest('.dds__form__field').find('textarea').attr('id'); if (typeof tinymce !== 'undefined' && tinymce.get(tid)) { tinymce.get(tid).setContent('texto de teste2'); } else { lbl.closest('.dds__form__field').find('iframe').contents().find('body').html('<p>texto de teste2</p>'); } });

```

Each script represents a field to be updated, remembering that it should only be generated if different.

In addition to these fields, there are two more fields that require manual copy. So I need to check whether, in the Content-Studio text field that was entered, there is data on the line immediately below the field **'Hero Description'** and above **'Hero Image'**. If there is, compare it with what is entered below **'Description'** in the CMX field. If they differ, display the warning **"Description" needs to be edited** below the jQuery scripts. Also check whether there is a line of text below the **'Deal Great For Text'** field and above **'Page / Browser Title'**. If there is, compare it with what is entered below **'Deal Great For Text'** in the CMX field. If they differ, display the warning **"Deal Great For Text" needs to be edited** below the jQuery scripts.

After the scripts, also add the information: **"Canonical Url: https://www.dell.com/{l}-{c}/shop/deals/dc/"**.

Take as long as necessary. Do not test in your browser under any circumstances.