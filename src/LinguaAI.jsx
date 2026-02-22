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
    id: "slate",
    label: "Slate",
    preview: ["#08090e","#e2e8f0","#6366f1"],
    bg: "#08090e",
    bgCard: "rgba(15,17,26,.8)",
    bgCardHover: "rgba(15,17,26,.95)",
    bgInput: "rgba(148,163,184,.04)",
    bgNav: "rgba(8,9,14,.88)",
    bgMsg: "rgba(15,17,26,.8)",
    bgUserMsg: "rgba(226,232,240,.06)",
    border: "rgba(148,163,184,.09)",
    borderHover: "rgba(148,163,184,.22)",
    borderInput: "rgba(148,163,184,.12)",
    borderFocus: "rgba(148,163,184,.4)",
    borderUserMsg: "rgba(226,232,240,.12)",
    borderAssistMsg: "rgba(148,163,184,.07)",
    text: "#cbd5e1",
    textHeading: "#e2e8f0",
    textMuted: "#475569",
    textDim: "#334155",
    textVeryDim: "#1e293b",
    accent: "#e2e8f0",
    accentText: "#08090e",
    accentMuted: "rgba(226,232,240,.08)",
    accentBorder: "rgba(226,232,240,.2)",
    logo: "#e2e8f0",
    logoBox: "#e2e8f0",
    logoBoxText: "#08090e",
    gridLine: "rgba(148,163,184,.025)",
    gradientTop: "rgba(99,102,241,.07)",
    btnPrimary: "#e2e8f0",
    btnPrimaryText: "#08090e",
    btnGhost: "rgba(148,163,184,.05)",
    btnGhostText: "#64748b",
    scrollThumb: "rgba(148,163,184,.2)",
    dotReady: "#4ade80",
    dotLoading: "#f59e0b",
    errorBg: "rgba(248,113,113,.06)",
    errorBorder: "rgba(248,113,113,.15)",
    errorText: "#f87171",
    successBorder: "rgba(74,222,128,.25)",
    successBg: "rgba(74,222,128,.07)",
    successText: "#4ade80",
    wrongBorder: "rgba(248,113,113,.2)",
    wrongBg: "rgba(248,113,113,.06)",
    wrongText: "#f87171",
    fonts: `'DM Serif Display',serif`,
    fontBody: `'Instrument Sans',sans-serif`,
    fontMono: `'DM Mono',monospace`,
    googleFonts: "DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@300;400;500;600",
  },
  parchment: {
    id: "parchment",
    label: "Parchment",
    preview: ["#080810","#c4a882","#8b6a3a"],
    bg: "#080810",
    bgCard: "rgba(255,255,255,.035)",
    bgCardHover: "rgba(255,255,255,.055)",
    bgInput: "rgba(255,255,255,.05)",
    bgNav: "rgba(8,8,16,.9)",
    bgMsg: "rgba(255,255,255,.05)",
    bgUserMsg: "rgba(196,168,130,.1)",
    border: "rgba(255,255,255,.08)",
    borderHover: "rgba(196,168,130,.35)",
    borderInput: "rgba(255,255,255,.11)",
    borderFocus: "rgba(196,168,130,.5)",
    borderUserMsg: "rgba(196,168,130,.27)",
    borderAssistMsg: "rgba(255,255,255,.07)",
    text: "#e8dcc8",
    textHeading: "#f0ead6",
    textMuted: "#7a7060",
    textDim: "#5a4a30",
    textVeryDim: "#3a3020",
    accent: "#c4a882",
    accentText: "#080810",
    accentMuted: "rgba(196,168,130,.13)",
    accentBorder: "rgba(196,168,130,.5)",
    logo: "#e8dcc8",
    logoBox: "linear-gradient(135deg,#c4a882,#8b6a3a)",
    logoBoxText: "#080810",
    gridLine: "rgba(196,168,130,.018)",
    gradientTop: "rgba(120,80,30,.1)",
    btnPrimary: "linear-gradient(135deg,#c4a882,#8b6a3a)",
    btnPrimaryText: "#080810",
    btnGhost: "rgba(255,255,255,.05)",
    btnGhostText: "#6a5a40",
    scrollThumb: "rgba(196,168,130,.25)",
    dotReady: "#27ae60",
    dotLoading: "#f39c12",
    errorBg: "rgba(231,76,60,.1)",
    errorBorder: "rgba(231,76,60,.22)",
    errorText: "#e74c3c",
    successBorder: "rgba(39,174,96,.3)",
    successBg: "rgba(39,174,96,.08)",
    successText: "#27ae60",
    wrongBorder: "rgba(231,76,60,.25)",
    wrongBg: "rgba(231,76,60,.07)",
    wrongText: "#e74c3c",
    fonts: `'Playfair Display',serif`,
    fontBody: `'Lato',sans-serif`,
    fontMono: `'Lato',monospace`,
    googleFonts: "Playfair+Display:wght@400;500;700&family=Lato:ital,wght@0,300;0,400;0,700;1,400",
  },
  forest: {
    id: "forest",
    label: "Forest",
    preview: ["#0a100d","#86efac","#16a34a"],
    bg: "#0a100d",
    bgCard: "rgba(22,40,28,.8)",
    bgCardHover: "rgba(22,40,28,.95)",
    bgInput: "rgba(134,239,172,.03)",
    bgNav: "rgba(10,16,13,.9)",
    bgMsg: "rgba(22,40,28,.8)",
    bgUserMsg: "rgba(134,239,172,.07)",
    border: "rgba(134,239,172,.08)",
    borderHover: "rgba(134,239,172,.22)",
    borderInput: "rgba(134,239,172,.1)",
    borderFocus: "rgba(134,239,172,.35)",
    borderUserMsg: "rgba(134,239,172,.18)",
    borderAssistMsg: "rgba(134,239,172,.07)",
    text: "#bbf7d0",
    textHeading: "#dcfce7",
    textMuted: "#4d7c5f",
    textDim: "#2d5a3f",
    textVeryDim: "#1a3828",
    accent: "#86efac",
    accentText: "#0a100d",
    accentMuted: "rgba(134,239,172,.08)",
    accentBorder: "rgba(134,239,172,.25)",
    logo: "#dcfce7",
    logoBox: "#86efac",
    logoBoxText: "#0a100d",
    gridLine: "rgba(134,239,172,.02)",
    gradientTop: "rgba(22,163,74,.07)",
    btnPrimary: "#86efac",
    btnPrimaryText: "#0a100d",
    btnGhost: "rgba(134,239,172,.05)",
    btnGhostText: "#4d7c5f",
    scrollThumb: "rgba(134,239,172,.2)",
    dotReady: "#86efac",
    dotLoading: "#fbbf24",
    errorBg: "rgba(248,113,113,.07)",
    errorBorder: "rgba(248,113,113,.18)",
    errorText: "#fca5a5",
    successBorder: "rgba(134,239,172,.3)",
    successBg: "rgba(134,239,172,.08)",
    successText: "#86efac",
    wrongBorder: "rgba(248,113,113,.2)",
    wrongBg: "rgba(248,113,113,.06)",
    wrongText: "#fca5a5",
    fonts: `'DM Serif Display',serif`,
    fontBody: `'Instrument Sans',sans-serif`,
    fontMono: `'DM Mono',monospace`,
    googleFonts: "DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@300;400;500;600",
  },
  midnight: {
    id: "midnight",
    label: "Midnight",
    preview: ["#05050f","#818cf8","#4f46e5"],
    bg: "#05050f",
    bgCard: "rgba(10,10,30,.8)",
    bgCardHover: "rgba(10,10,30,.95)",
    bgInput: "rgba(129,140,248,.04)",
    bgNav: "rgba(5,5,15,.9)",
    bgMsg: "rgba(10,10,30,.8)",
    bgUserMsg: "rgba(129,140,248,.08)",
    border: "rgba(129,140,248,.08)",
    borderHover: "rgba(129,140,248,.22)",
    borderInput: "rgba(129,140,248,.1)",
    borderFocus: "rgba(129,140,248,.4)",
    borderUserMsg: "rgba(129,140,248,.2)",
    borderAssistMsg: "rgba(129,140,248,.07)",
    text: "#c7d2fe",
    textHeading: "#e0e7ff",
    textMuted: "#4c5594",
    textDim: "#2d3478",
    textVeryDim: "#1a1f55",
    accent: "#818cf8",
    accentText: "#05050f",
    accentMuted: "rgba(129,140,248,.08)",
    accentBorder: "rgba(129,140,248,.25)",
    logo: "#e0e7ff",
    logoBox: "#818cf8",
    logoBoxText: "#05050f",
    gridLine: "rgba(129,140,248,.02)",
    gradientTop: "rgba(79,70,229,.1)",
    btnPrimary: "#818cf8",
    btnPrimaryText: "#05050f",
    btnGhost: "rgba(129,140,248,.05)",
    btnGhostText: "#4c5594",
    scrollThumb: "rgba(129,140,248,.2)",
    dotReady: "#818cf8",
    dotLoading: "#fbbf24",
    errorBg: "rgba(248,113,113,.07)",
    errorBorder: "rgba(248,113,113,.18)",
    errorText: "#fca5a5",
    successBorder: "rgba(129,140,248,.3)",
    successBg: "rgba(129,140,248,.08)",
    successText: "#818cf8",
    wrongBorder: "rgba(248,113,113,.2)",
    wrongBg: "rgba(248,113,113,.06)",
    wrongText: "#fca5a5",
    fonts: `'DM Serif Display',serif`,
    fontBody: `'Instrument Sans',sans-serif`,
    fontMono: `'DM Mono',monospace`,
    googleFonts: "DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@300;400;500;600",
  },
  rose: {
    id: "rose",
    label: "Rose",
    preview: ["#0f0608","#fda4af","#e11d48"],
    bg: "#0f0608",
    bgCard: "rgba(30,10,15,.8)",
    bgCardHover: "rgba(30,10,15,.95)",
    bgInput: "rgba(253,164,175,.03)",
    bgNav: "rgba(15,6,8,.9)",
    bgMsg: "rgba(30,10,15,.8)",
    bgUserMsg: "rgba(253,164,175,.07)",
    border: "rgba(253,164,175,.08)",
    borderHover: "rgba(253,164,175,.22)",
    borderInput: "rgba(253,164,175,.1)",
    borderFocus: "rgba(253,164,175,.35)",
    borderUserMsg: "rgba(253,164,175,.18)",
    borderAssistMsg: "rgba(253,164,175,.07)",
    text: "#fce7f3",
    textHeading: "#fdf2f8",
    textMuted: "#7c3f55",
    textDim: "#4c2030",
    textVeryDim: "#2d1020",
    accent: "#fda4af",
    accentText: "#0f0608",
    accentMuted: "rgba(253,164,175,.08)",
    accentBorder: "rgba(253,164,175,.25)",
    logo: "#fdf2f8",
    logoBox: "#fda4af",
    logoBoxText: "#0f0608",
    gridLine: "rgba(253,164,175,.02)",
    gradientTop: "rgba(225,29,72,.08)",
    btnPrimary: "#fda4af",
    btnPrimaryText: "#0f0608",
    btnGhost: "rgba(253,164,175,.05)",
    btnGhostText: "#7c3f55",
    scrollThumb: "rgba(253,164,175,.2)",
    dotReady: "#fda4af",
    dotLoading: "#fbbf24",
    errorBg: "rgba(248,113,113,.07)",
    errorBorder: "rgba(248,113,113,.18)",
    errorText: "#fca5a5",
    successBorder: "rgba(253,164,175,.3)",
    successBg: "rgba(253,164,175,.08)",
    successText: "#fda4af",
    wrongBorder: "rgba(248,113,113,.2)",
    wrongBg: "rgba(248,113,113,.06)",
    wrongText: "#fca5a5",
    fonts: `'DM Serif Display',serif`,
    fontBody: `'Instrument Sans',sans-serif`,
    fontMono: `'DM Mono',monospace`,
    googleFonts: "DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@300;400;500;600",
  },
};

// ── STORAGE ────────────────────────────────────────────────────
const sGet  = async (k) => { try { const r=await window.storage.get(k); return r?JSON.parse(r.value):null; } catch { return null; } };
const sSet  = async (k,v) => { try { await window.storage.set(k,JSON.stringify(v)); } catch {} };
const sList = async (p)   => { try { const r=await window.storage.list(p); return r?.keys||[]; } catch { return []; } };
const uid   = () => Math.random().toString(36).slice(2,10);

// ── CLAUDE API ─────────────────────────────────────────────────
async function callClaude(messages, system) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, system, messages }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "I'm unable to respond right now. Please try again.";
}

async function generateQuestion(langName, questionNumber, previousQuestions, lastWasCorrect) {
  const difficulty = lastWasCorrect === null
    ? "beginner to elementary level"
    : lastWasCorrect
      ? "harder than the previous question — escalate to the next CEFR level"
      : "similar difficulty or slightly easier than the previous question";
  const prevContext = previousQuestions.length > 0
    ? `Previously asked (DO NOT REPEAT): ${previousQuestions.join(" | ")}`
    : "This is the first question.";
  const prompt = `Generate a rigorous academic placement question for ${langName} language assessment.
Question number: ${questionNumber}/10. Difficulty: ${difficulty}. ${prevContext}

Test ONE of: morphosyntax, phonology, register, pragmatics, idiomatic usage, reading comprehension, discourse structure, or complex grammar. Avoid trivial single-word translation questions.

Respond ONLY with valid JSON, no markdown fences:
{"question":"...","options":["A","B","C","D"],"correct":0,"explanation":"Academic explanation","topic":"Grammar/Morphology/etc","difficulty":"A1/A2/B1/B2/C1/C2"}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:600, messages:[{role:"user",content:prompt}] }),
    });
    const data = await res.json();
    const text = (data.content?.[0]?.text || "").replace(/```json|```/g,"").trim();
    return JSON.parse(text);
  } catch { return null; }
}

// ── BASE CSS (animations + structural only, no colors) ─────────
const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@300;400;500;600&family=Playfair+Display:wght@400;500;700&family=Lato:wght@300;400;700&display=swap');
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  .fade{animation:fadeUp .45s cubic-bezier(.16,1,.3,1) both}
  .fade2{animation:fadeUp .45s cubic-bezier(.16,1,.3,1) .08s both}
  .fade3{animation:fadeUp .45s cubic-bezier(.16,1,.3,1) .16s both}
  .dot{animation:pulse 1.5s ease-in-out infinite}
  .dot:nth-child(2){animation-delay:.2s}
  .dot:nth-child(3){animation-delay:.4s}
  .lang-card{transition:all .2s ease}
  .lang-card:hover{transform:translateY(-2px)}
  .opt-btn{transition:all .15s ease}
  .opt-btn:disabled{cursor:default}
  .primary-btn{transition:all .2s ease}
  .primary-btn:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px)}
  .primary-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
  .ghost-btn{transition:all .2s ease}
  .level-card{transition:transform .15s ease}
  .level-card:hover{transform:translateX(4px)}
  .history-item{transition:all .2s}
  .input-field:focus{outline:none}
`;

// ── AUTH FIELD — defined OUTSIDE parent to prevent remount ─────
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
          width:"100%", boxSizing:"border-box",
          background:t.bgInput,
          border:`1px solid ${focused ? t.borderFocus : t.borderInput}`,
          borderRadius:10, padding:"12px 16px", color:t.textHeading,
          fontSize:14, fontFamily:t.fontBody,
          transition:"border-color .2s",
          outline:"none",
        }}
      />
    </div>
  );
}

// ── AUTH SCREEN ────────────────────────────────────────────────
function AuthScreen({ onLogin, onBack, t }) {
  const [mode,    setMode]    = useState("signin");
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [err,     setErr]     = useState("");
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
        if (!u)          { setErr("No account found with this email."); setLoading(false); return; }
        if (u.pass!==pass) { setErr("Incorrect password.");             setLoading(false); return; }
        onLogin(u);
      }
    } catch { setErr("Something went wrong. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="fade" style={{ maxWidth:400, margin:"0 auto", padding:"48px 24px" }}>
      <button onClick={onBack} style={{ background:"none", border:`1px solid ${t.border}`, borderRadius:8,
        padding:"7px 14px", color:t.textMuted, fontSize:12, fontFamily:t.fontMono,
        letterSpacing:2, textTransform:"uppercase", marginBottom:40, cursor:"pointer" }}>
        ← Back
      </button>
      <div style={{ fontSize:10, letterSpacing:3, color:t.textMuted, textTransform:"uppercase",
        marginBottom:16, fontFamily:t.fontMono }}>
        {mode === "signin" ? "Return to session" : "Create account"}
      </div>
      <h2 style={{ fontSize:36, fontFamily:t.fonts, fontWeight:400, margin:"0 0 10px", color:t.textHeading }}>
        {mode === "signin" ? "Welcome back" : "Join LinguaAI"}
      </h2>
      <p style={{ color:t.textMuted, fontSize:14, marginBottom:32, lineHeight:1.8, fontWeight:300, fontFamily:t.fontBody }}>
        {mode === "signin" ? "Access your saved sessions and progress." : "Free access. No subscription required."}
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {mode === "signup" && (
          <AuthField label="Name" value={name} onChange={setName} placeholder="Your name" t={t}/>
        )}
        <AuthField label="Email" value={email} onChange={setEmail} placeholder="you@university.edu" type="email" t={t}/>
        <AuthField label="Password" value={pass} onChange={setPass} placeholder="••••••••" type="password" onEnter={submit} t={t}/>

        {err && (
          <div style={{ fontSize:12, color:t.errorText, padding:"10px 14px", background:t.errorBg,
            borderRadius:8, border:`1px solid ${t.errorBorder}`, fontFamily:t.fontMono }}>
            {err}
          </div>
        )}

        <button className="primary-btn" onClick={submit} disabled={loading}
          style={{ background:t.btnPrimary, border:"none", borderRadius:10, padding:"13px",
            color:t.btnPrimaryText, fontSize:14, fontWeight:600, fontFamily:t.fontBody,
            width:"100%", opacity:loading?.5:1, cursor:loading?"not-allowed":"pointer" }}>
          {loading ? "…" : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </div>

      <p style={{ textAlign:"center", marginTop:24, fontSize:13, color:t.textMuted, fontFamily:t.fontBody }}>
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
  return (
    <div style={{ position:"relative" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ background:t.btnGhost, border:`1px solid ${t.border}`, borderRadius:8,
          padding:"6px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ display:"flex", gap:3 }}>
          {THEMES[current].preview.map((c,i) => (
            <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:c }}/>
          ))}
        </div>
        <span style={{ fontSize:11, color:t.textMuted, fontFamily:t.fontMono, letterSpacing:1 }}>
          {THEMES[current].label}
        </span>
      </button>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:t.bgCard,
          border:`1px solid ${t.border}`, borderRadius:12, padding:8, zIndex:200,
          display:"flex", flexDirection:"column", gap:4, minWidth:150,
          boxShadow:"0 20px 60px rgba(0,0,0,.5)" }}>
          {Object.values(THEMES).map(th => (
            <button key={th.id} onClick={() => { onChange(th.id); setOpen(false); }}
              style={{ background: th.id===current ? t.accentMuted : "none",
                border:`1px solid ${th.id===current ? t.accentBorder : "transparent"}`,
                borderRadius:8, padding:"8px 12px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:10, width:"100%" }}>
              <div style={{ display:"flex", gap:4 }}>
                {th.preview.map((c,i) => (
                  <div key={i} style={{ width:9, height:9, borderRadius:"50%", background:c }}/>
                ))}
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

  // Exam state
  const [examQ,       setExamQ]       = useState(null);
  const [examIdx,     setExamIdx]     = useState(0);
  const [examScore,   setExamScore]   = useState(0);
  const [examPrev,    setExamPrev]    = useState([]);
  const [examLoading, setExamLoading] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [showExpl,    setShowExpl]    = useState(false);
  const [chosenAns,   setChosenAns]   = useState(null);

  const chatEnd  = useRef(null);
  const inputRef = useRef(null);

  // ── Focus: restore after loading ends ─────────────────────────
  useEffect(() => {
    if (!loading && screen === "chat") {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [loading, screen]);

  useEffect(() => {
    if (screen === "chat") {
      const id = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(id);
    }
  }, [screen]);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const login    = (u) => { setUser(u); setScreen("home"); };
  const logout   = ()  => { setUser(null); setScreen("home"); setMsgs([]); };
  const pickLang = (l) => { setLang(l); setGoals([]); setScreen("questionnaire"); };

  // ── Exam ──────────────────────────────────────────────────────
  const startExam = async () => {
    setExamIdx(0); setExamScore(0); setExamPrev([]); setLastCorrect(null);
    setShowExpl(false); setChosenAns(null);
    setScreen("exam"); setExamLoading(true);
    const q = await generateQuestion(lang.name, 1, [], null);
    setExamQ(q); setExamLoading(false);
  };

  const answer = async (idx) => {
    if (showExpl || !examQ) return;
    const correct  = examQ.correct === idx;
    const newScore = correct ? examScore + 1 : examScore;
    const newPrev  = [...examPrev, examQ.question];
    const newIdx   = examIdx + 1;
    setChosenAns(idx); setShowExpl(true);

    if (newIdx >= 10) {
      setTimeout(() => {
        const li = Math.min(6, Math.round((newScore / 10) * 6));
        setLevel({ score:newScore, li, ...LEVELS[li] });
        setExamScore(newScore);
        setScreen("results");
      }, 1800);
    } else {
      setExamScore(newScore);
      setTimeout(async () => {
        setShowExpl(false); setChosenAns(null);
        setExamIdx(newIdx); setExamLoading(true);
        const q = await generateQuestion(lang.name, newIdx + 1, newPrev, correct);
        setExamQ(q); setExamLoading(false);
        setLastCorrect(correct); setExamPrev(newPrev);
      }, 1800);
    }
  };

  const pickLevel = (li) => {
    setLevel({ score:null, li, ...LEVELS[li] });
    setScreen("results");
  };

  // ── Chat ──────────────────────────────────────────────────────
  const buildSys = useCallback(() => {
    const gl = goals.map(g => GOALS.find(x => x.id===g)?.label).filter(Boolean).join(", ") || "General proficiency";
    const levelDesc = (level?.score !== null && level?.score !== undefined)
      ? `${level?.cefr} (${level?.name}, placement score ${level?.score}/10)`
      : `${level?.cefr} (${level?.name}, self-assessed)`;
    const li = level?.li ?? 0;
    const depthNote = li <= 1
      ? "keep everything simple and friendly — celebrate every small win, introduce vocabulary through easy real-life scenarios, never overwhelm"
      : li <= 3
      ? "balance encouragement with gentle challenge — introduce grammar patterns through conversation not dry rules, use real examples tied to their goals"
      : "engage as near-equals — discuss nuance, idioms, cultural subtext, and register differences, push for precision and sophistication";
    return `You are an expert ${lang?.name} language tutor. You are warm, curious, patient, and genuinely passionate about language.

Student profile: ${levelDesc} | Goals: ${gl} | Language: ${lang?.name} ${lang?.flag}

Teaching style:
- Write like a real person, not a textbook. Flowing, natural prose only — no bullet lists or rigid structure.
- Be genuinely interested in the student. Reference their goals naturally throughout the lesson.
- At their level: ${depthNote}.
- Correct mistakes gently and naturally — weave the correct form into your reply and briefly explain why, never make them feel bad.
- Always end with ONE engaging question or a small practical exercise to keep the conversation going.
- Use ${lang?.name} examples liberally, always with clear English context. Make the language feel alive.
- Keep each reply to 3–4 paragraphs — focused, warm, and digestible.
- Never use headers, bullet points, or numbered lists. Just talk to them.

First message: Greet them warmly, acknowledge their level and goals naturally (not like reading a form), then immediately dive into something genuinely interesting and useful for their first lesson. Make them excited to be here.`;
  }, [lang, level, goals]);

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
    if (!input.trim() || loading) return;
    const txt  = input.trim(); setInput("");
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

  // ── Shared style helpers ───────────────────────────────────────
  const card = {
    background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:16,
  };

  const PBtn = ({ onClick, children, style={}, disabled=false }) => (
    <button className="primary-btn" onClick={onClick} disabled={disabled}
      style={{ background:t.btnPrimary, border:"none", borderRadius:10, padding:"12px 28px",
        color:t.btnPrimaryText, fontSize:14, fontWeight:600, fontFamily:t.fontBody,
        letterSpacing:.3, cursor:"pointer", ...style }}>
      {children}
    </button>
  );

  const GBtn = ({ onClick, children, style={} }) => (
    <button className="ghost-btn" onClick={onClick}
      style={{ background:t.btnGhost, border:`1px solid ${t.border}`, borderRadius:10,
        padding:"12px 22px", color:t.btnGhostText, fontSize:13, fontFamily:t.fontBody,
        cursor:"pointer", transition:"all .2s", ...style }}>
      {children}
    </button>
  );

  const Bk = ({ onClick }) => (
    <button onClick={onClick}
      style={{ background:"none", border:`1px solid ${t.border}`, borderRadius:8,
        padding:"7px 14px", color:t.textMuted, fontSize:12, fontFamily:t.fontMono,
        letterSpacing:2, textTransform:"uppercase", marginBottom:40, cursor:"pointer" }}>
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

  // ── Inline chat input — no component, just JSX ─────────────────
  const handleInputChange = (e) => setInput(e.target.value);
  const handleKeyDown     = (e) => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  // ── RENDER ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:t.bg, fontFamily:t.fontBody, color:t.text, position:"relative" }}>
      <style>{BASE_CSS + `
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${t.scrollThumb};border-radius:2px}
        .lang-card:hover{background:${t.bgCardHover}!important;border-color:${t.borderHover}!important}
        .ghost-btn:hover{background:${t.accentMuted}!important;border-color:${t.borderHover}!important}
        .opt-btn:hover:not(:disabled){background:${t.accentMuted}!important;border-color:${t.borderHover}!important}
        .history-item:hover{background:${t.bgCardHover}!important;border-color:${t.borderHover}!important}
      `}</style>

      {/* Grid overlay */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        backgroundImage:`linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
        backgroundSize:"48px 48px" }}/>
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        background:`radial-gradient(ellipse 80% 50% at 50% -5%,${t.gradientTop} 0%,transparent 70%)` }}/>

      {/* ── NAV ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 28px",
        height:54, display:"flex", alignItems:"center", justifyContent:"space-between",
        background:t.bgNav, backdropFilter:"blur(20px)", borderBottom:`1px solid ${t.border}` }}>
        <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:t.logoBox,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:t.logoBoxText, fontFamily:t.fontMono }}>
            λ
          </div>
          <span style={{ fontSize:16, fontFamily:t.fonts, color:t.logo, letterSpacing:-.3 }}>LinguaAI</span>
        </button>

        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <ThemePicker current={themeId} onChange={setThemeId} t={t}/>

          <div style={{ width:1, height:18, background:t.border }}/>

          {user ? (<>
            <button onClick={loadHistory} style={{ background:"none", border:"none", color:t.textMuted,
              cursor:"pointer", fontSize:13, fontFamily:t.fontBody, transition:"color .15s" }}
              onMouseOver={e=>e.target.style.color=t.textHeading}
              onMouseOut={e=>e.target.style.color=t.textMuted}>
              Sessions
            </button>
            <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:t.textMuted,
              cursor:"pointer", fontSize:13, fontFamily:t.fontBody, transition:"color .15s" }}
              onMouseOver={e=>e.target.style.color=t.textHeading}
              onMouseOut={e=>e.target.style.color=t.textMuted}>
              Languages
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:t.accentMuted,
                border:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:12, color:t.accent, fontFamily:t.fontMono, fontWeight:600 }}>
                {(user.name || user.email || "?")[0].toUpperCase()}
              </div>
              <button onClick={logout} style={{ background:"none", border:"none", color:t.textDim,
                cursor:"pointer", fontSize:12, fontFamily:t.fontBody }}>
                Sign out
              </button>
            </div>
          </>) : (
            <button className="ghost-btn" onClick={() => setScreen("auth")}
              style={{ background:t.btnGhost, border:`1px solid ${t.border}`, borderRadius:8,
                padding:"7px 18px", color:t.textMuted, fontSize:13, cursor:"pointer", fontFamily:t.fontBody }}>
              Sign in
            </button>
          )}
        </div>
      </nav>

      <div style={{ paddingTop:54, position:"relative", zIndex:1 }}>

        {/* ══ HOME ══ */}
        {screen === "home" && (
          <div className="fade" style={{ maxWidth:1040, margin:"0 auto", padding:"72px 24px 48px" }}>
            <div style={{ marginBottom:64 }}>
              <div className="fade" style={{ fontSize:11, letterSpacing:3, color:t.textMuted, textTransform:"uppercase", marginBottom:20, fontFamily:t.fontMono }}>
                Academic Language Instruction · Powered by Claude
              </div>
              <h1 className="fade2" style={{ fontSize:"clamp(52px,8vw,96px)", fontFamily:t.fonts,
                fontWeight:400, margin:"0 0 4px", lineHeight:.95, color:t.textHeading, letterSpacing:-2 }}>
                Lingua<span style={{ fontStyle:"italic", color:t.textMuted }}>AI</span>
              </h1>
              <p className="fade3" style={{ fontSize:16, color:t.textMuted, margin:"24px 0 0", maxWidth:440, lineHeight:1.9, fontWeight:300 }}>
                Rigorous AI-powered language instruction calibrated to your CEFR level, academic goals, and scholarly needs.
              </p>
              <div className="fade3" style={{ display:"flex", gap:32, marginTop:28, flexWrap:"wrap" }}>
                {["AI Adaptive Placement","CEFR-Aligned Curriculum","16 Languages","Persistent Sessions"].map(f => (
                  <span key={f} style={{ fontSize:10, letterSpacing:2, color:t.textDim, textTransform:"uppercase", fontFamily:t.fontMono }}>{f}</span>
                ))}
              </div>
            </div>
            <div style={{ maxWidth:320, marginBottom:28 }}>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Filter languages or regions…"
                style={{ width:"100%", background:t.bgInput, border:`1px solid ${t.borderInput}`,
                  borderRadius:10, padding:"11px 16px", color:t.textHeading, fontSize:13, fontFamily:t.fontBody }}
                onFocus={e => e.target.style.borderColor = t.borderFocus}
                onBlur={e  => e.target.style.borderColor = t.borderInput}
              />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))", gap:10 }}>
              {filtered.map((l, i) => (
                <button key={l.code} className="lang-card" onClick={() => pickLang(l)}
                  style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:14,
                    padding:"22px 14px", color:t.text, textAlign:"center", display:"flex",
                    flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer",
                    animation:`fadeUp .4s cubic-bezier(.16,1,.3,1) ${i*0.03}s both` }}>
                  <div style={{ fontSize:30 }}>{l.flag}</div>
                  <div style={{ fontSize:13, fontWeight:500, color:t.textHeading, fontFamily:t.fontBody }}>{l.name}</div>
                  <div style={{ fontSize:9, color:t.textDim, letterSpacing:1.5, textTransform:"uppercase", fontFamily:t.fontMono }}>{l.region}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ AUTH ══ */}
        {screen === "auth" && <AuthScreen onLogin={login} onBack={() => setScreen("home")} t={t}/>}

        {/* ══ QUESTIONNAIRE ══ */}
        {screen === "questionnaire" && lang && (
          <div className="fade" style={{ maxWidth:620, margin:"0 auto", padding:"48px 24px" }}>
            <Bk onClick={() => setScreen("home")}/>
            <div style={{ fontSize:10, letterSpacing:3, color:t.textMuted, textTransform:"uppercase", marginBottom:16, fontFamily:t.fontMono }}>
              {lang.flag} {lang.name} · Step 1 of 2
            </div>
            <h2 style={{ fontSize:36, fontFamily:t.fonts, fontWeight:400, marginBottom:10, color:t.textHeading, lineHeight:1.1 }}>
              Define your objectives
            </h2>
            <p style={{ color:t.textMuted, fontSize:14, lineHeight:1.85, marginBottom:32, fontWeight:300 }}>
              Your AI tutor will calibrate lesson content, register, and domain-specific vocabulary to these goals.
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:32 }}>
              {GOALS.map(g => {
                const sel = goals.includes(g.id);
                return (
                  <button key={g.id} className="goal-card" onClick={() => setGoals(p => p.includes(g.id)?p.filter(x=>x!==g.id):[...p,g.id])}
                    style={{ background:sel?t.accentMuted:t.bgCard, border:`1px solid ${sel?t.accentBorder:t.border}`,
                      borderRadius:12, padding:"18px 16px", textAlign:"left", cursor:"pointer", transition:"all .2s" }}>
                    <div style={{ fontSize:20, marginBottom:10 }}>{g.icon}</div>
                    <div style={{ fontSize:13, fontWeight:500, color:sel?t.accent:t.text, marginBottom:4, fontFamily:t.fontBody }}>{g.label}</div>
                    <div style={{ fontSize:11, color:t.textMuted, lineHeight:1.6, fontWeight:300 }}>{g.desc}</div>
                    {sel && <div style={{ marginTop:10, fontSize:9, color:t.textMuted, letterSpacing:2, fontFamily:t.fontMono }}>✓ SELECTED</div>}
                  </button>
                );
              })}
            </div>
            <div style={{ ...card, padding:"20px 22px", marginBottom:16 }}>
              <div style={{ fontSize:10, letterSpacing:2, color:t.textMuted, textTransform:"uppercase", marginBottom:12, fontFamily:t.fontMono }}>
                Level assessment method
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <PBtn onClick={startExam} style={{ flex:1, fontSize:13 }}>Take AI Placement Exam →</PBtn>
                <GBtn onClick={() => setScreen("manual-level")} style={{ flex:1 }}>Set Level Manually</GBtn>
              </div>
            </div>
          </div>
        )}

        {/* ══ MANUAL LEVEL ══ */}
        {screen === "manual-level" && lang && (
          <div className="fade" style={{ maxWidth:560, margin:"0 auto", padding:"48px 24px" }}>
            <Bk onClick={() => setScreen("questionnaire")}/>
            <div style={{ fontSize:10, letterSpacing:3, color:t.textMuted, textTransform:"uppercase", marginBottom:16, fontFamily:t.fontMono }}>
              {lang.flag} {lang.name} · Self-Assessment
            </div>
            <h2 style={{ fontSize:36, fontFamily:t.fonts, fontWeight:400, marginBottom:10, color:t.textHeading }}>Select your level</h2>
            <p style={{ color:t.textMuted, fontSize:14, lineHeight:1.85, marginBottom:32, fontWeight:300 }}>
              Choose the CEFR level that best reflects your current competence.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {Object.entries(LEVELS).map(([li, lv]) => (
                <button key={li} className="level-card" onClick={() => pickLevel(Number(li))}
                  style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:12,
                    padding:"18px 22px", textAlign:"left", cursor:"pointer",
                    display:"flex", alignItems:"center", gap:18 }}>
                  <div style={{ fontSize:13, color:lv.color, width:36, flexShrink:0, fontWeight:500, fontFamily:t.fontMono }}>{lv.cefr}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:500, color:t.textHeading, marginBottom:3, fontFamily:t.fontBody }}>{lv.name}</div>
                    <div style={{ fontSize:11, color:t.textMuted, fontWeight:300, lineHeight:1.6 }}>{lv.desc}</div>
                  </div>
                  <div style={{ fontSize:18, color:t.textDim }}>{lv.emoji}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ EXAM ══ */}
        {screen === "exam" && lang && (
          <div className="fade" style={{ maxWidth:640, margin:"0 auto", padding:"48px 24px" }}>
            <Bk onClick={() => setScreen("questionnaire")}/>
            <div style={{ marginBottom:32 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ fontSize:10, letterSpacing:3, color:t.textMuted, textTransform:"uppercase", fontFamily:t.fontMono }}>
                  {lang.flag} Placement Assessment
                </div>
                <div style={{ fontSize:11, color:t.textMuted, fontFamily:t.fontMono }}>{examIdx+1} / 10</div>
              </div>
              <div style={{ height:2, background:t.border, borderRadius:1 }}>
                <div style={{ height:"100%", width:`${examIdx/10*100}%`, background:t.accent, borderRadius:1, transition:"width .5s ease" }}/>
              </div>
            </div>

            {examLoading ? (
              <div style={{ ...card, padding:"60px 30px", textAlign:"center" }}>
                <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:16 }}>
                  <div className="dot" style={{ width:7, height:7, borderRadius:"50%", background:t.textMuted }}/>
                  <div className="dot" style={{ width:7, height:7, borderRadius:"50%", background:t.textMuted }}/>
                  <div className="dot" style={{ width:7, height:7, borderRadius:"50%", background:t.textMuted }}/>
                </div>
                <div style={{ fontSize:11, color:t.textDim, letterSpacing:2, fontFamily:t.fontMono }}>GENERATING QUESTION</div>
              </div>
            ) : examQ ? (
              <div className="fade" style={{ ...card, padding:"32px 28px" }}>
                <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
                  {examQ.topic     && <Tag>{examQ.topic}</Tag>}
                  {examQ.difficulty && <Tag>{examQ.difficulty}</Tag>}
                </div>
                <h2 style={{ fontSize:18, fontFamily:t.fonts, fontWeight:400, marginBottom:26, lineHeight:1.6, color:t.textHeading }}>
                  {examQ.question}
                </h2>
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:showExpl ? 20 : 0 }}>
                  {examQ.options?.map((opt, i) => {
                    let bg = t.bgInput, border = t.border, color = t.text;
                    if (showExpl) {
                      if (i === examQ.correct) { bg = t.successBg; border = t.successBorder; color = t.successText; }
                      else if (i === chosenAns) { bg = t.wrongBg; border = t.wrongBorder; color = t.wrongText; }
                    }
                    return (
                      <button key={i} className="opt-btn" onClick={() => answer(i)} disabled={showExpl}
                        style={{ background:bg, border:`1px solid ${border}`, borderRadius:10,
                          padding:"13px 18px", color, textAlign:"left", fontSize:13, cursor:"pointer",
                          display:"flex", alignItems:"center", gap:14, fontFamily:t.fontBody }}>
                        <span style={{ fontSize:10, width:20, textAlign:"center", color:t.textDim, flexShrink:0, fontFamily:t.fontMono }}>
                          {["A","B","C","D"][i]}
                        </span>
                        {opt}
                        {showExpl && i === examQ.correct && <span style={{ marginLeft:"auto" }}>✓</span>}
                        {showExpl && i === chosenAns && i !== examQ.correct && <span style={{ marginLeft:"auto" }}>✗</span>}
                      </button>
                    );
                  })}
                </div>
                {showExpl && examQ.explanation && (
                  <div className="fade" style={{ background:t.bgInput, border:`1px solid ${t.border}`,
                    borderRadius:10, padding:"14px 16px", marginTop:4 }}>
                    <div style={{ fontSize:9, color:t.textMuted, letterSpacing:2, textTransform:"uppercase", marginBottom:6, fontFamily:t.fontMono }}>Explanation</div>
                    <div style={{ fontSize:12, color:t.textMuted, lineHeight:1.7, fontWeight:300 }}>{examQ.explanation}</div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ ...card, padding:40, textAlign:"center", color:t.textMuted }}>
                Failed to generate question.{" "}
                <button onClick={startExam} style={{ color:t.accent, background:"none", border:"none", cursor:"pointer", fontFamily:t.fontBody }}>Retry</button>
              </div>
            )}
          </div>
        )}

        {/* ══ RESULTS ══ */}
        {screen === "results" && level && (
          <div className="fade" style={{ maxWidth:520, margin:"0 auto", padding:"72px 24px", textAlign:"center" }}>
            <div style={{ fontSize:10, letterSpacing:4, color:t.textMuted, textTransform:"uppercase", marginBottom:20, fontFamily:t.fontMono }}>
              {lang?.flag} {lang?.name} · Assessment Complete
            </div>
            <div style={{ fontSize:11, color:level.color, fontFamily:t.fontMono, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>
              CEFR {level.cefr}
            </div>
            <h2 style={{ fontSize:52, fontFamily:t.fonts, fontWeight:400, margin:"0 0 12px", color:t.textHeading, lineHeight:1 }}>
              {level.name}
            </h2>
            <p style={{ color:t.textMuted, fontSize:14, marginBottom:8, lineHeight:1.8, fontWeight:300 }}>{level.desc}</p>
            {level.score !== null
              ? <p style={{ color:t.textDim, fontSize:12, marginBottom:44, letterSpacing:1, fontFamily:t.fontMono }}>Score: {level.score}/10</p>
              : <p style={{ color:t.textDim, fontSize:12, marginBottom:44, letterSpacing:1, fontFamily:t.fontMono }}>Self-assessed</p>
            }
            <div style={{ ...card, padding:"24px 26px", marginBottom:32 }}>
              {level.score !== null && (
                <div style={{ display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap", marginBottom:goals.length>0?20:0 }}>
                  {Array.from({ length:10 }).map((_,i) => (
                    <div key={i} style={{ width:30, height:30, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center",
                      background: i<level.score ? t.accentMuted : t.bgInput,
                      border: `1px solid ${i<level.score ? t.accentBorder : t.border}`,
                      fontSize:11, color: i<level.score ? t.accent : t.textDim }}>
                      {i < level.score ? "✓" : "·"}
                    </div>
                  ))}
                </div>
              )}
              {goals.length > 0 && (
                <div style={{ borderTop: level.score!==null ? `1px solid ${t.border}` : "none", paddingTop: level.score!==null?18:0 }}>
                  <div style={{ fontSize:9, letterSpacing:2, color:t.textMuted, textTransform:"uppercase", marginBottom:10, fontFamily:t.fontMono }}>
                    Learning objectives
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center" }}>
                    {goals.map(gid => { const g = GOALS.find(x => x.id===gid); return g ? (
                      <span key={gid} style={{ fontSize:9, padding:"3px 10px", borderRadius:20, background:t.accentMuted,
                        color:t.textMuted, letterSpacing:1.5, textTransform:"uppercase",
                        border:`1px solid ${t.border}`, fontFamily:t.fontMono }}>
                        {g.label}
                      </span>) : null;
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
            {!user && <p style={{ color:t.textDim, fontSize:10, marginTop:18, letterSpacing:1.5, textTransform:"uppercase", fontFamily:t.fontMono }}>Sign in to persist sessions</p>}
          </div>
        )}

        {/* ══ CHAT ══ */}
        {screen === "chat" && (
          <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 54px)" }}>
            {/* Chat header */}
            <div style={{ padding:"10px 24px", borderBottom:`1px solid ${t.border}`,
              background:t.bgNav, backdropFilter:"blur(20px)",
              display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:t.textMuted, cursor:"pointer", fontSize:16 }}>←</button>
                <span style={{ fontSize:20 }}>{lang?.flag}</span>
                <div>
                  <div style={{ fontSize:14, fontWeight:500, color:t.textHeading, fontFamily:t.fontBody }}>{lang?.name}</div>
                  <div style={{ fontSize:10, color:t.textMuted, letterSpacing:1.5, textTransform:"uppercase", fontFamily:t.fontMono }}>
                    {level?.cefr} · {level?.name}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:6, height:6, borderRadius:"50%",
                  background:loading?t.dotLoading:t.dotReady,
                  boxShadow:`0 0 8px ${loading?t.dotLoading:t.dotReady}`, transition:"all .3s" }}/>
                <span style={{ fontSize:9, color:t.textDim, letterSpacing:2, fontFamily:t.fontMono }}>
                  {loading ? "THINKING" : "READY"}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", padding:"28px 22px",
              maxWidth:760, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start",
                  marginBottom:20, animation:"fadeUp .3s ease both" }}>
                  {m.role==="assistant" && (
                    <div style={{ width:30, height:30, borderRadius:8, flexShrink:0,
                      background:t.accentMuted, border:`1px solid ${t.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:14, marginRight:10, marginTop:3 }}>
                      {lang?.flag}
                    </div>
                  )}
                  <div style={{
                    maxWidth:"76%",
                    background: m.role==="user" ? t.bgUserMsg : t.bgMsg,
                    border: `1px solid ${m.role==="user" ? t.borderUserMsg : t.borderAssistMsg}`,
                    borderRadius: m.role==="user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    padding:"12px 16px", fontSize:13, lineHeight:1.85,
                    color:t.text, whiteSpace:"pre-wrap", fontWeight:300, fontFamily:t.fontBody,
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:t.accentMuted,
                    border:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>
                    {lang?.flag}
                  </div>
                  <div style={{ background:t.bgMsg, border:`1px solid ${t.borderAssistMsg}`,
                    borderRadius:"16px 16px 16px 4px", padding:"12px 18px", display:"flex", gap:5, alignItems:"center" }}>
                    <div className="dot" style={{ width:5, height:5, borderRadius:"50%", background:t.textMuted }}/>
                    <div className="dot" style={{ width:5, height:5, borderRadius:"50%", background:t.textMuted }}/>
                    <div className="dot" style={{ width:5, height:5, borderRadius:"50%", background:t.textMuted }}/>
                  </div>
                </div>
              )}
              <div ref={chatEnd}/>
            </div>

            {/* Input — raw input element, NOT a sub-component, so no remount */}
            <div style={{ padding:"12px 22px 20px", borderTop:`1px solid ${t.border}`,
              background:t.bgNav, backdropFilter:"blur(20px)", flexShrink:0 }}>
              <div style={{ maxWidth:760, margin:"0 auto", display:"flex", gap:10 }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message in English or ${lang?.name}…`}
                  disabled={loading}
                  style={{
                    flex:1, background:t.bgInput, border:`1px solid ${t.borderInput}`,
                    borderRadius:10, padding:"12px 16px", color:t.textHeading,
                    fontSize:13, fontFamily:t.fontBody, transition:"border-color .2s",
                    opacity: loading ? .6 : 1,
                  }}
                  onFocus={e => e.target.style.borderColor = t.borderFocus}
                  onBlur={e  => e.target.style.borderColor = t.borderInput}
                />
                <button onClick={send} disabled={loading || !input.trim()} className="primary-btn"
                  style={{ background: input.trim()&&!loading ? t.btnPrimary : t.bgInput,
                    border:`1px solid ${input.trim()&&!loading ? "transparent" : t.border}`,
                    borderRadius:10, padding:"12px 18px",
                    color: input.trim()&&!loading ? t.btnPrimaryText : t.textDim,
                    fontSize:16, fontWeight:600, cursor: input.trim()&&!loading ? "pointer" : "not-allowed",
                    opacity: loading ? .5 : 1 }}>
                  →
                </button>
              </div>
              <div style={{ textAlign:"center", marginTop:8, fontSize:9, color:t.textVeryDim,
                letterSpacing:2, textTransform:"uppercase", fontFamily:t.fontMono }}>
                Enter to send · {lang?.name} or English
              </div>
            </div>
          </div>
        )}

        {/* ══ HISTORY ══ */}
        {screen === "history" && (
          <div className="fade" style={{ maxWidth:680, margin:"0 auto", padding:"48px 24px" }}>
            <Bk onClick={() => setScreen("home")}/>
            <div style={{ fontSize:10, letterSpacing:3, color:t.textMuted, textTransform:"uppercase", marginBottom:16, fontFamily:t.fontMono }}>
              Your Sessions
            </div>
            <h2 style={{ fontSize:36, fontFamily:t.fonts, fontWeight:400, marginBottom:8, color:t.textHeading }}>Session History</h2>
            <p style={{ color:t.textMuted, fontSize:14, marginBottom:36, fontWeight:300 }}>Resume any previous learning session.</p>
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
                    padding:"20px 24px", textAlign:"left", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <span style={{ fontSize:24 }}>{c.flag}</span>
                    <div>
                      <div style={{ fontSize:14, fontWeight:500, color:t.textHeading, marginBottom:4, fontFamily:t.fontBody }}>{c.langName}</div>
                      <div style={{ fontSize:10, color:t.textMuted, letterSpacing:1, fontFamily:t.fontMono }}>
                        {c.cefr||""} {c.levelName} · {c.messages?.length||0} messages
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
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
