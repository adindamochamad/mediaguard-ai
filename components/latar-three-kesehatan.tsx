'use client';

import { useEffect, useRef } from 'react';
import type * as TThree from 'three';

const PALET = [
  { r: 0.07, g: 0.37, b: 0.35 },
  { r: 0.08, g: 0.72, b: 0.65 },
  { r: 0.6, g: 0.96, b: 0.89 },
  { r: 0.49, g: 0.84, b: 0.99 },
  { r: 0.96, g: 0.45, b: 0.55 }, // rose medis lembut
  { r: 0.82, g: 0.93, b: 0.91 },
];

type Partikel = {
  posisi: { x: number; y: number; z: number };
  kecepatan: { x: number; y: number; z: number };
  fase: number;
};

type ObjekAnimasi = {
  mesh: TThree.Object3D;
  posisi_awal: TThree.Vector3;
  putar?: { x: number; y: number; z: number };
  apung?: { sumbu: 'x' | 'y' | 'z'; amplitudo: number; kecepatan: number; fase: number };
  detak?: { skala_min: number; skala_maks: number; kecepatan: number; fase: number };
};

function daftarkan_animasi(
  daftar: ObjekAnimasi[],
  mesh: TThree.Object3D,
  opsi: Omit<ObjekAnimasi, 'mesh' | 'posisi_awal'>,
) {
  daftar.push({
    mesh,
    posisi_awal: mesh.position.clone(),
    ...opsi,
  });
}

/** Heliks DNA ganda — ikon biomedis klasik */
function buat_heliks_dna(T: typeof import('three')): TThree.Group {
  const grup = new T.Group();
  const titik_strand_a: number[] = [];
  const titik_strand_b: number[] = [];
  const titik_rung: number[] = [];

  for (let i = 0; i <= 100; i++) {
    const y = (i / 100) * 18 - 9;
    const sudut = i * 0.32;
    const radius = 1.35;
    const x1 = Math.cos(sudut) * radius;
    const z1 = Math.sin(sudut) * radius;
    const x2 = Math.cos(sudut + Math.PI) * radius;
    const z2 = Math.sin(sudut + Math.PI) * radius;
    titik_strand_a.push(x1, y, z1);
    titik_strand_b.push(x2, y, z2);
    if (i % 5 === 0) titik_rung.push(x1, y, z1, x2, y, z2);
  }

  const mat_strand = new T.LineBasicMaterial({
    color: 0x14b8a6,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  const mat_rung = new T.LineBasicMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });

  grup.add(
    new T.Line(
      new T.BufferGeometry().setAttribute('position', new T.Float32BufferAttribute(titik_strand_a, 3)),
      mat_strand,
    ),
  );
  grup.add(
    new T.Line(
      new T.BufferGeometry().setAttribute('position', new T.Float32BufferAttribute(titik_strand_b, 3)),
      mat_strand,
    ),
  );
  grup.add(
    new T.LineSegments(
      new T.BufferGeometry().setAttribute('position', new T.Float32BufferAttribute(titik_rung, 3)),
      mat_rung,
    ),
  );

  grup.position.set(-7, 0, -6);
  grup.rotation.z = 0.25;
  return grup;
}

/** Gelombang ECG stylized */
function buat_gelombang_ecg(T: typeof import('three')): TThree.Line {
  const titik: number[] = [];
  for (let i = 0; i <= 120; i++) {
    const x = (i / 120) * 24 - 12;
    let y = 0;
    const siklus = i % 30;
    if (siklus >= 8 && siklus < 10) y = 0.35;
    else if (siklus >= 10 && siklus < 12) y = -0.55;
    else if (siklus >= 12 && siklus < 14) y = 1.1;
    else if (siklus >= 14 && siklus < 16) y = -0.25;
    titik.push(x, y, 0);
  }
  return new T.Line(
    new T.BufferGeometry().setAttribute('position', new T.Float32BufferAttribute(titik, 3)),
    new T.LineBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.28, depthWrite: false }),
  );
}

/** Kapsul obat (silinder + tutup) */
function buat_kapsul(T: typeof import('three'), warna: number, skala: number): TThree.Group {
  const grup = new T.Group();
  const mat = new T.MeshBasicMaterial({
    color: warna,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  const badan = new T.Mesh(new T.CapsuleGeometry(0.35 * skala, 1.1 * skala, 4, 8), mat);
  grup.add(badan);
  return grup;
}

/** Silang medis (+) */
function buat_silang_medis(T: typeof import('three'), ukuran: number): TThree.Group {
  const grup = new T.Group();
  const mat = new T.MeshBasicMaterial({
    color: 0x99f6e4,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });
  const vert = new T.Mesh(new T.BoxGeometry(ukuran * 0.28, ukuran, ukuran * 0.28), mat);
  const horz = new T.Mesh(new T.BoxGeometry(ukuran, ukuran * 0.28, ukuran * 0.28), mat);
  grup.add(vert, horz);
  return grup;
}

/**
 * Latar Three.js — molekul, DNA, kapsul, ECG, detak jantung.
 * Tema kesehatan ramai tapi tetap profesional.
 */
export function LatarThreeKesehatan() {
  const kontainer_ref = useRef<HTMLDivElement>(null);
  const kanvas_ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const kontainer = kontainer_ref.current;
    const kanvas = kanvas_ref.current;
    if (!kontainer || !kanvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let bingkai_animasi = 0;
    let masih_aktif = true;
    let lebar = kontainer.clientWidth;
    let tinggi = kontainer.clientHeight;

    const target_parallax = { x: 0, y: 0 };
    const parallax_halus = { x: 0, y: 0 };

    let THREE: typeof TThree | null = null;
    let renderer: TThree.WebGLRenderer | null = null;
    let scene: TThree.Scene | null = null;
    let camera: TThree.PerspectiveCamera | null = null;
    let partikel_mesh: TThree.Points | null = null;
    let partikel_kilau: TThree.Points | null = null;
    let garis_mesh: TThree.LineSegments | null = null;
    const objek_animasi: ObjekAnimasi[] = [];
    let daftar_partikel: Partikel[] = [];
    let waktu_mulai = performance.now();

    const tangani_gerak_mouse = (e: PointerEvent) => {
      target_parallax.x = (e.clientX / window.innerWidth - 0.5) * 1.1;
      target_parallax.y = -(e.clientY / window.innerHeight - 0.5) * 0.75;
    };

    const tangani_resize = () => {
      if (!kontainer || !renderer || !camera) return;
      lebar = kontainer.clientWidth;
      tinggi = kontainer.clientHeight;
      renderer.setSize(lebar, tinggi, false);
      camera.aspect = lebar / tinggi;
      camera.updateProjectionMatrix();
    };

    const tangani_visibility = () => {
      if (document.hidden) cancelAnimationFrame(bingkai_animasi);
      else bingkai_animasi = requestAnimationFrame(loop_animasi);
    };

    function perbarui_garis(posisi_attr: Float32Array) {
      if (!garis_mesh || !THREE) return;
      const jarak_kuadrat = 5 * 5;
      const titik_garis: number[] = [];
      const n = daftar_partikel.length;

      for (let i = 0; i < n; i++) {
        const ax = posisi_attr[i * 3];
        const ay = posisi_attr[i * 3 + 1];
        const az = posisi_attr[i * 3 + 2];
        for (let j = i + 1; j < n; j++) {
          const bx = posisi_attr[j * 3];
          const by = posisi_attr[j * 3 + 1];
          const bz = posisi_attr[j * 3 + 2];
          const dx = ax - bx;
          const dy = ay - by;
          const dz = az - bz;
          if (dx * dx + dy * dy + dz * dz < jarak_kuadrat) {
            titik_garis.push(ax, ay, az, bx, by, bz);
          }
        }
      }

      garis_mesh.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(titik_garis.length ? titik_garis : [0, 0, 0, 0, 0, 0], 3),
      );
    }

    function loop_animasi(waktu_sekarang: number) {
      if (!masih_aktif || !scene || !camera || !renderer || !partikel_mesh) return;

      const t = (waktu_sekarang - waktu_mulai) * 0.001;

      parallax_halus.x += (target_parallax.x - parallax_halus.x) * 0.05;
      parallax_halus.y += (target_parallax.y - parallax_halus.y) * 0.05;
      camera.position.x = parallax_halus.x;
      camera.position.y = parallax_halus.y;
      camera.lookAt(0, 0, 0);

      const posisi_attr = partikel_mesh.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < daftar_partikel.length; i++) {
        const p = daftar_partikel[i];
        p.posisi.x += p.kecepatan.x + Math.sin(t * 0.55 + p.fase) * 0.002;
        p.posisi.y += p.kecepatan.y + Math.cos(t * 0.45 + p.fase) * 0.0018;
        p.posisi.z += p.kecepatan.z + Math.sin(t * 0.3 + p.fase) * 0.001;
        if (Math.abs(p.posisi.x) > 14) p.kecepatan.x *= -1;
        if (Math.abs(p.posisi.y) > 9) p.kecepatan.y *= -1;
        if (Math.abs(p.posisi.z) > 6) p.kecepatan.z *= -1;
        posisi_attr[i * 3] = p.posisi.x;
        posisi_attr[i * 3 + 1] = p.posisi.y;
        posisi_attr[i * 3 + 2] = p.posisi.z;
      }
      partikel_mesh.geometry.attributes.position.needsUpdate = true;
      perbarui_garis(posisi_attr);

      if (partikel_kilau) {
        const kilau_attr = partikel_kilau.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < kilau_attr.length / 3; i++) {
          kilau_attr[i * 3 + 1] += Math.sin(t * 0.8 + i) * 0.003;
        }
        partikel_kilau.geometry.attributes.position.needsUpdate = true;
      }

      objek_animasi.forEach((obj) => {
        if (obj.putar) {
          obj.mesh.rotation.x += obj.putar.x;
          obj.mesh.rotation.y += obj.putar.y;
          obj.mesh.rotation.z += obj.putar.z;
        }
        if (obj.apung) {
          const { sumbu, amplitudo, kecepatan, fase } = obj.apung;
          const offset = Math.sin(t * kecepatan + fase) * amplitudo;
          obj.mesh.position.copy(obj.posisi_awal);
          if (sumbu === 'x') obj.mesh.position.x += offset;
          if (sumbu === 'y') obj.mesh.position.y += offset;
          if (sumbu === 'z') obj.mesh.position.z += offset;
        }
        if (obj.detak) {
          const { skala_min, skala_maks, kecepatan, fase } = obj.detak;
          const s = skala_min + ((Math.sin(t * kecepatan + fase) + 1) / 2) * (skala_maks - skala_min);
          obj.mesh.scale.set(s, s, s);
        }
      });

      renderer.render(scene, camera);
      bingkai_animasi = requestAnimationFrame(loop_animasi);
    }

    async function inisialisasi() {
      if (!kanvas) return;
      const T = await import('three');
      THREE = T;

      scene = new T.Scene();
      camera = new T.PerspectiveCamera(52, lebar / tinggi, 0.1, 100);
      camera.position.z = 15;

      renderer = new T.WebGLRenderer({
        canvas: kanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(lebar, tinggi, false);
      renderer.setClearColor(0x000000, 0);

      const mobile = lebar < 768;
      const jumlah_partikel = mobile ? 52 : 88;

      const posisi_buffer = new Float32Array(jumlah_partikel * 3);
      const warna_buffer = new Float32Array(jumlah_partikel * 3);
      daftar_partikel = [];

      for (let i = 0; i < jumlah_partikel; i++) {
        const warna = PALET[i % PALET.length];
        const partikel: Partikel = {
          posisi: {
            x: (Math.random() - 0.5) * 26,
            y: (Math.random() - 0.5) * 16,
            z: (Math.random() - 0.5) * 10,
          },
          kecepatan: {
            x: (Math.random() - 0.5) * 0.006,
            y: (Math.random() - 0.5) * 0.006,
            z: (Math.random() - 0.5) * 0.003,
          },
          fase: Math.random() * Math.PI * 2,
        };
        daftar_partikel.push(partikel);
        posisi_buffer[i * 3] = partikel.posisi.x;
        posisi_buffer[i * 3 + 1] = partikel.posisi.y;
        posisi_buffer[i * 3 + 2] = partikel.posisi.z;
        warna_buffer[i * 3] = warna.r;
        warna_buffer[i * 3 + 1] = warna.g;
        warna_buffer[i * 3 + 2] = warna.b;
      }

      const geo_partikel = new T.BufferGeometry();
      geo_partikel.setAttribute('position', new T.BufferAttribute(posisi_buffer, 3));
      geo_partikel.setAttribute('color', new T.BufferAttribute(warna_buffer, 3));

      partikel_mesh = new T.Points(
        geo_partikel,
        new T.PointsMaterial({
          size: mobile ? 0.16 : 0.2,
          vertexColors: true,
          transparent: true,
          opacity: 0.82,
          sizeAttenuation: true,
          depthWrite: false,
          blending: T.AdditiveBlending,
        }),
      );
      scene.add(partikel_mesh);

      // Lapisan kilau kecil
      const jumlah_kilau = mobile ? 40 : 70;
      const pos_kilau = new Float32Array(jumlah_kilau * 3);
      const warna_kilau = new Float32Array(jumlah_kilau * 3);
      for (let i = 0; i < jumlah_kilau; i++) {
        pos_kilau[i * 3] = (Math.random() - 0.5) * 30;
        pos_kilau[i * 3 + 1] = (Math.random() - 0.5) * 18;
        pos_kilau[i * 3 + 2] = (Math.random() - 0.5) * 12;
        warna_kilau[i * 3] = 0.9;
        warna_kilau[i * 3 + 1] = 0.98;
        warna_kilau[i * 3 + 2] = 0.95;
      }
      const geo_kilau = new T.BufferGeometry();
      geo_kilau.setAttribute('position', new T.BufferAttribute(pos_kilau, 3));
      geo_kilau.setAttribute('color', new T.BufferAttribute(warna_kilau, 3));
      partikel_kilau = new T.Points(
        geo_kilau,
        new T.PointsMaterial({
          size: mobile ? 0.06 : 0.08,
          vertexColors: true,
          transparent: true,
          opacity: 0.55,
          sizeAttenuation: true,
          depthWrite: false,
          blending: T.AdditiveBlending,
        }),
      );
      scene.add(partikel_kilau);

      garis_mesh = new T.LineSegments(
        new T.BufferGeometry(),
        new T.LineBasicMaterial({
          color: 0x14b8a6,
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
        }),
      );
      scene.add(garis_mesh);

      const heliks = buat_heliks_dna(T);
      scene.add(heliks);
      daftarkan_animasi(objek_animasi, heliks, {
        putar: { x: 0, y: 0.012, z: 0.004 },
        apung: { sumbu: 'y', amplitudo: 0.6, kecepatan: 0.4, fase: 0 },
      });

      const heliks2 = buat_heliks_dna(T);
      heliks2.position.set(8, -1, -5);
      heliks2.rotation.y = Math.PI * 0.6;
      heliks2.scale.set(0.75, 0.75, 0.75);
      scene.add(heliks2);
      daftarkan_animasi(objek_animasi, heliks2, { putar: { x: 0.005, y: -0.01, z: 0 } });

      const ecg = buat_gelombang_ecg(T);
      ecg.position.set(0, -4, -2);
      ecg.rotation.y = -0.3;
      scene.add(ecg);
      daftarkan_animasi(objek_animasi, ecg, {
        apung: { sumbu: 'x', amplitudo: 0.8, kecepatan: 0.25, fase: 1 },
      });

      const ecg2 = buat_gelombang_ecg(T);
      ecg2.position.set(-5, 5, -3);
      ecg2.scale.set(0.6, 0.6, 0.6);
      ecg2.rotation.z = 0.4;
      scene.add(ecg2);

      const warna_kapsul = [0x115e59, 0x14b8a6, 0xf472b6, 0x7dd3fc, 0x34d399];
      warna_kapsul.forEach((warna, i) => {
        const kapsul = buat_kapsul(T, warna, 0.9 + (i % 3) * 0.15);
        kapsul.position.set((i - 2) * 4.5, (i % 2 === 0 ? 3 : -3) + i * 0.3, -3 - i);
        kapsul.rotation.set(Math.random(), Math.random(), Math.random());
        scene!.add(kapsul);
        daftarkan_animasi(objek_animasi, kapsul, {
          putar: { x: 0.004 + i * 0.001, y: 0.006, z: 0.003 },
          apung: { sumbu: 'y', amplitudo: 0.5, kecepatan: 0.5 + i * 0.1, fase: i },
        });
      });

      for (let i = 0; i < (mobile ? 3 : 5); i++) {
        const silang = buat_silang_medis(T, 1.2 + (i % 2) * 0.4);
        silang.position.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12, -2 - Math.random() * 4);
        silang.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        scene!.add(silang);
        daftarkan_animasi(objek_animasi, silang, { putar: { x: 0.002, y: 0.008, z: 0.002 } });
      }

      const warna_orb = [0x115e59, 0x14b8a6, 0x7dd3fc, 0xf472b6, 0x34d399];
      warna_orb.forEach((warna_hex, indeks) => {
        const orb = new T.Mesh(
          new T.IcosahedronGeometry(1.4 + indeks * 0.35, 2),
          new T.MeshBasicMaterial({
            color: warna_hex,
            transparent: true,
            opacity: 0.09 + indeks * 0.015,
            wireframe: true,
            depthWrite: false,
          }),
        );
        orb.position.set((indeks - 2) * 4, (indeks % 2 === 0 ? 1 : -1) * 3, -5 - indeks * 0.8);
        scene!.add(orb);
        daftarkan_animasi(objek_animasi, orb, {
          putar: { x: 0.01 * (indeks + 1), y: 0.008 * (indeks + 1), z: 0.005 },
        });

        const cincin = new T.Mesh(
          new T.RingGeometry(1.8 + indeks * 0.3, 1.95 + indeks * 0.3, 48),
          new T.MeshBasicMaterial({
            color: 0xf472b6,
            transparent: true,
            opacity: 0.12,
            side: T.DoubleSide,
            depthWrite: false,
          }),
        );
        cincin.position.copy(orb.position);
        scene!.add(cincin);
        daftarkan_animasi(objek_animasi, cincin, {
          detak: { skala_min: 0.85, skala_maks: 1.25, kecepatan: 1.2 + indeks * 0.15, fase: indeks * 0.7 },
        });
      });

      window.addEventListener('pointermove', tangani_gerak_mouse, { passive: true });
      window.addEventListener('resize', tangani_resize);
      document.addEventListener('visibilitychange', tangani_visibility);

      waktu_mulai = performance.now();
      bingkai_animasi = requestAnimationFrame(loop_animasi);
    }

    void inisialisasi();

    return () => {
      masih_aktif = false;
      cancelAnimationFrame(bingkai_animasi);
      window.removeEventListener('pointermove', tangani_gerak_mouse);
      window.removeEventListener('resize', tangani_resize);
      document.removeEventListener('visibilitychange', tangani_visibility);

      objek_animasi.forEach(({ mesh }) => {
        mesh.traverse((anak) => {
          const obj = anak as TThree.Mesh | TThree.Line | TThree.LineSegments;
          if ('geometry' in obj && obj.geometry) obj.geometry.dispose();
          if ('material' in obj && obj.material) {
            const mat = obj.material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat.dispose();
          }
        });
      });
      partikel_mesh?.geometry.dispose();
      (partikel_mesh?.material as TThree.Material)?.dispose();
      partikel_kilau?.geometry.dispose();
      (partikel_kilau?.material as TThree.Material)?.dispose();
      garis_mesh?.geometry.dispose();
      (garis_mesh?.material as TThree.Material)?.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <div ref={kontainer_ref} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#ecfdf5_0%,#f0f9ff_35%,#fdf2f8_65%,#fafaf9_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.18),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(125,211,252,0.16),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_10%,rgba(244,114,182,0.1),transparent_35%)]" />
      <canvas ref={kanvas_ref} className="absolute inset-0 h-full w-full opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_90%_at_50%_40%,transparent_0%,rgba(250,250,249,0.55)_100%)]" />
      <div className="absolute inset-0 bg-background/10" />
    </div>
  );
}
