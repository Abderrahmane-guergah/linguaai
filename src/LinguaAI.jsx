import { useState, useEffect, useRef, useCallback } from "react";

// ── LANGUAGES ──────────────────────────────────────────────────
const LANGUAGES = [
  { code:"es", name:"Spanish",    flag:"🇪🇸", region:"Europe / Latin America" },
  { code:"fr", name:"French",     flag:"🇫🇷", region:"Europe / Africa" },
  { code:"de", name:"German",     flag:"🇩🇪", region:"Central Europe" },
  { code:"ja", name:"Japanese",   flag:"🇯🇵", region:"East Asia" },
  { code:"zh", name:"Mandarin",   flag:"🇨🇳", region:"East Asia" },
  { code:"ar", name:"Arabic",     flag:"🇸🇦", region:"Middle East / Africa" },
  { code:"it", name:"Italian",    flag:"🇮🇹", region:"Southern Europe" },
  { code:"pt", name:"Portuguese", flag:"🇧🇷", region:"South America" },
  { code:"ko", name:"Korean",     flag:"🇰🇷", region:"East Asia" },
  { code:"ru", name:"Russian",    flag:"🇷🇺", region:"Eastern Europe" },
  { code:"hi", name:"Hindi",      flag:"🇮🇳", region:"South Asia" },
  { code:"nl", name:"Dutch",      flag:"🇳🇱", region:"Western Europe" },
  { code:"tr", name:"Turkish",    flag:"🇹🇷", region:"Europe / Asia" },
  { code:"pl", name:"Polish",     flag:"🇵🇱", region:"Central Europe" },
  { code:"el", name:"Greek",      flag:"🇬🇷", region:"Southern Europe" },
  { code:"sv", name:"Swedish",    flag:"🇸🇪", region:"Northern Europe" },
];

const GOALS = [
  { id:"travel",   icon:"✈️",  label:"Travel & Tourism",    desc:"Navigation, hospitality, cultural immersion" },
  { id:"career",   icon:"💼",  label:"Professional",         desc:"Business correspondence, meetings, negotiations" },
  { id:"romance",  icon:"❤️",  label:"Personal Connections", desc:"Family, friends, romantic relationships" },
  { id:"culture",  icon:"🎬",  label:"Arts & Culture",       desc:"Literature, cinema, music, heritage" },
  { id:"academic", icon:"📚",  label:"Academic Research",    desc:"Scholarly texts, conferences, publications" },
  { id:"moving",   icon:"🏡",  label:"Relocation",           desc:"Civic life, administration, integration" },
];

const LEVELS = {
  0:{ name:"Absolute Beginner",  color:"#94a3b8", emoji:"◦", cefr:"Pre-A1", desc:"We begin from first principles — phonology, script, and foundational vocabulary." },
  1:{ name:"Beginner",           color:"#4ade80", emoji:"◇", cefr:"A1",     desc:"Core structures and high-frequency lexis form the basis of our work." },
  2:{ name:"Elementary",         color:"#38bdf8", emoji:"○", cefr:"A2",     desc:"Expanding communicative range with increasing grammatical precision." },
  3:{ name:"Intermediate",       color:"#a78bfa", emoji:"◈", cefr:"B1",     desc:"Consolidating fluency in familiar domains; tackling complex input." },
  4:{ name:"Upper Intermediate", color:"#fb923c", emoji:"◉", cefr:"B2",     desc:"Nuanced expression and sophisticated register control." },
  5:{ name:"Advanced",           color:"#f472b6", emoji:"●", cefr:"C1",     desc:"Precision, idiomatic command, and discourse-level competence." },
  6:{ name:"Proficient",         color:"#fbbf24", emoji:"★", cefr:"C2",     desc:"Near-native mastery — stylistic refinement and implicit meaning." },
};

// ── THEMES ─────────────────────────────────────────────────────
const THEMES = {
  slate: {
    id:"slate", label:"Slate", preview:["#08090e","#e2e8f0","#6366f1"],
    bg:"#08090e", bgCard:"rgba(15,17,26,.8)", bgCardHover:"rgba(22,25,38,.95)",
    bgInput:"rgba(148,163,184,.05)", bgNav:"rgba(8,9,14,.9)", bgMsg:"rgba(15,17,26,.8)",
    bgUserMsg:"rgba(226,232,240,.06)", border:"rgba(148,163,184,.1)", borderHover:"rgba(148,163,184,.25)",
    borderInput:"rgba(148,163,184,.13)", borderFocus:"rgba(148,163,184,.45)",
    borderUserMsg:"rgba(226,232,240,.14)", borderAssistMsg:"rgba(148,163,184,.08)",
    text:"#cbd5e1", textHeading:"#e2e8f0", textMuted:"#475569", textDim:"#334155", textVeryDim:"#1e293b",
    accent:"#e2e8f0", accentText:"#08090e", accentMuted:"rgba(226,232,240,.08)", accentBorder:"rgba(226,232,240,.22)",
    logo:"#e2e8f0", logoBox:"#e2e8f0", logoBoxText:"#08090e",
    gridLine:"rgba(148,163,184,.028)", gradientTop:"rgba(99,102,241,.08)",
    btnPrimary:"#e2e8f0", btnPrimaryText:"#08090e", btnGhost:"rgba(148,163,184,.06)", btnGhostText:"#64748b",
    scrollThumb:"rgba(148,163,184,.2)", dotReady:"#4ade80", dotLoading:"#f59e0b",
    errorBg:"rgba(248,113,113,.07)", errorBorder:"rgba(248,113,113,.18)", errorText:"#f87171",
    successBorder:"rgba(74,222,128,.28)", successBg:"rgba(74,222,128,.08)", successText:"#4ade80",
    wrongBorder:"rgba(248,113,113,.22)", wrongBg:"rgba(248,113,113,.07)", wrongText:"#f87171",
    fonts:`'DM Serif Display',serif`, fontBody:`'Instrument Sans',sans-serif`, fontMono:`'DM Mono',monospace`,
  },
  parchment: {
    id:"parchment", label:"Parchment", preview:["#080810","#c4a882","#8b6a3a"],
    bg:"#080810", bgCard:"rgba(255,255,255,.038)", bgCardHover:"rgba(255,255,255,.058)",
    bgInput:"rgba(255,255,255,.05)", bgNav:"rgba(8,8,16,.92)", bgMsg:"rgba(255,255,255,.05)",
    bgUserMsg:"rgba(196,168,130,.1)", border:"rgba(255,255,255,.09)", borderHover:"rgba(196,168,130,.38)",
    borderInput:"rgba(255,255,255,.12)", borderFocus:"rgba(196,168,130,.52)",
    borderUserMsg:"rgba(196,168,130,.28)", borderAssistMsg:"rgba(255,255,255,.07)",
    text:"#e8dcc8", textHeading:"#f0ead6", textMuted:"#7a7060", textDim:"#5a4a30", textVeryDim:"#3a3020",
    accent:"#c4a882", accentText:"#080810", accentMuted:"rgba(196,168,130,.14)", accentBorder:"rgba(196,168,130,.52)",
    logo:"#e8dcc8", logoBox:"linear-gradient(135deg,#c4a882,#8b6a3a)", logoBoxText:"#080810",
    gridLine:"rgba(196,168,130,.02)", gradientTop:"rgba(120,80,30,.11)",
    btnPrimary:"linear-gradient(135deg,#c4a882,#8b6a3a)", btnPrimaryText:"#080810",
    btnGhost:"rgba(255,255,255,.05)", btnGhostText:"#6a5a40",
    scrollThumb:"rgba(196,168,130,.25)", dotReady:"#27ae60", dotLoading:"#f39c12",
    errorBg:"rgba(231,76,60,.1)", errorBorder:"rgba(231,76,60,.24)", errorText:"#e74c3c",
    successBorder:"rgba(39,174,96,.3)", successBg:"rgba(39,174,96,.09)", successText:"#27ae60",
    wrongBorder:"rgba(231,76,60,.26)", wrongBg:"rgba(231,76,60,.08)", wrongText:"#e74c3c",
    fonts:`'Playfair Display',serif`, fontBody:`'Lato',sans-serif`, fontMono:`'Lato',monospace`,
  },
  forest: {
    id:"forest", label:"Forest", preview:["#0a100d","#86efac","#16a34a"],
    bg:"#0a100d", bgCard:"rgba(22,40,28,.8)", bgCardHover:"rgba(28,50,35,.95)",
    bgInput:"rgba(134,239,172,.04)", bgNav:"rgba(10,16,13,.92)", bgMsg:"rgba(22,40,28,.8)",
    bgUserMsg:"rgba(134,239,172,.08)", border:"rgba(134,239,172,.09)", borderHover:"rgba(134,239,172,.25)",
    borderInput:"rgba(134,239,172,.11)", borderFocus:"rgba(134,239,172,.38)",
    borderUserMsg:"rgba(134,239,172,.2)", borderAssistMsg:"rgba(134,239,172,.07)",
    text:"#bbf7d0", textHeading:"#dcfce7", textMuted:"#4d7c5f", textDim:"#2d5a3f", textVeryDim:"#1a3828",
    accent:"#86efac", accentText:"#0a100d", accentMuted:"rgba(134,239,172,.09)", accentBorder:"rgba(134,239,172,.28)",
    logo:"#dcfce7", logoBox:"#86efac", logoBoxText:"#0a100d",
    gridLine:"rgba(134,239,172,.022)", gradientTop:"rgba(22,163,74,.08)",
    btnPrimary:"#86efac", btnPrimaryText:"#0a100d", btnGhost:"rgba(134,239,172,.06)", btnGhostText:"#4d7c5f",
    scrollThumb:"rgba(134,239,172,.2)", dotReady:"#86efac", dotLoading:"#fbbf24",
    errorBg:"rgba(248,113,113,.07)", errorBorder:"rgba(248,113,113,.2)", errorText:"#fca5a5",
    successBorder:"rgba(134,239,172,.32)", successBg:"rgba(134,239,172,.09)", successText:"#86efac",
    wrongBorder:"rgba(248,113,113,.22)", wrongBg:"rgba(248,113,113,.07)", wrongText:"#fca5a5",
    fonts:`'DM Serif Display',serif`, fontBody:`'Instrument Sans',sans-serif`, fontMono:`'DM Mono',monospace`,
  },
  midnight: {
    id:"midnight", label:"Midnight", preview:["#05050f","#818cf8","#4f46e5"],
    bg:"#05050f", bgCard:"rgba(10,10,30,.8)", bgCardHover:"rgba(14,14,40,.95)",
    bgInput:"rgba(129,140,248,.04)", bgNav:"rgba(5,5,15,.92)", bgMsg:"rgba(10,10,30,.8)",
    bgUserMsg:"rgba(129,140,248,.09)", border:"rgba(129,140,248,.09)", borderHover:"rgba(129,140,248,.25)",
    borderInput:"rgba(129,140,248,.11)", borderFocus:"rgba(129,140,248,.42)",
    borderUserMsg:"rgba(129,140,248,.22)", borderAssistMsg:"rgba(129,140,248,.07)",
    text:"#c7d2fe", textHeading:"#e0e7ff", textMuted:"#4c5594", textDim:"#2d3478", textVeryDim:"#1a1f55",
    accent:"#818cf8", accentText:"#05050f", accentMuted:"rgba(129,140,248,.09)", accentBorder:"rgba(129,140,248,.28)",
    logo:"#e0e7ff", logoBox:"#818cf8", logoBoxText:"#05050f",
    gridLine:"rgba(129,140,248,.022)", gradientTop:"rgba(79,70,229,.11)",
    btnPrimary:"#818cf8", btnPrimaryText:"#05050f", btnGhost:"rgba(129,140,248,.06)", btnGhostText:"#4c5594",
    scrollThumb:"rgba(129,140,248,.2)", dotReady:"#818cf8", dotLoading:"#fbbf24",
    errorBg:"rgba(248,113,113,.07)", errorBorder:"rgba(248,113,113,.2)", errorText:"#fca5a5",
    successBorder:"rgba(129,140,248,.32)", successBg:"rgba(129,140,248,.09)", successText:"#818cf8",
    wrongBorder:"rgba(248,113,113,.22)", wrongBg:"rgba(248,113,113,.07)", wrongText:"#fca5a5",
    fonts:`'DM Serif Display',serif`, fontBody:`'Instrument Sans',sans-serif`, fontMono:`'DM Mono',monospace`,
  },
  rose: {
    id:"rose", label:"Rose", preview:["#0f0608","#fda4af","#e11d48"],
    bg:"#0f0608", bgCard:"rgba(30,10,15,.8)", bgCardHover:"rgba(38,14,20,.95)",
    bgInput:"rgba(253,164,175,.04)", bgNav:"rgba(15,6,8,.92)", bgMsg:"rgba(30,10,15,.8)",
    bgUserMsg:"rgba(253,164,175,.08)", border:"rgba(253,164,175,.09)", borderHover:"rgba(253,164,175,.25)",
    borderInput:"rgba(253,164,175,.11)", borderFocus:"rgba(253,164,175,.38)",
    borderUserMsg:"rgba(253,164,175,.2)", borderAssistMsg:"rgba(253,164,175,.07)",
    text:"#fce7f3", textHeading:"#fdf2f8", textMuted:"#7c3f55", textDim:"#4c2030", textVeryDim:"#2d1020",
    accent:"#fda4af", accentText:"#0f0608", accentMuted:"rgba(253,164,175,.09)", accentBorder:"rgba(253,164,175,.28)",
    logo:"#fdf2f8", logoBox:"#fda4af", logoBoxText:"#0f0608",
    gridLine:"rgba(253,164,175,.022)", gradientTop:"rgba(225,29,72,.09)",
    btnPrimary:"#fda4af", btnPrimaryText:"#0f0608", btnGhost:"rgba(253,164,175,.06)", btnGhostText:"#7c3f55",
    scrollThumb:"rgba(253,164,175,.2)", dotReady:"#fda4af", dotLoading:"#fbbf24",
    errorBg:"rgba(248,113,113,.07)", errorBorder:"rgba(248,113,113,.2)", errorText:"#fca5a5",
    successBorder:"rgba(253,164,175,.32)", successBg:"rgba(253,164,175,.09)", successText:"#fda4af",
    wrongBorder:"rgba(248,113,113,.22)", wrongBg:"rgba(248,113,113,.07)", wrongText:"#fca5a5",
    fonts:`'DM Serif Display',serif`, fontBody:`'Instrument Sans',sans-serif`, fontMono:`'DM Mono',monospace`,
  },
};

// ── STORAGE ────────────────────────────────────────────────────
const sGet  = async (k)   => { try { const r=await window.storage.get(k); return r?JSON.parse(r.value):null; } catch { return null; } };
const sSet  = async (k,v) => { try { await window.storage.set(k,JSON.stringify(v)); } catch {} };
const sList = async (p)   => { try { const r=await window.storage.list(p); return r?.keys||[]; } catch { return []; } };
const uid   = () => Math.random().toString(36).slice(2,10);

// ── CLAUDE API — correct artifact pattern ──────────────────────
async function callClaude(messages, system) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system,
        messages,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Claude API error:", res.status, err);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
    const data = await res.json();
    return data.content?.[0]?.text || "No response received. Please try again.";
  } catch (e) {
    console.error("callClaude error:", e);
    return "Connection error — please check your network and try again.";
  }
}

// ── QUESTION BANK ──────────────────────────────────────────────
const QUESTIONS = {
  es:[
    {q:"What does 'Buenos días' mean?",o:["Good night","Good morning","Goodbye","Thank you"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Water' in Spanish?",o:["Leche","Jugo","Agua","Vino"],a:2,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'I want water' in Spanish?",o:["Quiero agua","Me llamo agua","Tengo agua","Soy agua"],a:0,d:2,topic:"Grammar",cefr:"A2"},
    {q:"Plural of 'el libro'?",o:["los libros","las libras","el libros","los libro"],a:0,d:2,topic:"Grammar",cefr:"A2"},
    {q:"'She is pretty' in Spanish?",o:["Él es bonita","Ella es bonito","Ella es bonita","El es bonito"],a:2,d:2,topic:"Grammar",cefr:"A2"},
    {q:"Translate: 'She speaks Spanish very well'",o:["Ella habla muy bien español","Ella escucha español","Ella come español","Ella corre español"],a:0,d:3,topic:"Translation",cefr:"B1"},
    {q:"Tense of 'Estaba comiendo'?",o:["Present","Future","Past continuous","Subjunctive"],a:2,d:3,topic:"Grammar",cefr:"B1"},
    {q:"Correct subjunctive usage?",o:["Quiero que ella viene","Espero que ella venga","Pienso que ella venga","Sé que ella venga"],a:1,d:4,topic:"Subjunctive",cefr:"B2"},
    {q:"'Se me olvidó' best means:",o:["I forgot it","It forgot me","I forgot myself","It slipped my mind"],a:3,d:4,topic:"Idioms",cefr:"B2"},
    {q:"Which is correct? 'I would have gone if...'",o:["Habría ido si tuviera","Habría ido si tuviese","Hubiera ido si hubiera tenido","Both B and C are correct"],a:3,d:5,topic:"Conditional",cefr:"C1"},
  ],
  fr:[
    {q:"'Bonjour' means?",o:["Goodbye","Thank you","Hello/Good day","Please"],a:2,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Chat' in English?",o:["Dog","Cat","Bird","Fish"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'I am hungry' in French?",o:["J'ai faim","Je suis faim","J'ai froid","Je mange"],a:0,d:2,topic:"Grammar",cefr:"A2"},
    {q:"'She is beautiful' in French?",o:["Il est belle","Elle est beau","Elle est belle","Il est beau"],a:2,d:2,topic:"Grammar",cefr:"A2"},
    {q:"'Maison' in English?",o:["Mouse","House","Table","Street"],a:1,d:2,topic:"Vocabulary",cefr:"A2"},
    {q:"'We went to Paris yesterday'?",o:["Nous allons à Paris hier","Nous sommes allés à Paris hier","Nous irons à Paris hier","Nous allions Paris"],a:1,d:3,topic:"Past Tense",cefr:"B1"},
    {q:"Irregular verb in passé composé?",o:["Manger","Aller","Parler","Finir"],a:1,d:3,topic:"Grammar",cefr:"B1"},
    {q:"'Il faut que tu viennes' means?",o:["You should come","You must come","You want to come","You came"],a:1,d:4,topic:"Subjunctive",cefr:"B2"},
    {q:"Correct subjunctive of 'être'?",o:["Je suis","Je serai","Je sois","Je serais"],a:2,d:4,topic:"Subjunctive",cefr:"B2"},
    {q:"'Nonobstant' is used to mean?",o:["Therefore","Nevertheless","Although","Meanwhile"],a:1,d:5,topic:"Register",cefr:"C1"},
  ],
  de:[
    {q:"'Guten Morgen' means?",o:["Good evening","Good morning","Good night","Good luck"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Thank you' in German?",o:["Bitte","Danke","Ja","Nein"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"Article for 'Frau'?",o:["der","das","die","ein"],a:2,d:2,topic:"Grammar",cefr:"A2"},
    {q:"'I am learning German'?",o:["Ich lerne Deutsch","Ich spreche Deutsch","Ich habe Deutsch","Ich bin Deutsch"],a:0,d:2,topic:"Grammar",cefr:"A2"},
    {q:"Case after 'mit'?",o:["Nominativ","Akkusativ","Dativ","Genitiv"],a:2,d:3,topic:"Cases",cefr:"B1"},
    {q:"Perfekt of 'gehen'?",o:["Ich habe gegangen","Ich bin gegangen","Ich habe gegangt","Ich war gegangen"],a:1,d:3,topic:"Grammar",cefr:"B1"},
    {q:"Grammatically correct?",o:["Ich kaufe ein neues Auto","Ich kaufe ein neuer Auto","Ich kaufe einen neues Auto","Ich kaufe einem neuen Auto"],a:0,d:4,topic:"Adjectives",cefr:"B2"},
    {q:"'Es sei denn' means?",o:["Therefore","Unless","However","Although"],a:1,d:4,topic:"Conjunctions",cefr:"B2"},
    {q:"Konjunktiv II of 'haben' (ich)?",o:["hätte","hatte","habe","gehabt"],a:0,d:5,topic:"Konjunktiv",cefr:"C1"},
    {q:"'Gleichwohl' means?",o:["Similarly","Nevertheless","Likewise","Therefore"],a:1,d:5,topic:"Register",cefr:"C1"},
  ],
  ja:[
    {q:"'こんにちは' means?",o:["Goodbye","Thank you","Hello","Sorry"],a:2,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'ありがとう' means?",o:["Please","Sorry","Excuse me","Thank you"],a:3,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"Subject marker particle?",o:["を wo","に ni","が ga","で de"],a:2,d:2,topic:"Particles",cefr:"A2"},
    {q:"'I eat sushi'?",o:["寿司を食べます","寿司が飲みます","寿司に行きます","寿司で見ます"],a:0,d:2,topic:"Grammar",cefr:"A2"},
    {q:"Polite negative of 'tabemasu'?",o:["Tabemasen","Tabenai","Tabemasendeshita","Tabejanai"],a:0,d:3,topic:"Negation",cefr:"B1"},
    {q:"て-form indicates?",o:["Past tense","Negative","Connecting actions","Future"],a:2,d:3,topic:"Grammar",cefr:"B1"},
    {q:"Honorific for someone else's action?",o:["します","なさいます","いたします","やります"],a:1,d:4,topic:"Keigo",cefr:"B2"},
    {q:"'If it rains I won't go'?",o:["雨が降れば行きません","雨が降ると行きません","雨が降ったら行きません","All are acceptable"],a:3,d:4,topic:"Conditionals",cefr:"B2"},
    {q:"Humble form of 'iru' (to be)?",o:["おります","いらっしゃいます","おられます","ございます"],a:0,d:5,topic:"Keigo",cefr:"C1"},
    {q:"'にもかかわらず' means?",o:["Because of","In spite of","In order to","As a result of"],a:1,d:5,topic:"Grammar",cefr:"C1"},
  ],
  zh:[
    {q:"'你好' means?",o:["Thank you","Hello","Goodbye","Sorry"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Thank you' in Mandarin?",o:["对不起","谢谢","你好","再见"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'我爱你' means?",o:["I miss you","I love you","I need you","I see you"],a:1,d:2,topic:"Vocabulary",cefr:"A2"},
    {q:"'I want to eat'?",o:["我想吃","我吃想","想我吃","吃我想"],a:0,d:2,topic:"Grammar",cefr:"A2"},
    {q:"Measure word for books?",o:["条 tiáo","本 běn","张 zhāng","个 gè"],a:1,d:3,topic:"Measure Words",cefr:"B1"},
    {q:"Correct past-tense negation?",o:["我不去了","我没去","我不去过","我没有不去"],a:1,d:3,topic:"Grammar",cefr:"B1"},
    {q:"Particle '了' indicates?",o:["Future action","Completed/change of state","Ongoing action","Possibility"],a:1,d:4,topic:"Particles",cefr:"B2"},
    {q:"'把' sentences emphasise?",o:["Questions","Object before verb","Possibility","Appearance"],a:1,d:4,topic:"Grammar",cefr:"B2"},
    {q:"'尽管...还是...' expresses?",o:["Cause and effect","Concession","Condition","Purpose"],a:1,d:5,topic:"Grammar",cefr:"C1"},
    {q:"'不得不' means?",o:["Must not","Had better not","Have no choice but to","Would rather not"],a:2,d:5,topic:"Grammar",cefr:"C1"},
  ],
  ar:[
    {q:"'مرحبا' means?",o:["Goodbye","Hello","Thank you","Please"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Yes' in Arabic?",o:["لا","نعم","ربما","شكرا"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Thank you' in Arabic?",o:["من فضلك","شكرا","مع السلامة","نعم"],a:1,d:2,topic:"Vocabulary",cefr:"A2"},
    {q:"'كتاب' means?",o:["School","Pen","Book","Desk"],a:2,d:2,topic:"Vocabulary",cefr:"A2"},
    {q:"Root pattern of 'كاتب' (writer)?",o:["ك-ت-ب","ك-ب-ت","ت-ك-ب","ب-ك-ت"],a:0,d:3,topic:"Morphology",cefr:"B1"},
    {q:"Dual suffix '-ان' means?",o:["Plural","Feminine","Exactly two","Definite"],a:2,d:3,topic:"Grammar",cefr:"B1"},
    {q:"Imperative verb form?",o:["فَعَلَ","يَفْعَلُ","اِفْعَلْ","مَفْعُول"],a:2,d:4,topic:"Verbs",cefr:"B2"},
    {q:"Broken plural of 'كتاب'?",o:["كتابات","أكتب","كُتُب","كتابون"],a:2,d:4,topic:"Grammar",cefr:"B2"},
    {q:"'إذا' vs 'لو' — the difference?",o:["Same meaning","إذا=real condition, لو=hypothetical","لو=real condition, إذا=hypothetical","Both hypothetical only"],a:1,d:5,topic:"Conditionals",cefr:"C1"},
    {q:"'المصدر الصريح' refers to?",o:["Verbal noun","Active participle","Passive verb","Broken plural"],a:0,d:5,topic:"Morphology",cefr:"C1"},
  ],
  it:[
    {q:"'Ciao' means?",o:["Please","Hello/Goodbye","Thank you","Sorry"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Casa' in English?",o:["Street","House","Car","Food"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'I love pizza' in Italian?",o:["Io mangio pizza","Io amo la pizza","Io ho pizza","Io sono pizza"],a:1,d:2,topic:"Grammar",cefr:"A2"},
    {q:"Plural of 'ragazzo'?",o:["ragazzi","ragazze","ragazzos","ragazzia"],a:0,d:2,topic:"Grammar",cefr:"A2"},
    {q:"Passato prossimo of 'andare'?",o:["Ho andato","Sono andato","Ero andato","Avevo andato"],a:1,d:3,topic:"Past Tense",cefr:"B1"},
    {q:"Verb taking 'essere' in passato?",o:["Mangiare","Parlare","Venire","Scrivere"],a:2,d:3,topic:"Grammar",cefr:"B1"},
    {q:"'Magari' means?",o:["Obviously","Maybe/I wish","Never","Always"],a:1,d:4,topic:"Vocabulary",cefr:"B2"},
    {q:"'If I had known, I would have come'?",o:["Se sapessi vengo","Se sapevo venivo","Se avessi saputo sarei venuto","Se so vengo"],a:2,d:4,topic:"Conditional",cefr:"B2"},
    {q:"'Congiuntivo trapassato' of 'essere' (io)?",o:["fossi stato","sia stato","ero stato","sarò stato"],a:0,d:5,topic:"Subjunctive",cefr:"C1"},
    {q:"'Senonché' means?",o:["Therefore","However/except that","Meanwhile","Furthermore"],a:1,d:5,topic:"Register",cefr:"C1"},
  ],
  pt:[
    {q:"'Olá' means?",o:["Goodbye","Hello","Please","Sorry"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Thank you' (masc.) in Portuguese?",o:["Obrigada","Obrigado","Desculpe","Por favor"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'I speak Portuguese'?",o:["Eu como português","Eu falo português","Eu tenho português","Eu sou português"],a:1,d:2,topic:"Grammar",cefr:"A2"},
    {q:"Ser vs estar?",o:["Ser=permanent estar=temporary","Ser=formal estar=informal","Completely different","Only ser in Brazil"],a:0,d:2,topic:"Grammar",cefr:"A2"},
    {q:"Future of 'falar' (I)?",o:["Falei","Falo","Falarei","Falava"],a:2,d:3,topic:"Future Tense",cefr:"B1"},
    {q:"'I went' (ir) past?",o:["Eu ia","Eu fui","Eu vá","Eu irei"],a:1,d:3,topic:"Past Tense",cefr:"B1"},
    {q:"Personal infinitive used for?",o:["Different-subject clauses","Formal writing","Replacing subjunctive","Past actions"],a:0,d:4,topic:"Grammar",cefr:"B2"},
    {q:"'Embora' followed by?",o:["Indicative","Infinitive","Subjunctive","Conditional"],a:2,d:4,topic:"Subjunctive",cefr:"B2"},
    {q:"'Futuro do pretérito' signals?",o:["Past habit","Conditional/hypothetical","Future certainty","Command"],a:1,d:5,topic:"Grammar",cefr:"C1"},
    {q:"'Outrossim' means?",o:["Otherwise","Furthermore","However","Meanwhile"],a:1,d:5,topic:"Register",cefr:"C1"},
  ],
  ko:[
    {q:"'안녕하세요' means?",o:["Goodbye","Thank you","Hello","Sorry"],a:2,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'물' in English?",o:["Fire","Water","Wind","Earth"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"Particle '은/는' marks?",o:["Object","Topic","Location","Direction"],a:1,d:2,topic:"Particles",cefr:"A2"},
    {q:"'I eat rice' in Korean?",o:["나는 밥을 먹어요","나는 밥이 먹어요","나는 밥에 먹어요","나는 밥으로 먹어요"],a:0,d:2,topic:"Grammar",cefr:"A2"},
    {q:"Polite present tense ending?",o:["-다","-아/어요","-았/었다","-겠다"],a:1,d:3,topic:"Grammar",cefr:"B1"},
    {q:"'-고 싶다' expresses?",o:["Obligation","Desire","Ability","Permission"],a:1,d:3,topic:"Grammar",cefr:"B1"},
    {q:"Honorific subject suffix?",o:["-아/어요","-시-","-겠-","-았/었-"],a:1,d:4,topic:"Honorifics",cefr:"B2"},
    {q:"'Although hard, I study'?",o:["어려워서 공부해요","어려우면 공부해요","어렵지만 공부해요","어렵고 공부해요"],a:2,d:4,topic:"Conjunctions",cefr:"B2"},
    {q:"'-ㄹ/을수록' expresses?",o:["Contrast","The more...the more","Condition","Concession"],a:1,d:5,topic:"Grammar",cefr:"C1"},
    {q:"'간접화법' past tense ending?",o:["-다고 했어요","-라고 했어요","-냐고 했어요","-자고 했어요"],a:0,d:5,topic:"Reported Speech",cefr:"C1"},
  ],
  ru:[
    {q:"'Привет' means?",o:["Goodbye","Hi/Hello","Thank you","Please"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'вода' in English?",o:["Wine","Vodka","Water","Milk"],a:2,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Меня зовут' means?",o:["I want","My name is","I am from","I like"],a:1,d:2,topic:"Vocabulary",cefr:"A2"},
    {q:"Case after 'в' (location)?",o:["Nominative","Accusative","Prepositional","Genitive"],a:2,d:2,topic:"Cases",cefr:"A2"},
    {q:"Perfective vs imperfective?",o:["Past vs present","Completed vs ongoing","Formal vs informal","Singular vs plural"],a:1,d:3,topic:"Aspect",cefr:"B1"},
    {q:"'I have a book' in Russian?",o:["Я имею книгу","У меня есть книга","Я есть книга","Моя книга есть"],a:1,d:3,topic:"Grammar",cefr:"B1"},
    {q:"'хотя' means?",o:["Because","Therefore","Although","Unless"],a:2,d:4,topic:"Conjunctions",cefr:"B2"},
    {q:"Genitive plural of 'книга'?",o:["книги","книгов","книг","книгам"],a:2,d:4,topic:"Declension",cefr:"B2"},
    {q:"Short-form adjective is used for?",o:["Attributive position","Predicative position","Plural only","Animate nouns"],a:1,d:5,topic:"Grammar",cefr:"C1"},
    {q:"'Несмотря на то что' means?",o:["In order that","Despite the fact that","Provided that","As soon as"],a:1,d:5,topic:"Grammar",cefr:"C1"},
  ],
  hi:[
    {q:"'नमस्ते' means?",o:["Goodbye","Hello/Greetings","Thank you","Please"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'पानी' in English?",o:["Fire","Sky","Water","Earth"],a:2,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'My name is' in Hindi?",o:["मेरा नाम है","आपका नाम है","तुम्हारा नाम","नाम मेरा"],a:0,d:2,topic:"Grammar",cefr:"A2"},
    {q:"'धन्यवाद' means?",o:["Please","Sorry","Thank you","Excuse me"],a:2,d:2,topic:"Vocabulary",cefr:"A2"},
    {q:"Hindi noun genders?",o:["3 genders","No gender","Masculine or feminine only","Only pronouns have gender"],a:2,d:3,topic:"Grammar",cefr:"B1"},
    {q:"Word order in Hindi?",o:["S+V+O","V+S+O","S+O+V","O+S+V"],a:2,d:3,topic:"Grammar",cefr:"B1"},
    {q:"'ने' (ne) indicates?",o:["Future","Ergative past transitive marker","Plural","Negation"],a:1,d:4,topic:"Grammar",cefr:"B2"},
    {q:"Conditional sentence?",o:["अगर उसे पता होता तो वो आती","वो आई क्योंकि पता था","उसे पता है वो आएगी","वो आएगी अगर पता होगा"],a:0,d:4,topic:"Conditional",cefr:"B2"},
    {q:"Subjunctive mood used when?",o:["Certainty","Wish/doubt/possibility","Commands only","Past events"],a:1,d:5,topic:"Grammar",cefr:"C1"},
    {q:"'यद्यपि...तथापि' means?",o:["If...then","Although...nevertheless","Either...or","Neither...nor"],a:1,d:5,topic:"Conjunctions",cefr:"C1"},
  ],
  nl:[
    {q:"'Hallo' means?",o:["Goodbye","Hello","Thank you","Please"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Thank you' in Dutch?",o:["Alsjeblieft","Dankjewel","Sorry","Hoi"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"Two Dutch articles?",o:["der/das","de/het","le/la","el/la"],a:1,d:2,topic:"Grammar",cefr:"A2"},
    {q:"'I speak Dutch'?",o:["Ik spreek Nederlands","Ik ben Nederlands","Ik heb Nederlands","Ik ga Nederlands"],a:0,d:2,topic:"Grammar",cefr:"A2"},
    {q:"Past tense of 'gaan'?",o:["Ik ginde","Ik ging","Ik ben gegaan","Ik gaande"],a:1,d:3,topic:"Past Tense",cefr:"B1"},
    {q:"Verb in subordinate clause goes?",o:["First","Second","At the end","Anywhere"],a:2,d:3,topic:"Word Order",cefr:"B1"},
    {q:"'Toch' expresses?",o:["Certainly not","Emphasis/contradiction","Only","Already"],a:1,d:4,topic:"Particles",cefr:"B2"},
    {q:"Diminutive of 'boek'?",o:["Boekje","Boekken","Boekkie","Boekie"],a:0,d:4,topic:"Diminutives",cefr:"B2"},
    {q:"'Zouden' is used for?",o:["Present habit","Conditional/reported speech","Future certainty","Commands"],a:1,d:5,topic:"Grammar",cefr:"C1"},
    {q:"'Hoewel' introduces?",o:["A result clause","A concessive clause","A purpose clause","A time clause"],a:1,d:5,topic:"Conjunctions",cefr:"C1"},
  ],
  tr:[
    {q:"'Merhaba' means?",o:["Goodbye","Hello","Thank you","Please"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Su' in English?",o:["Fire","Sun","Water","Sky"],a:2,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'I eat bread' in Turkish?",o:["Ekmek yiyorum","Ben ekmek","Yiyorum ekmek","Ekmek ben"],a:0,d:2,topic:"Grammar",cefr:"A2"},
    {q:"'Teşekkür ederim' means?",o:["Please","Thank you","Sorry","Goodbye"],a:1,d:2,topic:"Vocabulary",cefr:"A2"},
    {q:"Suffix for 'at/in a place'?",o:["-den/-dan","-e/-a","-de/-da","-in/-ın"],a:2,d:3,topic:"Cases",cefr:"B1"},
    {q:"Vowel harmony means?",o:["Matching pitch","Suffixes match root vowels","Equal syllables","Consonants adapt"],a:1,d:3,topic:"Phonology",cefr:"B1"},
    {q:"Conditional suffix?",o:["-iyor","-di","-se/-sa","-ecek"],a:2,d:4,topic:"Grammar",cefr:"B2"},
    {q:"Complex sentence: 'busy so couldn't come'?",o:["Meşgul olduğum için gelemedim","Gelmek istedim ama meşguldüm","Gelmeyeceğim çünkü meşgulüm","Meşgul değilim geldim"],a:0,d:4,topic:"Complex Sentences",cefr:"B2"},
    {q:"'-mış' suffix indicates?",o:["Direct past experience","Reported/hearsay past","Future intention","Condition"],a:1,d:5,topic:"Evidentiality",cefr:"C1"},
    {q:"'-dığı için' expresses?",o:["Purpose","Causal subordination","Concession","Manner"],a:1,d:5,topic:"Grammar",cefr:"C1"},
  ],
  pl:[
    {q:"'Cześć' means?",o:["Goodbye","Thank you","Hi/Hello","Please"],a:2,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Woda' in English?",o:["Wind","Water","Vodka","Wool"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Thank you' in Polish?",o:["Proszę","Dziękuję","Przepraszam","Cześć"],a:1,d:2,topic:"Vocabulary",cefr:"A2"},
    {q:"Polish past verbs agree in?",o:["Number only","Gender only","Number & gender","Neither"],a:2,d:2,topic:"Grammar",cefr:"A2"},
    {q:"Case after 'do' (to/of)?",o:["Nominative","Accusative","Genitive","Dative"],a:2,d:3,topic:"Cases",cefr:"B1"},
    {q:"'To write' aspect pair?",o:["pisać/napisać","pisać/napisywać","napisać/pisać","piszę/napisuję"],a:0,d:3,topic:"Aspect",cefr:"B1"},
    {q:"'I've lived in Warsaw for 3 years'?",o:["Mieszkałem w Warszawie 3 lata","Mieszkam w Warszawie od 3 lat","Będę mieszkać w Warszawie 3 lata","Mieszkałbym w Warszawie 3 lat"],a:1,d:4,topic:"Grammar",cefr:"B2"},
    {q:"Genitive plural of 'książka'?",o:["książki","książkę","książek","książkom"],a:2,d:4,topic:"Declension",cefr:"B2"},
    {q:"'Tryb przypuszczający' is used for?",o:["Commands","Conditionals/wishes","Reported speech","Future only"],a:1,d:5,topic:"Mood",cefr:"C1"},
    {q:"'Aczkolwiek' means?",o:["Therefore","Although","Furthermore","Unless"],a:1,d:5,topic:"Register",cefr:"C1"},
  ],
  el:[
    {q:"'Γεια σας' means?",o:["Goodbye","Thank you","Hello (formal)","Please"],a:2,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Νερό' in English?",o:["Fire","Sea","Water","Night"],a:2,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Thank you' in Greek?",o:["Παρακαλώ","Ευχαριστώ","Συγγνώμη","Γεια"],a:1,d:2,topic:"Vocabulary",cefr:"A2"},
    {q:"'Τι κάνεις;' means?",o:["Where are you?","What's your name?","How are you?","What do you want?"],a:2,d:2,topic:"Vocabulary",cefr:"A2"},
    {q:"Case for direct object?",o:["Nominative","Genitive","Accusative","Vocative"],a:2,d:3,topic:"Cases",cefr:"B1"},
    {q:"'Έφαγα' tense?",o:["Present","Imperfect","Simple past (aorist)","Future"],a:2,d:3,topic:"Past Tense",cefr:"B1"},
    {q:"Particle 'να' indicates?",o:["Past tense","Subjunctive/wish","Question","Negation"],a:1,d:4,topic:"Grammar",cefr:"B2"},
    {q:"'I wish I could come'?",o:["Μπορώ να έρθω","Ήθελα να έρθω","Μακάρι να μπορούσα να έρθω","Θα έρθω αν μπορώ"],a:2,d:4,topic:"Subjunctive",cefr:"B2"},
    {q:"'Αόριστος' vs 'Παρακείμενος'?",o:["Same meaning","Aorist=simple past, Parakeimenos=resultant state","Aorist=recent, Parakeimenos=distant","No real difference"],a:1,d:5,topic:"Aspect",cefr:"C1"},
    {q:"'Εντούτοις' means?",o:["Therefore","Nevertheless","Furthermore","Meanwhile"],a:1,d:5,topic:"Register",cefr:"C1"},
  ],
  sv:[
    {q:"'Hej' means?",o:["Goodbye","Hello/Hi","Thank you","Please"],a:1,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Vatten' in English?",o:["Wine","Winter","Water","Wind"],a:2,d:1,topic:"Vocabulary",cefr:"A1"},
    {q:"'Thank you' in Swedish?",o:["Förlåt","Tack","Snälla","Varsågod"],a:1,d:2,topic:"Vocabulary",cefr:"A2"},
    {q:"'Hur mår du?' means?",o:["Where are you?","What do you do?","How are you?","Who are you?"],a:2,d:2,topic:"Vocabulary",cefr:"A2"},
    {q:"Definite form of 'en bil'?",o:["bilen","bils","bilet","bilt"],a:0,d:3,topic:"Grammar",cefr:"B1"},
    {q:"V2 word order means?",o:["Always start with verb","Verb always second in main clause","Two verbs per sentence","Verbs at end"],a:1,d:3,topic:"Word Order",cefr:"B1"},
    {q:"'Lagom' means?",o:["Very much","Not at all","Just the right amount","Too much"],a:2,d:4,topic:"Vocabulary",cefr:"B2"},
    {q:"Past tense of 'skriva'?",o:["Skrivade","Skrev","Skriven","Skrivit"],a:1,d:4,topic:"Past Tense",cefr:"B2"},
    {q:"'Supinum' is used with?",o:["'vara' (to be)","'ha' (to have)","'bli' (to become)","'kunna' (can)"],a:1,d:5,topic:"Grammar",cefr:"C1"},
    {q:"'Oaktat' means?",o:["Therefore","Regardless of","Furthermore","Meanwhile"],a:1,d:5,topic:"Register",cefr:"C1"},
  ],
};

function getExamPool(langCode) {
  const qs = QUESTIONS[langCode] || QUESTIONS["es"];
  return [...qs].sort((a, b) => a.d - b.d);
}

// ── BASE CSS ───────────────────────────────────────────────────
const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@300;400;500;600&family=Playfair+Display:wght@400;500;700&family=Lato:wght@300;400;700&display=swap');
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;-webkit-text-size-adjust:100%}
  .fade{animation:fadeUp .4s cubic-bezier(.16,1,.3,1) both}
  .fade2{animation:fadeUp .4s cubic-bezier(.16,1,.3,1) .07s both}
  .fade3{animation:fadeUp .4s cubic-bezier(.16,1,.3,1) .14s both}
  .dot{animation:pulse 1.4s ease-in-out infinite}
  .dot:nth-child(2){animation-delay:.2s}
  .dot:nth-child(3){animation-delay:.4s}
  .lang-card{transition:transform .18s ease,background .18s,border-color .18s}
  .opt-btn{transition:all .13s ease}
  .opt-btn:disabled{cursor:default}
  .primary-btn{transition:filter .18s ease,transform .18s ease,opacity .18s}
  .primary-btn:hover:not(:disabled){filter:brightness(1.1);transform:translateY(-1px)}
  .primary-btn:active:not(:disabled){transform:translateY(0)}
  .primary-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
  .ghost-btn{transition:all .18s ease}
  .level-card{transition:transform .13s ease,background .13s,border-color .13s}
  .history-item{transition:all .18s}
  .input-field:focus{outline:none}
  textarea,input{-webkit-appearance:none;appearance:none;border-radius:10px}
  @media(hover:hover){
    .lang-card:hover{transform:translateY(-2px)}
    .level-card:hover{transform:translateX(3px)}
  }
  @media(max-width:600px){
    .hide-mobile{display:none!important}
    .mobile-full{width:100%!important}
    .mobile-col{flex-direction:column!important}
    .mobile-p{padding:16px!important}
    .mobile-gap{gap:8px!important}
  }
`;

// ── AUTH FIELD ─────────────────────────────────────────────────
function AuthField({ label, value, onChange, placeholder, type = "text", onEnter, t }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ fontSize:10, letterSpacing:2.5, color:t.textMuted, textTransform:"uppercase",
        marginBottom:8, display:"block", fontFamily:t.fontMono }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onEnter?.()}
        placeholder={placeholder}
        autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : "name"}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width:"100%", background:t.bgInput,
          border:`1px solid ${focused ? t.borderFocus : t.borderInput}`,
          borderRadius:10, padding:"13px 16px", color:t.textHeading,
          fontSize:15, fontFamily:t.fontBody, transition:"border-color .2s", outline:"none",
        }}
      />
    </div>
  );
}

// ── AUTH SCREEN ────────────────────────────────────────────────
function AuthScreen({ onLogin, onBack, t }) {
  const [mode, setMode]       = useState("signin");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      const key = `user:${email.toLowerCase().trim()}`;
      if (mode === "signup") {
        const ex = await sGet(key);
        if (ex)              { setErr("An account with this email already exists."); setLoading(false); return; }
        if (!name.trim())    { setErr("Please enter your name.");                   setLoading(false); return; }
        if (pass.length < 6) { setErr("Password must be at least 6 characters.");   setLoading(false); return; }
        const u = { id:uid(), name:name.trim(), email:email.trim(), pass };
        await sSet(key, u); onLogin(u);
      } else {
        const u = await sGet(key);
        if (!u)           { setErr("No account found with this email."); setLoading(false); return; }
        if (u.pass!==pass){ setErr("Incorrect password.");               setLoading(false); return; }
        onLogin(u);
      }
    } catch { setErr("Something went wrong. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="fade" style={{ maxWidth:400, margin:"0 auto", padding:"40px 20px" }}>
      <button onClick={onBack} style={{ background:"none", border:`1px solid ${t.border}`, borderRadius:8,
        padding:"8px 16px", color:t.textMuted, fontSize:12, fontFamily:t.fontMono,
        letterSpacing:2, textTransform:"uppercase", marginBottom:36, cursor:"pointer" }}>
        ← Back
      </button>
      <div style={{ fontSize:10, letterSpacing:3, color:t.textMuted, textTransform:"uppercase",
        marginBottom:12, fontFamily:t.fontMono }}>
        {mode === "signin" ? "Return to session" : "Create account"}
      </div>
      <h2 style={{ fontSize:32, fontFamily:t.fonts, fontWeight:400, margin:"0 0 10px", color:t.textHeading }}>
        {mode === "signin" ? "Welcome back" : "Join LinguaAI"}
      </h2>
      <p style={{ color:t.textMuted, fontSize:14, marginBottom:28, lineHeight:1.8, fontWeight:300, fontFamily:t.fontBody }}>
        {mode === "signin" ? "Access your saved sessions and progress." : "Free access. No subscription required."}
      </p>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {mode === "signup" && <AuthField label="Name" value={name} onChange={setName} placeholder="Your name" t={t}/>}
        <AuthField label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" t={t}/>
        <AuthField label="Password" value={pass} onChange={setPass} placeholder="••••••••" type="password" onEnter={submit} t={t}/>
        {err && (
          <div style={{ fontSize:12, color:t.errorText, padding:"10px 14px", background:t.errorBg,
            borderRadius:8, border:`1px solid ${t.errorBorder}`, fontFamily:t.fontMono }}>
            {err}
          </div>
        )}
        <button className="primary-btn" onClick={submit} disabled={loading}
          style={{ background:t.btnPrimary, border:"none", borderRadius:10, padding:"14px",
            color:t.btnPrimaryText, fontSize:15, fontWeight:600, fontFamily:t.fontBody, width:"100%", cursor:"pointer" }}>
          {loading ? "…" : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </div>
      <p style={{ textAlign:"center", marginTop:20, fontSize:13, color:t.textMuted, fontFamily:t.fontBody }}>
        {mode === "signin" ? "No account? " : "Already registered? "}
        <button onClick={() => { setMode(m => m==="signin"?"signup":"signin"); setErr(""); }}
          style={{ background:"none", border:"none", color:t.accent, cursor:"pointer", fontFamily:t.fontBody, fontSize:13 }}>
          {mode === "signin" ? "Create one" : "Sign in"}
        </button>
      </p>
    </div>
  );
}

// ── THEME PICKER ───────────────────────────────────────────────
function ThemePicker({ current, onChange, t }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ background:t.btnGhost, border:`1px solid ${t.border}`, borderRadius:8,
          padding:"6px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ display:"flex", gap:3 }}>
          {THEMES[current].preview.map((c,i) => (
            <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:c }}/>
          ))}
        </div>
        <span className="hide-mobile" style={{ fontSize:11, color:t.textMuted, fontFamily:t.fontMono, letterSpacing:1 }}>
          {THEMES[current].label}
        </span>
      </button>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:t.bgCard,
          border:`1px solid ${t.border}`, borderRadius:12, padding:8, zIndex:300,
          display:"flex", flexDirection:"column", gap:4, minWidth:150,
          boxShadow:"0 20px 60px rgba(0,0,0,.6)" }}>
          {Object.values(THEMES).map(th => (
            <button key={th.id} onClick={() => { onChange(th.id); setOpen(false); }}
              style={{ background: th.id===current ? t.accentMuted : "none",
                border:`1px solid ${th.id===current ? t.accentBorder : "transparent"}`,
                borderRadius:8, padding:"9px 12px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:10, width:"100%" }}>
              <div style={{ display:"flex", gap:4 }}>
                {th.preview.map((c,i) => <div key={i} style={{ width:9, height:9, borderRadius:"50%", background:c }}/>)}
              </div>
              <span style={{ fontSize:12, color:t.text, fontFamily:t.fontBody }}>{th.label}</span>
              {th.id===current && <span style={{ marginLeft:"auto", fontSize:10, color:t.accent }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────
export default function LinguaAI() {
  const [themeId, setThemeId] = useState("slate");
  const t = THEMES[themeId];

  const [screen,  setScreen]  = useState("home");
  const [user,    setUser]    = useState(null);
  const [lang,    setLang]    = useState(null);
  const [goals,   setGoals]   = useState([]);
  const [level,   setLevel]   = useState(null);
  const [msgs,    setMsgs]    = useState([]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId,  setChatId]  = useState(null);
  const [history, setHistory] = useState([]);
  const [search,  setSearch]  = useState("");

  const [examPool,  setExamPool]  = useState([]);
  const examPoolRef = useRef([]);
  const [examIdx,   setExamIdx]   = useState(0);
  const [examScore, setExamScore] = useState(0);
  const [showExpl,  setShowExpl]  = useState(false);
  const [chosenAns, setChosenAns] = useState(null);

  const chatEnd  = useRef(null);
  const inputRef = useRef(null);

  // Focus input after loading ends on desktop only
  useEffect(() => {
    if (!loading && screen === "chat") {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        const id = setTimeout(() => inputRef.current?.focus(), 80);
        return () => clearTimeout(id);
      }
    }
  }, [loading, screen]);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const login    = (u) => { setUser(u); setScreen("home"); };
  const logout   = ()  => { setUser(null); setScreen("home"); setMsgs([]); };
  const pickLang = (l) => { setLang(l); setGoals([]); setScreen("questionnaire"); };

  // ── Exam ──────────────────────────────────────────────────────
  const startExam = () => {
    const pool = getExamPool(lang.code);
    examPoolRef.current = pool;
    setExamPool(pool); setExamIdx(0); setExamScore(0);
    setShowExpl(false); setChosenAns(null);
    setScreen("exam");
  };

  const answer = (idx) => {
    const pool = examPoolRef.current;
    if (showExpl || !pool[examIdx]) return;
    const q = pool[examIdx];
    const correct = q.a === idx;
    setChosenAns(idx); setShowExpl(true);
    setExamScore(prev => {
      const newScore = correct ? prev + 1 : prev;
      const newIdx   = examIdx + 1;
      if (newIdx >= 10) {
        setTimeout(() => {
          const li = Math.min(6, Math.round((newScore / 10) * 6));
          setLevel({ score:newScore, li, ...LEVELS[li] });
          setScreen("results");
        }, 1400);
      } else {
        setTimeout(() => { setShowExpl(false); setChosenAns(null); setExamIdx(newIdx); }, 1400);
      }
      return newScore;
    });
  };

  const pickLevel = (li) => { setLevel({ score:null, li, ...LEVELS[li] }); setScreen("results"); };

  // ── Build system prompt — strong language enforcement ─────────
  const buildSys = useCallback(() => {
    const gl = goals.map(g => GOALS.find(x => x.id===g)?.label).filter(Boolean).join(", ") || "General proficiency";
    const scoreNote = (level?.score !== null && level?.score !== undefined)
      ? `placement exam score ${level?.score}/10` : "self-assessed";
    const li = level?.li ?? 0;
    const depthGuide = li <= 1
      ? "Keep everything simple and encouraging. Use short sentences. Introduce 1-2 new words per message max. Celebrate every effort. Translate every target-language phrase you use."
      : li <= 3
      ? "Balance warmth with gentle challenge. Teach grammar through natural conversation. Mix target language and English. Correct errors kindly by weaving the correct form into your response."
      : "Engage at near-equal level. Use mostly the target language with English only for key explanations. Explore nuance, idioms, register, and sophisticated expression.";

    const scriptNote = ["ja","zh","ar","ko","hi","ru","el"].includes(lang?.code)
      ? `IMPORTANT: Always write ${lang?.name} in its native script (${lang?.code === "ja" ? "hiragana/katakana/kanji" : lang?.code === "zh" ? "simplified Chinese characters" : lang?.code === "ar" ? "Arabic script" : lang?.code === "ko" ? "Hangul" : lang?.code === "hi" ? "Devanagari" : lang?.code === "ru" ? "Cyrillic" : "Greek script"}). Always provide transliteration (romanisation) alongside the native script for learners at A1-B1 levels.`
      : "";

    return `You are a warm, expert ${lang?.name} language tutor. You care deeply about your students and make learning genuinely enjoyable.

Student profile: CEFR ${level?.cefr} — ${level?.name} (${scoreNote}) | Goals: ${gl} | Target language: ${lang?.name}

${scriptNote}

Teaching approach:
- Write like a real person in conversation, not a textbook. No bullet-point lists or markdown headers — flowing, natural paragraphs only.
- ${depthGuide}
- Use ${lang?.name} examples throughout every message. Even at beginner level, always include some target-language phrases with English translation right after in parentheses.
- Connect every lesson moment to their goals: ${gl}. Make it feel immediately practical and relevant.
- Correct mistakes gently: weave the correct form naturally into your reply, then briefly note why — never make them feel bad.
- End EVERY reply with exactly one engaging question or a small hands-on exercise to keep the conversation moving forward.
- Keep replies to 3–4 paragraphs — warm, focused, energising. Never overwhelming.

Language use rule: You MUST include ${lang?.name} language in every single reply. Even for meta-questions about learning, include at least one example phrase in ${lang?.name}.

First message: Greet them warmly in ${lang?.name} first (with translation), naturally acknowledge their level and goals, then jump straight into something genuinely useful for lesson 1. Make them excited about learning ${lang?.name}.`;
  }, [lang, level, goals]);

  // ── Chat ──────────────────────────────────────────────────────
  const startChat = async () => {
    if (!user) { setScreen("auth"); return; }
    setScreen("chat"); setMsgs([]); setLoading(true);
    const intro = await callClaude([{ role:"user", content:"Please begin my first lesson." }], buildSys());
    const init  = [{ role:"assistant", content:intro }];
    setMsgs(init); setLoading(false);
    const id = uid(); setChatId(id);
    await sSet(`chat:${user.id}:${id}`, {
      id, langName:lang.name, langCode:lang.code, flag:lang.flag,
      levelName:level.name, li:level.li, cefr:level.cefr, goals,
      messages:init, updatedAt:Date.now(),
    });
  };

  const send = async () => {
    const txt = input.trim();
    if (!txt || loading) return;
    setInput("");
    const next = [...msgs, { role:"user", content:txt }];
    setMsgs(next); setLoading(true);
    const reply = await callClaude(next, buildSys());
    const final = [...next, { role:"assistant", content:reply }];
    setMsgs(final); setLoading(false);
    if (user && chatId) {
      const ex = await sGet(`chat:${user.id}:${chatId}`);
      if (ex) await sSet(`chat:${user.id}:${chatId}`, { ...ex, messages:final, updatedAt:Date.now() });
    }
  };

  const handleSend = () => send();
  const handleInputChange = (e) => setInput(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const loadHistory = async () => {
    if (!user) return;
    const keys  = await sList(`chat:${user.id}:`);
    const chats = await Promise.all(keys.map(k => sGet(k)));
    setHistory(chats.filter(Boolean).sort((a,b) => b.updatedAt - a.updatedAt));
    setScreen("history");
  };

  const openChat = (c) => {
    setLang(LANGUAGES.find(l => l.code === c.langCode));
    setLevel({ name:c.levelName, li:c.li, cefr:c.cefr||"B1", ...LEVELS[c.li] });
    setGoals(c.goals||[]); setMsgs(c.messages||[]); setChatId(c.id);
    setScreen("chat");
  };

  const filtered = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.region.toLowerCase().includes(search.toLowerCase())
  );

  // ── Shared UI components ───────────────────────────────────────
  const PBtn = ({ onClick, children, style={}, disabled=false }) => (
    <button className="primary-btn" onClick={onClick} disabled={disabled}
      style={{ background:t.btnPrimary, border:"none", borderRadius:10, padding:"13px 26px",
        color:t.btnPrimaryText, fontSize:14, fontWeight:600, fontFamily:t.fontBody,
        letterSpacing:.3, cursor:"pointer", ...style }}>
      {children}
    </button>
  );

  const GBtn = ({ onClick, children, style={} }) => (
    <button className="ghost-btn" onClick={onClick}
      style={{ background:t.btnGhost, border:`1px solid ${t.border}`, borderRadius:10,
        padding:"13px 20px", color:t.btnGhostText, fontSize:13, fontFamily:t.fontBody,
        cursor:"pointer", ...style }}>
      {children}
    </button>
  );

  const Bk = ({ onClick }) => (
    <button onClick={onClick}
      style={{ background:"none", border:`1px solid ${t.border}`, borderRadius:8,
        padding:"8px 16px", color:t.textMuted, fontSize:12, fontFamily:t.fontMono,
        letterSpacing:2, textTransform:"uppercase", marginBottom:36, cursor:"pointer",
        display:"inline-flex", alignItems:"center", gap:8 }}>
      ← Back
    </button>
  );

  const Tag = ({ children }) => (
    <span style={{ fontSize:9, letterSpacing:2, color:t.textMuted, textTransform:"uppercase",
      padding:"4px 10px", background:t.accentMuted, borderRadius:20,
      border:`1px solid ${t.border}`, fontFamily:t.fontMono }}>
      {children}
    </span>
  );

  const card = { background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:16 };

  // ── RENDER ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:t.bg, fontFamily:t.fontBody, color:t.text, position:"relative", overflowX:"hidden" }}>
      <style>{BASE_CSS + `
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${t.scrollThumb};border-radius:2px}
        .lang-card:hover{background:${t.bgCardHover}!important;border-color:${t.borderHover}!important}
        .ghost-btn:hover{background:${t.accentMuted}!important;border-color:${t.borderHover}!important;color:${t.text}!important}
        .opt-btn:hover:not(:disabled){background:${t.accentMuted}!important;border-color:${t.borderHover}!important}
        .history-item:hover{background:${t.bgCardHover}!important;border-color:${t.borderHover}!important}
        .level-card:hover{background:${t.bgCardHover}!important;border-color:${t.borderHover}!important}
        .goal-card{transition:all .18s}
        .goal-card:hover{border-color:${t.borderHover}!important}
        input::placeholder,textarea::placeholder{color:${t.textDim}}
      `}</style>

      {/* Background grid + glow */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        backgroundImage:`linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
        backgroundSize:"48px 48px" }}/>
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        background:`radial-gradient(ellipse 80% 50% at 50% -5%,${t.gradientTop} 0%,transparent 70%)` }}/>

      {/* ── NAV ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100,
        padding:"0 20px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between",
        background:t.bgNav, backdropFilter:"blur(20px)", borderBottom:`1px solid ${t.border}` }}>

        <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", cursor:"pointer",
          padding:0, display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:t.logoBox,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, color:t.logoBoxText, fontFamily:t.fontMono, flexShrink:0 }}>
            λ
          </div>
          <span style={{ fontSize:16, fontFamily:t.fonts, color:t.logo, letterSpacing:-.3 }}>LinguaAI</span>
        </button>

        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <ThemePicker current={themeId} onChange={setThemeId} t={t}/>
          <div style={{ width:1, height:18, background:t.border }}/>

          {user ? (
            <>
              <button onClick={loadHistory} className="hide-mobile"
                style={{ background:"none", border:"none", color:t.textMuted, cursor:"pointer",
                  fontSize:13, fontFamily:t.fontBody, padding:"4px 8px" }}
                onMouseOver={e=>e.target.style.color=t.textHeading}
                onMouseOut={e=>e.target.style.color=t.textMuted}>
                Sessions
              </button>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:t.accentMuted,
                  border:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, color:t.accent, fontFamily:t.fontMono, fontWeight:600, flexShrink:0 }}>
                  {(user.name || user.email || "?")[0].toUpperCase()}
                </div>
                <button onClick={logout}
                  style={{ background:"none", border:"none", color:t.textDim, cursor:"pointer",
                    fontSize:12, fontFamily:t.fontBody }}>
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <button className="ghost-btn" onClick={() => setScreen("auth")}
              style={{ background:t.btnGhost, border:`1px solid ${t.border}`, borderRadius:8,
                padding:"7px 16px", color:t.textMuted, fontSize:13, cursor:"pointer", fontFamily:t.fontBody }}>
              Sign in
            </button>
          )}
        </div>
      </nav>

      <div style={{ paddingTop:54, position:"relative", zIndex:1 }}>

        {/* ══ HOME ══ */}
        {screen === "home" && (
          <div className="fade" style={{ minHeight:"calc(100vh - 54px)", display:"flex", flexDirection:"column" }}>

            {/* ── Two-column layout ── */}
            <div style={{
              flex:1, display:"grid",
              gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",
              gap:0,
            }}>

              {/* LEFT — Hero */}
              <div style={{
                padding:"64px 48px 48px",
                display:"flex", flexDirection:"column", justifyContent:"center",
                borderRight:`1px solid ${t.border}`,
                position:"sticky", top:54, height:"calc(100vh - 54px)",
              }}>
                <div className="fade" style={{ fontSize:10, letterSpacing:3, color:t.textMuted,
                  textTransform:"uppercase", marginBottom:20, fontFamily:t.fontMono }}>
                  AI Language Tutor · Powered by Claude
                </div>

                <h1 className="fade2" style={{ fontSize:"clamp(52px,5.5vw,96px)", fontFamily:t.fonts,
                  fontWeight:400, margin:"0 0 8px", lineHeight:.92, color:t.textHeading, letterSpacing:-3 }}>
                  Lingua<span style={{ fontStyle:"italic", color:t.textMuted }}>AI</span>
                </h1>

                <div style={{ width:40, height:2, background:t.accent, borderRadius:1, margin:"28px 0" }}/>

                <p className="fade3" style={{ fontSize:15, color:t.textMuted, maxWidth:380,
                  lineHeight:1.9, fontWeight:300, marginBottom:36 }}>
                  AI-powered language instruction calibrated to your CEFR level, goals, and learning style.
                </p>

                {/* Stats */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:40 }}>
                  {[
                    { num:"16", label:"Languages" },
                    { num:"7", label:"CEFR Levels" },
                    { num:"AI", label:"Placement Exam" },
                    { num:"∞", label:"Session History" },
                  ].map(s => (
                    <div key={s.label} style={{ background:t.bgCard, border:`1px solid ${t.border}`,
                      borderRadius:12, padding:"16px 18px" }}>
                      <div style={{ fontSize:24, fontFamily:t.fonts, color:t.accent, fontWeight:400,
                        lineHeight:1, marginBottom:4 }}>{s.num}</div>
                      <div style={{ fontSize:10, color:t.textMuted, letterSpacing:2,
                        textTransform:"uppercase", fontFamily:t.fontMono }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Feature pills */}
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {["CEFR-Aligned","Native Scripts","Goal-Adaptive"].map(f => (
                    <span key={f} style={{ fontSize:9, letterSpacing:2, color:t.textDim,
                      textTransform:"uppercase", fontFamily:t.fontMono, padding:"5px 12px",
                      background:t.accentMuted, border:`1px solid ${t.border}`, borderRadius:20 }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* RIGHT — Language grid */}
              <div className="home-right" style={{ padding:"32px 32px 48px", overflowY:"auto", height:"calc(100vh - 54px)" }}>

                {/* Search */}
                <div style={{ marginBottom:20, position:"sticky", top:0, zIndex:10,
                  background:t.bg, paddingTop:8, paddingBottom:12 }}>
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search languages or regions…"
                    style={{ width:"100%", background:t.bgInput, border:`1px solid ${t.borderInput}`,
                      borderRadius:10, padding:"11px 16px", color:t.textHeading, fontSize:13,
                      fontFamily:t.fontBody, outline:"none" }}
                    onFocus={e => e.target.style.borderColor = t.borderFocus}
                    onBlur={e  => e.target.style.borderColor = t.borderInput}
                  />
                </div>

                <div style={{ fontSize:9, letterSpacing:2, color:t.textDim, textTransform:"uppercase",
                  fontFamily:t.fontMono, marginBottom:16 }}>
                  {filtered.length} language{filtered.length !== 1 ? "s" : ""} available — click to begin
                </div>

                {/* Grid */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10 }}>
                  {filtered.map((l, i) => (
                    <button key={l.code} className="lang-card" onClick={() => pickLang(l)}
                      style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:14,
                        padding:"22px 12px", color:t.text, textAlign:"center", display:"flex",
                        flexDirection:"column", alignItems:"center", gap:8, cursor:"pointer",
                        animation:`fadeUp .35s cubic-bezier(.16,1,.3,1) ${i*0.02}s both` }}>
                      <div style={{ fontSize:30 }}>{l.flag}</div>
                      <div style={{ fontSize:13, fontWeight:500, color:t.textHeading, fontFamily:t.fontBody }}>
                        {l.name}
                      </div>
                      <div style={{ fontSize:9, color:t.textDim, letterSpacing:1.5, textTransform:"uppercase",
                        fontFamily:t.fontMono, lineHeight:1.4 }}>{l.region}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile fallback — stacked */}
            <style>{`
              @media(max-width:700px){
                .home-grid { grid-template-columns: 1fr !important; }
                .home-left { position:static !important; height:auto !important; border-right:none !important; border-bottom:1px solid ${t.border} !important; padding:40px 20px 32px !important; }
                .home-right { height:auto !important; padding:24px 20px 48px !important; }
              }
            `}</style>
          </div>
        )}

        {/* ══ AUTH ══ */}
        {screen === "auth" && <AuthScreen onLogin={login} onBack={() => setScreen("home")} t={t}/>}

        {/* ══ QUESTIONNAIRE ══ */}
        {screen === "questionnaire" && lang && (
          <div className="fade" style={{ maxWidth:620, margin:"0 auto", padding:"40px 20px" }}>
            <Bk onClick={() => setScreen("home")}/>
            <div style={{ fontSize:10, letterSpacing:3, color:t.textMuted, textTransform:"uppercase",
              marginBottom:12, fontFamily:t.fontMono }}>
              {lang.flag} {lang.name} · Step 1 of 2
            </div>
            <h2 style={{ fontSize:32, fontFamily:t.fonts, fontWeight:400, marginBottom:10,
              color:t.textHeading, lineHeight:1.1 }}>
              What are your goals?
            </h2>
            <p style={{ color:t.textMuted, fontSize:14, lineHeight:1.85, marginBottom:28, fontWeight:300 }}>
              Your tutor will tailor vocabulary, scenarios, and difficulty to match these objectives. Pick any that apply.
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:10, marginBottom:28 }}>
              {GOALS.map(g => {
                const sel = goals.includes(g.id);
                return (
                  <button key={g.id} className="goal-card" onClick={() => setGoals(p => p.includes(g.id)?p.filter(x=>x!==g.id):[...p,g.id])}
                    style={{ background:sel?t.accentMuted:t.bgCard, border:`1px solid ${sel?t.accentBorder:t.border}`,
                      borderRadius:12, padding:"16px 14px", textAlign:"left", cursor:"pointer" }}>
                    <div style={{ fontSize:22, marginBottom:8 }}>{g.icon}</div>
                    <div style={{ fontSize:13, fontWeight:500, color:sel?t.accent:t.text,
                      marginBottom:4, fontFamily:t.fontBody }}>{g.label}</div>
                    <div style={{ fontSize:11, color:t.textMuted, lineHeight:1.6, fontWeight:300 }}>{g.desc}</div>
                    {sel && <div style={{ marginTop:8, fontSize:9, color:t.accent, letterSpacing:2,
                      fontFamily:t.fontMono }}>✓ SELECTED</div>}
                  </button>
                );
              })}
            </div>

            <div style={{ ...card, padding:"18px 20px" }}>
              <div style={{ fontSize:10, letterSpacing:2, color:t.textMuted, textTransform:"uppercase",
                marginBottom:12, fontFamily:t.fontMono }}>
                How would you like to set your level?
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <PBtn onClick={startExam} style={{ flex:1, minWidth:160, fontSize:13 }}>
                  AI Placement Exam →
                </PBtn>
                <GBtn onClick={() => setScreen("manual-level")} style={{ flex:1, minWidth:140 }}>
                  Set Manually
                </GBtn>
              </div>
            </div>
          </div>
        )}

        {/* ══ MANUAL LEVEL ══ */}
        {screen === "manual-level" && lang && (
          <div className="fade" style={{ maxWidth:520, margin:"0 auto", padding:"40px 20px" }}>
            <Bk onClick={() => setScreen("questionnaire")}/>
            <div style={{ fontSize:10, letterSpacing:3, color:t.textMuted, textTransform:"uppercase",
              marginBottom:12, fontFamily:t.fontMono }}>
              {lang.flag} {lang.name} · Self-Assessment
            </div>
            <h2 style={{ fontSize:32, fontFamily:t.fonts, fontWeight:400, marginBottom:10, color:t.textHeading }}>
              Select your level
            </h2>
            <p style={{ color:t.textMuted, fontSize:14, lineHeight:1.85, marginBottom:28, fontWeight:300 }}>
              Choose the CEFR level that best reflects your current competence.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {Object.entries(LEVELS).map(([li, lv]) => (
                <button key={li} className="level-card" onClick={() => pickLevel(Number(li))}
                  style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:12,
                    padding:"16px 20px", textAlign:"left", cursor:"pointer",
                    display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ fontSize:13, color:lv.color, width:38, flexShrink:0, fontWeight:500,
                    fontFamily:t.fontMono }}>{lv.cefr}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:500, color:t.textHeading, marginBottom:2,
                      fontFamily:t.fontBody }}>{lv.name}</div>
                    <div style={{ fontSize:11, color:t.textMuted, fontWeight:300, lineHeight:1.5 }}>{lv.desc}</div>
                  </div>
                  <div style={{ fontSize:18, color:t.textDim, flexShrink:0 }}>{lv.emoji}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ EXAM ══ */}
        {screen === "exam" && lang && (
          <div className="fade" style={{ maxWidth:620, margin:"0 auto", padding:"40px 20px" }}>
            <Bk onClick={() => setScreen("questionnaire")}/>
            <div style={{ marginBottom:28 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ fontSize:10, letterSpacing:3, color:t.textMuted, textTransform:"uppercase",
                  fontFamily:t.fontMono }}>
                  {lang.flag} Placement Assessment
                </div>
                <div style={{ fontSize:11, color:t.textMuted, fontFamily:t.fontMono }}>{examIdx+1} / 10</div>
              </div>
              <div style={{ height:3, background:t.border, borderRadius:2 }}>
                <div style={{ height:"100%", width:`${(examIdx/10)*100}%`, background:t.accent,
                  borderRadius:2, transition:"width .5s ease" }}/>
              </div>
            </div>

            {(() => {
              const examQ = examPool[examIdx] || examPoolRef.current[examIdx];
              if (!examQ) return (
                <div style={{ ...card, padding:40, textAlign:"center", color:t.textMuted }}>
                  <button onClick={startExam} style={{ color:t.accent, background:"none", border:"none",
                    cursor:"pointer", fontFamily:t.fontBody, fontSize:14 }}>Restart Exam</button>
                </div>
              );
              return (
                <div key={examIdx} className="fade" style={{ ...card, padding:"28px 24px" }}>
                  <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
                    {examQ.topic && <Tag>{examQ.topic}</Tag>}
                    {examQ.cefr  && <Tag>{examQ.cefr}</Tag>}
                  </div>
                  <h2 style={{ fontSize:17, fontFamily:t.fonts, fontWeight:400, marginBottom:24,
                    lineHeight:1.65, color:t.textHeading }}>
                    {examQ.q}
                  </h2>
                  <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:showExpl?18:0 }}>
                    {examQ.o.map((opt, i) => {
                      let bg = t.bgInput, border = t.border, color = t.text;
                      if (showExpl) {
                        if (i === examQ.a)     { bg = t.successBg; border = t.successBorder; color = t.successText; }
                        else if (i===chosenAns) { bg = t.wrongBg;   border = t.wrongBorder;   color = t.wrongText; }
                      }
                      return (
                        <button key={i} className="opt-btn" onClick={() => answer(i)} disabled={showExpl}
                          style={{ background:bg, border:`1px solid ${border}`, borderRadius:10,
                            padding:"13px 16px", color, textAlign:"left", fontSize:13, cursor:"pointer",
                            display:"flex", alignItems:"center", gap:14, fontFamily:t.fontBody }}>
                          <span style={{ fontSize:10, width:20, textAlign:"center", color:t.textDim,
                            flexShrink:0, fontFamily:t.fontMono }}>
                            {["A","B","C","D"][i]}
                          </span>
                          <span style={{ flex:1 }}>{opt}</span>
                          {showExpl && i===examQ.a   && <span>✓</span>}
                          {showExpl && i===chosenAns && i!==examQ.a && <span>✗</span>}
                        </button>
                      );
                    })}
                  </div>
                  {showExpl && (
                    <div className="fade" style={{ background:t.bgInput, border:`1px solid ${t.border}`,
                      borderRadius:10, padding:"14px 16px" }}>
                      <div style={{ fontSize:9, color:t.textMuted, letterSpacing:2, textTransform:"uppercase",
                        marginBottom:6, fontFamily:t.fontMono }}>Explanation</div>
                      <div style={{ fontSize:12, color:t.textMuted, lineHeight:1.7, fontWeight:300 }}>
                        The correct answer is <strong style={{color:t.successText}}>{examQ.o[examQ.a]}</strong>. {examQ.topic} — {examQ.cefr} level.
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ══ RESULTS ══ */}
        {screen === "results" && level && (
          <div className="fade" style={{ maxWidth:500, margin:"0 auto", padding:"60px 20px", textAlign:"center" }}>
            <div style={{ fontSize:10, letterSpacing:4, color:t.textMuted, textTransform:"uppercase",
              marginBottom:16, fontFamily:t.fontMono }}>
              {lang?.flag} {lang?.name} · Assessment Complete
            </div>
            <div style={{ fontSize:11, color:level.color, fontFamily:t.fontMono, letterSpacing:2,
              textTransform:"uppercase", marginBottom:8 }}>
              CEFR {level.cefr}
            </div>
            <h2 style={{ fontSize:48, fontFamily:t.fonts, fontWeight:400, margin:"0 0 12px",
              color:t.textHeading, lineHeight:1 }}>
              {level.name}
            </h2>
            <p style={{ color:t.textMuted, fontSize:14, marginBottom:8, lineHeight:1.8, fontWeight:300 }}>
              {level.desc}
            </p>
            {level.score !== null
              ? <p style={{ color:t.textDim, fontSize:12, marginBottom:36, letterSpacing:1, fontFamily:t.fontMono }}>Score: {level.score}/10</p>
              : <p style={{ color:t.textDim, fontSize:12, marginBottom:36, letterSpacing:1, fontFamily:t.fontMono }}>Self-assessed</p>
            }

            <div style={{ ...card, padding:"22px", marginBottom:28 }}>
              {level.score !== null && (
                <div style={{ display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap",
                  marginBottom:goals.length>0?18:0 }}>
                  {Array.from({length:10}).map((_,i) => (
                    <div key={i} style={{ width:28, height:28, borderRadius:6, display:"flex",
                      alignItems:"center", justifyContent:"center",
                      background: i<level.score ? t.accentMuted : t.bgInput,
                      border:`1px solid ${i<level.score ? t.accentBorder : t.border}`,
                      fontSize:11, color: i<level.score ? t.accent : t.textDim }}>
                      {i < level.score ? "✓" : "·"}
                    </div>
                  ))}
                </div>
              )}
              {goals.length > 0 && (
                <div style={{ borderTop:level.score!==null?`1px solid ${t.border}`:"none",
                  paddingTop:level.score!==null?16:0 }}>
                  <div style={{ fontSize:9, letterSpacing:2, color:t.textMuted, textTransform:"uppercase",
                    marginBottom:10, fontFamily:t.fontMono }}>Learning objectives</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center" }}>
                    {goals.map(gid => {
                      const g = GOALS.find(x => x.id===gid);
                      return g ? (
                        <span key={gid} style={{ fontSize:9, padding:"3px 10px", borderRadius:20,
                          background:t.accentMuted, color:t.textMuted, letterSpacing:1.5,
                          textTransform:"uppercase", border:`1px solid ${t.border}`, fontFamily:t.fontMono }}>
                          {g.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              <GBtn onClick={startExam}>Retake Exam</GBtn>
              <GBtn onClick={() => setScreen("manual-level")}>Change Level</GBtn>
              <PBtn onClick={startChat}>Begin Session →</PBtn>
            </div>
            {!user && (
              <p style={{ color:t.textDim, fontSize:10, marginTop:16, letterSpacing:1.5,
                textTransform:"uppercase", fontFamily:t.fontMono }}>
                Sign in to save your sessions
              </p>
            )}
          </div>
        )}

        {/* ══ CHAT ══ */}
        {screen === "chat" && (
          <div style={{ display:"flex", flexDirection:"column", height:"calc(100dvh - 54px)" }}>

            {/* Chat header */}
            <div style={{ padding:"10px 18px", borderBottom:`1px solid ${t.border}`,
              background:t.bgNav, backdropFilter:"blur(20px)",
              display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <button onClick={() => setScreen("home")}
                  style={{ background:"none", border:`1px solid ${t.border}`, borderRadius:8,
                    width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center",
                    color:t.textMuted, cursor:"pointer", fontSize:16, flexShrink:0 }}>
                  ←
                </button>
                <div style={{ fontSize:22, flexShrink:0 }}>{lang?.flag}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:500, color:t.textHeading, fontFamily:t.fontBody }}>
                    {lang?.name}
                  </div>
                  <div style={{ fontSize:10, color:t.textMuted, letterSpacing:1.5, textTransform:"uppercase",
                    fontFamily:t.fontMono }}>
                    {level?.cefr} · {level?.name}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:6, height:6, borderRadius:"50%",
                  background:loading?t.dotLoading:t.dotReady,
                  boxShadow:`0 0 8px ${loading?t.dotLoading:t.dotReady}`,
                  transition:"all .3s" }}/>
                <span style={{ fontSize:9, color:t.textDim, letterSpacing:2, fontFamily:t.fontMono }}>
                  {loading ? "THINKING" : "READY"}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", padding:"24px 18px",
              maxWidth:740, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start",
                  marginBottom:18, animation:"fadeUp .3s ease both" }}>
                  {m.role==="assistant" && (
                    <div style={{ width:32, height:32, borderRadius:8, flexShrink:0,
                      background:t.accentMuted, border:`1px solid ${t.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:16, marginRight:10, marginTop:2 }}>
                      {lang?.flag}
                    </div>
                  )}
                  <div style={{
                    maxWidth:"80%",
                    background: m.role==="user" ? t.bgUserMsg : t.bgMsg,
                    border:`1px solid ${m.role==="user" ? t.borderUserMsg : t.borderAssistMsg}`,
                    borderRadius: m.role==="user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding:"12px 16px", fontSize:14, lineHeight:1.85,
                    color:t.text, whiteSpace:"pre-wrap", fontWeight:300, fontFamily:t.fontBody,
                    wordBreak:"break-word",
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:t.accentMuted,
                    border:`1px solid ${t.border}`, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:16, flexShrink:0 }}>
                    {lang?.flag}
                  </div>
                  <div style={{ background:t.bgMsg, border:`1px solid ${t.borderAssistMsg}`,
                    borderRadius:"18px 18px 18px 4px", padding:"13px 18px",
                    display:"flex", gap:5, alignItems:"center" }}>
                    <div className="dot" style={{ width:5, height:5, borderRadius:"50%", background:t.textMuted }}/>
                    <div className="dot" style={{ width:5, height:5, borderRadius:"50%", background:t.textMuted }}/>
                    <div className="dot" style={{ width:5, height:5, borderRadius:"50%", background:t.textMuted }}/>
                  </div>
                </div>
              )}
              <div ref={chatEnd}/>
            </div>

            {/* Input bar */}
            <div style={{ padding:"10px 18px 16px", borderTop:`1px solid ${t.border}`,
              background:t.bgNav, backdropFilter:"blur(20px)", flexShrink:0 }}>
              <div style={{ maxWidth:740, margin:"0 auto", display:"flex", gap:10, alignItems:"flex-end" }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message in English or ${lang?.name}…`}
                  disabled={loading}
                  rows={1}
                  style={{
                    flex:1, background:t.bgInput, border:`1px solid ${t.borderInput}`,
                    borderRadius:12, padding:"13px 16px", color:t.textHeading,
                    fontSize:14, fontFamily:t.fontBody, transition:"border-color .2s",
                    opacity:loading ? .6 : 1, resize:"none", outline:"none",
                    overflowY:"hidden", lineHeight:1.5, maxHeight:120,
                    overflowX:"hidden",
                  }}
                  onFocus={e => e.target.style.borderColor = t.borderFocus}
                  onBlur={e  => e.target.style.borderColor = t.borderInput}
                  onInput={e => {
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="primary-btn"
                  style={{
                    background: input.trim() && !loading ? t.btnPrimary : t.bgInput,
                    border:`1px solid ${input.trim()&&!loading ? "transparent" : t.border}`,
                    borderRadius:12, width:46, height:46, flexShrink:0,
                    color: input.trim()&&!loading ? t.btnPrimaryText : t.textDim,
                    fontSize:18, fontWeight:700, cursor:input.trim()&&!loading?"pointer":"not-allowed",
                    opacity:loading?.5:1, display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                  {loading ? (
                    <div style={{ width:16, height:16, border:`2px solid ${t.textDim}`,
                      borderTopColor:t.accent, borderRadius:"50%",
                      animation:"spin .7s linear infinite" }}/>
                  ) : "↑"}
                </button>
              </div>
              <div style={{ textAlign:"center", marginTop:7, fontSize:9, color:t.textVeryDim,
                letterSpacing:2, textTransform:"uppercase", fontFamily:t.fontMono }}>
                Enter to send · Shift+Enter for new line · {lang?.name} or English
              </div>
            </div>
          </div>
        )}

        {/* ══ HISTORY ══ */}
        {screen === "history" && (
          <div className="fade" style={{ maxWidth:660, margin:"0 auto", padding:"40px 20px" }}>
            <Bk onClick={() => setScreen("home")}/>
            <div style={{ fontSize:10, letterSpacing:3, color:t.textMuted, textTransform:"uppercase",
              marginBottom:12, fontFamily:t.fontMono }}>
              Your Sessions
            </div>
            <h2 style={{ fontSize:32, fontFamily:t.fonts, fontWeight:400, marginBottom:8, color:t.textHeading }}>
              Session History
            </h2>
            <p style={{ color:t.textMuted, fontSize:14, marginBottom:32, fontWeight:300 }}>
              Resume any previous learning session.
            </p>

            {history.length === 0 && (
              <div style={{ ...card, padding:48, textAlign:"center", color:t.textDim }}>
                <div style={{ fontSize:32, marginBottom:12 }}>◦</div>
                <div style={{ fontSize:11, letterSpacing:2, fontFamily:t.fontMono }}>No sessions yet</div>
              </div>
            )}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {history.map(c => (
                <button key={c.id} className="history-item" onClick={() => openChat(c)}
                  style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:14,
                    padding:"18px 20px", textAlign:"left", display:"flex", alignItems:"center",
                    justifyContent:"space-between", cursor:"pointer", gap:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14, minWidth:0 }}>
                    <span style={{ fontSize:24, flexShrink:0 }}>{c.flag}</span>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:14, fontWeight:500, color:t.textHeading, marginBottom:3,
                        fontFamily:t.fontBody }}>{c.langName}</div>
                      <div style={{ fontSize:10, color:t.textMuted, letterSpacing:1, fontFamily:t.fontMono }}>
                        {c.cefr||""} {c.levelName} · {c.messages?.length||0} messages
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:10, color:t.textDim, marginBottom:4, fontFamily:t.fontMono }}>
                      {new Date(c.updatedAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                    </div>
                    <div style={{ fontSize:12, color:t.textMuted }}>Resume →</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
