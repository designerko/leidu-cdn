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
    '.leidu-lang-switch{display:inline-flex;align-items:center;gap:5px;margin-right:6px;font-family:"Pretendard",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",sans-serif;font-size:11.5px;line-height:1;letter-spacing:0.03em;white-space:nowrap;vertical-align:middle}',
    '.leidu-lang-switch a,.leidu-lang-switch span.is-active{text-decoration:none;padding:4px 3px;transition:color .18s ease}',
    '.leidu-lang-switch span.is-active{color:#111111;font-weight:700;cursor:default}',
    '.leidu-lang-switch a{color:#8A857E;font-weight:500;cursor:pointer}',
    '.leidu-lang-switch a:hover{color:#111111;text-decoration:underline;text-underline-offset:3px}',
    '.leidu-lang-switch .leidu-lang-sep{color:#D4CEC4;font-size:10px;user-select:none}',
    '.leidu-lang-switch-mobile-chip{display:none}',
    '@media(max-width:767px){',
    '  .leidu-lang-switch .leidu-lang-desktop-pair{display:none!important}',
    '  .leidu-lang-switch .leidu-lang-switch-mobile-chip{display:inline-flex!important;align-items:center;justify-content:center;height:24px;padding:0 7px;border:1px solid #DDD6CB;border-radius:999px;font-size:10.5px;font-weight:600;color:#2B2520;background:#FAF7F2;text-decoration:none;letter-spacing:0.01em}',
    '  .leidu-lang-switch{margin-right:2px}',
    '}',
    '.leidu-menu-lang-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px;padding-top:14px;border-top:1px solid #EAE4DA;font-family:"Pretendard",-apple-system,BlinkMacSystemFont,sans-serif;font-size:12.5px;color:#5C5349}',
    '.leidu-menu-lang-pills{display:inline-flex;align-items:center;gap:6px}',
    '.leidu-menu-lang-pills a,.leidu-menu-lang-pills span{display:inline-flex;align-items:center;height:28px;padding:0 11px;border-radius:999px;font-size:12px;text-decoration:none}',
    '.leidu-menu-lang-pills span.is-active{background:#1E1B18;color:#FAF7F2;font-weight:700}',
    '.leidu-menu-lang-pills a{border:1px solid #D5CBBF;color:#2B2520;background:#FFFFFF;font-weight:500}',
    '.leidu-footer-lang{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#6E665E}',
    '.leidu-footer-lang a{color:#1E1B18;font-weight:600;text-decoration:underline;text-underline-offset:3px}',
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
