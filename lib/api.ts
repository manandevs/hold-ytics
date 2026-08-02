import { Market } from "@/types/market";

const API_URL = "https://gamma-api.polymarket.com/markets";

export async function getMarkets(limit: number = 20): Promise<Market[]> {
  try {
    const res = await fetch(`${API_URL}?active=true&closed=false&limit=${limit}`, {
      next: { revalidate: 30 }, 
    });
    
    if (!res.ok) throw new Error("Failed to fetch markets");
    
    return await res.json();
  } catch (error) {
    console.error("API Error (getMarkets):", error);
    return [];
  }
}

export async function getMarketById(id: string): Promise<Market | null> {
  try {
    // The cURL command shows the endpoint is /markets/{id}
    const res = await fetch(`${API_URL}/${id}`, {
      next: { revalidate: 30 },
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    
    // Safety check: Handle both possible Polymarket API responses (Array or single Object)
    if (Array.isArray(data)) {
      return data.length > 0 ? data[0] : null;
    } else if (data && typeof data === 'object' && data.id) {
      return data as Market;
    }
    
    return null;
  } catch (error) {
    console.error("API Error (getMarketById):", error);
    return null;
  }
}
