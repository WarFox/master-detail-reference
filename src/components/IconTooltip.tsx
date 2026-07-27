import type { ReactElement } from 'react';
import { Tooltip } from '@base-ui/react/tooltip';

export function IconTooltip({ label, children }: { label: string; children: ReactElement }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={children} />
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={6}>
          <Tooltip.Popup className="rounded-md bg-slate-900 px-2 py-1 text-xs text-white shadow-lg">
            {label}
            <Tooltip.Arrow className="fill-slate-900" />
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
