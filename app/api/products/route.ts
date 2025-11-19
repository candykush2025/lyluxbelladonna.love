import { NextResponse } from "next/server";

// Mock database - In production, this would connect to a real database
let products = [
  {
    id: 1,
    name: "The Midnight Gown",
    price: 1250,
    category: "Clothing",
    stock: 12,
    status: "Active",
    description: "Elegant floor-length silk gown perfect for evening occasions",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDozRqj7SpbUvACQ_9JKmzf3KIFTnqV8ZhO0G4ddHJQ9FihincE6031-B_tDUXZDiOjaX1AL9RFp2fMwr8ABZWAfXTsWzdB7ANv0a1qLfRHcPdKd68FBNlqzv5cj2jblAh81N6499-fEj0ikpTK44SgSnRZR9KArZCgfcQn4idkgrFRcQbPD_52sl59LvJtpbAaqflx8eg4-pI3y5lVkZIbv-PIo3HIqCyDdKg6A9iE8qMgoi6BFpBlUWD6xjZfmZLbNBhoNso7B8E",
  },
  {
    id: 2,
    name: "Aurelia Handbag",
    price: 890,
    category: "Accessories",
    stock: 8,
    status: "Active",
    description: "Structured black leather handbag with gold hardware",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3LUsfezkJ2nN9gnJqmjh61GWm5J9bd3gQVbvwMK7ZbgiG6j2N7Yyka1iO6u4wijMcfVgD0vCypDw8r1KFYieILrl38hdM8QUg9JZzTNOiytwCeFMLBaWS8JZGIppAlASqQ0KIZpiSknfX8xprqz9V2NSohUIpRvVkR1vSxafa8bF_XTGlGTYISe9zhqLR-1fA9l4fr6gzuXqOROb-k34i2nvvpRpv3nEHvrx-pfcfyGIOXINIxp6TcXZxwgxhYKDlGJqTjWPMxSc",
  },
  {
    id: 3,
    name: "Golden Stride Heels",
    price: 760,
    category: "Shoes",
    stock: 15,
    status: "Active",
    description: "Elegant gold high-heels with stiletto heel",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFdrE1RAGM0z-laWelAZ_nfPnceceFz_LfsjUYOlxGsVunwhvCEwa-46DMU_q6f91kVG5gxlCkPRomRjYZMEGd70M36IXaBNKaix8J-ipmXSTyD1YiaR0IE71eCVfzG-yH6NkX--hU4WKDzymB8Xb6ObOQxm1amUSL6LUMdGFLf1n84hXbMpujZvtGLgOSd85nwLL8-80rdxekB3I9_EymNJKAyTKzb3ub5NNwmpvvV-iatpDaoV_dHaLaxHVD_OGCIRl4H8eyndA",
  },
  {
    id: 4,
    name: "Ethereal Silk Scarf",
    price: 420,
    category: "Accessories",
    stock: 0,
    status: "Out of Stock",
    description: "Luxurious silk scarf with abstract gold and black pattern",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqUf9KJwIXeipgToOALyARwRcA1rHgQepPT1X-4pu38Mr58Uqq7O5puxLXgPWggYojhwORXguva1jvHRuEASqpmUZcVUF8Y4_wSpXu3kEhGLNOMiEUBk1Wf8kloeNGQz2byGIjfGqm1QfCk16aw5V5b6Husiv5RswhNYqsb5YhktfX6baw3LvxntqijEw3Y7r6cq3YiCCfMewkDpzMIcXUxZqbRbWGDIjVw9Hxdbg6IPjT-Mt076BVO0fvrkvg64I9cPqdkau5Evk",
  },
];

// GET all products
export async function GET() {
  return NextResponse.json(products);
}

// POST new product
export async function POST(request: Request) {
  const body = await request.json();
  const newProduct = {
    id: products.length + 1,
    ...body,
    status: body.stock > 0 ? "Active" : "Out of Stock",
  };
  products.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}

// PUT update product
export async function PUT(request: Request) {
  const body = await request.json();
  const index = products.findIndex((p) => p.id === body.id);
  if (index !== -1) {
    products[index] = { ...products[index], ...body };
    return NextResponse.json(products[index]);
  }
  return NextResponse.json({ error: "Product not found" }, { status: 404 });
}

// DELETE product
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id") || "0");
  products = products.filter((p) => p.id !== id);
  return NextResponse.json({ message: "Product deleted" });
}
