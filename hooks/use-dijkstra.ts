import { useState, useCallback } from 'react'
import { GraphNode, GraphEdge, DijkstraStep } from '@/components/visualizer/dijkstra/types'

let nodeIdCounter = 0

type State = {
  nodes: GraphNode[]
  edges: GraphEdge[]
  steps: DijkstraStep[]
  currentStep: number
  highlightedNodes: string[]
  isAnimating: boolean
  startNode: string | null
  endNode: string | null
}

type Action =
  | { type: 'ADD_NODE'; x: number; y: number }
  | { type: 'ADD_EDGE'; source: string; target: string; weight: number }
  | { type: 'SET_START_NODE'; node: string | null }
  | { type: 'SET_END_NODE'; node: string | null }
  | { type: 'SET_STEPS'; steps: DijkstraStep[] }
  | { type: 'SET_CURRENT_STEP'; step: number }
  | { type: 'RESET' }
  | { type: 'START_ALGORITHM' }
  | { type: 'FINISH_ALGORITHM' }

const initialState: State = {
  nodes: [],
  edges: [],
  steps: [],
  currentStep: -1,
  highlightedNodes: [],
  isAnimating: false,
  startNode: null,
  endNode: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_NODE':
      const newNode: GraphNode = {
        id: `node-${nodeIdCounter++}`,
        label: String(state.nodes.length + 1),
        x: action.x,
        y: action.y,
        distance: Infinity,
        isVisited: false
      }
      return { ...state, nodes: [...state.nodes, newNode] }

    case 'ADD_EDGE':
      const newEdge: GraphEdge = {
        id: `${action.source}->${action.target}`,
        source: action.source,
        target: action.target,
        weight: action.weight
      }
      return { ...state, edges: [...state.edges, newEdge] }

    case 'SET_START_NODE':
      return { ...state, startNode: action.node }

    case 'SET_END_NODE':
      return { ...state, endNode: action.node }

    case 'SET_STEPS':
      return {
        ...state,
        steps: action.steps,
        currentStep: 0,
        highlightedNodes: action.steps[0]?.updatedNodes || []
      }

    case 'SET_CURRENT_STEP':
      const step = state.steps[action.step]
      return {
        ...state,
        currentStep: action.step,
        highlightedNodes: [
          ...(step?.currentNode ? [step.currentNode] : []),
          ...step?.updatedNodes || []
        ]
      }

    case 'START_ALGORITHM':
      return {
        ...state,
        isAnimating: true,
        steps: [],
        currentStep: -1,
        highlightedNodes: []
      }

    case 'FINISH_ALGORITHM':
      return { ...state, isAnimating: false }

    case 'RESET':
      nodeIdCounter = 0
      return initialState

    default:
      return state
  }
}

export function useDijkstra() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [steps, setSteps] = useState<DijkstraStep[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [startNode, setStartNode] = useState<string | null>(null)
  const [endNode, setEndNode] = useState<string | null>(null)

  const executeAlgorithm = useCallback(async () => {
    if (!startNode || !endNode) return

    // Initialize distances
    const distances = new Map<string, number>()
    const previous = new Map<string, string>()
    const unvisited = new Set<string>()
    const newSteps: DijkstraStep[] = []
    
    nodes.forEach(node => {
      distances.set(node.id, node.id === startNode ? 0 : Infinity)
      unvisited.add(node.id)
    })

    // Initial step
    newSteps.push({
      type: 'INIT',
      nodes: nodes.map(node => ({
        ...node,
        distance: node.id === startNode ? 0 : Infinity
      })),
      edges,
      visitedNodes: [],
      updatedNodes: [startNode],
      message: 'Initializing distances: start node = 0, others = ∞'
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
      newSteps.push({
        type: 'VISIT',
        nodes: nodes.map(node => ({
          ...node,
          distance: distances.get(node.id) || Infinity,
          previous: previous.get(node.id),
          isVisited: !unvisited.has(node.id)
        })),
        edges,
        currentNode: current,
        visitedNodes: nodes
          .filter(n => !unvisited.has(n.id))
          .map(n => n.id),
        updatedNodes: [current],
        message: `Visiting node ${nodes.find(n => n.id === current)?.label}`
      })

      // Update neighbors
      const currentEdges = edges.filter(e => 
        e.source === current || e.target === current
      )

      for (const edge of currentEdges) {
        const neighbor = edge.source === current ? edge.target : edge.source
        if (!unvisited.has(neighbor)) continue

        const newDistance = (distances.get(current) || 0) + edge.weight
        const currentDistance = distances.get(neighbor) || Infinity

        if (newDistance < currentDistance) {
          distances.set(neighbor, newDistance)
          previous.set(neighbor, current)

          newSteps.push({
            type: 'UPDATE',
            nodes: nodes.map(node => ({
              ...node,
              distance: distances.get(node.id) || Infinity,
              previous: previous.get(node.id),
              isVisited: !unvisited.has(node.id)
            })),
            edges,
            currentNode: current,
            visitedNodes: nodes
              .filter(n => !unvisited.has(n.id))
              .map(n => n.id),
            updatedNodes: [neighbor],
            message: `Updating distance to node ${nodes.find(n => n.id === neighbor)?.label}`
          })
        }
      }
    }

    // Build shortest path
    const path: string[] = []
    let current = endNode
    while (current) {
      path.unshift(current)
      current = previous.get(current) || ''
    }

    newSteps.push({
      type: 'FINISH',
      nodes: nodes.map(node => ({
        ...node,
        distance: distances.get(node.id) || Infinity,
        previous: previous.get(node.id),
        isVisited: true
      })),
      edges,
      visitedNodes: nodes.map(n => n.id),
      updatedNodes: [],
      shortestPath: path,
      message: `Found shortest path with distance ${distances.get(endNode)}`
    })

    setSteps(newSteps)
    setIsAnimating(false)
  }, [nodes, edges, startNode, endNode])

  const runDijkstra = useCallback(() => {
    if (!startNode || !endNode || isAnimating) return
    setIsAnimating(true)
    executeAlgorithm()
  }, [startNode, endNode, isAnimating, executeAlgorithm])

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep, steps.length])

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  return {
    nodes,
    edges,
    steps,
    currentStep,
    highlightedNodes,
    isAnimating,
    startNode,
    endNode,
    setNodes,
    setEdges,
    setStartNode,
    setEndNode,
    runDijkstra,
    nextStep,
    previousStep,
    reset: useCallback(() => {
      nodeIdCounter = 0
      setNodes([])
      setEdges([])
      setSteps([])
      setCurrentStep(-1)
      setHighlightedNodes([])
      setIsAnimating(false)
      setStartNode(null)
      setEndNode(null)
    }, [])
  }
} 