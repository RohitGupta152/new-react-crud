import PropTypes from 'prop-types';

function Tooltip({ label, side = 'top', children }) {
  const placement = side === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2';
  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 ${placement}`}
      >
        {label}
      </span>
    </span>
  );
}

Tooltip.propTypes = {
  label: PropTypes.string.isRequired,
  side: PropTypes.oneOf(['top', 'bottom']),
  children: PropTypes.node.isRequired,
};

export default Tooltip;
