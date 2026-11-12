import React, { useState, useEffect } from 'react';
import { Order } from '../../../types';

interface NavigationModalProps {
  order: Order;
  onClose: () => void;
  onArrived: () => void;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({
  order,
  onClose,
  onArrived,
}) => {
  const [speed, setSpeed] = useState(24);
  const [remainingDist, setRemainingDist] = useState(order.distanceKm);

  // Simulate riding movement
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(Math.floor(20 + Math.random() * 8));
      setRemainingDist((prev) => Math.max(0.1, Number((prev - 0.05).toFixed(2))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#121614] text-white flex flex-col justify-between animate-in fade-in duration-200">
      {/* Top Turn-by-Turn Guidance Bar */}
      <div className="bg-[#1b5e20] p-4 pt-6 shadow-xl border-b border-emerald-700/50">
        <div className="max-w-md mx-auto flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
            <span className="material-symbols-outlined text-[32px] text-[#acf4a4]">
              turn_left
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[20px] font-black leading-tight text-white flex items-baseline gap-2">
              <span>In 150m</span>
              <span className="text-xs font-normal text-emerald-200 uppercase tracking-wider">
                Turn Left
              </span>
            </div>
            <p className="text-[13px] text-emerald-100 truncate mt-0.5">
              Onto Pocket B Road, Sector 14
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/20 flex items-center justify-center text-white/80 hover:text-white"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      </div>

      {/* Main Map View Area */}
      <div className="flex-1 relative bg-[#1c2420] overflow-hidden flex items-center justify-center">
        {/* Vector road map illustration */}
        <svg className="w-full h-full" preserveAspectRatio="none">
          <rect width="100%" height="100%" fill="#18201a" />
          {/* Roads */}
          <path d="M 0,180 Q 150,150 250,220 T 500,200" fill="none" stroke="#2a382e" strokeWidth="40" />
          <path d="M 180,0 L 220,500" fill="none" stroke="#2a382e" strokeWidth="32" />
          {/* Active green route path */}
          <path
            d="M 180,450 Q 200,320 220,250 T 320,140"
            fill="none"
            stroke="#acf4a4"
            strokeWidth="8"
            strokeDasharray="12,6"
            className="animate-pulse"
          />
        </svg>

        {/* Speedometer Widget */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/10 text-center shadow-lg">
          <div className="text-[22px] font-black text-[#acf4a4] leading-none">
            {speed}
          </div>
          <div className="text-[10px] text-gray-300 uppercase font-bold tracking-wider mt-0.5">
            KM/H
          </div>
        </div>

        {/* Center Rider Marker */}
        <div className="absolute flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#1b5e20] text-white flex items-center justify-center shadow-2xl border-3 border-white animate-pulse">
            <span className="material-symbols-outlined text-2xl">sports_motorsports</span>
          </div>
          <span className="text-[10px] font-bold bg-black/80 px-2 py-0.5 rounded-full text-white mt-1 border border-white/20">
            Rider Live GPS
          </span>
        </div>

        {/* Destination Pin */}
        <div className="absolute top-16 right-16 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shadow-2xl border-2 border-white">
            <span className="material-symbols-outlined text-xl">location_on</span>
          </div>
          <span className="text-[10px] font-bold bg-[#ba1a1a] px-2 py-0.5 rounded-full text-white mt-1">
            {order.customerName}
          </span>
        </div>
      </div>

      {/* Bottom Floating Delivery Controls */}
      <div className="bg-[#18201a] border-t border-white/10 p-4 pb-8 space-y-3">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
            <div>
              <span className="text-white font-bold text-base block leading-none">
                {remainingDist} km
              </span>
              <span>Remaining Distance</span>
            </div>
            <div className="text-right">
              <span className="text-white font-bold text-base block leading-none">
                {order.etaStr}
              </span>
              <span>ETA to Handoff</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                order.address.fullAddress
              )}`}
              target="_blank"
              rel="noreferrer"
              className="py-2 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10"
            >
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
              <span>Google Maps</span>
            </a>

            <button
              type="button"
              onClick={() => {
                onArrived();
                onClose();
              }}
              className="py-2 px-2.5 rounded-lg bg-[#acf4a4] hover:bg-[#91d78a] text-[#002203] text-xs font-black flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[15px]">pin_drop</span>
              <span>Arrived at Gate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
