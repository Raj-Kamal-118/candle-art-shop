import { Mail, Phone, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl font-bold text-brown-900 dark:text-amber-100">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-brown-600 dark:text-amber-200/70">
          We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-6">
            Get in Touch
          </h2>
          <p className="text-brown-600 dark:text-amber-200/70 mb-8">
            Have a question about a product, custom order, or wholesale inquiry?
            Fill out the form, or reach out to us directly using the details
            below.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-brown-700 dark:text-amber-200">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <Mail className="text-amber-700 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p>hello@candleartshop.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-brown-700 dark:text-amber-200">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <Phone className="text-amber-700 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-semibold">Phone</p>
                <p>+91 98765 43210 (Mon-Fri, 10am-6pm)</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-brown-700 dark:text-amber-200">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <MapPin className="text-amber-700 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-semibold">Studio</p>
                <p>123 Artisan Lane, Creative District, New Delhi, 110001</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1830] p-8 rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brown-800 dark:text-amber-200 mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 dark:border-amber-900/50 bg-transparent focus:ring-2 focus:ring-amber-400 outline-none dark:text-white"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown-800 dark:text-amber-200 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 dark:border-amber-900/50 bg-transparent focus:ring-2 focus:ring-amber-400 outline-none dark:text-white"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown-800 dark:text-amber-200 mb-2">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 dark:border-amber-900/50 bg-transparent focus:ring-2 focus:ring-amber-400 outline-none dark:text-white"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <Button className="w-full" size="lg">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
