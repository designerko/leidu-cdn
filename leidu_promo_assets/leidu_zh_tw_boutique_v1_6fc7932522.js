(function(){
  'use strict';
  if (window.__LEIDU_ZHTW_BOUTIQUE_V1__) return;
  window.__LEIDU_ZHTW_BOUTIQUE_V1__ = true;

  var css = [
    'body { font-family: "PingFang TC","Heiti TC","Noto Sans TC",-apple-system,BlinkMacSystemFont,sans-serif !important; color:#171615 !important; background:#ffffff !important; }',
    '#leidu-zhtw-topbar { background:#171615; color:#ede7dc; text-align:center; padding:9px 14px; font-size:12px; letter-spacing:0.04em; line-height:1.5; z-index:9999; position:relative; }',
    '.headingArea h2, #prdDetail h3, .xans-product-detail .infoArea h2 { font-size:21px !important; font-weight:500 !important; color:#171615 !important; letter-spacing:0.01em !important; }',
    '#span_product_price_text { color:#171615 !important; font-size:20px !important; font-weight:600 !important; }',
    '#span_product_price_text .eRefPriceUnitHead, #span_product_price_text .eRefPrice, #span_product_price_text .eRefPriceUnitTail { color:#787168 !important; font-size:13px !important; font-weight:400 !important; margin-left:2px; }',
    '.xans-product-detail .infoArea table th, .xans-product-detail .infoArea table td { border:0 !important; padding:6px 0 !important; font-size:13px !important; color:#2b2927 !important; }',
    '#leidu-zhtw-member-box { background:#f8f6f2; border:1px solid #e2ddd3; padding:14px 16px; border-radius:2px; margin:14px 0 18px; line-height:1.7; }',
    '#leidu-zhtw-sync-badge { display:inline-block; background:#f5f3ee; color:#5c564e; font-size:11px; padding:4px 9px; margin-bottom:8px; letter-spacing:0.04em; }',
    '#leidu-zhtw-runway-box { max-width:520px; margin:18px auto 34px; background:#111110; border-radius:2px; overflow:hidden; color:#f5f3ee; box-shadow:0 10px 30px rgba(0,0,0,0.10); }',
    '#leidu-zhtw-runway-box video { width:100%; display:block; max-height:760px; object-fit:cover; background:#111110; }',
    '#leidu-zhtw-runway-head { padding:12px 16px; font-size:11px; letter-spacing:0.12em; color:#cfc8bc; display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.08); }',
    '.leidu-zhtw-inline-reviews { max-width:860px; margin:36px auto; border-top:1px solid #171615; padding-top:20px; text-align:left; }',
    '.leidu-zhtw-rev-item { border-bottom:1px solid #ece8e1; padding:20px 0; }',
    '.xans-product-action .btnSubmit, a.btnSubmit { background:#171615 !important; border-color:#171615 !important; color:#fff !important; }'
  ].join('\n');

  function injectStyle(){
    if (document.getElementById('leidu-zhtw-style')) return;
    var st = document.createElement('style');
    st.id = 'leidu-zhtw-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function injectTopbar(){
    if (document.getElementById('leidu-zhtw-topbar') || !document.body) return;
    var bar = document.createElement('div');
    bar.id = 'leidu-zhtw-topbar';
    bar.textContent = '🇰🇷 韓國 NAVER 連續 5 年 TOP 女裝名店韓國總部官方直營 · 韓國官網同步定價 · 單筆滿兩件順豐國際免運 (香港 0 關稅)';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function getPno(){
    var q = new URLSearchParams(location.search || '');
    if (q.get('product_no')) return q.get('product_no');
    var parts = (location.pathname || '').split('/');
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] === 'product' && parts[i + 2] && /^\d+$/.test(parts[i + 2])) {
        return parts[i + 2];
      }
    }
    return window.iProductNo ? String(window.iProductNo) : '';
  }

  function enhancePDP(){
    var pno = getPno();
    if (!pno) return;
    var priceEl = document.getElementById('span_product_price_text');
    if (priceEl && !document.getElementById('leidu-zhtw-member-box')) {
      var rawTxt = priceEl.childNodes[0] ? priceEl.childNodes[0].textContent : priceEl.textContent;
      var num = parseInt(String(rawTxt || '').replace(/[^0-9]/g, ''), 10) || 0;
      if (num > 0) {
        var m5 = Math.round(num * 0.95);
        var hk = Math.round(num * 0.24);
        var hk5 = Math.round(m5 * 0.24);
        var box = document.createElement('div');
        box.id = 'leidu-zhtw-member-box';
        box.innerHTML = '<div style="font-size:13px;font-weight:600;color:#171615;margin-bottom:3px;">🔒 官網會員專屬禮遇 (免費註冊立即套用 · 免代購差價)</div>'
          + '<div style="font-size:12.5px;color:#4a453e;">• <strong>GLOBAL WELCOME 新會員現折 5%：NT$' + m5.toLocaleString() + '</strong> (約 HK$' + hk5.toLocaleString() + ')<br>'
          + '• VIP 常態 92 折 (8% OFF) · VVIP 常態 9 折 (10% OFF) · 香港參考原價 約 HK$' + hk.toLocaleString() + '</div>';
        var tbl = priceEl.closest('table');
        if (tbl && tbl.parentNode) {
          tbl.parentNode.insertBefore(box, tbl.nextSibling);
        }
      }
      var h2 = document.querySelector('.infoArea h2, .headingArea h2');
      if (h2 && !document.getElementById('leidu-zhtw-sync-badge')) {
        h2.textContent = h2.textContent.replace(/^\[\]\s*/, '');
        var bg = document.createElement('div');
        bg.id = 'leidu-zhtw-sync-badge';
        bg.textContent = 'LEIDU OFFICIAL · 韓國東大門前 1% 高質感檔口直營 · 1:1 蒸氣整燙品檢';
        h2.parentNode.insertBefore(bg, h2);
      }
    }

    fetch('https://designerko.github.io/leidu-cdn/leidu_hero_runway/leidu_hero_manifest.json')
      .then(function(r){ return r.json(); })
      .then(function(man){
        var pdpMap = (man && man.pdp_videos) || {};
        var entry = pdpMap[String(pno)];
        if (!entry && man && Array.isArray(man.items)) {
          entry = man.items.find(function(x){ return String(x.product_no) === String(pno); });
        }
        if (entry && entry.video_url && !document.getElementById('leidu-zhtw-runway-box')) {
          var cont = document.querySelector('#prdDetail .cont, #prdDetail');
          if (cont) {
            var wrap = document.createElement('div');
            wrap.id = 'leidu-zhtw-runway-box';
            wrap.innerHTML = '<div id="leidu-zhtw-runway-head"><span>PLAY THE FIT · 模特兒實穿動態走秀</span><span>LEIDU RUNWAY</span></div>'
              + '<video src="' + entry.video_url + '" autoplay muted loop playsinline preload="metadata"></video>';
            cont.insertBefore(wrap, cont.firstChild);
          }
        }
      }).catch(function(){});

    var revLinks = document.querySelectorAll('#prdReview a[href*="board_no=4"][href*="no="]');
    if (revLinks.length > 0 && !document.querySelector('.leidu-zhtw-inline-reviews')) {
      var revSec = document.getElementById('prdReview');
      var holder = document.createElement('div');
      holder.className = 'leidu-zhtw-inline-reviews';
      holder.innerHTML = '<div style="font-size:15px;font-weight:600;letter-spacing:0.05em;margin-bottom:4px;">REAL BUYER REVIEWS · 韓國全平台真實買家實穿評價 (' + revLinks.length + ')</div>'
        + '<div style="font-size:12px;color:#787168;margin-bottom:12px;">以下評價均由韓國 NAVER SmartStore / Ably / Zigzag 真實購買顧客撰寫，並附上韓文原文供對照核實。</div>';
      revSec.insertBefore(holder, revSec.firstChild);
      Array.prototype.slice.call(revLinks, 0, 8).forEach(function(a){
        var titleTxt = a.textContent.trim();
        fetch(a.href).then(function(r){ return r.text(); }).then(function(html){
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var ext = doc.querySelector('.leidu-ext-review');
          if (ext) {
            var item = document.createElement('div');
            item.className = 'leidu-zhtw-rev-item';
            item.innerHTML = '<div style="font-size:13.5px;font-weight:600;margin-bottom:8px;color:#171615;">★★★★★ &nbsp;' + titleTxt + '</div>' + ext.outerHTML;
            holder.appendChild(item);
          }
        }).catch(function(){});
      });
    }
  }

  function init(){
    injectStyle();
    injectTopbar();
    enhancePDP();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
