import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { MenuIcon, XIcon } from 'lucide-react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/sidebar';

export const Route = createFileRoute('/admin/_auth')({
  component: AuthenticatedLayout,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/admin/sign-in',
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function AuthenticatedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="lg:hidden flex items-center justify-between h-16 px-6 border-b bg-card">
        <h1 className="text-lg font-semibold">Admin</h1>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <XIcon /> : <MenuIcon />}
        </Button>
      </div>

      <div className="flex">
        <Sidebar open={sidebarOpen} close={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
