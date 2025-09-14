"use client";

import React, { useMemo, useRef, useState } from "react";

export default function Page() {
  const [mode, setMode] = useState("text");
  const [lang, setLang] = useState("id");
  const [characterText, setCharacterText] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [place, setPlace] = useState("");
  const [mood, setMood] = useState("");
  const [action, setAction] = useState("");
  const [camera, setCamera] = useState("");
  const [sound, setSound] = useState("");
  const [ratio, setRatio] = useState("");
  const [stylePack, setStylePack] = useState("");
  const [negativeCustom, setNegativeCustom] = useState("");
  const [strength, setStrength] = useState(80);

  const fileRef = useRef(null);

  function readFile(file) {
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  }

  const finalPrompt = useMemo(() => {
    const s = (t) => (t ? t.trim() : "");
    const subjectID =
      mode === "image"
        ? "Karakter dari gambar referensi." + (s(characterText) ? " Catatan: " + s(characterText) : "")
        : "Karakter: " + (s(characterText) || "(deskripsikan di sini)");
    const subjectEN =
      mode === "image"
        ? "Character refers to the attached image." + (s(characterText) ? " Notes: " + s(characterText) : "")
        : "Character: " + (s(characterText) || "(describe here)");

    const polishLevel = Math.max(0, Math.min(100, strength));
    const spice = polishLevel > 70 ? "highly detailed" : "simple composition";

    if (lang === "en") {
      return [subjectEN, place && "Place: " + place, mood && "Mood: " + mood, action && "Action: " + action,
        camera && "Camera: " + camera, ratio && "Aspect Ratio: " + ratio,
        stylePack && "Style: " + stylePack, sound && "Sound: " + sound
      ].filter(Boolean).join(". ") + ". Quality: " + spice + ". Negatives: " + negativeCustom;
    }
    return [subjectID, place && "Tempat: " + place, mood && "Suasana: " + mood, action && "Aksi: " + action,
      camera && "Kamera: " + camera, ratio && "Rasio: " + ratio,
      stylePack && "Style: " + stylePack, sound && "Sound: " + sound
    ].filter(Boolean).join(". ") + ". Kualitas: " + spice + ". Negatives: " + negativeCustom;
  }, [mode, lang, characterText, place, mood, action, camera, ratio, stylePack, sound, negativeCustom, strength]);

  function copyToClipboard() {
    navigator.clipboard.writeText(finalPrompt);
  }

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>AI Image Prompt Generator</h1>

      <div style={{ marginTop: "1rem" }}>
        <label>Bahasa: </label>
        <button onClick={() => setLang("id")} style={{ marginRight: "0.5rem" }}>ID</button>
        <button onClick={() => setLang("en")}>EN</button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Karakter:</label><br />
        {mode === "text" ? (
          <textarea value={characterText} onChange={(e)=>setCharacterText(e.target.value)} rows={3} style={{width:"100%"}} />
        ) : (
          <div>
            <input type="file" ref={fileRef} onChange={(e)=>{const f=e.target.files?.[0]; if(f) readFile(f);}} />
            {imageSrc && <img src={imageSrc} alt="preview" style={{width:"100px", marginTop:"0.5rem"}} />}
          </div>
        )}
        <div style={{ marginTop:"0.5rem" }}>
          <button onClick={()=>setMode("text")}>Mode Teks</button>
          <button onClick={()=>setMode("image")} style={{marginLeft:"0.5rem"}}>Mode Gambar</button>
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Tempat:</label><br />
        <input value={place} onChange={(e)=>setPlace(e.target.value)} style={{width:"100%"}} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Suasana:</label><br />
        <input value={mood} onChange={(e)=>setMood(e.target.value)} style={{width:"100%"}} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Action:</label><br />
        <input value={action} onChange={(e)=>setAction(e.target.value)} style={{width:"100%"}} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Kamera:</label><br />
        <input value={camera} onChange={(e)=>setCamera(e.target.value)} style={{width:"100%"}} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Rasio:</label><br />
        <input value={ratio} onChange={(e)=>setRatio(e.target.value)} style={{width:"100%"}} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Style Pack:</label><br />
        <input value={stylePack} onChange={(e)=>setStylePack(e.target.value)} style={{width:"100%"}} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Sound:</label><br />
        <input value={sound} onChange={(e)=>setSound(e.target.value)} style={{width:"100%"}} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Negative:</label><br />
        <textarea value={negativeCustom} onChange={(e)=>setNegativeCustom(e.target.value)} rows={2} style={{width:"100%"}} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Polish Level (0-100):</label><br />
        <input type="number" min={0} max={100} value={strength} onChange={(e)=>setStrength(Number(e.target.value))} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h2>Output Prompt:</h2>
        <textarea value={finalPrompt} readOnly rows={10} style={{width:"100%"}} />
        <button onClick={copyToClipboard} style={{marginTop:"0.5rem"}}>Copy</button>
      </div>
    </div>
  );
}
