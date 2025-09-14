import React, { useMemo, useRef, useState } from "react"; import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Textarea } from "@/components/ui/textarea"; import { Label } from "@/components/ui/label"; import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; import { Switch } from "@/components/ui/switch"; import { Slider } from "@/components/ui/slider"; import { Copy, ImageIcon, Link as LinkIcon, RefreshCcw, Sparkles, Trash2, Upload } from "lucide-react"; import { motion } from "framer-motion";

export default function PromptGenerator() { const [mode, setMode] = useState<"image" | "text">("text"); const [lang, setLang] = useState<"id" | "en">("id"); // NEW: toggle language output}

const [characterText, setCharacterText] = useState(""); const [imageSrc, setImageSrc] = useState<string | null>(null); const [place, setPlace] = useState(""); const [mood, setMood] = useState(""); const [action, setAction] = useState(""); const [camera, setCamera] = useState(""); const [sound, setSound] = useState(""); const [ratio, setRatio] = useState(""); // NEW: ratio field const [stylePack, setStylePack] = useState(""); // NEW: style pack field

const [enhanceEnglish, setEnhanceEnglish] = useState(true); const [includeNegatives, setIncludeNegatives] = useState(true); const [negativeCustom, setNegativeCustom] = useState(""); // NEW: custom negatives const [strength, setStrength] = useState<number[]>([80]); // polishing intensity 0..100

const fileRef = useRef<HTMLInputElement | null>(null);

const presets = { places: [ "kitchen studio yang terang", "taman bermain warna-warni", "kota futuristik malam hari", "pantai pagi berawan", "hutan berkabut", ], moods: [ "ceria, playful, colorful", "dreamy, soft glow", "dramatic, high contrast", "calm, natural light", "epic, cinematic", ], actions: [ "berjalan ke arah kamera", "melambaikan tangan sambil tersenyum", "melompat pelan, confetti beterbangan", "menari kecil memutar badan", "mengangkat tangan memberi isyarat follow me", ], cameras: [ "lens 35mm, depth of field dangkal, f/1.8", "lens 50mm portrait, backlight rim", "wide 18mm, low-angle hero shot", "tele 85mm, bokeh creamy", "drone top-down 90°", ], stylePacks: { photoreal: "photorealistic, PBR, accurate skin/texture, natural color science, realistic lens artifacts", cinematic: "cinematic lighting, filmic tones, soft rim light, volumetric haze, composition rule of thirds", toon3d: "3D cartoon, soft subsurface scattering, clean outlines, saturated yet balanced palette", plush: "plush toy look, soft short fur, stitched seams, cute proportions, studio softbox lighting", anime: "anime aesthetic, crisp linework, cel shading, vibrant gradients, expressive eyes", }, negatives: [ "low quality, blurry", "duplicate, watermark, text overlay", "mutated hands, extra fingers", "overexposed, underexposed", "distorted anatomy, bad composition", ], ratios: ["1:1", "3:4", "4:3", "9:16", "16:9", "1:2", "2:1"], } as const;

function readFile(file: File) { const reader = new FileReader(); reader.onload = () => setImageSrc(reader.result as string); reader.readAsDataURL(file); }

function resetAll() { setMode("text"); setLang("id"); setCharacterText(""); setImageSrc(null); setPlace(""); setMood(""); setAction(""); setCamera(""); setSound(""); setRatio(""); setStylePack(""); setEnhanceEnglish(true); setIncludeNegatives(true); setNegativeCustom(""); setStrength([80]); if (fileRef.current) fileRef.current.value = ""; }

const finalPrompt = useMemo(() => { const s = (t: string) => (t ? t.trim() : "");

  const subjectID =
  mode === "image"
      ? `Karakter mengacu pada gambar referensi terlampir (image reference provided).` +
            (s(characterText) ? ` Catatan karakter: ${s(characterText)}.` : "")
                : `Karakter: ${s(characterText) || "(deskripsikan ciri karakter di sini)"}.`;
  const subjectEN =
          mode === "image"
              ? `Character refers to the attached image reference.` +
                      (s(characterText) ? ` Character notes: ${s(characterText)}.` : "")
                                : `Character: ${s(characterText) || "(describe the character here)"}.`;
                const styleText = stylePack
                  ? (() => {
                        const key = stylePack as keyof typeof presets.stylePacks;
                              return presets.stylePacks[key] || stylePack;
                                  })()
                                    : "";
                    const polishLevel = Math.max(0, Math.min(100, strength[0]));
                 const spice =
                      polishLevel > 70
                          ? "highly detailed, rich textures, soft global illumination, physically based rendering, subtle rim light, natural color harmony"
                              : polishLevel > 40
                                  ? "balanced detail, soft shadows, coherent lighting"
                                      : "simple lighting, clean composition";
      const negativeJoined = [
          includeNegatives ? presets.negatives.join(", ") : "",
            s(negativeCustom),
            ]
              .filter(Boolean)
                .join(", ");
      if (lang === "en") {
          const parts = [
              subjectEN,
                  place && `Place: ${place}.`,
                      mood && `Mood: ${mood}.`,
                          action && `Action: ${action}.`,
                              camera && `Camera: ${camera}.`,
                                  ratio && `Aspect Ratio: ${ratio}.`,
                                      styleText && `Style Pack: ${styleText}.`,
                                          sound && `Sound/SFX (for video or ambience): ${sound}.`,
                                            ].filter(Boolean);
      }                          
const englishBooster = enhanceEnglish ? " professional composition, award-winning photography aesthetics" : "";

  const negatives = negativeJoined ? `

  Negative prompts: ${negativeJoined}.` : "";

  return (
      `Generate an AI image from the refined paragraph below for maximum results. Prioritize character fidelity and consistent details.
      