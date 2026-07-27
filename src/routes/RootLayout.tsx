import { Dialog } from '@base-ui/react/dialog';
import { Toast } from '@base-ui/react/toast';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, Layers, Settings, X } from 'lucide-react';
import { NotificationsPopover } from '../components/NotificationsPopover';

export function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased">
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-300" aria-label="Primary Navigation">
        <div className="flex h-14 items-center px-6 border-b border-slate-800">
          <span className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-400" /> CoreSystem
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            type="button"
            disabled
            aria-label="Dashboard (coming soon)"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 disabled:cursor-not-allowed"
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </button>
          <Link
            to="/items"
            aria-current={pathname.startsWith('/items') ? 'page' : undefined}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white aria-[current=page]:bg-blue-600 aria-[current=page]:text-white"
          >
            <Layers className="h-4 w-4" /> Work Items
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-sm">
          <span className="text-xs text-slate-500 font-mono">v2.4.0 Engine</span>

          <Dialog.Root>
            <Dialog.Trigger render={
              <button type="button" aria-label="Open Settings" className="p-1.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
                <Settings className="h-4 w-4" />
              </button>
            } />
            <Dialog.Portal>
              <Dialog.Backdrop className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" />
              <Dialog.Popup
                className="fixed top-0 right-0 z-50 h-screen w-96 border-l border-slate-200 bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out data-[state=closed]:translate-x-full"
                render={<section aria-label="System Settings Configuration Sheet" />}
              >
                <header className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <Dialog.Title className="text-base font-bold text-slate-900">Workspace Settings</Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-500">Configure global dashboard engine states.</Dialog.Description>
                  </div>
                  <Dialog.Close render={<button aria-label="Close panel" className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>} />
                </header>

                <div className="space-y-4 text-sm text-slate-600">
                  <p>Slide-Over semantic sheet configuration operates seamlessly without unnecessary nested wrap nodes.</p>
                </div>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-end gap-3 border-b border-slate-200 bg-white px-4">
          <NotificationsPopover />
        </header>
        <main className="flex flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>

      <Toast.Portal>
        <Toast.Viewport className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </div>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="rounded-lg border border-slate-200 bg-slate-900 p-4 text-white shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out"
    >
      <Toast.Title className="text-sm font-semibold" />
      <Toast.Description className="text-xs text-slate-300" />
      <Toast.Close aria-label="Dismiss" className="absolute top-2 right-2 rounded p-1 text-slate-400 hover:text-white">
        <X className="h-3.5 w-3.5" />
      </Toast.Close>
    </Toast.Root>
  ));
}
