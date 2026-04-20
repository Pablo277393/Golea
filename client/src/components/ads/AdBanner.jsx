import React, { useState, useEffect } from 'react';
import { adService } from '../../services/api';
import { ExternalLink, Loader2, X } from 'lucide-react';

/**
 * AdBanner Component
 * @param {string} variant - 'desktop' | 'mobile' | 'inline' | 'sticky'
 * @param {string} className - Optional override styles
 */
const AdBanner = ({ variant = 'inline', className = '' }) => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchAd();
  }, []);

  const fetchAd = async () => {
    try {
      setLoading(true);
      const res = await adService.getRandomAd();
      setAd(res.data);
    } catch (err) {
      // Quietly fail for ads
      setAd(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (ad?.id) {
      adService.trackImpression(ad.id).catch(e => {});
    }
  };

  const handleClick = () => {
    if (ad?.id) {
      adService.trackClick(ad.id).catch(e => {});
    }
  };

  if (!isVisible || (!loading && !ad)) return null;

  // Variant Styling
  const variantStyles = {
    desktop: "w-[160px] lg:w-[180px] h-full sticky top-28", // Skyscraper
    mobile: "w-full h-32 md:h-40",
    inline: "w-full h-32 rounded-3xl",
    sticky: "fixed bottom-0 left-0 right-0 z-[100] h-20 bg-dark/90 backdrop-blur-xl border-t border-white/10"
  };

  // Image Layout Styling
  const containerSize = {
    desktop: "h-full w-full",
    mobile: "h-full w-full",
    inline: "h-full w-full",
    sticky: "h-full w-full flex items-center justify-between px-6"
  };

  if (loading) {
    return (
      <div className={`${variantStyles[variant]} rounded-2xl bg-white/5 animate-pulse flex items-center justify-center border border-white/10 ${className}`}>
        <Loader2 className="animate-spin text-slate-500" size={24} />
      </div>
    );
  }

  const imageUrl = (() => {
    if (!ad?.image) return null;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const imagePath = ad.image.startsWith('/') ? ad.image : `/${ad.image}`;
    return `${baseUrl}${imagePath}`;
  })();

  return (
    <div className={`group relative overflow-hidden transition-all duration-500 border border-white/5 hover:border-primary/20 ${variantStyles[variant]} ${ad.priority >= 5 ? 'shadow-gold-glow-sm' : ''} ${className}`}>
      {variant === 'sticky' && (
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white/50 hover:text-white z-20"
        >
          <X size={12} />
        </button>
      )}

      <a 
        href={ad.url} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`block ${containerSize[variant]}`}
      >
        <div className={`relative w-full h-full ${variant === 'desktop' ? 'min-h-[400px]' : ''}`}>
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={ad.title}
              onLoad={handleImageLoad}
              className={`h-full w-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-100' : 'scale-110 blur-xl opacity-0'}`}
            />
          ) : (
             <div className="w-full h-full bg-gold-gradient/10 flex items-center justify-center text-center p-4">
                <span className="text-primary/30 font-black uppercase tracking-tighter text-xl rotate-[-20deg]">Golea Sponsor</span>
             </div>
          )}
          
          {/* Overlay - different for skyscraper vs horizontal */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          
          <div className={`absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 translate-y-full group-hover:translate-y-0 bg-black/60 backdrop-blur-md`}>
             <p className="text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-2">
                {ad.title} <ExternalLink size={10} className="text-primary" />
             </p>
          </div>

          {/* Ad Badge */}
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 z-10">
             <span className="text-[7px] font-black text-primary uppercase tracking-[0.2em]">Publicidad</span>
          </div>

          {/* Special Priority Badge (Premium) */}
          {ad.priority >= 5 && (
            <div className="absolute -right-8 top-4 rotate-45 bg-primary px-10 py-1 shadow-lg z-10 pointer-events-none">
               <span className="text-[6px] font-black text-dark uppercase tracking-widest italic">Premium</span>
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export default AdBanner;
