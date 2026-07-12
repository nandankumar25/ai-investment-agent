import { StateGraph } from "@langchain/langgraph";
import { StateAnnotation } from "./state.js";
import {
  resolveTickerNode,
  gatherFinancialsNode,
  gatherNewsNode,
  performAnalysisNode,
  makeDecisionNode
} from "./graphNodes.js";

// Initialize a new StateGraph with our state schema
const workflow = new StateGraph(StateAnnotation)
  // Define graph nodes
  .addNode("resolveTicker", resolveTickerNode)
  .addNode("gatherFinancials", gatherFinancialsNode)
  .addNode("gatherNews", gatherNewsNode)
  .addNode("performAnalysis", performAnalysisNode)
  .addNode("makeDecision", makeDecisionNode)

  // Configure sequential data pipeline flow
  .addEdge("__start__", "resolveTicker")
  .addEdge("resolveTicker", "gatherFinancials")
  .addEdge("gatherFinancials", "gatherNews")
  .addEdge("gatherNews", "performAnalysis")
  .addEdge("performAnalysis", "makeDecision")
  .addEdge("makeDecision", "__end__");

// Compile workflow to an executable runnable
export const researchAgentGraph = workflow.compile();
