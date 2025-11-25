import { Channel, Stream, Category, Country, Language } from "@/types";

const BASE_URL = "https://iptv-org.github.io/api";

export const api = {
    getChannels: async (): Promise<Channel[]> => {
        const res = await fetch(`${BASE_URL}/channels.json`);
        return res.json();
    },

    getStreams: async (): Promise<Stream[]> => {
        const res = await fetch(`${BASE_URL}/streams.json`);
        return res.json();
    },

    getCategories: async (): Promise<Category[]> => {
        const res = await fetch(`${BASE_URL}/categories.json`);
        return res.json();
    },

    getCountries: async (): Promise<Country[]> => {
        const res = await fetch(`${BASE_URL}/countries.json`);
        return res.json();
    },

    getLanguages: async (): Promise<Language[]> => {
        const res = await fetch(`${BASE_URL}/languages.json`);
        return res.json();
    },

    getLogos: async (): Promise<{ name: string; url: string }[]> => {
        const res = await fetch("https://iptv-org.github.io/api/logos.json");
        return res.json();
    }
};
