/* LEIDU Official Mall PWA Shortcut + Free Web Push Client v1 (WL-44, 2026-11-27) */
(function () {
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

  var VAPID_PUBLIC_KEY = "BH1IT5gvbs_MvDtKa-acm8U5CoU-04Gyx70uf85T1TVlVJAX-6BDGrHDQHX8Zt2nTeg5BwUFmu3-t1eneHAN-y4";
  var ENDPOINTS = ["https://webhook.leidu.co.kr/kakao-ai-skill/webhook/cafe24/webpush?bridge=1"];
  var ICON_192 = "https://designerko.github.io/leidu-cdn/leidu_pwa/leidu_icon_192.png";
  var CSS_TEXT = "#leidu-pwa-chip {\n  position: fixed;\n  left: 14px;\n  bottom: calc(18px + env(safe-area-inset-bottom, 0px));\n  z-index: 9890;\n  display: none;\n  align-items: center;\n  gap: 8px;\n  background: rgba(30, 27, 24, 0.94);\n  backdrop-filter: blur(8px);\n  border: 1px solid rgba(223, 199, 164, 0.48);\n  color: #FAF7F2;\n  padding: 8px 10px 8px 13px;\n  border-radius: 999px;\n  box-shadow: 0 10px 26px rgba(18, 14, 10, 0.28);\n  font-family: -apple-system, BlinkMacSystemFont, \"Apple SD Gothic Neo\", \"Pretendard\", sans-serif;\n  max-width: calc(100vw - 28px);\n}\n@media (max-width: 920px) {\n  #leidu-pwa-chip.is-ready {\n    display: inline-flex;\n  }\n}\n#leidu-pwa-chip .lpwa-chip-btn {\n  appearance: none;\n  border: 0;\n  background: transparent;\n  color: #FAF7F2;\n  font-size: 12.5px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n  cursor: pointer;\n  padding: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  white-space: nowrap;\n}\n#leidu-pwa-chip .lpwa-chip-dot {\n  width: 7px;\n  height: 7px;\n  border-radius: 50%;\n  background: #E2C699;\n  display: inline-block;\n}\n#leidu-pwa-chip.is-subscribed .lpwa-chip-dot {\n  background: #5FD38D;\n}\n#leidu-pwa-chip .lpwa-chip-close {\n  appearance: none;\n  border: 0;\n  background: rgba(250, 247, 242, 0.14);\n  color: #DFD5C6;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  font-size: 13px;\n  line-height: 1;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n\n/* Inline Editorial Card (benefit.html, channels.html, join_result.html) */\n.leidu-pwa-inline-card {\n  margin: 18px auto 0;\n  max-width: 960px;\n  background: #FAF7F2;\n  border: 1px solid #DFD4C3;\n  padding: 20px 22px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  flex-wrap: wrap;\n  font-family: -apple-system, BlinkMacSystemFont, \"Apple SD Gothic Neo\", \"Pretendard\", sans-serif;\n  color: #211B16;\n  word-break: keep-all;\n}\n.leidu-pwa-inline-left {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  flex: 1;\n  min-width: 220px;\n}\n.leidu-pwa-inline-icon {\n  width: 48px;\n  height: 48px;\n  border-radius: 11px;\n  border: 1px solid #D5C7B2;\n  flex-shrink: 0;\n}\n.leidu-pwa-inline-kicker {\n  font-size: 10.5px;\n  font-weight: 700;\n  letter-spacing: 0.14em;\n  color: #846A4D;\n  margin-bottom: 3px;\n}\n.leidu-pwa-inline-title {\n  font-size: 15.5px;\n  font-weight: 700;\n  color: #1E1813;\n  margin-bottom: 3px;\n}\n.leidu-pwa-inline-sub {\n  font-size: 12.5px;\n  line-height: 1.48;\n  color: #5C5248;\n}\n.leidu-pwa-inline-cta {\n  appearance: none;\n  border: 1px solid #231B16;\n  background: #231B16;\n  color: #FAF7F2 !important;\n  min-height: 44px;\n  padding: 0 18px;\n  font-size: 13px;\n  font-weight: 700;\n  cursor: pointer;\n  white-space: nowrap;\n  letter-spacing: -0.01em;\n}\n.leidu-pwa-inline-cta.is-done {\n  background: #EFE7DA;\n  border-color: #C8B79E;\n  color: #3D3228 !important;\n}\n\n/* iOS Safari Bottom Sheet Guide & Feedback Sheet */\n#leidu-pwa-sheet-backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 10050;\n  background: rgba(18, 14, 11, 0.62);\n  backdrop-filter: blur(3px);\n  display: none;\n  align-items: flex-end;\n  justify-content: center;\n  padding: 0;\n}\n#leidu-pwa-sheet-backdrop.is-open {\n  display: flex;\n}\n.lpwa-sheet {\n  width: 100%;\n  max-width: 480px;\n  background: #FAF7F2;\n  color: #201A15;\n  border-top-left-radius: 20px;\n  border-top-right-radius: 20px;\n  border-top: 1.5px solid #D9C7AE;\n  padding: 22px 22px calc(26px + env(safe-area-inset-bottom, 0px));\n  box-shadow: 0 -16px 44px rgba(0, 0, 0, 0.32);\n  font-family: -apple-system, BlinkMacSystemFont, \"Apple SD Gothic Neo\", \"Pretendard\", sans-serif;\n  word-break: keep-all;\n}\n.lpwa-sheet-handle {\n  width: 40px;\n  height: 4px;\n  border-radius: 99px;\n  background: #D3C6B4;\n  margin: 0 auto 16px;\n}\n.lpwa-sheet-head {\n  display: flex;\n  align-items: center;\n  gap: 13px;\n  margin-bottom: 16px;\n}\n.lpwa-sheet-head img {\n  width: 52px;\n  height: 52px;\n  border-radius: 12px;\n  border: 1px solid #D8C9B4;\n}\n.lpwa-sheet-head h3 {\n  margin: 0 0 4px;\n  font-size: 17.5px;\n  font-weight: 700;\n  color: #1E1813;\n}\n.lpwa-sheet-head p {\n  margin: 0;\n  font-size: 12.5px;\n  color: #63584D;\n  line-height: 1.45;\n}\n.lpwa-steps {\n  background: #FFFFFF;\n  border: 1px solid #E4DACB;\n  border-radius: 12px;\n  padding: 15px 16px;\n  margin-bottom: 16px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.lpwa-step {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  font-size: 13.5px;\n  line-height: 1.5;\n  color: #2B241E;\n}\n.lpwa-step-num {\n  flex-shrink: 0;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  background: #231B16;\n  color: #FAF7F2;\n  font-size: 11.5px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 1px;\n}\n.lpwa-step b {\n  color: #8A4F26;\n  font-weight: 700;\n}\n.lpwa-sheet-btn {\n  width: 100%;\n  min-height: 48px;\n  border: 0;\n  border-radius: 8px;\n  background: #231B16;\n  color: #FAF7F2;\n  font-size: 14px;\n  font-weight: 700;\n  cursor: pointer;\n}\n.lpwa-sheet-subbtn {\n  width: 100%;\n  min-height: 42px;\n  margin-top: 8px;\n  border: 1px solid #DBD0BE;\n  border-radius: 8px;\n  background: transparent;\n  color: #5E5347;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n}";
  var DISMISS_KEY = 'leidu_pwa_chip_dismiss_until';
  var SUB_KEY = 'leidu_webpush_subscribed_v1';

  var deferredPrompt = null;
  var swReg = null;

  function injectStyle() {
    if (document.getElementById('leidu-pwa-push-style')) return;
    var st = document.createElement('style');
    st.id = 'leidu-pwa-push-style';
    st.textContent = CSS_TEXT;
    (document.head || document.documentElement).appendChild(st);
  }

  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function detectPlatform() {
    var ua = navigator.userAgent || '';
    var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS) return 'ios';
    if (/Android/i.test(ua)) return 'android';
    return 'desktop';
  }

  function isStandaloneMode() {
    return !!(
      (window.navigator && window.navigator.standalone === true) ||
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
    );
  }

  function detectMemberId() {
    try {
      var m = window.CAPP_ASYNC_METHODS && window.CAPP_ASYNC_METHODS.member;
      var data = m ? (typeof m.getData === 'function' ? m.getData() || {} : m) : {};
      var grp = String(data.group_name || (m && m.__sGroupName) || '').trim();
      if (/^(관리자|管理員|ADMIN|ADMINISTRATOR)$/i.test(grp) || /(관리자|管理員)/.test(grp)) return '';
      var mid = String(data.member_id || (m && m.__sMemberId) || (m && m.member_id) || '').trim();
      if (mid.toLowerCase() === 'leidu1') return '';
      if (mid && mid.indexOf('{$') === -1) return mid;
      var el = document.querySelector('.xans-member-var-id, #leidu-member-id-probe');
      if (el && el.textContent) {
        var t = el.textContent.trim();
        if (t && t.indexOf('{$') === -1 && t.toLowerCase() !== 'leidu1') return t;
      }
    } catch (e) {}
    return '';
  }

  function isSubscribedCached() {
    try {
      return localStorage.getItem(SUB_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setSubscribedCached(val) {
    try {
      if (val) localStorage.setItem(SUB_KEY, '1');
      else localStorage.removeItem(SUB_KEY);
    } catch (e) {}
  }

  function isChipDismissed() {
    try {
      var until = Number(localStorage.getItem(DISMISS_KEY) || '0');
      return until > Date.now();
    } catch (e) {
      return false;
    }
  }

  function dismissChip7Days() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + 7 * 24 * 3600 * 1000));
    } catch (e) {}
    var chip = document.getElementById('leidu-pwa-chip');
    if (chip) chip.classList.remove('is-ready');
  }

  function postSubscriptionToServer(payload) {
    var idx = 0;
    function next() {
      if (idx >= ENDPOINTS.length) return Promise.reject(new Error('all_endpoints_failed'));
      var ep = ENDPOINTS[idx++];
      return fetch(ep, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error('http_' + r.status);
        return r.json();
      }).catch(function () {
        return next();
      });
    }
    return next();
  }

  function registerRootServiceWorker() {
    if (!('serviceWorker' in navigator)) return Promise.resolve(null);
    if (swReg) return Promise.resolve(swReg);
    return navigator.serviceWorker.register('/leidu_sw.js', { scope: '/' }).then(function (reg) {
      swReg = reg;
      if (reg.pushManager) {
        reg.pushManager.getSubscription().then(function (sub) {
          if (sub) {
            setSubscribedCached(true);
            refreshAllUI();
          }
        }).catch(function () {});
      }
      return reg;
    }).catch(function () {
      return null;
    });
  }

  function subscribeWebPushNow() {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      openSheet('guide');
      return Promise.resolve(false);
    }
    return Notification.requestPermission().then(function (perm) {
      if (perm !== 'granted') {
        alert('請允許瀏覽器通知權限，即可免費接收每週品牌雜誌與最新優惠通知。');
        return false;
      }
      return registerRootServiceWorker().then(function (reg) {
        if (!reg || !reg.pushManager) throw new Error('push_unavailable');
        return reg.pushManager.getSubscription().then(function (existing) {
          if (existing) return existing;
          return reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
          });
        });
      }).then(function (sub) {
        var subJson = sub.toJSON ? sub.toJSON() : JSON.parse(JSON.stringify(sub));
        return postSubscriptionToServer({
          action: 'webpush_subscribe',
          subscription: subJson,
          member_id: detectMemberId(),
          platform: detectPlatform(),
          user_agent: navigator.userAgent || ''
        }).then(function () {
          setSubscribedCached(true);
          refreshAllUI();
          closeSheet();
          return true;
        });
      });
    }).catch(function () {
      openSheet('guide');
      return false;
    });
  }

  function handlePrimaryAction() {
    var plat = detectPlatform();
    var standalone = isStandaloneMode();

    // 1) iOS Safari non-standalone -> show intuitive 3-step Add to Home Screen bottom sheet
    if (plat === 'ios' && !standalone) {
      openSheet('ios_guide');
      return;
    }

    // 2) iOS standalone Home Screen Web App -> direct 1-click VAPID Web Push subscription
    if (plat === 'ios' && standalone) {
      subscribeWebPushNow();
      return;
    }

    // 3) Android / Desktop Chrome: trigger install prompt if available, then subscribe to Web Push
    if (deferredPrompt) {
      var p = deferredPrompt;
      deferredPrompt = null;
      p.prompt();
      p.userChoice.finally(function () {
        subscribeWebPushNow();
      });
      return;
    }

    subscribeWebPushNow();
  }

  function ensureSheetDOM() {
    var bd = document.getElementById('leidu-pwa-sheet-backdrop');
    if (bd) return bd;
    bd = document.createElement('div');
    bd.id = 'leidu-pwa-sheet-backdrop';
    bd.setAttribute('role', 'dialog');
    bd.setAttribute('aria-modal', 'true');
    bd.addEventListener('click', function (e) {
      if (e.target === bd) closeSheet();
    });
    document.body.appendChild(bd);
    return bd;
  }

  function openSheet(mode) {
    var bd = ensureSheetDOM();
    var plat = detectPlatform();
    var standalone = isStandaloneMode();

    if (mode === 'ios_guide' || (plat === 'ios' && !standalone)) {
      bd.innerHTML =
        '<div class="lpwa-sheet">' +
          '<div class="lpwa-sheet-handle"></div>' +
          '<div class="lpwa-sheet-head">' +
            '<img src="' + ICON_192 + '" alt="LEIDU" />' +
            '<div>' +
              '<h3>LEIDU 加入主畫面 &amp; 開啟免費通知</h3>' +
              '<p>無須下載 App，3 秒加入手機主畫面，即時掌握新品上架與會員限定禮遇。</p>' +
            '</div>' +
          '</div>' +
          '<div class="lpwa-steps">' +
            '<div class="lpwa-step"><span class="lpwa-step-num">1</span><span>點擊 Safari 下方中間 <b>[分享 ⬆]</b> 圖示</span></div>' +
            '<div class="lpwa-step"><span class="lpwa-step-num">2</span><span>在選單中點選 <b>[加入主畫面]</b></span></div>' +
            '<div class="lpwa-step"><span class="lpwa-step-num">3</span><span>從主畫面點擊 <b>LEIDU</b> 圖示開啟，即可接收新品免費推播通知</span></div>' +
          '</div>' +
          '<button type="button" class="lpwa-sheet-btn" data-lpwa-close="1">我知道了</button>' +
        '</div>';
    } else {
      bd.innerHTML =
        '<div class="lpwa-sheet">' +
          '<div class="lpwa-sheet-handle"></div>' +
          '<div class="lpwa-sheet-head">' +
            '<img src="' + ICON_192 + '" alt="LEIDU" />' +
            '<div>' +
              '<h3>開啟新品上架 · 優惠免費通知</h3>' +
              '<p>每週一品牌雜誌特輯與官方旗艦店專屬優惠將於第一時間通知您。</p>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="lpwa-sheet-btn" data-lpwa-sub-now="1">🔔 開啟新品與優惠免費通知</button>' +
          '<button type="button" class="lpwa-sheet-subbtn" data-lpwa-close="1">稍後再說</button>' +
        '</div>';
    }

    bd.querySelectorAll('[data-lpwa-close]').forEach(function (b) {
      b.addEventListener('click', closeSheet);
    });
    var subBtn = bd.querySelector('[data-lpwa-sub-now]');
    if (subBtn) {
      subBtn.addEventListener('click', function () { subscribeWebPushNow(); });
    }
    bd.classList.add('is-open');
  }

  function closeSheet() {
    var bd = document.getElementById('leidu-pwa-sheet-backdrop');
    if (bd) bd.classList.remove('is-open');
  }

  function getButtonLabel() {
    var subbed = isSubscribedCached();
    var standalone = isStandaloneMode();
    var plat = detectPlatform();
    if (subbed) return '🔔 已開啟免費通知';
    if (standalone || (plat === 'ios' && standalone)) return '🔔 開啟新品與優惠免費通知';
    return '📲 加入主畫面 · 開啟免費通知';
  }

  function mountInlineCards() {
    var targets = [];
    var chSlot = document.getElementById('leidu-channels-pwa-slot');
    if (chSlot) targets.push(chSlot);

    var bfPage = document.getElementById('leidu-benefit-page');
    if (bfPage) {
      var bfContainer = bfPage.querySelector('.leidu-bf-container');
      if (bfContainer && !document.getElementById('leidu-bf-pwa-slot')) {
        var s = document.createElement('div');
        s.id = 'leidu-bf-pwa-slot';
        bfContainer.appendChild(s);
        targets.push(s);
      } else if (document.getElementById('leidu-bf-pwa-slot')) {
        targets.push(document.getElementById('leidu-bf-pwa-slot'));
      }
    }

    if (location.pathname.indexOf('/member/join_result.html') !== -1) {
      var joinWrap = document.querySelector('#contents .xans-member-joincomplete, #contents');
      if (joinWrap && !document.getElementById('leidu-join-pwa-slot')) {
        var js = document.createElement('div');
        js.id = 'leidu-join-pwa-slot';
        joinWrap.appendChild(js);
        targets.push(js);
      } else if (document.getElementById('leidu-join-pwa-slot')) {
        targets.push(document.getElementById('leidu-join-pwa-slot'));
      }
    }

    var subbed = isSubscribedCached();
    var btnText = getButtonLabel();

    targets.forEach(function (slot) {
      slot.innerHTML =
        '<div class="leidu-pwa-inline-card">' +
          '<div class="leidu-pwa-inline-left">' +
            '<img class="leidu-pwa-inline-icon" src="' + ICON_192 + '" alt="LEIDU" />' +
            '<div>' +
              '<div class="leidu-pwa-inline-kicker">OFFICIAL APP SHORTCUT &amp; FREE PUSH</div>' +
              '<div class="leidu-pwa-inline-title">LEIDU 官方旗艦店 1 秒加入主畫面 &amp; 新品免費推播</div>' +
              '<div class="leidu-pwa-inline-sub">將 LEIDU 加入手機主畫面，第一時間掌握每週雜誌特輯與新品上架通知。</div>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="leidu-pwa-inline-cta' + (subbed ? ' is-done' : '') + '" data-lpwa-trigger="1">' +
            btnText +
          '</button>' +
        '</div>';
      var btn = slot.querySelector('[data-lpwa-trigger]');
      if (btn && !subbed) {
        btn.addEventListener('click', handlePrimaryAction);
      }
    });
  }

  function mountMobileChip() {
    var chip = document.getElementById('leidu-pwa-chip');
    if (!chip) {
      chip = document.createElement('div');
      chip.id = 'leidu-pwa-chip';
      chip.innerHTML =
        '<button type="button" class="lpwa-chip-btn" data-lpwa-chip-main="1">' +
          '<span class="lpwa-chip-dot"></span>' +
          '<span class="lpwa-chip-label">📲 加入主畫面</span>' +
        '</button>' +
        '<button type="button" class="lpwa-chip-close" aria-label="7 天內不再顯示" data-lpwa-chip-close="1">×</button>';
      document.body.appendChild(chip);
      chip.querySelector('[data-lpwa-chip-main]').addEventListener('click', function () {
        if (!isSubscribedCached()) handlePrimaryAction();
      });
      chip.querySelector('[data-lpwa-chip-close]').addEventListener('click', dismissChip7Days);
    }

    var subbed = isSubscribedCached();
    var standalone = isStandaloneMode();
    var lbl = chip.querySelector('.lpwa-chip-label');
    if (subbed) {
      chip.classList.add('is-subscribed');
      if (lbl) lbl.textContent = '🔔 通知已開啟';
    } else if (standalone) {
      chip.classList.remove('is-subscribed');
      if (lbl) lbl.textContent = '🔔 開啟新品與優惠免費通知';
    } else {
      chip.classList.remove('is-subscribed');
      if (lbl) lbl.textContent = '📲 加入主畫面';
    }

    // Hide floating chip on /channels.html where the full inline card is already right in front of the user, or if dismissed
    if (isChipDismissed() || location.pathname.replace(/^\/shop7/, '') === '/channels.html') {
      chip.classList.remove('is-ready');
    } else {
      chip.classList.add('is-ready');
    }
  }

  function refreshAllUI() {
    mountInlineCards();
    mountMobileChip();
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    refreshAllUI();
  });

  function boot() {
    injectStyle();
    registerRootServiceWorker();
    refreshAllUI();
    // Re-check after WL-43 ScriptTag upgrades #leidu-benefit-page
    setTimeout(refreshAllUI, 450);
    setTimeout(refreshAllUI, 1100);
    var bfPage = document.getElementById('leidu-benefit-page');
    if (bfPage && typeof MutationObserver !== 'undefined') {
      var mo = new MutationObserver(function () {
        if (!document.getElementById('leidu-bf-pwa-slot')) {
          mountInlineCards();
        }
      });
      mo.observe(bfPage, { childList: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.addEventListener('load', function () {
    refreshAllUI();
    setTimeout(refreshAllUI, 300);
  });
  window.LEIDU_PWA_PUSH = {
    openSheet: openSheet,
    subscribeWebPushNow: subscribeWebPushNow,
    refreshAllUI: refreshAllUI
  };
})();
