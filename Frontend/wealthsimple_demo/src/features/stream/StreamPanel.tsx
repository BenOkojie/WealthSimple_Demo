import React, { useMemo, useState } from "react";
import type { StreamEvent } from "../../app/types/models";
import { useLedger } from "../../app/providers/LedgerProvider";
import { usePrices } from "../../app/providers/PricesProvider";
import { useHoldings } from "../../app/hooks/useHoldings";
import TradeForm from "./TradeForm";
import EventFeed from "./EventFeed";
import HoldingsTable from "./HoldingsTable";

function uuid() {
return (typeof crypto !== "undefined" && (crypto as any).randomUUID)
? (crypto as any).randomUUID()
: `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}


export default function StreamPanel() {
// Local stream state
const [symbol, setSymbol] = useState("AAPL");
const [tradeKind, setTradeKind] = useState<"BUY" | "SELL">("BUY");
const [qty, setQty] = useState(1);
const [price, setPrice] = useState<number | "">("");
const [events, setEvents] = useState<StreamEvent[]>([
{ id: uuid(), ts: new Date().toISOString(), kind: "BUY", symbol: "AAPL", qty: 2, price: 195 },
]);
const holdings = useHoldings(events);
const { prices, refresh, loading, error } = usePrices();
const { balance, deposit, withdraw } = useLedger();


const holdingsKey = useMemo(() => holdings.map((h) => h.symbol).sort().join(","), [holdings]);
React.useEffect(() => {
refresh(holdings.map((h) => h.symbol));
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [holdingsKey]);


const [uiError, setUiError] = useState<string | null>(null);
const [uiNotice, setUiNotice] = useState<string | null>(null);


function submitTrade() {
setUiError(null);
setUiNotice(null);
const upper = symbol.toUpperCase();
const qtyNum = Math.max(1, Number(qty) || 0);
const execPrice = typeof price === "number" && price > 0 ? price : (prices[upper] || 0);


if (tradeKind === "BUY") {
if (execPrice <= 0) return setUiError("No valid price. Enter a Price or Refresh Prices.");
const cost = +(execPrice * qtyNum).toFixed(2);
if (balance < cost) return setUiError(`Insufficient cash: need $${cost.toFixed(2)}, have $${balance.toFixed(2)}.`);
const trade: StreamEvent = { id: uuid(), ts: new Date().toISOString(), kind: "BUY", symbol: upper, qty: qtyNum, price: execPrice };
setEvents((prev) => [trade, ...prev].slice(0, 50));
withdraw(cost, trade.ts);
setUiNotice(`Bought ${qtyNum} ${upper} @ $${execPrice.toFixed(2)} (−$${cost.toFixed(2)}).`);
return;
}
if (tradeKind === "SELL") {
const usePrice = execPrice > 0 ? execPrice : 0;
const proceeds = +(usePrice * qtyNum).toFixed(2);
const trade: StreamEvent = { id: uuid(), ts: new Date().toISOString(), kind: "SELL", symbol: upper, qty: qtyNum, price: usePrice || undefined };
setEvents((prev) => [trade, ...prev].slice(0, 50));
if (proceeds > 0) deposit(proceeds, trade.ts);
setUiNotice(
usePrice > 0
? `Sold ${qtyNum} ${upper} @ $${usePrice.toFixed(2)} (+$${proceeds.toFixed(2)}).`
: `Recorded SELL ${qtyNum} ${upper}. No price provided, cash unchanged.`
);
return;
}
}


return (
<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
<div className="md:col-span-1">
<TradeForm
symbol={symbol}
setSymbol={setSymbol}
tradeKind={tradeKind}
setTradeKind={setTradeKind}
qty={qty}
setQty={setQty}
price={price}
setPrice={setPrice}
ledgerBalance={balance}
uiError={uiError}
uiNotice={uiNotice}
onSubmit={submitTrade}
/>
</div>
<div className="md:col-span-2 space-y-6">
<EventFeed events={events} />
<HoldingsTable
holdings={holdings}
prices={prices}
loading={loading}
error={error}
lastUpdated={prices._ts}
onRefresh={() => refresh(holdings.map((h) => h.symbol))}
/>
</div>
</div>
);
}