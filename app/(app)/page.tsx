import { Metadata } from "next"
import { BrainCircuit, Binary, Hash, Network, TreePine } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Data Structure Visualizer",
  description: "Interactive visualizations for common data structures and algorithms",
}

const dataStructures = [
  {
    name: "Binary Search Tree",
    description: "A binary tree that maintains sorted data with O(log n) operations",
    href: "/visualizer/binary-tree",
    icon: Binary,
  },
  {
    name: "AVL Tree",
    description: "Self-balancing BST that maintains height balance for consistent performance",
    href: "/visualizer/avl-tree",
    icon: TreePine,
  },
  {
    name: "Hash Map",
    description: "Hash-based data structure providing O(1) average case operations",
    href: "/visualizer/hash-maps",
    icon: Hash,
  },
  {
    name: "Graph",
    description: "Versatile structure for representing relationships and networks",
    href: "/visualizer/graph",
    icon: Network,
  },
]

export default function HomePage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="flex items-center gap-2 mb-4">
          <BrainCircuit className="h-12 w-12" />
          <h1 className="text-4xl font-bold tracking-tight">Data Structure Visualizer</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Interactive visualizations to help you understand data structures and algorithms. 
          Choose a data structure below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dataStructures.map((ds) => {
          const Icon = ds.icon
          return (
            <Link key={ds.href} href={ds.href}>
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-6 w-6" />
                    <CardTitle>{ds.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{ds.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Click on any data structure above to see its visualization. You can interact with the 
          structures, perform operations, and see how they work in real-time.
        </p>
      </div>
    </div>
  )
} 