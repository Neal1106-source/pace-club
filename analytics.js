(() => {
  'use strict';
  if (window.__paceAnalyticsInstalled) return;
  window.__paceAnalyticsInstalled = true;
  const measurementId = 'G-1BD5BCB9DE';
  const canonicalUrl = 'https://neal1106-source.github.io/pace-club/';
  const pageTitle = 'PACE Club｜新竹跑步社群・每週三交大操場團練';
  const storageKey = 'pace-club:analytics-consent:v2';
  const legacyKey = 'pace-club:analytics-consent:v1';
  const lifetime = 180 * 86400000;
  const disableKey = `ga-disable-${measurementId}`;
  const panel = document.querySelector('#analytics-notice');
  const settings = document.querySelector('#analytics-settings');
  const status = document.querySelector('#analytics-status');
  const withdraw = document.querySelector('#analytics-withdraw');
  const retry = document.querySelector('#analytics-retry');
  let state = 'idle';
  let attempts = 0;
  let lastError = '';
  let cooldownUntil = 0;
  let storageAvailable = true;
  let choice = null;
  let bootstrapped = false;
  let executed = false;
  let timedOut = false;
  let generation = 0;
  let loadTimer;
  let consentTimer;
  let weeklyObserver;
  let weeklySent = false;
  let weeklyPending = false;
  let pageViewSent = false;
  const pending = [];
  window[disableKey] = true;

  // These are editorially approved campaign words, not arbitrary strings.
  // Add new marketing vocabulary here only after reviewing it for personal data.
  const utmVocabulary = {
    utm_source: 'instagram facebook line threads youtube google newsletter partner direct',
    utm_medium: 'social organic paid cpc email referral qr',
    utm_campaign: 'pace club weekly run running wednesday hsinchu recruitment launch spring summer autumn winter 2026 2027 新竹 跑團 團練 跑步 新手 上班族 週三',
    utm_content: 'bio profile link post story reel video image button hero footer banner variant a b 1 2 3',
    utm_term: 'running beginner hsinchu club weekly run 新竹 跑團 跑步 新手 上班族'
  };
  function safeCampaignValue(key, value) {
    if (!value || value.length > 64 || value !== value.normalize('NFKC')) return false;
    if (!/^[a-z0-9\u4e00-\u9fff]+(?:[-_ ][a-z0-9\u4e00-\u9fff]+)*$/.test(value)) return false;
    const words = new Set(utmVocabulary[key].split(' '));
    return value.split(/[-_ ]/).every(word => words.has(word));
  }
  function productionPage() {
    return location.origin === 'https://neal1106-source.github.io'
      && ['/pace-club/', '/pace-club/index.html'].includes(location.pathname);
  }
  function cleanPageUrl(input = location.href) {
    const source = new URL(input, location.href);
    const safe = new URL(canonicalUrl);
    const campaigns = {};
    for (const key of Object.keys(utmVocabulary)) {
      const values = source.searchParams.getAll(key);
      if (values.length === 1 && safeCampaignValue(key, values[0])) {
        safe.searchParams.set(key, values[0]);
        campaigns[key] = values[0];
      }
    }
    let hash = '';
    try {
      const id = decodeURIComponent(source.hash.slice(1));
      if (/^[a-z][a-z0-9-]{0,60}$/.test(id) && document.getElementById(id)) hash = `#${id}`;
    } catch { /* Malformed or unknown fragments are never forwarded. */ }
    return { url: safe.href, hash, campaigns };
  }
  function scrubAddress() {
    const safe = cleanPageUrl();
    // Automatic Google events can read document.location directly. Sanitize the
    // actual address BEFORE loading Google, not just our custom event payloads.
    const address = new URL(safe.url);
    address.pathname = location.pathname;
    address.hash = safe.hash;
    if (address.href !== location.href) history.replaceState(history.state, '', address.href);
    return safe;
  }

  function validRecord(record) {
    const now = Date.now();
    return record?.version === 2 && ['granted', 'denied'].includes(record.value)
      && Number.isFinite(record.updatedAt) && record.updatedAt <= now + 300000
      && record.expires === record.updatedAt + lifetime && record.expires > now;
  }
  function newRecord(value) {
    const updatedAt = Math.max(Date.now(), (choice?.updatedAt || 0) + 1);
    return { version: 2, value, updatedAt, expires: updatedAt + lifetime };
  }
  function readChoice() {
    const records = [];
    try {
      const local = JSON.parse(localStorage.getItem(storageKey));
      if (validRecord(local)) records.push(local);
    } catch { storageAvailable = false; }
    try {
      const session = JSON.parse(sessionStorage.getItem(storageKey));
      if (validRecord(session)) records.push(session);
    } catch { /* Session fallback is optional. */ }
    if (validRecord(choice)) records.push(choice);
    return records.sort((a, b) => b.updatedAt - a.updatedAt || Number(b.value === 'denied') - Number(a.value === 'denied'))[0] || null;
  }
  function persist(record) {
    choice = record;
    try { localStorage.setItem(storageKey, JSON.stringify(record)); storageAvailable = true; }
    catch { storageAvailable = false; }
    try { sessionStorage.setItem(storageKey, JSON.stringify(record)); } catch { /* Memory remains usable. */ }
  }
  choice = readChoice();
  if (!choice) {
    // One-time migration: a legacy session denial is honored, then retired.
    try {
      const legacy = JSON.parse(localStorage.getItem(legacyKey));
      const denied = sessionStorage.getItem(`${legacyKey}:opt-out`) === 'denied';
      if (denied || legacy && ['granted', 'denied'].includes(legacy.value)
        && Number.isFinite(legacy.expires) && legacy.expires > Date.now()
        && legacy.expires <= Date.now() + lifetime + 300000) {
        const migrated = newRecord(denied ? 'denied' : legacy.value);
        if (!denied) { migrated.updatedAt = legacy.expires - lifetime; migrated.expires = legacy.expires; }
        persist(migrated);
      }
      if (choice && storageAvailable) {
        localStorage.removeItem(legacyKey);
        sessionStorage.removeItem(`${legacyKey}:opt-out`);
      }
    } catch { /* Fail closed on inaccessible or malformed legacy records. */ }
  }

  function permitted() {
    choice = readChoice();
    return productionPage() && choice?.value === 'granted';
  }
  function clearAnalyticsCookies() {
    try {
      const names = document.cookie.split(';').map(cookie => cookie.split('=')[0].trim())
        .filter(name => name === '_ga' || name === '_ga_1BD5BCB9DE' || /^pace_club_[A-Za-z0-9_]+$/.test(name));
      for (const name of names) for (const path of ['/', '/pace-club', '/pace-club/']) {
        for (const domain of ['', location.hostname, `.${location.hostname}`]) {
          document.cookie = `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=${path};${domain ? ` Domain=${domain};` : ''} SameSite=Lax;${location.protocol === 'https:' ? ' Secure;' : ''}`;
        }
      }
    } catch { /* Cookies can be unavailable on file:// or restricted browsers. */ }
  }
  function refreshStatus() {
    withdraw.hidden = choice?.value !== 'granted';
    retry.hidden = state !== 'failed' || choice?.value !== 'granted' || !productionPage();
    retry.disabled = attempts >= 3 || Date.now() < cooldownUntil;
    const labels = { idle: '尚未載入', loading: '載入中', ready: '已載入', failed: '載入失敗' };
    status.textContent = `目前選擇：${choice?.value === 'granted' ? '已同意分析' : choice ? '已拒絕分析' : '尚未同意'}。分析程式：${labels[state]}。`;
    if (lastError) status.textContent += ` ${lastError}`;
    if (state === 'failed' && attempts >= 3) status.textContent += ' 已達本頁三次嘗試上限，請排除問題後重新整理。';
    if (!productionPage()) status.textContent += ' 本機及非正式頁面不載入 GA4。';
    if (!storageAvailable) status.textContent += ' 永久儲存不可用，選擇僅保留於目前分頁／頁面。';
    document.documentElement.dataset.gaState = state;
  }
  function openPanel(focus = false) {
    refreshStatus(); panel.hidden = false; settings.setAttribute('aria-expanded', 'true');
    if (focus) document.querySelector('#privacy-title').focus({ preventScroll: true });
  }
  function closePanel() {
    panel.hidden = true; settings.setAttribute('aria-expanded', 'false'); settings.focus({ preventScroll: true });
  }
  function stopAnalytics() {
    window[disableKey] = true;
    weeklyObserver?.disconnect(); weeklyObserver = undefined;
    clearTimeout(loadTimer); clearTimeout(consentTimer);
    pending.length = 0; weeklyPending = false;
    clearAnalyticsCookies();
    generation++;
    document.querySelector('#pace-ga4')?.remove();
    // A fresh document removes Google listeners as well as the script element.
    if (bootstrapped && storageAvailable) location.reload();
    else { state = executed ? 'ready' : 'idle'; refreshStatus(); }
  }
  function watchConsent() {
    clearTimeout(consentTimer);
    if (choice?.value !== 'granted') return;
    consentTimer = setTimeout(() => {
      if (!permitted()) { choice = null; stopAnalytics(); openPanel(); }
      else watchConsent();
    }, Math.min(60000, Math.max(1, choice.expires - Date.now())));
  }
  function baseFields() {
    return { send_to: measurementId, page_location: cleanPageUrl().url, page_title: pageTitle, page_referrer: '' };
  }
  function deliver(name, parameters, done) {
    if (!permitted() || window[disableKey] || state !== 'ready') return false;
    window.gtag('event', name, { ...baseFields(), ...parameters });
    done?.(); return true;
  }
  function track(name, parameters, done) {
    if (!permitted() || window[disableKey]) return false;
    if (state === 'ready') return deliver(name, parameters, done);
    if (state === 'loading' && pending.length < 30) { pending.push({ name, parameters, done }); return true; }
    return false;
  }
  function observeWeekly() {
    if (weeklySent || weeklyPending || weeklyObserver || !permitted()
      || !['loading', 'ready'].includes(state) || !('IntersectionObserver' in window)) return;
    const information = document.querySelector('#weekly .weekly-content');
    if (!information) return;
    weeklyObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.5) && !weeklySent && !weeklyPending) {
        weeklyPending = true;
        if (track('weekly_run_view', { section_name: 'weekly_run', visibility_percent: 50 }, () => { weeklySent = true; weeklyPending = false; })) {
          weeklyObserver?.disconnect(); weeklyObserver = undefined;
        } else weeklyPending = false;
      }
    }, { threshold: [0, 0.5] });
    weeklyObserver.observe(information);
  }
  function ready() {
    state = 'ready'; executed = true; timedOut = false; lastError = ''; clearTimeout(loadTimer);
    if (!permitted()) { stopAnalytics(); return; }
    if (!pageViewSent) pageViewSent = deliver('page_view', {});
    while (pending.length && permitted()) { const event = pending.shift(); deliver(event.name, event.parameters, event.done); }
    watchConsent(); observeWeekly(); refreshStatus();
  }
  function startAnalytics(manualRetry = false) {
    if (!permitted()) { refreshStatus(); return; }
    const safe = scrubAddress();
    if (state === 'ready') { window[disableKey] = false; watchConsent(); observeWeekly(); refreshStatus(); return; }
    if (state === 'loading' || state === 'failed' && !manualRetry) { refreshStatus(); return; }
    if (attempts >= 3 || Date.now() < cooldownUntil) { refreshStatus(); return; }
    if (timedOut) {
      // Never attach a second script while a timed-out request might still execute.
      if (storageAvailable) location.reload();
      else { lastError = '請重新整理頁面後再同意，以安全重試。'; refreshStatus(); }
      return;
    }
    state = 'loading'; lastError = ''; attempts++; window[disableKey] = false;
    const thisGeneration = ++generation;
    if (!bootstrapped) {
      bootstrapped = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      const configuration = {
        send_page_view: false, page_location: safe.url, page_referrer: '', page_title: pageTitle,
        ignore_referrer: true, allow_google_signals: false, allow_ad_personalization_signals: false,
        cookie_domain: 'none', cookie_path: '/pace-club/', cookie_prefix: 'pace_club',
        cookie_expires: 180 * 86400, cookie_update: false, cookie_flags: 'SameSite=Lax;Secure'
      };
      const campaignFields = { utm_source: 'campaign_source', utm_medium: 'campaign_medium', utm_campaign: 'campaign_name', utm_content: 'campaign_content', utm_term: 'campaign_term' };
      for (const [key, value] of Object.entries(safe.campaigns)) configuration[campaignFields[key]] = value;
      // Global values must precede Google's initialization trigger, not just config.
      window.gtag('set', configuration);
      window.gtag('set', 'user_data', {});
      window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      window.gtag('js', new Date());
      window.gtag('config', measurementId, configuration);
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    const tag = document.createElement('script');
    tag.id = 'pace-ga4'; tag.async = true; tag.referrerPolicy = 'no-referrer';
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    function fail(message, timeout = false) {
      if (thisGeneration !== generation) return;
      state = 'failed'; timedOut = timeout; lastError = message; clearTimeout(loadTimer);
      if (!timeout) tag.remove();
      cooldownUntil = Date.now() + 2000;
      refreshStatus();
      setTimeout(refreshStatus, 2050);
    }
    tag.addEventListener('load', () => {
      if (thisGeneration !== generation) return;
      if (!window.google_tag_manager) { fail('Google 程式未完成初始化，請檢查阻擋器後重試。'); return; }
      ready();
    });
    tag.addEventListener('error', () => fail('Google 程式載入失敗；請檢查網路或阻擋器後按「重試載入分析」。'));
    loadTimer = setTimeout(() => fail('載入逾時；重試將重新整理，避免重複初始化。', true), 12000);
    document.head.appendChild(tag);
    watchConsent(); observeWeekly(); refreshStatus();
  }
  function saveChoice(value) {
    persist(newRecord(value));
    if (value === 'denied') stopAnalytics();
    else startAnalytics();
    refreshStatus(); closePanel();
  }

  const buttons = new Map([
    [document.querySelector('#site-nav .nav-join'), ['join_club_click', 'navigation']],
    [document.querySelector('.hero-copy [data-join]'), ['join_club_click', 'hero']],
    [document.querySelector('.closing [data-join]'), ['join_club_click', 'closing']],
    [document.querySelector('.event-actions [data-join]'), ['join_run_click', 'weekly']],
    [document.querySelector('.event-actions .text-link'), ['map_click', 'weekly']]
  ].filter(([element]) => element));
  document.addEventListener('click', event => {
    const control = event.target instanceof Element ? event.target.closest('button,a') : null;
    const tracked = buttons.get(control);
    if (tracked) track(tracked[0], { button_location: tracked[1] });
  });
  document.addEventListener('pace:calendar-downloaded', () => track('calendar_download', { button_location: 'join_dialog', file_format: 'ics' }));
  settings.addEventListener('click', () => panel.hidden ? openPanel(true) : closePanel());
  document.querySelector('#privacy-close').addEventListener('click', closePanel);
  document.querySelector('#analytics-accept').addEventListener('click', () => saveChoice('granted'));
  document.querySelector('#analytics-reject').addEventListener('click', () => saveChoice('denied'));
  withdraw.addEventListener('click', () => saveChoice('denied'));
  retry.addEventListener('click', () => startAnalytics(true));
  // Google can wrap History API methods for automatic measurement. Clean the
  // address before the native history operation so later auto events see it clean.
  for (const method of ['pushState', 'replaceState']) {
    const original = history[method].bind(history);
    history[method] = function (data, unused, url) {
      if (productionPage() && choice?.value === 'granted' && choice.expires > Date.now() && url != null) {
        const target = new URL(url, location.href);
        if (target.origin === location.origin && ['/pace-club/', '/pace-club/index.html'].includes(target.pathname)) {
          const safe = cleanPageUrl(target.href);
          const address = new URL(safe.url); address.pathname = target.pathname; address.hash = safe.hash;
          url = address.href;
        }
      }
      return original(data, unused, url);
    };
  }
  panel.addEventListener('keydown', event => { if (event.key === 'Escape') { closePanel(); event.stopPropagation(); } });
  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    if (!event.newValue) { persist(newRecord('denied')); stopAnalytics(); return; }
    // An explicit new shared record supersedes stale in-memory/session choices.
    try {
      const record = JSON.parse(event.newValue);
      if (!validRecord(record)) { persist(newRecord('denied')); stopAnalytics(); return; }
      choice = record;
      try { sessionStorage.setItem(storageKey, event.newValue); } catch { /* Use the shared record in memory. */ }
    } catch { persist(newRecord('denied')); stopAnalytics(); return; }
    if (permitted()) startAnalytics(); else stopAnalytics();
    refreshStatus();
  });
  function resume() {
    if (choice?.value === 'granted' && !permitted()) { stopAnalytics(); openPanel(); }
    else if (permitted()) { startAnalytics(); watchConsent(); }
  }
  window.addEventListener('pageshow', resume);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) resume(); });
  for (const event of ['hashchange', 'popstate']) window.addEventListener(event, () => {
    if (permitted()) { scrubAddress(); window.gtag?.('set', { page_location: cleanPageUrl().url, page_referrer: '' }); }
  }, true);
  if (choice?.value === 'granted') startAnalytics(); else clearAnalyticsCookies();
  if (!choice) openPanel(); else refreshStatus();
})();
