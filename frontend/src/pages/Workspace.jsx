import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import axios from 'axios';
import {
  ArrowUpRight, AudioLines, Bolt, Clock3, Eclipse, FolderGit2, Map,
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
const VIEWS = ['source', 'chats', 'roadmap', 'questions', 'allChats', 'allRoadmaps'];

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

const ListPanel = memo(({ title, items, onOpen, emptyLabel }) => (
  <div className="flex h-full flex-col">
    <h2 className="text-[20px] sm:text-[22px] font-medium text-[#1E1E1E] mb-4 sm:mb-6 px-1">{title}</h2>
    {items.length === 0 ? (
      <p className="text-[14px] text-black/45 px-1">{emptyLabel}</p>
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
  const [expandedPhases, setExpandedPhases] = useState({});

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

  const togglePhase = (idx) => {
    setExpandedPhases(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="flex h-full flex-col overflow-hidden px-1 sm:px-3">
      {/* Title block */}
      <div className="mb-6 rounded-2xl bg-white p-5 border border-black/5 shadow-sm shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="rounded-full bg-[#A8F35A]/25 px-2.5 py-1 text-xs font-semibold uppercase text-[#5b9610] tracking-wider">
              {roadmap.topic || 'Learning Path'}
            </span>
            <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-[#1E1E1E] leading-snug">{roadmap.title}</h2>
            <p className="mt-2 text-sm text-black/60 leading-relaxed max-w-2xl">{roadmap.description}</p>
          </div>
          <div className="flex flex-col items-end justify-center shrink-0 min-w-[120px]">
            <span className="text-2xl font-bold text-[#1E1E1E]">{progressPercent}%</span>
            <span className="text-[12px] text-black/45 uppercase font-medium tracking-wide">Progress</span>
            <div className="mt-2 h-2 w-full rounded-full bg-black/[0.07] overflow-hidden min-w-[100px]">
              <div
                className="h-full rounded-full bg-[#A8F35A] transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Phases scrollable container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 no-scrollbar">
        {roadmap.phases.map((phase, phaseIdx) => {
          const isExpanded = expandedPhases[phaseIdx] !== false; // expanded by default
          return (
            <div key={phaseIdx} className="rounded-2xl border border-black/5 bg-white shadow-sm overflow-hidden">
              {/* Phase Header */}
              <button
                type="button"
                onClick={() => togglePhase(phaseIdx)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-black/[0.01] transition-colors border-l-4 border-[#A8F35A]"
              >
                <div>
                  <h3 className="font-semibold text-lg text-[#1E1E1E]">{phase.name}</h3>
                  <p className="text-[13px] text-black/50 mt-0.5">{phase.description}</p>
                </div>
                <span className="text-[12px] text-black/45 font-semibold px-2 py-1 bg-black/[0.04] rounded-md shrink-0">
                  {isExpanded ? 'COLLAPSE' : 'EXPAND'}
                </span>
              </button>

              {/* Phase Modules */}
              {isExpanded && (
                <div className="p-4 bg-black/[0.005] border-t border-black/5 space-y-6">
                  {phase.modules.map((mod, modIdx) => (
                    <div key={modIdx} className="relative pl-4 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-black/10">
                      <h4 className="font-medium text-[15px] text-[#1E1E1E]">{mod.name}</h4>
                      <p className="text-xs text-black/50 mt-0.5">{mod.description}</p>
                      
                      {/* Topics Checklist */}
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {mod.topics.map((topic, topicIdx) => (
                          <div
                            key={topicIdx}
                            className={`flex items-center gap-3 p-2.5 rounded-xl border border-black/[0.03] transition-all bg-white hover:border-black/[0.07]
                              ${topic.completed ? 'opacity-65 bg-black/[0.01]' : ''}`}
                          >
                            <button
                              type="button"
                              onClick={() => onToggleTopic(roadmap.id, phaseIdx, modIdx, topicIdx)}
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all cursor-pointer
                                ${topic.completed
                                  ? 'bg-[#A8F35A] border-[#A8F35A] text-[#1E1E1E]'
                                  : 'border-black/25 hover:border-black/40 bg-white'}`}
                              aria-label={`Toggle completion of ${topic.name}`}
                            >
                              {topic.completed && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => onTopicClick && onTopicClick(topic.name, roadmap.topic)}
                              className={`text-left text-[13.5px] font-medium leading-tight truncate hover:text-[#9aad2e] hover:underline cursor-pointer
                                ${topic.completed ? 'line-through text-black/45' : 'text-[#1E1E1E]'}`}
                              title={`Click to learn ${topic.name} from First Principles`}
                            >
                              {topic.name}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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

const ChatPanel = ({ chat, onSend, sending = false }) => {
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

      <div className="mt-auto flex items-center gap-3 px-1 sm:px-4 pb-1">
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
  );
};

/* ---------- main ---------- */

let idCounter = 100;
const nextId = () => idCounter++;

const initialChats = [
  { id: 1, title: 'Ai Research Learning', messages: [] },
  { id: 2, title: 'Gen ai learning', messages: [] },
  { id: 3, title: 'Maths learning path', messages: [] },
];

const initialRoadmaps = [
  { id: 201, title: 'Frontend Developer Path' },
  { id: 202, title: 'Data Science Roadmap' },
  { id: 203, title: 'UI/UX Design Track' },
];

const Workspace = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chats');

  // chats history (independent)
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(initialChats[0].id);

  // roadmaps history (independent, not synced with chats)
  const [roadmaps, setRoadmaps] = useState(initialRoadmaps);
  const [activeRoadmapId, setActiveRoadmapId] = useState(initialRoadmaps[0].id);
  const [sending, setSending] = useState(false);
  const [modalData, setModalData] = useState(null);


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

  const handleCreateProject = useCallback(async () => {
    if (!modalData) return;
    try {
      const res = await axios.post('http://localhost:5000/api/learning/create-project', {
        sessionId: modalData.sessionId,
        topic: modalData.topic
      });
      if (res.data?.success) {
        alert(`Workspace created successfully!\nFiles written to: ${res.data.projectDir}`);
      }
    } catch (err) {
      console.error("Failed to create project workspace:", err);
      alert("Error creating workspace. Please try again.");
    } finally {
      setModalData(null);
    }
  }, [modalData]);

  const handleStartTopicLesson = useCallback(async (topicName, roadmapSubject) => {
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

      // Log the query to projects queries.md in background
      try {
        await axios.post('http://localhost:5000/api/learning/log-query', {
          subject: roadmapSubject,
          query: `Explain: ${topicName}`,
          response: explanation
        });
      } catch (fsErr) {
        console.error("FS logging error:", fsErr);
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
  }, [typeAiResponse, updateTypingMessage]);

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
        const payload = { message: text };
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

        await typeAiResponse(chatId, typingId, aiText);

        const resSessionId = response.data?.sessionId;
        const resStatus = response.data?.status;
        const resRoadmap = response.data?.roadmap;

        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id !== chatId) return chat;
            return {
              ...chat,
              sessionId: resSessionId || chat.sessionId,
              learningStatus: resStatus || chat.learningStatus,
              messages: chat.messages.map((message) =>
                message.id === typingId ? { ...message, options } : message
              ),
            };
          })
        );

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

          // Open the workspace modal popup
          setModalData({ sessionId: resSessionId, topic: resRoadmap.topic });
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
    [activeChatId, chats, typeAiResponse, updateTypingMessage]
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
                <NavButton text="Projects" icon={FolderGit2} collapsed={collapsed} active={false} onClick={() => {}} />
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
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoadmapHistoryClick(r.id)}
                      className={`w-full truncate text-left rounded-lg px-2 py-1.5 transition-colors hover:text-[#000]
                        ${activeRoadmapId === r.id ? 'text-black font-medium' : ''}`}
                    >
                      {r.title}
                    </button>
                  ))}
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
            className="flex h-full w-[600%] transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * (100 / VIEWS.length)}%)` }}
          >
            <div className="w-1/6 h-full px-4 sm:px-6 py-6 sm:py-10">
              <InfoPanel title="Sources" body="Add documents, links, or notes you want ScolarAi to learn from." />
            </div>
            <div className="w-1/6 h-full px-2 sm:px-6 py-4 sm:py-10">
              <ChatPanel chat={activeChat} onSend={handleSend} sending={sending} />
            </div>
            <div className="w-1/6 h-full px-2 sm:px-6 py-4 sm:py-8 overflow-hidden bg-white rounded-3xl">
              <RoadmapPanel roadmap={activeRoadmap} onToggleTopic={handleToggleTopic} onTopicClick={handleStartTopicLesson} />
            </div>
            <div className="w-1/6 h-full px-4 sm:px-6 py-6 sm:py-10">
              <InfoPanel title="Important questions" body="Key questions worth revisiting will be collected here as you chat." />
            </div>
            <div className="w-1/6 h-full px-4 sm:px-6 py-6 sm:py-10">
              <ListPanel
                title="All Chats"
                items={chats}
                onOpen={openChatFromList}
                emptyLabel="No chats yet — start a new one."
              />
            </div>
            <div className="w-1/6 h-full px-4 sm:px-6 py-6 sm:py-10">
              <ListPanel
                title="All Roadmaps"
                items={roadmaps}
                onOpen={openRoadmapFromList}
                emptyLabel="No roadmaps yet."
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