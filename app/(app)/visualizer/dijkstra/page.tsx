import { DijkstraVisualizer } from "@/components/visualizer/dijkstra/dijkstra-visualizer"

export const metadata = {
  title: "Dijkstra's Algorithm Visualizer",
  description: "Interactive visualization of Dijkstra's shortest path algorithm",
}

const content = "dijkstra"

export default async function DijkstraPage() {
//   const content = await getMarkdownContent('dijkstra')
  return <DijkstraVisualizer content={content} />
} 