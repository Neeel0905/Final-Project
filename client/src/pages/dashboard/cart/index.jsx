import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, InputNumber, Row, Col, Divider, Typography, Card } from 'antd';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosInstance from '../../../axiosInstance';
import { jwtDecode } from '../../../utils/jwt-decode';

const { Title } = Typography;

const fetchCartItems = async () => {
  const decoded = jwtDecode(localStorage.getItem('accessToken'));
  const { data } = await axiosInstance.get(`/carts/${decoded.email}`);
  return data;
};

const updateCartItemQuantity = async ({ cartItemId, quantity }) => {
  const { data } = await axiosInstance.put(`/cart-items/${cartItemId}`, { quantity });
  return data.cartItem;
};

const removeCartItem = async (cartItemId) => {
  await axiosInstance.delete(`/cart-items/${cartItemId}`);
};

export default function CartViewPage() {
  const navigate = useNavigate();

  const { data = {}, isLoading, refetch } = useQuery({
    queryKey: ['cartItems'],
    queryFn: fetchCartItems,
  });

  const updateCartItemMutation = useMutation({
    mutationFn: updateCartItemQuantity,
    onSuccess: () => {
      refetch();
    },
  });

  const removeCartItemMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      refetch();
    },
  });

  const handleQuantityChange = (cartItemId, quantity) => {
    updateCartItemMutation.mutate({ cartItemId, quantity });
  };

  const handleRemoveItem = (cartItemId) => {
    removeCartItemMutation.mutate(cartItemId);
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: ['productId', 'name'],
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: ['productId', 'price'],
      key: 'price',
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, record) => (
        <InputNumber
          min={1}
          max={10}
          defaultValue={text}
          onChange={(value) => handleQuantityChange(record._id, value)}
        />
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (text, record) => `$${(record.productId.price * record.quantity).toFixed(2)}`,
    },
    {
      title: '',
      key: 'action',
      width: '100px',
      render: (text, record) => (
        <Button type="link" onClick={() => handleRemoveItem(record._id)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-center align-middle mb-4">
        <Title level={3}>Cart</Title>
      </div>
      <Card>
        <Table
          dataSource={data.cartItems}
          columns={columns}
          rowKey="_id"
          pagination
          loading={isLoading}
        />
      </Card>
      <Divider />
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3}>Total</Title>
          </Col>
          <Col>
            <Title level={5}>${data.subtotal?.toFixed(2)}</Title>
          </Col>
        </Row>
        <Row justify="end">
          <Col>
            <Button
              onClick={() => navigate('/dashboard/cart/checkout', { state: { cartID: data?.cart?._id } })}
              type="primary"
              className="mt-5 mr-0"
            >
              Proceed to Checkout
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
