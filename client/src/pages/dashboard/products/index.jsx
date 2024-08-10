import React, { useState } from 'react';
import { Row, Col, Card, Spin, Select, Button } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Icon } from '@iconify/react';
import eyeIcon from '@iconify/icons-mdi/eye';
import axiosInstance from '../../../axiosInstance';
import { jwtDecode } from '../../../utils/jwt-decode';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;
const { Option } = Select;

const fetchProducts = async () => {
  const { data } = await axiosInstance.get('/products');
  return data;
};

const fetchCategories = async () => {
  const { data } = await axiosInstance.get('/categories');
  return data;
};

const addToCartBE = async (credentials) => {
  const { data } = await axiosInstance.post('/cart-items', credentials);
  return data;
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const { data: products, isLoading: isProductsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const AddToCartApi = useMutation({
    mutationFn: addToCartBE,
  });

  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleQuantityChange = (productId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: value,
    }));
  };

  const handleAddToCart = (productId) => {
    const decoded = jwtDecode(localStorage.getItem('accessToken'));

    const payload = {
      email: decoded?.email,
      productId: productId,
      quantity: quantities[productId] || 1,
    };

    AddToCartApi.mutateAsync(payload);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  if (isProductsLoading || isCategoriesLoading) {
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
      <Row justify="end" className="mb-4">
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ width: 200 }}
        >
          <Option key="All" value="All">All</Option>
          {categories.map(category => (
            <Option key={category._id} value={category.name}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Row>
      <Row gutter={[16, 16]}>
        {filteredProducts.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
            <Card
              hoverable
              cover={
                <img
                  alt={product.name}
                  src={product.productImage}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              }
              extra={[
                <Button
                  type="text"
                  icon={<Icon icon={eyeIcon} style={{ fontSize: '24px' }} />}
                  onClick={() => navigate('/dashboard/product-details', { state: { productId: product._id } })}
                />,
              ]}
            >
              <Meta title={product.name} description={`$${product.price}`} />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <Select
                  defaultValue={1} // Start with 1
                  style={{ width: '100%' }}
                  onChange={(value) => handleQuantityChange(product._id, value)}
                >
                  {[...Array(10).keys()].map((value) => (
                    <Option key={value + 1} value={value + 1}>
                      {value + 1}
                    </Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  block
                  className="mt-4"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
