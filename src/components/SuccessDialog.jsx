import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';

function SuccessDialog({ isOpen, message, onClose, duration = 3000 }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isOpen) return undefined;
    setProgress(100);
    const start = Date.now();
    const end = start + duration;
    const timer = setInterval(() => {
      const remaining = end - Date.now();
      const p = Math.max(0, (remaining / duration) * 100);
      setProgress(p);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm" titleId="success-title" className="overflow-hidden">
      <div className="p-6 text-center">
        <div className="mx-auto flex h-14 w-14 animate-pop items-center justify-center rounded-full bg-app-success-soft text-app-success">
          <CheckCircleIcon className="h-8 w-8" />
        </div>
        <h3 id="success-title" className="mt-4 text-lg font-bold text-app-text">
          Success!
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-app-text-2">{message}</p>
        <button type="button" data-autofocus onClick={onClose} className="btn-primary mt-6 w-full px-4 py-2.5 text-sm">
          Close
        </button>
      </div>
      <span
        className="absolute bottom-0 left-0 h-1 rounded-full bg-app-success"
        style={{ width: `${progress}%`, transition: 'width 30ms linear' }}
      />
    </Modal>
  );
}

SuccessDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default SuccessDialog;
