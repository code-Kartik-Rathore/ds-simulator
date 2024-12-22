import { StackVisualizer } from "@/components/visualizer/stack/stack-visualizer"
import { readFileSync } from "fs"
import path from "path"

export default function StackPage() {
  const content = readFileSync(
    path.join(process.cwd(), "content/stack.md"),
    "utf-8"
  )

  return <StackVisualizer content={content} />
} 