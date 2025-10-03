import { useState } from "react";
import { useLedger } from "../../app/providers/LedgerProvider";
import BalanceCard from "./BalanceCard";
import CashForm from "./CashForm";
import HistoryTable from "./HistoryTable";


export default function LedgerPanel() {
const { events, balance, deposit, withdraw, replay } = useLedger();
const [kind, setKind] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");
const [amount, setAmount] = useState(100);


function submitCash() {
if (kind === "DEPOSIT") deposit(amount);
else withdraw(amount);
}


return (
<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
<div className="space-y-6 md:col-span-1">
<BalanceCard balance={balance} onReplay={() => alert(`Replay ${replay() ? "verified ✅" : "mismatch ❌"}`)} />
<CashForm kind={kind} amount={amount} setKind={setKind} setAmount={setAmount} onSubmit={submitCash} />
</div>
<div className="md:col-span-2">
<HistoryTable events={events} />
</div>
</div>
);
}