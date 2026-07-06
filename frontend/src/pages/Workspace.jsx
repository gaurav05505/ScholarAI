import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import axios from 'axios';
import {
  ArrowUpRight, AudioLines, Bolt, Clock3, Eclipse, FolderGit2, Map, Plus, Pencil,
  MessageCircle, MessageSquareDot, MessagesSquare, StepBack, Trash2, UserRound,
  Menu, X, PanelLeftClose, PanelLeftOpen, FileText, ListChecks,
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/chat';

const INLINE_PATTERN = /(!\[([^\]]*?)\]\(([^)]+?)\))|(\[([^\]]+?)\]\(([^)]+?)\))|(\*\*\*([^*]+?)\*\*\*)|(\*\*([^*]+?)\*\*)|(\*([^*]+?)\*)|(`([^`]+?)`)/g;

function renderInline(text, keyBase) {
  if (!text) return null;
  const nodes = [];
  let lastIndex = 0;
  let match;
  let i = 0;

  // Create a fresh regex instance to avoid state sharing bugs
  const regex = new RegExp(INLINE_PATTERN);

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const key = `${keyBase}-${i++}`;

    if (match[1] !== undefined) {
      // Image
      nodes.push(
        <img
          key={key}
          src={match[3]}
          alt={match[2] || ''}
          loading="lazy"
          className="my-3 max-w-full rounded-xl border border-black/10 shadow-sm transition-transform duration-200 hover:scale-[1.01]"
        />
      );
    } else if (match[4] !== undefined) {
      // Link
      nodes.push(
        <a
          key={key}
          href={match[6]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#9aad2e] hover:text-[#889a24] underline underline-offset-4 decoration-[#9aad2e]/45 hover:decoration-[#889a24] transition-colors font-semibold"
        >
          {match[5]}
        </a>
      );
    } else if (match[7] !== undefined) {
      // Bold italic
      nodes.push(<strong key={key} className="font-semibold"><em>{match[8]}</em></strong>);
    } else if (match[9] !== undefined) {
      // Bold
      nodes.push(<strong key={key} className="font-semibold">{match[10]}</strong>);
    } else if (match[11] !== undefined) {
      // Italic
      nodes.push(<em key={key} className="italic text-black/85">{match[12]}</em>);
    } else if (match[13] !== undefined) {
      // Inline code
      nodes.push(
        <code key={key} className="rounded-md bg-black/[0.06] dark:bg-black/[0.12] px-1.5 py-0.5 text-[0.875em] font-mono font-medium text-[#c83a3a] dark:text-[#f87171]">
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
    <div className="my-4 overflow-hidden rounded-xl border border-black/10 bg-[#1E1E1E] shadow-sm">
      <div className="flex items-center justify-between bg-black/25 px-4 py-2 text-[11px] font-mono text-white/50 tracking-wider">
        <span>{language.toUpperCase() || 'CODE'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80 transition-colors hover:bg-white/20 active:scale-95 cursor-pointer"
        >
          {copied ? 'COPIED!' : 'COPY'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13.5px] leading-relaxed text-[#E8F5C8] font-mono whitespace-pre">
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
          1: 'text-2xl font-bold mt-6 mb-3 text-[#1E1E1E] border-b border-black/10 pb-1.5 tracking-tight',
          2: 'text-xl font-semibold mt-5 mb-2.5 text-[#1E1E1E] tracking-tight',
          3: 'text-lg font-semibold mt-4.5 mb-2 text-[#1E1E1E]/90',
          4: 'text-md font-medium mt-4 mb-2 text-[#1E1E1E]/80',
          5: 'text-sm font-medium mt-3.5 mb-1.5 text-[#1E1E1E]/70',
          6: 'text-xs font-medium mt-3 mb-1.5 text-[#1E1E1E]/60 uppercase tracking-wider',
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
        <hr key={key} className="my-6 border-0 border-t border-black/10" />
      );
    } else if (currentBlockType === 'blockquote') {
      const content = accumulatedLines.join('\n');
      blocks.push(
        <blockquote key={key} className="my-4 border-l-4 border-[#A8F35A] bg-[#A8F35A]/5 px-4 py-2.5 text-[14.5px] italic text-[#1E1E1E]/80 rounded-r-lg">
          {renderMarkdownBlocks(content, `${segmentIdx}-quote`)}
        </blockquote>
      );
    } else if (currentBlockType === 'table') {
      const tableLines = accumulatedLines.filter(l => l.trim() !== '');
      if (tableLines.length > 0) {
        const headersLine = tableLines[0];
        let startRowIdx = 1;
        if (tableLines[1] && tableLines[1].includes('-')) {
          startRowIdx = 2;
        }

        const parseTableRow = (rowText) => {
          let cells = rowText.split('|').map(c => c.trim());
          if (rowText.startsWith('|')) cells.shift();
          if (rowText.endsWith('|')) cells.pop();
          return cells;
        };

        const headers = parseTableRow(headersLine);
        const rows = tableLines.slice(startRowIdx).map(parseTableRow);

        blocks.push(
          <div key={key} className="my-4 w-full overflow-x-auto rounded-xl border border-black/10 bg-white shadow-sm">
            <table className="w-full border-collapse text-left text-sm text-[#1E1E1E]">
              <thead>
                <tr className="border-b border-black/10 bg-[#A8F35A]/5 font-semibold text-[#1E1E1E]/95">
                  {headers.map((h, i) => (
                    <th key={`th-${i}`} className="px-4 py-3 font-semibold border-r last:border-r-0 border-black/5">
                      {renderInline(h, `${key}-h-${i}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {rows.map((row, rIdx) => (
                  <tr key={`tr-${rIdx}`} className="hover:bg-black/[0.005] transition-colors odd:bg-white even:bg-black/[0.005]">
                    {row.map((cell, cIdx) => (
                      <td key={`td-${rIdx}-${cIdx}`} className="px-4 py-2.5 text-black/85 border-r last:border-r-0 border-black/5">
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
      const firstLine = accumulatedLines[0];
      const isOrdered = /^\s*\d+\.\s+/.test(firstLine);

      const items = accumulatedLines.map((line, idx) => {
        let textContent = line;
        let isTask = false;
        let isChecked = false;

        const indentMatch = line.match(/^(\s*)/);
        const indentSpaces = indentMatch ? indentMatch[1].length : 0;

        textContent = textContent.replace(/^\s*([-*+])\s+/, '');
        textContent = textContent.replace(/^\s*\d+\.\s+/, '');

        if (textContent.startsWith('[ ]') || textContent.toLowerCase().startsWith('[x]')) {
          isTask = true;
          isChecked = textContent.toLowerCase().startsWith('[x]');
          textContent = textContent.slice(3).trim();
        }

        const itemKey = `${key}-li-${idx}`;
        if (isTask) {
          return (
            <li key={itemKey} style={{ paddingLeft: `${indentSpaces * 4}px` }} className="flex items-start gap-2.5 list-none my-1">
              <input
                type="checkbox"
                checked={isChecked}
                readOnly
                className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-[#9aad2e] focus:ring-[#9aad2e] cursor-default"
              />
              <span className={isChecked ? 'line-through text-black/45' : 'text-black/85'}>
                {renderInline(textContent, itemKey)}
              </span>
            </li>
          );
        }

        return (
          <li key={itemKey} style={{ paddingLeft: `${indentSpaces * 4}px` }} className="my-0.5 leading-relaxed text-black/85">
            {renderInline(textContent, itemKey)}
          </li>
        );
      });

      if (isOrdered) {
        blocks.push(
          <ol key={key} className="my-3 list-decimal space-y-1.5 pl-6 text-[14.5px]">
            {items}
          </ol>
        );
      } else {
        const containsTasks = accumulatedLines.some(l => /^\s*[-*+]\s+\[[ xX]\]/i.test(l));
        blocks.push(
          <ul key={key} className={`my-3 space-y-1.5 text-[14.5px] ${containsTasks ? 'pl-1.5' : 'list-disc pl-6'}`}>
            {items}
          </ul>
        );
      }
    } else if (currentBlockType === 'paragraph') {
      const pText = accumulatedLines.join('\n');
      blocks.push(
        <p key={key} className="my-2.5 leading-relaxed text-[14.5px] text-[#1E1E1E]/90 whitespace-pre-line">
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
    } else if (/^\s*(?:[-*+])\s+(.*)$/.test(line) || /^\s*\d+\.\s+(.*)$/.test(line)) {
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
      const firstLineIsLang = lines[0] && /^[a-zA-Z0-9_+-]*$/.test(lines[0].trim()) && lines.length > 1;
      const language = firstLineIsLang ? lines[0].trim() : '';
      const code = (firstLineIsLang ? lines.slice(1) : lines).join('\n').replace(/^\n/, '').replace(/\n$/, '');

      elements.push(
        <CodeBlock key={`code-${segIdx}`} language={language} code={code} />
      );
    } else {
      elements.push(...renderMarkdownBlocks(segment, segIdx));
    }
  });

  return elements;
}

/* ---------- small building blocks ---------- */

const NavButton = memo(({ text, icon: Icon, collapsed, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={collapsed ? text : undefined}
    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] transition-colors
      ${active ? 'bg-white text-[#1E1E1E]' : 'text-[#1E1E1E]/70 hover:bg-white/60'}
      ${collapsed ? 'justify-center px-0' : ''}`}
  >
    <Icon size={18} className="shrink-0" />
    {!collapsed && <span className="truncate">{text}</span>}
  </button>
));

const TABS = [
  { key: 'source', label: 'Source', icon: FileText },
  { key: 'chats', label: 'Ai Chats', icon: MessageCircle },
  { key: 'roadmap', label: 'Roadmap', icon: Map },
  { key: 'questions', label: 'Important question', icon: ListChecks },
];

// Full set of slides shown in the right panel. The first four are controlled by the
// header tabs; the last two ("All Chats" / "All Roadmaps") are separate list views only
// reachable from the sidebar — they are intentionally not the same as the header tabs.
const VIEWS = ['source', 'chats', 'roadmap', 'questions', 'allChats', 'allRoadmaps', 'projects'];

/* ---------- panel content for non-chat tabs ---------- */

const InfoPanel = memo(({ title, body }) => (
  <div className="flex h-full flex-col items-center justify-center text-center px-6">
    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-[4px] border-[#1E1E1E]/70">
      <div className="h-8 w-8 rounded-[48%_48%_42%_42%/58%_58%_40%_40%] border-[4px] border-[#1E1E1E]/70 border-b-transparent border-l-transparent border-r-transparent" />
    </div>
    <h2 className="text-[22px] font-medium text-[#1E1E1E]">{title}</h2>
    <p className="mt-2 max-w-sm text-[14px] text-black/45">{body}</p>
  </div>
));

const ListPanel = memo(({ title, items, onOpen, emptyLabel, action }) => (
  <div className="flex h-full flex-col">
    <div className="flex items-center justify-between mb-4 sm:mb-6 px-1">
      <h2 className="text-[20px] sm:text-[22px] font-medium text-[#1E1E1E]">{title}</h2>
      {action}
    </div>
    {items.length === 0 ? (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-black/10 rounded-2xl bg-white/30">
        <p className="text-[14px] text-black/45 mb-4">{emptyLabel}</p>
        {action}
      </div>
    ) : (
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpen(item.id)}
              className="text-left rounded-2xl bg-white px-4 py-3.5 transition-colors hover:bg-white/80"
            >
              <p className="text-[15px] font-medium text-[#1E1E1E] truncate">{item.title}</p>
              {'messages' in item && (
                <p className="mt-1 text-[12px] text-black/40">
                  {item.messages.length === 0 ? 'No messages yet' : `${item.messages.length} messages`}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
));

/* ---------- roadmap panel ---------- */
const RoadmapPanel = memo(({ roadmap, onToggleTopic, onTopicClick }) => {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  if (!roadmap) {
    return <InfoPanel title="Roadmap" body="Your personalized learning path for this roadmap will show up here." />;
  }

  if (!roadmap.phases || roadmap.phases.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center px-6">
        <h2 className="text-[22px] font-medium text-[#1E1E1E]">{roadmap.title}</h2>
        <p className="mt-2 max-w-sm text-[14px] text-black/45">Loading your custom learning roadmap...</p>
      </div>
    );
  }

  let totalTopics = 0;
  let completedTopics = 0;
  roadmap.phases.forEach((phase) => {
    phase.modules.forEach((mod) => {
      mod.topics.forEach((topic) => {
        totalTopics++;
        if (topic.completed) {
          completedTopics++;
        }
      });
    });
  });

  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="flex h-full flex-col overflow-hidden px-1 sm:px-3">
      {/* Title block */}
      <div className="mb-6 rounded-2xl bg-white p-4 sm:p-5 border border-black/5 shadow-sm shrink-0 transition-all duration-300 relative overflow-hidden">
        
        {/* Toggle Collapse/Expand Button */}
        <button
          type="button"
          onClick={() => setIsHeaderCollapsed((prev) => !prev)}
          className="absolute right-4 top-4 rounded-xl p-1 bg-black/[0.03] hover:bg-[#A8F35A]/20 hover:text-[#5b9610] transition-colors cursor-pointer text-black/40"
          title={isHeaderCollapsed ? "Expand Info" : "Minimize Info"}
        >
          {isHeaderCollapsed ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 14 10 14 10 20"/>
              <polyline points="20 10 14 10 14 4"/>
              <line x1="14" y1="10" x2="21" y2="3"/>
              <line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="10 20 10 14 4 14"/>
              <polyline points="14 4 14 10 20 10"/>
              <line x1="14" y1="10" x2="21" y2="3"/>
              <line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          )}
        </button>

        {isHeaderCollapsed ? (
          /* Collapsed Version (Very compact) */
          <div className="flex flex-row items-center justify-between pr-8 gap-4">
            <div className="flex items-center gap-3 truncate">
              <span className="rounded-full bg-[#A8F35A]/20 px-2 py-0.5 text-[10px] font-bold uppercase text-[#5b9610] tracking-wider shrink-0">
                {roadmap.topic || 'Path'}
              </span>
              <h2 className="text-[14px] sm:text-[15px] font-bold text-[#1E1E1E] truncate leading-none">{roadmap.title}</h2>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-bold text-[#1E1E1E]">{progressPercent}%</span>
              <div className="h-1.5 w-16 sm:w-24 rounded-full bg-black/[0.07] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#A8F35A] transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Full Version */
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pr-6">
            <div>
              <span className="rounded-full bg-[#A8F35A]/25 px-2.5 py-1 text-xs font-semibold uppercase text-[#5b9610] tracking-wider">
                {roadmap.topic || 'Learning Path'}
              </span>
              <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-[#1E1E1E] leading-snug">{roadmap.title}</h2>
              <p className="mt-2 text-sm text-black/60 leading-relaxed max-w-2xl">{roadmap.description}</p>
            </div>
            <div className="flex flex-col items-end justify-center shrink-0 min-w-[120px] self-start sm:self-center">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[#1E1E1E]">{progressPercent}%</span>
                <span className="text-[11px] text-black/45 uppercase font-semibold">Progress</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-black/[0.07] overflow-hidden min-w-[100px]">
                <div
                  className="h-full rounded-full bg-[#A8F35A] transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phases scrollable container (Roadmap.sh Style Tree) */}
      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar pb-10">
        <div className="relative py-8 pl-8 md:pl-0 md:flex md:flex-col md:items-center">
          
          {/* Vertical Backbone Connector Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#A8F35A] via-black/10 to-[#A8F35A] -translate-x-1/2 z-0 hidden md:block" />
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#A8F35A] via-black/10 to-[#A8F35A] z-0 block md:hidden" />

          {roadmap.phases.map((phase, phaseIdx) => (
            <div key={phaseIdx} className="w-full relative z-10 flex flex-col items-center">
              
              {/* Phase Milestone Node (Centered along timeline) */}
              <div className="relative z-20 mb-8 mt-6 w-full flex items-center md:justify-center">
                <div className="flex items-center gap-3 bg-[#EAF2CF] text-[#5b9610] font-bold px-6 py-3 rounded-full border-2 border-[#A8F35A] shadow-md text-sm md:text-base">
                  <Map size={18} className="shrink-0" />
                  <span>{phase.name}</span>
                </div>
              </div>

              {/* Module Cards as alternating branches */}
              <div className="w-full relative z-10">
                {phase.modules.map((mod, modIdx) => {
                  // Alternate left and right blocks on desktop
                  const isLeft = modIdx % 2 === 0;
                  return (
                    <div key={modIdx} className="relative flex items-start w-full mb-10 last:mb-0 md:justify-center">
                      
                      {/* Branch Horizontal Line connecting to main trunk (Desktop) */}
                      <div className={`absolute top-8 w-[calc(50%-1.5rem)] h-0.5 border-t-2 border-dashed border-black/15 z-0 hidden md:block
                        ${isLeft ? 'right-1/2' : 'left-1/2'}`}
                      />
                      
                      {/* Central small node connector dot on the backbone (Desktop) */}
                      <div className="absolute left-4 md:left-1/2 top-8 h-4.5 w-4.5 -translate-x-1/2 rounded-full border-4 border-[#A8F35A] bg-white z-20 shadow-sm" />

                      {/* Branch connector dot on the backbone (Mobile) */}
                      <div className="absolute left-4 top-8 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-[#A8F35A] bg-white z-20 shadow-sm md:hidden" />

                      {/* Module Box Container */}
                      <div className={`w-full max-w-md pl-10 md:pl-0 z-10
                        ${isLeft ? 'md:mr-auto md:pr-10' : 'md:ml-auto md:pl-10'}`}
                      >
                        <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-black/15 transition-all duration-300 relative group">
                          
                          {/* Left indicator branch dot for mobile */}
                          <div className="absolute left-0 top-8 w-3 h-3 rounded-full bg-black/10 -translate-x-1/2 md:hidden" />
                          
                          {/* Module Header Details */}
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-black/40">Module {phaseIdx + 1}.{modIdx + 1}</span>
                              <h4 className="font-semibold text-[15px] sm:text-[16px] text-[#1E1E1E] group-hover:text-[#5b9610] transition-colors">{mod.name}</h4>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/[0.04] text-black/50 uppercase tracking-wide shrink-0">
                              {mod.topics.filter(t => t.completed).length}/{mod.topics.length} Done
                            </span>
                          </div>

                          <p className="text-xs text-black/50 leading-relaxed mb-4">{mod.description}</p>
                          
                          {/* Interactive Topic Capsules (Skill Nodes) */}
                          <div className="flex flex-wrap gap-2">
                            {mod.topics.map((topic, topicIdx) => (
                              <div
                                key={topicIdx}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all text-xs font-semibold cursor-pointer select-none
                                  ${topic.completed 
                                    ? 'bg-[#EAF2CF]/40 border-[#A8F35A] text-[#426e0b] hover:bg-[#EAF2CF]/60' 
                                    : 'bg-black/[0.02] border-black/5 text-[#1E1E1E] hover:bg-black/[0.05] hover:border-black/10 hover:scale-[1.02] active:scale-[0.98]'}`}
                                onClick={() => onTopicClick && onTopicClick(topic.name, roadmap.topic)}
                                title={`Click to learn ${topic.name} from First Principles`}
                              >
                                {/* Completion Circular Checkbox */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation(); // prevent launching lesson chat
                                    onToggleTopic(roadmap.id, phaseIdx, modIdx, topicIdx);
                                  }}
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all cursor-pointer
                                    ${topic.completed
                                      ? 'bg-[#A8F35A] border-[#A8F35A] text-[#1E1E1E]'
                                      : 'border-black/20 hover:border-black/35 bg-white'}`}
                                  aria-label={`Toggle completion of ${topic.name}`}
                                >
                                  {topic.completed && (
                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                  )}
                                </button>
                                <span className={topic.completed ? 'line-through opacity-70' : ''}>
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

/* ---------- chat panel ---------- */

// Three-dot "thinking" indicator, staggered so it reads as active work rather
// than a stuck loader.
const ThinkingIndicator = memo(() => (
  <div className="flex items-center gap-1.5 px-1 py-1.5" aria-label="AI is thinking">
    <span className="thinking-dot" style={{ animationDelay: '0ms' }} />
    <span className="thinking-dot" style={{ animationDelay: '140ms' }} />
    <span className="thinking-dot" style={{ animationDelay: '280ms' }} />
  </div>
));

const MessageBubble = memo(({ message, onOptionClick }) => {
  const isUser = message.role === 'user';
  const isThinking = !isUser && message.typing && message.text === 'Thinking...';
  const content = useMemo(() => (isThinking ? null : renderMarkdown(message.text)), [message.text, isThinking]);

  return (
    <div className={`msg-in flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#A8F35A] text-[11px] font-medium text-[#1E1E1E]">
          AI
        </div>
      )}

      <div
        className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.04)]
          ${isUser ? 'bg-[#1E1E1E] text-white rounded-br-sm user-message-bubble' : 'bg-white text-[#1E1E1E] rounded-bl-sm'}`}
      >
        {isThinking ? (
          <ThinkingIndicator />
        ) : (
          <>
            {content}
            {message.typing && <span className="typing-caret" aria-hidden="true" />}
            
            {/* Render dynamically generated option buttons below question */}
            {!message.typing && message.options && message.options.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onOptionClick && onOptionClick(opt)}
                    className="rounded-xl bg-[#A8F35A]/10 hover:bg-[#A8F35A]/35 text-[#1E1E1E] px-3.5 py-1.5 text-[13px] font-semibold border border-[#A8F35A]/45 cursor-pointer transition-colors shadow-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Render retrieved document sources context */}
            {!message.typing && message.sources && message.sources.length > 0 && (
              <div className="mt-3 border-t border-black/5 pt-2">
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Retrieved Sources:</p>
                <div className="flex flex-col gap-1.5">
                  {message.sources.map((src, sIdx) => (
                    <div key={sIdx} className="text-[11px] text-black/60 bg-black/[0.02] border border-black/5 rounded-xl p-2.5 leading-snug">
                      <p className="font-semibold text-black/80">📄 {src.title}</p>
                      <p className="mt-1 text-black/55 italic line-clamp-2">"{src.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/10 text-[11px] font-medium text-[#1E1E1E]">
          <UserRound size={14} />
        </div>
      )}
    </div>
  );
});

const ChatPanel = ({ chat, onSend, sending = false, semanticSearchEnabled, onToggleSemanticSearch }) => {
  const [value, setValue] = useState('');
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const lastMessage = chat?.messages?.[chat.messages.length - 1];
  const scrollSignature = chat ? `${chat.id}:${chat.messages.length}:${lastMessage?.text?.length ?? 0}` : '';

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

  const hasMessages = chat && chat.messages.length > 0;

  return (
    <div className="flex h-full flex-col">
      {hasMessages ? (
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-4">
          <div className="flex flex-col gap-4 py-4">
            {chat.messages.map((m) => (
              <MessageBubble key={m.id} message={m} onOptionClick={onSend} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center text-center px-4">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-[5px] border-[#1E1E1E]">
            <div className="h-10 w-10 rounded-[48%_48%_42%_42%/58%_58%_40%_40%] border-[5px] border-[#1E1E1E] border-b-transparent border-l-transparent border-r-transparent" />
          </div>
          <h1 className="text-[24px] sm:text-[30px] font-medium text-[#1E1E1E]">Welcome Devos</h1>
          <p className="mt-3 text-[14px] sm:text-[15px] text-black/45">
            what do you want to learn or research today?
          </p>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2 px-1 sm:px-4 pb-1">
        {/* iOS-Style Toggle Switch for RAG Semantic Search */}
        <div className="flex items-center justify-between text-xs text-black/50 px-1 py-1.5 select-none bg-black/[0.02] rounded-xl border border-black/5">
          <div className="flex items-center gap-2">
            <span className={`inline-block h-2 w-2 rounded-full ${semanticSearchEnabled ? 'bg-green-500 animate-pulse' : 'bg-black/25'}`} />
            <span>Semantic Search (RAG): {semanticSearchEnabled ? 'ON' : 'OFF'}</span>
          </div>
          <button
            type="button"
            onClick={onToggleSemanticSearch}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
              ${semanticSearchEnabled ? 'bg-[#A8F35A]' : 'bg-black/10'}`}
            title="Toggle Semantic Search (Retrieval-Augmented Generation)"
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out
                ${semanticSearchEnabled ? 'translate-x-4' : 'translate-x-0'}`}
            />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-14 flex-1 items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 transition-shadow focus-within:border-black/20 focus-within:shadow-[0_0_0_3px_rgba(168,243,90,0.35)]">
            <AudioLines size={18} className="shrink-0 text-[#1E1E1E]/70" />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKey}
              placeholder={sending ? 'Waiting for a response...' : 'Start typing...'}
              className="w-full bg-transparent text-[14px] text-[#1E1E1E] outline-none placeholder:text-black/35"
            />
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={sending || !value.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#A8F35A] text-[#1E1E1E] transition-all active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send"
          >
            <ArrowUpRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- main ---------- */

let idCounter = 100;
const nextId = () => idCounter++;

const initialChats = [];

const initialRoadmaps = [];

const Workspace = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chats');

  // chats history (independent)
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(null);

  // roadmaps history (independent, not synced with chats)
  const [roadmaps, setRoadmaps] = useState(initialRoadmaps);
  const [activeRoadmapId, setActiveRoadmapId] = useState(null);
  const [sending, setSending] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);

  // RAG Sources Integration states
  const [documents, setDocuments] = useState([]);
  const [semanticSearchEnabled, setSemanticSearchEnabled] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlTitleInput, setUrlTitleInput] = useState('');

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/docs/');
      if (res.data?.success && res.data?.data) {
        setDocuments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch documents from library:', err);
    }
  }, []);

  // Poll for document status updates if any document is processing, queued, or pending
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
      e.target.value = '';
    }
  };

  const handleUrlAdd = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setUploading(true);
    setUploadError('');

    try {
      await axios.post('http://localhost:5000/docs/upload', {
        sourceType: 'url',
        url: urlInput.trim(),
        title: urlTitleInput.trim() || undefined,
      });
      setUrlInput('');
      setUrlTitleInput('');
      fetchDocuments();
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to add website URL.');
    } finally {
      setUploading(false);
    }
  };

  const handleDocDelete = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this knowledge source? This will remove all associated vector embeddings and history.'
      )
    )
      return;
    try {
      await axios.delete(`http://localhost:5000/docs/${id}`);
      setDocuments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete document source.');
    }
  };


  const activeChat = chats.find((c) => c.id === activeChatId);
  const activeRoadmap = roadmaps.find((r) => r.id === activeRoadmapId);
  const activeIndex = VIEWS.indexOf(activeTab);

  // Lazy-load roadmap details from database when a roadmap is selected
  useEffect(() => {
    if (!activeRoadmapId) return;

    const existing = roadmaps.find((r) => r.id === activeRoadmapId);
    // Only fetch if we don't have phases data yet, and it is a 24-character ObjectId string
    if (existing && !existing.phases && typeof activeRoadmapId === 'string' && activeRoadmapId.length === 24) {
      axios.get(`http://localhost:5000/api/learning/roadmap/${activeRoadmapId}`)
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
        .catch((err) => console.error("Failed to fetch roadmap:", err));
    }
  }, [activeRoadmapId, roadmaps]);

  const handleToggleTopic = useCallback(async (roadmapId, phaseIndex, moduleIndex, topicIndex) => {
    // Optimistic UI updates
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

    // Call API in background
    try {
      await axios.post(`http://localhost:5000/api/learning/roadmap/${roadmapId}/toggle-topic`, {
        phaseIndex,
        moduleIndex,
        topicIndex,
      });
    } catch (err) {
      console.error("Failed to sync completion state with backend:", err);
    }
  }, []);

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

  // opening an item from the "All Chats" / "All Roadmaps" list views jumps
  // into the single chat/roadmap view, same as clicking a history item
  const openChatFromList = handleChatHistoryClick;
  const openRoadmapFromList = handleRoadmapHistoryClick;

  const handleDeleteChat = useCallback((id) => {
    setChats((prev) => {
      const nextChats = prev.filter((chat) => chat.id !== id);
      if (nextChats.length > 0) {
        setActiveChatId((current) => (current === id ? nextChats[0].id : current));
      }
      return nextChats;
    });
  }, []);

  const handleRenameChat = useCallback(async (chatId, currentTitle) => {
    const newTitle = window.prompt("Rename Chat", currentTitle);
    if (!newTitle || newTitle.trim() === "") return;
    
    setChats((prev) => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
    
    if (activeProjectId) {
      const targetChat = chats.find(c => c.id === chatId);
      if (targetChat) {
        try {
          await axios.post(`http://localhost:5000/api/learning/projects/${activeProjectId}/chats`, {
            chat: {
              id: chatId,
              title: newTitle,
              messages: targetChat.messages
            }
          });
        } catch (dbErr) {
          console.error("Failed to sync rename to project DB:", dbErr);
        }
      }
    }
  }, [chats, activeProjectId]);

  const handleRenameRoadmap = useCallback(async (roadmapId, currentTitle) => {
    const newTitle = window.prompt("Rename Roadmap", currentTitle);
    if (!newTitle || newTitle.trim() === "") return;

    setRoadmaps((prev) => prev.map(r => r.id === roadmapId ? { ...r, title: newTitle } : r));

    try {
      await axios.patch(`http://localhost:5000/api/learning/roadmap/${roadmapId}`, {
        title: newTitle
      });
    } catch (err) {
      console.error("Failed to rename roadmap:", err);
      alert("Error renaming roadmap in database.");
    }
  }, []);

  const handleRenameProject = useCallback(async (projectId, currentTitle) => {
    const newTitle = window.prompt("Rename Project", currentTitle);
    if (!newTitle || newTitle.trim() === "") return;

    setProjects((prev) => prev.map(p => p.id === projectId ? { ...p, title: newTitle } : p));

    try {
      await axios.patch(`http://localhost:5000/api/learning/projects/${projectId}`, {
        title: newTitle
      });
    } catch (err) {
      console.error("Failed to rename project:", err);
      alert("Error renaming project in database.");
    }
  }, []);

  const updateTypingMessage = useCallback((chatId, typingId, text, typing) => {
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
  }, []);

  const typeAiResponse = useCallback(
    async (chatId, typingId, responseText) => {
      const characters = Array.from(responseText);

      if (characters.length === 0) {
        updateTypingMessage(chatId, typingId, 'No response received.', false);
        return;
      }

      // Stream in small chunks rather than one character at a time: it reads
      // just as "live" but cuts the number of renders/markdown re-parses by
      // roughly 3-4x on longer responses.
      const chunkSize = characters.length > 400 ? 4 : characters.length > 120 ? 3 : 1;
      const delay = Math.max(8, Math.min(24, Math.round((1000 * chunkSize) / characters.length)));
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

  const loadRoadmaps = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/learning/roadmaps');
      if (res.data?.success && res.data?.roadmaps) {
        const formattedRoadmaps = res.data.roadmaps.map(r => ({
          id: r._id,
          title: r.title,
          topic: r.topic,
          description: r.description,
          phases: r.phases
        }));
        setRoadmaps(formattedRoadmaps);
        if (formattedRoadmaps.length > 0) {
          setActiveRoadmapId(formattedRoadmaps[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load roadmaps list:", err);
    }
  }, []);

  useEffect(() => {
    loadRoadmaps();
  }, [loadRoadmaps]);

  useEffect(() => {
    if (chats.length === 0) {
      const welcomeChat = {
        id: 'default-welcome',
        title: 'ScolarAI Learning Chat',
        messages: [
          {
            id: 'welcome-msg',
            role: 'ai',
            text: 'Hello! I am **ScolarAI**, your dynamic learning tutor.\n\nTo get started, tell me what topic or subject you want to learn (for example: `"I want to learn Dynamic Programming and Graphs"` or `"Teach me Web Development basics"`). I will ask you a few questions and generate a premium interactive learning roadmap for you!'
          }
        ]
      };
      setChats([welcomeChat]);
      setActiveChatId('default-welcome');
    }
  }, [chats]);

  const loadProjects = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/learning/projects');
      if (res.data?.success && res.data?.projects) {
        setProjects(res.data.projects.map(p => ({
          id: p._id,
          title: p.title,
          topic: p.topic,
          description: p.description,
          roadmapId: p.roadmapId,
          sessionId: p.sessionId,
          chats: p.chats || []
        })));
      }
    } catch (err) {
      console.error("Failed to load projects list:", err);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreateProject = useCallback(async () => {
    if (!modalData) return;
    try {
      const res = await axios.post('http://localhost:5000/api/learning/create-project', {
        sessionId: modalData.sessionId,
        topic: modalData.topic
      });
      if (res.data?.success && res.data?.project) {
        const p = res.data.project;
        const newProj = {
          id: p._id,
          title: p.title,
          topic: p.topic,
          description: p.description,
          roadmapId: p.roadmapId,
          sessionId: p.sessionId,
          chats: p.chats || []
        };
        setProjects((prev) => [newProj, ...prev.filter(x => x.id !== newProj.id)]);
        setActiveProjectId(newProj.id);
        alert(`Study project "${newProj.title}" successfully created inside database!`);
      }
    } catch (err) {
      console.error("Failed to create project workspace:", err);
      alert("Error creating workspace. Please try again.");
    } finally {
      setModalData(null);
    }
  }, [modalData]);

  const handleProjectSelect = useCallback(async (projectId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/learning/projects/${projectId}`);
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
            phases: rm.phases
          };
          setRoadmaps((prev) => [formattedRoadmap, ...prev.filter(r => r.id !== formattedRoadmap.id)]);
          setActiveRoadmapId(formattedRoadmap.id);
        }

        if (proj.chats && proj.chats.length > 0) {
          const formattedChats = proj.chats.map(c => ({
            id: c.id,
            title: c.title,
            messages: c.messages,
            sessionId: proj.sessionId
          }));
          
          setChats(formattedChats);
          setActiveChatId(formattedChats[0].id);
        } else {
          const defaultChat = {
            id: nextId(),
            title: 'Welcome to Project',
            messages: [
              { id: nextId(), role: 'ai', text: `Welcome to your study project for **${proj.title}**! Click on any topic in your roadmap tab to start your first-principles lesson.` }
            ]
          };
          setChats([defaultChat]);
          setActiveChatId(defaultChat.id);
        }

        setActiveTab('roadmap');
      }
    } catch (err) {
      console.error("Failed to load project details:", err);
    }
  }, []);

  const handleStartTopicLesson = useCallback(async (topicName, roadmapSubject) => {
    const existingChat = chats.find(c => c.title === `Lesson: ${topicName}`);
    if (existingChat) {
      setActiveChatId(existingChat.id);
      setActiveTab('chats');
      return;
    }

    const chatId = nextId();
    const userMsgId = nextId();
    const typingId = nextId();
    
    const newChat = {
      id: chatId,
      title: `Lesson: ${topicName}`,
      messages: [
        { id: userMsgId, role: 'user', text: `Explain the topic: "${topicName}" using First-Principles thinking.` },
        { id: typingId, role: 'ai', text: 'Thinking...', typing: true }
      ],
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(chatId);
    setActiveTab('chats');
    setSending(true);

    try {
      const response = await axios.post('http://localhost:5000/api/learning/explain-topic', {
        topic: topicName,
        subject: roadmapSubject
      });

      const explanation = response.data?.explanation || 'Failed to generate explanation.';

      await typeAiResponse(chatId, typingId, explanation);

      if (activeProjectId) {
        try {
          const updatedChat = {
            id: chatId,
            title: `Lesson: ${topicName}`,
            messages: [
              { id: userMsgId, role: 'user', text: `Explain the topic: "${topicName}" using First-Principles thinking.` },
              { id: typingId, role: 'ai', text: explanation }
            ]
          };
          await axios.post(`http://localhost:5000/api/learning/projects/${activeProjectId}/chats`, {
            chat: updatedChat
          });
          setProjects(prev => prev.map(p => {
            if (p.id !== activeProjectId) return p;
            return {
              ...p,
              chats: [updatedChat, ...p.chats.filter(c => c.id !== chatId)]
            };
          }));
        } catch (dbErr) {
          console.error("Failed to save chat to database project:", dbErr);
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
  }, [chats, activeProjectId, typeAiResponse, updateTypingMessage]);

  const handleSend = useCallback(
    async (text) => {
      const chatId = activeChatId;
      const currentChat = chats.find((c) => c.id === chatId);
      const isFirstMessage = (currentChat?.messages?.length ?? 0) === 0;
      const userMsg = { id: nextId(), role: 'user', text };
      const typingId = nextId();

      setSending(true);
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) return chat;
          return {
            ...chat,
            title: isFirstMessage ? text.slice(0, 28) : chat.title,
            messages: [...chat.messages, userMsg, { id: typingId, role: 'ai', text: 'Thinking...', typing: true }],
          };
        })
      );

      try {
        const payload = { message: text, semanticSearchEnabled };
        if (currentChat?.sessionId) {
          payload.sessionId = currentChat.sessionId;
        }

        const response = await axios.post(API_URL, payload);
        
        const nextQuestion = response.data?.nextQuestion;
        const options = nextQuestion?.options || [];
        
        const aiText =
          nextQuestion?.question ||
          response.data?.message ||
          response.data?.response ||
          response.data?.reply ||
          response.data?.text ||
          'No response received.';

        const sources = response.data?.sources || [];

        await typeAiResponse(chatId, typingId, aiText);

        const resSessionId = response.data?.sessionId;
        const resStatus = response.data?.status;
        const resRoadmap = response.data?.roadmap;

        setChats((prev) => {
          const nextChats = prev.map((chat) => {
            if (chat.id !== chatId) return chat;
            const updatedChat = {
              ...chat,
              sessionId: resSessionId || chat.sessionId,
              learningStatus: resStatus || chat.learningStatus,
              messages: chat.messages.map((message) =>
                message.id === typingId ? { ...message, options, sources } : message
              ),
            };

            if (activeProjectId) {
              axios.post(`http://localhost:5000/api/learning/projects/${activeProjectId}/chats`, {
                chat: {
                  id: updatedChat.id,
                  title: updatedChat.title,
                  messages: updatedChat.messages
                }
              }).catch(dbErr => console.error("Failed to sync message to project DB:", dbErr));
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
          setRoadmaps((prev) => [newRoadmapItem, ...prev.filter((r) => r.id !== newRoadmapItem.id)]);
          setActiveRoadmapId(newRoadmapItem.id);
          setActiveTab('roadmap');

          // Open the workspace modal popup if project has not been created yet
          if (!response.data?.projectCreated) {
            setModalData({ sessionId: resSessionId, topic: resRoadmap.topic });
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
    [activeChatId, chats, activeProjectId, typeAiResponse, updateTypingMessage, semanticSearchEnabled]
  );

  const sidebarWidthClass = collapsed ? 'lg:w-[88px]' : 'lg:w-[280px]';

  return (
    <div className="flex h-screen w-full flex-col bg-white p-2 sm:p-2.5 text-[#1E1E1E] overflow-hidden">
      {/* header */}
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <div className="flex items-center gap-3 sm:gap-6 lg:gap-28 min-w-0">
            {/* logo */}
            <div className="flex items-end gap-1 shrink-0">
              <img src="logo.svg" alt="" />
              <a className="text-xl sm:text-2xl font-medium" href="#">
                ScolarAi
              </a>
            </div>

            {/* mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF2CF]"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="hidden lg:flex items-center justify-center"
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <StepBack size={20} color="#1E1E1E" className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* menu - desktop */}
          <div className="hidden md:block overflow-x-auto no-scrollbar">
            <ul className="flex w-fit items-center gap-1 rounded-full bg-[#EAF2CF] px-1.5 py-1.5">
              {TABS.map((t) => (
                <li key={t.key}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(t.key)}
                    className={`whitespace-nowrap rounded-full px-4 lg:px-6 py-2 lg:py-2.5 text-sm lg:text-base transition-colors
                      ${activeTab === t.key ? 'bg-white text-[#1E1E1E]' : 'text-[#1E1E1E]/70 hover:text-[#1E1E1E]'}`}
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex w-fit items-center gap-2 sm:gap-4 rounded-full bg-[#EAF2CF] px-1 py-1 shrink-0">
          <div className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white">
            <Eclipse size={18} />
          </div>
          <MessageSquareDot size={18} className="hidden sm:block" />
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/10" />
        </div>
      </div>

      {/* mobile tab bar */}
      <div className="md:hidden mb-2.5 overflow-x-auto no-scrollbar">
        <ul className="flex w-max items-center gap-1 rounded-full bg-[#EAF2CF] px-1.5 py-1.5">
          {TABS.map((t) => (
            <li key={t.key}>
              <button
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors
                  ${activeTab === t.key ? 'bg-white text-[#1E1E1E]' : 'text-[#1E1E1E]/70'}`}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* body */}
      <div className="flex flex-1 min-h-0 gap-2.5 lg:gap-5 relative">
        {/* mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* sidebar */}
        <div
          className={`
            font-normal text-[#1E1E1E] bg-[#EAF2CF] overflow-hidden rounded-3xl
            transition-all duration-300 ease-in-out
            fixed lg:static inset-y-2 left-2 z-40 lg:z-auto
            w-[260px] ${sidebarWidthClass}
            ${mobileOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'}
            px-2.5 py-5 flex flex-col
          `}
        >
          <div className="flex items-center justify-between gap-2 mb-2 lg:hidden">
            <span className="text-[15px] font-medium px-1">Menu</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleNewChat}
            title={collapsed ? 'New Chat' : undefined}
            className={`flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-[16px] transition-all hover:shadow-sm
              ${collapsed ? 'justify-center px-0' : ''}`}
          >
            <MessagesSquare size={20} color="#1E1E1E" className="shrink-0" />
            {!collapsed && 'New Chat'}
          </button>

          <div className="mt-6 flex-1 overflow-y-auto no-scrollbar">
            {/* features */}
            <div>
              {!collapsed && <p className="mb-3 text-[15px] text-black/52 px-1">Features</p>}
              <div className="flex flex-col gap-2">
                <NavButton text="All Chats" icon={MessageCircle} collapsed={collapsed} active={activeTab === 'allChats'} onClick={() => { setActiveTab('allChats'); setMobileOpen(false); }} />
                <NavButton text="Roadmaps" icon={Map} collapsed={collapsed} active={activeTab === 'allRoadmaps'} onClick={() => { setActiveTab('allRoadmaps'); setMobileOpen(false); }} />
                <NavButton text="Projects" icon={FolderGit2} collapsed={collapsed} active={activeTab === 'projects'} onClick={() => { setActiveTab('projects'); setMobileOpen(false); }} />
              </div>
            </div>

            {/* history - shows chats or roadmaps depending on which tab is active, never mixed */}
            {!collapsed && (activeTab === 'chats' || activeTab === 'allChats') && (
              <div className="mt-6">
                <div className="mb-3 flex items-center gap-3 text-black/52 px-1">
                  <Clock3 size={17} />
                  <p className="text-[15px]">Chat History</p>
                </div>

                <div className="flex flex-col gap-1 border-l border-black/15 pl-6 text-[14px] text-[#1E1E1E]/78">
                  {chats.map((c) => (
                    <div key={c.id} className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/50">
                      <button
                        type="button"
                        onClick={() => handleChatHistoryClick(c.id)}
                        className={`flex-1 truncate text-left transition-colors hover:text-[#000]
                          ${activeChatId === c.id ? 'text-black font-medium' : ''}`}
                      >
                        {c.title}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRenameChat(c.id, c.title)}
                        className="opacity-0 transition-opacity group-hover:opacity-100 text-black/35 hover:text-black"
                        title="Rename Chat"
                      >
                        <Pencil size={12} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteChat(c.id)}
                        className="opacity-0 transition-opacity group-hover:opacity-100 text-black/35 hover:text-black"
                        aria-label={`Delete ${c.title}`}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!collapsed && (activeTab === 'roadmap' || activeTab === 'allRoadmaps') && (
              <div className="mt-6">
                <div className="mb-3 flex items-center gap-3 text-black/52 px-1">
                  <Clock3 size={17} />
                  <p className="text-[15px]">Roadmap History</p>
                </div>

                <div className="flex flex-col gap-1 border-l border-black/15 pl-6 text-[14px] text-[#1E1E1E]/78">
                  {roadmaps.map((r) => (
                    <div key={r.id} className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/50">
                      <button
                        type="button"
                        onClick={() => handleRoadmapHistoryClick(r.id)}
                        className={`flex-1 truncate text-left transition-colors hover:text-[#000]
                          ${activeRoadmapId === r.id ? 'text-black font-semibold' : ''}`}
                      >
                        {r.title}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRenameRoadmap(r.id, r.title)}
                        className="opacity-0 transition-opacity group-hover:opacity-100 text-black/35 hover:text-black"
                        title="Rename Roadmap"
                      >
                        <Pencil size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!collapsed && activeTab === 'projects' && (
              <div className="mt-6 animate-fade-in">
                <div className="mb-3 flex items-center justify-between gap-3 text-black/52 px-1">
                  <div className="flex items-center gap-3">
                    <FolderGit2 size={17} />
                    <p className="text-[15px]">My Projects</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleNewChat}
                    className="hover:text-black text-black/60 transition-colors p-0.5 rounded-md hover:bg-black/5 flex items-center justify-center"
                    title="Start New Project"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="flex flex-col gap-1 border-l border-black/15 pl-6 text-[14px] text-[#1E1E1E]/78">
                  {projects.length === 0 ? (
                    <span className="text-xs text-black/40 italic px-2 py-1">No projects yet.</span>
                  ) : (
                    projects.map((p) => (
                      <div key={p.id} className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/50">
                        <button
                          type="button"
                          onClick={() => handleProjectSelect(p.id)}
                          className={`flex-1 truncate text-left transition-colors hover:text-[#000]
                            ${activeProjectId === p.id ? 'text-black font-semibold' : 'text-black/70'}`}
                        >
                          📁 {p.title}
                         </button>
                        <button
                          type="button"
                          onClick={() => handleRenameProject(p.id, p.title)}
                          className="opacity-0 transition-opacity group-hover:opacity-100 text-black/35 hover:text-black"
                          title="Rename Project"
                        >
                          <Pencil size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* help and setting */}
          <div className="mt-4">
            {!collapsed && <p className="mb-3 text-[15px] text-black/52 px-1">Setting and help</p>}
            <div className="flex flex-col gap-2">
              <NavButton text="Setting" icon={Bolt} collapsed={collapsed} active={false} onClick={() => {}} />
              <NavButton text="Contact Us" icon={UserRound} collapsed={collapsed} active={false} onClick={() => {}} />
            </div>
          </div>
        </div>

        {/* right panel with sliding tabs */}
        <div className="flex flex-1 min-w-0 flex-col rounded-3xl bg-[#EAF2CF] overflow-hidden">
          <div
            className="flex h-full w-[700%] transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * (100 / VIEWS.length)}%)` }}
          >
            <div className="w-1/7 h-full px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto no-scrollbar bg-white rounded-3xl">
              {/* RAG Sources Management */}
              <div className="flex h-full flex-col gap-6">
                <div>
                  <h2 className="text-[22px] font-semibold text-[#1E1E1E]">Knowledge Sources</h2>
                  <p className="text-sm text-black/50 mt-1">Upload PDF documents or add website URLs to customize ScolarAi's knowledge base.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                  {/* Left: Add Source Forms */}
                  <div className="flex flex-col gap-5">
                    {/* PDF Uploader Card */}
                    <div className="border border-black/10 rounded-2xl p-5 bg-black/[0.01] hover:bg-black/[0.02] transition-colors relative flex flex-col items-center justify-center text-center group cursor-pointer min-h-[160px]">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                      <FileText size={32} className="text-[#1E1E1E]/60 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-semibold text-sm text-[#1E1E1E]">{uploading ? 'Processing file...' : 'Upload PDF Document'}</p>
                      <p className="text-xs text-black/45 mt-1">Drag and drop or click to browse (Max 20MB)</p>
                    </div>

                    {/* URL Input Card */}
                    <form onSubmit={handleUrlAdd} className="border border-black/10 rounded-2xl p-5 bg-white flex flex-col gap-3.5">
                      <h3 className="font-semibold text-[14px] text-[#1E1E1E]">Add Webpage Source</h3>
                      <input
                        type="text"
                        placeholder="Optional Title (e.g. React Docs)"
                        value={urlTitleInput}
                        onChange={(e) => setUrlTitleInput(e.target.value)}
                        className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-3.5 py-2 text-xs text-[#1E1E1E] outline-none focus:border-black/20"
                      />
                      <div className="flex gap-2">
                        <input
                          type="url"
                          required
                          placeholder="https://example.com/docs"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="flex-1 bg-black/[0.02] border border-black/10 rounded-xl px-3.5 py-2 text-xs text-[#1E1E1E] outline-none focus:border-black/20"
                        />
                        <button
                          type="submit"
                          disabled={uploading || !urlInput.trim()}
                          className="bg-[#A8F35A] hover:bg-[#97db51] text-[#1E1E1E] font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
                        >
                          Add URL
                        </button>
                      </div>
                    </form>

                    {uploadError && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl px-4 py-3 text-xs text-center">
                        {uploadError}
                      </div>
                    )}
                  </div>

                  {/* Right: Document List */}
                  <div className="flex flex-col min-h-0 bg-black/[0.01] border border-black/5 rounded-2xl p-4 overflow-y-auto no-scrollbar">
                    <h3 className="font-semibold text-sm text-[#1E1E1E] mb-3">Document Library ({documents.length})</h3>
                    {documents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center flex-1 py-10 text-center text-black/35">
                        <FileText size={24} className="mb-2 opacity-50" />
                        <p className="text-xs italic">No sources added yet</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {documents.map((doc) => (
                          <div key={doc._id} className="flex items-center justify-between gap-3 bg-white border border-black/10 rounded-xl p-3 shadow-sm hover:border-black/15 transition-all">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className={`h-2 w-2 rounded-full shrink-0
                                  ${doc.status === 'completed' ? 'bg-green-500' : ''}
                                  ${doc.status === 'failed' ? 'bg-red-500' : ''}
                                  ${['queued', 'pending', 'processing'].includes(doc.status) ? 'bg-blue-500 animate-pulse' : ''}
                                `} />
                                <p className="font-semibold text-xs text-[#1E1E1E] truncate" title={doc.title}>{doc.title}</p>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-black/45 font-medium">
                                <span className="uppercase font-semibold tracking-wider px-1 bg-black/[0.04] rounded">{doc.sourceType}</span>
                                {doc.fileSize && <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>}
                                {doc.status === 'completed' && <span>{doc.chunkCount} chunks</span>}
                              </div>
                              {doc.status === 'failed' && (
                                <p className="text-[10px] text-red-500/80 mt-1 truncate" title={doc.errorMessage}>Error: {doc.errorMessage}</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDocDelete(doc._id)}
                              className="text-black/30 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Delete source"
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
            <div className="w-1/7 h-full px-2 sm:px-6 py-4 sm:py-10">
              <ChatPanel
                chat={activeChat}
                onSend={handleSend}
                sending={sending}
                semanticSearchEnabled={semanticSearchEnabled}
                onToggleSemanticSearch={() => setSemanticSearchEnabled((prev) => !prev)}
              />
            </div>
            <div className="w-1/7 h-full px-2 sm:px-6 py-4 sm:py-8 overflow-hidden bg-white rounded-3xl">
              <RoadmapPanel roadmap={activeRoadmap} onToggleTopic={handleToggleTopic} onTopicClick={handleStartTopicLesson} />
            </div>
            <div className="w-1/7 h-full px-4 sm:px-6 py-6 sm:py-10">
              <InfoPanel title="Important questions" body="Key questions worth revisiting will be collected here as you chat." />
            </div>
            <div className="w-1/7 h-full px-4 sm:px-6 py-6 sm:py-10">
              <ListPanel
                title="All Chats"
                items={chats}
                onOpen={openChatFromList}
                emptyLabel="No chats yet — start a new one."
              />
            </div>
            <div className="w-1/7 h-full px-4 sm:px-6 py-6 sm:py-10">
              <ListPanel
                title="All Roadmaps"
                items={roadmaps}
                onOpen={openRoadmapFromList}
                emptyLabel="No roadmaps yet."
              />
            </div>
            <div className="w-1/7 h-full px-4 sm:px-6 py-6 sm:py-10">
              <ListPanel
                title="All Projects"
                items={projects}
                onOpen={handleProjectSelect}
                emptyLabel="No projects yet. Start a new learning journey to create one!"
                action={
                  <button
                    onClick={handleNewChat}
                    className="bg-black hover:bg-black/80 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-all shadow-sm flex items-center gap-1 shrink-0"
                  >
                    <Plus size={16} /> New Project
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-black/5 animate-scale-in">
            <h3 className="text-[18px] font-semibold text-[#1E1E1E] mb-2">Create Learning Workspace?</h3>
            <p className="text-[14px] text-black/60 mb-6 leading-relaxed">
              We generated your roadmap for <strong>{modalData.topic}</strong>. Do you want to create a local workspace folder containing <code>roadmap.md</code> and <code>queries.md</code> files?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalData(null)}
                className="rounded-xl bg-black/[0.05] hover:bg-black/[0.1] px-4 py-2.5 text-[14px] font-semibold text-black/70 cursor-pointer transition-colors"
              >
                No, Skip
              </button>
              <button
                type="button"
                onClick={handleCreateProject}
                className="rounded-xl bg-[#A8F35A] hover:bg-[#97db51] px-4 py-2.5 text-[14px] font-semibold text-[#1E1E1E] cursor-pointer transition-colors shadow-sm"
              >
                Yes, Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

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
          background: #1E1E1E;
          opacity: 0.35;
          animation: thinkingBounce 1s ease-in-out infinite;
        }
        @keyframes thinkingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30% { transform: translateY(-3px); opacity: 0.9; }
        }

        @media (prefers-reduced-motion: reduce) {
          .msg-in, .typing-caret, .thinking-dot { animation: none; }
        }

        .user-message-bubble p { color: rgba(255, 255, 255, 0.9) !important; }
        .user-message-bubble li { color: rgba(255, 255, 255, 0.85) !important; }
        .user-message-bubble li span { color: rgba(255, 255, 255, 0.85) !important; }
        .user-message-bubble li span.line-through { color: rgba(255, 255, 255, 0.45) !important; }
        .user-message-bubble a { color: #A8F35A !important; }
        .user-message-bubble em { color: rgba(255, 255, 255, 0.85) !important; }
        .user-message-bubble strong { color: #ffffff !important; }
        .user-message-bubble code { color: #f87171 !important; background-color: rgba(255, 255, 255, 0.1) !important; }
        .user-message-bubble h1,
        .user-message-bubble h2,
        .user-message-bubble h3,
        .user-message-bubble h4,
        .user-message-bubble h5,
        .user-message-bubble h6 { color: #ffffff !important; }
      `}</style>
    </div>
  );
};

export default Workspace;