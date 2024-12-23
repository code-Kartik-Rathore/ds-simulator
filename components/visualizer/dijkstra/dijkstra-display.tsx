"use client"

import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { GraphNode, GraphEdge } from './types'
import GraphNodeComponent from './graph-node'
import GraphEdgeComponent from './graph-edge'
import { useTheme } from 'next-themes'
import { useEffect, useCallback, useState } from 'react'

interface DijkstraDisplayProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  highlightedNodes: string[]
  message: string
  startNode: string | null
  endNode: string | null
  shortestPath?: string[]
  onNodeClick?: (nodeId: string) => void
  onPaneClick?: (x: number, y: number) => void
}

const nodeTypes = {
  graph: GraphNodeComponent,
}

const edgeTypes = {
  graph: GraphEdgeComponent,
}

export function DijkstraDisplay({ 
  nodes,
  edges,
  highlightedNodes,
  message,
  startNode,
  endNode,
  shortestPath = [],
  onNodeClick,
  onPaneClick,
}: DijkstraDisplayProps) {
  const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState([])
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const { theme } = useTheme()

  const onInit = useCallback((flowInstance: ReactFlowInstance) => {
    setReactFlowInstance(flowInstance)
    setTimeout(() => {
      flowInstance.fitView({
        padding: 0.2,
        duration: 400,
        maxZoom: 1.5,
      })
    }, 50)
  }, [])

  useEffect(() => {
    const newNodes: Node[] = nodes.map(node => ({
      id: node.id,
      type: 'graph',
      position: { x: node.x || 0, y: node.y || 0 },
      data: {
        label: node.label,
        distance: node.distance,
        isVisited: node.isVisited,
        isStart: node.id === startNode,
        isEnd: node.id === endNode,
        highlighted: highlightedNodes.includes(node.id),
        isInPath: shortestPath.includes(node.id),
      },
    }))

    const newEdges: Edge[] = edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'graph',
      label: String(edge.weight),
      style: { 
        stroke: theme === 'dark' ? '#ffffff' : '#000000',
        strokeWidth: shortestPath.includes(edge.source) && 
                    shortestPath.includes(edge.target) ? 3 : 1,
        opacity: 0.5,
      },
    }))

    setReactFlowNodes(newNodes)
    setReactFlowEdges(newEdges)

    if (reactFlowInstance && nodes.length > 0) {
      reactFlowInstance.fitView({
        padding: 0.2,
        duration: 400,
        maxZoom: 1.5,
      })
    }
  }, [
    nodes.length,
    edges,
    highlightedNodes,
    startNode,
    endNode,
    shortestPath,
    theme,
    setReactFlowNodes,
    setReactFlowEdges,
    reactFlowInstance
  ])

  return (
    <div className="relative w-full h-[600px] bg-background rounded-lg overflow-hidden border">
      {message && (
        <div className="absolute top-4 left-4 z-10 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg border">
          {message}
        </div>
      )}
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        onNodeClick={(_, node) => onNodeClick?.(node.id)}
        onPaneClick={(e) => {
          const bounds = (e.target as HTMLElement).getBoundingClientRect()
          onPaneClick?.(
            e.clientX - bounds.left,
            e.clientY - bounds.top
          )
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          maxZoom: 1.5,
        }}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
        className="transition-all duration-300"
      >
        <Background 
          color={theme === 'dark' ? '#ffffff' : '#000000'} 
          gap={12} 
          size={1} 
        />
        <Controls 
          position="bottom-right"
          style={{ 
            display: 'flex',
            flexDirection: 'row',
            gap: '0.5rem',
            margin: '1rem',
            padding: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        />
      </ReactFlow>
    </div>
  )
} 