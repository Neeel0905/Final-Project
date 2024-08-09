import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import 'antd/dist/reset.css';

const { Sider, Content } = Layout;

const AuthLayout = () => {
  return (
    <Layout className="min-h-screen">
      <Sider 
        width="50%" 
        className="hidden md:block"
        style={{ backgroundColor: 'black' }}
      />

      <Content className="bg-white flex items-center justify-center">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AuthLayout;
