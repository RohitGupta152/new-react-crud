import PropTypes from 'prop-types';
import { useMemo } from 'react';
import {
  UsersIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { computeStats, useCountUp } from '../utils/helpers';

const GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
];

function StatCard({ label, value, sub, gradient, icon: Icon, delay }) {
  const counted = useCountUp(value);
  return (
    <article
      className="card group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-2xl"
        style={{ background: gradient }}
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-app-text-2">{label}</p>
          <p className="mt-1.5 text-3xl font-extrabold tabular-nums tracking-tight text-app-text">
            {counted.toLocaleString()}
          </p>
          <p className="mt-1 truncate text-xs text-app-text-3">{sub}</p>
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
          style={{ backgroundImage: gradient }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  sub: PropTypes.string.isRequired,
  gradient: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  delay: PropTypes.number,
};

function DashboardStats({ users }) {
  const stats = useMemo(() => computeStats(users), [users]);

  const cards = [
    {
      label: 'Total Users',
      value: stats.total,
      sub: 'In your directory',
      gradient: GRADIENTS[0],
      icon: UsersIcon,
    },
    {
      label: 'New This Week',
      value: stats.newThisWeek,
      sub: 'Registered in last 7 days',
      gradient: GRADIENTS[1],
      icon: BoltIcon,
    },
    {
      label: 'New Today',
      value: stats.newToday,
      sub: 'Registered today',
      gradient: GRADIENTS[2],
      icon: ArrowTrendingUpIcon,
    },
    {
      label: 'Email Domains',
      value: stats.domains,
      sub: 'Unique domains found',
      gradient: GRADIENTS[3],
      icon: GlobeAltIcon,
    },
  ];

  return (
    <section aria-label="User statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, i) => (
        <StatCard key={card.label} {...card} delay={i * 70} />
      ))}
    </section>
  );
}

DashboardStats.propTypes = {
  users: PropTypes.array,
};

export default DashboardStats;
