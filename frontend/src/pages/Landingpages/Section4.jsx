import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  MessageCircle,
  Zap,
  Map,
  BookOpen,
  HelpCircle,
  Upload,
  Database,
  Repeat,
  Sparkles,
  Plus,
  RotateCcw,
  RotateCw,
  Link2,
  Bot,
  Wand2,
  Ghost,
  Mountain,
  SlidersHorizontal,
  Mic,
  SendHorizontal,
  MessageSquare,
} from 'lucide-react';


const INITIAL_NODES = [
  {
    id: 'goal',
    x: 50,
    y: 40,
    w: 68,
    h: 68,
    shape: 'round',
    icon: MessageCircle,
    title: 'Learning Goal',
    subtitle: 'User input',
    handles: { right: true },
  },
  {
    id: 'agent',
    x: 198,
    y: 32,
    w: 176,
    h: 84,
    shape: 'wide',
    variant: 'primary',
    icon: Zap,
    title: 'AI Agent',
    subtitle: 'Understands goal',
    handles: { left: true, right: true },
  },
  {
    id: 'roadmap',
    x: 454,
    y: 40,
    w: 68,
    h: 68,
    shape: 'square',
    icon: Map,
    title: 'Roadmap',
    subtitle: 'Topic list',
    handles: { left: true, right: true },
  },
  {
    id: 'teach',
    x: 602,
    y: 32,
    w: 176,
    h: 84,
    shape: 'wide',
    variant: 'secondary',
    icon: BookOpen,
    title: 'Teach Topic',
    subtitle: 'One by one',
    loop: true,
    handles: { left: true, right: true, bottom: true },
  },
  {
    id: 'quiz',
    x: 858,
    y: 40,
    w: 68,
    h: 68,
    shape: 'round',
    icon: HelpCircle,
    title: 'Quiz',
    subtitle: 'Test yourself',
    handles: { left: true },
  },
  {
    id: 'pdfupload',
    x: 454,
    y: 268,
    w: 68,
    h: 68,
    shape: 'square',
    icon: Upload,
    title: 'PDF Upload',
    subtitle: 'User material',
    handles: { left: true, right: true },
  },
  {
    id: 'rag',
    x: 636,
    y: 268,
    w: 68,
    h: 68,
    shape: 'square',
    icon: Database,
    title: 'RAG Store',
    subtitle: 'Vector search',
    handles: { left: true, top: true },
  },
];

const MAIN_EDGES = [
  { from: 'goal', to: 'agent', label: 'query' },
  { from: 'agent', to: 'roadmap', label: 'plan' },
  { from: 'roadmap', to: 'teach', label: 'topics' },
  { from: 'teach', to: 'quiz', label: 'done' },
];

const BRANCH_EDGES = [{ from: 'pdfupload', to: 'rag', label: 'chunks' }];

const STACK_ICONS = [
  { Icon: Sparkles, label: 'OpenAI' },
  { Icon: Wand2, label: 'Gemini' },
  { Icon: Bot, label: 'Claude' },
  { Icon: Ghost, label: 'DeepSeek' },
  { Icon: Mountain, label: 'Vector DB' },
  { Icon: Plus, label: 'Add tool' },
];

/* ----------------------------------------------------------------------
   Helpers
------------------------------------------------------------------------*/

function handlePoint(node, side) {
  const { x, y, w, h } = node;
  switch (side) {
    case 'left':
      return { x, y: y + h / 2 };
    case 'right':
      return { x: x + w, y: y + h / 2 };
    case 'bottom':
      return { x: x + w / 2, y: y + h };
    case 'top':
      return { x: x + w / 2, y };
    default:
      return { x, y };
  }
}

/* ----------------------------------------------------------------------
   Node component
------------------------------------------------------------------------*/

function WorkflowNode({ node, selected, onPointerDown, onSelect }) {
  const Icon = node.icon;
  const isWide = node.shape === 'wide';
  const isPrimary = node.variant === 'primary';

  return (
    <div
      className="absolute"
      style={{ left: node.x, top: node.y, width: node.w, height: node.h }}
      onMouseDown={(e) => onPointerDown(e, node.id)}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        className={`relative w-full h-full flex items-center border bg-[#0a0a0b] cursor-grab active:cursor-grabbing transition-all duration-200 select-none
          ${node.shape === 'round' ? 'rounded-full justify-center' : isWide ? 'rounded-xl px-4 gap-3' : 'rounded-xl justify-center'}
          ${selected
            ? 'border-white shadow-[0_0_0_1px_rgba(255,255,255,0.6),0_0_18px_rgba(255,255,255,0.25)]'
            : 'border-white/25 hover:border-white/50'}
        `}
      >
        {isWide ? (
          <>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isPrimary ? 'bg-white text-black' : 'border border-white/40 text-white bg-white/[0.04]'
              }`}
            >
              <Icon size={16} strokeWidth={2.25} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-semibold text-white">{node.title}</span>
              <span className="text-[10px] text-zinc-500 mt-0.5">{node.subtitle}</span>
            </div>

            {node.loop && (
              <div
                title="Repeats until every topic is taught"
                className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#0a0a0b] border border-white/40 flex items-center justify-center text-white/80"
              >
                <Repeat size={11} strokeWidth={2.25} />
              </div>
            )}
          </>
        ) : (
          <Icon size={18} className="text-white" strokeWidth={1.9} />
        )}

        {node.handles.left && (
          <span className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full bg-white border border-black/40" />
        )}
        {node.handles.right && (
          <span className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full bg-white border border-black/40" />
        )}
        {node.handles.bottom && (
          <span className="absolute left-1/2 -bottom-[5px] -translate-x-1/2 w-[9px] h-[9px] rounded-full bg-white border border-black/40" />
        )}
        {node.handles.top && (
          <span className="absolute left-1/2 -top-[5px] -translate-x-1/2 w-[9px] h-[9px] rounded-full bg-white border border-black/40" />
        )}
      </div>

      {!isWide && (
        <div className="absolute top-full mt-2 w-max max-w-[130px] left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <div className="text-[11px] font-medium text-zinc-100 whitespace-nowrap">{node.title}</div>
          {node.subtitle && (
            <div className="text-[9px] font-mono text-zinc-500 whitespace-nowrap mt-0.5">{node.subtitle}</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------
   3D Rotating Particle Sphere for AI Chat Mode
------------------------------------------------------------------------*/

function RotatingParticleSphere() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate points distributed across a Fibonacci sphere
    const N = 850;
    const points = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = i * 2.3999632;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      points.push({ x, y, z });
    }

    let rotX = 0.25;
    let rotY = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      rotY += 0.0035;
      rotX += 0.0012;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const centerX = width / 2;
      const centerY = height / 2 - 25;
      const sphereRadius = Math.min(width, height) * 0.22;

      const projected = [];
      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Rotate around Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;

        // Rotate around X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective projection
        const fov = 420;
        const scale = fov / (fov + z2 * sphereRadius);
        const px = centerX + x1 * sphereRadius * scale;
        const py = centerY + y2 * sphereRadius * scale;

        projected.push({
          x: px,
          y: py,
          z: z2,
          scale,
        });
      }

      // Sort by Z for realistic depth layering
      projected.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const depthAlpha = (p.z + 1) / 2;
        const alpha = Math.max(0.12, Math.min(0.95, depthAlpha * depthAlpha));
        const size = Math.max(0.75, 1.65 * p.scale);

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow for front points
        if (p.z > 0.65) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ----------------------------------------------------------------------
   Main component
------------------------------------------------------------------------*/

export default function WorkflowEditor() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [selectedId, setSelectedId] = useState(null);
  const [activeMode, setActiveMode] = useState('agent');
  const [chatInput, setChatInput] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const dragRef = useRef(null); // { id, offsetX, offsetY }
  const panRef = useRef(null); // { startX, startY, originX, originY }
  const canvasRef = useRef(null);

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const onNodePointerDown = useCallback(
    (e, id) => {
      e.stopPropagation();
      setSelectedId(id);
      const node = nodeMap[id];
      dragRef.current = {
        id,
        startClientX: e.clientX,
        startClientY: e.clientY,
        originX: node.x,
        originY: node.y,
      };
    },
    [nodeMap]
  );

  const onCanvasPointerDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      panRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        originX: pan.x,
        originY: pan.y,
      };
    },
    [pan]
  );

  useEffect(() => {
    function onMove(e) {
      if (dragRef.current) {
        const { id, startClientX, startClientY, originX, originY } = dragRef.current;
        const dx = (e.clientX - startClientX) / zoom;
        const dy = (e.clientY - startClientY) / zoom;
        setNodes((prev) =>
          prev.map((n) => (n.id === id ? { ...n, x: originX + dx, y: originY + dy } : n))
        );
      } else if (panRef.current) {
        const { startX, startY, originX, originY } = panRef.current;
        setPan({ x: originX + (e.clientX - startX), y: originY + (e.clientY - startY) });
      }
    }
    function onUp() {
      dragRef.current = null;
      panRef.current = null;
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [zoom]);

  const onWheel = useCallback((e) => {
    // Only zoom on an explicit pinch/ctrl+wheel gesture (trackpad pinch or
    // ctrl/cmd+scroll). A plain scroll leaves the canvas exactly where it is.
    if (!(e.ctrlKey || e.metaKey)) {
      return;
    }
    e.preventDefault();
    setZoom((z) => {
      const next = z - e.deltaY * 0.001;
      return Math.min(1.6, Math.max(0.5, next));
    });
  }, []);

  const deselect = () => setSelectedId(null);

  // Precompute edge paths + label midpoints
  const mainEdgeData = MAIN_EDGES.map((edge) => {
    const a = handlePoint(nodeMap[edge.from], 'right');
    const b = handlePoint(nodeMap[edge.to], 'left');
    return { ...edge, a, b };
  });

  const branchEdgeData = BRANCH_EDGES.map((edge) => {
    const a = handlePoint(nodeMap[edge.from], 'right');
    const b = handlePoint(nodeMap[edge.to], 'left');
    return { ...edge, a, b };
  });

  // Connector carrying retrieved context up from the RAG store into the
  // Teach Topic node (so the "one by one" teaching step can draw on the
  // user's own uploaded material).
  const ragTop = handlePoint(nodeMap.rag, 'top');
  const teachBottom = handlePoint(nodeMap.teach, 'bottom');
  const dropPath = `M ${ragTop.x} ${ragTop.y} L ${ragTop.x} ${teachBottom.y + 40} Q ${ragTop.x} ${teachBottom.y + 20} ${ragTop.x - 20} ${teachBottom.y + 20} L ${teachBottom.x + 4} ${teachBottom.y + 20} Q ${teachBottom.x} ${teachBottom.y + 20} ${teachBottom.x} ${teachBottom.y} L ${teachBottom.x} ${teachBottom.y}`;

  // Dashed group container around the PDF upload / RAG branch
  const branchLeft = nodeMap.pdfupload.x - 30;
  const branchTop = nodeMap.pdfupload.y - 28;
  const branchRight = nodeMap.rag.x + nodeMap.rag.w + 30;
  const branchBottom = nodeMap.rag.y + nodeMap.rag.h + 60;

  return (
    <div className="h-screen w-screen bg-[#0a0b0b] text-white overflow-hidden flex select-none font-sans">
      {/* ============================= SIDEBAR ============================= */}
      <aside className="relative z-20 w-[250px] flex-shrink-0 border-r border-white/10 flex flex-col justify-between px-4 py-5">
        <div>
          {/* Hazard stripes */}
          <div className="flex h-9 w-3 flex-col justify-between overflow-hidden opacity-50 mb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="h-[1.5px] w-4 origin-left rotate-45 bg-white" />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setActiveMode('agent')}
            className={`w-full h-9 rounded-md border text-[11px] font-mono font-bold tracking-[0.15em] uppercase transition-colors mt-10 mb-3 cursor-pointer ${
              activeMode === 'agent'
                ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                : 'border-white/15 text-white/50 hover:text-white/80 hover:border-white/40'
            }`}
          >
            AI Agent
          </button>

          <div className="relative mb-6">
            <button
              type="button"
              onClick={() => setActiveMode('chat')}
              className={`w-full h-9 rounded-md border text-[11px] font-mono font-bold tracking-[0.15em] uppercase transition-colors cursor-pointer ${
                activeMode === 'chat'
                  ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                  : 'border-white/15 text-white/50 hover:text-white/80 hover:border-white/40'
              }`}
            >
              AI Chat
            </button>
          </div>

          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-3.5">
            Stack
          </p>
          <div className="grid grid-cols-3 gap-2.5 w-full">
            {STACK_ICONS.map(({ Icon, label }, idx) => (
              <div
                key={idx}
                title={label}
                className="flex items-center justify-center aspect-square rounded-xl border border-white/20 bg-white/[0.03] text-zinc-300 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all cursor-pointer shadow-sm group"
              >
                <Icon size={21} strokeWidth={1.8} className="transition-transform duration-200 group-hover:scale-110" />
              </div>
            ))}
          </div>
        </div>

        {/* AUTO decal */}
        <div className="flex flex-col gap-2">
          <div className="w-2.5 h-8 border-l border-b border-white/25 rounded-bl-md ml-1" />
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Auto</span>
          </div>
          <div className="h-2 w-24 bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.7)_0_2px,transparent_2px_5px)] opacity-50" />
        </div>
      </aside>

      {/* ============================= MAIN ============================= */}
      <main className="relative flex-1 flex flex-col overflow-hidden">
        {/* Top toolbar */}
        <div className="relative z-20 flex items-center justify-between gap-3 px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-white/15 rounded-md overflow-hidden h-9">
              <button
                type="button"
                aria-label="Undo"
                className="px-3 h-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors border-r border-white/15 cursor-pointer"
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                aria-label="Redo"
                className="px-3 h-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RotateCw size={14} />
              </button>
            </div>

            {activeMode === 'agent' ? (
              <>
                <button
                  type="button"
                  className="flex items-center gap-2 h-9 px-4 rounded-md border border-white/15 bg-white/[0.02] text-[11px] font-mono font-medium text-white/85 hover:border-white/35 transition-colors cursor-pointer"
                >
                  <span>Agent Mode</span>
                  <Sparkles size={13} className="text-amber-300" />
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 h-9 px-4 rounded-md border border-white/15 bg-white/[0.02] text-[11px] font-mono font-medium text-white/85 hover:border-white/35 transition-colors cursor-pointer"
                >
                  <span>Study Flow</span>
                  <Link2 size={12} className="text-white/50" />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 h-9 px-4 rounded-md border border-white/15 bg-white/[0.02] text-[11px] font-mono font-medium text-white/85">
                  <span>Chat Mode</span>
                  <MessageSquare size={13} className="text-blue-400" />
                </div>

                <div className="flex items-center gap-2 h-9 px-4 rounded-md border border-white/15 bg-white/[0.02] text-[11px] font-mono text-zinc-300">
                  <span>AVORA_NEURAL.live</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* ================= CANVAS VIEWPORT ================= */}
        {activeMode === 'chat' ? (
          /* AI CHAT VIEW matching reference screenshot */
          <div
            className="relative flex-1 overflow-hidden flex flex-col items-center justify-center"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          >
            {/* 3D Rotating Geodesic Particle Sphere */}
            <RotatingParticleSphere />

            {/* Bottom Floating Prompt Bar matching reference */}
            <div className="absolute bottom-6 left-6 right-6 lg:left-10 lg:right-10 border border-white/15 bg-black/70 backdrop-blur-xl rounded-xl p-4 flex flex-col justify-between gap-3.5 z-30 shadow-2xl">
              {/* Prompt Text Input */}
              <div className="flex items-center gap-1 font-mono text-xs sm:text-sm text-zinc-300">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Daemon AI anything..."
                  className="w-full bg-transparent outline-none border-none text-white placeholder:text-zinc-400 font-mono text-xs sm:text-sm focus:outline-none"
                />
                <span className="animate-pulse text-white font-bold font-mono">_</span>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between pt-1">
                {/* Left: Plus & Tools */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Add attachment"
                    className="w-7 h-7 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 h-7 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal size={12} />
                    <span>Tools</span>
                  </button>
                </div>

                {/* Right: Send & Mic */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    aria-label="Send message"
                    className="w-7 h-7 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <SendHorizontal size={13} />
                  </button>
                  <button
                    type="button"
                    aria-label="Voice input"
                    className="w-7 h-7 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center transition-colors cursor-pointer shadow-md"
                  >
                    <Mic size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* AI AGENT NODE GRAPH VIEW */
          <div
            ref={canvasRef}
            onMouseDown={onCanvasPointerDown}
            onClick={deselect}
            onWheel={onWheel}
            className="relative flex-1 overflow-hidden cursor-default"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
              backgroundPosition: `${pan.x % 22}px ${pan.y % 22}px`,
            }}
          >
          <div
            className="absolute"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              left: 60,
              top: 90,
            }}
          >
            {/* Edges */}
            <svg
              className="absolute overflow-visible pointer-events-none"
              style={{ left: 0, top: 0, width: 1, height: 1 }}
            >
              <style>{`
                @keyframes wfDash { from { stroke-dashoffset: 16; } to { stroke-dashoffset: 0; } }
                .wf-edge { animation: wfDash 1.1s linear infinite; }
              `}</style>

              {mainEdgeData.map((edge, i) => (
                <path
                  key={`main-${i}`}
                  d={`M ${edge.a.x} ${edge.a.y} L ${edge.b.x} ${edge.b.y}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.3"
                  strokeDasharray="4 4"
                  className="wf-edge"
                />
              ))}

              {branchEdgeData.map((edge, i) => (
                <path
                  key={`branch-${i}`}
                  d={`M ${edge.a.x} ${edge.a.y} L ${edge.b.x} ${edge.b.y}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.3"
                  strokeDasharray="4 4"
                  className="wf-edge"
                />
              ))}

              <path
                d={dropPath}
                fill="none"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="1.2"
                strokeDasharray="3 4"
              />

              {/* dashed group container for the RAG branch */}
              <rect
                x={branchLeft}
                y={branchTop}
                width={branchRight - branchLeft}
                height={branchBottom - branchTop}
                rx={22}
                fill="rgba(255,255,255,0.015)"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
                strokeDasharray="5 6"
              />
            </svg>

            {/* item labels on main + branch edges */}
            {mainEdgeData.map((edge, i) => {
              const midX = (edge.a.x + edge.b.x) / 2;
              const midY = edge.a.y;
              return (
                <div
                  key={`label-${i}`}
                  className="absolute text-[9px] font-mono text-zinc-400 bg-[#0a0b0b] px-1 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                  style={{ left: midX, top: midY - 12 }}
                >
                  {edge.label}
                </div>
              );
            })}
            {branchEdgeData.map((edge, i) => {
              const midX = (edge.a.x + edge.b.x) / 2;
              const midY = edge.a.y;
              return (
                <div
                  key={`branch-label-${i}`}
                  className="absolute text-[9px] font-mono text-zinc-400 bg-[#0a0b0b] px-1 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                  style={{ left: midX, top: midY - 12 }}
                >
                  {edge.label}
                </div>
              );
            })}

            {/* RAG branch group label */}
            <div
              className="absolute text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap"
              style={{ left: branchLeft + 14, top: branchTop - 16 }}
            >
              RAG pipeline
            </div>

            {/* Nodes */}
            {nodes.map((node) => (
              <WorkflowNode
                key={node.id}
                node={node}
                selected={selectedId === node.id}
                onPointerDown={onNodePointerDown}
                onSelect={setSelectedId}
              />
            ))}

            {/* add-node plus button after the quiz node */}
            <div
              className="absolute w-6 h-6 rounded-full border border-dashed border-white/30 hover:border-white text-white/50 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              style={{
                left: nodeMap.quiz.x + nodeMap.quiz.w + 30,
                top: nodeMap.quiz.y + nodeMap.quiz.h / 2 - 12,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Plus size={13} />
            </div>
          </div>
        </div>
      )}
    </main>

      {/* ============================= RIGHT DECORATION ============================= */}
      <div className="relative z-20 w-8 flex-shrink-0 border-l border-white/10 flex flex-col items-center justify-between py-6">
        <span
          className="text-[9px] font-mono text-white/25 tracking-[0.25em] uppercase"
          style={{ writingMode: 'vertical-rl' }}
        >
          Host
        </span>
        <div className="w-px flex-1 bg-white/15 my-6" />
        <div className="w-px h-6 bg-white/25" />
      </div>
    </div>
  );
}