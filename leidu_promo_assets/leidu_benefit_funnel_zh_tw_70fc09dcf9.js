(function(){
'use strict';
  // Prevent MutationObserver infinite microtask loops when DOM localizers re-assign identical textContent
  try {
    var _tcDesc = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
    if (_tcDesc && _tcDesc.get && _tcDesc.set && !_tcDesc.set.__leiduIdempotent) {
      var _origGet = _tcDesc.get, _origSet = _tcDesc.set;
      var _safeSet = function (v) {
        var next = v === null || v === undefined ? '' : String(v);
        if (this.nodeType === 1 && this.childNodes.length <= 1 && _origGet.call(this) === next) return;
        _origSet.call(this, v);
      };
      _safeSet.__leiduIdempotent = true;
      Object.defineProperty(Node.prototype, 'textContent', {
        get: _origGet,
        set: _safeSet,
        configurable: true,
        enumerable: _tcDesc.enumerable
      });
    }
  } catch (_) {}
})();
// LEIDU Traditional Chinese Official Mall (shop_no=7) 1:1 Funnel & Gentle Monster Checkout
var __LEIDU_SHOP_PREFIX__ = /^\/shop7(?=\/|$)/.test(location.pathname) ? '/shop7' : '';
function __leiduShopHref__(p) {
  var s = String(p || '');
  if (!s || /^https?:\/\//i.test(s)) return s;
  if (__LEIDU_SHOP_PREFIX__ && (s === __LEIDU_SHOP_PREFIX__ || s.indexOf(__LEIDU_SHOP_PREFIX__ + '/') === 0)) return s;
  return __LEIDU_SHOP_PREFIX__ + (s.charAt(0) === '/' ? s : '/' + s);
}
// WL168 ready-mode; campaign launcher enables this exact flag only after CEO GO.
window.LEIDU_EASYPAY_CAMPAIGN_ENABLED=false;
/* WL160/WL164: confirmed membership display and immediate anonymous-price guard. */
(function () {
  'use strict';
  var cleanTitle=window.leiduCleanTitle=function(s){return String(s||'').replace(/[\u200b-\u200d\ufeff]/g,'').replace(/\[\s*\]/g,'').replace(/\s+/g,' ').trim();};
  function isAdminCafe24Session(c, m, data, idHint) {
    var mid = String(idHint || (data && data.member_id) || (m && m.__sMemberId) || (m && m.member_id) || '').trim().toLowerCase();
    if (mid === 'leidu1') return true;
    var g = String((data && (data.group_name || data.member_group_name)) || (m && m.__sGroupName) || (m && m.group_name) || '').trim();
    if (!g) {
      var gp = document.querySelector('#leidu-member-grade-probe .xans-member-var-group_name, #leidu-member-grade-probe .leidu-probe-group');
      g = String((gp && gp.textContent) || '').replace(/[\[\]\s]+/g, ' ').trim();
    }
    if (/^(관리자|管理員|ADMIN|ADMINISTRATOR)$/i.test(g) || /(관리자|管理員)/.test(g)) return true;
    return false;
  }
  var detectMemberId=window.leiduDetectMemberId=function(){
    var c=window.CAPP_ASYNC_METHODS||{},m=c.member||{},data={},on=!!document.querySelector('.xans-layout-statelogon'),off=!!document.querySelector('.xans-layout-statelogoff'),id='';
    try{data=typeof m.getData==='function'?m.getData()||{}:m;id=String(data.member_id||m.__sMemberId||m.member_id||(c.AppCommon&&c.AppCommon.getMemberID&&c.AppCommon.getMemberID())||(window.AppCommon&&window.AppCommon.getMemberID&&window.AppCommon.getMemberID())||'').trim();}catch(_){}
    if(isAdminCafe24Session(c,m,data,id)){try{sessionStorage.removeItem('leidu_synced_mid_v1');sessionStorage.removeItem('leidu_member_grade_v1');}catch(_){}return '';}
    if(c.IS_LOGIN===false||(typeof c.IS_LOGIN!=='boolean'&&off&&!on)){try{sessionStorage.removeItem('leidu_synced_mid_v1');}catch(_){}return '';}
    if(!id||id.indexOf('{$')>=0||id==='null'||id==='undefined'){var el=document.querySelector('.xans-member-var-id,#leidu-member-id-probe');id=el&&el.textContent?el.textContent.trim():'';}
    if((!id||id.indexOf('{$')>=0)&&(c.IS_LOGIN===true||(on&&!off))){try{id=String(sessionStorage.getItem('leidu_synced_mid_v1')||(JSON.parse(sessionStorage.getItem('leidu_member_sync_v1')||'null')||{}).member_id||'').trim();}catch(_){}}
    if(!id||id.indexOf('{$')>=0||id==='null'||id==='undefined'||isAdminCafe24Session(c,m,data,id))return '';
    try{if(sessionStorage.getItem('leidu_synced_mid_v1')!==id)sessionStorage.setItem('leidu_synced_mid_v1',id);}catch(_){}
    return id;
  };
  function getMemberTierInfo() {
    var c=window.CAPP_ASYNC_METHODS||{},m=c.member||{},data={};
    try{data=typeof m.getData==='function'?m.getData()||{}:m;}catch(_){}
    var memberId=detectMemberId(),on=!!document.querySelector('.xans-layout-statelogon'),off=!!document.querySelector('.xans-layout-statelogoff');
    if(isAdminCafe24Session(c,m,data,memberId)){
      return {isLogged:false,memberId:'',gradeName:'',rate:0,sessionStale:false,sessionRate:0};
    }
    var isLogged=c.IS_LOGIN!==false&&(c.IS_LOGIN===true||!!memberId||(on&&!off));
    if(!isLogged)return {isLogged:false,memberId:'',gradeName:'',rate:0,sessionStale:false,sessionRate:0};
    var grade=String(data.group_name||m.__sGroupName||m.group_name||'').trim();
    if(!grade){var p=document.querySelector('#leidu-member-grade-probe .xans-member-var-group_name,#leidu-member-grade-probe .leidu-probe-group');grade=String(p&&p.textContent||'').replace(/[\[\]\s]+/g,' ').trim();}
    if(/(관리자|管理員|^ADMIN$)/i.test(grade))return {isLogged:false,memberId:'',gradeName:'',rate:0,sessionStale:false,sessionRate:0};
    if(!grade||grade.indexOf('{$')>=0)grade='GLOBAL WELCOME';
    var rates={'GLOBAL VVIP':10,'GLOBAL VIP':8,'GLOBAL WELCOME':5,VVIP:10,VIP:8,WELCOME:5,'一般會員':5,'일반회원':5};
    var currentSessionRate=rates[grade.toUpperCase()]||rates[grade]||5;
    try{
      var syncedId=sessionStorage.getItem("leidu_synced_mid_v1"),benefit=JSON.parse(sessionStorage.getItem("leidu_member_benefit_v1")||"null");
      if(memberId&&syncedId===memberId&&benefit&&Number(benefit.rate)>=5&&Number(benefit.rate)<=15)
        return {isLogged:true,memberId:memberId,gradeName:String(benefit.group).toUpperCase(),rate:Number(benefit.rate),sessionStale:Number(benefit.rate)>currentSessionRate,sessionRate:currentSessionRate};
    }catch(_){}
    try{
      var stored=memberId&&JSON.parse(localStorage.getItem('leiduMembershipIdentity:'+memberId)||'null');
      if(stored&&stored.member_id===memberId&&stored.grade_name&&Number.isFinite(Number(stored.discount_rate))&&Number(stored.discount_rate)>currentSessionRate)
        return {isLogged:true,memberId:memberId,gradeName:String(stored.grade_name),rate:Number(stored.discount_rate),sessionStale:true,sessionRate:currentSessionRate};
    }catch(_){}
    return {isLogged:true,memberId:memberId,gradeName:grade,rate:currentSessionRate,sessionStale:false,sessionRate:currentSessionRate};
  }
  window.leiduGetMemberTierInfo=getMemberTierInfo;
  var membershipSignature="";
  function refreshMembershipState(info,refreshPrices){
    var tierInfo=info&&typeof info.isLogged==="boolean"?info:getMemberTierInfo(),root=document.documentElement;
    var signature=[tierInfo.memberId,tierInfo.gradeName,tierInfo.rate,tierInfo.sessionRate,tierInfo.sessionStale,tierInfo.isLogged].join("|");
    var changed=signature!==membershipSignature;membershipSignature=signature;
    root.classList.toggle('leidu-is-member',tierInfo.isLogged);
    root.classList.toggle('leidu-is-guest',!tierInfo.isLogged);
    root.classList.toggle('leidu-fouc-guest-guard',!tierInfo.isLogged);
    var target=/^(?:\/shop7)?\/myshop\//.test(location.pathname)||/^(?:\/shop7)?\/(?:product\/detail|order\/basket|order\/orderform)\.html$/.test(location.pathname)||!!document.querySelector('.xans-product-detail');
    var banner=document.getElementById('leidu-session-refresh-banner');
    if(target&&tierInfo.sessionStale){
      var host=document.querySelector('#contents,main')||document.body;
      if(host){
        if(!banner){banner=document.createElement('aside');banner.id='leidu-session-refresh-banner';banner.setAttribute('role','status');banner.style.cssText='box-sizing:border-box;max-width:100%;margin:16px 0;padding:14px 16px;border:1px solid #baa17c;background:#fff8eb;color:#3c3020;font-size:14px;line-height:1.7;overflow-wrap:anywhere';host.insertBefore(banner,host.firstChild);}
        if(banner.dataset.membershipSignature!==signature){banner.dataset.membershipSignature=signature;
        banner.textContent='⚡ 已升等為 '+tierInfo.gradeName+'（常態 '+tierInfo.rate+'% 折扣）！欲於結帳金額套用 '+tierInfo.rate+'% 優惠，請點此 ';
        var link=document.createElement('a');link.href=__leiduShopHref__('/exec/front/Member/logout/?returnUrl=' + encodeURIComponent(__leiduShopHref__('/member/login.html')));link.textContent='🔄 重新登入立即套用最新等級';link.style.cssText='color:inherit;font-weight:700;text-decoration:underline';banner.appendChild(link);banner.appendChild(document.createTextNode(' >'));}
      }
    }else if(banner){banner.remove();}
    if(refreshPrices!==false&&changed&&typeof window.leiduApplyMemberBenefitPrices==='function')window.leiduApplyMemberBenefitPrices();
  }
  window.leiduRefreshMembershipState=refreshMembershipState;
  window.addEventListener('leidu:membership-linked',refreshMembershipState);
  window.addEventListener('load',refreshMembershipState);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refreshMembershipState,{once:true});else refreshMembershipState();
})();
/* WL150 early state: synchronous at the beginning of the official ALL ScriptTag. */
(function () {
  'use strict';
  var root=document.documentElement, info=(window.leiduGetMemberTierInfo?window.leiduGetMemberTierInfo():{isLogged:false});
  var member=!!info.isLogged;
  root.classList.toggle('leidu-is-member',member);
  root.classList.toggle('leidu-is-guest',!member);
  root.classList.toggle('leidu-wl150-express-guard',/\/product\/detail\.html$|\/order\/basket\.html$/.test(location.pathname) || !!document.querySelector('.xans-product-detail,.xans-order-basketpackage'));
  var st=document.createElement('style'); st.id='leidu-wl150-wl151-boutique-style';
  st.textContent="/* WL150: private list prices for guests */\nhtml.leidu-is-guest body #contents .prdList li .description .spec li.leidu-member-price-row,\nhtml.leidu-is-guest .leidu-mbp-wrap .leidu-hero-benefit-row,\nhtml.leidu-is-guest body #contents .xans-product-detail .infoArea .info_table .leidu-pdp-benefit-wrap,\nhtml.leidu-is-guest body #contents .xans-product-detail .infoArea .leidu-pdp-total-benefit,\nhtml.leidu-is-guest #leidu-wl349-guest-lock-card{display:none!important}\nhtml.leidu-is-guest body #contents .prdList li .description .spec li.leidu-orig-price-muted{color:#000!important;opacity:1!important;font-weight:400!important;text-decoration:none!important;text-decoration-line:none!important}\nhtml.leidu-is-guest body #contents .prdList li .description .spec li.leidu-orig-price-muted > span:not(.title):not(.leidu-price-badges):not(.leidu-free-shipping-badge):not(#span_product_tax_type_text),\nhtml.leidu-is-guest body #contents .prdList li .description .spec li.leidu-orig-price-muted > span:not(.title):not(.leidu-price-badges):not(.leidu-free-shipping-badge):not(#span_product_tax_type_text) > span:not(.leidu-price-badges):not(.leidu-free-shipping-badge){text-decoration:none!important;text-decoration-line:none!important;text-decoration-color:currentColor!important;text-decoration-thickness:auto!important;color:#000!important;font-size:13px!important;line-height:20px!important;opacity:1!important;font-weight:400!important}\nhtml.leidu-is-guest .leidu-mbp-wrap .leidu-hero-orig{text-decoration:none!important;color:#FAF7F2!important;opacity:.96!important;font-size:13.5px!important;font-weight:600!important}\nhtml.leidu-is-guest .leidu-mbp-wrap .leidu-hero-orig::after{content:\" →\";font-style:normal;opacity:.75}\n/* WL151: sticky-buy clearance */\nhtml body .moveToTop_module,html body .moveToTop_module.visible{position:fixed!important;top:auto!important;right:14px!important;bottom:calc(74px + env(safe-area-inset-bottom,0px))!important;transform:none!important;transition:opacity .3s!important;margin:0!important}\nhtml body:has(#leidu-messenger[open]) .moveToTop_module{display:none!important}\nhtml.leidu-is-login body #contents ul.snsArea > li.btn_kakao{order:-1}\nhtml.leidu-is-login body #contents ul.snsArea > li.btn_kakao > a{background:#FEE500!important;color:#191919!important;border-color:#E5CE00!important;font-weight:700!important;order:-1}\nhtml.leidu-is-login body #contents ul.snsArea > li.btn_kakao > a *{color:#191919!important}\nhtml body #leidu-kakao-sync-login-guide{margin:12px 0 0!important;font-size:12px!important;line-height:1.65!important;color:#5B5146!important;font-weight:400!important;word-break:keep-all!important;overflow-wrap:anywhere!important;text-align:left!important}\n@media(max-width:767px){\nhtml.leidu-is-guest body #contents .prdList li .description .spec li.leidu-orig-price-muted > span:not(.title):not(.leidu-price-badges):not(.leidu-free-shipping-badge):not(#span_product_tax_type_text),\nhtml.leidu-is-guest body #contents .prdList li .description .spec li.leidu-orig-price-muted > span:not(.title):not(.leidu-price-badges):not(.leidu-free-shipping-badge):not(#span_product_tax_type_text) > span:not(.leidu-price-badges):not(.leidu-free-shipping-badge){font-size:12px!important;line-height:18px!important}\nhtml.leidu-has-sticky-buy body .moveToTop_module{bottom:calc(max(76px,var(--leidu-sticky-buy-clearance,76px)) + 56px + env(safe-area-inset-bottom,0px))!important}\n}\nhtml.leidu-is-member.leidu-wl150-express-guard #NaverChk_Button,html.leidu-is-member.leidu-wl150-express-guard #NPAY_BUTTON_BOX_ID,html.leidu-is-member.leidu-wl150-express-guard .npay_storebtn_bx,html.leidu-is-member.leidu-wl150-express-guard #kakao-checkout-button,html.leidu-is-member.leidu-wl150-express-guard #appPaymentButtonBox,html.leidu-is-member.leidu-wl150-express-guard .leidu-express-payments,html.leidu-is-member.leidu-wl150-express-guard #leidu-express-pay-notice{display:none!important}\n";
  (document.head || root).appendChild(st);
})();
/* LEIDU Official Mall Funnel Upgrade v2 (WL-43, 2026-11-16) */
(function () {
  'use strict';
  var POPUP_CSS = ".leidu-bpop-backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 9990;\n  display: none;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n  background: rgba(8, 7, 6, 0.72);\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n  box-sizing: border-box;\n}\n.leidu-bpop-backdrop.is-open {\n  display: flex;\n}\n.leidu-bpop-modal {\n  position: relative;\n  width: 100%;\n  max-width: 468px;\n  max-height: calc(100svh - 28px);\n  background: #0C0B0A url(\"https://designerko.github.io/leidu-cdn/leidu_promo_assets/winter_soap_and_water_1.webp\") center 24% / cover no-repeat;\n  border: 1.5px solid rgba(232, 204, 158, 0.42);\n  box-shadow: 0 32px 84px rgba(0, 0, 0, 0.72);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  font-family: \"Pretendard\", \"Apple SD Gothic Neo\", -apple-system, BlinkMacSystemFont, \"Noto Sans KR\", sans-serif;\n  word-break: keep-all;\n  color: #FFFFFF;\n  -webkit-font-smoothing: antialiased;\n}\n.leidu-bpop-modal::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(180deg, rgba(12, 11, 10, 0.80) 0%, rgba(12, 11, 10, 0.86) 46%, rgba(10, 9, 8, 0.97) 100%);\n  pointer-events: none;\n  z-index: 0;\n}\n.leidu-bpop-modal > * {\n  position: relative;\n  z-index: 1;\n}\n.leidu-bpop-scroll {\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch;\n  flex: 1 1 auto;\n  padding: 26px 26px 22px;\n}\n.leidu-bpop-topclose {\n  position: absolute;\n  top: 18px;\n  right: 18px;\n  z-index: 5;\n  width: 34px;\n  height: 34px;\n  border: 1px solid rgba(243, 217, 176, 0.36);\n  border-radius: 50%;\n  background: rgba(12, 11, 10, 0.68);\n  color: #FFFFFF;\n  font-size: 19px;\n  line-height: 1;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.leidu-bpop-brandrow {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding-right: 44px;\n  padding-bottom: 16px;\n  border-bottom: 1px solid rgba(232, 204, 158, 0.26);\n}\n.leidu-bpop-logo {\n  font-family: Georgia, \"Times New Roman\", serif;\n  font-size: 18px;\n  font-weight: 600;\n  letter-spacing: 0.30em;\n  color: #FFFFFF;\n}\n.leidu-bpop-kicker {\n  font-size: 10.5px;\n  font-weight: 700;\n  letter-spacing: 0.18em;\n  color: #F3D9B0;\n  padding: 4px 10px;\n  border: 1px solid rgba(238, 210, 164, 0.58);\n  background: rgba(12, 11, 10, 0.72);\n}\n.leidu-bpop-herocopy {\n  display: block;\n  margin: 22px 0 20px;\n  text-decoration: none !important;\n}\n.leidu-bpop-headline {\n  margin: 0;\n  font-size: 30px;\n  font-weight: 800;\n  line-height: 1.26;\n  letter-spacing: -0.025em;\n  color: #FFFFFF;\n  text-shadow: 0 3px 22px rgba(0, 0, 0, 0.75);\n}\n.leidu-bpop-headline em {\n  font-style: normal;\n  color: #F6DFB7;\n}\n.leidu-bpop-summary {\n  display: flex;\n  flex-direction: column;\n  gap: 11px;\n  margin-bottom: 22px;\n}\n.leidu-bpop-row {\n  background: rgba(14, 13, 11, 0.84);\n  border: 1px solid rgba(232, 204, 158, 0.32);\n  border-left: 4px solid #E8CAA0;\n  padding: 15px 18px;\n  text-align: left;\n}\n.leidu-bpop-row strong {\n  display: block;\n  font-size: 18.5px;\n  font-weight: 800;\n  line-height: 1.32;\n  letter-spacing: -0.015em;\n  color: #FFFFFF;\n}\n.leidu-bpop-row span {\n  display: block;\n  margin-top: 4px;\n  font-size: 13.5px;\n  font-weight: 500;\n  line-height: 1.38;\n  color: #EADBC4;\n}\n.leidu-bpop-actions {\n  display: grid;\n  grid-template-columns: 1.52fr 0.82fr;\n  gap: 8px;\n}\n.leidu-bpop-btn-kakao {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 50px;\n  background: #FEE500;\n  color: #171300 !important;\n  font-size: 15px;\n  font-weight: 800;\n  letter-spacing: -0.015em;\n  text-decoration: none !important;\n  border-radius: 2px;\n  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);\n}\n.leidu-bpop-btn-detail {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 50px;\n  background: rgba(232, 204, 158, 0.14);\n  border: 1px solid rgba(232, 204, 158, 0.54);\n  color: #F7EAD2 !important;\n  font-size: 14.5px;\n  font-weight: 700;\n  letter-spacing: -0.01em;\n  text-decoration: none !important;\n  border-radius: 2px;\n}\n.leidu-bpop-footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 40px;\n  padding: 0 20px;\n  background: rgba(8, 7, 6, 0.94);\n  border-top: 1px solid rgba(232, 204, 158, 0.18);\n  flex-shrink: 0;\n}\n.leidu-bpop-footer button {\n  border: 0;\n  background: transparent;\n  color: rgba(250, 247, 242, 0.88);\n  font-size: 12px;\n  font-weight: 500;\n  cursor: pointer;\n  padding: 6px 4px;\n}\n.leidu-bpop-footer button:hover {\n  color: #FFFFFF;\n}\n@media (max-width: 767px) {\n  .leidu-bpop-backdrop { padding: 12px; }\n  .leidu-bpop-modal { max-width: 372px; max-height: calc(100svh - 24px); }\n  .leidu-bpop-scroll { padding: 20px 18px 18px; }\n  .leidu-bpop-topclose { top: 14px; right: 14px; width: 31px; height: 31px; font-size: 17px; }\n  .leidu-bpop-headline { font-size: 25px; }\n  .leidu-bpop-summary { gap: 9px; margin-bottom: 18px; }\n  .leidu-bpop-row { padding: 13px 14px; }\n  .leidu-bpop-row strong { font-size: 16.5px; }\n  .leidu-bpop-row span { font-size: 12.5px; }\n  .leidu-bpop-actions { grid-template-columns: 1fr; gap: 7px; }\n  .leidu-bpop-btn-kakao, .leidu-bpop-btn-detail { height: 46px; font-size: 14.5px; }\n  .leidu-bpop-footer { height: 38px; padding: 0 16px; }\n}\n/* Board #4001 typography protection against Cafe24 12px!important rule */\nhtml body #contents .xans-board-read .leidu-benefit-notice-post h2 {\n  font-size: 24px !important;\n  font-weight: 600 !important;\n  line-height: 1.35 !important;\n}\nhtml body #contents .xans-board-read .leidu-benefit-notice-post h3 {\n  font-size: 17px !important;\n  font-weight: 700 !important;\n  line-height: 1.4 !important;\n}\nhtml body #contents .xans-board-read .leidu-benefit-notice-post p,\nhtml body #contents .xans-board-read .leidu-benefit-notice-post span,\nhtml body #contents .xans-board-read .leidu-benefit-notice-post strong {\n  font-size: inherit !important;\n  line-height: inherit !important;\n}\nhtml body #contents .xans-board-read .leidu-benefit-notice-post strong {\n  font-weight: 700 !important;\n}\nhtml body #contents .xans-board-read .leidu-benefit-notice-post a.leidu-notice-cta {\n  font-size: 13.5px !important;\n  font-weight: 700 !important;\n  line-height: 1.2 !important;\n}";
  var POPUP_HTML = "<div class=\"leidu-bpop-modal\">\n    <button type=\"button\" class=\"leidu-bpop-topclose\" data-bpop-close aria-label=\"關閉視窗\">×</button>\n    <div class=\"leidu-bpop-scroll\">\n      <div class=\"leidu-bpop-brandrow\">\n        <span class=\"leidu-bpop-logo\">LEIDU</span>\n        <span class=\"leidu-bpop-kicker\">OFFICIAL BOUTIQUE</span>\n      </div>\n      <a href=\"/benefit.html\" class=\"leidu-bpop-herocopy\" aria-label=\"LEIDU 繁體中文官方旗艦店專屬禮遇\">\n        <h3 class=\"leidu-bpop-headline\">韓國首爾官方直營<br/><em>註冊會員即享專屬禮遇</em></h3>\n      </a>\n      <div class=\"leidu-bpop-summary\">\n        <div class=\"leidu-bpop-row\">\n          <strong>5% ~ 10% 常態無上限自動折抵</strong>\n          <span>(免費註冊即享 GLOBAL WELCOME 5% · 無使用次數限制)</span>\n        </div>\n        <div class=\"leidu-bpop-row\">\n          <strong>全平台 4,000+ 真實買家評價 &amp; 實穿直播影片</strong>\n        </div>\n        <div class=\"leidu-bpop-row\">\n          <strong>任選 2 件順豐速運免運直郵</strong>\n          <span>(韓國出口零稅率優惠價 · 台灣／香港直送)</span>\n        </div>\n      </div>\n      <div class=\"leidu-bpop-actions\">\n        <a href=\"/member/login.html\" class=\"leidu-bpop-btn-kakao\">免費註冊／登入 · 解鎖會員價 &gt;</a>\n        <a href=\"/benefit.html\" class=\"leidu-bpop-btn-detail\">禮遇詳情 &gt;</a>\n      </div>\n    </div>\n    <div class=\"leidu-bpop-footer\">\n      <button type=\"button\" data-bpop-hide-today>今日不再顯示</button>\n      <button type=\"button\" data-bpop-close>關閉 ×</button>\n    </div>\n  </div>";
  var BENEFIT_CSS = "html body #contents:has(#leidu-benefit-page) {\n  width: 100% !important;\n  max-width: 100% !important;\n  margin: 0 auto !important;\n  padding: 90px 0 0 !important;\n  background: #FAF7F2 !important;\n  box-sizing: border-box;\n}\n#leidu-benefit-page {\n  color: #211C18;\n  background: #FAF7F2;\n  font-family: -apple-system, BlinkMacSystemFont, \"Apple SD Gothic Neo\", \"Pretendard\", \"Noto Sans KR\", sans-serif;\n  word-break: keep-all;\n  -webkit-font-smoothing: antialiased;\n}\n#leidu-benefit-page * {\n  box-sizing: border-box;\n}\n.leidu-bf-hero {\n  position: relative;\n  overflow: hidden;\n  background: #241D18 url(\"https://designerko.github.io/leidu-cdn/leidu_promo_assets/winter_soap_and_water_1.webp\") center 26% / cover no-repeat;\n  color: #FAF7F2;\n  padding: 102px 24px 74px;\n  text-align: center;\n  border-bottom: 1px solid rgba(226, 212, 192, 0.24);\n}\n.leidu-bf-hero::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(180deg, rgba(28, 22, 18, 0.68) 0%, rgba(28, 22, 18, 0.56) 45%, rgba(28, 22, 18, 0.90) 100%);\n}\n.leidu-bf-hero-inner {\n  position: relative;\n  z-index: 1;\n  max-width: 880px;\n  margin: 0 auto;\n}\n.leidu-bf-eyebrow {\n  display: inline-flex;\n  align-items: center;\n  gap: 12px;\n  font-size: 11.5px;\n  font-weight: 600;\n  letter-spacing: 0.24em;\n  color: #E2D1B8;\n  margin-bottom: 16px;\n  text-transform: uppercase;\n}\n.leidu-bf-eyebrow::before,\n.leidu-bf-eyebrow::after {\n  content: \"\";\n  display: inline-block;\n  width: 26px;\n  height: 1px;\n  background: rgba(226, 209, 184, 0.5);\n}\n.leidu-bf-hero h1 {\n  margin: 0 0 16px;\n  font-family: \"Nanum Myeongjo\", Georgia, serif;\n  font-size: 36px;\n  font-weight: 600;\n  line-height: 1.32;\n  letter-spacing: -0.02em;\n  color: #FFFFFF;\n}\n.leidu-bf-hero-desc {\n  margin: 0 auto 24px;\n  max-width: 700px;\n  font-size: 15.5px;\n  line-height: 1.74;\n  color: rgba(250, 247, 242, 0.92);\n}\n.leidu-bf-hero-desc strong {\n  color: #FFE4B8;\n  font-weight: 700;\n}\n.leidu-bf-hero-pills {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 8px;\n  margin: 0 auto 28px;\n}\n.leidu-bf-hero-pill {\n  display: inline-flex;\n  align-items: center;\n  padding: 6px 14px;\n  border: 1px solid rgba(226, 209, 184, 0.42);\n  background: rgba(34, 26, 20, 0.48);\n  color: #F6EFE4;\n  font-size: 12.5px;\n  font-weight: 500;\n  border-radius: 999px;\n}\n.leidu-bf-cta-group {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 12px;\n}\n.leidu-bf-btn-kakao {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  min-width: 272px;\n  height: 52px;\n  padding: 0 28px;\n  background: #FEE500;\n  color: #1F1A00 !important;\n  font-size: 14.5px;\n  font-weight: 700;\n  text-decoration: none !important;\n  border-radius: 3px;\n}\n.leidu-bf-btn-shop {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  min-width: 236px;\n  height: 52px;\n  padding: 0 26px;\n  background: rgba(250, 247, 242, 0.12);\n  border: 1px solid rgba(250, 247, 242, 0.45);\n  color: #FFFFFF !important;\n  font-size: 14px;\n  font-weight: 500;\n  text-decoration: none !important;\n  border-radius: 3px;\n}\n.leidu-bf-live-status {\n  display: none;\n  margin: 22px auto 0;\n  max-width: 640px;\n  padding: 12px 18px;\n  background: rgba(36, 28, 22, 0.72);\n  border: 1px solid rgba(226, 209, 184, 0.48);\n  border-radius: 3px;\n  font-size: 13.5px;\n  line-height: 1.55;\n  color: #FAF7F2;\n}\n.leidu-bf-live-status.is-visible {\n  display: block;\n}\n.leidu-bf-container {\n  max-width: 980px;\n  margin: 0 auto;\n  padding: 64px 24px 88px;\n}\n.leidu-bf-section {\n  background: #FFFFFF;\n  border: 1px solid #E5DDD0;\n  padding: 44px 40px;\n  margin-bottom: 24px;\n}\n.leidu-bf-section.is-warm-feature {\n  background: linear-gradient(180deg, #FDFBF7 0%, #F4EDE1 100%);\n  border-color: #D8CBB8;\n}\n.leidu-bf-num {\n  display: inline-block;\n  font-size: 11.5px;\n  font-weight: 700;\n  letter-spacing: 0.18em;\n  color: #8C735B;\n  margin-bottom: 10px;\n  text-transform: uppercase;\n}\n.leidu-bf-section h2 {\n  margin: 0 0 14px;\n  font-size: 23.5px;\n  font-weight: 600;\n  line-height: 1.38;\n  letter-spacing: -0.015em;\n  color: #211C18;\n}\n.leidu-bf-lead {\n  margin: 0 0 26px;\n  font-size: 14.5px;\n  line-height: 1.75;\n  color: #4E463E;\n}\n.leidu-bf-highlights {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 14px;\n}\n.leidu-bf-hl-card {\n  background: #FAF7F2;\n  border: 1px solid #E8E0D3;\n  padding: 20px 18px;\n}\n.leidu-bf-hl-card strong {\n  display: block;\n  font-size: 17px;\n  font-weight: 700;\n  color: #211C18;\n  margin-bottom: 6px;\n}\n.leidu-bf-hl-card span {\n  display: block;\n  font-size: 13px;\n  line-height: 1.62;\n  color: #5C544B;\n}\n.leidu-bf-compare-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13.5px;\n  border-top: 1.5px solid #28201B;\n}\n.leidu-bf-compare-table th,\n.leidu-bf-compare-table td {\n  padding: 14px 16px;\n  border-bottom: 1px solid #E6DFD3;\n  text-align: left;\n  line-height: 1.6;\n  vertical-align: middle;\n}\n.leidu-bf-compare-table thead th {\n  background: #F6F1E8;\n  font-weight: 700;\n  color: #211C18;\n}\n.leidu-bf-compare-table thead th.is-ownmall {\n  background: #2B231D;\n  color: #FAF7F2;\n}\n.leidu-bf-compare-table tbody th {\n  background: #FAF7F2;\n  width: 22%;\n  font-weight: 600;\n  color: #2E2823;\n}\n.leidu-bf-compare-table tbody td.is-ss {\n  color: #6E665D;\n  width: 35%;\n}\n.leidu-bf-compare-table tbody td.is-ownmall {\n  background: #FCF9F3;\n  color: #211C18;\n  font-weight: 600;\n  width: 43%;\n}\n.leidu-bf-compare-table tbody td.is-ownmall strong {\n  color: #A63D26;\n  font-weight: 700;\n}\n.leidu-bf-tier-grid {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 20px;\n}\n.leidu-bf-tier {\n  border: 1px solid #E3DACB;\n  background: #FCF9F4;\n  padding: 24px 16px;\n  text-align: center;\n}\n.leidu-bf-tier.is-top {\n  background: #2B231D;\n  border-color: #2B231D;\n  color: #FAF7F2;\n}\n.leidu-bf-tier-name {\n  font-size: 12px;\n  font-weight: 700;\n  letter-spacing: 0.16em;\n  color: #857461;\n  margin-bottom: 10px;\n}\n.leidu-bf-tier.is-top .leidu-bf-tier-name {\n  color: #DFCBB0;\n}\n.leidu-bf-tier-rate {\n  font-size: 34px;\n  font-weight: 700;\n  line-height: 1.1;\n  color: #211C18;\n  margin-bottom: 8px;\n}\n.leidu-bf-tier.is-top .leidu-bf-tier-rate {\n  color: #FFFFFF;\n}\n.leidu-bf-tier-off {\n  display: inline-block;\n  font-size: 11px;\n  font-weight: 600;\n  padding: 3px 9px;\n  border-radius: 2px;\n  background: #F9EAE5;\n  color: #A63D26;\n  margin-bottom: 12px;\n}\n.leidu-bf-tier.is-top .leidu-bf-tier-off {\n  background: rgba(223, 203, 176, 0.2);\n  color: #FFE3BD;\n}\n.leidu-bf-tier-cond {\n  font-size: 12.5px;\n  line-height: 1.5;\n  color: #5C544B;\n}\n.leidu-bf-tier.is-top .leidu-bf-tier-cond {\n  color: rgba(250, 247, 242, 0.86);\n}\n.leidu-bf-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13.5px;\n  border-top: 1.5px solid #28201B;\n}\n.leidu-bf-table th,\n.leidu-bf-table td {\n  padding: 13px 14px;\n  border-bottom: 1px solid #E6DFD3;\n  text-align: left;\n  line-height: 1.55;\n}\n.leidu-bf-table th {\n  background: #FAF7F2;\n  font-weight: 600;\n  color: #2E2823;\n  width: 24%;\n}\n.leidu-bf-table td strong {\n  color: #A63D26;\n  font-weight: 700;\n}\n.leidu-bf-policy-note {\n  margin-top: 16px;\n  padding: 15px 18px;\n  background: #FAF7F2;\n  border: 1px solid #E5DDD0;\n  font-size: 12.5px;\n  line-height: 1.72;\n  color: #554D45;\n}\n.leidu-bf-policy-note strong {\n  color: #211C18;\n  font-weight: 600;\n}\n.leidu-bf-steps {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 16px;\n}\n.leidu-bf-step {\n  background: #FAF7F2;\n  border: 1px solid #E5DDD0;\n  padding: 18px 16px;\n}\n.leidu-bf-step em {\n  display: inline-block;\n  font-style: normal;\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: 0.12em;\n  color: #8C735B;\n  margin-bottom: 6px;\n}\n.leidu-bf-step strong {\n  display: block;\n  font-size: 14.5px;\n  font-weight: 600;\n  color: #211C18;\n  margin-bottom: 4px;\n}\n.leidu-bf-step span {\n  display: block;\n  font-size: 12.5px;\n  line-height: 1.6;\n  color: #5C544B;\n}\n.leidu-bf-inherit-box {\n  background: #F6F1E8;\n  border: 1px solid #E2D9C9;\n  padding: 20px 22px;\n}\n.leidu-bf-help-row {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  font-size: 13px;\n  color: #4E463E;\n}\n.leidu-bf-help-links {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.leidu-bf-help-links a {\n  display: inline-flex;\n  align-items: center;\n  padding: 8px 14px;\n  border: 1px solid #2B231D;\n  background: #FFFFFF;\n  color: #211C18 !important;\n  font-size: 12px;\n  font-weight: 600;\n  text-decoration: none !important;\n  border-radius: 2px;\n}\n.leidu-bf-dual-showcase {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 18px;\n}\n.leidu-bf-showcard {\n  background: #FFFFFF;\n  border: 1px solid #DDD1BF;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.leidu-bf-showcard-media {\n  position: relative;\n  height: 188px;\n  overflow: hidden;\n  background: #2B231D;\n}\n.leidu-bf-showcard-media img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: center 28%;\n  filter: brightness(0.86);\n}\n.leidu-bf-showcard-pill {\n  position: absolute;\n  left: 16px;\n  bottom: 14px;\n  padding: 4px 10px;\n  background: rgba(35, 27, 22, 0.86);\n  border: 1px solid rgba(226, 209, 184, 0.45);\n  color: #FAF7F2;\n  font-size: 10.5px;\n  font-weight: 700;\n  letter-spacing: 0.1em;\n}\n.leidu-bf-showcard-body {\n  padding: 24px 22px 26px;\n  flex: 1;\n}\n.leidu-bf-showcard-body h3 {\n  margin: 0 0 10px;\n  font-size: 18.5px;\n  font-weight: 700;\n  color: #211C18;\n  line-height: 1.38;\n}\n.leidu-bf-showcard-body p {\n  margin: 0 0 14px;\n  font-size: 13.5px;\n  line-height: 1.7;\n  color: #524A42;\n}\n.leidu-bf-showcard-points {\n  padding-top: 12px;\n  border-top: 1px dashed #E2D9C9;\n  font-size: 12.5px;\n  line-height: 1.65;\n  color: #3E3731;\n}\n.leidu-bf-perks {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 14px;\n}\n.leidu-bf-perk {\n  background: #FAF7F2;\n  border: 1px solid #E8E0D3;\n  padding: 22px 20px;\n}\n.leidu-bf-perk-badge {\n  display: inline-block;\n  font-size: 11px;\n  font-weight: 700;\n  padding: 3px 8px;\n  background: #2B231D;\n  color: #FAF7F2;\n  border-radius: 2px;\n  margin-bottom: 10px;\n}\n.leidu-bf-perk h3 {\n  margin: 0 0 8px;\n  font-size: 16px;\n  font-weight: 600;\n  color: #211C18;\n}\n.leidu-bf-perk p {\n  margin: 0;\n  font-size: 13px;\n  line-height: 1.65;\n  color: #5C544B;\n}\n.leidu-bf-perk a.leidu-bf-inline-link {\n  display: inline-block;\n  margin-top: 10px;\n  font-size: 12.5px;\n  font-weight: 700;\n  color: #7A5438 !important;\n  text-decoration: underline !important;\n}\n.leidu-bf-bottom-cta {\n  margin-top: 36px;\n  background: #261E19;\n  color: #FAF7F2;\n  padding: 48px 28px;\n  text-align: center;\n  border: 1px solid #3D3129;\n}\n.leidu-bf-bottom-cta h3 {\n  margin: 0 0 10px;\n  font-family: \"Nanum Myeongjo\", Georgia, serif;\n  font-size: 25px;\n  font-weight: 600;\n  color: #FFFFFF;\n}\n.leidu-bf-bottom-cta p {\n  margin: 0 0 26px;\n  font-size: 14px;\n  line-height: 1.68;\n  color: rgba(250, 247, 242, 0.86);\n}\n@media (max-width: 767px) {\n  html body #contents:has(#leidu-benefit-page) { padding-top: 56px !important; }\n  .leidu-bf-hero { padding: 50px 18px 44px; }\n  .leidu-bf-hero h1 { font-size: 25px; }\n  .leidu-bf-hero-desc { font-size: 13.5px; margin-bottom: 18px; }\n  .leidu-bf-hero-pill { font-size: 11.5px; padding: 5px 10px; }\n  .leidu-bf-btn-kakao, .leidu-bf-btn-shop { width: 100%; min-width: 0; height: 48px; font-size: 13.5px; }\n  .leidu-bf-container { padding: 30px 16px 64px; }\n  .leidu-bf-section { padding: 26px 18px; margin-bottom: 16px; }\n  .leidu-bf-section h2 { font-size: 19px; }\n  .leidu-bf-highlights, .leidu-bf-steps, .leidu-bf-perks, .leidu-bf-dual-showcase { grid-template-columns: 1fr; gap: 12px; }\n  .leidu-bf-tier-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }\n  .leidu-bf-tier { padding: 18px 12px; }\n  .leidu-bf-tier-rate { font-size: 28px; }\n  .leidu-bf-table th, .leidu-bf-table td, .leidu-bf-compare-table th, .leidu-bf-compare-table td { padding: 10px 9px; font-size: 12px; }\n  .leidu-bf-bottom-cta { padding: 36px 18px; }\n  .leidu-bf-bottom-cta h3 { font-size: 20px; }\n}";
  var BENEFIT_HTML = "<section class=\"leidu-bf-hero\">\n    <div class=\"leidu-bf-hero-inner\">\n      <div class=\"leidu-bf-eyebrow\">LEIDU OFFICIAL ONLINE BOUTIQUE</div>\n      <h1>LEIDU 官方旗艦店 會員專屬禮遇</h1>\n      <p class=\"leidu-bf-hero-desc\">\n        免費註冊會員<strong>即享 5% 常態折扣 (GLOBAL WELCOME)</strong>，累積消費最高享 <strong>GLOBAL VVIP 10% 無上限自動折抵</strong>，<br />\n        同享<strong>韓國出口零稅率定價</strong>、<strong>任選 2 件順豐免運直郵</strong>與<strong>全平台 4,000+ 真實穿搭評價</strong>。\n      </p>\n      <div class=\"leidu-bf-hero-pills\">\n        <span class=\"leidu-bf-hero-pill\">免費註冊即享 5% 常態折扣</span>\n        <span class=\"leidu-bf-hero-pill\">VIP 最高享 10% 無上限自動折抵</span>\n        <span class=\"leidu-bf-hero-pill\">任選 2 件順豐速運免運直郵</span>\n        <span class=\"leidu-bf-hero-pill\">整合 4,000+ 韓國買家真實評價</span>\n        <span class=\"leidu-bf-hero-pill\">商品頁內建實穿走秀與直播影片</span>\n      </div>\n      <div class=\"leidu-bf-cta-group\">\n        <a class=\"leidu-bf-btn-kakao\" href=\"/member/login.html\">免費註冊／登入 · 查看我的會員等級 →</a>\n        <a class=\"leidu-bf-btn-shop\" href=\"/\">瀏覽最新上架單品 →</a>\n      </div>\n      <div id=\"leidu-bf-live-status\" class=\"leidu-bf-live-status\" role=\"status\" aria-live=\"polite\"></div>\n    </div>\n  </section>\n  <div class=\"leidu-bf-container\">\n    <section class=\"leidu-bf-section\" aria-labelledby=\"bf-sec-02\">\n      <span class=\"leidu-bf-num\">GLOBAL MEMBERSHIP TIERS</span>\n      <h2 id=\"bf-sec-02\">海外官方旗艦店 專屬會員等級一覽</h2>\n      <p class=\"leidu-bf-lead\">\n        無須領取優惠券、無每月張數限制，登入後於結帳頁面單筆滿 <strong>NT$1,000</strong> 系統即自動折抵會員折扣。\n      </p>\n      <div class=\"leidu-bf-tier-grid\" style=\"grid-template-columns:repeat(3,minmax(0,1fr));\">\n        <div class=\"leidu-bf-tier\">\n          <div class=\"leidu-bf-tier-name\">GLOBAL WELCOME</div>\n          <div class=\"leidu-bf-tier-rate\">5%</div>\n          <div class=\"leidu-bf-tier-off\">無上限常態自動折抵</div>\n          <div class=\"leidu-bf-tier-cond\">免費註冊會員即享<br />滿 NT$1,000 自動折抵</div>\n        </div>\n        <div class=\"leidu-bf-tier\">\n          <div class=\"leidu-bf-tier-name\">GLOBAL VIP</div>\n          <div class=\"leidu-bf-tier-rate\">8%</div>\n          <div class=\"leidu-bf-tier-off\">進階 VIP 常態折抵</div>\n          <div class=\"leidu-bf-tier-cond\">近 1 年累積實付滿<br />NT$8,000 自動升等</div>\n        </div>\n        <div class=\"leidu-bf-tier is-top\">\n          <div class=\"leidu-bf-tier-name\">GLOBAL VVIP</div>\n          <div class=\"leidu-bf-tier-rate\">10%</div>\n          <div class=\"leidu-bf-tier-off\">最高 VVIP 尊榮禮遇</div>\n          <div class=\"leidu-bf-tier-cond\">近 1 年累積實付滿<br />NT$15,000 自動升等</div>\n        </div>\n      </div>\n    </section>\n  </div>";
  var HIDE_KEY = 'leidu_hide_benefit_popup_v3_20261116';

  function upsertStyle(id, cssText) {
    document.querySelectorAll('style#' + id).forEach(function (n, idx) {
      if (idx > 0) n.remove();
    });
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.id = id;
    }
    if (el.textContent !== cssText) {
      el.textContent = cssText;
    }
    (document.body || document.head || document.documentElement).appendChild(el);
  }

  // Always inject popup + board #4001 typography protection CSS early
  upsertStyle('leidu-benefit-popup-style', POPUP_CSS);

  function getTodayKst() {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date());
    } catch (e) {
      var d = new Date(Date.now() + 9 * 3600 * 1000);
      return d.toISOString().slice(0, 10);
    }
  }

  function upgradePopup() {
    var root = document.getElementById('leidu-benefit-popup');
    if (!root || root.dataset.wl67Upgraded === '1') return;
    root.dataset.wl67Upgraded = '1';
    upsertStyle('leidu-benefit-popup-style', POPUP_CSS);
    root.setAttribute('aria-label', 'LEIDU 官方旗艦店會員專屬禮遇');
    var easypayReady=window.LEIDU_EASYPAY_CAMPAIGN_ENABLED===true;
    if(easypayReady)upsertStyle('leidu-easypay-approved-style',"#leidu-benefit-popup .leidu-easypay-asset *{box-sizing:border-box}#leidu-benefit-popup .leidu-easypay-asset{margin:0;width:480px;height:620px;background:#111;color:#f5efdf;font-family:-apple-system,BlinkMacSystemFont,\"Apple SD Gothic Neo\",sans-serif}#leidu-benefit-popup .leidu-easypay-asset .card{width:480px;height:620px;padding:28px 32px 26px;border:1px solid #8a7557;background:radial-gradient(ellipse at 100% 0,#3d3324 0,transparent 53%),#111}#leidu-benefit-popup .leidu-easypay-asset .brand{font-family:Georgia,serif;font-size:25px;letter-spacing:8px}#leidu-benefit-popup .leidu-easypay-asset .edition{margin-top:10px;font-size:10px;letter-spacing:3px;color:#bda984}#leidu-benefit-popup .leidu-easypay-asset .rule{height:1px;background:#6b5d46;margin:20px 0}#leidu-benefit-popup .leidu-easypay-asset .eyebrow{font-size:11px;letter-spacing:1.8px;color:#cfba94}#leidu-benefit-popup .leidu-easypay-asset .headline{font-family:Georgia,serif;font-size:24px;letter-spacing:.7px;line-height:1.4;margin:14px 0 19px}#leidu-benefit-popup .leidu-easypay-asset .lead{font-size:23px;font-weight:400;line-height:1.6;margin:0}#leidu-benefit-popup .leidu-easypay-asset .lead strong{font-weight:600;color:#e0c392}#leidu-benefit-popup .leidu-easypay-asset .points{list-style:none;padding:0;margin:26px 0 24px;display:grid;gap:15px;font-size:13px;line-height:1.75;color:#e8e1d3}#leidu-benefit-popup .leidu-easypay-asset .points li{padding-left:27px;position:relative}#leidu-benefit-popup .leidu-easypay-asset .points b{position:absolute;left:0;color:#c7ac7a;font-family:Georgia,serif}#leidu-benefit-popup .leidu-easypay-asset .cta{padding:15px;text-align:center;border:1px solid #cbb38c;background:#e3d4b8;color:#171511;font-size:14px;font-weight:600}#leidu-benefit-popup .leidu-easypay-asset .foot{font-size:10px;line-height:1.7;color:#a99f8e;margin-top:17px}#leidu-benefit-popup .leidu-easypay-modal{position:relative;width:480px;max-width:calc(100vw - 24px);height:620px;max-height:calc(100vh - 24px);padding:0;border:0;overflow:auto;background:#111}#leidu-benefit-popup .leidu-easypay-asset{width:480px;height:620px;max-width:100%;text-align:left}#leidu-benefit-popup .leidu-easypay-asset .card{max-width:100%}#leidu-benefit-popup .leidu-easypay-close{position:absolute;right:10px;top:6px;background:transparent;border:0;color:#f5efdf;font-size:24px;z-index:2}#leidu-benefit-popup .leidu-easypay-hide{position:absolute;right:32px;bottom:8px;border:0;background:transparent;color:#a99f8e;font-size:10px;z-index:2}#leidu-benefit-popup .leidu-easypay-asset .cta{cursor:pointer}");
    root.innerHTML = easypayReady ? "<div class=\"leidu-bpop-modal leidu-easypay-modal\"><div class=\"leidu-easypay-asset\"><main class=\"card\"><div class=\"brand\">LEIDU</div><div class=\"edition\">A MORE EFFORTLESS WAY TO SHOP</div><div class=\"rule\"></div><div class=\"eyebrow\">NAVER PAY · KAKAO PAY OPEN</div><h1 class=\"headline\">공식몰 회원 12~15% 할인가 그대로,<br>1초 간편결제 오픈</h1><ul class=\"points\"><li><b>01</b>로그인 회원 등급 할인가 적용 후<br>네이버페이·카카오페이로 1초 결제</li><li><b>02</b>4만 원 이상 무제한 상시 할인<br>3만 원 이상 무료배송 · 준비 상품 먼저 분리발송</li><li><b>03</b>최근 배송지 자동 입력으로 3초 결제 완료</li></ul><div class=\"cta\">회원 할인가로 간편하게 쇼핑하기 →</div><p class=\"foot\">등급별 12~15% · 1회 최대 10만 원 할인 · 일부 특가 제외<br>LEIDU OFFICIAL STORE · leidu.co.kr</p></main></div><button class=\"leidu-easypay-close\" type=\"button\" data-bpop-close aria-label=\"팝업 닫기\">×</button><button class=\"leidu-easypay-hide\" type=\"button\" data-bpop-hide-today>오늘 하루 보지 않기</button></div>" : POPUP_HTML;
    if(easypayReady){var cta=root.querySelector('.leidu-easypay-asset .cta');if(cta)cta.addEventListener('click',function(){location.href=__leiduShopHref__('/product/list.html?cate_no=24');});}

    function closePopup() {
      try { sessionStorage.setItem('leidu_bpop_session_closed', '1'); } catch (e) {}
      root.classList.remove('is-open');
    }
    root.querySelectorAll('a[href]').forEach(function (a) { a.setAttribute('href', __leiduShopHref__(a.getAttribute('href'))); });
    root.querySelectorAll('[data-bpop-close]').forEach(function (btn) {
      btn.addEventListener('click', closePopup);
    });
    var hideBtn = root.querySelector('[data-bpop-hide-today]');
    if (hideBtn) {
      hideBtn.addEventListener('click', function () {
        try { localStorage.setItem(HIDE_KEY, getTodayKst()); } catch (e) {}
        closePopup();
      });
    }
    root.addEventListener('click', function (e) {
      if (e.target === root) closePopup();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('is-open')) closePopup();
    });

    var forceShow = /[?&]show_benefit_popup=1\b/.test(location.search);
    var today = getTodayKst();
    var hiddenDate = '', sessionClosed = '';
    try { hiddenDate = localStorage.getItem(HIDE_KEY) || ''; sessionClosed = sessionStorage.getItem('leidu_bpop_session_closed') || ''; } catch (e) {}
    if (forceShow || (hiddenDate !== today && sessionClosed !== '1')) {
      root.classList.add('is-open');
    } else {
      root.classList.remove('is-open');
    }
  }

  function updateLiveMemberBanner() {
    var box=document.getElementById('leidu-bf-live-status'),info=window.leiduGetMemberTierInfo();
    if(!box)return;
    if(!info.isLogged){box.textContent='';box.classList.remove('is-visible');return;}
    box.textContent='您目前為 ['+info.gradeName+'] 會員，結帳單筆滿 NT$1,000 即自動享 '+info.rate+'% 常態折抵優惠。';
    box.classList.add('is-visible');
  }

  window.addEventListener('leidu:membership-linked', updateLiveMemberBanner);

  function upgradeBenefitPage() {
    var page = document.getElementById('leidu-benefit-page');
    if (!page || page.dataset.wl67Upgraded === '1') return;
    page.dataset.wl67Upgraded = '1';
    upsertStyle('leidu-benefit-page-style', BENEFIT_CSS);
    page.innerHTML = BENEFIT_HTML;
    page.querySelectorAll('a[href]').forEach(function (a) { a.setAttribute('href', __leiduShopHref__(a.getAttribute('href'))); });
    setTimeout(updateLiveMemberBanner, 200);
  }

  function applyAll() {
    upgradePopup();
    upgradeBenefitPage();
  }

  applyAll();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAll);
  }
  window.addEventListener('load', function () {
    applyAll();
    updateLiveMemberBanner();
  });
})();

/* LEIDU Official Mall PDP Live Try-On Demand Vote v1 (WL-55, 2026-11-16) */
(function () {
  'use strict';
  var LIVE_STATUS_ENDPOINTS = [
    'https://webhook.leidu.co.kr/kakao-ai-skill/ownmall/live-request/status'
  ];
  var LIVE_VOTE_ENDPOINTS = [
    'https://webhook.leidu.co.kr/kakao-ai-skill/ownmall/live-request/vote'
  ];
  var ANON_VOTER_KEY_STORAGE = 'leidu_live_tryon_voter_v1';
  var VOTED_PRODUCT_KEY_PREFIX = 'leidu_live_tryon_done_v1_';
  var SUB_KEY = 'leidu_webpush_subscribed_v1';

  var LIVE_TRYON_CSS = '#leidu-live-tryon-card{margin:16px 0 8px;padding:15px 16px;background:#FAF7F2;border:1px solid #DFD4C3;border-radius:6px;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard",sans-serif;color:#211B16;word-break:keep-all;box-sizing:border-box}#leidu-live-tryon-card *{box-sizing:border-box}.lltr-eyebrow{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px;font-size:10.5px;font-weight:700;letter-spacing:0.12em;color:#84694C}.lltr-badge{padding:2px 7px;background:#EFE7DA;border:1px solid #DCD0BE;color:#5B4631;font-size:10px;font-weight:700;letter-spacing:0.06em}.lltr-desc{margin:0 0 11px;font-size:12.5px;line-height:1.5;color:#4E453C}.lltr-btn{width:100%;min-height:44px;padding:10px 14px;border:1px solid #261E18;border-radius:4px;background:#261E18;color:#FAF7F2!important;font-size:13px;font-weight:700;letter-spacing:-0.01em;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:opacity .16s ease,background .16s ease}.lltr-btn:hover{opacity:.93}.lltr-btn.is-voted{background:#EFE7DA;border-color:#C5B297;color:#241B14!important;cursor:default}.lltr-btn.is-has-video{background:#FFFFFF;border-color:#C8AA7E;color:#231B16!important}.lltr-voted-sub{margin:8px 0 0;font-size:11.5px;line-height:1.45;color:#6A5D4F;text-align:center}.lltr-push-nudge{margin-top:10px;padding-top:10px;border-top:1px dashed #DFD5C5;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:12px;color:#3F362E}.lltr-push-btn{appearance:none;border:1px solid #8A6D4B;background:#FFFDF9;color:#5A432B;padding:5px 10px;border-radius:4px;font-size:11.5px;font-weight:700;cursor:pointer;white-space:nowrap}'; 
  function injectStyle() {
    if (document.getElementById('leidu-live-tryon-style')) return;
    var st = document.createElement('style');
    st.id = 'leidu-live-tryon-style';
    st.textContent = LIVE_TRYON_CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  function detectMemberId() { return typeof window.leiduDetectMemberId === 'function' ? window.leiduDetectMemberId() : ''; }

  function isPushSubscribed() {
    try { return localStorage.getItem(SUB_KEY) === '1'; } catch (e) { return false; }
  }

  function triggerPushPrompt() {
    if (window.LEIDU_PWA_PUSH && typeof window.LEIDU_PWA_PUSH.subscribeWebPushNow === 'function') {
      var ua = navigator.userAgent || '';
      var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      var standalone = !!((window.navigator && window.navigator.standalone === true) || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches));
      if (isIOS && !standalone && typeof window.LEIDU_PWA_PUSH.openSheet === 'function') {
        window.LEIDU_PWA_PUSH.openSheet('ios_guide');
        return;
      }
      window.LEIDU_PWA_PUSH.subscribeWebPushNow();
    }
  }

  function getOrCreateVoterKey() {
    var mid = detectMemberId();
    if (mid) return 'member:' + mid;
    try {
      var saved = localStorage.getItem(ANON_VOTER_KEY_STORAGE) || '';
      if (/^anon:[a-zA-Z0-9_-]{8,64}$/.test(saved)) return saved;
      var arr = new Uint8Array(16);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(arr);
      } else {
        for (var i = 0; i < 16; i++) arr[i] = Math.floor(Math.random() * 256);
      }
      var hex = Array.from(arr).map(function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
      var vk = 'anon:' + hex;
      localStorage.setItem(ANON_VOTER_KEY_STORAGE, vk);
      return vk;
    } catch (e) {
      return 'anon:fallback' + String(Date.now());
    }
  }

  function detectProductNo() {
    if (typeof window.iProductNo === 'number' && window.iProductNo > 0) return window.iProductNo;
    if (typeof window.iProductNo === 'string' && /^\d+$/.test(window.iProductNo)) return parseInt(window.iProductNo, 10);
    var mQuery = location.search.match(/[?&]product_no=(\d+)/);
    if (mQuery) return parseInt(mQuery[1], 10);
    var mPath = location.pathname.match(/\/product\/[^/]+\/(\d+)(?:\/|$)/);
    if (mPath) return parseInt(mPath[1], 10);
    return 0;
  }

  function detectProductName() {
    var cl = window.leiduCleanTitle || function (s) { return String(s || '').trim(); };
    var h = document.querySelector('.xans-product-detail .headingArea h2, .xans-product-detail h1, .xans-product-detail h2');
    if (h && h.textContent && cl(h.textContent)) return cl(h.textContent);
    var og = document.querySelector('meta[property="og:title"]');
    if (og && og.content) return cl(og.content.replace(/\s*-\s*LEIDU.*$/i, ''));
    return cl(document.title || '');
  }

  function findExistingLiveVideoElement() {
    var selectors = [
      '#prdDetail iframe[src*="youtube.com"]',
      '#prdDetail iframe[src*="youtu.be"]',
      '#prdDetail iframe[src*="youtube-nocookie.com"]',
      '#prdDetail video'
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el) return el;
    }
    return null;
  }

  function fetchWithFallback(urls, initFactory) {
    var i = 0;
    function attempt() {
      if (i >= urls.length) return Promise.reject(new Error('live_req_failed'));
      var u = urls[i++];
      var spec = initFactory(u);
      return fetch(spec.url, spec.init).then(function (r) {
        if (!r.ok) throw new Error('http_' + r.status);
        return r.json();
      }).catch(function () { return attempt(); });
    }
    return attempt();
  }

  function mountPdpLiveTryonCard() {
    var pno = detectProductNo();
    if (!pno) return;
    var infoArea = document.querySelector('.xans-product-detail .infoArea');
    if (!infoArea) return;
    if (document.getElementById('leidu-live-tryon-card')) return;

    injectStyle();
    var card = document.createElement('div');
    card.id = 'leidu-live-tryon-card';

    var anchor = infoArea.querySelector('.leidu-express-payments') || infoArea.querySelector('#leidu-express-pay-notice') || infoArea.querySelector('.fixedActionButton');
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(card, anchor.nextSibling);
    } else {
      infoArea.appendChild(card);
    }

    var videoEl = findExistingLiveVideoElement();
    if (videoEl) {
      card.innerHTML =
        '<div class="lltr-eyebrow"><span>LIVE FIT ARCHIVE</span><span class="lltr-badge">提供實穿影片</span></div>' +
        '<p class="lltr-desc">✓ 您可於下方商品詳情直接觀看真實直播穿搭影片。</p>' +
        '<button type="button" class="lltr-btn is-has-video" data-lltr-scroll="1">🎥 立即觀看實穿直播影片 ↓</button>';
      card.querySelector('[data-lltr-scroll]').addEventListener('click', function () {
        var v = findExistingLiveVideoElement();
        if (v) v.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }

    var voterKey = getOrCreateVoterKey();
    var localVotedKey = VOTED_PRODUCT_KEY_PREFIX + String(pno);
    var alreadyVotedLocal = false;
    try { alreadyVotedLocal = localStorage.getItem(localVotedKey) === '1'; } catch (e) {}
    var state = { voted: alreadyVotedLocal };

    function renderVoteState() {
      if (state.voted) {
        var pushRow = !isPushSubscribed()
          ? '<div class="lltr-push-nudge">' +
              '<span>🔔 要開啟每週二直播開播免費通知嗎？</span>' +
              '<button type="button" class="lltr-push-btn" data-lltr-push="1">開啟免費通知 →</button>' +
            '</div>'
          : '';
        card.innerHTML =
          '<div class="lltr-eyebrow"><span>TUESDAY LIVE TRY-ON</span><span class="lltr-badge">已收到實穿申請</span></div>' +
          '<button type="button" class="lltr-btn is-voted" disabled>' +
            '✓ 已登記直播實穿申請 · 將於週二直播優先為您展示' +
          '</button>' +
          pushRow;
        var pb = card.querySelector('[data-lltr-push]');
        if (pb) pb.addEventListener('click', triggerPushPrompt);
      } else {
        card.innerHTML =
          '<div class="lltr-eyebrow"><span>TUESDAY LIVE TRY-ON</span><span class="lltr-badge">每週二首爾實穿直播</span></div>' +
          '<p class="lltr-desc">想確認實際版型與長度嗎？歡迎點選申請，我們將於每週二直播中親自為您試穿展示。</p>' +
          '<button type="button" class="lltr-btn" data-lltr-vote="1">' +
            '🎥 申請直播實穿展示 (+1)' +
          '</button>';
        var vb = card.querySelector('[data-lltr-vote]');
        if (vb) {
          vb.addEventListener('click', function () {
            if (state.voted) return;
            /* 0ms Optimistic UI transition + localStorage flag */
            state.voted = true;
            try { localStorage.setItem(localVotedKey, '1'); } catch (e) {}
            renderVoteState();
            /* Asynchronous background POST to central ledger */
            fetchWithFallback(LIVE_VOTE_ENDPOINTS, function (u) {
              return {
                url: u,
                init: {
                  method: 'POST',
                  mode: 'cors',
                  keepalive: true,
                  headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                  body: JSON.stringify({
                    product_no: pno,
                    product_name: detectProductName(),
                    voter_key: getOrCreateVoterKey(),
                    member_id: detectMemberId()
                  })
                }
              };
            }).catch(function () {});
          });
        }
      }
    }

    renderVoteState();

    if (!state.voted) {
      var qs = '?product_no=' + encodeURIComponent(String(pno)) + '&voter_key=' + encodeURIComponent(voterKey);
      var mid = detectMemberId();
      if (mid) qs += '&member_id=' + encodeURIComponent(mid);
      fetchWithFallback(LIVE_STATUS_ENDPOINTS, function (u) {
        return { url: u + qs, init: { method: 'GET', mode: 'cors' } };
      }).then(function (res) {
        if (res && res.ok && res.voted && !state.voted) {
          state.voted = true;
          try { localStorage.setItem(localVotedKey, '1'); } catch (e) {}
          renderVoteState();
        }
      }).catch(function () {});
    }
  }

  mountPdpLiveTryonCard();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountPdpLiveTryonCard);
  }
  window.addEventListener('load', mountPdpLiveTryonCard);
})();

/* LEIDU Official Mall Member Checkout Guard & Guest Conversion Bar v1 (WL-79, 2026-11-17) */
(function () {
  'use strict';

  var WL79_CSS = 'html.leidu-is-member .leidu-express-payments,html.leidu-is-member #leidu-express-pay-notice,html.leidu-is-member #NaverChk_Button,html.leidu-is-member #NPAY_BUTTON_BOX_ID,html.leidu-is-member .npay_storebtn_bx,html.leidu-is-member .npay_button_box,html.leidu-is-member #appPaymentButtonBox,html.leidu-is-member #kakao-checkout-button,html.leidu-is-member [id^="NC_ID_"]{display:none!important;visibility:hidden!important;height:0!important;margin:0!important;padding:0!important;overflow:hidden!important}html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton{display:flex!important;flex-wrap:wrap!important;gap:8px!important;width:100%!important}html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton .btn_buy{order:-1!important;flex:1 1 100%!important;width:100%!important;max-width:none!important;min-height:50px!important;height:auto!important;padding:13px 16px!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:6px!important;white-space:nowrap!important;background:#1F1915!important;border:1px solid #1F1915!important;color:#FAF7F2!important;font-size:14.5px!important;font-weight:800!important;letter-spacing:-0.02em!important;line-height:1.2!important;border-radius:3px!important;text-decoration:none!important;box-sizing:border-box!important;margin:0!important}html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton .btn_buy span.leidu-buy-main{color:#FAF7F2!important;font-weight:800!important;white-space:nowrap!important}html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton .btn_buy span.leidu-buy-sub{color:#F5DCB4!important;font-weight:700!important;font-size:13px!important;white-space:nowrap!important}html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton .btn_cart,html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton .leidu-inquiry-button{flex:1 1 calc(50% - 4px)!important;max-width:none!important;margin:0!important;min-height:44px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important}html body .leidu-guest-join-nudge{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;width:100%!important;margin:10px 0 8px!important;padding:11px 14px!important;background:linear-gradient(90deg,#1F1813 0%,#33271D 100%)!important;border:1px solid #D9BC90!important;border-radius:4px!important;color:#FAF7F2!important;text-decoration:none!important;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard",sans-serif!important;font-size:12.5px!important;line-height:1.42!important;word-break:keep-all!important;box-sizing:border-box!important;box-shadow:0 6px 18px rgba(24,18,13,0.12)!important}html body #contents .leidu-guest-join-nudge .leidu-guest-join-copy,html body #leidu-wl79-pdp-guest-bar .leidu-guest-join-copy,html body #leidu-wl79-basket-guest-bar .leidu-guest-join-copy{color:#FAF7F2!important;font-size:12.5px!important;font-weight:500!important;line-height:1.42!important}html body #contents .leidu-guest-join-nudge .leidu-guest-join-copy strong,html body #leidu-wl79-pdp-guest-bar .leidu-guest-join-copy strong{color:#FFE2B0!important;font-weight:800!important}html body #contents .leidu-guest-join-nudge .leidu-guest-join-cta,html body #leidu-wl79-pdp-guest-bar .leidu-guest-join-cta,html body #leidu-wl79-basket-guest-bar .leidu-guest-join-cta{flex-shrink:0!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;padding:6px 11px!important;background:#FEE500!important;color:#191400!important;font-size:11.5px!important;font-weight:800!important;border-radius:3px!important;white-space:nowrap!important}html body .leidu-member-safe-bar{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;width:100%!important;margin:10px 0 8px!important;padding:10px 13px!important;background:#FAF6EE!important;border:1px solid #DECBA9!important;border-left:3.5px solid #241C16!important;border-radius:3px!important;color:#241C16!important;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard",sans-serif!important;font-size:12px!important;line-height:1.42!important;word-break:keep-all!important;box-sizing:border-box!important}html body .leidu-member-safe-bar span{color:#241C16!important}html body .leidu-member-safe-bar strong{color:#9E3822!important;font-weight:800!important}html body #contents .xans-order-basketpackage .xans-order-totalorder.displaynone,html body #orderFixItem.displaynone,html body #orderFixArea.displaynone{display:none!important}@media (min-width:768px){html body #orderFixArea,html body #contents .xans-order-basketpackage #orderFixArea{display:none!important}}html body #contents > .section.ec-base-help.xans-order-basketguide,html body #contents .xans-order-basketguide{max-width:1440px!important;width:100%!important;margin:72px auto 0!important;padding:0!important;box-sizing:border-box!important}html body #contents .xans-order-basketpackage #leidu-wl79-basket-guest-bar,html body #contents .xans-order-basketpackage #leidu-wl79-basket-member-bar{max-width:648px!important;width:100%!important;margin:16px 0 0 auto!important;box-sizing:border-box!important}html body #contents .xans-order-basketpackage #orderFixItem:not(.displaynone){max-width:648px!important;width:100%!important;margin:12px 0 0 auto!important;display:flex!important;flex-direction:column!important;gap:10px!important}html body #contents .xans-order-basketpackage .xans-order-empty{padding:84px 20px 76px!important;margin-top:20px!important;text-align:center!important;border-top:1px solid #DCDFE2!important;border-bottom:1px solid #DCDFE2!important}html body #contents .xans-order-basketpackage .xans-order-empty p{margin:0!important;font-size:14px!important;color:#333!important;letter-spacing:-0.01em!important}html body #leidu-empty-basket-cta{display:inline-flex!important;align-items:center!important;justify-content:center!important;margin-top:22px!important;min-width:210px!important;height:44px!important;padding:0 28px!important;background:#181512!important;border:1px solid #181512!important;border-radius:4px!important;color:#FAF7F2!important;font-size:12.5px!important;font-weight:600!important;letter-spacing:0.02em!important;text-decoration:none!important}.xans-order-totalorder a.leidu-basket-orderall-upgraded{background:#1F1915!important;border-color:#1F1915!important;color:#FAF7F2!important;font-weight:800!important}#leidu-orderform-member-card{margin:14px 0;padding:15px 16px;background:#FAF7F2;border:1.5px solid #241C16;border-radius:5px;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard",sans-serif;color:#211B16;box-sizing:border-box}#leidu-orderform-member-card .lomc-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #E3DACB;font-size:12px;font-weight:800;color:#241C16}#leidu-orderform-member-card .lomc-badge{padding:2px 8px;background:#241C16;color:#F5DCB4!important;font-size:10.5px;font-weight:800;letter-spacing:0.08em;border-radius:2px;white-space:nowrap}#leidu-orderform-member-card .lomc-row{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:5px 0;font-size:13px;color:#4E453C;white-space:nowrap}#leidu-orderform-member-card .lomc-row.is-disc{color:#A63D26;font-weight:800}#leidu-orderform-member-card .lomc-row.is-disc span{color:#A63D26!important;font-weight:800!important}#leidu-orderform-member-card .lomc-row.is-final{margin-top:9px;padding-top:9px;border-top:1px dashed #D8CBB8;font-size:15px;font-weight:800;color:#18130F}@media (max-width:767px){html body #contents .xans-order-basketpackage #leidu-wl79-basket-guest-bar,html body #contents .xans-order-basketpackage #leidu-wl79-basket-member-bar{max-width:100%!important;margin:12px 0 8px!important}html body #orderFixArea:not(.displaynone){left:0!important;right:0!important;bottom:0!important;width:100%!important;max-width:none!important;margin:0!important;padding:10px 14px calc(10px + env(safe-area-inset-bottom,0px))!important;background:rgba(255,255,255,0.98)!important;border-top:1px solid #E5E5E5!important;box-sizing:border-box!important;z-index:980!important}html body #orderFixArea .ec-base-button.gColumn{width:100%!important;margin:0!important;display:flex!important;gap:8px!important}html body #orderFixArea .ec-base-button.gColumn a{flex:1 1 50%!important;height:44px!important;min-height:44px!important;margin:0!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;font-size:12px!important;white-space:nowrap!important;padding:0 8px!important}html body .leidu-guest-join-nudge{flex-direction:column!important;align-items:stretch!important;gap:8px!important;padding:11px 12px!important}html body .leidu-guest-join-nudge .leidu-guest-join-cta{width:100%!important;padding:7px 10px!important;font-size:12px!important;box-sizing:border-box!important;max-width:100%!important}html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton .btn_buy{font-size:13.5px!important;padding:12px 10px!important}html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton .btn_buy span.leidu-buy-sub{font-size:12px!important}}'; 
  function injectWl79Style() {
    if (document.getElementById('leidu-wl79-checkout-guard-style')) return;
    var st = document.createElement('style');
    st.id = 'leidu-wl79-checkout-guard-style';
    st.textContent = WL79_CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  function detectLoginAndGrade() {
    var info=window.leiduGetMemberTierInfo();
    return {isLogged:info.isLogged,groupName:info.gradeName,rate:info.rate,sessionStale:info.sessionStale,sessionRate:info.sessionRate};
  }

  function buildLoginReturnHref() {
    var ret = location.pathname + location.search;
    return __leiduShopHref__('/member/login.html') + '?returnUrl=' + encodeURIComponent(ret);
  }

  function createGuestJoinBar(id) {
    var a = document.createElement('a');
    a.id = id;
    a.className = 'leidu-guest-join-nudge';
    a.href = buildLoginReturnHref();
    a.innerHTML =
      '<span class="leidu-guest-join-copy" style="color:#FAF7F2!important;">⚡ 免費註冊會員即享 <strong style="color:#FFE2B0!important;">分級專屬禮遇（5%~10% 折扣）</strong> · 任選 2 件順豐免運</span>' +
      '<span class="leidu-guest-join-cta" style="color:#191400!important;">免費註冊／登入 →</span>';
    return a;
  }

  function applyPdpAndBasketGuard() {
    injectWl79Style();
    var info = detectLoginAndGrade();
    window.leiduRefreshMembershipState();
    var root = document.documentElement;
    if (info.isLogged) {
      root.classList.add('leidu-is-member');
      root.classList.remove('leidu-is-guest');
    } else {
      root.classList.remove('leidu-is-member');
      root.classList.add('leidu-is-guest');
    }

    var rateText = info.rate ? (info.rate + '%') : '5~10%';
    var tierLabel = info.groupName ? ('[' + info.groupName + '] ' + rateText) : ('會員 ' + rateText);

    /* A. Product Detail Page (product/detail.html) */
    var pdpAction = document.querySelector('.xans-product-detail .xans-product-action.fixedActionButton');
    if (pdpAction) {
      var oldGuestBar = document.getElementById('leidu-wl79-pdp-guest-bar');
      var oldMemberBar = document.getElementById('leidu-wl79-pdp-member-bar');
      var buyBtn = pdpAction.querySelector('.btn_buy, a[onclick*="product_submit(1"]');

      if (info.isLogged) {
        if (oldGuestBar) oldGuestBar.remove();
        if (buyBtn && buyBtn.dataset.wl79Upgraded !== 'member') {
          buyBtn.dataset.wl79Upgraded = 'member';
          buyBtn.innerHTML = '<span class="leidu-buy-main">立即購買</span><span class="leidu-buy-sub">(自動套用會員 5~10% 折扣)</span>';
        }
        /* Also update mobile sticky bottom buy button if present */
        document.querySelectorAll('#orderFixArea a.btnSubmit[onclick*="product_submit(1"]').forEach(function (mb) {
          if (mb.dataset.wl79Upgraded !== 'member') {
            mb.dataset.wl79Upgraded = 'member';
            mb.textContent = '立即購買 (套用會員折扣)';
          }
        });
        if (!oldMemberBar && pdpAction.parentNode) {
          var mbar = document.createElement('div');
          mbar.id = 'leidu-wl79-pdp-member-bar';
          mbar.className = 'leidu-member-safe-bar';
          mbar.innerHTML =
            '<span>✓ 已啟用 <strong>' + tierLabel + ' 無上限自動折抵</strong> · 點選 <strong>[立即購買 / 加入購物車]</strong> 於結帳頁自動折抵 (滿 NT$1,000)</span>';
          pdpAction.parentNode.insertBefore(mbar, pdpAction);
        }
      } else {
        if (oldMemberBar) oldMemberBar.remove();
        if (!oldGuestBar && pdpAction.parentNode) {
          pdpAction.parentNode.insertBefore(createGuestJoinBar('leidu-wl79-pdp-guest-bar'), pdpAction);
        }
      }
    }

    /* B. Basket Page (order/basket.html) */
    var basketPkg = document.querySelector('.xans-order-basketpackage');
    var basketOrderBoxes = document.querySelectorAll('.xans-order-totalorder');
    if (basketPkg || basketOrderBoxes.length > 0) {
      var firstBox = document.getElementById('orderFixItem') || basketOrderBoxes[0];
      var bGuest = document.getElementById('leidu-wl79-basket-guest-bar');
      var bMember = document.getElementById('leidu-wl79-basket-member-bar');
      var emptyBox = basketPkg ? basketPkg.querySelector('.xans-order-empty') : document.querySelector('.xans-order-empty');
      var hasCartRows = !!(basketPkg && basketPkg.querySelector('.orderListArea tbody tr'));
      var isBasketEmpty = !hasCartRows && !!(
        (emptyBox && window.getComputedStyle(emptyBox).display !== 'none') ||
        (firstBox && firstBox.classList.contains('displaynone'))
      );
      var emptyCta = document.getElementById('leidu-empty-basket-cta');

      if (isBasketEmpty) {
        if (bGuest) bGuest.remove();
        if (bMember) bMember.remove();
        if (emptyBox && !emptyCta) {
          var cta = document.createElement('a');
          cta.id = 'leidu-empty-basket-cta';
          cta.href = __leiduShopHref__('/');
          cta.textContent = '繼續選購商品';
          emptyBox.appendChild(cta);
        }
      } else {
        if (emptyCta) emptyCta.remove();
        if (info.isLogged) {
          if (bGuest) bGuest.remove();
          basketOrderBoxes.forEach(function (box) {
            box.querySelectorAll('a[onclick*="Basket.orderAll"]').forEach(function (btn) {
              btn.classList.add('leidu-basket-orderall-upgraded');
              if (btn.dataset.wl79Upgraded !== 'member') {
                btn.dataset.wl79Upgraded = 'member';
                btn.textContent = box.id === 'orderFixArea' ? '全部結帳 (會員優惠)' : '前往結帳 (自動套用會員 5~10% 折扣)';
              }
            });
          });
          if (!bMember && firstBox && firstBox.parentNode) {
            var bm = document.createElement('div');
            bm.id = 'leidu-wl79-basket-member-bar';
            bm.className = 'leidu-member-safe-bar';
            bm.innerHTML =
              '<span>✓ <strong>' + tierLabel + ' 會員折扣</strong>將於點選下方結帳按鈕後，在訂單結帳頁自動折抵 (滿 NT$1,000)</span>';
            firstBox.parentNode.insertBefore(bm, firstBox);
          }
        } else {
          if (bMember) bMember.remove();
          if (!bGuest && firstBox && firstBox.parentNode) {
            firstBox.parentNode.insertBefore(createGuestJoinBar('leidu-wl79-basket-guest-bar'), firstBox);
          }
        }
      }
    }

    /* C. Orderform Page (/order/orderform.html) live discount summary card */
    if (location.pathname.indexOf('/order/orderform.html') !== -1 && info.isLogged) {
      renderOrderformMemberCard(info);
    }
  }

  function parseKrw(text) {
    if (!text) return 0;
    var n = parseInt(String(text).replace(/[^0-9]/g, ''), 10);
    return isNaN(n) ? 0 : n;
  }

  function formatKrw(n) {
    return 'NT$' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function renderOrderformMemberCard(info) {
    var baseEl = document.getElementById('total_product_base_price_id');
    var shipEl = document.getElementById('total_ship_price_id');
    var finalEl = document.getElementById('payment_total_order_sale_price_view') || document.getElementById('total_order_sale_price_view');
    var groupDcInput = document.getElementById('total_group_dc');
    var saleViewEl = document.getElementById('payment_total_sale_price_view') || document.getElementById('discount_total_sale_price_view');
    if (!baseEl || !finalEl) return;

    var baseAmt = parseKrw(baseEl.textContent);
    if (baseAmt <= 0) return;
    var shipAmt = shipEl ? parseKrw(shipEl.textContent) : 0;
    var finalAmt = parseKrw(finalEl.textContent);
    var discAmt = groupDcInput ? parseKrw(groupDcInput.value) : parseKrw(saleViewEl && saleViewEl.textContent);
    if (!discAmt && baseAmt + shipAmt > finalAmt) {
      discAmt = (baseAmt + shipAmt) - finalAmt;
    }

    var card = document.getElementById('leidu-orderform-member-card');
    if (!card) {
      card = document.createElement('div');
      card.id = 'leidu-orderform-member-card';
      var targetAnchor = document.getElementById('ec-jigsaw-area-payment') || document.getElementById('ec-jigsaw-area-benefit') || finalEl.closest('.totalPay, .ec-base-table, div');
      if (targetAnchor && targetAnchor.parentNode) {
        targetAnchor.parentNode.insertBefore(card, targetAnchor);
      } else {
        document.body.appendChild(card);
      }
    }

    var gBadge = info.groupName || 'MEMBER';
    var pct = (discAmt > 0 && baseAmt > 0) ? Math.round((discAmt / baseAmt) * 100) : (info.rate || 5);
    var discLine = discAmt > 0
      ? ('-' + formatKrw(discAmt) + ' (-' + pct + '%)')
      : (baseAmt < 1000 ? 'NT$0 (滿 NT$1,000 適用)' : 'NT$0');

    card.innerHTML =
      '<div class="lomc-head"><span>LEIDU 官方旗艦店 會員優惠明細</span><span class="lomc-badge">' + gBadge + '</span></div>' +
      '<div class="lomc-row"><span>商品小計</span><span>' + formatKrw(baseAmt) + '</span></div>' +
      '<div class="lomc-row is-disc"><span>會員等級自動折抵</span><span>' + discLine + '</span></div>' +
      '<div class="lomc-row"><span>國際順豐運費</span><span>' + (shipAmt === 0 ? 'NT$0 (免運)' : formatKrw(shipAmt)) + '</span></div>' +
      '<div class="lomc-row is-final"><span>預計結帳總金額</span><span>' + formatKrw(finalAmt) + '</span></div>';
  }

  window.addEventListener('leidu:membership-linked', applyPdpAndBasketGuard);
  applyPdpAndBasketGuard();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPdpAndBasketGuard);
  }
  window.addEventListener('load', function () {
    applyPdpAndBasketGuard();
    setTimeout(applyPdpAndBasketGuard, 400);
    setTimeout(applyPdpAndBasketGuard, 1200);
  });
})();


/* WL-143 mobile geometry + WL-137 all-page native ownmall-chat + WL-144 card default, 2026-11-18 */
(function () {
  'use strict';
  if (window.__leiduWl143Wl137) return;
  window.__leiduWl143Wl137 = true;
  var path = location.pathname;
  var checkout = /\/order\/orderform\.html$/.test(path);
  document.documentElement.classList.toggle('leidu-is-checkout', checkout);
  document.documentElement.classList.toggle('leidu-is-login', /\/member\/login\.html$/.test(path));
  var st = document.createElement('style'); st.id = 'leidu-wl143-wl137-style';
  st.textContent = "\nhtml body .leidu-guest-join-nudge,html body .leidu-guest-join-nudge *,html body .leidu-guest-join-cta{box-sizing:border-box!important;max-width:100%!important}\nhtml body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton > .gColumn{width:100%!important;flex:1 1 100%!important;display:grid!important;grid-template-columns:122px minmax(0,1fr)!important;gap:8px!important;box-sizing:border-box!important;margin:0!important}\nhtml body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton > .gColumn button.leidu-inquiry-button:not(.displaynone){grid-column:1!important;grid-row:1!important;width:100%!important;height:50px!important;min-height:50px!important;padding:0 12px!important;box-sizing:border-box!important;background:#FEE500!important;border:1px solid #E5CE00!important;border-radius:8px!important;color:#191919!important;font-size:13.5px!important;font-weight:700!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;cursor:pointer!important}\nhtml body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton > .gColumn a.btn_buy:not(.displaynone){grid-column:2!important;grid-row:1!important;width:100%!important;height:50px!important;min-height:50px!important;border-radius:8px!important;margin:0!important;box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:5px!important}\nhtml body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton > .gColumn a.btn_cart:not(.displaynone){grid-column:1/-1!important;grid-row:2!important;justify-self:center!important}\nhtml body #leidu-pwa-chip,html body #leidu-pwa-chip .lpwa-chip-btn,html body #leidu-pwa-chip .lpwa-chip-btn span,html body #leidu-pwa-chip .lpwa-chip-close{color:#FAF7F2!important}\nhtml.leidu-is-checkout #leidu-pwa-chip,html.leidu-is-login #leidu-pwa-chip{display:none!important}\nhtml body #leidu-floating-chat-btn{position:fixed;right:14px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:9891;height:44px;padding:0 15px;border-radius:999px;background:#FEE500!important;border:1px solid #E5CE00!important;color:#191919!important;font-weight:800!important;font-size:13px!important;box-shadow:0 8px 22px rgba(0,0,0,0.22);display:inline-flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,\"Apple SD Gothic Neo\",\"Pretendard\",sans-serif;box-sizing:border-box!important;width:auto!important;max-width:none!important}\nhtml body:has(dialog#leidu-messenger[open]) #leidu-floating-chat-btn{display:none!important}\n@media(max-width:767px){html body #leidu-pwa-chip{left:12px!important;max-width:calc(100vw - 108px)!important}html.leidu-has-sticky-buy body #leidu-pwa-chip,html.leidu-has-sticky-buy body #leidu-floating-chat-btn{bottom:calc(max(76px,var(--leidu-sticky-buy-clearance,76px)) + env(safe-area-inset-bottom,0px))!important}}\n"; (document.head || document.documentElement).appendChild(st);
  var icon = "<svg viewBox=\"0 0 20 20\" width=\"17\" height=\"17\" aria-hidden=\"true\" style=\"flex:none;display:block\"><path fill=\"#191919\" d=\"M10 2.4c-4.75 0-8.6 3.04-8.6 6.8 0 2.38 1.55 4.48 3.9 5.69-.15.86-.56 2.13-.96 2.75-.13.2.05.45.28.38 1.14-.34 2.68-1.15 3.66-1.9.57.08 1.14.12 1.72.12 4.75 0 8.6-3.04 8.6-6.8S14.75 2.4 10 2.4Z\"/></svg>";
  function start() {
    document.querySelectorAll('.xans-product-detail button.leidu-inquiry-button').forEach(function (b) {
      if (b.dataset.wl137Icon === '1') return;
      var old = b.querySelector('svg');
      if (old) old.outerHTML = icon; else b.insertAdjacentHTML('afterbegin', icon);
      b.dataset.wl137Icon = '1';
    });
    if (checkout) return;
    var existing = document.getElementById('leidu-messenger'), wasOpen = !!(existing && existing.open);
    if (existing && existing.dataset.wl137Owned === '1') return;
    if (existing) { existing.remove(); document.querySelectorAll('.xans-product-detail .leidu-inquiry-button').forEach(function (b) { var nb = b.cloneNode(true); nb.dataset.wl137Icon = '1'; b.replaceWith(nb); }); }
    document.body.insertAdjacentHTML('beforeend', "<!-- LEIDU OWN-MALL CUSTOMER CHAT: central Hub originals; existing native buy actions preserved. -->\n<dialog id=\"leidu-messenger\" aria-labelledby=\"leidu-messenger-title\">\n  <header class=\"leidu-messenger-header\"><div><h2 id=\"leidu-messenger-title\">LEIDU 線上客服</h2><p>尺寸 · 順豐直郵 · 訂單諮詢（支援繁體中文）</p></div><button type=\"button\" class=\"leidu-messenger-close\" aria-label=\"關閉客服視窗\">×</button></header>\n  <section class=\"leidu-messenger-context\" aria-label=\"諮詢商品\"><span>諮詢商品</span><strong></strong><p><a target=\"_blank\" rel=\"noopener\"></a></p></section>\n  <button type=\"button\" class=\"leidu-messenger-older\" hidden>查看先前對話</button>\n  <div class=\"leidu-messenger-messages\" role=\"log\" aria-live=\"polite\"><p class=\"leidu-messenger-welcome\">您好！有任何尺寸、材質或順豐寄送問題，歡迎直接留言詢問。</p></div>\n  <button type=\"button\" class=\"leidu-messenger-latest\" hidden>最新訊息 ↓</button>\n  <section class=\"leidu-messenger-pending\" hidden aria-label=\"傳送確認中的訊息\"><p></p><button type=\"button\">重新傳送訊息</button></section>\n  <form class=\"leidu-messenger-compose\"><label class=\"leidu-messenger-label\" for=\"leidu-messenger-input\">諮詢內容</label><textarea id=\"leidu-messenger-input\" placeholder=\"請輸入您想詢問的內容（繁體中文／English）\" rows=\"2\" maxlength=\"4000\"></textarea><button type=\"submit\" disabled>傳送</button><p class=\"leidu-messenger-status\" aria-live=\"polite\"></p></form>\n</dialog>\n<style>\n#leidu-messenger{position:fixed;inset:auto 24px 24px auto;margin:0;padding:0;width:380px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100dvh - 48px);border:1px solid #ddd;border-radius:16px;background:#fff;color:#222;box-shadow:0 12px 48px #0002;font-family:inherit;box-sizing:border-box;overflow:hidden}\n#leidu-messenger[open]{display:flex;flex-direction:column}#leidu-messenger::backdrop{background:#0002}\n#leidu-messenger .leidu-messenger-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:22px 20px 18px;border-bottom:1px solid #eee}\n#leidu-messenger h2{margin:0;font-family:inherit;font-size:18px;line-height:1.4;font-weight:600}#leidu-messenger .leidu-messenger-header p{margin:4px 0 0;color:#777;font-size:12px;line-height:1.5}\n#leidu-messenger button{font-family:inherit;cursor:pointer}#leidu-messenger .leidu-messenger-close{display:grid;place-items:center;width:32px;height:32px;border:0;background:transparent;color:#222;font-size:26px;line-height:1}\n#leidu-messenger .leidu-messenger-context{margin:16px 20px 0;padding:14px;border:1px solid #e6e6e6;border-radius:10px}#leidu-messenger .leidu-messenger-context span{display:block;margin-bottom:5px;color:#777;font-size:11px}#leidu-messenger .leidu-messenger-context strong{font-size:13px;line-height:1.6;font-weight:500}#leidu-messenger .leidu-messenger-context p{margin:4px 0 0;color:#777;font-size:12px;line-height:1.5}\n#leidu-messenger .leidu-messenger-messages{flex:1;min-height:0;padding:20px;overflow-y:auto;overscroll-behavior:contain}#leidu-messenger .leidu-messenger-welcome{display:inline-block;max-width:85%;margin:0;padding:12px 14px;border-radius:0 12px 12px;background:#f5f5f5;color:#444;font-size:13px;line-height:1.7}\n#leidu-messenger .leidu-messenger-compose{display:grid;grid-template-columns:minmax(0,1fr) 62px;gap:8px;margin:0;padding:16px 20px calc(16px + env(safe-area-inset-bottom));border-top:1px solid #eee}#leidu-messenger textarea{width:100%;min-width:0;margin:0;padding:10px 12px;resize:none;border:1px solid #ddd;border-radius:8px;background:#fff;color:#222;font-family:inherit;font-size:13px;line-height:1.6;box-sizing:border-box}#leidu-messenger .leidu-messenger-compose>button{align-self:stretch;padding:0;border:0;border-radius:8px;background:#222;color:#fff;font-size:12px}#leidu-messenger .leidu-messenger-compose>button:disabled{opacity:.35;cursor:default}#leidu-messenger .leidu-messenger-status{grid-column:1/-1;margin:0;color:#777;font-size:11px;line-height:1.5}#leidu-messenger .leidu-messenger-label{position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden;white-space:nowrap}\n@media(max-width:767px){#leidu-messenger{inset:auto 0 0;width:100%;max-width:100%;height:78dvh;max-height:calc(100dvh - 24px);border-width:1px 0 0;border-radius:16px 16px 0 0}#leidu-messenger .leidu-messenger-header{padding:18px 20px 16px}#leidu-messenger textarea{font-size:16px}}\n\n#leidu-messenger .leidu-messenger-message{max-width:86%;width:fit-content;margin:0 0 14px;padding:10px 13px;border-radius:12px;background:#f4f4f4;word-break:break-word}\n#leidu-messenger .leidu-messenger-message.customer{margin-left:auto;background:#222;color:#fff}\n#leidu-messenger .leidu-messenger-message p{color:inherit;margin:0;white-space:pre-wrap;font-size:13px;line-height:1.7}\n#leidu-messenger .leidu-messenger-message small{display:block;margin-top:5px;font-size:10px;opacity:.7}\n#leidu-messenger .leidu-messenger-message a{display:block;margin-bottom:6px;color:inherit;font-size:11px;text-decoration:underline}\n#leidu-messenger .leidu-messenger-pending{padding:10px 20px;border-top:1px solid #eee;background:#fff8eb}\n#leidu-messenger .leidu-messenger-pending[hidden],#leidu-messenger .leidu-messenger-older[hidden]{display:none}\n#leidu-messenger .leidu-messenger-pending p{max-height:66px;overflow:auto;white-space:pre-wrap;word-break:break-word;margin:0 0 6px;font-size:12px}\n#leidu-messenger .leidu-messenger-pending button,#leidu-messenger .leidu-messenger-older{border:1px solid #ddd;border-radius:6px;padding:7px 12px;background:#fff;color:#333;font-size:11px}\n#leidu-messenger .leidu-messenger-older{align-self:center;margin:10px 0 0}\n#leidu-messenger .leidu-messenger-status{min-height:1.5em}\n#leidu-messenger .leidu-messenger-context a{font-size:11px;color:#666;text-decoration:underline}\n</style>\n");
    var dlg = document.getElementById('leidu-messenger'); if (dlg) dlg.dataset.wl137Owned = '1';
    var fab = document.getElementById('leidu-floating-chat-btn');
    if (!fab) {
      fab = document.createElement('button'); fab.type = 'button'; fab.id = 'leidu-floating-chat-btn';
      fab.className = 'leidu-inquiry-button';
      fab.setAttribute('aria-label', '開啟 LEIDU 線上客服'); fab.setAttribute('aria-haspopup', 'dialog');
      fab.setAttribute('aria-controls', 'leidu-messenger'); fab.setAttribute('aria-expanded', 'false');
      fab.innerHTML = icon + '<span>線上客服</span>'; document.body.appendChild(fab);
    }
    (function () {
  "use strict";
  const API = "https://webhook.leidu.co.kr/kakao-ai-skill/ownmall-chat";
  const SESSION_KEY = "leidu.ownmall.chat.v1";
  const PENDING_KEY = "leidu.ownmall.pending.v1";
  const DRAFT_KEY = "leidu.ownmall.draft.v1";
  function read(key) { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (_) { return null; } }
  function write(key, value) { try { value === null ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} }
  function randomToken() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return btoa(String.fromCharCode.apply(null, bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function messageId() {
    return crypto.randomUUID ? crypto.randomUUID() :
      Array.from(crypto.getRandomValues(new Uint8Array(16)), x => x.toString(16).padStart(2, "0")).join("");
  }
  function signedInMember() {
    const capp = window.CAPP_ASYNC_METHODS, m = capp?.member, id = window.leiduDetectMemberId?.() || "";
    let data = {};
    try { data = typeof m?.getData === "function" ? m.getData() || {} : m || {}; } catch (_) {}
    return {member_id:id, cellphone:id ? String(data.cellphone || m?.__sCellphone || "") : ""};
  }
  function pageContext() {
    const cl = window.leiduCleanTitle || (s => String(s || "").trim());
    const offered = new URLSearchParams(location.search).get("product_no") ||
      document.querySelector('input[name="product_no"]')?.value ||
      window.iProductNo || "{$product_no}";
    const productNo = /^\d{1,16}$/.test(String(offered)) && Number(offered) > 0 ? String(offered) : "";
    return { member_id: signedInMember().member_id, product_no: productNo,
      product_title: cl(String(document.querySelector(".xans-product-detail .headingArea h2, .headingArea h2")?.textContent || document.title)
        .replace(/\s*-\s*LEIDU\s*$/i, "")).slice(0, 500),
      page_path: location.pathname.slice(0, 500),
      product_url: productNo ? "https://tw.leidu.co.kr/product/detail.html?product_no=" + productNo : "" };
  }
  function sameContext(a, b) {
    return ["member_id", "product_no", "product_title", "page_path", "product_url"].every(k => String(a?.[k] || "") === String(b?.[k] || ""));
  }
  async function originLock(name, work) {
    return navigator.locks?.request ? navigator.locks.request(name, work) : work();
  }
  function start() {
    const dialog = document.getElementById("leidu-messenger");
    const triggers = document.querySelectorAll(".leidu-inquiry-button");
    if (!dialog || !triggers.length || dialog.dataset.connected === "true") return;
    dialog.dataset.connected = "true";
    const log = dialog.querySelector(".leidu-messenger-messages");
    const form = dialog.querySelector("form");
    const input = dialog.querySelector("textarea");
    const send = form.querySelector('button[type="submit"]');
    const status = dialog.querySelector(".leidu-messenger-status");
    const pendingBox = dialog.querySelector(".leidu-messenger-pending");
    const retry = pendingBox.querySelector("button");
    const olderButton = dialog.querySelector(".leidu-messenger-older");
    const latestButton = dialog.querySelector(".leidu-messenger-latest");
    let followingLatest = true;
    function jumpLatest() {
      latestButton.hidden = true; followingLatest = true;
      log.scrollTop = log.scrollHeight;
    }
    log.addEventListener("scroll", function () {
      followingLatest = log.scrollHeight - log.scrollTop - log.clientHeight < 60;
      latestButton.hidden = followingLatest;
    }, { passive: true });
    latestButton.addEventListener("click", jumpLatest);
    if (typeof ResizeObserver !== "undefined") new ResizeObserver(function () {
      if (dialog.open && followingLatest) jumpLatest();
    }).observe(log);
    let session = read(SESSION_KEY), pending = read(PENDING_KEY), draft = read(DRAFT_KEY);
    let timer = 0, ready = false, connecting = null, polling = false, sending = false;
    let cursor = null, beforeCursor = "", hasOlder = false, previousFocus = null;
    const messages = new Map();
    if (draft && typeof draft.text === "string") input.value = draft.text;
    function say(text) { if (status.textContent !== text) status.textContent = text; }
    function currentSession() {
      const saved = read(SESSION_KEY);
      if (saved?.session_token && (!pending || saved.room_id === pending.room_id || !saved.room_id)) session = saved;
      return session;
    }
    async function ensureMemberId() {
      let id = window.leiduDetectMemberId?.() || "";
      const c = window.CAPP_ASYNC_METHODS, on = !!document.querySelector(".xans-layout-statelogon");
      if (id || c?.IS_LOGIN === false || (!c?.IS_LOGIN && !on && !/\biscache=F\b/.test(document.cookie))) return id;
      try { if (c?.member?.cacheReady) await Promise.race([Promise.resolve(c.member.cacheReady()), new Promise(r => setTimeout(r, 1000))]); } catch (_) {}
      if ((id = window.leiduDetectMemberId?.() || "")) return id;
      if (window.CAFE24API?.getMemberID) {
        id = await new Promise(r => { const t = setTimeout(() => r(""), 700); try { window.CAFE24API.getMemberID((e, v) => { clearTimeout(t); r(String((typeof e === "string" ? e : (v?.id?.member_id || v?.member_id || e?.id?.member_id)) || "").trim()); }); } catch (_) { clearTimeout(t); r(""); } });
        if (id && !id.includes("{$")) { try { sessionStorage.setItem("leidu_synced_mid_v1", id); } catch (_) {} return id; }
      }
      for (let i = 0; i < 6 && !(id = window.leiduDetectMemberId?.() || ""); i++) await new Promise(r => setTimeout(r, 120));
      return id;
    }
    function contextCard() {
      const value = draft?.text ? draft.context : pageContext(), cl = window.leiduCleanTitle || (s => String(s || "").trim()), link = dialog.querySelector(".leidu-messenger-context a");
      dialog.querySelector(".leidu-messenger-context strong").textContent = cl(value?.product_title) || "一般諮詢";
      link.hidden = !value?.product_url;
      if (value?.product_no && /^\d+$/.test(String(value.product_no))) { link.href = __leiduShopHref__("/product/detail.html?product_no=" + value.product_no); link.textContent = draft?.text ? "編輯中的諮詢商品" : "查看商品"; }
    }
    function controls() {
      pendingBox.hidden = !pending;
      if (pending) pendingBox.querySelector("p").textContent = pending.text;
      retry.disabled = sending || !ready;
      send.disabled = !!pending || sending || !input.value.trim();
      olderButton.hidden = !hasOlder;
      olderButton.disabled = polling;
      contextCard();
    }
    function clearPending(message) {
      if (!pending || message.role !== "customer" || message.client_id !== pending.client_id ||
          message.text !== pending.text || !sameContext(message.context, pending.context)) return;
      const confirmed = pending;
      void originLock(PENDING_KEY, function () {
        const stored = read(PENDING_KEY);
        if (stored?.client_id === confirmed.client_id) write(PENDING_KEY, null);
        if (pending?.client_id === confirmed.client_id) {
          pending = stored && stored.client_id !== confirmed.client_id ? stored : null;
        }
      }).then(function () {
        if (!pending) say("訊息已送出。");
        controls();
      });
    }
    function draw(keepScroll) {
      const top = log.scrollTop, height = log.scrollHeight;
      const atBottom = height - top - log.clientHeight < 60;
      const fragment = document.createDocumentFragment();
      const rows = Array.from(messages.values()).sort((a, b) => {
        const left = BigInt(a.id), right = BigInt(b.id);
        return left < right ? -1 : left > right ? 1 : 0;
      });
      if (!rows.length) {
        const welcome = document.createElement("p");
        welcome.className = "leidu-messenger-welcome";
        welcome.textContent = "您好！有任何尺寸、材質或順豐寄送問題，歡迎直接留言詢問。";
        fragment.append(welcome);
      }
      for (const row of rows) {
        const bubble = document.createElement("div");
        bubble.className = "leidu-messenger-message " + (row.role === "agent" ? "agent" : "customer");
        if (row.context?.product_no && /^\d+$/.test(String(row.context.product_no))) {
          const product = document.createElement("a");
          product.href = __leiduShopHref__("/product/detail.html?product_no=" + row.context.product_no);
          product.target = "_blank"; product.rel = "noopener";
          product.textContent = row.context.product_title || ("商品 #" + row.context.product_no);
          bubble.append(product);
        }
        const text = document.createElement("p");
        text.textContent = row.text;
        const time = document.createElement("small");
        const date = new Date(row.created_at);
        time.textContent = (row.role === "agent" ? "LEIDU 客服專員 · " : "") +
          (Number.isNaN(date.getTime()) ? "" : date.toLocaleString("zh-TW", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }));
        bubble.append(text, time); fragment.append(bubble);
      }
      log.replaceChildren(fragment);
      controls();
      if (keepScroll === "older") {
        log.scrollTop = top + log.scrollHeight - height;
        followingLatest = false; latestButton.hidden = false;
      } else if (atBottom || keepScroll === "initial" || keepScroll === "latest") jumpLatest();
      else { log.scrollTop = top; followingLatest = false; latestButton.hidden = false; }
    }
    function accept(rows, mode) {
      let changed = false;
      for (const row of rows || []) {
        if (!/^\d+$/.test(String(row.id)) || !["customer", "agent"].includes(row.role)) continue;
        if (!messages.has(String(row.id))) changed = true;
        messages.set(String(row.id), row);
        clearPending(row);
      }
      if (changed || !messages.size || mode === "latest") draw(mode); else controls();
    }
    async function api(path, options) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      try {
        const headers = { Authorization: "Bearer " + String(session?.session_token || "") };
        const request = { method: options?.method || "GET", credentials: "omit", cache: "no-store",
          headers, signal: controller.signal };
        if (options?.body) {
          headers["Content-Type"] = "application/json";
          request.body = JSON.stringify(options.body);
        }
        const response = await fetch(API + path, request);
        const data = await response.json();
        if (!response.ok || !data.ok) {
          const error = new Error(data.error || "請確認網路連線後再試一次");
          error.status = response.status;
          throw error;
        }
        return data;
      } finally { clearTimeout(timeout); }
    }
    async function ensureSession() {
      if (ready && session?.room_id) return session;
      if (connecting) return connecting;
      connecting = (async function () {
        await originLock(SESSION_KEY, function () {
          currentSession();
          if (!session?.session_token) {
            session = { room_id: "", session_token: randomToken() };
            write(SESSION_KEY, session);
          }
        });
        await ensureMemberId();
        let data;
        const offeredToken = session.session_token;
        try {
          data = await api("/session", { method: "POST", body: {
            room_id: session.room_id || "", context: pageContext() } });
        } catch (error) {
          pending = read(PENDING_KEY) || pending;
          if (error.status !== 401 || pending) throw error;
          await originLock(SESSION_KEY, function () {
            const saved = read(SESSION_KEY);
            session = saved?.session_token && saved.session_token !== offeredToken ? saved :
              { room_id: "", session_token: randomToken() };
            write(SESSION_KEY, session);
          });
          messages.clear(); cursor = null; beforeCursor = ""; hasOlder = false;
          data = await api("/session", { method: "POST", body: {
            room_id: session.room_id || "", context: pageContext() } });
        }
        if (session.room_id && session.room_id !== data.room_id) {
          messages.clear(); cursor = null; beforeCursor = ""; hasOlder = false;
        }
        session = { room_id: data.room_id, session_token: data.session_token, expires_at: data.expires_at };
        write(SESSION_KEY, session);
        ready = true; controls();
        return session;
      })();
      try { return await connecting; }
      finally { connecting = null; }
    }
    function visible() { return dialog.open && document.visibilityState !== "hidden"; }
    function schedule(delay) {
      clearTimeout(timer);
      if (visible() && ready) timer = setTimeout(function () {
        timer = 0; void poll(false);
      }, delay || 2000);
    }
    async function poll(older) {
      if (!visible() || polling || !ready) return;
      polling = true; controls();
      let nextDelay = 2000;
      try {
        const query = new URLSearchParams({ room_id: session.room_id, limit: "50" });
        if (older && beforeCursor) query.set("before", beforeCursor);
        else if (cursor !== null) query.set("after", cursor);
        const data = await api("/messages?" + query.toString());
        accept(data.messages, older ? "older" : cursor === null ? "initial" : "");
        if (older) { beforeCursor = data.before_cursor || beforeCursor; hasOlder = !!data.has_older; }
        else {
          if (cursor === null) { beforeCursor = data.before_cursor || ""; hasOlder = !!data.has_older; }
          cursor = data.cursor;
        }
        if (!pending && status.textContent.indexOf("傳送") < 0) say("");
        if (data.has_more && !older) nextDelay = 1;
      } catch (error) {
        if (error.status === 401) ready = false;
        say(pending ? "尚未確認上一則訊息傳送狀態，請點選重新傳送。" : "客服連線中，請稍候。");
      } finally {
        polling = false; controls();
        if (visible() && ready) schedule(nextDelay);
      }
    }
    async function sendPending() {
      if (sending || !pending) return;
      const original = pending;
      sending = true; controls(); say("訊息傳送中…");
      try {
        await ensureSession();
        if (!pending || pending.client_id !== original.client_id) return;
        if (original.room_id !== session.room_id) throw new Error("請確認原對話視窗傳送狀態");
        // Exact original payload, including the page context from its first submit.
        const data = await api("/messages", { method: "POST", body: original });
        accept([data.message], "latest");
        if (pending?.client_id === original.client_id) clearPending(data.message);
        if (!pending) say("訊息已送出。");
      } catch (_) {
        say("尚未確認傳送結果，您可點選下方重新傳送。");
      } finally {
        sending = false; controls(); schedule(1);
      }
    }
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const text = input.value;
      if (!text.trim() || sending) return;
      try {
        const freshMid = await ensureMemberId(), cl = window.leiduCleanTitle || (s => String(s || "").trim());
        const context = JSON.parse(JSON.stringify(draft?.text === text ? draft.context : pageContext()));
        if (freshMid && !context.member_id) context.member_id = freshMid;
        if (context.product_title) context.product_title = cl(context.product_title);
        if (draft?.context && freshMid && !draft.context.member_id) draft.context.member_id = freshMid;
        await ensureSession();
        let created = false;
        await originLock(PENDING_KEY, function () {
          pending = read(PENDING_KEY);
          if (!pending) {
            pending = { room_id: session.room_id, client_id: messageId(), text, context };
            write(PENDING_KEY, pending);
            created = true;
            if (input.value === text && (!draft ||
                (draft.text === text && sameContext(draft.context, context)))) {
              draft = null; write(DRAFT_KEY, null); input.value = "";
            }
          }
        });
        controls();
        if (created) await sendPending();
        else if (pending) say("請先確認上一則訊息傳送結果，您輸入的內容已保留。");
      } catch (_) { say("連線異常，您輸入的內容已保留。"); }
    });
    input.addEventListener("input", function () {
      const mid = window.leiduDetectMemberId?.() || "", base = draft?.context || pageContext();
      if (mid && !base.member_id) base.member_id = mid;
      draft = input.value ? { text: input.value, context: base } : null;
      write(DRAFT_KEY, draft); controls();
    });
    retry.addEventListener("click", () => void sendPending());
    olderButton.addEventListener("click", () => void poll(true));
    triggers.forEach(trigger => trigger.addEventListener("click", async function (event) {
      event.preventDefault(); previousFocus = document.activeElement;
      triggers.forEach(x => x.setAttribute("aria-expanded", "true"));
      contextCard();
      if (!dialog.open) dialog.showModal();
      say("正在連線客服…");
      try { ready = false; await ensureSession(); await poll(false); jumpLatest(); }
      catch (_) { say("連線異常，您輸入的內容已保留。"); }
    }));
    dialog.querySelector(".leidu-messenger-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", function () {
      clearTimeout(timer); timer = 0;
      triggers.forEach(x => x.setAttribute("aria-expanded", "false"));
      if (previousFocus?.isConnected) previousFocus.focus();
    });
    dialog.addEventListener("click", function (event) {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    document.addEventListener("visibilitychange", function () {
      clearTimeout(timer); timer = 0;
      if (visible()) void poll(false);
    });
    window.addEventListener("storage", function (event) {
      if (event.key === PENDING_KEY) { pending = read(PENDING_KEY); controls(); }
      if (event.key === SESSION_KEY && !pending) {
        const saved = read(SESSION_KEY);
        if (saved?.session_token) {
          if (session?.room_id && saved.room_id && session.room_id !== saved.room_id) {
            messages.clear(); cursor = null; beforeCursor = ""; hasOlder = false;
          }
          session = saved; ready = !!session.room_id;
          if (visible()) void poll(false);
        }
      }
    });
    controls();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
    if (wasOpen) { var t = document.querySelector('.leidu-inquiry-button'); if (t) t.click(); }
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href*="/shopinfo/guide.html#leidu-contact"],a[href="#leidu-contact"],a[href*="pf.kakao.com/_txmcxgG"]');
      if (!link) return;
      event.preventDefault();
      var trigger = document.querySelector('.xans-product-detail .leidu-inquiry-button') || fab;
      trigger.click();
    });
    var frame = 0;
    function sticky() {
      frame = 0;
      var bar = document.getElementById('orderFixArea');
      var box = bar && bar.getBoundingClientRect();
      var visible = !!(bar && !bar.classList.contains('displaynone') && box.width && box.height && getComputedStyle(bar).display !== 'none' && box.top < innerHeight && box.bottom > 0);
      document.documentElement.style.setProperty('--leidu-sticky-buy-clearance', visible ? Math.max(76, Math.ceil(innerHeight - box.top) + 12) + 'px' : '76px');
      document.documentElement.classList.toggle('leidu-has-sticky-buy', visible);
    }
    function queueSticky() { if (!frame) frame = requestAnimationFrame(sticky); }
    var bar = document.getElementById('orderFixArea');
    if (bar) new MutationObserver(queueSticky).observe(bar, {attributes:true, attributeFilter:['class','style']});
    window.addEventListener('scroll',queueSticky,{passive:true}); window.addEventListener('resize',queueSticky);
    sticky();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true}); else start();
})();


/* WL-145: checkout member contacts and verified recent shipping address, 2026-11-18. */
(function () {
  'use strict';
  if (!/\/order\/orderform\.html$/.test(location.pathname) || window.__leiduShippingPrefill145) return;
  window.__leiduShippingPrefill145 = true;
  var dirty = Object.create(null), requested = false, finished = false, timer, restoreStarted = false, restoreReady = false, nativeSavedAddress = false;
  var addressIds = ['rzipcode1', 'raddr1', 'raddr2'];
  function el(id) { return document.getElementById(id); }
  function value(id) { return String((el(id) || {}).value || '').trim(); }
  function phone(s) { return String(s || '').replace(/\D/g, '').replace(/^82(?=1[016789])/, '0'); }
  function contactPhone(s) { return /^01[016789]\d{7,8}$/.test(phone(s)); }
  function validPhone(s) { return /^010\d{8}$/.test(phone(s)); }
  function readPhone(prefix) {
    var combined = value(prefix + '_');
    return combined || [value(prefix + '_1'), value(prefix + '_2'), value(prefix + '_3')].join('');
  }
  function changed(field) {
    field.dispatchEvent(new Event('input', {bubbles:true}));
    field.dispatchEvent(new Event('change', {bubbles:true}));
  }
  function setBlank(id, text, events) {
    var field = el(id);
    if (!field || field.value.trim() || dirty[id] || !text) return false;
    field.value = text;
    if (events !== false) changed(field);
    return true;
  }
  function fillPhone(prefix, text) {
    var digits = phone(text);
    if (!contactPhone(digits)) return;
    if (el(prefix + '_')) { setBlank(prefix + '_', digits.slice(0,3)+'-'+digits.slice(3,-4)+'-'+digits.slice(-4)); return; }
    // Preserve an existing (even partially entered) receiver telephone.
    var ids = [prefix + '_1', prefix + '_2', prefix + '_3'];
    var parts = ids.map(value);
    if (parts[1] || parts[2] || ids.some(function (id) { return dirty[id]; })) return;
    ids.forEach(function (id,i) {
      var field = el(id), part = [digits.slice(0,3),digits.slice(3,-4),digits.slice(-4)][i];
      if (field && (!field.value || i === 0)) { field.value = part; changed(field); }
    });
  }
  function member() {
    var capp = window.CAPP_ASYNC_METHODS, data = {}, m = capp && capp.member;
    var id = window.leiduDetectMemberId ? window.leiduDetectMemberId() : '';
    if (!id) return null;
    try { data = m && typeof m.getData === 'function' ? m.getData() || {} : m || {}; } catch (_) {}
    var identity = {member_id:id, name:String(data.name || (m && m.__sName) || '').trim(),
      cellphone:String(data.cellphone || (m && m.__sCellphone) || ''), email:String(data.email || (m && m.__sEmail) || '')};
    if (!validPhone(phone(identity.cellphone))) {
      try {
        var linked = JSON.parse(localStorage.getItem('leiduMembershipIdentity:' + id) || 'null');
        if (linked && linked.member_id === id && String(linked.name || '').trim().length >= 2 && validPhone(phone(linked.cellphone))) {
          identity.name = String(linked.name).trim(); identity.cellphone = linked.cellphone; identity.verified_identity = true;
        }
      } catch (_) {}
    }
    return identity;
  }
  function syncContacts(m) {
    var name = value('oname') || m.name;
    var ordererPhone = readPhone('ophone2');
    var number = contactPhone(ordererPhone) ? ordererPhone : m.cellphone;
    setBlank('oname', m.name); fillPhone('ophone2', m.cellphone);
    setBlank('rname', name); fillPhone('rphone2', number);
    var email = m.email.trim(), at = email.lastIndexOf('@');
    if (at > 0) {
      if (el('oemail2')) { setBlank('oemail1', email.slice(0, at)); setBlank('oemail2', email.slice(at+1)); }
      else setBlank('oemail1', email);
    }
    return {member_id:m.member_id, name:m.verified_identity ? m.name : (name || value('rname')), cellphone:m.verified_identity ? phone(m.cellphone) : phone(number || readPhone('rphone2'))};
  }
  function pristineAddress() {
    return addressIds.every(function (id) { return !value(id) && !dirty[id]; });
  }
  function notice() {
    if (el('leidu-autofill-addr-notice')) return;
    var field = el('rzipcode1'), target = field && (field.closest('.ec-address') || field.parentElement);
    if (!target) return;
    var banner = document.createElement('div'); banner.id = 'leidu-autofill-addr-notice';
    banner.setAttribute('role', 'status');
    banner.textContent = '✓ 已自動帶入您最近一次的收件地址';
    banner.style.cssText = 'margin:0 0 10px;padding:10px 12px;border:1px solid #ddd8cd;border-radius:6px;background:#faf9f5;color:#4a5143;font-size:12px;line-height:1.6;word-break:keep-all;box-sizing:border-box;max-width:100%';
    target.parentNode.insertBefore(banner, target);
  }
  function recalculateShipping() {
    var shipping = window.CAFE24 && window.CAFE24.SHOP_FRONT_ORDERFORM_SHIPPING;
    if (shipping && shipping.proc && typeof shipping.proc.eventChangeAddress === 'function') shipping.proc.eventChangeAddress();
  }
  function apply(address, identity, receiver) {
    var current = member();
    if (['rname','rphone2_','rphone2_1','rphone2_2','rphone2_3'].some(function (id) { return dirty[id]; }) ||
        receiver.name !== value('rname') || receiver.phone !== phone(readPhone('rphone2'))) return;
    if (!address || !address.zipcode || !address.addr1 || !pristineAddress() || !current || current.member_id !== identity.member_id) return;
    var now = syncContacts(current);
    if (now.name !== identity.name || now.cellphone !== identity.cellphone) return;
    // Assign every address component before notifying Cafe24's address handlers.
    [['rzipcode1',address.zipcode],['raddr1',address.addr1],['raddr2',address.addr2 || '']].forEach(function (entry) {
      var field = el(entry[0]); if (field) field.value = entry[1];
    });
    setBlank('rname',address.name); fillPhone('rphone2',address.cellphone);
    addressIds.forEach(function (id) { if (el(id)) changed(el(id)); });
    recalculateShipping(); notice(); finished = true;
  }
  function tick() {
    if (finished) return;
    var m = member();
    if (!m) return;
    var identity = syncContacts(m);
    if (requested || !el('rzipcode1') || !el('raddr1') || identity.name.length < 2 || !validPhone(identity.cellphone)) return;
    if (!pristineAddress()) { finished = true; clearInterval(timer); return; }
    if (!nativeAddressReady()) return;
    requested = true; clearInterval(timer);
    var receiver = {name:value('rname'), phone:phone(readPhone('rphone2'))};
    fetch('https://webhook.leidu.co.kr/kakao-ai-skill/ownmall/shipping-prefill', {
      method:'POST', mode:'cors', credentials:'omit', cache:'no-store',
      headers:{'Content-Type':'text/plain;charset=UTF-8'}, body:JSON.stringify(identity)
    }).then(function (response) { return response.ok ? response.json() : null; })
      .then(function (data) { if (data && data.ok === true && data.matched === true) apply(data.address, identity, receiver); })
      .catch(function () { /* Native checkout remains available. */ });
  }
  function nativeAddressReady() {
    if (document.readyState !== 'complete') return false;
    var data = window.EC_SHOP_FRONT_ORDERFORM_DATA || (window.CAFE24 && window.CAFE24.SHOP_FRONT_ORDERFORM_DATA);
    if (data && data.form && data.form.oDefer) return false;
    if (window.EC$ && window.EC$.active > 0) return false;
    var form = data && data.form && data.form.aOrderFormData;
    if ((form && (form.ozipcode1 || form.oaddr1)) ||
        (window.gMemberShippingAddr && (window.gMemberShippingAddr.zipcode || window.gMemberShippingAddr.addr1))) {
      nativeSavedAddress = true;
    }
    if (!restoreStarted) {
      restoreStarted = true;
      var crypto = window.CAFE24 && window.CAFE24.SHOP_FRONT_ORDERFORM_CRYPTO;
      var read = crypto && crypto.proc && crypto.proc.getItemFromSessionStorage;
      var done = function () { requestAnimationFrame(function () { restoreReady = true; tick(); }); };
      if (typeof read === 'function') {
        // Use Cafe24's own decoder and identity contract for an existing checkout draft.
        var restored;
        try { restored = read.call(crypto.proc, 'orderform_input_data'); } catch (_) { done(); return false; }
        Promise.resolve(restored).then(function (raw) {
          try {
            var saved = typeof raw === 'string' ? JSON.parse(raw || '{}') : raw;
            var m = member(), receiver = saved && saved.receiver_info;
            if (m && saved && saved.member_id === m.member_id && data && saved.delvtype === data.shipping.sDelvType &&
                String(saved.shop_no) === String(window.CAFE24.SDE_SHOP_NUM) && receiver &&
                (receiver.rzipcode1 || receiver.raddr1 || receiver.raddr2)) nativeSavedAddress = true;
          } catch (_) {}
        }).then(done, done);
      } else done();
      return false;
    }
    return restoreReady && !nativeSavedAddress;
  }
  document.addEventListener('input', function (event) { if (event.isTrusted && event.target.id) dirty[event.target.id] = true; }, true);
  document.addEventListener('change', function (event) { if (event.isTrusted && event.target.id) dirty[event.target.id] = true; }, true);
  document.addEventListener('click', function (event) {
    if (!event.isTrusted) return;
    var target = event.target.closest('a,button,input');
    if (target && ((target.getAttribute('onclick') || '').indexOf('Zipcode') !== -1 || /주소검색/.test(target.textContent || target.value || ''))) addressIds.forEach(function (id) { dirty[id] = true; });
  }, true);
  function start() { timer = setInterval(tick, 50); tick(); setTimeout(function () { clearInterval(timer); }, 15000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true}); else start();
  window.addEventListener('load', tick, {once:true});
})();

/* WL149/150: Kakao signup guidance, preserving native SNS login actions. */
(function () {
  'use strict';
  if (!/\/member\/login\.html$/.test(location.pathname)) return;
  function guide() {
    var sns=document.querySelector('ul.snsArea');
    if (!sns || !sns.querySelector('li.btn_kakao a[onclick*="kakaosyncLogin"]') || document.getElementById('leidu-kakao-sync-login-guide')) return;
    var note=document.createElement('p'); note.id='leidu-kakao-sync-login-guide';
    note.textContent='⚡ 免費註冊 LEIDU 官方會員，立即享 GLOBAL WELCOME 5% 常態折扣（VIP 最高 10%）與順豐直郵訂單追蹤服務。';
    sns.insertAdjacentElement('afterend',note);
  }
  guide();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',guide,{once:true});
  window.addEventListener('load',guide,{once:true});
})();

/* WL-152: remember checkout shipping drafts before payment, 2026-11-18. */
(function () {
  'use strict';
  if (!/\/order\/orderform\.html$/.test(location.pathname) || window.__leiduShippingMemory152) return;
  var boot = performance.now();
  var state = window.__leiduShippingMemory152 = {restored:false, restoreMs:null, startupMs:null};
  var prefix = 'leidu_orderform_ship_mem_v1:', ttl = 90 * 24 * 60 * 60 * 1000;
  var initialized = '', lastSaved = '', restoring = false, autoChecked = [], optedOut = [];
  var fields = {rname:'rname', rzipcode1:'rzipcode1', raddr1:'raddr1', raddr2:'raddr2',
    rphone1:'rphone2_1', rphone2:'rphone2_2', rphone3:'rphone2_3', rphoneFlat:'rphone2_',
    oemail1:'oemail1', oemail2:'oemail2', oemail:'oemail', omessage_select:'omessage_select', omessage:'omessage'};
  var watched = Object.keys(fields).map(function (key) { return fields[key]; });
  function el(id) { return document.getElementById(id); }
  function value(id) { return String((el(id) || {}).value || '').trim(); }
  function member() {
    var c = window.CAPP_ASYNC_METHODS, m = c && c.member, d = {}, id = '';
    if (c && c.IS_LOGIN === false) return {id:'guest', email:''};
    try { d = m && typeof m.getData === 'function' ? m.getData() || {} : m || {}; } catch (_) {}
    return (id = window.leiduDetectMemberId ? window.leiduDetectMemberId() : '') ? {id:id, email:String(d.email || (m && m.__sEmail) || '').trim()} : null;
  }
  function changed(field) {
    field.dispatchEvent(new Event('input', {bubbles:true}));
    field.dispatchEvent(new Event('change', {bubbles:true}));
  }
  function email(m, saved) {
    var full = value('oemail'), first = value('oemail1'), domain = value('oemail2');
    var existing = full || (domain && first.indexOf('@') < 0 ? first + '@' + domain : first);
    var remembered = saved && (saved.oemail || (saved.oemail2 ? saved.oemail1 + '@' + saved.oemail2 : saved.oemail1));
    var address = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(existing) ? existing : (remembered || m.email || '');
    var at = address.lastIndexOf('@');
    if (at <= 0 || at === address.length - 1) return;
    var vals = {oemail:address, oemail1:el('oemail2') ? address.slice(0,at) : address, oemail2:address.slice(at+1)};
    Object.keys(vals).forEach(function (id) {
      var f = el(id); if (f && !value(id)) { f.value = vals[id]; changed(f); }
    });
  }
  function optionalEmail() {
    ['oemail','oemail1','oemail2'].forEach(function (id) {
      var f = el(id); if (!f) return;
      var filter = f.getAttribute('fw-filter');
      if (filter) f.setAttribute('fw-filter',filter.split('&').filter(function (rule) { return rule.trim() !== 'isFill'; }).join('&'));
      f.required = false;
    });
  }
  function checkDefault(m) {
    if (m.id === 'guest') return;
    document.querySelectorAll('input[type="checkbox"][name*="main_address"], input[type="checkbox"][id*="set_main_address"]').forEach(function (f) {
      if (autoChecked.indexOf(f) !== -1 || optedOut.indexOf(f) !== -1) return;
      autoChecked.push(f);
      if (!f.checked) { f.checked = true; changed(f); }
    });
  }
  function recalculate() {
    var shipping = window.CAFE24 && window.CAFE24.SHOP_FRONT_ORDERFORM_SHIPPING;
    if (shipping && shipping.proc && typeof shipping.proc.eventChangeAddress === 'function') shipping.proc.eventChangeAddress();
  }
  function notice() {
    if (el('leidu-shipping-memory-notice')) return;
    var f = el('rzipcode1'), target = f && (f.closest('.ec-address') || f.parentElement);
    if (!target || !target.parentNode) return;
    var note = document.createElement('div'); note.id = 'leidu-shipping-memory-notice'; note.setAttribute('role','status');
    note.textContent = '✓ 已自動還原您先前填寫的收件資訊';
    note.style.cssText = 'margin:6px 0 10px;color:#4a5143;font-size:12px;line-height:1.6;word-break:keep-all';
    target.parentNode.insertBefore(note,target);
  }
  function read(m) {
    try {
      var raw = localStorage.getItem(prefix+m.id), d = raw && JSON.parse(raw);
      if (!d || !/^\d{5}$/.test(d.rzipcode1 || '') || typeof d.raddr1 !== 'string' || !d.raddr1.trim() ||
          !Number.isFinite(d.updatedAt) || Date.now()-d.updatedAt > ttl || d.updatedAt > Date.now()) return null;
      return d;
    } catch (_) { return null; }
  }
  function save() {
    if (restoring) return;
    var m = member();
    if (!m || !/^\d{5}$/.test(value('rzipcode1')) || !value('raddr1')) return;
    var d = {};
    Object.keys(fields).forEach(function (key) { d[key] = value(fields[key]); });
    var signature = m.id + ':' + JSON.stringify(d);
    if (signature === lastSaved) return;
    d.updatedAt = Date.now();
    try { localStorage.setItem(prefix+m.id,JSON.stringify(d)); lastSaved = signature; } catch (_) {}
  }
  function init() {
    if (!el('rzipcode1') || !el('raddr1')) return;
    var m = member(); if (!m) return;
    checkDefault(m); optionalEmail();
    if (initialized === m.id) { email(m); return; }
    initialized = m.id;
    var started = performance.now(), saved = read(m), assigned = [];
    restoring = true;
    // Preserve Cafe24 defaults and any existing partial address.
    if (!value('rzipcode1') && !value('raddr1') && saved) {
      Object.keys(fields).forEach(function (key) {
        var id = fields[key], f = el(id), v = saved[key];
        if (!f || /^oemail/.test(id) || typeof v !== 'string') return;
        f.value = v; assigned.push(f);
      });
      state.restored = true; state.restoreMs = performance.now()-started; state.startupMs = performance.now()-boot;
      assigned.forEach(changed); recalculate(); notice();
    }
    email(m,saved); restoring = false; save();
  }
  document.addEventListener('input', function (e) { if (watched.indexOf(e.target.id) !== -1) save(); }, true);
  document.addEventListener('change', function (e) {
    var f = e.target;
    if (e.isTrusted && f.type === 'checkbox' && /main_address/.test(f.name+' '+f.id) && !f.checked) optedOut.push(f);
    if (watched.indexOf(f.id) !== -1) save();
  }, true);
  var lastAddress = '';
  setInterval(function () {
    init();
    var current = value('rzipcode1')+'\n'+value('raddr1');
    if (current !== lastAddress) { lastAddress = current; save(); }
  },500);
  window.addEventListener('pagehide',save);
  window.addEventListener('beforeunload',save);
  init();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  window.addEventListener('load',init,{once:true});
})();


/* WL-149: My Page self matching consumes the existing verified membership bridge. */
(function () {
  "use strict";
  if (true) return; /* SmartStore KR self-match disabled on Shop 7 */
  function profile() {
    var capp=window.CAPP_ASYNC_METHODS, m=capp&&capp.member, data={}, id=window.leiduDetectMemberId?window.leiduDetectMemberId():"";
    if (!id) return null;
    try { data=m&&typeof m.getData==="function" ? m.getData()||{} : m||{}; } catch (_) {}
    return {member_id:id,name:String(data.name||data.member_name||(m&&m.__sName)||""),cellphone:String(data.cellphone||(m&&m.__sCellphone)||"")};
  }
  function mount() {
    if (document.getElementById("leidu-membership-self-match")) return true;
    var member=profile(),host=document.querySelector("#contents,main");
    if (!member||!host) return false;
    var card=document.createElement("section");card.id="leidu-membership-self-match";
    card.style.cssText="box-sizing:border-box;max-width:100%;margin:16px 0;padding:20px;border:1px solid #ded8cc;background:#faf8f3;color:#29251f;line-height:1.6";
    card.innerHTML='<h3 style="margin:0 0 8px;font-size:17px">스마트스토어 구매내역 연결</h3><p style="margin:0 0 12px">스마트스토어 주문자 성함과 휴대폰 번호를 입력하면 등급과 배송지를 연결합니다.</p><form style="display:flex;flex-wrap:wrap;gap:8px"><label style="flex:1;min-width:160px">스마트스토어 주문자 성함<input type="text" name="name" autocomplete="name" required minlength="2" maxlength="80" style="box-sizing:border-box;width:100%;min-height:42px;padding:9px;border:1px solid #ccc5b9"></label><label style="flex:1;min-width:180px">휴대폰 번호<input type="tel" name="cellphone" autocomplete="tel" inputmode="tel" required maxlength="20" style="box-sizing:border-box;width:100%;min-height:42px;padding:9px;border:1px solid #ccc5b9"></label><button type="submit" style="align-self:end;min-height:42px;padding:9px 18px;border:1px solid #29251f;background:#29251f;color:white">1초 등급·배송지 연결</button></form><p role="status" aria-live="polite" style="margin:10px 0 0"></p><a href="/member/modify.html" hidden>회원정보 확인·수정</a>';
    host.insertBefore(card,host.firstChild);
    var relogin=document.createElement('a');relogin.href='/exec/front/Member/logout/?returnUrl=%2Fmember%2Flogin.html';relogin.textContent='🔄 1초 재로그인하여 등급 바로 반영하기';relogin.setAttribute('role','button');relogin.hidden=true;relogin.style.cssText='display:none;box-sizing:border-box;min-height:42px;margin-top:14px;padding:11px 14px;border:1px solid #baa17c;background:#fff8eb;color:#3c3020;font-weight:700;text-align:center;text-decoration:none';card.appendChild(relogin);
    var form=card.querySelector("form"),phone=card.querySelector('[name="cellphone"]'),name=card.querySelector('[name="name"]'),button=card.querySelector("button"),status=card.querySelector('[role="status"]'),help=card.querySelector("a");
    phone.value=member.cellphone;name.value=member.name;
    form.addEventListener("submit",async function(event){
      event.preventDefault();if(button.disabled)return;
      var current=profile(),digits=phone.value.replace(/\D/g,""),ordererName=name.value.trim();
      if(!current){status.textContent="로그인 후 다시 확인해 주세요.";return;}
      if(ordererName.length<2){status.textContent="스마트스토어 주문자 성함을 입력해 주세요.";name.focus();return;}
      if(!/^01[0-9]{8,9}$/.test(digits)){status.textContent="휴대폰 번호를 확인해 주세요.";phone.focus();return;}
      button.disabled=true;status.textContent="구매내역과 회원 혜택을 확인하고 있습니다.";help.hidden=true;
      var started=performance.now();
      try {
        var result=await window.leiduMembershipSelfMatch({member_id:current.member_id,name:ordererName,cellphone:digits,event:"storefront:membership_self_match"});
        card.dataset.elapsedMs=String(Math.round(performance.now()-started));
        if(!result.phone_matched){status.textContent="스마트스토어 주문자 성함과 휴대폰 번호를 확인해 주세요.";help.hidden=false;return;}
        status.textContent="구매내역 연결 완료 · "+String(result.grade_name||"회원")+" · 할인 "+Number(result.discount_rate||0)+"%";
        card.dataset.matched="true";
        relogin.hidden=false;relogin.style.display="block";
        var linked=result.verified_identity;
        if(linked&&linked.member_id===current.member_id&&String(linked.name||"").trim().length>=2&&/^01[0-9]{8,9}$/.test(String(linked.cellphone||"").replace(/\D/g,""))){
          try{localStorage.setItem("leiduMembershipIdentity:"+current.member_id,JSON.stringify(Object.assign({},linked,{grade_name:result.grade_name,group_no:result.group_no,discount_rate:result.discount_rate,previous_grade_name:result.previous_grade_name,linked_at:Date.now()})));}catch(_){}
          window.dispatchEvent(new CustomEvent("leidu:membership-linked",{detail:{member_id:current.member_id}}));
        }
      } catch(error){status.textContent=String(error.message||error);}
      finally {button.disabled=false;}
    });
    return true;
  }
  function start(){if(mount())return;var tries=0,timer=setInterval(function(){if(mount()||++tries>=40)clearInterval(timer);},250);}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();

window.leiduMembershipSelfMatch=window.leiduMembershipSelfMatch||async function(payload){
  var response=await fetch("https://webhook.leidu.co.kr/kakao-ai-skill/webhook/cafe24/member?bridge=1",{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify(payload)});
  var result=await response.json();if(!response.ok||!result.ok)throw new Error(result.error||"連線驗證失敗，請稍後再試。");
  if(window.leiduConsumeMembershipBridge)window.leiduConsumeMembershipBridge(result);
  return result;
};
/* WL167/170/171: consume the verified membership bridge and retain each member's choice. */
(function () {
  "use strict";
  var RELOGIN=__leiduShopHref__("/exec/front/Member/logout/?returnUrl=" + encodeURIComponent(__leiduShopHref__("/member/login.html")));
  var COPY="註冊完成！歡迎成為 LEIDU 官方會員，結帳滿 NT$1,000 即自動享 5%~10% 會員專屬優惠。";
  function read(key){try{return JSON.parse(localStorage.getItem(key)||"null");}catch(_){return null;}}
  function write(key,value){try{localStorage.setItem(key,key.indexOf("leiduVipOnboardPromptDone:")===0?"1":JSON.stringify(value));}catch(_){}}
  function profile(){
    var c=window.CAPP_ASYNC_METHODS||{},m=c.member||{},d={};
    try{d=typeof m.getData==="function"?m.getData()||{}:m;}catch(_){}
    var tier=typeof window.leiduGetMemberTierInfo==="function"?window.leiduGetMemberTierInfo():{};
    return {id:String(tier.memberId||d.member_id||m.__sMemberId||"").trim(),
      logged:!!tier.isLogged,group:String(d.group_no||m.__sGroupNo||""),
      grade:String(tier.gradeName||""),nativeGrade:String(d.group_name||m.__sGroupName||"").trim().toUpperCase(),name:String(d.name||d.member_name||m.__sName||""),
      phone:String(d.cellphone||m.__sCellphone||"")};
  }
  function verified(identity,id){
    return !!(identity&&identity.member_id===id&&String(identity.name||"").trim().length>=2&&/^01[0-9]{8,9}$/.test(String(identity.cellphone||"").replace(/\D/g,"")));
  }
  function reloginCopy(host,key){
    if(!host||host.querySelector('[data-leidu-relogin-copy="'+key+'"]'))return;
    var box=document.createElement("aside");box.dataset.leiduReloginCopy=key;
    box.style.cssText="box-sizing:border-box;margin:14px 0;padding:14px 16px;border:1px solid #d7c8ad;background:#faf7ef;color:#332b22;font-size:13px;line-height:1.65";
    var text=document.createElement("p");text.textContent=COPY;text.style.margin="0 0 8px";
    var link=document.createElement("a");link.href=RELOGIN;link.textContent="🔄 重新登入以更新會員狀態";link.style.cssText="color:inherit;font-weight:600;text-decoration:underline";
    box.append(text,link);if(key==="join"){var heading=host.querySelector("h1,h2,h3,.title");if(heading)heading.after(box);else host.prepend(box);}else host.appendChild(box);
  }
  function syncGrade(){
    var member=profile(),identity=read("leiduMembershipIdentity:"+member.id)||window.leiduVerifiedMembershipBridge?.[member.id];
    if(!member.logged)return;
    try{
      var syncedMember=sessionStorage.getItem("leidu_synced_mid_v1"),benefit=JSON.parse(sessionStorage.getItem("leidu_member_benefit_v1")||"null");
      if(syncedMember===member.id&&benefit&&["GLOBAL WELCOME","GLOBAL VIP","GLOBAL VVIP","SILVER","GOLD","VIP","VVIP"].includes(String(benefit.group||"").toUpperCase())){
        identity={member_id:member.id,grade_name:String(benefit.group).toUpperCase(),discount_rate:Number(benefit.rate),bridge_confirmed:true};
      }
    }catch(_){}
    if(!(verified(identity,member.id)||identity?.bridge_confirmed===true)&&["GLOBAL WELCOME","GLOBAL VIP","GLOBAL VVIP","SILVER","GOLD","VIP","VVIP"].includes(member.nativeGrade)){
      identity={member_id:member.id,grade_name:member.nativeGrade,discount_rate:({"GLOBAL WELCOME":5,"GLOBAL VIP":8,"GLOBAL VVIP":10,SILVER:12,GOLD:13,VIP:14,VVIP:15})[member.nativeGrade],bridge_confirmed:true};
    }
    if(!(verified(identity,member.id)||identity?.bridge_confirmed===true)||!["GLOBAL WELCOME","GLOBAL VIP","GLOBAL VVIP","SILVER","GOLD","VIP","VVIP"].includes(String(identity.grade_name||"").toUpperCase()))return;
    var grade=String(identity.grade_name).toUpperCase(),rate=Number(identity.discount_rate)||({"GLOBAL WELCOME":5,"GLOBAL VIP":8,"GLOBAL VVIP":10,SILVER:12,GOLD:13,VIP:14,VVIP:15})[grade];
    var stale=[];
    try{for(var i=0;i<sessionStorage.length;i++){
      var key=sessionStorage.key(i),value=sessionStorage.getItem(key);
      if(/capp_async|ec_async|myshop.*benefit|Member.*Group/i.test(key)&&/일반\s*회원/.test(value||""))stale.push(key);
    }stale.forEach(function(key){sessionStorage.removeItem(key);});}catch(_){}
    var probe=document.getElementById("leidu-member-grade-probe");
    if(probe){
      probe.querySelectorAll(".xans-member-var-group_name,.leidu-probe-group").forEach(function(el){el.textContent=grade;});
      probe.querySelectorAll(".myshop_benefit_dc_price,.xans-member-var-dc_price,.leidu-probe-dc-price").forEach(function(el){el.textContent=String(rate);});
      probe.querySelectorAll(".myshop_benefit_dc_type,.xans-member-var-dc_type,.leidu-probe-dc-type").forEach(function(el){el.textContent="%";});
    }
    document.querySelectorAll(".xans-myshop-asyncbenefit .groupName,.xans-myshop-asyncbenefit strong.group,.xans-myshop-asyncbenefit [class*='group'],.xans-myshop-asyncbenefit .xans-member-var-group_name,.xans-myshop-asyncbenefit .member em").forEach(function(el){
      if(el.children.length)return;if(el.textContent!==grade)el.textContent=grade;
    });
    var benefitHost=document.querySelector(".xans-myshop-asyncbenefit");
    if(benefitHost){
      var benefitLabel=benefitHost.querySelector(".leidu-verified-benefit-rate");
      if(!benefitLabel){benefitLabel=document.createElement("span");benefitLabel.className="leidu-verified-benefit-rate";benefitLabel.style.cssText="display:block;margin-top:4px;font-size:13px;line-height:1.5";benefitHost.appendChild(benefitLabel);}
      benefitLabel.textContent="常態 "+rate+"% 會員折扣啟用中";
    }
    return grade+"|"+rate;
  }
  function mountWelcome(){ return; /* SmartStore KR welcome modal disabled on Shop 7 */
    var m=profile(),id=m.id;
    if(!m.logged||!id||id.indexOf("{$")>=0)return;
    if(read("leiduVipOnboardPromptDone:"+id)||verified(read("leiduMembershipIdentity:"+id),id))return;
    if(!/@[kn](?:\.|$)/i.test(id)&&m.group!=="1"&&!/일반\s*회원/.test(m.grade))return;
    if(!(location.pathname==="/"||location.pathname==="/index.html"||/\/product\//.test(location.pathname)||document.querySelector(".xans-product-detail")))return;
    if(document.getElementById("leidu-vip-welcome-sheet")||document.querySelector("#leidu-messenger[open]"))return;
    var sheet=document.createElement("dialog");sheet.id="leidu-vip-welcome-sheet";
    sheet.setAttribute("aria-labelledby","leidu-vip-welcome-title");
    sheet.style.cssText="box-sizing:border-box;max-width:calc(100vw - 32px);width:440px;padding:30px 26px;border:1px solid #b29a72;background:#111;color:#f8f3e8;border-radius:3px;box-shadow:0 20px 80px #0007";
    sheet.innerHTML='<h2 id="leidu-vip-welcome-title" style="margin:0 0 14px;font-size:21px;line-height:1.5;font-weight:500">✨ 스마트스토어 단골 등급(최대 15% VVIP) 1초 연결</h2><p style="margin:0 0 22px;font-size:13px;line-height:1.8">간편가입 계정은 아래 성함·연락처 입력 시 스마트스토어 VIP 등급과 최근 배송지가 1초 만에 자동 승계됩니다.</p><form><label style="display:block;margin-bottom:14px">스마트스토어 주문자 성함<input name="name" autocomplete="name" required minlength="2" maxlength="80" style="box-sizing:border-box;width:100%;margin-top:7px;padding:12px;background:#fbf7ee;border:1px solid #c4bba8;border-radius:0;color:#111;font-size:16px"></label><label style="display:block;margin-bottom:18px">휴대폰 번호<input name="cellphone" placeholder="010-0000-0000" type="tel" autocomplete="tel" inputmode="tel" required maxlength="20" style="box-sizing:border-box;width:100%;margin-top:7px;padding:12px;background:#fbf7ee;border:1px solid #c4bba8;border-radius:0;color:#111;font-size:16px"></label><button type="submit" style="width:100%;padding:14px;border:1px solid #e5d9bd;background:#efe6d1;color:#111;font-size:14px;font-weight:600">내 등급 &amp; 배송지 1초 연결하기</button></form><p role="status" aria-live="polite" style="font-size:13px;line-height:1.8"></p><button type="button" data-vip-dismiss style="width:100%;padding:10px 0;border:0;background:transparent;color:#f8f3e8;font-size:12px;text-decoration:underline">신규 고객이에요 · 12% 할인가로 바로 쇼핑하기</button>';
    document.body.appendChild(sheet);reloginCopy(sheet,"welcome");
    var form=sheet.querySelector("form"),name=form.elements.name,phone=form.elements.cellphone,status=sheet.querySelector('[role="status"]'),button=form.querySelector("button");
    name.value=m.name;phone.value=m.phone;
    sheet.querySelector("[data-vip-dismiss]").onclick=function(){write("leiduVipOnboardPromptDone:"+id,true);sheet.close();sheet.remove();};sheet.addEventListener("cancel",function(){write("leiduVipOnboardPromptDone:"+id,true);sheet.remove();});
    form.addEventListener("submit",async function(event){
      event.preventDefault();if(button.disabled)return;
      var current=profile(),digits=phone.value.replace(/\D/g,""),orderer=name.value.trim();
      if(current.id!==id||!current.logged){status.textContent="로그인 후 다시 확인해 주세요.";return;}
      if(orderer.length<2||!/^01[0-9]{8,9}$/.test(digits)){status.textContent="성함과 휴대폰 번호를 확인해 주세요.";return;}
      button.disabled=true;status.textContent="구매내역과 최근 배송지를 연결하고 있습니다.";
      try{
        var result=await window.leiduMembershipSelfMatch({member_id:id,name:orderer,cellphone:digits,event:"storefront:membership_self_match"});
        if(result.error)throw new Error("스마트스토어 주문자 성함과 휴대폰 번호를 확인해 주세요.");
        if(!Number(result.smartstore_1y_spend||0)&&Number(result.discount_rate||12)===12&&!["GLOBAL WELCOME","GLOBAL VIP","GLOBAL VVIP","SILVER","GOLD","VIP","VVIP"].includes(String(result.grade_name||"").toUpperCase())){
          write("leiduVipOnboardPromptDone:"+id,true);form.hidden=true;
          status.textContent="신규 회원 상시 12% 즉시할인 혜택이 활성화되었습니다:)";return;
        }
        if(!result.phone_matched||!verified(result.verified_identity,id))throw new Error("스마트스토어 주문자 성함과 휴대폰 번호를 확인해 주세요.");
        var identity=Object.assign({},result.verified_identity,{grade_name:result.grade_name,group_no:result.group_no,discount_rate:result.discount_rate,linked_at:Date.now()});
        write("leiduMembershipIdentity:"+id,identity);write("leiduVipOnboardPromptDone:"+id,true);
        window.dispatchEvent(new CustomEvent("leidu:membership-linked",{detail:{member_id:id}}));
        if(typeof window.leiduRefreshMembershipState==="function")window.leiduRefreshMembershipState();
        if(typeof window.leiduApplyMemberBenefitPrices==="function")window.leiduApplyMemberBenefitPrices();
        syncGrade();form.hidden=true;
        var rate=Number(result.discount_rate||12),grade=String(result.grade_name||"일반회원");
        status.textContent=rate>12?"🎉 "+grade+"("+rate+"% 상시할인) 승급 완료!":"신규 회원 상시 12% 즉시할인 혜택이 활성화되었습니다:)";
        if(rate>12){var relogin=sheet.querySelector('[data-leidu-relogin-copy="welcome"] a');relogin.textContent="여기를 눌러 1초 재로그인하고 결제창 할인가 적용하기 >";}
      }catch(error){status.textContent=String(error.message||error);}
      finally{button.disabled=false;}
    });
    if(typeof sheet.showModal==="function")sheet.showModal();else sheet.setAttribute("open","");
  }
  var lastAppliedMembership="";
  function apply(){
    var signature=syncGrade();
    if(signature&&signature!==lastAppliedMembership){lastAppliedMembership=signature;if(typeof window.leiduApplyMemberBenefitPrices==="function")window.leiduApplyMemberBenefitPrices();}
    document.querySelectorAll(".xans-member-joincomplete").forEach(function(el){reloginCopy(el,"join");});
    if(/\/member\/login\.html$/.test(location.pathname))reloginCopy(document.querySelector(".snsArea,.snsLogin,.xans-member-login")||document.querySelector("#contents"),"login");
    if(/^\/myshop\//.test(location.pathname))reloginCopy(document.getElementById("leidu-membership-self-match")||document.querySelector("#contents"),"myshop");
    document.querySelectorAll(".leidu-product-notes details:has(.leidu-size-note) > summary,.xans-product-detail a,.xans-product-detail button").forEach(function(el){
      var sizeBox=el.getBoundingClientRect();
      if(!sizeBox.width||!sizeBox.height)return;
      if(/사이즈|SIZE/i.test(el.textContent||"")){el.style.setProperty("color","#967b4e");el.style.setProperty("font-weight","600");el.style.setProperty("text-decoration","underline");el.title="詳細平量尺寸 (cm)";if(!el.querySelector("[data-leidu-size-badge]")){var badge=document.createElement("small");badge.dataset.leiduSizeBadge="1";badge.textContent="平量尺寸表";badge.style.cssText="margin-left:6px;font-size:11px;color:#967b4e";el.appendChild(badge);}}
    });
    mountWelcome();
  }
  window.leiduVerifiedMembershipBridge=window.leiduVerifiedMembershipBridge||{};
  window.leiduConsumeMembershipBridge=function(result){
    var m=profile();if(!result||!result.ok||result.member_id!==m.id||!["GLOBAL WELCOME","GLOBAL VIP","GLOBAL VVIP","SILVER","GOLD","VIP","VVIP"].includes(String(result.grade_name||"").toUpperCase()))return;
    window.leiduVerifiedMembershipBridge[m.id]=Object.assign({},result,{bridge_confirmed:true});
    try{sessionStorage.setItem("leidu_synced_mid_v1",m.id);sessionStorage.setItem("leidu_member_benefit_v1",JSON.stringify({group:result.grade_name,rate:Number(result.discount_rate),ts:Date.now()}));}catch(_){}
    syncGrade();
  };
  var originalPriceRefresh=window.leiduApplyMemberBenefitPrices;
  if(typeof originalPriceRefresh==="function"&&!originalPriceRefresh.leiduGradeCacheConsumer){
    var priceRefresh=function(){syncGrade();return originalPriceRefresh.apply(this,arguments);};
    priceRefresh.leiduGradeCacheConsumer=true;window.leiduApplyMemberBenefitPrices=priceRefresh;
  }
  window.addEventListener("leidu:membership-linked",function(event){window.leiduConsumeMembershipBridge(event.detail);apply();});
  window.addEventListener("load",apply);
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",apply,{once:true});else apply();
  var tries=0,timer=setInterval(function(){apply();if(++tries>=20)clearInterval(timer);},500);
})();


/* WL-349 R3: Shop 7 Guest Regular-Price-Only & Locale Popup Guard */
(function () {
  'use strict';
  if (window.__leiduWl349Loaded) return;
  window.__leiduWl349Loaded = true;

  window.__cafe24pro_locale_responsive_loaded__ = true;
  function removeLocaleModal() {
    var m = document.getElementById('cafe24pro_locale_mount');
    if (m) m.remove();
  }
  removeLocaleModal();

  var st = document.createElement('style');
  st.id = 'leidu-wl349-guest-price-lock-style';
  st.textContent = '#cafe24pro_locale_mount,#leidu-wl349-guest-lock-card{display:none!important;visibility:hidden!important;pointer-events:none!important;opacity:0!important}html.leidu-is-guest body #contents .xans-product-detail .infoArea .info_table tr.leidu-has-member-price #span_product_price_text{color:#111111!important;font-size:19px!important;font-weight:700!important;line-height:25px!important;text-decoration:none!important;text-decoration-line:none!important;letter-spacing:-0.015em!important}html.leidu-is-guest body #contents .xans-product-detail .infoArea .info_table .leidu-pdp-benefit-wrap,html.leidu-is-guest body #contents .xans-product-detail .infoArea .leidu-pdp-total-benefit{display:none!important}';
  (document.head || document.documentElement).appendChild(st);

  function syncWl349Pdp() {
    removeLocaleModal();
    var existingCard = document.getElementById('leidu-wl349-guest-lock-card');
    if (existingCard) existingCard.remove();

    var guestBar = document.getElementById('leidu-wl79-pdp-guest-bar');
    if (guestBar) {
      var copyEl = guestBar.querySelector('.leidu-guest-join-copy');
      var wantHtml = '⚡ 免費註冊會員即享 <strong style="color:#FFE2B0!important;">分級專屬禮遇（5%~10% 折扣）</strong> · 任選 2 件順豐免運';
      if (copyEl && copyEl.innerHTML !== wantHtml) {
        copyEl.innerHTML = wantHtml;
      }
    }
    var bGuestBar = document.getElementById('leidu-wl79-basket-guest-bar');
    if (bGuestBar) {
      var bCopy = bGuestBar.querySelector('.leidu-guest-join-copy');
      var wantB = '⚡ 免費註冊會員即享 <strong style="color:#FFE2B0!important;">分級專屬禮遇（5%~10% 折扣）</strong> · 任選 2 件順豐免運';
      if (bCopy && bCopy.innerHTML !== wantB) {
        bCopy.innerHTML = wantB;
      }
    }
  }

  var prevApply = window.leiduApplyMemberBenefitPrices;
  if (typeof prevApply === 'function' && !prevApply.__wl349Wrapped) {
    var wrapped = function () {
      var r = prevApply.apply(this, arguments);
      syncWl349Pdp();
      return r;
    };
    wrapped.__wl349Wrapped = true;
    wrapped.leiduGradeCacheConsumer = prevApply.leiduGradeCacheConsumer;
    window.leiduApplyMemberBenefitPrices = wrapped;
  }

  syncWl349Pdp();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncWl349Pdp, { once: true });
  }
  window.addEventListener('load', syncWl349Pdp);
  window.addEventListener('leidu:membership-linked', syncWl349Pdp);
})();
/* WL-426 + WL-428 + WL-144 Unified: Runway Anti-Freeze, Card Price + Review Count (`評價 25`), & Checkout */
(function () {
  'use strict';
  if (window.__leiduWl426Loaded) return;
  window.__leiduWl426Loaded = true;
  var REV_COUNTS_URL = 'https://designerko.github.io/leidu-cdn/leidu_promo_assets/leidu_review_counts.json';
  var REV_CACHE_KEY = 'leidu_rev_counts_cache_v1';
  var REV_CHIP_CSS = [
    'html body #contents .prdList > li .description .spec > li.leidu-price-spec-row,',
    'html body #contents .prdList > li .description .spec > li.deco_price{display:flex!important;align-items:center!important;justify-content:flex-start!important;flex-wrap:wrap!important;gap:4px 6px!important}',
    'html body #contents .prdList > li .description .spec > li.leidu-price-spec-row > strong.title.displaynone,',
    'html body #contents .prdList > li .description .spec > li.leidu-spec-empty-hide{display:none!important}',
    'html body #contents .prdList > li .description .spec > li em.leidu-gm-rev-chip{display:inline-flex!important;align-items:baseline!important;gap:3px!important;margin-left:auto!important;font-style:normal!important;font-family:"Pretendard",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",sans-serif!important;font-size:11px!important;font-weight:500!important;line-height:1.2!important;color:#8A8A8A!important;white-space:nowrap!important;font-variant-numeric:tabular-nums!important;text-decoration:none!important}',
    'html body #contents .prdList > li .description .spec > li em.leidu-gm-rev-chip b{font-size:12px!important;font-weight:600!important;color:#111111!important;font-style:normal!important;text-decoration:none!important}',
    '.leidu-runway-col .leidu-runway-rev-chip{display:inline-flex!important;align-items:baseline!important;align-self:flex-start!important;width:fit-content!important;max-width:max-content!important;gap:3px!important;margin:2px 0 2px 0!important;padding:2px 7px!important;border-radius:999px!important;background:rgba(255,255,255,0.16)!important;border:1px solid rgba(255,255,255,0.32)!important;font-style:normal!important;font-size:10px!important;font-weight:500!important;line-height:1.25!important;color:rgba(255,255,255,0.95)!important;letter-spacing:0.02em!important;flex:0 0 auto!important}',
    '.leidu-runway-col .leidu-runway-rev-chip b{font-weight:700!important;color:#ffffff!important}',
    '.leidu-pdp-top-rev-link{display:inline-flex!important;align-items:center!important;gap:5px!important;margin:0 0 8px!important;padding:3px 9px!important;border-radius:999px!important;background:#FAF7F2!important;border:1px solid #DFD4C3!important;color:#3D3228!important;font-size:11.5px!important;font-weight:500!important;text-decoration:none!important;line-height:1.4!important;width:fit-content!important}',
    '.leidu-pdp-top-rev-link b{color:#111111!important;font-weight:700!important}',
    '@media(max-width:767px){html body #contents .prdList > li .description .spec > li em.leidu-gm-rev-chip{font-size:10px!important}html body #contents .prdList > li .description .spec > li em.leidu-gm-rev-chip b{font-size:11px!important}}'
  ].join('');
  var GM_CHECKOUT_CSS = "html.leidu-is-checkout,html.leidu-is-checkout body,html body#userStyle ,html body#userStyle #wrap,html body#userStyle #container,html body#userStyle #contents,html body#userStyle .orderWrap,html body#userStyle #mCafe24Order{background:#FFFFFF!important;background-color:#FFFFFF!important;font-family:\"Pretendard\",-apple-system,BlinkMacSystemFont,\"Apple SD Gothic Neo\",\"Noto Sans KR\",sans-serif!important;color:#111111!important;-webkit-font-smoothing:antialiased}html body#userStyle #header{background:#FFFFFF!important;border:0!important;border-bottom:1px solid #EAEAEA!important;max-width:100%!important;padding:0!important}html body#userStyle #header .header{max-width:1180px!important;margin:0 auto!important;height:60px!important;padding:0 24px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;border:0!important;position:relative!important}html body#userStyle #header .header h1{position:static!important;margin:0!important;padding:0!important}html body#userStyle #header .header h1 a{font-family:\"Pretendard\",\"Helvetica Neue\",Arial,sans-serif!important;font-size:21px!important;font-weight:800!important;letter-spacing:0.12em!important;color:#111111!important;text-decoration:none!important}html body#userStyle #header .headerMenu{position:static!important;display:flex!important;align-items:center!important;gap:20px!important;width:auto!important}html body#userStyle #header .headerMenu span.btnBasket,html body#userStyle #header .headerMenu a{position:static!important;display:inline-flex!important;align-items:baseline!important;width:auto!important;height:auto!important;min-width:max-content!important;white-space:nowrap!important;background:none!important;text-indent:0!important;font-size:12.5px!important;font-weight:500!important;color:#111111!important;text-decoration:none!important;margin:0!important;padding:0!important}html body#userStyle #header .headerMenu a::before,html body#userStyle #header .headerMenu a::after{display:none!important;content:none!important}html body#userStyle #header .headerMenu .count{position:static!important;display:inline!important;background:none!important;color:#111111!important;font-size:12.5px!important;font-weight:600!important;padding:0 0 0 3px!important}html body#userStyle #header .headerMenu .EC-Layout-Basket-count::before{content:\"(\"}html body#userStyle #header .headerMenu .EC-Layout-Basket-count::after{content:\")\"}html body#userStyle #header .titleArea{max-width:1180px!important;margin:0 auto!important;padding:28px 24px 16px!important;border:0!important;background:#FFFFFF!important;text-align:left!important}html body#userStyle #header .titleArea h1{font-size:19px!important;font-weight:600!important;letter-spacing:-0.02em!important;color:#111111!important;margin:0!important;padding:0!important}html body#userStyle #mCafe24Order .rightGroup,html body#userStyle #mCafe24Order .rightGroup > div,html body#userStyle #mCafe24Order .leftGroup,html body#userStyle #mCafe24Order .leftGroup > *{background:#FFFFFF!important;border-top-width:0!important}html body#userStyle #mCafe24Order .ec-base-fold,html body#userStyle #mCafe24Order .pannelArea{border:0!important;border-top:1.5px solid #111111!important;margin:0 0 34px!important;padding:0!important;background:#FFFFFF!important;box-shadow:none!important}html body#userStyle #mCafe24Order .ec-base-fold > .title,html body#userStyle #mCafe24Order .pannelArea > .title{padding:16px 0 14px!important;background:#FFFFFF!important;border:0!important;border-bottom:1px solid #EBEBEB!important}html body#userStyle #mCafe24Order .ec-base-fold > .title::before,html body#userStyle #mCafe24Order .ec-base-fold > .title::after,html body#userStyle #mCafe24Order .ec-base-fold > .title h2::before{display:none!important;content:none!important;background:none!important}html body#userStyle #mCafe24Order .ec-base-fold > .title h2,html body#userStyle #mCafe24Order .pannelArea > .title h2{padding:0!important;margin:0!important;font-size:14px!important;font-weight:700!important;color:#111111!important}html body#userStyle #mCafe24Order .ec-base-fold > .contents,html body#userStyle #mCafe24Order .pannelArea > .contents{padding:18px 0 0!important;max-width:100%!important;width:100%!important}html body#userStyle #mCafe24Order .ec-base-table,html body#userStyle #mCafe24Order .ec-base-table table,html body#userStyle #mCafe24Order .ec-base-table th,html body#userStyle #mCafe24Order .ec-base-table td,html body#userStyle #mCafe24Order .ec-address{max-width:100%!important}html body#userStyle #mCafe24Order .leftGroup input[type=\"text\"],html body#userStyle #mCafe24Order .leftGroup input[type=\"password\"],html body#userStyle #mCafe24Order .leftGroup input[type=\"tel\"],html body#userStyle #mCafe24Order .leftGroup input[type=\"email\"],html body#userStyle #mCafe24Order .leftGroup select{border:1px solid #D8D8D8!important;border-radius:0!important;background:#FFFFFF!important;height:44px!important;font-size:13px!important;color:#111111!important;box-shadow:none!important;box-sizing:border-box!important}html body#userStyle #mCafe24Order .leftGroup textarea{border:1px solid #D8D8D8!important;border-radius:0!important;background:#FFFFFF!important;font-size:13px!important;color:#111111!important;box-shadow:none!important;box-sizing:border-box!important}html body#userStyle #mCafe24Order #btn_search_rzipcode{height:44px!important;border:1px solid #111111!important;border-radius:0!important;background:#FFFFFF!important;color:#111111!important;font-size:12.5px!important;font-weight:600!important}html body#userStyle #mCafe24Order #ec-jigsaw-area-orderProduct .thumbnail img{border-radius:0!important;object-fit:cover!important}html body#userStyle #mCafe24Order #ec-jigsaw-area-orderProduct .totalPrice{background:#F8F8F8!important;border-radius:0!important;padding:13px 16px!important;border:0!important}html body#userStyle #ec-jigsaw-area-paymethod .payMethod > li,html body#userStyle #ec-jigsaw-area-paymethod .column,html body#userStyle #ec-jigsaw-area-paymethod .column > div,html body#userStyle #ec-jigsaw-area-paymethod .column > div > div,html body#userStyle #ec-jigsaw-area-paymethod .inner,html body#userStyle #payment_input_direct_card,html body#userStyle #ec-order-payment-directpay-card-form{border:0!important;outline:0!important;background:#FFFFFF!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important}html body#userStyle #ec-jigsaw-area-paymethod .ec-paymethod-newArea *,html body#userStyle #ec-jigsaw-area-paymethod .payMethod *{border-left-width:0!important}html body#userStyle #ec-jigsaw-area-paymethod.leidu-gm-pay-ready .column > div > div > span.ec-base-label,html body#userStyle #ec-jigsaw-area-paymethod.leidu-gm-pay-ready ul.payMethod > li > input[name=\"addr_paymethod\"],html body#userStyle #ec-jigsaw-area-paymethod.leidu-gm-pay-ready ul.payMethod > li > label{display:none!important}#leidu-gm-pay-selector{display:flex;flex-direction:column;gap:18px;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #EFEFEF}.leidu-gm-pay-group-label{font-size:12px;font-weight:600;color:#666666;margin-bottom:8px}.leidu-gm-pay-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.leidu-gm-pay-btn{height:46px;padding:0 10px;border:1px solid #D8D8D8;border-radius:0;background:#FFFFFF;color:#111111;font-size:12.5px;font-weight:500;display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;white-space:nowrap;box-sizing:border-box}.leidu-gm-pay-btn.is-selected{border:1.5px solid #111111;background:#111111;color:#FFFFFF;font-weight:600}.leidu-gm-pay-btn.is-coming-soon{border:1px dashed #DFDFDF;background:#FAFAFA;color:#9E9E9E;cursor:not-allowed}.leidu-gm-pay-soon-tag{font-size:10.5px;color:#A8A8A8;font-weight:400}.leidu-gm-pay-badge{display:inline-flex;align-items:center;justify-content:center;height:17px;padding:0 5px;font-size:9.5px;font-weight:800}.leidu-gm-pay-btn.is-coming-soon .leidu-gm-pay-badge{opacity:0.55}.leidu-gm-pay-badge.is-npay{background:#03C75A;color:#FFFFFF}.leidu-gm-pay-badge.is-kakao{background:#FEE500;color:#191919}html body#userStyle #ec-order-payment-directpay-card-form table,html body#userStyle #ec-order-payment-directpay-card-form tbody,html body#userStyle #ec-order-payment-directpay-card-form tr{display:block!important;width:100%!important;border:0!important}html body#userStyle #ec-order-payment-directpay-card-form tr:last-child{display:none!important}html body#userStyle #ec-order-payment-directpay-card-form th{display:block!important;width:100%!important;padding:4px 0 8px!important;font-size:12px!important;font-weight:600!important;color:#666666!important;background:transparent!important;border:0!important;text-align:left!important}html body#userStyle #ec-order-payment-directpay-card-form td{display:block!important;width:100%!important;padding:0 0 16px!important;border:0!important}html body#userStyle #ec-order-payment-directpay-card-form .ec-paymethod-card{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important;width:100%!important}html body#userStyle #ec-order-payment-directpay-card-form .ec-paymethod-card .ec-base-label{display:block!important;width:100%!important;max-width:none!important;min-width:0!important;height:auto!important;margin:0!important;padding:0!important}html body#userStyle #ec-order-payment-directpay-card-form .ec-paymethod-card input[type=\"radio\"]{position:absolute!important;opacity:0!important;pointer-events:none!important}html body#userStyle #ec-order-payment-directpay-card-form .ec-paymethod-card label{width:100%!important;max-width:none!important;min-width:0!important;height:46px!important;padding:0 10px!important;margin:0!important;box-sizing:border-box!important;border:1px solid #DCDCDC!important;border-radius:0!important;background:#FFFFFF!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:7px!important;font-size:12.5px!important;font-weight:500!important;color:#111111!important;white-space:nowrap!important;cursor:pointer!important}html body#userStyle #ec-order-payment-directpay-card-form .ec-paymethod-card input:checked + label{border:1.5px solid #111111!important;background:#F6F6F6!important;font-weight:700!important}html body#userStyle #ec-order-payment-directpay-card-form .ec-paymethod-card label img{width:18px!important;height:18px!important;margin:0!important;flex:none!important}html body#userStyle #mCafe24Order .rightGroup #ec-jigsaw-area-payment{border:1px solid #111111!important;padding:24px 24px 20px!important;margin:0!important;background:#FFFFFF!important}html body#userStyle #mCafe24Order #ec-jigsaw-area-payment > .title{padding:0 0 14px!important;border-bottom:1px solid #111111!important}html body#userStyle #mCafe24Order #ec-jigsaw-area-payment > .title h2{font-size:15px!important;font-weight:700!important}html body#userStyle #mCafe24Order #ec-jigsaw-area-payment > .contents{padding:14px 0 0!important}html body#userStyle #mCafe24Order #ec-jigsaw-area-payment table th,html body#userStyle #mCafe24Order #ec-jigsaw-area-payment table td{padding:7px 0!important;font-size:13px!important;border:0!important;background:transparent!important}html body#userStyle #mCafe24Order #ec-jigsaw-area-payment .totalPay{margin-top:12px!important;padding:15px 0 0!important;border-top:1px solid #E5E5E5!important;background:transparent!important}html body#userStyle #mCafe24Order #btn_payment,html body#userStyle #mCafe24Order .btnSubmit{width:100%!important;height:52px!important;line-height:52px!important;background:#111111!important;border:1px solid #111111!important;border-radius:0!important;color:#FFFFFF!important;font-size:14px!important;font-weight:600!important;letter-spacing:0.02em!important}html body#userStyle #mCafe24Order #ec-jigsaw-area-agreement,html body#userStyle #mCafe24Order .agreeArea{border:1px solid #E5E5E5!important;border-top:0!important;border-radius:0!important;padding:16px 22px!important;margin:0!important;background:#FAFAFA!important;box-shadow:none!important}@media(min-width:960px){html body#userStyle #mCafe24Order{max-width:1180px!important;width:100%!important;box-sizing:border-box!important;margin:0 auto!important;padding:8px 24px 100px!important;display:grid!important;grid-template-columns:minmax(0,1fr) 380px!important;gap:56px!important;align-items:start!important;border:0!important;box-shadow:none!important}html body#userStyle #mCafe24Order .leftGroup{width:100%!important;max-width:none!important;float:none!important;margin:0!important;padding:0!important}html body#userStyle #mCafe24Order .rightGroup{width:380px!important;float:none!important;position:sticky!important;top:24px!important;margin:0!important;padding:0!important}html body#userStyle #mCafe24Order .leftGroup input[type=\"text\"]:not(#rzipcode1):not([id*=\"phone\"]):not(#oemail1):not(#oemail2),html body#userStyle #mCafe24Order .leftGroup input[type=\"password\"],html body#userStyle #mCafe24Order .leftGroup select:not([id*=\"phone\"]):not([name*=\"phone\"]),html body#userStyle #mCafe24Order .leftGroup textarea{width:100%!important;max-width:100%!important}html body#userStyle #mCafe24Order #rzipcode1{width:calc(100% - 104px)!important;display:inline-block!important}html body#userStyle #mCafe24Order #btn_search_rzipcode{width:96px!important;margin-left:8px!important;padding:0!important;vertical-align:top!important}}@media(max-width:959px){html body#userStyle #header .header{height:54px!important;padding:0 16px!important}html body#userStyle #header .titleArea{padding:20px 16px 12px!important}html body#userStyle #mCafe24Order{max-width:100%!important;width:100%!important;box-sizing:border-box!important;padding:4px 16px 88px!important;display:block!important}html body#userStyle #mCafe24Order .leftGroup,html body#userStyle #mCafe24Order .rightGroup{width:100%!important;max-width:100%!important;float:none!important;position:static!important;margin:0!important;padding:0!important}.leidu-gm-pay-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}html body#userStyle #ec-order-payment-directpay-card-form .ec-paymethod-card{grid-template-columns:repeat(2,minmax(0,1fr))!important}}";
  var revCountsMap = null;
  function injectOnce(id, css) { if (!document.getElementById(id)) { var s = document.createElement('style'); s.id = id; s.textContent = css; (document.head || document.documentElement).appendChild(s); } }
  function attachHeroRunwayGuard() {
    var hero = document.querySelector('.leidu-runway-4split');
    if (!hero || hero.dataset.wl428Guard === '1') return;
    hero.dataset.wl428Guard = '1';
    function revive(v) {
      if (v && v.classList.contains('is-active') && !hero.classList.contains('leidu-motion-paused') && !document.hidden && (v.ended || (v.paused && v.readyState >= 2))) {
        try { if (v.ended) v.currentTime = 0; var p = v.play(); if (p && p.catch) p.catch(function () {}); } catch (_) {}
      }
    }
    hero.querySelectorAll('video.leidu-vid').forEach(function (v) { v.addEventListener('ended', function () { revive(v); }); });
    setInterval(function () { hero.querySelectorAll('video.leidu-vid.is-active').forEach(revive); }, 1500);
  }
  function extractCardPno(li) {
    var m = String(li.id || '').match(/anchorBoxId_(\d+)/);
    if (m) return m[1];
    var a = li.querySelector('a[href*="/product/"], a[href*="product_no="]');
    var h = a ? String(a.getAttribute('href') || '') : '';
    var m2 = h.match(/\/product\/[^/]+\/(\d+)/) || h.match(/[?&]product_no=(\d+)/);
    return m2 ? m2[1] : '';
  }
  function findVisiblePriceLi(li) {
    var spec = li.querySelector('.description .spec, ul.spec');
    if (!spec) return null;
    var items = Array.prototype.slice.call(spec.querySelectorAll(':scope > li'));
    var found = spec.querySelector(':scope > li.deco_price');
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.classList.contains('leidu-member-price-row') || item.querySelector('.leidu-today-stock')) continue;
      var t = item.querySelector('strong.title');
      var tTxt = t ? String(t.textContent || '').replace(/[:\s]+/g, '').trim() : '';
      if (!found && t && /^(售價|판매가|價格|Price)$/i.test(tTxt)) {
        found = item;
      } else if (!found && /NT\$\s*[\d,]+/.test(item.textContent || '') && !/商品價格|稅額/.test(tTxt)) {
        found = item;
      }
      // Hide empty ':' lines that Cafe24 outputs when optional fields are blank
      if (item !== found) {
        var clone = item.cloneNode(true);
        clone.querySelectorAll('strong.title, .displaynone').forEach(function (n) { n.remove(); });
        var rem = String(clone.textContent || '').replace(/[:\s\u00a0]+/g, '').trim();
        if (!rem && !item.querySelector('img,a,button')) item.classList.add('leidu-spec-empty-hide');
      }
    }
    if (found) {
      found.classList.remove('displaynone');
      found.classList.add('leidu-price-spec-row');
    }
    return found;
  }
  function renderReviewChips() {
    injectOnce('leidu-wl426-rev-chip-style', REV_CHIP_CSS);
    var items = document.querySelectorAll('.prdList > li');
    items.forEach(function (li) {
      var priceLi = findVisiblePriceLi(li);
      if (!revCountsMap || !priceLi) return;
      if (priceLi.querySelector('em.leidu-gm-rev-chip')) return;
      var cnt = Number(revCountsMap[extractCardPno(li)] || 0);
      if (cnt <= 0) return;
      var chip = document.createElement('em');
      chip.className = 'leidu-gm-rev-chip';
      chip.innerHTML = '評價 <b>' + cnt.toLocaleString('en-US') + '</b>';
      priceLi.appendChild(chip);
    });
    if (!revCountsMap) return;
    // Hero 4-split runway cards
    document.querySelectorAll('.leidu-runway-4split .leidu-runway-col').forEach(function (col) {
      var brandEl = col.querySelector('.leidu-col-brand');
      if (!brandEl) return;
      var pno = col.getAttribute('data-product-no') || '';
      if (!pno) {
        var hm = String(col.getAttribute('href') || '').match(/[?&]product_no=(\d+)/);
        if (hm) pno = hm[1];
      }
      var cnt = Number(revCountsMap[pno] || 0);
      var existing = col.querySelector('em.leidu-runway-rev-chip');
      if (cnt <= 0) { if (existing) existing.remove(); return; }
      var wantHtml = '評價 <b>' + cnt.toLocaleString('en-US') + '</b>';
      if (existing) {
        if (existing.innerHTML !== wantHtml) existing.innerHTML = wantHtml;
      } else {
        var chip = document.createElement('em');
        chip.className = 'leidu-runway-rev-chip';
        chip.innerHTML = wantHtml;
        brandEl.insertAdjacentElement('afterend', chip);
      }
    });
    // PDP review count sync (tab label, #prdReview summary & heading, top infoArea link)
    var pdpDetail = document.querySelector('.xans-product-detail');
    if (pdpDetail) {
      var pdpNo = String(window.iProductNo || '');
      if (!/^\d+$/.test(pdpNo) || pdpNo === '0') {
        var qm = location.search.match(/[?&]product_no=(\d+)/) || location.pathname.match(/\/product\/[^/]+\/(\d+)/);
        if (qm) pdpNo = qm[1];
      }
      var mapCnt = Number(revCountsMap[pdpNo] || 0);
      var h3 = document.querySelector('#prdReview > h3');
      var nativeCnt = 0;
      if (h3) {
        var nm = (h3.textContent || '').match(/\((\d+)\)/);
        if (nm) nativeCnt = Number(nm[1] || 0);
      }
      var finalCnt = Math.max(mapCnt, nativeCnt);
      if (finalCnt > 0) {
        if (h3 && h3.dataset.leiduRevSynced !== String(finalCnt)) {
          h3.dataset.leiduRevSynced = String(finalCnt);
          h3.textContent = '買家真實評價 (' + finalCnt.toLocaleString('en-US') + ')';
        }
        var tabLink = document.querySelector('.xans-product-additional .menu a[data-name="#prdReview"]');
        if (tabLink && tabLink.dataset.leiduRevSynced !== String(finalCnt)) {
          tabLink.dataset.leiduRevSynced = String(finalCnt);
          tabLink.innerHTML = '買家評價<span>(' + finalCnt.toLocaleString('en-US') + ')</span>';
        }
        var prdRevSec = document.getElementById('prdReview');
        var det = prdRevSec ? prdRevSec.closest('details.leidu-board-note') : null;
        var sum = det ? det.querySelector(':scope > summary') : null;
        if (sum && sum.dataset.leiduRevSynced !== String(finalCnt)) {
          sum.dataset.leiduRevSynced = String(finalCnt);
          sum.textContent = '買家真實評價 (' + finalCnt.toLocaleString('en-US') + ')';
        }
        var infoArea = pdpDetail.querySelector('.infoArea');
        var priceTr = infoArea ? infoArea.querySelector('.info_table tr.deco_price') : null;
        if (infoArea && !infoArea.querySelector('.leidu-pdp-top-rev-link')) {
          var topLink = document.createElement('a');
          topLink.href = '#prdReview';
          topLink.className = 'leidu-pdp-top-rev-link';
          topLink.innerHTML = '★ 實購評價 <b>' + finalCnt.toLocaleString('en-US') + '</b> 則 ›';
          topLink.addEventListener('click', function (ev) {
            ev.preventDefault();
            var d = document.getElementById('prdReview')?.closest('details');
            if (d) d.open = true;
            var target = d || document.getElementById('prdReview');
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
          var titleTd = infoArea.querySelector('.info_table .deco_title td');
          if (titleTd) titleTd.appendChild(topLink);
          else if (priceTr && priceTr.parentNode) infoArea.insertBefore(topLink, infoArea.firstChild);
        }
      }
    }
  }
  function initReviewCounts() {
    if (/\/order\/orderform\.html$/.test(location.pathname)) return;
    renderReviewChips();
    try {
      var c = JSON.parse(sessionStorage.getItem(REV_CACHE_KEY) || 'null');
      if (c && c.map && (Date.now() - Number(c.ts || 0) < 600000)) { revCountsMap = c.map; renderReviewChips(); }
    } catch (_) {}
    fetch(REV_COUNTS_URL + '?v=' + Math.floor(Date.now() / 600000), { mode: 'cors', credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || typeof d !== 'object') return;
        revCountsMap = d;
        try { sessionStorage.setItem(REV_CACHE_KEY, JSON.stringify({ ts: Date.now(), map: d })); } catch (_) {}
        renderReviewChips();
      }).catch(function () {});
    if (typeof MutationObserver !== 'undefined') {
      var raf = 0, obs = new MutationObserver(function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; renderReviewChips(); }); });
      var att = function () { if (document.body) obs.observe(document.body, { childList: true, subtree: true }); };
      if (document.body) att(); else document.addEventListener('DOMContentLoaded', att, { once: true });
    }
  }
  function initGmCheckout() {
    if (!/\/order\/orderform\.html$/.test(location.pathname)) return;
    injectOnce('leidu-wl426-gm-checkout-style', GM_CHECKOUT_CSS);
    var userInteractedPay = false;
    document.addEventListener('click', function (e) {
      if (e.isTrusted && e.target.closest('input[name="addr_paymethod"],label,[data-gm-pay]')) userInteractedPay = true;
    }, true);
    function mountCheckoutUi() {
      var orderRoot = document.getElementById('mCafe24Order');
      if (!orderRoot) return;
      for (var p = orderRoot; p && p !== document.documentElement; p = p.parentElement) p.style.setProperty('background-color', '#FFFFFF', 'important');
      document.querySelectorAll('#mCafe24Order .rightGroup, #mCafe24Order .rightGroup > div').forEach(function (el) { el.style.setProperty('background', '#FFFFFF', 'important'); el.style.setProperty('padding-top', '0', 'important'); });
      if (!userInteractedPay && !window.__leiduCardDefaultApplied) {
        var cashR = document.querySelector('input[name="addr_paymethod"][value="cash"]'), cardR = document.querySelector('input[name="addr_paymethod"][value="card"]');
        if (cashR && cashR.checked && cardR) { cardR.click(); window.__leiduCardDefaultApplied = cardR.checked; }
        else if (cardR && cardR.checked) window.__leiduCardDefaultApplied = true;
      }
      var titles = { '#ec-jigsaw-title-orderProduct h2': '訂購商品', '#ec-jigsaw-title-shippingInfo h2': '收件與順豐直郵資訊', '#ec-jigsaw-title-paymethod h2': '付款方式', '#ec-jigsaw-title-payment h2': '結帳金額摘要', '#header .titleArea h1': '訂單結帳' };
      Object.keys(titles).forEach(function (sel) { var h = document.querySelector(sel); if (h && h.textContent !== titles[sel]) h.textContent = titles[sel]; });
      var pmArea = document.getElementById('ec-jigsaw-area-paymethod'), pmContents = pmArea ? pmArea.querySelector('.contents') : null;
      if (!pmArea || !pmContents) return;
      var syncFn = pmArea.__leiduGmSyncPay;
      if (document.getElementById('leidu-gm-pay-selector')) { if (syncFn) syncFn(); return; }
      var radioByVal = {};
      pmArea.querySelectorAll('input[name="addr_paymethod"]').forEach(function (r) { radioByVal[String(r.value || '').trim()] = r; });
      var generalDefs = [{ val: 'card', label: '海外信用卡 (VISA / Master / JCB)' }, { val: 'eximbay', label: 'Eximbay 海外安全支付' }, { val: 'paypal', label: 'PayPal' }, { val: 'cash', label: '國際匯款' }].filter(function (d) { return !!radioByVal[d.val]; });
      if (!generalDefs.length) return;
      var npayHtml = '<button type="button" class="leidu-gm-pay-btn is-coming-soon" disabled><span class="leidu-gm-pay-badge is-npay">LINE Pay</span>LINE Pay<span class="leidu-gm-pay-soon-tag">(即將開放)</span></button>';
      var kakaoHtml = '<button type="button" class="leidu-gm-pay-btn is-coming-soon" disabled><span class="leidu-gm-pay-badge" style="background:#111;color:#fff"> Pay</span>Apple Pay / AlipayHK<span class="leidu-gm-pay-soon-tag">(即將開放)</span></button>';
      var wrap = document.createElement('div');
      wrap.id = 'leidu-gm-pay-selector';
      wrap.innerHTML = '<div><div class="leidu-gm-pay-group-label">行動快速結帳</div><div class="leidu-gm-pay-grid">' + npayHtml + kakaoHtml + '</div></div><div><div class="leidu-gm-pay-group-label">海外信用卡支付</div><div class="leidu-gm-pay-grid">' + generalDefs.map(function (d) { return '<button type="button" class="leidu-gm-pay-btn" data-gm-pay="' + d.val + '">' + d.label + '</button>'; }).join('') + '</div></div>';
      pmContents.insertBefore(wrap, pmContents.firstChild);
      pmArea.classList.add('leidu-gm-pay-ready');
      pmArea.__leiduGmSyncPay = function () {
        var chk = pmArea.querySelector('input[name="addr_paymethod"]:checked'), cur = chk ? String(chk.value || '') : '';
        wrap.querySelectorAll('button[data-gm-pay]').forEach(function (b) { b.classList.toggle('is-selected', b.getAttribute('data-gm-pay') === cur); });
      };
      wrap.querySelectorAll('button[data-gm-pay]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var r = radioByVal[btn.getAttribute('data-gm-pay')];
          if (r) { var lbl = r.id ? document.querySelector('label[for="' + r.id + '"]') : null; if (lbl) lbl.click(); else r.click(); r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
          pmArea.__leiduGmSyncPay();
        });
      });
      pmArea.addEventListener('change', function (e) { if (e.target && e.target.name === 'addr_paymethod') pmArea.__leiduGmSyncPay(); });
      pmArea.__leiduGmSyncPay();
    }
    mountCheckoutUi();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountCheckoutUi, { once: true });
    window.addEventListener('load', function () { mountCheckoutUi(); setTimeout(mountCheckoutUi, 450); });
    setTimeout(mountCheckoutUi, 400);
  }
  attachHeroRunwayGuard();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attachHeroRunwayGuard, { once: true });
  initReviewCounts();
  initGmCheckout();
})();


;(function(){
  if (!/^\/shop7(?=\/|$)/.test(location.pathname) && document.documentElement.lang !== 'zh-TW') return;

  var PNO_ZH = {"7980":"LONDONFLAT 雪花絨感搖粒絨休閒長褲 (2色)","7979":"LONDONFLAT 燈芯絨內刷毛保暖休閒長褲 (3色)","7978":"LONDONFLAT 雪花絨感搖粒絨拉鍊外套 (2色)","7977":"ATOFF Olsen 質感剪裁環保皮草外套 (2色)","7968":"LAKE Eto 極簡親膚羅紋無袖背心 (4色)","7967":"LAKE Mars 修身垂墜休閒長褲 (5色)","7966":"NUESE Nami 絲絨光澤羅紋無袖背心 (4色)","7965":"NUESE Grace 極簡親膚羅紋無袖背心 (5色)","7959":"UNDERSON Air Mary 親膚柔暖高領針織衫 (5色)","7958":"UNDERSON Loft 安哥拉兔毛質感針織毛衣 (2色)","7957":"UNDERSON Tune 法式蕾絲細肩帶針織背心 (2色)","7955":"BRUNCH Roben 質感剪裁保暖刷毛外套 (2色)","7953":"BRUNCH Hailey 修身垂墜休閒長褲 (2色)","7952":"BRUNCH 慵懶寬鬆休閒大學T (3色)","7951":"BRUNCH Margaret 質感剪裁環保皮草外套 (單色)","7949":"SOAP & WATER Piro 極簡親膚長袖上衣 (3色)","7948":"SOAP & WATER Bucket 極簡親膚長袖上衣 (3色)","7947":"LAKE Bay 修身垂墜休閒長褲 (2色)","7940":"NUESE Canna 內刷毛保暖休閒長褲 (3色)","7939":"NUESE Troca 內刷毛保暖連帽拉鍊外套 (4色)","7938":"LAKE Bay 氣質優雅半身裙 (2色)","7936":"LAKE Saint 親膚柔暖質感針織毛衣 (6色)","7935":"NUESE 單釦極簡長袖上衣 (3色)","7934":"LAKE Lily 氣質優雅半身裙 (3色)","7932":"LAKE Lily 親膚柔暖質感針織毛衣 (3色)","7931":"LAKE Golin 修身垂墜休閒長褲 (3色)","7929":"UNDERSON Bocashi 親膚柔暖親膚針織袖套／脖圍 (3色)","7927":"UNDERSON Roa 修身垂墜休閒長褲 (2色)","7926":"UNDERSON Rove 親膚柔暖保暖針織連帽圍脖 (3色)","7925":"BRUNCH Leon 韓系質感絲滑領巾 (5色)","7922":"BRUNCH Post 水洗染色休閒長褲 (單色)","7921":"BRUNCH 絲絨光澤連帽上衣 (3色)","7919":"BRUNCH Leri 親膚柔暖針織無袖背心 (3色)","7911":"BASKET Firming 質感剪裁刷毛夾克 (3色)","7909":"BASKET 圈圈紗質感羊毛混紡長版大衣 (3色)","7906":"BASKET Mer Curve 修身垂墜休閒長褲 (2色)","7905":"NUESE Julie 極簡親膚修身上衣 (3色)","7903":"NUESE Paint 調節釦丹寧牛仔褲 (單色)","7902":"LAKE Leo 修身垂墜休閒長褲 (單色)","7901":"LAKE Forbi 質感剪裁拉鍊開襟外套 (6色)","7900":"LAKE Ally 質感剪裁拉鍊開襟外套 (6色)","7897":"NUESE Blur 羊駝毛混紡針織開襟外套 (3色)","7896":"NUESE Fred 內刷毛保暖休閒長褲 (4色)","7895":"NUESE Fog 修飾蓋袖長袖上衣 (3色)","7894":"NUESE Monet 極簡親膚長袖上衣 (3色)","7892":"UNDERSON 26 Fog 韓系質感保暖圍巾 (8色)","7890":"UNDERSON Annie 質感剪裁環保皮草夾克 (2色)","7889":"BRUNCH Molly 質感剪裁環保皮草外套 (2色)","7888":"BRUNCH Mellow 親膚柔暖質感針織毛衣 (3色)","7887":"UNDERSON Rove 親膚柔暖半高領針織衫 (2色)","7886":"UNDERSON Core 抽繩鬆緊長袖上衣 (2色)","7884":"UNDERSON Cube 質感剪裁羽絨外套 (3色)","7883":"UNDERSON Fig 修身垂墜燈芯絨直筒長褲 (單色)","7882":"BRUNCH Moss 修身垂墜丹寧牛仔褲 (單色)","7881":"BRUNCH Simon 修身垂墜休閒長褲 (2色)","7879":"BRUNCH Tommy 氣質優雅半身裙 (2色)","7878":"SOAP & WATER Calto 極簡親膚長袖上衣 (2色)","7876":"SOAP & WATER Apoll 質感剪裁環保皮草外套 (單色)","7875":"LAKE Bao 質感剪裁拉鍊開襟外套 (7色)","7874":"LAKE Poke 內刷毛保暖丹寧牛仔褲 (2色)","7873":"LAKE Cain 極簡親膚長袖上衣 (4色)","7871":"BASKET Martin 質感剪裁中長版大衣 (3色)","7869":"NUESE Winds 質感剪裁針織開襟外套 (3色)","7868":"NUESE Bello 優雅荷葉邊修身上衣 (2色)","7867":"NUESE Redone 氣質優雅半身裙 (2色)","7866":"NUESE 質感混紡羊毛混紡休閒長褲 (2色)","7863":"NUESE 羊駝毛混紡牛角釦鋪棉保暖內裡長版大衣 (3色)","7861":"NUESE Flue 羊毛混紡長袖上衣 (6色)","7860":"LAKE Here 親膚柔暖高領針織衫 (10色)","7859":"UNDERSON Garden 質感剪裁連帽環保皮草外套 (2色)","7858":"BRUNCH Edge 經典條紋長袖上衣 (3色)","7857":"UNDERSON Alpha 修身垂墜直筒丹寧牛仔褲 (單色)","7856":"UNDERSON Peak 極簡親膚亨利領長袖上衣 (3色)","7854":"UNDERSON Dali 極簡親膚刷毛長袖上衣 (2色)","7852":"BRUNCH Low 修身垂墜燈芯絨直筒長褲 (3色)","7850":"BRUNCH Ted 質感剪裁皮革夾克 (2色)","7849":"BRUNCH Alice 極簡親膚長袖上衣 (3色)","7847":"BASKET Delphi 極簡親膚氣質襯衫 (2色)","7845":"BASKET Tember 質感剪裁鋪棉夾克 (2色)","7844":"BASKET 蓬鬆毛絨感休閒長褲 (3色)","7843":"ATOFF Robe 羊毛混紡俐落外套 (2色)","7842":"ATOFF Flip 質感剪裁保暖刷毛外套 (2色)","7840":"ATOFF Edito 氣質優雅半身裙 (2色)","7839":"ATOFF Haas 燈芯絨襯衫 (2色)","7838":"ATOFF 自然皺褶感修身上衣 (單色)","7837":"BASKET Bruce 質感剪裁鋪棉夾克 (2色)","7836":"BASKET Crease 絲絨光澤半身裙 (3色)","7835":"BASKET Grow 經典條紋長袖上衣 (3色)","7833":"BASKET 絲絨感立體抽繩束口棉褲 (2色)","7832":"BRUNCH Sain 極簡親膚長袖上衣 (6色)","7829":"BASKET Baguette 極簡親膚休閒大學T (2色)","7828":"BRUNCH Flo 修身垂墜工裝抽繩寬褲 (2色)","7827":"BRUNCH Crew 羊毛混紡半開襟連帽套頭衫 (2色)","7826":"BRUNCH Crew 羊毛混紡立體抽繩束口棉褲 (3色)","7825":"BRUNCH 極簡親膚插肩袖長袖T恤 (3色)","7824":"BRUNCH Milly 質感剪裁環保皮草外套 (2色)","7822":"NUESE Leo 羊毛混紡3oz輕暖鋪棉俐落外套 (3色)","7821":"LAKE Crong 內刷毛保暖丹寧牛仔褲 (2色)","7820":"LAKE Monet 質感剪裁針織開襟外套 (8色)","7818":"NUESE Fame 內刷毛保暖長袖上衣 (3色)","7817":"NUESE 安哥拉兔毛一字領針織衫 (3色)","7816":"NUESE 工裝木匠風內刷毛保暖丹寧牛仔褲 (單色)","7815":"NUESE Wire 修身休閒短褲 (2色)","7814":"NUESE 多釦裝飾長袖上衣 (4色)","7813":"NUESE 毛絨拼接保暖圍巾 (2色)","7812":"NUESE 蓬鬆毛絨感法式蕾絲修身上衣 (3色)","7811":"NUESE Snuggle 修身垂墜休閒長褲 (4色)","7810":"BRUNCH Mock 極簡親膚連帽長袖上衣 (3色)","7809":"UNDERSON Bella 極簡親膚蕾絲細肩帶背心 (2色)","7807":"UNDERSON Moss 燈芯絨氣質襯衫 (2色)","7806":"UNDERSON 撞色拼接搖粒絨休閒長褲 (2色)","7805":"UNDERSON 絲絨感半身裙 (2色)","7804":"UNDERSON 立體彎刀羽絨外套 (4色)","7803":"UNDERSON Atelier 極簡親膚長袖上衣 (2色)","7801":"SOAP & WATER Madison 修身垂墜休閒長褲 (單色)","7797":"ATOFF Fuzz 質感剪裁復古工裝夾克 (2色)","7795":"LAKE Bottle 修身垂墜休閒長褲 (4色)","7794":"LAKE Core 極簡親膚長袖上衣 (4色)","7793":"LAKE Forbi 修身垂墜休閒長褲 (5色)","7792":"LAKE Bourbon 修身垂墜休閒長褲 (5色)","7791":"LAKE Rich 質感剪裁拉鍊開襟外套 (8色)","7790":"LAKE Pie 韓系質感氣質成套穿搭組 (單色)","7789":"LAKE Shasha 質感剪裁針織開襟外套 (6色)","7788":"NUESE Baird 質感剪裁環保皮草夾克 (單色)","7787":"NUESE Hope 蜜桃絨親膚工裝多袋寬褲 (2色)","7786":"NUESE Clara 質感剪裁翻毛領麂皮保暖外套 (2色)","7785":"NUESE Melt 安哥拉兔毛長袖上衣 (5色)","7784":"NUESE Pound 極簡親膚休閒大學T (4色)","7783":"NUESE 燈芯絨內刷毛保暖修身休閒短褲 (2色)","7782":"NUESE Monte 重磅毛圈棉內刷毛保暖休閒長褲 (4色)","7781":"UNDERSON Sov 深領口V領針織毛衣 (3色)","7780":"UNDERSON New 質感字母針織毛帽 (3色)","7779":"UNDERSON 羊絨感毛絨俐落外套 (2色)","7778":"UNDERSON 撞色車線百搭腰帶 (2色)","7777":"UNDERSON Nimo 撞色拷克車線高領針織衫 (4色)","7776":"UNDERSON 蓬鬆粗針保暖圍巾 (2色)","7775":"UNDERSON 蓬鬆粗針質感針織毛衣 (2色)","7774":"UNDERSON Fly 質感剪裁羽絨外套 (4色)","7773":"UNDERSON 細緻蕾絲連身洋裝 (2色)","7770":"SOAP & WATER Pipi 極簡親膚連帽上衣 (2色)","7769":"BRUNCH Better 質感剪裁鵝絨羽絨外套 (5色)","7768":"BRUNCH Peer 極簡親膚長袖T恤 (4色)","7767":"BRUNCH All-Day 極簡親膚長袖上衣 (3色)","7766":"BRUNCH Dio 修身垂墜丹寧牛仔褲 (單色)","7765":"BRUNCH 貉子毛混紡經典圓領質感針織毛衣 (4色)","7764":"BRUNCH Kai 質感剪裁環保皮草外套 (3色)","7763":"BRUNCH 慵懶寬鬆細條紋長袖上衣 (3色)","7762":"SOAP & WATER Pto 質感剪裁皮革外套 (單色)","7761":"SOAP & WATER Smith 極簡親膚休閒大學T (單色)","7759":"LAKE 26 Neo 修身垂墜休閒長褲 (3色)","7758":"SOAP & WATER Mumu 極簡親膚長袖上衣 (單色)","7757":"BASKET Vibe 修身垂墜直筒丹寧牛仔褲 (2色)","7755":"SOAP & WATER Tommy 親膚柔暖V領針織毛衣 (3色)","7754":"LONDONFLAT 優雅一字領垂墜感長袖上衣 (4色)","7753":"UNDERSTANDING 繞頸設計撞色拼接設計感連身泳裝 (2色)","7752":"LONDONFLAT 微光珠飾法式比基尼 (4色)","7751":"LONDONFLAT 絲絨光澤燈芯絨襯衫 (2色)","7750":"LONDONFLAT 羊毛混紡排釦設計針織開襟外套 (4色)","7749":"LONDONFLAT 羊絨混紡V領針織毛衣 (4色)","7748":"LONDONFLAT 磨毛柔霧感針織感附同款圍巾環保皮草外套 (3色)","7747":"LONDONFLAT 中長版手工純羊毛大衣 (3色)","7746":"LONDONFLAT 亨利領襯衫 (3色)","7745":"LONDONFLAT 復古水洗工裝風夾克 (2色)","7744":"LONDONFLAT Field 質感剪裁工裝風連帽大衣 (單色)","7743":"NUESE 實用口袋拉鍊立領針織外套 (4色)","7742":"NUESE Kinda 鎖骨U領長袖上衣 (3色)","7741":"LAKE Issey 質感剪裁針織開襟外套 (6色)","7740":"LONDONFLAT 羊毛混紡保暖圍巾 (單色)","7739":"LONDONFLAT Herring 內刷毛保暖休閒長褲 (單色)","7738":"LONDONFLAT Herring 質感剪裁棉質拉鍊外套 (單色)","7737":"SOAP & WATER Cana 極簡親膚無袖背心 (單色)","7736":"LAKE Stan Fur 質感剪裁俐落外套 (4色)","7735":"LONDONFLAT 針織感披肩式保暖圍巾 (2色)","7734":"LONDONFLAT 華夫格紋長袖T恤 (3色)","7733":"LONDONFLAT 華夫格紋短袖T恤 (3色)","7732":"LONDONFLAT 安哥拉兔毛扭結編織長袖上衣 (2色)","7731":"LONDONFLAT 安哥拉兔毛扭結編織半身裙 (2色)","7730":"LONDONFLAT 蜜桃絨水洗工裝多袋寬褲 (2色)","7729":"LONDONFLAT Burke 燈芯絨休閒長褲 (2色)","7728":"LONDONFLAT Ugg 排釦設計休閒長褲 (3色)","7727":"LONDONFLAT 工裝風搖粒絨休閒長褲 (2色)","7726":"LONDONFLAT 修飾V領修身打底上衣 (3色)","7725":"LONDONFLAT 流蘇滾邊立體壓褶氣質成套穿搭組 (2色)","7724":"LONDONFLAT Moana 極簡親膚襯衫 (3色)","7723":"LONDONFLAT 純羊毛拉鍊開襟外套 (2色)","7721":"LONDONFLAT 雪花絨感圈圈紗質感長袖上衣 (4色)","7720":"LAKE Olsen 親膚柔暖質感針織毛衣 (7色)","7719":"LONDONFLAT Chess 修身垂墜燈芯絨直筒長褲 (2色)","7718":"LAKE Lao 修身垂墜休閒長褲 (8色)","7716":"LAKE Soy 質感剪裁連帽拉鍊外套 (5色)","7712":"BRUNCH Cani 學院風格紋襯衫 (單色)","7711":"BRUNCH Coin 修身垂墜工裝多袋寬褲 (3色)","7710":"LAKE Yoyo 極簡親膚長袖上衣 (8色)","7709":"NUESE Hunter 工裝風內刷毛保暖半身裙 (3色)","7708":"NUESE 內刷毛保暖立體彎刀休閒長褲 (單色)","7707":"BASKET Bowl Hand 親膚柔暖質感針織毛衣 (2色)","7705":"NUESE 馬海毛針織漁夫帽 (3色)","7703":"BASKET Burnt 質感剪裁刷毛夾克 (2色)","7702":"BASKET Tex 絲絨光澤長袖上衣 (3色)","7701":"NUESE 馬海毛復古菱格針織開襟外套 (3色)","7700":"BASKET Feb 優雅荷葉邊半身裙 (2色)","7698":"BASKET 圈圈紗質感立體抽繩束口棉褲 (2色)","7697":"ATOFF Rye 抽繩鬆緊氣質襯衫 (3色)","7696":"ATOFF Polar 氣質優雅半身裙 (2色)","7695":"ATOFF Bound 氣質優雅半身裙 (2色)","7693":"NUESE Eto 暗釦剪裁長袖上衣 (3色)","7692":"NUESE Eden 水洗復古色長袖上衣 (4色)","7691":"NUESE 寬鬆落肩質感針織毛衣 (3色)","7690":"NUESE Martin 防風高領夾克外套 (2色)","7689":"NUESE Bloom Peach 修身垂墜休閒長褲 (2色)","7688":"NUESE Cinema 雙色撞色長袖上衣 (4色)","7687":"UNDERSON All 雙面可穿保暖刷毛外套 (2色)","7686":"ATOFF Eddie 極簡親膚氣質襯衫 (3色)","7685":"LONDONFLAT Camel 燈芯絨假兩件褲裙 (2色)","7684":"SOAP & WATER Beautiful 極簡親膚長袖上衣 (單色)","7683":"UNDERSON Roble 修身垂墜膝上五分寬褲 (3色)","7682":"UNDERSON Simon 修身垂墜休閒長褲 (2色)","7681":"SOAP & WATER 顯瘦修身丹寧牛仔褲 (單色)","7679":"SOAP & WATER Kaufman 親膚柔暖質感針織毛衣 (3色)","7678":"SOAP & WATER 繞頸設計26FW質感針織毛衣 (2色)","7677":"NUESE 磨毛柔霧感水洗柔化俐落外套 (2色)","7676":"SOAP & WATER David 極簡親膚長袖上衣 (單色)","7675":"BREATHE 露肩設計微開衩長袖上衣 (3色)","7674":"UNDERSON Gift 親膚柔暖高領針織衫 (2色)","7673":"TEMPTING Brandy Crease 質感剪裁俐落外套 (2色)","7672":"BREATHE Nothing 雙向穿法針織開襟外套 (4色)","7671":"NUESE Veil 抽繩鬆緊質感針織毛衣 (5色)","7670":"LAKE Loe 修身垂墜丹寧牛仔褲 (2色)","7669":"BRUNCH Brie 親膚柔暖針織無袖背心 (3色)","7668":"LAKE Dover 質感剪裁皮革外套 (3色)","7667":"NUESE Pinter 實用口袋休閒長褲 (2色)","7666":"LONDONFLAT Rattan 透氣亞麻含疊穿馬甲兩件組修身上衣 (3色)","7665":"LAKE Bello 韓系質感氣質成套穿搭組 (4色)","7664":"LONDONFLAT Souffle 極簡親膚氣質襯衫 (3色)","7663":"LONDONFLAT 精緻刺繡細肩帶絲滑長洋裝 (3色)","7662":"ATOFF Mauve 銅氨絲柔滑夾克外套 (2色)","7661":"LONDONFLAT 透氣亞麻垂墜寬版休閒長褲 (3色)","7660":"LAKE Tever 修身垂墜休閒長褲 (4色)","7659":"UNDERSON 浪漫花卉羅紋無袖背心 (2色)","7658":"BASKET Eddie 立體抓皺飛行夾克 (2色)","7657":"UNDERSON 焦點設計品牌標誌質感針織毛衣 (3色)","7655":"BRUNCH Kipas 修身垂墜丹寧牛仔褲 (單色)","7654":"NUESE Souffle 極簡親膚氣質襯衫 (3色)","7653":"BASKET Burning 華夫格紋休閒大學T (3色)","7652":"BREATHE 輕透網眼垂墜感針織開襟外套 (3色)","7651":"ATOFF Day 極簡親膚短袖T恤 (5色)","7650":"UNDERSON Riena 極簡親膚長袖上衣 (2色)","7649":"BRUNCH Laurent 修身垂墜丹寧牛仔褲 (單色)","7648":"UNDERSON Again 極簡親膚連帽上衣 (2色)","7647":"BASKET Rosie 修身垂墜工裝多袋寬褲 (2色)","7646":"SOAP & WATER Fuzz 極簡親膚長袖T恤 (3色)","7645":"BASKET Days 經典條紋長袖上衣 (2色)","7644":"LAKE Philo 氣質翻領長袖上衣 (9色)","7643":"NUESE Wit 極簡親膚羅紋無袖背心 (4色)","7642":"UNDERSON Clean 極簡親膚刷毛背心 (2色)","7640":"SOAP & WATER Sor 極簡親膚修身上衣 (單色)","7639":"NUESE Fika 雙層設計長袖上衣 (5色)","7638":"LONDONFLAT 純棉親膚及踝垂墜長裙 (2色)","7637":"NUESE 法式優雅微透膚半身裙 (2色)","7635":"SOAP & WATER 極簡黑丹寧牛仔褲 (單色)","7634":"SOAP & WATER Either 極簡親膚長袖上衣 (單色)","7633":"BASKET Fold 極簡親膚半高領打底上衣 (4色)","7632":"SOAP & WATER Each 韓系質感氣質成套穿搭組 (3色)","7631":"UNDERSON Holga 中長版高領針織毛衣 (3色)","7630":"UNDERSON Crease 絲絨光澤半身裙 (3色)","7629":"BRUNCH Pre 修身垂墜直筒丹寧牛仔褲 (單色)","7628":"UNDERSON Nutty 菱格絎縫半身裙 (2色)","7627":"UNDERSON Terry 極簡親膚長袖上衣 (3色)","7625":"UNDERSON Annie 假兩件層次感長袖上衣 (4色)","7624":"ATOFF Derby 極簡親膚氣質襯衫 (2色)","7623":"LAKE Valley 極簡親膚疊穿背心 (4色)","7622":"NUESE Moa 微露肩長袖上衣 (3色)","7621":"LAKE Mori 極簡親膚羅紋無袖背心 (9色)","7620":"BREATHE Sisi 極簡親膚舒適內搭背心組 (3色)","7619":"BRUNCH Pure 氣質優雅半身裙 (2色)","7618":"LAKE Birkin 質感剪裁夾克外套 (3色)","7617":"BRUNCH Stay 極簡親膚襯衫 (4色)","7616":"BREATHE Fitz 法式蕾絲襯衫 (2色)","7615":"LAKE Chateau 親膚柔暖質感針織毛衣 (7色)","7613":"UNDERSON Esther 氣質優雅半身裙 (2色)","7612":"UNDERSON Caffy 親膚柔暖針織上衣 (3色)","7611":"UNDERSON Vapor 質感剪裁羽絨外套 (4色)","7610":"LAKE Cram 修身垂墜丹寧牛仔褲 (2色)","7609":"LAKE Kiro 極簡親膚長袖上衣 (8色)","7608":"LAKE Lolo 質感剪裁針織開襟外套 (6色)","7607":"BASKET 波卡復古圓點法式疊穿馬甲背心 (2色)","7606":"NUESE Vibe 修身垂墜直筒丹寧牛仔褲 (單色)","7605":"NUESE Post 反摺褲腳休閒長褲 (2色)","7604":"BREATHE 柔光金絲絨光澤半身裙 (單色)","7603":"UNDERSON Gabi 純棉親膚休閒長褲 (2色)","7602":"UNDERSON Bonnie 質感剪裁連帽拉鍊外套 (2色)","7601":"UNDERSON 調節釦膝上五分寬褲 (2色)","7600":"UNDERSON 絲絨光澤傘擺長裙 (2色)","7598":"TEMPTING Popo Brick 經典條紋長袖上衣 (4色)","7597":"LAKE Toma 極簡親膚長袖上衣 (7色)","7596":"BRUNCH Monroe 顯瘦羅紋無袖背心 (4色)","7595":"UNDERSON 焦點設計品牌標誌針織開襟外套 (3色)","7594":"BRUNCH 層次設計襯衫 (3色)","7593":"UNDERSON Graph 修身垂墜工裝多袋寬褲 (2色)","7592":"LONDONFLAT 含馬甲背心氣質襯衫 (3色)","7591":"BREATHE Marine 經典條紋休閒長褲 (3色)","7589":"LAKE Ruby 極簡親膚疊穿背心 (5色)","7588":"NUESE Glory 修身垂墜休閒長褲 (2色)","7587":"LONDONFLAT 水洗染色實用口袋丹寧牛仔褲 (2色)","7586":"SOAP & WATER Ag 修身垂墜休閒長褲 (2色)","7585":"BREATHE Thais 極簡親膚長袖上衣 (3色)","7584":"BREATHE 有機純棉優雅荷葉邊修身上衣 (2色)","7583":"LAKE Tico 修身垂墜直筒丹寧牛仔褲 (2色)","7582":"SOAP & WATER Lemaire 極簡親膚休閒大學T (2色)","7581":"SOAP & WATER 67 極簡親膚長袖上衣 (3色)","7580":"LONDONFLAT 經典百搭造型附圍巾套組 (2色)","7579":"LAKE Tini 質感剪裁針織開襟外套 (6色)","7578":"LONDONFLAT 氣質優雅百褶長洋裝 (3色)","7577":"BRUNCH Oth 經典條紋長袖上衣 (3色)","7576":"MORETHAN YESTERDAY Brill 極簡親膚疊穿無袖背心 (3色)","7575":"LONDONFLAT Mary Jane 極簡親膚修身上衣 (3色)","7574":"LONDONFLAT 親膚柔軟絲緞光澤保暖圍巾 (2色)","7573":"NUESE Feather 繞頸設計修身上衣 (4色)","7572":"BREATHE Fillet 極簡親膚長袖上衣 (4色)","7571":"NUESE Sand 立體打褶休閒長褲 (3色)","7570":"LOVE YOU SO MUCH Margaret 極簡親膚長袖上衣 (4色)","7569":"LONDONFLAT Wire 成衣水洗復古水洗俐落外套 (2色)","7568":"BRUNCH 輕透薄紗連身洋裝 (3色)","7567":"BREATHE Cozy 立體打褶修身休閒短褲 (3色)","7566":"LONDONFLAT 雙面可穿長袖上衣 (4色)","7564":"LONDONFLAT 法式碎花手工勾織針織開襟外套 (3色)","7563":"BRUNCH Mousse 極簡親膚羅紋無袖背心 (5色)","7562":"LOVE YOU SO MUCH Miere 韓系質感簡約氣質涼鞋 (2色)","7561":"LONDONFLAT 西部復古風百搭腰帶 (2色)","7560":"LOVE YOU SO MUCH Rect 韓系質感率性短靴 (2色)","7559":"SOAP & WATER Griffey 極簡親膚無袖背心 (4色)","7558":"NUESE Plan 立體打褶氣質襯衫 (3色)","7557":"LONDONFLAT Rattan 氣質優雅裹身設計裙 (3色)","7556":"MORETHAN YESTERDAY 立體抓皺雙層疊穿感半身裙 (2色)","7555":"UNDERSON 亨利領羅紋無袖背心 (3色)","7554":"LOVE YOU SO MUCH Kentery 氣質優雅半身裙 (2色)","7553":"LONDONFLAT Tremblin 氣質優雅半身裙 (2色)","7552":"SOAP & WATER 幼馬海毛質感針織毛衣 (4色)","7551":"LOVE YOU SO MUCH Faye 木質釦飾簡約氣質涼鞋 (2色)","7550":"UNDERSON Nelly 極簡親膚荷葉邊襯衫 (3色)","7549":"SOAP & WATER Tucking 氣質優雅半身裙 (3色)","7548":"LOVE YOU SO MUCH 優雅荷葉邊層次設計半身裙 (3色)","7547":"MORETHAN YESTERDAY Lence 氣質優雅細肩帶洋裝 (3色)","7546":"LOVE YOU SO MUCH Oz 氣質優雅連身洋裝 (5色)","7545":"LAKE Push 修身垂墜休閒長褲 (4色)","7544":"BRUNCH 親膚柔軟V領針織毛衣 (5色)","7543":"LONDONFLAT 風衣領設計襯衫 (2色)","7542":"LONDONFLAT 深圓領質感針織毛衣 (4色)","7541":"LONDONFLAT 純棉親膚連帽拉鍊外套 (2色)","7540":"LAKE Lotty 修身垂墜休閒長褲 (3色)","7539":"BREATHE Cove 修身垂墜側條紋運動長褲 (3色)","7538":"UNDERSTANDING 25 Fukuro 短袖質感針織毛衣 (3色)","7537":"LOVE YOU SO MUCH Hawa 極簡親膚長袖上衣 (5色)","7536":"POSTER Petit 俐落短版長袖上衣 (4色)","7535":"SOAP & WATER Lili 極簡親膚長袖上衣 (2色)","7534":"TEMPTING Space 修身垂墜工裝多袋寬褲 (3色)","7533":"SOAP & WATER Movern 極簡親膚疊穿背心 (3色)","7532":"BASKET Lake 氣質優雅半身裙 (單色)","7531":"LONDONFLAT 反摺褲腳俐落外套 (單色)","7530":"BRUNCH Cord 學院風格紋襯衫 (單色)","7529":"NUESE Fold 氣質優雅傘擺長裙 (3色)","7527":"BREATHE Upmost 極簡親膚修身長袖上衣 (5色)","7526":"LAKE 26 Molly 修身垂墜休閒長褲 (3色)","7525":"SOAP & WATER Blue 極簡親膚長袖上衣 (單色)","7523":"SOAP & WATER Media 極簡親膚長袖上衣 (單色)","7522":"NUESE 拼接撞色側條紋運動長褲 (2色)","7521":"BRUNCH Luna 極簡親膚長袖上衣 (4色)","7520":"SOAP & WATER 復古做舊休閒長褲 (單色)","7517":"SOAP & WATER Happy 質感剪裁環保皮草外套 (單色)","7516":"BRUNCH Cube 極簡親膚襯衫 (3色)","7515":"BRUNCH Barom 氣質優雅半身裙 (3色)","7514":"SOAP & WATER Drink 極簡親膚長袖上衣 (單色)","7513":"UNDERSON James 質感剪裁連帽拉鍊外套 (2色)","7512":"NUESE Slender 極簡親膚長袖上衣 (3色)","7511":"SOAP & WATER Cake 氣質優雅連身洋裝 (2色)","7510":"NUESE Simone 羊毛混紡氣質成套穿搭組 (4色)","7509":"LONDONFLAT 扁平極簡百搭腰帶 (單色)","7508":"LONDONFLAT 高彈力法式蕾絲修身上衣 (3色)","7507":"LAKE Jay 極簡親膚長袖上衣 (9色)","7506":"LAKE Mai 質感剪裁針織開襟外套 (9色)","7505":"LAKE Tar 質感剪裁夾克外套 (4色)","7504":"SOAP & WATER Nor 極簡親膚無袖背心 (2色)","7503":"LAKE Tag 極簡親膚長袖上衣 (5色)","7502":"LAKE Tao 極簡親膚長袖上衣 (6色)","7501":"SOAP & WATER Blaming 極簡親膚長袖上衣 (單色)","7500":"BASKET Falling 修身垂墜休閒長褲 (2色)","7499":"BREATHE 率性短版休閒長褲 (3色)","7498":"LAKE Schuma 極簡親膚長袖上衣 (9色)","7497":"LONDONFLAT 百褶剪裁修身上衣 (3色)","7496":"LAKE Tuo 修身垂墜休閒長褲 (8色)","7495":"LAKE River 韓系質感氣質成套穿搭組 (6色)","7494":"SOAP & WATER Marie 極簡親膚無袖背心 (2色)","7493":"SOAP & WATER Summer 修身垂墜立體抽繩束口棉褲 (2色)","7492":"BRUNCH Belming 極簡親膚長袖上衣 (3色)","7491":"UNDERSON Of 優雅荷葉邊長袖上衣 (4色)","7490":"BRUNCH Judy 修身垂墜假兩件褲裙 (2色)","7489":"BREATHE Relaxing 極簡親膚襯衫 (6色)","7488":"SOAP & WATER Boers 極簡親膚修身上衣 (單色)","7487":"UNDERSON Levain 修身垂墜休閒長褲 (2色)","7486":"LOVE YOU SO MUCH Muzen 修身垂墜休閒長褲 (2色)","7485":"LEIDU Sand 極簡親膚長袖上衣 (3色)","7483":"BRUNCH Mer 質感剪裁手工羊毛短大衣 (3色)","7482":"BRUNCH Slacker 極簡親膚長袖上衣 (3色)","7480":"LAKE Berlin 質感剪裁俐落外套 (3色)","7478":"LEIDU 親膚柔暖立體扭結針織開襟衫 (3色)","7477":"LEIDU 立體彎刀休閒長褲 (單色)","7476":"LEIDU Quarter 氣質優雅半身裙 (2色)","7475":"BRUNCH Lena 極簡親膚亨利領長袖上衣 (3色)","7474":"BRUNCH Rye 極簡親膚襯衫 (2色)","7473":"BRUNCH Letter 立體打褶休閒長褲 (2色)","7472":"NUESE Pincher 復古做舊長袖上衣 (2色)","7471":"SOAP & WATER Selly 極簡親膚無袖背心 (2色)","7470":"BREATHE Fig 防風高領工裝風外套 (3色)","7469":"BRUNCH 絲滑垂墜舒適鬆緊腰休閒長褲 (2色)","7468":"LAKE Roy 極簡親膚長袖上衣 (5色)","7467":"BASKET Park 純棉親膚休閒長褲 (3色)","7466":"BASKET Andy 極簡親膚休閒大學T (5色)","7465":"NUESE Haze 羊毛混紡排釦設計長袖上衣 (5色)","7464":"UNDERSON Mir 極簡親膚插肩袖長袖上衣 (3色)","7463":"BASKET Ria 安哥拉兔毛長袖上衣 (6色)","7462":"SOAP & WATER Bio 修身垂墜休閒長褲 (2色)","7461":"SOAP & WATER Bess 修身垂墜休閒長褲 (3色)","7460":"UNDERSON Porky 氣質優雅半身裙 (3色)","7459":"SOAP & WATER Phoebe 極簡親膚長袖上衣 (單色)","7458":"NUESE Alpha 磨毛柔霧感疊穿背心 (3色)","7457":"BREATHE Kitsch Lip 質感剪裁針織開襟外套 (4色)","7456":"SOAP & WATER Pia 修身垂墜休閒長褲 (單色)","7455":"SOAP & WATER Partisan 質感剪裁俐落外套 (2色)","7454":"LAKE Rona 極簡親膚長袖上衣 (5色)","7453":"LAKE Jenny 修身垂墜丹寧牛仔褲 (2色)","7452":"BASKET Monet 極簡親膚氣質襯衫 (2色)","7451":"LAKE Seiko 極簡親膚氣質襯衫 (4色)","7450":"UNDERSON Quiche 氣質優雅兩件式洋裝套組 (3色)","7449":"BRUNCH 水洗染色丹寧牛仔褲 (2色)","7448":"BREATHE Monday 極簡親膚襯衫 (3色)","7447":"BASKET Leg 極簡親膚襯衫 (2色)","7446":"BASKET Soda 極簡親膚長袖上衣 (2色)","7445":"LAKE Land 修身垂墜休閒長褲 (4色)","7444":"BASKET Mock 立體打褶氣質襯衫 (2色)","7443":"SOAP & WATER Kura 極簡親膚無袖背心 (單色)","7442":"LAKE Mori 質感剪裁針織開襟外套 (9色)","7441":"BREATHE Sync 極簡親膚法式疊穿馬甲背心 (3色)","7440":"BRUNCH Eddie 修身垂墜西裝寬褲 (2色)","7439":"BREATHE Oblique 極簡親膚長袖上衣 (4色)","7438":"LONDONFLAT 經典剪裁雙排釦大衣 (2色)","7437":"SOAP & WATER Owen 極簡親膚無袖襯衫 (2色)","7436":"ATOFF Noi 氣質優雅及踝垂墜長裙 (2色)","7435":"NUESE 細節剪裁工裝多袋寬褲 (3色)","7434":"LONDONFLAT Wire 修身版型襯衫 (3色)","7433":"SOAP & WATER Mondo 修身垂墜休閒長褲 (3色)","7431":"BREATHE 燈芯絨九分露踝休閒長褲 (2色)","7430":"BRUNCH Kins 修身垂墜丹寧牛仔褲 (單色)","7429":"SOAP & WATER Glenn 極簡親膚長袖上衣 (單色)","7428":"SOAP & WATER Dera 修身垂墜休閒長褲 (單色)","7427":"SOAP & WATER Water 質感剪裁俐落外套 (單色)","7426":"SOAP & WATER Letty 修身垂墜休閒長褲 (單色)","7425":"BRUNCH 慵懶寬鬆休閒大學T (2色)","7422":"BRUNCH City 抽繩鬆緊休閒長褲 (3色)","7421":"BRUNCH Barneys 親膚柔暖質感針織毛衣 (4色)","7420":"BRUNCH 喀什米爾羊絨磨毛柔霧感質感針織毛衣 (7色)","7419":"BRUNCH 都會俐落工裝風外套 (2色)","7418":"BRUNCH Sobi 極簡親膚長袖上衣 (5色)","7417":"NUESE 柔暖質感環保皮草外套 (2色)","7416":"NUESE Fit 羊毛混紡夾克外套 (2色)","7415":"NUESE Fez 親膚柔暖V領針織毛衣 (4色)","7414":"NUESE Chris 極簡親膚羅紋無袖背心 (3色)","7413":"NUESE Simon 顯瘦修身刷毛外套 (2色)","7412":"NUESE Reve 復古水洗連帽上衣 (4色)","7411":"NUESE Carib 修身垂墜麂皮質感長褲 (3色)","7410":"NUESE Bonnie 修身垂墜燈芯絨直筒長褲 (3色)","7409":"NUESE Fold 露肩設計質感針織毛衣 (4色)","7408":"NUESE Road 顯瘦修身內刷毛保暖直筒丹寧牛仔褲 (單色)","7407":"UNDERSON Mix 質感剪裁皮革外套 (2色)","7406":"LONDONFLAT 純棉親膚開衩顯瘦休閒長褲 (3色)","7405":"LEIDU Ribo 親膚柔暖質感針織毛衣 (2色)","7404":"LEIDU Free 極簡親膚長袖上衣 (3色)","7403":"LEIDU 氣質翻領綁帶針織開襟衫 (3色)","7402":"LEIDU 純羊毛V領針織毛衣 (4色)","7401":"LEIDU Margo 質感剪裁針織開襟外套 (4色)","7400":"LEIDU Reva 親膚柔暖質感針織毛衣 (3色)","7399":"LEIDU Air 極簡親膚長袖上衣 (4色)","7398":"UNDERSON Petal 韓系質感花瓣大腸髮圈 (2色)","7397":"SOAP & WATER Tulip 極簡親膚氣質襯衫 (2色)","7396":"SOAP & WATER Cuckoo 修身垂墜直筒牛仔褲 (單色)","7395":"BRUNCH Upi 極簡親膚長袖上衣 (4色)","7394":"BASKET Glory 極簡親膚襯衫 (2色)","7391":"BRUNCH 羊絨混紡針織開襟外套 (7色)","7390":"SOAP & WATER Hearty 質感剪裁俐落外套 (單色)","7389":"LAKE Philo 質感剪裁針織開襟外套 (7色)","7388":"LEIDU Piar 氣質優雅垂墜長裙 (2色)","7387":"UNDERSON Toby 反摺褲腳休閒長褲 (2色)","7386":"UNDERSON 毛絨拼接氣質翻領拉鍊立領針織外套 (2色)","7385":"SOAP & WATER Ami 極簡親膚無袖背心 (3色)","7384":"BASKET Ment 氣質優雅百褶長裙 (單色)","7382":"ATOFF 絲滑天絲絲滑領巾 (3色)","7380":"NUESE Neroli 極簡親膚長袖上衣 (4色)","7379":"LAKE Ray 氣質翻領長袖上衣 (9色)","7378":"NUESE 雙層設計細肩帶羅紋無袖背心 (5色)","7377":"SOAP & WATER Basi 極簡親膚修身上衣 (單色)","7376":"LEIDU Rosie 法式碎花長袖上衣 (2色)","7375":"NUESE 柔和奶油白直筒丹寧牛仔褲 (單色)","7373":"NUESE Porter 調節釦休閒長褲 (2色)","7372":"LAKE Pied 韓系質感氣質成套穿搭組 (7色)","7371":"UNDERSON Field 質感剪裁工裝風外套 (2色)","7370":"BRUNCH Mamonde 氣質優雅連身洋裝 (2色)","7369":"UNDERSON 木質釦飾假兩件層次感長袖上衣 (2色)","7368":"LAKE Kai 修身垂墜休閒長褲 (3色)","7366":"NUESE Rine 極簡親膚蕾絲細肩帶背心 (4色)","7365":"NUESE Tina 修飾V領長袖上衣 (4色)","7364":"NUESE Wade 極簡親膚襯衫 (2色)","7363":"LONDONFLAT Bird 修身垂墜工裝多袋寬褲 (3色)","7362":"NUESE Herring 水洗工藝休閒長褲 (2色)","7360":"BRUNCH Foltz 修身垂墜西裝寬褲 (2色)","7359":"SOAP & WATER 247 極簡親膚長袖上衣 (單色)","7358":"SOAP & WATER Rita 修身垂墜丹寧牛仔褲 (單色)","7357":"SOAP & WATER 西部復古風長袖上衣 (單色)","7356":"SOAP & WATER Pub 極簡親膚休閒大學T (單色)","7355":"SOAP & WATER Nono 極簡親膚休閒大學T (單色)","7354":"SOAP & WATER Higher 極簡親膚長袖上衣 (單色)","7353":"SOAP & WATER Careful 極簡親膚長袖上衣 (單色)","7352":"SOAP & WATER Skim 極簡親膚氣質襯衫 (單色)","7351":"SOAP & WATER 立體剪裁氣質襯衫 (單色)","7350":"UNDERSON Shine 經典條紋連帽上衣 (2色)","7349":"NUESE Laura 極簡親膚氣質襯衫 (2色)","7348":"SOAP & WATER Cecile 極簡親膚氣質襯衫 (3色)","7347":"UNDERSON Robe 法式蕾絲高領針織衫 (3色)","7346":"SOAP & WATER Leo 韓系質感百搭腰帶 (4色)","7345":"SOAP & WATER Normal 極簡親膚長袖上衣 (2色)","7344":"ATOFF Leg 修身垂墜休閒長褲 (2色)","7342":"BASKET Mento 質感剪裁粗花呢短外套 (3色)","7340":"SOAP & WATER Tega 極簡親膚連帽上衣 (2色)","7338":"LAKE Popo 極簡親膚襯衫 (8色)","7337":"BASKET Willy 修身垂墜立體抽繩束口棉褲 (3色)","7336":"NUESE Cozy Alpha 親膚柔暖質感針織毛衣 (4色)","7334":"BASKET 絲絨光澤百褶剪裁休閒長褲 (2色)","7333":"NUESE Essence 極簡親膚長袖上衣 (4色)","7332":"BASKET 都會摩登及踝垂墜長裙 (3色)","7330":"BASKET 絲絨光澤休閒大學T (2色)","7329":"NUESE Alpha 麻花編織連身洋裝 (4色)","7328":"BASKET Fog 質感剪裁連帽夾克外套 (2色)","7327":"SOAP & WATER GG 極簡親膚長袖上衣 (2色)","7326":"SOAP & WATER Beam 極簡親膚休閒大學T (單色)","7325":"ATOFF Pinter 學院風格紋襯衫 (2色)","7324":"ATOFF 華夫格紋插肩袖休閒大學T (2色)","7323":"ATOFF Lownep 親膚柔暖質感針織毛衣 (2色)","7322":"ATOFF Margo 修身垂墜霧面皮革長褲 (2色)","7321":"BASKET 華夫格紋質感針織毛衣 (2色)","7320":"NUESE 安地斯羊毛俐落外套 (2色)","7319":"NUESE Dominic 學院風格紋襯衫 (2色)","7318":"NUESE Lise 排釦設計質感針織毛衣 (3色)","7317":"NUESE Melvin 經典條紋休閒長褲 (2色)","7316":"BASKET Av 顯瘦羅紋長袖上衣 (4色)","7315":"NUESE Ina 絲絨光澤羅紋無袖背心 (2色)","7314":"NUESE Bake 氣質優雅半身裙 (2色)","7313":"SOAP & WATER Eat 氣質優雅半身裙 (單色)","7312":"BASKET Via 微露肩長袖上衣 (3色)","7311":"TEMPTING Taupe 經典條紋襯衫 (3色)","7310":"BRUNCH 極簡親膚小高領襯衫 (4色)","7309":"UNDERSON Tenny 修身垂墜工裝多袋寬褲 (2色)","7308":"BREATHE Nep 極簡親膚休閒大學T (4色)","7307":"NUESE V領附圍巾針織毛衣 (5色)","7306":"NUESE Fever 學院風格紋襯衫 (2色)","7305":"LAKE Toi 極簡親膚長袖上衣 (8色)","7304":"BRUNCH 立體抓皺無袖背心 (2色)","7303":"LAKE Bay 極簡親膚羅紋無袖背心 (6色)","7302":"LONDONFLAT London 韓系質感保暖圍巾 (6色)","7301":"SOAP & WATER Ally 開襟設計質感針織毛衣 (2色)","7300":"SOAP & WATER Bondi 極簡親膚氣質襯衫 (單色)","7299":"SOAP & WATER Posing 極簡親膚無袖背心 (3色)","7298":"BASKET Pauline 極簡親膚細褶垂墜襯衫 (4色)","7297":"UNDERSON 柔光質感長袖上衣 (4色)","7296":"SOAP & WATER 極簡親膚蕾絲氣質襯衫 (2色)","7295":"BASKET Rody FW半身裙 (2色)","7294":"NUESE Madeleine 氣質優雅垂墜長裙 (2色)","7292":"LAKE Viva 極簡親膚襯衫 (4色)","7291":"BRUNCH Penny 極簡親膚亨利領長袖上衣 (3色)","7290":"LONDONFLAT 美麗諾羊毛修飾V領質感針織毛衣 (3色)","7289":"LAKE Paul 極簡親膚羅紋無袖背心 (6色)","7288":"BASKET Base 插肩袖長袖上衣 (4色)","7287":"SOAP & WATER Kuro 極簡親膚氣質襯衫 (2色)","7286":"NUESE Mellow 法式蕾絲長袖上衣 (5色)","7285":"SOAP & WATER Fug 修身垂墜休閒長褲 (單色)","7284":"LONDONFLAT Ray 氣質優雅細肩帶絲滑長洋裝 (單色)","7283":"LAKE Auralee 極簡親膚疊穿無袖背心 (4色)","7282":"LAKE Miu 極簡親膚襯衫 (9色)","7281":"LONDONFLAT 反摺褲腳丹寧牛仔褲 (2色)","7280":"BREATHE Slash 附綁帶連身洋裝 (2色)","7279":"NUESE Owen Nubuck 質感剪裁俐落外套 (2色)","7278":"BASKET Heather 極簡親膚細褶垂墜襯衫 (2色)","7277":"LAKE Aki 繞頸設計質感針織毛衣 (3色)","7276":"NUESE Kaya 極簡親膚羅紋無袖背心 (4色)","7275":"LAKE Smith 修身垂墜丹寧牛仔褲 (2色)","7274":"LAKE Binder 極簡親膚襯衫 (4色)","7273":"NUESE 親膚柔軟細肩帶絲滑長洋裝 (3色)","7272":"LAKE Ato 親膚柔暖質感針織毛衣 (6色)","7271":"BREATHE Segment 氣質優雅連身洋裝 (2色)","7270":"LONDONFLAT 絲滑天絲舒適鬆緊腰修身上衣 (3色)","7269":"SOAP & WATER Popo 質感剪裁針織開襟外套 (2色)","7268":"BRUNCH Raphe 顯瘦羅紋無袖背心 (6色)","7267":"BREATHE Mosaic 氣質優雅連身洋裝 (3色)","7266":"LONDONFLAT Vanilla 質感剪裁長版大衣 (4色)","7265":"LAKE Mellow 修身垂墜休閒長褲 (4色)","7264":"BRUNCH Seri 極簡親膚長袖上衣 (5色)","7263":"BASKET Danver 質感剪裁連帽夾克外套 (3色)","7262":"LONDONFLAT 透氣亞麻蝴蝶結設計修身上衣 (3色)","7261":"BREATHE 復古圓點法式疊穿馬甲背心 (3色)","7260":"MORETHAN YESTERDAY 拼布裝飾透膚網紗羅紋中筒襪 (6色)","7259":"BREATHE Move 極簡親膚法式疊穿馬甲背心 (2色)","7258":"UNDERSON Dwen 極簡親膚高領雪紡襯衫 (2色)","7257":"SOAP & WATER Or 親膚柔暖質感針織毛衣 (3色)","7256":"LAKE Darling 極簡親膚長袖上衣 (7色)","7255":"SOAP & WATER Moonshoe 氣質優雅半身裙 (單色)","7254":"BRUNCH Pave 質感剪裁夾克外套 (2色)","7252":"BRUNCH Silo Aki 極簡親膚長袖上衣 (單色)","7250":"UNDERSON Tabi 質感剪裁針織開襟外套 (2色)","7249":"BRUNCH 慵懶寬鬆立體抓皺氣質襯衫 (2色)","7248":"SOAP & WATER Rada 親膚柔暖質感針織毛衣 (2色)","7247":"LONDONFLAT Low 暗釦剪裁丹寧牛仔褲 (單色)","7246":"LONDONFLAT 垂墜寬版反摺褲腳丹寧牛仔褲 (單色)","7245":"LONDONFLAT 經典條紋絲滑天絲襯衫 (3色)","7244":"LONDONFLAT Stone 水洗染色飛行員夾克 (2色)","7243":"LONDONFLAT 銅氨絲柔滑經典單排釦風衣大衣 (2色)","7242":"SOAP & WATER Kong 喀什米爾羊絨針織開襟外套 (4色)","7241":"SOAP & WATER 寬鬆版型直筒丹寧牛仔褲 (單色)","7240":"ATOFF Perry 經典條紋長袖上衣 (3色)","7239":"SOAP & WATER 手工鉤織休閒長褲 (單色)","7238":"ATOFF Near 修身垂墜工裝多袋寬褲 (3色)","7237":"BRUNCH 水洗工藝襯衫 (3色)","7236":"BASKET Freed 極簡親膚襯衫 (2色)","7235":"NUESE 雙向穿法絨面麂皮百搭腰帶 (3色)","7234":"SOAP & WATER 氣質優雅及踝垂墜長裙 (2色)","7233":"SOAP & WATER Skull 極簡親膚無袖背心 (3色)","7232":"SOAP & WATER Vosges 極簡親膚氣質襯衫 (2色)","7231":"UNDERSON Ivan 學院風格紋襯衫 (2色)","7230":"UNDERSON Groove 極簡親膚長袖上衣 (3色)","7229":"ATOFF Folder 極簡親膚珠地Polo領上衣 (3色)","7228":"BASKET Fancy 復古水洗俐落外套 (2色)","7227":"LONDONFLAT Claude 極簡親膚氣質襯衫 (3色)","7226":"BRUNCH Rob 水洗染色休閒長褲 (2色)","7225":"BRUNCH Miu 親膚柔暖針織無袖背心 (3色)","7224":"BRUNCH River 質感剪裁夾克外套 (2色)","7223":"UNDERSON Riena 氣質優雅半身裙 (2色)","7221":"UNDERSON Catch 親膚柔暖疊穿針織背心 (2色)","7220":"BRUNCH Taupe 人字紋直筒丹寧牛仔褲 (單色)","7219":"UNDERSON Net 深領口深V領針織毛衣 (2色)","7218":"LONDONFLAT 極簡百搭水洗棉質T恤 (4色)","7217":"LONDONFLAT Taylor 修身垂墜休閒長褲 (2色)","7216":"LONDONFLAT 萊賽爾天絲襯衫 (3色)","7215":"BASKET Dunce 中長版長袖上衣 (5色)","7214":"BASKET Of 純棉親膚氣質襯衫 (2色)","7212":"BASKET Monde 氣質優雅半身裙 (2色)","7211":"BASKET Robin 學院風格紋襯衫 (2色)","7210":"BASKET 水洗工藝俐落外套 (3色)","7209":"BASKET Autumn 極簡親膚氣質襯衫 (2色)","7208":"LAKE Low 韓系質感百搭腰帶 (2色)","7207":"LAKE Becky 質感剪裁工裝風夾克 (3色)","7206":"LAKE Morocco 質感剪裁俐落外套 (3色)","7205":"NUESE Denver 氣質優雅修身短裙 (2色)","7204":"BRUNCH Valen 修身垂墜休閒長褲 (2色)","7203":"BREATHE Clear Wire 質感剪裁俐落外套 (2色)","7202":"UNDERSON Benid 優雅荷葉邊膝上五分寬褲 (2色)","7201":"SOAP & WATER Schumi 修身垂墜休閒長褲 (3色)","7200":"FOUNDERS Charlotte 捲毛呢長版大衣 (2色)","7199":"UNDERSON Antique 修身垂墜休閒長褲 (2色)","7198":"LONDONFLAT Dobba 質感剪裁鋪棉夾克 (2色)","7197":"NUESE Jane 氣質優雅裹身設計裙 (2色)","7196":"LONDONFLAT 微光珠飾半身裙 (單色)","7195":"MORETHAN YESTERDAY Onew 氣質優雅裹身設計裙 (2色)","7194":"LOVE YOU SO MUCH Hailey 氣質優雅半身裙 (3色)","7193":"SOAP & WATER Harsh 修身垂墜直筒丹寧牛仔褲 (單色)","7192":"BREATHE 法式蕾絲綁帶設計半身裙 (2色)","7191":"BREATHE Chamomile 極簡親膚修身上衣 (2色)","7190":"LONDONFLAT Band 極簡親膚襯衫 (3色)","7189":"LONDONFLAT Penny 修身垂墜燈芯絨直筒長褲 (2色)","7188":"BRUNCH Leo 修身垂墜休閒長褲 (2色)","7187":"BREATHE Moran 氣質優雅半身裙 (2色)","7186":"SOAP & WATER Perma 極簡親膚長袖上衣 (3色)","7185":"UNDERSON Roost 極簡親膚鋪棉背心 (3色)","7184":"UNDERSON Rich 撞色拼接半開襟連帽套頭衫 (2色)","7182":"BRUNCH Popo 修身垂墜休閒長褲 (單色)","7180":"SOAP & WATER Mars 極簡親膚長袖上衣 (單色)","7179":"BASKET 彈力針織及踝垂墜長裙 (3色)","7178":"BASKET Dear 百褶剪裁休閒長褲 (2色)","7177":"LONDONFLAT 流暢版型氣質襯衫 (4色)","7176":"SOAP & WATER Derbo 極簡親膚無袖背心 (3色)","7175":"BREATHE 環保植鞣感俐落外套 (2色)","7174":"BREATHE 雙重剪裁襯衫 (3色)","7173":"NUESE Denf 蜜桃絨親膚修身休閒短褲 (2色)","7172":"LAKE Piyo 極簡親膚襯衫 (5色)","7171":"NUESE 羅紋羊毛混紡連身洋裝 (4色)","7170":"BASKET Paper 極簡親膚氣質襯衫 (2色)","7169":"LAKE Pima 修身垂墜休閒長褲 (4色)","7168":"LONDONFLAT 氣質優雅修身鉛筆裙 (2色)","7167":"BREATHE Pepe 質感剪裁俐落外套 (2色)","7166":"ATOFF Ron 抽繩鬆緊休閒長褲 (2色)","7165":"LONDONFLAT 工裝風反摺褲腳休閒長褲 (3色)","7164":"NUESE 深刷色直筒丹寧牛仔褲 (單色)","7163":"BRUNCH 微露肩休閒長褲 (3色)","7162":"BASKET Crease 韓系質感絲滑領巾 (3色)","7161":"LONDONFLAT 立體澎感繞頸設計修身上衣 (2色)","7160":"UNDERSON Rookie 修身垂墜休閒長褲 (2色)","7159":"NUESE Roy 氣質優雅連身洋裝 (3色)","7158":"SOAP & WATER Molito 極簡親膚襯衫 (2色)","7157":"BREATHE 經典圓領水洗染色休閒長褲 (3色)","7156":"SOAP & WATER Lema 極簡親膚氣質襯衫 (2色)","7155":"BRUNCH Harry 淺水洗藍丹寧牛仔褲 (單色)","7154":"BREATHE 翻蓋腰頭西裝寬褲 (2色)","7153":"BREATHE Capri 垂墜寬版西裝寬褲 (3色)","7152":"UNDERSON Vint 經典條紋長袖上衣 (3色)","7151":"UNDERSON Needs 極簡親膚短袖上衣 (3色)","7150":"UNDERSON Needs 極簡親膚長袖T恤 (3色)","7149":"LONDONFLAT Nut 優雅一字領長袖上衣 (3色)","7148":"LONDONFLAT 隱藏門襟俐落短版俐落外套 (2色)","7147":"BASKET Pre 極簡親膚氣質襯衫 (3色)","7146":"NUESE Hailey 氣質優雅連身洋裝 (2色)","7145":"SOAP & WATER Rye 極簡親膚長袖上衣 (2色)","7144":"LAKE Koi 修身垂墜休閒長褲 (3色)","7143":"LAKE Youth 質感剪裁拉鍊開襟外套 (3色)","7142":"UNDERSON Force 極簡親膚高領打底上衣 (3色)","7141":"BRUNCH Carrie 極簡親膚刷毛背心 (3色)","7140":"BRUNCH 木質釦飾長袖上衣 (4色)","7139":"SOAP & WATER Gima 極簡親膚長袖上衣 (3色)","7138":"NUESE 馬海毛裹身設計針織開襟外套 (3色)","7137":"SOAP & WATER Nanji 極簡親膚無袖背心 (2色)","7136":"SOAP & WATER 暗釦剪裁長袖上衣 (2色)","7135":"UNDERSON 浪漫花卉針織開襟外套 (2色)","7134":"BRUNCH Norma 極簡親膚無袖背心 (3色)","7133":"BREATHE 手工鉤織半身裙 (2色)","7132":"BASKET Allen 極簡親膚氣質襯衫 (2色)","7131":"LAKE Perth 修身垂墜休閒長褲 (4色)","7130":"SOAP & WATER Robbie 極簡親膚長袖上衣 (2色)","7129":"UNDERSON Supi 極簡親膚蕾絲細肩帶背心 (3色)","7128":"UNDERSON 百褶剪裁中長版針織開襟外套 (3色)","7127":"UNDERSON 百褶剪裁針織無袖背心 (3色)","7126":"UNDERSON After 氣質優雅半身裙 (2色)","7125":"NUESE 做舊水洗長袖上衣 (4色)","7124":"SOAP & WATER Niwa 修身垂墜休閒長褲 (3色)","7123":"BRUNCH Lolo 極簡親膚長袖上衣 (6色)","7122":"BASKET From 經典條紋長袖上衣 (2色)","7121":"SOAP & WATER Sandy 極簡親膚氣質襯衫 (2色)","7120":"NUESE Waterloo 極簡親膚長袖上衣 (4色)","7119":"LAKE Bonnie 氣質翻領長袖上衣 (8色)","7118":"SOAP & WATER Gavina 極簡親膚襯衫 (2色)","7117":"SOAP & WATER Coupe 極簡親膚長袖上衣 (4色)","7116":"LONDONFLAT Saint Laurent 質感剪裁俐落外套 (2色)","7114":"BRUNCH 立體彎刀經典中藍丹寧牛仔褲 (單色)","7113":"POSTER Simply 極簡親膚疊穿無袖背心 (4色)","7112":"MORETHAN YESTERDAY Hison 極簡親膚氣質襯衫 (2色)","7111":"LONDONFLAT 極簡親膚修身上衣 (2色)","7110":"BRUNCH Marais 極簡親膚無袖背心 (2色)","7109":"BREATHE 立體工裝口袋連身洋裝 (6色)","7108":"SOAP & WATER Habiter 極簡親膚襯衫 (2色)","7107":"NUESE Maylin 極簡親膚氣質襯衫 (3色)","7106":"LONDONFLAT 銅氨絲柔滑修身上衣 (4色)","7105":"SOAP & WATER Lumi 極簡親膚氣質襯衫 (2色)","7104":"SOAP & WATER India 質感剪裁長版大衣 (2色)","7103":"SOAP & WATER 經典百搭疊穿背心 (3色)","7102":"LONDONFLAT 自然皺褶感柔軟小羊皮俐落外套 (2色)","7100":"UNDERSON Shuri 羊毛混紡工裝多袋寬褲 (2色)","7099":"BRUNCH 流蘇滾邊丹寧牛仔褲 (2色)","7098":"LAKE Dia 氣質優雅半身裙 (2色)","7097":"LAKE 26 Tay 修身垂墜休閒長褲 (4色)","7096":"BRUNCH Harry 極簡黑直筒丹寧牛仔褲 (單色)","7095":"NUESE Fluid 修身垂墜休閒長褲 (2色)","7094":"NUESE 微透膚雙層設計長袖上衣 (3色)","7093":"UNDERSON Potts 極簡親膚氣質襯衫 (2色)","7092":"UNDERSON Tory 氣質優雅連身洋裝 (2色)","7091":"NUESE Deep 裹身設計氣質襯衫 (2色)","7090":"BREATHE Greek Multi SET 韓系質感精選單品 (3色)","7089":"NUESE 雙層設計傘擺長裙 (2色)","7088":"BRUNCH Us 極簡親膚長袖上衣 (3色)","7087":"SOAP & WATER Kyle 氣質優雅連身洋裝 (單色)","7086":"BRUNCH Jeje 極簡親膚長袖上衣 (5色)","7085":"NUESE Dio 修身垂墜工裝多袋寬褲 (3色)","7084":"LAKE 立體哈倫剪裁休閒長褲 (3色)","7083":"BRUNCH Aim 極簡親膚連帽上衣 (3色)","7082":"BRUNCH 30%羊絨混紡針織開襟外套 (5色)","7081":"BASKET First 質感剪裁飛行夾克附圍巾組 (2色)","7080":"NUESE Hunter 復古水洗菱格鋪棉工裝風外套 (2色)","7079":"NUESE Ruel 氣質優雅半身裙 (2色)","7078":"LAKE Lulu 氣質優雅半身裙 (8色)","7077":"NUESE Milly 氣質優雅連身洋裝 (2色)","7076":"LAKE Kent 極簡親膚長袖上衣 (5色)","7075":"LAKE 慵懶哈倫剪裁羅紋無袖背心 (4色)","7074":"LAKE Tough 修身垂墜直筒丹寧牛仔褲 (2色)","7073":"UNDERSON 單口袋綁帶休閒長褲 (2色)","7072":"BRUNCH Kinder 修身垂墜休閒短褲 (2色)","7071":"SOAP & WATER Mika 極簡親膚無袖背心上衣 (4色)","7070":"NUESE Kate 復古水洗休閒長褲 (3色)","7069":"BASKET Smoothie 極簡親膚長袖上衣 (單色)","7068":"SOAP & WATER Montore 修身垂墜休閒長褲 (2色)","7067":"NUESE Lurex 顯瘦羅紋質感針織毛衣 (4色)","7066":"LAKE Kendall 修身垂墜休閒長褲 (4色)","7065":"BREATHE 繫帶設計氣質襯衫 (2色)","7064":"BRUNCH 立體彎刀淺水洗藍丹寧牛仔褲 (單色)","7063":"LAKE 微低腰剪裁直筒丹寧牛仔褲 (單色)","7062":"SOAP & WATER 顯瘦羅紋無袖背心 (4色)","7061":"NUESE Sophie 法式蕾絲修身上衣 (3色)","7060":"LONDONFLAT 義大利羊毛膝上五分寬褲 (單色)","7059":"NUESE Loop 保暖刷毛休閒長褲 (2色)","7058":"SOAP & WATER Kubo 極簡親膚襯衫 (2色)","7057":"UNDERSTANDING Henry 修身垂墜中短褲 (3色)","7056":"UNDERSON Nobis 修身垂墜休閒長褲 (2色)","7055":"BREATHE 細格紋經典條紋質感針織毛衣 (3色)","7054":"LOVE YOU SO MUCH 雙面可穿多口袋鋪棉外套 (2色)","7053":"SOAP & WATER Punk 極簡親膚長袖上衣 (2色)","7052":"SOAP & WATER Pillow 極簡親膚長袖上衣 (2色)","7051":"NUESE 水洗染色附腰帶垂墜長褲 (3色)","7049":"SOAP & WATER 雙層疊穿感質感針織毛衣 (3色)","7048":"LONDONFLAT Glenta 質感剪裁中長版大衣 (3色)","7047":"SOAP & WATER Claire 修身垂墜休閒長褲 (2色)","7046":"BREATHE Teacrip 極簡親膚長袖上衣 (9色)","7045":"NUESE Day Off 極簡親膚長袖上衣 (4色)","7044":"SOAP & WATER Yohji 修身垂墜休閒長褲 (2色)","7043":"BREATHE Fig 雙層設計立體打褶半身裙 (2色)","7042":"SOAP & WATER Mer 親膚柔暖質感針織毛衣 (2色)","7041":"BREATHE Fusilli 氣質優雅半身裙 (3色)","7040":"SOAP & WATER 調節釦休閒長褲 (3色)","7039":"BRUNCH Aki 俐落短版長袖上衣 (3色)","7038":"SOAP & WATER Guas 極簡親膚長袖上衣 (6色)","7037":"NUESE Plush 質感剪裁針織開襟外套 (3色)","7036":"SOAP & WATER Albert 修身垂墜休閒長褲 (3色)","7035":"SOAP & WATER Tory 極簡親膚長袖上衣 (5色)","7034":"BREATHE 俐落線條休閒大學T (4色)","7033":"SOAP & WATER 立體剪接直筒丹寧牛仔褲 (2色)","7032":"NUESE Low 修身垂墜燈芯絨直筒長褲 (2色)","7031":"SOAP & WATER Kiss 氣質優雅半身裙 (單色)","7030":"SOAP & WATER Peaked 附綁帶手工純羊毛大衣 (2色)","7029":"MORETHAN YESTERDAY Potted 親膚柔暖質感針織毛衣 (3色)","7028":"SOAP & WATER Liz 極簡親膚無袖背心 (單色)","7027":"BREATHE 麂皮絨輕巧短版法棍腋下包 (單色)","7026":"SOAP & WATER Legacy 極簡親膚羅紋無袖背心 (4色)","7025":"MORETHAN YESTERDAY Hippie 極簡親膚疊穿無袖背心 (4色)","7024":"LONDONFLAT 純棉親膚連身洋裝 (3色)","7023":"UNDERSON 麂皮絨襯衫 (2色)","7022":"BREATHE Binding 修身垂墜休閒長褲 (3色)","7020":"SOAP & WATER Montaigne 質感剪裁俐落外套 (2色)","7018":"BREATHE V 安哥拉兔毛中厚實針織上衣 (4色)","7017":"MORETHAN YESTERDAY Dailyn 氣質優雅半身裙 (3色)","7016":"SOAP & WATER Ally 修身垂墜休閒長褲 (2色)","7015":"LOVE YOU SO MUCH Curi 極簡親膚疊穿無袖背心 (5色)","7014":"SOAP & WATER 細緻碎花無袖套裝長褲組 (單色)","7012":"BREATHE Shelba 氣質優雅半身裙 (2色)","7011":"MORETHAN YESTERDAY Sarin 假兩件層次感半身裙 (2色)","7010":"LOVE YOU SO MUCH Moin 修身垂墜休閒長褲 (2色)","7009":"NUESE Nice 透氣亞麻繞頸設計連身洋裝 (4色)","7008":"SOAP & WATER 絲緞光澤抹胸平口上衣 (2色)","7007":"UNDERSON Ripel 氣質優雅百褶長裙 (2色)","7006":"NUESE 輕透網眼羅紋無袖背心 (3色)","7005":"SOAP & WATER 不對稱剪裁長袖上衣 (2色)","7004":"BREATHE Play 修身休閒短褲 (2色)","7003":"SOAP & WATER Casem 親膚柔暖質感針織毛衣 (6色)","7002":"SOAP & WATER 修身垂墜五分休閒褲 (單色)","7001":"LOVE YOU SO MUCH Mary 韓系質感厚底休閒鞋 (2色)","7000":"TEMPTING Peer 真牛皮百搭腰帶 (2色)","6999":"LONDONFLAT 垂墜感長袖打底T恤 (3色)","6998":"NUESE With 極簡親膚長袖上衣 (4色)","6997":"SOAP & WATER 門襟排釦長袖上衣 (2色)","7115":"SOAP & WATER Yuki 親膚圓領短袖上衣 (單色)","7335":"ATOFF 보우 브이 맨투맨","7341":"ATOFF Bow 垂墜感百搭長裙 (3色)","7343":"ATOFF More 俐落垂墜西裝寬褲 (2色)","7361":"SOAP & WATER Pre 柔軟針織開襟外套 (2色)","7367":"ATOFF Noa 氣質半高領打底上衣 (3色)","7381":"ATOFF 아카이브 데님 팬츠","7383":"BASKET Deep V領慵懶針織毛衣 (4色)","7423":"BRUNCH Winter 輕量保暖鋪棉背心 (4色)","7424":"LEIDU 自訂款 質感羅紋中筒襪 (4色)","7432":"SOAP & WATER 체리 팬츠","7519":"BRUNCH 코니 조거 팬츠","7524":"SOAP & WATER Ao 極簡削肩背心上衣 (4色)","7590":"ATOFF Ness 經典雙排釦風衣外套 (2色)","7599":"UNDERSON Oval 保暖刷毛立領外套 (2色)","7680":"SOAP & WATER Sio 率性直筒休閒長褲 (單色)","7699":"ATOFF Fox 奢華環保狐狸毛背心 (2色)","7704":"BASKET Salty 復古燈芯絨寬褲 (3色)","7706":"BASKET 버닝폴라 티셔츠","7714":"LAKE 차오 티셔츠","7715":"LAKE 니콜 기모 팬츠","7717":"SOAP & WATER 구름 팬츠","7756":"BRUNCH Hush 修身直筒丹寧牛仔褲 (單色)","7760":"SOAP & WATER 오차드 코트","7771":"SOAP & WATER Sophie 細肩帶打底背心 (2色)","7772":"LONDONFLAT 머플러 핸드메이드 코트","7796":"ATOFF Mug 寬鬆刷毛休閒大學T (3色)","7798":"ATOFF 하버 팬츠","7799":"SOAP & WATER 라이프 티셔츠","7800":"SOAP & WATER 칠리 티셔츠","7802":"SOAP & WATER 모네퍼","7808":"UNDERSON 立體剪接工裝寬褲 (單色)","7819":"LAKE Holly 保暖刷毛連帽拉鍊外套 (2色)","7823":"LAKE 메타 팬츠","7830":"BASKET Toy 泰迪絨保暖夾克外套 (2色)","7831":"BASKET Mock 絲絨光澤垂墜寬褲 (2色)","7834":"BASKET French 法式柔膚高領上衣 (5色)","7841":"ATOFF Norma 保暖燈芯絨直筒長褲 (3色)","7846":"LAKE 멜리 팬츠","7848":"SOAP & WATER Caroline 優雅環保皮草外套 (單色)","7851":"UNDERSON Floaty 輕盈保暖羽絨外套 (4色)","7853":"UNDERSON 26 무지 머플러","7855":"UNDERSON 26 圈圈紗蓬鬆保暖圍巾 (4色)","7862":"ATOFF Cinnamon 暖調修身直筒長褲 (2色)","7864":"ATOFF Boulder 經典條紋長袖T恤 (2色)","7865":"BASKET 숄 머플러","7870":"ATOFF 피타 후리스 점퍼","7872":"BASKET 모모 비니","7877":"SOAP & WATER Apple 微繭型立體休閒長褲 (2色)","7880":"UNDERSON Pebble 氣質A字中長裙 (2色)","7885":"UNDERSON Champ 街頭感重磅棉褲 (3色)","7891":"UNDERSON 26 숄 머플러","7893":"레이두 코지온 기모 팬츠","7898":"SOAP & WATER 먼트 퍼 자켓","7899":"ATOFF Liz 貼身顯瘦高領打底衫 (5色)","7904":"ATOFF Eve 優雅傘擺長裙 (3色)","7907":"BASKET 쿠키 (기모) 맨투맨","7908":"BASKET Glow 柔光垂墜感長裙 (2色)","7910":"BASKET Merry 經典格紋流蘇圍巾 (單色)","7912":"BASKET 리프 맨투맨","7913":"BASKET Soft 純羊毛柔軟保暖圍巾 (5色)","7914":"ATOFF Wolf 寬鬆重磅連帽上衣 (2色)","7915":"ATOFF 모스 벨벳 팬츠","7916":"ATOFF 울프 팬츠","7917":"ATOFF 마크 하프 코트","7918":"BRUNCH 카프 폴라 티셔츠","7920":"BRUNCH 시엔 울 집업","7923":"BRUNCH 세이 벨벳 팬츠","7924":"UNDERSON 네트 브이 니트","7928":"UNDERSON 방울 후드 니트","7930":"UNDERSON 울스 배색 나그랑","7937":"ATOFF 코티지 티셔츠","7941":"BASKET 올데이 퍼 자켓","7942":"BASKET 프랩 롱 스커트","7943":"BASKET And 質感環保皮草背心 (單色)","7944":"ATOFF 羊毛混紡保暖束口棉褲 (2色)","7945":"ATOFF Moen 插肩輕量保暖鋪棉外套 (2色)","7946":"BASKET Winter 半高領柔膚長袖上衣 (4色)","7950":"SOAP & WATER 몹 티셔츠","7954":"SOAP & WATER 콜리 팬츠","7956":"BRUNCH Pure 純淨感柔軟皮草夾克 (2色)","7960":"UNDERSON Deep V領寬鬆連帽上衣 (2色)","7961":"UNDERSON 安哥拉兔毛混紡捲邊毛帽 (2色)","7962":"UNDERSON 올리 레이어드 티셔츠","7963":"UNDERSON 루아스웻 팬츠","7964":"LAKE 홀리 팬츠","7969":"LAKE 알레 팬츠","7970":"NUESE Grace 柔滑修身長袖T恤 (5色)","7971":"NUESE 빌런 팬츠","7972":"ATOFF 벨 폴라 티셔츠","7973":"ATOFF Grand 保暖刷毛休閒寬褲 (3色)","7974":"ATOFF 벨벳 스카프","7975":"ATOFF 토리 기모 티셔츠","7976":"ATOFF Abel 慵懶插肩羊毛長版大衣 (2色)"};

  var st = document.createElement('style');
  st.id = 'leidu-shop7-twd-clean-css';
  st.textContent = '.eRefPriceUnitHead,.eRefPrice,.eRefPriceUnitTail,#leidu-easypay-popup,.leidu-easypay-popup,[data-leidu-smartstore-bridge],.leidu-today-stock,.prdList .spec > li:has(.leidu-today-stock),.leidu-detail-media > figure:has(iframe[src*="youtube"]),#prdDetail iframe[src*="youtube"],#prdDetail figure:has(iframe[src*="youtube"]),[data-kr-proof],.leidu-ext-review details,#product-review-read:has(.leidu-ext-review) form[id^="commentWriteForm"],#product-review-read:has(.leidu-ext-review) form[id^="commentSecretForm"],#product-review-read:has(.leidu-ext-review) .ec-base-button,.xans-board-read:has(.leidu-ext-review) ~ .xans-board-commentpackage{display:none!important;}';
  (document.head || document.documentElement).appendChild(st);

  var TOKENS = [
    ['일부 옵션 오늘출발','部分規格今日出貨'],['오늘출발 가능 옵션 없음','預購依序出貨'],['오늘출발','今日出貨'],['당일발송','今日出貨'],['일반배송','一般出貨'],
    ['일시품절','暫時售罄'],['품절','售罄'],['모델이 함께 착용한 코디 상품입니다 · 클릭 시 해당 상품으로 이동합니다','模特兒同款穿搭單品 · 點擊查看單品'],
    ['함께 코디한 상품 보러가기 →','查看同款穿搭單品 →'],['함께 코디한 상품 보러가기','查看同款穿搭單品'],
    ['관련법 및 소비자 분쟁해결 규정에 따름','依韓國電子商務相關法規及消費者權益保護條款辦理'],['소비자분쟁해결기준에 따름','依消費者權益保護條款辦理'],
    ['상세페이지 참조','請見上方詳細說明'],['상세페이지참조','請見上方詳細說明'],['상세설명 참조','請見上方詳細說明'],['상세정보 참조','請見上方詳細說明'],
    ['외국 모델','外籍模特兒'],['외국모델','外籍模特兒'],['국내 모델','韓國模特兒'],['국내모델','韓國模特兒'],['모델','模特兒'],['외국','海外'],
    ['레이두 고객센터','LEIDU 官方線上客服'],['협력사','LEIDU Seoul Partner Studio'],['자체제작','LEIDU 原創設計'],['대한민국','大韓民國'],['국산','韓國製'],['국내','韓國製'],['중국','中國代工'],
    ['[필수] 옵션을 선택해 주세요','[必填] 請選擇規格'],['필수 옵션을 선택해 주세요','請選擇規格'],['옵션을 선택해 주세요','請選擇規格'],
    ['런던플랏','LONDONFLAT'],['누즈','NUESE'],['브런치','BRUNCH'],['레이크사이드스튜디오','LAKE'],['레이크사이드 스튜디오','LAKE'],['레이크','LAKE'],['솝앤워터','SOAP & WATER'],['언더슨','UNDERSON'],
    ['바스켓','BASKET'],['어토프','ATOFF'],['템팅','TEMPTING'],['브리드','BREATHE'],['언더스탠딩','UNDERSTANDING'],['파운더스','FOUNDERS'],
    ['모어댄예스터데이','MORETHAN YESTERDAY'],['러브유쏘머치','LOVE YOU SO MUCH'],
    ['상세사이즈 (cm)','詳細平量尺寸 (cm)'],['상세사이즈(cm)','詳細平量尺寸 (cm)'],['상세 사이즈','詳細尺寸'],['상세사이즈','詳細尺寸'],['사이즈 (cm)','平量尺寸 (cm)'],['사이즈(cm)','平量尺寸 (cm)'],['사이즈','尺寸'],['총기장','全長'],['총장','全長'],['어깨너비','肩寬'],['어깨단면','肩寬'],['어깨','肩寬'],
    ['가슴단면','胸寬'],['가슴둘레','胸圍'],['가슴','胸寬'],['허리단면','腰寬'],['허리둘레','腰圍'],['허리','腰寬'],['엉덩이단면','臀寬'],['엉덩이','臀寬'],
    ['밑위길이','褲襠長'],['밑위','褲襠長'],['허벅지단면','大腿寬'],['허벅지','大腿寬'],['밑단단면','褲口/下擺寬'],['밑단','褲口/下擺寬'],['소매기장','袖長'],['소매통','袖寬'],['소매길이','袖長'],['소매','袖長'],['암홀','袖攏'],['총길이','全長'],['단면','平量'],
    ['상품정보','商品資訊'],['주요소재','主要材質'],['소재','材質'],['혼용률','材質比例'],['색상','顏色'],['컬러','顏色'],['제조자','製造商'],['제조사','製造商'],['제조국','產地'],['원산지','產地'],['제조연월','製造年月'],['품질보증기준','品質保證標準'],['A/S 안내','售後服務說明'],['A/S안내','售後服務說明'],['세탁방법','洗滌保養'],
    ['두께감','厚度'],['두께','厚度'],['신축성있음','具彈性'],['신축성없음','無彈性'],['신축성','彈性'],
    ['비침없음','不透膚'],['약간비침','微透膚'],['비침있음','微透膚'],['비침','透膚度'],
    ['안감있음','有內裡'],['안감없음','無內裡'],['양기모','雙面內刷毛'],['기모안감','內刷毛'],['기모','內刷毛'],['누빔','鋪棉'],['안감','內裡'],
    ['도톰함','厚實保暖'],['도톰','厚實保暖'],['두꺼움','厚實保暖'],['적당함','適中'],['보통','適中'],['얇음','輕薄透氣'],['좋음','極佳'],['약간있음','微彈'],['약간','微彈'],['없음','無'],['있음','有'],
    ['폴리에스테르','聚酯纖維'],['폴리우레탄','彈性纖維'],['폴리','聚酯纖維'],['레이온','嫘縈'],['나일론','尼龍'],['아크릴','壓克力纖維'],['스판덱스','彈性纖維'],['스판','彈性纖維'],
    ['캐시미어','喀什米爾羊毛'],['알파카','羊駝毛'],['모달','莫代爾'],['텐셀','天絲'],['린넨','亞麻'],['코튼','棉'],['울','羊毛'],['혼방','混紡'],['기타','其他'],
    ['백메란지','淺花灰'],['백멜란지','淺花灰'],['백메','淺花灰'],['멜란지그레이','混色灰'],['메란지그레이','混色灰'],['멜란지','混色灰'],['메란회','混色灰'],['멜란회','混色灰'],['멜란','混色灰'],
    ['다크브라운','深棕色'],['라이트베이지','淺米色'],['다크그레이','深灰色'],['라이트그레이','淺灰色'],['라이트블루','淺藍色'],['스카이블루','天藍色'],['다크네이비','深海軍藍'],
    ['진그레이','深灰色'],['연그레이','淺灰色'],['진차콜','深炭灰'],['연차콜','淺炭灰'],['다크차콜','深炭灰'],['진보라','深紫色'],['연보라','淺紫色'],['보라색','紫色'],['보라','紫色'],
    ['아쿠아','水藍色'],['브릭','磚紅色'],['자주','紫紅色'],['단일상품','單一規格'],['오트','燕麥色'],['파랑','藍色'],['레이두','LEIDU'],['라이트','淺'],['다크','深'],['딥','深'],['소프트','柔霧'],['파스텔','粉彩'],['체리','櫻桃紅'],['라임','萊姆綠'],
    ['인디핑크','乾燥玫瑰粉'],['연핑크','淺粉色'],['진핑크','深粉色'],['핫핑크','亮粉色'],['핑크','粉色'],
    ['아이보리','象牙白'],['백아이','純白色'],['화이트','白色'],['오트밀','燕麥色'],['크림','奶油白'],['버터','奶油黃'],
    ['머스타드','芥末黃'],['옐로우','黃色'],['노랑','黃色'],['오렌지','橘色'],['코랄','珊瑚橘'],
    ['진베이지','深米色'],['연베이지','淺米色'],['연베','淺米色'],['진베','深米色'],['베이지','米色'],['카멜','駝色'],
    ['진밤','深棕色'],['밤색','栗棕色'],['초코','巧克力棕'],['모카','摩卡棕'],['브라운','棕色'],['코코아','可可棕'],
    ['진회색','深灰色'],['연회색','淺灰色'],['진회','深灰色'],['연회','淺灰色'],['차콜','炭灰色'],['먹색','深炭灰'],['회색','灰色'],['그레이','灰色'],
    ['블랙','黑色'],['검정','黑色'],
    ['곤색','深海軍藍'],['네이비','海軍藍'],['소라','天空藍'],['블루','藍色'],['코발트','寶藍色'],
    ['진청','深藍丹寧'],['중청','中藍丹寧'],['연청','淺藍丹寧'],['흑청','黑灰丹寧'],['생지','原色丹寧'],
    ['진카키','深卡其'],['연카키','淺卡其'],['올리브','橄欖綠'],['카키','卡其'],['민트','薄荷綠'],['그린','綠色'],['초록','綠色'],
    ['버건디','酒紅'],['와인','酒紅'],['레드','紅色'],['빨강','紅色'],['라벤더','薰衣草紫'],['퍼플','紫色'],
    ['실버','銀色'],['골드','金色'],
    ['기장추가','加長版'],['숏버전','短版'],['롱버전','長版'],['단품','單一規格'],['프리','FREE'],['원사이즈','ONE SIZE'],['라지','L'],['미디움','M'],['스몰','S'],
    ['윈터','Winter'],['패딩','鋪棉'],['베스트','背心'],['팬츠','長褲'],['니트','針織'],['코트','大衣'],['자켓','夾克'],['재킷','夾克'],['티셔츠','T恤'],['셔츠','襯衫'],['스커트','裙'],['가디건','開襟衫'],['원피스','洋裝'],['맨투맨','大學T'],['후드','連帽'],['점퍼','夾克'],['슬랙스','西裝褲'],['데님','丹寧'],
    ['옵션변경','變更規格'],['옵션 변경','變更規格'],['[옵션:','[規格:'],['옵션:','規格:'],['옵션','規格'],['[필수]','[必填]'],['필수','必填'],
    ['-- 메시지 선택 (선택사항) --','-- 請選擇配送備註（選填） --'],['배송 전에 미리 연락바랍니다.','配送前請先致電聯繫。'],['부재 시 경비실에 맡겨주세요.','如不在家，請交由管理室／警衛代收。'],['부재 시 문 앞에 놓아주세요.','如不在家，請放置於門口。'],['빠른 배송 부탁드립니다.','請盡快安排出貨，謝謝。'],['택배함에 보관해 주세요.','請放置於宅配櫃／智取櫃。'],['직접 입력','自行輸入'],['1대1 맞춤상담','1對1客服諮詢'],
    ['수량:','數量:'],['수량','數量'],['댓글 작성','發表留言'],['댓글작성','發表留言'],['댓글 수정','修改留言'],['댓글 삭제','刪除留言'],['비밀번호','密碼'],['비밀글','悄悄話'],['이름','姓名'],['수정','編輯'],['삭제','移除'],['변경','變更'],['선택','選擇'],['목록','返回列表'],['답변','回覆'],['신고','檢舉'],['차단','封鎖'],['닫기','關閉'],['확인','確認'],
    ['상품 검색','商品搜尋'],['상품명 검색','搜尋商品名稱'],['24개씩 보기','每頁 24 件'],['페이지','頁碼'],['번호','編號'],['분류','分類'],['제목','標題'],['작성자','作者'],['작성일','日期'],['조회수','瀏覽'],['추천','推薦'],['평점','評分']
  ];
  TOKENS.sort(function (a, b) { return b[0].length - a[0].length; });

  var PHRASE_REPLS = [
    [/\bNOOZ\b/gi, 'NUESE'],
    [/\bnuese\b/g, 'NUESE'],
    [/SOAP\s+AND\s+WATER/g, 'SOAP & WATER'],
    [/\bTHE\s+BRUNCH\b/g, 'BRUNCH'],
    [/\bLAKESIDE\s+STUDIOS\b/g, 'LAKE'],
    [/\bbreathe\b/g, 'BREATHE'],
    [/\bTempting\b/g, 'TEMPTING'],
    [/\bMORE\s+THAN\s+YESTERDAY\b/g, 'MORETHAN YESTERDAY']
  ];

  function normalizeBrands(s) {
    var out = String(s || '');
    for (var i = 0; i < PHRASE_REPLS.length; i++) out = out.replace(PHRASE_REPLS[i][0], PHRASE_REPLS[i][1]);
    return out;
  }

  function translateKrString(str) {
    var s = String(str || '');
    if (!s) return s;
    s = normalizeBrands(s);
    // Fix broken Cafe24 i18n keys (TW checkout selects / zipcode btn)
    s = s.replace(/^:?SELECT\.CITY\.TW$/i, '請選擇縣市');
    s = s.replace(/ADDR\.COMMON\.FORMAT[\s\u0004]*ZIPCODEBTN\.TW/gi, '查詢郵遞區號');
    s = s.replace(/^ZIPCODEBTN\.TW$/i, '查詢郵遞區號');
    if (s.trim() === '주/도') s = s.replace('주/도', '州／省');
    if (!/[가-힣]/.test(s)) return s;
    // Convert KRW amounts like 99,000원 -> NT$2,445
    s = s.replace(/([\d,]+)\s*원/g, function (_, num) {
      var krw = parseInt(num.replace(/,/g, ''), 10);
      if (!krw || isNaN(krw)) return '';
      var twd = Math.round(krw / 40.4967);
      return 'NT$' + twd.toLocaleString('en-US');
    });
    // Korean return address -> English
    s = s.replace(/\[39145\]\s*경상북도\s*구미시\s*고아읍\s*원대로\s*111-8[^\n]*/g, '[39145] 111-8, Wondae-ro, Goa-eup, Gumi-si, Gyeongbuk, Republic of Korea');
    s = s.replace(/경상북도\s*구미시\s*고아읍\s*원대로\s*111-8/g, '111-8, Wondae-ro, Goa-eup, Gumi-si, Gyeongbuk, Republic of Korea');
    s = s.replace(/\[\s*\]에\s*자동\s*저장/g, '自動儲存至我的諮詢紀錄');
    s = s.replace(/\[([^\]]+)\]\s*에\s*자동\s*저장/g, '自動儲存至 [$1]');
    for (var i = 0; i < TOKENS.length; i++) {
      if (s.indexOf(TOKENS[i][0]) !== -1) s = s.split(TOKENS[i][0]).join(TOKENS[i][1]);
    }
    s = s.replace(/(^|[^가-힣])면(?=\s*\d+%)/g, '$1棉').replace(/(^|[^가-힣])마(?=\s*\d+%)/g, '$1亞麻').replace(/(^|[^가-힣])모(?=\s*\d+%)/g, '$1羊毛');
    var st = s.trim();
    if (st === '보') s = s.replace('보', '紫色');
    else if (st === '먹') s = s.replace('먹', '深炭灰');
    else if (st === '곤') s = s.replace('곤', '深海軍藍');
    else if (st === '밤') s = s.replace('밤', '栗棕色');
    else if (st === '아이') s = s.replace('아이', '象牙白');
    else if (st === '탄') s = s.replace('탄', '焦糖棕');
    else if (st === '숏') s = s.replace('숏', '短版');
    else if (st === '롱') s = s.replace('롱', '長版');
    s = s.replace(/(\d+)\s*개(?=\s|$|\)|\]|,|\/)/g, '$1 件');
    s = s.replace(/\s*-\s*(\d+)\s*개/g, ' - $1 件');
    return s;
  }

  var IS_SHOP7_PREFIX = /^\/shop7(?=\/|$)/.test(location.pathname);

  function normalizeShopHref(h) {
    if (!h || h.charAt(0) !== '/' || h.indexOf('//') === 0 || h.indexOf('/exec/') === 0 || h.indexOf('/SkinImg/') === 0) return h;
    if (IS_SHOP7_PREFIX) {
      if (h.indexOf('/shop7/') === 0 || h === '/shop7') return h;
      if (/^\/(product|member|order|myshop|board|shopinfo|benefit\.html|magazine\.html|channels\.html)/.test(h)) return '/shop7' + h;
      return h;
    }
    if (h === '/shop7' || h === '/shop7/') return '/';
    if (h.indexOf('/shop7/') === 0) return h.slice(6);
    return h;
  }

  var busy = false;
  function runShop7Polish() {
    if (busy) return;
    busy = true;
    try {
      // 1. Express pay notice
      var epn = document.getElementById('leidu-express-pay-notice');
      if (epn && epn.getAttribute('data-zh') !== '1') {
        epn.setAttribute('data-zh', '1');
        epn.innerHTML = '<strong>會員結帳優惠說明</strong> · 登入會員單筆滿 <strong>NT$1,000</strong>，於上方 <strong>[立即購買／加入購物車]</strong> 官方結帳頁自動折抵 <strong>5%~10% 專屬優惠</strong>。';
      }

      // 2. Legal footer & Progress Paybar & Multishop Language
      var legal = document.querySelector('#footer .leidu-legal');
      if (legal && /[가-힣]/.test(legal.textContent || '')) {
        legal.innerHTML = '公司名稱: LEIDU (South Korea) | 代表人: Park Mi-seon | 營業登記號: 196-48-00924 | 電商許可: 2021-Gumi-KR-0911 | 客服信箱: <a href="mailto:hello@leidu.co.kr">hello@leidu.co.kr</a><br/><span>個資保護負責人: Park Mi-seon · <a href="mailto:hello@leidu.co.kr">hello@leidu.co.kr</a> | </span>韓國出貨中心: [39145] 111-8, Wondae-ro, Goa-eup, Gumi-si, Gyeongbuk, Republic of Korea | Hosting by Cafe24 Corp.';
      }
      var escrow = document.querySelector('#footer .bt_escrow');
      if (escrow) escrow.remove();
      document.querySelectorAll('.leidu-detail-media > figure').forEach(function (fig) {
        if (fig.querySelector('iframe[src*="youtube"]')) fig.remove();
      });

      var paybarTxt = document.querySelector('#progressPaybar .txt');
      if (paybarTxt && /[가-힣]/.test(paybarTxt.textContent || '')) {
        paybarTxt.innerHTML = '付款處理中，請稍候。<br />訂單完成後視窗將自動關閉，付款完成前請勿關閉頁面。';
      }
      document.querySelectorAll('select[module="Layout_multishopShippingLanguagelist"] option, .worldshipLayer option').forEach(function (opt) {
        if (/한국어|LANGUAGE\s*:/i.test(opt.textContent || '')) {
          opt.textContent = (opt.textContent || '').replace(/한국어/g, '繁體中文').replace(/LANGUAGE\s*:/gi, '語言 :');
        }
      });

      // 3. Brand normalization in header, hero, cards
      document.querySelectorAll('.leidu-brand-directory a, .leidu-runway-col .leidu-col-brand, .leidu-runway-col .leidu-col-name, .prdList > li .description .name a, .xans-product-detail .deco_title td span').forEach(function (el) {
        if (el.children.length > 0) {
          el.childNodes.forEach(function (n) {
            if (n.nodeType === 3) {
              var nt = normalizeBrands(n.nodeValue);
              if (nt !== n.nodeValue) n.nodeValue = nt;
            }
          });
        } else {
          var t = el.textContent || '';
          var nt = normalizeBrands(t);
          if (nt !== t) el.textContent = nt;
        }
      });

      // 4. Select options, custom option triggers/choices, cart & orderform option rows (DOM text ONLY, never touch value)
      document.querySelectorAll('select option, .leidu-option-trigger, .leidu-option-choice, #totalProducts .option, #totalProducts td p.product span, .xans-order-basketpackage .option, .xans-order-basketpackage a[onclick*="showOptionChangeLayer"], #mCafe24Order .option, #mCafe24Order .optionItem, #ec-jigsaw-heading-orderProduct').forEach(function (el) {
        if (el.tagName === 'OPTION') {
          var ot = el.textContent || '';
          var ont = translateKrString(ot);
          if (ont !== ot) el.textContent = ont;
        } else {
          var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          var nodes = [], n;
          while ((n = w.nextNode())) {
            if (n.nodeValue && /[가-힣]/.test(n.nodeValue)) nodes.push(n);
          }
          nodes.forEach(function (tn) {
            var nt = translateKrString(tn.nodeValue);
            if (nt !== tn.nodeValue) tn.nodeValue = nt;
          });
        }
      });
      document.querySelectorAll('.xans-product-option th, .xans-product-detaildesign th').forEach(function (th) {
        var t = (th.textContent || '').trim();
        if (t === '색상' || t === '컬러') th.textContent = '顏色';
        else if (t === '사이즈' || t === '크기') th.textContent = '尺寸';
      });

      // 4b. Payment method labels (DOM text ONLY, never alter input.value)
      document.querySelectorAll('#ec-jigsaw-area-paymethod label').forEach(function (lbl) {
        var walk = document.createTreeWalker(lbl, NodeFilter.SHOW_TEXT);
        var tNodes = [], tn;
        while ((tn = walk.nextNode())) tNodes.push(tn);
        tNodes.forEach(function (n) {
          var raw = String(n.nodeValue || '');
          var tr = raw.trim();
          if (/^Global\s*Card$/i.test(tr)) n.nodeValue = raw.replace(/Global\s*Card/i, '國際信用卡 (VISA / MasterCard / JCB)');
          else if (/^UnionPay$/i.test(tr)) n.nodeValue = raw.replace(/UnionPay/i, '銀聯卡 (UnionPay)');
        });
      });

      // 4c. Dynamic basket & orderform i18n keys / placeholders (#mCafe24Order text nodes are handled by leidu-orderform-zh-tw-inline to avoid cloth-term collisions)
      document.querySelectorAll('.xans-order-basketpackage').forEach(function (rootBox) {
        var w = document.createTreeWalker(rootBox, NodeFilter.SHOW_TEXT);
        var nodes = [], n;
        while ((n = w.nextNode())) {
          if (!n.nodeValue) continue;
          var pTag = n.parentElement ? n.parentElement.tagName : '';
          if (pTag === 'SCRIPT' || pTag === 'STYLE' || pTag === 'TEXTAREA') continue;
          if (/[가-힣]|SELECT\.CITY\.TW|ZIPCODEBTN\.TW|ADDR\.COMMON\.FORMAT/.test(n.nodeValue)) nodes.push(n);
        }
        nodes.forEach(function (tn) {
          var nt = translateKrString(tn.nodeValue);
          if (nt !== tn.nodeValue) tn.nodeValue = nt;
          if (/[가-힣]{2,}/.test(tn.nodeValue || '')) {
            var hostP = tn.parentElement;
            if (hostP && !hostP.closest('table, tr, th, td, select, option, button, a, #prdReview, #prdQnA, .leidu-mounted-with-item, [data-leidu-with-item]')) {
              var blk = hostP.closest('p, li') || hostP;
              if (blk && !blk.querySelector('img, table, video, iframe, a[href*="product"]')) {
                blk.style.setProperty('display', 'none', 'important');
              }
            }
          }
        });
      });
      var orderBox = document.getElementById('mCafe24Order');
      if (orderBox) {
        orderBox.querySelectorAll('#btn_search_fzipcode, #ci_name_addr option').forEach(function (el) {
          var t = el.textContent || '';
          if (/SELECT\.CITY\.TW|ZIPCODEBTN\.TW|ADDR\.COMMON\.FORMAT|\u0004/.test(t)) {
            el.textContent = translateKrString(t);
          }
        });
      }

      // 5. Translate .leidu-today-stock DOM (hidden metadata, keeps 0 KR DOM nodes)
      document.querySelectorAll('.leidu-today-stock').forEach(function (sec) {
        sec.querySelectorAll('.leidu-today-label, .leidu-today-status, .leidu-today-option').forEach(function (el) {
          var t = el.textContent || '';
          if (/[가-힣]/.test(t)) {
            var nt = translateKrString(t);
            if (nt !== t) el.textContent = nt;
          }
        });
      });

      // 6. Translate WITH ITEM cards (.leidu-mounted-with-item & #prdDetail [data-leidu-with-item])
      document.querySelectorAll('.leidu-mounted-with-item, [data-leidu-with-item]').forEach(function (box) {
        box.querySelectorAll('a[href]').forEach(function (a) {
          var h = a.getAttribute('href') || '';
          var nh = normalizeShopHref(h);
          if (nh !== h) a.setAttribute('href', nh);
          var m = nh.match(/product_no=(\d+)/) || nh.match(/\/product\/[^/]+\/(\d+)/);
          var pno = m ? m[1] : '';
          var zhTitle = pno && PNO_ZH[pno];
          if (zhTitle) {
            var strong = a.querySelector('strong');
            if (strong && strong.textContent !== zhTitle) strong.textContent = zhTitle;
          }
        });
        var w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
        var nodes = [], n;
        while ((n = w.nextNode())) {
          if (n.nodeValue && (/[가-힣]/.test(n.nodeValue) || /NOOZ|BRUNCH|\bLAKE\b|SOAP & WATER/i.test(n.nodeValue))) nodes.push(n);
        }
        nodes.forEach(function (tn) {
          var nt = translateKrString(tn.nodeValue);
          if (nt !== tn.nodeValue) tn.nodeValue = nt;
          if (/[가-힣]{2,}/.test(tn.nodeValue || '')) {
            var hostP = tn.parentElement;
            if (hostP && !hostP.closest('table, tr, th, td, select, option, button, a, #prdReview, #prdQnA, .leidu-mounted-with-item, [data-leidu-with-item]')) {
              var blk = hostP.closest('p, li') || hostP;
              if (blk && !blk.querySelector('img, table, video, iframe, a[href*="product"]')) {
                blk.style.setProperty('display', 'none', 'important');
              }
            }
          }
        });
      });

      // 7. Clean review original-KR blocks & translate PDP detail notes, size tables, fit guide, delivery info, and review/QnA/board UI
      document.querySelectorAll('[data-kr-proof], .leidu-ext-review details').forEach(function (el) { el.remove(); });
      document.querySelectorAll('.leidu-ext-review p').forEach(function (p) {
        if ((p.textContent || '').indexOf('韓國買家原文') !== -1) p.remove();
      });
      var pdpTargets = document.querySelectorAll('.leidu-product-notes, .leidu-native-delivery, #prdInfo, #prdDetail, #prdReview, #prdQnA, .xans-board-listpackage, .xans-board-readpackage, .xans-board-commentpackage, .leidu-browse-tools');
      pdpTargets.forEach(function (rootEl) {
        var isBoardOrRev = rootEl.id === 'prdReview' || rootEl.id === 'prdQnA' || rootEl.classList.contains('xans-board-listpackage') || rootEl.classList.contains('xans-board-readpackage') || rootEl.classList.contains('xans-board-commentpackage');
        var w = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT);
        var nodes = [], n;
        while ((n = w.nextNode())) {
          if (!n.nodeValue) continue;
          var pEl = n.parentElement;
          if (pEl && (pEl.tagName === 'SCRIPT' || pEl.tagName === 'STYLE' || pEl.tagName === 'TEXTAREA')) continue;
          if (/[가-힣]/.test(n.nodeValue) || /NOOZ|BRUNCH|\bLAKE\b|SOAP & WATER/i.test(n.nodeValue)) nodes.push(n);
        }
        nodes.forEach(function (tn) {
          var nt = translateKrString(tn.nodeValue);
          if (nt !== tn.nodeValue) tn.nodeValue = nt;
          if (!isBoardOrRev && /[가-힣]{2,}/.test(tn.nodeValue || '')) {
            var hostP = tn.parentElement;
            if (hostP && !hostP.closest('table, tr, th, td, select, option, button, a, #prdReview, #prdQnA, .leidu-mounted-with-item, [data-leidu-with-item]')) {
              var blk = hostP.closest('p, li') || hostP;
              if (blk && !blk.querySelector('img, table, video, iframe, a[href*="product"]')) {
                blk.style.setProperty('display', 'none', 'important');
              }
            }
          }
        });
      });

      // 8. Rewrite root-relative shop links cleanly per host/prefix (only /shop7 on shop7 prefix, root on tw.leidu.co.kr)
      document.querySelectorAll('a[href]').forEach(function (a) {
        var h = a.getAttribute('href') || '';
        var nh = normalizeShopHref(h);
        if (nh !== h) a.setAttribute('href', nh);
      });


      // 9b. Repair /shopinfo/guide.html shell-stripped NT$ amounts & Mainland China #prdInfo payment boilerplate
      document.querySelectorAll('.leidu-faq-item, .leidu-faq-content, .leidu-service-layout, #contents details').forEach(function (box) {
        var html = box.innerHTML || '';
        if (html.indexOf('NT,000') !== -1 || html.indexOf('現貨當日出') !== -1) {
          box.innerHTML = html
            .replace(/滿\s*NT,000\s*升等\s*((?:<[^>]*>\s*)*)GLOBAL\s*VVIP/g, '滿 NT$15,000 升等 $1GLOBAL VVIP')
            .replace(/滿\s*NT,000\s*升等\s*((?:<[^>]*>\s*)*)GLOBAL\s*VIP/g, '滿 NT$8,000 升等 $1GLOBAL VIP')
            .replace(/滿\s*NT,000\s*自動折抵/g, '滿 NT$1,000 自動折抵')
            .replace(/現貨當日出(?!貨)/g, '今日出貨');
        }
      });
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && /[가-힣]/.test(metaDesc.getAttribute('content') || '')) {
        metaDesc.setAttribute('content', 'LEIDU 韓國官方直營女裝旗艦店 — 韓國直播實穿呈現、全館逾 4,400 則真實買家評價、現貨今日出貨直送台灣與香港。');
      }
      document.querySelectorAll('.xans-board-listpackage th, .ec-base-table thead th').forEach(function (th) {
        var t = (th.textContent || '').trim();
        if (t === '번호') th.textContent = '編號';
        else if (t === '분류') th.textContent = '分類';
        else if (t === '제목') th.textContent = '標題';
        else if (t === '작성자') th.textContent = '作者';
        else if (t === '작성일') th.textContent = '日期';
        else if (t === '조회수') th.textContent = '瀏覽';
        else if (t === '추천') th.textContent = '推薦';
        else if (t === '평점') th.textContent = '評分';
      });
      var prdInfoEl = document.getElementById('prdInfo');
      if (prdInfoEl && prdInfoEl.getAttribute('data-zh-clean') !== '1') {
        prdInfoEl.setAttribute('data-zh-clean', '1');
        prdInfoEl.querySelectorAll('*').forEach(function (el) {
          if (el.children.length === 0 && /內地工商銀行|農業銀行|建設銀行/.test(el.textContent || '')) {
            el.textContent = '支援國際信用卡（VISA / MasterCard / JCB / UnionPay）及 Eximbay 海外安全結帳，全程以新台幣 (NT$) 透明計價，免除海外代購手續費。';
          }
        });
      }
      document.querySelectorAll('.leidu-delivery-table tr, .xans-product-detaildesign tr').forEach(function (tr) {
        var th = tr.querySelector('th'), td = tr.querySelector('td');
        if (th && td && /品質保證標準/.test(th.textContent || '') && (td.textContent || '').trim() === '1') {
          td.textContent = '依韓國相關消費者保護規範辦理';
        }
      });

      // 9. Magazine controls fallback
      var magHead = document.querySelector('.leidu-mag-seo-head');
      if (magHead) {
        var h1 = magHead.querySelector('h1');
        var sp = magHead.querySelector('span');
        if (h1) h1.textContent = 'LEIDU WEEKLY 品牌穿搭特輯';
        if (sp) sp.textContent = 'LEIDU 首爾官方旗艦店每週造型專刊';
      }
      var magApp = document.getElementById('leidu-magazine-app');
      if (magApp) {
        magApp.querySelectorAll('span, a, div, button').forEach(function (el) {
          if (el.children.length > 0) return;
          var t = (el.textContent || '').trim();
          if (t === '제품 보기 →' || t === '제품 보기') el.textContent = '查看單品 →';
          else if (t === '☰ 전체 매거진') el.textContent = '☰ 所有期數';
          else if (t === '← 이전 호') el.textContent = '← 上一期';
          else if (t === '다음 호 →') el.textContent = '下一期 →';
          else if (t === '최신 호') el.textContent = '最新一期';
          else if (t === '가장 최신 발행호입니다') el.textContent = '目前已是最新一期';
          else if (t === '전 회차 이어보기') el.textContent = '瀏覽所有期數';
          else if (t.indexOf('전체 매거진 아카이브 보기') >= 0) el.textContent = '查看所有品牌雜誌期數 (ALL ISSUES) →';
        });
      }
      var chHub = document.getElementById('leidu-channels-hub');
      if (chHub && chHub.getAttribute('data-zh') !== '1') {
        chHub.setAttribute('data-zh', '1');
        var chH1 = chHub.querySelector('.lch-hero h1'), chSub = chHub.querySelector('.lch-hero-sub');
        if (chH1) chH1.innerHTML = '隨時隨地，探索韓國首爾女裝精品<br/>LEIDU 繁體中文官方頻道';
        if (chSub) chSub.textContent = '從繁體中文官方旗艦店專屬禮遇，到每週造型雜誌與實穿影片一次瀏覽。';
        var mc = chHub.querySelector('.lch-main-card');
        if (mc) {
          var rp = mc.querySelector('.lch-rate-pill'), mt = mc.querySelector('.lch-main-title'), ms = mc.querySelector('.lch-main-sub'), bg = mc.querySelector('.lch-btn-gold'), bo = mc.querySelector('.lch-btn-outline');
          if (rp) rp.textContent = '5% – 10% OFF';
          if (mt) mt.textContent = 'LEIDU 繁體中文官方旗艦店';
          if (ms) ms.innerHTML = '<strong>免費註冊立即享 5%~10% 會員禮遇</strong> · <strong>任選 2 件順豐空運免運</strong> · <strong>4,400+ 真實買家評價與實穿影片</strong>';
          if (bg) { bg.href = '/benefit.html'; bg.textContent = '查看會員專屬禮遇 →'; }
          if (bo) { bo.href = '/'; bo.textContent = '立即前往選購 →'; }
        }
        chHub.querySelectorAll('.lch-market-card').forEach(function (el) { el.remove(); });
        var sb = chHub.querySelector('.lch-sub-bar');
        if (sb) sb.innerHTML = '<a class="lch-sub-link" href="/board/gallery/list.html?board_no=8">📖 本週 LEIDU WEEKLY 品牌雜誌</a><a class="lch-sub-link" href="/shopinfo/company.html#leidu-film">🎥 LEIDU 實穿直播與秀場影片</a>';
      }
    } finally {
      busy = false;
    }
  }

  document.addEventListener('click', function () {
    setTimeout(runShop7Polish, 250);
  }, true);
  document.addEventListener('change', function () {
    setTimeout(runShop7Polish, 120);
  }, true);
  if (typeof MutationObserver !== 'undefined') {
    var polishRaf = 0;
    var polishObs = new MutationObserver(function () {
      if (!polishRaf) polishRaf = requestAnimationFrame(function () { polishRaf = 0; runShop7Polish(); });
    });
    var attachObs = function () {
      document.querySelectorAll('#mCafe24Order, #totalProducts, .xans-order-basketpackage, #prdReview, #prdQnA').forEach(function (el) {
        polishObs.observe(el, { childList: true, subtree: true });
      });
    };
    if (document.body) attachObs(); else document.addEventListener('DOMContentLoaded', attachObs, { once: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runShop7Polish);
  else runShop7Polish();
  window.addEventListener('load', runShop7Polish);
  setTimeout(runShop7Polish, 500);
  setTimeout(runShop7Polish, 1500);
  setTimeout(runShop7Polish, 3000);
})();
