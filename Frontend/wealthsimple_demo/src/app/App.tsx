import { useState } from "react";
import { PricesProvider, usePrices } from "./providers/PricesProvider";
import { LedgerProvider, useLedger } from "./providers/LedgerProvider";
import { TABS } from "./types/models";
import type { Tab } from "./types/models";
import TopBar from "../components/TopBar";
import StreamPanel from "../features/stream/StreamPanel";
import LedgerPanel from "../features/ledger/LedgerPanel";


function Shell() {
const [tab, setTab] = useState<Tab>("Stream");
const [accountId, setAccountId] = useState("acc-001");
const { balance } = useLedger();
const { endpoint, setEndpointOverride } = usePrices();


return (
<div className="min-h-screen bg-neutral-50 text-neutral-900">
<TopBar
balance={balance}
accountId={accountId}
onAccountChange={setAccountId}
endpoint={endpoint}
onEndpointChange={setEndpointOverride}
/>
<main className="mx-auto max-w-6xl px-4 py-6">
<div className="mx-auto mb-4 inline-flex gap-1 rounded-2xl border bg-white p-1">
{TABS.map((t) => (
<button key={t} onClick={() => setTab(t)} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === t ? "bg-black text-white" : "text-neutral-600 hover:bg-neutral-100"}`}>
{t}
</button>
))}
</div>
{tab === "Stream" ? <StreamPanel /> : <LedgerPanel />}
</main>
<footer className="mx-auto max-w-6xl px-4 pb-10 pt-6 text-center text-xs text-neutral-500">
UI mock only • Replace local state with your AWS endpoints (SQS → MSK → S3). Prices use a runtime-safe endpoint.
</footer>
</div>
);
}


export default function App() {
return (
<PricesProvider>
<LedgerProvider>
<Shell />
</LedgerProvider>
</PricesProvider>
);

}