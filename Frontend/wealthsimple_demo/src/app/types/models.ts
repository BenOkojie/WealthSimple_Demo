export const TABS = ["Stream", "Ledger"] as const;
export type Tab = typeof TABS[number];


export type StreamEvent = {
id: string;
ts: string; // ISO string
kind: "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW";
symbol?: string;
qty?: number;
price?: number; // execution/limit price (optional)
amount?: number; // for deposit/withdraw
};


export type LedgerEvent = {
id: string;
ts: string;
kind: "DEPOSIT" | "WITHDRAW";
amount: number;
};


export type PricesMap = Record<string, number> & { _ts?: string };