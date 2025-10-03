export function resolvePricesEndpoint(): string {
try {
// Vite-style env var
const viteVal = (import.meta as any)?.env?.VITE_PRICES_ENDPOINT;
if (viteVal) return String(viteVal);
} catch {}
// Global override
if (typeof window !== "undefined" && (window as any).__PRICES_ENDPOINT__) {
return String((window as any).__PRICES_ENDPOINT__);
}
return "/api/prices";
}