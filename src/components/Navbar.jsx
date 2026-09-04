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
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-glow bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 sm:h-10 sm:w-10">
            <UsersIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="flex items-center truncate text-base font-extrabold leading-tight tracking-tight text-app-text">
              ProfileHub
              <span className="ml-2 hidden shrink-0 rounded-full bg-app-primary-soft px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-app-primary sm:inline-block">
                Profiles
              </span>
            </p>
            <p className="hidden truncate text-xs text-app-text-3 sm:block">Manage your profile directory</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <Tooltip label={refreshing ? 'Refreshing…' : 'Refresh data'}>
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              aria-label="Refresh data"
              className="icon-btn h-9 w-9 sm:h-10 sm:w-10"
            >
              <ArrowPathIcon className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </Tooltip>

          <div
            className="flex items-center gap-0.5 rounded-full border border-app-border bg-app-surface p-0.5 sm:gap-1 sm:p-1"
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
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 focus-ring sm:h-8 sm:w-8 ${
                      active ? 'text-white shadow-glow' : 'text-app-text-2 hover:bg-app-surface-3 hover:text-app-text'
                    }`}
                    style={
                      active
                        ? { backgroundImage: 'linear-gradient(135deg, var(--primary), var(--primary-2))' }
                        : undefined
                    }
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </Tooltip>
              );
            })}
          </div>

          <span className="hidden h-6 w-px bg-app-border sm:block" aria-hidden="true" />

          <div className="hidden items-center gap-2 md:flex" title="Signed in as Admin">
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
