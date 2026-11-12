import React from 'react';
import { ShiftStats } from '../../../types';

interface ProfileModalProps {
  shiftStats: ShiftStats;
  onClose: () => void;
  onToggleDuty: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  shiftStats,
  onClose,
  onToggleDuty,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-gray-100 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-gray-900">
            Rider Partner Profile
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 bg-[#f6f3f2] p-4 rounded-2xl border border-[#eae7e7]">
          <div className="w-14 h-14 rounded-full bg-[#1b5e20] text-white flex items-center justify-center font-black text-xl shadow-md">
            RK
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-lg text-gray-900 leading-tight">
                {shiftStats.riderName} Kumar
              </h4>
              <span className="bg-[#acf4a4] text-[#002203] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                ★ {shiftStats.rating}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              ID: <span className="font-mono font-bold text-gray-800">{shiftStats.riderId}</span>
            </p>
            <p className="text-xs text-emerald-800 font-semibold truncate">
              {shiftStats.hubName}
            </p>
          </div>
        </div>

        {/* Shift Details */}
        <div className="space-y-2.5 text-xs text-gray-600 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-gray-500">
                two_wheeler
              </span>
              Vehicle Assigned:
            </span>
            <span className="font-bold text-gray-900">{shiftStats.vehicleNo}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-gray-500">
                schedule
              </span>
              Shift Start Time:
            </span>
            <span className="font-bold text-gray-900">{shiftStats.shiftStartTime}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-gray-500">
                near_me
              </span>
              Distance Covered:
            </span>
            <span className="font-bold text-gray-900">{shiftStats.distanceCoveredKm} km</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-gray-500">
                stars
              </span>
              On-Time Bonus Today:
            </span>
            <span className="font-bold text-[#1b6d24]">₹{shiftStats.bonusEarnings}</span>
          </div>
        </div>

        {/* Shift Duty Toggle CTA */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              onToggleDuty();
              onClose();
            }}
            className={`w-full py-2 px-3 rounded-lg font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 ${shiftStats.isOnDuty
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[#1b5e20] hover:bg-[#154b1a] text-white'
              }`}
          >
            <span className="material-symbols-outlined text-base">
              {shiftStats.isOnDuty ? 'power_settings_new' : 'check_circle'}
            </span>
            <span>{shiftStats.isOnDuty ? 'End Shift / Go Off Duty' : 'Go On Duty'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
