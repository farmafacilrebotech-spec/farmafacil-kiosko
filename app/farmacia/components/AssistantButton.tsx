"use client";

import { MessageCircle } from "lucide-react";

export default function AssistantButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-20 right-5 bg-[#0F766E] text-white p-4 rounded-full shadow-xl z-50"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
