import { PolynomialVisualizer } from "@/components/visualizer/polynomial/polynomial-visualizer"
import { readFileSync } from "fs"
import path from "path"

export default function PolynomialPage() {
  const content = readFileSync(
    path.join(process.cwd(), "content/polynomial.md"),
    "utf-8"
  )

  return <PolynomialVisualizer content={content} />
} 