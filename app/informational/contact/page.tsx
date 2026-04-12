"use client";

import { useState } from "react";
import { Send, MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="font-serif text-4xl font-bold text-brown-900 dark:text-amber-100 mb-4">Get in Touch</h1>
        <p className="text-brown-600 dark:text-amber-100/70">
          Have a question about an order, a custom request, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Contact Info */}
        <div className="bg-cream-100 dark:bg-[#1a1830] rounded-3xl p-8 sm:p-12 border border-cream-200 dark:border-amber-900/30">
          <h2 className="text-2xl font-serif font-bold text-brown-900 dark:text-amber-100 mb-8">Contact Information</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white dark:bg-[#0f0e1c] rounded-full text-amber-600 shadow-sm"><MapPin size={24} /></div>
              <div>
                <h3 className="font-semibold text-brown-900 dark:text-amber-100">Studio Address</h3>
                <p className="text-brown-600 dark:text-amber-100/70 mt-1">123 Artisan Lane<br/>Craft City, CR 12345</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white dark:bg-[#0f0e1c] rounded-full text-amber-600 shadow-sm"><Phone size={24} /></div>
              <div>
                <h3 className="font-semibold text-brown-900 dark:text-amber-100">Phone & WhatsApp</h3>
                <p className="text-brown-600 dark:text-amber-100/70 mt-1">+91 800 917 0754</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white dark:bg-[#0f0e1c] rounded-full text-amber-600 shadow-sm"><Mail size={24} /></div>
              <div>
                <h3 className="font-semibold text-brown-900 dark:text-amber-100">Email Address</h3>
                <p className="text-brown-600 dark:text-amber-100/70 mt-1">artisanhouse.in@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-[#1a1830] rounded-3xl p-8 sm:p-12 shadow-sm border border-cream-200 dark:border-amber-900/30">
          {status === "success" ? (
            <div className="text-center py-12">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-bold text-brown-900 dark:text-amber-100 mb-2">Message Sent!</h3>
              <p className="text-brown-600 dark:text-amber-100/70 mb-8">We've received your message and will get back to you as soon as possible.</p>
              <Button onClick={() => setStatus("idle")}>Send Another Message</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-brown-900 dark:text-amber-100 mb-2">Your Name</label>
                <input name="name" required type="text" className="w-full px-4 py-3 rounded-xl bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 focus:ring-2 focus:ring-amber-500 outline-none text-brown-900 dark:text-amber-100" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown-900 dark:text-amber-100 mb-2">Email Address</label>
                <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 focus:ring-2 focus:ring-amber-500 outline-none text-brown-900 dark:text-amber-100" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown-900 dark:text-amber-100 mb-2">Your Message</label>
                <textarea name="message" required rows={5} className="w-full px-4 py-3 rounded-xl bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 focus:ring-2 focus:ring-amber-500 outline-none text-brown-900 dark:text-amber-100 resize-none" placeholder="How can we help you?"></textarea>
              </div>
              
              {status === "error" && (
                <p className="text-red-500 text-sm">Something went wrong. Please try again or email us directly.</p>
              )}

              <Button type="submit" className="w-full flex justify-center gap-2" disabled={status === "submitting"}>
                <Send size={18} />
                {status === "submitting" ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}