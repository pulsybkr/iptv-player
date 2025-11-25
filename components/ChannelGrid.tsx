import React, { useState, useEffect } from 'react';
import { IMergedChannel } from '../types';
import { Tv, Globe, PlayCircle } from 'lucide-react';

interface ChannelGridProps {
  channels: IMergedChannel[];
  onSelectChannel: (channel: IMergedChannel) => void;
  selectedChannelId?: string;
}

const PAGE_SIZE = 48;

const ChannelGrid: React.FC<ChannelGridProps> = ({ channels, onSelectChannel, selectedChannelId }) => {
  const [displayedChannels, setDisplayedChannels] = useState<IMergedChannel[]>([]);
  const [page, setPage] = useState(1);

  // Reset pagination when channels prop changes (filters applied)
  useEffect(() => {
    setPage(1);
    setDisplayedChannels(channels.slice(0, PAGE_SIZE));
  }, [channels]);

  const loadMore = () => {
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * PAGE_SIZE;
    const newBatch = channels.slice(startIndex, startIndex + PAGE_SIZE);
    
    if (newBatch.length > 0) {
      setDisplayedChannels(prev => [...prev, ...newBatch]);
      setPage(nextPage);
    }
  };

  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Tv className="w-12 h-12 mb-4 opacity-50" />
        <p>Aucune chaîne trouvée pour ces filtres.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6" id="scroll-container">
       <div className="mb-4 text-sm text-slate-400">
         Affichage de {displayedChannels.length} sur {channels.length} chaînes
       </div>
       
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayedChannels.map((channel) => (
          <button
            key={`${channel.id}-${channel.streamUrl}`} // Unique key combo
            onClick={() => onSelectChannel(channel)}
            className={`
              group relative flex flex-col aspect-video bg-dark-800 rounded-lg overflow-hidden border transition-all duration-200 hover:shadow-lg hover:shadow-brand-900/20
              ${selectedChannelId === channel.id ? 'border-brand-500 ring-1 ring-brand-500' : 'border-dark-700 hover:border-brand-600'}
            `}
          >
            {/* Logo Area */}
            <div className="flex-1 w-full bg-white/5 p-4 flex items-center justify-center relative">
               {channel.logo ? (
                 <img 
                    src={channel.logo} 
                    alt={channel.name} 
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                 />
               ) : null}
               {/* Fallback Icon */}
               <div className={`text-slate-600 ${channel.logo ? 'hidden' : 'block'}`}>
                  <Tv className="w-10 h-10" />
               </div>

               {/* Play Overlay */}
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                 <PlayCircle className="w-10 h-10 text-white drop-shadow-md" />
               </div>
            </div>

            {/* Info Area */}
            <div className="w-full bg-dark-800 p-3 text-left border-t border-dark-700">
              <h3 className="font-semibold text-sm text-slate-200 truncate" title={channel.name}>{channel.name}</h3>
              <div className="flex items-center mt-1 space-x-2 text-xs text-slate-400">
                  {channel.country && (
                      <span className="flex items-center" title="Pays">
                          <Globe className="w-3 h-3 mr-1" />
                          {channel.country.toUpperCase()}
                      </span>
                  )}
                  {channel.streamHeight && (
                    <span className="bg-dark-700 px-1.5 rounded text-[10px] text-brand-400 border border-dark-600">
                        {channel.streamHeight}p
                    </span>
                  )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {displayedChannels.length < channels.length && (
        <div className="mt-8 flex justify-center pb-8">
          <button 
            onClick={loadMore}
            className="px-6 py-2 bg-dark-700 hover:bg-dark-600 text-slate-200 rounded-full font-medium transition-colors border border-dark-600"
          >
            Charger plus de chaînes
          </button>
        </div>
      )}
    </div>
  );
};

export default ChannelGrid;