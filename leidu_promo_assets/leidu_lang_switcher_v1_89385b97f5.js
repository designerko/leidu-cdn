/* LEIDU Official Store Minimalist KR <-> 繁體中文 Switcher v1 (2026-11-27) */
(function () {
  'use strict';
  if (window.__leiduLangSwitcherLoaded) return;
  window.__leiduLangSwitcherLoaded = true;

  var host = String(location.hostname || '').toLowerCase();
  var path = String(location.pathname || '');
  var isTw = host === 'tw.leidu.co.kr' || host === 'm.tw.leidu.co.kr' || /^\/shop7(?=\/|$)/.test(path) || document.documentElement.lang === 'zh-TW';
  var KR_ORIGIN = 'https://leidu.co.kr';
  var TW_ORIGIN = 'https://tw.leidu.co.kr';

  function currentProductNo() {
    if (window.iProductNo && /^\d+$/.test(String(window.iProductNo)) && String(window.iProductNo) !== '0') {
      return String(window.iProductNo);
    }
    var qm = location.search.match(/[?&]product_no=(\d+)/);
    if (qm) return qm[1];
    var pm = path.match(/\/product\/[^/]+\/(\d+)(?:\/|$)/);
    if (pm) return pm[1];
    return '';
  }

  function currentCateNo() {
    var qm = location.search.match(/[?&]cate_no=(\d+)/);
    if (qm) return qm[1];
    var pm = path.match(/\/category\/[^/]+\/(\d+)(?:\/|$)/);
    if (pm) return pm[1];
    return '';
  }

  function buildTargetUrl(targetLang) {
    var origin = targetLang === 'tw' ? TW_ORIGIN : KR_ORIGIN;
    var cleanPath = path.replace(/^\/shop7(?=\/|$)/, '') || '/';
    var pno = currentProductNo();
    if (pno && (/\/product\//.test(cleanPath) || document.querySelector('.xans-product-detail'))) {
      return origin + '/product/detail.html?product_no=' + encodeURIComponent(pno) + '&lang_chosen=1';
    }
    var cno = currentCateNo();
    if (cno && /\/product\/best\.html$/.test(cleanPath)) {
      return origin + '/product/best.html?cate_no=' + encodeURIComponent(cno) + '&lang_chosen=1';
    }
    if (cno && (/\/product\/list\.html$/.test(cleanPath) || /^\/category\//.test(cleanPath))) {
      return origin + '/product/list.html?cate_no=' + encodeURIComponent(cno) + '&lang_chosen=1';
    }
    if (/^\/magazine\.html$/.test(cleanPath) || (/^\/board\/gallery\/list\.html$/.test(cleanPath) && /[?&]board_no=8\b/.test(location.search))) {
      return origin + (targetLang === 'tw' ? '/magazine.html?lang_chosen=1' : '/board/gallery/list.html?board_no=8&lang_chosen=1');
    }
    if (/^\/(benefit\.html|channels\.html|shopinfo\/guide\.html|shopinfo\/company\.html|member\/login\.html|member\/join\.html)$/.test(cleanPath)) {
      return origin + cleanPath + '?lang_chosen=1';
    }
    return origin + '/?lang_chosen=1';
  }

  var CSS = [
    '/* Suppress unfinished default Cafe24 multishop modal (EN/JP) */',
    '.xans-layout-multishopshipping,.worldshipLayer,#cafe24pro_locale_mount{display:none!important}',
    '#leidu-header-lang-switch.leidu-lang-switch{display:inline-flex;align-items:center;gap:5px;margin-right:6px;font-family:"Pretendard",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",sans-serif;font-size:11.5px;line-height:1;letter-spacing:0.03em;white-space:nowrap;vertical-align:middle}',
    'html body #leidu-header-lang-switch .leidu-lang-desktop-pair a,html body #leidu-header-lang-switch .leidu-lang-desktop-pair span.is-active{text-decoration:none!important;padding:4px 3px;transition:color .18s ease}',
    'html body #leidu-header-lang-switch .leidu-lang-desktop-pair span.is-active{color:#111111!important;font-weight:700!important;cursor:default}',
    'html body #leidu-header-lang-switch .leidu-lang-desktop-pair a{color:#767068!important;font-weight:500!important;cursor:pointer}',
    'html body #leidu-header-lang-switch .leidu-lang-desktop-pair a:hover{color:#111111!important;text-decoration:underline!important;text-underline-offset:3px}',
    'html body #leidu-header-lang-switch .leidu-lang-desktop-pair .leidu-lang-sep{color:#CFC8BE!important;font-size:10px;user-select:none}',
    '/* Home page dark hero overlay (before scroll): crisp white typography on both PC and Mobile */',
    'html body:has(.leidu-home) .leidu-header:not(.leidu-header-scrolled) #leidu-header-lang-switch .leidu-lang-desktop-pair span.is-active{color:#FFFFFF!important;text-shadow:0 1px 4px rgba(0,0,0,0.45)}',
    'html body:has(.leidu-home) .leidu-header:not(.leidu-header-scrolled) #leidu-header-lang-switch .leidu-lang-desktop-pair a{color:rgba(255,255,255,0.74)!important;text-shadow:0 1px 4px rgba(0,0,0,0.45)}',
    'html body:has(.leidu-home) .leidu-header:not(.leidu-header-scrolled) #leidu-header-lang-switch .leidu-lang-desktop-pair a:hover{color:#FFFFFF!important}',
    'html body:has(.leidu-home) .leidu-header:not(.leidu-header-scrolled) #leidu-header-lang-switch .leidu-lang-desktop-pair .leidu-lang-sep{color:rgba(255,255,255,0.42)!important}',
    '#leidu-header-lang-switch .leidu-lang-switch-mobile-chip{display:none!important}',
    '@media(max-width:767px){',
    '  html body #leidu-header-lang-switch .leidu-lang-desktop-pair{display:none!important}',
    '  html body #leidu-header-lang-switch a.leidu-lang-switch-mobile-chip{display:inline-flex!important;align-items:center;justify-content:center;height:24px;padding:0 8px;border:1px solid #2B2520!important;border-radius:999px;font-size:11px;font-weight:700!important;color:#111111!important;background:#FFFFFF!important;text-decoration:none!important;letter-spacing:0.02em;line-height:1}',
    '  html body:has(.leidu-home) .leidu-header:not(.leidu-header-scrolled) #leidu-header-lang-switch a.leidu-lang-switch-mobile-chip{background:rgba(18,16,14,0.52)!important;border:1px solid rgba(255,255,255,0.88)!important;color:#FFFFFF!important;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}',
    '  html body:has(.leidu-home) .leidu-header.leidu-header-scrolled #leidu-header-lang-switch a.leidu-lang-switch-mobile-chip{background:#FFFFFF!important;border:1px solid #2B2520!important;color:#111111!important}',
    '  #leidu-header-lang-switch.leidu-lang-switch{margin-right:2px}',
    '}',
    '#leidu-drawer-lang-row.leidu-menu-lang-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px;padding-top:14px;border-top:1px solid #EAE4DA;font-family:"Pretendard",-apple-system,BlinkMacSystemFont,sans-serif;font-size:12.5px;color:#5C5349!important}',
    '#leidu-drawer-lang-row .leidu-menu-lang-pills{display:inline-flex;align-items:center;gap:6px}',
    '#leidu-drawer-lang-row .leidu-menu-lang-pills a,#leidu-drawer-lang-row .leidu-menu-lang-pills span{display:inline-flex;align-items:center;height:28px;padding:0 11px;border-radius:999px;font-size:12px;text-decoration:none!important}',
    'html body #leidu-drawer-lang-row .leidu-menu-lang-pills span.is-active{background:#1E1B18!important;color:#FAF7F2!important;font-weight:700!important}',
    'html body #leidu-drawer-lang-row .leidu-menu-lang-pills a{border:1px solid #C8BFB2!important;color:#1E1B18!important;background:#FFFFFF!important;font-weight:600!important}',
    '.leidu-footer-lang{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#6E665E}',
    '.leidu-footer-lang a{color:#1E1B18!important;font-weight:600;text-decoration:underline!important;text-underline-offset:3px}',
    '#leidu-zh-visitor-bar{background:#1E1B18;color:#FAF7F2;font-family:"Pretendard",-apple-system,BlinkMacSystemFont,sans-serif;font-size:12.5px;line-height:1.4;padding:8px 14px;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;position:relative;z-index:1002;border-bottom:1px solid rgba(226,198,153,0.28)}',
    '#leidu-zh-visitor-bar a.leidu-zh-bar-cta{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;background:#E6CFA8;color:#19140F!important;font-size:11.5px;font-weight:700;text-decoration:none;white-space:nowrap}',
    '#leidu-zh-visitor-bar button.leidu-zh-bar-close{appearance:none;border:0;background:transparent;color:#BFB5A8;font-size:16px;line-height:1;cursor:pointer;padding:2px 4px}'
  ].join('\n');

  function injectCss() {
    if (document.getElementById('leidu-lang-switcher-style')) return;
    var st = document.createElement('style');
    st.id = 'leidu-lang-switcher-style';
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  function mountSwitcher() {
    injectCss();
    var krHref = buildTargetUrl('kr');
    var twHref = buildTargetUrl('tw');

    // 1. Header right utility nav (.leidu-tools)
    var tools = document.querySelector('.leidu-header .leidu-tools, header .leidu-tools');
    if (tools) {
      var sw = document.getElementById('leidu-header-lang-switch');
      if (!sw) {
        sw = document.createElement('div');
        sw.id = 'leidu-header-lang-switch';
        sw.className = 'leidu-lang-switch notranslate';
        sw.setAttribute('aria-label', isTw ? '語言切換' : '언어 선택');
        tools.insertBefore(sw, tools.firstChild);
      }
      var wantHtml = isTw
        ? '<span class="leidu-lang-desktop-pair"><a href="' + krHref + '" data-leidu-lang-to="kr" title="한국어 공식몰 (KRW)">KR</a><span class="leidu-lang-sep">|</span><span class="is-active">繁體</span></span>' +
          '<a class="leidu-lang-switch-mobile-chip" href="' + krHref + '" data-leidu-lang-to="kr" aria-label="한국어 공식몰로 이동">KR</a>'
        : '<span class="leidu-lang-desktop-pair"><span class="is-active">KR</span><span class="leidu-lang-sep">|</span><a href="' + twHref + '" data-leidu-lang-to="tw" title="台灣·香港繁體中文官方商城 (NT$)">繁體</a></span>' +
          '<a class="leidu-lang-switch-mobile-chip" href="' + twHref + '" data-leidu-lang-to="tw" aria-label="前往繁體中文官網">繁體</a>';
      if (sw.getAttribute('data-sig') !== (krHref + '|' + twHref + '|' + isTw)) {
        sw.setAttribute('data-sig', krHref + '|' + twHref + '|' + isTw);
        sw.innerHTML = wantHtml;
      }
    }

    // 2. SHOP / Mobile Drawer (.leidu-menu-service)
    var menuSvc = document.querySelector('.leidu-shop-panel .leidu-menu-service');
    if (menuSvc && !document.getElementById('leidu-drawer-lang-row')) {
      var row = document.createElement('div');
      row.id = 'leidu-drawer-lang-row';
      row.className = 'leidu-menu-lang-row notranslate';
      row.innerHTML =
        '<span>' + (isTw ? 'REGION · 語言' : 'REGION · 언어') + '</span>' +
        '<span class="leidu-menu-lang-pills">' +
          (isTw
            ? '<a href="' + krHref + '" data-leidu-lang-to="kr">한국어 (KR)</a><span class="is-active">繁體中文 (TW·HK)</span>'
            : '<span class="is-active">한국어 (KR)</span><a href="' + twHref + '" data-leidu-lang-to="tw">繁體中文 (TW·HK)</a>') +
        '</span>';
      menuSvc.appendChild(row);
    }

    // 3. Footer (.leidu-footer-links)
    var ftrLinks = document.querySelector('#footer .leidu-footer-links, footer .leidu-footer-links');
    if (ftrLinks && !document.getElementById('leidu-footer-lang-switch')) {
      var fSpan = document.createElement('span');
      fSpan.id = 'leidu-footer-lang-switch';
      fSpan.className = 'leidu-footer-lang notranslate';
      fSpan.innerHTML = isTw
        ? '🌐 <a href="' + krHref + '" data-leidu-lang-to="kr">한국어 공식몰 (KR)</a>'
        : '🌐 <a href="' + twHref + '" data-leidu-lang-to="tw">繁體中文官網 (TW·HK)</a>';
      ftrLinks.appendChild(fSpan);
    }

    // 4. Smart gentle banner ONLY for Chinese-language browsers visiting Korean store (leidu.co.kr)
    if (!isTw && !document.getElementById('leidu-zh-visitor-bar')) {
      var dismissed = false;
      try {
        dismissed = sessionStorage.getItem('leidu_zh_bar_closed') === '1' || /[?&]lang_chosen=1\b/.test(location.search);
        if (/[?&]lang_chosen=1\b/.test(location.search)) sessionStorage.setItem('leidu_zh_bar_closed', '1');
      } catch (_) {}
      var langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']).join(',').toLowerCase();
      if (!dismissed && /\bzh\b|zh-tw|zh-hk|zh-hant|zh-mo/.test(langs)) {
        var hdr = document.querySelector('header.leidu-header, #header');
        if (hdr && hdr.parentNode) {
          var bar = document.createElement('div');
          bar.id = 'leidu-zh-visitor-bar';
          bar.className = 'notranslate';
          bar.innerHTML =
            '<span>🇹🇼🇭🇰 您正在瀏覽韓國官網 · 台灣／香港顧客可前往繁體中文官方旗艦店（NT$ 計價 · 任選 2 件免運）</span>' +
            '<a class="leidu-zh-bar-cta" href="' + twHref + '">前往繁體中文官網 →</a>' +
            '<button type="button" class="leidu-zh-bar-close" aria-label="關閉">×</button>';
          bar.querySelector('.leidu-zh-bar-close').addEventListener('click', function () {
            try { sessionStorage.setItem('leidu_zh_bar_closed', '1'); } catch (_) {}
            bar.remove();
          });
          hdr.parentNode.insertBefore(bar, hdr);
        }
      }
    }
  }

  // Always compute freshest URL on click (in case SPA/hash/query changed)
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[data-leidu-lang-to]') : null;
    if (!a) return;
    var to = a.getAttribute('data-leidu-lang-to');
    if (to === 'kr' || to === 'tw') {
      a.href = buildTargetUrl(to);
    }
  }, true);

  mountSwitcher();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountSwitcher, { once: true });
  }
  window.addEventListener('load', mountSwitcher);
})();
/* LEIDU 1-Person-1-Day Pure Unique Visitor (UV) Beacon (KR shop_no=1 / TW shop_no=7) */
(function () {
  'use strict';
  if (window.__leiduUvBeaconSent) return;
  window.__leiduUvBeaconSent = true;
  try {
    if (navigator.webdriver) return;
    var ua = String(navigator.userAgent || '').toLowerCase();
    if (!ua || /bot|crawl|spider|slurp|facebookexternalhit|kakaotalk-scrap|yeti|headlesschrome|playwright|uptimerobot/.test(ua)) return;
    var host = String(location.hostname || '').toLowerCase();
    var path = String(location.pathname || '/');
    var shopNo = (host === 'tw.leidu.co.kr' || host === 'm.tw.leidu.co.kr' || /^\/shop7(?=\/|$)/.test(path) || document.documentElement.lang === 'zh-TW') ? 7 : 1;
    var vid = '';
    try {
      vid = localStorage.getItem('leidu_uv_vid_v1') || '';
      if (!/^[a-zA-Z0-9_-]{8,64}$/.test(vid)) {
        var arr = new Uint8Array(16);
        if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(arr);
        else for (var i = 0; i < 16; i++) arr[i] = Math.floor(Math.random() * 256);
        vid = Array.from(arr).map(function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
        localStorage.setItem('leidu_uv_vid_v1', vid);
      }
      var lastKey = 'leidu_uv_last_ts_' + shopNo + '_' + path;
      var nowMs = Date.now();
      if (nowMs - Number(sessionStorage.getItem(lastKey) || 0) < 15000) return;
      sessionStorage.setItem(lastKey, String(nowMs));
    } catch (_) {}
    var mid = '';
    try {
      if (window.CAPP_ASYNC_METHODS && window.CAPP_ASYNC_METHODS.member && window.CAPP_ASYNC_METHODS.member.member_id) {
        mid = String(window.CAPP_ASYNC_METHODS.member.member_id).trim();
      } else {
        var el = document.querySelector('.xans-member-var-id, #leidu-member-id-probe');
        if (el && el.textContent && el.textContent.indexOf('{$') === -1) mid = el.textContent.trim();
      }
    } catch (_) {}
    var payload = JSON.stringify({ action: 'site_visit', shop_no: shopNo, vid: vid, member_id: mid, path: path, ref: String(document.referrer || '') });
    fetch('https://webhook.leidu.co.kr/kakao-ai-skill/webhook/cafe24/member?bridge=1', { method: 'POST', mode: 'cors', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: payload }).catch(function () {});
  } catch (_) {}
})();
/* LEIDU Unified Product Card Format & Today/Free-Shipping/Review Parity (All Routes: Main, Best, List, Search | KR & TW) */
(function () {
  'use strict';
  if (window.__leiduUnifiedCardFormatV1) return;
  window.__leiduUnifiedCardFormatV1 = true;

  var host = String(location.hostname || '').toLowerCase();
  var path = String(location.pathname || '');
  var isTw = host === 'tw.leidu.co.kr' || host === 'm.tw.leidu.co.kr' || /^\/shop7(?=\/|$)/.test(path) || document.documentElement.lang === 'zh-TW';
  var TODAY_TEXT = isTw ? '今日出貨' : '오늘출발';
  var FREE_SHIP_TEXT = isTw ? '免運' : '무료배송';
  var FREE_SHIP_MIN = isTw ? 2500 : 30000;

  var UNIFIED_CSS = [
    /* 1. Hide raw Cafe24 noise in cards across Best (Daily/Weekly/Monthly), List, Search, Main */
    'html body #contents .prdList > li .description > .option,',
    'html body #contents .prdList > li .description > p.ec-base-help,',
    'html body #contents .prdList > li .description > span.name.displaynone,',
    'html body #contents .prdList > li .description .name .title,',
    'html body #contents .prdList > li .description .spec > li > strong.title,',
    'html body #contents .prdList > li .description .spec > li:not(.deco_price):not(.deco_sale):not(.leidu-price-spec-row):not(.leidu-unified-price-row):not(.leidu-member-price-row) { display: none !important; }',

    /* 2. Consistent card description spacing on Best, Category List, Search (preserving Home custom rail padding) */
    'html body:not(:has(.leidu-home)) #contents #leidu-best-page .prdList > li .description,',
    'html body:not(:has(.leidu-home)) #contents .xans-product-listnormal .prdList > li .description,',
    'html body:not(:has(.leidu-home)) #contents .xans-search-result .prdList > li .description { margin: 0 !important; padding: 12px 0 8px !important; text-align: left !important; }',

    /* 3. Unified Product Name typography (matches Main Page regular clean weight, overrides best.html 16px/600 bold) */
    'html body #contents .prdList > li .description .name,',
    'html body #contents .prdList > li .description .name a,',
    'html body #contents .prdList > li .description .name a span:not(.title) {',
    '  font-family: SUIT, "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif !important;',
    '  font-size: 12.5px !important;',
    '  font-weight: 400 !important;',
    '  line-height: 18px !important;',
    '  color: #111111 !important;',
    '  letter-spacing: -0.01em !important;',
    '  text-decoration: none !important;',
    '}',

    /* 4. Unified Price + Badges + Review 1-line layout (overrides best.html 18px/700 bold & TW #008BCC bold blue) */
    'html body #contents .prdList > li .description .spec { margin: 5px 0 0 !important; padding: 0 !important; list-style: none !important; }',
    'html body #contents .prdList > li .description .spec > li.leidu-unified-price-row,',
    'html body #contents .prdList > li .description .spec > li.deco_price,',
    'html body #contents .prdList > li .description .spec > li.leidu-price-spec-row {',
    '  display: flex !important;',
    '  align-items: center !important;',
    '  justify-content: flex-start !important;',
    '  flex-wrap: wrap !important;',
    '  gap: 4px 6px !important;',
    '  margin: 0 !important;',
    '  padding: 0 !important;',
    '  line-height: 20px !important;',
    '}',
    'html:not(.leidu-is-member) body #contents .prdList > li .description .spec > li.leidu-unified-price-row > span:not(.title):not(.leidu-price-badges):not(.leidu-card-today-badge):not(.leidu-free-shipping-badge):not(.leidu-card-fs-badge):not(.leidu-best-badge):not(#span_product_tax_type_text),',
    'html:not(.leidu-is-member) body #contents .prdList > li .description .spec > li.leidu-unified-price-row > span:not(.title):not(.leidu-price-badges):not(.leidu-card-today-badge):not(.leidu-free-shipping-badge):not(.leidu-card-fs-badge):not(.leidu-best-badge):not(#span_product_tax_type_text) span,',
    'html body #contents .prdList > li .description .spec > li.leidu-unified-price-row:not(.leidu-orig-price-muted) > span:not(.title):not(.leidu-price-badges):not(.leidu-card-today-badge):not(.leidu-free-shipping-badge):not(.leidu-card-fs-badge):not(.leidu-best-badge):not(#span_product_tax_type_text),',
    'html body #contents .prdList > li .description .spec > li.leidu-unified-price-row:not(.leidu-orig-price-muted) > span:not(.title):not(.leidu-price-badges):not(.leidu-card-today-badge):not(.leidu-free-shipping-badge):not(.leidu-card-fs-badge):not(.leidu-best-badge):not(#span_product_tax_type_text) span {',
    '  font-family: SUIT, "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif !important;',
    '  font-size: 13px !important;',
    '  font-weight: 400 !important;',
    '  line-height: 20px !important;',
    '  color: #111111 !important;',
    '  text-decoration: none !important;',
    '}',

    /* 5. Unified muted gray 16px badges ([오늘출발]/[今日出貨], [무료배송]/[免運]) across ALL pages even without .prdList__item wrapper */
    'html body #contents .prdList > li .description .spec .leidu-price-badges {',
    '  display: inline-flex !important;',
    '  align-items: center !important;',
    '  flex: 0 0 auto !important;',
    '  gap: 3px !important;',
    '  white-space: nowrap !important;',
    '}',
    'html body #contents .prdList > li .description .spec .leidu-price-badges :is(.leidu-card-today-badge, .leidu-free-shipping-badge, .leidu-card-fs-badge, .leidu-best-badge),',
    'html body #contents .xans-product-detail .infoArea .info_table .deco_title .leidu-detail-badges :is(.leidu-today-badge, .leidu-free-shipping-badge, .leidu-card-fs-badge) {',
    '  position: static !important;',
    '  inset: auto !important;',
    '  float: none !important;',
    '  transform: none !important;',
    '  display: inline-flex !important;',
    '  align-items: center !important;',
    '  justify-content: center !important;',
    '  box-sizing: border-box !important;',
    '  width: auto !important;',
    '  height: 16px !important;',
    '  margin: 0 !important;',
    '  padding: 0 5px !important;',
    '  background: #6b6b68 !important;',
    '  color: #ffffff !important;',
    '  font-family: SUIT, "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif !important;',
    '  font-size: 10px !important;',
    '  font-weight: 500 !important;',
    '  line-height: 16px !important;',
    '  border-radius: 2px !important;',
    '  white-space: nowrap !important;',
    '  text-decoration: none !important;',
    '}',
    'html body #contents .prdList .leidu-price-badges .leidu-card-today-badge { order: 1 !important; }',
    'html body #contents .prdList .leidu-price-badges :is(.leidu-free-shipping-badge, .leidu-card-fs-badge) { order: 2 !important; }',
    'html body #contents .prdList .leidu-price-badges .leidu-best-badge { order: 3 !important; }',
    'html body #contents .prdList > li .description .spec > li em.leidu-gm-rev-chip { margin-left: auto !important; order: 99 !important; }',

    /* Mobile responsive refinements */
    '@media (max-width: 767px) {',
    '  html body #contents .prdList > li .description .name,',
    '  html body #contents .prdList > li .description .name a,',
    '  html body #contents .prdList > li .description .name a span:not(.title) { font-size: 11.5px !important; line-height: 16.5px !important; }',
    '  html:not(.leidu-is-member) body #contents .prdList > li .description .spec > li.leidu-unified-price-row > span:not(.title):not(.leidu-price-badges):not(#span_product_tax_type_text) { font-size: 12px !important; line-height: 18px !important; }',
    '  html body #contents .prdList > li .description .spec .leidu-price-badges :is(.leidu-card-today-badge, .leidu-free-shipping-badge, .leidu-card-fs-badge, .leidu-best-badge) { font-size: 9px !important; height: 14px !important; line-height: 14px !important; padding: 0 4px !important; }',
    '}'
  ].join('\n');

  function injectStyle() {
    if (document.getElementById('leidu-unified-card-format-style')) return;
    var st = document.createElement('style');
    st.id = 'leidu-unified-card-format-style';
    st.textContent = UNIFIED_CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  function findPrimaryPriceLi(card) {
    var spec = card.querySelector('.description .spec, ul.spec');
    if (!spec) return null;
    var row = spec.querySelector(':scope > li.deco_sale:not(.displaynone)')
      || spec.querySelector(':scope > li.deco_price')
      || spec.querySelector(':scope > li.leidu-price-spec-row');
    if (row) return row;
    var items = spec.querySelectorAll(':scope > li');
    for (var i = 0; i < items.length; i++) {
      var li = items[i];
      if (li.classList.contains('leidu-member-price-row') || li.querySelector('.leidu-today-stock')) continue;
      var t = li.querySelector('strong.title');
      var tTxt = t ? String(t.textContent || '').replace(/[:\s]+/g, '').trim() : '';
      if (/^(판매가|售價|價格|Price)$/i.test(tTxt)) return li;
      var rawTxt = String(li.textContent || '');
      if ((isTw && /NT\$\s*[\d,]+/.test(rawTxt) && !/商品價格|稅額/.test(tTxt)) || (!isTw && /[\d,]+\s*원/.test(rawTxt) && !/상품가|세액|배송비/.test(tTxt))) {
        return li;
      }
    }
    return null;
  }

  function parseCardPrice(row) {
    if (!row) return 0;
    var clone = row.cloneNode(true);
    var junk = clone.querySelectorAll('.title, .leidu-price-badges, .leidu-free-shipping-badge, .leidu-card-fs-badge, .leidu-card-today-badge, .leidu-best-badge, em.leidu-gm-rev-chip, .displaynone');
    for (var i = 0; i < junk.length; i++) junk[i].remove();
    var txt = String(clone.textContent || '');
    var m = isTw ? txt.match(/NT\$\s*([\d,]+)/i) || txt.match(/(\d[\d,]*)/) : txt.match(/(\d[\d,]*)\s*원/) || txt.match(/(\d[\d,]*)/);
    if (!m || !m[1]) return 0;
    return parseInt(m[1].replace(/,/g, ''), 10) || 0;
  }

  function hasTodayReady(card) {
    var sec = card.querySelector('.leidu-today-stock[data-leidu-today-version="1"]');
    if (!sec) return false;
    var rows = sec.querySelectorAll('li[data-variant-code]');
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var isToday = (r.dataset ? r.dataset.today : r.getAttribute('data-today')) === 'true';
      var stock = Number(r.dataset ? r.dataset.readyStock : r.getAttribute('data-ready-stock'));
      if (isToday && stock > 0) return true;
    }
    return false;
  }

  var syncing = false;
  function syncUnifiedCards() {
    if (syncing) return;
    syncing = true;
    try {
      injectStyle();
      var cards = document.querySelectorAll('.prdList > li');
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        // Clean [당일] prefix in title if any
        var nameLink = card.querySelector('.description .name a');
        if (nameLink) {
          var walker = document.createTreeWalker(nameLink, NodeFilter.SHOW_TEXT);
          var tn;
          while ((tn = walker.nextNode())) {
            if (/^\s*\[[^\]\[]*당일\]/.test(tn.nodeValue || '')) {
              tn.nodeValue = tn.nodeValue.replace(/^\s*\[[^\]\[]*당일\]\s*/, '');
              break;
            }
          }
        }

        var row = findPrimaryPriceLi(card);
        if (!row) continue;
        if (!row.classList.contains('leidu-unified-price-row')) row.classList.add('leidu-unified-price-row');
        if (!row.classList.contains('leidu-price-row')) row.classList.add('leidu-price-row');
        if (row.classList.contains('displaynone')) row.classList.remove('displaynone');

        var ready = hasTodayReady(card);
        var price = parseCardPrice(row);
        var freeShip = price >= FREE_SHIP_MIN;

        var group = row.querySelector('.leidu-price-badges');
        if ((ready || freeShip) && !group) {
          group = document.createElement('span');
          group.className = 'leidu-price-badges';
          var revChip = row.querySelector('em.leidu-gm-rev-chip');
          if (revChip) row.insertBefore(group, revChip);
          else row.appendChild(group);
        }

        if (group) {
          // 1) Today delivery badge ([오늘출발] / [今日出貨])
          var tBadge = group.querySelector('.leidu-card-today-badge');
          if (ready) {
            if (!tBadge) {
              tBadge = document.createElement('span');
              tBadge.className = 'leidu-card-today-badge';
              tBadge.textContent = TODAY_TEXT;
              group.insertBefore(tBadge, group.firstChild);
            } else if (tBadge.textContent !== TODAY_TEXT) {
              tBadge.textContent = TODAY_TEXT;
            }
          } else if (tBadge) {
            tBadge.remove();
          }

          // 2) Free shipping badge ([무료배송] >=30,000 KRW / [免運] >=NT$2,500 TWD)
          // Note: On KR home/list, inline markShipping manages .leidu-free-shipping-badge for >=40,000.
          // We never fight .leidu-free-shipping-badge; if it's absent and price >= FREE_SHIP_MIN, we mount .leidu-card-fs-badge!
          var nativeFs = group.querySelector('.leidu-free-shipping-badge');
          var ourFs = group.querySelector('.leidu-card-fs-badge');
          if (freeShip) {
            if (nativeFs) {
              if (ourFs) ourFs.remove();
              if (isTw && nativeFs.textContent !== FREE_SHIP_TEXT) nativeFs.textContent = FREE_SHIP_TEXT;
            } else if (!ourFs) {
              ourFs = document.createElement('span');
              ourFs.className = 'leidu-card-fs-badge';
              ourFs.textContent = FREE_SHIP_TEXT;
              var bestB = group.querySelector('.leidu-best-badge');
              if (bestB) group.insertBefore(ourFs, bestB);
              else group.appendChild(ourFs);
            }
          } else if (ourFs) {
            ourFs.remove();
          }
        }
      }

      // Also ensure PDP title area shows [무료배송] for 30,000~39,990 KRW on KR & [免運] for >=NT$2,500 on TW
      var pdpInfo = document.querySelector('.xans-product-detail .infoArea');
      if (pdpInfo) {
        var pEl = pdpInfo.querySelector('#span_product_price_sale:not(.displaynone)') || pdpInfo.querySelector('#span_product_price_text');
        var buyBtn = pdpInfo.querySelector('.btn_buy:not(.displaynone)');
        if (pEl && buyBtn) {
          var pm = isTw ? String(pEl.textContent || '').match(/NT\$\s*([\d,]+)/i) || String(pEl.textContent || '').match(/(\d[\d,]*)/) : String(pEl.textContent || '').match(/(\d[\d,]*)/);
          var pVal = pm && pm[1] ? (parseInt(pm[1].replace(/,/g, ''), 10) || 0) : 0;
          var titleTd = pdpInfo.querySelector('.info_table .deco_title td');
          if (titleTd && pVal >= FREE_SHIP_MIN) {
            var dBadges = titleTd.querySelector('.leidu-detail-badges');
            if (!dBadges) {
              dBadges = document.createElement('span');
              dBadges.className = 'leidu-detail-badges';
              var existingToday = titleTd.querySelector(':scope > .leidu-today-badge');
              if (existingToday) dBadges.appendChild(existingToday);
              titleTd.insertBefore(dBadges, titleTd.firstChild);
            }
            if (!dBadges.querySelector('.leidu-free-shipping-badge, .leidu-card-fs-badge')) {
              var fsSpan = document.createElement('span');
              fsSpan.className = 'leidu-card-fs-badge';
              fsSpan.textContent = FREE_SHIP_TEXT;
              dBadges.appendChild(fsSpan);
            }
          }
          // Ensure TW PDP top title today-badge says 今日出貨 instead of chopped 現貨當日出
          if (isTw && titleTd) {
            titleTd.querySelectorAll('.leidu-today-badge').forEach(function (tb) {
              if (tb.textContent === '現貨當日出') tb.textContent = '今日出貨';
              else if (tb.textContent === '部分現貨當日出') tb.textContent = '部分今日出貨';
            });
          }
        }
      }
    } finally {
      syncing = false;
    }
  }

  syncUnifiedCards();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncUnifiedCards);
  }
  window.addEventListener('load', syncUnifiedCards);
  setTimeout(syncUnifiedCards, 350);
  setTimeout(syncUnifiedCards, 1100);

  if (typeof MutationObserver !== 'undefined') {
    var raf = 0;
    var obs = new MutationObserver(function () {
      if (syncing || raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        syncUnifiedCards();
      });
    });
    var attach = function () {
      var contents = document.getElementById('contents') || document.body;
      if (contents) obs.observe(contents, { childList: true, subtree: true });
    };
    if (document.body) attach();
    else document.addEventListener('DOMContentLoaded', attach, { once: true });
  }
})();
