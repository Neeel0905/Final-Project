import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Footer, Content } = Layout;

export default function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <Layout className="min-h-screen flex flex-col">
      <Header className="px-5 flex items-center justify-between">
        <div className="text-white text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
          ND
        </div>
        <Menu 
          theme="dark" 
          mode="horizontal" 
          defaultSelectedKeys={['1']} 
          className="flex-1 ml-6"
          onClick={(e) => navigate(e.key)}
        >
          <Menu.Item key="/dashboard/products">Products</Menu.Item>
          <Menu.Item key="/dashboard/cart">Cart</Menu.Item>
          <Menu.Item key="/dashboard/orders">Orders</Menu.Item>
        </Menu>
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
