// ===== DATA MODULE =====
// All 10 possible deal categories
var ALL_CATEGORIES = [
  'top-deals',
  'clearance-deals',
  'laptop-deals',
  'desktop-deals',
  'gaming-pc-deals',
  'computer-monitor-deals',
  'pc-accessories-deals',
  'business-deals',
  'business-laptop-deals',
  'business-desktop-deals',
];

// Display labels for categories
var CATEGORY_LABELS = {
  'top-deals': 'Top Deals',
  'clearance-deals': 'Clearance Deals',
  'laptop-deals': 'Laptop Deals',
  'desktop-deals': 'Desktop Deals',
  'gaming-pc-deals': 'Gaming PC Deals',
  'computer-monitor-deals': 'Monitor Deals',
  'pc-accessories-deals': 'PC Accessories',
  'business-deals': 'Business Deals',
  'business-laptop-deals': 'Business Laptop',
  'business-desktop-deals': 'Business Desktop',
};

// Admin profiles
var ADMIN_PROFILES = ['en/us', 'en/ca', 'fr/ca', 'en/uk', 'pt/br', 'de/de', 'fr/fr', 'ja/jp'];

// Profiles WITHOUT IMM banner
var NO_IMM = ['ko/kr', 'zh/hk', 'en/hk', 'zh/tw'];

// Profiles WITH FAQ
var HAS_FAQ = ['en/us', 'en/ca', 'fr/ca', 'en/uk', 'ja/jp'];

// Special URL slug mappings (profile → slug)
var SLUG_MAP = {
  'en/uk': 'en-gb',
};

// Helper: convert profile to URL slug
function profileToSlug(profile) {
  return SLUG_MAP[profile] || profile.replace('/', '-');
}

// Helper: build Future State URL
function getFutureStateUrl(profile) {
  return 'https://unifieddeals-md-web-prod.p15.pcf.dell.com/' + profileToSlug(profile) + '/shop/deals/dc/';
}

// Helper: build Current State URL
function getCurrentStateUrl(profile) {
  return 'https://www.dell.com/' + profileToSlug(profile) + '/shop/deals/';
}

// All profiles with their CMX URLs per category (parsed from URL.txt)
var PROFILE_URLS = {
  'en/us': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=d788d685-43b5-4627-ba63-9960aaa47c1c&key=top-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=1603515d-b658-4a17-bda8-ff1ccf404314&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=2d6c4307-f404-4086-8007-8586b4eb38a1&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=658fcee3-bcf6-4f36-9246-bea892f4b1ce&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=f0e796cd-cd7e-43ce-bb65-a7d541c5dfad&key=computer-monitor-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=1071c47f-d9b4-47c8-a828-69beaa49a041&key=business-deals',
  },
  'en/ca': {
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=573d1512-ce8b-4425-9867-d44525a2ea70&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=9592deef-bb6b-40bc-8e9d-fea3eaa68834&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=6e8024e1-3deb-4a8f-952a-afa0961b4632&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=6826e4e4-6ac6-4d51-b077-dffdba977302&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=efff6007-d681-4fce-b0d2-1d7b4ced1372&key=pc-accessories-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=822b9eb2-7fd1-4d4b-95b7-97c7c43f7cf4&key=business-deals',
    'clearance-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=568f0c3c-544b-4900-8650-89372c0e867e&key=clearance-deals',
  },
  'fr/ca': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=a8dfb8e8-517c-49a8-8c49-6004c0b35279&key=top-deals',
    'clearance-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=12748e52-0195-4387-b241-12b66aacbd54&key=clearance-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=687ac4f5-a629-4d3a-a172-199455e30b7c&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=8fe6c7dd-215b-44fa-a7e3-7394518b6025&key=desktop-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=18e6dc4f-0078-4f43-8523-9d91037be875&key=business-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=dde110c2-7b33-42f6-aa8a-ed471cd38f57&key=pc-accessories-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=f049abd9-7686-49f9-ae0d-4d873d9994ff&key=computer-monitor-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=2d6841e0-cec4-42e5-bf8e-7e9dfb1713a4&key=gaming-pc-deals',
  },
  'zh/cn': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=e9571435-794a-4d0c-8b89-c5c2de21ddee&key=top-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=b9bc43c8-2894-426d-a1f5-21e219273dc1&key=business-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=e4c2ff46-3a16-4161-95d7-25623e9b966c&key=laptop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=5169bb26-ef73-4026-8396-d2e0bd580534&key=gaming-pc-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=3308b0b9-16d6-4a44-8df7-cb1ed159fa02&key=desktop-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=b4043194-faac-4b45-881f-2d112d1ba6bb&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=f4301919-453e-47ad-a30c-dc2b37329395&key=pc-accessories-deals',
  },
  'en/uk': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=ff3c5559-2ed6-4bd7-b7ac-f59c9790b3a3&key=top-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=a4fabacc-ad2a-41cc-b21c-2979035a614b&key=laptop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=2d21aea4-fe47-47d2-a3da-1231e8e93238&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=8b8b5ea2-ba8c-4fcb-8396-911908f3fcb4&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=0d686f18-bdf7-4cbb-9c71-d5b7adefe26d&key=pc-accessories-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=3dec99d3-8b73-404a-803d-243dc25790cd&key=business-deals',
  },
  'pt/br': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=ff3c5559-2ed6-4bd7-b7ac-f59c9790b3a3&key=top-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=8926cf71-0ae5-4cd4-ba38-073658ed169b&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=92592dab-8c0e-428a-8987-44c3eb5fde12&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=5171cd1a-1947-4c9e-9947-43784cef4113&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=8e4d938e-84fa-4ceb-b95b-b45bf11df3d0&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=acfad1ed-8ee6-483b-a873-585e164a2ab5&key=pc-accessories-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=36475cf9-3fab-446a-9426-12fa72fd8c61&key=business-deals',
  },
  'de/de': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=e8b935e0-491b-4ee9-b975-926e141f38b7&key=top-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=c2cf9703-d306-43fc-9e9c-7f12eb830611&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=19dd03cc-1824-48c4-b0cb-a5b1affe6cb2&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=7fde3d0e-5fdd-4739-b31e-224c6ee530af&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=8409ec10-67fa-424d-8f75-5f769f15934c&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=b451a80e-0c97-4904-abab-dfb13630dbbf&key=pc-accessories-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=82b07321-0d29-4ebd-b773-00195a0be318&key=business-deals',
  },
  'fr/fr': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=a21bb75f-4bea-4dbb-9fb5-a708e2421115&key=top-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=c923b29c-fd39-4e3b-b49d-d55257ca5225&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=b6aed821-a9b0-43ab-9d5a-c3a97f324092&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=06808108-0506-4748-889c-5de3e95b839d&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=4f558ab5-db76-4c25-bf46-5cba4c5e787f&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=16977e0f-89aa-4cc9-88c0-a3647234ccf6&key=pc-accessories-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=30a0ea54-2b56-4c63-b4d0-ec3dd317b785&key=business-deals',
  },
  'sv/se': {
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=34747d66-9104-45a0-a670-1168e75bf370&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=202e8b75-2768-454d-9219-2554213ef545&key=desktop-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=85ac854b-44aa-43b3-b738-a94907aca572&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=b6e40f05-aa46-4382-a871-935676667ce3&key=pc-accessories-deals',
  },
  'ja/jp': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=e51dc438-8a74-4c9b-896c-4fd39f3e2f4b&key=top-deals',
    'clearance-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=9b210e79-9f4f-4b2b-a6e3-0a4117aabd25&key=clearance-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=93c0923b-85d9-4c24-8bc5-cb73a1ed9ba8&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=0ba0f114-7c96-45cc-96bb-e1d13d849023&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=47436984-f375-4854-8c88-e988577f0ba7&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=abd1a3e9-21c7-4b66-8e7b-e9de5c7a9e0f&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=1b3bf041-e820-45a9-97bf-604a874f6f03&key=pc-accessories-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=284e12b9-f4c2-4f99-bb4a-24cf81777d62&key=business-deals',
  },
  'en/in': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=7e5caef7-3786-4591-b623-fbd6151280c9&key=top-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=599093ec-7b08-47e5-a424-0b47585c7915&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=90dafeba-557d-4335-938a-6582dc15f678&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=ba4e7846-741d-4493-8517-2f0c803224b9&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=a53eba91-5796-443b-bdd6-022ee9929f63&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=8861ac67-82f2-4142-a45d-158f6d4a345b&key=pc-accessories-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=66cbc2e0-98ec-476d-af23-2661f1088fd0&key=business-deals',
  },
  'de/ch': {
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=142b195d-619b-465c-a012-72506f2f5e3f&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=81ac869e-d4e7-417f-8008-14acd7cde7d6&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=e03f435a-dfcd-4f7c-a54c-cad0bc67f05e&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=6b90be9a-4464-4a9d-852b-93fbafed6fe9&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=0edaa638-f3b3-459e-8a36-a2d9c9190cca&key=pc-accessories-deals',
  },
  'en/sg': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=283beef9-f76b-4977-b8d9-f79739aacad4&key=top-deals',
    'clearance-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=bd79beca-d0f6-4298-ae70-73021256d67d&key=clearance-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=63c1ac64-ce8b-4520-b2e8-5664815d26fb&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=e454f336-2299-4373-bb1c-d9d8a9f970af&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=b578b62f-26b8-4cc9-b274-16c502fa1d33&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=13020414-20a7-4df4-95c8-1046cbd4782c&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=78353f73-6e96-4920-a019-b9fca598ccfe&key=pc-accessories-deals',
  },
  'en/my': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=6ecc2a65-cdd1-42af-a8da-58eb80fc98bf&key=top-deals',
    'clearance-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=d1d87ea3-be8a-4d24-bef5-fed55fbda28c&key=clearance-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=7342cc74-bbc3-40e1-8502-c4232325ea74&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=79fd339e-d267-4a83-827c-780120df8625&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=aed2acd8-10ef-4998-baf1-a015ba46e816&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=836cb06e-e1a0-4c0b-ba2e-8ac1452b23db&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=f058689c-c9d8-4911-8421-816094410a79&key=pc-accessories-deals',
  },
  'nl/nl': {
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=15fd6db3-e34a-46dd-a84e-ca0b80fa216b&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=4c27bc25-e6ef-42cc-8fe6-9223fc15e4a6&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=e9529c72-bdfa-4293-b053-fb597841f615&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=681f9945-5fee-4ebf-9674-03ab5ff95c32&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=f1bdfa9b-f1ec-4ad0-b1cd-2fb0854a6b35&key=pc-accessories-deals',
  },
  'es/es': {
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=5601e346-7be8-4acd-90e3-642c015521a4&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=f4971ebf-2a4c-4477-bf47-1a40d8fbbec1&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=1b8e68c3-d1eb-4401-8b9d-07e08ad27fb6&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=10f15046-1fc5-4904-9627-4219606fda10&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=f587b206-b4dd-48d6-88ac-7e43a52be788&key=pc-accessories-deals',
  },
  'de/at': {
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=7b7c7833-7f12-4bab-8766-3d1d5f9f9716&key=computer-monitor-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=12b10ff2-6f92-45ac-bc5e-23f40f3cc2a1&key=business-deals',
  },
  'nl/be': {
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=e77d96b6-12ec-4b1a-8331-588ba96492e9&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=0f9339bd-a301-4e4d-b93e-5e24f28995ab&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=dca7fc33-8157-44a8-9c9f-810060891a86&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=4b550052-59e3-4af0-81bb-b7b95b81eef1&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=43abd264-0d41-426c-901b-ca21eadd9b3a&key=pc-accessories-deals',
  },
  'fr/be': {
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=79ea1fad-9e92-49f2-9f40-cd648b8f8b40&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=e559694f-841a-4358-9af5-f4ab2e1552a2&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=6d7a9f50-f7cc-4d01-8b9d-db0f6e8da9d4&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=243bdc69-dd6a-44b4-9850-a4275cae9211&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=2d1d9c68-9c56-4ade-9429-97ba3aede799&key=pc-accessories-deals',
  },
  'fr/ch': {
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=43ca9f39-d025-47f0-8117-b2572f19b00b&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=8af76c56-4423-40eb-8029-815971e4fa09&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=9376e0f1-644b-4a0d-9b22-cfd54e33ad0a&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=bf292700-20dd-43da-86ad-783e4d0297d5&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=33ffc7e5-3f12-405e-8016-0df346b1e18b&key=pc-accessories-deals',
  },
  'da/dk': {
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=698fdd8b-96ab-45d1-83c4-5ebc0f49d8d6&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=9ecd7faa-8618-4366-b02d-676e7d29b302&key=desktop-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=b6821f57-5036-4da0-a4c7-776d9159d87d&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=c4b55ea6-40fe-477e-9e98-8cd277c30f63&key=pc-accessories-deals',
  },
  'en/ie': {
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=f66eb3f5-00da-431c-b053-9b2da8a73eff&key=laptop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=826703ab-b5e1-4f51-8338-f8d9eba01e0c&key=gaming-pc-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=d4fc5b6c-a601-4724-824c-b8fb8f2aa97b&key=desktop-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=81adb4b5-00ca-463f-ae85-9c53ac37ec60&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=0e418c72-d6ed-4440-899e-f3bea8836848&key=pc-accessories-deals',
  },
  'it/it': {
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=5955e8a7-4615-42dd-9226-1406221ac88a&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=363582d5-2b0b-4981-b1c6-a9dd8364411a&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=58d913c1-5f1f-42e1-b671-cbe76f0d02f9&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=23227ef4-f84c-4f49-bde1-1bc400c7d06a&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=a4cb2985-9e9b-4fb2-9f97-024f212df390&key=pc-accessories-deals',
  },
  'no/no': {
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=cffb05ee-abe6-447f-b737-8d79dbae0a69&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=befc8935-a44b-49e5-9102-9ab08bfb798c&key=desktop-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=60836996-3385-4d42-8f52-c92a6cc42da7&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=6bb7b5c6-fdb2-4cd8-8222-7df5c2deff46&key=pc-accessories-deals',
  },
  'en/hk': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=d7726ead-d97e-4b7e-9399-9493c6858fd6&key=top-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=8d1a1145-5524-4646-a791-5c4fc8b7280e&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=fe87ffcc-adee-42e0-ae74-56b8c528cf98&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=73e5c400-a42d-4b8b-b641-437c6c4d7ce9&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=09d226f3-3e08-4dd6-9fe4-6fd96db4c7d7&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=b8ba91b4-60f0-4b25-9090-1d08acda899d&key=pc-accessories-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=64a47f2f-2ec6-4603-b3c6-335da06486d7&key=business-deals',
  },
  'zh/hk': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=ef833764-1823-481c-8ed0-5c7a0fb35a23&key=top-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=ceeaa24c-950d-40c2-9caf-a9b75626b6b0&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=88901225-055c-4c5f-99f1-5881ebccd9f4&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=f331f051-3103-4531-902c-066edf01dbd5&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=d4e9b06f-654e-4522-8084-c702746adcb0&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=d48e6104-41d8-423a-a2a2-b59ccb0833e8&key=pc-accessories-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=3e4ee9f4-5dda-440c-80c9-2fcb9a4ddb06&key=business-deals',
  },
  'zh/tw': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=2629b1ab-8dce-469c-b2bb-c4ffd12c6509&key=top-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=54ead2e3-57a6-4e7a-b114-0ecba8bc7293&key=laptop-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=57909167-7f27-439c-a18f-4338e5b6fbff&key=computer-monitor-deals',
  },
  'ko/kr': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=1bd8f90a-b4b3-4473-ba5a-5a0e53e1936c&key=top-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=0d4e9682-efd0-45e3-bda1-1e5be0f4d0e2&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=f144a537-5a26-4189-a8ec-bf749729d7e1&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=ba5636e3-0725-4a4e-9076-d2f1c44d23f7&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=cf2bf7e8-1c1d-44d3-9d05-d7ab22ef110b&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=d2ad89bb-c945-43f8-9a35-782b96d1fbe8&key=pc-accessories-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=30440fdb-473c-4ffb-bceb-22bbe058a17a&formtype=item&id=dac43c89-c492-494e-bbcd-1376ee390851&key=business-deals',
  },
};

// IMM Profiles URLs
var IMM_PROFILE_URLS = {
  'ja/jp': {
    'business-laptop-deals': 'https://cmxtools.dell.com/content?collectionid=af168bc2-6722-48d0-9147-c4edbdbd5f8e&formtype=item&id=ae0fbea9-fd60-4710-82a1-cf365ff2fa57&key=business-laptop-deals',
    'business-desktop-deals': 'https://cmxtools.dell.com/content?collectionid=af168bc2-6722-48d0-9147-c4edbdbd5f8e&formtype=item&id=033fec63-0b64-4117-ab41-524f328bba66&key=business-desktop-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=af168bc2-6722-48d0-9147-c4edbdbd5f8e&formtype=item&id=1e379b47-57d2-40d1-9d4d-9ef61198f09e&key=business-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=af168bc2-6722-48d0-9147-c4edbdbd5f8e&formtype=item&id=9fd47b63-e23d-4b88-a2f4-eeb8bce5ad3f&key=pc-accessories-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=af168bc2-6722-48d0-9147-c4edbdbd5f8e&formtype=item&id=33e1851c-56fa-46b2-8489-6cbceefb0053&key=computer-monitor-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=af168bc2-6722-48d0-9147-c4edbdbd5f8e&formtype=item&id=de22d18b-19f2-4aa2-8b20-c8dacf6bec8d&key=gaming-pc-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=af168bc2-6722-48d0-9147-c4edbdbd5f8e&formtype=item&id=9b5dd19c-febe-42c9-aa94-761dbb8c5c98&key=desktop-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=af168bc2-6722-48d0-9147-c4edbdbd5f8e&formtype=item&id=d9abedf0-b37d-4147-9d47-f82c20f546f5&key=laptop-deals',
    'clearance-deals': 'https://cmxtools.dell.com/content?collectionid=af168bc2-6722-48d0-9147-c4edbdbd5f8e&formtype=item&id=6b1ae5a2-68f7-4900-86bd-fe74bbaf8000&key=clearance-deals',
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=af168bc2-6722-48d0-9147-c4edbdbd5f8e&formtype=item&id=10739488-a29b-47d0-b10c-b7ca11fbd31d&key=top-deals',
  }
};

// FAQ Profiles URLs
var FAQ_PROFILE_URLS = {
  'en/us': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=b3b25381-0c39-4279-bcf7-b13caab98c8b&key=top-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=db5446a4-fd85-4ccd-b627-0b907dd536c0&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=0d97a241-9a0d-4c41-be6c-5d885b485a46&key=desktop-deals',
    'computer-monitor-deals': 'http://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=77f45ed0-00bc-411f-bb0f-0545ae2906d6&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=84e6be28-ec6f-45ad-a98f-7cc443a0bb56&key=pc-accessories-deals',
    'business-laptop-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=dfd17bfb-7a9d-43a7-8827-27911dd7b281&key=business-laptop-deals',
    'business-desktop-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=6ae3e28d-1c55-4a92-ac54-189289180c92&key=business-desktop-deals',
  },
  'en/ca': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=04650e5d-c75e-4dc6-8b14-1d80b8773277&key=top-deals',
    'clearance-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=1c3b28c2-5e52-4345-b55e-f500b9a953a2&key=clearance-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=34f20fbc-f802-49cc-8f80-d30ac0236423&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=16def5a2-bb5e-4ea2-8f31-73fa65f126da&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=4d5a6601-29e9-4702-a6ae-57dbc5da84db&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=338187d5-d86a-4296-8697-c5bf964be723&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=b4fe8533-7bfe-425e-b705-a53fe740b704&key=pc-accessories-deals',
    'business-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=c7d40d65-a1d0-4885-9b7c-16df0df6deec&key=business-deals',
  },
  'fr/ca': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=cc4fe57c-59ee-45a2-b2af-186f54ac3708&key=top-deals',
    'clearance-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=8b726f52-0782-48c2-9e0d-e01fa1771dea&key=clearance-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=e237c93f-da0d-4b83-aa77-b9d02702feac&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=112384ab-0b3d-45b4-a277-b1b86de5435b&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=3079aca1-5881-4d54-9f38-aac9c28cf1f1&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=34d41e00-5fde-47c9-93a5-68fe4315aab1&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=72279440-5ca3-42df-842c-72d94f5cd012&key=pc-accessories-deals',
  },
  'en/uk': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=97881b38-ded4-4d2d-9409-268ecbc126f7&key=top-deals',
    'clearance-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=20d7cc42-f3cc-40b7-859c-ac6ece1d4c68&key=clearance-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=07e7f619-bdc0-4e95-b357-9dbf1d10c405&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=0c84cca1-7919-4a4f-9eae-bd2a2badad6d&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=e1b21999-8e39-494a-b4dd-5c27a60edd61&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=acd04844-f641-43c9-967b-59e3498700ec&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=358c3973-30b0-4bb9-a998-f876dcb822b6&key=pc-accessories-deals',
  },
  'ja/jp': {
    'top-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=2b3b2804-6457-4230-b81a-afff47f4a8de&key=top-deals',
    'clearance-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=74024372-8094-48d2-9d0a-86b8924f6313&key=clearance-deals',
    'laptop-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=fc70d850-05da-4df1-afe7-bd1f9fa13818&key=laptop-deals',
    'desktop-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=a5e9b630-099e-4bc6-8071-dac78d8c8929&key=desktop-deals',
    'gaming-pc-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=2e90c7c3-cd77-41a7-910d-17e2dec50db3&key=gaming-pc-deals',
    'computer-monitor-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=256dbb72-554e-4ae2-bd0f-8d38c9c1aca7&key=computer-monitor-deals',
    'pc-accessories-deals': 'https://cmxtools.dell.com/content?collectionid=d2b27735-a022-4e49-b493-5e6d89f85be4&formtype=item&id=50b8b9e3-5bd6-4a27-8376-febff91286a3&key=pc-accessories-deals',
  }
};

// Profile display order
var PROFILE_ORDER = [
  'en/us', 'en/ca', 'fr/ca', 'zh/cn', 'en/uk', 'pt/br',
  'de/de', 'fr/fr', 'sv/se', 'ja/jp', 'en/in', 'de/ch',
  'en/sg', 'en/my', 'nl/nl', 'es/es', 'de/at', 'nl/be',
  'fr/be', 'fr/ch', 'da/dk', 'en/ie', 'it/it', 'no/no',
  'en/hk', 'zh/hk', 'zh/tw', 'ko/kr',
];

// Build the profiles array with computed flags
var profiles = PROFILE_ORDER.map(function (id) {
  return {
    id: id,
    slug: profileToSlug(id),
    isAdmin: ADMIN_PROFILES.indexOf(id) !== -1,
    hasIMM: NO_IMM.indexOf(id) === -1,
    hasFAQ: HAS_FAQ.indexOf(id) !== -1,
    categories: PROFILE_URLS[id] || {},
  };
});

var immProfiles = Object.keys(IMM_PROFILE_URLS).map(function (id) {
  return {
    id: id,
    slug: profileToSlug(id),
    isAdmin: ADMIN_PROFILES.indexOf(id) !== -1,
    hasIMM: true,
    hasFAQ: HAS_FAQ.indexOf(id) !== -1,
    categories: IMM_PROFILE_URLS[id] || {},
  };
});

var faqProfiles = Object.keys(FAQ_PROFILE_URLS).map(function (id) {
  return {
    id: id,
    slug: profileToSlug(id),
    isAdmin: ADMIN_PROFILES.indexOf(id) !== -1,
    hasIMM: NO_IMM.indexOf(id) === -1,
    hasFAQ: true,
    categories: FAQ_PROFILE_URLS[id] || {},
  };
});

// ===== COMPARISON RULES =====
var COMPARISON_RULES = [
  { csLabel: 'Tab Name', cmxLabel: 'Display Name', templateType: 'text-input' },
  { csLabel: 'Hero Subtitle', cmxLabel: 'Short Title', templateType: 'text-input' },
  { csLabel: 'Page / Browser Title', cmxLabel: 'Browser Title', templateType: 'text-input' },
  { csLabel: 'Page / Browser Title', cmxLabel: 'Title', templateType: 'text-input' },
  { csLabel: 'Keywords', cmxLabel: 'SEO Keywords', templateType: 'text-input' },
  { csLabel: 'Font Color', cmxLabel: 'Font Color', templateType: 'select-dropdown' },
  { csLabel: 'Mobile Background Color', cmxLabel: 'Background Color', templateType: 'select-dropdown' },
  { csLabel: 'Tab Icon Code', cmxLabel: 'Icon Code', templateType: 'text-input' },
  { csLabel: 'SEO Meta Description', cmxLabel: 'SEO Description', templateType: 'tinymce-textarea' },
];

var MANUAL_FIELDS = [
  {
    csLabel: 'Hero Description',
    csEndLabel: 'Hero Image',
    cmxLabel: 'Description',
    templateType: 'tinymce-textarea',
    warningText: '"Description" ("Hero Description" on Content Studio) will be edited',
  },
  {
    csLabel: 'Deal Great For Text',
    csEndLabel: 'Page / Browser Title',
    cmxLabel: 'Deal Great For Text',
    templateType: 'tinymce-textarea',
    warningText: '"Deal Great For Text" will be edited',
  },
];
