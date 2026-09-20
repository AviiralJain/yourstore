"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './NotificationBell.module.css';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications?limit=10');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open && buttonRef.current) {
      const updatePosition = () => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownWidth = Math.min(360, window.innerWidth - 24);

        // Try to right-align with the button, but clamp to viewport limits
        const left = Math.min(
          Math.max(12, rect.right - dropdownWidth),
          window.innerWidth - dropdownWidth - 12
        );

        const top = rect.bottom + 10;

        setDropdownStyle({
          position: 'fixed',
          top: `${top}px`,
          left: `${left}px`,
          width: `${dropdownWidth}px`
        });
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, { passive: true });
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [open]);

  const handleMarkAsRead = async (id: string) => {
    try {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      await fetch("/api/admin/notifications/" + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      await fetch('/api/admin/notifications/read-all', { method: 'PATCH' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.read) {
      await handleMarkAsRead(notif._id);
    }
    setOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <div className={styles.container}>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Notifications"
        className={styles.bellButton}
        onClick={() => setOpen(prev => !prev)}
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>

      {open && (
        <div className={styles.dropdown} style={dropdownStyle}>
          <div className={styles.dropdownHeader}>
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button type="button" onClick={handleMarkAllRead}>
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className={styles.empty}>
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                type="button"
                key={notification._id}
                className={styles.notificationItem + (notification.read ? '' : ' ' + styles.notificationItemUnread)}
                onClick={() => handleNotificationClick(notification)}
              >
                <strong>{notification.title}</strong>
                <span>{notification.message}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
