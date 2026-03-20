import { Suspense, useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette, KeyboardShortcutsModal } from '../overlays';
import { useToolAnalytics } from '../../hooks';
import { PageLoader } from '../ui/PageLoader';

const { Content } = Layout;

export function MainLayout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useToolAnalytics();

  const openCommandPalette = useCallback(() => {
    setCommandPaletteOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setCommandPaletteOpen(false);
  }, []);

  const openShortcuts = useCallback(() => {
    setShortcutsOpen(true);
  }, []);

  const closeShortcuts = useCallback(() => {
    setShortcutsOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCommandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isCommandK) {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }

      const isQuestionMark = event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey;
      if (isQuestionMark) {
        event.preventDefault();
        setShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header onOpenCommandPalette={openCommandPalette} onOpenShortcuts={openShortcuts} />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Suspense fallback={<PageLoader />}>
            <div className="mx-auto">
              <Outlet />
            </div>
          </Suspense>
        </Content>
      </Layout>
      <CommandPalette open={commandPaletteOpen} onClose={closeCommandPalette} />
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={closeShortcuts} />
    </Layout>
  );
}
