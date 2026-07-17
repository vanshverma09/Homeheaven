"use client";

import Link from "next/link";
import { Building2, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/about" },
    { name: "Careers", href: "/contact" },
    { name: "Press", href: "/contact" },
  ],
  services: [
    { name: "Buy Property", href: "/properties" },
    { name: "Rent Property", href: "/properties" },
    { name: "Sell Property", href: "/contact" },
    { name: "Property Valuation", href: "/contact" },
  ],
  support: [
    { name: "Help Center", href: "/contact" },
    { name: "Terms of Service", href: "/" },
    { name: "Privacy Policy", href: "/" },
    { name: "Cookie Policy", href: "/" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-background to-muted/50 border-t border-border">
      {/* Decorative Top Gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                <Building2 className="size-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  HomeHeaven
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Your trusted partner in finding the perfect property. We connect
              buyers, sellers, and renters with premium real estate
              opportunities across the nation. Welcome to HomeHeaven.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-500/10">
                  <Mail className="size-4 text-emerald-500" />
                </div>
                <span>contact@homeheaven.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-500/10">
                  <Phone className="size-4 text-emerald-500" />
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-500/10">
                  <MapPin className="size-4 text-emerald-500" />
                </div>
                <span>123 Property Lane, New York, NY</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="size-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HomeHeaven. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "Instagram", "Facebook"].map(
              (social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ y: -2 }}
                  className="text-sm text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
                >
                  {social}
                </motion.a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
