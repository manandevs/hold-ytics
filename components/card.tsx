import React from 'react';
import Link from 'next/link';
import { Market } from '@/types/market';
import { cn } from '@/lib/cn';

interface MarketCardProps {
  market: Market;
}

export default function Card({ market }: MarketCardProps) {
  let outcomes: string[] = [];
  let prices: string[] = [];

  try {
    outcomes = JSON.parse(market.outcomes || "[]");
    prices = JSON.parse(market.outcomePrices || "[]");
  } catch (error) {
    console.error("Failed to parse outcomes for market:", market.id);
  }

  const volumeStr = parseFloat(market.volume || "0").toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return (
    <Link href={`/markets/${market.id}`} className="group block h-full">
      <div className="h-full rounded-2xl bg-white shadow-[rgba(60,64,67,0.3)_0_1px_2px_0,rgba(60,64,67,0.15)_0_2px_6px_2px] w-full flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        
        {/* Header Image & Category */}
        <div className="w-full h-40 bg-zinc-50 relative flex items-center justify-center p-4 border-b border-zinc-100 overflow-hidden">
          {market.category && (
            <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur border border-zinc-200 shadow-sm text-zinc-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {market.category}
            </div>
          )}
          {market.image ? (
            <img
              src={market.image}
              alt={market.question}
              className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-16 h-16 bg-zinc-200 rounded-full animate-pulse" />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 relative">
          <h5 className="text-[15px] font-bold mb-4 text-zinc-900 line-clamp-3 leading-snug group-hover:text-blue-600 transition-colors">
            {market.question}
          </h5>

          <div className="mt-auto space-y-4">
            {/* Live Odds */}
            {outcomes.length > 0 && (
              <div className="flex gap-2 w-full">
                {outcomes.slice(0, 2).map((outcome, i) => {
                  const isYes = outcome.toLowerCase() === 'yes';
                  const isNo = outcome.toLowerCase() === 'no';
                  
                  return (
                    <div 
                      key={outcome} 
                      className={cn(
                        "flex-1 border rounded-lg py-2 px-1 text-center flex flex-col transition-colors",
                        isYes ? "bg-green-50/50 border-green-200 group-hover:border-green-400" :
                        isNo ? "bg-red-50/50 border-red-200 group-hover:border-red-400" :
                        "bg-zinc-50 border-zinc-200 group-hover:border-zinc-300"
                      )}
                    >
                      <span className={cn(
                        "text-[11px] font-bold uppercase tracking-wide mb-0.5",
                        isYes ? "text-green-700" : isNo ? "text-red-700" : "text-zinc-500"
                      )}>
                        {outcome}
                      </span>
                      <span className="text-sm font-extrabold text-zinc-900 transition-colors duration-300">
                        {prices[i] ? `${Math.round(parseFloat(prices[i]) * 100)}%` : '0%'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer Stats */}
            <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 border-t border-zinc-100 pt-3 mt-1">
              <span>Vol: {volumeStr}</span>
              <span>{new Date(market.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
