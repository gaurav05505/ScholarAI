import { useState, useRef, useEffect } from "react";
import axios from "axios";

/* ─── Config ─────────────────────────────────────── */
const API_URL = "http://localhost:5000/api/chat";

/* ─── Palette ────────────────────────────────────── */
const C = {
  pageBg:      "#eef0d9",
  sidebarBg:   "#e8eacf",
  white:       "#ffffff",
  textPrimary:   "#1a1a1a",
  textSecondary: "#555555",
  textMuted:     "#888888",
  border:        "rgba(0,0,0,0.10)",
  navPillBg:     "#dde0c2",
  sendGreen:     "#b5e04a",
  accentGreen:   "#9aad2e",
  brandOrange:   "#f5a623",
  userBubble:    "#c8dea0",
  aiBubble:      "#ffffff",
};

/* ─── Logo ───────────────────────────────────────── */
function Logo() {
  return (
    <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
      <path
        d="M40 10 C43 10, 70 62, 70 66 C70 70, 10 70, 10 66 C10 62, 37 10, 40 10 Z"
        stroke={C.textPrimary}
        strokeWidth="3.5"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Icons ──────────────────────────────────────── */
const Icon = {
  Chat: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Projects: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  Roadmap: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Edit: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.accentGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Branch: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accentGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>
    </svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
};

/* ─── Typing indicator ───────────────────────────── */
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 2px" }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 8, height: 8,
            borderRadius: "50%",
            background: C.textMuted,
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─── Message bubble ─────────────────────────────── */
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 14,
      gap: 10,
      alignItems: "flex-end",
    }}>
      {/* AI avatar */}
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: C.navPillBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          border: `1px solid ${C.border}`,
        }}>
          <svg width="16" height="16" viewBox="0 0 80 80" fill="none">
            <path d="M40 10 C43 10, 70 62, 70 66 C70 70, 10 70, 10 66 C10 62, 37 10, 40 10 Z"
              stroke={C.textPrimary} strokeWidth="5" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
          </svg>
        </div>
      )}

      <div style={{
        maxWidth: "70%",
        background: isUser ? C.userBubble : C.aiBubble,
        border: isUser ? "none" : `1px solid ${C.border}`,
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        padding: "11px 16px",
        fontSize: 15,
        color: C.textPrimary,
        lineHeight: 1.6,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {msg.typing ? <TypingDots /> : msg.content}
      </div>

      {/* User avatar */}
      {isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "#c8a880",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Icon.User />
        </div>
      )}
    </div>
  );
}

/* ─── Sidebar nav item ───────────────────────────── */
function SideNavItem({ icon, label }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "9px 12px", borderRadius: 8, cursor: "pointer",
        fontSize: 15, color: C.textPrimary,
        background: hov ? "rgba(0,0,0,0.06)" : "transparent",
        marginBottom: 2, transition: "background 0.15s",
      }}
    >
      <span style={{ color: C.textSecondary }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

/* ─── Main App ───────────────────────────────────── */
export default function ScolarAI() {
  const [activeTab, setActiveTab]     = useState("Ai chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput]             = useState("");
  const [messages, setMessages]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [history, setHistory]         = useState(["Ai Research Learning", "Gen ai learning", "Maths learning path"]);
  const [showEmpty, setShowEmpty]     = useState(true);

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const tabs = ["Sources", "Ai chat", "Roadmap", "Important Questions"];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setShowEmpty(false);
    setInput("");
    setLoading(true);

    const userMsg = { id: Date.now(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);

    const typingMsg = { id: "typing", role: "ai", typing: true };
    setMessages(prev => [...prev, typingMsg]);

    try {
      const res = await axios.post(API_URL, { message: text });

      // Adjust this key to match your API response shape:
      // e.g. res.data.reply | res.data.message | res.data.response | res.data.text
      const aiText =
        res.data?.reply ||
        res.data?.message ||
        res.data?.response ||
        res.data?.text ||
        res.data?.answer ||
        JSON.stringify(res.data);

      setMessages(prev =>
        prev
          .filter(m => m.id !== "typing")
          .concat({ id: Date.now() + 1, role: "ai", content: aiText })
      );
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      setMessages(prev =>
        prev
          .filter(m => m.id !== "typing")
          .concat({ id: Date.now() + 1, role: "ai", content: `Error: ${errMsg}` })
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    if (messages.length > 0) {
      const preview = messages.find(m => m.role === "user")?.content?.slice(0, 28) || "New chat";
      setHistory(prev => [preview + "...", ...prev.slice(0, 4)]);
    }
    setMessages([]);
    setShowEmpty(true);
    setSidebarOpen(false);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      background: C.pageBg,
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      overflow: "hidden",
    }}>

      {/* ── Header ── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64, padding: "0 20px",
        background: C.pageBg,
        borderBottom: "1.5px solid rgba(0,0,0,0.13)",
        flexShrink: 0, gap: 12,
      }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: C.textSecondary, padding: "2px 4px",
              display: "none",
            }}
            id="hamburger"
          >
            <Icon.Menu />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30, height: 30, background: C.brandOrange, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 15, color: "#fff", flexShrink: 0,
            }}>S</div>
            <span style={{ fontWeight: 700, fontSize: 17, color: C.textPrimary, letterSpacing: "-0.2px" }}>
              ScolarAi
            </span>
          </div>
        </div>

        {/* Center nav tabs */}
        <div id="nav-tabs" style={{
          display: "flex", alignItems: "center", gap: 2,
          background: C.navPillBg, borderRadius: 999, padding: "4px",
          overflowX: "auto",
        }}>
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: "7px 18px", borderRadius: 999,
                fontSize: 14, fontWeight: activeTab === t ? 500 : 400,
                color: activeTab === t ? C.textPrimary : C.textSecondary,
                background: activeTab === t ? C.white : "transparent",
                border: "none", cursor: "pointer", whiteSpace: "nowrap",
                transition: "background 0.15s",
              }}
            >{t}</button>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {[
            <svg key="a" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
            <svg key="b" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>,
          ].map((ic, i) => (
            <button key={i} style={{
              width: 34, height: 34, borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: "rgba(255,255,255,0.55)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: C.textSecondary, flexShrink: 0,
            }}>{ic}</button>
          ))}
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "#c8a880",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#fff",
          }}>
            <Icon.User />
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)", zIndex: 20 }}
          />
        )}

        {/* ── Sidebar ── */}
        <aside style={{
          width: 280, flexShrink: 0,
          background: C.sidebarBg,
          borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column",
          padding: "14px 10px",
          overflowY: "auto", zIndex: 30,
          transition: "transform 0.25s ease",
        }} id="sidebar">

          <button
            onClick={startNewChat}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 16px",
              background: C.white, border: `1px solid ${C.border}`,
              borderRadius: 10, fontSize: 15, fontWeight: 500,
              color: C.textPrimary, cursor: "pointer",
              marginBottom: 18, width: "100%", textAlign: "left",
            }}
          >
            <Icon.Edit /> New Chats
          </button>

          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, letterSpacing: "0.04em", padding: "4px 12px 6px" }}>Features</div>
          <SideNavItem icon={<Icon.Chat />} label="Chat" />
          <SideNavItem icon={<Icon.Projects />} label="Projects" />
          <SideNavItem icon={<Icon.Roadmap />} label="RoadMaps" />

          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, letterSpacing: "0.04em", padding: "12px 12px 6px" }}>History</div>
          <div style={{ borderLeft: `2px solid rgba(0,0,0,0.10)`, marginLeft: 8 }}>
            {history.map((item, i) => (
              <div
                key={i}
                onClick={() => setSidebarOpen(false)}
                style={{
                  padding: "8px 12px", fontSize: 14,
                  color: C.textSecondary, cursor: "pointer", borderRadius: 6,
                }}
              >{item}</div>
            ))}
            <div style={{ padding: "6px 12px", fontSize: 14, color: C.textMuted, cursor: "pointer" }}>More..</div>
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, letterSpacing: "0.04em", padding: "4px 12px 6px" }}>Setting and Help</div>
            <SideNavItem icon={<Icon.Settings />} label="Setting" />
            <SideNavItem icon={<Icon.User />} label="Contact Us" />
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Chat messages area */}
          <div style={{
            flex: 1, overflowY: "auto",
            padding: showEmpty ? "0" : "24px 24px 8px",
            display: "flex", flexDirection: "column",
          }}>
            {/* Empty state */}
            {showEmpty && (
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "2rem", gap: 10,
              }}>
                <Logo />
                <h1 style={{
                  fontSize: 30, fontWeight: 500, color: C.textPrimary,
                  margin: "8px 0 4px", letterSpacing: "-0.3px", textAlign: "center",
                }}>Welcome Devos</h1>
                <p style={{ fontSize: 16, color: C.textSecondary, margin: 0, textAlign: "center" }}>
                  what do you want to learn or research today?
                </p>
              </div>
            )}

            {/* Messages */}
            {!showEmpty && messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* ── Input bar ── */}
          <div style={{
            padding: "14px 20px 18px",
            background: C.pageBg,
            borderTop: `1px solid rgba(0,0,0,0.07)`,
            flexShrink: 0,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: C.white,
              border: `1px solid rgba(0,0,0,0.13)`,
              borderRadius: 999,
              padding: "10px 10px 10px 18px",
            }}>
              <Icon.Branch />
              <input
                ref={inputRef}
                type="text"
                placeholder="i want to learn about web dev"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
                style={{
                  flex: 1, border: "none", outline: "none",
                  fontSize: 15, color: C.textPrimary,
                  background: "transparent", fontFamily: "inherit",
                  opacity: loading ? 0.6 : 1,
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                aria-label="Send"
                style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: loading || !input.trim() ? "#cde88a" : C.sendGreen,
                  border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                {loading
                  ? <div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  : <Icon.Send />
                }
              </button>
            </div>
            <p style={{ fontSize: 12, color: C.textMuted, textAlign: "center", margin: "8px 0 0" }}>
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </main>
      </div>

      {/* Global styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          #hamburger { display: flex !important; }
          #nav-tabs { display: none !important; }
          #sidebar {
            position: absolute !important;
            top: 0; left: 0; bottom: 0;
            transform: ${sidebarOpen ? "translateX(0)" : "translateX(-100%)"};
          }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
      `}</style>
    </div>
  );
}