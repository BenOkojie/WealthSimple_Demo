import { useMemo } from "react";
import { buildHoldingsFromEvents } from "../lib/math";
import type { StreamEvent } from "../types/models";


export function useHoldings(streamEvents: StreamEvent[]) {
return useMemo(() => buildHoldingsFromEvents(streamEvents), [streamEvents]);
}