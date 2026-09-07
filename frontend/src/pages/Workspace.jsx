import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import axios from 'axios';
import {
  ArrowUpRight,
  AudioLines,
  Bolt,
  Clock3,
  Eclipse,
  FolderGit2,
  Map,
  Plus,
  Pencil,
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  Trash2,
  UserRound,
  Menu,
  X,
  FileText,
  ListChecks,
  Sparkles,
  LogOut,
  ChevronDown,
  Upload,
  Globe,
  Share2,
  SendHorizontal,
  SlidersHorizontal,
  Layers,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  BookOpen,
  GitBranch,
  Copy,
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  BrainCircuit,
  Lightbulb,
  Compass,
  Zap,
  HelpCircle,
  Download,
  ExternalLink,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { SettingsPanel } from '../components/SettingsPanel.jsx';

const API_URL = 'http://localhost:5000/api/chat';

/* ---------- Markdown & Inline Formatter ---------- */

const INLINE_PATTERN =
  /(!\[([^\]]*?)\]\(([^)]+?)\))|(\[([^\]]+?)\]\(([^)]+?)\))|(\*\*\*([^*]+?)\*\*\*)|(\*\*([^*]+?)\*\*)|(\*([^*]+?)\*)|(`([^`]+?)`)/g;

function renderInline(text, keyBase) {
  if (!text) return null;
  const nodes = [];
  let lastIndex = 0;
  let match;
  let i = 0;

  const regex = new RegExp(INLINE_PATTERN);

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const key = `${keyBase}-${i++}`;

    if (match[1] !== undefined) {
      nodes.push(
        <img
          key={key}
          src={match[3]}
          alt={match[2] || ''}
          loading="lazy"
          className="my-3 max-w-full rounded-2xl border border-black/10 dark:border-[#25282D] shadow-sm"
        />
      );
    } else if (match[4] !== undefined) {
      nodes.push(
        <a
          key={key}
          href={match[6]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2563eb] dark:text-[#60a5fa] hover:underline font-medium inline-flex items-center gap-1"
        >
          {match[5]}
          <ExternalLink size={12} className="inline opacity-70" />
        </a>
      );
    } else if (match[7] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-zinc-950 dark:text-[#E5E7EB]">
          <em>{match[8]}</em>
        </strong>
      );
    } else if (match[9] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-zinc-950 dark:text-[#E5E7EB]">
          {match[10]}
        </strong>
      );
    } else if (match[11] !== undefined) {
      nodes.push(
        <em key={key} className="italic text-zinc-800 dark:text-[#8B9099]">
          {match[12]}
        </em>
      );
    } else if (match[13] !== undefined) {
      nodes.push(
        <code
          key={key}
          className="rounded-lg bg-black/[0.06] dark:bg-white/10 px-1.5 py-0.5 text-[0.875em] font-mono font-medium text-red-600 dark:text-red-400"
        >
          {match[14]}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

const CodeBlock = memo(({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  }, [code]);

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-zinc-800 dark:border-[#25282D] bg-[#121316] dark:bg-[#0B0D10] shadow-md text-left">
      <div className="flex items-center justify-between border-b border-zinc-800 dark:border-[#25282D] bg-zinc-900/90 dark:bg-[#111316] px-4 py-2 text-[11px] font-mono text-zinc-400 dark:text-[#8B9099] tracking-wider">
        <span>{language ? language.toUpperCase() : 'CODE'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg bg-white/10 dark:bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-200 dark:text-[#E5E7EB] transition-colors hover:bg-white/20 dark:hover:bg-white/10 active:scale-95 cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13.5px] leading-relaxed text-emerald-300 dark:text-[#6EE7B7] font-mono whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
});

function renderMarkdownBlocks(text, segmentIdx) {
  const lines = text.split('\n');
  const blocks = [];
  let currentBlockType = null;
  let accumulatedLines = [];

  const flushBlock = (nextType = null) => {
    if (accumulatedLines.length === 0) {
      currentBlockType = nextType;
      return;
    }

    const key = `blk-${segmentIdx}-${blocks.length}`;

    if (currentBlockType === 'heading') {
      const line = accumulatedLines[0];
      const match = line.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const textContent = match[2];
        const headingClasses = {
          1: 'text-2xl font-bold mt-6 mb-3 text-zinc-950 dark:text-[#E5E7EB] border-b border-black/10 dark:border-[#25282D] pb-2 tracking-tight',
          2: 'text-xl font-semibold mt-5 mb-2.5 text-zinc-950 dark:text-[#E5E7EB] tracking-tight',
          3: 'text-lg font-semibold mt-4.5 mb-2 text-zinc-900 dark:text-[#E5E7EB]',
          4: 'text-base font-medium mt-4 mb-2 text-zinc-800 dark:text-[#D1D5DB]',
          5: 'text-sm font-medium mt-3.5 mb-1.5 text-zinc-700 dark:text-[#9CA3AF]',
          6: 'text-xs font-medium mt-3 mb-1.5 text-zinc-600 dark:text-[#8B9099] uppercase tracking-wider',
        };
        const Tag = `h${level}`;
        blocks.push(
          <Tag key={key} className={headingClasses[level] || 'font-bold'}>
            {renderInline(textContent, key)}
          </Tag>
        );
      }
    } else if (currentBlockType === 'hr') {
      blocks.push(
        <hr key={key} className="my-6 border-0 border-t border-black/10 dark:border-[#25282D]" />
      );
    } else if (currentBlockType === 'blockquote') {
      const content = accumulatedLines.join('\n');
      blocks.push(
        <blockquote
          key={key}
          className="my-4 border-l-4 border-zinc-900 dark:border-[#3B82F6] bg-black/[0.03] dark:bg-white/[0.03] px-4 py-2.5 text-[14.5px] italic text-zinc-700 dark:text-[#8B9099] rounded-r-xl"
        >
          {renderMarkdownBlocks(content, `${segmentIdx}-quote`)}
        </blockquote>
      );
    } else if (currentBlockType === 'table') {
      const tableLines = accumulatedLines.filter((l) => l.trim() !== '');
      if (tableLines.length > 0) {
        const headersLine = tableLines[0];
        let startRowIdx = 1;
        if (tableLines[1] && tableLines[1].includes('-')) {
          startRowIdx = 2;
        }

        const parseTableRow = (rowText) => {
          let cells = rowText.split('|').map((c) => c.trim());
          if (rowText.startsWith('|')) cells.shift();
          if (rowText.endsWith('|')) cells.pop();
          return cells;
        };

        const headers = parseTableRow(headersLine);
        const rows = tableLines.slice(startRowIdx).map(parseTableRow);

        blocks.push(
          <div
            key={key}
            className="my-4 w-full overflow-x-auto rounded-2xl border border-black/10 dark:border-[#25282D] bg-white dark:bg-[#111316] shadow-xs"
          >
            <table className="w-full border-collapse text-left text-sm text-zinc-900 dark:text-[#E5E7EB]">
              <thead>
                <tr className="border-b border-black/10 dark:border-[#25282D] bg-black/[0.02] dark:bg-white/[0.02] font-semibold text-zinc-950 dark:text-[#E5E7EB]">
                  {headers.map((h, i) => (
                    <th
                      key={`th-${i}`}
                      className="px-4 py-3 font-semibold border-r last:border-r-0 border-black/5 dark:border-[#25282D]"
                    >
                      {renderInline(h, `${key}-h-${i}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-[#25282D]">
                {rows.map((row, rIdx) => (
                  <tr
                    key={`tr-${rIdx}`}
                    className="hover:bg-black/[0.01] dark:hover:bg-white/[0.02] transition-colors odd:bg-white dark:odd:bg-[#111316] even:bg-black/[0.01] dark:even:bg-white/[0.02]"
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={`td-${rIdx}-${cIdx}`}
                        className="px-4 py-2.5 text-zinc-700 dark:text-[#D1D5DB] border-r last:border-r-0 border-black/5 dark:border-[#25282D]"
                      >
                        {renderInline(cell, `${key}-r-${rIdx}-c-${cIdx}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    } else if (currentBlockType === 'list') {
      const isOrdered = /^\s*\d+\.\s+/.test(accumulatedLines[0]);
      const items = accumulatedLines.map((l, i) => {
        const itemKey = `${key}-li-${i}`;
        const match = l.match(/^\s*(?:(?:[-*+])|(?:\d+\.))\s+(.*)$/);
        const textContent = match ? match[1] : l;

        const indentMatch = l.match(/^(\s*)/);
        const indentSpaces = indentMatch ? indentMatch[1].length : 0;

        const taskMatch = textContent.match(/^\[([ xX])\]\s+(.*)$/);
        if (taskMatch) {
          const checked = taskMatch[1].toLowerCase() === 'x';
          const taskContent = taskMatch[2];
          return (
            <li
              key={itemKey}
              style={{ paddingLeft: `${indentSpaces * 4}px` }}
              className="flex items-start gap-2.5 my-1 text-zinc-800 dark:text-[#D1D5DB] list-none"
            >
              <input
                type="checkbox"
                checked={checked}
                readOnly
                className="mt-1 h-4 w-4 rounded-md border-black/20 dark:border-[#25282D] text-zinc-950 dark:text-[#3B82F6] focus:ring-0 cursor-default accent-zinc-950 dark:accent-[#3B82F6]"
              />
              <span
                className={
                  checked
                    ? 'line-through text-zinc-400 dark:text-zinc-600'
                    : 'text-zinc-800 dark:text-[#D1D5DB]'
                }
              >
                {renderInline(taskContent, itemKey)}
              </span>
            </li>
          );
        }

        return (
          <li
            key={itemKey}
            style={{ paddingLeft: `${indentSpaces * 4}px` }}
            className="my-0.5 leading-relaxed text-zinc-800 dark:text-[#D1D5DB]"
          >
            {renderInline(textContent, itemKey)}
          </li>
        );
      });

      if (isOrdered) {
        blocks.push(
          <ol
            key={key}
            className="my-3 list-decimal space-y-1.5 pl-6 text-[14.5px] text-zinc-800 dark:text-[#D1D5DB]"
          >
            {items}
          </ol>
        );
      } else {
        const containsTasks = accumulatedLines.some((l) =>
          /^\s*[-*+]\s+\[[ xX]\]/i.test(l)
        );
        blocks.push(
          <ul
            key={key}
            className={`my-3 space-y-1.5 text-[14.5px] text-zinc-800 dark:text-[#D1D5DB] ${
              containsTasks ? 'pl-1.5' : 'list-disc pl-6'
            }`}
          >
            {items}
          </ul>
        );
      }
    } else if (currentBlockType === 'paragraph') {
      const pText = accumulatedLines.join('\n');
      blocks.push(
        <p
          key={key}
          className="my-2.5 leading-relaxed text-[14.5px] text-zinc-850 dark:text-[#D1D5DB] whitespace-pre-line"
        >
          {renderInline(pText, key)}
        </p>
      );
    }

    accumulatedLines = [];
    currentBlockType = nextType;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      flushBlock();
      continue;
    }

    if (/^(?:---|---|___|\*\*\*)\s*$/.test(trimmed)) {
      flushBlock('hr');
      accumulatedLines.push(line);
      flushBlock();
    } else if (/^(#{1,6})\s+(.*)$/.test(line)) {
      flushBlock('heading');
      accumulatedLines.push(line);
      flushBlock();
    } else if (/^\s*>\s*(.*)$/.test(line)) {
      const match = line.match(/^\s*>\s*(.*)$/);
      const quoteText = match ? match[1] : '';
      if (currentBlockType !== 'blockquote') {
        flushBlock('blockquote');
      }
      accumulatedLines.push(quoteText);
    } else if (line.includes('|')) {
      if (currentBlockType !== 'table') {
        flushBlock('table');
      }
      accumulatedLines.push(line);
    } else if (
      /^\s*(?:[-*+])\s+(.*)$/.test(line) ||
      /^\s*\d+\.\s+(.*)$/.test(line)
    ) {
      if (currentBlockType !== 'list') {
        flushBlock('list');
      }
      accumulatedLines.push(line);
    } else {
      if (currentBlockType !== 'paragraph' && currentBlockType !== null) {
        flushBlock('paragraph');
      } else if (currentBlockType === null) {
        currentBlockType = 'paragraph';
      }
      accumulatedLines.push(line);
    }
  }

  flushBlock();
  return blocks;
}

function renderMarkdown(raw) {
  if (!raw) return null;

  const segments = raw.split(/```/);
  const elements = [];

  segments.forEach((segment, segIdx) => {
    const isCode = segIdx % 2 === 1;

    if (isCode) {
      const lines = segment.split('\n');
      const firstLineIsLang =
        lines[0] &&
        /^[a-zA-Z0-9_+-]*$/.test(lines[0].trim()) &&
        lines.length > 1;
      const language = firstLineIsLang ? lines[0].trim() : '';
      const code = (firstLineIsLang ? lines.slice(1) : lines)
        .join('\n')
        .replace(/^\n/, '')
        .replace(/\n$/, '');

      elements.push(
        <CodeBlock key={`code-${segIdx}`} language={language} code={code} />
      );
    } else {
      elements.push(...renderMarkdownBlocks(segment, segIdx));
    }
  });

  return elements;
}

/* ---------- Nav building blocks ---------- */

const NavItem = memo(({ text, icon: Icon, active, onClick, collapsed, badge }) => (
  <button
    type="button"
    onClick={onClick}
    title={collapsed ? text : undefined}
    className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer select-none group
      ${
        active
          ? 'bg-white text-zinc-950 font-semibold shadow-xs dark:bg-[#1A1D21] dark:text-[#E5E7EB] dark:border dark:border-[#25282D]'
          : 'text-zinc-750 hover:text-zinc-950 hover:bg-white/40 dark:text-[#8B9099] dark:hover:text-[#E5E7EB] dark:hover:bg-[#1A1D21]/60'
      }
      ${collapsed ? 'justify-center px-0' : ''}`}
  >
    <div className="flex items-center gap-3.5 min-w-0">
      <Icon size={18} className="shrink-0 text-zinc-800 dark:text-[#8B9099] group-hover:scale-105 group-hover:text-black dark:group-hover:text-[#E5E7EB] transition-transform" strokeWidth={1.8} />
      {!collapsed && <span className="truncate">{text}</span>}
    </div>
    {!collapsed && badge !== undefined && (
      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/5 text-zinc-700 dark:bg-white/10 dark:text-[#E5E7EB]">
        {badge}
      </span>
    )}
  </button>
));

const TABS = [
  { key: 'source', label: 'Sources', icon: FileText },
  { key: 'chats', label: 'Ai chat', icon: MessageSquare },
  { key: 'roadmap', label: 'Roadmap', icon: Map },
  { key: 'questions', label: 'Important Questions', icon: ListChecks },
];

const VIEWS = [
  'source',
  'chats',
  'roadmap',
  'questions',
  'allChats',
  'allRoadmaps',
  'projects',
  'settings',
];

const InfoPanel = memo(({ title, body, icon: Icon = Sparkles, action }) => (
  <div className="flex h-full flex-col items-center justify-center text-center px-6">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] text-zinc-800 dark:text-[#E5E7EB] shadow-xs">
      <Icon size={26} strokeWidth={1.75} />
    </div>
    <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-[#E5E7EB] tracking-tight">
      {title}
    </h2>
    <p className="mt-2 max-w-sm text-sm text-zinc-600 dark:text-[#8B9099] leading-relaxed">
      {body}
    </p>
    {action && <div className="mt-5">{action}</div>}
  </div>
));

const ListPanel = memo(({ title, items, onOpen, emptyLabel, action }) => (
  <div className="flex h-full flex-col p-6 sm:p-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-[#E5E7EB] tracking-tight">
        {title}
      </h2>
      {action}
    </div>
    {items.length === 0 ? (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-black/10 dark:border-[#25282D] rounded-3xl bg-white/40 dark:bg-[#16191D]/50">
        <p className="text-sm text-zinc-500 dark:text-[#8B9099] mb-4">{emptyLabel}</p>
        {action}
      </div>
    ) : (
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 no-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpen(item.id)}
              className="text-left rounded-2xl bg-white dark:bg-[#16191D] dark:hover:bg-[#1A1D21] p-5 transition-all hover:shadow-sm cursor-pointer group border border-black/5 dark:border-[#25282D]"
            >
              <p className="text-base font-semibold text-zinc-900 dark:text-[#E5E7EB] group-hover:text-black dark:group-hover:text-white truncate">
                {item.title}
              </p>
              {'messages' in item && (
                <p className="mt-1 text-xs text-zinc-400 dark:text-[#8B9099]">
                  {item.messages.length === 0
                    ? 'No messages yet'
                    : `${item.messages.length} messages`}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
));

/* ---------- Roadmap Tree Component ---------- */

const getRoadmapProgress = (rm) => {
  if (!rm || !rm.phases || rm.phases.length === 0) return 0;
  let total = 0;
  let completed = 0;
  rm.phases.forEach((p) => {
    p.modules?.forEach((m) => {
      m.topics?.forEach((t) => {
        total++;
        if (t.completed) completed++;
      });
    });
  });
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

const RoadmapPanel = memo(
  ({
    roadmaps = [],
    activeRoadmapId,
    onSelectRoadmap,
    onRenameRoadmap,
    onDeleteRoadmap,
    roadmap,
    onToggleTopic,
    onTopicClick,
  }) => {
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!roadmap && (!roadmaps || roadmaps.length === 0)) {
      return (
        <InfoPanel
          title="Learning Roadmap"
          body="Your personalized, first-principles learning path will appear here as soon as you generate one in the AI Chat."
          icon={Map}
        />
      );
    }

    if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) {
      return (
        <div className="flex h-full flex-col overflow-hidden px-4 sm:px-6 py-6 sm:py-8 bg-transparent">
          {roadmaps.length > 1 && (
            <div className="mb-4 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              {roadmaps.map((r, idx) => {
                const isCurrent = r.id === (roadmap?.id || activeRoadmapId);
                return (
                  <button
                    key={r.id || idx}
                    type="button"
                    onClick={() => onSelectRoadmap && onSelectRoadmap(r.id)}
                    className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5
                      ${
                        isCurrent
                          ? 'bg-zinc-950 text-white shadow-xs dark:bg-[#1E3A8A] font-semibold'
                          : 'bg-white dark:bg-[#16191D] text-zinc-600 dark:text-[#8B9099] hover:text-zinc-950 dark:hover:text-[#E5E7EB] border border-black/5 dark:border-[#25282D]'
                      }`}
                  >
                    <Map size={11} className="shrink-0" />
                    <span className="max-w-[140px] truncate">
                      {r.title || `Roadmap ${idx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-[#E5E7EB]">
              {roadmap?.title || 'Learning Roadmap'}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-[#8B9099]">
              Loading your custom learning roadmap...
            </p>
          </div>
        </div>
      );
    }

    const progressPercent = getRoadmapProgress(roadmap);

    return (
      <div className="flex h-full flex-col overflow-hidden px-4 sm:px-6 py-6 sm:py-8 bg-transparent">
        {/* Top Switcher Bar */}
        {roadmaps && roadmaps.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            {/* Roadmap Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-2xl bg-white dark:bg-[#16191D] hover:bg-zinc-50 dark:hover:bg-[#1A1D21] border border-black/10 dark:border-[#25282D] px-3.5 py-2 text-xs font-semibold text-zinc-900 dark:text-[#E5E7EB] shadow-2xs transition-all cursor-pointer group"
                title="Switch between your learning roadmaps"
              >
                <Compass size={14} className="text-zinc-700 dark:text-[#3B82F6] shrink-0" />
                <span className="max-w-[170px] sm:max-w-[240px] truncate">
                  {roadmap?.title || 'Select Roadmap'}
                </span>
                <span className="rounded-full bg-zinc-100 dark:bg-[#22252A] text-zinc-600 dark:text-[#8B9099] px-2 py-0.5 text-[10px] font-bold shrink-0">
                  {roadmaps.findIndex((r) => r.id === roadmap.id) + 1} / {roadmaps.length}
                </span>
                <ChevronDown
                  size={13}
                  className={`text-zinc-500 dark:text-[#8B9099] transition-transform duration-200 shrink-0 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 max-h-80 overflow-y-auto rounded-2xl bg-white dark:bg-[#16191D] border border-black/10 dark:border-[#25282D] shadow-xl z-50 p-2 no-scrollbar">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-[#8B9099] border-b border-black/5 dark:border-[#25282D] flex items-center justify-between">
                    <span>Switch Roadmap</span>
                    <span>{roadmaps.length} Total</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    {roadmaps.map((r, idx) => {
                      const isCurrent = r.id === roadmap.id;
                      const progress = getRoadmapProgress(r);
                      return (
                        <div
                          key={r.id || idx}
                          onClick={() => {
                            onSelectRoadmap && onSelectRoadmap(r.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-all cursor-pointer
                            ${
                              isCurrent
                                ? 'bg-[#E5ECC9] text-zinc-950 font-bold dark:bg-[#1E3A8A] dark:text-white shadow-xs'
                                : 'text-zinc-700 dark:text-[#E5E7EB] hover:bg-black/[0.04] dark:hover:bg-[#22252A]'
                            }`}
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-1.5 truncate">
                              {isCurrent && (
                                <Check size={13} className="shrink-0 text-zinc-900 dark:text-white" />
                              )}
                              <span className="truncate">{r.title || 'Untitled Roadmap'}</span>
                            </div>
                            <p
                              className={`text-[10px] mt-0.5 truncate ${
                                isCurrent
                                  ? 'text-zinc-700 dark:text-blue-200'
                                  : 'text-zinc-400 dark:text-[#8B9099]'
                              }`}
                            >
                              {r.topic ? `Topic: ${r.topic} • ` : ''}{progress}% completed
                            </p>
                          </div>
                          <div
                            className="flex items-center gap-1 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {onRenameRoadmap && (
                              <button
                                type="button"
                                onClick={() => onRenameRoadmap(r.id, r.title)}
                                className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:text-[#8B9099] dark:hover:text-white transition-colors cursor-pointer"
                                title="Rename"
                              >
                                <Pencil size={11} />
                              </button>
                            )}
                            {onDeleteRoadmap && (
                              <button
                                type="button"
                                onClick={() => onDeleteRoadmap(r.id)}
                                className="p-1 rounded-md text-zinc-400 hover:text-red-600 dark:text-[#8B9099] dark:hover:text-red-400 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Pills for Multiple Roadmaps */}
            {roadmaps.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[calc(100%-120px)]">
                {roadmaps.map((r, idx) => {
                  const isCurrent = r.id === roadmap.id;
                  return (
                    <button
                      key={r.id || idx}
                      type="button"
                      onClick={() => onSelectRoadmap && onSelectRoadmap(r.id)}
                      className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0
                        ${
                          isCurrent
                            ? 'bg-zinc-950 text-white shadow-xs dark:bg-[#1E3A8A] font-semibold'
                            : 'bg-white dark:bg-[#16191D] text-zinc-600 dark:text-[#8B9099] hover:text-zinc-950 dark:hover:text-[#E5E7EB] border border-black/5 dark:border-[#25282D]'
                        }`}
                    >
                      <Map size={11} className="shrink-0" />
                      <span className="max-w-[130px] truncate">
                        {r.title || `Roadmap ${idx + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Actions for current roadmap */}
            <div className="flex items-center gap-1.5 ml-auto">
              {onRenameRoadmap && (
                <button
                  type="button"
                  onClick={() => onRenameRoadmap(roadmap.id, roadmap.title)}
                  className="flex items-center gap-1.5 rounded-xl bg-white dark:bg-[#16191D] hover:bg-zinc-50 dark:hover:bg-[#1A1D21] border border-black/5 dark:border-[#25282D] px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-[#8B9099] dark:hover:text-[#E5E7EB] transition-colors cursor-pointer"
                  title="Rename roadmap"
                >
                  <Pencil size={12} />
                  <span className="hidden sm:inline">Rename</span>
                </button>
              )}
              {onDeleteRoadmap && (
                <button
                  type="button"
                  onClick={() => onDeleteRoadmap(roadmap.id)}
                  className="flex items-center gap-1.5 rounded-xl bg-white dark:bg-[#16191D] hover:bg-red-50 dark:hover:bg-red-950/40 border border-black/5 dark:border-[#25282D] px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-red-600 dark:text-[#8B9099] dark:hover:text-red-400 transition-colors cursor-pointer"
                  title="Delete roadmap"
                >
                  <Trash2 size={12} />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Title block */}
        <div className="mb-6 rounded-3xl bg-white dark:bg-[#16191D] p-5 sm:p-6 border border-black/5 dark:border-[#25282D] shadow-xs shrink-0 transition-all duration-300 relative overflow-hidden">
          {/* Toggle Collapse/Expand Button */}
          <button
            type="button"
            onClick={() => setIsHeaderCollapsed((prev) => !prev)}
            className="absolute right-4 top-4 rounded-xl p-1.5 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-zinc-600 dark:text-[#8B9099] transition-colors cursor-pointer"
            title={isHeaderCollapsed ? 'Expand Info' : 'Minimize Info'}
          >
            {isHeaderCollapsed ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronDown size={18} className="rotate-180" />
            )}
          </button>

          {isHeaderCollapsed ? (
            <div className="flex flex-row items-center justify-between pr-8 gap-4">
              <div className="flex items-center gap-3 truncate">
                <span className="rounded-full bg-[#E5ECC9] dark:bg-[#1A1D21] text-zinc-900 dark:text-[#93C5FD] dark:border dark:border-[#25282D] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0">
                  {roadmap.topic || 'Path'}
                </span>
                <h2 className="text-base font-bold text-zinc-950 dark:text-[#E5E7EB] truncate leading-none">
                  {roadmap.title}
                </h2>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-zinc-900 dark:text-[#E5E7EB]">
                  {progressPercent}%
                </span>
                <div className="h-2 w-20 sm:w-28 rounded-full bg-black/10 dark:bg-[#22252A] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-zinc-950 dark:bg-[#3B82F6] transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pr-6">
              <div>
                <span className="rounded-full bg-[#E5ECC9] dark:bg-[#1A1D21] px-3 py-1 text-xs font-semibold uppercase text-zinc-800 dark:text-[#93C5FD] dark:border dark:border-[#25282D] tracking-wider">
                  {roadmap.topic || 'Learning Path'}
                </span>
                <h2 className="mt-3 text-2xl font-bold text-zinc-950 dark:text-[#E5E7EB] leading-snug">
                  {roadmap.title}
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-[#8B9099] leading-relaxed max-w-2xl font-normal">
                  {roadmap.description}
                </p>
              </div>
              <div className="flex flex-col items-end justify-center shrink-0 min-w-[120px] self-start sm:self-center">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-zinc-950 dark:text-[#E5E7EB]">
                    {progressPercent}%
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-[#8B9099] uppercase font-semibold">
                    Completed
                  </span>
                </div>
                <div className="mt-2.5 h-2.5 w-full rounded-full bg-black/10 dark:bg-[#22252A] overflow-hidden min-w-[120px]">
                  <div
                    className="h-full rounded-full bg-zinc-950 dark:bg-[#3B82F6] transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Phases Tree */}
      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar pb-10">
        <div className="relative py-6 pl-8 md:pl-0 md:flex md:flex-col md:items-center">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-zinc-900 via-zinc-400 to-zinc-900 dark:from-zinc-700 dark:via-zinc-500 dark:to-zinc-700 -translate-x-1/2 z-0 hidden md:block" />
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-zinc-900 via-zinc-400 to-zinc-900 dark:from-zinc-700 dark:via-zinc-500 dark:to-zinc-700 z-0 block md:hidden" />

          {roadmap.phases.map((phase, phaseIdx) => (
            <div
              key={phaseIdx}
              className="w-full relative z-10 flex flex-col items-center"
            >
              <div className="relative z-20 mb-8 mt-6 w-full flex items-center md:justify-center">
                <div className="flex items-center gap-2.5 bg-white dark:bg-[#1A1D21] text-zinc-900 dark:text-[#E5E7EB] font-bold px-6 py-2.5 rounded-full border border-black/10 dark:border-[#25282D] shadow-sm text-sm">
                  <Map size={16} className="shrink-0 text-zinc-800 dark:text-[#8B9099]" />
                  <span>{phase.name}</span>
                </div>
              </div>

              <div className="w-full relative z-10">
                {phase.modules.map((mod, modIdx) => {
                  const isLeft = modIdx % 2 === 0;
                  return (
                    <div
                      key={modIdx}
                      className="relative flex items-start w-full mb-8 last:mb-0 md:justify-center"
                    >
                      <div
                        className={`absolute top-8 w-[calc(50%-1.5rem)] h-0.5 border-t border-dashed border-black/20 dark:border-white/20 z-0 hidden md:block
                        ${isLeft ? 'right-1/2' : 'left-1/2'}`}
                      />
                      <div className="absolute left-4 md:left-1/2 top-8 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-zinc-900 dark:border-[#3B82F6] bg-white dark:bg-[#111316] z-20 shadow-xs" />
                      <div className="absolute left-4 top-8 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-zinc-900 dark:border-[#3B82F6] bg-white dark:bg-[#111316] z-20 shadow-xs md:hidden" />

                      <div
                        className={`w-full max-w-md pl-8 md:pl-0 z-10
                        ${isLeft ? 'md:mr-auto md:pr-10' : 'md:ml-auto md:pl-10'}`}
                      >
                        <div className="bg-white dark:bg-[#16191D] rounded-3xl border border-black/5 dark:border-[#25282D] p-5 shadow-xs hover:shadow-sm dark:hover:border-[#3B82F6]/30 transition-all duration-300 relative group">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-[#8B9099]">
                                Module {phaseIdx + 1}.{modIdx + 1}
                              </span>
                              <h4 className="font-semibold text-[15px] sm:text-[16px] text-zinc-900 dark:text-[#E5E7EB] group-hover:text-black dark:group-hover:text-white transition-colors">
                                {mod.name}
                              </h4>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-[#8B9099] tracking-wide shrink-0">
                              {mod.topics.filter((t) => t.completed).length}/
                              {mod.topics.length}
                            </span>
                          </div>

                          <p className="text-xs text-zinc-500 dark:text-[#8B9099] leading-relaxed mb-4">
                            {mod.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {mod.topics.map((topic, topicIdx) => (
                              <div
                                key={topicIdx}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border transition-all text-xs font-medium cursor-pointer select-none
                                  ${
                                    topic.completed
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300'
                                      : 'bg-black/[0.02] dark:bg-[#111316] border-black/5 dark:border-[#25282D] text-zinc-800 dark:text-[#D1D5DB] hover:bg-black/[0.05] dark:hover:bg-[#22252A] hover:scale-[1.02] active:scale-[0.98]'
                                  }`}
                                onClick={() =>
                                  onTopicClick &&
                                  onTopicClick(topic.name, roadmap.topic)
                                }
                                title={`Click to learn ${topic.name}`}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleTopic(
                                      roadmap.id,
                                      phaseIdx,
                                      modIdx,
                                      topicIdx
                                    );
                                  }}
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all cursor-pointer
                                    ${
                                      topic.completed
                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                        : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-[#111316]'
                                    }`}
                                >
                                  {topic.completed && (
                                    <svg
                                      width="9"
                                      height="9"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                </button>
                                <span
                                  className={
                                    topic.completed
                                      ? 'line-through opacity-70'
                                      : ''
                                  }
                                >
                                  {topic.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ---------- Modern Interactive Important Questions Panel ---------- */

/* ---------- Dynamic AI-Generated Important Questions Panel ---------- */

const QuestionsPanel = memo(
  ({
    topic,
    questions = [],
    generating = false,
    onGenerate,
    onAskQuestion,
    onGoToChat,
  }) => {
    const [revealedIds, setRevealedIds] = useState({});

    const toggleReveal = (id) => {
      setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    if (!topic) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-center px-6">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] text-zinc-800 dark:text-[#E5E7EB] shadow-xs">
            <ListChecks size={26} strokeWidth={1.75} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-[#E5E7EB] tracking-tight">
            Important Questions
          </h2>
          <p className="mt-2 max-w-sm text-sm text-zinc-600 dark:text-[#8B9099] leading-relaxed">
            Important questions will be created by Avora AI specifically for the topic you are learning. Ask a question or start a topic in the AI Chat first.
          </p>
          <button
            type="button"
            onClick={onGoToChat}
            className="mt-5 bg-zinc-950 hover:bg-black dark:bg-[#1D4ED8] dark:hover:bg-[#2563EB] text-white px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <MessageSquare size={14} />
            <span>Go to AI Chat</span>
          </button>
        </div>
      );
    }

    if (questions.length === 0) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-center px-6">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] text-zinc-800 dark:text-[#E5E7EB] shadow-xs">
            <Sparkles size={26} strokeWidth={1.75} />
          </div>
          <span className="rounded-full bg-[#E5ECC9] dark:bg-[#1A1D21] px-3 py-1 text-xs font-semibold uppercase text-zinc-800 dark:text-[#93C5FD] dark:border dark:border-[#25282D] tracking-wider mb-2">
            Topic: {topic}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-[#E5E7EB] tracking-tight">
            Curate Important Questions
          </h2>
          <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-[#8B9099] leading-relaxed">
            Generate high-yield conceptual mastery and interview-level questions created by AI specifically for <strong className="font-semibold text-zinc-900 dark:text-[#E5E7EB]">{topic}</strong>.
          </p>
          <button
            type="button"
            disabled={generating}
            onClick={() => onGenerate(topic)}
            className="mt-6 bg-zinc-950 hover:bg-black dark:bg-[#1D4ED8] dark:hover:bg-[#2563EB] text-white px-6 py-3 rounded-2xl text-xs font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Sparkles size={15} className={generating ? 'animate-spin' : ''} />
            <span>{generating ? 'Generating Questions with AI...' : `Generate Questions for ${topic}`}</span>
          </button>
        </div>
      );
    }

    return (
      <div className="flex h-full flex-col p-6 sm:p-8 overflow-y-auto no-scrollbar">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
          <div className="bg-white dark:bg-[#16191D] rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-[#25282D] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-[#E5ECC9] dark:bg-[#1A1D21] text-zinc-900 dark:text-[#93C5FD] dark:border dark:border-[#25282D]">
                <ListChecks size={22} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#E5ECC9] dark:bg-[#1A1D21] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-800 dark:text-[#93C5FD] dark:border dark:border-[#25282D]">
                    {topic}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-[#8B9099] font-medium">
                    {questions.length} AI-curated questions
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-[#E5E7EB] tracking-tight mt-1">
                  Important Topic Questions
                </h2>
              </div>
            </div>

            <button
              type="button"
              disabled={generating}
              onClick={() => onGenerate(topic)}
              className="bg-zinc-100 hover:bg-zinc-200 dark:bg-[#22252A] dark:hover:bg-[#2E333B] text-zinc-900 dark:text-[#E5E7EB] px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <RotateCcw size={13} className={generating ? 'animate-spin' : ''} />
              <span>{generating ? 'Regenerating...' : 'Regenerate'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {questions.map((q, idx) => {
              const qKey = q.id || `q-${idx}`;
              const isRevealed = !!revealedIds[qKey];
              return (
                <div
                  key={qKey}
                  className="bg-white dark:bg-[#16191D] rounded-3xl p-5 sm:p-6 border border-black/5 dark:border-[#25282D] shadow-xs hover:shadow-sm dark:hover:border-[#3B82F6]/40 transition-all"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E5ECC9] dark:bg-[#1A1D21] text-zinc-800 dark:text-[#93C5FD] dark:border dark:border-[#25282D]">
                        {q.tag || topic}
                      </span>
                      <span className="text-[11px] font-semibold text-zinc-500 dark:text-[#8B9099]">
                        {q.difficulty || 'Core Principle'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAskQuestion && onAskQuestion(q.question)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 hover:text-black dark:text-[#E5E7EB] dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-[#22252A] dark:hover:bg-[#2E333B] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      <Sparkles size={13} />
                      <span>Practice in Chat</span>
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-[#E5E7EB] leading-snug">
                    {q.question}
                  </h3>

                  {isRevealed && (
                    <div className="mt-4 pt-4 border-t border-black/5 dark:border-[#25282D] bg-[#E5ECC9]/25 dark:bg-[#111316] rounded-2xl p-4 text-xs sm:text-sm text-zinc-800 dark:text-[#D1D5DB] leading-relaxed msg-in">
                      <p className="font-semibold text-zinc-900 dark:text-[#E5E7EB] mb-1">First-Principles Explanation:</p>
                      <p>{q.explanation}</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => toggleReveal(qKey)}
                      className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 dark:text-[#8B9099] dark:hover:text-[#E5E7EB] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {isRevealed ? 'Hide Explanation' : 'Reveal Core Principle'}
                      <ChevronDown size={14} className={isRevealed ? 'rotate-180' : ''} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

/* ---------- Modern AI Chat Message & Controls ---------- */

const ThinkingIndicator = memo(() => (
  <div
    className="flex items-center gap-2 py-1 px-1 text-xs text-zinc-500 dark:text-[#8B9099] font-medium"
    aria-label="Avora is formulating first-principles response"
  >
    <div className="flex items-center gap-1">
      <span className="thinking-dot" style={{ animationDelay: '0ms' }} />
      <span className="thinking-dot" style={{ animationDelay: '140ms' }} />
      <span className="thinking-dot" style={{ animationDelay: '280ms' }} />
    </div>
    <span>Formulating first-principles reasoning...</span>
  </div>
));

const MessageBubble = memo(({ message, onOptionClick }) => {
  const isUser = message.role === 'user';
  const isThinking =
    !isUser && message.typing && message.text === 'Thinking...';
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [liked, setLiked] = useState(null);

  const content = useMemo(
    () => (isThinking ? null : renderMarkdown(message.text)),
    [message.text, isThinking]
  );

  const handleCopyMessage = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy message:', e);
    }
  }, [message.text]);

  const handleToggleSpeak = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.text.replace(/[#*`_]/g, ''));
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  }, [speaking, message.text]);

  return (
    <div
      className={`msg-in flex flex-col gap-1.5 ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      {/* Sender Header for Assistant */}
      {!isUser && (
        <div className="flex items-center gap-2 px-1 mb-0.5 text-xs text-zinc-500 dark:text-[#8B9099] font-medium">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-950 dark:bg-[#22252A] text-[10px] font-bold text-white dark:text-[#E5E7EB] shadow-2xs">
            A
          </div>
          <span className="font-semibold text-zinc-900 dark:text-[#E5E7EB]">Avora</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-[#8B9099] font-mono">
            First Principles
          </span>
        </div>
      )}

      <div
        className={`group relative max-w-[88%] sm:max-w-[80%] rounded-[26px] px-5 py-4 text-[14.5px] leading-relaxed shadow-xs
          ${
            isUser
              ? 'bg-zinc-950 text-white rounded-br-xs user-message-bubble dark:bg-[#1E3A8A] dark:text-white'
              : 'bg-white text-zinc-900 border border-black/5 rounded-tl-xs dark:bg-[#16191D] dark:text-[#E5E7EB] dark:border-[#25282D]'
          }`}
      >
        {isThinking ? (
          <ThinkingIndicator />
        ) : (
          <>
            {content}
            {message.typing && (
              <span className="typing-caret" aria-hidden="true" />
            )}

            {/* Quick Option Pills */}
            {!message.typing &&
              message.options &&
              message.options.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-black/5 dark:border-[#25282D]">
                  {message.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onOptionClick && onOptionClick(opt)}
                      className="rounded-2xl bg-[#E5ECC9] hover:bg-[#dbe4ba] dark:bg-[#1A1D21] dark:hover:bg-[#22252A] text-zinc-900 dark:text-[#E5E7EB] dark:border dark:border-[#25282D] px-4 py-2 text-xs font-semibold cursor-pointer transition-all shadow-xs active:scale-95"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

            {/* Retrieved Sources / Citations */}
            {!message.typing &&
              message.sources &&
              message.sources.length > 0 && (
                <div className="mt-4 border-t border-black/5 dark:border-[#25282D] pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit size={13} className="text-zinc-600 dark:text-[#8B9099]" />
                    <p className="text-[10px] font-bold text-zinc-500 dark:text-[#8B9099] uppercase tracking-widest">
                      Semantic Citations ({message.sources.length}):
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {message.sources.map((src, sIdx) => {
                      const token = localStorage.getItem('token');
                      const viewUrl = src.docId
                        ? `http://localhost:5000/docs/${src.docId}/view?token=${token}`
                        : null;
                      return (
                        <div
                          key={sIdx}
                          className="text-xs text-zinc-700 dark:text-[#D1D5DB] bg-black/[0.02] hover:bg-black/[0.04] dark:bg-[#111316] dark:hover:bg-[#16191D] border border-black/5 dark:border-[#25282D] rounded-2xl p-3 leading-snug transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-zinc-900 dark:text-[#E5E7EB] truncate">
                              📄 {src.title}
                            </p>
                            {viewUrl && (
                              <a
                                href={viewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-semibold text-white bg-zinc-900 hover:bg-black dark:bg-[#22252A] dark:hover:bg-[#2E333B] dark:text-[#E5E7EB] px-2.5 py-1 rounded-xl transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1"
                              >
                                <span>Source</span>
                                <ArrowUpRight size={11} />
                              </a>
                            )}
                          </div>
                          <p className="mt-1.5 text-zinc-500 dark:text-[#8B9099] italic line-clamp-2">
                            "{src.text}"
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Modern Action Bar on AI Responses */}
            {!isUser && !message.typing && (
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-black/5 dark:border-[#25282D] text-zinc-400 dark:text-[#8B9099]">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 hover:text-zinc-800 dark:hover:text-[#E5E7EB] transition-colors cursor-pointer"
                    title="Copy response"
                  >
                    {copied ? <Check size={14} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleSpeak}
                    className={`p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 hover:text-zinc-800 dark:hover:text-[#E5E7EB] transition-colors cursor-pointer ${
                      speaking ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40' : ''
                    }`}
                    title={speaking ? 'Stop audio' : 'Read aloud'}
                  >
                    {speaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLiked((v) => (v === 'up' ? null : 'up'))}
                    className={`p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 hover:text-zinc-800 dark:hover:text-[#E5E7EB] transition-colors cursor-pointer ${
                      liked === 'up' ? 'text-emerald-600 dark:text-emerald-400' : ''
                    }`}
                    title="Helpful"
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLiked((v) => (v === 'down' ? null : 'down'))}
                    className={`p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 hover:text-zinc-800 dark:hover:text-[#E5E7EB] transition-colors cursor-pointer ${
                      liked === 'down' ? 'text-red-500 dark:text-red-400' : ''
                    }`}
                    title="Not helpful"
                  >
                    <ThumbsDown size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

/* ---------- Main Chat Viewport & Floating Prompt Box ---------- */

const ChatPanel = ({
  chat,
  onSend,
  sending = false,
  semanticSearchEnabled,
  onToggleSemanticSearch,
  studyModeEnabled,
  onToggleStudyMode,
  userName = 'Devos',
  onTriggerUpload,
}) => {
  const [value, setValue] = useState('');
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const lastMessage = chat?.messages?.[chat.messages.length - 1];
  const scrollSignature = chat
    ? `${chat.id}:${chat.messages.length}:${lastMessage?.text?.length ?? 0}`
    : '';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollSignature]);

  const submit = useCallback(async () => {
    const text = value.trim();
    if (!text || sending) return;
    setValue('');
    await onSend(text);
    inputRef.current?.focus();
  }, [value, sending, onSend]);

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    },
    [submit]
  );

  const starterPrompts = [
    {
      title: 'First-Principles Breakdown',
      desc: 'Explain how modern LLMs work from fundamental mathematics',
      icon: Zap,
    },
    {
      title: 'Roadmap Generator',
      desc: 'Create a 6-month mastery roadmap for Full-Stack AI Engineering',
      icon: Map,
    },
    {
      title: 'Research Analysis',
      desc: 'Analyze my uploaded documentation and summarize key principles',
      icon: FileText,
    },
    {
      title: 'Conceptual Mastery Quiz',
      desc: 'Test my understanding of distributed systems with interactive Q&A',
      icon: Lightbulb,
    },
  ];

  const hasMessages = chat && chat.messages.length > 0;

  return (
    <div className="flex flex-col h-full w-full justify-between overflow-hidden relative">
      {/* Top / Message Area */}
      {hasMessages ? (
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 no-scrollbar"
        >
          <div className="flex flex-col gap-6 py-6 max-w-4xl mx-auto">
            {chat.messages.map((m) => (
              <MessageBubble key={m.id} message={m} onOptionClick={onSend} />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State Center Hero matching reference screenshot with modern starter cards */
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 my-auto overflow-y-auto no-scrollbar py-6">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            {/* Delta / Triangular rounded geometric outline icon from user screenshot */}
            <div className="mb-6 flex items-center justify-center hover:scale-105 transition-transform duration-300">
              <svg
                width="54"
                height="54"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#18181b] dark:text-[#8B9099]/70"
              >
                <path d="M12 3c.8 0 1.5.4 1.9 1.1l7.5 13c.8 1.4-.2 3.1-1.8 3.1H4.4c-1.6 0-2.6-1.7-1.8-3.1l7.5-13c.4-.7 1.1-1.1 1.9-1.1z" />
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-[#E5E7EB] tracking-tight">
              Welcome {userName}
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-zinc-600 dark:text-[#8B9099] font-normal">
              what do you want to learn or research today?
            </p>

            {/* Modern AI Workspace Starter Prompt Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left">
              {starterPrompts.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setValue(p.desc);
                      onSend(p.desc);
                    }}
                    className="p-4 rounded-3xl bg-white/90 hover:bg-white dark:bg-[#16191D] dark:hover:bg-[#1A1D21] border border-black/5 hover:border-black/10 dark:border-[#25282D] dark:hover:border-[#3B82F6]/40 shadow-xs hover:shadow-sm transition-all duration-200 flex items-start gap-3.5 group cursor-pointer active:scale-98"
                  >
                    <div className="p-2.5 rounded-2xl bg-[#E5ECC9] group-hover:bg-[#dbe4ba] dark:bg-[#22252A] dark:group-hover:bg-[#2A2E35] text-zinc-900 dark:text-[#E5E7EB] shrink-0 transition-colors">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-zinc-900 group-hover:text-black dark:text-[#E5E7EB] dark:group-hover:text-white">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-[#8B9099] mt-1 line-clamp-2 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Prompt Box matching user uploaded screenshot */}
      <div className="w-full px-4 sm:px-8 pb-5 sm:pb-7 pt-2 shrink-0">
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#16191D] rounded-[32px] sm:rounded-[36px] p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-white/80 dark:border-[#25282D] flex flex-col gap-3.5">
          {/* Top Pill Controls Row */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Semantic Search Toggle Pill */}
            <button
              type="button"
              onClick={onToggleSemanticSearch}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 select-none active:scale-95
                ${
                  semanticSearchEnabled
                    ? 'bg-[#DCE6C6] text-zinc-900 dark:bg-[#1E3A8A] dark:text-white shadow-2xs hover:bg-[#d2dda9] dark:hover:bg-[#2563EB]'
                    : 'bg-zinc-100 text-zinc-500 dark:bg-[#111316] dark:text-[#8B9099] hover:bg-zinc-200 dark:hover:bg-[#22252A]'
                }`}
              title="Toggle Semantic Knowledge Retrieval"
            >
              {/* iOS-style toggle slider switch */}
              <span
                className={`relative inline-flex h-4 w-7 shrink-0 rounded-full border border-black/10 dark:border-white/10 bg-black/15 dark:bg-white/15 transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-zinc-950 shadow-xs transition duration-200 ease-in-out mt-0.5 ml-0.5
                    ${
                      semanticSearchEnabled
                        ? 'translate-x-3 bg-zinc-950 dark:bg-white'
                        : 'translate-x-0 bg-zinc-500 dark:bg-zinc-400'
                    }`}
                />
              </span>
              <span>Semantic search</span>
            </button>

            {/* Study Mode Pill */}
            <button
              type="button"
              onClick={onToggleStudyMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 select-none active:scale-95
                ${
                  studyModeEnabled
                    ? 'bg-[#DCE6C6] text-zinc-900 dark:bg-[#1E3A8A] dark:text-white shadow-2xs hover:bg-[#d2dda9] dark:hover:bg-[#2563EB]'
                    : 'bg-zinc-100 text-zinc-500 dark:bg-[#111316] dark:text-[#8B9099] hover:bg-zinc-200 dark:hover:bg-[#22252A]'
                }`}
              title="Toggle First-Principles Study Mode"
            >
              {/* Node Network 3-circle branching icon */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>Study mode</span>
            </button>

            {/* Quick Document Attachment trigger */}
            {onTriggerUpload && (
              <button
                type="button"
                onClick={onTriggerUpload}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-600 hover:text-zinc-950 hover:bg-black/5 dark:text-[#8B9099] dark:hover:text-[#E5E7EB] dark:hover:bg-white/5 transition-colors cursor-pointer"
                title="Attach PDF or Document"
              >
                <Paperclip size={13} />
                <span>Add Source</span>
              </button>
            )}
          </div>

          {/* Inner Input Capsule with Node Graph icon and Send Button */}
          <div className="flex items-center gap-3 border border-zinc-200/90 dark:border-[#25282D] rounded-full px-4 sm:px-5 py-2 sm:py-2.5 bg-white dark:bg-[#111316] focus-within:border-zinc-400 dark:focus-within:border-[#3B82F6] focus-within:ring-2 focus-within:ring-black/5 dark:focus-within:ring-[#3B82F6]/20 transition-all shadow-2xs">
            {/* Left Node Graph icon */}
            <Share2 size={18} className="text-zinc-400 dark:text-[#8B9099] shrink-0" />

            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKey}
              placeholder={
                sending
                  ? 'Avora is thinking...'
                  : 'i want to learn about web dev |'
              }
              className="flex-1 bg-transparent text-sm sm:text-base text-zinc-900 dark:text-[#E5E7EB] outline-none placeholder:text-zinc-400 dark:placeholder:text-[#5A5F67] font-sans"
            />

            {/* Circular Send Button */}
            <button
              type="button"
              onClick={submit}
              disabled={sending || !value.trim()}
              className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#1D4ED8] hover:bg-[#2563EB] text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 shadow-xs cursor-pointer"
              aria-label="Send message"
            >
              {/* Paper airplane send icon */}
              <SendHorizontal size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Main Workspace Page ---------- */

let idCounter = 100;
const nextId = () => idCounter++;

const Workspace = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chats');

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const [roadmaps, setRoadmaps] = useState([]);
  const [activeRoadmapId, setActiveRoadmapId] = useState(null);
  const [sending, setSending] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [projectSubTab, setProjectSubTab] = useState('chats');

  // RAG and Mode States
  const [documents, setDocuments] = useState([]);
  const [semanticSearchEnabled, setSemanticSearchEnabled] = useState(false);
  const [studyModeEnabled, setStudyModeEnabled] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlTitleInput, setUrlTitleInput] = useState('');
  const fileInputRef = useRef(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/docs/');
      if (res.data?.success && res.data?.data) {
        setDocuments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    const hasActiveJob = documents.some((doc) =>
      ['queued', 'pending', 'processing'].includes(doc.status)
    );
    if (!hasActiveJob) return;

    const interval = setInterval(() => {
      fetchDocuments();
    }, 3000);

    return () => clearInterval(interval);
  }, [documents, fetchDocuments]);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sourceType', 'pdf');

    setUploading(true);
    setUploadError('');

    try {
      await axios.post('http://localhost:5000/docs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchDocuments();
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload PDF.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlAdd = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setUploading(true);
    setUploadError('');

    try {
      await axios.post('http://localhost:5000/docs/url', {
        url: urlInput.trim(),
        title: urlTitleInput.trim() || undefined,
      });
      setUrlInput('');
      setUrlTitleInput('');
      fetchDocuments();
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to index URL.');
    } finally {
      setUploading(false);
    }
  };

  const handleDocDelete = async (docId) => {
    try {
      await axios.delete(`http://localhost:5000/docs/${docId}`);
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
    } catch (err) {
      console.error('Failed to delete doc:', err);
    }
  };

  // Dynamic Important Questions state (generated specifically for user's active topic)
  const [topicQuestions, setTopicQuestions] = useState({});
  const [generatingQuestions, setGeneratingQuestions] = useState(false);

  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId) || chats[0] || null;
  }, [chats, activeChatId]);

  const activeRoadmap = useMemo(() => {
    return (
      roadmaps.find((r) => r.id === activeRoadmapId) || roadmaps[0] || null
    );
  }, [roadmaps, activeRoadmapId]);

  const currentTopic = useMemo(() => {
    if (activeRoadmap?.topic) return activeRoadmap.topic;
    if (activeProjectId) {
      const proj = projects.find((p) => p.id === activeProjectId);
      if (proj?.topic) return proj.topic;
    }
    if (
      activeChat &&
      activeChat.title &&
      activeChat.title !== 'Avora Learning Chat' &&
      activeChat.title !== 'New Chat'
    ) {
      return activeChat.title;
    }
    return null;
  }, [activeRoadmap, activeProjectId, projects, activeChat]);

  const handleGenerateQuestions = useCallback(
    async (targetTopic) => {
      const topicToUse = targetTopic || currentTopic;
      if (!topicToUse || generatingQuestions) return;

      setGeneratingQuestions(true);
      try {
        const prompt = `You are an expert AI tutor. Generate 4 high-yield, first-principles interview and conceptual review questions for the topic: "${topicToUse}".
Each question must test fundamental conceptual understanding and core mechanisms of ${topicToUse}.
Return your response ONLY as a valid JSON array of objects matching this exact schema:
[
  {
    "id": "q1",
    "tag": "${topicToUse}",
    "difficulty": "Foundational",
    "question": "Question text here?",
    "explanation": "Clear first-principles explanation of the answer."
  }
]
Do not wrap in markdown quotes if possible, output pure JSON.`;

        const res = await axios.post(API_URL, {
          message: prompt,
          semanticSearch: false,
        });

        const rawReply =
          res.data?.message ||
          res.data?.reply ||
          res.data?.response ||
          '';

        let parsed = [];
        const jsonMatch = rawReply.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch (pe) {
            console.error('Failed to parse questions JSON:', pe);
          }
        }

        if (!parsed || parsed.length === 0) {
          const blocks = rawReply
            .split(/\n(?=\d+\.|\*\*Question)/i)
            .filter((b) => b.trim().length > 10);
          parsed = blocks.slice(0, 4).map((b, i) => ({
            id: `q-${Date.now()}-${i}`,
            tag: topicToUse,
            difficulty:
              i === 0
                ? 'Foundational'
                : i === 1
                ? 'Core Principle'
                : 'Deep Dive',
            question: b.replace(/^\d+\.\s*/, '').slice(0, 120),
            explanation: b,
          }));
        }

        const key = topicToUse.toLowerCase().trim();
        setTopicQuestions((prev) => ({
          ...prev,
          [key]: parsed,
        }));
      } catch (err) {
        console.error('Failed to generate important questions:', err);
      } finally {
        setGeneratingQuestions(false);
      }
    },
    [currentTopic, generatingQuestions]
  );

  const activeIndex = useMemo(() => {
    const idx = VIEWS.indexOf(activeTab);
    return idx >= 0 ? idx : 1;
  }, [activeTab]);

  useEffect(() => {
    if (!activeRoadmapId) return;

    const existing = roadmaps.find((r) => r.id === activeRoadmapId);
    if (
      existing &&
      !existing.phases &&
      typeof activeRoadmapId === 'string' &&
      activeRoadmapId.length === 24
    ) {
      axios
        .get(`http://localhost:5000/api/learning/roadmap/${activeRoadmapId}`)
        .then((res) => {
          if (res.data?.success && res.data?.roadmap) {
            setRoadmaps((prev) =>
              prev.map((r) => {
                if (r.id === activeRoadmapId) {
                  return {
                    ...r,
                    title: res.data.roadmap.title,
                    topic: res.data.roadmap.topic,
                    description: res.data.roadmap.description,
                    phases: res.data.roadmap.phases,
                  };
                }
                return r;
              })
            );
          }
        })
        .catch((err) => console.error('Failed to fetch roadmap:', err));
    }
  }, [activeRoadmapId, roadmaps]);

  const handleToggleTopic = useCallback(
    async (roadmapId, phaseIndex, moduleIndex, topicIndex) => {
      setRoadmaps((prev) =>
        prev.map((r) => {
          if (r.id !== roadmapId) return r;

          const updatedPhases = r.phases.map((phase, pIdx) => {
            if (pIdx !== phaseIndex) return phase;

            const updatedModules = phase.modules.map((mod, mIdx) => {
              if (mIdx !== moduleIndex) return mod;

              const updatedTopics = mod.topics.map((topic, tIdx) => {
                if (tIdx !== topicIndex) return topic;
                return { ...topic, completed: !topic.completed };
              });
              return { ...mod, topics: updatedTopics };
            });
            return { ...phase, modules: updatedModules };
          });

          return { ...r, phases: updatedPhases };
        })
      );

      try {
        await axios.post(
          `http://localhost:5000/api/learning/roadmap/${roadmapId}/toggle-topic`,
          {
            phaseIndex,
            moduleIndex,
            topicIndex,
          }
        );
      } catch (err) {
        console.error('Failed to sync completion state with backend:', err);
      }
    },
    []
  );

  const handleNewChat = useCallback(() => {
    const chat = { id: nextId(), title: 'New Chat', messages: [] };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
    setActiveTab('chats');
    setMobileOpen(false);
  }, []);

  const handleChatHistoryClick = useCallback((id) => {
    setActiveChatId(id);
    setActiveTab('chats');
    setMobileOpen(false);
  }, []);

  const handleRoadmapHistoryClick = useCallback((id) => {
    setActiveRoadmapId(id);
    setActiveTab('roadmap');
    setMobileOpen(false);
  }, []);

  const openChatFromList = handleChatHistoryClick;
  const openRoadmapFromList = handleRoadmapHistoryClick;

  const handleDeleteChat = useCallback((id) => {
    setChats((prev) => {
      const nextChats = prev.filter((chat) => chat.id !== id);
      if (nextChats.length > 0) {
        setActiveChatId((current) =>
          current === id ? nextChats[0].id : current
        );
      }
      return nextChats;
    });
  }, []);

  const handleRenameChat = useCallback(
    async (chatId, currentTitle) => {
      const newTitle = window.prompt('Rename Chat', currentTitle);
      if (!newTitle || newTitle.trim() === '') return;

      setChats((prev) =>
        prev.map((c) =>
          String(c.id) === String(chatId) ? { ...c, title: newTitle } : c
        )
      );

      if (activeProjectId) {
        const targetChat = chats.find((c) => String(c.id) === String(chatId));
        if (targetChat) {
          try {
            await axios.post(
              `http://localhost:5000/api/learning/projects/${activeProjectId}/chats`,
              {
                chat: {
                  id: chatId,
                  title: newTitle,
                  messages: targetChat.messages,
                },
              }
            );
            setProjects((prev) =>
              prev.map((p) => {
                if (p.id !== activeProjectId) return p;
                return {
                  ...p,
                  chats: p.chats.map((c) =>
                    String(c.id) === String(chatId)
                      ? { ...c, title: newTitle }
                      : c
                  ),
                };
              })
            );
          } catch (dbErr) {
            console.error('Failed to sync rename to project DB:', dbErr);
          }
        }
      }
    },
    [chats, activeProjectId]
  );

  const handleRenameRoadmap = useCallback(async (roadmapId, currentTitle) => {
    const newTitle = window.prompt('Rename Roadmap', currentTitle);
    if (!newTitle || newTitle.trim() === '') return;

    setRoadmaps((prev) =>
      prev.map((r) => (r.id === roadmapId ? { ...r, title: newTitle } : r))
    );

    try {
      await axios.patch(
        `http://localhost:5000/api/learning/roadmap/${roadmapId}`,
        {
          title: newTitle,
        }
      );
    } catch (err) {
      console.error('Failed to rename roadmap:', err);
    }
  }, []);

  const handleRenameProject = useCallback(async (projectId, currentTitle) => {
    const newTitle = window.prompt('Rename Project', currentTitle);
    if (!newTitle || newTitle.trim() === '') return;

    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, title: newTitle } : p))
    );

    try {
      await axios.patch(
        `http://localhost:5000/api/learning/projects/${projectId}`,
        {
          title: newTitle,
        }
      );
    } catch (err) {
      console.error('Failed to rename project:', err);
    }
  }, []);

  const updateTypingMessage = useCallback(
    (chatId, typingId, text, typing) => {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) return chat;
          return {
            ...chat,
            messages: chat.messages.map((message) =>
              message.id === typingId ? { ...message, text, typing } : message
            ),
          };
        })
      );
    },
    []
  );

  const typeAiResponse = useCallback(
    async (chatId, typingId, responseText) => {
      const characters = Array.from(responseText);

      if (characters.length === 0) {
        updateTypingMessage(chatId, typingId, 'No response received.', false);
        return;
      }

      const chunkSize =
        characters.length > 400 ? 4 : characters.length > 120 ? 3 : 1;
      const delay = Math.max(
        8,
        Math.min(24, Math.round((1000 * chunkSize) / characters.length))
      );
      let renderedText = '';

      for (let i = 0; i < characters.length; i += chunkSize) {
        renderedText += characters.slice(i, i + chunkSize).join('');
        updateTypingMessage(chatId, typingId, renderedText, true);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      updateTypingMessage(chatId, typingId, responseText, false);
    },
    [updateTypingMessage]
  );

  const handleDeleteRoadmap = useCallback(
    async (roadmapId) => {
      if (!window.confirm('Are you sure you want to delete this roadmap?')) return;

      setRoadmaps((prev) => {
        const nextRoadmaps = prev.filter((r) => r.id !== roadmapId);
        setActiveRoadmapId((current) =>
          current === roadmapId
            ? nextRoadmaps.length > 0
              ? nextRoadmaps[0].id
              : null
            : current
        );
        return nextRoadmaps;
      });

      try {
        await axios.delete(
          `http://localhost:5000/api/learning/roadmap/${roadmapId}`
        );
      } catch (err) {
        console.error('Failed to delete roadmap from DB:', err);
      }
    },
    []
  );

  const loadRoadmaps = useCallback(async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/learning/roadmaps'
      );
      if (res.data?.success && res.data?.roadmaps) {
        const formattedRoadmaps = res.data.roadmaps.map((r) => ({
          id: r._id,
          title: r.title,
          topic: r.topic,
          description: r.description,
          phases: r.phases,
        }));
        setRoadmaps(formattedRoadmaps);
        if (formattedRoadmaps.length > 0) {
          setActiveRoadmapId((prev) => {
            if (prev && formattedRoadmaps.some((r) => r.id === prev)) {
              return prev;
            }
            return formattedRoadmaps[0].id;
          });
        }
      }
    } catch (err) {
      console.error('Failed to load roadmaps list:', err);
    }
  }, []);

  useEffect(() => {
    loadRoadmaps();
  }, [loadRoadmaps]);

  useEffect(() => {
    if (chats.length === 0) {
      const welcomeChat = {
        id: 'default-welcome',
        title: 'Avora Learning Chat',
        messages: [],
      };
      setChats([welcomeChat]);
      setActiveChatId('default-welcome');
    }
  }, [chats]);

  const loadProjects = useCallback(async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/learning/projects'
      );
      if (res.data?.success && res.data?.projects) {
        setProjects(
          res.data.projects.map((p) => ({
            id: p._id,
            title: p.title,
            topic: p.topic,
            description: p.description,
            roadmapId: p.roadmapId,
            sessionId: p.sessionId,
            chats: p.chats || [],
          }))
        );
      }
    } catch (err) {
      console.error('Failed to load projects list:', err);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreateProject = useCallback(async () => {
    if (!modalData) return;
    try {
      const res = await axios.post(
        'http://localhost:5000/api/learning/create-project',
        {
          sessionId: modalData.sessionId,
          topic: modalData.topic,
        }
      );
      if (res.data?.success && res.data?.project) {
        const p = res.data.project;
        const newProj = {
          id: p._id,
          title: p.title,
          topic: p.topic,
          description: p.description,
          roadmapId: p.roadmapId,
          sessionId: p.sessionId,
          chats: p.chats || [],
        };
        setProjects((prev) => [
          newProj,
          ...prev.filter((x) => x.id !== newProj.id),
        ]);
        setActiveProjectId(newProj.id);
      }
    } catch (err) {
      console.error('Failed to create project workspace:', err);
    } finally {
      setModalData(null);
    }
  }, [modalData]);

  const handleProjectSelect = useCallback((projectId) => {
    axios
      .get(`http://localhost:5000/api/learning/projects/${projectId}`)
      .then((res) => {
        if (res.data?.success && res.data?.project) {
          const proj = res.data.project;
          setActiveProjectId(proj._id);

          if (proj.roadmapId) {
            const rm = proj.roadmapId;
            const formattedRoadmap = {
              id: rm._id,
              title: rm.title,
              topic: rm.topic,
              description: rm.description,
              phases: rm.phases,
            };
            setRoadmaps((prev) => [
              formattedRoadmap,
              ...prev.filter((r) => r.id !== formattedRoadmap.id),
            ]);
            setActiveRoadmapId(formattedRoadmap.id);
          }

          if (proj.chats && proj.chats.length > 0) {
            const formattedChats = proj.chats.map((c) => ({
              id: c.id,
              title: c.title,
              messages: c.messages,
              sessionId: proj.sessionId,
            }));
            setChats(formattedChats);
            setActiveChatId(formattedChats[0].id);
          }

          setActiveTab('projects');
        }
      })
      .catch((err) => console.error('Failed to load project details:', err));
  }, []);

  const handleCreateProjectDirectly = useCallback(async () => {
    const topic = window.prompt(
      'Enter study topic for the new project (e.g. Web Development):'
    );
    if (!topic || topic.trim() === '') return;
    const title = window.prompt(
      'Enter project title (optional, defaults to topic):',
      topic
    );
    const description = window.prompt('Enter project description (optional):');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/learning/create-project',
        {
          topic: topic.trim(),
          title: title ? title.trim() : topic.trim(),
          description: description ? description.trim() : undefined,
        }
      );
      if (res.data?.success && res.data?.project) {
        const p = res.data.project;
        const newProj = {
          id: p._id,
          title: p.title,
          topic: p.topic,
          description: p.description,
          roadmapId: p.roadmapId,
          sessionId: p.sessionId,
          chats: p.chats || [],
        };
        setProjects((prev) => [
          newProj,
          ...prev.filter((x) => x.id !== newProj.id),
        ]);
        setActiveProjectId(newProj.id);
        setActiveTab('projects');
      }
    } catch (err) {
      console.error('Failed to create project workspace:', err);
    }
  }, []);

  const handleDeleteProject = useCallback(
    async (projectId) => {
      if (
        !window.confirm(
          'Are you sure you want to delete this study project?'
        )
      )
        return;
      try {
        const res = await axios.delete(
          `http://localhost:5000/api/learning/projects/${projectId}`
        );
        if (res.data?.success) {
          setProjects((prev) => prev.filter((p) => p.id !== projectId));
          if (activeProjectId === projectId) {
            setActiveProjectId(null);
          }
        }
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    },
    [activeProjectId]
  );

  const handleStartNewProjectChat = useCallback(() => {
    if (!activeProjectId) return;
    const newChatId = `proj-${activeProjectId}-${Date.now()}`;
    const newChat = {
      id: newChatId,
      title: 'Project Chat',
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setActiveTab('chats');
  }, [activeProjectId]);

  const handleStartTopicLesson = useCallback(
    (topicName, roadmapTopic) => {
      setActiveTab('chats');
      const query = `Explain ${topicName} from first principles in the context of ${roadmapTopic}.`;
      handleSend(query);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chats, activeChatId]
  );

  const handleSend = useCallback(
    async (userMessageText) => {
      const chatId = activeChatId || 'default-welcome';
      const userMsg = {
        id: nextId(),
        role: 'user',
        text: userMessageText,
      };

      const typingId = nextId();
      const typingMsg = {
        id: typingId,
        role: 'ai',
        text: 'Thinking...',
        typing: true,
      };

      setChats((prev) => {
        const chatExists = prev.some((c) => c.id === chatId);
        if (!chatExists) {
          const newChat = {
            id: chatId,
            title:
              userMessageText.slice(0, 30) +
              (userMessageText.length > 30 ? '...' : ''),
            messages: [userMsg, typingMsg],
          };
          return [newChat, ...prev];
        }

        return prev.map((chat) => {
          if (chat.id !== chatId) return chat;
          const isFirstMessage = chat.messages.length === 0;
          return {
            ...chat,
            title: isFirstMessage
              ? userMessageText.slice(0, 30) +
                (userMessageText.length > 30 ? '...' : '')
              : chat.title,
            messages: [...chat.messages, userMsg, typingMsg],
          };
        });
      });

      setSending(true);

      try {
        const currentChat = chats.find((c) => c.id === chatId);
        const payloadSessionId = currentChat?.sessionId || undefined;

        const response = await axios.post(API_URL, {
          message: userMessageText,
          sessionId: payloadSessionId,
          projectId: activeProjectId || undefined,
          semanticSearch: semanticSearchEnabled,
        });

        const resRoadmap = response.data?.roadmap || null;
        const resNextQuestion = response.data?.nextQuestion || null;
        const resSessionId = response.data?.sessionId || null;
        const resSources = response.data?.sources || [];

        const aiResponseText =
          resNextQuestion?.question ||
          response.data?.message ||
          response.data?.reply ||
          response.data?.response ||
          (resRoadmap
            ? `I have generated your personalized learning roadmap for **${resRoadmap.topic || resRoadmap.title}**! You can explore the interactive visual phases in the **Roadmap** tab.`
            : 'Here is what I found based on first principles.');

        const resOptions =
          resNextQuestion?.options ||
          response.data?.options ||
          [];

        await typeAiResponse(chatId, typingId, aiResponseText);

        setChats((prev) => {
          const nextChats = prev.map((chat) => {
            if (chat.id !== chatId) return chat;

            const updatedMessages = chat.messages.map((m) =>
              m.id === typingId
                ? {
                    ...m,
                    text: aiResponseText,
                    typing: false,
                    options: resOptions,
                    roadmap: resRoadmap,
                    sources: resSources,
                  }
                : m
            );

            const updatedChat = {
              ...chat,
              messages: updatedMessages,
              sessionId: resSessionId || chat.sessionId,
            };

            if (activeProjectId) {
              axios.post(
                `http://localhost:5000/api/learning/projects/${activeProjectId}/chats`,
                {
                  chat: {
                    id: updatedChat.id,
                    title: updatedChat.title,
                    messages: updatedChat.messages,
                  },
                }
              );
            }

            return updatedChat;
          });
          return nextChats;
        });

        if (resRoadmap) {
          const newRoadmapItem = {
            id: resRoadmap._id,
            title: resRoadmap.title,
            topic: resRoadmap.topic,
            description: resRoadmap.description,
            phases: resRoadmap.phases,
          };
          setRoadmaps((prev) => [
            newRoadmapItem,
            ...prev.filter((r) => r.id !== newRoadmapItem.id),
          ]);
          setActiveRoadmapId(newRoadmapItem.id);
          setActiveTab('roadmap');

          if (resRoadmap.topic) {
            handleGenerateQuestions(resRoadmap.topic);
          }

          if (!response.data?.projectCreated) {
            setModalData({
              sessionId: resSessionId,
              topic: resRoadmap.topic,
            });
          }
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Something went wrong. Please try again.';

        updateTypingMessage(chatId, typingId, `Error: ${errorMessage}`, false);
      } finally {
        setSending(false);
      }
    },
    [
      activeChatId,
      chats,
      activeProjectId,
      typeAiResponse,
      updateTypingMessage,
      semanticSearchEnabled,
      handleGenerateQuestions,
    ]
  );

  const sidebarWidthClass = collapsed ? 'lg:w-[84px]' : 'lg:w-[270px]';

  return (
    <div className="flex h-screen w-full flex-col bg-white dark:bg-[#0B0D10] p-3 sm:p-4 text-zinc-900 dark:text-[#E5E7EB] font-sans overflow-hidden transition-colors duration-200">
      {/* Hidden File Input for PDF Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handlePdfUpload}
        className="hidden"
      />

      {/* ================= TOP HEADER matching Reference Image ================= */}
      <header className="mb-3 flex items-center justify-between gap-4 px-2">
        {/* Left: Brand Logo & Sidebar Collapse icon */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="/"
            className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-[#E5E7EB] font-sans flex items-center gap-2"
          >
            <span>Avora</span>
          </a>

          {/* Sidebar Collapse Toggle icon */}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="hidden lg:flex items-center justify-center p-1 text-zinc-700 hover:text-black dark:text-[#8B9099] dark:hover:text-[#E5E7EB] cursor-pointer transition-colors"
            aria-label="Toggle sidebar collapse"
            title="Toggle sidebar"
          >
            <PanelLeftClose
              size={19}
              className={`transition-transform duration-200 ${
                collapsed ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-xl bg-[#E5ECC9] text-zinc-800 dark:bg-[#111316] dark:text-[#E5E7EB] dark:border dark:border-[#25282D] cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Center: Pill Navigation Tabs */}
        <div className="hidden md:block overflow-x-auto no-scrollbar">
          <ul className="flex w-fit items-center gap-1 rounded-full bg-[#E5ECC9] dark:bg-[#111316] dark:border dark:border-[#25282D] p-1 shadow-xs">
            {TABS.map((t) => (
              <li key={t.key}>
                <button
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-semibold transition-all cursor-pointer flex items-center gap-2
                    ${
                      activeTab === t.key
                        ? 'bg-white text-zinc-950 shadow-xs dark:bg-[#1E3A8A] dark:text-white dark:shadow-none'
                        : 'text-zinc-700 hover:text-zinc-950 dark:text-[#8B9099] dark:hover:text-[#E5E7EB]'
                    }`}
                >
                  <t.icon size={14} />
                  <span>{t.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Pill Group with Theme, Maximize, and User Avatar */}
        <div className="flex items-center gap-2 rounded-full bg-[#E5ECC9] dark:bg-[#111316] dark:border dark:border-[#25282D] px-2 py-1.5 shrink-0 shadow-xs">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-800 hover:text-black dark:bg-[#1A1D21] dark:text-[#E5E7EB] dark:hover:text-white dark:border dark:border-[#25282D] shadow-xs cursor-pointer transition-colors"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            <Eclipse size={15} />
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-zinc-800 hover:text-black dark:text-[#8B9099] dark:hover:text-[#E5E7EB] cursor-pointer transition-colors"
            title="Full Screen View"
          >
            <Maximize2 size={15} />
          </button>

          <div
            className="h-8 w-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs overflow-hidden"
            title={user?.name || 'Devos'}
          >
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'D'}
          </div>
        </div>
      </header>

      {/* Mobile Tab Bar (Center Tabs on Mobile) */}
      <div className="md:hidden mb-2.5 overflow-x-auto no-scrollbar">
        <ul className="flex w-max items-center gap-1 rounded-full bg-[#E5ECC9] dark:bg-[#111316] dark:border dark:border-[#25282D] p-1 shadow-xs">
          {TABS.map((t) => (
            <li key={t.key}>
              <button
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5
                  ${
                    activeTab === t.key
                      ? 'bg-white text-zinc-950 shadow-xs dark:bg-[#1E3A8A] dark:text-white'
                      : 'text-zinc-700 dark:text-[#8B9099]'
                  }`}
              >
                <t.icon size={13} />
                <span>{t.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ================= WORKSPACE BODY matching Reference Image ================= */}
      <div className="flex flex-1 min-h-0 gap-3 lg:gap-4 relative">
        {/* Mobile Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* ================= LEFT SIDEBAR (Matcha Green Container) ================= */}
        <aside
          className={`
            bg-[#E5ECC9] text-zinc-900 dark:bg-[#111316] dark:text-[#E5E7EB] dark:border dark:border-[#25282D] overflow-hidden rounded-[28px]
            transition-all duration-300 ease-in-out
            fixed lg:static inset-y-3 left-3 z-50 lg:z-auto
            w-[270px] ${sidebarWidthClass}
            ${
              mobileOpen
                ? 'translate-x-0 shadow-2xl'
                : '-translate-x-[120%] lg:translate-x-0'
            }
            p-4 flex flex-col justify-between
          `}
        >
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar">
            {/* Mobile Close Button in Drawer */}
            <div className="flex items-center justify-between gap-2 mb-3 lg:hidden">
              <span className="text-xs font-bold text-zinc-900 dark:text-[#E5E7EB] uppercase tracking-wider px-1">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-700 hover:text-black dark:bg-[#1A1D21] dark:text-[#E5E7EB] dark:border dark:border-[#25282D] cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Top Primary Action: White New Chats Button */}
            <button
              type="button"
              onClick={handleNewChat}
              title={collapsed ? 'New Chats' : undefined}
              className={`flex w-full items-center gap-3 rounded-2xl bg-white text-zinc-900 dark:bg-[#1A1D21] dark:text-[#E5E7EB] dark:hover:bg-[#22252A] dark:border dark:border-[#25282D] px-4 py-3.5 text-sm font-semibold transition-all hover:bg-white/90 hover:shadow-xs cursor-pointer active:scale-98
                ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <MessagesSquare size={18} className="shrink-0 text-zinc-800 dark:text-[#E5E7EB]" />
              {!collapsed && <span>New Chats</span>}
            </button>

            {/* Features Section */}
            <div className="mt-6 flex flex-col gap-1">
              {!collapsed && (
                <p className="mb-2 text-xs font-semibold text-zinc-600 dark:text-[#8B9099] px-2">
                  Features
                </p>
              )}
              <NavItem
                text="Chat"
                icon={MessageSquare}
                active={activeTab === 'chats'}
                onClick={() => {
                  setActiveTab('chats');
                  setMobileOpen(false);
                }}
                collapsed={collapsed}
              />
              <NavItem
                text="Projects"
                icon={FolderGit2}
                active={activeTab === 'projects'}
                onClick={() => {
                  setActiveTab('projects');
                  setMobileOpen(false);
                }}
                collapsed={collapsed}
                badge={projects.length > 0 ? projects.length : undefined}
              />
              <NavItem
                text="RoadMaps"
                icon={Share2}
                active={activeTab === 'roadmap' || activeTab === 'allRoadmaps'}
                onClick={() => {
                  setActiveTab('roadmap');
                  setMobileOpen(false);
                }}
                collapsed={collapsed}
                badge={roadmaps.length > 0 ? roadmaps.length : undefined}
              />
            </div>

            {/* History Section */}
            {!collapsed && chats.length > 0 && (
              <div className="mt-5 flex flex-col min-h-0">
                <p className="mb-2 text-xs font-semibold text-zinc-600 dark:text-[#8B9099] px-2 flex items-center justify-between">
                  <span>Chat History</span>
                  <span className="text-[10px] text-zinc-500 dark:text-[#8B9099] font-normal">Recent</span>
                </p>
                <div className="relative pl-3 border-l-2 border-zinc-800/15 dark:border-[#25282D] flex flex-col gap-1 overflow-y-auto max-h-[160px] no-scrollbar">
                  {chats.map((c) => {
                    const isActive = c.id === activeChatId && activeTab === 'chats';
                    return (
                      <div
                        key={c.id}
                        className={`group relative flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer
                          ${
                            isActive
                              ? 'bg-white text-zinc-950 font-semibold shadow-2xs dark:bg-[#1A1D21] dark:text-[#E5E7EB] dark:border dark:border-[#25282D]'
                              : 'text-zinc-700 hover:text-zinc-950 hover:bg-white/40 dark:text-[#8B9099] dark:hover:text-[#E5E7EB] dark:hover:bg-[#1A1D21]/60'
                          }`}
                        onClick={() => handleChatHistoryClick(c.id)}
                      >
                        <span className="truncate pr-2">{c.title || 'Untitled Chat'}</span>
                        <div className="hidden group-hover:flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenameChat(c.id, c.title);
                            }}
                            className="text-zinc-500 hover:text-zinc-900 dark:text-[#8B9099] dark:hover:text-[#E5E7EB] p-0.5 cursor-pointer"
                            title="Rename"
                          >
                            <Pencil size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(c.id);
                            }}
                            className="text-zinc-500 hover:text-red-600 dark:text-[#8B9099] dark:hover:text-red-400 p-0.5 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Roadmaps in Sidebar */}
            {!collapsed && roadmaps.length > 0 && (
              <div className="mt-5 flex flex-col min-h-0">
                <p className="mb-2 text-xs font-semibold text-zinc-600 dark:text-[#8B9099] px-2 flex items-center justify-between">
                  <span>My Roadmaps</span>
                  <span className="text-[10px] text-zinc-500 dark:text-[#8B9099] font-normal">
                    {roadmaps.length} Total
                  </span>
                </p>
                <div className="relative pl-3 border-l-2 border-zinc-800/15 dark:border-[#25282D] flex flex-col gap-1 overflow-y-auto max-h-[160px] no-scrollbar">
                  {roadmaps.map((r) => {
                    const isActive = r.id === activeRoadmapId && activeTab === 'roadmap';
                    return (
                      <div
                        key={r.id}
                        className={`group relative flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer
                          ${
                            isActive
                              ? 'bg-white text-zinc-950 font-semibold shadow-2xs dark:bg-[#1A1D21] dark:text-[#E5E7EB] dark:border dark:border-[#25282D]'
                              : 'text-zinc-700 hover:text-zinc-950 hover:bg-white/40 dark:text-[#8B9099] dark:hover:text-[#E5E7EB] dark:hover:bg-[#1A1D21]/60'
                          }`}
                        onClick={() => {
                          setActiveRoadmapId(r.id);
                          setActiveTab('roadmap');
                          setMobileOpen(false);
                        }}
                      >
                        <span className="truncate pr-2">{r.title || 'Untitled Roadmap'}</span>
                        <div className="hidden group-hover:flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenameRoadmap(r.id, r.title);
                            }}
                            className="text-zinc-500 hover:text-zinc-900 dark:text-[#8B9099] dark:hover:text-[#E5E7EB] p-0.5 cursor-pointer"
                            title="Rename"
                          >
                            <Pencil size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRoadmap(r.id);
                            }}
                            className="text-zinc-500 hover:text-red-600 dark:text-[#8B9099] dark:hover:text-red-400 p-0.5 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Setting and Help Section at bottom */}
          <div className="pt-4 flex flex-col gap-1 border-t border-black/5 dark:border-[#25282D]">
            {!collapsed && (
              <p className="mb-2 text-xs font-semibold text-zinc-600 dark:text-[#8B9099] px-2">
                Setting and Help
              </p>
            )}
            <NavItem
              text="Setting"
              icon={Settings}
              active={activeTab === 'settings'}
              onClick={() => {
                setActiveTab('settings');
                setMobileOpen(false);
              }}
              collapsed={collapsed}
            />
            <NavItem
              text="Contact Us"
              icon={UserRound}
              active={false}
              onClick={() => {}}
              collapsed={collapsed}
            />
          </div>
        </aside>

        {/* ================= RIGHT MAIN VIEWPORT (Container) ================= */}
        <main className="flex flex-1 min-w-0 flex-col rounded-[28px] bg-[#E5ECC9] dark:bg-[#0E1013] dark:border dark:border-[#25282D] overflow-hidden shadow-xs relative">
          <div
            className="flex h-full transition-transform duration-300 ease-in-out"
            style={{
              width: `${VIEWS.length * 100}%`,
              transform: `translateX(-${
                activeIndex * (100 / VIEWS.length)
              }%)`,
            }}
          >
            {/* View 1: Knowledge Sources (RAG Library) */}
            <div
              className="h-full p-6 sm:p-8 overflow-y-auto no-scrollbar"
              style={{ width: `${100 / VIEWS.length}%` }}
            >
              <div className="flex h-full flex-col gap-6 max-w-5xl mx-auto bg-white dark:bg-[#16191D] rounded-3xl p-6 sm:p-8 shadow-xs border border-black/5 dark:border-[#25282D]">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-950 dark:text-[#E5E7EB] tracking-tight">
                    Knowledge Sources
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-[#8B9099] mt-1 font-normal leading-relaxed">
                    Upload research papers (PDF) or add webpage URLs to customize
                    Avora's first-principles knowledge base.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                  <div className="lg:col-span-5 flex flex-col gap-5">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-zinc-300 hover:border-zinc-500 dark:border-[#25282D] dark:hover:border-[#3B82F6]/50 rounded-2xl p-6 bg-zinc-50 hover:bg-zinc-100/70 dark:bg-[#111316] dark:hover:bg-[#1A1D21] transition-all relative flex flex-col items-center justify-center text-center group cursor-pointer min-h-[170px]"
                    >
                      <Upload
                        size={30}
                        className="text-zinc-400 dark:text-[#8B9099] mb-2 group-hover:scale-110 group-hover:text-zinc-900 dark:group-hover:text-[#E5E7EB] transition-all"
                      />
                      <p className="font-semibold text-sm text-zinc-900 dark:text-[#E5E7EB]">
                        {uploading ? 'Processing & Vectorizing...' : 'Upload PDF Document'}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-[#8B9099] mt-1">Supports Papers, Books, Codebases (Max 20MB)</p>
                    </div>

                    <form
                      onSubmit={handleUrlAdd}
                      className="border border-zinc-200 dark:border-[#25282D] rounded-2xl p-5 bg-white dark:bg-[#111316] shadow-xs flex flex-col gap-3.5"
                    >
                      <h3 className="font-semibold text-xs text-zinc-900 dark:text-[#E5E7EB]">
                        Add Web Documentation
                      </h3>
                      <input
                        type="text"
                        placeholder="Optional Title (e.g. React Docs)"
                        value={urlTitleInput}
                        onChange={(e) => setUrlTitleInput(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-[#16191D] border border-zinc-200 dark:border-[#25282D] rounded-xl px-4 py-2 text-xs text-zinc-900 dark:text-[#E5E7EB] placeholder:text-zinc-400 dark:placeholder:text-[#5A5F67] outline-none focus:border-zinc-400 dark:focus:border-[#3B82F6]"
                      />
                      <div className="flex gap-2">
                        <input
                          type="url"
                          required
                          placeholder="https://example.com/docs"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="flex-1 bg-zinc-50 dark:bg-[#16191D] border border-zinc-200 dark:border-[#25282D] rounded-xl px-4 py-2 text-xs text-zinc-900 dark:text-[#E5E7EB] placeholder:text-zinc-400 dark:placeholder:text-[#5A5F67] outline-none focus:border-zinc-400 dark:focus:border-[#3B82F6]"
                        />
                        <button
                          type="submit"
                          disabled={uploading || !urlInput.trim()}
                          className="bg-zinc-950 hover:bg-black dark:bg-[#1D4ED8] dark:hover:bg-[#2563EB] text-white font-medium text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
                        >
                          Add
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="lg:col-span-7 flex flex-col min-h-0 bg-zinc-50 dark:bg-[#111316] border border-zinc-200 dark:border-[#25282D] rounded-2xl p-5 overflow-y-auto no-scrollbar">
                    <h3 className="font-semibold text-sm text-zinc-900 dark:text-[#E5E7EB] mb-4">
                      Document Library ({documents.length})
                    </h3>
                    {documents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center flex-1 py-12 text-center text-zinc-400 dark:text-[#8B9099]">
                        <FileText size={28} className="mb-2 opacity-50" />
                        <p className="text-xs">No sources added yet</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {documents.map((doc) => (
                          <div
                            key={doc._id}
                            className="flex items-center justify-between gap-3 bg-white dark:bg-[#16191D] border border-zinc-200 dark:border-[#25282D] rounded-2xl p-3.5 shadow-xs"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-xs text-zinc-900 dark:text-[#E5E7EB] truncate">
                                📄 {doc.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500 dark:text-[#8B9099] font-medium">
                                <span className="uppercase px-1.5 py-0.5 bg-zinc-100 dark:bg-[#22252A] rounded">
                                  {doc.sourceType}
                                </span>
                                {doc.fileSize && (
                                  <span>
                                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDocDelete(doc._id)}
                              className="text-zinc-400 hover:text-red-600 dark:text-[#8B9099] dark:hover:text-red-400 p-1.5 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* View 2: Main AI Chat Panel matching reference screenshot */}
            <div className="h-full" style={{ width: `${100 / VIEWS.length}%` }}>
              <ChatPanel
                chat={activeChat}
                onSend={handleSend}
                sending={sending}
                semanticSearchEnabled={semanticSearchEnabled}
                onToggleSemanticSearch={() =>
                  setSemanticSearchEnabled((prev) => !prev)
                }
                studyModeEnabled={studyModeEnabled}
                onToggleStudyMode={() =>
                  setStudyModeEnabled((prev) => !prev)
                }
                userName={user?.name || 'Devos'}
                onTriggerUpload={() => fileInputRef.current?.click()}
              />
            </div>

            {/* View 3: Roadmap Interactive Tree View */}
            <div className="h-full" style={{ width: `${100 / VIEWS.length}%` }}>
              <RoadmapPanel
                roadmaps={roadmaps}
                activeRoadmapId={activeRoadmapId}
                onSelectRoadmap={(id) => setActiveRoadmapId(id)}
                onRenameRoadmap={handleRenameRoadmap}
                onDeleteRoadmap={handleDeleteRoadmap}
                roadmap={activeRoadmap}
                onToggleTopic={handleToggleTopic}
                onTopicClick={handleStartTopicLesson}
              />
            </div>

            {/* View 4: Important Questions View */}
            <div className="h-full" style={{ width: `${100 / VIEWS.length}%` }}>
              <QuestionsPanel
                topic={currentTopic}
                questions={
                  currentTopic
                    ? topicQuestions[currentTopic.toLowerCase().trim()] || []
                    : []
                }
                generating={generatingQuestions}
                onGenerate={handleGenerateQuestions}
                onGoToChat={() => setActiveTab('chats')}
                onAskQuestion={(q) => {
                  setActiveTab('chats');
                  handleSend(`Explain this high-yield concept from first principles: ${q}`);
                }}
              />
            </div>

            {/* View 5: All Chats Overview */}
            <div className="h-full" style={{ width: `${100 / VIEWS.length}%` }}>
              <ListPanel
                title="All Chats"
                items={chats}
                onOpen={openChatFromList}
                emptyLabel="No chats yet — start a new one."
              />
            </div>

            {/* View 6: All Roadmaps Overview */}
            <div className="h-full" style={{ width: `${100 / VIEWS.length}%` }}>
              <ListPanel
                title="All Roadmaps"
                items={roadmaps}
                onOpen={openRoadmapFromList}
                emptyLabel="No roadmaps yet."
              />
            </div>

            {/* View 7: Project Hub Workspace */}
            <div
              className="h-full p-6 sm:p-8 overflow-y-auto no-scrollbar"
              style={{ width: `${100 / VIEWS.length}%` }}
            >
              {activeProjectId ? (
                (() => {
                  const activeProj = projects.find(
                    (p) => p.id === activeProjectId
                  );
                  if (!activeProj)
                    return (
                      <p className="text-zinc-600 dark:text-[#8B9099]">
                        Loading project details...
                      </p>
                    );
                  return (
                    <div className="flex h-full flex-col gap-6 max-w-5xl mx-auto bg-white dark:bg-[#16191D] rounded-3xl p-6 sm:p-8 shadow-xs border border-black/5 dark:border-[#25282D]">
                      <div>
                        <button
                          onClick={() => {
                            setActiveProjectId(null);
                            setActiveTab('projects');
                          }}
                          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 dark:text-[#8B9099] dark:hover:text-[#E5E7EB] mb-3 font-semibold transition-colors cursor-pointer"
                        >
                          &larr; Back to All Projects
                        </button>
                        <div className="flex items-center justify-between gap-4">
                          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-[#E5E7EB] tracking-tight">
                            {activeProj.title}
                          </h2>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleRenameProject(
                                  activeProj.id,
                                  activeProj.title
                                )
                              }
                              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#22252A] dark:hover:bg-[#2E333B] text-zinc-700 dark:text-[#E5E7EB] transition-colors cursor-pointer"
                              title="Rename Project"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteProject(activeProj.id)
                              }
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-[#8B9099] mt-1 leading-relaxed">
                          Topic:{' '}
                          <strong className="font-semibold text-zinc-900 dark:text-[#E5E7EB]">
                            {activeProj.topic}
                          </strong>
                        </p>
                      </div>

                      <div className="bg-[#E5ECC9]/40 dark:bg-[#111316] border border-black/5 dark:border-[#25282D] rounded-3xl p-6 text-center flex flex-col items-center justify-center">
                        <h3 className="text-base font-bold text-zinc-950 dark:text-[#E5E7EB] mb-1">
                          New chat in {activeProj.title}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-[#8B9099] max-w-sm mb-4">
                          Ask questions about your documents, review your custom
                          roadmap, or learn concepts.
                        </p>
                        <button
                          onClick={handleStartNewProjectChat}
                          className="bg-zinc-950 hover:bg-black dark:bg-[#1D4ED8] dark:hover:bg-[#2563EB] text-white font-medium text-xs px-5 py-2.5 rounded-2xl transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
                        >
                          <Plus size={14} /> Start Chat
                        </button>
                      </div>

                      <div className="flex items-center gap-2 border-b border-black/5 dark:border-[#25282D] pb-3">
                        <button
                          onClick={() => setProjectSubTab('chats')}
                          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer
                            ${
                              projectSubTab === 'chats'
                                ? 'bg-zinc-950 text-white shadow-xs dark:bg-[#1E3A8A]'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-[#22252A] dark:text-[#8B9099] dark:hover:bg-[#2E333B] dark:hover:text-[#E5E7EB]'
                            }`}
                        >
                          Chats ({activeProj.chats?.length || 0})
                        </button>
                        <button
                          onClick={() => setProjectSubTab('sources')}
                          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer
                            ${
                              projectSubTab === 'sources'
                                ? 'bg-zinc-950 text-white shadow-xs dark:bg-[#1E3A8A]'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-[#22252A] dark:text-[#8B9099] dark:hover:bg-[#2E333B] dark:hover:text-[#E5E7EB]'
                            }`}
                        >
                          Sources ({documents.length})
                        </button>
                        <button
                          onClick={() => setProjectSubTab('roadmap')}
                          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer
                            ${
                              projectSubTab === 'roadmap'
                                ? 'bg-zinc-950 text-white shadow-xs dark:bg-[#1E3A8A]'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-[#22252A] dark:text-[#8B9099] dark:hover:bg-[#2E333B] dark:hover:text-[#E5E7EB]'
                            }`}
                        >
                          Roadmap
                        </button>
                      </div>

                      <div className="flex-1 min-h-0">
                        {projectSubTab === 'chats' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8">
                            {activeProj.chats?.map((c) => (
                              <div
                                key={c.id}
                                className="group relative bg-white dark:bg-[#111316] border border-black/10 dark:border-[#25282D] rounded-2xl p-4 hover:border-black/20 dark:hover:border-[#3B82F6]/40 shadow-xs transition-all flex flex-col justify-between"
                              >
                                <button
                                  onClick={() => {
                                    setActiveChatId(c.id);
                                    setActiveTab('chats');
                                  }}
                                  className="text-left flex-1 min-w-0 cursor-pointer"
                                >
                                  <h4 className="font-bold text-sm text-zinc-900 dark:text-[#E5E7EB] truncate">
                                    💬 {c.title}
                                  </h4>
                                  <p className="text-xs text-zinc-400 dark:text-[#8B9099] mt-1">
                                    {c.messages?.length || 0} messages
                                  </p>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <ListPanel
                  title="All Projects"
                  items={projects}
                  onOpen={handleProjectSelect}
                  emptyLabel="No projects yet. Start a new learning journey to create one!"
                  action={
                    <button
                      onClick={handleCreateProjectDirectly}
                      className="bg-zinc-950 hover:bg-black dark:bg-[#1D4ED8] dark:hover:bg-[#2563EB] text-white rounded-2xl px-5 py-2.5 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                    >
                      <Plus size={15} /> New Project
                    </button>
                  }
                />
              )}
            </div>

            {/* View 8: Workspace Settings */}
            <div
              className="h-full overflow-hidden"
              style={{ width: `${100 / VIEWS.length}%` }}
            >
              <SettingsPanel />
            </div>
          </div>
        </main>
      </div>

      {/* Embedded Styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .msg-in { animation: msgIn 0.22s ease-out; }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .typing-caret {
          display: inline-block;
          width: 2px;
          height: 14px;
          margin-left: 2px;
          vertical-align: -2px;
          background: currentColor;
          opacity: 0.75;
          animation: caretBlink 0.9s steps(1) infinite;
        }
        @keyframes caretBlink {
          0%, 50% { opacity: 0.75; }
          50.01%, 100% { opacity: 0; }
        }

        .thinking-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #18181b;
          opacity: 0.35;
          animation: thinkingBounce 1s ease-in-out infinite;
        }
        .dark .thinking-dot {
          background: #E5E7EB;
          opacity: 0.6;
        }
        @keyframes thinkingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30% { transform: translateY(-3px); opacity: 0.9; }
        }

        @media (prefers-reduced-motion: reduce) {
          .msg-in, .typing-caret, .thinking-dot { animation: none; }
        }

        .user-message-bubble p { color: rgba(255, 255, 255, 0.95) !important; }
        .user-message-bubble li { color: rgba(255, 255, 255, 0.9) !important; }
        .user-message-bubble a { color: #60a5fa !important; }
        .user-message-bubble em { color: rgba(255, 255, 255, 0.9) !important; }
        .user-message-bubble strong { color: #ffffff !important; }
        .user-message-bubble code { color: #f87171 !important; background-color: rgba(255, 255, 255, 0.12) !important; }
      `}</style>
    </div>
  );
};

export default Workspace;