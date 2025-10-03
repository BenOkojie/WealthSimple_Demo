import type { LedgerEvent } from "../../app/types/models";


export default function HistoryTable({ events }: { events: LedgerEvent[] }) {
return (
<div className="rounded-2xl border bg-white p-4 shadow-sm">
<div className="mb-3">
<h3 className="text-lg font-semibold tracking-tight">Transaction History</h3>
<p className="text-sm text-neutral-500">Newest first (simulated)</p>
</div>
<table className="w-full text-left text-sm">
<thead className="text-xs text-neutral-500">
<tr>
<th className="py-2">Time</th>
<th className="py-2">Type</th>
<th className="py-2">Amount</th>
<th className="py-2">Note</th>
</tr>
</thead>
<tbody>
{events.map((e) => (
<tr key={e.id} className="border-t">
<td className="py-2 text-neutral-600">{new Date(e.ts).toLocaleString()}</td>
<td className="py-2">{e.kind}</td>
<td className="py-2 font-medium">${e.amount.toFixed(2)}</td>
<td className="py-2 text-neutral-500">—</td>
</tr>
))}
</tbody>
</table>
</div>
);
}