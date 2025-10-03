// import Chip from "./Chip";

export default function TopBar({
  balance,
  accountId,
  onAccountChange,
  endpoint,
  onEndpointChange,
}: {
  balance: number;
  accountId: string;
  onAccountChange: (id: string) => void;
  endpoint: string;
  onEndpointChange: (v: string) => void;
}) {
  // Optional: proper CAD currency formatting (safer than manual "$" concatenation)
  const formattedBalance = Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2,
  }).format(balance ?? 0);

  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-black" />
          <div>
            <h1 className="text-base font-semibold leading-tight">FinStream Demo</h1>
            <p className="text-xs text-neutral-500">Portfolio Stream + Ledger Replay</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="hidden md:flex items-center gap-2 rounded-xl border px-3 py-1.5 bg-neutral-50">
            <span className="text-neutral-500">Balance</span>
            {/* FIX: use a JSX expression, not `${ ... }` */}
            <span className="font-semibold">{formattedBalance}</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-neutral-500">Account</label>
            <input
              value={accountId}
              onChange={(e) => onAccountChange(e.target.value)}
              className="w-36 rounded-xl border px-3 py-1.5 text-sm outline-none focus:ring"
            />
          </div>
        </div>
      </div>

      <nav className="mx-auto max-w-6xl px-4 pb-2">
        <div className="flex items-center justify-end gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500">Prices endpoint</span>
            <input
              placeholder="/api/prices"
              value={endpoint}
              onChange={(e) => onEndpointChange(e.target.value)}
              className="w-80 rounded-xl border px-3 py-1.5 outline-none focus:ring"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
