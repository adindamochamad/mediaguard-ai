import { redirect } from 'next/navigation';
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

  return (
    <LayoutSidebarDashboard email_pengguna={pengguna.email ?? ''}>
      {children}
    </LayoutSidebarDashboard>
  );
}
