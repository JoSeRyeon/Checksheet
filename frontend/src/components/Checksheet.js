import React from 'react';
import { Layout, Menu } from 'antd';
import {
  SnippetsOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

function Checklist() {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에 따라 메뉴 key 매핑
  const getSelectedKey = () => {
    if (location.pathname === '/') return '1';
    if (location.pathname.startsWith('/checksheet/list')) return '2';
    return '1';
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case '1':
        navigate('/');
        break;
      case '2':
        navigate('/checksheet/list');
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 사이드 메뉴 */}
      <Sider
        collapsible
        style={{
          position: 'fixed', // 사이드 고정
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
        }}
      >
        <div
          className="logo"
          style={{ height: 32, margin: 16, background: 'rgba(255,255,255,.3)' }}
        />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="1" icon={<UnorderedListOutlined /> }>
            작업 일람
          </Menu.Item>
          <Menu.Item key="2" icon={<SnippetsOutlined /> }>
            체크시트 목록
          </Menu.Item>
        </Menu>
      </Sider>

      {/* 오른쪽 영역 */}
      <Layout
        style={{
          marginLeft: 200, // Sider width 만큼 밀기
          minHeight: '100vh',
        }}
      >
        <Header
          style={{
            position: 'fixed', // 헤더 고정
            top: 0,
            left: 200, // Sider width 만큼 밀기
            right: 0,
            background: '#fff',
            padding: 0,
            zIndex: 10,
          }}
        >
          <h2 style={{ margin: '0 20px' }}>CHECKSHEET</h2>
        </Header>

        <Content
          style={{
            margin: '80px 16px 16px', // Header 높이만큼 top margin 주기
            overflow: 'auto',
          }}
        >
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Checklist;
