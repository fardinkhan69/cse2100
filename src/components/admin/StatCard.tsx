import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  gradient: 'gradient-brand' | 'gradient-violet' | 'gradient-emerald' | 'gradient-amber' | 'gradient-rose';
  sparkline?: { value: number }[];
  delay?: number;
  suffix?: string;
}

const gradientStroke: Record<string, string> = {
  'gradient-brand': '#3b82f6',
  'gradient-violet': '#8b5cf6',
  'gradient-emerald': '#10b981',
  'gradient-amber': '#f59e0b',
  'gradient-rose': '#f43f5e',
};

const StatCard = ({ label, value, change, icon: Icon, gradient, sparkline, delay = 0, suffix }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl card-elevated hover-lift p-5"
    >
      {/* Decorative gradient blob */}
      <div className={cn('absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20', gradient)} />

      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
            {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
          </div>
          {typeof change === 'number' && (
            <div className="flex items-center gap-1 pt-1">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold',
                  change >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                )}
              >
                {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg', gradient)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {sparkline && sparkline.length > 0 && (
        <div className="mt-3 h-10 w-full opacity-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkline} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`spark-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gradientStroke[gradient]} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={gradientStroke[gradient]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={gradientStroke[gradient]}
                strokeWidth={2}
                fill={`url(#spark-${label.replace(/\s/g, '')})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
