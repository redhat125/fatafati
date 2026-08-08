import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'magenta' | 'amber' | 'emerald' | 'default';
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({ children, variant = 'default', icon, className = '' }: BadgeProps) {
  const getColors = () => {
    switch (variant) {
      case 'cyan':
        return 'border-cyan text-cyan bg-cyan-dim';
      case 'purple':
        return 'border-purple text-purple bg-purple-dim';
      case 'magenta':
        return 'border-magenta text-magenta bg-magenta-dim';
      case 'amber':
        return 'border-amber text-amber bg-amber-dim';
      case 'emerald':
        return 'border-emerald text-emerald bg-emerald-dim';
      default:
        return 'border-glass text-secondary bg-surface';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${getColors()} ${className}`}
      style={{
        border: '1px solid currentColor',
        borderRadius: '9999px',
        padding: '3px 10px',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        background: variant === 'cyan' ? 'rgba(0, 240, 255, 0.12)' :
                    variant === 'purple' ? 'rgba(168, 85, 247, 0.12)' :
                    variant === 'magenta' ? 'rgba(236, 72, 153, 0.12)' :
                    variant === 'amber' ? 'rgba(245, 158, 11, 0.12)' :
                    variant === 'emerald' ? 'rgba(16, 185, 129, 0.12)' :
                    'rgba(255, 255, 255, 0.06)',
        color: variant === 'cyan' ? '#00f0ff' :
               variant === 'purple' ? '#a855f7' :
               variant === 'magenta' ? '#ec4899' :
               variant === 'amber' ? '#f59e0b' :
               variant === 'emerald' ? '#10b981' :
               '#cbd5e1',
        borderColor: variant === 'cyan' ? 'rgba(0, 240, 255, 0.3)' :
                     variant === 'purple' ? 'rgba(168, 85, 247, 0.3)' :
                     variant === 'magenta' ? 'rgba(236, 72, 153, 0.3)' :
                     variant === 'amber' ? 'rgba(245, 158, 11, 0.3)' :
                     variant === 'emerald' ? 'rgba(16, 185, 129, 0.3)' :
                     'rgba(255, 255, 255, 0.15)',
      }}
    >
      {icon}
      {children}
    </span>
  );
}
