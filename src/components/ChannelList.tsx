"use client";

import { useStore } from "@/store/useStore";
import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChannelListProps {
    onSelectChannel: (channelId: string) => void;
}

export function ChannelList({ onSelectChannel }: ChannelListProps) {
    const { filteredChannels, isLoading } = useStore();
    const [visibleCount, setVisibleCount] = useState(50);

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="aspect-video bg-gray-800 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    const visibleChannels = filteredChannels.slice(0, visibleCount);

    return (
        <div className="p-4">
            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <AnimatePresence>
                    {visibleChannels.map((channel) => (
                        <motion.div
                            key={channel.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => onSelectChannel(channel.id)}
                            className="group relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 border border-gray-800 hover:border-red-600"
                        >
                            {channel.logo ? (
                                <Image
                                    src={channel.logo}
                                    alt={channel.name}
                                    fill
                                    className="object-contain p-4"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=No+Logo";
                                    }}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500 font-bold text-xl">
                                    {channel.name.slice(0, 2).toUpperCase()}
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Play className="text-white fill-current" size={32} />
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                                <p className="text-white text-sm font-medium truncate">{channel.name}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {visibleCount < filteredChannels.length && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => setVisibleCount(prev => prev + 50)}
                        className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
