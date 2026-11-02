import type { Metadata, Viewport } from 'next';
import './globals.css';
import Nav from '@/components/ui/Nav';
import AudioController from '@/components/ui/AudioController';
import TransitionOverlay from '@/components/ui/TransitionOverlay';

export const metadata: Metadata = {
  title: 'TIMEVERSE — A Journey Through Time',
  description: 'One Portal. Infinite Eras. Endless Possibilities. An interactive 3D journey through history.',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#06070b' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">
        <Nav />
        {children}
        <AudioController />
        <TransitionOverlay />
      </body>
    </html>
  );
}
