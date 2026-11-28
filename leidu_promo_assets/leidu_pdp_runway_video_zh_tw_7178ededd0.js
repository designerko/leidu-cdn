/*!
 * LEIDU Own-Mall Product Detail Dark Runway Video & SHOP THE LOOK Mini Cards (WL-88 / WL-98 v2.0)
 * - Strictly runs ONLY on Cafe24 PRODUCT_DETAIL pages.
 * - Zero overhead (0 DOM mutations) for products without a runway entry in `pdp_videos`.
 * - Skin 19 / 25 aware: mounts at the top of `.leidu-detail-media` on Desktop (>=768px) and
 *   in the full-width editorial slot above `.leidu-product-notes` on Mobile (<=767px),
 *   with fallback to `#prdDetail .cont`.
 * - Renders Editorial Dark Boutique `WITH ITEM · 模特兒同款穿搭單品` 46x60px thumbnail lookbook cards
 *   with role badge (`OUTER`, `INNER · TOP`, `BOTTOM`, `ACC`), bold white product name, and 12% member
 *   benefit price (`member_group_dc === 'F'` special-price items show clean regular price only).
 */
(function () {
  'use strict';

  if (window.__LEIDU_PDP_RUNWAY_V1_LOADED__) return;
  window.__LEIDU_PDP_RUNWAY_V1_LOADED__ = true;

  var SHOP_PREFIX = /^\/shop7(?=\/|$)/.test(window.location.pathname || '') ? '/shop7' : '';
  function shopHref(u) { var s = String(u || ''); if (!s || /^https?:\/\//i.test(s)) return s; if (SHOP_PREFIX && s.indexOf(SHOP_PREFIX + '/') === 0) return s; return SHOP_PREFIX + (s.charAt(0) === '/' ? s : '/' + s); }
  var MANIFEST_BASE_URL = 'https://designerko.github.io/leidu-cdn/leidu_hero_runway/leidu_hero_manifest_zh_tw.json';
  var WRAP_ID = 'leidu-pdp-runway-fit-wrap';
  var CARD_ID = 'leidu-pdp-runway-fit';
  var STYLE_ID = 'leidu-pdp-runway-fit-style';

  function detectProductNo() {
    try {
      if (typeof window.iProductNo === 'number' && window.iProductNo > 0) {
        return String(window.iProductNo);
      }
      if (typeof window.iProductNo === 'string' && /^\d+$/.test(window.iProductNo.trim())) {
        return window.iProductNo.trim();
      }
      var params = new URLSearchParams(window.location.search || '');
      var qNo = params.get('product_no');
      if (qNo && /^\d+$/.test(qNo.trim())) {
        return qNo.trim();
      }
      var pathMatch = (window.location.pathname || '').match(/\/product\/[^\/]+\/(\d+)(?:\/|$)/);
      if (pathMatch && pathMatch[1]) {
        return pathMatch[1];
      }
      var metaEl = document.querySelector('meta[property="product:productId"]');
      if (metaEl && metaEl.content && /^\d+$/.test(metaEl.content.trim())) {
        return metaEl.content.trim();
      }
    } catch (e) {}
    return '';
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatWon(n) {
    var v = Math.round(Number(n) || 0);
    if (v <= 0) return '';
    return 'NT$' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = [
      'body #contents .xans-product-detail .leidu-detail-media > figure#' + WRAP_ID + ' {',
      '  display: flex !important;',
      '  flex-direction: column !important;',
      '  align-items: center !important;',
      '  justify-content: flex-start !important;',
      '  width: 100% !important;',
      '  height: auto !important;',
      '  aspect-ratio: auto !important;',
      '  margin: 0 0 42px 0 !important;',
      '  padding: 108px 16px 8px !important;',
      '  overflow: visible !important;',
      '  box-sizing: border-box !important;',
      '}',
      'body #contents .xans-product-detail .infoArea > #' + WRAP_ID + ' {',
      '  display: block !important;',
      '  grid-column: 1 / -1 !important;',
      '  width: 100% !important;',
      '  margin: 22px 0 10px !important;',
      '  padding: 0 !important;',
      '}',
      '#' + CARD_ID + ' {',
      '  max-width: 420px;',
      '  width: 100%;',
      '  margin: 0 auto;',
      '  background: #0b0a09;',
      '  border: 1px solid rgba(255, 255, 255, 0.13);',
      '  border-radius: 14px;',
      '  overflow: hidden;',
      '  box-shadow: 0 20px 46px rgba(11, 10, 9, 0.24);',
      '  color: #f5f2eb;',
      '  font-family: "Futura", "Avenir Next", "Apple SD Gothic Neo", "Pretendard", -apple-system, BlinkMacSystemFont, sans-serif;',
      '  text-align: left;',
      '  box-sizing: border-box;',
      '}',
      '#' + CARD_ID + ' * { box-sizing: border-box; }',
      '#' + CARD_ID + ' .lprf-header {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 6px;',
      '  padding: 11px 14px;',
      '  background: #0b0a09;',
      '  border-bottom: 1px solid rgba(255, 255, 255, 0.08);',
      '}',
      '#' + CARD_ID + ' .lprf-eyebrow {',
      '  font-size: 9.5px !important;',
      '  font-weight: 600 !important;',
      '  letter-spacing: 0.09em !important;',
      '  color: #e8decb !important;',
      '  line-height: 1.3 !important;',
      '  white-space: nowrap;',
      '}',
      '#' + CARD_ID + ' .lprf-subtag {',
      '  font-size: 8.8px !important;',
      '  letter-spacing: 0.08em !important;',
      '  color: rgba(245, 242, 235, 0.56) !important;',
      '  white-space: nowrap;',
      '  flex-shrink: 0;',
      '}',
      '#' + CARD_ID + ' .lprf-stage {',
      '  position: relative;',
      '  width: 100%;',
      '  background: #0b0a09;',
      '  line-height: 0;',
      '}',
      '#' + CARD_ID + ' .lprf-video {',
      '  width: 100% !important;',
      '  height: auto !important;',
      '  aspect-ratio: 600 / 1012 !important;',
      '  display: block !important;',
      '  object-fit: cover !important;',
      '  background: #0b0a09 !important;',
      '  margin: 0 !important;',
      '  padding: 0 !important;',
      '  border: 0 !important;',
      '  pointer-events: none;',
      '}',
      '#' + CARD_ID + ' .lprf-video::-webkit-media-controls {',
      '  display: none !important;',
      '  -webkit-appearance: none;',
      '}',
      '#' + CARD_ID + ' .lprf-video::-webkit-media-controls-enclosure {',
      '  display: none !important;',
      '}',
      '#' + CARD_ID + ' .lprf-video::-webkit-media-controls-start-playback-button {',
      '  display: none !important;',
      '  -webkit-appearance: none;',
      '}',
      '#' + CARD_ID + ' .lprf-with-bar {',
      '  padding: 13px 14px 14px;',
      '  background: linear-gradient(180deg, #141210 0%, #0b0a09 100%);',
      '  border-top: 1px solid rgba(255, 255, 255, 0.10);',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 9px;',
      '}',
      '#' + CARD_ID + ' .lprf-with-head {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 8px;',
      '}',
      '#' + CARD_ID + ' .lprf-with-label {',
      '  font-size: 11px !important;',
      '  letter-spacing: 0.05em !important;',
      '  color: #e8decb !important;',
      '  font-weight: 600 !important;',
      '  line-height: 1.35 !important;',
      '}',
      '#' + CARD_ID + ' .lprf-with-kicker {',
      '  font-size: 9px !important;',
      '  letter-spacing: 0.12em !important;',
      '  color: rgba(232, 222, 203, 0.56) !important;',
      '  font-weight: 600 !important;',
      '  white-space: nowrap;',
      '}',
      '#' + CARD_ID + ' .lprf-look-list {',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 7px;',
      '}',
      'body #contents #' + CARD_ID + ' a.lprf-look-card,',
      '#' + CARD_ID + ' a.lprf-look-card {',
      '  display: flex !important;',
      '  align-items: center !important;',
      '  gap: 11px !important;',
      '  width: 100% !important;',
      '  padding: 8px 10px !important;',
      '  border-radius: 8px !important;',
      '  background: rgba(255, 255, 255, 0.055) !important;',
      '  border: 1px solid rgba(232, 222, 203, 0.18) !important;',
      '  text-decoration: none !important;',
      '  color: #ffffff !important;',
      '  transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;',
      '}',
      'body #contents #' + CARD_ID + ' a.lprf-look-card:hover,',
      '#' + CARD_ID + ' a.lprf-look-card:hover {',
      '  background: rgba(232, 222, 203, 0.12) !important;',
      '  border-color: rgba(232, 222, 203, 0.44) !important;',
      '}',
      '#' + CARD_ID + ' .lprf-look-thumb {',
      '  width: 46px !important;',
      '  height: 60px !important;',
      '  min-width: 46px !important;',
      '  min-height: 60px !important;',
      '  object-fit: cover !important;',
      '  border-radius: 4px !important;',
      '  background: #1d1a17 !important;',
      '  border: 1px solid rgba(255, 255, 255, 0.10) !important;',
      '  display: block !important;',
      '  flex-shrink: 0 !important;',
      '  margin: 0 !important;',
      '  padding: 0 !important;',
      '}',
      '#' + CARD_ID + ' .lprf-look-thumb-placeholder {',
      '  width: 46px !important;',
      '  height: 60px !important;',
      '  border-radius: 4px !important;',
      '  background: linear-gradient(145deg, #24201c, #151311) !important;',
      '  border: 1px solid rgba(232, 222, 203, 0.18) !important;',
      '  display: flex !important;',
      '  align-items: center !important;',
      '  justify-content: center !important;',
      '  font-size: 9px !important;',
      '  letter-spacing: 0.08em !important;',
      '  color: rgba(232, 222, 203, 0.65) !important;',
      '  flex-shrink: 0 !important;',
      '}',
      '#' + CARD_ID + ' .lprf-look-body {',
      '  flex: 1 1 auto !important;',
      '  min-width: 0 !important;',
      '  display: flex !important;',
      '  flex-direction: column !important;',
      '  gap: 2px !important;',
      '}',
      '#' + CARD_ID + ' .lprf-look-role {',
      '  display: inline-block !important;',
      '  align-self: flex-start !important;',
      '  font-size: 9.5px !important;',
      '  font-weight: 700 !important;',
      '  letter-spacing: 0.09em !important;',
      '  color: #d8c3a5 !important;',
      '  background: rgba(216, 195, 165, 0.13) !important;',
      '  padding: 1.5px 6px !important;',
      '  border-radius: 3px !important;',
      '  line-height: 1.3 !important;',
      '}',
      '#' + CARD_ID + ' .lprf-look-name {',
      '  font-size: 13px !important;',
      '  font-weight: 700 !important;',
      '  color: #ffffff !important;',
      '  line-height: 1.35 !important;',
      '  white-space: nowrap !important;',
      '  overflow: hidden !important;',
      '  text-overflow: ellipsis !important;',
      '  margin-top: 1px !important;',
      '}',
      '#' + CARD_ID + ' .lprf-look-price-row {',
      '  display: flex !important;',
      '  align-items: baseline !important;',
      '  flex-wrap: wrap !important;',
      '  gap: 5px !important;',
      '  margin-top: 1px !important;',
      '  line-height: 1.25 !important;',
      '}',
      '#' + CARD_ID + ' .lprf-price-orig {',
      '  font-size: 11px !important;',
      '  color: rgba(245, 242, 235, 0.45) !important;',
      '  text-decoration: line-through !important;',
      '  font-weight: 400 !important;',
      '}',
      '#' + CARD_ID + ' .lprf-price-member {',
      '  font-size: 12.2px !important;',
      '  font-weight: 700 !important;',
      '  color: #f3b892 !important;',
      '  letter-spacing: -0.01em !important;',
      '}',
      '#' + CARD_ID + ' .lprf-price-member em {',
      '  font-style: normal !important;',
      '  color: #ff9c73 !important;',
      '  font-weight: 800 !important;',
      '  margin-right: 2px !important;',
      '}',
      '#' + CARD_ID + ' .lprf-price-member small {',
      '  font-size: 10.2px !important;',
      '  font-weight: 600 !important;',
      '  color: #e8decb !important;',
      '  margin-left: 2px !important;',
      '}',
      '#' + CARD_ID + ' .lprf-price-only {',
      '  font-size: 12px !important;',
      '  font-weight: 600 !important;',
      '  color: rgba(245, 242, 235, 0.88) !important;',
      '}',
      '#' + CARD_ID + ' .lprf-look-cta {',
      '  flex-shrink: 0 !important;',
      '  display: inline-flex !important;',
      '  align-items: center !important;',
      '  gap: 3px !important;',
      '  padding: 5px 9px !important;',
      '  border-radius: 999px !important;',
      '  background: rgba(232, 222, 203, 0.12) !important;',
      '  border: 1px solid rgba(232, 222, 203, 0.30) !important;',
      '  font-size: 11px !important;',
      '  font-weight: 600 !important;',
      '  color: #f5f2eb !important;',
      '  white-space: nowrap !important;',
      '  line-height: 1.2 !important;',
      '}',
      '#' + CARD_ID + ' .lprf-look-cta i {',
      '  font-style: normal !important;',
      '  font-size: 13px !important;',
      '  line-height: 1 !important;',
      '  color: #e8decb !important;',
      '}',
      '@media (max-width: 767px) {',
      '  #' + CARD_ID + ' { max-width: 420px; width: 100%; border-radius: 12px; }',
      '  #' + CARD_ID + ' .lprf-eyebrow { font-size: 9.2px !important; letter-spacing: 0.07em !important; }',
      '  #' + CARD_ID + ' .lprf-look-cta { padding: 5px 8px !important; font-size: 10.5px !important; }',
      '}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  }

  function ensurePlaying(video) {
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.controls = false;
    var p = video.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () {});
    }
  }

  function placeWrapperResponsively(wrap) {
    var isMobile = window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
    var mediaList = document.querySelector('.xans-product-detail .leidu-detail-media');
    var infoArea = document.querySelector('.xans-product-detail .infoArea');
    var notes = infoArea ? infoArea.querySelector('.leidu-product-notes') : null;
    var prdDetailCont = document.querySelector('#prdDetail .cont') || document.querySelector('#prdDetail');

    if (isMobile && infoArea) {
      if (notes && notes.parentNode === infoArea) {
        if (wrap.parentNode !== infoArea || wrap.nextSibling !== notes) {
          infoArea.insertBefore(wrap, notes);
        }
      } else if (wrap.parentNode !== infoArea) {
        infoArea.appendChild(wrap);
      }
    } else if (mediaList) {
      if (wrap.parentNode !== mediaList || mediaList.firstChild !== wrap) {
        mediaList.insertBefore(wrap, mediaList.firstChild);
      }
    } else if (infoArea) {
      if (notes && notes.parentNode === infoArea) {
        infoArea.insertBefore(wrap, notes);
      } else {
        infoArea.appendChild(wrap);
      }
    } else if (prdDetailCont && wrap.parentNode !== prdDetailCont) {
      prdDetailCont.insertBefore(wrap, prdDetailCont.firstChild);
    }

    var vid = wrap.querySelector('video.lprf-video');
    if (vid) ensurePlaying(vid);
  }

  function normalizeBrandStr(s) {
    return String(s || '')
      .replace(/\bNOOZ\b/gi, 'NUESE')
      .replace(/\bnuese\b/g, 'NUESE')
      .replace(/SOAP\s+AND\s+WATER/g, 'SOAP & WATER')
      .replace(/\bTHE\s+BRUNCH\b/g, 'BRUNCH')
      .replace(/\bLAKESIDE\s+STUDIOS\b/g, 'LAKE')
      .replace(/\bbreathe\b/g, 'BREATHE')
      .replace(/\bTempting\b/g, 'TEMPTING')
      .replace(/\bMORE\s+THAN\s+YESTERDAY\b/g, 'MORETHAN YESTERDAY');
  }

  function inferFallbackRoleLabel(name) {
    var s = String(name || '');
    if (/(褲|裙|丹寧|西裝褲)/.test(s)) return 'BOTTOM';
    if (/(大衣|外套|夾克|鋪棉|背心|開襟)/.test(s)) return 'OUTER';
    if (/(圍巾|披肩|包|帽|皮帶|靴|鞋)/.test(s)) return 'ACC';
    if (/(洋裝|連身)/.test(s)) return 'DRESS';
    return 'INNER · TOP';
  }

  function getTierForRunway() {
    try {
      if (typeof window.leiduGetMemberTierInfo === 'function') {
        var t = window.leiduGetMemberTierInfo();
        if (t && typeof t.isLogged === 'boolean') return t;
      }
    } catch (_) {}
    return { isLogged: false, rate: 0 };
  }

  function renderLookCard(pt) {
    var pUrl = shopHref(pt.url || ('/product/detail.html?product_no=' + encodeURIComponent(String(pt.product_no || ''))));
    var pName = normalizeBrandStr(pt.name || ('同款穿搭單品 #' + String(pt.product_no || '')));
    var roleLabel = pt.role_label || inferFallbackRoleLabel(pName);
    var thumbUrl = String(pt.thumb_url || '').trim();
    var rawPrice = Number(pt.raw_price || 0);
    var mgDc = String(pt.member_group_dc || 'T').toUpperCase();
    var tier = getTierForRunway();
    var showMemberPrice = !!(tier && tier.isLogged && mgDc !== 'F' && rawPrice > 0);
    var discRate = showMemberPrice ? Math.max(5, Number(tier.rate || 5)) : 0;
    var memberPrice = 0;
    if (showMemberPrice) {
      var disc = Math.min(3000, Math.floor((rawPrice * discRate) / 100));
      memberPrice = Math.max(0, rawPrice - disc);
    }

    var thumbHtml = thumbUrl
      ? '<img class="lprf-look-thumb" src="' + escapeHtml(thumbUrl) + '" alt="' + escapeHtml(pName) + '" loading="lazy" decoding="async">'
      : '<span class="lprf-look-thumb-placeholder">LOOK</span>';

    var priceHtml = '';
    if (showMemberPrice && memberPrice > 0 && memberPrice < rawPrice) {
      priceHtml =
        '<div class="lprf-look-price-row">' +
          '<span class="lprf-price-orig">' + escapeHtml(formatWon(rawPrice)) + '</span>' +
          '<span class="lprf-price-member"><em>' + escapeHtml(String(discRate)) + '%</em>' + escapeHtml(formatWon(memberPrice)) + '<small>會員價</small></span>' +
        '</div>';
    } else if (rawPrice > 0) {
      priceHtml =
        '<div class="lprf-look-price-row">' +
          '<span class="lprf-price-only">' + escapeHtml(formatWon(rawPrice)) + '</span>' +
        '</div>';
    }

    return (
      '<a class="lprf-look-card" href="' + escapeHtml(pUrl) + '">' +
        thumbHtml +
        '<span class="lprf-look-body">' +
          '<span class="lprf-look-role">' + escapeHtml(roleLabel) + '</span>' +
          '<span class="lprf-look-name">' + escapeHtml(pName) + '</span>' +
          priceHtml +
        '</span>' +
        '<span class="lprf-look-cta">查看單品 <i aria-hidden="true">›</i></span>' +
      '</a>'
    );
  }

  function mountRunwayCard(productNo, entry) {
    if (!entry || !entry.video_url) return;
    if (document.getElementById(CARD_ID)) return;

    injectStyles();

    var wrap = document.createElement('figure');
    wrap.id = WRAP_ID;

    var card = document.createElement('section');
    card.id = CARD_ID;
    card.setAttribute('data-product-no', String(productNo));
    card.setAttribute('data-primary-product-no', String(entry.primary_product_no || productNo));
    card.setAttribute('aria-label', 'LEIDU 2026 F/W COLLECTION RUNWAY FIT');

    var subTagParts = [];
    if (entry.brand) subTagParts.push(normalizeBrandStr(entry.brand));
    if (entry.model_id) subTagParts.push(entry.model_id);

    var partners = Array.isArray(entry.coordi_partners) ? entry.coordi_partners : [];
    var withBarHtml = '';
    if (partners.length > 0) {
      var cardsHtml = partners.map(renderLookCard).join('');
      withBarHtml =
        '<div class="lprf-with-bar">' +
          '<div class="lprf-with-head">' +
            '<span class="lprf-with-label">WITH ITEM · 模特兒同款穿搭單品</span>' +
            '<span class="lprf-with-kicker">SHOP THE LOOK</span>' +
          '</div>' +
          '<div class="lprf-look-list">' + cardsHtml + '</div>' +
        '</div>';
    }

    card.innerHTML =
      '<div class="lprf-header">' +
        '<span class="lprf-eyebrow">LEIDU 2026 F/W COLLECTION · RUNWAY FIT</span>' +
        (subTagParts.length ? '<span class="lprf-subtag">' + escapeHtml(subTagParts.join(' · ')) + '</span>' : '') +
      '</div>' +
      '<div class="lprf-stage">' +
        '<video class="lprf-video" muted loop playsinline webkit-playsinline autoplay preload="auto" disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback"></video>' +
      '</div>' +
      withBarHtml;

    wrap.appendChild(card);
    placeWrapperResponsively(wrap);

    var vid = card.querySelector('video.lprf-video');
    if (vid) {
      vid.muted = true;
      vid.defaultMuted = true;
      vid.playsInline = true;
      vid.loop = true;
      vid.autoplay = true;
      vid.src = entry.video_url;
      vid.addEventListener('loadeddata', function () { ensurePlaying(vid); });
      vid.addEventListener('canplay', function () { ensurePlaying(vid); });
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) ensurePlaying(vid);
      });
      ensurePlaying(vid);
    }

    var refreshLooks = function () {
      if (!partners.length) return;
      var listEl = card.querySelector('.lprf-look-list');
      if (listEl) listEl.innerHTML = partners.map(renderLookCard).join('');
    };
    window.addEventListener('leidu:membership-linked', refreshLooks);
    window.addEventListener('load', refreshLooks);
    setTimeout(refreshLooks, 600);
    if (window.matchMedia) {
      var mq = window.matchMedia('(max-width: 767px)');
      var onMqChange = function () { placeWrapperResponsively(wrap); };
      if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onMqChange);
      else if (typeof mq.addListener === 'function') mq.addListener(onMqChange);
    }
  }

  function waitForGalleryAndMount(productNo, entry, triesLeft) {
    var ready = document.querySelector('.xans-product-detail .leidu-detail-media') || document.querySelector('.xans-product-detail .infoArea');
    if (ready || triesLeft <= 0) {
      mountRunwayCard(productNo, entry);
      return;
    }
    setTimeout(function () {
      waitForGalleryAndMount(productNo, entry, triesLeft - 1);
    }, 60);
  }

  var TODAY_STYLE_ID = 'leidu-two-axis-today-style';

  function decodeOptionUnicode(value) {
    return String(value || '').replace(/\\u([0-9a-f]{4})/gi, function (_, code) {
      return String.fromCharCode(parseInt(code, 16));
    });
  }

  function injectTwoAxisTodayStyle() {
    if (document.getElementById(TODAY_STYLE_ID)) return;
    var st = document.createElement('style');
    st.id = TODAY_STYLE_ID;
    st.textContent = [
      'body #contents .xans-product-detail .infoArea .leidu-option-picker .leidu-today-badge.is-partial {',
      '  background: #edeaff !important;',
      '  color: #4f4be6 !important;',
      '  border: 1px solid #c9c4ff !important;',
      '}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  }

  function readProjectedTodayMap() {
    var stockSection = document.querySelector('.xans-product-detail .leidu-today-stock[data-leidu-today-version="1"]')
      || document.querySelector('#prdDetail .leidu-today-stock[data-leidu-today-version="1"]')
      || document.querySelector('.leidu-today-stock[data-leidu-today-version="1"]');
    if (!stockSection) return null;
    var map = new Map();
    var rows = stockSection.querySelectorAll('[data-variant-code]');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var code = row.dataset ? row.dataset.variantCode : row.getAttribute('data-variant-code');
      if (code) {
        var readyStock = Number(row.dataset ? row.dataset.readyStock : row.getAttribute('data-ready-stock'));
        var isToday = (row.dataset ? row.dataset.today : row.getAttribute('data-today')) === 'true';
        map.set(code, isToday && readyStock > 0);
      }
    }
    return map;
  }

  function applyTodayBadgeState(button, state) {
    if (!button) return;
    var existing = button.querySelector('.leidu-today-badge');
    if (state !== 'true' && state !== 'partial') {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      return;
    }
    var wantText = state === 'partial' ? '部分今日出貨' : '今日出貨';
    var wantPartial = state === 'partial';
    if (existing && existing.textContent === wantText && existing.classList.contains('is-partial') === wantPartial) {
      return;
    }
    var badge = existing || document.createElement('span');
    badge.className = wantPartial ? 'leidu-today-badge is-partial' : 'leidu-today-badge';
    badge.textContent = wantText;
    if (!existing) button.appendChild(badge);
  }

  function installTwoAxisTodayBadges() {
    var detail = document.querySelector('.xans-product-detail');
    if (!detail) return;
    var optionArea = detail.querySelector('.infoArea .xans-product-option');
    if (!optionArea) return;
    var projected = readProjectedTodayMap();
    if (!projected || !projected.size) return;

    injectTwoAxisTodayStyle();
    var applying = false;
    var scheduled = false;

    function syncBadges() {
      if (applying) return;
      applying = true;
      try {
        var latestProjected = readProjectedTodayMap();
        if (!latestProjected || !latestProjected.size) return;
        var stock = null;
        try {
          stock = typeof window.option_stock_data === 'string'
            ? JSON.parse(window.option_stock_data)
            : window.option_stock_data;
        } catch (e) {
          stock = null;
        }
        if (!stock || typeof stock !== 'object') return;

        var selects = Array.prototype.slice.call(
          optionArea.querySelectorAll('select[option_select_element="ec-option-select-finder"][product_type="product_option"]')
        ).sort(function (a, b) {
          return Number(a.getAttribute('option_sort_no')) - Number(b.getAttribute('option_sort_no'));
        });
        if (!selects.length) return;

        var variants = [];
        var entries = Object.entries(stock);
        for (var i = 0; i < entries.length; i++) {
          var code = entries[i][0];
          var row = entries[i][1];
          if (latestProjected.has(code) && row && Array.isArray(row.option_value_orginal)) {
            variants.push({
              code: code,
              values: row.option_value_orginal.map(decodeOptionUnicode)
            });
          }
        }
        if (!variants.length) return;

        var hasMixedAxis = selects.length > 1;
        for (var axis = 0; axis < selects.length; axis++) {
          var select = selects[axis];
          var isNonFinalAxis = hasMixedAxis && axis < selects.length - 1;
          var options = Array.prototype.slice.call(select.options);
          var realOptions = [];
          for (var j = 0; j < options.length; j++) {
            var opt = options[j];
            var nextState = 'false';
            if (!opt.disabled && opt.value !== '*' && opt.value !== '**') {
              var candidates = variants.filter(function (v) {
                if (v.values.length !== selects.length || v.values[axis] !== opt.value) return false;
                for (var prev = 0; prev < axis; prev++) {
                  if (selects[prev].value !== v.values[prev]) return false;
                }
                return true;
              });
              if (candidates.length > 0) {
                var trueCount = 0;
                for (var k = 0; k < candidates.length; k++) {
                  if (latestProjected.get(candidates[k].code) === true) trueCount++;
                }
                if (trueCount === candidates.length) nextState = 'true';
                else if (isNonFinalAxis && trueCount > 0) nextState = 'partial';
              }
              realOptions.push(opt);
            }
            if (opt.dataset.leiduToday !== nextState) {
              opt.dataset.leiduToday = nextState;
            }
          }

          var picker = select.previousElementSibling;
          if (!picker || !picker.classList || !picker.classList.contains('leidu-option-picker')) {
            var menuById = select.id ? document.getElementById('leidu-option-' + select.id) : null;
            picker = menuById && menuById.closest ? menuById.closest('.leidu-option-picker') : null;
          }
          if (!picker) continue;

          var trigger = picker.querySelector('.leidu-option-trigger');
          var selectedOpt = (select.selectedOptions && select.selectedOptions[0]) || select.options[0];
          if (trigger && selectedOpt) {
            applyTodayBadgeState(trigger, selectedOpt.dataset ? selectedOpt.dataset.leiduToday : 'false');
          }
          var choices = picker.querySelectorAll('.leidu-option-menu .leidu-option-choice');
          if (choices.length === realOptions.length) {
            for (var c = 0; c < choices.length; c++) {
              applyTodayBadgeState(choices[c], realOptions[c].dataset.leiduToday);
            }
          }
        }
      } finally {
        applying = false;
      }
    }

    function scheduleSync() {
      if (applying || scheduled) return;
      scheduled = true;
      var run = function () {
        scheduled = false;
        syncBadges();
      };
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(run);
      } else {
        setTimeout(run, 16);
      }
    }

    syncBadges();
    setTimeout(syncBadges, 100);
    setTimeout(syncBadges, 350);
    optionArea.addEventListener('change', scheduleSync);
    if (typeof window.MutationObserver === 'function') {
      var obs = new window.MutationObserver(function () {
        if (!applying) scheduleSync();
      });
      obs.observe(optionArea, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'data-leidu-today']
      });
    }
  }

  function init() {
    installTwoAxisTodayBadges();
    var productNo = detectProductNo();
    if (!productNo) return;

    var fiveMinBucket = Math.floor(Date.now() / 300000);
    fetch(MANIFEST_BASE_URL + '?v=' + fiveMinBucket, { mode: 'cors' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.pdp_videos) return;
        var entry = data.pdp_videos[String(productNo)];
        if (!entry) return;
        setTimeout(function () {
          waitForGalleryAndMount(productNo, entry, 25);
        }, 40);
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
