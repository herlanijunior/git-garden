import { useRef, useState, useEffect } from 'react';
import { GitRepository } from '@/lib/types';
import { calculateLayout, CommitNode, Edge } from '@/lib/graphLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnimalEmoji } from '@/lib/mockData';

interface CommitGraphProps {
  repository: GitRepository;
  selectedCommit?: string;
  onCommitClick?: (commitId: string) => void;
  highlightedCommits?: string[];
  animateTransitions?: boolean;
}

export const CommitGraph = ({
  repository,
  selectedCommit,
  onCommitClick,
  highlightedCommits = [],
  animateTransitions = true
}: CommitGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 1000, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { nodes, edges } = calculateLayout(repository);

  useEffect(() => {
    if (nodes.length > 0) {
      const maxX = Math.max(...nodes.map(n => n.x)) + 200;
      const maxY = Math.max(...nodes.map(n => n.y)) + 200;
      setViewBox({ x: 0, y: 0, width: Math.max(1000, maxX), height: Math.max(600, maxY) });
    }
  }, [nodes]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev * delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !(e.target as HTMLElement).closest('.commit-node')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const renderEdge = (edge: Edge, index: number) => {
    const isHighlighted = highlightedCommits.includes(edge.from.id) || 
                          highlightedCommits.includes(edge.to.id);
    
    const path = edge.from.column === edge.to.column
      ? `M ${edge.from.x} ${edge.from.y} L ${edge.to.x} ${edge.to.y}`
      : `M ${edge.from.x} ${edge.from.y} 
         C ${edge.from.x} ${edge.from.y + (edge.to.y - edge.from.y) / 2},
           ${edge.to.x} ${edge.from.y + (edge.to.y - edge.from.y) / 2},
           ${edge.to.x} ${edge.to.y}`;

    return (
      <motion.g
        key={`edge-${index}`}
        initial={animateTransitions ? { pathLength: 0, opacity: 0 } : undefined}
        animate={{ pathLength: 1, opacity: isHighlighted ? 1 : 0.4 }}
        transition={{ duration: 0.5, delay: index * 0.02 }}
      >
        <path
          d={path}
          stroke={isHighlighted ? 'var(--color-accent)' : 'var(--color-border)'}
          strokeWidth={edge.isMerge ? 3 : 2}
          fill="none"
          strokeDasharray={edge.from.isRemote || edge.to.isRemote ? '5,5' : undefined}
          markerEnd="url(#arrowhead)"
        />
      </motion.g>
    );
  };

  const renderNode = (node: CommitNode, index: number) => {
    const isSelected = selectedCommit === node.id;
    const isHighlighted = highlightedCommits.includes(node.id);
    const branch = repository.branches.find(b => b.name === node.branch);

    return (
      <motion.g
        key={node.id}
        className="commit-node cursor-pointer"
        initial={animateTransitions ? { scale: 0, opacity: 0 } : undefined}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: index * 0.03
        }}
        whileHover={{ scale: 1.1 }}
        onClick={() => onCommitClick?.(node.id)}
      >
        <circle
          cx={node.x}
          cy={node.y}
          r={isSelected ? 20 : 16}
          fill={branch?.color || 'var(--color-primary)'}
          stroke={isSelected ? 'var(--color-accent)' : 'var(--color-background)'}
          strokeWidth={isSelected ? 4 : 2}
          style={{
            filter: isSelected ? 'drop-shadow(0 0 12px var(--color-accent))' : 
                    isHighlighted ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none'
          }}
        />
        
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20"
        >
          {getAnimalEmoji(node.author.animal)}
        </text>

        <text
          x={node.x}
          y={node.y + 35}
          textAnchor="middle"
          fontSize="12"
          fill="var(--color-muted-foreground)"
          className="mono"
        >
          {node.hash.substring(0, 7)}
        </text>

        {isSelected && (
          <motion.circle
            cx={node.x}
            cy={node.y}
            r={24}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.g>
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg border border-border bg-card">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: 'center center'
        }}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="var(--color-border)" />
          </marker>
        </defs>

        <AnimatePresence>
          {edges.map((edge, index) => renderEdge(edge, index))}
        </AnimatePresence>

        <AnimatePresence>
          {nodes.map((node, index) => renderNode(node, index))}
        </AnimatePresence>
      </svg>

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
          className="px-3 py-2 bg-card border border-border rounded-md hover:bg-muted"
        >
          +
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.3, prev / 1.2))}
          className="px-3 py-2 bg-card border border-border rounded-md hover:bg-muted"
        >
          −
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="px-3 py-2 bg-card border border-border rounded-md hover:bg-muted text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
