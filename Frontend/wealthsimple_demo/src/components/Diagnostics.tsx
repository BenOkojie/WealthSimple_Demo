export type TestResult = { name: string; pass: boolean; details?: string };


export default function Diagnostics({ tests, onRun }: { tests: TestResult[]; onRun: () => void }) {
return (
<div className="rounded-2xl border bg-white p-4 shadow-sm">
<div className="mb-2 flex items-center justify-between">
<div>
<h3 className="text-lg font-semibold tracking-tight">Diagnostics</h3>
<p className="text-sm text-neutral-500">Ad-hoc tests for logic & config</p>
</div>
<button onClick={onRun} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">Run Tests</button>
</div>
{tests.length === 0 ? (
<p className="text-sm text-neutral-500">No tests run yet.</p>
) : (
<ul className="space-y-2 text-sm">
{tests.map((t, i) => (
<li key={i} className={`rounded-xl border px-3 py-2 ${t.pass ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
<div className="flex items-center justify-between">
<span className="font-medium">{t.name}</span>
<span>{t.pass ? 'PASS ✅' : 'FAIL ❌'}</span>
</div>
{t.details ? <div className="mt-1 text-xs opacity-80">{t.details}</div> : null}
</li>
))}
</ul>
)}
</div>
);
}