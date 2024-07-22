# Final-Project

# E-Commerce Project

**Student Name**: Neel Dobariya  
**Student Number**: 8980806  
**Date**: 07-22-2024

### Technology Stack

**Frontend**: ReactJS  
**Backend**: Node.js with Express  
**Database**: MongoDB (Atlas)

### Project Setup

1. **Project Initialization**: Repository created on GitHub and cloned to local machine.
2. **Frontend Setup**: Initialized ReactJS project.
3. **Backend Setup**: Initialized Node.js project with Express and connected to MongoDB (Atlas).

### Database Schema Design

**Products Schema (MongoDB)**

- "id": "ObjectId"
- "name": "String"
- "description": "String"
- "price": "Number"
- "category": "String"
- "stock": "Number"
- "createdAt": "Date"
- "updatedAt": "Date"
  
**Users Schema (MongoDB)**

- "id": "ObjectId"
- "username": "String"
- "email": "String"
- "password": "String"
- "firstName": "String"
- "lastName": "String"
- "createdAt": "Date"
- "updatedAt": "Date"

**Order Schema(MongoDB)**

- id": "ObjectId"
-"userId": "ObjectId"
-"items": "String"
-"totalAmount": "Number"
-"status": "String"
-"createdAt": "Date"
-"updatedAt": "Date"
-"shippingAddress": "String"
-"paymentDetails": "String"

  
### Frontend Setup

1. Basic structure set up for React components, including directories for components and services.
2. State management planned to handle user sessions and cart data.

### Notes

- The project is set up using Git and GitHub for version control.
- Further development will include implementing user interfaces for product listings, shopping cart, and checkout.
