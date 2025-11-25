"use client";

import { useStore } from "@/store/useStore";
import { Search, Bell, User } from "lucide-react";

export function Header() {
    const { setSearch, searchQuery } = useStore();

    return (
        <header className="h-16 bg-black/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center flex-1 max-w-xl">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search channels..."
                        className="w-full bg-gray-900/50 text-white pl-10 pr-4 py-2 rounded-full border border-gray-700 focus:border-red-600 outline-none transition"
                        value={searchQuery}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-6 ml-4">
                <button className="text-gray-400 hover:text-white transition">
                    <Bell size={20} />
                </button>
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white font-bold">
                        U
                    </div>
                </div>
            </div>
        </header>
    );
}
