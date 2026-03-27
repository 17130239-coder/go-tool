/**
 * Application shell layout.
 *
 * Renders the sidebar, header, and main content area.
 * Handles global keyboard shortcuts:
 *  - `Cmd/Ctrl + K` → open command palette
 *  - `?`            → open keyboard shortcuts modal
 *
 * Shows a `<PageLoader>` spinner during lazy route transitions to prevent
 * blank content flashes.
 */

import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { Layout } from 'antd';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { usePageTitle, useToolAnalytics } from '../../hooks';
import { PageLoader } from '../ui/PageLoader';

const { Content } = Layout;

export function MainLayout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const navigation = useNavigation();
  const isNavigating = navigation.state === 'loading';

  // Sync document.title with the current route
  usePageTitle();

  // Record tool visits for "Recently Used" on the dashboard
  useToolAnalytics();

  const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setCommandPaletteOpen(false), []);
  const openShortcuts = useCallback(() => setShortcutsOpen(true), []);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);

  // Global keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K → open command palette
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }

      // ? → open keyboard shortcuts help (only without modifiers)
      if (event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey) {
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
        <Header
          onOpenCommandPalette={openCommandPalette}
          onOpenShortcuts={openShortcuts}
        />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          {isNavigating ? (
            <PageLoader />
          ) : (
            <div className="mx-auto">
              <Outlet />
            </div>
          )}
        </Content>
      </Layout>

      <CommandPalette open={commandPaletteOpen} onClose={closeCommandPalette} />
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={closeShortcuts} />
    </Layout>
  );
}
