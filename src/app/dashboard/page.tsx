"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { allListingProperties } from "@/lib/properties-data";
import Link from "next/link";
import { Building2, Calendar, PhoneCall, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, loading, refreshUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Hydrate saved properties
  const savedProps = user.savedProperties
    ?.map(sp => allListingProperties.find(p => p.id === sp.propertyId))
    .filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">Manage your property journey from your personal dashboard.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wishlist / Saved Properties */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="text-rose-500 fill-rose-500" /> Saved Properties
            </h2>
            {savedProps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedProps.map((property: any) => (
                  <Card key={property.id} className="overflow-hidden hover:border-emerald-500/50 transition-colors">
                    <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg">{property.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{property.location}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{property.priceLabel}</span>
                        <Link href={`/properties/${property.id}`}>
                          <Button size="sm">View</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
                <Building2 className="size-12 mx-auto mb-4 opacity-20" />
                <p>You haven't saved any properties yet.</p>
                <Link href="/properties">
                  <Button variant="outline" className="mt-4">Browse Properties</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Activity sidebar */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Calendar className="text-blue-500" /> Site Visits
              </h2>
              {user.siteVisits && user.siteVisits.length > 0 ? (
                <div className="space-y-3">
                  {user.siteVisits.map((sv: any) => (
                    <div key={sv.id} className="bg-card border border-border p-4 rounded-xl text-sm">
                      <p className="font-semibold">{sv.property}</p>
                      <p className="text-muted-foreground mt-1">Date: {sv.date} at {sv.time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-4 rounded-xl">No site visits scheduled.</p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <PhoneCall className="text-amber-500" /> Callback Requests
              </h2>
              {user.callbackRequests && user.callbackRequests.length > 0 ? (
                <div className="space-y-3">
                  {user.callbackRequests.map((cr: any) => (
                    <div key={cr.id} className="bg-card border border-border p-4 rounded-xl text-sm">
                      <p className="font-semibold">Request submitted</p>
                      <p className="text-muted-foreground mt-1">Prefers: {cr.preferredDate} at {cr.preferredTime}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-4 rounded-xl">No pending callback requests.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
