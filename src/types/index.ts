export interface Channel {
    id: string;
    name: string;
    alt_names: string[];
    network: string;
    owners: string[];
    country: string;
    subdivision: string;
    city: string;
    broadcast_area: string[];
    languages: string[];
    categories: string[];
    is_nsfw: boolean;
    launched: string;
    closed: string;
    replaced_by: string;
    website: string;
    logo: string;
}

export interface Stream {
    channel: string;
    url: string;
    http_referrer: string;
    user_agent: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface Language {
    code: string;
    name: string;
}

export interface Country {
    code: string;
    name: string;
}
