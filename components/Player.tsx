import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2, AlertTriangle } from 'lucide-react';
import { IMergedChannel } from '../types';

interface PlayerProps {
  channel: IMergedChannel | null;
}

const Player: React.FC<PlayerProps> = ({ channel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!channel) return;

    const video = videoRef.current;
    if (!video) return;

    setError(null);
    setLoading(true);

    const loadStream = () => {
      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
        });
        hlsRef.current = hls;

        hls.loadSource(channel.streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false);
          video.play().catch(() => {
             // Autoplay might be blocked
             setIsPlaying(false);
          });
          setIsPlaying(true);
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            setLoading(false);
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError("Erreur réseau. Le flux est peut-être hors ligne.");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError("Erreur de média. Tentative de récupération...");
                hls.recoverMediaError();
                break;
              default:
                setError("Impossible de lire ce flux.");
                hls.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS (Safari)
        video.src = channel.streamUrl;
        video.addEventListener('loadedmetadata', () => {
          setLoading(false);
          video.play();
          setIsPlaying(true);
        });
        video.addEventListener('error', () => {
            setLoading(false);
            setError("Erreur native de lecture.");
        });
      } else {
        setError("Votre navigateur ne supporte pas la lecture HLS.");
        setLoading(false);
      }
    };

    loadStream();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [channel]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (!channel) {
    return (
      <div className="w-full h-full bg-dark-900 flex items-center justify-center text-slate-500 border-b border-dark-800">
        <div className="text-center p-6">
          <div className="mb-4 inline-block p-4 rounded-full bg-dark-800">
             <Play className="w-8 h-8 opacity-50" />
          </div>
          <p className="text-lg font-medium">Sélectionnez une chaîne pour commencer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group w-full h-full bg-black overflow-hidden flex flex-col justify-center">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
          <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 p-4">
           <div className="text-center text-red-500">
               <AlertTriangle className="w-10 h-10 mx-auto mb-2" />
               <p>{error}</p>
           </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        crossOrigin="anonymous"
        poster={channel.logo || undefined}
        playsInline
      />

      {/* Custom Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="text-white hover:text-brand-500 transition">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button onClick={toggleMute} className="text-white hover:text-brand-500 transition">
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
            <div className="text-white text-sm font-medium">
              <span className="opacity-75">En direct: </span>
              {channel.name}
            </div>
          </div>
          <button onClick={toggleFullscreen} className="text-white hover:text-brand-500 transition">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;