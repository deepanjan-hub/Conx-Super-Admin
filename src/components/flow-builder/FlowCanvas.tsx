import { useState, useRef, useCallback, useEffect } from "react";
import { FlowNode, NodeType } from "./types";
import { FlowNodeComponent } from "./FlowNodeComponent";
import { cn } from "@/lib/utils";

interface FlowCanvasProps {
  nodes: FlowNode[];
  onNodesChange: (nodes: FlowNode[]) => void;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  zoom: number;
  onConnect: (sourceId: string, targetId: string) => void;
}

export function FlowCanvas({
  nodes,
  onNodesChange,
  selectedNodeId,
  onSelectNode,
  zoom,
  onConnect,
}: FlowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleNodeDragStart = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation();
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      setIsDragging(true);
      setDragNodeId(nodeId);
      setDragOffset({
        x: (e.clientX - rect.left) / (zoom / 100) - node.position.x,
        y: (e.clientY - rect.top) / (zoom / 100) - node.position.y,
      });
    },
    [nodes, zoom]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left) / (zoom / 100);
      const y = (e.clientY - rect.top) / (zoom / 100);
      setMousePos({ x, y });

      if (isDragging && dragNodeId) {
        const newNodes = nodes.map((node) =>
          node.id === dragNodeId
            ? {
                ...node,
                position: {
                  x: Math.max(0, x - dragOffset.x),
                  y: Math.max(0, y - dragOffset.y),
                },
              }
            : node
        );
        onNodesChange(newNodes);
      }
    },
    [isDragging, dragNodeId, dragOffset, nodes, onNodesChange, zoom]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragNodeId(null);
    if (isConnecting) {
      setIsConnecting(false);
      setConnectingFrom(null);
    }
  }, [isConnecting]);

  const handleStartConnection = useCallback((nodeId: string) => {
    setIsConnecting(true);
    setConnectingFrom(nodeId);
  }, []);

  const handleEndConnection = useCallback(
    (targetNodeId: string) => {
      if (connectingFrom && connectingFrom !== targetNodeId) {
        onConnect(connectingFrom, targetNodeId);
      }
      setIsConnecting(false);
      setConnectingFrom(null);
    },
    [connectingFrom, onConnect]
  );

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectNode(null);
    }
  }, [onSelectNode]);

  const renderConnections = () => {
    const connections: JSX.Element[] = [];

    nodes.forEach((node) => {
      node.connections.forEach((connection) => {
        const targetNode = nodes.find((n) => n.id === connection.targetNodeId);
        if (!targetNode) return;

        const startX = node.position.x + 160;
        const startY = node.position.y + 30;
        const endX = targetNode.position.x;
        const endY = targetNode.position.y + 30;

        const controlX1 = startX + Math.min(100, Math.abs(endX - startX) / 2);
        const controlX2 = endX - Math.min(100, Math.abs(endX - startX) / 2);

        connections.push(
          <g key={`${node.id}-${connection.id}`}>
            <path
              d={`M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              className="transition-colors"
              strokeDasharray={node.type === "condition" ? "6,4" : undefined}
            />
            {/* Arrow head */}
            <polygon
              points={`${endX},${endY} ${endX - 8},${endY - 5} ${endX - 8},${endY + 5}`}
              fill="hsl(var(--primary))"
            />
            {/* Connection label */}
            {connection.label && (
              <text
                x={(startX + endX) / 2}
                y={(startY + endY) / 2 - 8}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
              >
                {connection.label}
              </text>
            )}
          </g>
        );
      });
    });

    // Draw temporary connection line when connecting
    if (isConnecting && connectingFrom) {
      const sourceNode = nodes.find((n) => n.id === connectingFrom);
      if (sourceNode) {
        const startX = sourceNode.position.x + 160;
        const startY = sourceNode.position.y + 30;

        connections.push(
          <path
            key="temp-connection"
            d={`M ${startX} ${startY} L ${mousePos.x} ${mousePos.y}`}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="4,4"
            opacity="0.6"
          />
        );
      }
    }

    return connections;
  };

  return (
    <div
      ref={canvasRef}
      className="relative flex-1 bg-muted/20 overflow-auto cursor-crosshair"
      style={{ 
        minHeight: "600px",
        backgroundImage: `
          linear-gradient(hsl(var(--border) / 0.3) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--border) / 0.3) 1px, transparent 1px)
        `,
        backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
    >
      <div
        className="relative"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: "top left",
          minWidth: "1200px",
          minHeight: "800px",
        }}
      >
        {/* SVG for connections */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ overflow: "visible", width: "100%", height: "100%" }}
        >
          {renderConnections()}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <FlowNodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            isConnecting={isConnecting}
            onSelect={() => onSelectNode(node.id)}
            onDragStart={(e) => handleNodeDragStart(e, node.id)}
            onStartConnection={() => handleStartConnection(node.id)}
            onEndConnection={() => handleEndConnection(node.id)}
          />
        ))}
      </div>
    </div>
  );
}
