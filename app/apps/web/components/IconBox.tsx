import type { Icon } from '@phosphor-icons/react';

export function IconBox({ icon: Icon, size = 22 }: { icon: Icon; size?: number }) {
  return (
    <div className="flex size-11 items-center justify-center rounded-control border border-accent/25 bg-accent-wash">
      <Icon size={size} weight="bold" className="text-accent" aria-hidden />
    </div>
  );
}
