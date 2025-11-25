import React, { useEffect, useState, useMemo } from 'react';
import { fetchCategories, fetchChannelsData, fetchCountries, fetchLanguages } from './services/iptvService';
import { ICategory, IChannel, ICountry, ILanguage, IMergedChannel, Filters as FilterState } from './types';
import FilterSidebar from './components/Filters';
import ChannelGrid from './components/ChannelGrid';
import Player from './components/Player';
import { Menu, Tv, VideoOff } from 'lucide-react';

const App: React.FC = () => {
  const [channels, setChannels] = useState<IMergedChannel[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedChannel, setSelectedChannel] = useState<IMergedChannel | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    country: null,
    category: null,
    language: null,
    search: '',
  });

  // Initial Data Load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [cats, counts, langs, chans] = await Promise.all([
          fetchCategories(),
          fetchCountries(),
          fetchLanguages(),
          fetchChannelsData()
        ]);

        setCategories(cats);
        setCountries(counts);
        setLanguages(langs);
        setChannels(chans);
        
      } catch (e) {
        setError("Erreur lors du chargement des données. Veuillez rafraîchir la page.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Filter Logic
  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      // Search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!channel.name?.toLowerCase().includes(searchLower)) return false;
      }
      
      // Country
      if (filters.country && channel.country !== filters.country) return false;

      // Category
      if (filters.category && (!channel.categories || !channel.categories.includes(filters.category))) return false;

      // Language
      if (filters.language && (!channel.languages || !channel.languages.includes(filters.language))) return false;

      return true;
    });
  }, [channels, filters]);

  // Handle Channel Selection
  const handleSelectChannel = (channel: IMergedChannel) => {
    setSelectedChannel(channel);
    // Scroll to top of window on mobile to see player
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-dark-900 text-brand-500">
        <div className="flex flex-col items-center">
            <Tv className="w-16 h-16 animate-pulse mb-4" />
            <h1 className="text-xl font-bold text-white">IPTV Vision</h1>
            <p className="text-slate-400 mt-2">Chargement des chaînes...</p>
        </div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-dark-900 text-red-500">
        <div className="flex flex-col items-center text-center p-6">
            <VideoOff className="w-16 h-16 mb-4" />
            <h1 className="text-xl font-bold text-white">Oups!</h1>
            <p className="text-slate-400 mt-2">{error}</p>
            <button 
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition"
            >
                Réessayer
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden font-sans">
      {/* Sidebar - Hidden on mobile unless toggled */}
      <FilterSidebar 
        categories={categories}
        countries={countries}
        languages={languages}
        filters={filters}
        setFilters={setFilters}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        
        {/* Header (Mobile Only for Sidebar Toggle) */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-dark-800 border-b border-dark-700">
            <div className="flex items-center space-x-2">
                <Tv className="w-6 h-6 text-brand-500" />
                <span className="font-bold text-white">IPTV Vision</span>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2">
                <Menu className="w-6 h-6" />
            </button>
        </div>

        {/* Player Section */}
        <div className="w-full h-[40vh] md:h-[55vh] flex-shrink-0 bg-black shadow-2xl z-10">
             <Player channel={selectedChannel} />
        </div>

        {/* Channels Grid */}
        <div className="flex-1 overflow-hidden flex flex-col bg-dark-900">
            <div className="p-4 border-b border-dark-700 bg-dark-900 z-10 shadow-sm flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center">
                    <span className="w-2 h-6 bg-brand-500 rounded-sm mr-2"></span>
                    Chaînes disponibles
                </h2>
                {/* Active Filters Summary (Optional visual cue) */}
                <div className="text-xs text-slate-400 hidden sm:block">
                    {filters.country && <span className="mr-2 px-2 py-1 bg-dark-700 rounded border border-dark-600">Pays: {filters.country}</span>}
                    {filters.category && <span className="mr-2 px-2 py-1 bg-dark-700 rounded border border-dark-600">Cat: {filters.category}</span>}
                </div>
            </div>
            
            <ChannelGrid 
                channels={filteredChannels} 
                onSelectChannel={handleSelectChannel}
                selectedChannelId={selectedChannel?.id}
            />
        </div>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;