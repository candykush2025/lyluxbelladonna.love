import { NextResponse } from "next/server";

// Mock database - In production, this would connect to a real database
let customers = [
  {
    id: 1,
    name: "Isabella Dubois",
    email: "isabella@example.com",
    orders: 5,
    spent: 3420,
    joined: "Jan 2025",
    status: "Active",
    phone: "+33 1 23 45 67 89",
    address: "123 Fashion Ave, Paris, France",
  },
  {
    id: 2,
    name: "Sophie Laurent",
    email: "sophie@example.com",
    orders: 3,
    spent: 2150,
    joined: "Feb 2025",
    status: "Active",
    phone: "+33 4 12 34 56 78",
    address: "456 Style St, Lyon, France",
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma@example.com",
    orders: 7,
    spent: 5890,
    joined: "Dec 2024",
    status: "VIP",
    phone: "+44 20 1234 5678",
    address: "789 Luxury Ln, London, UK",
  },
  {
    id: 4,
    name: "Olivia Chen",
    email: "olivia@example.com",
    orders: 2,
    spent: 1240,
    joined: "Mar 2025",
    status: "Active",
    phone: "+65 6123 4567",
    address: "321 Elegance Rd, Singapore",
  },
  {
    id: 5,
    name: "Aria Martinez",
    email: "aria@example.com",
    orders: 12,
    spent: 9670,
    joined: "Oct 2024",
    status: "VIP",
    phone: "+34 91 123 45 67",
    address: "654 Couture Blvd, Madrid, Spain",
  },
];

// GET all customers
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  if (status && status !== "All Customers") {
    const filtered = customers.filter((c) => c.status === status);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(customers);
}

// PUT update customer
export async function PUT(request: Request) {
  const body = await request.json();
  const index = customers.findIndex((c) => c.id === body.id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...body };
    return NextResponse.json(customers[index]);
  }
  return NextResponse.json({ error: "Customer not found" }, { status: 404 });
}

// POST create new customer
export async function POST(request: Request) {
  const body = await request.json();
  const newCustomer = {
    id: customers.length + 1,
    orders: 0,
    spent: 0,
    joined: new Date().toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    status: "Active",
    ...body,
  };
  customers.push(newCustomer);
  return NextResponse.json(newCustomer, { status: 201 });
}

// DELETE customer
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id") || "0");
  customers = customers.filter((c) => c.id !== id);
  return NextResponse.json({ message: "Customer deleted" });
}
