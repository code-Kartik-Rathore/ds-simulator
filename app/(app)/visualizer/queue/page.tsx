import { QueueVisualizer } from "@/components/visualizer/queue/queue-visualizer"
import { readFileSync } from "fs"
import path from "path"

export default function QueuePage() {
  const content = readFileSync(
    path.join(process.cwd(), "content/queue.md"),
    "utf-8"
  )

  return <QueueVisualizer content={content} />
} 