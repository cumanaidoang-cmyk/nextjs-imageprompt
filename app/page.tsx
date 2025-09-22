"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold mb-4">Selamat datang di <span className="text-blue-600">Rev AI</span></h1>
      <p className="text-lg max-w-xl mb-8 text-gray-700">
        Template prompt yang akan memudahkan kalian untuk menghasilkan video yang konsisten.
        <br />Pilih mode video yang ingin kalian buat:
      </p>

      <div className="flex gap-4">
        <Link
          href="/feeding-prompt"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          🍽 Feeding Prompt
        </Link>

        <Link
          href="/story-prompt"
          className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          📖 Cerita Pendek
        </Link>
      </div>
    </main>
  );
}