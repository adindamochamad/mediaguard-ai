export type ItemNavDashboard = {
  nama: string;
  jalur: string;
  ikon: 'bell' | 'pill' | 'chat' | 'settings';
};

export const daftar_nav_dashboard: ItemNavDashboard[] = [
  { nama: 'Alerts', jalur: '/dashboard', ikon: 'bell' },
  { nama: 'Medications', jalur: '/dashboard/medications', ikon: 'pill' },
  { nama: 'AI Chat', jalur: '/dashboard/chat', ikon: 'chat' },
  { nama: 'Settings', jalur: '/dashboard/settings', ikon: 'settings' },
];
