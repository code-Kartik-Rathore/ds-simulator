export interface GraphNode {
  id: string
  label: string
  x?: number
  y?: number
  distance: number
  previous?: string
  isVisited: boolean
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  weight: number
}

export interface DijkstraStep {
  type: 'INIT' | 'VISIT' | 'UPDATE' | 'FINISH'
  nodes: GraphNode[]
  edges: GraphEdge[]
  currentNode?: string
  visitedNodes: string[]
  updatedNodes: string[]
  message: string
  shortestPath?: string[]
} 