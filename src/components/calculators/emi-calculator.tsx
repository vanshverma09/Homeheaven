"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  const { emi, totalInterest, totalAmount } = useMemo(() => {
    const P = loanAmount;
    const R = interestRate / 12 / 100;
    const N = tenureYears * 12;

    if (P === 0 || R === 0 || N === 0) {
      return { emi: 0, totalInterest: 0, totalAmount: P };
    }

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalAmount = emi * N;
    const totalInterest = totalAmount - P;

    return { emi, totalInterest, totalAmount };
  }, [loanAmount, interestRate, tenureYears]);

  const chartData = [
    { name: "Principal Amount", value: loanAmount, color: "#10b981" },
    { name: "Total Interest", value: totalInterest, color: "#f59e0b" },
  ];

  return (
    <Card className="w-full bg-card shadow-xl border-border overflow-hidden rounded-2xl">
      <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border-b border-border/50 p-6">
        <CardTitle className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
          EMI Calculator
        </CardTitle>
        <p className="text-muted-foreground mt-2">Plan your home loan repayment easily.</p>
      </div>
      <CardContent className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Inputs Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Loan Amount</label>
                <span className="font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                  ₹{loanAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={50000000}
                step={50000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
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
                <span className="font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">
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
                className="w-full accent-blue-500 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="flex flex-col items-center justify-center space-y-8 bg-muted/30 p-6 md:p-8 rounded-3xl border border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -z-10 transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 p-32 bg-amber-500/5 rounded-full blur-3xl -z-10 transform -translate-x-16 translate-y-16"></div>
            
            <div className="text-center space-y-2 w-full">
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Monthly EMI</p>
              <h3 className="text-4xl md:text-5xl font-extrabold text-foreground">
                ₹{Math.round(emi).toLocaleString("en-IN")}
              </h3>
            </div>

            <div className="w-full h-48 md:h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
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
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Total</span>
                <span className="text-lg font-bold text-foreground">₹{Math.round(totalAmount / 100000)}L</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
              <div className="bg-background/80 backdrop-blur p-4 rounded-2xl border border-emerald-500/20 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="size-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-muted-foreground">Principal</span>
                </div>
                <p className="font-bold text-foreground">₹{Math.round(loanAmount).toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-background/80 backdrop-blur p-4 rounded-2xl border border-amber-500/20 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="size-3 rounded-full bg-amber-500" />
                  <span className="text-xs text-muted-foreground">Interest</span>
                </div>
                <p className="font-bold text-foreground">₹{Math.round(totalInterest).toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
