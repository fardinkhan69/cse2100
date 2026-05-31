import { useState } from 'react';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/admin/PageHeader';
import EmptyState from '@/components/admin/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Bell, Calendar, Receipt, User, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '@/contexts/NotificationContext';
import type { Notification } from '@/services/mockData';

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  appointment: { icon: Calendar, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  billing: { icon: Receipt, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  patient: { icon: User, color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  system: { icon: Bell, color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
};

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter((n: Notification) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  return (
    <DashboardLayout title="Notifications">
      <PageHeader
        title="Notifications"
        description="Stay on top of clinic activity."
        icon={<Bell className="h-5 w-5" />}
        actions={
          <Button variant="outline" size="sm" className="gap-2" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        }
      />

      <div className="mb-4">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="bg-muted/60">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-2">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification: Notification, i) => {
            const config = typeConfig[notification.type] || typeConfig.system;
            const Icon = config.icon;
            return (
              <motion.div key={notification.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
                <Card
                  className={cn(
                    'cursor-pointer border-border/60 transition-all hover:shadow-md',
                    !notification.read && 'border-l-4 border-l-primary bg-primary/[0.03]'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl', config.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={cn('text-sm text-foreground', !notification.read ? 'font-bold' : 'font-medium')}>
                            {notification.title}
                          </h4>
                          <span className="flex-shrink-0 text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">{notification.message}</p>
                      </div>
                      {!notification.read && <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <EmptyState icon={Bell} title="All caught up!" description="No notifications to show." />
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
