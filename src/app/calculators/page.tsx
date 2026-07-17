import { Metadata } from "next";
import { EmiCalculator } from "@/components/calculators/emi-calculator";
import { EligibilityCalculator } from "@/components/calculators/eligibility-calculator";

export const metadata: Metadata = {
  title: "Financial Calculators | Propex Properties",
  description: "Calculate your home loan EMI and check your loan eligibility with our interactive calculators.",
};

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Financial <span className="text-primary">Calculators</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Plan your property investment smartly. Use our interactive calculators to estimate your monthly EMI and check your home loan eligibility instantly.
          </p>
        </div>

        <div className="flex flex-col gap-16 max-w-5xl mx-auto">
          {/* EMI Calculator Section */}
          <section id="emi-calculator">
            <EmiCalculator />
          </section>

          {/* Eligibility Calculator Section */}
          <section id="eligibility-calculator">
            <EligibilityCalculator />
          </section>
        </div>
      </div>
    </div>
  );
}
