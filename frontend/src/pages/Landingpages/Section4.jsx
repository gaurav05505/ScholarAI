import React, { useState, useRef, useCallback, useEffect } from 'react';
import ScrollReveal from '../../components/ScrollReveal';
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
  Menu,
  X,
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

function getClientPos(e) {
  if (e.touches && e.touches.length > 0) {
    return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
  }
  return { clientX: e.clientX, clientY: e.clientY };
}

function WorkflowNode({ node, selected, onPointerDown, onSelect }) {
  const Icon = node.icon;
  const isWide = node.shape === 'wide';
  const isPrimary = node.variant === 'primary';

  return (
    <div
      className="absolute"
      style={{ left: node.x, top: node.y, width: node.w, height: node.h }}
      onMouseDown={(e) => onPointerDown(e, node.id)}
      onTouchStart={(e) => onPointerDown(e, node.id)}
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
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[13px] font-semibold text-white truncate">{node.title}</span>
              <span className="text-[10px] text-zinc-500 mt-0.5 truncate">{node.subtitle}</span>
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

    const N = 750;
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

      rotY += 0.004;
      rotX += 0.0015;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const centerX = width / 2;
      const centerY = height / 2 - (height > 500 ? 30 : 20);
      const sphereRadius = Math.min(width, height) * (width < 500 ? 0.26 : 0.22);

      const projected = [];
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const fov = 400;
        const scale = fov / (fov + z2 * sphereRadius);
        const px = centerX + x1 * sphereRadius * scale;
        const py = centerY + y2 * sphereRadius * scale;

        projected.push({ x: px, y: py, z: z2, scale });
      }

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

export default function WorkflowEditor() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [selectedId, setSelectedId] = useState(null);
  const [activeMode, setActiveMode] = useState('agent');
  const [chatInput, setChatInput] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dragRef = useRef(null);
  const panRef = useRef(null);
  const canvasRef = useRef(null);
  const touchDistRef = useRef(null);

  // Auto-fit & auto-center graph dynamically
  const autoFitGraph = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);

    const canvas = canvasRef.current;
    const containerW = canvas ? canvas.offsetWidth : (window.innerWidth - 32);
    const containerH = canvas ? canvas.offsetHeight : 520;

    const contentW = 1000;
    const contentH = 410;

    if (mobile) {
      const padding = 16;
      const targetZoom = Math.min(0.65, Math.max(0.32, (containerW - padding * 2) / contentW));
      const targetX = (containerW - contentW * targetZoom) / 2 - 15 * targetZoom;
      const targetY = (containerH - contentH * targetZoom) / 2 - 10 * targetZoom;

      setZoom(targetZoom);
      setPan({ x: targetX, y: targetY });
    } else {
      const targetZoom = containerW < 1200 ? 0.85 : 1;
      const targetX = (containerW - contentW * targetZoom) / 2;
      const targetY = (containerH - contentH * targetZoom) / 2;
      setZoom(targetZoom);
      setPan({ x: targetX, y: targetY });
    }
  }, []);

  useEffect(() => {
    autoFitGraph();
    const timer = setTimeout(autoFitGraph, 100);
    window.addEventListener('resize', autoFitGraph);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', autoFitGraph);
    };
  }, [autoFitGraph]);

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const onNodePointerDown = useCallback(
    (e, id) => {
      e.stopPropagation();
      setSelectedId(id);
      const pos = getClientPos(e);
      const node = nodeMap[id];
      dragRef.current = {
        id,
        startClientX: pos.clientX,
        startClientY: pos.clientY,
        originX: node.x,
        originY: node.y,
      };
    },
    [nodeMap]
  );

  const onCanvasPointerDown = useCallback(
    (e) => {
      // Allow normal single-finger page scrolling on mobile/touch screens
      if (e.touches && e.touches.length < 2) return;
      if (e.button !== 0 && e.type === 'mousedown') return;
      const pos = getClientPos(e);
      panRef.current = {
        startX: pos.clientX,
        startY: pos.clientY,
        originX: pan.x,
        originY: pan.y,
      };
    },
    [pan]
  );

  useEffect(() => {
    function onMove(e) {
      if (dragRef.current) {
        const pos = getClientPos(e);
        const { id, startClientX, startClientY, originX, originY } = dragRef.current;
        const dx = (pos.clientX - startClientX) / zoom;
        const dy = (pos.clientY - startClientY) / zoom;
        setNodes((prev) =>
          prev.map((n) => (n.id === id ? { ...n, x: originX + dx, y: originY + dy } : n))
        );
      } else if (panRef.current && (!e.touches || e.touches.length >= 2)) {
        const pos = getClientPos(e);
        const { startX, startY, originX, originY } = panRef.current;
        setPan({ x: originX + (pos.clientX - startX), y: originY + (pos.clientY - startY) });
      }
    }
    function onUp() {
      dragRef.current = null;
      panRef.current = null;
      touchDistRef.current = null;
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [zoom]);

  const onWheel = useCallback((e) => {
    if (!(e.ctrlKey || e.metaKey)) {
      return;
    }
    e.preventDefault();
    setZoom((z) => {
      const next = z - e.deltaY * 0.001;
      return Math.min(1.6, Math.max(0.3, next));
    });
  }, []);

  const onTouchStart = useCallback((e) => {
    if (e.touches && e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistRef.current = dist;
    }
  }, []);

  const onTouchMove = useCallback((e) => {
    if (e.touches && e.touches.length === 2 && touchDistRef.current) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = dist / touchDistRef.current;
      touchDistRef.current = dist;
      setZoom((z) => Math.min(1.6, Math.max(0.3, z * scale)));
    }
  }, []);

  const deselect = () => setSelectedId(null);

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

  const ragTop = handlePoint(nodeMap.rag, 'top');
  const teachBottom = handlePoint(nodeMap.teach, 'bottom');
  const dropPath = `M ${ragTop.x} ${ragTop.y} L ${ragTop.x} ${teachBottom.y + 40} Q ${ragTop.x} ${teachBottom.y + 20} ${ragTop.x - 20} ${teachBottom.y + 20} L ${teachBottom.x + 4} ${teachBottom.y + 20} Q ${teachBottom.x} ${teachBottom.y + 20} ${teachBottom.x} ${teachBottom.y} L ${teachBottom.x} ${teachBottom.y}`;

  const branchLeft = nodeMap.pdfupload.x - 30;
  const branchTop = nodeMap.pdfupload.y - 28;
  const branchRight = nodeMap.rag.x + nodeMap.rag.w + 30;
  const branchBottom = nodeMap.rag.y + nodeMap.rag.h + 60;

  return (
    <section className="relative mx-4 sm:mx-6 lg:mx-8 my-8 sm:my-12 lg:my-16">
      {/* Mobile Drawer Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Container Card */}
      <ScrollReveal
        delay={0}
        duration={800}
        scale={true}
        className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] bg-[#08080a] text-white overflow-hidden flex select-none font-sans rounded-2xl border border-white/10 shadow-2xl"
      >
        
        {/* ============================= SIDEBAR (Desktop inline, Mobile slide-over) ============================= */}
        <aside
          className={`z-50 flex-shrink-0 border-r border-white/10 flex flex-col justify-between px-4 py-5 bg-[#0a0a0c] transition-all duration-300 ease-out
            ${isMobile
              ? `fixed top-0 left-0 h-full w-[270px] shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
              : 'relative w-[240px] translate-x-0'
            }
          `}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-8 w-3 flex-col justify-between overflow-hidden opacity-50">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="h-[1.5px] w-4 origin-left rotate-45 bg-white" />
                ))}
              </div>

              {isMobile && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex flex-col gap-2 mt-4 sm:mt-6 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('agent');
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full h-9 rounded-md border text-[11px] font-mono font-bold tracking-[0.15em] uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeMode === 'agent'
                    ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                    : 'border-white/15 text-white/50 hover:text-white/80 hover:border-white/40'
                }`}
              >
                <Zap size={13} className={activeMode === 'agent' ? 'fill-black' : ''} />
                <span>AI Agent</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMode('chat');
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full h-9 rounded-md border text-[11px] font-mono font-bold tracking-[0.15em] uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeMode === 'chat'
                    ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                    : 'border-white/15 text-white/50 hover:text-white/80 hover:border-white/40'
                }`}
              >
                <MessageSquare size={13} />
                <span>AI Chat</span>
              </button>
            </div>

            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-3">
              Stack
            </p>
            <div className="grid grid-cols-3 gap-2 w-full">
              {STACK_ICONS.map(({ Icon, label }, idx) => (
                <div
                  key={idx}
                  title={label}
                  className="flex items-center justify-center aspect-square rounded-xl border border-white/20 bg-white/[0.03] text-zinc-300 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all cursor-pointer shadow-sm group"
                >
                  <Icon size={18} strokeWidth={1.8} className="transition-transform duration-200 group-hover:scale-110" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <div className="w-2.5 h-6 border-l border-b border-white/25 rounded-bl-md ml-1" />
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Auto</span>
            </div>
            <div className="h-1.5 w-20 bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.7)_0_2px,transparent_2px_5px)] opacity-50" />
          </div>
        </aside>

        {/* ============================= MAIN CANVAS / VIEWPORT ============================= */}
        <main className="relative flex-1 flex flex-col overflow-hidden min-w-0">
          
          {/* Top Toolbar */}
          <div className="relative z-20 flex items-center justify-between gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-white/10 bg-[#08080a]/90 backdrop-blur-md">
            
            {/* Left: Mobile Drawer Trigger + Quick Mode Toggle */}
            <div className="flex items-center gap-2">
              {isMobile && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/20 bg-white/5 text-white/80 hover:text-white cursor-pointer"
                  aria-label="Open Stack Menu"
                >
                  <Menu size={16} />
                </button>
              )}

              {/* Mobile Quick Mode Toggle Switch */}
              <div className="flex items-center border border-white/15 rounded-lg overflow-hidden bg-black/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setActiveMode('agent')}
                  className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase rounded-md transition-all cursor-pointer ${
                    activeMode === 'agent'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Agent
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('chat')}
                  className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase rounded-md transition-all cursor-pointer ${
                    activeMode === 'chat'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Chat
                </button>
              </div>
            </div>

            {/* Right: Badges & Undo/Redo */}
            <div className="flex items-center gap-2">
              {activeMode === 'agent' ? (
                <>
                  <div className="flex items-center border border-white/15 rounded-lg overflow-hidden h-7 sm:h-8 bg-white/[0.02]">
                    <button
                      type="button"
                      aria-label="Undo"
                      className="px-2 sm:px-2.5 h-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors border-r border-white/15 cursor-pointer"
                    >
                      <RotateCcw size={12} />
                    </button>
                    <button
                      type="button"
                      aria-label="Redo"
                      className="px-2 sm:px-2.5 h-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <RotateCw size={12} />
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg border border-white/15 bg-white/[0.02] text-[10px] font-mono font-medium text-white/85">
                    <span>Agent Mode</span>
                    <Sparkles size={12} className="text-amber-300" />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1.5 h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg border border-white/15 bg-white/[0.02] text-[10px] font-mono text-zinc-300">
                  <span className="hidden sm:inline">AVORA_NEURAL.live</span>
                  <span className="sm:hidden">LIVE</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
              )}
            </div>
          </div>

          {/* Canvas Viewport */}
          {activeMode === 'chat' ? (
            /* ================= AI CHAT VIEW ================= */
            <div
              className="relative flex-1 overflow-hidden flex flex-col items-center justify-center"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            >
              {/* 3D Geodesic Rotating Sphere */}
              <RotatingParticleSphere />

              {/* Bottom Prompt Bar */}
              <div className="absolute bottom-3 sm:bottom-5 left-3 right-3 sm:left-6 sm:right-6 lg:left-10 lg:right-10 border border-white/15 bg-black/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 flex flex-col justify-between gap-2.5 sm:gap-3.5 z-30 shadow-2xl">
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

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      aria-label="Add attachment"
                      className="w-7 h-7 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Plus size={13} />
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1 px-2.5 sm:px-3 h-7 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-[10px] sm:text-[11px] font-mono transition-colors cursor-pointer"
                    >
                      <SlidersHorizontal size={11} />
                      <span>Tools</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Send message"
                      className="w-7 h-7 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <SendHorizontal size={12} />
                    </button>
                    <button
                      type="button"
                      aria-label="Voice input"
                      className="w-7 h-7 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center transition-colors cursor-pointer shadow-md"
                    >
                      <Mic size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= AI AGENT NODE GRAPH VIEW ================= */
            <div
              ref={canvasRef}
              onMouseDown={onCanvasPointerDown}
              onClick={deselect}
              onWheel={onWheel}
              onTouchStart={(e) => {
                onCanvasPointerDown(e);
                onTouchStart(e);
              }}
              onTouchMove={onTouchMove}
              className="relative flex-1 overflow-hidden cursor-default touch-pan-y"
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
                  left: 0,
                  top: 0,
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

                  {/* Dashed group container for RAG branch */}
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

                {/* Edge item labels */}
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

                {/* RAG pipeline group label */}
                <div
                  className="absolute text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap"
                  style={{ left: branchLeft + 14, top: branchTop - 16 }}
                >
                  RAG pipeline
                </div>

                {/* Interactive Workflow Nodes */}
                {nodes.map((node) => (
                  <WorkflowNode
                    key={node.id}
                    node={node}
                    selected={selectedId === node.id}
                    onPointerDown={onNodePointerDown}
                    onSelect={setSelectedId}
                  />
                ))}

                {/* Plus button after quiz node */}
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

        {/* Right Host Deco (Desktop only) */}
        <div className="hidden lg:flex relative z-20 w-8 flex-shrink-0 border-l border-white/10 flex-col items-center justify-between py-6">
          <span
            className="text-[9px] font-mono text-white/25 tracking-[0.25em] uppercase"
            style={{ writingMode: 'vertical-rl' }}
          >
            Host
          </span>
          <div className="w-px flex-1 bg-white/15 my-6" />
          <div className="w-px h-6 bg-white/25" />
        </div>
      </ScrollReveal>
    </section>
  );
}