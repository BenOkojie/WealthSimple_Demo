import type { PricesMap } from "../../app/types/models";


export default function HoldingsTable({
holdings,
prices,
loading,
error,
lastUpdated,
onRefresh,
}: {
holdings: { symbol: string; qty: number }[];
prices: PricesMap;
loading: boolean;
error: string | null;
lastUpdated?: string;
onRefresh: () => void;
})
{
    const total = holdings.reduce((sum, h) => sum + (prices[h.symbol] || 0) * h.qty, 0);
return (
<div className="rounded-2xl border bg-white p-4 shadow-sm">
<div className="mb-2 flex items-center justify-between">
<div>
<h3 className="text-lg font-semibold tracking-tight">Holdings & Portfolio Valuation</h3>
<p className="text-sm text-neutral-500">Prices from yfinance-backed API</p>
</div>
<div className="flex items-center gap-2">
<button onClick={onRefresh} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
{loading ? "Refreshing…" : "Refresh Prices"}
</button>
</div>
</div>


{error ? (
<div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
) : null}


<div className="mb-3 text-sm text-neutral-500">
Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "—"}
</div>


<table className="w-full text-left text-sm">
<thead className="text-xs text-neutral-500">
<tr>
<th className="py-2">Symbol</th>
<th className="py-2">Qty</th>
<th className="py-2">Price</th>
<th className="py-2">Market Value</th>
</tr>
</thead>
<tbody>
{holdings.length === 0 ? (
<tr>
<td className="py-4 text-neutral-500" colSpan={4}>No holdings yet. Buy something to see valuation.</td>
</tr>
) : (
holdings.map((h) => {
const p = prices[h.symbol] || 0;
const mv = p * h.qty;
return (
<tr key={h.symbol} className="border-t">
<td className="py-2 font-medium">{h.symbol}</td>
<td className="py-2">{h.qty}</td>
<td className="py-2">{p ? `$${p.toFixed(2)}` : "—"}</td>
<td className="py-2">{p ? `$${mv.toFixed(2)}` : "—"}</td>
</tr>
);
})
)}
</tbody>
{holdings.length > 0 ? (
<tfoot>
<tr className="border-t">
<td className="py-2 font-medium" colSpan={3}>Portfolio Market Value</td>
<td className="py-2 font-semibold">${total.toFixed(2)}</td>
</tr>
</tfoot>
) : null}
</table>
</div>
);
}