import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUpRight, AudioLines, Bolt, Clock3, Eclipse, FolderGit2, Map,
  MessageCircle, MessageSquareDot, MessagesSquare, StepBack, Trash2, UserRound,
  Menu, X, PanelLeftClose, PanelLeftOpen, FileText, ListChecks,
} from 'lucide-react';

/* ---------- small building blocks ---------- */

const NavButton = ({ text, icon: Icon, collapsed, active, onClick }) => (
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
);

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

const InfoPanel = ({ title, body }) => (
  <div className="flex h-full flex-col items-center justify-center text-center px-6">
    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-[4px] border-[#1E1E1E]/70">
      <div className="h-8 w-8 rounded-[48%_48%_42%_42%/58%_58%_40%_40%] border-[4px] border-[#1E1E1E]/70 border-b-transparent border-l-transparent border-r-transparent" />
    </div>
    <h2 className="text-[22px] font-medium text-[#1E1E1E]">{title}</h2>
    <p className="mt-2 max-w-sm text-[14px] text-black/45">{body}</p>
  </div>
);

const ListPanel = ({ title, items, onOpen, emptyLabel }) => (
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
              className="text-left rounded-2xl bg-white px-4 py-3.5 hover:bg-white/80 transition-colors"
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
);

/* ---------- chat panel ---------- */

const ChatPanel = ({ chat, onSend }) => {
  const [value, setValue] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat?.messages?.length]);

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const hasMessages = chat && chat.messages.length > 0;

  return (
    <div className="flex h-full flex-col">
      {hasMessages ? (
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-4">
          <div className="flex flex-col gap-4 py-4">
            {chat.messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#A8F35A] text-[11px] font-medium text-[#1E1E1E]">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed
                      ${isUser
                        ? 'bg-[#1E1E1E] text-white rounded-br-sm'
                        : 'bg-white text-[#1E1E1E] rounded-bl-sm'}`}
                  >
                    {m.text}
                  </div>

                  {isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/10 text-[11px] font-medium text-[#1E1E1E]">
                      <UserRound size={14} />
                    </div>
                  )}
                </div>
              );
            })}
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
        <div className="flex h-14 flex-1 items-center gap-3 rounded-2xl border border-black/10 bg-white px-4">
          <AudioLines size={18} className="shrink-0 text-[#1E1E1E]/70" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Start typing..."
            className="w-full bg-transparent text-[14px] text-[#1E1E1E] outline-none placeholder:text-black/35"
          />
        </div>

        <button
          type="button"
          onClick={submit}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#A8F35A] text-[#1E1E1E] transition-transform active:scale-[0.95]"
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

  const activeChat = chats.find((c) => c.id === activeChatId);
  const activeRoadmap = roadmaps.find((r) => r.id === activeRoadmapId);
  const activeIndex = VIEWS.indexOf(activeTab);

  const handleNewChat = () => {
    const chat = { id: nextId(), title: 'New Chat', messages: [] };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
    setActiveTab('chats');
    setMobileOpen(false);
  };

  const handleChatHistoryClick = (id) => {
    setActiveChatId(id);
    setActiveTab('chats');
    setMobileOpen(false);
  };

  const handleRoadmapHistoryClick = (id) => {
    setActiveRoadmapId(id);
    setActiveTab('roadmap');
    setMobileOpen(false);
  };

  // opening an item from the "All Chats" / "All Roadmaps" list views jumps
  // into the single chat/roadmap view, same as clicking a history item
  const openChatFromList = (id) => handleChatHistoryClick(id);
  const openRoadmapFromList = (id) => handleRoadmapHistoryClick(id);

  const handleDeleteChat = (id) => {
    setChats((prev) => {
      const nextChats = prev.filter((chat) => chat.id !== id);
      if (activeChatId === id && nextChats.length > 0) {
        setActiveChatId(nextChats[0].id);
      }
      return nextChats;
    });
  };

  const handleSend = (text) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== activeChatId) return c;
        const userMsg = { id: nextId(), role: 'user', text };
        const aiMsg = {
          id: nextId(),
          role: 'ai',
          text: `Here's a starting point on "${text}" — tell me more about what you'd like to dig into.`,
        };
        const title = c.messages.length === 0 ? text.slice(0, 28) : c.title;
        return { ...c, title, messages: [...c.messages, userMsg, aiMsg] };
      })
    );
  };

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
            className={`flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-[16px] transition-all
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
              <ChatPanel chat={activeChat} onSend={handleSend} />
            </div>
            <div className="w-1/6 h-full px-4 sm:px-6 py-6 sm:py-10">
              <InfoPanel
                title={activeRoadmap ? activeRoadmap.title : 'Roadmap'}
                body="Your personalized learning path for this roadmap will show up here."
              />
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

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Workspace;