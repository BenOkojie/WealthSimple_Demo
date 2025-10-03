export default function CashForm({
kind,
amount,
setKind,
setAmount,
onSubmit,
}: {
kind: "DEPOSIT" | "WITHDRAW";
amount: number;
setKind: (v: "DEPOSIT" | "WITHDRAW") => void;
setAmount: (v: number) => void;
onSubmit: () => void;
}) {
return (
<div className="rounded-2xl border bg-white p-4 shadow-sm">
<div className="mb-3">
<h3 className="text-lg font-semibold tracking-tight">New Cash Transaction</h3>
<p className="text-sm text-neutral-500">Deposit or withdraw</p>
</div>
<div className="grid grid-cols-2 gap-3">
<div>
<label className="text-xs text-neutral-500">Type</label>
<select value={kind} onChange={(e) => setKind(e.target.value as any)} className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring">
<option value="DEPOSIT">DEPOSIT</option>
<option value="WITHDRAW">WITHDRAW</option>
</select>
</div>
<div>
<label className="text-xs text-neutral-500">Amount</label>
<input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value || "0"))} className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring" />
</div>
</div>
<button onClick={onSubmit} className="mt-3 w-full rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:opacity-90">Add Transaction</button>
</div>
);
}