import PropTypes from 'prop-types';
import {
  SunIcon,
  MoonIcon,
  SparklesIcon,
  ArrowPathIcon,
  UsersIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import Avatar from './Avatar';
import Tooltip from './Tooltip';

const THEMES = [
  { id: 'light', label: 'Light mode', icon: SunIcon },
  { id: 'dark', label: 'Dark mode', icon: MoonIcon },
  { id: 'aurora', label: 'Aurora mode', icon: SparklesIcon },
];

function Navbar({ onRefresh, refreshing }) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-app-border bg-app-raised backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-glow bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500">
            <UsersIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-extrabold leading-tight tracking-tight text-app-text">
              Nexus
              <span className="ml-2 hidden rounded-full bg-app-primary-soft px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-app-primary sm:inline-block">
                User Management
              </span>
            </p>
            <p className="hidden truncate text-xs text-app-text-3 sm:block">User directory dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Tooltip label={refreshing ? 'Refreshing…' : 'Refresh data'}>
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              aria-label="Refresh data"
              className="icon-btn"
            >
              <ArrowPathIcon className={`h-[18px] w-[18px] ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </Tooltip>

          <div
            className="flex items-center gap-0.5 rounded-full border border-app-border bg-app-surface p-1"
            role="radiogroup"
            aria-label="Theme"
          >
            {THEMES.map(({ id, label, icon: Icon }) => {
              const active = theme === id;
              return (
                <Tooltip key={id} label={label}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={label}
                    title={label}
                    onClick={() => setTheme(id)}
                    className={`flex h-8 items-center justify-center rounded-full transition-all duration-200 focus-ring ${
                      active ? 'text-white shadow-glow' : 'text-app-text-2 hover:text-app-text'
                    } ${active ? 'w-9' : 'w-8'}`}
                    style={
                      active
                        ? { backgroundImage: 'linear-gradient(135deg, var(--primary), var(--primary-2))' }
                        : undefined
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                </Tooltip>
              );
            })}
          </div>

          <span className="mx-0.5 hidden h-6 w-px bg-app-border sm:block" aria-hidden="true" />

          <div className="hidden items-center gap-2 sm:flex" title="Signed in as Admin">
            <Avatar name="Admin User" size="sm" />
            <div className="hidden lg:block">
              <p className="text-sm font-semibold leading-tight text-app-text">Admin</p>
              <p className="flex items-center gap-1 text-xs text-app-text-3">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-app-success" />
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  refreshing: PropTypes.bool,
};

export default Navbar;
