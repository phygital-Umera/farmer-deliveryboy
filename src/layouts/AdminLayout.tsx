import {Outlet} from '@tanstack/react-router';
import Sidebar from '@/components/Sidebar';
import {useState} from 'react';
import {Menu} from 'lucide-react';

const FacultyLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-light-mint font-sans">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Mobile sidebar overlay backdrop */}
        {sidebarOpen && (
          <div
            className="bg-primary-navy/50 fixed inset-0 z-[9998] backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Mobile top bar with hamburger */}
          <header className="sticky top-0 z-50 flex items-center gap-3 bg-primary-navy px-4 py-3 shadow-md lg:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-pure-white/10 flex h-9 w-9 items-center justify-center rounded-lg text-pure-white transition-colors hover:bg-accent-teal"
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold tracking-wide text-pure-white">
              MedCode Ninja
            </span>
          </header>

          {/* <main>
            <div className="mx-auto p-2 md:p-6 2xl:p-8"> */}
          <main className="w-full">
            <div className="w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FacultyLayout;
