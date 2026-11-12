import { Outlet } from '@tanstack/react-router';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { Menu } from 'lucide-react';

const FacultyLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-bg-light-mint min-h-screen font-sans">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Mobile sidebar overlay backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-[9998] bg-primary-navy/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">

          {/* Mobile top bar with hamburger */}
          <header className="flex items-center gap-3 bg-primary-navy px-4 py-3 lg:hidden sticky top-0 z-50 shadow-md">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-pure-white/10 text-pure-white hover:bg-accent-teal transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-pure-white tracking-wide">
              MedCode Ninja
            </span>
          </header>

          <main>
            <div className="mx-auto p-1 md:p-2 2xl:p-1">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FacultyLayout;
