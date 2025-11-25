export interface IChannel {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
  country: string;
  languages: string[];
  categories: string[];
  is_nsfw: boolean;
}

export interface IStream {
  channel: string;
  url: string;
  status: 'online' | 'offline' | 'error';
  height: number | null;
  width: number | null;
}

export interface ICountry {
  code: string;
  name: string;
  languages: string[];
  flag: string;
}

export interface ICategory {
  id: string;
  name: string;
}

export interface ILanguage {
  code: string;
  name: string;
}

export interface IMergedChannel extends IChannel {
  streamUrl: string;
  streamHeight: number | null;
}

export interface Filters {
  country: string | null;
  category: string | null;
  language: string | null;
  search: string;
}