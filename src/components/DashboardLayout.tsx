import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/components/AuthProvider';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import CommandPalette, { useCommandPalette } from '@/components/admin/CommandPalette';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Receipt,
  UserCog,
  Settings,
  Bell,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  BarChart3,
  Pill,
  Search,
  Moon,
  Sun,
  Command,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    heading: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
      { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    ],
  },
  {
    heading: 'Management',
    items: [
      { label: 'Patients', icon: Users, path: '/admin/patients' },
      { label: 'Appointments', icon: Calendar, path: '/admin/appointments' },
      { label: 'Billing', icon: Receipt, path: '/admin/billing' },
      { label: 'Pharmacy', icon: Pill, path: '/admin/pharmacy' },
      { label: 'Staff', icon: UserCog, path: '/admin/staff' },
    ],
  },
  {
    heading: 'System',
    items: [
      { label: 'Notifications', icon: Bell, path: '/admin/notifications' },
      { label: 'Settings', icon: Settings, path: '/admin/settings' },
    ],
  },
];

interface SidebarContentProps {
  mobile?: boolean;
  collapsed: boolean;
  navigate: (path: string) => void;
  isActive: (path: string) => boolean;
  onToggleCollapse: () => void;
}

const SidebarContent = ({ mobile = false, collapsed, navigate, isActive, onToggleCollapse }: SidebarContentProps) => {
  const showLabels = !collapsed || mobile;
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-white shadow-lg">
          <Stethoscope className="h-5 w-5" />
        </div>
        {showLabels && (
          <div className="leading-tight">
            <span className="block text-base font-bold text-sidebar-foreground">Clinic OS</span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Healthcare Suite</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.heading}>
            {showLabels && (
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.heading}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    title={collapsed && !mobile ? item.label : undefined}
                    className={cn(
                      'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      active
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/60'
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full gradient-brand" />
                    )}
                    <item.icon className={cn('h-5 w-5 flex-shrink-0', active && 'text-primary')} />
                    {showLabels && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      {!mobile && (
        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:bg-sidebar-accent/60"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      )}
    </div>
  );
};

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOutUser } = useContext(AuthContext);
  const { unreadCount } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const { open: cmdOpen, setOpen: setCmdOpen } = useCommandPalette();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate('/login');
  };

  const initials = user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden flex-col border-r border-sidebar-border bg-sidebar-background transition-all duration-300 lg:flex',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          navigate={navigate}
          isActive={isActive}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="z-20 flex h-16 items-center justify-between gap-2 border-b border-border bg-card/80 px-4 backdrop-blur-xl lg:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar-background p-0">
                <SidebarContent
                  mobile
                  collapsed={false}
                  navigate={navigate}
                  isActive={isActive}
                  onToggleCollapse={() => setCollapsed(!collapsed)}
                />
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Clinic OS / Admin</p>
              <h1 className="-mt-0.5 text-lg font-bold text-foreground">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Search / command trigger */}
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
            >
              <Search className="h-4 w-4" />
              <span>Search...</span>
              <kbd className="ml-2 inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                <Command className="h-3 w-3" />K
              </kbd>
            </button>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setCmdOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/admin/notifications')}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-1.5 pr-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="gradient-brand text-sm text-white">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline">
                    {user?.displayName || user?.email?.split('@')[0] || 'Admin'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">{user?.displayName || 'Admin User'}</p>
                  <p className="truncate text-xs font-normal text-muted-foreground">{user?.email || 'admin@clinic.com'}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
