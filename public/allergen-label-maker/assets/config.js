/*
 * The only file you need to edit before launch.
 * Everything is optional: with all of these blank the page still works locally.
 */
window.ALM_CONFIG = {
  // Public URL once deployed (used for canonical + sitemap; also set in index.html / sitemap.xml).
  siteUrl: 'https://lunamaze.com/allergen-label-maker',

  // Free prints before the "founding list" prompt appears (one print job = up to 12 labels).
  freePrints: 3,

  // Lead capture. Get a free access key at web3forms.com (they email it to you).
  // Leads arrive in your inbox with the ad click id and UTM tags attached.
  web3formsKey: 'd5daacca-b67b-4598-9a21-5903b604a8c8', // lunamaze.dev@gmail.com, form "Allergen Label Maker founding list"
  leadEndpoint: '', // optional: your own endpoint that accepts JSON POST

  // Analytics (both optional; use Plausible or Umami for cookieless, GA4 if Google Ads needs conversions).
  plausibleDomain: '',
  gaId: 'G-WW8NXCDK0E', // the lunamaze.com GA4 property

  // When set, plan buttons send people here (Stripe/Paddle payment link) instead of the founding list.
  paymentLink: '',

  // Shown in the privacy page and footer when set.
  contactEmail: 'lunamaze.dev@gmail.com',

  // Prices shown on the page. Change here, not in the HTML.
  plans: {
    shop: { name: 'Shop', price: 19, founding: 9 },
    menu: { name: 'Shop + Menu', price: 39, founding: 19 },
  },
};
