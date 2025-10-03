import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { PricesMap } from "../types/models";
import { resolvePricesEndpoint } from "../lib/endpoint";

interface PricesCtx {
prices: PricesMap;
loading: boolean;
error: string | null;
lastUpdated?: string;
refresh: (symbols: string[]) => Promise<void>;
setEndpointOverride: (v: string) => void;
endpoint: string;
}


const Ctx = createContext<PricesCtx | null>(null);


export function PricesProvider({ children }: { children: React.ReactNode }) {
const [endpointOverride, setEndpointOverride] = useState("");
const endpoint = useMemo(
() => (endpointOverride || resolvePricesEndpoint()).trim(),
[endpointOverride]
);


const [prices, setPrices] = useState<PricesMap>({});
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);


const refresh = useCallback(async (symbols: string[]) => {
if (!symbols.length) return setPrices({});
try {
setLoading(true);
setError(null);
const uniq = Array.from(new Set(symbols));
const url = `${endpoint}?symbols=${encodeURIComponent(uniq.join(","))}`;
const res = await fetch(url);
if (!res.ok) throw new Error(`Price API ${res.status}`);
const data = (await res.json()) as PricesMap;
setPrices(data);
} catch (e: any) {
setError(e.message || "Failed to load prices");
} finally {
setLoading(false);
}
}, [endpoint]);


const value: PricesCtx = {
prices,
loading,
error,
lastUpdated: prices._ts,
refresh,
setEndpointOverride,
endpoint,
};


return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}


export function usePrices() {
const v = useContext(Ctx);
if (!v) throw new Error("usePrices must be used within PricesProvider");
return v;
}