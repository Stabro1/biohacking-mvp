const list = document.getElementById('habit-list');
const addBtn = document.getElementById('add-habit');
const streakEl = document.getElementById('streak-count');
const subscribeBtn = document.getElementById('subscribe-btn');
const upsellBtn = document.getElementById('upsell-btn');

const PRICING = {
  monthlyUrl: '',
  upsellUrl: ''
};

const todayKey = new Date().toISOString().slice(0,10);
const state = JSON.parse(localStorage.getItem('bh_state') || '{}');

if (!state.habits) state.habits = [
  { id: crypto.randomUUID(), name: 'Światło dzienne 10 min', done: false },
  { id: crypto.randomUUID(), name: 'Woda + elektrolity', done: false },
  { id: crypto.randomUUID(), name: 'Ruch 5–10 min', done: false },
];
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
      h.done = cb.checked; save(); updateStreak();
    });
    const span = document.createElement('span');
    span.textContent = h.name;
    li.append(cb, span);
    list.append(li);
  });
  updateStreak();
}

function updateStreak(){
  const allDone = state.habits.every(h=>h.done);
  if (allDone && state.streakDate !== todayKey){
    state.streak = (state.streak||0) + 1;
    state.streakDate = todayKey;
    save();
  }
  streakEl.textContent = state.streak || 0;
}

addBtn.addEventListener('click', ()=>{
  const name = prompt('Nazwa nawyku:');
  if (!name) return;
  state.habits.push({ id: crypto.randomUUID(), name, done:false });
  save(); render();
});

function goTo(url){
  if (!url){
    alert('Brak linku płatności. Właściciel musi dodać link Stripe/Gumroad.');
    return;
  }
  window.location.href = url;
}

subscribeBtn?.addEventListener('click', () => goTo(PRICING.monthlyUrl));
upsellBtn?.addEventListener('click', () => goTo(PRICING.upsellUrl));

render();
