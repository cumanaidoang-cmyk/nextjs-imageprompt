"use client";

import { useState } from "react";

export default function FeedingPromptForm() {
  const characterPrompts: Record<string, string> = {
    "Cappuccina":
      "A super cute tiny version of Cappuccina, with a cappuccino cup head topped with frothy foam and a small handle, wearing a ballerina tutu dress. She is standing on a wooden table, toy-like proportions, big glossy eyes, joyful smile. Style: 3D hyper-realistic cartoon, ultra detailed, toy photography style. Background: bright daylight with blurred cozy café scenery.",
    "Orca":
      "A super cute tiny baby orca with glossy black-and-white skin, wearing tiny blue sneakers, standing on a wooden surface outdoors. Big shiny eyes, joyful expression. Style: 3D hyper-realistic cartoon, ultra detailed. Background: bright daylight with blurred beach scenery.",
    "Tortugini Dragonfruitini":
      "A super cute tiny version of Tortugini Dragonfruitini, a baby turtle with smooth pink skin and a soft yellow belly. Its back shell is a dragon fruit texture: vibrant pink with green scale-like spikes. Large shiny eyes, smiling adorably, standing on a wooden surface. Style: 3D hyper-realistic cartoon, ultra detailed. Background: bright daylight with blurred tropical scenery.",
    "Trippi":
      "A super cute tiny hybrid creature with the fluffy orange head of a kitten and the body of a shrimp with shiny orange-pink shell and multiple shrimp legs. Big glossy eyes, mouth slightly open in a joyful expression, standing on a rustic wooden table. Style: 3D hyper-realistic cartoon, ultra detailed, toy photography style. Background: bright daylight with blurred beach scenery.",
    "Ambalabu":
      "A super cute tiny version of Ambalabu, with a glossy green frog head, a vertical upright black tire body with tread texture, and two small human legs. Big sparkling eyes, joyful expression, standing on a wooden surface. Style: 3D hyper-realistic cartoon, ultra detailed, toy photography style. Background: bright daylight with blurred scenery.",
  };

  const [character, setCharacter] = useState("Orca");
  const [food, setFood] = useState("sardine fish from an opened can");
  const [customFood, setCustomFood] = useState("");
  const [output, setOutput] = useState("");

  const generatePrompt = () => {
    const chosenFood = customFood.trim() !== "" ? customFood : food;
    const characterDesc = characterPrompts[character] || character;

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
- Background music: upbeat, playful ukulele or marimba melody, 120–130 BPM.
- SFX: appropriate sounds for ${chosenFood} (metal can click, wrapper crinkle, or squish depending on food),
       cute *chomp chomp* when the character bites,
       tiny *stomp squeaks* when it moves feet,
       short *sparkle chime* when eyes light up.
- Voice/Narration: soft whisper “Woooww… ${chosenFood}…” right before the character eats.
- Optional reaction: a happy squeak or “Mmmh yum!” while chewing.
    `;
    setOutput(text.trim());
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">🍽 Feeding Prompt Generator</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg space-y-4">
        {/* Character Selector */}
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

        {/* Food Selector */}
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
        </div>

        {/* Custom Food Input */}
        <div>
          <label className="block font-medium mb-1">Atau isi makanan custom</label>
          <input
            type="text"
            placeholder="Contoh: cilok, pizza slice, bakso kecil"
            className="w-full border p-2 rounded"
            value={customFood}
            onChange={(e) => setCustomFood(e.target.value)}
          />
        </div>

        <button
          onClick={generatePrompt}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
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