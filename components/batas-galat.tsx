'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

export type PropsPenampilGalat = {
  error: Error;
  resetErrorBoundary: () => void;
  judul?: string;
  petunjuk?: string;
};

/** UI fallback saat bagian dashboard gagal render (client). */
export function PenampilGalat({
  error,
  resetErrorBoundary,
  judul = 'Something went wrong',
  petunjuk = 'Your medications and account are safe. Try again or refresh the page.',
}: PropsPenampilGalat) {
  const pesan =
    error.message?.trim() ||
    'An unexpected error occurred. External services may be temporarily unavailable.';

  return (
    <div
      className="rounded-2xl border border-red-200 bg-red-50 p-4 text-left"
      role="alert"
    >
      <h3 className="font-semibold text-red-800">{judul}</h3>
      <p className="mt-2 text-sm text-red-700">{pesan}</p>
      <p className="mt-2 text-xs text-red-600/90">{petunjuk}</p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="mt-3 text-sm font-semibold text-red-800 underline hover:text-red-900"
      >
        Try again
      </button>
    </div>
  );
}

type PropsBatasGalat = {
  children: ReactNode;
  judul?: string;
  petunjuk?: string;
  /** Nama bagian untuk log (mis. scan, daftar-alert). */
  nama_bagian?: string;
  onReset?: () => void;
};

type StateBatasGalat = {
  galat: Error | null;
};

/**
 * Error boundary React — isolasi kegagalan Supabase Realtime, chart, atau UI klien.
 */
export class BatasGalat extends Component<PropsBatasGalat, StateBatasGalat> {
  state: StateBatasGalat = { galat: null };

  static getDerivedStateFromError(galat: Error): StateBatasGalat {
    return { galat };
  }

  componentDidCatch(galat: Error, info: ErrorInfo) {
    const label = this.props.nama_bagian ?? 'dashboard';
    console.error(`[batas-galat:${label}]`, galat.message, info.componentStack);
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ galat: null });
  };

  render() {
    if (this.state.galat) {
      return (
        <PenampilGalat
          error={this.state.galat}
          resetErrorBoundary={this.reset}
          judul={this.props.judul}
          petunjuk={this.props.petunjuk}
        />
      );
    }

    return this.props.children;
  }
}

/** Alias selaras pola dokumentasi hackathon. */
export const ErrorBoundary = BatasGalat;
export const ErrorFallback = PenampilGalat;
