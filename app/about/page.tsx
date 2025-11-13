import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col w-full">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-6 md:px-10 lg:px-20 py-4 w-full sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-50">
              <div className="flex items-center gap-4 text-gray-900 dark:text-white">
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
                <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">
                  Lylux Belladonna
                </h2>
              </div>
              <div className="hidden md:flex flex-1 justify-end gap-8">
                <div className="flex items-center gap-9">
                  <Link
                    className="text-sm font-medium leading-normal text-gray-700 dark:text-gray-300 hover:text-primary"
                    href="/products"
                  >
                    Shop
                  </Link>
                  <Link
                    className="text-sm font-medium leading-normal text-gray-700 dark:text-gray-300 hover:text-primary"
                    href="/products"
                  >
                    Collections
                  </Link>
                  <Link
                    className="text-sm font-medium leading-normal text-primary dark:text-primary"
                    href="/about"
                  >
                    About Us
                  </Link>
                  <Link
                    className="text-sm font-medium leading-normal text-gray-700 dark:text-gray-300 hover:text-primary"
                    href="/contact"
                  >
                    Contact
                  </Link>
                </div>
                <div className="flex gap-2">
                  <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary/20 text-gray-900 dark:text-white dark:bg-primary/10 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                    <span className="material-symbols-outlined text-xl">
                      search
                    </span>
                  </button>
                  <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary/20 text-gray-900 dark:text-white dark:bg-primary/10 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                    <span className="material-symbols-outlined text-xl">
                      person
                    </span>
                  </button>
                  <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary/20 text-gray-900 dark:text-white dark:bg-primary/10 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                    <span className="material-symbols-outlined text-xl">
                      shopping_bag
                    </span>
                  </button>
                </div>
              </div>
            </header>

            <main>
              {/* Hero Section */}
              <section className="w-full">
                <div
                  className="flex min-h-[60vh] md:min-h-[80vh] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-4 text-center"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuADVMoPMGPkSPPBQlDc-0b-vn-8sRYguz8dM24B_jVTB53ZIfyFz9mE6i6I3OztXYixSfnFX_s8C3sVYWAjjhWnOU4q-l7hE7G1uquZD2G9A4JO2VoasCPij52ll3X3jPcDUB9lnTqfbb2zwi-LXXnd1uDbLCprTqyLpkfF1OrShSJP7AZFj5W2T1bSzpCWWSQ95IQmx6FUNK2x-sn__u_NNZjewJZk6b53SuHa8s3b1_BOo1wR6OEQqxmtXPa4t0CZWensKb5V9jw")',
                  }}
                >
                  <div className="flex flex-col gap-4">
                    <h1 className="font-serif text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
                      A Legacy Woven in Style
                    </h1>
                    <h2 className="mx-auto max-w-2xl text-base font-normal leading-normal text-gray-200 md:text-lg">
                      Discover the story behind Lylux Belladonna, where heritage
                      craftsmanship meets modern elegance.
                    </h2>
                  </div>
                </div>
              </section>

              {/* Founder's Vision */}
              <section className="py-16 sm:py-24 px-6 md:px-10 lg:px-20 max-w-5xl mx-auto">
                <div className="text-center">
                  <h2 className="font-serif text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                    The Founder&apos;s Vision
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                    Lylux Belladonna was born from a singular vision: to create
                    pieces that are not just worn, but experienced. Our founder
                    envisioned a world where fashion transcends trends,
                    embodying timeless elegance and empowering the wearer with
                    every stitch and silhouette.
                  </p>
                </div>
              </section>

              {/* Heritage Timeline */}
              <section className="py-16 sm:py-24 px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                    Our Heritage
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                    A journey through time, marked by innovation, dedication,
                    and an unwavering commitment to beauty.
                  </p>
                </div>
                <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="absolute left-1/2 top-0 h-full w-px bg-primary/30 hidden md:block -translate-x-1/2"></div>
                  <div className="absolute left-4 top-0 h-full w-px bg-primary/30 md:hidden"></div>

                  <div className="relative pl-12 md:pl-0 md:col-start-1 text-left md:text-right md:pr-10">
                    <div className="absolute left-4 md:left-auto md:right-[-10px] top-1 h-5 w-5 rounded-full bg-primary ring-4 ring-background-light dark:ring-background-dark"></div>
                    <h3 className="text-primary font-bold text-xl font-serif">
                      1982
                    </h3>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      The Dream Begins
                    </p>
                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                      Our founder opens the first atelier in a small, Parisian
                      studio, laying the foundation for a new era of luxury.
                    </p>
                  </div>

                  <div className="relative pl-12 md:pl-0 md:col-start-2 text-left md:pl-10 md:mt-24">
                    <div className="absolute left-4 md:left-[-10px] top-1 h-5 w-5 rounded-full bg-primary ring-4 ring-background-light dark:ring-background-dark"></div>
                    <h3 className="text-primary font-bold text-xl font-serif">
                      1995
                    </h3>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      Global Recognition
                    </p>
                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                      Lylux Belladonna graces the international stage,
                      celebrated for its innovative designs and impeccable
                      quality.
                    </p>
                  </div>

                  <div className="relative pl-12 md:pl-0 md:col-start-3 text-left md:text-right md:pr-10 md:mt-8">
                    <div className="absolute left-4 md:left-auto md:right-[-10px] top-1 h-5 w-5 rounded-full bg-primary ring-4 ring-background-light dark:ring-background-dark"></div>
                    <h3 className="text-primary font-bold text-xl font-serif">
                      2010
                    </h3>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      A Sustainable Pledge
                    </p>
                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                      We pioneer sustainable practices in luxury fashion,
                      committing to ethical sourcing and environmental
                      stewardship.
                    </p>
                  </div>

                  <div className="relative pl-12 md:pl-0 md:col-start-4 text-left md:pl-10 md:mt-32">
                    <div className="absolute left-4 md:left-[-10px] top-1 h-5 w-5 rounded-full bg-primary ring-4 ring-background-light dark:ring-background-dark"></div>
                    <h3 className="text-primary font-bold text-xl font-serif">
                      Today
                    </h3>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      The Future of Elegance
                    </p>
                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                      Continuing to innovate while honoring our heritage, we
                      redefine what it means to wear art.
                    </p>
                  </div>
                </div>
              </section>

              {/* Gallery */}
              <section className="py-16 sm:py-24">
                <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 md:gap-4 px-2 md:px-4 h-[60vh] md:h-[80vh]">
                  <div className="col-span-1 row-span-1 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      alt="Close up of detailed stitching on a designer handbag"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuY9BhSW9BZp7yE7zzOQgVU6gwK7uuymZAKxf86URyvMmwZWGpZtY3Xm22L7cfPGWKdaRDX0Y2QApWxO8pv0YI8-tRTvqjPzAubtxgIp2naW4qSYD0zMNpvPQdqAicRxQ4BllQxNkxtp390n7sODikxTonF14lxbf9l2w0CQ9qhn6S26M3J1tV88xypjJUWBZLOLZZa2IQ3XjNCplJeFTZq2R4RUJy7RI6dxI7OzLF-F3poakz9bpN_lUwjx_QMEnZ1azM5giTcOc"
                    />
                  </div>
                  <div className="col-span-1 row-span-2 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      alt="A fashion designer sketching new designs in a bright studio"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqDGVrEXXHxrA7WdIL726K_mKO9oH9onKsTlgYXryVHWG3TSeGFZySm0hVvDejtJQF7-8JYOp6fDNsJGHTzHCnSrEKEsIYLBhLw2Zlqtp3fIi1_sc0SSr-skgPZingSnCdJQsK8IdwQQ5jf-Tw1iNZf98prne7Z99TWmO6SpKP9BpDTpR_9XgTfBMED9XEcLrLM-sHV1XuMczzzS06F52aqFBzRgapfAHqvpqFG0f-E39McWGz81AeHwGCG4msHe8JiZ8uRIj3oDM"
                    />
                  </div>
                  <div className="col-span-2 row-span-1 rounded-lg overflow-hidden md:col-span-1">
                    <img
                      className="w-full h-full object-cover"
                      alt="Behind the scenes at a fashion photoshoot with cameras and lights"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuByT6Ebl98pFZuNwwSEosxidg0G-2u91Y0auGJQwNL3CfBr4-9NfToKGEcOGeQVu0Vv5K9f7j6Uer1njorCJHev1REE0dIssPXWq6-aIylOYU_skaFz0LbwJDwpYujeEH02Tu9hKudv1BVUyAOtLp6-G2SJ4QpHLGluQ_8-PHFDq-9rXkjbjdpcEw2MjBOmhI8GUvMJIpxGVuehZFtuV82bFb-S7JzwAx6GchYqj5cXgaUb_vyqRscDmy6ToGI6zYNiLVUVZSf5crU"
                    />
                  </div>
                  <div className="col-span-1 row-span-1 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      alt="A model wearing a luxurious gown on a runway"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL6jLIo_0z61i27H8t9pXASH1NURIC49SZ-qZxU1oV7ql2BQ99X8O_ZIZxYmb1lAXyMVQEPTRabeHwY6sb0V1CFJR9qN39o8y7f3By_20FbiPabJsDx0IW6gIqL77LF61Kz95R0cxCBj-5NS_MUW-ygnSPKZC5zuHm9swLPziW7hPhZbfKdFZ5w1hwdImdNDdvvlFhYO9NOYunxhf3wvAeJsAri0c2fyDI65J-k07e2i4iY24GuKnsoUdgFqNxKCz4qypbEGCxYCM"
                    />
                  </div>
                  <div className="col-span-2 row-span-1 rounded-lg overflow-hidden md:col-span-1">
                    <img
                      className="w-full h-full object-cover"
                      alt="Various colorful fabric swatches laid out on a table"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_6jVcUa1SEL-UhEjFqaucFtQfHdVBsBG0L---PZUl6y_iORp684HqLFT4WCCgQOLP07E2PQr2yjsZG52oBbBaCRfjx9cWOLl6t9m5AMkkQhwPXQmNQrnTQR5idZxk8QnN5iLfGP3MDICC-SaKJyObWburVxyuA6PrhqjfppKr5iicnBF68HNgcR_2IYetaEkeJ0GvutcVzQPLxDuemWUqchNzaNuEJNB6chMis7njI0e_mV0m06excnXMISKaSbe6cHUlWI93gUM"
                    />
                  </div>
                </div>
              </section>

              {/* Quote */}
              <section className="py-16 sm:py-24 px-6 md:px-10 lg:px-20 max-w-5xl mx-auto">
                <div className="text-center">
                  <p className="font-serif text-3xl md:text-4xl text-gray-800 dark:text-gray-200 leading-snug">
                    &quot;Fashion is not something that exists in dresses only.
                    Fashion is in the sky, in the street; fashion has to do with
                    ideas, the way we live, what is happening.&quot;
                  </p>
                  <p className="mt-6 text-lg font-bold text-primary">
                    - Lylux Belladonna, Founder
                  </p>
                </div>
              </section>

              {/* Philosophy */}
              <section className="py-16 sm:py-24 px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                    Our Philosophy
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                    The pillars that define our identity and guide our craft.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary mb-4">
                      <span className="material-symbols-outlined text-4xl">
                        diamond
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Unmatched Craftsmanship
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Every piece is a testament to the skill of our artisans,
                      blending traditional techniques with contemporary design.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary mb-4">
                      <span className="material-symbols-outlined text-4xl">
                        eco
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Conscious Luxury
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      We are committed to sustainability, from ethically sourced
                      materials to mindful production processes.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary mb-4">
                      <span className="material-symbols-outlined text-4xl">
                        auto_awesome
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Timeless Innovation
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      We create designs that transcend seasons, celebrating
                      enduring style and forward-thinking creativity.
                    </p>
                  </div>
                </div>
              </section>

              {/* CTA */}
              <section className="py-16 sm:py-24 px-6 md:px-10 lg:px-20 text-center">
                <div className="flex flex-col gap-6 items-center">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">
                      Explore Our World
                    </h2>
                    <p className="text-base text-gray-700 dark:text-gray-300">
                      Continue the journey and discover the collections that
                      define our legacy.
                    </p>
                  </div>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em]">
                    <span className="truncate">Discover the Collection</span>
                  </button>
                </div>
              </section>
            </main>

            {/* Footer */}
            <footer className="w-full sticky bottom-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-50 text-gray-700 dark:text-gray-300">
              <div className="max-w-7xl mx-auto py-6 px-6 lg:px-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4 text-sm">
                    <Link className="hover:text-primary" href="#">
                      Terms of Service
                    </Link>
                    <Link className="hover:text-primary" href="/privacy">
                      Privacy Policy
                    </Link>
                    <Link className="hover:text-primary" href="/contact">
                      Contact Us
                    </Link>
                  </div>
                  <div className="flex items-center gap-x-4">
                    <a className="hover:text-primary" href="#">
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          clipRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427C2.013 14.784 2 14.43 2 12s.013-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.023.047 1.351.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.467-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.047-1.023.058-1.351.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    </a>
                    <a className="hover:text-primary" href="#">
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6"
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
                    <a className="hover:text-primary" href="#">
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>
                  </div>
                  <div className="text-sm">
                    <p>© 2024 Lylux Belladonna. All Rights Reserved.</p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
