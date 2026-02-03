import { FlowNode, NodeType, ConditionBranch, DTMFOption, APICallConfig } from "./types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Trash2,
  Plus,
  Copy,
  Settings,
  MessageSquare,
  Bot,
  GitBranch,
  Webhook,
  Keyboard,
  Variable,
} from "lucide-react";
import { useState } from "react";

interface NodePropertiesPanelProps {
  node: FlowNode | null;
  onUpdateNode: (node: FlowNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
}

export function NodePropertiesPanel({
  node,
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
}: NodePropertiesPanelProps) {
  if (!node) {
    return (
      <div className="w-80 border-l bg-card/50 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a node to view and edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const updateNodeData = (updates: Partial<FlowNode["data"]>) => {
    onUpdateNode({
      ...node,
      data: { ...node.data, ...updates },
    });
  };

  return (
    <div className="w-80 border-l bg-card/50 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Properties</h3>
          <Badge variant="outline" className="text-xs capitalize">
            {node.type}
          </Badge>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Basic Properties */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Node Label</Label>
              <Input
                value={node.label}
                onChange={(e) => onUpdateNode({ ...node, label: e.target.value })}
                placeholder="Enter node label"
              />
            </div>
          </div>

          <Separator />

          {/* Type-specific properties */}
          {node.type === "message" && (
            <MessageNodeProperties node={node} onUpdate={updateNodeData} />
          )}

          {node.type === "assistant" && (
            <AssistantNodeProperties node={node} onUpdate={updateNodeData} />
          )}

          {node.type === "condition" && (
            <ConditionNodeProperties node={node} onUpdate={updateNodeData} />
          )}

          {node.type === "api" && (
            <APINodeProperties node={node} onUpdate={updateNodeData} />
          )}

          {node.type === "dtmf" && (
            <DTMFNodeProperties node={node} onUpdate={updateNodeData} />
          )}

          {node.type === "variable" && (
            <VariableNodeProperties node={node} onUpdate={updateNodeData} />
          )}

          {node.type === "wait" && (
            <WaitNodeProperties node={node} onUpdate={updateNodeData} />
          )}

          {node.type === "transfer" && (
            <TransferNodeProperties node={node} onUpdate={updateNodeData} />
          )}
        </div>
      </ScrollArea>

      {/* Actions */}
      {node.type !== "start" && node.type !== "end" && (
        <div className="p-4 border-t space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => onDuplicateNode(node.id)}
          >
            <Copy className="h-4 w-4" />
            Duplicate Node
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="w-full gap-2"
            onClick={() => onDeleteNode(node.id)}
          >
            <Trash2 className="h-4 w-4" />
            Delete Node
          </Button>
        </div>
      )}
    </div>
  );
}

// Message Node Properties
function MessageNodeProperties({
  node,
  onUpdate,
}: {
  node: FlowNode;
  onUpdate: (updates: Partial<FlowNode["data"]>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5" />
          Message Content
        </Label>
        <Textarea
          value={node.data.message?.content || ""}
          onChange={(e) =>
            onUpdate({ message: { ...node.data.message, content: e.target.value } })
          }
          placeholder="Enter the message the AI will speak..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Use {"{{variable}}"} to insert dynamic values
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="voice-settings">
          <AccordionTrigger className="text-xs">Voice Settings</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Voice</Label>
              <Select
                value={node.data.message?.voice || "alloy"}
                onValueChange={(value) =>
                  onUpdate({ message: { ...node.data.message, voice: value } })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                  <SelectItem value="echo">Echo (Male)</SelectItem>
                  <SelectItem value="fable">Fable (British)</SelectItem>
                  <SelectItem value="onyx">Onyx (Deep Male)</SelectItem>
                  <SelectItem value="nova">Nova (Female)</SelectItem>
                  <SelectItem value="shimmer">Shimmer (Soft Female)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Language</Label>
              <Select
                value={node.data.message?.language || "en-US"}
                onValueChange={(value) =>
                  onUpdate({ message: { ...node.data.message, language: value } })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                  <SelectItem value="de-DE">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Enable SSML</Label>
              <Switch
                checked={node.data.message?.ssml || false}
                onCheckedChange={(checked) =>
                  onUpdate({ message: { ...node.data.message, ssml: checked } })
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// Assistant Node Properties
function AssistantNodeProperties({
  node,
  onUpdate,
}: {
  node: FlowNode;
  onUpdate: (updates: Partial<FlowNode["data"]>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs flex items-center gap-2">
          <Bot className="h-3.5 w-3.5" />
          Assistant Configuration
        </Label>
        <Select
          value={node.data.assistant?.assistantId || ""}
          onValueChange={(value) =>
            onUpdate({ assistant: { ...node.data.assistant, assistantId: value } })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an assistant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="support-agent">Support Agent</SelectItem>
            <SelectItem value="sales-agent">Sales Agent</SelectItem>
            <SelectItem value="booking-agent">Booking Agent</SelectItem>
            <SelectItem value="custom">Custom Assistant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">System Prompt Override</Label>
        <Textarea
          value={node.data.assistant?.systemPrompt || ""}
          onChange={(e) =>
            onUpdate({
              assistant: { ...node.data.assistant, systemPrompt: e.target.value },
            })
          }
          placeholder="Optional: Override the assistant's system prompt..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Max Turns</Label>
          <Input
            type="number"
            min={1}
            max={20}
            value={node.data.assistant?.maxTurns || 5}
            onChange={(e) =>
              onUpdate({
                assistant: { ...node.data.assistant, maxTurns: parseInt(e.target.value) },
              })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Temperature</Label>
          <Input
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={node.data.assistant?.temperature || 0.7}
            onChange={(e) =>
              onUpdate({
                assistant: { ...node.data.assistant, temperature: parseFloat(e.target.value) },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

// Condition Node Properties
function ConditionNodeProperties({
  node,
  onUpdate,
}: {
  node: FlowNode;
  onUpdate: (updates: Partial<FlowNode["data"]>) => void;
}) {
  const conditions = node.data.conditions || [];

  const addCondition = () => {
    const newCondition: ConditionBranch = {
      id: `cond-${Date.now()}`,
      label: `Branch ${conditions.length + 1}`,
      expression: "",
    };
    onUpdate({ conditions: [...conditions, newCondition] });
  };

  const updateCondition = (index: number, updates: Partial<ConditionBranch>) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    onUpdate({ conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    onUpdate({ conditions: conditions.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs flex items-center gap-2">
          <GitBranch className="h-3.5 w-3.5" />
          Condition Branches
        </Label>
        <Button variant="outline" size="sm" onClick={addCondition} className="h-7 text-xs">
          <Plus className="h-3 w-3 mr-1" />
          Add Branch
        </Button>
      </div>

      <div className="space-y-3">
        {conditions.map((condition, index) => (
          <div
            key={condition.id}
            className="p-3 rounded-lg border bg-muted/30 space-y-2"
          >
            <div className="flex items-center justify-between">
              <Input
                value={condition.label}
                onChange={(e) => updateCondition(index, { label: e.target.value })}
                className="h-7 text-xs font-medium w-24"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeCondition(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Input
              value={condition.expression}
              onChange={(e) => updateCondition(index, { expression: e.target.value })}
              placeholder="e.g., intent === 'support'"
              className="text-xs font-mono"
            />
          </div>
        ))}
        {conditions.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No branches defined. Add a branch to create conditional logic.
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        An "else" branch will be automatically added as fallback.
      </p>
    </div>
  );
}

// API Node Properties
function APINodeProperties({
  node,
  onUpdate,
}: {
  node: FlowNode;
  onUpdate: (updates: Partial<FlowNode["data"]>) => void;
}) {
  const api = node.data.api || { method: "GET", url: "", headers: {} };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Webhook className="h-3.5 w-3.5 text-emerald-500" />
        <Label className="text-xs">API Configuration</Label>
      </div>

      <div className="flex gap-2">
        <Select
          value={api.method}
          onValueChange={(value: APICallConfig["method"]) =>
            onUpdate({ api: { ...api, method: value } })
          }
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={api.url}
          onChange={(e) => onUpdate({ api: { ...api, url: e.target.value } })}
          placeholder="https://api.example.com/endpoint"
          className="flex-1"
        />
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="headers">
          <AccordionTrigger className="text-xs">Headers</AccordionTrigger>
          <AccordionContent>
            <Textarea
              value={JSON.stringify(api.headers, null, 2)}
              onChange={(e) => {
                try {
                  const headers = JSON.parse(e.target.value);
                  onUpdate({ api: { ...api, headers } });
                } catch {}
              }}
              placeholder='{"Authorization": "Bearer {{token}}"}'
              className="font-mono text-xs"
              rows={3}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="body">
          <AccordionTrigger className="text-xs">Request Body</AccordionTrigger>
          <AccordionContent>
            <Textarea
              value={api.body || ""}
              onChange={(e) => onUpdate({ api: { ...api, body: e.target.value } })}
              placeholder='{"key": "value"}'
              className="font-mono text-xs"
              rows={4}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Response Variable</Label>
          <Input
            value={api.responseVariable || ""}
            onChange={(e) => onUpdate({ api: { ...api, responseVariable: e.target.value } })}
            placeholder="apiResponse"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Timeout (ms)</Label>
          <Input
            type="number"
            value={api.timeout || 5000}
            onChange={(e) => onUpdate({ api: { ...api, timeout: parseInt(e.target.value) } })}
          />
        </div>
      </div>
    </div>
  );
}

// DTMF Node Properties
function DTMFNodeProperties({
  node,
  onUpdate,
}: {
  node: FlowNode;
  onUpdate: (updates: Partial<FlowNode["data"]>) => void;
}) {
  const dtmf = node.data.dtmf || { prompt: "", options: [], timeout: 10, retries: 3 };

  const addOption = () => {
    const usedKeys = dtmf.options.map((o) => o.key);
    const nextKey = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*", "#"].find(
      (k) => !usedKeys.includes(k)
    );
    if (!nextKey) return;

    const newOption: DTMFOption = {
      key: nextKey,
      label: `Option ${nextKey}`,
    };
    onUpdate({ dtmf: { ...dtmf, options: [...dtmf.options, newOption] } });
  };

  const updateOption = (index: number, updates: Partial<DTMFOption>) => {
    const newOptions = [...dtmf.options];
    newOptions[index] = { ...newOptions[index], ...updates };
    onUpdate({ dtmf: { ...dtmf, options: newOptions } });
  };

  const removeOption = (index: number) => {
    onUpdate({ dtmf: { ...dtmf, options: dtmf.options.filter((_, i) => i !== index) } });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Keyboard className="h-3.5 w-3.5 text-blue-500" />
        <Label className="text-xs">DTMF Configuration</Label>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Voice Prompt</Label>
        <Textarea
          value={dtmf.prompt}
          onChange={(e) => onUpdate({ dtmf: { ...dtmf, prompt: e.target.value } })}
          placeholder="Press 1 for sales, 2 for support..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Keypad Options</Label>
          <Button variant="outline" size="sm" onClick={addOption} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add Key
          </Button>
        </div>

        <div className="space-y-2">
          {dtmf.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center font-mono font-bold text-lg border">
                {option.key}
              </div>
              <Input
                value={option.label}
                onChange={(e) => updateOption(index, { label: e.target.value })}
                placeholder="Option label"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => removeOption(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Timeout (sec)</Label>
          <Input
            type="number"
            min={1}
            max={60}
            value={dtmf.timeout}
            onChange={(e) => onUpdate({ dtmf: { ...dtmf, timeout: parseInt(e.target.value) } })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Max Retries</Label>
          <Input
            type="number"
            min={0}
            max={5}
            value={dtmf.retries}
            onChange={(e) => onUpdate({ dtmf: { ...dtmf, retries: parseInt(e.target.value) } })}
          />
        </div>
      </div>
    </div>
  );
}

// Variable Node Properties
function VariableNodeProperties({
  node,
  onUpdate,
}: {
  node: FlowNode;
  onUpdate: (updates: Partial<FlowNode["data"]>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Variable className="h-3.5 w-3.5 text-pink-500" />
        <Label className="text-xs">Variable Configuration</Label>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Variable Name</Label>
        <Input
          value={node.data.variable?.name || ""}
          onChange={(e) =>
            onUpdate({ variable: { ...node.data.variable, name: e.target.value, value: node.data.variable?.value || "" } })
          }
          placeholder="myVariable"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Value Expression</Label>
        <Textarea
          value={node.data.variable?.value || ""}
          onChange={(e) =>
            onUpdate({ variable: { ...node.data.variable, name: node.data.variable?.name || "", value: e.target.value } })
          }
          placeholder="Static value or {{expression}}"
          rows={2}
        />
      </div>
    </div>
  );
}

// Wait Node Properties
function WaitNodeProperties({
  node,
  onUpdate,
}: {
  node: FlowNode;
  onUpdate: (updates: Partial<FlowNode["data"]>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Wait Duration (seconds)</Label>
        <Input
          type="number"
          min={1}
          max={300}
          value={node.data.waitDuration || 5}
          onChange={(e) => onUpdate({ waitDuration: parseInt(e.target.value) })}
        />
        <p className="text-xs text-muted-foreground">
          Pause the flow for the specified duration.
        </p>
      </div>
    </div>
  );
}

// Transfer Node Properties
function TransferNodeProperties({
  node,
  onUpdate,
}: {
  node: FlowNode;
  onUpdate: (updates: Partial<FlowNode["data"]>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Transfer Configuration</Label>
        <Select defaultValue="queue">
          <SelectTrigger>
            <SelectValue placeholder="Select transfer target" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="queue">Support Queue</SelectItem>
            <SelectItem value="agent">Specific Agent</SelectItem>
            <SelectItem value="department">Department</SelectItem>
            <SelectItem value="external">External Number</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Transfer Message</Label>
        <Textarea
          placeholder="Please hold while I transfer you to an agent..."
          rows={2}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs">Play hold music</Label>
        <Switch defaultChecked />
      </div>
    </div>
  );
}
