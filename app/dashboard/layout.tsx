import { redirect } from 'next/navigation';
import { ToastProvider } from '@/components/toast-provider';
import { buat_klien_supabase_server } from '@/lib/supabase/server';
import { LayoutSidebarDashboard } from '@/components/layout-sidebar-dashboard';

export default async function LayoutDashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await buat_klien_supabase_server();
  const {
    data: { user: pengguna },
  } = await supabase.auth.getUser();

  if (!pengguna) {
    redirect('/login');
  }

  const { count: jumlah_belum_dibaca } = await supabase
    .from('alerts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', pengguna.id)
    .is('read_at', null);

  return (
    <LayoutSidebarDashboard
      email_pengguna={pengguna.email ?? ''}
      jumlah_belum_dibaca={jumlah_belum_dibaca ?? 0}
    >
      {children}
      <ToastProvider />
    </LayoutSidebarDashboard>
  );
}
