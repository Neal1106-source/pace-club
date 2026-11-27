(() => {
  'use strict';
  const measurementId = 'G-1BD5BCB9DE';
  const canonicalUrl = 'https://neal1106-source.github.io/pace-club/';
  const storageKey = 'pace-club:analytics-consent:v1';
  const sessionOptOutKey = `${storageKey}:opt-out`;
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const production = location.origin === 'https://neal1106-source.github.io'
    && ['/pace-club/', '/pace-club/index.html'].includes(location.pathname);
  // Do not load Google's library on URLs that could carry visitor-provided data.
  const safePageUrl = !location.search
    && ['', '#', '#main', '#about', '#weekly'].includes(location.hash);
  const disableKey = `ga-disable-${measurementId}`;
  const panel = document.querySelector('#analytics-notice');
  const settings = document.querySelector('#analytics-settings');
  const status = document.querySelector('#analytics-status');
  const withdraw = document.querySelector('#analytics-withdraw');
  let loaded = false;
  let storageAvailable = true;
  let expiryTimer;
  let weeklyObserver;
  let weeklyRecorded = false;
  window[disableKey] = true;

  function readChoice() {
    try {
      if (sessionStorage.getItem(sessionOptOutKey) === 'denied') {
        return { value: 'denied', expires: Date.now() + lifetime };
      }
      const record = JSON.parse(localStorage.getItem(storageKey));
      return record && ['granted', 'denied'].includes(record.value)
        && Number.isFinite(record.expires) && record.expires > Date.now()
        && record.expires <= Date.now() + lifetime ? record : null;
    } catch {
      storageAvailable = false;
      return null;
    }
  }
  let choice = readChoice();

  function canTrackRecruitment() {
    const current = storageAvailable ? readChoice() : choice;
    return production && safePageUrl && loaded && !window[disableKey]
      && current?.value === 'granted' && current.expires > Date.now()
      && typeof window.gtag === 'function';
  }

  function trackRecruitment(name, parameters) {
    if (!canTrackRecruitment()) return false;
    // Only fixed event names and allowlisted values below; no link URLs,
    // button text, user input, referrers, or current URL enter these events.
    window.gtag('event', name, {
      send_to: measurementId,
      page_location: canonicalUrl,
      page_title: 'PACE Club｜新竹跑步社群',
      page_referrer: '',
      ...parameters
    });
    return true;
  }

  function startRecruitmentTracking() {
    if (weeklyRecorded || weeklyObserver || !canTrackRecruitment()
      || !('IntersectionObserver' in window)) return;
    // Observe the actual information panel rather than the taller section
    // (which also includes the side poster and outer whitespace).
    const information = document.querySelector('#weekly .weekly-content');
    if (!information) return;
    weeklyObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!weeklyRecorded && entry.isIntersecting && entry.intersectionRatio >= 0.5
          && trackRecruitment('weekly_run_view', { section_name: 'weekly_run', visibility_percent: 50 })) {
          weeklyRecorded = true;
          weeklyObserver.disconnect();
          weeklyObserver = undefined;
          break;
        }
      }
    }, { threshold: [0, 0.5] });
    weeklyObserver.observe(information);
  }

  const recruitmentButtons = new Map([
    [document.querySelector('#site-nav .nav-join'), ['join_club_click', 'navigation']],
    [document.querySelector('.hero-copy [data-join]'), ['join_club_click', 'hero']],
    [document.querySelector('.closing [data-join]'), ['join_club_click', 'closing']],
    [document.querySelector('.event-actions [data-join]'), ['join_run_click', 'weekly']],
    [document.querySelector('.event-actions .text-link'), ['map_click', 'weekly']]
  ].filter(([element]) => element));
  // One delegated listener per page: reaccepting consent never binds twice.
  document.addEventListener('click', event => {
    const control = event.target instanceof Element ? event.target.closest('button, a') : null;
    const tracked = recruitmentButtons.get(control);
    if (tracked) trackRecruitment(tracked[0], { button_location: tracked[1] });
  });
  // The download handler signals only after it has initiated the .ics download.
  // Do not also track the calendar button's click, which would double-count it.
  document.addEventListener('pace:calendar-downloaded', () => {
    trackRecruitment('calendar_download', { button_location: 'join_dialog', file_format: 'ics' });
  });

  function clearAnalyticsCookies() {
    // Only this integration's cookie prefix; leave other GitHub Pages projects alone.
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (!name.startsWith('pace_club_')) return;
      for (const path of ['/pace-club/', '/pace-club', '/']) {
        document.cookie = `${name}=; Max-Age=0; Path=${path}; SameSite=Lax; Secure`;
      }
    });
  }

  function refreshStatus() {
    const accepted = choice?.value === 'granted';
    withdraw.hidden = !accepted;
    status.textContent = accepted ? '目前選擇：已同意分析。' : choice ? '目前選擇：已拒絕分析。' : '目前選擇：尚未同意，分析未啟用。';
    if (!production) status.textContent += ' 目前為本機或非正式頁面，即使接受也不載入 GA4。';
    else if (!safePageUrl) status.textContent += ' 此網址包含查詢參數或非網站錨點，為保護隱私，不載入分析。';
    if (!storageAvailable) status.textContent += ' 此瀏覽器無法儲存偏好，重新整理後需再選擇。';
  }

  function openPanel(focus = false) {
    refreshStatus();
    panel.hidden = false;
    settings.setAttribute('aria-expanded', 'true');
    if (focus) document.querySelector('#privacy-title').focus({ preventScroll: true });
  }
  function closePanel() {
    panel.hidden = true;
    settings.setAttribute('aria-expanded', 'false');
    settings.focus({ preventScroll: true });
  }

  function stopAnalytics() {
    // Set opt-out BEFORE any unload handlers can send another event.
    window[disableKey] = true;
    weeklyObserver?.disconnect();
    weeklyObserver = undefined;
    clearTimeout(expiryTimer);
    clearAnalyticsCookies();
    if (loaded) {
      document.querySelector('#pace-ga4')?.remove();
      // Unload the already-executed library and its automatic event listeners.
      // The next load reads denied/expired consent and never requests gtag.js.
      // If storage is blocked, remain opted out in this document instead of
      // reloading into a possibly stale saved grant.
      if (storageAvailable) location.reload();
    }
  }

  function checkExpiry() {
    if (!choice || choice.expires <= Date.now()) {
      choice = null;
      stopAnalytics();
      openPanel();
      return;
    }
    expiryTimer = setTimeout(checkExpiry, Math.min(60000, choice.expires - Date.now()));
  }

  function startAnalytics() {
    if (!production || !safePageUrl || choice?.value !== 'granted') return;
    if (loaded) {
      // A storage-blocked visitor may grant consent again without reloading.
      window[disableKey] = false;
      clearTimeout(expiryTimer);
      checkExpiry();
      startRecruitmentTracking();
      return;
    }
    loaded = true;
    window[disableKey] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false,
      page_location: canonicalUrl,
      page_title: 'PACE Club｜新竹跑步社群',
      page_referrer: '',
      ignore_referrer: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: 'none',
      cookie_path: '/pace-club/',
      cookie_prefix: 'pace_club',
      cookie_expires: 180 * 24 * 60 * 60,
      cookie_update: false,
      cookie_flags: 'SameSite=Lax;Secure'
    });
    // Explicit, fixed fields only: never forward URL parameters or user-entered text.
    window.gtag('event', 'page_view', {
      send_to: measurementId, page_location: canonicalUrl,
      page_title: 'PACE Club｜新竹跑步社群', page_referrer: ''
    });
    const tag = document.createElement('script');
    tag.id = 'pace-ga4';
    tag.async = true;
    tag.referrerPolicy = 'no-referrer';
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    tag.addEventListener('error', () => {
      status.textContent = '分析程式未能載入，網站功能仍可正常使用；你仍可撤回同意。';
    });
    document.head.appendChild(tag);
    // Long timeouts exceed browser limits: check expiry at most once a minute.
    checkExpiry();
    startRecruitmentTracking();
  }

  function saveChoice(value) {
    choice = { value, expires: Date.now() + lifetime };
    try {
      if (value === 'denied') sessionStorage.setItem(sessionOptOutKey, 'denied');
      else sessionStorage.removeItem(sessionOptOutKey);
    } catch { /* The opt-out flag still protects this page when storage is blocked. */ }
    try { localStorage.setItem(storageKey, JSON.stringify(choice)); }
    catch {
      storageAvailable = false;
      if (value === 'denied') {
        try { localStorage.removeItem(storageKey); } catch { /* Remain disabled in memory. */ }
      }
    }
    if (value === 'granted') startAnalytics();
    else stopAnalytics();
    refreshStatus();
    closePanel();
  }
  settings.addEventListener('click', () => panel.hidden ? openPanel(true) : closePanel());
  document.querySelector('#privacy-close').addEventListener('click', closePanel);
  document.querySelector('#analytics-accept').addEventListener('click', () => saveChoice('granted'));
  document.querySelector('#analytics-reject').addEventListener('click', () => saveChoice('denied'));
  withdraw.addEventListener('click', () => saveChoice('denied'));
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closePanel(); event.stopPropagation(); }
  });
  // Another tab can revoke consent or clear storage. Fail closed across tabs.
  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    choice = readChoice();
    if (choice?.value === 'granted') startAnalytics();
    else stopAnalytics();
    refreshStatus();
  });
  window.addEventListener('pageshow', () => {
    if (choice?.value === 'granted' && choice.expires <= Date.now()) {
      choice = null;
      stopAnalytics();
      openPanel();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && choice?.value === 'granted' && choice.expires <= Date.now()) {
      choice = null;
      stopAnalytics();
      openPanel();
    }
  });
  if (choice?.value === 'granted') startAnalytics();
  else clearAnalyticsCookies();
  if (!choice) openPanel();
  else refreshStatus();
})();
