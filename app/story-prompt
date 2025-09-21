"use client";

import { useState } from "react";

export default function StoryPromptPage() {
  const [theme, setTheme] = useState("Petualangan di hutan ajaib");
  const [character, setCharacter] = useState("anak kecil bernama Rafa");
  const [style, setStyle] = useState("3D cartoon, colorful, cinematic lighting");
  const [output, setOutput] = useState("");

  const generatePrompt = () => {
    const text = `
Cerita Pendek Video Prompt:

Tema: ${theme}
Tokoh Utama: ${character}
Gaya Visual: ${style}

Deskripsi:
Seorang ${character} memulai petualangan dalam tema ${theme}.
Ceritanya dibagi menjadi beberapa adegan singkat (5-10 detik per adegan).
Setiap adegan harus konsisten dengan karakter utama dan gaya visual ${style}.
Tambahkan ekspresi wajah, gerakan kamera, dan suasana yang mendukung cerita.

Mood: Imaginatif, seru, dan ramah untuk anak-anak.
    `;
    setOutput(text.trim());
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">📖 Story Prompt Generator</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg space-y-4">
        <div>
          <label className="block font-medium mb-1">Tema Cerita</label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Tokoh Utama</label>
          <input
            type="text"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Gaya Visual</label>
          <input
            type="text"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          onClick={generatePrompt}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Generate Prompt
        </button>

        {output && (
          <div className="mt-4">
            <h2 className="font-semibold mb-2">✨ Prompt Result:</h2>
            <textarea
              className="w-full border p-2 rounded h-72"
              value={output}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
}