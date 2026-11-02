import type { Era } from '@/lib/eras';

/** Stylised silhouette for each era (used when no preview image is provided). */
export default function EraArt({ era, className = '' }: { era: Era; className?: string }) {
  const fill = 'rgba(0,0,0,0.55)';
  return (
    <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      {era.id === 'egypt' && (
        <g fill={fill}>
          <circle cx="310" cy="50" r="22" fill="rgba(255,236,190,0.55)" />
          <path d="M40 160 L130 55 L220 160Z" />
          <path d="M170 160 L240 80 L310 160Z" opacity=".8" />
          <path d="M290 160 L330 115 L370 160Z" opacity=".65" />
          <rect x="80" y="70" width="6" height="90" />
          <path d="M0 150 Q100 135 200 150 T400 148 V160 H0Z" />
        </g>
      )}
      {era.id === 'medieval' && (
        <g fill={fill}>
          <circle cx="80" cy="45" r="16" fill="rgba(255,220,170,0.5)" />
          <path d="M120 160 V90 H135 V80 H145 V90 H160 V60 L175 40 L190 60 V90 H210 V70 L225 50 L240 70 V90 H255 V80 H265 V90 H280 V160Z" />
          <path d="M0 160 Q60 120 120 150 L280 150 Q340 125 400 145 V160Z" />
          <path d="M20 160 L35 125 L50 160Z M330 160 L345 120 L360 160Z" />
        </g>
      )}
      {era.id === 'industrial' && (
        <g fill={fill}>
          <rect x="60" y="30" width="12" height="130" /><rect x="95" y="50" width="10" height="110" />
          <path d="M40 160 V100 L80 80 V100 L120 80 V100 L160 80 V100 L200 80 V160Z" />
          <rect x="250" y="40" width="10" height="120" />
          <path d="M220 160 V110 H340 V160Z" />
          <circle cx="66" cy="22" r="10" fill="rgba(200,190,180,0.35)" /><circle cx="76" cy="10" r="14" fill="rgba(200,190,180,0.25)" />
          <path d="M240 150 H400 V160 H240Z" />
        </g>
      )}
      {era.id === 'future' && (
        <g fill={fill}>
          <rect x="40" y="60" width="26" height="100" /><rect x="75" y="30" width="20" height="130" />
          <path d="M190 160 L198 20 L206 160Z" />
          <rect x="230" y="70" width="30" height="90" /><rect x="270" y="45" width="18" height="115" /><rect x="300" y="85" width="40" height="75" />
          <ellipse cx="150" cy="60" rx="14" ry="4" fill="rgba(94,231,255,0.7)" />
          <ellipse cx="320" cy="35" rx="10" ry="3" fill="rgba(255,79,216,0.7)" />
          <rect x="0" y="150" width="400" height="10" />
        </g>
      )}
    </svg>
  );
}
