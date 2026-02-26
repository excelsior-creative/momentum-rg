"use client";

import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionReveal } from './SectionReveal';
import { ArrowRight, RefreshCw, Calculator } from 'lucide-react';
import { Button } from './ui/button';

export const CalculatorSection: React.FC = () => {
  const [propertyValue, setPropertyValue] = useState<number>(2500000);
  const [propertyType, setPropertyType] = useState<'commercial' | 'residential'>('commercial');

  const chartData = useMemo(() => {
    const data = [];
    const depreciationYears = propertyType === 'commercial' ? 39 : 27.5;
    const standardRate = 1 / depreciationYears;
    
    // Cost Seg assumption: ~30% reclassified to 5/7/15 year property
    // With 100% bonus depreciation, that 30% is taken in Year 1
    const costSegReclass = 0.30; 
    
    let cumulativeStandard = 0;
    let cumulativeSpecialized = 0;

    for (let year = 1; year <= 5; year++) {
      // Standard calculation (straight line)
      const annualStandard = propertyValue * standardRate;
      cumulativeStandard += annualStandard;

      // Specialized calculation (Bonus Depreciation Scenario)
      let annualSpecialized = 0;
      if (year === 1) {
         // Year 1 takes the full reclassified amount immediately (Bonus Dep) + standard on remainder
         annualSpecialized = (propertyValue * costSegReclass) + ((propertyValue * (1 - costSegReclass)) * standardRate);
      } else {
         // Subsequent years just depreciate the building shell
         annualSpecialized = (propertyValue * (1 - costSegReclass)) * standardRate;
      }
      cumulativeSpecialized += annualSpecialized;

      data.push({
        name: `Year ${year}`,
        standard: Math.round(cumulativeStandard),
        specialized: Math.round(cumulativeSpecialized),
      });
    }
    return data;
  }, [propertyValue, propertyType]);

  const year1Savings = chartData[0].specialized - chartData[0].standard;
  const taxRate = 0.35; // Assumed tax rate
  const cashBenefit = Math.round(year1Savings * taxRate);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <section className="py-24 bg-sta-navy relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sta-navy-light/30 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
           <SectionReveal>
             <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-6 ring-1 ring-white/10">
               <Calculator className="text-sta-green mr-2" size={20}/>
               <span className="text-gray-300 font-medium">Interactive Savings Estimator</span>
             </div>
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Calculate Your Potential Savings</h2>
             <p className="text-gray-300 text-lg leading-relaxed">
               See how Cost Segregation and Bonus Depreciation can dramatically increase your cash flow in the first year.
             </p>
           </SectionReveal>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls Panel */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <SectionReveal className="bg-white rounded-2xl p-8 shadow-2xl h-full flex flex-col justify-between relative overflow-hidden group text-left">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sta-green to-sta-navy"></div>
               
               <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Property Type</label>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                       <button 
                          onClick={() => setPropertyType('commercial')}
                          className={`flex-1 py-3 px-4 rounded-md text-sm font-bold transition-all ${propertyType === 'commercial' ? 'bg-white text-sta-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          Commercial
                       </button>
                       <button 
                          onClick={() => setPropertyType('residential')}
                          className={`flex-1 py-3 px-4 rounded-md text-sm font-bold transition-all ${propertyType === 'residential' ? 'bg-white text-sta-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          Residential
                       </button>
                    </div>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex justify-between">
                        <span>Purchase Price</span>
                        <span className="text-sta-navy">{formatCurrency(propertyValue)}</span>
                     </label>
                     <div className="relative pt-6 pb-2">
                        <input 
                           type="range" 
                           min="500000" 
                           max="10000000" 
                           step="100000"
                           value={propertyValue}
                           onChange={(e) => setPropertyValue(Number(e.target.value))}
                           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sta-green transition-all"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                           <span>$500k</span>
                           <span>$10M+</span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-sta-navy/5 rounded-xl p-6 border border-sta-navy/10">
                     <p className="text-sm text-gray-600 mb-1">Estimated Year 1 Cash Benefit</p>
                     <p className="text-4xl font-bold text-sta-green tracking-tight">{formatCurrency(cashBenefit)}</p>
                     <p className="text-xs text-gray-500 mt-2">*Based on typical industry benchmarks</p>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-gray-100">
                  <Button className="w-full bg-sta-green text-sta-navy hover:bg-sta-green-light font-bold h-14 text-lg border-none">
                     Get Full Analysis
                     <ArrowRight size={18} className="ml-2" />
                  </Button>
               </div>
            </SectionReveal>
          </div>

          {/* Chart Panel */}
          <div className="lg:col-span-8">
             <SectionReveal delay={200} className="h-full min-h-[500px] bg-sta-navy-dark/50 rounded-2xl p-6 md:p-10 border border-white/10 shadow-2xl backdrop-blur-sm flex flex-col text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                   <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <RefreshCw size={18} className="text-sta-green" /> 
                      Cumulative Depreciation Deduction
                   </h3>
                   <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                         <span className="w-3 h-3 rounded-full bg-sta-green"></span>
                         <span className="text-gray-300">Specialized</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                         <span className="text-gray-300">Standard</span>
                      </div>
                   </div>
                </div>

                <div className="flex-grow w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSpecialized" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8dc63e" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8dc63e" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorStandard" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                        <XAxis 
                           dataKey="name" 
                           stroke="#9ca3af" 
                           tick={{fill: '#9ca3af', fontSize: 12}} 
                           tickLine={false} 
                           axisLine={false} 
                           dy={10}
                        />
                        <YAxis 
                           hide={false} 
                           stroke="#9ca3af"
                           tickFormatter={(value) => `$${value / 1000}k`}
                           tick={{fill: '#9ca3af', fontSize: 12}}
                           tickLine={false}
                           axisLine={false}
                        />
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#003566', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }} 
                           itemStyle={{ color: '#fff', paddingTop: '4px' }}
                           formatter={(value) => formatCurrency(typeof value === 'number' ? value : 0)}
                        />
                        <Area 
                           type="monotone" 
                           dataKey="specialized" 
                           stroke="#8dc63e" 
                           fillOpacity={1} 
                           fill="url(#colorSpecialized)" 
                           strokeWidth={3}
                           animationDuration={1500}
                        />
                        <Area 
                           type="monotone" 
                           dataKey="standard" 
                           stroke="#9ca3af" 
                           fillOpacity={1} 
                           fill="url(#colorStandard)" 
                           strokeWidth={2}
                           strokeDasharray="5 5"
                           animationDuration={1500}
                        />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </SectionReveal>
          </div>

        </div>
      </div>
    </section>
  );
};
