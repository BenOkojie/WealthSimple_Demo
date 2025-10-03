export default function BalanceCard({ balance, onReplay }: { balance: number; onReplay: () => void }) {
return (
<div className="rounded-2xl border bg-white p-4 shadow-sm">
<div className="mb-3">
<h3 className="text-lg font-semibold tracking-tight">Current Balance</h3>
<p className="text-sm text-neutral-500">Auto-updated as events arrive</p>
</div>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-semibold">${balance.toFixed(2)}</span>
<span className="text-xs text-neutral-500">CAD</span>
</div>
<div className="mt-4 flex items-center gap-2">
<button onClick={onReplay} className="flex-1 rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50">Replay & Verify</button>
</div>
</div>
);
}