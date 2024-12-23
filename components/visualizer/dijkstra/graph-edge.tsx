import { BaseEdge, EdgeLabelRenderer, EdgeProps } from 'reactflow'

export default function GraphEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
  style = {},
}: EdgeProps) {
  return (
    <>
      <BaseEdge
        id={id}
        path={`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`}
        style={style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${(sourceX + targetX) / 2}px, ${(sourceY + targetY) / 2}px)`,
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: 12,
            fontWeight: 500,
            pointerEvents: 'all',
          }}
          className="nodrag nopan text-white"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  )
} 