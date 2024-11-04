'use client';
import { usePathname } from 'next/navigation';  // client-side only
import { useEffect } from 'react';

const Dashboard = () => {
  // DEVEL ONLY =================================
  if (process.env.NODE_ENV === 'development') {
    const pathname = usePathname();
    useEffect(() => {
        console.log('Dashboard.jsx: pathname:', pathname)
    }, [pathname]);
  }
  // ============================================

  return (
    <div>
      <h1>Dashboard</h1>
      <h4>Dashboard content</h4>
    </div>
  );
};

export default Dashboard;