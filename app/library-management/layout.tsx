'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PortalLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/library-management/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/library-management/memberships', label: 'Memberships', icon: Users },
  { href: '/library-management/enquiries', label: 'Enquiries', icon: GraduationCap },
  { href: '/library-management/messages', label: 'Messages', icon: Mail },
  { href: '/library-management/settings', label: 'Settings', icon: Settings },
];

export default function PortalLayout({ children }: PortalLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const checkAuth = useCallback(async () => {
    // Skip auth check on login page
    if (pathname === '/library-management') {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/portal/auth', {
        cache: 'no-store',
        credentials: 'same-origin'
      });

      if (res.ok) {
        setAuthenticated(true);
        setLoading(false);
      } else {
        setAuthenticated(false);
        router.replace('/library-management');
      }
    } catch {
      setAuthenticated(false);
      router.replace('/library-management');
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    try {
      await fetch('/api/portal/auth', { method: 'DELETE' });
    } catch {
      // ignore
    }
    router.replace('/library-management');
    router.refresh();
  };

  // Login page - no layout wrapper
  if (pathname === '/library-management') {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Not authenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-50 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-2"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Library Portal</h1>
        <div className="ml-auto">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:top-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 lg:h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Library Portal
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-3 text-base text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
