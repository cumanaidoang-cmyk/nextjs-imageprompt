import React, { useEffect, useMemo, useState } from "react";

// Simple, dependency‑free page component you can drop into Next.js app as app/page.tsx // or into a React project. Uses Tailwind classes for styling. // Data persists in localStorage so you can add options from the web and keep them.

// ---------- Utility ---------- const KEY = "prompt-form-v2";

function loadSaved<T>(fallback: T): T { if (typeof window === "undefined") return fallback; try { const raw = localStorage.getItem(KEY); return raw ? { ...fallback, ...JSON.parse(raw) } : fallback; } catch { return fallback; } }

function saveState(state: any) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }

// ---------- Default Options ---------- const defaultOptions = { character: [ "Baby cappuccino cup head — joyful, plush vibe", "Tiny orca — cute, toy scale", "Humanoid wood cylinder — friendly mascot", "Tatata — fluffy teapot creature", ], action: [ "Smiles and stomps cutely", "Waves at camera and nods", "Hugs a tiny plush friend", "Bites and chews playfully", ], background: [ "Cozy bright room, wooden floor", "Colorful toy studio, soft props", "Cafe corner with warm light", "Plain pastel backdrop", ], camera: [ "Medium shot, eye‑level, gentle push‑in", "Close‑up, shallow depth of field", "Handheld, slight shake, chest‑level", "Low angle, cute hero look", ], ambience: [ "Warm studio lighting, soft shadows", "Golden hour glow, gentle rim light", "Bright evenly lit toy photography", "Cinematic softbox lighting, creamy bokeh", ], style: [ "3D hyper‑realistic baby doll style; photorealistic skin texture with soft blush; doll‑like proportions; plush toy realism; ultra‑detailed; 8K render", "3D cartoon Pixar‑inspired; soft plastic material; toy‑like; bright colors; clean lines", "Photorealistic cinematic baby; natural skin pores; filmic lighting; detailed micro‑texture", "Plush toy style; short velvet fur; soft fabric seams; toy photography setup", ], };

// ---------- Reusable Field ---------- function Field({ label, name, options, value, onChange, onAdd, }: { label: string; name: keyof typeof defaultOptions; options: string[]; value: string; onChange: (v: string) => void; onAdd: (v: string) => void; }) { const [newOpt, setNewOpt] = useState(""); return ( <div className="space-y-2"> <label className="block text-sm font-medium text-gray-800">{label}</label> <div className="flex gap-2"> <select className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10" value={value} onChange={(e) => onChange(e.target.value)} > <option value="">— Select {label.toLowerCase()} —</option> {options.map((opt, i) => ( <option key={i} value={opt}> {opt} </option> ))} </select> </div> <div className="flex items-center gap-2"> <input className="flex-1 rounded-xl border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" placeholder={Add new ${label.toLowerCase()}…} value={newOpt} onChange={(e) => setNewOpt(e.target.value)} /> <button type="button" onClick={() => { const v = newOpt.trim(); if (!v) return; onAdd(v); setNewOpt(""); }} className="rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-black/90 active:scale-[0.98]" > Add </button> </div> </div> ); }

export default function PromptFormPage() { const [state, setState] = useState(() => loadSaved({ options: defaultOptions, selected: { character: "", action: "", background: "", camera: "", ambience: "", style: defaultOptions.style[0], }, lang: "en" as "en" | "id", }) );

useEffect(() => saveState(state), [state]);

const setSelected = (k: keyof typeof state.selected, v: string) => setState((s: any) => ({ ...s, selected: { ...s.selected, [k]: v } }));

const addOption = (k: keyof typeof state.options, v: string) => setState((s: any) => ({ ...s, options: { ...s.options, [k]: Array.from(new Set([v, ...s.options[k]])) }, }));

const prompt = useMemo(() => { const { character, action, background, camera, ambience, style } = state.selected;

const parts = [
  character && `Character: ${character}`,
  action && `Action: ${action}`,
  background && `Background: ${background}`,
  camera && `Camera: ${camera}`,
  ambience && `Ambience: ${ambience}`,
  style && `Style/Rendering: ${style}`,
].filter(Boolean);

if (state.lang === "id") {
  return parts
    .join(" \n")
    .replace("Character:", "Karakter:")
    .replace("Action:", "Aksi:")
    .replace("Background:", "Latar:")
    .replace("Camera:", "Kamera:")
    .replace("Ambience:", "Suasana:")
    .replace("Style/Rendering:", "Gaya/Rendering:");
}
return parts.join(" \n");

}, [state.selected, state.lang]);

const copy = async () => { try { await navigator.clipboard.writeText(prompt); alert("Prompt copied!"); } catch { // fallback const ta = document.createElement("textarea"); ta.value = prompt; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); alert("Prompt copied!"); } };

const reset = () => setState((s: any) => ({ ...s, selected: { character: "", action: "", background: "", camera: "", ambience: "", style: s.options.style?.[0] || "", }, }));

return ( <main className="mx-auto max-w-3xl px-4 py-8"> <div className="mb-6 flex items-center justify-between"> <h1 className="text-2xl font-bold">AI Prompt Builder</h1> <div className="flex items-center gap-2"> <span className="text-sm text-gray-600">Language</span> <select className="rounded-xl border border-gray-300 p-2 text-sm" value={state.lang} onChange={(e) => setState((s: any) => ({ ...s, lang: e.target.value }))} > <option value="en">EN</option> <option value="id">ID</option> </select> </div> </div>

<div className="grid grid-cols-1 gap-6">
    <Field
      label="Character"
      name="character"
      options={state.options.character}
      value={state.selected.character}
      onChange={(v) => setSelected("character", v)}
      onAdd={(v) => addOption("character", v)}
    />
    <Field
      label="Action"
      name="action"
      options={state.options.action}
      value={state.selected.action}
      onChange={(v) => setSelected("action", v)}
      onAdd={(v) => addOption("action", v)}
    />
    <Field
      label="Background"
      name="background"
      options={state.options.background}
      value={state.selected.background}
      onChange={(v) => setSelected("background", v)}
      onAdd={(v) => addOption("background", v)}
    />
    <Field
      label="Camera"
      name="camera"
      options={state.options.camera}
      value={state.selected.camera}
      onChange={(v) => setSelected("camera", v)}
      onAdd={(v) => addOption("camera", v)}
    />
    <Field
      label="Ambience"
      name="ambience"
      options={state.options.ambience}
      value={state.selected.ambience}
      onChange={(v) => setSelected("ambience", v)}
      onAdd={(v) => addOption("ambience", v)}
    />
    <Field
      label="Style"
      name="style"
      options={state.options.style}
      value={state.selected.style}
      onChange={(v) => setSelected("style", v)}
      onAdd={(v) => addOption("style", v)}
    />
  </div>

  <div className="mt-8 space-y-3">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Generated Prompt</h2>
      <div className="flex gap-2">
        <button
          onClick={copy}
          className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 active:scale-[0.98]"
        >
          Copy Prompt
        </button>
        <button
          onClick={reset}
          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 active:scale-[0.98]"
        >
          Reset
        </button>
      </div>
    </div>
    <textarea
      className="h-48 w-full rounded-2xl border border-gray-300 bg-white p-4 text-sm leading-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
      value={prompt}
      readOnly
    />
  </div>

  <p className="mt-6 text-xs text-gray-500">
    Tip: tambahkan versi suara/efek audio di bagian akhir prompt bila perlu.
  </p>
</main>

); }

