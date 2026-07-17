"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle } from "lucide-react";

export function EligibilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(100000);
  const [existingEmi, setExistingEmi] = useState<number>(15000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  const { eligibleLoan, newEmi, isEligible, maxEmiCapacity } = useMemo(() => {
    // Basic FOIR (Fixed Obligation to Income Ratio) calculation
    // Usually banks allow 50% to 60% of net income for total EMIs. We'll use 50%.
    const FOIR = 0.50; 
    
    const maxEmiCapacity = (monthlyIncome * FOIR) - existingEmi;
    
    if (maxEmiCapacity <= 0) {
      return { eligibleLoan: 0, newEmi: 0, isEligible: false, maxEmiCapacity: 0 };
    }

    const R = interestRate / 12 / 100;
    const N = tenureYears * 12;

    // Max Loan (P) = Max EMI * ((1+R)^N - 1) / (R * (1+R)^N)
    const factor = Math.pow(1 + R, N);
    const eligibleLoan = (maxEmiCapacity * (factor - 1)) / (R * factor);

    return { 
      eligibleLoan, 
      newEmi: maxEmiCapacity, 
      isEligible: true,
      maxEmiCapacity
    };
  }, [monthlyIncome, existingEmi, interestRate, tenureYears]);

  const chartData = [
    { name: "Existing EMI", value: existingEmi, color: "#f43f5e" },
    { name: "New EMI Capacity", value: maxEmiCapacity > 0 ? maxEmiCapacity : 0, color: "#10b981" },
    { name: "Disposable Income", value: monthlyIncome - existingEmi - (maxEmiCapacity > 0 ? maxEmiCapacity : 0), color: "#3b82f6" },
  ];

  return (
    <Card className="w-full bg-card shadow-xl border-border overflow-hidden rounded-2xl">
      <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-border/50 p-6">
        <CardTitle className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Home Loan Eligibility
        </CardTitle>
        <p className="text-muted-foreground mt-2">Check how much loan you can comfortably afford.</p>
      </div>
      
      <CardContent className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Inputs Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Monthly Income</label>
                <span className="font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">
                  ₹{monthlyIncome.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min={20000}
                max={1000000}
                step={5000}
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Existing EMIs</label>
                <span className="font-bold text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full">
                  ₹{existingEmi.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={500000}
                step={1000}
                value={existingEmi}
                onChange={(e) => setExistingEmi(Number(e.target.value))}
                className="w-full accent-rose-500 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Interest Rate (% p.a.)</label>
                <span className="font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={15}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Loan Tenure (Years)</label>
                <span className="font-bold text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full">
                  {tenureYears} Years
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-indigo-500 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="flex flex-col items-center justify-center space-y-6 bg-muted/30 p-6 md:p-8 rounded-3xl border border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -z-10 transform translate-x-16 -translate-y-16"></div>
            
            {isEligible ? (
              <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full font-medium text-sm">
                <CheckCircle2 className="size-4" /> You are eligible
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 px-4 py-2 rounded-full font-medium text-sm">
                <XCircle className="size-4" /> Not eligible for additional loan
              </div>
            )}

            <div className="text-center space-y-2 w-full">
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Max Eligible Loan</p>
              <h3 className="text-4xl md:text-5xl font-extrabold text-foreground">
                ₹{Math.round(eligibleLoan).toLocaleString("en-IN")}
              </h3>
            </div>

            <div className="w-full h-40 md:h-52 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {chartData.filter(d => d.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Income</span>
                <span className="text-lg font-bold text-foreground">₹{Math.round(monthlyIncome / 1000)}k</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
              <div className="bg-background/80 backdrop-blur p-4 rounded-2xl border border-emerald-500/20 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground uppercase">Estimated EMI</span>
                </div>
                <p className="font-bold text-foreground text-lg text-emerald-500">
                  ₹{Math.round(newEmi).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-background/80 backdrop-blur p-4 rounded-2xl border border-rose-500/20 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground uppercase">Existing EMI</span>
                </div>
                <p className="font-bold text-foreground text-lg text-rose-500">
                  ₹{Math.round(existingEmi).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
