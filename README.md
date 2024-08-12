# Final-Project

## E-Commerce Project

**Student Name**: Neel Dobariya  
**Student Number**: 8980806  
**Date**: 07-22-2024

### Technology Stack

- **Frontend**: ReactJS
- **Backend**: Node.js with Express
- **Database**: MongoDB (Atlas)

### Project Setup

1. **Project Initialization**: Repository created on GitHub and cloned to the local machine.
2. **Frontend Setup**: Initialized ReactJS project.
3. **Backend Setup**: Initialized Node.js project with Express and connected to MongoDB (Atlas).

## Credentials for app
### Admin - ID
```bash
km@mailsac.com
```
### Admin - Password
```bash
T3sting1
```

### Customer - ID
```bash
kc@mailsac.com
```
### Customer - Password
```bash
T3sting1@
```

### Cloning the Repository

```bash
git clone https://github.com/Neeel0905/Final-Project.git
cd Final-Project
```
### Install Dependencies
```bash
npm install
cd client
npm install
cd ..
cd server
npm install

```
#### or
```bash
npm run clean-install
```

### Running the Application
```bash 
npm run start
```

### Database Schema Design

**Products Schema (MongoDB)**

- `id`: `ObjectId`
- `name`: `String`
- `description`: `String`
- `price`: `Number`
- `category`: `String`
- `stock`: `Number`
- `createdAt`: `Date`
- `updatedAt`: `Date`

**Users Schema (MongoDB)**

- `id`: `ObjectId`
- `username`: `String`
- `email`: `String`
- `password`: `String`
- `firstName`: `String`
- `lastName`: `String`
- `createdAt`: `Date`
- `updatedAt`: `Date`

**Order Schema (MongoDB)**

- `id`: `ObjectId`
- `userId`: `ObjectId`
- `items`: `String`
- `totalAmount`: `Number`
- `status`: `String`
- `createdAt`: `Date`
- `updatedAt`: `Date`
- `shippingAddress`: `String`
- `paymentDetails`: `String`

### Frontend Setup

1. Basic structure set up for React components, including directories for components and services.
2. State management planned to handle user sessions and cart data.

### Notes

- The project is set up using Git and GitHub for version control.
- Further development will include implementing user interfaces for product listings, shopping cart, and checkout.

---

## API Endpoints

### Authentication
- **POST** `/auth/signup` - Register a new user
- **POST** `/auth/login` - Login a user and get a token

### Products
- **GET** `/products` - Get all products
- **POST** `/products` - Create a new product
- **GET** `/products/:id` - Get a product by ID
- **PUT** `/products/:id` - Update a product by ID
- **DELETE** `/products/:id` - Delete a product by ID

### Categories
- **GET** `/categories` - Get all categories
- **POST** `/categories` - Create a new category
- **GET** `/categories/:id` - Get a category by ID
- **PUT** `/categories/:id` - Update a category by ID
- **DELETE** `/categories/:id` - Delete a category by ID

### Carts
- **POST** `/carts` - Create a new cart
- **GET** `/carts` - Get all carts
- **GET** `/carts/:email` - Get cart by email
- **PUT** `/carts/:id` - Update a cart by ID
- **DELETE** `/carts/:id` - Delete a cart by ID
- **PUT** `/carts/:cartID/status` - Update cart status

### Cart Items
- **POST** `/cart-items` - Add a new item to the cart
- **GET** `/cart-items` - Get all cart items
- **GET** `/cart-items/:id` - Get a cart item by ID
- **PUT** `/cart-items/:id` - Update a cart item by ID
- **DELETE** `/cart-items/:id` - Delete a cart item by ID

### Orders
- **POST** `/orders` - Create a new order
- **GET** `/orders` - Get all orders
- **GET** `/orders/:id` - Get an order by ID
- **PUT** `/orders/:id` - Update an order by ID

---