import React, { createContext, useContext, useMemo, useState } from "react";
import type { LedgerEvent } from "../types/models";


function uuid() {
return (typeof crypto !== "undefined" && (crypto as any).randomUUID)
? (crypto as any).randomUUID()
: `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}


interface LedgerCtx {
events: LedgerEvent[];
balance: number;
deposit: (amount: number, ts?: string) => void;
withdraw: (amount: number, ts?: string) => void;
replay: () => boolean;
}


const Ctx = createContext<LedgerCtx | null>(null);


export function LedgerProvider({ children }: { children: React.ReactNode }) {
const [events, setEvents] = useState<LedgerEvent[]>([
{ id: uuid(), ts: new Date().toISOString(), kind: "DEPOSIT", amount: 500 },
{ id: uuid(), ts: new Date().toISOString(), kind: "WITHDRAW", amount: 120 },
]);


const balance = useMemo(
() => events.reduce((acc, e) => acc + (e.kind === "DEPOSIT" ? e.amount : -e.amount), 0),
[events]
);


function deposit(amount: number, ts?: string) {
setEvents((prev) => [
{ id: uuid(), ts: ts || new Date().toISOString(), kind: "DEPOSIT", amount: Math.max(1, amount) },
...prev,
]);
}


function withdraw(amount: number, ts?: string) {
setEvents((prev) => [
{ id: uuid(), ts: ts || new Date().toISOString(), kind: "WITHDRAW", amount: Math.max(1, amount) },
...prev,
]);
}


function replay() {
const recomputed = events.reduce((acc, e) => acc + (e.kind === "DEPOSIT" ? e.amount : -e.amount), 0);
return recomputed === balance;
}


return (
<Ctx.Provider value={{ events, balance, deposit, withdraw, replay }}>
{children}
</Ctx.Provider>
);
}


export function useLedger() {
const v = useContext(Ctx);
if (!v) throw new Error("useLedger must be used within LedgerProvider");
return v;
}