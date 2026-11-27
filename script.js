const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
const mobileLayout = window.matchMedia('(max-width: 700px)');

function closeNavigation(restoreFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.querySelector('span').textContent = '＋';
  navigation.classList.remove('is-open');
  if (restoreFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.querySelector('span').textContent = open ? '－' : '＋';
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (!mobileLayout.matches) return;
    closeNavigation();
    // Move keyboard focus to the destination after hiding the menu link.
    const destination = document.querySelector(link.getAttribute('href'));
    destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
  });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeNavigation(true);
  }
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeNavigation();
});
header.addEventListener('focusout', event => {
  if (!header.contains(event.relatedTarget)) closeNavigation();
});
mobileLayout.addEventListener('change', () => closeNavigation());
header.classList.add('has-mobile-nav');

const dialog = document.querySelector('#join-dialog');
document.querySelectorAll('[data-join]').forEach(button => {
  button.addEventListener('click', () => {
    if (mobileLayout.matches && navigation.classList.contains('is-open')) closeNavigation(true);
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
});
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
document.querySelector('#year').textContent = new Date().getFullYear();

const runTimeZone = 'Asia/Taipei';
const taipeiDate = new Intl.DateTimeFormat('en-US', {
  timeZone: runTimeZone, year: 'numeric', month: '2-digit', day: '2-digit'
});
const runDateLabel = new Intl.DateTimeFormat('zh-TW', {
  timeZone: runTimeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
});

function getNextRun(now = new Date()) {
  const parts = Object.fromEntries(taipeiDate.formatToParts(now).map(part => [part.type, part.value]));
  // Taiwan is UTC+8: Wednesday 18:00 in Taipei is Wednesday 10:00 UTC.
  // Use only UTC operations after extracting the Taipei calendar date.
  const next = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), 10));
  const days = (3 - next.getUTCDay() + 7) % 7;
  next.setUTCDate(next.getUTCDate() + days);
  // At the start time itself, immediately move to the following week.
  if (next <= now) next.setUTCDate(next.getUTCDate() + 7);
  return next;
}

function getRunCountdown(now = new Date()) {
  const next = getNextRun(now);
  const secondsLeft = Math.ceil((next - now) / 1000);
  return {
    next,
    days: Math.floor(secondsLeft / 86400),
    hours: Math.floor(secondsLeft / 3600) % 24,
    minutes: Math.floor(secondsLeft / 60) % 60,
    seconds: secondsLeft % 60
  };
}

const countdownFields = document.querySelectorAll('[data-countdown]');
const nextRunDate = document.querySelector('#next-run-date');
function updateRunCountdown() {
  const remaining = getRunCountdown();
  countdownFields.forEach(field => {
    field.textContent = String(remaining[field.dataset.countdown]).padStart(2, '0');
  });
  const isoDate = remaining.next.toISOString();
  if (nextRunDate.dateTime !== isoDate) {
    nextRunDate.dateTime = isoDate;
    nextRunDate.textContent = runDateLabel.format(remaining.next);
  }
}
updateRunCountdown();
// Recalculate from the clock each tick, so delayed background ticks never accumulate drift.
setInterval(updateRunCountdown, 1000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateRunCountdown();
});
window.addEventListener('pageshow', updateRunCountdown);

document.querySelector('#calendar').addEventListener('click', () => {
  const now = new Date();
  const next = getNextRun(now);
  const stamp = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const content = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PACE Club//Weekly Run//ZH-TW',
    'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:weekly-run@paceclub.local',
    `DTSTAMP:${stamp(now)}`, `DTSTART:${stamp(next)}`,
    'RRULE:FREQ=WEEKLY;BYDAY=WE', 'SUMMARY:PACE Club 週三團練',
    'LOCATION:新竹交大操場',
    'DESCRIPTION:每週三 18:00 一起跑步。請攜帶跑鞋與飲水。集合細節、活動時間長度及天候異動請以主辦方確認為準。',
    'END:VEVENT', 'END:VCALENDAR', ''
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'PACE-Club-週三團練.ics';
  document.body.appendChild(link);
  link.click();
  document.dispatchEvent(new Event('pace:calendar-downloaded'));
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  document.querySelector('#calendar-status').textContent = '已準備下載，請開啟 .ics 檔案，加入你的行事曆。';
});
