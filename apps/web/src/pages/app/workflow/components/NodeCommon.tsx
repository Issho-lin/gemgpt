import { Handle, Position, useNodeConnections } from '@xyflow/react';
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import NodeMenu from './NodeMenu';

// Source Handle with connection state
export function SourceHandle({ id = "source", className, style }: { id?: string, className?: string, style?: React.CSSProperties }) {
    const connections = useNodeConnections({
        handleType: 'source',
        handleId: id
    });

    return (
        <Handle 
            id={id}
            type="source" 
            position={Position.Right} 
            className={cn(
                "!w-3 !h-3 !bg-blue-500 border-4 border-white transition-opacity rounded-full shadow-sm",
                connections.length > 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                className
            )}
            style={{ right: 0, ...style }}
        />
    );
}

export function TargetHandle({ style }: { style?: React.CSSProperties } = {}) {
    return (
        <Handle 
            id="target"
            type="target" 
            position={Position.Left} 
            className="!w-3 !h-3 !bg-blue-500 border-4 border-white transition-opacity rounded-full shadow-sm"
            style={{ left: 0, ...style }}
        />
    );
}

export function NodePlusButton({ 
    isMenuOpen, 
    onClick,
    handleId = "plus-source",
    className,
    style
}: { 
    isMenuOpen: boolean, 
    onClick: () => void,
    handleId?: string,
    className?: string,
    style?: React.CSSProperties
}) {
    return (
        <div 
            className={cn(
                "absolute -right-[28px] top-1/2 -translate-y-1/2 z-50 transition-opacity",
                isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                className
            )}
            style={style}
        >
            <Handle 
                id={handleId}
                type="source"
                position={Position.Right}
                className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-200 hover:scale-110 transition-all shadow-sm border border-blue-200"
                onClick={onClick}
                style={{
                    top: '50%',
                    right: 18,
                    transform: 'translateY(-50%)',
                    background: '#dbeafe', // blue-100
                    border: '1px solid #bfdbfe', // blue-200
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb' // blue-600
                }}
            >
                <Plus className={cn("w-3 h-3 transition-transform pointer-events-none", isMenuOpen ? "rotate-45" : "")} />
            </Handle>
        </div>
    );
}

import { Trash2, Copy, Play } from "lucide-react";

export function NodeHoverActions() {
    return (
        <div className="absolute -top-10 right-0 hidden group-hover:flex items-center gap-1 bg-white p-1 rounded-lg shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-2 z-50">
            <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-blue-500 transition-colors">
                <Copy className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-200 mx-0.5" />
            <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-green-500 transition-colors">
                <Play className="w-4 h-4" />
            </button>
        </div>
    );
}

import { useRef, useEffect, useState } from 'react';

export function NodeMenuWrapper({ 
    isOpen, 
    onClose, 
    onSelect 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    onSelect: (type: string) => void 
}) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<'right' | 'left'>('right');
    const [adjustedStyle, setAdjustedStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        if (!isOpen) return;

        // Reset state on open
        setPosition('right');
        setAdjustedStyle({});

        const checkPosition = () => {
            const menuEl = menuRef.current;
            if (!menuEl) return;

            const rect = menuEl.getBoundingClientRect();
            
            // Try to find the closest react-flow__renderer container (which handles the viewport)
            // Or fallback to window
            const renderer = menuEl.closest('.react-flow__renderer') || menuEl.closest('.react-flow');
            
            let rightEdge = window.innerWidth;
            let bottomEdge = window.innerHeight;

            if (renderer) {
                const containerRect = renderer.getBoundingClientRect();
                rightEdge = containerRect.right;
                bottomEdge = containerRect.bottom;
            }

            // Check horizontal overflow
            if (rect.right > rightEdge) {
                setPosition('left');
            }

            // Check vertical overflow
            if (rect.bottom > bottomEdge) {
                const overflow = rect.bottom - bottomEdge + 20; // 20px padding
                setAdjustedStyle(prev => ({ ...prev, marginTop: `-${overflow}px` }));
            }
        };

        // Use requestAnimationFrame to wait for layout
        const rafId = requestAnimationFrame(() => {
            checkPosition();
            // Double check in next frame just in case
            requestAnimationFrame(checkPosition);
        });

        return () => cancelAnimationFrame(rafId);
    }, [isOpen]);

    if (!isOpen) return null;
    
    const positionClasses = {
        right: "left-[calc(100%+40px)]",
        left: "right-[calc(100%+40px)]",
        bottom: "top-[calc(100%+20px)] left-0"
    };

    return (
        <div 
            ref={menuRef}
            className={cn("absolute top-0 z-[100]", positionClasses[position])}
            style={adjustedStyle}
        >
            <NodeMenu onClose={onClose} onSelect={onSelect} />
        </div>
    );
}

export function NodeSectionHeader({ 
    title, 
    iconColor = "bg-blue-500",
    rightContent 
}: { 
    title: string, 
    iconColor?: string,
    rightContent?: React.ReactNode 
}) {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                <div className={cn("w-1 h-3.5 rounded-full mr-2", iconColor)}></div>
                <span className="font-bold text-sm text-slate-700">{title}</span>
            </div>
            {rightContent}
        </div>
    );
}
