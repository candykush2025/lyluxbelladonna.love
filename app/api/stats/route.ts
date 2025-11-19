import { NextResponse } from "next/server";

// Mock dashboard statistics
export async function GET() {
  const stats = {
    revenue: {
      total: 48574,
      change: 12.5,
      trend: "up",
    },
    orders: {
      total: 142,
      change: 8.2,
      trend: "up",
    },
    customers: {
      total: 1248,
      change: 15.3,
      trend: "up",
    },
    products: {
      total: 87,
      active: 82,
      outOfStock: 5,
    },
    recentActivity: [
      {
        type: "order",
        message: "New order #1006 from Emma Wilson",
        time: "2 minutes ago",
      },
      {
        type: "customer",
        message: "New customer registration: Sophia Chen",
        time: "15 minutes ago",
      },
      {
        type: "product",
        message: "Golden Stride Heels is running low on stock (3 left)",
        time: "1 hour ago",
      },
    ],
  };

  return NextResponse.json(stats);
}
