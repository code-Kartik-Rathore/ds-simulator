"use client"

import { GraphNode, GraphEdge } from "./types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface PathAnalysis {
  pathLength: number
  totalDistance: number
  visitedNodes: number
  averageDistance: number
}

function analyzePath(
  nodes: GraphNode[], 
  edges: GraphEdge[], 
  shortestPath: string[] = []
): PathAnalysis {
  const analysis: PathAnalysis = {
    pathLength: shortestPath.length,
    totalDistance: 0,
    visitedNodes: nodes.filter(n => n.isVisited).length,
    averageDistance: 0,
  }

  // Calculate total distance along path
  for (let i = 0; i < shortestPath.length - 1; i++) {
    const edge = edges.find(e => 
      (e.source === shortestPath[i] && e.target === shortestPath[i + 1]) ||
      (e.target === shortestPath[i] && e.source === shortestPath[i + 1])
    )
    if (edge) {
      analysis.totalDistance += edge.weight
    }
  }

  // Calculate average distance to all visited nodes
  const visitedNodes = nodes.filter(n => n.isVisited)
  if (visitedNodes.length > 0) {
    const totalDistances = visitedNodes.reduce((sum, node) => 
      sum + (node.distance === Infinity ? 0 : node.distance), 0
    )
    analysis.averageDistance = totalDistances / visitedNodes.length
  }

  return analysis
}

export function DijkstraAnalysis({ 
  nodes, 
  edges,
  shortestPath = []
}: { 
  nodes: GraphNode[]
  edges: GraphEdge[]
  shortestPath?: string[]
}) {
  if (nodes.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No graph data available. Create nodes and run the algorithm.
        </AlertDescription>
      </Alert>
    )
  }

  const analysis = analyzePath(nodes, edges, shortestPath)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Path Analysis</CardTitle>
          <CardDescription>Shortest path details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Path Length:</span>
            <span className="font-mono">{analysis.pathLength} nodes</span>
          </div>
          <div className="flex justify-between">
            <span>Total Distance:</span>
            <span className="font-mono">{analysis.totalDistance}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Graph Coverage</CardTitle>
          <CardDescription>Algorithm exploration stats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Visited Nodes:</span>
            <span className="font-mono">
              {analysis.visitedNodes} of {nodes.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Coverage:</span>
            <span className="font-mono">
              {((analysis.visitedNodes / nodes.length) * 100).toFixed(1)}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distance Metrics</CardTitle>
          <CardDescription>Path finding efficiency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Avg Distance:</span>
            <span className="font-mono">
              {analysis.averageDistance.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Edge Count:</span>
            <span className="font-mono">{edges.length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 