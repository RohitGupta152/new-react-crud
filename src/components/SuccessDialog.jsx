import React, { useEffect, useState } from 'react';

const SuccessDialog = ({ isOpen, message, onClose, duration = 3000 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isOpen) {
      // Reset progress when dialog opens
      setProgress(100);

      // Start countdown
      const startTime = Date.now();
      const endTime = startTime + duration;

      const timer = setInterval(() => {
        const now = Date.now();
        const remaining = endTime - now;
        const newProgress = (remaining / duration) * 100;

        if (remaining <= 0) {
          clearInterval(timer);
          onClose();
        } else {
          setProgress(Math.max(0, newProgress));
        }
      }, 16); // Smoother animation with 60fps

      // Auto close after exact duration
      const closeTimer = setTimeout(() => {
        clearInterval(timer);
        onClose();
      }, duration);

      return () => {
        clearInterval(timer);
        clearTimeout(closeTimer);
      };
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-xl relative overflow-hidden">
        {/* Progress bar */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-[16ms] ease-linear"
          style={{ width: `${progress}%` }}
        />

        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 dark:bg-green-900/50 rounded-full p-3">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">Success!</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessDialog; 