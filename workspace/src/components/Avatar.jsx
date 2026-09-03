import PropTypes from 'prop-types';
import { avatarGradient, getInitials } from '../utils/helpers';

const SIZES = {
  xs: 'h-7 w-7 text-[11px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

function Avatar({ name, size = 'md', className = '' }) {
  const [c1, c2] = avatarGradient(name);
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm ${SIZES[size]} ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${c1}, ${c2})` }}
    >
      {getInitials(name)}
    </span>
  );
}

Avatar.propTypes = {
  name: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Avatar;
