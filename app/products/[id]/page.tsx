import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Link from "next/link";

export default function ProductDetail() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-[#F8F8F8] dark:bg-[#0A192F]">
      <Header />
      <main className="px-4 sm:px-10 lg:px-20 py-10 flex flex-1 justify-center">
        <div className="layout-content-container flex flex-col w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="flex flex-col gap-4">
              <div
                className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-xl"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdLNNpylgcCyUwfE1asfSDJR5aHu18vVz-knDLNOZA2_VhmjCvAaxEWsgCmJxeu-FHpQV762qLYj7oRBSI2LDmFoO7oOjGLuBziAyDc3imvZXU67IZwH2ScZ3S6gmtlC8CEVNzfLSipxd5S6ph7o9PFdSob5eTnmm_Mr51txKYNmcMwKBYK3JiPhT2XM2wsx5cMJbgreUS02Q7-MXk1IXc-ke_wVhcW1nJvHXEylEyr5mDdcREK_OyAOitzWO2i_KCPHa0VW31f6c")`,
                }}
              ></div>
              <div className="grid grid-cols-4 gap-4">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg ring-2 ring-primary"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBzlKggoNLs13FcRfzaH-NOFD_qiVEm5nbCQ0F1dsHuNkOLhuZpiT1OMHa4LPIeWkaYXMCUUgGV2JRerUWcqFido7Ad4xhHySFxYipcTWrHM-GjH--EW4ofrhogBz0w2D0Pch8RRTRQr1WN3Rco3FDlm-ei_YNhAJknYqrkd83zonmY5NyvzoOJwoBgyuNHcUjzYwy6KJRkYDK7DZPyWtJ2qNHZ2tcZagg-3zBKC0Lodx4UeAxJHKcPd5JLLy6yibmPiaSU-FdMA9M")`,
                  }}
                ></div>
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCtToNech_4-alZYRsHU_cg7m4c-37XI-x_Gblx5mJ_A2BBs3GM_mBxCKpnsNAT9RDY4Z4Ww3WAyWW0C5Tx-qRzEXO8bhHoLuSoV5CI8PfHHjcvsIAaNkSVnp0CK-CwyQgrnxhFRIbWe2Dl8C0HYhcFyGyHu2fApFfnR1cJEneeJSOhYxnbjcvzgtbnhAJCNAi68FChmamg4qWsODhOt-1bXVAG5239WN8PAIm_8WwBj_JZwWvzCKbSW7No3bbA5Nauu085-ctrfmc")`,
                  }}
                ></div>
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCi8r8cFFfpjd63CSEKODm1_LKlbHeU4RH9dKQGVsAuiX6vIs7Gpk-B1ZpqjXMf_asyk7QeTPs7PgLDqC6UnFewe1NvVixSGejM6SMS0h0FbOQjqQdAfMMsMN_GURMOJYbOYz28M4WArgwO7iO6zHuphyg58FOK7u-o8z3aqbLiihIC5OYsSsRFdjLVNmJhyQ61MLG4VgjyA8kK6HzipXpCLlO1cus52gDESUY5SxYh8Tn4xeOaT6Gpn3Ao2VyDVnte_TkLnsdWSkg")`,
                  }}
                ></div>
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBqVZbBLadENS73V843TCHlPFxwWOnMIHw6wV4ULR-y1WAucC_RJJ-NleBvDYk-4XiW7jtaABbPm5MOLYDOfoBDfuE_xv17R4LweWriyuuVhG1D8sJFffBbTbe5P07LzzpNWmJ9TuQVpV2V-mKm350ZBHDlAf4taOgS2IsIBQcBmRwNVdaVyyR9gpxaEZRMddOvqgPfI5jidsfLamlkHHPrur4hG5lKy-atgeWmiINDn3aprRPU_wmWNnKL9ImPBlwbnkJJtUBSpLI")`,
                  }}
                ></div>
              </div>
            </div>
            <div className="flex flex-col gap-8 py-4">
              <div className="flex flex-col gap-3">
                <p className="font-display text-slate-900 dark:text-white text-5xl font-bold leading-tight tracking-[-0.033em]">
                  Lylux Belladonna
                </p>
                <p className="text-slate-500 dark:text-primary text-2xl font-normal leading-normal">
                  $1,250.00
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  SIZE
                </p>
                <div className="flex flex-wrap gap-3">
                  <label className="text-sm font-medium leading-normal flex items-center justify-center rounded-lg border border-slate-300 dark:border-white/20 px-4 h-11 text-slate-700 dark:text-white has-[:checked]:border-2 has-[:checked]:border-primary dark:has-[:checked]:border-primary relative cursor-pointer transition-all">
                    XS
                    <input
                      className="invisible absolute"
                      name="size-selector"
                      type="radio"
                    />
                  </label>
                  <label className="text-sm font-medium leading-normal flex items-center justify-center rounded-lg border border-slate-300 dark:border-white/20 px-4 h-11 text-slate-700 dark:text-white has-[:checked]:border-2 has-[:checked]:border-primary dark:has-[:checked]:border-primary relative cursor-pointer transition-all">
                    S
                    <input
                      defaultChecked
                      className="invisible absolute"
                      name="size-selector"
                      type="radio"
                    />
                  </label>
                  <label className="text-sm font-medium leading-normal flex items-center justify-center rounded-lg border border-slate-300 dark:border-white/20 px-4 h-11 text-slate-700 dark:text-white has-[:checked]:border-2 has-[:checked]:border-primary dark:has-[:checked]:border-primary relative cursor-pointer transition-all">
                    M
                    <input
                      className="invisible absolute"
                      name="size-selector"
                      type="radio"
                    />
                  </label>
                  <label className="text-sm font-medium leading-normal flex items-center justify-center rounded-lg border border-slate-300 dark:border-white/20 px-4 h-11 text-slate-700 dark:text-white has-[:checked]:border-2 has-[:checked]:border-primary dark:has-[:checked]:border-primary relative cursor-pointer transition-all">
                    L
                    <input
                      className="invisible absolute"
                      name="size-selector"
                      type="radio"
                    />
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex-1 flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-background-dark gap-2 text-base font-bold leading-normal tracking-wider uppercase min-w-0 px-6 hover:opacity-90 transition-opacity">
                  Add to Cart
                </button>
                <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-black/5 dark:bg-white/10 text-slate-600 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-black/10 dark:hover:bg-white/20 transition-colors">
                  <span className="material-symbols-outlined text-2xl">
                    favorite
                  </span>
                </button>
              </div>
              <div className="flex flex-col divide-y divide-slate-200 dark:divide-white/20 border-y border-slate-200 dark:border-white/20">
                <details className="group py-4" open>
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                      Product Description
                    </span>
                    <span className="material-symbols-outlined text-slate-600 dark:text-white transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <p className="text-slate-600 dark:text-gray-400 text-sm mt-3">
                    The Belladonna gown is an ode to timeless elegance. Crafted
                    from the finest Italian silk, its fluid silhouette drapes
                    gracefully, creating a mesmerizing effect with every
                    movement. The deep, rich hue is reminiscent of a midnight
                    garden, perfect for making a sophisticated statement.
                  </p>
                </details>
                <details className="group py-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                      Sizing &amp; Fit Guide
                    </span>
                    <span className="material-symbols-outlined text-slate-600 dark:text-white transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <p className="text-slate-600 dark:text-gray-400 text-sm mt-3">
                    Fits true to size. Model is 5&apos;9&quot; (175cm) and is
                    wearing a size S. Designed for a slightly loose fit. Refer
                    to our detailed size chart for precise measurements.
                  </p>
                </details>
                <details className="group py-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                      Shipping &amp; Returns
                    </span>
                    <span className="material-symbols-outlined text-slate-600 dark:text-white transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <p className="text-slate-600 dark:text-gray-400 text-sm mt-3">
                    Enjoy complimentary express shipping on all orders. We offer
                    a 30-day return policy for a full refund or exchange. Items
                    must be returned in their original condition.
                  </p>
                </details>
              </div>
            </div>
          </div>
          <div className="mt-16 lg:mt-24">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h3 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
                Customer Reviews
              </h3>
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 bg-black/5 dark:bg-white/10 text-slate-800 dark:text-white gap-2 text-sm font-bold leading-normal tracking-wider uppercase min-w-0 px-5 hover:bg-black/10 dark:hover:bg-white/20 transition-colors">
                Write a Review
              </button>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4 p-6 bg-black/5 dark:bg-white/5 rounded-xl">
                <div className="flex flex-col gap-1 items-center">
                  <p className="text-4xl font-black text-slate-900 dark:text-white">
                    4.8
                  </p>
                  <div className="flex text-primary">
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star_half
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Based on 24 reviews
                  </p>
                </div>
                <div className="w-px h-16 bg-slate-200 dark:bg-white/20 mx-4"></div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-12 text-slate-600 dark:text-gray-300">
                      5 star
                    </span>
                    <div className="w-full h-2 bg-slate-200 dark:bg-white/20 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                    <span className="w-8 text-slate-500 dark:text-gray-400">
                      20
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-12 text-slate-600 dark:text-gray-300">
                      4 star
                    </span>
                    <div className="w-full h-2 bg-slate-200 dark:bg-white/20 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                    <span className="w-8 text-slate-500 dark:text-gray-400">
                      3
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-12 text-slate-600 dark:text-gray-300">
                      3 star
                    </span>
                    <div className="w-full h-2 bg-slate-200 dark:bg-white/20 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: "5%" }}
                      ></div>
                    </div>
                    <span className="w-8 text-slate-500 dark:text-gray-400">
                      1
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-12 text-slate-600 dark:text-gray-300">
                      2 star
                    </span>
                    <div className="w-full h-2 bg-slate-200 dark:bg-white/20 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                    <span className="w-8 text-slate-500 dark:text-gray-400">
                      0
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-12 text-slate-600 dark:text-gray-300">
                      1 star
                    </span>
                    <div className="w-full h-2 bg-slate-200 dark:bg-white/20 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                    <span className="w-8 text-slate-500 dark:text-gray-400">
                      0
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-white/20 pt-8">
                <div className="flex items-start gap-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBWld0PfVkVXWFW4_0o-SJ8O_UsjypwC37U2YJcQMAQV9Y3ni5HwoVZ6z57X6Hgjo9OJ1t4Whpifm1oljUKUF9016vhGQyZ8r4yw6FvRPbnsjzzkOJqftFZ9jnMJ5w_Yh7-UmUxF0_pZ_2SvPPgrKpQq6Lpggxo6Be5CBBoz6AeVPyBRxzXtSmqGspJKdgGhXR_LkyW6MLFsPWPsaY4M5wN5L9izNZMCFbT-eK5gnSpPUOshXG8-kUctV5uby0xDuea4aM9p1quZtE")`,
                    }}
                  ></div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 dark:text-white">
                        Eleanor Vance
                      </h4>
                      <div className="flex text-primary">
                        <span
                          className="material-symbols-outlined text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-gray-400">
                      Absolutely breathtaking. The quality is impeccable and it
                      feels like a dream to wear. I received so many
                      compliments. Worth every penny for a piece this special.
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-white/20 pt-8">
                <div className="flex items-start gap-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBTuNRL6a6jIkFo2k7hrEqJWK5yR2vjUpxfa1i3JgNFbLSPii2XYsnqm6oZKHWdaaz3eyhHMgxDY7ymkcpDHlAf957GTYJGj1PYjfzguOSUXrONGFUizdWXUTXfRId20_ZNuP9zXKJbc1L-1VuA2WLWmY-Bhx62gh6eaETxV1TtYV-Xx5M5rXvqvQcNhsmK2oLTo_LE3D5i4eNKQolGkvrLlI1EkpWfqJ2QTi2a-M2ys2BXSS-5DY6h6413i6rN8V3NRC4Vs9K0Wz0")`,
                    }}
                  ></div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 dark:text-white">
                        Isabella Rossi
                      </h4>
                      <div className="flex text-primary">
                        <span
                          className="material-symbols-outlined text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="material-symbols-outlined text-base">
                          star
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-gray-400">
                      A truly beautiful garment. The fit is perfect, though I
                      wish the color was slightly deeper as shown online.
                      Nevertheless, a stunning piece I&apos;ll cherish.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 lg:mt-24">
            <h3 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-8">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Link href="/products/5" className="flex flex-col gap-3 group">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-xl transition-transform group-hover:scale-105"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDJoLgdhvMHOdK8foYPdeA_Vod2bGKUvUwwRgDwTdwVmpcQ7HF7o2XmSdnqDmXF5QSFl0neQsJcVvE0I7zBmjNMDcjmmbm7sWjMcRaxLAPFZf3dIW56hgYxry7JDiLw1B_25SHnONbi1sC1Gc5ij20SeyLN5Vz_yHOWss0lcMJS7LV5bqx_o1VxI2l0pYgUy62QTjK0hniCJCWeQauUXC3bNY56ABZTXl3YgQCki2RvSk_rBsuL395knHctCvrGgZuccWXEdCAzXMc")`,
                  }}
                ></div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    Aurelia Hoops
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    $450.00
                  </p>
                </div>
              </Link>
              <Link href="/products/6" className="flex flex-col gap-3 group">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-xl transition-transform group-hover:scale-105"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBY0EwqGAWW16Go9idAreT2MWKE4FBbSDLD-m8nIGSIRqK8Mysq26kYw_JbJjGCR_W0t_Vq_0i1ROFHq9JWNN_2D-B7C-jtP_-P9OqarcLybVaY8350Vu4t-vo_5vFrBKLqbunOMH0WEEu6aPQSSjL1qDmVnYqLNwHaotGDfn06e-Ha5eal84LuemQLKLmUX340vpa-hyMNuRE-sVJGoCh8GSDgoccjZ0HjkmvRVUc2JZ435WstQw6o3ruGH340cJKrddWtMrsMthA")`,
                  }}
                ></div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    Seraphina Clutch
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    $980.00
                  </p>
                </div>
              </Link>
              <Link href="/products/7" className="flex flex-col gap-3 group">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-xl transition-transform group-hover:scale-105"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDhoyJYxjevoQaqUpKfKwMSbE-XUKgx0DooJkmZ7BxfGVrcKmjpV2F1zqDpTbw2brIWi6O-e0Nq-lLpsuP_8uTHowdowf5365tM4MUNCwiRiQ_guGJx6CqF0l6vVYEKvy7XSMyXsuNyoChXjsaycLQ9-lUAIIEDWxYkzhNOWID-mfo4iTlY97jmeMLq4w6GZH2KSuGD01QzAgpVvBfnWT-05xpmEyCkdetW_BxXgFhvWckgevMp9YXoJ7w2z9v8pqhEH_XjshxiaZE")`,
                  }}
                ></div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    Orion Silk Scarf
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    $320.00
                  </p>
                </div>
              </Link>
              <Link href="/products/8" className="flex flex-col gap-3 group">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-xl transition-transform group-hover:scale-105"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBWO9vCioKNKjgQTivLoqqJmqLHvQuXz4YBJzukPc4F_qMW9YbGpvpKiEOFksJg1gworLDpTgYqq46d9ti69rEYFAcLGFGE1iTbakvunVgZEDzCekw7bVU0JaveSMNJy8qkHk5dsy-QOAeyAkOywUG9xU4XwLuS5MvYPrZ47d0EBF3L7-ZTjCEdVsEsdsh_exp80aVuNOLV9whJ_8quCkIsrQdWxDHNXLHJQtj8aar77yS7audIl0sukatmFlUuXRbsM6TWgNBaMJw")`,
                  }}
                ></div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    Nyx Stilettos
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    $750.00
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
