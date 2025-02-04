import React, { useEffect, useState } from 'react';

const ErrorDialog = ({ isOpen, message, onClose, duration = 10000, errorData }) => {
  const [progress, setProgress] = useState(100);
  const [remainingSeconds, setRemainingSeconds] = useState(10);

  useEffect(() => {
    if (isOpen) {
      setProgress(100);
      setRemainingSeconds(Math.floor(duration / 1000));
      
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
          setRemainingSeconds(Math.ceil(remaining / 1000));
        }
      }, 16);

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

  const renderDuplicatesList = () => {
    if (!errorData) return null;

    return (
      <div className="mt-4 text-left">
        {/* Duplicates within file */}
        {errorData.duplicatesInFile && (
          <>
            {errorData.duplicatesInFile.emails.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-red-800 mb-2">Duplicate Emails in File:</h4>
                <ul className="space-y-1">
                  {errorData.duplicatesInFile.emails.map(({ value, entries }) => (
                    <li key={value} className="flex items-center text-sm text-red-600">
                      <span className="h-1.5 w-1.5 bg-red-600 rounded-full mr-2"></span>
                      <span className="font-medium">{value}</span>
                      <span className="ml-1">
                        (Used {entries.length} times)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {errorData.duplicatesInFile.mobiles.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-red-800 mb-2">Duplicate Mobile Numbers in File:</h4>
                <ul className="space-y-1">
                  {errorData.duplicatesInFile.mobiles.map(({ value, entries }) => (
                    <li key={value} className="flex items-center text-sm text-red-600">
                      <span className="h-1.5 w-1.5 bg-red-600 rounded-full mr-2"></span>
                      <span className="font-medium">{value}</span>
                      <span className="ml-1">
                        (Used {entries.length} times)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Existing records in database */}
        {errorData.existingInDatabase && (
          <>
            {errorData.existingInDatabase.emails.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-red-800 mb-4">Existing Emails in Database:</h4>
                <ul className="space-y-3">
                  {errorData.existingInDatabase.emails.map(({ value, existingUser }) => (
                    <li key={value} className="flex items-center text-base text-red-600">
                      <span className="h-2 w-2 bg-red-600 rounded-full mr-3"></span>
                      <span className="font-semibold">{value}</span>
                      <span className="ml-2 font-medium">
                        (Used by {existingUser.name})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {errorData.existingInDatabase.mobiles.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-red-800 mb-4">Existing Mobile Numbers in Database:</h4>
                <ul className="space-y-3">
                  {errorData.existingInDatabase.mobiles.map(({ value, existingUser }) => (
                    <li key={value} className="flex items-center text-base text-red-600">
                      <span className="h-2 w-2 bg-red-600 rounded-full mr-3"></span>
                      <span className="font-semibold">{value}</span>
                      <span className="ml-2 font-medium">
                        (Used by {existingUser.name})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl relative overflow-hidden max-h-[90vh] w-full max-w-2xl flex flex-col">
        <div 
          className="absolute bottom-0 left-0 h-1 bg-red-500 transition-all duration-[16ms] ease-linear"
          style={{ width: `${progress}%` }}
        />

        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-100 dark:bg-red-900/50 rounded-full p-4">
              <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">Import Error</h3>
          <p className="text-base text-red-600 dark:text-red-400 text-center mb-3">{message}</p>
          <div className="flex justify-end">
            <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
              Closing in <span className="text-red-600 dark:text-red-400">{remainingSeconds}s</span>
            </div>
          </div>
        </div>

        <div className="px-8 overflow-y-auto flex-1 custom-scrollbar dark:custom-scrollbar-dark">
          {renderDuplicatesList()}
        </div>

        <div className="p-8 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-red-600 dark:bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition-colors duration-200 text-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog; 