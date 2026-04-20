import React, { useState, useEffect } from 'react';
import { adService } from '../../services/api';
import { ExternalLink, Loader2 } from 'lucide-react';

const AdBanner = () => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetchAd();
  }, []);

  const fetchAd = async () => {
    try {
      setLoading(true);
      const res = await adService.getRandomAd();
      setAd(res.data);
      // Tracking impression will happen after image loads for accuracy
    } catch (err) {
      console.log('No ads available or error fetching ad');
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (ad && ad.id) {
      adService.trackImpression(ad.id).catch(e => console.error('Impression error', e));
    }
  };

  const handleClick = () => {
    if (ad && ad.id) {
      adService.trackClick(ad.id).catch(e => console.error('Click error', e));
    }
  };

  if (loading) {
    return (
      <div className="w-full h-32 rounded-2xl bg-white/5 animate-pulse flex items-center justify-center border border-white/10">
        <Loader2 className="animate-spin text-slate-500" size={24} />
      </div>
    );
  }

  if (!ad) return null;

  const imageUrl = ad.image ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${ad.image}` : null;

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-primary/30 hover:shadow-gold-glow">
      <a 
        href={ad.url} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block"
      >
        <div className="relative h-32 w-full overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={ad.title}
              onLoad={handleImageLoad}
              className={`h-full w-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-100 blur-0' : 'scale-110 blur-xl opacity-0'}`}
            />
          ) : (
             <div className="w-full h-full bg-gold-gradient/20 flex items-center justify-center">
                <span className="text-primary/50 font-bold uppercase tracking-tighter text-2xl opacity-20">Patrocinado</span>
             </div>
          )}
          
          {/* Overlay info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h4 className="text-white font-bold text-sm leading-tight flex items-center gap-2">
              {ad.title} <ExternalLink size={12} className="text-primary" />
            </h4>
          </div>
          
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
             <span className="text-[8px] font-bold text-white/50 uppercase tracking-widest">Publicidad</span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default AdBanner;
