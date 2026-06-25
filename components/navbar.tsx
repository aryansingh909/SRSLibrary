'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, BookOpen, Moon, Sun, GraduationCap, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePrograms, useSettings } from '@/hooks/use-settings';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Library', href: '/library' },
  { label: 'Degrees', href: '/degrees', hasDropdown: true },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { programs } = usePrograms();
  const { settings } = useSettings();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileOpen
          ? 'glass-strong shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              {settings.business_name?.split(' ').map((word, i) =>
                i === 0 ? <span key={i}>{word} </span> : <span key={i} className="text-blue-600">{word}</span>
              ) || <>SRS <span className="text-blue-600">Library</span></>}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                <DropdownMenu key={link.href}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pathname.startsWith('/degrees') || pathname.startsWith('/courses')
                          ? 'text-blue-600 bg-blue-50 dark:bg-blue-950'
                          : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40">
                    <DropdownMenuItem asChild>
                      <Link href="/degrees" className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        All Programs
                      </Link>
                    </DropdownMenuItem>
                    {programs.map((prog) => (
                      <DropdownMenuItem key={prog.code} asChild>
                        <Link href={`/courses/${prog.code.toLowerCase()}`}>{prog.code}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-950'
                      : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-lg"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            )}
            <Link href="/library">
              <Button variant="outline" size="sm" className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400">
                Join Library
              </Button>
            </Link>
            <Link href="/degrees">
              <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25">
                Apply for Course
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-lg"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
              className="rounded-lg"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t border-border/50 mt-1">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href || (link.hasDropdown && (pathname.startsWith('/degrees') || pathname.startsWith('/courses')))
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-950'
                        : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {link.label}
                  </Link>
                  {link.hasDropdown && (
                    <div className="ml-4 mt-1 flex flex-col gap-0.5">
                      {programs.map((prog) => (
                        <Link
                          key={prog.code}
                          href={`/courses/${prog.code.toLowerCase()}`}
                          onClick={() => setIsMobileOpen(false)}
                          className="block px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          {prog.code}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-3 border-t border-border/50 mt-1">
                <Link href="/library" className="flex-1" onClick={() => setIsMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full rounded-xl border-blue-200 text-blue-700">
                    Join Library
                  </Button>
                </Link>
                <Link href="/degrees" className="flex-1" onClick={() => setIsMobileOpen(false)}>
                  <Button size="sm" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                    Apply for Course
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
