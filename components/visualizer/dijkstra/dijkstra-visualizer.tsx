"use client"

import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
} from 'reactflow'
import 'reactflow/dist/style.css'
import GraphNode from './graph-node'
import GraphEdge from './graph-edge'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Static example graph with better layout
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'graph',
    position: { x: 250, y: 50 },
    data: { 
      label: '1',
      distance: 0,
      isVisited: false,
      isStart: true,
      isEnd: false,
      highlighted: false,
      isInPath: false
    }
  },
  {
    id: '2',
    type: 'graph',
    position: { x: 100, y: 150 },
    data: { 
      label: '2',
      distance: Infinity,
      isVisited: false,
      isStart: false,
      isEnd: false,
      highlighted: false,
      isInPath: false
    }
  },
  {
    id: '3',
    type: 'graph',
    position: { x: 400, y: 150 },
    data: { 
      label: '3',
      distance: Infinity,
      isVisited: false,
      isStart: false,
      isEnd: false,
      highlighted: false,
      isInPath: false
    }
  },
  {
    id: '4',
    type: 'graph',
    position: { x: 250, y: 250 },
    data: { 
      label: '4',
      distance: Infinity,
      isVisited: false,
      isStart: false,
      isEnd: true,
      highlighted: false,
      isInPath: false
    }
  }
]

const nodeTypes = {
  graph: GraphNode
}

const edgeTypes = {
  graph: GraphEdge
}

const getEdgeStyle = (theme: string | undefined) => ({
  stroke: theme === 'dark' ? '#ffffff' : '#000000',
  strokeWidth: 2,
  opacity: 0.7
})

interface Step {
  message: string
  nodes: Node[]
  edges: Edge[]
  currentNode?: string
  visitedNodes: string[]
  updatedNodes: string[]
  shortestPath?: string[]
}

export function DijkstraVisualizer({ content }: { content: React.ReactNode }) {
  const { theme } = useTheme()
  const [currentStep, setCurrentStep] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)
  const [path, setPath] = useState<string[]>([])

  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'graph',
      label: '4',
      style: getEdgeStyle(theme)
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      type: 'graph',
      label: '3',
      style: getEdgeStyle(theme)
    },
    {
      id: 'e2-4',
      source: '2',
      target: '4',
      type: 'graph',
      label: '5',
      style: getEdgeStyle(theme)
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      type: 'graph',
      label: '2',
      style: getEdgeStyle(theme)
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      type: 'graph',
      label: '6',
      style: getEdgeStyle(theme)
    }
  ]

  // Generate all algorithm steps
  const generateSteps = (): Step[] => {
    const steps: Step[] = []
    const distances = new Map<string, number>()
    const previous = new Map<string, string>()
    const unvisited = new Set<string>()
    
    // Initialize
    initialNodes.forEach(node => {
      distances.set(node.id, node.id === '1' ? 0 : Infinity)
      unvisited.add(node.id)
    })

    steps.push({
      message: "Initialize: Set start node distance to 0, others to ∞",
      nodes: initialNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          distance: node.id === '1' ? 0 : Infinity
        }
      })),
      edges: initialEdges,
      visitedNodes: [],
      updatedNodes: ['1']
    })

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let minDistance = Infinity
      let current: string | null = null

      for (const nodeId of unvisited) {
        const distance = distances.get(nodeId) || Infinity
        if (distance < minDistance) {
          minDistance = distance
          current = nodeId
        }
      }

      if (!current || minDistance === Infinity) break

      // Visit current node
      unvisited.delete(current)
      const currentNodeEdges = initialEdges.filter(e => 
        e.source === current || e.target === current
      )

      steps.push({
        message: `Visit node ${current} (distance = ${distances.get(current)})`,
        nodes: initialNodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            distance: distances.get(node.id) || Infinity,
            isVisited: !unvisited.has(node.id),
            highlighted: node.id === current
          }
        })),
        edges: initialEdges.map(edge => ({
          ...edge,
          style: {
            ...getEdgeStyle(theme),
            strokeWidth: currentNodeEdges.some(e => e.id === edge.id) ? 3 : 2,
          }
        })),
        currentNode: current,
        visitedNodes: initialNodes
          .filter(n => !unvisited.has(n.id))
          .map(n => n.id),
        updatedNodes: [current]
      })

      // Update neighbors
      for (const edge of currentNodeEdges) {
        const neighbor = edge.source === current ? edge.target : edge.source
        if (!unvisited.has(neighbor)) continue

        const newDistance = (distances.get(current) || 0) + Number(edge.label)
        const currentDistance = distances.get(neighbor) || Infinity

        if (newDistance < currentDistance) {
          distances.set(neighbor, newDistance)
          previous.set(neighbor, current)

          steps.push({
            message: `Update distance to node ${neighbor}: ${newDistance}`,
            nodes: initialNodes.map(node => ({
              ...node,
              data: {
                ...node.data,
                distance: distances.get(node.id) || Infinity,
                isVisited: !unvisited.has(node.id),
                highlighted: node.id === neighbor
              }
            })),
            edges: initialEdges.map(e => ({
              ...e,
              style: {
                ...getEdgeStyle(theme),
                strokeWidth: e.id === edge.id ? 3 : 2,
              }
            })),
            currentNode: current,
            visitedNodes: initialNodes
              .filter(n => !unvisited.has(n.id))
              .map(n => n.id),
            updatedNodes: [neighbor]
          })
        }
      }
    }

    // Build shortest path
    const shortestPath: string[] = []
    let current = '4' // end node
    while (current) {
      shortestPath.unshift(current)
      current = previous.get(current) || ''
    }

    if (shortestPath.length > 1) {
      steps.push({
        message: `Found shortest path with distance ${distances.get('4')}`,
        nodes: initialNodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            distance: distances.get(node.id) || Infinity,
            isVisited: true,
            isInPath: shortestPath.includes(node.id)
          }
        })),
        edges: initialEdges.map(edge => ({
          ...edge,
          style: {
            ...getEdgeStyle(theme),
            strokeWidth: shortestPath.includes(edge.source) && 
                        shortestPath.includes(edge.target) ? 3 : 2,
            opacity: shortestPath.includes(edge.source) && 
                    shortestPath.includes(edge.target) ? 1 : 0.5,
          }
        })),
        visitedNodes: initialNodes.map(n => n.id),
        updatedNodes: [],
        shortestPath
      })
    }

    return steps
  }

  const steps = generateSteps()

  const runAlgorithm = () => {
    setIsRunning(true)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const reset = () => {
    setCurrentStep(-1)
    setIsRunning(false)
    setPath([])
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dijkstra's Algorithm</h1>
        <p className="text-muted-foreground">
          A graph search algorithm that finds the shortest path between nodes in a weighted graph.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Algorithm Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button 
                  onClick={runAlgorithm} 
                  disabled={isRunning}
                  className="w-full"
                >
                  Run
                </Button>
                <Button 
                  onClick={previousStep} 
                  disabled={currentStep <= 0}
                  variant="secondary"
                  className="w-full"
                >
                  Previous
                </Button>
                <Button 
                  onClick={nextStep} 
                  disabled={currentStep >= steps.length - 1}
                  variant="secondary"
                  className="w-full"
                >
                  Next
                </Button>
                <Button 
                  onClick={reset}
                  variant="destructive"
                  className="w-full"
                >
                  Reset
                </Button>
              </div>

              {currentStep >= 0 && (
                <div className="text-sm text-center text-muted-foreground">
                  {steps[currentStep].message}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <div className="w-full h-[600px] bg-background rounded-lg overflow-hidden border">
            <ReactFlow
              nodes={currentStep >= 0 ? steps[currentStep].nodes : initialNodes}
              edges={currentStep >= 0 ? steps[currentStep].edges : initialEdges}
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
        </div>
      </div>
    </div>
  )
} 