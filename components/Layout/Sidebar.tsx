// Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart3,
  LayoutDashboard,
  Wallet2,
  Users,
  Settings,
  LifeBuoy,
  FilePlus,
  Brain,
} from 'lucide-react';

const links = [
  {
    title: 'Create & Explore',
    items: [
      { href: '/create/post', label: 'Create Post', icon: <FilePlus size={18} /> },
      { href: '/assistant', label: 'AI Assistant', icon: <Brain size={18} /> },
      { href: '/feed', label: 'Home', icon: <Home size={18} /> },
      { href: '/category/id', label: 'Categories', icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    title: 'Performance',
    items: [
      { href: '/dashboard', label: 'Insights', icon: <BarChart3 size={18} /> },
      { href: '/wallet', label: 'Wallet', icon: <Wallet2 size={18} /> },
    ],
  },
  {
    title: 'Account',
    items: [
      { href: '/referrals', label: 'Referrals', icon: <Users size={18} /> },
      { href: '/settings', label: 'Settings', icon: <Settings size={18} /> },
      { href: '/support', label: 'Support', icon: <LifeBuoy size={18} /> },
    ],
  },
];

export default function Sidebar({ className = '' }) {
  const pathname = usePathname();

  return (
    <nav className={`w-64 shrink-0 border-r border-slate-700 bg-[#0b1220] py-6 px-4 space-y-6 ${className}`}>
      <div className="text-xl font-bold text-white mb-2">🚀 Mars AI</div>

      {links.map(({ title, items }) => (
        <div key={title}>
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">{title}</div>
          <ul className="space-y-2">
            {items.map(({ href, label, icon }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-2 py-1 rounded-md text-sm transition
                      ${isActive ? 'bg-blue-600 text-white font-semibold' : 'text-gray-300 hover:text-white hover:bg-[#1a2131]'}`}
                  >
                    {icon}
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
