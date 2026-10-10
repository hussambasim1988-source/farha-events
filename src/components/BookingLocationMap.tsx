import React from 'react';
import { 
  MapPin, 
  ExternalLink, 
  Navigation, 
  Compass, 
  Building2, 
  Sparkles 
} from 'lucide-react';

interface BookingLocationMapProps {
  city: string;
  addressDetails: string;
  clientName?: string;
  eventType?: string;
  className?: string;
  compact?: boolean;
}

// Famous landmarks / districts coordinates & labels in Iraqi cities for interactive styling
const IRAQ_LOCATIONS: Record<string, { label: string; area: string; lat: number; lng: number }> = {
  'بغداد': { label: 'العاصمة بغداد', area: 'الكرخ والرصافة', lat: 33.3152, lng: 44.3661 },
  'أربيل': { label: 'محافظة أربيل', area: 'كردستان العراق', lat: 36.1901, lng: 44.0091 },
  'البصرة': { label: 'محافظة البصرة', area: 'الفيحاء وشط العرب', lat: 30.5081, lng: 47.7835 },
  'النجف': { label: 'محافظة النجف الأشرف', area: 'المدينة القديمة والفرات', lat: 32.0000, lng: 44.3333 },
  'كربلاء': { label: 'محافظة كربلاء المقدسة', area: 'وسط العراق', lat: 32.6160, lng: 44.0249 },
  'السليمانية': { label: 'محافظة السليمانية', area: 'إقليم كردستان', lat: 35.5558, lng: 45.4351 },
  'الموصل': { label: 'نينوى - الموصل', area: 'شمال العراق', lat: 36.3400, lng: 43.1300 },
  'بابل': { label: 'محافظة بابل', area: 'الحلة والآثار', lat: 32.4833, lng: 44.4333 },
  'كركوك': { label: 'محافظة كركوك', area: 'شمال وسط العراق', lat: 35.4681, lng: 44.3922 },
};

export const BookingLocationMap: React.FC<BookingLocationMapProps> = ({
  city,
  addressDetails,
  clientName,
  eventType,
  className = '',
  compact = false,
}) => {
  const fullAddress = `${city || 'العراق'} - ${addressDetails || ''}`.trim();
  
  // Format query for Google Maps
  const encodedAddress = encodeURIComponent(
    addressDetails && addressDetails.length > 2 
      ? `${city} ${addressDetails} Iraq` 
      : `${city} Iraq`
  );
  
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  // Find location details or fallback to Baghdad
  const matchedCityKey = Object.keys(IRAQ_LOCATIONS).find(k => 
    city.includes(k) || k.includes(city)
  ) || 'بغداد';
  const locationInfo = IRAQ_LOCATIONS[matchedCityKey];

  return (
    <div className={`rounded-xl overflow-hidden border border-slate-200/90 bg-slate-50 transition-all ${className}`}>
      {/* Visual Map Canvas Placeholder */}
      <div className={`relative w-full ${compact ? 'h-28' : 'h-36'} bg-slate-900 overflow-hidden select-none group`}>
        {/* Stylized Vector Map Grid / Roads Pattern */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.15) 0%, transparent 60%),
              linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(45deg, rgba(244,63,94,0.06) 25%, transparent 25%, transparent 75%, rgba(244,63,94,0.06) 75%),
              linear-gradient(-45deg, rgba(56,189,248,0.06) 25%, transparent 25%, transparent 75%, rgba(56,189,248,0.06) 75%)
            `,
            backgroundSize: '100% 100%, 24px 24px, 24px 24px, 48px 48px, 48px 48px',
          }}
        />

        {/* Abstract Decorative Map Roads & River Simulation */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Road Highway */}
          <path 
            d="M -20,70 Q 120,40 260,80 T 520,30" 
            fill="none" 
            stroke="#94a3b8" 
            strokeWidth="3.5" 
            strokeDasharray="6 4"
          />
          {/* Crossing Avenue */}
          <path 
            d="M 180,-10 L 220,160" 
            fill="none" 
            stroke="#64748b" 
            strokeWidth="2.5" 
          />
          <path 
            d="M 80,150 L 140,-10" 
            fill="none" 
            stroke="#475569" 
            strokeWidth="2" 
          />
          {/* River Wave (Tigris/Euphrates tribute) */}
          <path 
            d="M -10,30 C 80,10 160,90 280,60 C 380,30 450,110 520,80" 
            fill="none" 
            stroke="#0284c7" 
            strokeWidth="4" 
            opacity="0.6"
          />
        </svg>

        {/* Radar Pulse Animation around the Destination Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          <span className="absolute w-16 h-16 rounded-full bg-rose-500/20 animate-ping opacity-75" />
          <span className="absolute w-10 h-10 rounded-full bg-rose-500/30 animate-pulse" />
          <span className="absolute w-6 h-6 rounded-full bg-rose-500/40" />
        </div>

        {/* Centered Location Pin Marker with Tooltip Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="animate-bounce drop-shadow-[0_4px_8px_rgba(225,29,72,0.5)]">
            <div className="w-8 h-8 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center text-white shadow-lg">
              <MapPin className="w-4 h-4 fill-white" />
            </div>
          </div>
          <div className="w-2.5 h-1 bg-black/40 rounded-full blur-[1px] -mt-0.5" />
        </div>

        {/* Map Header Overlay Badges */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
          <div className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white border border-slate-700/60 text-[10px] font-bold flex items-center gap-1">
            <Compass className="w-3 h-3 text-rose-400 animate-spin-slow" />
            <span>{city}</span>
          </div>
          {eventType && (
            <div className="hidden sm:flex px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-amber-300 border border-slate-700/60 text-[10px] font-medium items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>موقع الحفل</span>
            </div>
          )}
        </div>

        {/* Interactive Overlay Button (Click to Open Google Maps directly) */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/0 group-hover:bg-slate-950/40 transition-all cursor-pointer"
          title="فتح في خرائط جوجل"
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0 px-3 py-1.5 rounded-xl bg-white text-slate-900 font-black text-xs shadow-lg flex items-center gap-1.5 border border-slate-200">
            <Navigation className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            <span>عرض الموقع على الخريطة ↗</span>
          </span>
        </a>

        {/* Bottom Coordinates & Watermark */}
        <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 text-[9px] font-mono text-slate-400 bg-slate-950/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
          <span>{locationInfo.lat.toFixed(2)}°N, {locationInfo.lng.toFixed(2)}°E</span>
        </div>
      </div>

      {/* Location Details & Action Footer */}
      <div className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-start gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 border border-rose-100">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black text-slate-900 truncate">
                {city}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                • {locationInfo.area}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 truncate mt-0.5" title={fullAddress}>
              {addressDetails || 'العنوان غير محدد بالتفصيل'}
            </p>
          </div>
        </div>

        {/* Direct Google Maps Action Link Button */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 text-xs font-bold transition-colors shrink-0 cursor-pointer shadow-2xs group"
          title={`فتح ${fullAddress} في تطبيق خرائط Google`}
        >
          <MapPin className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
          <span>فتح في خرائط جوجل</span>
          <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
        </a>
      </div>
    </div>
  );
};
