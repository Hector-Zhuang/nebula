import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import {
  BoxesIcon,
  ShieldCheckIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
} from 'lucide-react';
import type { MiniApp, User } from '@/types';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NebulaLogo } from '@/components/nebula-logo';
import { CreateMiniAppDialog } from '@/components/create-miniapp-dialog';

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  activePath: string;
  miniApps: MiniApp[];
  onLogout: () => void;
  user: User | null;
  onMiniAppCreated?: () => Promise<void> | void;
};

function getUserInitials(user: User | null): string {
  const source = user?.displayName || user?.email || 'NB';
  return source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('');
}

export function AppSidebar({
  activePath,
  miniApps,
  onLogout,
  user,
  onMiniAppCreated,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex items-center gap-1">
            <SidebarMenuButton
              size="lg"
              render={<Link to="/" />}
              isActive={activePath === '/'}
              className="flex-1"
            >
              <NebulaLogo withWordmark={false} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Nebula Console</span>
                <span className="truncate text-xs text-muted-foreground">
                  Mini app operations
                </span>
              </div>
            </SidebarMenuButton>
            <SidebarTrigger className="shrink-0" />
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Overview"
                render={<Link to="/" />}
                isActive={activePath === '/'}
              >
                <LayoutDashboardIcon className="size-4" />
                <span>Overview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Members"
                render={<Link to="/users" />}
                isActive={activePath === '/users'}
              >
                <ShieldCheckIcon className="size-4" />
                <span>Members</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Mini Apps</SidebarGroupLabel>
          <SidebarMenu>
            {miniApps.map(miniApp => {
              const href = `/mini-apps/${miniApp.id}`;
              const logoUrl = miniApp.thumbnailUrl || miniApp.iconUrl;
              return (
                <SidebarMenuItem key={miniApp.id}>
                  <SidebarMenuButton
                    tooltip={miniApp.name}
                    render={<Link to={href} />}
                    isActive={activePath === href}
                  >
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={`${miniApp.name} logo`}
                        className="size-4 rounded object-cover"
                      />
                    ) : (
                      <BoxesIcon className="size-4" />
                    )}
                    <span>{miniApp.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
            <SidebarMenuItem>
              <CreateMiniAppDialog
                compact
                onCreated={onMiniAppCreated}
                trigger={
                  <SidebarMenuButton tooltip="Add mini app">
                    <PlusIcon className="size-4" />
                    <span className="text-sm">Add mini app</span>
                  </SidebarMenuButton>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 rounded-lg border border-sidebar-border bg-background/70 px-3 py-3">
              <Avatar className="size-9">
                {user?.avatarUrl ? (
                  <AvatarImage
                    src={
                      user.avatarUrl.startsWith('http') ||
                      user.avatarUrl.startsWith('data:')
                        ? user.avatarUrl
                        : `http://localhost:3001${user.avatarUrl}`
                    }
                    alt={user.displayName || 'User avatar'}
                  />
                ) : null}
                <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 text-sm">
                <div className="truncate font-medium">
                  {user?.displayName || 'Nebula User'}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {user?.email || 'unknown'}
                </div>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onLogout} tooltip="Log out">
              <LogOutIcon className="size-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
