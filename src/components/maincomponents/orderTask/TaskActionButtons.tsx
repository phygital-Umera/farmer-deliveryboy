import React from 'react';
import {useT} from '@/i18n/LanguageContext';

interface TaskActionButtonsProps {
  status?: string;
  isDelivering: boolean;
  grandTotal: number;
  onSubmitDelivery: () => void;
  onOpenIssueModal: () => void;
}

export const TaskActionButtons: React.FC<TaskActionButtonsProps> = ({
  status,
  isDelivering,
  grandTotal,
  onSubmitDelivery,
  onOpenIssueModal,
}) => {
  const t = useT();

  if (status === 'DELIVERED') return null;

  return (
    <div className="space-y-2 pt-2">
      <button
        type="button"
        disabled={isDelivering}
        onClick={onSubmitDelivery}
        className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b5e20] px-4 py-3 text-[14px] font-extrabold text-white shadow-md transition-all hover:bg-[#144818] active:scale-[0.98] ${
          isDelivering ? 'cursor-not-allowed opacity-70' : ''
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">task_alt</span>
        <span>{t('task.markDelivered', {amount: grandTotal})}</span>
      </button>

      {/* Report Issue Button */}
      <div className="text-center">
        <button
          type="button"
          onClick={onOpenIssueModal}
          className="mx-auto flex items-center justify-center gap-1 py-1 text-xs font-bold text-[#ba1a1a] hover:underline"
        >
          <span className="material-symbols-outlined text-[16px]">
            report_problem
          </span>
          <span>{t('task.reportIssueBtn')}</span>
        </button>
      </div>
    </div>
  );
};

export default TaskActionButtons;
