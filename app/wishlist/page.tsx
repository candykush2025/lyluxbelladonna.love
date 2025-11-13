import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function WishlistPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 px-4 md:px-10 lg:px-20 xl:px-40 py-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-5xl font-black font-serif mb-12">
            My Wishlist
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="group relative">
              <Link
                href="/products/1"
                className="block aspect-[3/4] bg-cover bg-center rounded-lg mb-4 hover:opacity-80 transition-opacity"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDozRqj7SpbUvACQ_9JKmzf3KIFTnqV8ZhO0G4ddHJQ9FihincE6031-B_tDUXZDiOjaX1AL9RFp2fMwr8ABZWAfXTsWzdB7ANv0a1qLfRHcPdKd68FBNlqzv5cj2jblAh81N6499-fEj0ikpTK44SgSnRZR9KArZCgfcQn4idkgrFRcQbPD_52sl59LvJtpbAaqflx8eg4-pI3y5lVkZIbv-PIo3HIqCyDdKg6A9iE8qMgoi6BFpBlUWD6xjZfmZLbNBhoNso7B8E")',
                }}
              ></Link>
              <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-red-400 hover:bg-white/20">
                <span className="material-symbols-outlined text-xl">
                  favorite
                </span>
              </button>
              <Link href="/products/1">
                <h3 className="text-white font-semibold hover:text-primary transition-colors">
                  The Midnight Gown
                </h3>
              </Link>
              <p className="text-primary text-sm">$1,250</p>
              <button className="mt-2 w-full bg-primary text-background-dark font-bold py-2 px-4 rounded-lg text-sm hover:bg-opacity-90">
                Add to Cart
              </button>
            </div>

            <div className="group relative">
              <Link
                href="/products/2"
                className="block aspect-[3/4] bg-cover bg-center rounded-lg mb-4 hover:opacity-80 transition-opacity"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC3LUsfezkJ2nN9gnJqmjh61GWm5J9bd3gQVbvwMK7ZbgiG6j2N7Yyka1iO6u4wijMcfVgD0vCypDw8r1KFYieILrl38hdM8QUg9JZzTNOiytwCeFMLBaWS8JZGIppAlASqQ0KIZpiSknfX8xprqz9V2NSohUIpRvVkR1vSxafa8bF_XTGlGTYISe9zhqLR-1fA9l4fr6gzuXqOROb-k34i2nvvpRpv3nEHvrx-pfcfyGIOXINIxp6TcXZxwgxhYKDlGJqTjWPMxSc")',
                }}
              ></Link>
              <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-red-400 hover:bg-white/20">
                <span className="material-symbols-outlined text-xl">
                  favorite
                </span>
              </button>
              <Link href="/products/2">
                <h3 className="text-white font-semibold hover:text-primary transition-colors">
                  Aurelia Handbag
                </h3>
              </Link>
              <p className="text-primary text-sm">$890</p>
              <button className="mt-2 w-full bg-primary text-background-dark font-bold py-2 px-4 rounded-lg text-sm hover:bg-opacity-90">
                Add to Cart
              </button>
            </div>

            <div className="group relative">
              <Link
                href="/products/3"
                className="block aspect-[3/4] bg-cover bg-center rounded-lg mb-4 hover:opacity-80 transition-opacity"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBFdrE1RAGM0z-laWelAZ_nfPnceceFz_LfsjUYOlxGsVunwhvCEwa-46DMU_q6f91kVG5gxlCkPRomRjYZMEGd70M36IXaBNKaix8J-ipmXSTyD1YiaR0IE71eCVfzG-yH6NkX--hU4WKDzymB8Xb6ObOQxm1amUSL6LUMdGFLf1n84hXbMpujZvtGLgOSd85nwLL8-80rdxekB3I9_EymNJKAyTKzb3ub5NNwmpvvV-iatpDaoV_dHaLaxHVD_OGCIRl4H8eyndA")',
                }}
              ></Link>
              <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-red-400 hover:bg-white/20">
                <span className="material-symbols-outlined text-xl">
                  favorite
                </span>
              </button>
              <Link href="/products/3">
                <h3 className="text-white font-semibold hover:text-primary transition-colors">
                  Golden Stride Heels
                </h3>
              </Link>
              <p className="text-primary text-sm">$760</p>
              <button className="mt-2 w-full bg-primary text-background-dark font-bold py-2 px-4 rounded-lg text-sm hover:bg-opacity-90">
                Add to Cart
              </button>
            </div>

            <div className="group relative">
              <Link
                href="/products/4"
                className="block aspect-[3/4] bg-cover bg-center rounded-lg mb-4 hover:opacity-80 transition-opacity"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqUf9KJwIXeipgToOALyARwRcA1rHgQepPT1X-4pu38Mr58Uqq7O5puxLXgPWggYojhwORXguva1jvHRuEASqpmUZcVUF8Y4_wSpXu3kEhGLNOMiEUBk1Wf8kloeNGQz2byGIjfGqm1QfCk16aw5V5b6Husiv5RswhNYqsb5YhktfX6baw3LvxntqijEw3Y7r6cq3YiCCfMewkDpzMIcXUxZqbRbWGDIjVw9Hxdbg6IPjT-Mt076BVO0fvrkvg64I9cPqdkau5Evk")',
                }}
              ></Link>
              <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-red-400 hover:bg-white/20">
                <span className="material-symbols-outlined text-xl">
                  favorite
                </span>
              </button>
              <Link href="/products/4">
                <h3 className="text-white font-semibold hover:text-primary transition-colors">
                  Ethereal Silk Scarf
                </h3>
              </Link>
              <p className="text-primary text-sm">$420</p>
              <button className="mt-2 w-full bg-primary text-background-dark font-bold py-2 px-4 rounded-lg text-sm hover:bg-opacity-90">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
