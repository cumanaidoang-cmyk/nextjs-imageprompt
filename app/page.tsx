"use client";

import React, { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Copy, ImageIcon, Link as LinkIcon, RefreshCcw, Sparkles, Trash2, Upload } from "lucide-react";
import { motion } from "framer-motion";

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
  const [enhanceEnglish, setEnhanceEnglish] = useState(true);
  const [includeNegatives, setIncludeNegatives] = useState(true);
  const [negativeCustom, setNegativeCustom] = useState("");
  const [strength, setStrength] = useState([80]);

  const fileRef = useRef(null);

  const presets = {
    places: ["kitchen studio yang terang", "taman bermain warna-warni"],
    moods: ["ceria, playful, colorful", "dreamy, soft glow"],
    actions: ["berjalan ke arah kamera", "melambaikan tangan sambil tersenyum"],
    cameras: ["lens 35mm", "lens 50mm portrait"],
    ratios: ["1:1", "9:16", "16:9"],
    stylePacks: {
      photoreal: "photorealistic, realistic textures",
      cinematic: "cinematic lighting, filmic tones",
      toon3d: "3D cartoon style",
      plush: "plush toy look",
      anime: "anime aesthetic"
    },
    negatives: ["low quality", "blurry", "mutated hands"]
  };

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

    const styleText = stylePack ? presets.stylePacks[stylePack] || stylePack : "";
    const polishLevel = Math.max(0, Math.min(100, strength[0]));
    const spice = polishLevel > 70 ? "highly detailed" : "simple composition";
    const negatives = includeNegatives ? presets.negatives.join(", ") + ", " + negativeCustom : negativeCustom;

    if (lang === "en") {
      return [subjectEN, place && "Place: " + place, mood && "Mood: " + mood, action && "Action: " + action,
        camera && "Camera: " + camera, ratio && "Aspect Ratio: " + ratio,
        styleText && "Style: " + styleText, sound && "Sound: " + sound
      ].filter(Boolean).join(". ") + ". Quality: " + spice + ". Negatives: " + negatives;
    }
    return [subjectID, place && "Tempat: " + place, mood && "Suasana: " + mood, action && "Aksi: " + action,
      camera && "Kamera: " + camera, ratio && "Rasio: " + ratio,
      styleText && "Style: " + styleText, sound && "Sound: " + sound
    ].filter(Boolean).join(". ") + ". Kualitas: " + spice + ". Negatives: " + negatives;
  }, [mode, lang, characterText, place, mood, action, camera, ratio, stylePack, sound, includeNegatives, negativeCustom, strength]);

  function copyToClipboard() {
    navigator.clipboard.writeText(finalPrompt);
  }

  return (
    <div className="p-6">
      <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold">
        AI Image Prompt Generator
      </motion.h1>
      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Input</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label>Bahasa</Label>
            <div className="flex gap-2">
              <Button onClick={() => setLang("id")} variant={lang==="id"?"default":"outline"}>ID</Button>
              <Button onClick={() => setLang("en")} variant={lang==="en"?"default":"outline"}>EN</Button>
            </div>
            <Label>Karakter</Label>
            <Tabs value={mode} onValueChange={setMode}>
              <TabsList><TabsTrigger value="text">Teks</TabsTrigger><TabsTrigger value="image">Gambar</TabsTrigger></TabsList>
              <TabsContent value="text"><Textarea value={characterText} onChange={(e)=>setCharacterText(e.target.value)} /></TabsContent>
              <TabsContent value="image">
                <Input type="file" ref={fileRef} onChange={(e)=>{const f=e.target.files?.[0]; if(f) readFile(f);}} />
                {imageSrc && <img src={imageSrc} alt="preview" className="w-24 mt-2" />}
              </TabsContent>
            </Tabs>
            <Label>Tempat</Label>
            <Input value={place} onChange={(e)=>setPlace(e.target.value)} />
            <Label>Suasana</Label>
            <Input value={mood} onChange={(e)=>setMood(e.target.value)} />
            <Label>Action</Label>
            <Input value={action} onChange={(e)=>setAction(e.target.value)} />
            <Label>Kamera</Label>
            <Input value={camera} onChange={(e)=>setCamera(e.target.value)} />
            <Label>Rasio</Label>
            <Input value={ratio} onChange={(e)=>setRatio(e.target.value)} />
            <Label>Style Pack</Label>
            <Input value={stylePack} onChange={(e)=>setStylePack(e.target.value)} />
            <Label>Sound</Label>
            <Input value={sound} onChange={(e)=>setSound(e.target.value)} />
            <Label>Negative</Label>
            <Textarea value={negativeCustom} onChange={(e)=>setNegativeCustom(e.target.value)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Output</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={finalPrompt} readOnly className="min-h-[300px]" />
            <Button onClick={copyToClipboard} className="mt-2">Copy</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
