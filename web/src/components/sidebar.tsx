import { Link, useLocation, useRouter } from '@tanstack/react-router';

import {
  BarChart3Icon,
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UsersIcon,
} from 'lucide-react';
import { useCallback } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

import { getContext as getAuthContext } from '@/auth';

interface SidebarProps {
  open?: boolean;
  close?: () => void;
}

const menuItems = [
  { icon: LayoutDashboardIcon, label: 'Dashboard', path: '/admin' },
  { icon: FileTextIcon, label: 'Denúncias', path: '/admin/reports' },
  { icon: UsersIcon, label: 'Usuários', path: '/admin/users' },
] as const;

function NavigationLink({
  icon: Icon,
  label,
  path,
  onClick,
}: {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  onClick?: () => void;
}) {
  const location = useLocation();


  return (
    <Link to={path}>
      <Button
        variant={location.pathname === path ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={onClick}
      >
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
}

export function Sidebar({ open, close }: SidebarProps) {
  const auth = getAuthContext();
  const router = useRouter();

  const logout = useCallback(async () => {
    await auth.logout();
    await router.invalidate();
    await router.navigate({ to: '/admin/sign-in' });
  }, [auth, router]);

  return (
    <>
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r h-screen',
          'transform transition-transform lg:transition-none duration-200 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b">
            <h3 className="text-xl font-bold">Painel Admin</h3>
          </div>

          <nav className="p-4 flex-1">
            {menuItems.map((item, index) => (
              <NavigationLink key={index} onClick={close} {...item} />
            ))}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={logout}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={close} />
      )}
    </>
  );
}
