import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function CartPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 px-4 md:px-10 lg:px-20 xl:px-40 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white text-5xl font-black font-serif mb-12">
            Shopping Cart
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Item */}
              <div className="bg-white/5 rounded-lg p-6 flex gap-6">
                <Link
                  href="/products/1"
                  className="w-32 h-32 bg-cover bg-center rounded-lg hover:opacity-80 transition-opacity"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDozRqj7SpbUvACQ_9JKmzf3KIFTnqV8ZhO0G4ddHJQ9FihincE6031-B_tDUXZDiOjaX1AL9RFp2fMwr8ABZWAfXTsWzdB7ANv0a1qLfRHcPdKd68FBNlqzv5cj2jblAh81N6499-fEj0ikpTK44SgSnRZR9KArZCgfcQn4idkgrFRcQbPD_52sl59LvJtpbAaqflx8eg4-pI3y5lVkZIbv-PIo3HIqCyDdKg6A9iE8qMgoi6BFpBlUWD6xjZfmZLbNBhoNso7B8E")',
                  }}
                ></Link>
                <div className="flex-1">
                  <Link href="/products/1">
                    <h3 className="text-white font-bold text-lg hover:text-primary transition-colors">
                      The Midnight Gown
                    </h3>
                  </Link>
                  <p className="text-gray-400 text-sm mt-1">Size: Medium</p>
                  <p className="text-primary font-semibold mt-2">$1,250</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                        -
                      </button>
                      <span className="text-white w-8 text-center">1</span>
                      <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                        +
                      </button>
                    </div>
                    <button className="text-red-400 hover:text-red-300 text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6 flex gap-6">
                <Link
                  href="/products/2"
                  className="w-32 h-32 bg-cover bg-center rounded-lg hover:opacity-80 transition-opacity"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC3LUsfezkJ2nN9gnJqmjh61GWm5J9bd3gQVbvwMK7ZbgiG6j2N7Yyka1iO6u4wijMcfVgD0vCypDw8r1KFYieILrl38hdM8QUg9JZzTNOiytwCeFMLBaWS8JZGIppAlASqQ0KIZpiSknfX8xprqz9V2NSohUIpRvVkR1vSxafa8bF_XTGlGTYISe9zhqLR-1fA9l4fr6gzuXqOROb-k34i2nvvpRpv3nEHvrx-pfcfyGIOXINIxp6TcXZxwgxhYKDlGJqTjWPMxSc")',
                  }}
                ></Link>
                <div className="flex-1">
                  <Link href="/products/2">
                    <h3 className="text-white font-bold text-lg hover:text-primary transition-colors">
                      Aurelia Handbag
                    </h3>
                  </Link>
                  <p className="text-gray-400 text-sm mt-1">Color: Black</p>
                  <p className="text-primary font-semibold mt-2">$890</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                        -
                      </button>
                      <span className="text-white w-8 text-center">1</span>
                      <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                        +
                      </button>
                    </div>
                    <button className="text-red-400 hover:text-red-300 text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-lg p-6 sticky top-24">
                <h2 className="text-white text-2xl font-bold mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>$2,140</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>$214</span>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">$2,354</span>
                  </div>
                </div>
                <button className="w-full bg-primary text-background-dark font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-opacity mb-4">
                  Proceed to Checkout
                </button>
                <Link
                  href="/products"
                  className="block text-center text-primary hover:text-primary/80 text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
