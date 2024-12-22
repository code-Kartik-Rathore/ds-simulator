import { AVLTreeVisualizer } from "@/components/visualizer/avl-tree/avl-tree-visualizer"
import { readFileSync } from "fs"
import path from "path"

export default function AVLTreePage() {
  const content = readFileSync(
    path.join(process.cwd(), "content/avl-tree.md"),
    "utf-8"
  )

  return <AVLTreeVisualizer content={content} />
} 