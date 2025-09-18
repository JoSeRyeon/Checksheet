import React from 'react';
import { Layout, Menu } from 'antd';
import {
  CheckSquareOutlined,
  EditOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

function Checklist() {
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    // 메뉴 키에 따라 경로 이동
    switch (e.key) {
      case '1':
        navigate('/');
        break;
      case '2':
        navigate('/edit');
        break;
      case '3':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 사이드 메뉴 */}
      <Sider collapsible>
        <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255,255,255,.3)' }} />

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={handleMenuClick}
        >
          <Menu.Item key="1" icon={<CheckSquareOutlined />}>
            체크시트 목록
          </Menu.Item>
          {/* <Menu.Item key="2" icon={<EditOutlined />}>
            체크시트 작성/편집
          </Menu.Item> */}
          {/* <Menu.Item key="3" icon={<SettingOutlined />}>
            설정
          </Menu.Item> */}
        </Menu>
      </Sider>

      {/* 메인 컨텐츠 */}
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          <h2 style={{ margin: '0 20px' }}>체크시트 프로젝트</h2>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {/* 여기 Outlet이 각 페이지 내용을 보여줌 */}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Checklist;

