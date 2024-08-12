import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

import { jwtDecode } from '../../../utils/jwt-decode'

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const decoded = jwtDecode(localStorage.getItem('accessToken'));

    if (localStorage.getItem('accessToken')) {
      navigate('/auth/login');
    }

    if (decoded?.userType === 'admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/products');
    }
  }, [])
    
  return (
    <div className='flex items-center justify-center h-screen bg-slate-900  w-screen'>
      <Spin size="large" />
    </div>
  )
}

export default HomePage