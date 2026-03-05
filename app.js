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

if (!state.habits) state.habits = [
  { id: crypto.randomUUID(), name: 'Światło dzienne 10 min', done: false },
  { id: crypto.randomUUID(), name: 'Woda + elektrolity', done: false },
  { id: crypto.randomUUID(), name: 'Ruch 5–10 min', done: false },
];
if (!state.history) state.history = {};
if (!state.weeklyGoal) state.weeklyGoal = 5;

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
  const name = prompt('Nazwa nawyku:');
  if (!name) return;
  state.habits.push({ id: crypto.randomUUID(), name, done:false });
  save(); render();
});

// Reminders
notifyBtn?.addEventListener('click', async () => {
  if (!('Notification' in window)) return alert('Przeglądarka nie wspiera powiadomień.');
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') alert('Brak zgody na powiadomienia.');
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
      new Notification('Biohacking Daily', { body: 'Czas na Twoje nawyki ✨' });
    }
  }, delay);
  alert(`Przypomnienie ustawione na ${time}`);
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
      new Notification('Biohacking Focus', { body: onBreak ? 'Przerwa 5 min' : 'Start 25 min focus' });
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
  <h1>Biohacking Daily — raport</h1>
  <h2>Dzisiejsze nawyki (${todayKey})</h2>
  <ul>${listHtml}</ul>
  <p>Streak: ${state.streak||0} dni</p>
  </body></html>`);
  w.document.close();
  w.focus();
  w.print();
});

render();
