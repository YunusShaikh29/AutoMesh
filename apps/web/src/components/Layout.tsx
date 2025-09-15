import { NavLink, Outlet } from "react-router-dom";

export const Layout = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "block p-2 rounded bg-blue-500 text-white"
      : "block p-2 rounded hover:bg-gray-200";

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200">
        <div className="h-full flex flex-col p-4">
          <h2 className="text-2xl font-bold mb-6">n8n-v0</h2>
          <nav>
            <ul>
              <li className="mb-2">
                <NavLink to="/dashboard" className={getNavLinkClass}>
                  Dashboard
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink to="/credentials" className={getNavLinkClass}>
                  Credentials
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
