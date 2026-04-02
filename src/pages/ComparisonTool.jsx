import { useState } from 'react';
import { compareTexts } from '../utils/compareTexts';
import { profiles, profileToSlug } from '../data/profiles';

export default function ComparisonTool() {
  const [csText, setCsText] = useState('');
  const [cmxText, setCmxText] = useState('');
  const [results, setResults] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState('en/us');
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCompare = () => {
    if (!csText.trim()) return;
    const result = compareTexts(csText, cmxText);
    setResults(result);
  };

  const handleClear = () => {
    setCsText('');
    setCmxText('');
    setResults(null);
  };

  const handleCopyScripts = async () => {
    if (!results || results.scripts.length === 0) return;
    const allScripts = results.scripts.join('\n\n');
    try {
      await navigator.clipboard.writeText(allScripts);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = allScripts;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  const slug = profileToSlug(selectedProfile);
  const canonicalUrl = `https://www.dell.com/${slug}/shop/deals/dc/`;

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Page header */}
      <div className="bg-base-200/50 border-b border-base-200">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-5">
          <h1 className="text-2xl font-bold mb-1">Comparison Tool</h1>
          <p className="text-sm opacity-60">
            Compare Content-Studio data with CMX fields and generate jQuery scripts
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Content-Studio textarea */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend font-semibold text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-info"></span>
                Content-Studio
              </span>
            </legend>
            <textarea
              id="cs-textarea"
              className="textarea textarea-bordered w-full h-72 text-sm leading-relaxed"
              placeholder="Paste Content-Studio data here...&#10;&#10;Tab Name&#10;Summer Sale Deals&#10;Hero Subtitle&#10;Save big on tech&#10;..."
              value={csText}
              onChange={(e) => setCsText(e.target.value)}
            />
          </fieldset>

          {/* CMX textarea */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend font-semibold text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                CMX
              </span>
            </legend>
            <textarea
              id="cmx-textarea"
              className="textarea textarea-bordered w-full h-72 text-sm leading-relaxed"
              placeholder="Paste CMX data here (leave empty to generate all scripts)...&#10;&#10;Display Name&#10;Summer Sale Deals&#10;Short Title&#10;Save big on tech&#10;..."
              value={cmxText}
              onChange={(e) => setCmxText(e.target.value)}
            />
          </fieldset>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            id="btn-compare"
            className="btn btn-primary"
            onClick={handleCompare}
            disabled={!csText.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Compare
          </button>
          <button
            id="btn-clear"
            className="btn btn-ghost"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>

        {/* Canonical URL section */}
        <div className="mt-6 p-4 bg-base-200/50 rounded-lg border border-base-200">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold" htmlFor="canonical-profile">
              Canonical URL Profile:
            </label>
            <select
              id="canonical-profile"
              className="select select-sm select-bordered w-36"
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id}
                </option>
              ))}
            </select>
            <div className="flex-1 min-w-0">
              <code className="text-sm bg-base-300/50 px-3 py-1.5 rounded-md inline-block break-all">
                Canonical Url: {canonicalUrl}
              </code>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="results-enter mt-6 space-y-4">
            <div className="divider text-sm font-semibold opacity-70">
              Comparison Results
            </div>

            {/* No differences */}
            {results.scripts.length === 0 && results.warnings.length === 0 && (
              <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>All fields match! No scripts needed.</span>
              </div>
            )}

            {/* Differences found */}
            {results.differences.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">
                    {results.scripts.length} field{results.scripts.length !== 1 ? 's' : ''} need updating:
                  </h3>
                  <button
                    id="btn-copy-scripts"
                    className={`btn btn-sm ${copyFeedback ? 'btn-success' : 'btn-primary'}`}
                    onClick={handleCopyScripts}
                  >
                    {copyFeedback ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy All Scripts
                      </>
                    )}
                  </button>
                </div>

                {/* Differences table */}
                <div className="overflow-x-auto mb-4">
                  <table className="table table-xs table-zebra">
                    <thead>
                      <tr>
                        <th className="text-xs">Content-Studio Field</th>
                        <th className="text-xs">CMX Field</th>
                        <th className="text-xs">CS Value</th>
                        <th className="text-xs">CMX Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.differences.map((diff, i) => (
                        <tr key={i}>
                          <td className="font-medium">{diff.csLabel}</td>
                          <td>{diff.cmxLabel}</td>
                          <td className="text-success max-w-40 truncate" title={diff.csValue}>
                            {diff.csValue}
                          </td>
                          <td className="text-error max-w-40 truncate" title={diff.cmxValue}>
                            {diff.cmxValue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* jQuery scripts */}
                <div className="script-block" id="scripts-output">
                  {results.scripts.map((script, i) => (
                    <div key={i}>
                      {i > 0 && <br />}
                      {script}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manual-copy warnings */}
            {results.warnings.length > 0 && (
              <div className="space-y-2 mt-4">
                {results.warnings.map((warning, i) => (
                  <div key={i} className="alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="font-medium">{warning}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
