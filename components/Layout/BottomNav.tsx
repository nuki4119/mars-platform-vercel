'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart3,
  Layers,
  Rocket,
  Wallet2,
} from 'lucide-react';

const navItems = [
  { href: '/feed', icon: <Home size={20} />, label: 'Home' },
  { href: '/dashboard', icon: <BarChart3 size={20} />, label: 'Insights' },
  { href: '/categories', icon: <Layers size={20} />, label: 'Categories' },
  { href: '/boost-center', icon: <Rocket size={20} />, label: 'Boost' },
  { href: '/wallet', icon: <Wallet2 size={20} />, label: 'Wallet' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 z-50 w-full border-t border-slate-700 bg-slate-900 text-white">
      <div className="flex justify-between items-center px-4 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center text-xs ${
                isActive ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
