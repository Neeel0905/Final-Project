import React from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from '../../../utils/jwt-decode';

const { Header, Footer, Content } = Layout;

export default function DashboardLayout() {
  const navigate = useNavigate();

  const decoded = jwtDecode(localStorage.getItem("accessToken"));

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/auth/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen flex flex-col">
      <Header className="px-5 flex items-center justify-between">
        <div className="text-white text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
          ND
        </div>
        <Menu 
          theme="dark" 
          mode="horizontal" 
          defaultSelectedKeys={['/dashboard/products']} 
          className="flex-1 ml-6"
          onClick={(e) => navigate(e.key)}
        >
          {decoded.userType === 'admin' ? (
            <Menu.Item key="/dashboard/admin">Admin</Menu.Item>
          ) : (
            <>
              <Menu.Item key="/dashboard/products">Products</Menu.Item>
              <Menu.Item key="/dashboard/cart">Cart</Menu.Item>
              {/* <Menu.Item key="/dashboard/orders">Orders</Menu.Item> */}
            </>
          )}
        </Menu>
        <Dropdown overlay={menu} placement="bottomRight">
          <Avatar 
            style={{ cursor: 'pointer' }} 
            icon={<UserOutlined />} 
          />
        </Dropdown>
      </Header>
      
      <Content className="flex-grow p-6 bg-slate-900">
        <Outlet />
      </Content>
      
      <Footer className="text-center py-4 bg-slate-900 text-white">
        ND ©2024 Created by Neel
      </Footer>
    </Layout>
  );
}
