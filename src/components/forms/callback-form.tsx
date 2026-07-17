"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { callbackSchema } from "@/lib/validations";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CallbackFormValues = z.infer<typeof callbackSchema>;

export function CallbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CallbackFormValues>({
    resolver: zodResolver(callbackSchema),
  });

  const onSubmit = async (data: CallbackFormValues) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/bookings/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to request callback");

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
        <h3 className="text-xl font-bold text-foreground">Request Received!</h3>
        <p className="text-muted-foreground max-w-sm">
          Our team has received your callback request. An expert will reach out to you at your preferred time.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Full Name</label>
        <Input {...register("name")} placeholder="John Doe" className="border-border" />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Mobile Number</label>
        <Input {...register("mobile")} placeholder="+1 (555) 000-0000" className="border-border" />
        {errors.mobile && <p className="text-xs text-destructive mt-1">{errors.mobile.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Preferred Date</label>
          <Input {...register("preferredDate")} type="date" className="border-border" min={new Date().toISOString().split('T')[0]} />
          {errors.preferredDate && <p className="text-xs text-destructive mt-1">{errors.preferredDate.message}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Preferred Time</label>
          <Input {...register("preferredTime")} type="time" className="border-border" />
          {errors.preferredTime && <p className="text-xs text-destructive mt-1">{errors.preferredTime.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Message (Optional)</label>
        <Textarea 
          {...register("message")} 
          placeholder="I would like to know more about..." 
          className="resize-none border-border h-24" 
        />
        {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
      </div>

      {errorMsg && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
          {errorMsg}
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full mt-4 h-12 rounded-xl bg-foreground hover:bg-foreground/90 text-background font-semibold shadow-lg border-0 cursor-pointer"
      >
        {isSubmitting ? <Loader2 className="size-5 animate-spin mr-2" /> : null}
        {isSubmitting ? "Submitting..." : "Request Callback"}
      </Button>
    </form>
  );
}
