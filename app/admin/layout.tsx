"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase,
  MessageSquare, 
  FolderTree,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import styles from './admin.module.css';
import { NotificationBell } from './components/NotificationBell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Don't show sidebar on login and password pages
  if (pathname === '/admin/login' || pathname === '/admin/forgot-password' || pathname === '/admin/reset-password') {
    return <div className="adminRoot">{children}</div>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const menuGroups = [
    {
      label: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
      ]
    },
    {
      label: 'PROJECT MANAGEMENT',
      items: [
        { name: 'Projects', path: '/admin/projects', icon: <Briefcase size={18} /> },
      ]
    },
    {
      label: 'ENQUIRIES',
      items: [
        { name: 'Project Enquiries', path: '/admin/project-enquiries', icon: <MessageSquare size={18} /> },
        { name: 'Form Options', path: '/admin/form-options', icon: <MessageSquare size={18} style={{ opacity: 0.7 }} /> },
      ]
    },
    {
      label: 'CONTENT',
      items: [
        { name: 'Categories', path: '/admin/categories', icon: <FolderTree size={18} /> },
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
      ]
    }
  ];

  return (
    <div className={`${styles.layout} adminRoot`}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <div className={styles.logo}>VECTOR-X ADMIN</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <NotificationBell />
          <button className={styles.menuButton} onClick={() => setIsMobileOpen(!isMobileOpen)}>
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoGroup}>
            <div className={styles.logo}>VECTOR-X</div>
            <div className={styles.logoSub}>SOLUTIONS</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={styles.badge}>ADMIN</span>
            <NotificationBell />
          </div>
        </div>

        <nav className={styles.nav}>
          {menuGroups.map((group, idx) => (
            <div key={idx} className={styles.navGroup}>
              <div className={styles.navGroupLabel}>{group.label}</div>
              {group.items.map((item) => {
                // Exact match for dashboard, startswith for others
                const isActive = item.path === '/admin' 
                  ? pathname === '/admin'
                  : pathname?.startsWith(item.path);

                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div className={styles.overlay} onClick={() => setIsMobileOpen(false)} />
      )}
    </div>
  );
}










