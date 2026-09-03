import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from '../context/ToastContext';

const STYLES = {
  success: {
    icon: CheckCircleIcon,
    color: 'text-app-success',
    bg: 'bg-app-success-soft',
    bar: 'bg-app-success',
  },
  error: {
    icon: XCircleIcon,
    color: 'text-app-danger',
    bg: 'bg-app-danger-soft',
    bar: 'bg-app-danger',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    color: 'text-app-warning',
    bg: 'bg-app-warning-soft',
    bar: 'bg-app-warning',
  },
  info: {
    icon: InformationCircleIcon,
    color: 'text-app-info',
    bg: 'bg-app-info-soft',
    bar: 'bg-app-info',
  },
};

export default function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 left-4 z-[10000] flex flex-col items-end gap-3 sm:left-auto sm:w-96"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const style = STYLES[toast.type] || STYLES.info;
        const Icon = style.icon;
        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto relative w-full overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-card animate-toast-in backdrop-blur-xl sm:max-w-sm"
          >
            <div className="flex items-start gap-3 p-4">
              <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.bg} ${style.color}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                {toast.title && (
                  <p className="text-sm font-semibold text-app-text">{toast.title}</p>
                )}
                {toast.message && (
                  <p className={`text-sm ${toast.title ? 'mt-0.5' : ''} text-app-text-2`}>
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="icon-btn shrink-0 h-7 w-7 rounded-md"
                aria-label="Dismiss notification"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            <span
              className={`absolute bottom-0 left-0 h-0.5 ${style.bar}`}
              style={{ animation: `progress ${toast.duration}ms linear forwards` }}
            />
          </div>
        );
      })}
      <style>{`@keyframes progress { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  );
}
