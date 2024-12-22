import { BinaryTreeVisualizer } from "@/components/visualizer/binary-tree/binary-tree-visualizer"
import { readFileSync } from "fs"
import path from "path"

export default function BinaryTreePage() {
  // Read markdown content
  const content = readFileSync(
    path.join(process.cwd(), "content/binary-tree.md"),
    "utf-8"
  )

  return <BinaryTreeVisualizer content={content} />
}