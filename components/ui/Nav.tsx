'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SoundToggle from './SoundToggle';
import { useStore } from '@/lib/store';

export default function Nav() {
  const path = usePathname();
  const travel = useStore((s) => s.travel);
  const go = (href: string, label: string) => (e: React.MouseEvent) => {
    if (href === path) return;
    e.preventDefault();
    travel(href, label);
  };
  const link = (href: string, label: string) => (
    <Link
      href={href}
      onClick={go(href, label)}
      className={`font-mono text-[11px] uppercase tracking-[0.22em] transition hover:text-white ${path.startsWith(href) && href !== '/' ? 'text-white' : 'text-white/55'}`}
    >
      {label}
    </Link>
  );
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
      <Link href="/" onClick={go('/', 'Returning to the Portal')} className="pointer-events-auto flex items-center gap-2.5">
        <span className="relative grid h-7 w-7 place-items-center rounded-full border border-[var(--accent)]">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
        </span>
        <span className="font-display text-sm font-bold tracking-[0.35em] sm:text-base">TIMEVERSE</span>
      </Link>
      <nav className="pointer-events-auto flex items-center gap-4 sm:gap-7">
        <span className="hidden sm:inline">{link('/timeline', 'Timeline')}</span>
        {link('/about', 'About')}
        <SoundToggle />
      </nav>
    </header>
  );
}
