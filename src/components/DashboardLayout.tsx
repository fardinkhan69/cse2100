import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/components/AuthProvider';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Patients', icon: Users, path: '/admin/patients' },
  { label: 'Appointments', icon: Calendar, path: '/admin/appointments' },
  { label: 'Billing', icon: Receipt, path: '/admin/billing' },
  { label: 'Staff', icon: UserCog, path: '/admin/staff' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

interface SidebarContentProps {
  mobile?: boolean;
  collapsed: boolean;
  navigate: (path: string) => void;
  isActive: (path: string) => boolean;
  onToggleCollapse: () => void;
}

const SidebarContent = ({ mobile = false, collapsed, navigate, isActive, onToggleCollapse }: SidebarContentProps) => (
  <div className="flex flex-col h-full">
    <div className="p-4 border-b">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-medical-medium flex items-center justify-center">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        {(!collapsed || mobile) && (
          <span className="font-semibold text-lg text-medical-dark">Clinic OS</span>
        )}
      </div>
    </div>
    <nav className="flex-1 p-2 space-y-1">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive(item.path)
              ? 'bg-medical-medium/10 text-medical-medium'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          {(!collapsed || mobile) && <span>{item.label}</span>}
        </button>
      ))}
    </nav>
    {!mobile && (
      <div className="p-2 border-t">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    )}
  </div>
);

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOutUser } = useContext(AuthContext);
  const { unreadCount } = useNotifications();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-cream">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r bg-white transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <SidebarContent
          collapsed={collapsed}
          navigate={navigate}
          isActive={isActive}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent
                  mobile
                  collapsed={collapsed}
                  navigate={navigate}
                  isActive={isActive}
                  onToggleCollapse={() => setCollapsed(!collapsed)}
                />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/admin/notifications')}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-medical-medium text-white text-sm">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">
                    {user?.displayName || user?.email || 'Admin'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
