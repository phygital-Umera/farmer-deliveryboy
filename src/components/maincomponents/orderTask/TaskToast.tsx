import React from 'react';

interface TaskToastProps {
  message: string;
  onClose: () => void;
}

export const TaskToast: React.FC<TaskToastProps> = ({message, onClose}) => {
  return (
    <div className="animate-in slide-in-from-top-4 fixed inset-x-4 top-4 z-50 flex items-center gap-3 rounded-2xl bg-[#1b6d24] p-4 text-white shadow-2xl duration-200">
      <span className="material-symbols-outlined text-[28px] text-[#acf4a4]">
        check_circle
      </span>
      <div className="flex-1 text-[13px] font-bold leading-tight">
        {message}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-white/80 hover:text-white"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
};

export default TaskToast;
