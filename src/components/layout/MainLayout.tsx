import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const { Content } = Layout;

export function MainLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <div className="mx-auto">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
