export type ItemNavDashboard = {
  nama: string;
  jalur: string;
  ikon: 'bell' | 'pill' | 'history' | 'chat' | 'settings';
};

export const daftar_nav_dashboard: ItemNavDashboard[] = [
  { nama: 'Alerts', jalur: '/dashboard', ikon: 'bell' },
  { nama: 'Medications', jalur: '/dashboard/medications', ikon: 'pill' },
  { nama: 'Scan history', jalur: '/dashboard/history', ikon: 'history' },
  { nama: 'AI Chat', jalur: '/dashboard/chat', ikon: 'chat' },
  { nama: 'Settings', jalur: '/dashboard/settings', ikon: 'settings' },
];
