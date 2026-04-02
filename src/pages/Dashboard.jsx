import { useState, useMemo } from 'react';
import { profiles, ALL_CATEGORIES, CATEGORY_LABELS } from '../data/profiles';
import ProfileCard from '../components/ProfileCard';

export default function Dashboard() {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [profileFilter, setProfileFilter] = useState('');

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // Filter by profile
      if (profileFilter && p.id !== profileFilter) return false;

      // Filter by category — only show profiles that have this category
      if (categoryFilter && !p.categories[categoryFilter]) return false;

      return true;
    });
  }, [categoryFilter, profileFilter]);

  const profileCount = filteredProfiles.length;
  const totalProfiles = profiles.length;

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Page header */}
      <div className="bg-base-200/50 border-b border-base-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5">
          <h1 className="text-2xl font-bold mb-1">Deals Dashboard</h1>
          <p className="text-sm opacity-60">
            Browse and access CMX category pages across {totalProfiles} profiles
          </p>

          {/* Filter bar */}
          <div className="flex flex-wrap items-end gap-3 mt-4">
            {/* Category filter */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xs">Filter by Category</legend>
              <select
                id="filter-category"
                className="select select-sm select-bordered w-52"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* Profile filter */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xs">Filter by Profile</legend>
              <select
                id="filter-profile"
                className="select select-sm select-bordered w-40"
                value={profileFilter}
                onChange={(e) => setProfileFilter(e.target.value)}
              >
                <option value="">All Profiles</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} {p.isAdmin ? '★' : ''}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* Clear filters */}
            {(categoryFilter || profileFilter) && (
              <button
                className="btn btn-sm btn-ghost text-error"
                onClick={() => {
                  setCategoryFilter('');
                  setProfileFilter('');
                }}
              >
                ✕ Clear Filters
              </button>
            )}

            {/* Results count */}
            <div className="ml-auto text-sm opacity-60">
              Showing {profileCount} of {totalProfiles} profiles
            </div>
          </div>
        </div>
      </div>

      {/* Profile grid */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {profileCount === 0 ? (
          <div className="text-center py-16 opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg font-medium">No profiles match your filters</p>
            <p className="text-sm mt-1">Try adjusting or clearing your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
