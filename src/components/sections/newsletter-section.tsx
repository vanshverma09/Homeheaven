"use client";

import { motion } from "framer-motion";
import { Send, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

          {/* Floating shapes */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 size-40 border border-white/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-10 -left-10 size-60 border border-white/10 rounded-full"
          />

          {/* Content */}
          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center space-y-8">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center size-16 rounded-2xl bg-white/15 backdrop-blur-sm"
            >
              <Bell className="size-8 text-white" />
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Stay Updated with{" "}
                <span className="text-emerald-200">New Listings</span>
              </h2>
              <p className="text-white/70 max-w-xl mx-auto text-lg">
                Subscribe to our newsletter and be the first to know about
                exclusive properties, market trends, and special offers.
              </p>
            </div>

            {/* Form */}
            <div className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="h-14 px-6 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:ring-white/30 focus:border-white/30 flex-1"
                />
                <Button className="h-14 px-8 rounded-xl bg-white text-emerald-700 font-semibold hover:bg-white/90 shadow-xl shadow-black/10 border-0 cursor-pointer">
                  <Send className="size-4 mr-2" />
                  Subscribe
                </Button>
              </div>
              <p className="text-white/50 text-sm mt-4">
                No spam, unsubscribe at any time. We respect your privacy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
