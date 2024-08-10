import React, { useEffect, useState } from 'react';
import { Card, Button, Input, InputNumber, Select, Form, Spin, message, Row, Col } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../axiosInstance';

const { Option } = Select;

const fetchProductById = async (id) => {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data;
};

const updateProduct = async ({ id, productData }) => {
  const { data } = await axiosInstance.put(`/products/${id}`, productData);
  return data;
};

const EditProductPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', state?.productId],
    queryFn: () => fetchProductById(state?.productId),
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      message.success('Product updated successfully');
      queryClient.invalidateQueries(['products']);
      navigate('/dashboard/admin');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update product');
    },
  });

  const handleSubmit = (values) => {
    updateMutation.mutate({ id: state?.productId, productData: values });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter the product name').min(3, 'Product name must be at least 3 characters long'),
    price: Yup.number().required('Please enter the product price').positive('Price must be positive').min(1, 'Price must be at least 1'),
    category: Yup.string().required('Please select a category'),
    description: Yup.string().required('Please enter a short description').min(10, 'Description must be at least 10 characters long'),
    productImage: Yup.string().required('Please provide an image URL').url('Please enter a valid URL'),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error fetching product: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <Card title="Edit Product" bordered={false}>
        {data && (
          <Formik
            initialValues={{
              name: data.name,
              price: data.price,
              category: data.category,
              description: data.description,
              longDescription: data.longDescription,
              productImage: data.productImage,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleSubmit, setFieldValue }) => (
              <FormikForm onSubmit={handleSubmit}>
                <Form.Item
                  label="Product Name"
                  labelCol={{ span: 24 }}
                  validateStatus={errors.name && touched.name ? 'error' : ''}
                  help={errors.name && touched.name ? errors.name : ''}
                >
                  <Field name="name">
                    {({ field }) => <Input {...field} size="large" placeholder="Product Name" />}
                  </Field>
                </Form.Item>

                <Form.Item
                  label="Price"
                  labelCol={{ span: 24 }}
                  validateStatus={errors.price && touched.price ? 'error' : ''}
                  help={errors.price && touched.price ? errors.price : ''}
                >
                  <Field name="price">
                    {({ field }) => <InputNumber {...field} size="large" min={0} placeholder="Price" style={{ width: '100%' }} />}
                  </Field>
                </Form.Item>

                <Form.Item
                  label="Category"
                  labelCol={{ span: 24 }}
                  validateStatus={errors.category && touched.category ? 'error' : ''}
                  help={errors.category && touched.category ? errors.category : ''}
                >
                  <Field name="category">
                    {({ field }) => (
                      <Select
                        {...field}
                        size="large"
                        placeholder="Select a category"
                        onChange={(value) => setFieldValue('category', value)}
                        style={{ width: '100%' }}
                      >
                        <Option value="Smartphones">Smartphones</Option>
                        <Option value="Laptops">Laptops</Option>
                        <Option value="Tablets">Tablets</Option>
                        <Option value="Audio">Audio</Option>
                        <Option value="Wearables">Wearables</Option>
                        <Option value="Entertainment">Entertainment</Option>
                        <Option value="Accessories">Accessories</Option>
                        <Option value="Desktops">Desktops</Option>
                      </Select>
                    )}
                  </Field>
                </Form.Item>

                <Form.Item
                  label="Description"
                  labelCol={{ span: 24 }}
                >
                  <Field name="description">
                    {({ field }) => <Input.TextArea {...field} size="large" placeholder="Short description" />}
                  </Field>
                </Form.Item>

                <Form.Item
                  label="Long Description"
                  labelCol={{ span: 24 }}
                >
                  <Field name="longDescription">
                    {({ field }) => <Input.TextArea {...field} size="large" placeholder="Detailed description" />}
                  </Field>
                </Form.Item>

                <Form.Item
                  label="Product Image URL"
                  labelCol={{ span: 24 }}
                >
                  <Field name="productImage">
                    {({ field }) => <Input {...field} size="large" placeholder="Image URL" />}
                  </Field>
                </Form.Item>

                <Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Button type="default" block size="large" onClick={() => navigate('/dashboard/admin')}>
                        Cancel
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button type="primary" htmlType="submit" block size="large" loading={updateMutation.isLoading}>
                        Update Product
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </FormikForm>
            )}
          </Formik>
        )}
      </Card>
    </div>
  );
};

export default EditProductPage;
