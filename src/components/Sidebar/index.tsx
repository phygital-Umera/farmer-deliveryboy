import { useAuthContext } from '@/context/AuthContext';
import { SidebarProps } from '@/types';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { PiBankLight,  PiNotePencilLight, PiPackageLight, PiShoppingCartLight, PiSquaresFourLight, PiStudent, PiTagLight, PiTruckLight, PiUserLight, PiUsersLight } from 'react-icons/pi';

import { IoIosArrowDown } from 'react-icons/io';

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const role = user?.role;

  const sidebarRoutes = [
    {
      label: 'Dashboard',
      icon: <PiSquaresFourLight size={20} />,
      path: '/dashboard',
    },
    {
      label: 'Supplier',
      icon: <PiUsersLight size={20} />,
      path: '/Supplier/supplier',
      children: [
      {
          label: 'Supplier',
          path: '/Supplier/supplier',
        },
        {
          label: 'Category',
          path: '/category',
        },
        {
          label: 'Sub Category',
          path: '/subcategory',
        },
      ],
    },
    {
      label: 'Customer',
      icon: <PiUserLight size={20} />,
      path: '/customer',
    },
    {
      label: 'Product',
      icon: <PiPackageLight size={20} />,
      path: '/product',
    },
    {
      label: 'Product Detail',
      icon: <PiPackageLight size={20} />,
      path: '/productdetail',
    },
    {
      label: 'Account',
      icon: <PiBankLight size={20} />,
      path: '/account',
    },
    {
      label: 'Debit Note',
      icon: <PiNotePencilLight size={20} />,
      path: '/debitnote',
    },
    {
      label: 'Purchase',
      icon: <PiShoppingCartLight size={20} />,
      path: '/purchase',
    },
    {
      label: 'Packaging',
      icon: <PiPackageLight size={20} />,
      path: '/packaging',
    },
    {
      label: 'Delivery Boy',
      icon: <PiTruckLight size={20} />,
      path: '/delevery',
    },
      {
      label: 'Wallet Balance',
      icon: <PiPackageLight size={20} />,
      path: '/Wallet',
    },
  ];

  const location = useLocation();
  const { pathname } = location;
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);
  
  const [sidebarExpanded, setSidebarExpanded] = useState(
    localStorage.getItem('sidebar-expanded') === 'true'
  );
  
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const handleLinkClick = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate({ to: '/signin' });
  };

  const toggleDropdown = (path: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Check if a route or its child route is active
  const isRouteActive = (route: any) => {
    if (pathname === route.path) return true;
    if (route.children) {
      return route.children.some((child: any) => pathname === child.path);
    }
    return false;
  };

  // Close sidebar on outside click
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !sidebar.current ||
        !trigger.current ||
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      ) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen]);

  // Close sidebar on Escape key
  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (!sidebarOpen || event.key !== 'Escape') return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen]);

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem('sidebar-expanded', String(sidebarExpanded));
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`fixed inset-y-0 left-0 z-[9999] flex h-screen flex-col bg-primary-navy shadow-2xl duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        sidebarExpanded ? 'w-64' : 'w-64 lg:w-20'
      } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Header */}
      <div
        className={`border-pure-white/10 flex items-center justify-between border-b px-4 py-4 sm:px-5 ${
          sidebarExpanded ? '' : 'lg:justify-center lg:px-2'
        }`}
      >
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-teal shadow-md transition-transform group-hover:scale-105">
            <span className="text-base font-bold leading-none text-pure-white">F</span>
          </div>
          {sidebarExpanded && (
            <div>
              <p className="text-sm font-bold leading-tight text-white">Farmer Vegetables</p>
            </div>
          )}
        </Link>

        {/* Close button - mobile only */}
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-pure-white/10 flex h-8 w-8 items-center justify-center rounded-lg text-pure-white transition-colors hover:bg-accent-teal lg:hidden"
          aria-label="Close Sidebar"
        >
          ✕
        </button>

        {/* Collapse/Expand button - desktop only */}
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="bg-pure-white/10 hidden h-7 w-7 items-center justify-center rounded-lg text-pure-white transition-colors hover:bg-accent-teal lg:flex"
          title={sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {sidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 overflow-y-auto px-3 py-2">
        {sidebarExpanded && (
          <p className="mb-3 px-2 text-[12px] font-bold uppercase tracking-widest text-accent-teal">
            Main Menu
          </p>
        )}
        <ul className="flex flex-col text-color-white gap-0.5">
          {sidebarRoutes.map((route, index) => (
            <li key={index}>
              {route.children ? (
                // Parent with children routes
                <>
                  <button
                    onClick={() => toggleDropdown(route.path)}
                    className={`group relative flex w-full text-pure-white items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isRouteActive(route)
                        ? 'text-color-white border-l-2 border-accent-teal pl-2.5 text-pure-white'
                        : ' text-color-white hover:pl-3.5 text-pure-white'
                    } ${sidebarExpanded ? '' : 'lg:justify-center'}`}
                    title={!sidebarExpanded ? route.label : undefined}
                  >
                    <span className="shrink-0">{route.icon}</span>
                    <span className={sidebarExpanded ? 'block' : 'hidden lg:hidden'}>
                      {route.label}
                    </span>
                    {sidebarExpanded && (
                      <IoIosArrowDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 ${
                          openDropdowns[route.path] ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                  
                  {/* Child routes with white text */}
                  {sidebarExpanded && openDropdowns[route.path] && (
                    <ul className="border-pure-white/15 ml-4 mt-1 flex flex-col gap-0.5 border-l pl-4">
                      {route.children.map((child, i) => (
                        <li key={i}>
                          <Link
                            to={child.path}
                            onClick={handleLinkClick}
                            className={`flex items-center gap-2  text-white rounded-md px-3 py-2 text-sm transition-all duration-200 ${
                              pathname === child.path
                                ? 'font-semibold text-white'
                                : 'text-white hover:text-accent-teal'
                            }`}
                          >
                            {child.icon && (
                              <span className="shrink-0 text-accent-teal">{child.icon}</span>
                            )}
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                pathname === child.path
                                  ? 'bg-accent-teal'
                                  : ''
                              } transition-colors`}
                            />
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                // Simple link without children
                <Link
                  to={route.path}
                  onClick={handleLinkClick}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    pathname === route.path
                      ? 'border-l-2 border-accent-teal pl-2.5 text-pure-white'
                      : 'text-white hover:text-accent-teal'
                  } ${sidebarExpanded ? '' : 'lg:justify-center'}`}
                  title={!sidebarExpanded ? route.label : undefined}
                >
                  <span className="shrink-0">{route.icon}</span>
                  <span className={sidebarExpanded ? 'block' : 'hidden lg:hidden'}>
                    {route.label}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-pure-white/10 border-t px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* User Info */}
          <div
            className={`flex items-center gap-3 rounded-lg px-2 py-2 ${
              sidebarExpanded ? '' : 'lg:justify-center'
            }`}
          >
            {/* You can add user info here */}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`hover:bg-pure-white/10 flex items-center gap-2 rounded-lg px-2 py-2 text-pure-white transition-colors ${
              sidebarExpanded ? '' : 'lg:justify-center'
            }`}
            title="Logout"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">
              <LogOut size={16} />
            </div>
            {sidebarExpanded && <span className="text-sm font-medium text-red-400">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;