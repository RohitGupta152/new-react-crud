import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';

function ErrorDialog({ isOpen, message, onClose, duration = 10000, errorData }) {
  const [progress, setProgress] = useState(100);
  const [remainingSeconds, setRemainingSeconds] = useState(Math.floor(duration / 1000));

  useEffect(() => {
    if (!isOpen) return undefined;
    setProgress(100);
    setRemainingSeconds(Math.floor(duration / 1000));
    const start = Date.now();
    const end = start + duration;
    const timer = setInterval(() => {
      const remaining = end - Date.now();
      const p = Math.max(0, (remaining / duration) * 100);
      setProgress(p);
      setRemainingSeconds(Math.max(0, Math.ceil(remaining / 1000)));
      if (p <= 0) {
        clearInterval(timer);
        onClose();
      }
    }, 30);
    const closeTimer = setTimeout(onClose, duration);
    return () => {
      clearInterval(timer);
      clearTimeout(closeTimer);
    };
  }, [isOpen, duration, onClose]);

  const renderDuplicatesList = () => {
    if (!errorData) return null;

    return (
      <div className="space-y-6">
        {errorData.duplicatesInFile && (
          <>
            {errorData.duplicatesInFile.emails?.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-app-text">Duplicate Emails in File:</h4>
                <ul className="space-y-1.5">
                  {errorData.duplicatesInFile.emails.map(({ value, entries }) => (
                    <li key={value} className="flex items-center gap-2 text-sm text-app-danger">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-app-danger" />
                      <span className="font-medium break-all">{value}</span>
                      <span className="text-app-text-3">(Used {entries.length} times)</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {errorData.duplicatesInFile.mobiles?.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-app-text">Duplicate Mobile Numbers in File:</h4>
                <ul className="space-y-1.5">
                  {errorData.duplicatesInFile.mobiles.map(({ value, entries }) => (
                    <li key={value} className="flex items-center gap-2 text-sm text-app-danger">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-app-danger" />
                      <span className="font-medium break-all">{value}</span>
                      <span className="text-app-text-3">(Used {entries.length} times)</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {errorData.existingInDatabase && (
          <>
            {errorData.existingInDatabase.emails?.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-app-text">Existing Emails in Database:</h4>
                <ul className="space-y-2">
                  {errorData.existingInDatabase.emails.map(({ value, existingUser }) => (
                    <li key={value} className="flex items-center gap-2 text-sm text-app-danger">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-app-danger" />
                      <span className="font-semibold break-all">{value}</span>
                      <span className="text-app-text-3">(Used by {existingUser?.name})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {errorData.existingInDatabase.mobiles?.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-app-text">Existing Mobile Numbers in Database:</h4>
                <ul className="space-y-2">
                  {errorData.existingInDatabase.mobiles.map(({ value, existingUser }) => (
                    <li key={value} className="flex items-center gap-2 text-sm text-app-danger">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-app-danger" />
                      <span className="font-semibold break-all">{value}</span>
                      <span className="text-app-text-3">(Used by {existingUser?.name})</span>
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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg" titleId="error-title" className="overflow-hidden">
      <div className="flex flex-col">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 animate-pop items-center justify-center rounded-xl bg-app-danger-soft text-app-danger">
              <XCircleIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 id="error-title" className="text-lg font-bold text-app-text">
                Error
              </h3>
              <p className="mt-1 text-sm text-app-danger">{message}</p>
              <p className="mt-2 text-xs font-medium text-app-text-3">
                Closing in{' '}
                <span className="font-bold text-app-danger">{remainingSeconds}s</span>
              </p>
            </div>
          </div>
        </div>

        {renderDuplicatesList() && (
          <div className="max-h-[40vh] overflow-y-auto border-t border-app-border-2 px-6 py-5">
            {renderDuplicatesList()}
          </div>
        )}

        <div className="border-t border-app-border-2 p-6 pt-4">
          <button type="button" data-autofocus onClick={onClose} className="btn-danger w-full px-4 py-2.5 text-sm">
            Close
          </button>
        </div>
        <span
          className="absolute bottom-0 left-0 h-1 rounded-full bg-app-danger"
          style={{ width: `${progress}%`, transition: 'width 30ms linear' }}
        />
      </div>
    </Modal>
  );
}

ErrorDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
  errorData: PropTypes.any,
};

export default ErrorDialog;
