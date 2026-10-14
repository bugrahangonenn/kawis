/* Kawis — site behaviour: contact links, consent, tracking, gallery. No libraries. */
(function () {
  "use strict";

  var C = window.KAWIS_CONFIG || {};
  var WA = String(C.WHATSAPP_NUMBER || "").replace(/\D/g, "");
  var TG = C.TELEGRAM_URL || "";
  var MSG = C.WA_MESSAGES || {};
  var HAS_TRACKING = !!(C.GA_ID || C.ADS_ID);
  var CONSENT_KEY = "kawis_consent";
  var ATTR_KEY = "kawis_attribution";

  /* ---------- small storage helpers (storage can be blocked) ---------- */
  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
  function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function drop(key) { try { localStorage.removeItem(key); } catch (e) {} }

  /* ---------- 1. WhatsApp / Telegram / e-mail links ---------- */
  function waMessage(context, category, product) {
    var text;
    if (category) {
      text = (MSG.category || MSG.home || "").replace("{category}", category.toLowerCase());
    } else {
      text = MSG[context] || MSG.home || "";
    }
    if (product) text += product + " — ";
    return text;
  }
  function waUrl(context, category, product) {
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(waMessage(context, category, product));
  }
  function prettyNumber(n) {
    // 905321234567 -> +90 532 123 45 67 (fine for Turkish numbers)
    if (/^90\d{10}$/.test(n)) return "+90 " + n.slice(2, 5) + " " + n.slice(5, 8) + " " + n.slice(8, 10) + " " + n.slice(10);
    return "+" + n;
  }
  function wireLinks(root) {
    root = root || document;
    var i, el;
    var was = root.querySelectorAll("a[data-wa]");
    for (i = 0; i < was.length; i++) {
      el = was[i];
      if (!WA) continue;
      el.href = waUrl(el.getAttribute("data-wa-context") || "home", el.getAttribute("data-wa-category"), el.getAttribute("data-wa-product"));
      if (el.hasAttribute("data-wa-show-number")) el.textContent = prettyNumber(WA);
    }
    if (TG) {
      var tgs = root.querySelectorAll("a[data-tg]");
      for (i = 0; i < tgs.length; i++) tgs[i].href = TG;
    }
    if (C.EMAIL) {
      var ems = root.querySelectorAll("a[data-email]");
      for (i = 0; i < ems.length; i++) { ems[i].href = "mailto:" + C.EMAIL; ems[i].textContent = C.EMAIL; }
    }
  }
  document.documentElement.classList.toggle("has-wa", !!WA);
  document.documentElement.classList.toggle("no-wa", !WA);
  wireLinks(document);

  /* ---------- 2. Campaign data (gclid / UTM) ----------
     Read from the URL, never added to the WhatsApp message.
     Kept in memory; written to localStorage only after cookie consent. */
  var ATTR_KEYS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  var attribution = null;
  (function () {
    var p = new URLSearchParams(location.search), found = {}, any = false;
    ATTR_KEYS.forEach(function (k) { var v = p.get(k); if (v) { found[k] = v.slice(0, 200); any = true; } });
    if (any) { found.landing = location.pathname; found.ts = new Date().toISOString(); attribution = found; }
  })();
  function persistAttribution() {
    if (attribution) store(ATTR_KEY, JSON.stringify(attribution));
  }
  window.kawisAttribution = function () {
    if (attribution) return attribution;
    try { return JSON.parse(load(ATTR_KEY) || "null"); } catch (e) { return null; }
  };

  /* ---------- 3. Google tag with Consent Mode v2 (default: denied) ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500
  });
  gtag("set", "ads_data_redaction", true);

  var tagLoaded = false;
  function loadGoogleTag() {
    if (tagLoaded || !HAS_TRACKING) return;
    tagLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(C.GA_ID || C.ADS_ID);
    document.head.appendChild(s);
    gtag("js", new Date());
    if (C.GA_ID) gtag("config", C.GA_ID);
    if (C.ADS_ID) gtag("config", C.ADS_ID);
  }

  function setConsent(granted) {
    store(CONSENT_KEY, granted ? "granted" : "denied");
    var v = granted ? "granted" : "denied";
    gtag("consent", "update", { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
    if (granted) { persistAttribution(); loadGoogleTag(); }
    else { drop(ATTR_KEY); }
  }

  /* Cookie banner — only shown when a Google ID is set in config.js */
  var banner = document.querySelector(".consent");
  var openBtns = document.querySelectorAll("[data-consent-open]");
  if (HAS_TRACKING) {
    for (var b = 0; b < openBtns.length; b++) {
      openBtns[b].hidden = false;
      openBtns[b].addEventListener("click", function () { if (banner) { banner.hidden = false; focusBanner(); } });
    }
    var saved = load(CONSENT_KEY);
    if (saved === "granted") { setConsent(true); }
    else if (saved === "denied") { /* stay denied, no banner */ }
    else if (banner) { banner.hidden = false; }
  }
  function focusBanner() { var f = banner && banner.querySelector("button"); if (f) f.focus(); }
  if (banner) {
    banner.addEventListener("click", function (e) {
      var t = e.target.closest("[data-consent]");
      if (!t) return;
      setConsent(t.getAttribute("data-consent") === "accept");
      banner.hidden = true;
    });
  }

  /* ---------- 4. Click tracking (whatsapp_click / telegram_click) ---------- */
  function track(kind, el) {
    var params = {
      link_location: el.getAttribute("data-track-location") || "",
      page: location.pathname,
      wa_context: el.getAttribute("data-wa-context") || "",
      product_category: el.getAttribute("data-wa-category") || ""
    };
    gtag("event", kind + "_click", params);
    var label = kind === "whatsapp" ? C.ADS_CONVERSION_LABEL : (C.ADS_TELEGRAM_LABEL || "");
    if (C.ADS_ID && label) gtag("event", "conversion", { send_to: C.ADS_ID + "/" + label });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-track]");
    if (!a) return;
    track(a.getAttribute("data-track"), a);
  });

  /* ---------- 5. Product cards (home gallery + catalogue page) ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function card(p, catName) {
    var isPh = !!p.placeholder;
    var alt = isPh ? "Placeholder image — " + p.name : p.name;
    var ask = WA
      ? '<a class="item-ask" data-wa data-wa-context="catalogue" data-wa-category="' + esc(catName) + '" data-wa-product="' + esc(p.name) + '" data-track="whatsapp" data-track-location="product" href="#" target="_blank" rel="noopener">Ask on WhatsApp</a>'
      : '<a class="item-ask" data-tg data-track="telegram" data-track-location="product" href="' + esc(TG) + '" target="_blank" rel="noopener">See on Telegram</a>';
    return '<article class="item">' +
      (isPh ? '<span class="badge">Placeholder</span>' : "") +
      '<img src="' + esc(p.image) + '" width="' + (p.width || 600) + '" height="' + (p.height || 750) + '" loading="lazy" decoding="async" alt="' + esc(alt) + '">' +
      '<div class="item-body"><span class="item-cat">' + esc(catName) + '</span><span class="item-name">' + esc(p.name) + "</span>" + ask + "</div></article>";
  }
  var catalogueData = null;
  function getData() {
    if (catalogueData) return Promise.resolve(catalogueData);
    return fetch("/data/products.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (d) { catalogueData = d; return d; });
  }
  function catName(data, id) {
    for (var i = 0; i < data.categories.length; i++) if (data.categories[i].id === id) return data.categories[i].name;
    return id;
  }
  function renderInto(box, data, filter, limit) {
    var list = data.products.filter(function (p) { return !filter || filter === "all" || p.category === filter; });
    if (limit) list = list.slice(0, limit);
    box.innerHTML = list.length
      ? list.map(function (p) { return card(p, catName(data, p.category)); }).join("")
      : '<p class="empty">No items in this category yet. See the full, daily-updated catalogue on Telegram.</p>';
    wireLinks(box);
  }
  window.kawisCatalogue = { getData: getData, renderInto: renderInto, wireLinks: wireLinks };

  var gallery = document.querySelector("[data-gallery]");
  if (gallery) {
    var limit = parseInt(gallery.getAttribute("data-limit"), 10) || 0;
    var go = function () { getData().then(function (d) { renderInto(gallery, d, "all", limit); }).catch(function () {}); };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); go(); } }, { rootMargin: "600px" });
      io.observe(gallery);
    } else { go(); }
  }
})();
