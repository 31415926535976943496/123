import React from 'react';
import { ExternalLink } from 'lucide-react';

interface MapLinksProps {
  lat: number;
  lng: number;
}

export const MapLinks: React.FC<MapLinksProps> = ({ lat, lng }) => {
  return (
    <div className="flex gap-2 mt-4">
      <a 
        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
      >
        <ExternalLink size={14} />
        Google Maps
      </a>
      <a 
        href={`https://www.bing.com/maps?cp=${lat}~${lng}&lvl=16&style=r`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
      >
        <ExternalLink size={14} />
        Bing Maps
      </a>
    </div>
  );
};