import React from 'react';
import {useT} from '@/i18n/LanguageContext';

interface TaskChecklistCardProps {
  items: any[];
  verifiedItemIds: Record<string, boolean>;
  onToggleVerified: (itemId: string) => void;
  onPickup: () => void;
}

export const TaskChecklistCard: React.FC<TaskChecklistCardProps> = ({
  items,
  verifiedItemIds,
  onToggleVerified,
  onPickup,
}) => {
  const t = useT();
  const verifiedCount = Object.values(verifiedItemIds).filter(Boolean).length;

  return (
    <div className="shadow-2xs rounded-2xl border border-[#e0e6e0] bg-white p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[20px] text-[#1b6d24]">
            inventory_2
          </span>
          <h2 className="text-[14px] font-bold text-[#1b1c1c]">
            {t('task.checklist')}
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-[#e8f5e9] px-2.5 py-0.5 text-[11px] font-semibold text-[#1b6d24]">
            {t('task.checked', {done: verifiedCount, total: items.length})}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const isChecked = !!verifiedItemIds[item.id];
          const qty =
            item.productQuantity ||
            item.totalQuantity ||
            item.productCount ||
            1;
          const name = item.productName || 'Fresh Produce';

          return (
            <div
              key={item.id}
              onClick={() => onToggleVerified(item.id)}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 transition-all active:scale-[0.99] ${
                isChecked
                  ? 'border-[#88d982] bg-[#f6fbf6]'
                  : 'border-[#e0e6e0] bg-[#fcf9f8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                    isChecked
                      ? 'border-[#1b5e20] bg-[#1b5e20] text-white'
                      : 'border-[#717a6d] bg-white'
                  }`}
                >
                  {isChecked && (
                    <span className="material-symbols-outlined text-[16px]">
                      check
                    </span>
                  )}
                </div>
                <div className="text-[13px] font-semibold text-[#1b1c1c]">
                  {name}
                </div>
              </div>

              <span className="rounded-md border border-[#e0e6e0] bg-white px-2.5 py-0.5 text-[12px] font-bold text-[#1b1c1c]">
                {qty} kg
              </span>
            </div>
          );
        })}
      </div>

      {/* Simple Green Pick Up Button */}
      <button
        type="button"
        onClick={onPickup}
        className="shadow-xs mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b5e20] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#144818] active:scale-[0.99]"
      >
        <span className="material-symbols-outlined text-[18px]">
          shopping_bag
        </span>
        <span>
          {t('task.pickUp', {done: verifiedCount, total: items.length})}
        </span>
      </button>
    </div>
  );
};

export default TaskChecklistCard;
