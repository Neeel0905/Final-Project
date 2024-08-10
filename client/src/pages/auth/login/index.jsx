import React from 'react';
import { Formik } from 'formik';
import { Card, Button, Input, Form, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { loginInitialValues, loginValidationSchema } from './formHelper';
import axiosInstance from '../../../axiosInstance';
import { useEffect } from 'react';
import { jwtDecode } from '../../../utils/jwt-decode';

const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post('/auth/login', credentials);
  return data;
};

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!!localStorage.getItem("accessToken")) {
      navigate('/dashboard/products');
    }
  }, []);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.token);
      message.success('Login successful');
      const decode = jwtDecode(data.token);
      if (decode?.userType === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/products');
      }
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Login failed');
    },
  });

  const handleSubmit = (values) => {
    mutation.mutate(values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card title="Login" style={{ width: 400 }}>
        <Formik
          initialValues={loginInitialValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleSubmit, errors, touched, isSubmitting }) => (
            <Form onFinish={handleSubmit} layout="vertical">
              <Form.Item
                label="Email"
                validateStatus={errors.email && touched.email ? 'error' : ''}
                help={errors.email && touched.email ? errors.email : ''}
              >
                <Input 
                  name="email" 
                  value={values.email} 
                  onChange={handleChange} 
                  placeholder="Email" 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                validateStatus={errors.password && touched.password ? 'error' : ''}
                help={errors.password && touched.password ? errors.password : ''}
              >
                <Input.Password 
                  name="password" 
                  value={values.password} 
                  onChange={handleChange} 
                  placeholder="Password" 
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={isSubmitting || mutation.isLoading} 
                  block
                  size="large"
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          )}
        </Formik>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span>Don't have an account? </span>
          <Link to="/auth/signup">Sign up</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
