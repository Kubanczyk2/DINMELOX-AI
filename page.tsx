"use client";

import { useState } from "react";

type ApiResult = Record<string, unknown>;

export default function Home() {
  const [lyrics, setLyrics] = useState("");
  const [style, setStyle] = useState("Polski rap, dark trap, mocny bas, nowoczesne bębny");
  const [title, setTitle] = useState("");
  const [voice, setVoice] = useState("male");
  const [instrumental, setInstrumental] = useState(false);
  const [busy, setBusy] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState("");

  async function generate() {
    setBusy(true);
    setError("");
    setResult(null);
    setTaskId("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lyrics, style, title, voice, instrumental }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Nie udało się rozpocząć generowania.");
      setResult(data);
      if (typeof data.id === "string") setTaskId(data.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wystąpił nieznany błąd.");
    } finally {
      setBusy(false);
    }
  }

  async function checkTask() {
    if (!taskId) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/task/${encodeURIComponent(taskId)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Nie udało się sprawdzić zadania.");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wystąpił nieznany błąd.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">D</span><span>DINMELOX<span className="red"> AI</span></span></div>
        <div className="side-label">MENU</div>
        <button className="nav active">✦ <span>Utwórz muzykę</span></button>
        <button className="nav" onClick={() => alert("Biblioteka użytkownika będzie dodana w kolejnym etapie.")}>♫ <span>Moja biblioteka</span></button>
        <button className="nav" onClick={() => alert("Studio audio będzie dodane w kolejnym etapie.")}>▤ <span>Studio audio</span></button>
        <div className="sidebar-bottom"><div className="status-dot" /> Silnik AI: konfiguracja</div>
      </aside>

      <section className="main">
        <header className="topbar"><div className="crumb">WORKSPACE <span>/</span> GENERATOR</div><div className="profile"><span className="avatar">DK</span> Konto demo</div></header>
        <div className="content">
          <div className="hero">
            <div className="eyebrow"><span className="pulse" /> AI MUSIC GENERATOR</div>
            <h1>Twoja muzyka.<br /><span>Twoje zasady.</span></h1>
            <p>Opisz brzmienie, dodaj tekst i rozpocznij tworzenie własnego utworu.</p>
          </div>

          <div className="workspace-grid">
            <section className="panel editor">
              <div className="panel-head"><div><div className="panel-kicker">NOWY PROJEKT</div><h2>Stwórz utwór</h2></div><span className="tag">BETA</span></div>
              <label>Tytuł utworu <span>OPCJONALNIE</span></label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Np. Ostatnia noc" maxLength={80} />
              <label>Opis stylu muzycznego</label>
              <textarea className="style-input" value={style} onChange={e => setStyle(e.target.value)} placeholder="Opisz gatunek, tempo, instrumenty, klimat..." rows={3} maxLength={1024} />
              <div className="field-row">
                <div className="field"><label>Wokal</label><select value={voice} onChange={e => setVoice(e.target.value)} disabled={instrumental}><option value="male">Męski</option><option value="female">Damski</option></select></div>
                <div className="field"><label>Tryb</label><select value={instrumental ? "instrumental" : "song"} onChange={e => setInstrumental(e.target.value === "instrumental")}><option value="song">Piosenka</option><option value="instrumental">Instrumental</option></select></div>
              </div>
              <label>Tekst piosenki <span>{instrumental ? "POMIJANY W TRYBIE INSTRUMENTALNYM" : "WYMAGANY"}</span></label>
              <textarea className="lyrics" value={lyrics} onChange={e => setLyrics(e.target.value)} placeholder={"[Zwrotka 1]\\nWpisz tutaj swój tekst...\\n\\n[Refren]\\nWpisz refren..."} rows={8} maxLength={5000} disabled={instrumental} />
              <div className="bottom-row"><span>{lyrics.length}/5000 znaków</span><button className="generate" onClick={generate} disabled={busy || !style.trim() || (!instrumental && !lyrics.trim())}>{busy ? "Przetwarzanie..." : "✦  Generuj muzykę"}</button></div>
              <p className="fineprint">Generowanie może zużywać środki na koncie dostawcy API. Sprawdź warunki i licencję przed publikacją utworów.</p>
            </section>

            <aside className="right-column">
              <section className="panel tips">
                <div className="panel-kicker">PODPOWIEDŹ</div><h3>Jak opisać brzmienie?</h3>
                <p>Podaj gatunek, tempo, nastrój, instrumenty i rodzaj wokalu.</p>
                <div className="example">„Energetyczny pop-rap, 145 BPM, mocny bas, syntezatory, chwytliwy refren”.</div>
              </section>
              <section className="panel result-panel">
                <div className="panel-kicker">TWOJA GENERACJA</div><h3>Wynik pojawi się tutaj</h3>
                <div className="record"><div className="record-inner">♫</div></div>
                <p>Po rozpoczęciu generowania zobaczysz tutaj identyfikator zadania i jego status.</p>
                {taskId && <button className="secondary" onClick={checkTask} disabled={busy}>Sprawdź status zadania</button>}
                {taskId && <code className="task-id">ID: {taskId}</code>}
              </section>
            </aside>
          </div>
          {error && <div className="alert error">{error}</div>}
          {result && <section className="panel response"><div className="panel-kicker">ODPOWIEDŹ API</div><pre>{JSON.stringify(result, null, 2)}</pre><p className="fineprint">Na tym etapie pokazujemy odpowiedź silnika. W następnym etapie dopasujemy odtwarzacz i pobieranie do rzeczywistego formatu odpowiedzi API.</p></section>}
          <footer>DINMELOX AI <span>•</span> Music creation workspace</footer>
        </div>
      </section>
    </main>
  );
}
