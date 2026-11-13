import React from 'react';
import {useT} from '@/i18n/LanguageContext';

interface TaskStatusHeaderProps {
  onBack: () => void;
  status: string;
}

export const TaskStatusHeader: React.FC<TaskStatusHeaderProps> = ({
  onBack,
  status,
}) => {
  const t = useT();

  return (
    <div className="shadow-2xs sticky top-0 z-30 flex items-center justify-between border border-stroke bg-[#fcf9f8]/95 px-4 py-2.5">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-xs font-bold text-[#1b5e20] transition-all hover:text-[#144818] active:scale-95"
      >
        <span className="material-symbols-outlined text-[20px]">
          arrow_back
        </span>
        <span>{t('task.back')}</span>
      </button>

      <span className="rounded-full border border-[#a0f399] bg-[#e8f5e9] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-[#1b5e20]">
        {t(`status.${String(status).toUpperCase()}`, undefined, status)}
      </span>
    </div>
  );
};

export default TaskStatusHeader;
