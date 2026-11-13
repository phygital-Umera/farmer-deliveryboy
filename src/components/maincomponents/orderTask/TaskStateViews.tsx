import React from 'react';
import {useT} from '@/i18n/LanguageContext';

interface TaskLoadingViewProps {
  label?: string;
}

export const TaskLoadingView: React.FC<TaskLoadingViewProps> = () => {
  const t = useT();
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#1b5e20] border-t-transparent" />
      <span className="text-sm font-semibold text-[#525e54]">
        {t('task.loading')}
      </span>
    </div>
  );
};

interface TaskErrorViewProps {
  message?: string;
  onBack: () => void;
}

export const TaskErrorView: React.FC<TaskErrorViewProps> = ({
  message,
  onBack,
}) => {
  const t = useT();
  return (
    <div className="mx-auto max-w-md p-8 pt-20 text-center">
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
        <span className="material-symbols-outlined text-3xl">
          error_outline
        </span>
      </div>
      <h3 className="text-gray-900 mb-1 text-lg font-bold">
        {t('task.notFound')}
      </h3>
      <p className="text-gray-500 mb-5 text-xs">{message || t('task.noId')}</p>
      <button
        type="button"
        onClick={onBack}
        className="shadow-xs rounded-xl bg-[#1b5e20] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#144818] active:scale-95"
      >
        {t('task.backToOrders')}
      </button>
    </div>
  );
};
