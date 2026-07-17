import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturedPropertiesSection } from "@/components/sections/featured-properties";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us";
import { LatestPropertiesSection } from "@/components/sections/latest-properties";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { NewsletterSection } from "@/components/sections/newsletter-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedPropertiesSection />
        <WhyChooseUsSection />
        <LatestPropertiesSection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
