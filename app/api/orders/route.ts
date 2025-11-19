import { NextResponse } from "next/server";

// Mock database - In production, this would connect to a real database
let orders = [
  {
    id: "#1001",
    customer: "Isabella Dubois",
    customerEmail: "isabella@example.com",
    product: "The Midnight Gown",
    productId: 1,
    amount: 1250,
    date: "Nov 14, 2025",
    status: "Completed",
    shippingAddress: "123 Fashion Ave, Paris, France",
  },
  {
    id: "#1002",
    customer: "Sophie Laurent",
    customerEmail: "sophie@example.com",
    product: "Aurelia Handbag",
    productId: 2,
    amount: 890,
    date: "Nov 13, 2025",
    status: "Processing",
    shippingAddress: "456 Style St, Lyon, France",
  },
  {
    id: "#1003",
    customer: "Emma Wilson",
    customerEmail: "emma@example.com",
    product: "Golden Stride Heels",
    productId: 3,
    amount: 760,
    date: "Nov 13, 2025",
    status: "Pending",
    shippingAddress: "789 Luxury Ln, London, UK",
  },
  {
    id: "#1004",
    customer: "Olivia Chen",
    customerEmail: "olivia@example.com",
    product: "Ethereal Silk Scarf",
    productId: 4,
    amount: 420,
    date: "Nov 12, 2025",
    status: "Shipped",
    shippingAddress: "321 Elegance Rd, Singapore",
  },
  {
    id: "#1005",
    customer: "Aria Martinez",
    customerEmail: "aria@example.com",
    product: "The Belladonna Tote",
    productId: 1,
    amount: 2450,
    date: "Nov 12, 2025",
    status: "Completed",
    shippingAddress: "654 Couture Blvd, Madrid, Spain",
  },
];

// GET all orders
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  if (status && status !== "All Status") {
    const filtered = orders.filter((o) => o.status === status);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(orders);
}

// PUT update order status
export async function PUT(request: Request) {
  const body = await request.json();
  const index = orders.findIndex((o) => o.id === body.id);
  if (index !== -1) {
    orders[index] = { ...orders[index], status: body.status };
    return NextResponse.json(orders[index]);
  }
  return NextResponse.json({ error: "Order not found" }, { status: 404 });
}

// POST create new order
export async function POST(request: Request) {
  const body = await request.json();
  const newOrder = {
    id: `#${1000 + orders.length + 1}`,
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    ...body,
  };
  orders.push(newOrder);
  return NextResponse.json(newOrder, { status: 201 });
}
