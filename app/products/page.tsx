import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <Header />
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[1280px] flex-1">
            <main className="flex flex-col gap-6 px-4 py-8">
              {/* Breadcrumbs */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  <Link
                    className="text-gold/80 text-sm font-medium leading-normal hover:text-gold"
                    href="/"
                  >
                    Home
                  </Link>
                  <span className="text-gold/50 text-sm font-medium leading-normal">
                    /
                  </span>
                  <Link
                    className="text-gold/80 text-sm font-medium leading-normal hover:text-gold"
                    href="/products"
                  >
                    Collections
                  </Link>
                  <span className="text-gold/50 text-sm font-medium leading-normal">
                    /
                  </span>
                  <span className="text-cream text-sm font-medium leading-normal">
                    Handbags
                  </span>
                </div>
                <div className="flex min-w-72 flex-col gap-2">
                  <p className="text-cream text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">
                    Belladonna Collections
                  </p>
                  <p className="text-cream/70 text-base font-normal leading-normal">
                    Discover the latest in high-end fashion, curated just for
                    you.
                  </p>
                </div>
              </div>

              {/* Filter and Sort Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-solid border-gold/20">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 cursor-pointer rounded-lg h-10 px-4 text-cream bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold">
                    <span className="material-symbols-outlined text-base">
                      filter_list
                    </span>
                    <span>Filter</span>
                  </button>
                  <div className="hidden sm:flex gap-1 p-1 rounded-lg bg-white/5">
                    <button className="p-1.5 rounded-md text-cream bg-white/10">
                      <span className="material-symbols-outlined text-xl">
                        grid_view
                      </span>
                    </button>
                    <button className="p-1.5 rounded-md text-cream/70 hover:text-cream">
                      <span className="material-symbols-outlined text-xl">
                        view_agenda
                      </span>
                    </button>
                  </div>
                </div>
                <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gold text-navy gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:opacity-90 transition-opacity">
                  <span>Sort by: Newest</span>
                  <span className="material-symbols-outlined text-base">
                    expand_more
                  </span>
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                <Link
                  href="/products/1"
                  className="group relative bg-cover bg-center flex flex-col rounded-lg justify-end aspect-[3/4] overflow-hidden cursor-pointer"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCcLyZhbnokCKC0PFLnEy3imdZrPOwwsNIMC67_bmfEq150SojnNwKjj8U_PIcZoU5IIxJu3PFwqcx-u9RUCA1csQeHrtwmQ5P5jwwd747GeisDnu9dnnTOVQtt1yNGAaE9UWLDVC5KESnkO07pJslm81yEWXC6aJ9OJyk3_1WTkwBpsYxcMj73WIyUyLjGzxvXRNZHQgJdKY6DHaFYqRbYyMNNzeQ9WkkuaGwKyA_TiMDElS0nIW-JOKRdKrkyu8p-bAP_5bPtMEs")',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="relative p-4 flex flex-col gap-1.5 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    <p className="text-cream text-base font-bold leading-tight">
                      The Belladonna Tote
                    </p>
                    <p className="text-gold text-sm font-medium">$2,450</p>
                  </div>
                </Link>
                <Link
                  href="/products/2"
                  className="group relative bg-cover bg-center flex flex-col rounded-lg justify-end aspect-[3/4] overflow-hidden cursor-pointer"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA7gK6e-7x0imOE7YnxUS24Ca9mWAPcm6A4sWs_d4uJEv2lLPDK8fFJyMWFkMuAEGzL8k7sITagRwvGchA4_h_p5FNx3ZQmIj3Ib5Aa3jeR0EAuENRNRtprgCqRPdIN4mKXjeoKh9Y87AXE4-65PuP0O1QSNR9jW6RtKYmNHNK_MKxK7Fu1PlGktMYMFolwJ-QqiT-bA4qHT7YSeP0oe_0WBOXOLofFCZyHgVRzlaJxLj_vlkFAHoTecDAIN-agjSOYH0uDAoCPzRY")',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="relative p-4 flex flex-col gap-1.5 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    <p className="text-cream text-base font-bold leading-tight">
                      Midnight Bloom Clutch
                    </p>
                    <p className="text-gold text-sm font-medium">$1,800</p>
                  </div>
                </Link>
                <Link
                  href="/products/3"
                  className="group relative bg-cover bg-center flex flex-col rounded-lg justify-end aspect-[3/4] overflow-hidden cursor-pointer"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDktbxzP-UpurjHIF_g2mNqvoiANYIQNZ2CQzGzo4Xb0Y7YTiio687EyaOt_c60Z9SE62JvKfz7UU5rNRv2IUW7TfYz-2TPBV6dIlgx1ecD-0qmpVpfsvgBHCYYOkzm-mbIxCYP7ywyrMFfrlZq20b0iO_oOGbT0ItOVtdrxcpdAjKh0_uO37sqeBkwUKotv1EymfH5L6iZwXLBhhHzRDqxqNr3hFUbKY5hhTEWUQ5Nlc2Y-nzvWQxHEvbWgb4sWELvcyYIolIszO4")',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="relative p-4 flex flex-col gap-1.5 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    <p className="text-cream text-base font-bold leading-tight">
                      Golden Hour Satchel
                    </p>
                    <p className="text-gold text-sm font-medium">$2,100</p>
                  </div>
                </Link>
                <Link
                  href="/products/4"
                  className="group relative bg-cover bg-center flex flex-col rounded-lg justify-end aspect-[3/4] overflow-hidden cursor-pointer"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCcvh9s8vSimqgRXPMi6iLVzqbEPkMsWXFPduwMQBVUmaN9eRrObpoMmSTQRyy3BOcqzU9BzwsPzjLcokJqUUo-KSIGvmvkFJM31yqRsmJxRZrCy6Sywl9o__RBnsNPeiaqoR0yPKl77FhG5CkhiEbrMBc_sHnPRA655TCL4i4u_c6QQi44wYLw3w9Ie07-yp9OTqKhKBM3cW44ItGrDcPcoVkc5cvMuEF4Q5dtNLTiwzWUCbOyy303FeQrxrhPdtElJxc7potqQR0")',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="relative p-4 flex flex-col gap-1.5 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    <p className="text-cream text-base font-bold leading-tight">
                      The Lumina Crossbody
                    </p>
                    <p className="text-gold text-sm font-medium">$1,650</p>
                  </div>
                </Link>
                <Link
                  href="/products/5"
                  className="group relative bg-cover bg-center flex flex-col rounded-lg justify-end aspect-[3/4] overflow-hidden cursor-pointer"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCyyeH_5HsOTGAP0Pql_CvDIL8siOR8O9xvl_Fa9Xgv4MLfZuhRqAQaZnV_KauqLoUNyNWnkWzLA9IYmGtehTJ3PNpL5YFwdUVDDKUFBNZZNifcpIMx7lHSSYp2UmA61MxzXsW97_yPJWJ3g70oT7Lis3zHnls9xaprmaWuv6IhuAIyeTdN9thl-_r9V0TOcSLAghRYX5gJRhTtOhW7mP8WcdsGZyQe_wqafUt7zI9VM1HCWAa1Cmf__2ETaN9llXoX2vF_yT5EPkc")',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="relative p-4 flex flex-col gap-1.5 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    <p className="text-cream text-base font-bold leading-tight">
                      Eclat Shoulder Bag
                    </p>
                    <p className="text-gold text-sm font-medium">$1,950</p>
                  </div>
                </Link>
                <Link
                  href="/products/6"
                  className="group relative bg-cover bg-center flex flex-col rounded-lg justify-end aspect-[3/4] overflow-hidden cursor-pointer"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC2Oi44q8mZsJtFRUatMivdYaze9zAo5CDojWOOTAlD2i6XEMwb_20U9Doa3QvGIJ-KW2Nm9AxS-eENO4Zx6gXu4CFtojJWrpCpgNCXjL1fCeWhqWH44d4ap5pPuPqNfWu13lkVpCRWwENk21AFqrFGB5u4w7JqcjCAteIstV8GoYhgbL-IrSeMepn2Oqyg4-zUGMnIbO0hDshOxdCe1MxpGacThE3Wg3IuCFrH6c2dGhfPNCPa5Jcy2czLl8QD5l7HhZFGZBxoX3U")',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="relative p-4 flex flex-col gap-1.5 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    <p className="text-cream text-base font-bold leading-tight">
                      The Seraphina Wallet
                    </p>
                    <p className="text-gold text-sm font-medium">$850</p>
                  </div>
                </Link>
                <Link
                  href="/products/7"
                  className="group relative bg-cover bg-center flex flex-col rounded-lg justify-end aspect-[3/4] overflow-hidden cursor-pointer"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBcLTEENXVGqOVVsH_CqOBgT5VfL9OBy7CfE3ARzLFyNNh9i4p_ZIQxaiY9uYM-nqKqTUBceKaAGOusMqhGAh858iI07bfYgjtT2mmFygzh0HZPmLPOW1CDIkGJ7grN9wi6aqFQ4GUiacbG4FYIpz8JrBpqUj80a7_aNRVaNlVrTJEifaVp2UrTPVXiObJCHIoKN6SNtrzQtvgtxrU5emi4ykjNROGVwokxiPUOV96x7drpyeVcQfzaCaBigNdGUTCLEYhcZToyNTc")',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="relative p-4 flex flex-col gap-1.5 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    <p className="text-cream text-base font-bold leading-tight">
                      Orion Evening Bag
                    </p>
                    <p className="text-gold text-sm font-medium">$2,200</p>
                  </div>
                </Link>
                <Link
                  href="/products/8"
                  className="group relative bg-cover bg-center flex flex-col rounded-lg justify-end aspect-[3/4] overflow-hidden cursor-pointer"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBYEpFaHl_womT56mELHbiapWBrXAlzBh7J8sQJ1Y2Ze85aC7WKpU1so1_PvTZGSk4Sa_ODK3tZPoPQHCfXdSn7A3fc2OwZkdzQ8hFwW4sJa0ZyFU_2mHqZQ-9-TUQA6lHxi2o-9Yy-zuF3nmU05-7C87XJon08vxwFZPTitV-3rmT4lAThHP1QZmUU-dLdH0LijrKzENs_KDddCFgrxleKX1K9yWK43xYA4Kdi6AniEm-YT4KYbjAmMARMh_VtZaAlxBy2E7QFAKM")',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="relative p-4 flex flex-col gap-1.5 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    <p className="text-cream text-base font-bold leading-tight">
                      The Azure Handbag
                    </p>
                    <p className="text-gold text-sm font-medium">$1,750</p>
                  </div>
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
