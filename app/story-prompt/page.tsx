'use client';
import React, { useEffect, useMemo, useState } from 'react';

// —— LocalStorage key
const KEY = 'prompt-form-v2';

// —— Types
type FieldKey = 'character' | 'action' | 'background' | 'camera' | 'ambience' | 'style';

type OptionsMap = Record<FieldKey, string[]>;

type State = {
  options: OptionsMap;
  selected: Record<FieldKey, string>;
  lang: 'en' | 'id';
};

// —— Helpers
function loadSaved(fallback: State): State {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function saveState(state: State) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

// —— Default options
const defaultOptions: OptionsMap = {
  character: [
    'Baby cappuccino cup head — joyful, plush vibe',
    'Tiny orca — cute, toy scale',
    'Humanoid wood cylinder — friendly mascot',
    'Tatata — fluffy teapot creature',
  ],
  action: [
    'Smiles and stomps cutely',
    'Waves at camera and nods',
    'Hugs a tiny plush friend',
    'Bites and chews playfully',
  ],
  background: [
    'Cozy bright room, wooden floor',
    'Colorful toy studio, soft props',
    'Cafe corner with warm light',
    'Plain pastel backdrop',
  ],
  camera: [
    'Medium shot, eye-level, gentle push-in',
    'Close-up, shallow depth of field',
    'Handheld, slight shake, chest-level',
    'Low angle, cute hero look',
  ],
  ambience: [
    'Warm studio lighting, soft shadows',
    'Golden hour glow, gentle rim light',
    'Bright evenly lit toy photography',
    'Cinematic softbox lighting, creamy bokeh',
  ],
  style: [
    '3D hyper-realistic baby doll style; photorealistic skin texture with soft blush; doll-like proportions; plush toy realism; ultra-detailed; 8K render',
    '3D cartoon Pixar-inspired; soft plastic material; toy-like; bright colors; clean lines',
    'Photorealistic cinematic baby; natural skin pores; filmic lighting; detailed micro-texture',
    'Plush toy style; short velvet fur; soft fabric seams; toy photography setup',
  ],
};

// —— Reusable field component
function Field({
  label,
  options,
  value,
  onChange,
  onAdd,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  onAdd: (v: string) => void;
}) {
  const [newOpt, setNewOpt] = useState('');
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-800">{label}</label>
      <div className="flex gap-2">
        <select
          className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">— Select {label.toLowerCase()} —</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          className="flex-1 rounded-xl border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          placeholder={`Add new ${label.toLowerCase()}…`}
          value={newOpt}
          onChange={(e) => setNewOpt(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            const v = newOpt.trim();
            if (!v) return;
            onAdd(v);
            setNewOpt('');
          }}
          className="rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-black/90 active:scale-[0.98]"
        >
          Add
        </button>
      </div>
    </div>
  );
}

// —— Page
export default function StoryPromptPage() {
  const [state, setState] = useState<State>(() =>
    loadSaved({
      options: defaultOptions,
      selected: {
        character: '',
        action: '',
        background: '',
        camera: '',
        ambience: '',
        style: defaultOptions.style[0],
      },
      lang: 'en',
    })
  );

  useEffect(() => saveState(state), [state]);

  const setSelected = (k: FieldKey, v: string) =>
    setState((s) => ({ ...s, selected: { ...s.selected, [k]: v } }));

  const addOption = (k: FieldKey, v: string) =>
    setState((s) => ({
      ...s,
      options: { ...s.options, [k]: Array.from(new Set([v, ...s.options[k]])) },
    }));

  const prompt = useMemo(() => {
    const { character, action, background, camera, ambience, style } = state.selected;
    const parts = [
      character && `Character: ${character}`,
      action && `Action: ${action}`,
      background && `Background: ${background}`,
      camera && `Camera: ${camera}`,
      ambience && `Ambience: ${ambience}`,
      style && `Style/Rendering: ${style}`,
    ].filter(Boolean) as string[];

    const out = parts.join(' \n');
    if (state.lang === 'id') {
      return out
        .replace('Character:', 'Karakter:')
        .replace('Action:', 'Aksi:')
        .replace('Background:', 'Latar:')
        .replace('Camera:', 'Kamera:')
        .replace('Ambience:', 'Suasana:')
        .replace('Style/Rendering:', 'Gaya/Rendering:');
    }
    return out;
  }, [state.selected, state.lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      alert('Prompt copied!');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('Prompt copied!');
    }
  };

  const reset = () =>
    setState((s) => ({
      ...s,
      selected: {
        character: '',
        action: '',
        background: '',
        camera: '',
        ambience: '',
        style: s.options.style?.[0] || '',
      },
    }));

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Prompt Builder</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Language</span>
          <select
            className="rounded-xl border border-gray-300 p-2 text-sm"
            value={state.lang}
            onChange={(e) => setState((s) => ({ ...s, lang: e.target.value as 'en' | 'id' }))}
          >
            <option value="en">EN</option>
            <option value="id">ID</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Field
          label="Character"
          options={state.options.character}
          value={state.selected.character}
          onChange={(v) => setSelected('character', v)}
          onAdd={(v) => addOption('character', v)}
        />
        <Field
          label="Action"
          options={state.options.action}
          value={state.selected.action}
          onChange={(v) => setSelected('action', v)}
          onAdd={(v) => addOption('action', v)}
        />
        <Field
          label="Background"
          options={state.options.background}
          value={state.selected.background}
          onChange={(v) => setSelected('background', v)}
          onAdd={(v) => addOption('background', v)}
        />
        <Field
          label="Camera"
          options={state.options.camera}
          value={state.selected.camera}
          onChange={(v) => setSelected('camera', v)}
          onAdd={(v) => addOption('camera', v)}
        />
        <Field
          label="Ambience"
          options={state.options.ambience}
          value={state.selected.ambience}
          onChange={(v) => setSelected('ambience', v)}
          onAdd={(v) => addOption('ambience', v)}
        />
        <Field
          label="Style"
          options={state.options.style}
          value={state.selected.style}
          onChange={(v) => setSelected('style', v)}
          onAdd={(v) => addOption('style', v)}
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
  );
}