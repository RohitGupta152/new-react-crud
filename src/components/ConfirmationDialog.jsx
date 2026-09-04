import PropTypes from 'prop-types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';

function ConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} maxWidth="max-w-sm" titleId="confirm-title">
      <div className="p-6 text-center">
        <div className="mx-auto flex h-14 w-14 animate-pop items-center justify-center rounded-full bg-app-danger-soft text-app-danger">
          <ExclamationTriangleIcon className="h-7 w-7" />
        </div>
        <h3 id="confirm-title" className="mt-4 text-lg font-bold text-app-text">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-app-text-2">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button type="button" onClick={onCancel} className="btn-secondary flex-1 px-4 py-2.5 text-sm">
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            data-autofocus
            className="btn-danger flex-1 px-4 py-2.5 text-sm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

ConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default ConfirmationDialog;
