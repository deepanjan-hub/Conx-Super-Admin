import { useState, useEffect } from "react";
import { FlowNode, FlowTestMessage } from "./types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  RefreshCw,
  Send,
  ArrowRight,
  Bot,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface FlowLivePreviewProps {
  nodes: FlowNode[];
  onClose: () => void;
}

interface ExecutionStep {
  id: string;
  nodeId: string;
  nodeType: string;
  nodeLabel: string;
  message?: string;
  timestamp: string;
}

export function FlowLivePreview({ nodes, onClose }: FlowLivePreviewProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [userInput, setUserInput] = useState("");
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);

  const startPreview = () => {
    const startNode = nodes.find((n) => n.type === "start");
    if (!startNode) {
      toast.error("No start node found in the flow");
      return;
    }

    setIsRunning(true);
    setExecutionSteps([]);
    setCurrentNodeId(startNode.id);

    // Add start step
    const startStep: ExecutionStep = {
      id: `step-${Date.now()}`,
      nodeId: startNode.id,
      nodeType: startNode.type,
      nodeLabel: startNode.label,
      timestamp: new Date().toISOString(),
    };
    setExecutionSteps([startStep]);

    // Move to next node after delay
    setTimeout(() => processNode(startNode, [startStep]), 800);
  };

  const processNode = (node: FlowNode, currentSteps: ExecutionStep[]) => {
    if (node.connections.length === 0) {
      // End of flow
      setIsRunning(false);
      setCurrentNodeId(null);
      toast.success("Preview completed!");
      return;
    }

    const nextNodeId = node.connections[0].targetNodeId;
    const nextNode = nodes.find((n) => n.id === nextNodeId);
    if (!nextNode) {
      setIsRunning(false);
      return;
    }

    setCurrentNodeId(nextNodeId);

    const newStep: ExecutionStep = {
      id: `step-${Date.now()}`,
      nodeId: nextNode.id,
      nodeType: nextNode.type,
      nodeLabel: nextNode.label,
      timestamp: new Date().toISOString(),
    };

    // Add message content for message nodes
    if (nextNode.type === "message" && nextNode.data.message?.content) {
      newStep.message = nextNode.data.message.content;
    }

    const updatedSteps = [...currentSteps, newStep];
    setExecutionSteps(updatedSteps);

    // Handle different node types
    if (nextNode.type === "dtmf" || nextNode.type === "assistant") {
      setWaitingForInput(true);
      return;
    }

    if (nextNode.type === "end") {
      setIsRunning(false);
      setCurrentNodeId(null);
      toast.success("Preview completed!");
      return;
    }

    // Continue to next node
    setTimeout(() => processNode(nextNode, updatedSteps), 1000);
  };

  const handleUserInput = () => {
    if (!userInput.trim() || !isRunning) return;

    const currentNode = nodes.find((n) => n.id === currentNodeId);
    if (!currentNode) return;

    setWaitingForInput(false);
    setUserInput("");

    // Continue flow
    setTimeout(() => processNode(currentNode, executionSteps), 500);
  };

  const resetPreview = () => {
    setIsRunning(false);
    setExecutionSteps([]);
    setCurrentNodeId(null);
    setWaitingForInput(false);
    setUserInput("");
  };

  return (
    <div className="w-80 bg-card border-l flex flex-col shrink-0">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-primary" />
          <span className="font-semibold">Live Preview</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetPreview}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {executionSteps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Play className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              Click "Start Preview" to test your flow
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {executionSteps.map((step) => (
              <div key={step.id} className="space-y-2">
                {/* Node execution indicator */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="h-3 w-3" />
                  <span className="capitalize">{step.nodeType}:</span>
                  <span className="text-foreground">{step.nodeLabel}</span>
                </div>

                {/* Message bubble for message nodes */}
                {step.message && (
                  <div className="flex items-start gap-2 ml-5">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm max-w-[200px]">
                      {step.message}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Waiting for input indicator */}
            {waitingForInput && (
              <div className="flex items-center gap-2 text-sm text-primary animate-pulse">
                <ArrowRight className="h-3 w-3" />
                <span>Waiting for input...</span>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input / Start Button */}
      <div className="p-4 border-t">
        {!isRunning ? (
          <Button onClick={startPreview} className="w-full gap-2">
            <Play className="h-4 w-4" />
            Start Preview
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your response..."
              disabled={!waitingForInput}
              onKeyDown={(e) => e.key === "Enter" && handleUserInput()}
              className="flex-1"
            />
            <Button 
              onClick={handleUserInput} 
              disabled={!waitingForInput || !userInput.trim()}
              size="icon"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
