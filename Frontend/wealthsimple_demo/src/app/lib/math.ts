import type { StreamEvent } from "../types/models";


export function buildHoldingsFromEvents(events: StreamEvent[]) {
const map = new Map<string, number>();
for (const e of events) {
if (e.kind === "BUY" && e.symbol && e.qty) {
map.set(e.symbol, (map.get(e.symbol) || 0) + e.qty);
}
if (e.kind === "SELL" && e.symbol && e.qty) {
map.set(e.symbol, Math.max(0, (map.get(e.symbol) || 0) - e.qty));
}
}
return Array.from(map.entries())
.filter(([, q]) => q > 0)
.map(([symbol, qty]) => ({ symbol, qty }));
}


export function valueHoldings(
holdings: { symbol: string; qty: number }[],
prices: Record<string, number>
) {
return holdings.reduce((sum, h) => sum + (prices[h.symbol] || 0) * h.qty, 0);
}