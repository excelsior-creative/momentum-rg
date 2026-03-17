"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { ArrowRight, Calculator } from "lucide-react";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatCurrencyFull(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

export const MortgageCalculator = () => {
  const [homePrice, setHomePrice] = useState(750000);
  const [downPct, setDownPct] = useState(20);
  const [interestRate, setInterestRate] = useState(6.875);
  const [termYears, setTermYears] = useState(30);

  const calc = useMemo(() => {
    const downAmount = homePrice * (downPct / 100);
    const principal = homePrice - downAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = termYears * 12;

    const monthlyPayment =
      monthlyRate === 0
        ? principal / numPayments
        : (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPaid = monthlyPayment * numPayments;
    const totalInterest = totalPaid - principal;

    // Estimate monthly extras (rough averages for OC)
    const propertyTax = (homePrice * 0.011) / 12; // ~1.1% annually
    const insurance = homePrice * 0.005 / 12; // ~0.5% annually
    const pmi = downPct < 20 ? principal * 0.005 / 12 : 0; // ~0.5%/yr if < 20% down

    const totalMonthly = monthlyPayment + propertyTax + insurance + pmi;

    return {
      downAmount,
      principal,
      monthlyPayment,
      totalPaid,
      totalInterest,
      propertyTax,
      insurance,
      pmi,
      totalMonthly,
    };
  }, [homePrice, downPct, interestRate, termYears]);

  return (
    <section className="py-20 md:py-28 bg-charcoal">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: header + CTA */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-gold" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
                Mortgage Calculator
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-medium text-white">
              Estimate Your{" "}
              <span className="text-gold italic">Monthly Payment</span>
            </h2>
            <p className="text-white/60 mt-5 text-base leading-relaxed">
              Get a quick estimate based on current rates in Orange County.
              Every situation is unique — reach out and we&rsquo;ll help you
              understand how the numbers fit your broader real-estate goals.
            </p>

            {/* Results summary */}
            <div className="mt-8 space-y-4">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-white/50 text-xs font-display uppercase tracking-wider mb-1">
                  Est. Monthly Payment (P&amp;I)
                </p>
                <p className="font-heading text-4xl text-white font-medium">
                  {formatCurrencyFull(calc.monthlyPayment)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-white/40 text-xs font-display uppercase tracking-wider mb-1">
                    Total w/ Tax &amp; Ins.
                  </p>
                  <p className="text-white font-heading text-xl">
                    {formatCurrency(Math.round(calc.totalMonthly))}
                    <span className="text-white/40 text-xs">/mo</span>
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-white/40 text-xs font-display uppercase tracking-wider mb-1">
                    Total Interest Paid
                  </p>
                  <p className="text-white font-heading text-xl">
                    {formatCurrency(Math.round(calc.totalInterest))}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white/40 text-xs font-display uppercase tracking-wider mb-2">
                  Monthly Breakdown
                </p>
                <div className="space-y-1.5 text-sm">
                  {[
                    { label: "Principal & Interest", value: calc.monthlyPayment },
                    { label: "Property Tax (est.)", value: calc.propertyTax },
                    { label: "Homeowner's Insurance", value: calc.insurance },
                    ...(calc.pmi > 0 ? [{ label: "PMI (< 20% down)", value: calc.pmi }] : []),
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-white/70">
                      <span>{row.label}</span>
                      <span className="font-display font-medium text-white">
                        {formatCurrency(Math.round(row.value))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 bg-cta hover:bg-cta-light text-white font-display font-semibold uppercase tracking-wide px-8 py-3.5 rounded-xl transition-colors"
            >
              Talk With Our Team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: inputs */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-7">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-white/60 text-sm font-display font-semibold uppercase tracking-wider">
                  Home Price
                </label>
                <span className="text-gold font-heading text-xl font-medium">
                  {formatCurrency(homePrice)}
                </span>
              </div>
              <input
                type="range"
                min={200000}
                max={5000000}
                step={25000}
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full accent-brand h-2 cursor-pointer"
              />
              <div className="flex justify-between text-white/30 text-xs mt-1 font-display">
                <span>$200K</span>
                <span>$5M</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-white/60 text-sm font-display font-semibold uppercase tracking-wider">
                  Down Payment
                </label>
                <span className="text-gold font-heading text-xl font-medium">
                  {downPct}% ({formatCurrency(Math.round(homePrice * downPct / 100))})
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={50}
                step={1}
                value={downPct}
                onChange={(e) => setDownPct(Number(e.target.value))}
                className="w-full accent-brand h-2 cursor-pointer"
              />
              <div className="flex justify-between text-white/30 text-xs mt-1 font-display">
                <span>3%</span>
                <span>50%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-white/60 text-sm font-display font-semibold uppercase tracking-wider">
                  Interest Rate
                </label>
                <span className="text-gold font-heading text-xl font-medium">
                  {interestRate.toFixed(3)}%
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={10}
                step={0.125}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-brand h-2 cursor-pointer"
              />
              <div className="flex justify-between text-white/30 text-xs mt-1 font-display">
                <span>4%</span>
                <span>10%</span>
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm font-display font-semibold uppercase tracking-wider mb-3">
                Loan Term
              </label>
              <div className="flex gap-3">
                {[10, 15, 20, 30].map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setTermYears(y)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-display font-semibold transition-all border ${
                      termYears === y
                        ? "bg-cta border-cta text-white"
                        : "bg-white/5 border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    {y}yr
                  </button>
                ))}
              </div>
            </div>

            <p className="text-white/30 text-xs leading-relaxed">
              * Estimates for illustration only. Property tax at 1.1%, insurance at 0.5%.
              Actual rates vary. Contact us for a personalized quote.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};
