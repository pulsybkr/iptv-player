
"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { FilterBar } from "@/components/FilterBar";
import { Header } from "@/components/Header";
import { ChannelList } from "@/components/ChannelList";
import { VideoPlayer } from "@/components/VideoPlayer";
import { X } from "lucide-react";

export default function Home() {
  const { fetchData, getStreamUrl, channels } = useStore();
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectedChannel = channels.find(c => c.id === selectedChannelId);
  const streamUrl = selectedChannelId ? getStreamUrl(selectedChannelId) : null;

  useEffect(() => {
    if (streamUrl) {
      console.log("Stream URL:", streamUrl);
    }
  }, [streamUrl]);

  return (
    <div className="flex h-screen bg-[#141414] text-white overflow-hidden">

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <FilterBar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Live Channels</h2>
            <ChannelList onSelectChannel={setSelectedChannelId} />
          </div>
        </main>
      </div>

      {/* Video Overlay */}
      {selectedChannelId && streamUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setSelectedChannelId(null)}
            className="absolute top-4 right-4 text-white hover:text-red-600 transition z-50"
          >
            <X size={32} />
          </button>

          <div className="w-full max-w-5xl aspect-video relative">
            <VideoPlayer url={streamUrl} autoPlay />
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold">{selectedChannel?.name}</h2>
            <p className="text-gray-400">
              {selectedChannel?.country} • {selectedChannel?.categories.join(", ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
