import { create } from "zustand";
import { Channel, Stream, Category, Country, Language } from "@/types";
import { api } from "@/lib/api";

interface AppState {
    channels: Channel[];
    streams: Stream[];
    categories: Category[];
    countries: Country[];
    languages: Language[];

    filteredChannels: Channel[];
    activeCategory: string | null;
    activeCountry: string | null;
    activeLanguage: string | null;
    searchQuery: string;

    isLoading: boolean;
    error: string | null;

    fetchData: () => Promise<void>;
    setCategory: (id: string | null) => void;
    setCountry: (code: string | null) => void;
    setLanguage: (code: string | null) => void;
    setSearch: (query: string) => void;
    getStreamUrl: (channelId: string) => string | undefined;
    applyFilters: () => void;
}

export const useStore = create<AppState>((set, get) => ({
    channels: [],
    streams: [],
    categories: [],
    countries: [],
    languages: [],

    filteredChannels: [],
    activeCategory: null,
    activeCountry: null,
    activeLanguage: null,
    searchQuery: "",

    isLoading: false,
    error: null,

    fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [channels, streams, categories, countries, languages, logos] = await Promise.all([
                api.getChannels(),
                api.getStreams(),
                api.getCategories(),
                api.getCountries(),
                api.getLanguages(),
                api.getLogos(),
            ]);

            // Create a logo map for faster lookup
            // logos is expected to be { name: string, url: string }[]
            const logoMap = new Map(logos.map((l: any) => [l.name?.toLowerCase(), l.url]));

            // Filter channels that have streams
            const streamChannelIds = new Set(streams.map(s => s.channel));
            const availableChannels = channels.filter(c => streamChannelIds.has(c.id)).map(c => {
                // Try to find a logo if missing
                if (!c.logo) {
                    const foundLogo = logoMap.get(c.name.toLowerCase());
                    if (foundLogo) {
                        return { ...c, logo: foundLogo };
                    }
                }
                return c;
            });

            set({
                channels: availableChannels,
                streams,
                categories,
                countries,
                languages,
                filteredChannels: availableChannels,
                isLoading: false,
            });
        } catch (err) {
            console.error("Failed to fetch data:", err);
            set({ error: "Failed to load channels", isLoading: false });
        }
    },

    setCategory: (id) => {
        set({ activeCategory: id });
        get().applyFilters();
    },

    setCountry: (code) => {
        set({ activeCountry: code });
        get().applyFilters();
    },

    setLanguage: (code) => {
        set({ activeLanguage: code });
        get().applyFilters();
    },

    setSearch: (query) => {
        set({ searchQuery: query });
        get().applyFilters();
    },

    applyFilters: () => {
        const { channels, activeCategory, activeCountry, activeLanguage, searchQuery } = get();

        let filtered = channels;

        if (activeCategory) {
            filtered = filtered.filter(c => c.categories.includes(activeCategory));
        }

        if (activeCountry) {
            filtered = filtered.filter(c => c.country === activeCountry);
        }

        if (activeLanguage) {
            filtered = filtered.filter(c => c.languages.includes(activeLanguage));
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(c => c.name.toLowerCase().includes(q));
        }

        set({ filteredChannels: filtered });
    },

    getStreamUrl: (channelId) => {
        const { streams } = get();
        const stream = streams.find(s => s.channel === channelId);
        return stream?.url;
    },
}));
