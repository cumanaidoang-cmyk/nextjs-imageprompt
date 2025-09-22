import React, { useEffect, useMemo, useState } from "react";

// --- CLIENT PAGE (drop into app/story-prompt/page.tsx) --- // Fitur baru: Pilih karakter berdasarkan NAMA, tapi yang dipakai di prompt adalah DESKRIPSI detailnya. // Kamu bisa tambah karakter (name + description) langsung dari web. Data tersimpan di localStorage.

const KEY = "prompt-form-v3";

type FieldKey = "action" | "background" | "camera" | "ambience" | "style";

type CharacterEntry = { name: string; desc: string };

type OptionsMap = Record<FieldKey, string[]>;

// daftar karakter (name + desc)
type State = { catalog: CharacterEntry[]; 
// yang dipilih user (berdasarkan nama)
selectedCharacterName: string; 
// opsi untuk field lain 
options: OptionsMap; 
selected: Record<FieldKey, string>; lang: "en" | "id"; };

function loadSaved<T>(fallback: T): T { if (typeof window === "undefined") return fallback; try { const raw = localStorage.getItem(KEY); return raw ? { ...fallback, ...JSON.parse(raw) } : fallback; } catch { return fallback; } }

function saveState(state: any) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }

const defaultCatalog: CharacterEntry[] = [ { name: "Cappuccina", desc: "Baby doll with a cappuccino cup head; joyful smile; big sparkling eyes; soft pastel pajamas. Skin looks hyper‑real with gentle pores and soft blush; plush‑toy vibe but lifelike; friendly, huggable proportions.", }, { name: "Tiny Orca", desc: "Tiny orca mascot at toy scale; glossy smooth body; adorable cheeks; playful fins waving. Hyper‑real micro‑texture with soft specular highlights; cute baby proportions; gentle, friendly expression.", }, { name: "Tungtung", desc: "Humanoid wood cylinder mascot; carved natural wood grain; warm brown tones; kind eyes. Silky polished surface with fine engraving; gentle smile; friendly posture; plush‑toy presentation but realistic texture.", }, { name: "Tatata", desc: "Fluffy teapot creature with short soft fur; slightly shy eyes; subtle blush. Round baby proportions; cuddly look; seam details like premium plush; lifelike fur fibers with soft shadowing.", }, ];

const defaultOptions: OptionsMap = { action: [ "Smiles and stomps cutely", "Waves at the camera and nods", "Hugs a tiny plush friend", "Bites and chews playfully", ], background: [ "Cozy bright room, wooden floor", "Colorful toy studio with soft props", "Cafe corner with warm light", "Plain pastel backdrop", ], camera: [ "Medium shot, eye‑level, gentle push‑in", "Close‑up, shallow depth of field", "Handheld, slight shake, chest‑level", "Low angle, cute hero look", ], ambience: [ "Warm studio lighting, soft shadows", "Golden hour glow, gentle rim light", "Bright evenly lit toy photography", "Cinematic softbox lighting, creamy bokeh", ], style: [ "3D hyper‑realistic baby doll style; photorealistic skin texture with soft blush; doll‑like proportions; plush toy realism; ultra‑detailed; 8K render", "3D cartoon Pixar‑inspired; soft plastic material; toy‑like; bright colors; clean lines", "Photorealistic cinematic baby; natural skin pores; filmic lighting; detailed micro‑texture", "Plush toy style; short velvet fur; soft fabric seams; toy photography setup", ], };

function Field({ label, options, value, onChange, onAdd, }: { label: string; options: string[]; value: string; onChange: (v: string) => void; onAdd: (v: string) => void; }) { const [newOpt, setNewOpt] = useState(""); return ( <div className="space-y-2"> <label className="block text-sm font-medium text-gray-800">{label}</label> <div className="flex gap-2"> <select className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10" value={value} onChange={(e) => onChange(e.target.value)} > <option value="">— Select {label.toLowerCase()} —</option> {options.map((opt, i) => ( <option key={i} value={opt}> {opt} </option> ))} </select> </div> <div className="flex items-center gap-2"> <input className="flex-1 rounded-xl border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" placeholder={'Add new ${label.toLowerCase()}…'} value={newOpt} onChange={(e) => setNewOpt(e.target.value)} /> <button type="button" onClick={() => { const v = newOpt.trim(); if (!v) return; onAdd(v); setNewOpt(""); }} className="rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-black/90 active:scale-[0.98]" > Add </button> </div> </div> ); }

function CharacterField({ catalog, selectedName, onSelect, onAdd, onEdit, }: { catalog: CharacterEntry[]; selectedName: string; onSelect: (name: string) => void; onAdd: (entry: CharacterEntry) => void; onEdit: (entry: CharacterEntry) => void; }) { const [draftName, setDraftName] = useState(""); const [draftDesc, setDraftDesc] = useState("");

const current = catalog.find((c) => c.name === selectedName); const [isEditing, setIsEditing] = useState(false); const [editDesc, setEditDesc] = useState(current?.desc || "");

// sync editDesc when selection changes useEffect(() => { setEditDesc(current?.desc || ""); }, [selectedName]);

return ( <div className="space-y-2"> <label className="block text-sm font-medium text-gray-800">Character</label> <select className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10" value={selectedName} onChange={(e) => onSelect(e.target.value)} > <option value="">— Select character name —</option> {catalog.map((c) => ( <option key={c.name} value={c.name}> {c.name} </option> ))} </select>

{/* Preview / Edit description for selected character */}
  {selectedName && (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-800">Description used in prompt</span>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-lg border border-gray-300 px-2 py-1 text-xs"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onEdit({ name: selectedName, desc: editDesc.trim() });
                setIsEditing(false);
              }}
              className="rounded-lg bg-black px-2 py-1 text-xs font-semibold text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditDesc(current?.desc || "");
                setIsEditing(false);
              }}
              className="rounded-lg border border-gray-300 px-2 py-1 text-xs"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <p className="whitespace-pre-wrap text-sm text-gray-800">{current?.desc}</p>
      ) : (
        <textarea
          className="h-28 w-full rounded-xl border border-gray-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
        />
      )}
    </div>
  )}

  {/* Add new character */}
  <div className="rounded-xl border border-gray-200 p-3">
    <div className="mb-2 text-sm font-medium text-gray-800">Add new character</div>
    <div className="mb-2 flex gap-2">
      <input
        className="w-1/3 rounded-xl border border-gray-300 p-2 text-sm"
        placeholder="Name (e.g., Cappuccina)"
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
      />
      <textarea
        className="h-20 flex-1 rounded-xl border border-gray-300 p-2 text-sm"
        placeholder="Detailed description used in prompt"
        value={draftDesc}
        onChange={(e) => setDraftDesc(e.target.value)}
      />
    </div>
    <button
      type="button"
      onClick={() => {
        const name = draftName.trim();
        const desc = draftDesc.trim();
        if (!name || !desc) return;
        onAdd({ name, desc });
        setDraftName("");
        setDraftDesc("");
      }}
      className="rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-black/90 active:scale-[0.98]"
    >
      Add Character
    </button>
  </div>
</div>

); }

export default function PromptFormPage() { const [state, setState] = useState<State>(() => loadSaved({ catalog: defaultCatalog, selectedCharacterName: "", options: defaultOptions, selected: { action: "", background: "", camera: "", ambience: "", style: defaultOptions.style[0], }, lang: "en", }) );

useEffect(() => saveState(state), [state]);

const setSelected = (k: FieldKey, v: string) => setState((s) => ({ ...s, selected: { ...s.selected, [k]: v } }));

const addOption = (k: FieldKey, v: string) => setState((s) => ({ ...s, options: { ...s.options, [k]: Array.from(new Set([v, ...s.options[k]])) }, }));

const addCharacter = (entry: CharacterEntry) => setState((s) => ({ ...s, catalog: [entry, ...s.catalog.filter((c) => c.name !== entry.name)], selectedCharacterName: entry.name, }));

const editCharacter = (entry: CharacterEntry) => setState((s) => ({ ...s, catalog: s.catalog.map((c) => (c.name === entry.name ? entry : c)), }));

const prompt = useMemo(() => { const characterDesc = state.catalog.find((c) => c.name === state.selectedCharacterName)?.desc || ""; const { action, background, camera, ambience, style } = state.selected;

const parts = [
  characterDesc && `Character: ${characterDesc}`,
  action && `Action: ${action}`,
  background && `Background: ${background}`,
  camera && `Camera: ${camera}`,
  ambience && `Ambience: ${ambience}`,
  style && `Style/Rendering: ${style}`,
].filter(Boolean);

const out = parts.join("

"); if (state.lang === "id") { return out .replace("Character:", "Karakter:") .replace("Action:", "Aksi:") .replace("Background:", "Latar:") .replace("Camera:", "Kamera:") .replace("Ambience:", "Suasana:") .replace("Style/Rendering:", "Gaya/Rendering:"); } return out; }, [state.catalog, state.selectedCharacterName, state.selected, state.lang]);

const copy = async () => { try { await navigator.clipboard.writeText(prompt); alert("Prompt copied!"); } catch { const ta = document.createElement("textarea"); ta.value = prompt; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); alert("Prompt copied!"); } };

const reset = () => setState((s) => ({ ...s, selectedCharacterName: "", selected: { action: "", background: "", camera: "", ambience: "", style: s.options.style?.[0] || "", }, }));

return ( <main className="mx-auto max-w-3xl px-4 py-8"> <div className="mb-6 flex items-center justify-between"> <h1 className="text-2xl font-bold">AI Prompt Builder</h1> <div className="flex items-center gap-2"> <span className="text-sm text-gray-600">Language</span> <select className="rounded-xl border border-gray-300 p-2 text-sm" value={state.lang} onChange={(e) => setState((s) => ({ ...s, lang: e.target.value as "en" | "id" }))} > <option value="en">EN</option> <option value="id">ID</option> </select> </div> </div>

{/* Character = choose by NAME, prompt uses DESCRIPTION */}
  <CharacterField
    catalog={state.catalog}
    selectedName={state.selectedCharacterName}
    onSelect={(name) => setState((s) => ({ ...s, selectedCharacterName: name }))}
    onAdd={addCharacter}
    onEdit={editCharacter}
  />

  <div className="mt-6 grid grid-cols-1 gap-6">
    <Field
      label="Action"
      options={state.options.action}
      value={state.selected.action}
      onChange={(v) => setSelected("action", v)}
      onAdd={(v) => addOption("action", v)}
    />
    <Field
      label="Background"
      options={state.options.background}
      value={state.selected.background}
      onChange={(v) => setSelected("background", v)}
      onAdd={(v) => addOption("background", v)}
    />
    <Field
      label="Camera"
      options={state.options.camera}
      value={state.selected.camera}
      onChange={(v) => setSelected("camera", v)}
      onAdd={(v) => addOption("camera", v)}
    />
    <Field
      label="Ambience"
      options={state.options.ambience}
      value={state.selected.ambience}
      onChange={(v) => setSelected("ambience", v)}
      onAdd={(v) => addOption("ambience", v)}
    />
    <Field
      label="Style"
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

