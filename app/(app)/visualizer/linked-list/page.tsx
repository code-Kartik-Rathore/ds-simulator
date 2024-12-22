import { LinkedListVisualizer } from "@/components/visualizer/linked-list/linked-list-visualizer"
import { readFileSync } from "fs"
import path from "path"

export default function LinkedListPage() {
  const content = readFileSync(
    path.join(process.cwd(), "content/linked-list.md"),
    "utf-8"
  )

  return <LinkedListVisualizer content={content} />
} 