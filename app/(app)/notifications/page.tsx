"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Clock,
  Gift,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  UserPlus,
  Shield,
  X,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/lib/store";
import { useLocale } from "@/hooks/use-locale";
import type { Notification } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  transaction: CreditCard,
  promotion: Gift,
  security: Shield,
  rate: TrendingUp,
  referral: UserPlus,
  system: Bell,
  alert: AlertTriangle,
};

const colorMap: Record<string, string> = {
  transaction: "bg-blue-500/10 text-blue-500",
  promotion: "bg-pink-500/10 text-pink-500",
  security: "bg-red-500/10 text-red-500",
  rate: "bg-green-500/10 text-green-500",
  referral: "bg-purple-500/10 text-purple-500",
  system: "bg-gray-500/10 text-gray-500",
  alert: "bg-yellow-500/10 text-yellow-500",
};

export default function NotificationsPage() {
  const router = useRouter();
  const { t } = useLocale();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = filter === "unread" 
    ? notifications.filter((n) => !n.read)
    : notifications;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
  };

  const handleAction = (notification: Notification) => {
    setSelectedNotification(null);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground md:text-2xl">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                <CheckCheck className="mr-1.5 h-4 w-4" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowClearDialog(true)}
                className="text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-4 flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="rounded-full"
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
            className="rounded-full"
          >
            Unread ({unreadCount})
          </Button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => {
              const Icon = iconMap[notification.type] || Bell;
              const colorClass = colorMap[notification.type] || colorMap.system;
              
              return (
                <Card
                  key={notification.id}
                  className={cn(
                    "cursor-pointer border-0 shadow-sm transition-all hover:shadow-md",
                    !notification.read && "border-l-4 border-l-primary bg-primary/5"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", colorClass)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className={cn("font-medium text-foreground", !notification.read && "font-semibold")}>
                            {notification.title}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTime(notification.createdAt)}
                          </span>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Bell className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">
                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {filter === "unread" 
                  ? "You're all caught up!" 
                  : "When you receive notifications, they'll appear here"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notification Detail Dialog */}
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent className="sm:max-w-7xl">
          {selectedNotification && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = iconMap[selectedNotification.type] || Bell;
                    const colorClass = colorMap[selectedNotification.type] || colorMap.system;
                    return (
                      <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", colorClass)}>
                        <Icon className="h-6 w-6" />
                      </div>
                    );
                  })()}
                  <div className="flex-1">
                    <DialogTitle>{selectedNotification.title}</DialogTitle>
                    <p className="text-xs text-muted-foreground">
                      {new Date(selectedNotification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              
              <Separator className="my-4" />
              
              <DialogDescription className="text-foreground">
                {selectedNotification.message}
              </DialogDescription>
              
              {selectedNotification.metadata && (
                <div className="mt-4 rounded-lg bg-muted/50 p-4">
                  <h4 className="mb-2 text-sm font-medium text-foreground">Details</h4>
                  <dl className="space-y-1 text-sm">
                    {Object.entries(selectedNotification.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <dt className="capitalize text-muted-foreground">{key.replace(/_/g, " ")}</dt>
                        <dd className="font-medium text-foreground">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              
              <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    deleteNotification(selectedNotification.id);
                    setSelectedNotification(null);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                {selectedNotification.actionUrl && (
                  <Button className="w-full sm:w-auto" onClick={() => handleAction(selectedNotification)}>
                    {selectedNotification.actionLabel || "View Details"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Clear All Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Clear all notifications?</DialogTitle>
            <DialogDescription>
              This will permanently delete all {notifications.length} notifications. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                clearAll();
                setShowClearDialog(false);
              }}
            >
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
