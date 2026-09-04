import PropTypes from 'prop-types';
import Tooltip from './Tooltip';

function IconButton({
  label,
  icon: Icon,
  onClick,
  disabled,
  tone,
  size = 'md',
  className = '',
  type = 'button',
}) {
  const toneClass =
    tone === 'danger'
      ? 'icon-btn-danger'
      : tone === 'success'
        ? 'icon-btn-success'
        : '';
  const sizeClass = size === 'sm' ? 'h-8 w-8 rounded-lg' : 'h-9 w-9';
  return (
    <Tooltip label={label}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={`icon-btn ${sizeClass} ${toneClass} ${className}`}
      >
        <Icon className={size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]'} />
      </button>
    </Tooltip>
  );
}

IconButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  tone: PropTypes.oneOf(['default', 'danger', 'success']),
  size: PropTypes.oneOf(['sm', 'md']),
  className: PropTypes.string,
  type: PropTypes.string,
};

export default IconButton;
