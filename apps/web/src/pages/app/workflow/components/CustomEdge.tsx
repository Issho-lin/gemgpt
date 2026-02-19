import React, { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath, useReactFlow } from '@xyflow/react';
import { X } from 'lucide-react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isHovered, setIsHovered] = useState(false);
  const hoverTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => {
      setIsHovered(false);
    }, 100);
  };

  const onEdgeClick = (evt: React.MouseEvent, id: string) => {
    evt.stopPropagation();
    setEdges((edges) => edges.filter((e) => e.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      
      {/* Invisible wider path for easier hovering */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeOpacity={0}
        strokeWidth={20}
        className="react-flow__edge-interaction cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <EdgeLabelRenderer>
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 1000,
            }}
            className="nodrag nopan"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
              onClick={(event) => onEdgeClick(event, id)}
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
