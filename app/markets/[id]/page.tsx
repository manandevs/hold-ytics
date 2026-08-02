import { notFound } from "next/navigation";
import { getMarketById } from "@/lib/api";
import MarketDetailClient from "@/components/MarketDetailClient";

export const revalidate = 30; // Re-fetch every 30s

export default async function MarketDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  
  if (!resolvedParams?.id) {
    return notFound();
  }

  const market = await getMarketById(resolvedParams.id);

  if (!market) {
    return notFound();
  }

  return <MarketDetailClient market={market} />;
}
