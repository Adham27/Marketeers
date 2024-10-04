import React, { useState, useEffect } from 'react';
import { Link, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Grid, message } from 'antd';
import Cookies from 'js-cookie';
import '../styles/ProtectedRoute.sass';  // For custom responsive styles

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const AuthenticatedRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(() => {
    const user_id = localStorage.getItem('user_id');
    const user_token = localStorage.getItem('Token');
    return user_id && user_token;
  });

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    const user_token = localStorage.getItem('Token');
    const isAuthenticated = user_id && user_token;
    setAuthenticated(isAuthenticated);
  }, []);

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const ProtectedRoute = () => {
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint(); // Ant Design's responsive hook
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically collapse the sidebar for smaller screens
    if (!screens.lg) {
      setCollapsed(true);
    }
  }, [screens]);

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('Token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      message.success('Logged out successfully');
      Cookies.remove('access_token_cookie');
      Cookies.remove('user_id');
      localStorage.removeItem('Token');
      localStorage.removeItem('user_id');
      navigate('/');
    } catch (error) {
      message.error('Failed to logout');
    }
  };

  return (
    <AuthenticatedRoute>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"  // Automatically collapses on smaller screens
          onBreakpoint={(broken) => {
            if (broken) setCollapsed(true);
          }}
        >
          <div className="demo-logo-vertical" />
          <div className="p-2 text-white">
            {collapsed ? <h2>MKT</h2> : <h2>Marketeers</h2>}
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <HomeOutlined />,
                label: <Link to={`/users/${userId}/dashboard`}>Dashboard</Link>,
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: '0 16px',
              background: '#fff',
            }}
            className="header"
          >
            <div className="d-flex justify-content-between">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="menu-button"
              />
              <Button danger className="mt-3 m-4" onClick={logout}>
                Logout
              </Button>
            </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: '24px',
              minHeight: '280px',
              background: '#fff',
              borderRadius: '8px',
            }}
            className="content"
          >
            <div className="container height-container">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </AuthenticatedRoute>
  );
};

export default ProtectedRoute;
