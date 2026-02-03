import { useState } from "react";
import { FlowNode, FlowTestMessage, FlowTestSession } from "./types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Square,
  RefreshCw,
  Send,
  Phone,
  Keyboard,
  Bot,
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

interface FlowTestPanelProps {
  nodes: FlowNode[];
  isOpen: boolean;
  onClose: () => void;
  onHighlightNode: (nodeId: string | null) => void;
}

export function FlowTestPanel({
  nodes,
  isOpen,
  onClose,
  onHighlightNode,
}: FlowTestPanelProps) {
  const [session, setSession] = useState<FlowTestSession | null>(null);
  const [userInput, setUserInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const startTest = () => {
    const startNode = nodes.find((n) => n.type === "start");
    if (!startNode) {
      toast.error("No start node found in the flow");
      return;
    }

    const newSession: FlowTestSession = {
      id: `session-${Date.now()}`,
      flowId: "current",
      status: "running",
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: "system",
          content: "Test session started. Simulating conversation flow...",
          timestamp: new Date().toISOString(),
        },
      ],
      currentNodeId: startNode.id,
      startedAt: new Date().toISOString(),
      variables: {},
    };

    setSession(newSession);
    setIsRunning(true);
    onHighlightNode(startNode.id);

    // Simulate moving to next node
    setTimeout(() => simulateNextNode(newSession, startNode), 1000);
  };

  const simulateNextNode = (currentSession: FlowTestSession, currentNode: FlowNode) => {
    if (currentNode.connections.length === 0) {
      // End of flow
      setSession({
        ...currentSession,
        status: "completed",
        endedAt: new Date().toISOString(),
        messages: [
          ...currentSession.messages,
          {
            id: `msg-${Date.now()}`,
            role: "system",
            content: "Flow completed successfully.",
            timestamp: new Date().toISOString(),
          },
        ],
      });
      setIsRunning(false);
      onHighlightNode(null);
      toast.success("Test completed successfully!");
      return;
    }

    const nextNodeId = currentNode.connections[0].targetNodeId;
    const nextNode = nodes.find((n) => n.id === nextNodeId);
    if (!nextNode) return;

    onHighlightNode(nextNodeId);

    let newMessage: FlowTestMessage | null = null;

    switch (nextNode.type) {
      case "message":
        newMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: nextNode.data.message?.content || "Hello, how can I help you?",
          timestamp: new Date().toISOString(),
          nodeId: nextNode.id,
        };
        break;
      case "assistant":
        newMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: `[AI Assistant: ${nextNode.label}] I'm here to help you with your inquiry.`,
          timestamp: new Date().toISOString(),
          nodeId: nextNode.id,
        };
        break;
      case "dtmf":
        newMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: nextNode.data.dtmf?.prompt || "Please press a key to continue.",
          timestamp: new Date().toISOString(),
          nodeId: nextNode.id,
        };
        // Wait for DTMF input
        setSession((prev) =>
          prev
            ? {
                ...prev,
                currentNodeId: nextNode.id,
                messages: [...prev.messages, newMessage!],
              }
            : null
        );
        return; // Don't auto-advance
      case "api":
        newMessage = {
          id: `msg-${Date.now()}`,
          role: "system",
          content: `[API Call] ${nextNode.data.api?.method} ${nextNode.data.api?.url}`,
          timestamp: new Date().toISOString(),
          nodeId: nextNode.id,
        };
        break;
      case "condition":
        newMessage = {
          id: `msg-${Date.now()}`,
          role: "system",
          content: `[Condition] Evaluating: ${nextNode.data.conditions?.[0]?.expression || "default branch"}`,
          timestamp: new Date().toISOString(),
          nodeId: nextNode.id,
        };
        break;
      case "transfer":
        newMessage = {
          id: `msg-${Date.now()}`,
          role: "system",
          content: "[Transfer] Transferring to human agent...",
          timestamp: new Date().toISOString(),
          nodeId: nextNode.id,
        };
        break;
      case "end":
        newMessage = {
          id: `msg-${Date.now()}`,
          role: "system",
          content: "Conversation ended.",
          timestamp: new Date().toISOString(),
          nodeId: nextNode.id,
        };
        setSession((prev) =>
          prev
            ? {
                ...prev,
                status: "completed",
                endedAt: new Date().toISOString(),
                messages: [...prev.messages, newMessage!],
              }
            : null
        );
        setIsRunning(false);
        onHighlightNode(null);
        toast.success("Test completed!");
        return;
    }

    if (newMessage) {
      const updatedSession: FlowTestSession = {
        ...currentSession,
        currentNodeId: nextNode.id,
        messages: [...currentSession.messages, newMessage],
      };
      setSession(updatedSession);

      // Continue to next node after delay (dtmf case returns early above)
      setTimeout(() => simulateNextNode(updatedSession, nextNode), 1500);
    }
  };

  const handleUserInput = () => {
    if (!userInput.trim() || !session || !isRunning) return;

    const currentNode = nodes.find((n) => n.id === session.currentNodeId);
    if (!currentNode) return;

    const userMessage: FlowTestMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: userInput,
      timestamp: new Date().toISOString(),
      nodeId: currentNode.id,
      dtmfInput: currentNode.type === "dtmf" ? userInput : undefined,
    };

    const updatedSession: FlowTestSession = {
      ...session,
      messages: [...session.messages, userMessage],
    };

    setSession(updatedSession);
    setUserInput("");

    // Continue flow
    setTimeout(() => simulateNextNode(updatedSession, currentNode), 500);
  };

  const stopTest = () => {
    setIsRunning(false);
    onHighlightNode(null);
    if (session) {
      setSession({
        ...session,
        status: "completed",
        endedAt: new Date().toISOString(),
      });
    }
    toast.info("Test stopped");
  };

  const resetTest = () => {
    setSession(null);
    setIsRunning(false);
    setUserInput("");
    onHighlightNode(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-card border-l shadow-xl z-50 flex flex-col animate-in slide-in-from-right">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Live Test</h3>
            <p className="text-xs text-muted-foreground">
              {isRunning ? "Running..." : session ? "Completed" : "Ready to test"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isRunning ? (
            <Badge className="bg-success/10 text-success gap-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Running
            </Badge>
          ) : session?.status === "completed" ? (
            <Badge className="bg-primary/10 text-primary gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              Idle
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!isRunning ? (
            <Button size="sm" onClick={startTest} className="gap-1">
              <Play className="h-3 w-3" />
              Start
            </Button>
          ) : (
            <Button size="sm" variant="destructive" onClick={stopTest} className="gap-1">
              <Square className="h-3 w-3" />
              Stop
            </Button>
          )}
          {session && !isRunning && (
            <Button size="sm" variant="outline" onClick={resetTest} className="gap-1">
              <RefreshCw className="h-3 w-3" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {!session ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Phone className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="font-medium mb-1">Ready to Test</h4>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              Click "Start" to simulate a conversation through your flow
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {session.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : message.role === "assistant"
                      ? "bg-violet-500/10 text-violet-500"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : message.role === "assistant" ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : message.role === "assistant"
                      ? "bg-muted"
                      : "bg-muted/50 text-muted-foreground italic text-xs"
                  )}
                >
                  {message.content}
                  {message.dtmfInput && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      <Keyboard className="h-3 w-3 mr-1" />
                      {message.dtmfInput}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex gap-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={isRunning ? "Type a response or DTMF key..." : "Start test first"}
            disabled={!isRunning}
            onKeyDown={(e) => e.key === "Enter" && handleUserInput()}
          />
          <Button onClick={handleUserInput} disabled={!isRunning || !userInput.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1 mt-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0 font-mono"
              disabled={!isRunning}
              onClick={() => {
                setUserInput(key);
                handleUserInput();
              }}
            >
              {key}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
