"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Bed, Bath, Maximize, Heart, Share2, ArrowLeft,
  ChevronLeft, ChevronRight, X, Phone, MessageCircle,
  Calendar, PhoneCall, Car, Trees, ArrowUpFromLine,
  Dumbbell, Waves, Shield, Zap, Building, Wifi,
  Coffee, Clock, Fence, Lamp, Droplets, Plug,
  Route, Warehouse, Sprout, CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/property-map").then((mod) => mod.PropertyMap), { 
  ssr: false,
  loading: () => <div className="w-full h-64 bg-muted rounded-xl animate-pulse" />
});
import { SiteVisitForm } from "@/components/forms/site-visit-form";
import { CallbackForm } from "@/components/forms/callback-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getPropertyDetail, getSimilarProperties } from "@/lib/property-detail-data";
import type { ListingProperty } from "@/lib/properties-data";
import { useUser } from "@/context/user-context";

// ── Amenity icon map ──
const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Parking: Car, Garden: Trees, Lift: ArrowUpFromLine, Gym: Dumbbell,
  "Swimming Pool": Waves, Security: Shield, "Power Backup": Zap,
  "Club House": Building, "Conference Room": Building, Cafeteria: Coffee,
  "High-Speed Internet": Wifi, "24/7 Access": Clock,
  "Gated Community": Fence, "Street Lighting": Lamp,
  "Water Connection": Droplets, Electricity: Plug, "Wide Roads": Route,
  "Park Nearby": Trees, "Water Source": Droplets, Fencing: Fence,
  "Road Access": Route, "Storage Shed": Warehouse,
  "Irrigation System": Sprout,
};

// ── Image Gallery ──
function ImageGallery({ images, onOpen }: { images: string[]; onOpen: (i: number) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-2xl overflow-hidden"
    >
      {/* Main image */}
      <div
        className="relative h-72 md:h-[460px] md:row-span-2 cursor-pointer group"
        onClick={() => onOpen(0)}
      >
        <Image src={images[0]!} alt="Main" fill sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 gap-3">
        {images.slice(1, 5).map((img, i) => (
          <div key={i} className="relative h-32 md:h-[222px] cursor-pointer group" onClick={() => onOpen(i + 1)}>
            <Image src={img} alt={`View ${i + 2}`} fill sizes="25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">+{images.length - 5} more</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Fullscreen Viewer ──
function FullscreenViewer({ images, index, onClose, onNav }: {
  images: string[]; index: number; onClose: () => void; onNav: (i: number) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <Button variant="ghost" size="icon" onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/10 cursor-pointer size-12">
        <X className="size-6" />
      </Button>
      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onNav((index - 1 + images.length) % images.length); }}
        className="absolute left-4 text-white hover:bg-white/10 cursor-pointer size-12">
        <ChevronLeft className="size-6" />
      </Button>
      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onNav((index + 1) % images.length); }}
        className="absolute right-4 text-white hover:bg-white/10 cursor-pointer size-12">
        <ChevronRight className="size-6" />
      </Button>
      <motion.div key={index} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative w-[90vw] h-[80vh]" onClick={(e) => e.stopPropagation()}>
        <Image src={images[index]!} alt={`Image ${index + 1}`} fill sizes="90vw" className="object-contain" />
      </motion.div>
      <div className="absolute bottom-6 text-white/60 text-sm">{index + 1} / {images.length}</div>
    </motion.div>
  );
}

// ── Similar Property Card ──
function SimilarCard({ property, index }: { property: ListingProperty; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }} viewport={{ once: true }}
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500"
    >
      <div className="relative h-48 overflow-hidden">
        <Image src={property.image} alt={property.title} fill sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700" />
        <Badge className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full border-0 ${
          property.type === "Sale" ? "bg-emerald-500 text-white" : "bg-violet-500 text-white"
        }`}>For {property.type}</Badge>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{property.priceLabel}</p>
        <h3 className="font-semibold text-foreground line-clamp-1">{property.title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 text-emerald-500" /><span className="line-clamp-1">{property.location}</span>
        </div>
        <Link href={`/properties/${property.id}`}>
          <Button variant="outline" className="w-full mt-2 rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 cursor-pointer">
            View Details
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

// ── Main Page ──
export default function PropertyDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const property = getPropertyDetail(id);
  const similar = getSimilarProperties(id);
  const { user, refreshUser, addRecentlyViewed, addToCompare, compareList, removeFromCompare } = useUser();

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  const openViewer = useCallback((i: number) => { setViewerIndex(i); setViewerOpen(true); }, []);

  useEffect(() => {
    if (property) {
      addRecentlyViewed(property.id);
    }
  }, [property]);

  const isSaved = user?.savedProperties?.some(sp => sp.propertyId === id);
  const isCompared = compareList.includes(id);

  const handleSave = async () => {
    if (!user) return alert("Please login to save properties");
    setSaving(true);
    try {
      if (isSaved) {
        await fetch(`/api/user/saved-properties?propertyId=${id}`, { method: "DELETE" });
      } else {
        await fetch(`/api/user/saved-properties`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId: id })
        });
      }
      await refreshUser();
    } finally {
      setSaving(false);
    }
  };

  const handleCompare = () => {
    if (isCompared) removeFromCompare(id);
    else addToCompare(id);
  };

  if (!property) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-16 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Property Not Found</h1>
            <p className="text-muted-foreground">The property you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/properties"><Button className="rounded-full bg-emerald-600 text-white border-0 cursor-pointer">Browse Properties</Button></Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const detailItems = [
    { label: "Property Type", value: property.category },
    { label: "Status", value: property.status },
    { label: "Area", value: property.area },
    ...(property.bedrooms > 0 ? [{ label: "Bedrooms", value: String(property.bedrooms) }] : []),
    ...(property.bathrooms > 0 ? [{ label: "Bathrooms", value: String(property.bathrooms) }] : []),
    { label: "Listing Type", value: `For ${property.type}` },
    ...(property.yearBuilt > 0 ? [{ label: "Year Built", value: String(property.yearBuilt) }] : []),
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 lg:pt-24 pb-16 bg-background">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/properties" className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <ArrowLeft className="size-4" /> Properties
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium line-clamp-1">{property.title}</span>
          </motion.div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Gallery */}
          <ImageGallery images={property.images} onOpen={openViewer} />

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Price */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }} className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`px-2.5 py-1 text-xs font-semibold rounded-full border-0 ${
                        property.type === "Sale" ? "bg-emerald-500 text-white" : "bg-violet-500 text-white"
                      }`}>For {property.type}</Badge>
                      <Badge className="px-2.5 py-1 text-xs rounded-full border-0 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        {property.category}
                      </Badge>
                      <Badge className={`px-2.5 py-1 text-xs rounded-full border-0 ${
                        property.status === "Available" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-orange-500/10 text-orange-600"
                      }`}>
                        <CheckCircle className="size-3 mr-1" />{property.status}
                      </Badge>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{property.title}</h1>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="size-4 text-emerald-500" /><span>{property.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400">{property.priceLabel}</p>
                    {property.type === "Sale" && <p className="text-sm text-muted-foreground mt-1">One-time payment</p>}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    variant="outline" 
                    size="sm" 
                    className={`rounded-full cursor-pointer ${isSaved ? "border-rose-500 text-rose-500 hover:bg-rose-50" : ""}`}
                  >
                    <Heart className={`size-4 mr-1.5 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                  <Button 
                    onClick={handleCompare} 
                    variant="outline" 
                    size="sm" 
                    className={`rounded-full cursor-pointer ${isCompared ? "border-blue-500 text-blue-500 hover:bg-blue-50" : ""}`}
                  >
                    <Building className="size-4 mr-1.5" />
                    {isCompared ? "Remove Compare" : "Compare"}
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full cursor-pointer"><Share2 className="size-4 mr-1.5" />Share</Button>
                </div>
              </motion.div>

              <Separator />

              {/* Quick Stats */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-emerald-500/10"><Bed className="size-5 text-emerald-500" /></div>
                    <div><p className="text-lg font-bold text-foreground">{property.bedrooms}</p><p className="text-xs text-muted-foreground">Bedrooms</p></div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-emerald-500/10"><Bath className="size-5 text-emerald-500" /></div>
                    <div><p className="text-lg font-bold text-foreground">{property.bathrooms}</p><p className="text-xs text-muted-foreground">Bathrooms</p></div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-emerald-500/10"><Maximize className="size-5 text-emerald-500" /></div>
                  <div><p className="text-lg font-bold text-foreground">{property.area.split(" ")[0]}</p><p className="text-xs text-muted-foreground">{property.area.includes("acres") ? "Acres" : "Sq Ft"}</p></div>
                </div>
                {property.yearBuilt > 0 && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-emerald-500/10"><Building className="size-5 text-emerald-500" /></div>
                    <div><p className="text-lg font-bold text-foreground">{property.yearBuilt}</p><p className="text-xs text-muted-foreground">Year Built</p></div>
                  </div>
                )}
              </motion.div>

              <Separator />

              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }} className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </motion.div>

              <Separator />

              {/* Property Details Grid */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }} className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Property Details</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {detailItems.map((item) => (
                    <div key={item.label} className="p-4 rounded-xl bg-muted/30 border border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <Separator />

              {/* Amenities */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }} className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {property.amenities.map((amenity, i) => {
                    const Icon = amenityIcons[amenity] || CheckCircle;
                    return (
                      <motion.div key={amenity} initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border hover:border-emerald-500/30 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10 shrink-0">
                          <Icon className="size-4 text-emerald-500" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{amenity}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              <Separator />

              {/* Location Map */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }} className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Location & Neighborhood</h2>
                <PropertyMap coordinates={property.coordinates} />
              </motion.div>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">
              {/* Dealer Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-28 p-6 bg-card rounded-2xl border border-border shadow-sm space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative size-14 rounded-full overflow-hidden ring-2 ring-emerald-500/20">
                    <Image src={property.dealer.avatar} alt={property.dealer.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{property.dealer.name}</p>
                    <p className="text-sm text-muted-foreground">{property.dealer.company}</p>
                  </div>
                </div>
                <Separator />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25 border-0 cursor-pointer">
                    <Phone className="size-4 mr-2" /> Contact Dealer
                  </Button>
                  <Button className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold border-0 cursor-pointer">
                    <MessageCircle className="size-4 mr-2" /> WhatsApp
                  </Button>

                  <Dialog>
                    <DialogTrigger render={<Button variant="outline" className="w-full h-12 rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer" />}>
                      <Calendar className="size-4 mr-2" /> Book Site Visit
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Schedule a Site Visit</DialogTitle>
                      </DialogHeader>
                      <SiteVisitForm propertyId={property.id} propertyTitle={property.title} />
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger render={<Button variant="outline" className="w-full h-12 rounded-xl cursor-pointer" />}>
                      <PhoneCall className="size-4 mr-2" /> Request Callback
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Request a Callback</DialogTitle>
                      </DialogHeader>
                      <CallbackForm />
                    </DialogContent>
                  </Dialog>
                </div>

                <Separator />

                {/* Quick Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Property ID</span><span className="font-medium text-foreground">HH-{String(property.id).padStart(4, "0")}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Listed On</span><span className="font-medium text-foreground">{new Date(property.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">City</span><span className="font-medium text-foreground">{property.city}</span></div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }} viewport={{ once: true }} className="pt-10 space-y-8">
              <Separator />
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Similar <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Properties</span>
                </h2>
                <p className="text-muted-foreground">Properties you might also be interested in</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.map((p, i) => <SimilarCard key={p.id} property={p} index={i} />)}
              </div>
            </motion.section>
          )}
        </div>
      </main>
      <Footer />

      {/* Fullscreen Viewer */}
      <AnimatePresence>
        {viewerOpen && (
          <FullscreenViewer images={property.images} index={viewerIndex}
            onClose={() => setViewerOpen(false)} onNav={setViewerIndex} />
        )}
      </AnimatePresence>
    </>
  );
}
