"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { latestProperties } from "@/lib/data";

export function LatestPropertiesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-16"
        >
          <div className="space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              New Arrivals
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Latest{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Properties
              </span>
            </h2>
            <p className="text-muted-foreground max-w-lg text-lg">
              Check out the most recently listed properties on our platform.
            </p>
          </div>
          <Link href="/properties">
            <Button
              variant="outline"
              className="rounded-full px-6 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer"
            >
              View All
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Properties List - Horizontal Cards */}
        <div className="space-y-6">
          {latestProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden border border-border hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative w-full md:w-80 lg:w-96 h-64 md:h-auto shrink-0 overflow-hidden">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    className={`px-3 py-1 text-xs font-semibold rounded-full border-0 ${
                      property.type === "Sale"
                        ? "bg-emerald-500 text-white"
                        : "bg-violet-500 text-white"
                    }`}
                  >
                    For {property.type}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-2">
                        <MapPin className="size-4 text-emerald-500" />
                        <span>{property.location}</span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {property.price}
                    </p>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Experience luxury living in this stunning property featuring
                    modern architecture, premium finishes, and breathtaking
                    views. Perfect for families seeking comfort and elegance.
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Bed className="size-4" />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Bath className="size-4" />
                      <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Maximize className="size-4" />
                      <span>{property.area}</span>
                    </div>
                  </div>
                  <Link href={`/properties/${property.id}`}>
                    <Button
                      variant="ghost"
                      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer"
                    >
                      View Details
                      <ArrowRight className="size-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
