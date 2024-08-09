import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Card, Typography, Divider, Spin, Select, Button } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../axiosInstance';

const { Title, Text } = Typography;
const { Option } = Select;

const fetchProductDetails = async (productId) => {
  const { data } = await axiosInstance.get(`/products/${productId}`);
  return data;
};

const addToCartBE = async (credentials) => {
  const { data } = await axiosInstance.post('/cart-items', credentials);
  return data;
};

const ProductDetails = () => {
  const { state } = useLocation(); 
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', state.productId],
    queryFn: () => fetchProductDetails(state.productId),
    enabled: !!state.productId,
  });

  const AddToCartApi = useMutation({
    mutationFn: addToCartBE,
  });

  const handleAddToCart = () => {
    const decoded = jwtDecode(localStorage.getItem('accessToken'));

    const payload = {
      email: decoded?.email,
      productId: state.productId,
      quantity: quantity || 1,
    };

    AddToCartApi.mutateAsync(payload);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error fetching product details: {error.message}</div>;
  }

  if (!product) {
    return <div>No product details available</div>;
  }

  return (
    <div className="p-6">
      <Card className="w-full">
        <Row gutter={[16, 16]}>
          {/* Left Side: Image and Description */}
          <Col xs={24} md={19}> {/* 70% width */}
            <img
              alt={product.name}
              src={product.productImage}
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
            <Divider />
            <Title level={3}>{product.name}</Title>
            <Text>{product.description}</Text>
            <Divider />
            <Text>{product.longDescription}</Text>
          </Col>

          {/* Right Side: Price, Quantity, and Add to Cart */}
          <Col xs={24} md={5} className="flex flex-col justify-between"> {/* 30% width */}
            <div>
              <Title level={3}>Price</Title>
              <Title level={2}>${product.price.toFixed(2)}</Title>
              <Divider />
              <Text className="block mb-2">Quantity</Text>
              <Select
                defaultValue={1}
                style={{ width: '100%' }}
                onChange={(value) => setQuantity(value)}
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
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProductDetails;
