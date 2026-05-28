'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  ListChecks,
  Settings,
  LogOut,
  Wallet,
  Activity,
  Target,
  BarChart2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { AuthService } from '@/modules/auth';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Calendar', icon: Calendar, href: '/calendar' },
  { label: 'Tasks', icon: ListChecks, href: '/tasks' },
  { label: 'Finance', icon: Wallet, href: '/finance' },
  { label: 'Habits', icon: Activity, href: '/habits' },
  { label: 'Goals', icon: Target, href: '/goals' },
  { label: 'Reports', icon: BarChart2, href: '/reports' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await AuthService.signOut();
    router.push('/login');
  };

  return (
    <aside className="w-[280px] min-h-screen bg-primary flex flex-col shrink-0">
      {/* Logo / Brand */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-secondary rounded-lg shrink-0" />
        <div>
          <span className="font-heading font-bold text-lg text-primary-foreground tracking-tight leading-none block">
            Vexaro
          </span>
          <span className="text-xs text-[#accfb3] font-mono mt-0.5 block">High Performance</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group',
                isActive
                  ? 'text-primary-foreground bg-white/10'
                  : 'text-[#accfb3] hover:text-primary-foreground hover:bg-white/5'
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary rounded-r-full" />
              )}
              <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings + Sign Out */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
            pathname === '/settings'
              ? 'text-primary-foreground bg-white/10'
              : 'text-[#accfb3] hover:text-primary-foreground hover:bg-white/5'
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#accfb3] hover:text-primary-foreground hover:bg-white/5 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
