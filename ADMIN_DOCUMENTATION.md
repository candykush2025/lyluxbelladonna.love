# Admin Dashboard Documentation

## Overview

The Lylux Belladonna Admin Dashboard provides a comprehensive interface for managing your e-commerce store's content, products, orders, and customers.

## Access

Navigate to `/admin` to access the admin dashboard. The admin icon is also available in the main site header.

## Features

### 1. Dashboard Overview

The main dashboard provides:

- **Revenue Statistics**: Total revenue with percentage change from last month
- **Order Metrics**: Total number of orders and growth trends
- **Customer Analytics**: Total customers and VIP status tracking
- **Product Inventory**: Active product count and stock status
- **Recent Orders Table**: Quick view of latest transactions

### 2. Products Management

#### View Products

- Displays all products with details: name, price, category, stock, and status
- Visual indicators for stock levels
- Active/Out of Stock status badges

#### Add New Product

Click "Add Product" button to open the product creation modal:

- **Product Name**: Enter the product name
- **Price**: Set the product price
- **Stock**: Define inventory quantity
- **Category**: Select from: Clothing, Accessories, Shoes, Jewelry
- **Description**: Add detailed product description
- **Image**: Upload product image

#### Edit Product

- Click the edit icon (pencil) next to any product
- Update product details inline
- Changes are saved automatically

#### Delete Product

- Click the delete icon (trash) next to any product
- Confirm deletion to remove from inventory

### 3. Orders Management

#### View Orders

- Complete list of all orders with:
  - Order ID
  - Customer name
  - Product ordered
  - Order amount
  - Order date
  - Current status

#### Filter Orders

- **Status Filter**: Filter by Pending, Processing, Shipped, or Completed
- **Search**: Search orders by order ID or customer name

#### Update Order Status

- Click the status dropdown on any order
- Select new status: Pending → Processing → Shipped → Completed
- Status updates in real-time

#### View Order Details

- Click the view icon (eye) to see full order details
- Includes shipping address and customer contact information

### 4. Customers Management

#### View Customers

- Customer database with:
  - Name and email
  - Total orders placed
  - Total amount spent
  - Join date
  - Status (Active/VIP)

#### Filter Customers

- **Status Filter**: Filter by All, VIP, or Active customers
- **Search**: Search by name or email

#### Customer Actions

- **View Details**: Click eye icon to see complete customer profile
- **Send Email**: Click mail icon to compose message to customer

#### Customer Status

- **Active**: Regular customers
- **VIP**: Customers with high order volume or spending (12+ orders or $5000+ spent)

## API Endpoints

### Products API (`/api/products`)

- `GET`: Retrieve all products
- `POST`: Create new product
- `PUT`: Update existing product
- `DELETE`: Remove product (requires `?id=<productId>`)

### Orders API (`/api/orders`)

- `GET`: Retrieve all orders (optional `?status=<status>` filter)
- `POST`: Create new order
- `PUT`: Update order status

### Customers API (`/api/customers`)

- `GET`: Retrieve all customers (optional `?status=<status>` filter)
- `POST`: Create new customer
- `PUT`: Update customer information
- `DELETE`: Remove customer (requires `?id=<customerId>`)

### Stats API (`/api/stats`)

- `GET`: Retrieve dashboard statistics and recent activity

## Data Structure

### Product Object

```typescript
{
  id: number;
  name: string;
  price: number;
  category: "Clothing" | "Accessories" | "Shoes" | "Jewelry";
  stock: number;
  status: "Active" | "Out of Stock";
  description: string;
  image: string;
}
```

### Order Object

```typescript
{
  id: string; // Format: "#1001"
  customer: string;
  customerEmail: string;
  product: string;
  productId: number;
  amount: number;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Completed";
  shippingAddress: string;
}
```

### Customer Object

```typescript
{
  id: number;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  status: "Active" | "VIP";
  phone: string;
  address: string;
}
```

## Best Practices

### Inventory Management

1. Regularly update stock levels to prevent overselling
2. Set products to "Out of Stock" when inventory reaches zero
3. Monitor low-stock alerts in the dashboard

### Order Processing

1. Update order status promptly as orders progress
2. Typical flow: Pending → Processing → Shipped → Completed
3. Communicate with customers at each status change

### Customer Relationships

1. Monitor VIP customers for special promotions
2. Track customer lifetime value through the spent metric
3. Use email feature to maintain customer engagement

## Future Enhancements

The following features are planned for future releases:

- Bulk product import/export
- Advanced analytics and reporting
- Email templates and automation
- Inventory alerts and notifications
- Customer segmentation tools
- Discount and promotion management
- Multi-admin user roles and permissions

## Technical Notes

### Development

- Built with Next.js 14+ App Router
- Uses React Server Components and Client Components
- Styled with Tailwind CSS v4
- Mock data stored in-memory (replace with database in production)

### Production Deployment

Before deploying to production:

1. Replace mock data with database connection (PostgreSQL, MongoDB, etc.)
2. Implement authentication and authorization
3. Add input validation and error handling
4. Set up proper API rate limiting
5. Configure image upload to cloud storage (AWS S3, Cloudinary, etc.)
6. Add audit logging for admin actions
7. Implement backup and recovery procedures

## Support

For technical support or feature requests, contact the development team.
