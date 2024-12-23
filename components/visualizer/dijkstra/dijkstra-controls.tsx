"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface DijkstraControlsProps {
  onRun: () => void
  onNext: () => void
  onPrevious: () => void
  onReset: () => void
  isAnimating: boolean
  currentStep: number
  totalSteps: number
  hasStartNode: boolean
  hasEndNode: boolean
}

export function DijkstraControls({
  onRun,
  onNext,
  onPrevious,
  onReset,
  isAnimating,
  currentStep,
  totalSteps,
  hasStartNode,
  hasEndNode,
}: DijkstraControlsProps) {
  const canRun = hasStartNode && hasEndNode && !isAnimating

  if (!hasStartNode || !hasEndNode) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {!hasStartNode && !hasEndNode ? "Select start and end nodes" :
           !hasStartNode ? "Select a start node" : "Select an end node"}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Algorithm Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button 
            onClick={onRun} 
            disabled={!canRun}
            className="w-full"
          >
            Run
          </Button>
          <Button 
            onClick={onPrevious} 
            disabled={currentStep <= 0}
            variant="secondary"
            className="w-full"
          >
            Previous
          </Button>
          <Button 
            onClick={onNext} 
            disabled={currentStep >= totalSteps - 1}
            variant="secondary"
            className="w-full"
          >
            Next
          </Button>
          <Button 
            onClick={onReset}
            variant="destructive"
            className="w-full"
          >
            Reset
          </Button>
        </div>

        {totalSteps > 0 && (
          <div className="text-sm text-center text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 