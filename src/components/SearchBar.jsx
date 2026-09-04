import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

function SearchBar({ value, onChange, isSearching, placeholder = 'Search users…', className = '' }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      const tag = el && el.tagName ? el.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || (el && el.isContentEditable)) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-app-text-3">
        <MagnifyingGlassIcon className="h-5 w-5" />
      </span>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search users"
        className="input-field h-11 pl-11 pr-20 text-sm"
        autoComplete="off"
      />
      {isSearching ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Searching">
          <svg className="h-5 w-5 animate-spin text-app-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </span>
      ) : value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-app-text-3 transition-colors hover:bg-app-surface-3 hover:text-app-text"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      ) : (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden items-center gap-1 sm:flex">
          <kbd className="rounded-md border border-app-border bg-app-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-app-text-3">
            /
          </kbd>
        </span>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isSearching: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default SearchBar;
