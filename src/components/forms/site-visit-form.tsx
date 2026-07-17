"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { siteVisitSchema } from "@/lib/validations";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SiteVisitFormValues = z.infer<typeof siteVisitSchema>;

interface SiteVisitFormProps {
  propertyTitle: string;
  propertyId: number;
}

export function SiteVisitForm({ propertyTitle, propertyId }: SiteVisitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SiteVisitFormValues>({
    resolver: zodResolver(siteVisitSchema),
    defaultValues: {
      property: `HH-${String(propertyId).padStart(4, "0")} - ${propertyTitle}`,
    }
  });

  const onSubmit = async (data: SiteVisitFormValues) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/bookings/site-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to book site visit");

      setIsSuccess(true);
    } catch (error) {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
        <div className="size-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 className="size-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Visit Scheduled!</h3>
        <p className="text-muted-foreground max-w-sm">
          Thank you for your interest. Our dealer will contact you shortly to confirm the site visit details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Property</label>
        <Input 
          {...register("property")} 
          readOnly 
          className="bg-muted/50 cursor-not-allowed border-border text-muted-foreground" 
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Full Name</label>
        <Input {...register("name")} placeholder="John Doe" className="border-border" />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Mobile Number</label>
          <Input {...register("mobile")} placeholder="+1 (555) 000-0000" className="border-border" />
          {errors.mobile && <p className="text-xs text-destructive mt-1">{errors.mobile.message}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Email Address</label>
          <Input {...register("email")} placeholder="john@example.com" type="email" className="border-border" />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Preferred Date</label>
          <Input {...register("date")} type="date" className="border-border" min={new Date().toISOString().split('T')[0]} />
          {errors.date && <p className="text-xs text-destructive mt-1">{errors.date.message}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Preferred Time</label>
          <Input {...register("time")} type="time" className="border-border" />
          {errors.time && <p className="text-xs text-destructive mt-1">{errors.time.message}</p>}
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
          {errorMsg}
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full mt-4 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25 border-0 cursor-pointer"
      >
        {isSubmitting ? <Loader2 className="size-5 animate-spin mr-2" /> : null}
        {isSubmitting ? "Submitting..." : "Schedule Site Visit"}
      </Button>
    </form>
  );
}
