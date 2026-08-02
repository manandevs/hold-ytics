"use client";
import { useState, useEffect } from "react";
import { Market } from "@/types/market";

export function useMarkets(initialMarkets: Market[] = [], limit: number = 20) {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [loading, setLoading] = useState<boolean>(!initialMarkets.length);

  useEffect(() => {
    let isMounted = true;

    const fetchLiveMarkets = async () => {
      try {
        const res = await fetch(`/api/markets?limit=${limit}`);
        if (!res.ok) return;
        const data: Market[] = await res.json();
        
        if (isMounted) {
          setMarkets(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    // If no initial data, fetch immediately
    if (!initialMarkets.length) fetchLiveMarkets();

    // Poll every 15 seconds
    const interval = setInterval(fetchLiveMarkets, 15000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [limit, initialMarkets.length]);

  return { markets, loading };
}