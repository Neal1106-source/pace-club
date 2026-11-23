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

document.querySelector('#calendar').addEventListener('click', () => {
  // Compute the next Wednesday at 18:00 in Taiwan, regardless of device timezone.
  const now = new Date();
  const taiwan = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const next = new Date(Date.UTC(taiwan.getUTCFullYear(), taiwan.getUTCMonth(), taiwan.getUTCDate(), 10));
  const days = (3 - next.getUTCDay() + 7) % 7;
  next.setUTCDate(next.getUTCDate() + days);
  if (next <= now) next.setUTCDate(next.getUTCDate() + 7);
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
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  document.querySelector('#calendar-status').textContent = '已準備下載，請開啟 .ics 檔案，加入你的行事曆。';
});
