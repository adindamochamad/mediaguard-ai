import { LayoutAuth } from '@/components/layout-auth';
import { FormDaftar } from '@/components/form-daftar';

export default function HalamanDaftar() {
  return (
    <LayoutAuth
      judul="Create your account"
      deskripsi="Start monitoring your medications with source-linked alerts."
    >
      <FormDaftar />
    </LayoutAuth>
  );
}
