import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `tab ${isActive ? 'tab-active' : ''}`;

  return (
    <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4 lg:px-8">
      {/* Logo + Brand */}
      <div className="navbar-start">
        <a href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.svg"
            alt="DMC Manager Logo"
            className="w-9 h-9 group-hover:scale-110 transition-transform"
          />
          <span className="font-logo text-xl tracking-wide hidden sm:inline select-none">
            DMC Manager
          </span>
        </a>
      </div>

      {/* Navigation Links */}
      <div className="navbar-end">
        <div role="tablist" className="tabs tabs-box">
          <NavLink to="/" className={linkClass} end>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </NavLink>
          <NavLink to="/compare" className={linkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Comparison Tool
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
