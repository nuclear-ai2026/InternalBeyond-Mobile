/* IB x Kiki patch v1 · 2026-10-31
   修1：边缘滑动返回 → 历史栈兜底，双划退出
   修2：滚动/触摸期间强制全量渲染（借用 IB 自带 cv-warm），消灭白块 */
(function () {
  try {
    /* —— 修1 —— */
    var IBP_last = 0, IBP_hint = null;
    function ibpHint(msg) {
      try {
        if (!IBP_hint) {
          IBP_hint = document.createElement('div');
          IBP_hint.setAttribute('style', 'position:fixed;left:50%;bottom:96px;transform:translateX(-50%);background:rgba(20,30,50,.85);color:#fff;padding:9px 18px;border-radius:999px;font-size:13px;z-index:999999;pointer-events:none;opacity:0;transition:opacity .18s;font-family:sans-serif;max-width:70vw;text-align:center');
          (document.body || document.documentElement).appendChild(IBP_hint);
        }
        IBP_hint.textContent = msg;
        IBP_hint.style.opacity = '1';
        clearTimeout(IBP_hint._t);
        IBP_hint._t = setTimeout(function () { IBP_hint.style.opacity = '0'; }, 1400);
      } catch (e) {}
    }
    try { history.replaceState({ ibp: 0 }, '', location.href); history.pushState({ ibp: 1 }, '', location.href); } catch (e) {}
    window.addEventListener('popstate', function () {
      var now = Date.now();
      if (now - IBP_last < 2600) { IBP_last = 0; return; }
      IBP_last = now;
      try { history.pushState({ ibp: 1 }, '', location.href); } catch (e) {}
      ibpHint('再划一次退出');
    });

    /* —— 修2 —— */
    function ibpBind() {
      var box = document.getElementById('cv-msgs');
      if (!box) return;
      var t = null;
      function off() {
        t = null;
        try {
          if (window.pinBottom && (pinBottom._iv || pinBottom._stop)) {
            box.classList.add('cv-warm');
            t = setTimeout(off, 500);
            return;
          }
        } catch (e) {}
        box.classList.remove('cv-warm');
      }
      function on() {
        box.classList.add('cv-warm');
        if (t) clearTimeout(t);
        t = setTimeout(off, 400);
      }
      window.addEventListener('scroll', on, { capture: true, passive: true });
      document.addEventListener('touchstart', on, { capture: true, passive: true });
      document.addEventListener('touchmove', on, { capture: true, passive: true });
      document.addEventListener('wheel', on, { capture: true, passive: true });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ibpBind);
    else ibpBind();
  } catch (e) {}
})();
