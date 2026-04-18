const factEl = document.getElementById('fact-text');
const quizTextEl = document.getElementById('quiz-text');
const quizFeedback = document.getElementById('quiz-feedback');
const streakEl = document.getElementById('streak-count');
const favList = document.getElementById('favorites-list');
const btnFavorite = document.getElementById('btn-favorite');
const btnShare = document.getElementById('btn-share');
const btnDone = document.getElementById('btn-done');
const btnTrue = document.getElementById('quiz-true');
const btnFalse = document.getElementById('quiz-false');
const exportBtn = document.getElementById('export-pdf');
const btnTop5 = document.getElementById('btn-top5');
const btnQuiz = document.getElementById('btn-quiz');

const todayKey = new Date().toISOString().slice(0,10);
const state = JSON.parse(localStorage.getItem('biohacks_state_pl') || '{}');

if (!state.completedDates) state.completedDates = {};
if (!state.favorites) state.favorites = [];
if (!state.lastCompletedDate) state.lastCompletedDate = null;
if (!state.streak) state.streak = 0;

const pool = [
  { fact: 'Światło dzienne: 10 minut na zewnątrz w ciągu 1h od pobudki.', quiz: 'Poranne światło wspiera rytm dobowy.', answer: true },
  { fact: 'Nawodnienie: woda + elektrolity do pierwszego napoju.', quiz: 'Elektrolity wspierają nawodnienie.', answer: true },
  { fact: 'Ruch: 5–10 minut lekkiej aktywności.', quiz: 'Krótki ruch poprawia energię.', answer: true },
  { fact: 'Śniadanie białkowe.', quiz: 'Białko pomaga w sytości i energii.', answer: true },
  { fact: 'Bez kofeiny przez 60–90 min po przebudzeniu.', quiz: 'Opóźnienie kofeiny zmniejsza popołudniowy spadek.', answer: true },
  { fact: 'Krótki spacer po posiłku (5–10 minut).', quiz: 'Spacer po posiłku wspiera kontrolę glukozy.', answer: true },
  { fact: 'Przyciemnianie ekranów 60 min przed snem.', quiz: 'Mniej niebieskiego światła wspiera melatoninę.', answer: true },
  { fact: 'Stałe pory snu (ta sama godzina).', quiz: 'Regularność poprawia jakość snu.', answer: true },
  { fact: '5 minut oddychania przez nos / box breathing.', quiz: 'Kontrolowany oddech obniża stres.', answer: true },
  { fact: 'Krótka ekspozycja na zimno (twarz).', quiz: 'Zimno zwiększa czujność.', answer: true },
  { fact: 'Mikro‑trening: 1–2 serie pompek/przysiadów.', quiz: 'Krótki trening też działa.', answer: true },
  { fact: 'Ogranicz dodany cukier dziś.', quiz: 'Mniej cukru wspiera metabolizm.', answer: true },
  { fact: 'Białko + błonnik na lunch.', quiz: 'Białko i błonnik stabilizują energię.', answer: true },
  { fact: '7–10k kroków (rozłożone w ciągu dnia).', quiz: 'Ruch w ciągu dnia ma znaczenie.', answer: true },
  { fact: '10 minut światła popołudniu.', quiz: 'Popołudniowe światło wzmacnia sygnały dobowe.', answer: true },
  { fact: '2‑minutowy reset postawy (barki w dół).', quiz: 'Postawa wpływa na oddech i fokus.', answer: true },
  { fact: '5 minut mobilności.', quiz: 'Mobilność zmniejsza sztywność.', answer: true },
  { fact: 'Ostatni posiłek 2–3h przed snem.', quiz: 'Wcześniejsza kolacja poprawia sen.', answer: true },
  { fact: 'Produkty bogate w magnez (zielone, orzechy).', quiz: 'Magnez wspiera relaks.', answer: true },
  { fact: 'Ogranicz alkohol dziś.', quiz: 'Alkohol pogarsza jakość snu.', answer: true },
  { fact: 'Jeden 25‑minutowy blok głębokiej pracy.', quiz: 'Krótki deep work buduje momentum.', answer: true },
  { fact: '5 minut wdzięczności / journalingu.', quiz: 'Journaling obniża stres.', answer: true },
  { fact: 'Rozciąganie łydek/bioder przez 3 min.', quiz: 'Rozciąganie poprawia mobilność.', answer: true },
  { fact: 'Stań lub przejdź się podczas jednej rozmowy.', quiz: 'Stanie przerywa siedzenie.', answer: true },
  { fact: 'Nawodnienie: 2 litry do wieczora.', quiz: 'Nawodnienie wspiera energię.', answer: true },
  { fact: 'Bez telefonu przez 15 min po przebudzeniu.', quiz: 'Brak telefonu rano poprawia fokus.', answer: true },
  { fact: 'Kofeina max 8h przed snem.', quiz: 'Późna kofeina psuje sen.', answer: true },
  { fact: 'Dodaj omega‑3 dziś.', quiz: 'Omega‑3 wspiera mózg.', answer: true },
  { fact: '10 minut rozciągania przed snem.', quiz: 'Rozciąganie pomaga w relaksie.', answer: true },
  { fact: 'Krótki oddech po lunchu.', quiz: 'Oddech resetuje uwagę.', answer: true }
];

function hashDate(str){
  let h = 0;
  for (let i=0;i<str.length;i++) h = (h*31 + str.charCodeAt(i)) >>> 0;
  return h;
}

const idx = hashDate(todayKey) % pool.length;
const today = pool[idx];

factEl.textContent = today.fact;
quizTextEl.textContent = today.quiz;

function save(){ localStorage.setItem('biohacks_state_pl', JSON.stringify(state)); }

function updateStreak(){
  if (streakEl) streakEl.textContent = state.streak || 0;
  if (streakElBottom) streakElBottom.textContent = state.streak || 0;
}

function markDone(){
  if (state.completedDates[todayKey]) return;
  const last = state.lastCompletedDate ? new Date(state.lastCompletedDate) : null;
  const todayDate = new Date(todayKey);
  const yesterday = new Date(todayDate);
  yesterday.setDate(todayDate.getDate()-1);
  if (last && last.toISOString().slice(0,10) === yesterday.toISOString().slice(0,10)){
    state.streak = (state.streak||0) + 1;
  } else {
    state.streak = 1;
  }
  state.lastCompletedDate = todayKey;
  state.completedDates[todayKey] = true;
  save();
  updateStreak();
}

function renderFavorites(){
  favList.innerHTML = '';
  if (!state.favorites.length){
    const li = document.createElement('li');
    li.textContent = 'Brak ulubionych.';
    favList.appendChild(li);
    return;
  }
  state.favorites.forEach(f => {
    const li = document.createElement('li');
    li.textContent = f;
    favList.appendChild(li);
  });
}

btnFavorite.addEventListener('click', ()=>{
  if (!state.favorites.includes(today.fact)) state.favorites.unshift(today.fact);
  state.favorites = state.favorites.slice(0,50);
  save(); renderFavorites();
});

btnShare.addEventListener('click', async ()=>{
  const url = location.href;
  try {
    await navigator.clipboard.writeText(url);
    alert('Link skopiowany!');
  } catch (e){
    prompt('Skopiuj link:', url);
  }
});

btnDone.addEventListener('click', markDone);

function answer(userAnswer){
  const ok = userAnswer === today.answer;
  quizFeedback.textContent = ok ? '✅ Dobrze!' : '❌ Spróbuj jutro.';
}

btnTrue.addEventListener('click', ()=>answer(true));
btnFalse.addEventListener('click', ()=>answer(false));
if (btnQuiz){
  btnQuiz.addEventListener('click', ()=>{
    document.getElementById('quiz-text').scrollIntoView({behavior:'smooth', block:'center'});
  });
}

exportBtn.addEventListener('click', ()=>{
  const w = window.open('', '_blank');
  const favs = state.favorites.map(f=>`<li>${f}</li>`).join('');
  w.document.write(`<!doctype html><html><head><title>Biohacks Daily — raport</title></head><body>
  <h1>Biohacks Daily — raport</h1>
  <h2>Dzisiejszy nawyk (${todayKey})</h2>
  <p>${today.fact}</p>
  <h3>Dzisiejsze pytanie</h3>
  <p>${today.quiz}</p>
  <p>Odpowiedź: ${today.answer ? 'Prawda' : 'Fałsz'}</p>
  <h3>Ulubione</h3>
  <ul>${favs || '<li>Brak</li>'}</ul>
  </body></html>`);
  w.document.close();
  w.focus();
  w.print();
});

if (btnTop5){
  btnTop5.addEventListener('click', ()=>{
    document.getElementById('top5').scrollIntoView({behavior:'smooth'});
  });
}

// tracking moved to dlugowieczny24.pl


renderFavorites();
updateStreak();
