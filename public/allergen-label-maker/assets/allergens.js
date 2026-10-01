/*
 * Allergen detection for the label maker.
 *
 * It SUGGESTS allergens from free text; the person printing the label confirms.
 * Work on a masked copy of the text (same length as the original) so false
 * positives like "peanut butter" or "coconut milk" can be blanked out without
 * shifting the character positions we later use for highlighting.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Allergens = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---- term lists (regex fragments, matched case-insensitively on word boundaries)
  const MILK = [
    'milks?', 'butter', 'buttermilk', 'creams?', 'cheeses?', 'cheddar', 'mozzarella', 'parmesan',
    'parmigiano', 'ricotta', 'mascarpone', 'feta', 'gouda', 'brie', 'paneer', 'yogh?urts?', 'whey',
    'casein(?:ate)?', 'lactose', 'ghee', 'custard', 'ice[- ]cream', 'gelato', 'kefir',
    'half[- ]and[- ]half', 'buttercream', 'ganache', 'b[ée]chamel', 'alfredo', 'curds?', 'dairy',
  ];
  const EGGS = [
    'eggs?', 'albumin', 'albumen', 'mayonnaise', 'mayo', 'meringue', 'aioli', 'hollandaise',
    'lysozyme', 'ovalbumin', 'eggnog', 'quiche', 'custard',
  ];
  const FISH = [
    'fish', 'salmon', 'tuna', 'cod', 'haddock', 'tilapia', 'trout', 'anchov(?:y|ies)', 'sardines?',
    'mackerel', 'herring', 'halibut', 'snapper', 'pollock', 'swordfish', 'mahi[- ]mahi', 'surimi',
    'worcestershire', 'caesar',
  ];
  const CRUSTACEANS = [
    'shrimps?', 'prawns?', 'crabs?', 'lobsters?', 'craw?fish', 'crayfish', 'langoustines?', 'krill',
    'crustaceans?', 'scampi',
  ];
  const MOLLUSCS = [
    'mussels?', 'oysters?', 'clams?', 'scallops?', 'squid', 'calamari', 'octopus', 'cuttlefish',
    'snails?', 'escargot', 'whelks?', 'winkles?', 'abalone', 'cockles?', 'molluscs?', 'mollusks?',
  ];
  const TREE_NUTS_COMMON = [
    'almonds?', 'cashews?', 'walnuts?', 'pecans?', 'pistachios?', 'hazelnuts?', 'filberts?',
    'macadamias?', 'macadamia nuts?', 'brazil nuts?', 'pralines?', 'marzipan', 'frangipane', 'nougat',
    'amaretto', 'gianduja', 'nutella', 'tree nuts?', 'nuts?',
  ];
  const TREE_NUTS_US = TREE_NUTS_COMMON.concat(['chestnuts?', 'pine ?nuts?']);
  const PEANUTS = ['peanuts?', 'groundnuts?', 'ground nuts?', 'goobers?', 'arachis', 'satay'];
  const SOY = [
    'soy', 'soya', 'soy ?beans?', 'soya ?beans?', 'tofu', 'edamame', 'miso', 'tempeh', 'tamari',
    'shoyu', 'teriyaki', 'textured vegetable protein', 'tvp',
  ];
  const SESAME = ['sesame', 'tahini', 'benne', 'halva', 'halvah', 'gomasio', 'hummus', 'hoummos'];
  const WHEAT_FLOURS = '(?:all[- ]purpose|bread|cake|pastry|plain|strong|self[- ]raising|self[- ]rising|enriched|bleached|unbleached|white|whole[- ]?meal|wholemeal|whole[- ]wheat)\\s+flour';
  const WHEAT = [
    'wheat', 'durum', 'semolina', 'spelt', 'farro', 'kamut', 'khorasan', 'einkorn', 'emmer', 'bulgur',
    'couscous', 'seitan', 'graham', 'panko', 'bread ?crumbs?', 'croutons?', 'gluten', 'maida', 'atta',
    WHEAT_FLOURS,
  ];
  const GLUTEN_UK = [
    'wheat', 'rye', 'barley', 'oats?', 'oatmeal', 'spelt', 'kamut', 'khorasan', 'einkorn', 'emmer',
    'durum', 'semolina', 'bulgur', 'couscous', 'farro', 'seitan', 'malt(?:ed)?', 'gluten', 'graham',
    'panko', 'bread ?crumbs?', 'croutons?', 'maida', 'atta', WHEAT_FLOURS,
  ];

  const DEFS = {
    us: {
      order: ['milk', 'eggs', 'fish', 'shellfish', 'tree_nuts', 'peanuts', 'wheat', 'soy', 'sesame'],
      items: {
        milk: { label: 'Milk', terms: MILK },
        eggs: { label: 'Eggs', terms: EGGS },
        fish: { label: 'Fish', terms: FISH },
        shellfish: { label: 'Crustacean shellfish', terms: CRUSTACEANS },
        tree_nuts: { label: 'Tree nuts', terms: TREE_NUTS_US },
        peanuts: { label: 'Peanuts', terms: PEANUTS },
        wheat: { label: 'Wheat', terms: WHEAT },
        soy: { label: 'Soy', terms: SOY },
        sesame: { label: 'Sesame', terms: SESAME },
      },
    },
    uk: {
      order: ['gluten', 'crustaceans', 'molluscs', 'eggs', 'fish', 'peanuts', 'soya', 'milk', 'nuts', 'celery', 'mustard', 'sesame', 'sulphites', 'lupin'],
      items: {
        gluten: { label: 'Cereals containing gluten', terms: GLUTEN_UK },
        crustaceans: { label: 'Crustaceans', terms: CRUSTACEANS },
        molluscs: { label: 'Molluscs', terms: MOLLUSCS },
        eggs: { label: 'Eggs', terms: EGGS },
        fish: { label: 'Fish', terms: FISH },
        peanuts: { label: 'Peanuts', terms: PEANUTS },
        soya: { label: 'Soya', terms: SOY },
        milk: { label: 'Milk', terms: MILK },
        nuts: { label: 'Tree nuts', terms: TREE_NUTS_COMMON.concat(['pine ?nuts?']) },
        celery: { label: 'Celery', terms: ['celery', 'celeriac'] },
        mustard: { label: 'Mustard', terms: ['mustard'] },
        sesame: { label: 'Sesame', terms: SESAME },
        sulphites: { label: 'Sulphites', terms: ['sulph?ites?', 'sulph?ur dioxide', 'e22[0-8]', 'metabisulph?ite'] },
        lupin: { label: 'Lupin', terms: ['lupin', 'lupine'] },
      },
    },
  };

  // Compile once.
  Object.keys(DEFS).forEach(function (region) {
    const items = DEFS[region].items;
    Object.keys(items).forEach(function (id) {
      items[id].re = new RegExp('\\b(?:' + items[id].terms.join('|') + ')\\b', 'gi');
    });
  });

  // ---- false-positive masking. Each rule blanks part of the text with spaces.
  // "tail" rules blank only the last capture group; "all" rules blank the whole match.
  const TAIL_RULES = [
    // nut/seed butters and plant "milks": keep the nut word, drop the dairy word
    /\b(?:peanut|almond|cashew|hazelnut|walnut|pecan|pistachio|nut|sesame|sunflower|soy|soya|coconut|oat|rice|hemp|pea)\s+(milk|cream|butter|yogh?urt|cheese)\b/gi,
  ];
  const ALL_RULES = [
    /\bcocoa\s+butter\b/gi,
    /\bshea\s+butter\b/gi,
    /\bcream\s+of\s+tartar\b/gi,
    /\bbutternut\b/gi,
    /\beggplants?\b/gi,
    /\begg\s+plants?\b/gi,
    /\bwater\s+chestnuts?\b/gi,
    /\bnon[- ]dairy\b/gi,
    /\b(?:dairy|gluten|nut|egg|soy|soya|wheat|milk|lactose|peanut|sesame)[- ]free\b/gi,
  ];

  function blank(s) {
    return new Array(s.length + 1).join(' ');
  }

  function mask(text) {
    let t = text;
    TAIL_RULES.forEach(function (re) {
      t = t.replace(re, function (m, tail) {
        return m.slice(0, m.length - tail.length) + blank(tail);
      });
    });
    ALL_RULES.forEach(function (re) {
      t = t.replace(re, blank);
    });
    return t;
  }

  // ---- "flour" and "lecithin" depend on the word before them.
  const NON_WHEAT_FLOUR = /^(?:rice|almond|corn|coconut|chickpea|garbanzo|potato|tapioca|cassava|buckwheat|sorghum|millet|teff|quinoa|oat|gram|arrowroot|cashew|hazelnut|peanut|soy|soya|besan|lentil|pea|banana|maize|rye|barley|spelt|amaranth|chestnut|lupin)$/i;
  const WHEAT_FLOUR_MOD = /^(?:wheat|all[- ]purpose|bread|cake|pastry|plain|strong|self[- ]raising|self[- ]rising|enriched|bleached|unbleached|white|wholemeal|whole[- ]?meal|whole[- ]wheat)$/i;

  function prevWord(text, index) {
    const m = /([A-Za-z-]+)\s*$/.exec(text.slice(Math.max(0, index - 30), index));
    return m ? m[1] : '';
  }

  function bareFlourHits(masked) {
    const out = [];
    const re = /\bflours?\b/gi;
    let m;
    while ((m = re.exec(masked))) {
      const p = prevWord(masked, m.index);
      if (NON_WHEAT_FLOUR.test(p)) continue;
      out.push({ term: m[0], start: m.index, end: m.index + m[0].length, bare: !WHEAT_FLOUR_MOD.test(p) });
    }
    return out;
  }

  // ---- things worth a second look (never auto-check an allergen)
  const WATCH = [
    { re: /\bnatural\s+flavou?rs?\b|\bflavou?rings?\b|\bspices?\b|\bseasonings?\b/i, note: 'Flavours, spices and seasonings can hide allergens. Ask your supplier for the full ingredient list.' },
    { re: /\bchocolate\b|\bcocoa\b|\bchoc(?:olate)?\s+chips?\b/i, note: 'Chocolate is often made with milk or soy lecithin and can carry nut traces. Check the pack.' },
    { re: /\bmargarine\b|\bspreads?\b/i, note: 'Margarine and spreads often contain milk. Check the pack.' },
    { re: /\bcaramel\b|\btoffee\b|\bfudge\b|\bbutterscotch\b/i, note: 'Caramel, toffee and fudge are usually made with cream or butter. Tick Milk if so.' },
    { re: /\bpasta\b|\bnoodles?\b|\bcrackers?\b|\bbreads?\b|\bbuns?\b|\btortillas?\b|\bpastry\b|\bdough\b/i, note: 'Usually wheat. Confirm the type (rice noodles, for example, are not wheat).' },
    { re: /\bpesto\b/i, note: 'Pesto usually has pine nuts and cheese. Tick Tree nuts and Milk if so.' },
    { re: /\bmay contain\b|\btraces? of\b/i, note: '"May contain" is a precaution, not an ingredient. Word it the way your local regulator advises.' },
  ];
  const WATCH_US_ONLY = [
    { re: /\boats?\b|\boatmeal\b|\bbarley\b|\brye\b|\bmalt\b/i, note: 'Oats, barley, rye and malt are not US major allergens, but tell gluten-sensitive customers if you can.' },
  ];
  const WATCH_UK_ONLY = [
    { re: /\bwine\b|\bcider\b|\bvinegar\b|\bdried\s+(?:apricots?|fruit)\b|\braisins?\b|\bsultanas?\b/i, note: 'Wine, cider, dried fruit and some vinegars often contain sulphites. Check.' },
    { re: /\bpine\s?nuts?\b/i, note: 'Pine nuts are not on the UK legal list, but many caterers declare them under nuts. Ticking it is the safer call.' },
  ];

  function detect(text, region) {
    region = region === 'uk' ? 'uk' : 'us';
    const def = DEFS[region];
    const masked = mask(String(text || ''));
    const found = {};
    const watch = [];

    def.order.forEach(function (id) {
      const item = def.items[id];
      item.re.lastIndex = 0;
      const hits = [];
      let m;
      while ((m = item.re.exec(masked))) {
        hits.push({ term: m[0], start: m.index, end: m.index + m[0].length });
        if (m[0].length === 0) item.re.lastIndex++;
      }
      if (hits.length) found[id] = hits;
    });

    // Bare or unusual flours.
    const wheatId = region === 'uk' ? 'gluten' : 'wheat';
    bareFlourHits(masked).forEach(function (h) {
      (found[wheatId] = found[wheatId] || []).push({ term: h.term, start: h.start, end: h.end });
      if (h.bare) {
        watch.push({ term: h.term, note: '"Flour" with no type is treated as wheat. If it is rice, corn or another flour, write that instead.' });
      }
    });
    if (found[wheatId]) found[wheatId].sort(function (a, b) { return a.start - b.start; });

    // Lecithin with no source.
    const lec = /\blecithin\b/gi;
    let lm;
    while ((lm = lec.exec(masked))) {
      const p = prevWord(masked, lm.index);
      if (!/^(?:soy|soya|soybean|sunflower|rapeseed|egg)$/i.test(p)) {
        watch.push({ term: lm[0], note: 'Lecithin is usually soy or sunflower. Ask your supplier which one.' });
        break;
      }
    }

    const watchRules = WATCH.concat(region === 'us' ? WATCH_US_ONLY : WATCH_UK_ONLY);
    watchRules.forEach(function (w) {
      const m = w.re.exec(masked);
      if (m) watch.push({ term: m[0], note: w.note });
    });

    // Generic "nuts" wants the exact nut.
    const nutId = region === 'uk' ? 'nuts' : 'tree_nuts';
    if (found[nutId] && found[nutId].some(function (h) { return /^(?:tree\s+)?nuts?$/i.test(h.term); })) {
      watch.push({ term: 'nuts', note: '"Nuts" on its own is vague. Name the exact nut on the label.' });
    }

    return { region: region, order: def.order.slice(), found: found, watch: uniqueBy(watch, 'note') };
  }

  function uniqueBy(arr, key) {
    const seen = {};
    return arr.filter(function (x) {
      if (seen[x[key]]) return false;
      seen[x[key]] = true;
      return true;
    });
  }

  function label(id, region) {
    const def = DEFS[region === 'uk' ? 'uk' : 'us'];
    return def.items[id] ? def.items[id].label : id;
  }

  function order(region) {
    return DEFS[region === 'uk' ? 'uk' : 'us'].order.slice();
  }

  // Merge the spans of the given allergen ids into non-overlapping [start,end) ranges.
  function spansFor(found, ids) {
    const all = [];
    ids.forEach(function (id) {
      (found[id] || []).forEach(function (h) { all.push([h.start, h.end]); });
    });
    all.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    const out = [];
    all.forEach(function (s) {
      const last = out[out.length - 1];
      if (last && s[0] <= last[1]) last[1] = Math.max(last[1], s[1]);
      else out.push([s[0], s[1]]);
    });
    return out;
  }

  return { detect: detect, label: label, order: order, spansFor: spansFor, mask: mask };
});
