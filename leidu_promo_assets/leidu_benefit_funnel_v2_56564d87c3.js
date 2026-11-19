// WL168 ready-mode; campaign launcher enables this exact flag only after CEO GO.
window.LEIDU_EASYPAY_CAMPAIGN_ENABLED=false;
/* WL160/WL164: confirmed membership display and immediate anonymous-price guard. */
(function () {
  'use strict';
  function getMemberTierInfo() {
    var c=window.CAPP_ASYNC_METHODS||{},m=c.member||{},data={};
    try{data=typeof m.getData==='function'?m.getData()||{}:m;}catch(_){}
    var memberId=String(data.member_id||m.__sMemberId||m.member_id||'').trim();
    if(memberId.indexOf('{$')>=0)memberId='';
    var on=!!document.querySelector('.xans-layout-statelogon');
    var off=!!document.querySelector('.xans-layout-statelogoff');
    var isLogged=c.IS_LOGIN!==false&&(c.IS_LOGIN===true||!!memberId||(on&&!off));
    if(!isLogged)return {isLogged:false,memberId:'',gradeName:'',rate:0,sessionStale:false,sessionRate:0};
    var grade=String(data.group_name||m.__sGroupName||m.group_name||'').trim();
    if(!grade){var p=document.querySelector('#leidu-member-grade-probe .xans-member-var-group_name,#leidu-member-grade-probe .leidu-probe-group');grade=String(p&&p.textContent||'').replace(/[\[\]\s]+/g,' ').trim();}
    if(!grade||grade.indexOf('{$')>=0)grade='일반회원';
    var rates={VVIP:15,VIP:14,GOLD:13,SILVER:12,'일반회원':12};
    var currentSessionRate=rates[grade.toUpperCase()]||rates[grade]||12;
    try{
      var syncedId=sessionStorage.getItem("leidu_synced_mid_v1"),benefit=JSON.parse(sessionStorage.getItem("leidu_member_benefit_v1")||"null");
      if(memberId&&syncedId===memberId&&benefit&&["SILVER","GOLD","VIP","VVIP"].includes(String(benefit.group||"").toUpperCase())&&Number(benefit.rate)>=12&&Number(benefit.rate)<=15)
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
    var target=/^\/myshop\//.test(location.pathname)||/^\/(?:product\/detail|order\/basket|order\/orderform)\.html$/.test(location.pathname)||!!document.querySelector('.xans-product-detail');
    var banner=document.getElementById('leidu-session-refresh-banner');
    if(target&&tierInfo.sessionStale){
      var host=document.querySelector('#contents,main')||document.body;
      if(host){
        if(!banner){banner=document.createElement('aside');banner.id='leidu-session-refresh-banner';banner.setAttribute('role','status');banner.style.cssText='box-sizing:border-box;max-width:100%;margin:16px 0;padding:14px 16px;border:1px solid #baa17c;background:#fff8eb;color:#3c3020;font-size:14px;line-height:1.7;overflow-wrap:anywhere';host.insertBefore(banner,host.firstChild);}
        if(banner.dataset.membershipSignature!==signature){banner.dataset.membershipSignature=signature;
        banner.textContent='⚡ '+tierInfo.gradeName+'(상시 '+tierInfo.rate+'% 할인) 승급 완료! 주문서 결제 금액에 '+tierInfo.rate+'% 할인을 적용하려면 ';
        var link=document.createElement('a');link.href='/exec/front/Member/logout/?returnUrl=%2Fmember%2Flogin.html';link.textContent='🔄 1초 재로그인하여 등급 바로 반영하기';link.style.cssText='color:inherit;font-weight:700;text-decoration:underline';banner.appendChild(link);banner.appendChild(document.createTextNode(' 해 주세요 >'));}
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
  var root=document.documentElement, c=window.CAPP_ASYNC_METHODS;
  var member=!!(c && (c.IS_LOGIN===true || (c.member && (c.member.__sMemberId || c.member.member_id))));
  if (c && c.IS_LOGIN===false) member=false;
  if (!c || typeof c.IS_LOGIN!=='boolean') member=member || !!(document.querySelector('.xans-layout-statelogon') && !document.querySelector('.xans-layout-statelogoff'));
  root.classList.toggle('leidu-is-member',member);
  root.classList.toggle('leidu-is-guest',!member);
  root.classList.toggle('leidu-wl150-express-guard',/\/product\/detail\.html$|\/order\/basket\.html$/.test(location.pathname) || !!document.querySelector('.xans-product-detail,.xans-order-basketpackage'));
  var st=document.createElement('style'); st.id='leidu-wl150-wl151-boutique-style';
  st.textContent="/* WL150: private list prices; PDP/basket teaser selectors deliberately unchanged. */\nhtml.leidu-is-guest body #contents .prdList li .description .spec li.leidu-member-price-row,\nhtml.leidu-is-guest .leidu-mbp-wrap .leidu-hero-benefit-row{display:none!important}\nhtml.leidu-is-guest body #contents .prdList li .description .spec li.leidu-orig-price-muted{color:#000!important;opacity:1!important;font-weight:400!important;text-decoration:none!important;text-decoration-line:none!important}\nhtml.leidu-is-guest body #contents .prdList li .description .spec li.leidu-orig-price-muted > span:not(.title):not(.leidu-price-badges):not(.leidu-free-shipping-badge):not(#span_product_tax_type_text),\nhtml.leidu-is-guest body #contents .prdList li .description .spec li.leidu-orig-price-muted > span:not(.title):not(.leidu-price-badges):not(.leidu-free-shipping-badge):not(#span_product_tax_type_text) > span:not(.leidu-price-badges):not(.leidu-free-shipping-badge){text-decoration:none!important;text-decoration-line:none!important;text-decoration-color:currentColor!important;text-decoration-thickness:auto!important;color:#000!important;font-size:13px!important;line-height:20px!important;opacity:1!important;font-weight:400!important}\nhtml.leidu-is-guest .leidu-mbp-wrap .leidu-hero-orig{text-decoration:none!important;color:#FAF7F2!important;opacity:.96!important;font-size:13.5px!important;font-weight:600!important}\nhtml.leidu-is-guest .leidu-mbp-wrap .leidu-hero-orig::after{content:\" →\";font-style:normal;opacity:.75}\n/* WL151: the same sticky-buy clearance drives both buttons, with a 12px gap. */\nhtml body .moveToTop_module,html body .moveToTop_module.visible{position:fixed!important;top:auto!important;right:14px!important;bottom:calc(74px + env(safe-area-inset-bottom,0px))!important;transform:none!important;transition:opacity .3s!important;margin:0!important}\nhtml body:has(#leidu-messenger[open]) .moveToTop_module{display:none!important}\n/* Actual Cafe24 SNS markup, with the existing Kakao action kept intact. */\nhtml.leidu-is-login body #contents ul.snsArea > li.btn_kakao{order:-1}\nhtml.leidu-is-login body #contents ul.snsArea > li.btn_kakao > a{background:#FEE500!important;color:#191919!important;border-color:#E5CE00!important;font-weight:700!important;order:-1}\nhtml.leidu-is-login body #contents ul.snsArea > li.btn_kakao > a *{color:#191919!important}\nhtml body #leidu-kakao-sync-login-guide{margin:12px 0 0!important;font-size:12px!important;line-height:1.65!important;color:#5B5146!important;font-weight:400!important;word-break:keep-all!important;overflow-wrap:anywhere!important;text-align:left!important}\n@media(max-width:767px){\nhtml.leidu-is-guest body #contents .prdList li .description .spec li.leidu-orig-price-muted > span:not(.title):not(.leidu-price-badges):not(.leidu-free-shipping-badge):not(#span_product_tax_type_text),\nhtml.leidu-is-guest body #contents .prdList li .description .spec li.leidu-orig-price-muted > span:not(.title):not(.leidu-price-badges):not(.leidu-free-shipping-badge):not(#span_product_tax_type_text) > span:not(.leidu-price-badges):not(.leidu-free-shipping-badge){font-size:12px!important;line-height:18px!important}\nhtml.leidu-has-sticky-buy body .moveToTop_module{bottom:calc(max(76px,var(--leidu-sticky-buy-clearance,76px)) + 56px + env(safe-area-inset-bottom,0px))!important}\n}\nhtml.leidu-is-member.leidu-wl150-express-guard #NaverChk_Button,html.leidu-is-member.leidu-wl150-express-guard #NPAY_BUTTON_BOX_ID,html.leidu-is-member.leidu-wl150-express-guard .npay_storebtn_bx,html.leidu-is-member.leidu-wl150-express-guard #kakao-checkout-button,html.leidu-is-member.leidu-wl150-express-guard #appPaymentButtonBox,html.leidu-is-member.leidu-wl150-express-guard .leidu-express-payments,html.leidu-is-member.leidu-wl150-express-guard #leidu-express-pay-notice{display:none!important}\n";
  (document.head || root).appendChild(st);
})();
/* LEIDU Official Mall Funnel Upgrade v2 (WL-43, 2026-11-16) */
(function () {
  'use strict';
  var POPUP_CSS = ".leidu-bpop-backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 9990;\n  display: none;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n  background: rgba(8, 7, 6, 0.72);\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n  box-sizing: border-box;\n}\n.leidu-bpop-backdrop.is-open {\n  display: flex;\n}\n.leidu-bpop-modal {\n  position: relative;\n  width: 100%;\n  max-width: 468px;\n  max-height: calc(100svh - 28px);\n  background: #0C0B0A url(\"https://res.cloudinary.com/dfzukpair/image/upload/v1794823409/leidu_promo_assets/winter_soap_and_water_1.jpg\") center 24% / cover no-repeat;\n  border: 1.5px solid rgba(232, 204, 158, 0.42);\n  box-shadow: 0 32px 84px rgba(0, 0, 0, 0.72);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  font-family: \"Pretendard\", \"Apple SD Gothic Neo\", -apple-system, BlinkMacSystemFont, \"Noto Sans KR\", sans-serif;\n  word-break: keep-all;\n  color: #FFFFFF;\n  -webkit-font-smoothing: antialiased;\n}\n.leidu-bpop-modal::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(180deg, rgba(12, 11, 10, 0.80) 0%, rgba(12, 11, 10, 0.86) 46%, rgba(10, 9, 8, 0.97) 100%);\n  pointer-events: none;\n  z-index: 0;\n}\n.leidu-bpop-modal > * {\n  position: relative;\n  z-index: 1;\n}\n.leidu-bpop-scroll {\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch;\n  flex: 1 1 auto;\n  padding: 26px 26px 22px;\n}\n.leidu-bpop-topclose {\n  position: absolute;\n  top: 18px;\n  right: 18px;\n  z-index: 5;\n  width: 34px;\n  height: 34px;\n  border: 1px solid rgba(243, 217, 176, 0.36);\n  border-radius: 50%;\n  background: rgba(12, 11, 10, 0.68);\n  color: #FFFFFF;\n  font-size: 19px;\n  line-height: 1;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.leidu-bpop-brandrow {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding-right: 44px;\n  padding-bottom: 16px;\n  border-bottom: 1px solid rgba(232, 204, 158, 0.26);\n}\n.leidu-bpop-logo {\n  font-family: Georgia, \"Times New Roman\", serif;\n  font-size: 18px;\n  font-weight: 600;\n  letter-spacing: 0.30em;\n  color: #FFFFFF;\n}\n.leidu-bpop-kicker {\n  font-size: 10.5px;\n  font-weight: 700;\n  letter-spacing: 0.18em;\n  color: #F3D9B0;\n  padding: 4px 10px;\n  border: 1px solid rgba(238, 210, 164, 0.58);\n  background: rgba(12, 11, 10, 0.72);\n}\n.leidu-bpop-herocopy {\n  display: block;\n  margin: 22px 0 20px;\n  text-decoration: none !important;\n}\n.leidu-bpop-headline {\n  margin: 0;\n  font-size: 30px;\n  font-weight: 800;\n  line-height: 1.26;\n  letter-spacing: -0.025em;\n  color: #FFFFFF;\n  text-shadow: 0 3px 22px rgba(0, 0, 0, 0.75);\n}\n.leidu-bpop-headline em {\n  font-style: normal;\n  color: #F6DFB7;\n}\n.leidu-bpop-summary {\n  display: flex;\n  flex-direction: column;\n  gap: 11px;\n  margin-bottom: 22px;\n}\n.leidu-bpop-row {\n  background: rgba(14, 13, 11, 0.84);\n  border: 1px solid rgba(232, 204, 158, 0.32);\n  border-left: 4px solid #E8CAA0;\n  padding: 15px 18px;\n  text-align: left;\n}\n.leidu-bpop-row strong {\n  display: block;\n  font-size: 18.5px;\n  font-weight: 800;\n  line-height: 1.32;\n  letter-spacing: -0.015em;\n  color: #FFFFFF;\n}\n.leidu-bpop-row span {\n  display: block;\n  margin-top: 4px;\n  font-size: 13.5px;\n  font-weight: 500;\n  line-height: 1.38;\n  color: #EADBC4;\n}\n.leidu-bpop-actions {\n  display: grid;\n  grid-template-columns: 1.52fr 0.82fr;\n  gap: 8px;\n}\n.leidu-bpop-btn-kakao {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 50px;\n  background: #FEE500;\n  color: #171300 !important;\n  font-size: 15px;\n  font-weight: 800;\n  letter-spacing: -0.015em;\n  text-decoration: none !important;\n  border-radius: 2px;\n  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);\n}\n.leidu-bpop-btn-detail {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 50px;\n  background: rgba(232, 204, 158, 0.14);\n  border: 1px solid rgba(232, 204, 158, 0.54);\n  color: #F7EAD2 !important;\n  font-size: 14.5px;\n  font-weight: 700;\n  letter-spacing: -0.01em;\n  text-decoration: none !important;\n  border-radius: 2px;\n}\n.leidu-bpop-footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 40px;\n  padding: 0 20px;\n  background: rgba(8, 7, 6, 0.94);\n  border-top: 1px solid rgba(232, 204, 158, 0.18);\n  flex-shrink: 0;\n}\n.leidu-bpop-footer button {\n  border: 0;\n  background: transparent;\n  color: rgba(250, 247, 242, 0.88);\n  font-size: 12px;\n  font-weight: 500;\n  cursor: pointer;\n  padding: 6px 4px;\n}\n.leidu-bpop-footer button:hover {\n  color: #FFFFFF;\n}\n@media (max-width: 767px) {\n  .leidu-bpop-backdrop { padding: 12px; }\n  .leidu-bpop-modal { max-width: 372px; max-height: calc(100svh - 24px); }\n  .leidu-bpop-scroll { padding: 20px 18px 18px; }\n  .leidu-bpop-topclose { top: 14px; right: 14px; width: 31px; height: 31px; font-size: 17px; }\n  .leidu-bpop-headline { font-size: 25px; }\n  .leidu-bpop-summary { gap: 9px; margin-bottom: 18px; }\n  .leidu-bpop-row { padding: 13px 14px; }\n  .leidu-bpop-row strong { font-size: 16.5px; }\n  .leidu-bpop-row span { font-size: 12.5px; }\n  .leidu-bpop-actions { grid-template-columns: 1fr; gap: 7px; }\n  .leidu-bpop-btn-kakao, .leidu-bpop-btn-detail { height: 46px; font-size: 14.5px; }\n  .leidu-bpop-footer { height: 38px; padding: 0 16px; }\n}\n/* Board #4001 typography protection against Cafe24 12px!important rule */\nhtml body #contents .xans-board-read .leidu-benefit-notice-post h2 {\n  font-size: 24px !important;\n  font-weight: 600 !important;\n  line-height: 1.35 !important;\n}\nhtml body #contents .xans-board-read .leidu-benefit-notice-post h3 {\n  font-size: 17px !important;\n  font-weight: 700 !important;\n  line-height: 1.4 !important;\n}\nhtml body #contents .xans-board-read .leidu-benefit-notice-post p,\nhtml body #contents .xans-board-read .leidu-benefit-notice-post span,\nhtml body #contents .xans-board-read .leidu-benefit-notice-post strong {\n  font-size: inherit !important;\n  line-height: inherit !important;\n}\nhtml body #contents .xans-board-read .leidu-benefit-notice-post strong {\n  font-weight: 700 !important;\n}\nhtml body #contents .xans-board-read .leidu-benefit-notice-post a.leidu-notice-cta {\n  font-size: 13.5px !important;\n  font-weight: 700 !important;\n  line-height: 1.2 !important;\n}";
  var POPUP_HTML = "<div class=\"leidu-bpop-modal\">\n    <button type=\"button\" class=\"leidu-bpop-topclose\" data-bpop-close aria-label=\"팝업 닫기\">×</button>\n    <div class=\"leidu-bpop-scroll\">\n      <div class=\"leidu-bpop-brandrow\">\n        <span class=\"leidu-bpop-logo\">LEIDU</span>\n        <span class=\"leidu-bpop-kicker\">OFFICIAL BOUTIQUE</span>\n      </div>\n      <a href=\"/benefit.html\" class=\"leidu-bpop-herocopy\" aria-label=\"스마트스토어 VIP 등급 1초 자동 승계\">\n        <h3 class=\"leidu-bpop-headline\">스마트스토어 VIP 등급<br/><em>1초 자동 승계</em></h3>\n      </a>\n      <div class=\"leidu-bpop-summary\">\n        <div class=\"leidu-bpop-row\">\n          <strong>12% ~ 15% 무제한 상시 할인</strong>\n          <span>(카카오 1초 가입 즉시 · 횟수 제한 없음)</span>\n        </div>\n        <div class=\"leidu-bpop-row\">\n          <strong>전 마켓 리뷰 4,000+ 통합 &amp; 라이브 착장 영상</strong>\n        </div>\n        <div class=\"leidu-bpop-row\">\n          <strong>3만원 이상 무료배송</strong>\n          <span>(4만원 이상 등급할인 적용)</span>\n        </div>\n      </div>\n      <div class=\"leidu-bpop-actions\">\n        <a href=\"/member/login.html\" class=\"leidu-bpop-btn-kakao\">카카오 1초 가입 · 내 등급 확인 &gt;</a>\n        <a href=\"/benefit.html\" class=\"leidu-bpop-btn-detail\">혜택 안내 &gt;</a>\n      </div>\n    </div>\n    <div class=\"leidu-bpop-footer\">\n      <button type=\"button\" data-bpop-hide-today>오늘 하루 보지 않기</button>\n      <button type=\"button\" data-bpop-close>닫기 ×</button>\n    </div>\n  </div>";
  var BENEFIT_CSS = "html body #contents:has(#leidu-benefit-page) {\n  width: 100% !important;\n  max-width: 100% !important;\n  margin: 0 auto !important;\n  padding: 90px 0 0 !important;\n  background: #FAF7F2 !important;\n  box-sizing: border-box;\n}\n#leidu-benefit-page {\n  color: #211C18;\n  background: #FAF7F2;\n  font-family: -apple-system, BlinkMacSystemFont, \"Apple SD Gothic Neo\", \"Pretendard\", \"Noto Sans KR\", sans-serif;\n  word-break: keep-all;\n  -webkit-font-smoothing: antialiased;\n}\n#leidu-benefit-page * {\n  box-sizing: border-box;\n}\n.leidu-bf-hero {\n  position: relative;\n  overflow: hidden;\n  background: #241D18 url(\"https://res.cloudinary.com/dfzukpair/image/upload/v1794823409/leidu_promo_assets/winter_soap_and_water_1.jpg\") center 26% / cover no-repeat;\n  color: #FAF7F2;\n  padding: 102px 24px 74px;\n  text-align: center;\n  border-bottom: 1px solid rgba(226, 212, 192, 0.24);\n}\n.leidu-bf-hero::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(180deg, rgba(28, 22, 18, 0.68) 0%, rgba(28, 22, 18, 0.56) 45%, rgba(28, 22, 18, 0.90) 100%);\n}\n.leidu-bf-hero-inner {\n  position: relative;\n  z-index: 1;\n  max-width: 880px;\n  margin: 0 auto;\n}\n.leidu-bf-eyebrow {\n  display: inline-flex;\n  align-items: center;\n  gap: 12px;\n  font-size: 11.5px;\n  font-weight: 600;\n  letter-spacing: 0.24em;\n  color: #E2D1B8;\n  margin-bottom: 16px;\n  text-transform: uppercase;\n}\n.leidu-bf-eyebrow::before,\n.leidu-bf-eyebrow::after {\n  content: \"\";\n  display: inline-block;\n  width: 26px;\n  height: 1px;\n  background: rgba(226, 209, 184, 0.5);\n}\n.leidu-bf-hero h1 {\n  margin: 0 0 16px;\n  font-family: \"Nanum Myeongjo\", Georgia, serif;\n  font-size: 36px;\n  font-weight: 600;\n  line-height: 1.32;\n  letter-spacing: -0.02em;\n  color: #FFFFFF;\n}\n.leidu-bf-hero-desc {\n  margin: 0 auto 24px;\n  max-width: 700px;\n  font-size: 15.5px;\n  line-height: 1.74;\n  color: rgba(250, 247, 242, 0.92);\n}\n.leidu-bf-hero-desc strong {\n  color: #FFE4B8;\n  font-weight: 700;\n}\n.leidu-bf-hero-pills {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 8px;\n  margin: 0 auto 28px;\n}\n.leidu-bf-hero-pill {\n  display: inline-flex;\n  align-items: center;\n  padding: 6px 14px;\n  border: 1px solid rgba(226, 209, 184, 0.42);\n  background: rgba(34, 26, 20, 0.48);\n  color: #F6EFE4;\n  font-size: 12.5px;\n  font-weight: 500;\n  border-radius: 999px;\n}\n.leidu-bf-cta-group {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 12px;\n}\n.leidu-bf-btn-kakao {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  min-width: 272px;\n  height: 52px;\n  padding: 0 28px;\n  background: #FEE500;\n  color: #1F1A00 !important;\n  font-size: 14.5px;\n  font-weight: 700;\n  text-decoration: none !important;\n  border-radius: 3px;\n}\n.leidu-bf-btn-shop {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  min-width: 236px;\n  height: 52px;\n  padding: 0 26px;\n  background: rgba(250, 247, 242, 0.12);\n  border: 1px solid rgba(250, 247, 242, 0.45);\n  color: #FFFFFF !important;\n  font-size: 14px;\n  font-weight: 500;\n  text-decoration: none !important;\n  border-radius: 3px;\n}\n.leidu-bf-live-status {\n  display: none;\n  margin: 22px auto 0;\n  max-width: 640px;\n  padding: 12px 18px;\n  background: rgba(36, 28, 22, 0.72);\n  border: 1px solid rgba(226, 209, 184, 0.48);\n  border-radius: 3px;\n  font-size: 13.5px;\n  line-height: 1.55;\n  color: #FAF7F2;\n}\n.leidu-bf-live-status.is-visible {\n  display: block;\n}\n.leidu-bf-container {\n  max-width: 980px;\n  margin: 0 auto;\n  padding: 64px 24px 88px;\n}\n.leidu-bf-section {\n  background: #FFFFFF;\n  border: 1px solid #E5DDD0;\n  padding: 44px 40px;\n  margin-bottom: 24px;\n}\n.leidu-bf-section.is-warm-feature {\n  background: linear-gradient(180deg, #FDFBF7 0%, #F4EDE1 100%);\n  border-color: #D8CBB8;\n}\n.leidu-bf-num {\n  display: inline-block;\n  font-size: 11.5px;\n  font-weight: 700;\n  letter-spacing: 0.18em;\n  color: #8C735B;\n  margin-bottom: 10px;\n  text-transform: uppercase;\n}\n.leidu-bf-section h2 {\n  margin: 0 0 14px;\n  font-size: 23.5px;\n  font-weight: 600;\n  line-height: 1.38;\n  letter-spacing: -0.015em;\n  color: #211C18;\n}\n.leidu-bf-lead {\n  margin: 0 0 26px;\n  font-size: 14.5px;\n  line-height: 1.75;\n  color: #4E463E;\n}\n.leidu-bf-highlights {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 14px;\n}\n.leidu-bf-hl-card {\n  background: #FAF7F2;\n  border: 1px solid #E8E0D3;\n  padding: 20px 18px;\n}\n.leidu-bf-hl-card strong {\n  display: block;\n  font-size: 17px;\n  font-weight: 700;\n  color: #211C18;\n  margin-bottom: 6px;\n}\n.leidu-bf-hl-card span {\n  display: block;\n  font-size: 13px;\n  line-height: 1.62;\n  color: #5C544B;\n}\n.leidu-bf-compare-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13.5px;\n  border-top: 1.5px solid #28201B;\n}\n.leidu-bf-compare-table th,\n.leidu-bf-compare-table td {\n  padding: 14px 16px;\n  border-bottom: 1px solid #E6DFD3;\n  text-align: left;\n  line-height: 1.6;\n  vertical-align: middle;\n}\n.leidu-bf-compare-table thead th {\n  background: #F6F1E8;\n  font-weight: 700;\n  color: #211C18;\n}\n.leidu-bf-compare-table thead th.is-ownmall {\n  background: #2B231D;\n  color: #FAF7F2;\n}\n.leidu-bf-compare-table tbody th {\n  background: #FAF7F2;\n  width: 22%;\n  font-weight: 600;\n  color: #2E2823;\n}\n.leidu-bf-compare-table tbody td.is-ss {\n  color: #6E665D;\n  width: 35%;\n}\n.leidu-bf-compare-table tbody td.is-ownmall {\n  background: #FCF9F3;\n  color: #211C18;\n  font-weight: 600;\n  width: 43%;\n}\n.leidu-bf-compare-table tbody td.is-ownmall strong {\n  color: #A63D26;\n  font-weight: 700;\n}\n.leidu-bf-tier-grid {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 20px;\n}\n.leidu-bf-tier {\n  border: 1px solid #E3DACB;\n  background: #FCF9F4;\n  padding: 24px 16px;\n  text-align: center;\n}\n.leidu-bf-tier.is-top {\n  background: #2B231D;\n  border-color: #2B231D;\n  color: #FAF7F2;\n}\n.leidu-bf-tier-name {\n  font-size: 12px;\n  font-weight: 700;\n  letter-spacing: 0.16em;\n  color: #857461;\n  margin-bottom: 10px;\n}\n.leidu-bf-tier.is-top .leidu-bf-tier-name {\n  color: #DFCBB0;\n}\n.leidu-bf-tier-rate {\n  font-size: 34px;\n  font-weight: 700;\n  line-height: 1.1;\n  color: #211C18;\n  margin-bottom: 8px;\n}\n.leidu-bf-tier.is-top .leidu-bf-tier-rate {\n  color: #FFFFFF;\n}\n.leidu-bf-tier-off {\n  display: inline-block;\n  font-size: 11px;\n  font-weight: 600;\n  padding: 3px 9px;\n  border-radius: 2px;\n  background: #F9EAE5;\n  color: #A63D26;\n  margin-bottom: 12px;\n}\n.leidu-bf-tier.is-top .leidu-bf-tier-off {\n  background: rgba(223, 203, 176, 0.2);\n  color: #FFE3BD;\n}\n.leidu-bf-tier-cond {\n  font-size: 12.5px;\n  line-height: 1.5;\n  color: #5C544B;\n}\n.leidu-bf-tier.is-top .leidu-bf-tier-cond {\n  color: rgba(250, 247, 242, 0.86);\n}\n.leidu-bf-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13.5px;\n  border-top: 1.5px solid #28201B;\n}\n.leidu-bf-table th,\n.leidu-bf-table td {\n  padding: 13px 14px;\n  border-bottom: 1px solid #E6DFD3;\n  text-align: left;\n  line-height: 1.55;\n}\n.leidu-bf-table th {\n  background: #FAF7F2;\n  font-weight: 600;\n  color: #2E2823;\n  width: 24%;\n}\n.leidu-bf-table td strong {\n  color: #A63D26;\n  font-weight: 700;\n}\n.leidu-bf-policy-note {\n  margin-top: 16px;\n  padding: 15px 18px;\n  background: #FAF7F2;\n  border: 1px solid #E5DDD0;\n  font-size: 12.5px;\n  line-height: 1.72;\n  color: #554D45;\n}\n.leidu-bf-policy-note strong {\n  color: #211C18;\n  font-weight: 600;\n}\n.leidu-bf-steps {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 16px;\n}\n.leidu-bf-step {\n  background: #FAF7F2;\n  border: 1px solid #E5DDD0;\n  padding: 18px 16px;\n}\n.leidu-bf-step em {\n  display: inline-block;\n  font-style: normal;\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: 0.12em;\n  color: #8C735B;\n  margin-bottom: 6px;\n}\n.leidu-bf-step strong {\n  display: block;\n  font-size: 14.5px;\n  font-weight: 600;\n  color: #211C18;\n  margin-bottom: 4px;\n}\n.leidu-bf-step span {\n  display: block;\n  font-size: 12.5px;\n  line-height: 1.6;\n  color: #5C544B;\n}\n.leidu-bf-inherit-box {\n  background: #F6F1E8;\n  border: 1px solid #E2D9C9;\n  padding: 20px 22px;\n}\n.leidu-bf-help-row {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  font-size: 13px;\n  color: #4E463E;\n}\n.leidu-bf-help-links {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.leidu-bf-help-links a {\n  display: inline-flex;\n  align-items: center;\n  padding: 8px 14px;\n  border: 1px solid #2B231D;\n  background: #FFFFFF;\n  color: #211C18 !important;\n  font-size: 12px;\n  font-weight: 600;\n  text-decoration: none !important;\n  border-radius: 2px;\n}\n.leidu-bf-dual-showcase {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 18px;\n}\n.leidu-bf-showcard {\n  background: #FFFFFF;\n  border: 1px solid #DDD1BF;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.leidu-bf-showcard-media {\n  position: relative;\n  height: 188px;\n  overflow: hidden;\n  background: #2B231D;\n}\n.leidu-bf-showcard-media img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: center 28%;\n  filter: brightness(0.86);\n}\n.leidu-bf-showcard-pill {\n  position: absolute;\n  left: 16px;\n  bottom: 14px;\n  padding: 4px 10px;\n  background: rgba(35, 27, 22, 0.86);\n  border: 1px solid rgba(226, 209, 184, 0.45);\n  color: #FAF7F2;\n  font-size: 10.5px;\n  font-weight: 700;\n  letter-spacing: 0.1em;\n}\n.leidu-bf-showcard-body {\n  padding: 24px 22px 26px;\n  flex: 1;\n}\n.leidu-bf-showcard-body h3 {\n  margin: 0 0 10px;\n  font-size: 18.5px;\n  font-weight: 700;\n  color: #211C18;\n  line-height: 1.38;\n}\n.leidu-bf-showcard-body p {\n  margin: 0 0 14px;\n  font-size: 13.5px;\n  line-height: 1.7;\n  color: #524A42;\n}\n.leidu-bf-showcard-points {\n  padding-top: 12px;\n  border-top: 1px dashed #E2D9C9;\n  font-size: 12.5px;\n  line-height: 1.65;\n  color: #3E3731;\n}\n.leidu-bf-perks {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 14px;\n}\n.leidu-bf-perk {\n  background: #FAF7F2;\n  border: 1px solid #E8E0D3;\n  padding: 22px 20px;\n}\n.leidu-bf-perk-badge {\n  display: inline-block;\n  font-size: 11px;\n  font-weight: 700;\n  padding: 3px 8px;\n  background: #2B231D;\n  color: #FAF7F2;\n  border-radius: 2px;\n  margin-bottom: 10px;\n}\n.leidu-bf-perk h3 {\n  margin: 0 0 8px;\n  font-size: 16px;\n  font-weight: 600;\n  color: #211C18;\n}\n.leidu-bf-perk p {\n  margin: 0;\n  font-size: 13px;\n  line-height: 1.65;\n  color: #5C544B;\n}\n.leidu-bf-perk a.leidu-bf-inline-link {\n  display: inline-block;\n  margin-top: 10px;\n  font-size: 12.5px;\n  font-weight: 700;\n  color: #7A5438 !important;\n  text-decoration: underline !important;\n}\n.leidu-bf-bottom-cta {\n  margin-top: 36px;\n  background: #261E19;\n  color: #FAF7F2;\n  padding: 48px 28px;\n  text-align: center;\n  border: 1px solid #3D3129;\n}\n.leidu-bf-bottom-cta h3 {\n  margin: 0 0 10px;\n  font-family: \"Nanum Myeongjo\", Georgia, serif;\n  font-size: 25px;\n  font-weight: 600;\n  color: #FFFFFF;\n}\n.leidu-bf-bottom-cta p {\n  margin: 0 0 26px;\n  font-size: 14px;\n  line-height: 1.68;\n  color: rgba(250, 247, 242, 0.86);\n}\n@media (max-width: 767px) {\n  html body #contents:has(#leidu-benefit-page) { padding-top: 56px !important; }\n  .leidu-bf-hero { padding: 50px 18px 44px; }\n  .leidu-bf-hero h1 { font-size: 25px; }\n  .leidu-bf-hero-desc { font-size: 13.5px; margin-bottom: 18px; }\n  .leidu-bf-hero-pill { font-size: 11.5px; padding: 5px 10px; }\n  .leidu-bf-btn-kakao, .leidu-bf-btn-shop { width: 100%; min-width: 0; height: 48px; font-size: 13.5px; }\n  .leidu-bf-container { padding: 30px 16px 64px; }\n  .leidu-bf-section { padding: 26px 18px; margin-bottom: 16px; }\n  .leidu-bf-section h2 { font-size: 19px; }\n  .leidu-bf-highlights, .leidu-bf-steps, .leidu-bf-perks, .leidu-bf-dual-showcase { grid-template-columns: 1fr; gap: 12px; }\n  .leidu-bf-tier-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }\n  .leidu-bf-tier { padding: 18px 12px; }\n  .leidu-bf-tier-rate { font-size: 28px; }\n  .leidu-bf-table th, .leidu-bf-table td, .leidu-bf-compare-table th, .leidu-bf-compare-table td { padding: 10px 9px; font-size: 12px; }\n  .leidu-bf-bottom-cta { padding: 36px 18px; }\n  .leidu-bf-bottom-cta h3 { font-size: 20px; }\n}";
  var BENEFIT_HTML = "<section class=\"leidu-bf-hero\">\n    <div class=\"leidu-bf-hero-inner\">\n      <div class=\"leidu-bf-eyebrow\">LEIDU OFFICIAL ONLINE BOUTIQUE</div>\n      <h1>레이두 공식몰 단독 멤버십 &amp; 쇼핑 혜택</h1>\n      <p class=\"leidu-bf-hero-desc\">\n        카카오 1초 간편가입 <strong>즉시 12% 상시 할인</strong>부터 <strong>스마트스토어 VIP 등급 그대로 1초 자동 승계(최대 15%)</strong>,<br />\n        그리고 <strong>전 마켓 4,000+ 통합 실구매 리뷰</strong>와 <strong>실제 라이브 방송 착용 영상</strong>까지 공식몰 한곳에서 경험하세요.\n      </p>\n      <div class=\"leidu-bf-hero-pills\">\n        <span class=\"leidu-bf-hero-pill\">카카오 1초 가입 즉시 12%</span>\n        <span class=\"leidu-bf-hero-pill\">스마트스토어 VIP 등급 그대로 1초 자동 승계</span>\n        <span class=\"leidu-bf-hero-pill\">월 5장 제한 없는 무제한 상시 자동 할인</span>\n        <span class=\"leidu-bf-hero-pill\">전 마켓 실구매 리뷰 4,000건+ 통합</span>\n        <span class=\"leidu-bf-hero-pill\">상세페이지 라이브 착용 영상 제공</span>\n      </div>\n      <div class=\"leidu-bf-cta-group\">\n        <a class=\"leidu-bf-btn-kakao\" href=\"/member/login.html\">카카오 1초 회원가입 · 내 VIP 등급 확인 →</a>\n        <a class=\"leidu-bf-btn-shop\" href=\"/\">신상품 혜택가로 보러가기 →</a>\n      </div>\n      <div id=\"leidu-bf-live-status\" class=\"leidu-bf-live-status\" role=\"status\" aria-live=\"polite\"></div>\n    </div>\n  </section>\n\n  <div class=\"leidu-bf-container\">\n    <!-- 채널 한눈 비교 -->\n    <section class=\"leidu-bf-section\" aria-labelledby=\"bf-sec-compare\">\n      <span class=\"leidu-bf-num\">WHY OFFICIAL MALL · AT A GLANCE</span>\n      <h2 id=\"bf-sec-compare\">외부 마켓보다 레이두 공식몰이 확실히 더 좋은 이유</h2>\n      <p class=\"leidu-bf-lead\">\n        매월 5장 쿠폰 제한과 흩어진 상품 후기 대신, 공식몰에서는 <strong>무제한 상시 자동 할인</strong>과\n        <strong>전 마켓 통합 실구매 리뷰 · 실제 라이브 착용 영상</strong>을 한곳에서 제공합니다.\n      </p>\n      <table class=\"leidu-bf-compare-table\" aria-label=\"일반 마켓 대비 레이두 공식몰 혜택 비교\">\n        <thead>\n          <tr>\n            <th scope=\"col\">구분</th>\n            <th scope=\"col\">기존 외부 마켓 이용 시</th>\n            <th scope=\"col\" class=\"is-ownmall\">레이두 공식몰 (leidu.co.kr)</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <th scope=\"row\">VIP 등급 산정</th>\n            <td class=\"is-ss\">단기(3~6개월) 실적 기준 산정</td>\n            <td class=\"is-ownmall\"><strong>스마트스토어 VIP 등급 그대로 1초 자동 승계</strong><br />(최근 1년 합산 실결제 기준 SILVER 12% ~ VVIP 15%)</td>\n          </tr>\n          <tr>\n            <th scope=\"row\">신규 가입 혜택</th>\n            <td class=\"is-ss\">구매 실적 미달 시 등급 할인 없음</td>\n            <td class=\"is-ownmall\"><strong>카카오 1초 간편가입 즉시 12% 상시 할인</strong> 자동 부여</td>\n          </tr>\n          <tr>\n            <th scope=\"row\">할인 매수 제한</th>\n            <td class=\"is-ss\">월 5장 쿠폰 제한 · 매번 쿠폰 다운로드 필요</td>\n            <td class=\"is-ownmall\"><strong>월 5장 제한 없는 무제한 상시 자동 할인</strong><br />(4만원↑ 구매 시 · 1회 최대 10만원 · 일부 시즌오프 제외)</td>\n          </tr>\n          <tr>\n            <th scope=\"row\">실구매 리뷰 확인</th>\n            <td class=\"is-ss\">스마트스토어·에이블리 등 마켓별 분산</td>\n            <td class=\"is-ownmall\"><strong>레이두 전체 마켓 실구매 리뷰(4,000건+) 한곳 통합 제공</strong></td>\n          </tr>\n          <tr>\n            <th scope=\"row\">핏·착용감 확인</th>\n            <td class=\"is-ss\">정지 화보 사진 위주 확인</td>\n            <td class=\"is-ownmall\"><strong>상세페이지 내 실제 라이브 방송 착용 영상 제공</strong><br />+ 매주 월요일 <strong>LEIDU WEEKLY</strong> 매거진 발행</td>\n          </tr>\n          <tr>\n            <th scope=\"row\">배송·무료배송</th>\n            <td class=\"is-ss\">30,000원 이상 무료배송</td>\n            <td class=\"is-ownmall\"><strong>30,000원 이상 무료배송</strong> (스마트스토어 동일 배송·분리발송 정책)</td>\n          </tr>\n        </tbody>\n      </table>\n    </section>\n\n    <!-- 신규 핵심 특장점: 통합 리뷰 & 라이브 착용 영상 -->\n    <section class=\"leidu-bf-section is-warm-feature\" id=\"bf-sec-04\" aria-labelledby=\"bf-sec-04-title\">\n      <span class=\"leidu-bf-num\">EXCLUSIVE EXPERIENCE · REVIEWS &amp; LIVE FIT</span>\n      <h2 id=\"bf-sec-04-title\">전 마켓 4,000+ 통합 리뷰 &amp; 실제 라이브 착용 영상 제공</h2>\n      <p class=\"leidu-bf-lead\">\n        온라인 의류 쇼핑에서 가장 망설여지는 실제 핏·색감·사이즈 선택을 실패 없이 결정하실 수 있도록,\n        레이두의 모든 마켓 리뷰와 라이브 방송 착용 영상을 공식몰 상세페이지 한곳에 모았습니다.\n      </p>\n      <div class=\"leidu-bf-dual-showcase\">\n        <article class=\"leidu-bf-showcard\">\n          <div class=\"leidu-bf-showcard-media\">\n            <img src=\"https://res.cloudinary.com/dfzukpair/image/upload/v1794823410/leidu_promo_assets/winter_the_brunch_1.jpg\" alt=\"레이두 전 마켓 통합 실구매 리뷰\" loading=\"lazy\" />\n            <span class=\"leidu-bf-showcard-pill\">ALL-MARKET 4,000+ REVIEWS</span>\n          </div>\n          <div class=\"leidu-bf-showcard-body\">\n            <h3>레이두 전체 마켓 실구매 리뷰 한곳 통합</h3>\n            <p>\n              스마트스토어·에이블리 등 여러 마켓에 흩어져 있던 실제 구매 고객님들의\n              <strong>4,000건 이상 포토·실착 리뷰</strong>를 이제 마켓을 옮겨 다닐 필요 없이 공식몰 상품 상세페이지 한곳에서 모두 확인하실 수 있습니다.\n            </p>\n            <div class=\"leidu-bf-showcard-points\">\n              · 구매 옵션·작성일·원문 출처가 투명하게 표기된 100% 실구매 후기<br />\n              · 매일 새로 등록되는 전 마켓 신규 포토·텍스트 리뷰 자동 업데이트\n            </div>\n          </div>\n        </article>\n        <article class=\"leidu-bf-showcard\">\n          <div class=\"leidu-bf-showcard-media\">\n            <img src=\"https://res.cloudinary.com/dfzukpair/image/upload/v1794823411/leidu_promo_assets/fw_launch_01.jpg\" alt=\"상세페이지 실제 라이브 방송 착용 영상\" loading=\"lazy\" />\n            <span class=\"leidu-bf-showcard-pill\">LIVE BROADCAST FIT VIDEO</span>\n          </div>\n          <div class=\"leidu-bf-showcard-body\">\n            <h3>상세페이지 내 실제 라이브 방송 착용 영상</h3>\n            <p>\n              정지된 사진만으로 알기 어려운 <strong>실제 착용 핏·기장감·체형별 실루엣·원단의 자연스러운 움직임</strong>을\n              상세페이지에 탑재된 라이브 착용 영상으로 생생하게 확인하고 실패 없이 쇼핑하실 수 있습니다.\n            </p>\n            <div class=\"leidu-bf-showcard-points\">\n              · 보정 없는 자연광·실내 라이브 무빙 핏으로 소재 두께감과 드레이프 즉시 확인<br />\n              · 매주 월요일 발행되는 <strong>LEIDU WEEKLY</strong> 매거진 코디 가이드 함께 제공\n            </div>\n          </div>\n        </article>\n      </div>\n    </section>\n\n    <!-- 혜택 01 -->\n    <section class=\"leidu-bf-section\" aria-labelledby=\"bf-sec-01\">\n      <span class=\"leidu-bf-num\">BENEFIT 01 · KAKAO 1-SECOND SIGN-UP</span>\n      <h2 id=\"bf-sec-01\">카카오 1초 간편가입 즉시 12% 상시 할인</h2>\n      <p class=\"leidu-bf-lead\">\n        복잡한 입력 없이 카카오 1초 간편가입만 완료하시면 첫 방문 고객님께도 가입 즉시 기본 <strong>12% 상시 할인 등급(SILVER)</strong>이 부여됩니다.\n      </p>\n      <div class=\"leidu-bf-highlights\">\n        <div class=\"leidu-bf-hl-card\">\n          <strong>카카오 1초 간편가입</strong>\n          <span>아이디·비밀번호 입력 없이 1초 만에 가입과 동시에 12% 등급이 즉시 활성화됩니다.</span>\n        </div>\n        <div class=\"leidu-bf-hl-card\">\n          <strong>월 5장 매수 제한 없음</strong>\n          <span>쿠폰 소진 걱정이나 번거로운 다운로드 없이 매 주문마다 상시 자동 할인됩니다.</span>\n        </div>\n        <div class=\"leidu-bf-hl-card\">\n          <strong>4만원↑ 구매 시 최대 10만원</strong>\n          <span>총 상품금액 40,000원 이상 구매 시 1회 최대 100,000원 한도로 즉시 차감됩니다.</span>\n        </div>\n      </div>\n    </section>\n\n    <!-- 혜택 02 -->\n    <section class=\"leidu-bf-section\" aria-labelledby=\"bf-sec-02\">\n      <span class=\"leidu-bf-num\">BENEFIT 02 · SMARTSTORE VIP TRANSFER</span>\n      <h2 id=\"bf-sec-02\">스마트스토어 VIP 등급 그대로 1초 자동 승계</h2>\n      <p class=\"leidu-bf-lead\">\n        스마트스토어에서 레이두를 찾아주신 고객님은 처음부터 실적을 다시 쌓으실 필요가 없습니다.\n        <strong>동일 성함·휴대폰 번호</strong>로 가입하시면 <strong>최근 1년 누적 구매이력</strong>이 1초 만에 자동 연동되어\n        <strong>SILVER 12% · GOLD 13% · VIP 14% · VVIP 15%</strong> 등급이 그대로 승계됩니다.\n      </p>\n      <div class=\"leidu-bf-tier-grid\">\n        <div class=\"leidu-bf-tier\">\n          <div class=\"leidu-bf-tier-name\">WELCOME / SILVER</div>\n          <div class=\"leidu-bf-tier-rate\">12%</div>\n          <div class=\"leidu-bf-tier-off\">무제한 상시 자동할인</div>\n          <div class=\"leidu-bf-tier-cond\">카카오 1초 가입 즉시<br />누구나 자동 적용</div>\n        </div>\n        <div class=\"leidu-bf-tier\">\n          <div class=\"leidu-bf-tier-name\">GOLD</div>\n          <div class=\"leidu-bf-tier-rate\">13%</div>\n          <div class=\"leidu-bf-tier-off\">VIP 등급 1초 승계</div>\n          <div class=\"leidu-bf-tier-cond\">최근 1년 합산 실결제<br />10만원 이상</div>\n        </div>\n        <div class=\"leidu-bf-tier\">\n          <div class=\"leidu-bf-tier-name\">VIP</div>\n          <div class=\"leidu-bf-tier-rate\">14%</div>\n          <div class=\"leidu-bf-tier-off\">VIP 등급 1초 승계</div>\n          <div class=\"leidu-bf-tier-cond\">최근 1년 합산 실결제<br />20만원 이상</div>\n        </div>\n        <div class=\"leidu-bf-tier is-top\">\n          <div class=\"leidu-bf-tier-name\">VVIP</div>\n          <div class=\"leidu-bf-tier-rate\">15%</div>\n          <div class=\"leidu-bf-tier-off\">최고 VIP 등급 1초 승계</div>\n          <div class=\"leidu-bf-tier-cond\">최근 1년 합산 실결제<br />30만원 이상</div>\n        </div>\n      </div>\n\n      <table class=\"leidu-bf-table\" aria-label=\"등급별 할인 기준 상세표\">\n        <thead>\n          <tr>\n            <th scope=\"col\">멤버십 등급</th>\n            <th scope=\"col\">등급 선정 기준 (최근 1년 합산)</th>\n            <th scope=\"col\">공식몰 상시 자동 할인 혜택</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td><strong>WELCOME / SILVER</strong></td>\n            <td>카카오 1초 회원가입 즉시 (실적 무관)</td>\n            <td>상시 <strong>12%</strong> 자동 할인 · 매수 제한 없음 (4만원↑ 구매 시 · 최대 10만원)</td>\n          </tr>\n          <tr>\n            <td><strong>GOLD</strong></td>\n            <td>최근 1년 합산 실결제 100,000원 이상</td>\n            <td>상시 <strong>13%</strong> 자동 할인 · 매수 제한 없음 (4만원↑ 구매 시 · 최대 10만원)</td>\n          </tr>\n          <tr>\n            <td><strong>VIP</strong></td>\n            <td>최근 1년 합산 실결제 200,000원 이상</td>\n            <td>상시 <strong>14%</strong> 자동 할인 · 매수 제한 없음 (4만원↑ 구매 시 · 최대 10만원)</td>\n          </tr>\n          <tr>\n            <td><strong>VVIP</strong></td>\n            <td>최근 1년 합산 실결제 300,000원 이상</td>\n            <td>상시 <strong>15%</strong> 자동 할인 · 매수 제한 없음 (4만원↑ 구매 시 · 최대 10만원)</td>\n          </tr>\n        </tbody>\n      </table>\n\n      <div class=\"leidu-bf-steps\" style=\"margin-top:18px;\">\n        <div class=\"leidu-bf-step\">\n          <em>STEP 01</em>\n          <strong>카카오 1초 간편가입</strong>\n          <span>스마트스토어 주문 시 사용하신 성함·휴대폰 번호로 간편 가입합니다.</span>\n        </div>\n        <div class=\"leidu-bf-step\">\n          <em>STEP 02</em>\n          <strong>스마트스토어 VIP 등급 1초 승계</strong>\n          <span>최근 1년 누적 구매액을 자동 합산해 GOLD · VIP · VVIP 등급이 즉시 반영됩니다.</span>\n        </div>\n        <div class=\"leidu-bf-step\">\n          <em>STEP 03</em>\n          <strong>매 주문 무제한 상시 자동 할인</strong>\n          <span>4만원 이상 구매 시 쿠폰 매수 제한 없이 첫 주문부터 최대 15%가 자동 차감됩니다.</span>\n        </div>\n      </div>\n\n      <div class=\"leidu-bf-inherit-box\">\n        <div class=\"leidu-bf-help-row\">\n          <span>※ 연락처 변경 또는 수령인 정보 상이로 자동 등급 매칭이 되지 않으신 경우, 아래 채널로 성함·연락처를 남겨주시면 확인 즉시 등급을 승급해 드립니다.</span>\n          <div class=\"leidu-bf-help-links\">\n            <a href=\"https://pf.kakao.com/_txmcxgG\" target=\"_blank\" rel=\"noopener\">카카오톡 1:1 등급 승계 요청 ↗</a>\n            <a href=\"/board/product/list.html?board_no=6\">Q&amp;A 게시판 문의 →</a>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"leidu-bf-policy-note\">\n        · <strong>적용 기준</strong> : 공식몰 로그인 후 상단 <strong>[바로 구매 / 장바구니]</strong> 공식몰 주문서에서 총 상품금액 <strong>40,000원 이상 구매 시</strong> 월 매수 제한 없이 자동 할인됩니다. (1회 최대 100,000원 한도 · 일원 단위 절사)<br />\n        · <strong>결제 유의</strong> : 비회원 외부 간편결제(네이버페이 주문형 · 카카오 톡체크아웃) 선택 시 회원 등급 할인이 적용되지 않으니 상단 <strong>[바로 구매 / 장바구니]</strong> 버튼을 이용해 주세요.<br />\n        · <strong>제외 안내</strong> : 이미 특별 할인가가 적용된 일부 시즌오프 특가 상품은 중복 할인 대상에서 제외됩니다.\n      </div>\n    </section>\n\n    <!-- 혜택 03: 무료배송 · 당일발송 · 주간 매거진 -->\n    <section class=\"leidu-bf-section\" aria-labelledby=\"bf-sec-03\">\n      <span class=\"leidu-bf-num\">BENEFIT 03 · FREE SHIPPING &amp; WEEKLY MAGAZINE</span>\n      <h2 id=\"bf-sec-03\">3만원 이상 무료배송 · 오늘출발 · LEIDU WEEKLY 매거진</h2>\n      <p class=\"leidu-bf-lead\">\n        스마트스토어와 100% 동일한 빠른 배송·분리발송 정책과 매주 월요일 발행되는 스타일링 큐레이션을 만나보세요.\n      </p>\n      <div class=\"leidu-bf-perks\">\n        <div class=\"leidu-bf-perk\">\n          <span class=\"leidu-bf-perk-badge\">무료배송</span>\n          <h3>30,000원 이상 무료배송</h3>\n          <p>3만원 이상 구매 시 무료배송으로 발송되며, 스마트스토어와 동일한 신속 배송·분리발송 기준이 그대로 적용됩니다.</p>\n        </div>\n        <div class=\"leidu-bf-perk\">\n          <span class=\"leidu-bf-perk-badge\">오늘출발</span>\n          <h3>평일 오후 4시 당일발송</h3>\n          <p>상세페이지 내 <strong>[오늘출발]</strong> 표기 옵션은 평일 오후 4시 이전 결제 완료 시 당일 즉시 출고됩니다.</p>\n        </div>\n        <div class=\"leidu-bf-perk\">\n          <span class=\"leidu-bf-perk-badge\">EVERY MONDAY</span>\n          <h3>LEIDU WEEKLY 매거진</h3>\n          <p>매주 월요일 시즌 룩북과 실착 코디 가이드를 담은 브랜드 에디토리얼 매거진을 공식몰에서 공개합니다.</p>\n          <a class=\"leidu-bf-inline-link\" href=\"/magazine.html\">주간 매거진 보러가기 →</a>\n        </div>\n      </div>\n    </section>\n\n    <section class=\"leidu-bf-bottom-cta\" aria-label=\"멤버십 가입 바로가기\">\n      <h3>카카오 1초 가입으로 내 VIP 승계 등급을 확인하세요</h3>\n      <p>가입 즉시 12% · 스마트스토어 VIP 등급 그대로 1초 자동 승계(최대 15%) · 전 마켓 4,000+ 리뷰 &amp; 라이브 착용 영상</p>\n      <div class=\"leidu-bf-cta-group\">\n        <a class=\"leidu-bf-btn-kakao\" href=\"/member/login.html\">카카오 1초 회원가입 / 로그인하기 →</a>\n        <a class=\"leidu-bf-btn-shop\" href=\"/\">신상품 혜택가로 보러가기 →</a>\n      </div>\n    </section>\n  </div>";
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
    root.setAttribute('aria-label', '레이두 공식몰 멤버십 및 쇼핑 혜택 안내');
    var easypayReady=window.LEIDU_EASYPAY_CAMPAIGN_ENABLED===true;
    if(easypayReady)upsertStyle('leidu-easypay-approved-style',"#leidu-benefit-popup .leidu-easypay-asset *{box-sizing:border-box}#leidu-benefit-popup .leidu-easypay-asset{margin:0;width:480px;height:620px;background:#111;color:#f5efdf;font-family:-apple-system,BlinkMacSystemFont,\"Apple SD Gothic Neo\",sans-serif}#leidu-benefit-popup .leidu-easypay-asset .card{width:480px;height:620px;padding:28px 32px 26px;border:1px solid #8a7557;background:radial-gradient(ellipse at 100% 0,#3d3324 0,transparent 53%),#111}#leidu-benefit-popup .leidu-easypay-asset .brand{font-family:Georgia,serif;font-size:25px;letter-spacing:8px}#leidu-benefit-popup .leidu-easypay-asset .edition{margin-top:10px;font-size:10px;letter-spacing:3px;color:#bda984}#leidu-benefit-popup .leidu-easypay-asset .rule{height:1px;background:#6b5d46;margin:20px 0}#leidu-benefit-popup .leidu-easypay-asset .eyebrow{font-size:11px;letter-spacing:1.8px;color:#cfba94}#leidu-benefit-popup .leidu-easypay-asset .headline{font-family:Georgia,serif;font-size:24px;letter-spacing:.7px;line-height:1.4;margin:14px 0 19px}#leidu-benefit-popup .leidu-easypay-asset .lead{font-size:23px;font-weight:400;line-height:1.6;margin:0}#leidu-benefit-popup .leidu-easypay-asset .lead strong{font-weight:600;color:#e0c392}#leidu-benefit-popup .leidu-easypay-asset .points{list-style:none;padding:0;margin:26px 0 24px;display:grid;gap:15px;font-size:13px;line-height:1.75;color:#e8e1d3}#leidu-benefit-popup .leidu-easypay-asset .points li{padding-left:27px;position:relative}#leidu-benefit-popup .leidu-easypay-asset .points b{position:absolute;left:0;color:#c7ac7a;font-family:Georgia,serif}#leidu-benefit-popup .leidu-easypay-asset .cta{padding:15px;text-align:center;border:1px solid #cbb38c;background:#e3d4b8;color:#171511;font-size:14px;font-weight:600}#leidu-benefit-popup .leidu-easypay-asset .foot{font-size:10px;line-height:1.7;color:#a99f8e;margin-top:17px}#leidu-benefit-popup .leidu-easypay-modal{position:relative;width:480px;max-width:calc(100vw - 24px);height:620px;max-height:calc(100vh - 24px);padding:0;border:0;overflow:auto;background:#111}#leidu-benefit-popup .leidu-easypay-asset{width:480px;height:620px;max-width:100%;text-align:left}#leidu-benefit-popup .leidu-easypay-asset .card{max-width:100%}#leidu-benefit-popup .leidu-easypay-close{position:absolute;right:10px;top:6px;background:transparent;border:0;color:#f5efdf;font-size:24px;z-index:2}#leidu-benefit-popup .leidu-easypay-hide{position:absolute;right:32px;bottom:8px;border:0;background:transparent;color:#a99f8e;font-size:10px;z-index:2}#leidu-benefit-popup .leidu-easypay-asset .cta{cursor:pointer}");
    root.innerHTML = easypayReady ? "<div class=\"leidu-bpop-modal leidu-easypay-modal\"><div class=\"leidu-easypay-asset\"><main class=\"card\"><div class=\"brand\">LEIDU</div><div class=\"edition\">A MORE EFFORTLESS WAY TO SHOP</div><div class=\"rule\"></div><div class=\"eyebrow\">NAVER PAY · KAKAO PAY OPEN</div><h1 class=\"headline\">공식몰 회원 12~15% 할인가 그대로,<br>1초 간편결제 오픈</h1><ul class=\"points\"><li><b>01</b>로그인 회원 등급 할인가 적용 후<br>네이버페이·카카오페이로 1초 결제</li><li><b>02</b>4만 원 이상 무제한 상시 할인<br>3만 원 이상 무료배송 · 준비 상품 먼저 분리발송</li><li><b>03</b>최근 배송지 자동 입력으로 3초 결제 완료</li></ul><div class=\"cta\">회원 할인가로 간편하게 쇼핑하기 →</div><p class=\"foot\">등급별 12~15% · 1회 최대 10만 원 할인 · 일부 특가 제외<br>LEIDU OFFICIAL STORE · leidu.co.kr</p></main></div><button class=\"leidu-easypay-close\" type=\"button\" data-bpop-close aria-label=\"팝업 닫기\">×</button><button class=\"leidu-easypay-hide\" type=\"button\" data-bpop-hide-today>오늘 하루 보지 않기</button></div>" : POPUP_HTML;
    if(easypayReady){var cta=root.querySelector('.leidu-easypay-asset .cta');if(cta)cta.addEventListener('click',function(){location.href='/product/list.html?cate_no=24';});}

    function closePopup() {
      root.classList.remove('is-open');
    }
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
    var hiddenDate = '';
    try { hiddenDate = localStorage.getItem(HIDE_KEY) || ''; } catch (e) {}
    if (forceShow || hiddenDate !== today) {
      root.classList.add('is-open');
    } else {
      root.classList.remove('is-open');
    }
  }

  function updateLiveMemberBanner() {
    var box=document.getElementById('leidu-bf-live-status'),info=window.leiduGetMemberTierInfo();
    if(!box||!info.isLogged)return;
    box.textContent='현재 고객님은 ['+info.gradeName+'] 등급으로 공식몰 주문 시 상시 '+info.rate+'% 무제한 자동할인(4만원 이상 · 1회 최대 10만원)이 적용됩니다.';
    box.classList.add('is-visible');
  }

  window.addEventListener('leidu:membership-linked', updateLiveMemberBanner);

  function upgradeBenefitPage() {
    var page = document.getElementById('leidu-benefit-page');
    if (!page || page.dataset.wl67Upgraded === '1') return;
    page.dataset.wl67Upgraded = '1';
    upsertStyle('leidu-benefit-page-style', BENEFIT_CSS);
    page.innerHTML = BENEFIT_HTML;
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
    'https://webhook.leidu.co.kr/kakao-ai-skill/ownmall/live-request/status',
    'https://leidu-macmini.tail3f79af.ts.net:10000/kakao-ai-skill/ownmall/live-request/status'
  ];
  var LIVE_VOTE_ENDPOINTS = [
    'https://webhook.leidu.co.kr/kakao-ai-skill/ownmall/live-request/vote',
    'https://leidu-macmini.tail3f79af.ts.net:10000/kakao-ai-skill/ownmall/live-request/vote'
  ];
  var ANON_VOTER_KEY_STORAGE = 'leidu_live_tryon_voter_v1';
  var VOTED_PRODUCT_KEY_PREFIX = 'leidu_live_tryon_done_v1_';
  var SUB_KEY = 'leidu_webpush_subscribed_v1';

  var LIVE_TRYON_CSS =
    '#leidu-live-tryon-card{margin:16px 0 8px;padding:15px 16px;background:#FAF7F2;border:1px solid #DFD4C3;border-radius:6px;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard",sans-serif;color:#211B16;word-break:keep-all;box-sizing:border-box}' +
    '#leidu-live-tryon-card *{box-sizing:border-box}' +
    '.lltr-eyebrow{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px;font-size:10.5px;font-weight:700;letter-spacing:0.12em;color:#84694C}' +
    '.lltr-badge{padding:2px 7px;background:#EFE7DA;border:1px solid #DCD0BE;color:#5B4631;font-size:10px;font-weight:700;letter-spacing:0.06em}' +
    '.lltr-desc{margin:0 0 11px;font-size:12.5px;line-height:1.5;color:#4E453C}' +
    '.lltr-btn{width:100%;min-height:44px;padding:10px 14px;border:1px solid #261E18;border-radius:4px;background:#261E18;color:#FAF7F2!important;font-size:13px;font-weight:700;letter-spacing:-0.01em;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:opacity .16s ease,background .16s ease}' +
    '.lltr-btn:hover{opacity:.93}' +
    '.lltr-btn.is-voted{background:#EFE7DA;border-color:#C5B297;color:#241B14!important;cursor:default}' +
    '.lltr-btn.is-has-video{background:#FFFFFF;border-color:#C8AA7E;color:#231B16!important}' +
    '.lltr-voted-sub{margin:8px 0 0;font-size:11.5px;line-height:1.45;color:#6A5D4F;text-align:center}' +
    '.lltr-push-nudge{margin-top:10px;padding-top:10px;border-top:1px dashed #DFD5C5;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:12px;color:#3F362E}' +
    '.lltr-push-btn{appearance:none;border:1px solid #8A6D4B;background:#FFFDF9;color:#5A432B;padding:5px 10px;border-radius:4px;font-size:11.5px;font-weight:700;cursor:pointer;white-space:nowrap}';

  function injectStyle() {
    if (document.getElementById('leidu-live-tryon-style')) return;
    var st = document.createElement('style');
    st.id = 'leidu-live-tryon-style';
    st.textContent = LIVE_TRYON_CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  function detectMemberId() {
    try {
      if (window.CAPP_ASYNC_METHODS && window.CAPP_ASYNC_METHODS.member && window.CAPP_ASYNC_METHODS.member.member_id) {
        return String(window.CAPP_ASYNC_METHODS.member.member_id).trim();
      }
      var el = document.querySelector('.xans-member-var-id, #leidu-member-id-probe');
      if (el && el.textContent) {
        var t = el.textContent.trim();
        if (t && t.indexOf('{$') === -1) return t;
      }
    } catch (e) {}
    return '';
  }

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
    var h = document.querySelector('.xans-product-detail .headingArea h2, .xans-product-detail h1, .xans-product-detail h2');
    if (h && h.textContent && h.textContent.trim()) return h.textContent.replace(/\s+/g, ' ').trim();
    var og = document.querySelector('meta[property="og:title"]');
    if (og && og.content) return og.content.replace(/\s*-\s*LEIDU.*$/i, '').trim();
    return document.title || '';
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
        '<div class="lltr-eyebrow"><span>LIVE FIT ARCHIVE</span><span class="lltr-badge">실착 영상 제공 상품</span></div>' +
        '<p class="lltr-desc">✓ 아래 상세페이지에서 실제 라이브 착용 영상을 바로 확인하실 수 있습니다.</p>' +
        '<button type="button" class="lltr-btn is-has-video" data-lltr-scroll="1">🎥 실제 라이브 착용 영상 바로 보기 ↓</button>';
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
              '<span>🔔 화요일 낮 12시 방송 시작 무료 알림도 켜두시겠어요?</span>' +
              '<button type="button" class="lltr-push-btn" data-lltr-push="1">무료 알림 켜기 →</button>' +
            '</div>'
          : '';
        card.innerHTML =
          '<div class="lltr-eyebrow"><span>TUESDAY 12PM LIVE TRY-ON</span><span class="lltr-badge">착용 요청 접수 완료</span></div>' +
          '<button type="button" class="lltr-btn is-voted" disabled>' +
            '✓ 라이브 착용 요청 완료 · 화요일 낮 12시 방송에 우선 반영됩니다' +
          '</button>' +
          pushRow;
        var pb = card.querySelector('[data-lltr-push]');
        if (pb) pb.addEventListener('click', triggerPushPrompt);
      } else {
        card.innerHTML =
          '<div class="lltr-eyebrow"><span>TUESDAY 12PM LIVE TRY-ON</span><span class="lltr-badge">매주 화요일 낮 12시</span></div>' +
          '<p class="lltr-desc">실제 착용 핏·기장감이 궁금하신가요? 매주 화요일 낮 12시 라이브 방송에서 직접 입어드려요.</p>' +
          '<button type="button" class="lltr-btn" data-lltr-vote="1">' +
            '🎥 화요일 낮 12시 라이브 착용 요청하기' +
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

  var WL79_CSS =
    /* 1. Logged-in member: 100% hide external non-member full-price NPay / Kakao Checkout widgets on PDP & Basket (PC + Mobile) */
    'html.leidu-is-member .leidu-express-payments,' +
    'html.leidu-is-member #leidu-express-pay-notice,' +
    'html.leidu-is-member #NaverChk_Button,' +
    'html.leidu-is-member #NPAY_BUTTON_BOX_ID,' +
    'html.leidu-is-member .npay_storebtn_bx,' +
    'html.leidu-is-member .npay_button_box,' +
    'html.leidu-is-member #appPaymentButtonBox,' +
    'html.leidu-is-member #kakao-checkout-button,' +
    'html.leidu-is-member [id^="NC_ID_"]{display:none!important;visibility:hidden!important;height:0!important;margin:0!important;padding:0!important;overflow:hidden!important}' +
    /* 2. Make PDP [바로 구매] full-width single-line primary CTA so member discount label never wraps on PC or 390px mobile */
    'html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton{display:flex!important;flex-wrap:wrap!important;gap:8px!important;width:100%!important}' +
    'html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton .btn_buy{order:-1!important;flex:1 1 100%!important;width:100%!important;max-width:none!important;min-height:50px!important;height:auto!important;padding:13px 16px!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:6px!important;white-space:nowrap!important;background:#1F1915!important;border:1px solid #1F1915!important;color:#FAF7F2!important;font-size:14.5px!important;font-weight:800!important;letter-spacing:-0.02em!important;line-height:1.2!important;border-radius:3px!important;text-decoration:none!important;box-sizing:border-box!important;margin:0!important}' +
    'html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton .btn_buy span.leidu-buy-main{color:#FAF7F2!important;font-weight:800!important;white-space:nowrap!important}' +
    'html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton .btn_buy span.leidu-buy-sub{color:#F5DCB4!important;font-weight:700!important;font-size:13px!important;white-space:nowrap!important}' +
    'html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton .btn_cart,' +
    'html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton .leidu-inquiry-button{flex:1 1 calc(50% - 4px)!important;max-width:none!important;margin:0!important;min-height:44px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important}' +
    /* 3. Guest 1-line gold conversion bar right above [바로 구매] / [전체 구매] — protect span text color against Cafe24 skin !important */
    'html body .leidu-guest-join-nudge{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;width:100%!important;margin:10px 0 8px!important;padding:11px 14px!important;background:linear-gradient(90deg,#1F1813 0%,#33271D 100%)!important;border:1px solid #D9BC90!important;border-radius:4px!important;color:#FAF7F2!important;text-decoration:none!important;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard",sans-serif!important;font-size:12.5px!important;line-height:1.42!important;word-break:keep-all!important;box-sizing:border-box!important;box-shadow:0 6px 18px rgba(24,18,13,0.12)!important}' +
    'html body #contents .leidu-guest-join-nudge .leidu-guest-join-copy,html body #leidu-wl79-pdp-guest-bar .leidu-guest-join-copy,html body #leidu-wl79-basket-guest-bar .leidu-guest-join-copy{color:#FAF7F2!important;font-size:12.5px!important;font-weight:500!important;line-height:1.42!important}' +
    'html body #contents .leidu-guest-join-nudge .leidu-guest-join-copy strong,html body #leidu-wl79-pdp-guest-bar .leidu-guest-join-copy strong{color:#FFE2B0!important;font-weight:800!important}' +
    'html body #contents .leidu-guest-join-nudge .leidu-guest-join-cta,html body #leidu-wl79-pdp-guest-bar .leidu-guest-join-cta,html body #leidu-wl79-basket-guest-bar .leidu-guest-join-cta{flex-shrink:0!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;padding:6px 11px!important;background:#FEE500!important;color:#191400!important;font-size:11.5px!important;font-weight:800!important;border-radius:3px!important;white-space:nowrap!important}' +
    /* 4. Member active discount confirmation strip on PDP & Basket */
    'html body .leidu-member-safe-bar{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;width:100%!important;margin:10px 0 8px!important;padding:10px 13px!important;background:#FAF6EE!important;border:1px solid #DECBA9!important;border-left:3.5px solid #241C16!important;border-radius:3px!important;color:#241C16!important;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard",sans-serif!important;font-size:12px!important;line-height:1.42!important;word-break:keep-all!important;box-sizing:border-box!important}' +
    'html body .leidu-member-safe-bar span{color:#241C16!important}' +
    'html body .leidu-member-safe-bar strong{color:#9E3822!important;font-weight:800!important}' +
    /* 5. Basket layout & primary button rules (WL-118: empty-cart guard, 648px right-column alignment, kill PC floating gFixed box, center basketguide) */
    'html body #contents .xans-order-basketpackage .xans-order-totalorder.displaynone,html body #orderFixItem.displaynone,html body #orderFixArea.displaynone{display:none!important}' +
    '@media (min-width:768px){html body #orderFixArea,html body #contents .xans-order-basketpackage #orderFixArea{display:none!important}}' +
    'html body #contents > .section.ec-base-help.xans-order-basketguide,html body #contents .xans-order-basketguide{max-width:1440px!important;width:100%!important;margin:72px auto 0!important;padding:0!important;box-sizing:border-box!important}' +
    'html body #contents .xans-order-basketpackage #leidu-wl79-basket-guest-bar,html body #contents .xans-order-basketpackage #leidu-wl79-basket-member-bar{max-width:648px!important;width:100%!important;margin:16px 0 0 auto!important;box-sizing:border-box!important}' +
    'html body #contents .xans-order-basketpackage #orderFixItem:not(.displaynone){max-width:648px!important;width:100%!important;margin:12px 0 0 auto!important;display:flex!important;flex-direction:column!important;gap:10px!important}' +
    'html body #contents .xans-order-basketpackage .xans-order-empty{padding:84px 20px 76px!important;margin-top:20px!important;text-align:center!important;border-top:1px solid #DCDFE2!important;border-bottom:1px solid #DCDFE2!important}' +
    'html body #contents .xans-order-basketpackage .xans-order-empty p{margin:0!important;font-size:14px!important;color:#333!important;letter-spacing:-0.01em!important}' +
    'html body #leidu-empty-basket-cta{display:inline-flex!important;align-items:center!important;justify-content:center!important;margin-top:22px!important;min-width:210px!important;height:44px!important;padding:0 28px!important;background:#181512!important;border:1px solid #181512!important;border-radius:4px!important;color:#FAF7F2!important;font-size:12.5px!important;font-weight:600!important;letter-spacing:0.02em!important;text-decoration:none!important}' +
    '.xans-order-totalorder a.leidu-basket-orderall-upgraded{background:#1F1915!important;border-color:#1F1915!important;color:#FAF7F2!important;font-weight:800!important}' +
    /* 6. Orderform (/order/orderform.html) clear member discount verification card */
    '#leidu-orderform-member-card{margin:14px 0;padding:15px 16px;background:#FAF7F2;border:1.5px solid #241C16;border-radius:5px;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard",sans-serif;color:#211B16;box-sizing:border-box}' +
    '#leidu-orderform-member-card .lomc-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #E3DACB;font-size:12px;font-weight:800;color:#241C16}' +
    '#leidu-orderform-member-card .lomc-badge{padding:2px 8px;background:#241C16;color:#F5DCB4!important;font-size:10.5px;font-weight:800;letter-spacing:0.08em;border-radius:2px;white-space:nowrap}' +
    '#leidu-orderform-member-card .lomc-row{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:5px 0;font-size:13px;color:#4E453C;white-space:nowrap}' +
    '#leidu-orderform-member-card .lomc-row.is-disc{color:#A63D26;font-weight:800}' +
    '#leidu-orderform-member-card .lomc-row.is-disc span{color:#A63D26!important;font-weight:800!important}' +
    '#leidu-orderform-member-card .lomc-row.is-final{margin-top:9px;padding-top:9px;border-top:1px dashed #D8CBB8;font-size:15px;font-weight:800;color:#18130F}' +
    '@media (max-width:767px){' +
    'html body #contents .xans-order-basketpackage #leidu-wl79-basket-guest-bar,html body #contents .xans-order-basketpackage #leidu-wl79-basket-member-bar{max-width:100%!important;margin:12px 0 8px!important}' +
    'html body #orderFixArea:not(.displaynone){left:0!important;right:0!important;bottom:0!important;width:100%!important;max-width:none!important;margin:0!important;padding:10px 14px calc(10px + env(safe-area-inset-bottom,0px))!important;background:rgba(255,255,255,0.98)!important;border-top:1px solid #E5E5E5!important;box-sizing:border-box!important;z-index:980!important}' +
    'html body #orderFixArea .ec-base-button.gColumn{width:100%!important;margin:0!important;display:flex!important;gap:8px!important}' +
    'html body #orderFixArea .ec-base-button.gColumn a{flex:1 1 50%!important;height:44px!important;min-height:44px!important;margin:0!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;font-size:12px!important;white-space:nowrap!important;padding:0 8px!important}' +
    'html body .leidu-guest-join-nudge{flex-direction:column!important;align-items:stretch!important;gap:8px!important;padding:11px 12px!important}' +
    'html body .leidu-guest-join-nudge .leidu-guest-join-cta{width:100%!important;padding:7px 10px!important;font-size:12px!important;box-sizing:border-box!important;max-width:100%!important}' +
    'html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton .btn_buy{font-size:13.5px!important;padding:12px 10px!important}' +
    'html body #contents .xans-product-detail .infoArea .xans-product-action.fixedActionButton .btn_buy span.leidu-buy-sub{font-size:12px!important}' +
    '}';

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
    return '/member/login.html?returnUrl=' + encodeURIComponent(ret);
  }

  function createGuestJoinBar(id) {
    var a = document.createElement('a');
    a.id = id;
    a.className = 'leidu-guest-join-nudge';
    a.href = buildLoginReturnHref();
    a.innerHTML =
      '<span class="leidu-guest-join-copy" style="color:#FAF7F2!important;">⚡ 카카오 1초 가입 시 지금 바로 <strong style="color:#FFE2B0!important;">12%~15% 회원할인가</strong>로 구매하실 수 있습니다</span>' +
      '<span class="leidu-guest-join-cta" style="color:#191400!important;">1초 가입하기 →</span>';
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

    var rateText = info.rate ? (info.rate + '%') : '12~15%';
    var tierLabel = info.groupName ? ('[' + info.groupName + '] ' + rateText) : ('회원 ' + rateText);

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
          buyBtn.innerHTML = '<span class="leidu-buy-main">바로 구매</span><span class="leidu-buy-sub">(회원 12~15% 자동할인 적용)</span>';
        }
        /* Also update mobile sticky bottom buy button if present */
        document.querySelectorAll('#orderFixArea a.btnSubmit[onclick*="product_submit(1"]').forEach(function (mb) {
          if (mb.dataset.wl79Upgraded !== 'member') {
            mb.dataset.wl79Upgraded = 'member';
            mb.textContent = '바로 구매 (회원할인 적용)';
          }
        });
        if (!oldMemberBar && pdpAction.parentNode) {
          var mbar = document.createElement('div');
          mbar.id = 'leidu-wl79-pdp-member-bar';
          mbar.className = 'leidu-member-safe-bar';
          mbar.innerHTML =
            '<span>✓ <strong>' + tierLabel + ' 무제한 자동할인</strong> 적용 계정 · <strong>[바로 구매 / 장바구니]</strong> 주문서에서 자동 차감됩니다 (4만원↑)</span>';
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
          cta.href = '/';
          cta.textContent = '쇼핑 계속하기';
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
                btn.textContent = box.id === 'orderFixArea' ? '전체 주문 (회원할인)' : '전체 주문하기 (회원 12~15% 자동할인 적용)';
              }
            });
          });
          if (!bMember && firstBox && firstBox.parentNode) {
            var bm = document.createElement('div');
            bm.id = 'leidu-wl79-basket-member-bar';
            bm.className = 'leidu-member-safe-bar';
            bm.innerHTML =
              '<span>✓ <strong>' + tierLabel + ' 회원할인</strong>은 아래 <strong>[전체 주문하기 / 선택 구매]</strong> 클릭 후 이동하는 주문서에서 즉시 자동 차감됩니다 (4만원↑)</span>';
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
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
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
    var pct = (discAmt > 0 && baseAmt > 0) ? Math.round((discAmt / baseAmt) * 100) : (info.rate || 12);
    var discLine = discAmt > 0
      ? ('-' + formatKrw(discAmt) + ' (-' + pct + '%)')
      : (baseAmt < 40000 ? '0원 (4만원↑ 적용)' : '0원');

    card.innerHTML =
      '<div class="lomc-head"><span>레이두 공식몰 멤버십 혜택 적용 내역</span><span class="lomc-badge">' + gBadge + '</span></div>' +
      '<div class="lomc-row"><span>상품 정가 합계</span><span>' + formatKrw(baseAmt) + '</span></div>' +
      '<div class="lomc-row is-disc"><span>회원등급 자동할인</span><span>' + discLine + '</span></div>' +
      '<div class="lomc-row"><span>배송비</span><span>' + (shipAmt === 0 ? '0원 (무료)' : formatKrw(shipAmt)) + '</span></div>' +
      '<div class="lomc-row is-final"><span>최종 결제 예정 금액</span><span>' + formatKrw(finalAmt) + '</span></div>';
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
    var existing = document.getElementById('leidu-messenger');
    if (!existing) document.body.insertAdjacentHTML('beforeend', "<!-- LEIDU OWN-MALL CUSTOMER CHAT: central Hub originals; existing native buy actions preserved. -->\n<dialog id=\"leidu-messenger\" aria-labelledby=\"leidu-messenger-title\">\n  <header class=\"leidu-messenger-header\"><div><h2 id=\"leidu-messenger-title\">레이두 문의</h2><p>상품 · 배송 · 주문 상담</p></div><button type=\"button\" class=\"leidu-messenger-close\" aria-label=\"문의창 닫기\">×</button></header>\n  <section class=\"leidu-messenger-context\" aria-label=\"문의 상품\"><span>문의 상품</span><strong></strong><p><a target=\"_blank\" rel=\"noopener\"></a></p></section>\n  <button type=\"button\" class=\"leidu-messenger-older\" hidden>이전 대화 보기</button>\n  <div class=\"leidu-messenger-messages\" role=\"log\" aria-live=\"polite\"><p class=\"leidu-messenger-welcome\">궁금한 점을 남겨주세요.</p></div>\n  <button type=\"button\" class=\"leidu-messenger-latest\" hidden>최신 메시지 ↓</button>\n  <section class=\"leidu-messenger-pending\" hidden aria-label=\"전송 결과 확인 중인 문의\"><p></p><button type=\"button\">같은 문의 다시보내기</button></section>\n  <form class=\"leidu-messenger-compose\"><label class=\"leidu-messenger-label\" for=\"leidu-messenger-input\">문의 내용</label><textarea id=\"leidu-messenger-input\" placeholder=\"문의 내용을 입력해 주세요\" rows=\"2\" maxlength=\"4000\"></textarea><button type=\"submit\" disabled>보내기</button><p class=\"leidu-messenger-status\" aria-live=\"polite\"></p></form>\n</dialog>\n<style>\n#leidu-messenger{position:fixed;inset:auto 24px 24px auto;margin:0;padding:0;width:380px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100dvh - 48px);border:1px solid #ddd;border-radius:16px;background:#fff;color:#222;box-shadow:0 12px 48px #0002;font-family:inherit;box-sizing:border-box;overflow:hidden}\n#leidu-messenger[open]{display:flex;flex-direction:column}#leidu-messenger::backdrop{background:#0002}\n#leidu-messenger .leidu-messenger-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:22px 20px 18px;border-bottom:1px solid #eee}\n#leidu-messenger h2{margin:0;font-family:inherit;font-size:18px;line-height:1.4;font-weight:600}#leidu-messenger .leidu-messenger-header p{margin:4px 0 0;color:#777;font-size:12px;line-height:1.5}\n#leidu-messenger button{font-family:inherit;cursor:pointer}#leidu-messenger .leidu-messenger-close{display:grid;place-items:center;width:32px;height:32px;border:0;background:transparent;color:#222;font-size:26px;line-height:1}\n#leidu-messenger .leidu-messenger-context{margin:16px 20px 0;padding:14px;border:1px solid #e6e6e6;border-radius:10px}#leidu-messenger .leidu-messenger-context span{display:block;margin-bottom:5px;color:#777;font-size:11px}#leidu-messenger .leidu-messenger-context strong{font-size:13px;line-height:1.6;font-weight:500}#leidu-messenger .leidu-messenger-context p{margin:4px 0 0;color:#777;font-size:12px;line-height:1.5}\n#leidu-messenger .leidu-messenger-messages{flex:1;min-height:0;padding:20px;overflow-y:auto;overscroll-behavior:contain}#leidu-messenger .leidu-messenger-welcome{display:inline-block;max-width:85%;margin:0;padding:12px 14px;border-radius:0 12px 12px;background:#f5f5f5;color:#444;font-size:13px;line-height:1.7}\n#leidu-messenger .leidu-messenger-compose{display:grid;grid-template-columns:minmax(0,1fr) 62px;gap:8px;margin:0;padding:16px 20px calc(16px + env(safe-area-inset-bottom));border-top:1px solid #eee}#leidu-messenger textarea{width:100%;min-width:0;margin:0;padding:10px 12px;resize:none;border:1px solid #ddd;border-radius:8px;background:#fff;color:#222;font-family:inherit;font-size:13px;line-height:1.6;box-sizing:border-box}#leidu-messenger .leidu-messenger-compose>button{align-self:stretch;padding:0;border:0;border-radius:8px;background:#222;color:#fff;font-size:12px}#leidu-messenger .leidu-messenger-compose>button:disabled{opacity:.35;cursor:default}#leidu-messenger .leidu-messenger-status{grid-column:1/-1;margin:0;color:#777;font-size:11px;line-height:1.5}#leidu-messenger .leidu-messenger-label{position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden;white-space:nowrap}\n@media(max-width:767px){#leidu-messenger{inset:auto 0 0;width:100%;max-width:100%;height:78dvh;max-height:calc(100dvh - 24px);border-width:1px 0 0;border-radius:16px 16px 0 0}#leidu-messenger .leidu-messenger-header{padding:18px 20px 16px}#leidu-messenger textarea{font-size:16px}}\n\n#leidu-messenger .leidu-messenger-message{max-width:86%;width:fit-content;margin:0 0 14px;padding:10px 13px;border-radius:12px;background:#f4f4f4;word-break:break-word}\n#leidu-messenger .leidu-messenger-message.customer{margin-left:auto;background:#222;color:#fff}\n#leidu-messenger .leidu-messenger-message p{color:inherit;margin:0;white-space:pre-wrap;font-size:13px;line-height:1.7}\n#leidu-messenger .leidu-messenger-message small{display:block;margin-top:5px;font-size:10px;opacity:.7}\n#leidu-messenger .leidu-messenger-message a{display:block;margin-bottom:6px;color:inherit;font-size:11px;text-decoration:underline}\n#leidu-messenger .leidu-messenger-pending{padding:10px 20px;border-top:1px solid #eee;background:#fff8eb}\n#leidu-messenger .leidu-messenger-pending[hidden],#leidu-messenger .leidu-messenger-older[hidden]{display:none}\n#leidu-messenger .leidu-messenger-pending p{max-height:66px;overflow:auto;white-space:pre-wrap;word-break:break-word;margin:0 0 6px;font-size:12px}\n#leidu-messenger .leidu-messenger-pending button,#leidu-messenger .leidu-messenger-older{border:1px solid #ddd;border-radius:6px;padding:7px 12px;background:#fff;color:#333;font-size:11px}\n#leidu-messenger .leidu-messenger-older{align-self:center;margin:10px 0 0}\n#leidu-messenger .leidu-messenger-status{min-height:1.5em}\n#leidu-messenger .leidu-messenger-context a{font-size:11px;color:#666;text-decoration:underline}\n</style>\n");
    var fab = document.getElementById('leidu-floating-chat-btn');
    if (!fab) {
      fab = document.createElement('button'); fab.type = 'button'; fab.id = 'leidu-floating-chat-btn';
      fab.className = existing ? 'leidu-fab-chat' : 'leidu-inquiry-button';
      fab.setAttribute('aria-label', '레이두 문의창 열기'); fab.setAttribute('aria-haspopup', 'dialog');
      fab.setAttribute('aria-controls', 'leidu-messenger'); fab.setAttribute('aria-expanded', 'false');
      fab.innerHTML = icon + '<span>문의하기</span>'; document.body.appendChild(fab);
      if (existing) fab.addEventListener('click', function () {
        var trigger = document.querySelector('.xans-product-detail .leidu-inquiry-button');
        if (trigger) trigger.click();
      });
    }
    if (!existing) {
      // Exact upstream controller: same session/locks/raw-message-first implementation.
      (function () {
  "use strict";
  const API = "https://webhook.leidu.co.kr/ownmall-chat";
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
    const capp = window.CAPP_ASYNC_METHODS, member = capp?.member;
    if (capp?.IS_LOGIN === false) return {member_id:"", cellphone:""};
    let data = {};
    try { data = typeof member?.getData === "function" ? member.getData() || {} : member || {}; } catch (_) {}
    let id = String(data.member_id || member?.__sMemberId || "").trim();
    if (!id && capp?.IS_LOGIN === true) {
      try { id = String(window.AppCommon?.getMemberID?.() || "").trim(); } catch (_) {}
    }
    if (!id || id.includes("{$")) return {member_id:"", cellphone:""};
    return {member_id:id, cellphone:String(data.cellphone || member?.__sCellphone || "")};
  }
  function pageContext() {
    const offered = new URLSearchParams(location.search).get("product_no") ||
      document.querySelector('input[name="product_no"]')?.value ||
      window.iProductNo || "{$product_no}";
    const productNo = /^\d{1,16}$/.test(String(offered)) && Number(offered) > 0 ? String(offered) : "";
    return { member_id: signedInMember().member_id, product_no: productNo,
      product_title: String(document.querySelector(".headingArea h2")?.textContent || document.title)
        .replace(/\s*-\s*LEIDU\s*$/i, "").trim().slice(0, 500),
      page_path: location.pathname.slice(0, 500),
      product_url: productNo ? "https://leidu.co.kr/product/detail.html?product_no=" + productNo : "" };
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
    function contextCard() {
      const value = draft?.text ? draft.context : pageContext();
      dialog.querySelector(".leidu-messenger-context strong").textContent = value?.product_title || "상품 문의";
      const link = dialog.querySelector(".leidu-messenger-context a");
      link.hidden = !value?.product_url;
      if (value?.product_no && /^\d+$/.test(String(value.product_no))) {
        link.href = "https://leidu.co.kr/product/detail.html?product_no=" + value.product_no;
        link.textContent = draft?.text ? "작성 중인 문의 상품" : "상품 보기";
      }
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
        if (!pending) say("메시지가 저장되었습니다.");
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
        welcome.textContent = "궁금한 점을 남겨주세요.";
        fragment.append(welcome);
      }
      for (const row of rows) {
        const bubble = document.createElement("div");
        bubble.className = "leidu-messenger-message " + (row.role === "agent" ? "agent" : "customer");
        if (row.context?.product_no && /^\d+$/.test(String(row.context.product_no))) {
          const product = document.createElement("a");
          product.href = "https://leidu.co.kr/product/detail.html?product_no=" + row.context.product_no;
          product.target = "_blank"; product.rel = "noopener";
          product.textContent = row.context.product_title || ("상품 " + row.context.product_no);
          bubble.append(product);
        }
        const text = document.createElement("p");
        text.textContent = row.text;
        const time = document.createElement("small");
        const date = new Date(row.created_at);
        time.textContent = (row.role === "agent" ? "레이두 상담원 · " : "") +
          (Number.isNaN(date.getTime()) ? "" : date.toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }));
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
          const error = new Error(data.error || "상담 연결을 확인해 주세요");
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
        if (!pending && status.textContent.indexOf("전송 결과") < 0) say("");
        if (data.has_more && !older) nextDelay = 1;
      } catch (error) {
        if (error.status === 401) ready = false;
        say(pending ? "이전 문의의 전송 결과를 확인하지 못했습니다. 원문을 그대로 다시 확인해 주세요." :
          "상담 연결을 확인하지 못했습니다. 잠시 후 다시 확인합니다.");
      } finally {
        polling = false; controls();
        if (visible() && ready) schedule(nextDelay);
      }
    }
    async function sendPending() {
      if (sending || !pending) return;
      const original = pending;
      sending = true; controls(); say("메시지 전송 중…");
      try {
        await ensureSession();
        if (!pending || pending.client_id !== original.client_id) return;
        if (original.room_id !== session.room_id) throw new Error("원 상담방의 전송 결과를 확인해 주세요");
        // Exact original payload, including the page context from its first submit.
        const data = await api("/messages", { method: "POST", body: original });
        accept([data.message], "latest");
        if (pending?.client_id === original.client_id) clearPending(data.message);
        if (!pending) say("메시지가 저장되었습니다.");
      } catch (_) {
        say("전송 결과를 확인하지 못했습니다. 아래 같은 문의 다시보내기로 확인할 수 있습니다.");
      } finally {
        sending = false; controls(); schedule(1);
      }
    }
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const text = input.value;
      const context = JSON.parse(JSON.stringify(draft?.text === text ? draft.context : pageContext()));
      if (!text.trim() || sending) return;
      try {
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
        else if (pending) say("이전 문의의 전송 결과를 먼저 확인해 주세요. 새로 작성한 내용은 유지합니다.");
      } catch (_) { say("상담 연결을 확인하지 못했습니다. 작성한 내용은 유지합니다."); }
    });
    input.addEventListener("input", function () {
      draft = input.value ? { text: input.value, context: draft?.context || pageContext() } : null;
      write(DRAFT_KEY, draft); controls();
    });
    retry.addEventListener("click", () => void sendPending());
    olderButton.addEventListener("click", () => void poll(true));
    triggers.forEach(trigger => trigger.addEventListener("click", async function (event) {
      event.preventDefault(); previousFocus = document.activeElement;
      triggers.forEach(x => x.setAttribute("aria-expanded", "true"));
      contextCard();
      if (!dialog.open) dialog.showModal();
      say("상담 연결 중…");
      try { ready = false; await ensureSession(); await poll(false); jumpLatest(); }
      catch (_) { say("상담 연결을 확인하지 못했습니다. 작성한 내용은 유지합니다."); }
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
    }
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
(function () {
  'use strict';
  if (!/\/order\/orderform\.html$/.test(location.pathname)) return;
  var interacted = false;
  document.addEventListener('click', function (e) {
    if (!e.isTrusted) return;
    var el = e.target.closest('input[name="addr_paymethod"],label');
    if (el && (el.matches('input[name="addr_paymethod"]') || document.getElementById(el.htmlFor)?.name === 'addr_paymethod')) interacted = true;
  }, true);
  document.addEventListener('change',function (e) { if(e.isTrusted && e.target.name === 'addr_paymethod') interacted = true; }, true);
  function apply() {
    if (interacted || window.__leiduCardDefaultApplied) return;
    var cash = document.querySelector('input[name="addr_paymethod"][value="cash"]');
    var card = document.querySelector('input[name="addr_paymethod"][value="card"]');
    if (cash && cash.checked && card) { card.click(); window.__leiduCardDefaultApplied = card.checked; }
    else if (card && card.checked) window.__leiduCardDefaultApplied = true;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
  window.addEventListener('load',function () { apply(); setTimeout(apply,400); },{once:true});
  setTimeout(apply,400);
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
    if (capp && capp.IS_LOGIN === false) return null;
    try { data = m && typeof m.getData === 'function' ? m.getData() || {} : m || {}; } catch (_) {}
    var id = String(data.member_id || (m && m.__sMemberId) || '').trim();
    if (!id || id.indexOf('{$') !== -1) return null;
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
    banner.textContent = '✓ 고객님의 최근 레이두 주문 배송지가 자동 입력되었습니다 (변경 시 [주소검색] 클릭)';
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
    note.textContent='⚡ 스마트스토어 VIP 등급(최대 15%) 및 최근 배송지 1초 자동 승계는 휴대폰 인증이 연동되는 [Kakao 로그인] 시 자동 적용됩니다.';
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
    var c = window.CAPP_ASYNC_METHODS, m = c && c.member, d = {};
    if (c && c.IS_LOGIN === false) return {id:'guest', email:''};
    try { d = m && typeof m.getData === 'function' ? m.getData() || {} : m || {}; } catch (_) {}
    var id = String(d.member_id || (m && (m.__sMemberId || m.member_id)) || '').trim();
    if (id && id.indexOf('{$') === -1) return {id:id, email:String(d.email || (m && m.__sEmail) || '').trim()};
    return null;
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
    note.textContent = '✓ 이전에 입력하신 배송지가 자동 복원되었습니다 (변경 시 [주소검색] 클릭)';
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
  if (!/^\/myshop\/(?:index\.html)?$/.test(location.pathname)) return;
  function profile() {
    var capp=window.CAPP_ASYNC_METHODS, m=capp&&capp.member, data={};
    if (capp&&capp.IS_LOGIN===false) return null;
    try { data=m&&typeof m.getData==="function" ? m.getData()||{} : m||{}; } catch (_) {}
    var id=String(data.member_id||(m&&m.__sMemberId)||"").trim();
    if (!id&&capp&&capp.IS_LOGIN===true) {
      try { id=String(window.AppCommon&&window.AppCommon.getMemberID()||"").trim(); } catch (_) {}
    }
    return id&&id.indexOf("{$")<0 ? {member_id:id,name:String(data.name||data.member_name||(m&&m.__sName)||""),cellphone:String(data.cellphone||(m&&m.__sCellphone)||"")} : null;
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
  var result=await response.json();if(!response.ok||!result.ok)throw new Error(result.error||"연결을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  if(window.leiduConsumeMembershipBridge)window.leiduConsumeMembershipBridge(result);
  return result;
};
/* WL167/170/171: consume the verified membership bridge and retain each member's choice. */
(function () {
  "use strict";
  var RELOGIN="/exec/front/Member/logout/?returnUrl=%2Fmember%2Flogin.html";
  var COPY="회원가입 완료! 스마트스토어 등급 할인가(13~15%)가 바로 반영되지 않으면 한 번만 재로그인해 주세요.";
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
    var link=document.createElement("a");link.href=RELOGIN;link.textContent="🔄 1초 재로그인하여 등급 바로 반영하기";link.style.cssText="color:inherit;font-weight:600;text-decoration:underline";
    box.append(text,link);if(key==="join"){var heading=host.querySelector("h1,h2,h3,.title");if(heading)heading.after(box);else host.prepend(box);}else host.appendChild(box);
  }
  function syncGrade(){
    var member=profile(),identity=read("leiduMembershipIdentity:"+member.id)||window.leiduVerifiedMembershipBridge?.[member.id];
    if(!member.logged)return;
    try{
      var syncedMember=sessionStorage.getItem("leidu_synced_mid_v1"),benefit=JSON.parse(sessionStorage.getItem("leidu_member_benefit_v1")||"null");
      if(syncedMember===member.id&&benefit&&["SILVER","GOLD","VIP","VVIP"].includes(String(benefit.group||"").toUpperCase())){
        identity={member_id:member.id,grade_name:String(benefit.group).toUpperCase(),discount_rate:Number(benefit.rate),bridge_confirmed:true};
      }
    }catch(_){}
    if(!(verified(identity,member.id)||identity?.bridge_confirmed===true)&&["SILVER","GOLD","VIP","VVIP"].includes(member.nativeGrade)){
      identity={member_id:member.id,grade_name:member.nativeGrade,discount_rate:({SILVER:12,GOLD:13,VIP:14,VVIP:15})[member.nativeGrade],bridge_confirmed:true};
    }
    if(!(verified(identity,member.id)||identity?.bridge_confirmed===true)||!["SILVER","GOLD","VIP","VVIP"].includes(String(identity.grade_name||"").toUpperCase()))return;
    var grade=String(identity.grade_name).toUpperCase(),rate=Number(identity.discount_rate)||({SILVER:12,GOLD:13,VIP:14,VVIP:15})[grade];
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
      benefitLabel.textContent="상시 "+rate+"% 즉시할인 적용 중";
    }
    return grade+"|"+rate;
  }
  function mountWelcome(){
    var m=profile(),id=m.id;
    if(!m.logged||!id||id.indexOf("{$")>=0)return;
    if(read("leiduVipOnboardPromptDone:"+id)||verified(read("leiduMembershipIdentity:"+id),id))return;
    if(!/@[kn](?:\.|$)/i.test(id)&&m.group!=="1"&&!/일반\s*회원/.test(m.grade))return;
    if(!(location.pathname==="/"||location.pathname==="/index.html"||/\/product\//.test(location.pathname)||document.querySelector(".xans-product-detail")))return;
    if(document.getElementById("leidu-vip-welcome-sheet"))return;
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
        if(!Number(result.smartstore_1y_spend||0)&&Number(result.discount_rate||12)===12&&!["SILVER","GOLD","VIP","VVIP"].includes(String(result.grade_name||"").toUpperCase())){
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
      if(/사이즈|SIZE/i.test(el.textContent||"")){el.style.setProperty("color","#967b4e");el.style.setProperty("font-weight","600");el.style.setProperty("text-decoration","underline");el.title="사이즈 · 실측정보";if(!el.querySelector("[data-leidu-size-badge]")){var badge=document.createElement("small");badge.dataset.leiduSizeBadge="1";badge.textContent="사이즈 · 실측정보";badge.style.cssText="margin-left:6px;font-size:11px;color:#967b4e";el.appendChild(badge);}}
    });
    mountWelcome();
  }
  window.leiduVerifiedMembershipBridge=window.leiduVerifiedMembershipBridge||{};
  window.leiduConsumeMembershipBridge=function(result){
    var m=profile();if(!result||!result.ok||result.member_id!==m.id||!["SILVER","GOLD","VIP","VVIP"].includes(String(result.grade_name||"").toUpperCase()))return;
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

