import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 px-4 md:px-10 lg:px-20 xl:px-40 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-5xl font-black font-serif mb-6">
            Contact Us
          </h1>
          <p className="text-gray-300 mb-12">
            We&apos;d love to hear from you. Reach out to our team.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-white text-2xl font-bold mb-6">
                Get in Touch
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary">
                    location_on
                  </span>
                  <div>
                    <p className="text-white font-semibold">Visit Us</p>
                    <p className="text-gray-400">
                      123 Luxury Avenue, Paris, France
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary">
                    mail
                  </span>
                  <div>
                    <p className="text-white font-semibold">Email</p>
                    <p className="text-gray-400">contact@lyluxbelladonna.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary">
                    phone
                  </span>
                  <div>
                    <p className="text-white font-semibold">Phone</p>
                    <p className="text-gray-400">+33 1 23 45 67 89</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-[#1a2332]/10 text-white border border-white/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-[#1a2332]/10 text-white border border-white/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-[#1a2332]/10 text-white border border-white/20 focus:border-primary outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-background-dark font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-opacity"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


