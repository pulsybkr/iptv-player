"use client";

import { useStore } from "@/store/useStore";
import { Filter, Globe, Languages, X, ChevronDown, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type FilterType = "category" | "country" | "language" | null;

export function FilterBar() {
    const {
        categories, countries, languages,
        activeCategory, activeCountry, activeLanguage,
        setCategory, setCountry, setLanguage
    } = useStore();

    const [openFilter, setOpenFilter] = useState<FilterType>(null);
    const [filterSearch, setFilterSearch] = useState("");

    const toggleFilter = (type: FilterType) => {
        if (openFilter === type) {
            setOpenFilter(null);
        } else {
            setOpenFilter(type);
            setFilterSearch(""); // Reset search when opening
        }
    };

    const activeCategoryName = categories.find(c => c.id === activeCategory)?.name;
    const activeCountryName = countries.find(c => c.code === activeCountry)?.name;
    const activeLanguageName = languages.find(l => l.code === activeLanguage)?.name;

    const filteredOptions = useMemo(() => {
        const search = filterSearch.toLowerCase();
        if (openFilter === "category") return categories.filter(c => c.name.toLowerCase().includes(search));
        if (openFilter === "country") return countries.filter(c => c.name.toLowerCase().includes(search));
        if (openFilter === "language") return languages.filter(l => l.name.toLowerCase().includes(search));
        return [];
    }, [openFilter, filterSearch, categories, countries, languages]);

    return (
        <div className="sticky top-16 z-20 bg-[#141414]/95 backdrop-blur-sm border-b border-gray-800 p-4">
            <div className="flex flex-wrap items-center gap-3">
                {/* Filter Buttons */}
                <FilterButton
                    label="Categories"
                    icon={<Filter size={16} />}
                    isActive={!!activeCategory}
                    onClick={() => toggleFilter("category")}
                />
                <FilterButton
                    label="Countries"
                    icon={<Globe size={16} />}
                    isActive={!!activeCountry}
                    onClick={() => toggleFilter("country")}
                />
                <FilterButton
                    label="Languages"
                    icon={<Languages size={16} />}
                    isActive={!!activeLanguage}
                    onClick={() => toggleFilter("language")}
                />

                {/* Active Chips */}
                {activeCategory && (
                    <Chip label={activeCategoryName || activeCategory} onRemove={() => setCategory(null)} />
                )}
                {activeCountry && (
                    <Chip label={activeCountryName || activeCountry} onRemove={() => setCountry(null)} />
                )}
                {activeLanguage && (
                    <Chip label={activeLanguageName || activeLanguage} onRemove={() => setLanguage(null)} />
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {openFilter && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-30"
                            onClick={() => setOpenFilter(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 mt-2 w-full max-w-2xl bg-[#1f1f1f] border border-gray-700 rounded-xl shadow-2xl z-40 p-4 max-h-[60vh] flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white capitalize">{openFilter}</h3>
                                <button onClick={() => setOpenFilter(null)} className="text-gray-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder={`Search ${openFilter}...`}
                                    className="w-full bg-gray-900 text-white pl-9 pr-4 py-2 rounded-lg border border-gray-700 focus:border-red-600 outline-none text-sm"
                                    value={filterSearch}
                                    onChange={(e) => setFilterSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 overflow-y-auto">
                                {openFilter === "category" && filteredOptions.map((cat: any) => (
                                    <Option key={cat.id} label={cat.name} selected={activeCategory === cat.id} onClick={() => { setCategory(cat.id); setOpenFilter(null); }} />
                                ))}
                                {openFilter === "country" && filteredOptions.map((c: any) => (
                                    <Option key={c.code} label={c.name} selected={activeCountry === c.code} onClick={() => { setCountry(c.code); setOpenFilter(null); }} />
                                ))}
                                {openFilter === "language" && filteredOptions.map((l: any) => (
                                    <Option key={l.code} label={l.name} selected={activeLanguage === l.code} onClick={() => { setLanguage(l.code); setOpenFilter(null); }} />
                                ))}
                                {filteredOptions.length === 0 && (
                                    <div className="col-span-full text-center text-gray-500 py-4">
                                        No results found
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function FilterButton({ label, icon, isActive, onClick }: { label: string, icon: React.ReactNode, isActive: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition border",
                isActive
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-gray-300 border-gray-600 hover:border-white hover:text-white"
            )}
        >
            {icon}
            {label}
            <ChevronDown size={14} />
        </button>
    );
}

function Chip({ label, onRemove }: { label: string, onRemove: () => void }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-sm font-medium">
            <span>{label}</span>
            <button onClick={onRemove} className="hover:text-black transition">
                <X size={14} />
            </button>
        </div>
    );
}

function Option({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "text-left px-3 py-2 rounded-lg text-sm transition break-words",
                selected ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
        >
            {label}
        </button>
    );
}
