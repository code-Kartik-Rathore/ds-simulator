"use client"

import { Handle, Position } from 'reactflow'
import { motion } from 'framer-motion'

interface GraphNodeProps {
  data: {
    label: string
    distance: number
    isVisited: boolean
    isStart: boolean
    isEnd: boolean
    highlighted: boolean
    isInPath: boolean
  }
}

export default function GraphNode({ data }: GraphNodeProps) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <motion.div 
        className={`
          min-w-[80px] px-3 py-2
          rounded-lg flex flex-col items-center justify-center 
          border-2 font-medium
          ${data.isStart ? 'bg-green-500 border-green-400' :
            data.isEnd ? 'bg-red-500 border-red-400' :
            data.isInPath ? 'bg-yellow-500 border-yellow-400' :
            data.highlighted ? 'bg-purple-500 border-purple-300' :
            data.isVisited ? 'bg-slate-600 border-slate-400' :
            'bg-slate-800 border-slate-600'
          }
        `}
        animate={{
          scale: data.highlighted ? 1.1 : 1,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
      >
        <span className="text-white font-bold">{data.label}</span>
        <span className="text-xs text-white/80">
          {data.distance === Infinity ? '∞' : data.distance}
        </span>
      </motion.div>
      <Handle type="source" position={Position.Bottom} />
    </>
  )
} 