import PropTypes from 'prop-types';

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="card rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-3">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-9 w-16" />
              <div className="skeleton h-3 w-32" />
            </div>
            <div className="skeleton h-11 w-11 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6 }) {
  return (
    <div className="card overflow-hidden rounded-2xl" aria-hidden="true">
      <div className="hidden lg:block">
        <div className="flex items-center gap-6 border-b border-app-border bg-app-surface-2 px-6 py-4">
          <div className="skeleton h-3 w-28" />
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-3 w-20" />
          <div className="skeleton ml-auto h-3 w-16" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-6 border-b border-app-border-2 px-6 py-5 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="skeleton h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <div className="skeleton h-4 w-36" />
                <div className="skeleton h-3 w-24" />
              </div>
            </div>
            <div className="skeleton hidden h-3.5 w-52 md:block" />
            <div className="skeleton hidden h-3.5 w-28 lg:block" />
            <div className="skeleton hidden h-3.5 w-24 lg:block" />
            <div className="ml-auto flex gap-2">
              <div className="skeleton h-9 w-9 rounded-lg" />
              <div className="skeleton h-9 w-9 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-app-border-2 p-4">
            <div className="flex items-center gap-3">
              <div className="skeleton h-11 w-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-3 w-44" />
              </div>
              <div className="skeleton h-8 w-8 rounded-lg" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="skeleton h-9 rounded-lg" />
              <div className="skeleton h-9 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

TableSkeleton.propTypes = {
  rows: PropTypes.number,
};
