import { HeapVisualizer } from "@/components/visualizer/heap/heap-visualizer"
import { readFileSync } from "fs"
import path from "path"

export default function HeapPage() {
  const content = readFileSync(
    path.join(process.cwd(), "content/heap.md"),
    "utf-8"
  )

  return <HeapVisualizer content={content} />
} 