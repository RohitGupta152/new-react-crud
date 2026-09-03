import PropTypes from 'prop-types';

function EmptyState({ icon: Icon, title, message, children }) {
  return (
    <div className="card animate-scale-in relative overflow-hidden rounded-2xl px-6 py-14 text-center sm:py-16">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, var(--primary-soft), transparent)' }}
        aria-hidden="true"
      />
      <div className="relative">
        <div className="mx-auto flex h-16 w-16 animate-float items-center justify-center rounded-2xl bg-app-primary-soft text-app-primary">
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-lg font-bold text-app-text">{title}</h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-app-text-2">{message}</p>
        {children && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{children}</div>
        )}
      </div>
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default EmptyState;
