import { ALL_CATEGORIES, CATEGORY_LABELS, getFutureStateUrl, getCurrentStateUrl } from '../data/profiles';

export default function ProfileCard({ profile }) {
  const { id, isAdmin, hasIMM, hasFAQ, categories } = profile;

  return (
    <div className="profile-card card bg-base-100 shadow-md border border-base-200 overflow-hidden">
      {/* Header */}
      <div className="card-body p-4 pb-3">
        {/* Profile name + badges row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h2 className="card-title text-lg font-bold uppercase tracking-wider">
              {id}
            </h2>
            {isAdmin && (
              <span className="admin-badge badge badge-info badge-sm font-semibold tracking-wide">
                ADMIN
              </span>
            )}
          </div>

          {/* IMM & FAQ indicators */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1" title="IMM Banner">
              {hasIMM ? (
                <span className="text-success text-base">✓</span>
              ) : (
                <span className="text-error text-base">✗</span>
              )}
              <span className="opacity-70">IMM</span>
            </span>
            <span className="flex items-center gap-1" title="FAQ">
              {hasFAQ ? (
                <span className="text-success text-base">✓</span>
              ) : (
                <span className="text-error text-base">✗</span>
              )}
              <span className="opacity-70">FAQ</span>
            </span>
          </div>
        </div>

        {/* Future / Current State links */}
        <div className="flex gap-2 mt-2">
          <a
            href={getFutureStateUrl(id)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-xs btn-primary flex-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Future State
          </a>
          <a
            href={getCurrentStateUrl(id)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-xs btn-secondary flex-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
            </svg>
            Current State
          </a>
        </div>

        {/* Divider */}
        <div className="divider my-1 text-xs opacity-50">Categories</div>

        {/* Category buttons grid */}
        <div className="grid grid-cols-1 gap-1.5">
          {ALL_CATEGORIES.map((cat) => {
            const url = categories[cat];
            const isActive = !!url;

            return isActive ? (
              <a
                key={cat}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="category-btn active-category btn btn-sm btn-ghost border border-base-300 justify-start text-left"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5 shrink-0"></span>
                {CATEGORY_LABELS[cat]}
              </a>
            ) : (
              <button
                key={cat}
                disabled
                className="category-btn dimmed-category btn btn-sm btn-ghost border border-base-300 justify-start text-left"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-base-300 mr-1.5 shrink-0"></span>
                {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
