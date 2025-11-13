import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 px-4 md:px-10 lg:px-20 xl:px-40 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-5xl font-black font-serif mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-400 mb-8">Last updated: November 2024</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-white text-2xl font-bold mb-4">
                Introduction
              </h2>
              <p>
                At Lylux Belladonna, we respect your privacy and are committed
                to protecting your personal data. This privacy policy will
                inform you how we look after your personal data.
              </p>
            </section>

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">
                Data We Collect
              </h2>
              <p>
                We may collect, use, store and transfer different kinds of
                personal data about you including:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Identity Data (name, username)</li>
                <li>Contact Data (email address, telephone numbers)</li>
                <li>Transaction Data (details about payments and purchases)</li>
                <li>
                  Technical Data (IP address, browser type, device information)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">
                How We Use Your Data
              </h2>
              <p>We use your personal data to:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Process and deliver your orders</li>
                <li>Manage payments and accounts</li>
                <li>Communicate with you about products and services</li>
                <li>Improve our website and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">
                Your Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request transfer of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please
                contact us at privacy@lyluxbelladonna.com
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
