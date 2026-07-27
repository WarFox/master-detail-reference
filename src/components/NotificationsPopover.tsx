import { useState } from 'react';
import { Popover } from '@base-ui/react/popover';
import { Bell } from 'lucide-react';
import { IconTooltip } from './IconTooltip';

const initialNotifications = [
  { id: 1, text: 'Alex assigned you to Cluster Migration' },
  { id: 2, text: 'Database downtime scheduled at 02:00 AM' },
];

export function NotificationsPopover() {
  const [notifications] = useState(initialNotifications);

  return (
    <Popover.Root>
      <IconTooltip label="Notifications">
        <Popover.Trigger
          render={
            <button
              type="button"
              aria-label={notifications.length > 0 ? `View notifications (${notifications.length} unread)` : 'View notifications'}
              className="relative rounded-md border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span aria-hidden="true" className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {notifications.length}
                </span>
              )}
            </button>
          }
        />
      </IconTooltip>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="end">
          <Popover.Popup className="w-72 rounded-lg border border-slate-200 bg-white p-2 shadow-xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-1 data-[state=open]:duration-150">
            <Popover.Title className="px-3 py-1.5 text-xs font-semibold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
              Notifications
            </Popover.Title>
            <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {notifications.map((n) => (
                <li key={n.id} className="p-3 text-xs text-slate-700 hover:bg-slate-50 transition-colors rounded-md mt-1">
                  {n.text}
                </li>
              ))}
            </ul>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
