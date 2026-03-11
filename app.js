const list = document.getElementById('habit-list');
const addBtn = document.getElementById('add-habit');
const streakEl = document.getElementById('streak-count');
const notifyBtn = document.getElementById('notify-btn');
const notifyTime = document.getElementById('notify-time');
const notifySet = document.getElementById('notify-set');
const calWeekBtn = document.getElementById('cal-week');
const calMonthBtn = document.getElementById('cal-month');
const calendarEl = document.getElementById('calendar');
const weeklyProgressEl = document.getElementById('weekly-progress');
const weeklyGoalInput = document.getElementById('weekly-goal');
const weeklyBar = document.getElementById('weekly-bar');
const focusTimeEl = document.getElementById('focus-time');
const focusStart = document.getElementById('focus-start');
const focusPause = document.getElementById('focus-pause');
const focusReset = document.getElementById('focus-reset');
const exportBtn = document.getElementById('export-pdf');

const todayKey = new Date().toISOString().slice(0,10);
const state = JSON.parse(localStorage.getItem('bh_state') || '{}');

const isPL = location.hostname.includes('biohacking-mvp');
const i18n = {
  en: {
    tagline: 'Your daily habit checklist + streaks.',
    streak: 'days in a row',
    h2Today: 'Today’s habits',
    addHabit: '+ Add habit',
    h2Reminders: 'Reminders',
    notifyBtn: 'Enable notifications',
    notifySet: 'Set reminder',
    noteReminder: 'Reminder works in this browser.',
    h2Calendar: 'Habit calendar',
    calWeek: 'Week',
    calMonth: 'Month',
    h2Weekly: 'Weekly goal',
    weeklyLabel: 'Goal:',
    h2Focus: 'Focus (25/5)',
    focusPause: 'Pause',
    h2Export: 'Export',
    exportPdf: 'Export to PDF',
    noteExport: 'Opens a print view (PDF).',
    h2Featured: 'Featured products',
    learnMore: 'Learn more',
    products: {
      flexomore: 'Multi-ingredient supplement supporting joint and bone health.',
      endunad: 'Advanced supplement supporting natural NAD+ production and cellular health.',
      brain: 'Modern brain support for increased mental and physical effort.',
      femin: 'Product supporting libido and hormonal balance in women.',
      collagen: 'VERISOL® collagen hydrolysate supplement supporting firm, elastic skin.'
    },
    habits: ['Daylight 10 min', 'Water + electrolytes', 'Movement 5–10 min'],
    promptHabit: 'Habit name:',
    notifUnsupported: 'Your browser does not support notifications.',
    notifDenied: 'Notification permission not granted.',
    notifTitle: 'Biohacking Daily',
    notifBody: 'Time for your habits ✨',
    alertReminder: (t)=>`Reminder set for ${t}`,
    focusTitle: 'Biohacking Focus',
    focusBreak: '5 min break',
    focusStart: 'Start 25 min focus',
    reportTitle: 'Biohacking Daily — report',
    reportToday: (d)=>`Today’s habits (${d})`,
    reportStreak: (n)=>`Streak: ${n} days`
  },
  pl: {
    tagline: 'Twoja codzienna lista nawyków + serie.',
    streak: 'dni z rzędu',
    h2Today: 'Dzisiejsze nawyki',
    addHabit: '+ Dodaj nawyk',
    h2Reminders: 'Przypomnienia',
    notifyBtn: 'Włącz powiadomienia',
    notifySet: 'Ustaw przypomnienie',
    noteReminder: 'Przypomnienia działają w tej przeglądarce.',
    h2Calendar: 'Kalendarz nawyków',
    calWeek: 'Tydzień',
    calMonth: 'Miesiąc',
    h2Weekly: 'Cel tygodniowy',
    weeklyLabel: 'Cel:',
    h2Focus: 'Skupienie (25/5)',
    focusPause: 'Pauza',
    h2Export: 'Eksport',
    exportPdf: 'Eksportuj do PDF',
    noteExport: 'Otwiera widok do druku (PDF).',
    h2Featured: 'Polecane produkty',
    learnMore: 'Dowiedz się więcej',
    products: {
      flexomore: 'Wieloskładnikowy suplement wspierający stawy i kości.',
      endunad: 'Zaawansowany suplement wspierający naturalną produkcję NAD+ i zdrowie komórkowe.',
      brain: 'Nowoczesne wsparcie mózgu przy zwiększonym wysiłku umysłowym i fizycznym.',
      femin: 'Produkt wspierający libido i równowagę hormonalną u kobiet.',
      collagen: 'Suplement z hydrolizatem kolagenu VERISOL® wspierający jędrną, elastyczną skórę.'
    },
    habits: ['Światło dzienne 10 min', 'Woda + elektrolity', 'Ruch 5–10 min'],
    promptHabit: 'Nazwa nawyku:',
    notifUnsupported: 'Twoja przeglądarka nie obsługuje powiadomień.',
    notifDenied: 'Nie przyznano zgody na powiadomienia.',
    notifTitle: 'Biohacking Daily',
    notifBody: 'Czas na Twoje nawyki ✨',
    alertReminder: (t)=>`Przypomnienie ustawione na ${t}`,
    focusTitle: 'Biohacking Skupienie',
    focusBreak: '5 min przerwy',
    focusStart: 'Start 25 min skupienia',
    reportTitle: 'Biohacking Daily — raport',
    reportToday: (d)=>`Dzisiejsze nawyki (${d})`,
    reportStreak: (n)=>`Seria: ${n} dni`
  }
};

const lang = isPL ? i18n.pl : i18n.en;

function applyLocale(){
  document.documentElement.lang = isPL ? 'pl' : 'en';
  document.getElementById('tagline').textContent = lang.tagline;
  document.getElementById('streak-label').textContent = lang.streak;
  document.getElementById('h2-today').textContent = lang.h2Today;
  document.getElementById('add-habit').textContent = lang.addHabit;
  document.getElementById('h2-reminders').textContent = lang.h2Reminders;
  document.getElementById('notify-btn').textContent = lang.notifyBtn;
  document.getElementById('notify-set').textContent = lang.notifySet;
  document.getElementById('note-reminder').textContent = lang.noteReminder;
  document.getElementById('h2-calendar').textContent = lang.h2Calendar;
  document.getElementById('cal-week').textContent = lang.calWeek;
  document.getElementById('cal-month').textContent = lang.calMonth;
  document.getElementById('h2-weekly').textContent = lang.h2Weekly;
  document.getElementById('weekly-label').childNodes[0].nodeValue = lang.weeklyLabel;
  document.getElementById('h2-focus').textContent = lang.h2Focus;
  document.getElementById('focus-pause').textContent = lang.focusPause;
  document.getElementById('h2-export').textContent = lang.h2Export;
  document.getElementById('export-pdf').textContent = lang.exportPdf;
  document.getElementById('note-export').textContent = lang.noteExport;
  document.getElementById('h2-featured').textContent = lang.h2Featured;
  document.querySelectorAll('.affiliate-link').forEach(a=>a.textContent = lang.learnMore);
  const descs = document.querySelectorAll('.affiliate-text p');
  if (descs[0]) descs[0].textContent = lang.products.flexomore;
  if (descs[1]) descs[1].textContent = lang.products.endunad;
  if (descs[2]) descs[2].textContent = lang.products.brain;
  if (descs[3]) descs[3].textContent = lang.products.femin;
  if (descs[4]) descs[4].textContent = lang.products.collagen;
}

function migrateHabits(){
  if (!state.habits) return;
  const mapTo = isPL ? {
    'Daylight 10 min': 'Światło dzienne 10 min',
    'Water + electrolytes': 'Woda + elektrolity',
    'Movement 5–10 min': 'Ruch 5–10 min',
  } : {
    'Światło dzienne 10 min': 'Daylight 10 min',
    'Woda + elektrolity': 'Water + electrolytes',
    'Ruch 5–10 min': 'Movement 5–10 min',
  };
  state.habits = state.habits.map(h => ({ ...h, name: mapTo[h.name] || h.name }));
}

if (!state.habits) state.habits = lang.habits.map(name => ({ id: crypto.randomUUID(), name, done: false }));
if (!state.history) state.history = {};
if (!state.weeklyGoal) state.weeklyGoal = 5;

applyLocale();
migrateHabits();

if (state.lastDate !== todayKey) {
  state.habits = state.habits.map(h => ({...h, done:false}));
  state.lastDate = todayKey;
}

function save(){ localStorage.setItem('bh_state', JSON.stringify(state)); }

function render(){
  list.innerHTML='';
  state.habits.forEach(h => {
    const li = document.createElement('li');
    const cb = document.createElement('input');
    cb.type='checkbox';
    cb.checked = h.done;
    cb.addEventListener('change',()=>{
      h.done = cb.checked; save(); updateStreak(); renderCalendar('week'); updateWeekly();
    });
    const span = document.createElement('span');
    span.textContent = h.name;
    li.append(cb, span);
    list.append(li);
  });
  weeklyGoalInput.value = state.weeklyGoal || 5;
  updateStreak();
  renderCalendar('week');
  updateWeekly();
}

function updateStreak(){
  const allDone = state.habits.every(h=>h.done);
  if (allDone && state.streakDate !== todayKey){
    state.streak = (state.streak||0) + 1;
    state.streakDate = todayKey;
  }
  // history per day
  state.history[todayKey] = {
    done: state.habits.filter(h=>h.done).length,
    total: state.habits.length
  };
  save();
  streakEl.textContent = state.streak || 0;
}

addBtn.addEventListener('click', ()=>{
  const name = prompt(lang.promptHabit);
  if (!name) return;
  state.habits.push({ id: crypto.randomUUID(), name, done:false });
  save(); render();
});

// Reminders
notifyBtn?.addEventListener('click', async () => {
  if (!('Notification' in window)) return alert(lang.notifUnsupported);
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') alert(lang.notifDenied);
});

notifySet?.addEventListener('click', () => {
  const time = notifyTime.value || '20:00';
  const [h,m] = time.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate()+1);
  const delay = target - now;
  setTimeout(()=>{
    if (Notification.permission === 'granted'){
      new Notification(lang.notifTitle, { body: lang.notifBody });
    }
  }, delay);
  alert(lang.alertReminder(time));
});

// Calendar
function renderCalendar(mode='week'){
  calendarEl.innerHTML='';
  const days = mode === 'month' ? 30 : 7;
  for (let i=days-1;i>=0;i--){
    const d = new Date();
    d.setDate(d.getDate()-i);
    const key = d.toISOString().slice(0,10);
    const info = state.history[key];
    const el = document.createElement('div');
    el.className = 'day' + (info && info.done === info.total ? ' done' : '');
    el.innerHTML = `<div>${d.getDate()}</div><div>${info?info.done:0}/${info?info.total:0}</div>`;
    calendarEl.appendChild(el);
  }
}
calWeekBtn?.addEventListener('click', ()=>renderCalendar('week'));
calMonthBtn?.addEventListener('click', ()=>renderCalendar('month'));

// Weekly goal
function updateWeekly(){
  const goal = Number(weeklyGoalInput.value || state.weeklyGoal || 5);
  state.weeklyGoal = goal;
  const days = 7;
  let hit = 0;
  for (let i=0;i<days;i++){
    const d = new Date();
    d.setDate(d.getDate()-i);
    const key = d.toISOString().slice(0,10);
    const info = state.history[key];
    if (info && info.total>0 && info.done === info.total) hit++;
  }
  weeklyProgressEl.textContent = `${hit}/${goal}`;
  weeklyBar.style.width = `${Math.min(100, (hit/goal)*100)}%`;
  save();
}
weeklyGoalInput?.addEventListener('change', updateWeekly);

// Focus timer 25/5
let focusSeconds = 25*60;
let focusInterval = null;
let onBreak = false;

function renderFocus(){
  const m = String(Math.floor(focusSeconds/60)).padStart(2,'0');
  const s = String(focusSeconds%60).padStart(2,'0');
  focusTimeEl.textContent = `${m}:${s}`;
}

function tick(){
  focusSeconds--;
  if (focusSeconds <= 0){
    onBreak = !onBreak;
    focusSeconds = (onBreak ? 5 : 25) * 60;
    if (Notification.permission === 'granted'){
      new Notification(lang.focusTitle, { body: onBreak ? lang.focusBreak : lang.focusStart });
    }
  }
  renderFocus();
}

focusStart?.addEventListener('click', ()=>{
  if (focusInterval) return;
  focusInterval = setInterval(tick, 1000);
});
focusPause?.addEventListener('click', ()=>{
  clearInterval(focusInterval); focusInterval = null;
});
focusReset?.addEventListener('click', ()=>{
  clearInterval(focusInterval); focusInterval = null;
  onBreak = false; focusSeconds = 25*60; renderFocus();
});
renderFocus();

// Export to PDF (print)
exportBtn?.addEventListener('click', ()=>{
  const w = window.open('', '_blank');
  const listHtml = state.habits.map(h=>`<li>${h.done?'✅':'⬜'} ${h.name}</li>`).join('');
  w.document.write(`<!doctype html><html><head><title>Biohacking Daily</title></head><body>
  <h1>${lang.reportTitle}</h1>
  <h2>${lang.reportToday(todayKey)}</h2>
  <ul>${listHtml}</ul>
  <p>${lang.reportStreak(state.streak||0)}</p>
  </body></html>`);
  w.document.close();
  w.focus();
  w.print();
});

render();
