import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Receipt,
  UserCog,
  Settings,
  Bell,
  BarChart3,
  Pill,
  FilePlus,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { mockPatients } from '@/services/mockData';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navCommands = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Patients', icon: Users, path: '/admin/patients' },
  { label: 'Appointments', icon: Calendar, path: '/admin/appointments' },
  { label: 'Billing', icon: Receipt, path: '/admin/billing' },
  { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { label: 'Pharmacy', icon: Pill, path: '/admin/pharmacy' },
  { label: 'Staff', icon: UserCog, path: '/admin/staff' },
  { label: 'Notifications', icon: Bell, path: '/admin/notifications' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search or jump to..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => go('/admin/billing/create')}>
            <FilePlus className="mr-2 h-4 w-4" /> Create Invoice
          </CommandItem>
          <CommandItem onSelect={() => go('/admin/patients')}>
            <Users className="mr-2 h-4 w-4" /> Add Patient
          </CommandItem>
          <CommandItem
            onSelect={() => {
              toggleTheme();
              onOpenChange(false);
            }}
          >
            {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          {navCommands.map((cmd) => (
            <CommandItem key={cmd.path} onSelect={() => go(cmd.path)}>
              <cmd.icon className="mr-2 h-4 w-4" /> {cmd.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Patients">
          {mockPatients.slice(0, 6).map((p) => (
            <CommandItem key={p.id} onSelect={() => go(`/admin/patients/${p.id}`)} value={`patient-${p.name}`}>
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                {p.name.charAt(0)}
              </span>
              {p.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

// Hook to wire up Cmd+K / Ctrl+K
export const useCommandPalette = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  return { open, setOpen };
};

export default CommandPalette;
