import { Annotation } from "@langchain/langgraph";

/**
 * Defines the state structure shared across all nodes in the LangGraph agent.
 */
export const StateAnnotation = Annotation.Root({
  // Input parameters
  companyName: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => "",
  }),
  
  // Ticker resolution data
  ticker: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
  tickerInfo: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),

  // Fetched raw statistics
  financials: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
  searchResults: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),
  newsResults: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),

  // Intermediate reasoning outputs
  analysis: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),

  // Final synthesized decision
  decision: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),

  // Incremental action logs that the UI can stream/render
  logs: Annotation({
    reducer: (a, b) => [...a, ...b],
    default: () => [],
  }),
});
