import React, { useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MarkerType,
  Position,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plan } from "./data";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Target, FileText } from "lucide-react";

// Custom node components
function GuideNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-lg border-2 border-primary bg-card shadow-md min-w-[200px]">
      <div className="flex items-start gap-2">
        <FileText className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm mb-2">{data.title}</div>
          <div className="flex flex-wrap gap-1">
            {data.kind && (
              <Badge variant="secondary" className="text-xs">
                {data.kind}
              </Badge>
            )}
            {data.minutes && (
              <Badge
                variant="outline"
                className="text-xs flex items-center gap-1"
              >
                <Clock className="h-3 w-3" />
                {data.minutes}m
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadingNode({ data }: { data: any }) {
  return (
    <div className="px-3 py-2 rounded-md border border-muted-foreground/30 bg-muted/50 shadow-sm min-w-[160px]">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="text-sm text-muted-foreground font-medium">
          {data.title}
        </div>
      </div>
    </div>
  );
}

function JtbdNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-950 shadow-md min-w-[200px]">
      <div className="flex items-start gap-2">
        <Target className="h-4 w-4 mt-1 text-green-600 dark:text-green-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-green-900 dark:text-green-100">
            {data.title}
          </div>
          {data.minutes && (
            <Badge variant="outline" className="text-xs mt-2">
              <Clock className="h-3 w-3 mr-1" />
              {data.minutes}m
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

const nodeTypes = {
  guide: GuideNode,
  reading: ReadingNode,
  jtbd: JtbdNode,
};

interface GraphCanvasProps {
  plan: Plan;
}

export function GraphCanvas({ plan }: GraphCanvasProps) {
  // Prepare initial nodes and edges
  const initialNodes = useMemo(() => {
    return plan.nodes.map((node, index) => {
      // Simple layout: readings left, guides center, jtbds right
      let x = 250; // center
      if (node.type === "reading") {
        x = 50; // left
      } else if (node.type === "jtbd") {
        x = 500; // right
      }

      const y = index * 120; // Vertical spacing

      return {
        id: node.id,
        type: node.type,
        position: { x, y },
        data: {
          title: node.title,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });
  }, [plan.nodes]);

  const initialEdges = useMemo(() => {
    return plan.edges.map((edge, index) => ({
      id: `${edge.from}-${edge.to}-${index}`,
      source: edge.from,
      target: edge.to,
      type: "default" as const,
      style: {
        strokeWidth: 2,
        stroke: edge.kind === "informs" ? "#94a3b8" : "#64748b",
        strokeDasharray: edge.kind === "informs" ? "5,5" : undefined,
      },
      animated: edge.kind === "supports",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: edge.kind === "informs" ? "#94a3b8" : "#64748b",
      },
    }));
  }, [plan.edges]);

  // Create a unique key based on plan to force re-mount when plan changes
  const planKey = useMemo(() => {
    return plan.selectedJtbd.join("-");
  }, [plan.selectedJtbd]);

  return (
    <div
      key={planKey}
      className="w-full h-[600px] border rounded-lg bg-background"
    >
      <GraphCanvasInner
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        nodeTypes={nodeTypes}
      />
    </div>
  );
}

// Inner component that gets re-mounted when plan changes
function GraphCanvasInner({
  initialNodes,
  initialEdges,
  nodeTypes,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
  nodeTypes: any;
}) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.5}
      maxZoom={1.5}
      defaultEdgeOptions={{
        animated: false,
      }}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}
