import Link from "next/link";

export default function Account() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e0e0e0] dark:border-[#304a6e] px-6 md:px-10 py-3 sticky top-0 bg-[#f5f5dc]/80 dark:bg-[#0a192f]/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-8">
          <Link
            className="flex items-center gap-4 text-[#0a192f] dark:text-[#f5f5dc]"
            href="/"
          >
            <div className="size-6 text-primary">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_6_330)">
                  <path
                    clipRule="evenodd"
                    d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_330">
                    <rect fill="white" height="48" width="48"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-[#0a192f] dark:text-[#f5f5dc] text-lg font-bold leading-tight tracking-[-0.015em]">
              Lylux Belladonna
            </h2>
          </Link>
          <nav className="hidden md:flex items-center gap-9">
            <Link
              className="text-[#0a192f] dark:text-[#f5f5dc] text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="/products"
            >
              New Arrivals
            </Link>
            <Link
              className="text-[#0a192f] dark:text-[#f5f5dc] text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="/products"
            >
              Collections
            </Link>
            <Link
              className="text-[#0a192f] dark:text-[#f5f5dc] text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="/products"
            >
              Bags
            </Link>
            <Link
              className="text-[#0a192f] dark:text-[#f5f5dc] text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="/products"
            >
              Accessories
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex gap-2">
            <Link
              href="/cart"
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0"
            >
              <span className="material-symbols-outlined text-xl">
                shopping_bag
              </span>
            </Link>
            <Link
              href="/wishlist"
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0"
            >
              <span className="material-symbols-outlined text-xl">
                favorite
              </span>
            </Link>
          </div>
          <button className="flex md:hidden max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCql-Cr2DaLlgEakuhSeTiVbpNp2mHFk-OvFDxUUZhm5vsWnHX2G_Gn83RK9Gniy2aYSoYQI_-KI9mtXYOCv6ic8zokW0W8P5B8JuGNMcl_l_MgIbdFTvEFrT6bKQahnuQdDkxwMmJftvjn2DS5Bpk-C4uwwShqVoBIoxnKVNNIAGujXiz0U6fef1M_OJ-v8lWQpK5P5grSQmwBsskE7Zmx8LBUBBWjo2JTT-3Io0-02tC-MYcENeDxazBebCO1Cz8eTU9LsrVS8sc")`,
            }}
          ></div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 min-h-full flex-col justify-between p-4 hidden lg:flex sticky top-[65px] self-start border-r border-[#e0e0e0] dark:border-[#304a6e]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white dark:bg-[#172a46] text-primary"
                href="/account"
              >
                <span className="material-symbols-outlined text-xl">
                  grid_view
                </span>
                <p className="text-sm font-semibold leading-normal">
                  Dashboard
                </p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-[#172a46]/50 transition-colors"
                href="/account"
              >
                <span className="material-symbols-outlined text-xl">
                  package_2
                </span>
                <p className="text-sm font-medium leading-normal">
                  Order History
                </p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-[#172a46]/50 transition-colors"
                href="/account"
              >
                <span className="material-symbols-outlined text-xl">
                  person
                </span>
                <p className="text-sm font-medium leading-normal">My Details</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-[#172a46]/50 transition-colors"
                href="/account"
              >
                <span className="material-symbols-outlined text-xl">
                  location_on
                </span>
                <p className="text-sm font-medium leading-normal">
                  Saved Addresses
                </p>
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <Link
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-[#172a46]/50 transition-colors"
              href="/"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <p className="text-sm font-medium leading-normal">Logout</p>
            </Link>
          </div>
        </aside>
        <main className="flex-1 p-4 sm:p-6 lg:p-10 bg-[#f5f5dc] dark:bg-[#0a192f]">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-between gap-3 p-4 mb-6">
              <h1 className="text-[#0a192f] dark:text-[#f5f5dc] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                Welcome back, Isabella
              </h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <h2 className="text-[#0a192f] dark:text-[#f5f5dc] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4">
                  Recent Orders
                </h2>
                <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                  <div className="flex flex-col sm:flex-row items-stretch justify-between gap-6">
                    <div
                      className="w-full sm:w-32 md:w-40 bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-none"
                      style={{
                        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAa8YoS0EVfPCkmeeYVmmdGv0N8jiQicr1h3v7WII1w1MCtk-BAJIMnFp7KcJxOKuuP4WTItW4-LoxjZSGm-IECDjLOB11cIMzzMEORYbT-7qRf4OLRo5arYu0QVwFhqqNfIGZQ1dT1DQ2-zTLcM4E_05LfYdxUMm0KeOwHHugP8s6yogmeGUL4qxmJ6z57Tku7CrCrv_iOXvvO6znLM7y1bchCkN3A9J3PU55UODUyzm70aW0cLMdI73voX74M2w6ZFZ5Ai1FpQ4A")`,
                      }}
                    ></div>
                    <div className="flex flex-1 flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-primary text-sm font-medium leading-normal">
                          Shipped
                        </p>
                        <p className="text-[#0a192f] dark:text-[#f5f5dc] text-lg font-bold leading-tight">
                          The &apos;Aurelia&apos; Silk Scarf
                        </p>
                        <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-normal leading-normal">
                          Order #LB-843251
                        </p>
                      </div>
                      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#0a192f] text-sm font-bold leading-normal w-fit hover:opacity-90 transition-opacity">
                        <span>Track Shipment</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                  <div className="flex flex-col sm:flex-row items-stretch justify-between gap-6">
                    <div
                      className="w-full sm:w-32 md:w-40 bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-none"
                      style={{
                        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBrzycimZ-aXQ28zYnaplNTU8rpg1c2fT8qmUya_q4UZwjw_BDANmWA3rJPcB4h_lwuBGtnKQeNqvu1-kg_UN6krs4Sn143g8Er5yFvxpf8HG9Qf3NaaVZYg88lR8k9fqscR0MgzI-MDAX3UlXqucvuQ8oTGjX0jFE_LBpaFjZCsNf2zVjDh8txvn2FgSaJByhUnZLmgzcCipW20xli_cGakFv9ktYuu_xWqp3dsCQf8zmokdJz35hSyc3qKI1EW1CpENKSE1FVPyk")`,
                      }}
                    ></div>
                    <div className="flex flex-1 flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-normal leading-normal">
                          Processing
                        </p>
                        <p className="text-[#0a192f] dark:text-[#f5f5dc] text-lg font-bold leading-tight">
                          The &apos;Seraphina&apos; Tote
                        </p>
                        <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-normal leading-normal">
                          Order #LB-843250
                        </p>
                      </div>
                      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-primary text-primary text-sm font-bold leading-normal w-fit hover:bg-primary/10 transition-colors">
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1 flex flex-col gap-6">
                <h2 className="text-[#0a192f] dark:text-[#f5f5dc] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4">
                  My Details
                </h2>
                <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm flex-1">
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                        style={{
                          backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB4i0-6nH1k-U3CMaR18NtrArfKH4lzzDbPYKQN9fPihrnpd8-VaGCenuHmBNC_NMhwZtIITsWtyS1gTXd91HyJUXN27MTAFxhaRg1IJMRmu0CShwbDPofabUvLI_YcDY7_EK81bsZwbfLO8NX70cQDFGGQj2MepG0l5AMfUMefoCjrXQf_Ithe8L1rePMJ77d1fSHhhvgTlGJZtWjvuA6pCiGC5gx76gPg35WQTUC3fsxoxR5JUMV6iL3Er1ZrxM3pcS7a_tqWjxo")`,
                        }}
                      ></div>
                      <div className="flex flex-col">
                        <h3 className="text-[#0a192f] dark:text-[#f5f5dc] text-base font-medium leading-normal">
                          Isabella Dubois
                        </h3>
                        <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-normal leading-normal">
                          isabella.d@email.com
                        </p>
                      </div>
                    </div>
                    <button className="flex mt-6 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-primary text-primary text-sm font-bold leading-normal hover:bg-primary/10 transition-colors">
                      <span>Edit Details</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <h2 className="text-[#0a192f] dark:text-[#f5f5dc] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Saved Addresses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">
                      Primary Shipping
                    </p>
                    <p className="text-[#0a192f] dark:text-[#f5f5dc] leading-relaxed">
                      Isabella Dubois
                      <br />
                      123 Luxury Lane
                      <br />
                      Beverly Hills, CA 90210
                      <br />
                      United States
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-sm font-bold text-primary hover:underline">
                      Edit
                    </button>
                    <button className="text-sm font-bold text-[#5c5c5c] dark:text-[#a8b2d1] hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm flex flex-col justify-center items-center border-2 border-dashed border-[#e0e0e0] dark:border-[#304a6e] h-full min-h-[160px]">
                  <button className="flex flex-col items-center gap-2 text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary dark:hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-4xl">
                      add_circle
                    </span>
                    <span className="text-sm font-bold">Add New Address</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <footer className="w-full bg-white dark:bg-[#172a46] border-t border-[#e0e0e0] dark:border-[#304a6e] py-12 px-6 md:px-10 sticky bottom-0 z-40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link
              className="flex items-center gap-4 text-[#0a192f] dark:text-[#f5f5dc] mb-4"
              href="/"
            >
              <div className="size-8 text-primary">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_6_330)">
                    <path
                      clipRule="evenodd"
                      d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_6_330">
                      <rect fill="white" height="48" width="48"></rect>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h2 className="text-[#0a192f] dark:text-[#f5f5dc] text-xl font-bold leading-tight tracking-[-0.015em]">
                Lylux Belladonna
              </h2>
            </Link>
            <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm">
              Exquisite fashion for the discerning individual.
            </p>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-[#0a192f] dark:text-[#f5f5dc] mb-4">
                Shop
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                    href="/products"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                    href="/products"
                  >
                    Collections
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                    href="/products"
                  >
                    Bags
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                    href="/products"
                  >
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#0a192f] dark:text-[#f5f5dc] mb-4">
                About
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                    href="/about"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                    href="/about"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                    href="/about"
                  >
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#0a192f] dark:text-[#f5f5dc] mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                    href="/contact"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                    href="/contact"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                    href="/contact"
                  >
                    Shipping &amp; Returns
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#0a192f] dark:text-[#f5f5dc] mb-4">
                Follow Us
              </h3>
              <div className="flex items-center gap-4">
                <a
                  className="text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                  href="#"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"></path>
                  </svg>
                </a>
                <a
                  className="text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                  href="#"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.791 4.649-.69.188-1.433.23-2.184.084.616 1.92 2.344 3.328 4.411 3.365-1.799 1.407-4.069 2.245-6.516 2.245-.425 0-.845-.024-1.258-.074 2.323 1.496 5.078 2.372 8.046 2.372 8.498 0 13.498-7.355 13.298-13.826 1.017-.723 1.898-1.632 2.6-2.705z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#e0e0e0] dark:border-[#304a6e] text-center text-sm text-[#5c5c5c] dark:text-[#a8b2d1]">
          <p>© 2024 Lylux Belladonna. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
