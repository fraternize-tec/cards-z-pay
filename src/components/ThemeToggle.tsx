'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as
      | 'dark'
      | 'light'
      | null;

    const prefersLight =
      window.matchMedia('(prefers-color-scheme: light)').matches;

    const initial = saved ?? (prefersLight ? 'light' : 'dark');

    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  return (
    <button
      onClick={toggleTheme}
      className="button"
      style={{
        width: 'auto',
        padding: '6px 12px',
        fontSize: '0.75rem',
      }}
    >
      {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
    </button>
  );
}
