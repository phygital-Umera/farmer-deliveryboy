import React from 'react';
import {useT} from '@/i18n/LanguageContext';
import {TranslationKey} from '@/i18n/translations';

export const ISSUE_REASONS: TranslationKey[] = [
  'issue.doorLocked',
  'issue.refused',
  'issue.wrongAddress',
  'issue.quality',
  'issue.reschedule',
];

interface TaskIssueModalProps {
  isOpen: boolean;
  orderNo: string;
  selectedReason: TranslationKey;
  onSelectReason: (reason: TranslationKey) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const TaskIssueModal: React.FC<TaskIssueModalProps> = ({
  isOpen,
  orderNo,
  selectedReason,
  onSelectReason,
  onClose,
  onSubmit,
}) => {
  const t = useT();

  if (!isOpen) return null;

  return (
    <div className="backdrop-blur-xs fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="animate-in slide-in-from-bottom-8 w-full max-w-sm space-y-4 rounded-2xl bg-white p-5 shadow-2xl duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#ba1a1a]">
              report_problem
            </span>
            <h3 className="text-[17px] font-bold text-[#1b1c1c]">
              {t('task.reportIssue')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0eded] hover:bg-[#eae7e7]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="text-[12px] text-[#525e54]">
          {t('task.selectIssue', {orderNo})}
        </p>

        <div className="space-y-2">
          {ISSUE_REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => onSelectReason(reason)}
              className={`flex w-full items-center justify-between rounded-xl p-3 text-left text-[13px] font-semibold transition-colors ${
                selectedReason === reason
                  ? 'border border-[#ba1a1a] bg-[#ffdad6]/60 text-[#93000a]'
                  : 'bg-[#f6f3f2] text-[#1b1c1c] hover:bg-[#eeebe9]'
              }`}
            >
              <span>{t(reason)}</span>
              {selectedReason === reason && (
                <span className="material-symbols-outlined text-[18px]">
                  check
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="shadow-xs w-full rounded-xl bg-[#ba1a1a] py-2.5 text-[12px] font-bold text-white hover:bg-[#a01616] active:scale-95"
        >
          {t('task.submitSupport')}
        </button>
      </div>
    </div>
  );
};

export default TaskIssueModal;
