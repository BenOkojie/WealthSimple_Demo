import Chip from "../../components/Chip";
import type { StreamEvent } from "../../app/types/models";


export default function EventFeed({ events }: { events: StreamEvent[] }) {
const rows = events.filter((e) => e.kind === "BUY" || e.kind === "SELL");
return (
<div className="rounded-2xl border bg-white p-4 shadow-sm">
<div className="mb-3">
<h3 className="text-lg font-semibold tracking-tight">Live Event Feed</h3>
<p className="text-sm text-neutral-500">Newest first (BUY/SELL only)</p>
</div>
<ul className="divide-y">
{rows.map((e) => (
<li key={e.id} className="py-3">
<div className="flex items-start justify-between">
<div>
<p className="text-sm font-medium">
{e.kind} {e.qty} {e.symbol} {e.price ? <>@ ${e.price}</> : null}
</p>
<p className="text-xs text-neutral-500">{new Date(e.ts).toLocaleString()}</p>
</div>
<Chip label={e.kind} />
</div>
</li>
))}
</ul>
</div>
);
}