"use client";

import { useState } from "react";

export default function FeedingPromptForm() {
  const characterPrompts: Record<string, string> = {
    "Cappuccina":
      "A super cute tiny version of Cappuccina, with a cappuccino cup head topped with frothy foam and a small handle, wearing a ballerina tutu dress. She is standing on a wooden table, toy-like proportions, big glossy eyes, joyful smile. Style: 3D hyper-realistic cartoon, ultra detailed, toy photography style.",
    "Orca":
      "A super cute tiny baby orca with glossy black-and-white skin, wearing tiny blue sneakers, standing on a wooden surface outdoors. Big shiny eyes, joyful expression. Style: 3D hyper-realistic cartoon, ultra detailed.",
    "Tortugini Dragonfruitini":
      "A super cute tiny version of Tortugini Dragonfruitini, a baby turtle with smooth pink skin and a soft yellow belly. Its back shell is a dragon fruit texture: vibrant pink with green scale-like spikes. Large shiny eyes, smiling adorably, standing on a wooden surface. Style: 3D hyper-realistic cartoon, ultra detailed.",
    "Trippi":
      "A super cute tiny hybrid creature with the fluffy orange head of a kitten and the body of a shrimp with shiny orange-pink shell and multiple shrimp legs. Big glossy eyes, mouth slightly open in a joyful expression, standing on a rustic wooden table. Style: 3D hyper-realistic cartoon, ultra detailed, toy photography style.",
    "Ambalabu":
      "A super cute tiny version of Ambalabu, with a glossy green frog head, a vertical upright black tire body with tread texture, and two small human legs. Big sparkling eyes, joyful expression, standing on a wooden surface. Style: 3D hyper-realistic cartoon, ultra detailed, toy photography style.",
  };

  const backgroundOptions = [
    "bright daylight with blurred beach scenery",
    "cozy café interior with soft bokeh lights",
    "colorful toy room, shallow depth of field",
    "sunny park with soft greenery",
    "tropical jungle foliage, warm daylight",
    "night city bokeh lights, cinematic",
    "clean indoor studio, neutral backdrop"
  ];

  const [character, setCharacter] = useState("Orca");
  const [food, setFood] = useState("sardine fish from an opened can");
  const [customFood, setCustomFood] = useState("");
  const [background, setBackground] = useState(backgroundOptions[0]);
  const [customBg, setCustomBg] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const soundForBg = (bg: string) => {
    const val = bg.toLowerCase();
    if (val.includes("beach") || val.includes("ocean") || val.includes("sea")) {
      return "ambient beach sounds: gentle ocean waves and soft sea breeze (no music)";
    }
    if (val.includes("café") || val.includes("cafe") || val.includes("room") || val.includes("studio")) {
      return "soft ambient room tone appropriate to the scene (no music)";
    }
    if (val.includes("park") || val.includes("jungle") || val.includes("foliage")) {
      return "light nature ambience: distant birds and soft leaf rustle (no music)";
    }
    if (val.includes("city")) {
      return "subtle city ambience: distant traffic hush and light wind (no music)";
    }
    return "gentle ambient soundscape matching the background (no music)";
  };

  const generatePrompt = () => {
    const chosenFood = customFood.trim() ? customFood : food;
    const chosenBg = customBg.trim() ? customBg : background;

    const characterDesc = `${characterPrompts[character] || character} Background: ${chosenBg}.`;

    const text = `
${characterDesc}

From outside the frame, a human hand appears holding an opened container of ${chosenFood}.
The hand picks up one ${chosenFood} piece and moves it towards the character’s mouth.
The character tilts its head upward, opens its mouth wide with tiny teeth visible,
and happily eats the ${chosenFood} in one joyful bite.

The ${chosenFood} goes fully inside the mouth.
The character closes its mouth completely and starts chewing playfully for several seconds,
its eyes sparkling with joy, while stomping or wiggling in excitement.

Camera: medium close-up focusing on the character’s face, the hand, and the food.
Lighting: cinematic daylight, sharp focus, soft shadows.
Mood: playful, funny, adorable feeding moment.

SOUND:
- ${soundForBg(chosenBg)}.
- SFX: realistic handling for ${chosenFood} (metal click / wrapper crinkle / soft squish depending on the food),
       cute *chomp chomp* when the character bites,
       tiny *stomp squeaks* when feet/legs move,
       short *sparkle chime* when eyes light up.
- Voice/Narration: soft whisper “Woooww… ${chosenFood}…” right before eating.
- Optional reaction: a happy squeak or “Mmmh yum!” while chewing.
`.trim();

    setOutput(text);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">🍽 Feeding Prompt Generator</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg space-y-4">
        {/* Character */}
        <div>
          <label className="block font-medium mb-1">Karakter</label>
          <select
            className="w-full border p-2 rounded"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
          >
            <option value="Cappuccina">Cappuccina</option>
            <option value="Orca">Orca</option>
            <option value="Tortugini Dragonfruitini">Tortugini Dragonfruitini</option>
            <option value="Trippi">Trippi (Cat + Shrimp)</option>
            <option value="Ambalabu">Ambalabu</option>
          </select>
        </div>

        {/* Food */}
        <div>
          <label className="block font-medium mb-1">Makanan (Dropdown)</label>
          <select
            className="w-full border p-2 rounded"
            value={food}
            onChange={(e) => setFood(e.target.value)}
          >
            <option value="sardine fish from an opened can">Sardine</option>
            <option value="mini cupcake with pink frosting">Cupcake</option>
            <option value="colorful mochi rice cake">Mochi</option>
            <option value="sushi roll piece with salmon">Sushi</option>
            <option value="lollipop candy">Lollipop</option>
            <option value="gummy bear candy">Gummy Bear</option>
            <option value="cherry tomato">Cherry Tomato</option>
            <option value="grape fruit">Grape</option>
            <option value="small brownie cube">Brownie</option>
          </select>

          <label className="block text-sm mt-2 mb-1">Atau isi makanan custom</label>
          <input
            type="text"
            placeholder="Contoh: cilok, pizza slice, bakso kecil"
            className="w-full border p-2 rounded"
            value={customFood}
            onChange={(e) => setCustomFood(e.target.value)}
          />
        </div>

        {/* Background */}
        <div>
          <label className="block font-medium mb-1">Background</label>
          <select
            className="w-full border p-2 rounded"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
          >
            {backgroundOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <label className="block text-sm mt-2 mb-1">Atau isi background custom</label>
          <input
            type="text"
            placeholder="Contoh: sunset beach with orange sky"
            className="w-full border p-2 rounded"
            value={customBg}
            onChange={(e) => setCustomBg(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            *Kalau pilih/pakai background pantai, suara musik otomatis diganti ke ombak & angin pantai.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={generatePrompt}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Generate Prompt
          </button>
          <button
            onClick={copyToClipboard}
            disabled={!output}
            className={`px-4 py-2 rounded-lg border ${output ? "bg-white" : "bg-gray-100 text-gray-400"}`}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>

        {/* Output */}
        <div>
          <h2 className="font-semibold mb-2">✨ Prompt Result:</h2>
          <textarea
            className="w-full border p-2 rounded h-72"
            value={output}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}