import React, { useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-xl p-6 m-4 max-w-sm w-full transform transition-transform scale-95 animate-modal-enter"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900" id="modal-title">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:text-sm"
            onClick={onClose}
          >
            إلغاء
          </button>
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            onClick={onConfirm}
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;