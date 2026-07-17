"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, X } from "lucide-react";

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    type: "Sale",
    category: "Villa",
    bedrooms: 0,
    bathrooms: 0,
    area: "",
  });

  const handleUpload = (result: any) => {
    if (result.info.secure_url) {
      setImages(prev => [...prev, result.info.secure_url]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Fallback if Cloudinary isn't configured, so they don't get blocked testing it.
    const finalImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"];

    try {
      const res = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          image: finalImages[0],
          images: finalImages,
        })
      });

      if (res.ok) {
        router.push("/admin/properties");
        router.refresh();
      } else {
        alert("Failed to add property");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add New Property</h1>
        <p className="text-muted-foreground mt-1">Create a new listing in your database.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Property Title</label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Modern Luxury Villa" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  required 
                  rows={4}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Beverly Hills, CA" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price Label</label>
                <Input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. $2,450,000" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bedrooms</label>
                <Input type="number" required value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bathrooms</label>
                <Input type="number" required value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: Number(e.target.value)})} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Area</label>
                <Input required value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} placeholder="e.g. 4,200 sq ft" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Images (Cloudinary)</label>
              <div className="flex flex-wrap gap-4 mb-4">
                {images.map((img, i) => (
                  <div key={i} className="relative size-24 rounded-lg overflow-hidden border border-border">
                    <img src={img} alt="Uploaded" className="object-cover w-full h-full" />
                    <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500">
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                
                <CldUploadWidget uploadPreset="propex_uploads" onSuccess={handleUpload}>
                  {({ open }) => (
                    <button type="button" onClick={() => open()} className="flex flex-col items-center justify-center size-24 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:bg-muted/50 transition">
                      <ImagePlus className="size-6 mb-1" />
                      <span className="text-xs">Upload</span>
                    </button>
                  )}
                </CldUploadWidget>
              </div>
              <p className="text-xs text-muted-foreground">Note: Requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env to function correctly.</p>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
              {loading ? "Saving..." : "Save Property"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
