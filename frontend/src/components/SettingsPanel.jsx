import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Camera,
  Bell,
  Plug,
  Users,
  CreditCard,
  Cpu,
  Check,
  Shield,
  Trash2,
  Plus,
  Sparkles,
  ExternalLink,
  Save,
  RotateCcw,
  Sliders,
  FileText,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const SUB_TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'aiconfig', label: 'AI Config', icon: Cpu },
];

export const SettingsPanel = () => {
  const { user, updateUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const avatarInputRef = useRef(null);

  // Profile Form State
  const [fullName, setFullName] = useState(user?.name || 'Jordan Lee');
  const [username, setUsername] = useState(
    user?.username || (user?.email ? user.email.split('@')[0] : 'jordan.lee')
  );
  const [email, setEmail] = useState(user?.email || 'jordan.lee@company.com');
  const [bio, setBio] = useState(
    user?.bio ||
      'Product designer building modern SaaS experiences. I focus on clarity, speed, and polish.'
  );
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Notifications State
  const [notifPreferences, setNotifPreferences] = useState({
    studyReminders: true,
    weeklyDigest: true,
    roadmapMilestones: true,
    vectorIndexing: false,
    emailAlerts: true,
  });

  // Integrations State
  const [integrations, setIntegrations] = useState([
    {
      id: 'gdrive',
      name: 'Google Drive',
      desc: 'Sync research papers, PDFs, and slide decks directly into your knowledge base.',
      connected: true,
      category: 'Storage',
    },
    {
      id: 'notion',
      name: 'Notion',
      desc: 'Export structured roadmaps and first-principles study notes directly to your workspace.',
      connected: true,
      category: 'Productivity',
    },
    {
      id: 'github',
      name: 'GitHub',
      desc: 'Index software repositories, documentation markdown, and code architectures.',
      connected: false,
      category: 'Developer',
    },
    {
      id: 'arxiv',
      name: 'ArXiv & Hugging Face',
      desc: 'One-click import of cutting-edge AI research papers and model cards.',
      connected: true,
      category: 'Research',
    },
    {
      id: 'slack',
      name: 'Slack',
      desc: 'Deliver daily active recall quiz questions and roadmap progress notifications.',
      connected: false,
      category: 'Communication',
    },
  ]);

  // Team State
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 'm1',
      name: user?.name || 'Jordan Lee',
      email: user?.email || 'jordan.lee@company.com',
      role: 'Owner',
      status: 'Active',
    },
    {
      id: 'm2',
      name: 'Alex Rivera',
      email: 'alex.r@company.com',
      role: 'Editor',
      status: 'Active',
    },
    {
      id: 'm3',
      name: 'Taylor Smith',
      email: 'taylor.s@company.com',
      role: 'Viewer',
      status: 'Invited',
    },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');

  // AI Config State
  const [aiConfig, setAiConfig] = useState({
    defaultModel: 'gemini-2.5-flash',
    temperature: 0.4,
    depthMode: 'First-Principles Rigor',
    systemPrompt:
      'Always explain concepts starting from absolute first principles. Deconstruct complex ideas into foundational building blocks before explaining advanced applications.',
    autoSemanticSearch: true,
    autoStudyNotes: true,
  });

  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
      if (user.avatar) setAvatarPreview(user.avatar);
      if (user.bio) setBio(user.bio);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target.result;
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (updateUser) {
      updateUser({
        name: fullName,
        username,
        email,
        bio,
        avatar: avatarPreview,
      });
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancelProfile = () => {
    setFullName(user?.name || 'Jordan Lee');
    setUsername(
      user?.username || (user?.email ? user.email.split('@')[0] : 'jordan.lee')
    );
    setEmail(user?.email || 'jordan.lee@company.com');
    setBio(
      user?.bio ||
        'Product designer building modern SaaS experiences. I focus on clarity, speed, and polish.'
    );
    setAvatarPreview(user?.avatar || null);
  };

  const toggleIntegration = (id) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, connected: !item.connected } : item
      )
    );
  };

  const handleInviteMember = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const newMember = {
      id: `m-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'Invited',
    };
    setTeamMembers((prev) => [...prev, newMember]);
    setInviteEmail('');
  };

  const handleRemoveMember = (id) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="flex h-full w-full flex-col p-6 sm:p-10 lg:p-12 overflow-y-auto no-scrollbar bg-transparent">
      {/* Hidden File Input for Avatar */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />

      <div className="flex h-full flex-col lg:flex-row gap-10 md:gap-14 lg:gap-20 xl:gap-24 max-w-6xl w-full mx-auto">
        {/* ================= LEFT SUB-NAV MENU ================= */}
        <div className="w-full lg:w-48 xl:w-52 shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 no-scrollbar">
          {SUB_TABS.map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-3 rounded-2xl px-5 py-3 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap text-left
                  ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs dark:bg-[#1E3A8A] dark:text-white dark:border dark:border-[#25282D]'
                      : 'text-zinc-700 hover:text-zinc-950 hover:bg-black/5 dark:text-[#8B9099] dark:hover:text-[#E5E7EB] dark:hover:bg-[#16191D]'
                  }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= RIGHT MAIN CONTENT PANE ================= */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header Title */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-[#E5E7EB]">
              Settings
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-[#8B9099] font-normal">
              Manage your account, preferences, and platform experience.
            </p>
          </div>

          {/* ================= 1. PROFILE SUB-TAB (Matching Reference Image) ================= */}
          {activeSubTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-6 max-w-3xl">
              <h2 className="text-base font-bold text-zinc-950 dark:text-[#E5E7EB] leading-none">
                Profile
              </h2>

              {/* Profile Photo Section */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-zinc-900 dark:bg-[#16191D] border border-black/10 dark:border-[#25282D] flex items-center justify-center text-white overflow-hidden shadow-xs shrink-0">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={26} className="text-zinc-300 dark:text-[#8B9099]" />
                  )}
                </div>

                <div className="flex flex-col items-start gap-1.5">
                  <span className="text-xs text-zinc-500 dark:text-[#8B9099] font-medium">
                    Profile photo
                  </span>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-xl bg-zinc-900 hover:bg-black dark:bg-[#1A1D21] dark:hover:bg-[#22252A] text-white text-xs font-semibold px-4 py-2 shadow-xs transition-all cursor-pointer dark:border dark:border-[#25282D]"
                  >
                    <Camera size={13} />
                    <span>Change Photo</span>
                  </button>
                </div>
              </div>

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-800 dark:text-[#8B9099]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jordan Lee"
                    className="w-full rounded-2xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] px-4 py-3 text-xs text-zinc-900 dark:text-[#E5E7EB] shadow-xs outline-none focus:border-zinc-400 dark:focus:border-[#3B82F6] transition-colors"
                  />
                </div>

                {/* Username */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-800 dark:text-[#8B9099]">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="jordan.lee"
                    className="w-full rounded-2xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] px-4 py-3 text-xs text-zinc-900 dark:text-[#E5E7EB] shadow-xs outline-none focus:border-zinc-400 dark:focus:border-[#3B82F6] transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-800 dark:text-[#8B9099]">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan.lee@company.com"
                  className="w-full rounded-2xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] px-4 py-3 text-xs text-zinc-900 dark:text-[#E5E7EB] shadow-xs outline-none focus:border-zinc-400 dark:focus:border-[#3B82F6] transition-colors"
                />
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-800 dark:text-[#8B9099]">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Product designer building modern SaaS experiences. I focus on clarity, speed, and polish."
                  className="w-full rounded-2xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] p-4 text-xs text-zinc-900 dark:text-[#E5E7EB] shadow-xs outline-none focus:border-zinc-400 dark:focus:border-[#3B82F6] transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="rounded-2xl bg-zinc-900 hover:bg-black dark:bg-[#1D4ED8] dark:hover:bg-[#2563EB] text-white font-semibold text-xs px-6 py-3 shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-2"
                >
                  {saveSuccess && <Check size={14} className="text-emerald-300" />}
                  <span>{saveSuccess ? 'Changes Saved!' : 'Save Changes'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancelProfile}
                  className="rounded-2xl bg-white hover:bg-zinc-50 dark:bg-[#16191D] dark:hover:bg-[#1A1D21] border border-black/5 dark:border-[#25282D] text-zinc-700 dark:text-[#E5E7EB] font-semibold text-xs px-6 py-3 shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* ================= 2. NOTIFICATIONS SUB-TAB ================= */}
          {activeSubTab === 'notifications' && (
            <div className="flex flex-col gap-6 max-w-3xl">
              <div>
                <h2 className="text-base font-bold text-zinc-950 dark:text-[#E5E7EB]">
                  Notification Preferences
                </h2>
                <p className="text-xs text-zinc-500 dark:text-[#8B9099] mt-1">
                  Choose how and when Avora notifies you about your learning progress.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  {
                    key: 'studyReminders',
                    title: 'Daily Study & Active Recall Reminders',
                    desc: 'Receive reminders to review key concepts from your active roadmaps.',
                  },
                  {
                    key: 'weeklyDigest',
                    title: 'Weekly First-Principles Synthesis',
                    desc: 'A weekly email summarizing your masteries, quizzes, and completed topics.',
                  },
                  {
                    key: 'roadmapMilestones',
                    title: 'Roadmap Milestone Celebrations',
                    desc: 'Alerts when you complete modules or finish entire learning paths.',
                  },
                  {
                    key: 'vectorIndexing',
                    title: 'Document Vectorization Alerts',
                    desc: 'Notify when background PDF/URL vector processing completes.',
                  },
                  {
                    key: 'emailAlerts',
                    title: 'Product Updates & Community Prompts',
                    desc: 'Receive occasional new features, model updates, and prompt inspirations.',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] shadow-xs"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-zinc-900 dark:text-[#E5E7EB]">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-zinc-500 dark:text-[#8B9099] mt-0.5">
                        {item.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setNotifPreferences((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }))
                      }
                      className={`h-6 w-11 rounded-full transition-colors relative cursor-pointer shrink-0
                        ${
                          notifPreferences[item.key]
                            ? 'bg-zinc-900 dark:bg-[#1D4ED8]'
                            : 'bg-zinc-300 dark:bg-[#25282D]'
                        }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow-xs transition-transform transform absolute top-0.5
                          ${
                            notifPreferences[item.key]
                              ? 'translate-x-5.5 left-0'
                              : 'translate-x-0.5 left-0'
                          }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 3. INTEGRATIONS SUB-TAB ================= */}
          {activeSubTab === 'integrations' && (
            <div className="flex flex-col gap-6 max-w-3xl">
              <div>
                <h2 className="text-base font-bold text-zinc-950 dark:text-[#E5E7EB]">
                  Connected Integrations
                </h2>
                <p className="text-xs text-zinc-500 dark:text-[#8B9099] mt-1">
                  Connect your favorite tools to import study sources and export notes.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {integrations.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] shadow-xs"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-xs font-bold text-zinc-900 dark:text-[#E5E7EB]">
                          {tool.name}
                        </h3>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-[#22252A] text-zinc-600 dark:text-[#8B9099]">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-[#8B9099] mt-1 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleIntegration(tool.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0
                        ${
                          tool.connected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                            : 'bg-zinc-900 hover:bg-black dark:bg-[#1D4ED8] dark:hover:bg-[#2563EB] text-white shadow-xs'
                        }`}
                    >
                      {tool.connected ? 'Connected ✓' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. TEAM SUB-TAB ================= */}
          {activeSubTab === 'team' && (
            <div className="flex flex-col gap-6 max-w-3xl">
              <div>
                <h2 className="text-base font-bold text-zinc-950 dark:text-[#E5E7EB]">
                  Study Group & Team
                </h2>
                <p className="text-xs text-zinc-500 dark:text-[#8B9099] mt-1">
                  Collaborate with classmates and teammates on shared knowledge trees.
                </p>
              </div>

              {/* Invite Member Form */}
              <form
                onSubmit={handleInviteMember}
                className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] shadow-xs"
              >
                <input
                  type="email"
                  required
                  placeholder="colleague@university.edu"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 rounded-xl bg-zinc-50 dark:bg-[#111316] border border-zinc-200 dark:border-[#25282D] px-4 py-2 text-xs text-zinc-900 dark:text-[#E5E7EB] outline-none"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="rounded-xl bg-zinc-50 dark:bg-[#111316] border border-zinc-200 dark:border-[#25282D] px-3 py-2 text-xs text-zinc-900 dark:text-[#E5E7EB] outline-none cursor-pointer"
                >
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                  <option value="Admin">Admin</option>
                </select>
                <button
                  type="submit"
                  className="rounded-xl bg-zinc-900 hover:bg-black dark:bg-[#1D4ED8] dark:hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Invite Member
                </button>
              </form>

              {/* Members List */}
              <div className="flex flex-col gap-2">
                {teamMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] shadow-xs"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="h-8 w-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-zinc-900 dark:text-[#E5E7EB] truncate">
                          {m.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 dark:text-[#8B9099] truncate">
                          {m.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-[#22252A] text-zinc-700 dark:text-[#8B9099]">
                        {m.role}
                      </span>
                      {m.role !== 'Owner' && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(m.id)}
                          className="text-zinc-400 hover:text-red-600 dark:text-[#8B9099] dark:hover:text-red-400 p-1 cursor-pointer"
                          title="Remove member"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 5. BILLING SUB-TAB ================= */}
          {activeSubTab === 'billing' && (
            <div className="flex flex-col gap-6 max-w-3xl">
              <div>
                <h2 className="text-base font-bold text-zinc-950 dark:text-[#E5E7EB]">
                  Billing & Plan Quotas
                </h2>
                <p className="text-xs text-zinc-500 dark:text-[#8B9099] mt-1">
                  Manage your subscription tier, monthly token allocation, and usage.
                </p>
              </div>

              {/* Current Plan Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E5ECC9] dark:bg-[#1E3A8A] text-zinc-900 dark:text-white">
                    Active Plan
                  </span>
                  <h3 className="text-xl font-bold text-zinc-950 dark:text-[#E5E7EB] mt-2">
                    Standard Free Tier
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-[#8B9099] mt-1">
                    Free forever &bull; Includes 3 active knowledge trees and unlimited first-principles chat.
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-2xl bg-zinc-900 hover:bg-black dark:bg-[#1D4ED8] dark:hover:bg-[#2563EB] text-white text-xs font-semibold px-5 py-2.5 shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  Upgrade to Pro ($19/mo)
                </button>
              </div>

              {/* Resource Usage Meters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-[#8B9099]">
                    Knowledge Trees
                  </span>
                  <p className="text-lg font-bold text-zinc-950 dark:text-[#E5E7EB] mt-1">
                    2 / 3 <span className="text-xs font-normal text-zinc-500">used</span>
                  </p>
                  <div className="mt-2.5 h-2 w-full rounded-full bg-zinc-100 dark:bg-[#22252A] overflow-hidden">
                    <div className="h-full bg-zinc-900 dark:bg-[#3B82F6] rounded-full w-[66%]" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-[#8B9099]">
                    Vector Storage
                  </span>
                  <p className="text-lg font-bold text-zinc-950 dark:text-[#E5E7EB] mt-1">
                    14.2 / 50 <span className="text-xs font-normal text-zinc-500">MB</span>
                  </p>
                  <div className="mt-2.5 h-2 w-full rounded-full bg-zinc-100 dark:bg-[#22252A] overflow-hidden">
                    <div className="h-full bg-zinc-900 dark:bg-[#3B82F6] rounded-full w-[28%]" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-[#8B9099]">
                    Monthly AI Tokens
                  </span>
                  <p className="text-lg font-bold text-zinc-950 dark:text-[#E5E7EB] mt-1">
                    48.2k / 100k
                  </p>
                  <div className="mt-2.5 h-2 w-full rounded-full bg-zinc-100 dark:bg-[#22252A] overflow-hidden">
                    <div className="h-full bg-zinc-900 dark:bg-[#3B82F6] rounded-full w-[48%]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. AI CONFIG SUB-TAB ================= */}
          {activeSubTab === 'aiconfig' && (
            <div className="flex flex-col gap-6 max-w-3xl">
              <div>
                <h2 className="text-base font-bold text-zinc-950 dark:text-[#E5E7EB]">
                  AI Model & Tutor Tuning
                </h2>
                <p className="text-xs text-zinc-500 dark:text-[#8B9099] mt-1">
                  Customize the AI engine powering your roadmaps, quizzes, and chat lessons.
                </p>
              </div>

              {/* Model Choice */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-800 dark:text-[#8B9099]">
                  Default AI Reasoning Engine
                </label>
                <select
                  value={aiConfig.defaultModel}
                  onChange={(e) =>
                    setAiConfig((prev) => ({ ...prev, defaultModel: e.target.value }))
                  }
                  className="w-full rounded-2xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] px-4 py-3 text-xs text-zinc-900 dark:text-[#E5E7EB] shadow-xs outline-none cursor-pointer"
                >
                  <option value="gemini-2.5-flash">
                    Google Gemini 2.5 Flash (Ultra Fast &bull; First-Principles Optimized)
                  </option>
                  <option value="gemini-2.5-pro">
                    Google Gemini 2.5 Pro (Deep Mathematical & Theorem Derivation)
                  </option>
                  <option value="gpt-4o">
                    OpenAI GPT-4o (High-Yield Conceptual Synthesis)
                  </option>
                  <option value="claude-3.5-sonnet">
                    Anthropic Claude 3.5 Sonnet (Nuanced Technical Explanations)
                  </option>
                </select>
              </div>

              {/* Creativity / Temperature Slider */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] shadow-xs flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-800 dark:text-[#8B9099]">
                    Reasoning Precision & Temperature
                  </label>
                  <span className="text-xs font-bold text-zinc-900 dark:text-[#E5E7EB]">
                    {aiConfig.temperature}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={aiConfig.temperature}
                  onChange={(e) =>
                    setAiConfig((prev) => ({
                      ...prev,
                      temperature: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-zinc-900 dark:accent-[#3B82F6] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 dark:text-[#8B9099]">
                  <span>Exact & Deductive (0.0)</span>
                  <span>Balanced (0.5)</span>
                  <span>Exploratory & Analogical (1.0)</span>
                </div>
              </div>

              {/* System Instructions */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-800 dark:text-[#8B9099]">
                  Custom Tutor System Prompt
                </label>
                <textarea
                  rows={3}
                  value={aiConfig.systemPrompt}
                  onChange={(e) =>
                    setAiConfig((prev) => ({
                      ...prev,
                      systemPrompt: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] p-4 text-xs text-zinc-900 dark:text-[#E5E7EB] shadow-xs outline-none focus:border-zinc-400 dark:focus:border-[#3B82F6] resize-none leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

