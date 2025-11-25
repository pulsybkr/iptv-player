import { IChannel, IStream, ICountry, ICategory, ILanguage, IMergedChannel } from '../types';

const BASE_URL = 'https://iptv-org.github.io/api';

export const fetchCountries = async (): Promise<ICountry[]> => {
  try {
    const res = await fetch(`${BASE_URL}/countries.json`);
    if (!res.ok) throw new Error('Failed to fetch countries');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchCategories = async (): Promise<ICategory[]> => {
  try {
    const res = await fetch(`${BASE_URL}/categories.json`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchLanguages = async (): Promise<ILanguage[]> => {
  try {
    const res = await fetch(`${BASE_URL}/languages.json`);
    if (!res.ok) throw new Error('Failed to fetch languages');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Fetching channels and streams can be heavy. We implement a joining strategy.
export const fetchChannelsData = async (): Promise<IMergedChannel[]> => {
  try {
    // Parallel fetch for speed
    const [channelsRes, streamsRes] = await Promise.all([
      fetch(`${BASE_URL}/channels.json`),
      fetch(`${BASE_URL}/streams.json`)
    ]);

    if (!channelsRes.ok || !streamsRes.ok) throw new Error('Failed to fetch data');

    const channels: IChannel[] = await channelsRes.json();
    const streams: IStream[] = await streamsRes.json();

    // Create a map of streams for O(1) lookup
    // Prioritize online streams
    const streamMap = new Map<string, IStream>();
    streams.forEach(stream => {
        // We only want online streams preferably, or overwrite if we find a better one
        // Just taking the first available one for simplicity in this demo, usually filtering by 'online' is better
        if (!streamMap.has(stream.channel) || (stream.status === 'online' && streamMap.get(stream.channel)?.status !== 'online')) {
            streamMap.set(stream.channel, stream);
        }
    });

    // Merge data
    const merged: IMergedChannel[] = [];
    
    // Limit processing to prevent browser freeze on low-end devices if lists are huge (30k+)
    // But for a robust app, we try to process all. 
    // Optimization: Only keep channels that HAVE a stream.
    
    for (const channel of channels) {
      const stream = streamMap.get(channel.id);
      if (stream && !channel.is_nsfw) { // Filtering out NSFW by default for general usage
        merged.push({
          ...channel,
          // Sanitize data: Ensure arrays are actually arrays to prevent 'includes' errors
          languages: Array.isArray(channel.languages) ? channel.languages : [],
          categories: Array.isArray(channel.categories) ? channel.categories : [],
          name: channel.name || 'Unknown Channel',
          streamUrl: stream.url,
          streamHeight: stream.height
        });
      }
    }

    return merged;
  } catch (error) {
    console.error('Error fetching IPTV data:', error);
    return [];
  }
};
