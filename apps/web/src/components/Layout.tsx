import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { userAuthStore } from "../store/authStore";

export const Layout = () => {
  const navigate = useNavigate();
  const { logout } = userAuthStore();

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium transition duration-[var(--transition-duration)] hover:bg-[var(--color-primary-light)]"
      : "flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-text)] dark:text-[var(--color-text-dark)] font-medium transition duration-[var(--transition-duration)] hover:bg-[var(--color-accent)] dark:hover:bg-[var(--color-border-dark)]";

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
      <aside className="w-72 flex-shrink-0 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border-r border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
        <div className="h-full flex flex-col p-6">
          <div className="mb-8">
            <h2 className="heading text-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent">
              n8n-v0
            </h2>
            <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60 mt-1">
              Automation Platform
            </p>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <NavLink to="/dashboard" className={getNavLinkClass}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                  </svg>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/credentials" className={getNavLinkClass}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Credentials
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="mt-auto pt-6 border-t border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] mb-3">
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">User</p>
                <p className="text-xs text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60">Active</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-text)] dark:text-[var(--color-text-dark)] font-medium transition duration-[var(--transition-duration)] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>
      
      <main className="flex-1 p-8 overflow-auto bg-[var(--color-accent)] dark:bg-[var(--color-bg-dark)]">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
