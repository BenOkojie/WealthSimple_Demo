import Chip from "../../components/Chip";


export default function TradeForm({
symbol,
setSymbol,
tradeKind,
setTradeKind,
qty,
setQty,
price,
setPrice,
ledgerBalance,
uiError,
uiNotice,
onSubmit,
}: {
symbol: string;
setSymbol: (v: string) => void;
tradeKind: "BUY" | "SELL";
setTradeKind: (v: "BUY" | "SELL") => void;
qty: number;
setQty: (v: number) => void;
price: number | "";
setPrice: (v: number | "") => void;
ledgerBalance: number;
uiError: string | null;
uiNotice: string | null;
onSubmit: () => void;
})
{
    return (
<div className="rounded-2xl border bg-white p-4 shadow-sm">
<div className="mb-3">
<h3 className="text-lg font-semibold tracking-tight">New Trade</h3>
<p className="text-sm text-neutral-500">Buy/Sell uses cash from Ledger</p>
</div>
<div className="mb-3 flex items-center gap-2 text-sm">
<Chip label="Portfolio Stream" />
<Chip label="Synced with Ledger" />
</div>
{uiError ? (
<div className="mb-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{uiError}</div>
) : null}
{uiNotice ? (
<div className="mb-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{uiNotice}</div>
) : null}


<div className="space-y-3">
<div className="grid grid-cols-3 gap-3">
<div className="col-span-3">
<label className="text-xs text-neutral-500">Symbol</label>
<input
value={symbol}
onChange={(e) => setSymbol(e.target.value.toUpperCase())}
className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
placeholder="AAPL"
/>
</div>
<div>
<label className="text-xs text-neutral-500">Kind</label>
<select
value={tradeKind}
onChange={(e) => setTradeKind(e.target.value as any)}
className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
>
<option>BUY</option>
<option>SELL</option>
</select>
</div>
<div>
<label className="text-xs text-neutral-500">Qty</label>
<input
type="number"
onChange={(e) => setQty(parseInt(e.target.value || "0", 10))}
className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
placeholder="AAPL"
/>
</div>
<div>
<label className="text-xs text-neutral-500">Kind</label>
<select
value={tradeKind}
onChange={(e) => setTradeKind(e.target.value as any)}
className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
>
<option>BUY</option>
<option>SELL</option>
</select>
</div>
<div>
<label className="text-xs text-neutral-500">Qty</label>
<input
type="number"
value={qty}
onChange={(e) => setQty(parseInt(e.target.value || "0", 10))}
className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
/>
</div>
<div>
<label className="text-xs text-neutral-500">Price (optional)</label>
<input
type="number"
value={price}
onChange={(e) => setPrice(e.target.value === "" ? "" : parseFloat(e.target.value))}
className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
/>
</div>
</div>


<button onClick={onSubmit} className="w-full rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:opacity-90">
Submit Trade
</button>
</div>


<div className="mt-6 rounded-xl border bg-neutral-50 p-3 text-sm">
<div className="flex items-center justify-between">
<span className="text-neutral-600">Available Cash (from Ledger)</span>
<span className="font-semibold">${ledgerBalance.toFixed(2)}</span>
</div>
</div>
</div>
);
}