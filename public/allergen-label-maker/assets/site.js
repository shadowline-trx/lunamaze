/*
 * Shared by every page: analytics (optional), ad attribution, prices from config, contact line.
 * Must load before app.js.
 */
(function () {
  'use strict';
  var C = window.ALM_CONFIG || {};
  var IS_LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  // ---- analytics (cookieless Plausible and/or GA4; both optional)
  function initAnalytics() {
    if (C.plausibleDomain) {
      window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
      var s = document.createElement('script');
      s.defer = true; s.setAttribute('data-domain', C.plausibleDomain); s.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(s);
    }
    if (C.gaId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      var g = document.createElement('script');
      g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(C.gaId);
      document.head.appendChild(g);
      window.gtag('js', new Date());
      window.gtag('config', C.gaId);
    }
  }
  function track(name, props) {
    props = props || {};
    try {
      if (window.plausible) window.plausible(name, { props: props });
      if (window.gtag) window.gtag('event', name, props);
    } catch (e) { /* analytics must never break the page */ }
    if (IS_LOCAL) console.debug('[track]', name, props);
  }

  // ---- remember which ad brought them (kept for the session, attached to the lead)
  function sread(key) { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (e) { return null; } }
  function swrite(key, val) { try { sessionStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ } }
  function captureAttribution() {
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
    var cur = sread('alm_attr') || {};
    var p = new URLSearchParams(location.search);
    keys.forEach(function (k) { if (p.get(k)) cur[k] = p.get(k); });
    if (!cur.landing) { cur.landing = location.pathname; cur.referrer = document.referrer || ''; }
    swrite('alm_attr', cur);
    return cur;
  }

  window.ALM = { track: track, captureAttribution: captureAttribution, isLocal: IS_LOCAL };
  initAnalytics();
  captureAttribution();

  // ---- click tracking for any element with data-track="event_name"
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (el) track(el.getAttribute('data-track'), { page: location.pathname });
  });

  // ---- prices + contact from config
  var plans = C.plans || {};
  var money = function (n) { return '$' + n; };
  var set = function (sel, txt) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) { el.textContent = txt; });
  };
  if (plans.shop) {
    set('[data-price="shop-full"]', money(plans.shop.price));
    set('[data-price="shop-founding"]', money(plans.shop.founding));
    set('[data-price="shop-founding-mo"]', money(plans.shop.founding) + '/month');
  }
  if (plans.menu) {
    set('[data-price="menu-full"]', money(plans.menu.price));
    set('[data-price="menu-founding"]', money(plans.menu.founding));
    set('[data-price="menu-founding-mo"]', money(plans.menu.founding) + '/month');
  }
  var contact = document.getElementById('contact-line');
  if (contact && C.contactEmail) contact.innerHTML = ' · <a href="mailto:' + C.contactEmail + '">' + C.contactEmail + '</a>';
  var mail = document.getElementById('contact-email');
  if (mail) {
    if (C.contactEmail) mail.innerHTML = '<a href="mailto:' + C.contactEmail + '">' + C.contactEmail + '</a>';
    else mail.textContent = 'the contact address listed on this site';
  }
})();
