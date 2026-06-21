// ═══════════════════════════════════════════════════════
// ATHLETIC PHYSIQUE — App Logic
// ═══════════════════════════════════════════════════════

// ── State ─────────────────────────────────────────────
let S = {};
const KEY = 'ap_v1';
function load() { try { S = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e) { S = {}; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} }

// ── Program Data ──────────────────────────────────────
// Basis-Tabelle [sätze, min_wdh, max_wdh] für 12 Wochen
// max_wdh = null → feste Zahl (Sek oder Wdh)
const BASE = {
  // TAG A – Brust & Rücken (Push + Pull)
  'Liegestütze':              [[3,10,12],[3,12,14],[3,13,15],[4,12,15],[4,14,16],[4,15,18],[4,16,19],[5,16,19],[5,18,21],[5,18,22],[5,20,24],[5,22,26]],
  'Klimmzüge':                [[3,3,5],[3,3,5],[3,4,6],[4,4,6],[4,5,7],[4,5,7],[4,6,8],[5,6,8],[5,7,9],[5,7,9],[5,8,10],[5,9,12]],
  'Pike Push-Ups':            [[3,6,8],[3,7,9],[3,8,10],[3,9,11],[3,10,12],[3,11,13],[4,10,13],[4,11,14],[4,12,15],[4,13,15],[4,14,16],[4,15,17]],
  'Australische Klimmzüge':   [[3,10,12],[3,11,13],[3,12,14],[4,12,14],[4,13,15],[4,14,16],[4,15,18],[4,16,18],[5,16,20],[5,18,20],[5,18,22],[5,20,25]],
  'Plank':                    [[3,25,null],[3,30,null],[3,35,null],[3,40,null],[3,45,null],[3,50,null],[4,45,null],[4,50,null],[4,55,null],[4,60,null],[4,65,null],[4,75,null]],
  'Dead Hang':                [[3,20,null],[3,22,null],[3,25,null],[3,28,null],[3,30,null],[3,32,null],[3,35,null],[3,38,null],[3,40,null],[3,42,null],[3,45,null],[3,50,null]],
  // TAG B – Brust & Arme (Push + Pull)
  'Enge Liegestütze':         [[3,8,10],[3,9,11],[3,10,12],[3,11,13],[4,10,13],[4,11,14],[4,12,15],[4,13,16],[4,14,17],[4,15,18],[4,16,19],[5,15,20]],
  'Bizeps-Curls (Untergriff)':[[3,10,12],[3,11,13],[3,12,14],[3,12,14],[4,12,14],[4,13,15],[4,14,16],[4,14,16],[4,15,18],[4,16,18],[4,17,19],[4,18,20]],
  'Dips':                     [[3,6,8],[3,7,9],[3,8,10],[3,9,11],[4,8,11],[4,9,12],[4,10,13],[4,11,14],[4,12,15],[4,13,15],[5,12,15],[5,13,16]],
  'Negative Klimmzüge':       [[3,4,null],[3,4,null],[3,5,null],[3,5,null],[3,5,null],[3,5,null],[3,4,null],[3,4,null],[2,4,null],[2,4,null],[2,3,null],[2,3,null]],
  'Diamond Push-Ups':         [[3,6,8],[3,7,9],[3,8,10],[3,9,11],[3,10,12],[4,10,12],[4,11,13],[4,12,14],[4,12,15],[4,14,16],[4,15,17],[4,15,18]],
  'Beinheben an Stange':      [[3,8,null],[3,9,null],[3,10,null],[3,11,null],[3,12,null],[3,13,null],[4,12,null],[4,13,null],[4,14,null],[4,15,null],[4,15,null],[4,15,null]],
  // TAG C – Beine, Core & Fatburn
  'Kniebeugen':               [[3,15,null],[3,18,null],[3,20,null],[3,20,null],[4,20,null],[4,22,null],[4,22,null],[4,25,null],[4,25,null],[4,25,null],[4,25,null],[4,25,null]],
  'Bulgarian Split Squats':   [[3,8,null],[3,9,null],[3,10,null],[3,10,null],[3,11,null],[3,12,null],[4,11,null],[4,12,null],[4,13,null],[4,14,null],[4,14,null],[4,15,null]],
  'Glute Bridge':             [[3,12,null],[3,13,null],[3,14,null],[3,15,null],[3,16,null],[4,15,null],[4,16,null],[4,18,null],[4,18,null],[4,20,null],[4,20,null],[4,20,null]],
  'Mountain Climbers':        [[3,20,null],[3,25,null],[3,30,null],[3,30,null],[3,35,null],[3,40,null],[4,35,null],[4,40,null],[4,45,null],[4,50,null],[4,50,null],[4,60,null]],
  'Reverse Crunch':           [[3,10,null],[3,11,null],[3,12,null],[3,13,null],[3,14,null],[3,15,null],[4,14,null],[4,15,null],[4,16,null],[4,17,null],[4,18,null],[4,20,null]],
  'Burpees':                  [[3,5,null],[3,6,null],[3,7,null],[3,8,null],[3,8,null],[3,10,null],[4,8,null],[4,10,null],[4,10,null],[4,12,null],[4,12,null],[4,15,null]],
};

const TIPS = {
  'Liegestütze':'Breiter Griff, Brust tief — maximaler Stretch für Muskelaufbau',
  'Klimmzüge':'Brust zur Stange, 2 Sek oben halten, kontrolliert ablassen',
  'Pike Push-Ups':'Hüfte hoch in V-Form, Kopf durch die Arme — Schulter-Fokus',
  'Australische Klimmzüge':'Untergriff = mehr Bizeps. Brust zur Stange, Körper gerade',
  'Plank':'Volle Spannung: Bauch, Gesäß, alles — nicht durchhängen (Sek)',
  'Dead Hang':'Passiv hängen, Schultern aktiv — Griffkraft + Dekompression (Sek)',
  'Enge Liegestütze':'Hände schulterbreit, Ellenbogen nah — innere Brust & Trizeps',
  'Bizeps-Curls (Untergriff)':'Untergriff an Stange, langsam hoch und runter — volle Streckung',
  'Dips':'Stuhl/Sofa, Ellenbogen nach hinten, tief absenken — Trizeps & untere Brust',
  'Negative Klimmzüge':'Hochspringen, 5 Sek kontrolliert ablassen — maximaler Reiz',
  'Diamond Push-Ups':'Hände zu Dreieck — Trizeps und innere Brust',
  'Beinheben an Stange':'Beine gestreckt heben, langsam ablassen — unterer Bauch',
  'Kniebeugen':'Tief gehen, Knie über Zehen — fußballschonend',
  'Bulgarian Split Squats':'Hinterer Fuß auf Stuhl — Knie & Achillessehne schonen',
  'Glute Bridge':'Hüfte oben halten, Gesäß fest anspannen',
  'Mountain Climbers':'Schnell & explosiv — Herzrate hoch, Fett verbrennen',
  'Reverse Crunch':'Langsam & kontrolliert — unterer Bauch, Lendenwirbel am Boden',
  'Burpees':'Vollgas — effektivstes Körpergewicht-Übung für Fettabbau',
};

const TIMED = new Set(['Plank','Dead Hang','Mountain Climbers']);

const DAYS_DEF = [
  { name:'Tag A', type:'Oberkörper – Brust & Rücken', icon:'💪', letter:'A',
    groups:[
      {label:'PUSH — Brust & Schultern', ex:['Liegestütze','Pike Push-Ups','Plank']},
      {label:'PULL — Rücken & Griffkraft', ex:['Klimmzüge','Australische Klimmzüge','Dead Hang']},
    ]
  },
  { name:'Tag B', type:'Oberkörper – Brust & Arme', icon:'💪', letter:'B',
    groups:[
      {label:'PUSH — Trizeps & innere Brust', ex:['Enge Liegestütze','Dips','Diamond Push-Ups']},
      {label:'PULL — Bizeps & Core', ex:['Bizeps-Curls (Untergriff)','Negative Klimmzüge','Beinheben an Stange']},
    ]
  },
  { name:'Tag C', type:'Beine · Core · Fettverbrennung', icon:'⚡', letter:'C',
    groups:[
      {label:'BEINE — Fußballschonend', ex:['Kniebeugen','Bulgarian Split Squats','Glute Bridge']},
      {label:'CORE & FAT BURN', ex:['Mountain Climbers','Reverse Crunch','Burpees']},
    ]
  }
];

const ALL_EX = DAYS_DEF.flatMap(d => d.groups.flatMap(g => g.ex));

const ACHIEVEMENTS = [
  {id:'first',icon:'🏁',name:'Erster Schritt',desc:'Erstes Workout abgeschlossen',xp:50,check:()=>totalSessions()>=1},
  {id:'w3',icon:'🔥',name:'3er Serie',desc:'3 Wochen am Stück aktiv',xp:100,check:()=>calcStreak()>=3},
  {id:'s10',icon:'⚡',name:'10 Workouts',desc:'10 Einheiten abgeschlossen',xp:150,check:()=>totalSessions()>=10},
  {id:'s25',icon:'💪',name:'25 Workouts',desc:'25 Einheiten abgeschlossen',xp:250,check:()=>totalSessions()>=25},
  {id:'s50',icon:'🏆',name:'50 Workouts',desc:'50 Einheiten abgeschlossen',xp:500,check:()=>totalSessions()>=50},
  {id:'w7',icon:'📅',name:'7 Blöcke',desc:'7 komplette Blöcke',xp:200,check:()=>completedBlocks()>=7},
  {id:'pu10',icon:'🔝',name:'Klimmzug-Pro',desc:'10 Klimmzüge in einem Satz',xp:300,check:()=>parseInt(S.pr_pu||0)>=10},
  {id:'full12',icon:'🎯',name:'12 Wochen',desc:'Das komplette Programm',xp:1000,check:()=>completedBlocks()>=12},
];

const LEVEL_NAMES = ['Rookie','Beginner','Trainee','Athlete','Warrior','Champion','Elite','Legend'];
const RPE_L = ['','Sehr leicht','Leicht','Moderat','Etwas hart','Anstrengend','Sehr anstrengend','Schwer','Sehr schwer','Maximal','Absolutes Limit'];

// ── Keys ──────────────────────────────────────────────
let CW = 1; // current block
function dk(w,d) { return `w${w}d${d}`; }
function ek(w,d,e,f) { return `w${w}d${d}e${e}_${f}`; }

// ── Stats helpers ─────────────────────────────────────
function totalSessions() {
  let t = 0;
  for (let w = 1; w <= 12; w++) for (let d = 0; d < 3; d++) if (S[dk(w,d)]) t++;
  return t;
}
function completedBlocks() {
  let t = 0;
  for (let w = 1; w <= 12; w++) if ([0,1,2].every(d => S[dk(w,d)])) t++;
  return t;
}
function calcStreak() {
  let s = 0;
  for (let w = CW; w >= 1; w--) {
    if ([0,1,2].filter(d => S[dk(w,d)]).length >= 2) s++; else break;
  }
  return s;
}
function getXP() { return S.xp || 0; }
function getLevel() { return Math.min(50, Math.floor(getXP() / 200) + 1); }
function getLevelName() { return LEVEL_NAMES[Math.min(LEVEL_NAMES.length-1, Math.floor(getLevel()/7))]; }
function addXP(amount) {
  S.xp = (S.xp || 0) + amount;
  save();
}

// ── Adaptive target ───────────────────────────────────
function getTarget(week, dayIdx, flatExIdx) {
  const allEx = DAYS_DEF[dayIdx].groups.flatMap(g => g.ex);
  const exName = allEx[flatExIdx];
  const base = BASE[exName];
  if (!base) return { sets:3, repsStr:'10', adapted:false };
  const wi = Math.min(week-1, 11);
  let [sets, rMin, rMax] = base[wi];
  if (week >= 2) {
    const prev = parseInt(S[ek(week-1, dayIdx, flatExIdx, 'reps')]);
    if (!isNaN(prev)) {
      if (rMax !== null) {
        if (prev >= rMax) { rMin = rMax+1; rMax = rMax+2; }
        else if (prev < rMin-1) { rMax = prev+1; rMin = Math.max(1, prev); }
      } else {
        if (prev >= rMin) rMin++;
        else if (prev > 0) rMin = prev;
      }
    }
  }
  const adapted = week >= 2 && !!S[ek(week-1, dayIdx, flatExIdx, 'reps')];
  return { sets, repsStr: rMax !== null ? `${rMin}–${rMax}` : `${rMin}`, adapted };
}

// ── Toast ─────────────────────────────────────────────
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2300);
}

// ── Navigation ────────────────────────────────────────
function nav(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`.nav-btn[data-page="${page}"]`).classList.add('active');
  document.getElementById('screen').scrollTo(0, 0);
  if (page === 'dash') renderDash();
  if (page === 'train') renderTrain();
  if (page === 'progress') renderProgress();
  if (page === 'body') renderBody();
  if (page === 'achieve') renderAchieve();
  if (page === 'settings') renderSettings();
  if (page === 'library') renderLibrary();
}

// ── Onboarding ────────────────────────────────────────
function initOnboarding() {
  document.querySelectorAll('.ob-opt').forEach(el => {
    el.addEventListener('click', () => {
      S.goal = el.dataset.goal;
      S.onboarded = true;
      save();
      document.getElementById('onboarding').style.display = 'none';
      toast('Willkommen bei Athletic Physique! 💪');
      nav('dash');
    });
  });
}

// ── Dashboard ─────────────────────────────────────────
function renderDash() {
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Guten Morgen' : h < 17 ? 'Guten Tag' : 'Guten Abend';
  document.getElementById('d-greeting').textContent = greeting + ' 👋';
  document.getElementById('d-streak').textContent = calcStreak();
  document.getElementById('d-sessions').textContent = totalSessions();
  document.getElementById('d-blocks').textContent = completedBlocks();
  document.getElementById('d-level').textContent = 'Lvl ' + getLevel();

  // Progress ring
  const pct = Math.round((totalSessions() / 36) * 100);
  document.getElementById('d-pct').textContent = pct + '%';
  const circle = document.getElementById('ring-circle');
  const r = 40; const circ = 2 * Math.PI * r;
  circle.style.strokeDasharray = circ;
  circle.style.strokeDashoffset = circ - (pct / 100) * circ;

  // Week dots
  const dotsEl = document.getElementById('d-dots');
  dotsEl.innerHTML = [0,1,2].map(d => {
    const done = !!S[dk(CW,d)];
    return `<div class="wd ${done?'done':''}"></div>`;
  }).join('');

  // Today's workout
  const nextDay = [0,1,2].find(d => !S[dk(CW,d)]);
  if (nextDay !== undefined) {
    const day = DAYS_DEF[nextDay];
    document.getElementById('d-today-tag').textContent = `Block ${CW} · ${day.name}`;
    document.getElementById('d-today-title').textContent = day.type;
    document.getElementById('d-today-exlist').innerHTML = day.groups.flatMap(g=>g.ex)
      .map(e => `<div class="today-ex-chip">${e}</div>`).join('');
  } else {
    document.getElementById('d-today-tag').textContent = `Block ${CW} ✓`;
    document.getElementById('d-today-title').textContent = 'Block abgeschlossen!';
    document.getElementById('d-today-exlist').innerHTML = '<div class="today-ex-chip">Nächster Block wartet 🎯</div>';
  }

  // Weight
  const w = (S.weights||[])[0];
  document.getElementById('d-weight').textContent = w ? w.kg + ' kg' : '— kg';
}

// ── Training ──────────────────────────────────────────
function renderTrain() {
  const done = [0,1,2].filter(d => S[dk(CW,d)]).length;
  document.getElementById('t-block-title').textContent = `Block ${CW} / 12`;
  document.getElementById('t-block-sub').textContent = `${done} von 3 Einheiten abgeschlossen`;
  const ph = CW<=4?['ph1','Phase 1 – Fundament']:CW<=8?['ph2','Phase 2 – Aufbau']:['ph3','Phase 3 – Intensiv'];
  const pt = document.getElementById('t-phase');
  pt.className = 'phase-tag ' + ph[0];
  pt.textContent = '● ' + ph[1];
  document.getElementById('t-prog').style.width = Math.round((done/3)*100) + '%';

  const list = document.getElementById('t-day-list');
  list.innerHTML = '';

  DAYS_DEF.forEach((day, di) => {
    const isDone = !!S[dk(CW,di)];
    const rpe = S[`rpe_${dk(CW,di)}`] || 0;
    const date = S[`date_${dk(CW,di)}`] || '';
    const allEx = day.groups.flatMap(g => g.ex);
    const exDone = allEx.filter((_,j) => S[ek(CW,di,j,'done')]).length;

    let flatIdx = 0;
    const exHtml = day.groups.map(group => {
      const gHtml = group.ex.map(name => {
        const j = flatIdx++;
        const chk = !!S[ek(CW,di,j,'done')];
        const timed = TIMED.has(name);
        const {sets,repsStr,adapted} = getTarget(CW,di,j);
        const prevReps = CW>=2 ? (S[ek(CW-1,di,j,'reps')]||'') : '';
        const curReps = S[ek(CW,di,j,'reps')]||'';
        const curTime = S[ek(CW,di,j,'time')]||'';
        const curNote = S[ek(CW,di,j,'note')]||'';
        return `<div class="ex-item">
          <div class="ex-top">
            <div class="ex-left">
              <div class="ex-name">${name}</div>
              <div class="ex-targets">
                <div class="ex-target-pill">🎯 ${sets} × ${repsStr}${timed?' Sek':''}</div>
                ${adapted?`<div class="adapt-dot">⚡ Angepasst</div>`:''}
              </div>
              ${prevReps?`<div class="ex-prev">Letzte Woche: <b>${prevReps}</b>${timed?' Sek':' Wdh'}</div>`:''}
              <div class="ex-tip">${TIPS[name]||''}</div>
            </div>
            <button class="ex-chk ${chk?'done':''}" onclick="toggleEx(${CW},${di},${j})">${chk?'✓':'○'}</button>
          </div>
          <div class="ex-grid">
            <div class="ex-field">
              <div class="ex-lbl">${timed?'Zeit (Sek)':'Wdh geschafft'}</div>
              <input class="ex-inp" type="number" placeholder="${timed?repsStr:'10'}" value="${timed?curTime:curReps}"
                onchange="setField(${CW},${di},${j},'${timed?'time':'reps'}',this.value)">
            </div>
            <div class="ex-field">
              <div class="ex-lbl">${timed?'Sätze':'Zeit (Sek)'}</div>
              <input class="ex-inp" type="number" placeholder="${timed?sets:'–'}" value="${timed?curReps:curTime}"
                onchange="setField(${CW},${di},${j},'${timed?'reps':'time'}',this.value)">
            </div>
            <div class="ex-field full">
              <div class="ex-lbl">Notiz</div>
              <textarea class="ex-ta" placeholder="Wie lief's? Schwer / leicht?" onchange="setField(${CW},${di},${j},'note',this.value)">${curNote}</textarea>
            </div>
          </div>
        </div>`;
      }).join('');
      return `<div class="ex-group-label">${group.label}</div>${gHtml}`;
    }).join('');

    const rpeHtml = Array.from({length:10},(_,k) => {
      const v = k+1;
      return `<button class="rpe-btn ${rpe===v?'sel':''}" data-v="${v}" data-day="${di}" onclick="setRPE(${CW},${di},${v})">${v}</button>`;
    }).join('');

    const card = document.createElement('div');
    card.className = 'day-card' + (isDone?' done':'');
    card.innerHTML = `
      <div class="day-head" onclick="toggleDay(${di})">
        <div class="day-badge">${day.icon}<div class="badge-letter">${day.letter}</div></div>
        <div class="day-meta">
          <div class="day-name">${day.name}</div>
          <div class="day-type">${day.type}</div>
          ${date?`<div class="day-date-tag">📅 ${date}</div>`:''}
        </div>
        <div class="day-right">
          <div class="chev">${isDone?'✓':'›'}</div>
          <div class="ex-count-pill">${exDone}/${allEx.length}</div>
        </div>
      </div>
      <div class="exercises">
        ${exHtml}
        <div class="day-footer">
          <div>
            <div class="rpe-hdr">
              <div class="rpe-label">Anstrengung (RPE)</div>
              <div class="rpe-hint" id="rpe-h-${di}">${rpe?RPE_L[rpe]:''}</div>
            </div>
            <div class="rpe-btns">${rpeHtml}</div>
          </div>
          ${!isDone
            ?`<button class="finish-btn" onclick="completeDay(${CW},${di})">✓  Einheit abschließen</button>`
            :`<div class="done-banner">✓ Abgeschlossen${rpe?' · RPE '+rpe:''}${date?' · '+date:''}</div>`}
        </div>
      </div>`;
    list.appendChild(card);
  });
}

function toggleDay(i) {
  document.querySelectorAll('.day-card').forEach((c,j) => {
    if (j===i) c.classList.toggle('open'); else c.classList.remove('open');
  });
}
function toggleEx(w,d,e) { S[ek(w,d,e,'done')] = !S[ek(w,d,e,'done')]; save(); renderTrain(); }
function setField(w,d,e,f,v) { S[ek(w,d,e,f)] = v; save(); }
function setRPE(w,d,v) {
  S[`rpe_${dk(w,d)}`] = v; save();
  document.querySelectorAll(`.rpe-btn[data-day="${d}"]`).forEach(b => b.classList.toggle('sel', +b.dataset.v===v));
  const h = document.getElementById(`rpe-h-${d}`); if(h) h.textContent = RPE_L[v]||'';
}
function completeDay(w,d) {
  S[dk(w,d)] = true;
  S[`date_${dk(w,d)}`] = new Date().toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'});
  addXP(100);
  save(); checkAchievements(); toast('Einheit abgeschlossen! +100 XP 🎉'); renderTrain(); renderDash();
}
function changeBlock(dir) { CW = Math.max(1, Math.min(12, CW+dir)); renderTrain(); }

// ── Exercise Library ──────────────────────────────────
const LIB_DATA = [
  {name:'Liegestütze',icon:'💪',muscle:'Brust, Trizeps, Schultern',diff:'easy',tags:['Brust','Push'],
   steps:['Hände etwas breiter als schulterbreit aufstellen','Körper von Kopf bis Ferse gerade halten','Brust kontrolliert bis fast zum Boden absenken','Explosiv nach oben drücken, Arme nicht ganz strecken'],
   errors:['Hüfte durchhängen lassen','Ellenbogen zu weit abspreizen','Keine volle Bewegungsamplitude']},
  {name:'Klimmzüge',icon:'🔝',muscle:'Rücken, Bizeps, Core',diff:'hard',tags:['Rücken','Pull'],
   steps:['Stange im Obergriff etwas breiter als schulterbreit greifen','Schulterblätter zusammenziehen bevor du hochziehst','Brust zur Stange ziehen, Kinn über die Stange','2 Sekunden oben halten, dann kontrolliert ablassen'],
   errors:['Mit Schwung hochspringen','Keine volle Streckung unten','Zu weiter Griff — Schultern gefährdet']},
  {name:'Diamond Push-Ups',icon:'💎',muscle:'Trizeps, innere Brust',diff:'med',tags:['Trizeps','Push'],
   steps:['Hände unter der Brust zu einem Dreieck formen','Ellenbogen nah am Körper halten','Brust zum Dreieck absenken','Explosiv nach oben drücken'],
   errors:['Hände zu weit auseinander','Ellenbogen abspreizen','Hüfte nicht gerade halten']},
  {name:'Pike Push-Ups',icon:'🔺',muscle:'Schultern, Trizeps',diff:'med',tags:['Schulter','Push'],
   steps:['Hüfte hoch zur Decke — V-Form mit dem Körper','Hände schulterbreit, Kopf zwischen die Arme','Kopf kontrolliert zum Boden absenken','Explosiv nach oben drücken'],
   errors:['Hüfte zu niedrig — wird zur Liegestütze','Nicht tief genug absenken','Zu schnelle Bewegung']},
  {name:'Dips',icon:'↕️',muscle:'Trizeps, untere Brust',diff:'med',tags:['Trizeps','Push'],
   steps:['Hände auf Stuhl oder Sofa hinter dem Körper','Füße gestreckt nach vorne','Ellenbogen nach hinten absenken — nicht abspreizen','Tief gehen bis Oberarme parallel zum Boden'],
   errors:['Ellenbogen abspreizen','Nicht tief genug gehen','Zu schnell oben ankommen']},
  {name:'Australische Klimmzüge',icon:'🔄',muscle:'Rücken, Bizeps',diff:'easy',tags:['Rücken','Pull'],
   steps:['Niedrige Stange — Körper schräg darunter','Untergriff für mehr Bizeps, Übergriff für Rücken','Brust zur Stange ziehen, Körper gerade wie ein Brett','Kontrolliert ablassen, Arme strecken'],
   errors:['Hüfte durchhängen lassen','Zu kurze Bewegung','Schultergürtel nicht aktivieren']},
  {name:'Burpees',icon:'🔥',muscle:'Ganzkörper, Herz-Kreislauf',diff:'hard',tags:['Fatburn','Athletik'],
   steps:['Aufrecht stehen','In die Hocke gehen, Hände auf den Boden','Füße nach hinten springen — Liegestütz-Position','Eine Liegestütze machen','Füße wieder zur Brust ziehen','Explosiv hochspringen und klatschen'],
   errors:['Hüfte beim Springen nach hinten hängen','Liegestütz weglassen','Zu langsames Tempo']},
  {name:'Mountain Climbers',icon:'🏔️',muscle:'Core, Schultern, Hüftbeuger',diff:'med',tags:['Core','Fatburn'],
   steps:['Liegestütz-Position einnehmen','Abwechselnd Knie zur Brust ziehen','Tempo steigern bis es sich wie Laufen anfühlt','Rumpf durchgehend angespannt halten'],
   errors:['Hüfte zu hoch','Zu langsam — kein Cardio-Effekt','Schultern über die Handgelenke']},
];

let libFilter = 'Alle';
function renderLibrary(filter) {
  libFilter = filter || libFilter;
  document.querySelectorAll('.lib-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.f === libFilter));
  const search = document.getElementById('lib-search-inp')?.value?.toLowerCase() || '';
  const container = document.getElementById('lib-cards');
  if (!container) return;
  const filtered = LIB_DATA.filter(e => {
    const matchFilter = libFilter === 'Alle' || e.tags.includes(libFilter);
    const matchSearch = !search || e.name.toLowerCase().includes(search) || e.muscle.toLowerCase().includes(search);
    return matchFilter && matchSearch;
  });
  container.innerHTML = filtered.map((e,i) => `
    <div class="lib-card" onclick="openExDetail(${LIB_DATA.indexOf(e)})">
      <div class="lib-card-top">
        <div class="lib-icon">${e.icon}</div>
        <div>
          <div class="lib-name">${e.name}</div>
          <div class="lib-muscle">${e.muscle}</div>
        </div>
      </div>
      <div class="lib-tags">
        <span class="pill ${e.diff==='easy'?'green':e.diff==='med'?'amber':'red'} diff-${e.diff}">${e.diff==='easy'?'Einsteiger':e.diff==='med'?'Mittel':'Fortgeschritten'}</span>
        ${e.tags.map(t=>`<span class="pill blue">${t}</span>`).join('')}
      </div>
    </div>`).join('');
}

function openExDetail(idx) {
  const e = LIB_DATA[idx];
  const d = document.getElementById('ex-detail');
  document.getElementById('ex-detail-name').textContent = e.name;
  document.getElementById('ex-detail-icon').textContent = e.icon;
  document.getElementById('ex-detail-muscle').innerHTML = `<span class="pill blue">${e.muscle}</span>`;
  document.getElementById('ex-detail-steps').innerHTML = e.steps.map((s,i) =>
    `<div class="ex-step"><div class="ex-step-num">${i+1}</div><div class="ex-step-text">${s}</div></div>`).join('');
  document.getElementById('ex-detail-errors').innerHTML = e.errors.map(s =>
    `<div class="ex-mistake"><span class="ex-mistake-icon">✕</span><div class="ex-mistake-text">${s}</div></div>`).join('');
  d.classList.add('open');
}
function closeExDetail() { document.getElementById('ex-detail').classList.remove('open'); }

// ── Progress ──────────────────────────────────────────
function renderProgress() {
  const total = totalSessions();
  document.getElementById('p-total').textContent = total;
  document.getElementById('p-sub').textContent = `${completedBlocks()} von 12 Blöcken · ${calcStreak()} Wochen Streak`;
  document.getElementById('p-sessions-stat').textContent = total;
  document.getElementById('p-blocks-stat').textContent = completedBlocks();
  document.getElementById('p-streak-stat').textContent = calcStreak();

  // Chart
  const counts = [];
  for (let w = 1; w <= 12; w++) counts.push([0,1,2].filter(d => S[dk(w,d)]).length);
  const max = Math.max(...counts, 1);
  document.getElementById('p-chart-bars').innerHTML = counts.map((c,i) =>
    `<div class="c-bar ${c>0?(i+1===CW?'cur':'has'):''}" style="height:${Math.max(3,Math.round((c/max)*76))}px"></div>`).join('');
  document.getElementById('p-chart-lbls').innerHTML = counts.map((_,i) => `<div class="c-lbl">B${i+1}</div>`).join('');

  // PRs
  const PRS = [
    {n:'Klimmzüge',sub:'Max Wdh',ico:'🔝',k:'pr_pu'},
    {n:'Liegestütze',sub:'Max Wdh',ico:'💪',k:'pr_lh'},
    {n:'Dips',sub:'Max Wdh',ico:'↕️',k:'pr_di'},
    {n:'Dead Hang',sub:'Sekunden',ico:'⏱️',k:'pr_dh'},
    {n:'Plank',sub:'Sekunden',ico:'🧱',k:'pr_pl'},
    {n:'Burpees',sub:'Max / 60 Sek',ico:'🔥',k:'pr_bu'},
  ];
  document.getElementById('p-pr-list').innerHTML = PRS.map(pr => `
    <div class="pr-row">
      <div class="pr-ico">${pr.ico}</div>
      <div class="pr-info">
        <div class="pr-name">${pr.n}</div>
        <div class="pr-best">${pr.sub}${S[pr.k]?` · <b style="color:var(--accent-b)">${S[pr.k]}</b>`:''}</div>
      </div>
      <input class="pr-inp" type="number" placeholder="–" value="${S[pr.k]||''}"
        onchange="S['${pr.k}']=this.value;save();renderProgress();toast('PR gespeichert ✓')">
    </div>`).join('');
}

// ── Body Data ─────────────────────────────────────────
function renderBody() {
  const entries = S.weights || [];
  const latest = entries[0];
  document.getElementById('b-weight-val').textContent = latest ? latest.kg : '—';

  const MEASURES = [
    {k:'waist',label:'Bauchumfang',unit:'cm'},
    {k:'chest',label:'Brustumfang',unit:'cm'},
    {k:'arm',label:'Oberarm',unit:'cm'},
  ];
  document.getElementById('b-measures').innerHTML = MEASURES.map(m => {
    const val = (S.measures || {})[m.k];
    return `<div class="measure-box">
      <div class="measure-val">${val||'—'}<span class="measure-unit"> ${m.unit}</span></div>
      <div class="measure-lbl">${m.label}</div>
    </div>`;
  }).join('');

  // Weight list
  document.getElementById('b-weight-list').innerHTML = entries.length ? entries.map((e,i) => {
    const next = entries[i+1];
    const diff = next != null ? e.kg - next.kg : null;
    const trend = diff!=null ? (diff>0
      ?`<span class="body-trend" style="color:var(--red)">▲ +${diff.toFixed(1)}</span>`
      :`<span class="body-trend" style="color:var(--green)">▼ ${Math.abs(diff).toFixed(1)}</span>`) : '';
    return `<div class="body-entry">
      <div style="display:flex;align-items:baseline;gap:4px">
        <span class="body-kg">${e.kg}</span><span style="font-size:12px;color:var(--muted)">kg</span>${trend}
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        <span class="body-date">${e.date}</span>
        <button class="body-del" onclick="deleteWeight(${i})">×</button>
      </div>
    </div>`;
  }).join('') : '<div style="color:var(--muted);font-size:13px;text-align:center;padding:24px 0">Noch keine Einträge</div>';
}

function addWeight() {
  const v = parseFloat(document.getElementById('b-wi').value);
  if (!v||v<30||v>300) { toast('Ungültiger Wert'); return; }
  const entries = S.weights || [];
  const prev = entries[0]?.kg;
  entries.unshift({kg:v, date:new Date().toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'})});
  S.weights = entries.slice(0,60);
  addXP(20); save();
  document.getElementById('b-wi').value = '';
  const diff = prev!=null ? v-prev : null;
  const ds = diff!=null ? (diff>0 ? ` ▲ +${diff.toFixed(1)}` : `  ▼ ${Math.abs(diff).toFixed(1)}`) : '';
  toast(`${v} kg eingetragen${ds} +20 XP`);
  renderBody();
}

function saveMeasure(key, val) {
  if (!S.measures) S.measures = {};
  S.measures[key] = val;
  save(); toast('Körpermaß gespeichert ✓');
  renderBody();
}

function deleteWeight(i) {
  S.weights = (S.weights||[]).filter((_,j) => j!==i);
  save(); renderBody();
}

// ── Achievements ──────────────────────────────────────
function checkAchievements() {
  let newUnlock = false;
  ACHIEVEMENTS.forEach(a => {
    if (!S[`ach_${a.id}`] && a.check()) {
      S[`ach_${a.id}`] = true;
      addXP(a.xp);
      setTimeout(() => toast(`🏆 ${a.name} freigeschaltet! +${a.xp} XP`), 800);
      newUnlock = true;
    }
  });
  if (newUnlock) save();
}

function renderAchieve() {
  const xp = getXP();
  const level = getLevel();
  const xpForNext = level * 200;
  const xpInLevel = xp % 200;
  document.getElementById('a-level').textContent = level;
  document.getElementById('a-level-name').textContent = getLevelName();
  document.getElementById('a-xp').textContent = `${xpInLevel} / 200 XP`;
  document.getElementById('a-xp-bar').style.width = Math.round((xpInLevel/200)*100) + '%';
  document.getElementById('a-total-xp').textContent = xp + ' Gesamt-XP';

  document.getElementById('a-grid').innerHTML = ACHIEVEMENTS.map(a => {
    const unlocked = !!S[`ach_${a.id}`];
    return `<div class="achieve-card ${unlocked?'unlocked':''}">
      <div class="achieve-icon">${a.icon}</div>
      <div class="achieve-name">${a.name}</div>
      <div class="achieve-desc">${a.desc}</div>
      ${unlocked?`<div style="margin-top:6px;font-size:10px;color:var(--amber)">+${a.xp} XP</div>`:''}
    </div>`;
  }).join('');
}

// ── Settings ──────────────────────────────────────────
function renderSettings() {
  document.getElementById('s-goal').textContent = {
    'muscle':'Muskelaufbau 💪',
    'fat':'Fettabbau 🔥',
    'football':'Athletischer Fußballer ⚽',
    'fitness':'Allgemeine Fitness 🏃'
  }[S.goal] || '—';
  document.getElementById('s-version').textContent = 'v1.0';
}

function exportData() {
  const data = JSON.stringify(S, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'athletic-physique-backup.json'; a.click();
  toast('Daten exportiert ✓');
}

function resetApp() {
  if (confirm('Alle Daten löschen? Das kann nicht rückgängig gemacht werden.')) {
    localStorage.removeItem(KEY);
    location.reload();
  }
}

// ── Init ──────────────────────────────────────────────
function init() {
  load();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  }

  // Nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => nav(btn.dataset.page));
  });

  // Block nav
  document.getElementById('t-prev').addEventListener('click', () => changeBlock(-1));
  document.getElementById('t-next').addEventListener('click', () => changeBlock(1));

  // Library
  document.getElementById('lib-search-inp').addEventListener('input', () => renderLibrary());
  document.querySelectorAll('.lib-filter-btn').forEach(b => {
    b.addEventListener('click', () => renderLibrary(b.dataset.f));
  });

  // Body inputs
  document.getElementById('b-wi-btn').addEventListener('click', addWeight);
  document.getElementById('b-wi').addEventListener('keydown', e => { if(e.key==='Enter') addWeight(); });

  // Measure inputs
  ['waist','chest','arm'].forEach(k => {
    document.getElementById(`m-${k}-btn`).addEventListener('click', () => {
      const v = parseFloat(document.getElementById(`m-${k}`).value);
      if (v && v > 0) saveMeasure(k, v);
    });
  });

  initOnboarding();
  renderLibrary();

  if (!S.onboarded) {
    document.getElementById('onboarding').style.display = 'flex';
  } else {
    document.getElementById('onboarding').style.display = 'none';
    nav('dash');
  }

  // Date display
  document.getElementById('wi-date').textContent = new Date().toLocaleDateString('de-DE',{weekday:'long',day:'2-digit',month:'long'});
}

document.addEventListener('DOMContentLoaded', init);
