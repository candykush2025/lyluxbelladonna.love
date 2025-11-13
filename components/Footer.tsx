import Link from "next/link";

export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-40 mt-auto bg-background-dark/80 backdrop-blur-sm border-t border-white/10">
      <div className="mx-auto max-w-[1280px] px-4 md:px-10 lg:px-20 xl:px-40 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link className="flex items-center gap-3 text-white" href="/">
              <svg
                className="h-8 w-auto text-primary"
                fill="none"
                viewBox="0 0 34 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.9998 0.504883L33.4947 16L16.9998 31.4951L0.504883 16L16.9998 0.504883Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                ></path>
                <path
                  d="M17 31.4951V0.504883L8.75244 16L17 31.4951Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span className="text-white text-2xl font-serif font-bold tracking-wide">
                Belladonna
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Defining modern luxury with timeless elegance and unparalleled
              craftsmanship.
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="font-semibold text-gray-200">Company</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  className="text-gray-400 hover:text-primary"
                  href="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-primary"
                  href="/contact"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-primary"
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-primary" href="#">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-semibold text-gray-200">Customer Service</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link className="text-gray-400 hover:text-primary" href="#">
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-primary" href="#">
                  Sizing Guide
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-primary" href="#">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-gray-200">Follow Us</h4>
            <div className="flex mt-4 space-x-4">
              <a className="text-gray-400 hover:text-primary" href="#">
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a className="text-gray-400 hover:text-primary" href="#">
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a className="text-gray-400 hover:text-primary" href="#">
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.803 2.013 10.148 2 12.315 2zm-1.163 1.943v.001c-1.049.048-1.696.21-2.228.42a3.001 3.001 0 00-1.107.728A3.001 3.001 0 006.09 6.22c-.21.532-.372 1.179-.42 2.228-.048 1.025-.06 1.372-.06 3.556s.012 2.53.06 3.556c.048 1.049.21 1.696.42 2.228a3.001 3.001 0 00.728 1.107 3.001 3.001 0 001.107.728c.532.21 1.179.372 2.228.42 1.025.048 1.372.06 3.556.06s2.53-.012 3.556-.06c1.049-.048 1.696.21 2.228-.42a3.001 3.001 0 001.107-.728 3.001 3.001 0 00.728-1.107c.21-.532.372-1.179.42-2.228.048-1.025.06-1.372.06-3.556s-.012-2.53-.06-3.556c-.048-1.049-.21-1.696-.42-2.228a3.001 3.001 0 00-.728-1.107 3.001 3.001 0 00-1.107-.728c-.532-.21-1.179-.372-2.228-.42-1.025-.048-1.372-.06-3.556-.06s-2.53.012-3.556.06zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM12 14a2 2 0 110-4 2 2 0 010 4zm6.406-7.125a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-xs text-gray-500">
          <p>© 2024 Lylux Belladonna. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
