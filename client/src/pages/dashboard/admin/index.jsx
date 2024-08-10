import React, { useState } from 'react';
import { Card, Table, Spin, Button, message, Popconfirm, Modal, Input, Form, Tabs, Select, InputNumber } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosInstance';

const { Option } = Select;
const { TabPane } = Tabs;

// Fetch functions for products and categories
const fetchProducts = async () => {
  const { data } = await axiosInstance.get('/products');
  return data;
};

const fetchCategories = async () => {
  const { data } = await axiosInstance.get('/categories');
  return data;
};

// Mutation functions for products and categories
const createProduct = async (productData) => {
  const { data } = await axiosInstance.post('/products', productData);
  return data;
};

const deleteProduct = async (id) => {
  await axiosInstance.delete(`/products/${id}`);
};

const createCategory = async (categoryData) => {
  const { data } = await axiosInstance.post('/categories', categoryData);
  return data;
};

const deleteCategory = async (id) => {
  await axiosInstance.delete(`/categories/${id}`);
};

const updateCategory = async ({ id, categoryData }) => {
  const { data } = await axiosInstance.put(`/categories/${id}`, categoryData);
  return data;
};

const AdminPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Queries for products and categories
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Mutations for products and categories
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      message.success('Product deleted successfully');
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete product');
    },
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      message.success('Product added successfully');
      queryClient.invalidateQueries(['products']);
      setIsProductModalVisible(false);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to add product');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      message.success('Category deleted successfully');
      queryClient.invalidateQueries(['categories']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete category');
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      message.success('Category added successfully');
      queryClient.invalidateQueries(['categories']);
      setIsCategoryModalVisible(false);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to add category');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      message.success('Category updated successfully');
      queryClient.invalidateQueries(['categories']);
      setIsCategoryModalVisible(false);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update category');
    },
  });

  const handleDeleteProduct = (id) => {
    deleteProductMutation.mutate(id);
  };

  const handleDeleteCategory = (id) => {
    deleteCategoryMutation.mutate(id);
  };

  const handleAddProduct = (values) => {
    createProductMutation.mutate(values);
  };

  const handleAddCategory = (values) => {
    if (isEditingCategory && currentCategory) {
      updateCategoryMutation.mutate({ id: currentCategory._id, categoryData: values });
    } else {
      createCategoryMutation.mutate(values);
    }
  };

  const handleEditCategory = (category) => {
    setIsEditingCategory(true);
    setCurrentCategory(category);
    setIsCategoryModalVisible(true);
  };

  const handleEditProduct = (product) => {
    navigate(`/dashboard/edit-product`, { state: { productId: product._id } });
  };

  const productColumns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button type="link" onClick={() => handleEditProduct(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteProduct(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const categoryColumns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button type="link" onClick={() => handleEditCategory(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDeleteCategory(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const productValidationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter the product name').min(3, 'Product name must be at least 3 characters long'),
    price: Yup.number()
      .required('Please enter the product price')
      .positive('Price must be positive')
      .min(1, 'Price must be at least 1'),
    category: Yup.string().required('Please select a category'),
    description: Yup.string().required('Please enter a short description').min(10, 'Description must be at least 10 characters long'),
    longDescription: Yup.string().required('Please enter a detailed description').min(20, 'Long description must be at least 20 characters long'),
    productImage: Yup.string().required('Please provide an image URL').url('Please enter a valid URL'),
  });

  const categoryValidationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter the category name').min(3, 'Category name must be at least 3 characters long'),
    description: Yup.string().optional().min(5, 'Description must be at least 5 characters long'),
  });

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (productsError || categoriesError) {
    return <div className="text-red-500">Error fetching data: {productsError?.message || categoriesError?.message}</div>;
  }

  return (
    <div className="p-6">
      <Card bordered={false}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Product List" key="1">
            <Table
              dataSource={products}
              columns={productColumns}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              title={() => (
                <div className='flex justify-end'>
                  <Button type="primary" onClick={() => setIsProductModalVisible(true)}>
                    Add Product
                  </Button>
                </div>
              )}
            />
          </TabPane>
          <TabPane tab="Categories" key="2">
            <Table
              dataSource={categories}
              columns={categoryColumns}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              title={() => (
                <div className='flex justify-end'>
                  <Button type="primary" onClick={() => setIsCategoryModalVisible(true)}>
                    Add Category
                  </Button>
                </div>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Add Product Modal */}
      <Modal
        title="Add Product"
        visible={isProductModalVisible}
        onCancel={() => setIsProductModalVisible(false)}
        footer={null}
      >
        <Formik
          initialValues={{
            name: '',
            price: 0,
            category: '',
            description: '',
            longDescription: '',
            productImage: '',
          }}
          validationSchema={productValidationSchema}
          onSubmit={handleAddProduct}
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
                  {({ field, form }) => (
                      <InputNumber
                        {...field}
                        value={field.value || 0} 
                        size="large"
                        min={0}
                        placeholder="Price"
                        style={{ width: '100%' }}
                        onChange={(value) => form.setFieldValue('price', value)}
                      />
                  )}
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
                      {categories.map((cat) => (
                        <Option key={cat._id} value={cat.name}>{cat.name}</Option>
                      ))}
                    </Select>
                  )}
                </Field>
              </Form.Item>

              <Form.Item
                label="Description"
                labelCol={{ span: 24 }}
                validateStatus={errors.description && touched.description ? 'error' : ''}
                help={errors.description && touched.description ? errors.description : ''}
              >
                <Field name="description">
                  {({ field }) => <Input.TextArea {...field} size="large" placeholder="Short description" />}
                </Field>
              </Form.Item>

              <Form.Item
                label="Long Description"
                labelCol={{ span: 24 }}
                validateStatus={errors.longDescription && touched.longDescription ? 'error' : ''}
                help={errors.longDescription && touched.longDescription ? errors.longDescription : ''}
              >
                <Field name="longDescription">
                  {({ field }) => <Input.TextArea {...field} size="large" placeholder="Detailed description" />}
                </Field>
              </Form.Item>

              <Form.Item
                label="Product Image URL"
                labelCol={{ span: 24 }}
                validateStatus={errors.productImage && touched.productImage ? 'error' : ''}
                help={errors.productImage && touched.productImage ? errors.productImage : ''}
              >
                <Field name="productImage">
                  {({ field }) => <Input {...field} size="large" placeholder="Image URL" />}
                </Field>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" loading={createProductMutation.isLoading}>
                  Add Product
                </Button>
              </Form.Item>
            </FormikForm>
          )}
        </Formik>
      </Modal>

      {/* Add/Edit Category Modal */}
      <Modal
        title={isEditingCategory ? "Edit Category" : "Add Category"}
        visible={isCategoryModalVisible}
        onCancel={() => setIsCategoryModalVisible(false)}
        footer={null}
      >
        <Formik
          initialValues={{
            name: currentCategory?.name || '',
            description: currentCategory?.description || '',
          }}
          validationSchema={categoryValidationSchema}
          onSubmit={handleAddCategory}
        >
          {({ errors, touched, handleSubmit }) => (
            <FormikForm onSubmit={handleSubmit}>
              <Form.Item
                label="Category Name"
                labelCol={{ span: 24 }}
                validateStatus={errors.name && touched.name ? 'error' : ''}
                help={errors.name && touched.name ? errors.name : ''}
              >
                <Field name="name">
                  {({ field }) => <Input {...field} size="large" placeholder="Category Name" />}
                </Field>
              </Form.Item>

              <Form.Item
                label="Description"
                labelCol={{ span: 24 }}
                validateStatus={errors.description && touched.description ? 'error' : ''}
                help={errors.description && touched.description ? errors.description : ''}
              >
                <Field name="description">
                  {({ field }) => <Input.TextArea {...field} size="large" placeholder="Description" />}
                </Field>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" loading={createCategoryMutation.isLoading || updateCategoryMutation.isLoading}>
                  {isEditingCategory ? "Update Category" : "Add Category"}
                </Button>
              </Form.Item>
            </FormikForm>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default AdminPage;
