import React, { useState } from 'react';
import { Row, Col, Card, Divider, Input, Button, DatePicker } from 'antd';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../../../axiosInstance';
import { jwtDecode } from '../../../utils/jwt-decode';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const updateCartStatus = async (cartID) => {
  await axiosInstance.put(`/carts/${cartID}/status`, { cartActive: false });
};

export default function CheckoutPage() {

  const { state } = useLocation();

  const navigate = useNavigate();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cartItems'],
    queryFn: async () => {
      const decoded = jwtDecode(localStorage.getItem('accessToken'));
      const { data } = await axiosInstance.get(`/carts/${decoded.email}`);
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (orderData) => {
      const response = await axiosInstance.post('/orders', orderData);
      return response.data;
    },
    onSuccess: async () => {
      await updateCartStatus(state?.cartID).then(() => {
        navigate('/dashboard/products');
      });
    },
    onError: (error) => {
      console.error('Error placing order:', error);
    },
  });

  const handlePlaceOrder = (values) => {
    const orderData = {
      ...values,
      cartItems,
      cartID: state?.cartID,
      total: cartItems.total,
      expiryDate: values.expiryDate.format('YYYY-MM-DD'),
    };
    mutation.mutate(orderData);
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter your first name'),
    lastName: Yup.string().required('Please enter your last name'),
    addressLine1: Yup.string().required('Please enter your address'),
    postalCode: Yup.string().required('Please enter your postal code'),
    phoneNumber: Yup.string().required('Please enter your phone number'),
    creditCardNumber: Yup.string().required('Please enter your credit card number'),
    nameOnCard: Yup.string().required('Please enter the name on your card'),
    expiryDate: Yup.date()
      .required('Please enter the expiry date')
      .min(dayjs().startOf('month'), 'Expiry date must be in the future'),
    cvv: Yup.string().required('Please enter the CVV'),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Title level={2} className="text-center" style={{ color: 'white' }}>
        Checkout
      </Title>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Order Summary" className="mt-5 sm:mt-5 md:mt-5">
            {cartItems?.cartItems?.length > 0 && cartItems?.cartItems?.map((item) => (
              <div key={item._id} style={{ marginBottom: 16 }}>
                <Row>
                  <Col span={12}>{item.productId.name}</Col>
                  <Col span={6}>{item.quantity} x ${item.productId.price.toFixed(2)}</Col>
                  <Col span={6} style={{ textAlign: 'right' }}>
                    ${(item.quantity * item.productId.price).toFixed(2)}
                  </Col>
                </Row>
              </div>
            ))}
            <Divider />
            <Row justify="space-between">
              <Col>
                <Title level={4}>Subtotal</Title>
              </Col>
              <Col>
                <Title level={5}>${cartItems?.subtotal.toFixed(2)}</Title>
              </Col>
            </Row>
            <Row justify="space-between">
              <Col>
                <Title level={4}>Tax (13%)</Title>
              </Col>
              <Col>
                <Title level={5}>${(cartItems.tax).toFixed(2)}</Title>
              </Col>
            </Row>
            <Divider />
            <Row justify="space-between">
              <Col>
                <Title level={4}>Total with Tax</Title>
              </Col>
              <Col>
                <Title level={5}>${cartItems?.total?.toFixed(2)}</Title>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Shipping & Payment" className="mt-5 sm:mt-5 md:mt-5">
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                addressLine1: '',
                addressLine2: '',
                postalCode: '',
                phoneNumber: '',
                creditCardNumber: '',
                nameOnCard: '',
                expiryDate: dayjs(),
                cvv: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handlePlaceOrder}
            >
              {({ errors, touched, isSubmitting, setFieldValue }) => (
                <Form>
                  <div className='mb-7'>
                    <Title level={5}>Personal Information</Title>
                  </div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Field name="firstName">
                        {({ field }) => (
                          <div className="mb-3">
                            <label>First Name</label>
                            <Input {...field} size="large" placeholder="First Name" />
                            {errors.firstName && touched.firstName ? (
                              <div className="text-red-500">{errors.firstName}</div>
                            ) : null}
                          </div>
                        )}
                      </Field>
                    </Col>
                    <Col span={12}>
                      <Field name="lastName">
                        {({ field }) => (
                          <div className="mb-3">
                            <label>Last Name</label>
                            <Input {...field} size="large" placeholder="Last Name" />
                            {errors.lastName && touched.lastName ? (
                              <div className="text-red-500">{errors.lastName}</div>
                            ) : null}
                          </div>
                        )}
                      </Field>
                    </Col>
                  </Row>

                  <Field name="phoneNumber">
                    {({ field }) => (
                      <div className="mb-3">
                        <label>Phone Number</label>
                        <Input {...field} size="large" placeholder="Phone Number" />
                        {errors.phoneNumber && touched.phoneNumber ? (
                          <div className="text-red-500">{errors.phoneNumber}</div>
                        ) : null}
                      </div>
                    )}
                  </Field>

                  <Divider />

                  <div className='mb-7'>
                    <Title level={5}>Address Information</Title>
                  </div>
                  <div className="mb-3">
                    <Field name="addressLine1">
                      {({ field }) => (
                        <div className="mb-3">
                          <label>Address Line 1</label>
                          <Input {...field} size="large" placeholder="Address Line 1" />
                          {errors.addressLine1 && touched.addressLine1 ? (
                            <div className="text-red-500">{errors.addressLine1}</div>
                          ) : null}
                        </div>
                      )}
                    </Field>
                  </div>

                  <div className="mb-3">
                    <Field name="addressLine2">
                      {({ field }) => (
                        <div className="mb-3">
                          <label>Address Line 2</label>
                          <Input {...field} size="large" placeholder="Address Line 2" />
                        </div>
                      )}
                    </Field>
                  </div>

                  <div className="mb-3">
                    <Field name="postalCode">
                      {({ field }) => (
                        <div className="mb-3">
                          <label>Postal Code</label>
                          <Input {...field} size="large" placeholder="Postal Code" />
                          {errors.postalCode && touched.postalCode ? (
                            <div className="text-red-500">{errors.postalCode}</div>
                          ) : null}
                        </div>
                      )}
                    </Field>
                  </div>

                  <Divider />

                  <div className='mb-7'>
                    <Title level={5}>Payment Information</Title>
                  </div>
                  <div className="mb-3">
                    <Field name="creditCardNumber">
                      {({ field }) => (
                        <div className="mb-3">
                          <label>Credit Card Number</label>
                          <Input {...field} size="large" placeholder="Credit Card Number" />
                          {errors.creditCardNumber && touched.creditCardNumber ? (
                            <div className="text-red-500">{errors.creditCardNumber}</div>
                          ) : null}
                        </div>
                      )}
                    </Field>
                  </div>

                  <div className="mb-3">
                    <Field name="nameOnCard">
                      {({ field }) => (
                        <div className="mb-3">
                          <label>Name on Card</label>
                          <Input {...field} size="large" placeholder="Name on Card" />
                          {errors.nameOnCard && touched.nameOnCard ? (
                            <div className="text-red-500">{errors.nameOnCard}</div>
                          ) : null}
                        </div>
                      )}
                    </Field>
                  </div>

                  <div className="mb-3">
                    <Field name="expiryDate">
                      {({ field, form: { setFieldValue }, meta: { touched, error } }) => (
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                          <DatePicker
                            {...field}
                            size="large"
                            placeholder="Expiry Date"
                            format="MM/YYYY"
                            picker="month"
                            onChange={(date) => setFieldValue('expiryDate', date)}
                            style={{ width: '100%' }} 
                          />
                          {touched && error ? (
                            <div className="text-red-500">{error}</div>
                          ) : null}
                        </div>
                      )}
                    </Field>
                  </div>


                  <div className="mb-3">
                    <Field name="cvv">
                      {({ field }) => (
                        <div className="mb-3">
                          <label>CVV</label>
                          <Input {...field} size="large" placeholder="CVV" />
                          {errors.cvv && touched.cvv ? (
                            <div className="text-red-500">{errors.cvv}</div>
                          ) : null}
                        </div>
                      )}
                    </Field>
                  </div>

                  <Button type="primary" htmlType="submit" block loading={isSubmitting || mutation.isLoading}>
                    Place Order
                  </Button>
                </Form>
              )}
            </Formik>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
