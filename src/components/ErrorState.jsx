import PropTypes from 'prop-types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function ErrorState({ message, onRetry, children }) {
  return (
    <div className="card animate-scale-in relative overflow-hidden rounded-2xl px-6 py-14 text-center sm:py-16">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, var(--danger-soft), transparent)' }}
        aria-hidden="true"
      />
      <div className="relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-app-danger-soft text-app-danger">
          <ExclamationTriangleIcon className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-lg font-bold text-app-text">Something went wrong</h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-app-text-2">{message}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <button type="button" onClick={onRetry} className="btn-primary px-5 py-2.5 text-sm">
              Try again
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

ErrorState.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
  children: PropTypes.node,
};

export default ErrorState;
