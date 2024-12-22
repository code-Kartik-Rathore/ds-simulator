import { MessageQueueVisualizer } from "@/components/visualizer/queue-applications/message-queue-visualizer"
import { readFileSync } from "fs"
import path from "path"

export default function MessageQueuePage() {
  const content = readFileSync(
    path.join(process.cwd(), "content/message-queue.md"),
    "utf-8"
  )

  return <MessageQueueVisualizer content={content} />
} 