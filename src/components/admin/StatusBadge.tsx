import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  // Appointments
  scheduled: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20',
  'in-progress': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20',
  completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
  cancelled: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20',
  'no-show': 'bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-1 ring-slate-500/20',
  // Invoices
  paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20',
  overdue: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20',
  // Generic
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
  inactive: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-1 ring-slate-500/20',
  'in-stock': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
  'low-stock': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20',
  'out-of-stock': 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20',
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const style = statusStyles[status] || 'bg-muted text-muted-foreground ring-1 ring-border';
  const label = status.replace(/-/g, ' ');
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        style,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
};

export default StatusBadge;
