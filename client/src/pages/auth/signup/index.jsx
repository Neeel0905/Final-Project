import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { Card, Button, Input, Form, Row, Col, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signupInitialValues, signupValidationSchema } from './formHelper';
import axiosInstance from '../../../axiosInstance';

const signupUser = async (credentials) => {
  const { data } = await axiosInstance.post('/auth/signup', credentials);
  return data;
};

const SignUpPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!!localStorage.getItem("accessToken")) {
      navigate('/dashboard/products');
    }
  }, []);

  const mutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      message.success('Sign-up successful');
      navigate('/auth/login');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Sign-up failed');
    },
  });
  

  const handleSubmit = (values) => {
    mutation.mutate(values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card title="Sign Up" style={{ width: 600 }}>
        <Formik
          initialValues={signupInitialValues}
          validationSchema={signupValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleSubmit, errors, touched, isSubmitting }) => {
            console.log(errors);
            return (
              <Form onFinish={handleSubmit} layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="First Name"
                      validateStatus={errors.firstName && touched.firstName ? 'error' : ''}
                      help={errors.firstName && touched.firstName ? errors.firstName : ''}
                    >
                      <Input 
                        name="firstName" 
                        value={values.firstName} 
                        onChange={handleChange} 
                        placeholder="First Name" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Last Name"
                      validateStatus={errors.lastName && touched.lastName ? 'error' : ''}
                      help={errors.lastName && touched.lastName ? errors.lastName : ''}
                    >
                      <Input 
                        name="lastName" 
                        value={values.lastName} 
                        onChange={handleChange} 
                        placeholder="Last Name" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
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
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Mobile"
                      validateStatus={errors.mobile && touched.mobile ? 'error' : ''}
                      help={errors.mobile && touched.mobile ? errors.mobile : ''}
                    >
                      <Input 
                        name="mobile" 
                        value={values.mobile} 
                        onChange={handleChange} 
                        placeholder="Mobile" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

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

                <Form.Item
                  label="Confirm Password"
                  validateStatus={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
                  help={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ''}
                >
                  <Input.Password 
                    name="confirmPassword" 
                    value={values.confirmPassword} 
                    onChange={handleChange} 
                    placeholder="Confirm Password" 
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={isSubmitting || mutation.isPending} 
                    block
                    size="large"
                  >
                    Sign Up
                  </Button>
                </Form.Item>
              </Form>
          )}}
        </Formik>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span>Already have an account? </span>
          <Button type="link" onClick={() => navigate('/login')}>Login</Button>
        </div>
      </Card>
    </div>
  );
};

export default SignUpPage;
