import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  HelpCircle,
  Globe,
  Clock,
  MapPin,
  Sparkles,
  MessageCircle,
  ChevronDown,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const INQUIRY_TYPES = [
  'General Inquiry',
  'Technical Support',
  'Feature Request',
  'Campus & Syllabus',
  'Bug Report',
];

const FAQS = [
  {
    q: 'How quickly does the support team respond?',
    a: 'Our engineering and academic team responds to all inquiries within 2 to 6 hours during standard operating hours (Mon–Fri 9am–6pm PST).',
  },
  {
    q: 'How do I report an incorrect AI citation or equation hallucination?',
    a: 'Select "Bug Report" above and include the chat session or topic name. Our prompt engineers will review and update the underlying first-principles evaluation benchmarks.',
  },
  {
    q: 'Can our university research group get custom roadmap templates?',
    a: 'Yes! Select "Campus & Syllabus" to request tailored curriculum trees, bulk paper vectorization, and team workspaces.',
  },
];

export const ContactPanel = () => {
  const { user } = useAuth();
  const [inquiryType, setInquiryType] = useState('General Inquiry');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitting(true);
    // Simulate brief network submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubject('');
    setMessage('');
    setUrgency('Normal');
  };

  return (
    <div className="flex h-full w-full flex-col p-6 sm:p-10 lg:p-12 overflow-y-auto no-scrollbar bg-transparent">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-8 pb-12">
        {/* ================= HEADER SECTION ================= */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E5ECC9] text-zinc-900 dark:bg-[#1E3A8A] dark:text-white dark:border dark:border-[#25282D]">
            Help & Pedagogy Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-[#E5E7EB] mt-3">
            Contact Us
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-[#8B9099] font-normal max-w-2xl leading-relaxed">
            Have a question about your custom learning roadmaps, vector sources, or platform features? Our team is here to assist.
          </p>
        </div>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Channels & Cards (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Quick Cards */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] shadow-xs flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-[#8B9099]">
                Direct Communication Channels
              </h3>

              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 dark:bg-[#22252A] flex items-center justify-center text-zinc-800 dark:text-[#E5E7EB] shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-[#E5E7EB]">
                    Email Support
                  </p>
                  <a
                    href="mailto:support@avora.ai"
                    className="text-xs text-zinc-600 hover:text-black dark:text-[#8B9099] dark:hover:text-[#3B82F6] font-medium transition-colors"
                  >
                    support@avora.ai
                  </a>
                  <p className="text-[10px] text-zinc-400 dark:text-[#5A5F67] mt-0.5">
                    Response time: &lt; 2 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-black/5 dark:border-[#25282D]">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 dark:bg-[#22252A] flex items-center justify-center text-zinc-800 dark:text-[#E5E7EB] shrink-0">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-[#E5E7EB]">
                    Discord Study Community
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-[#8B9099]">
                    Join 5,000+ researchers & students
                  </p>
                  <p className="text-[10px] text-zinc-400 dark:text-[#5A5F67] mt-0.5">
                    discord.gg/avora-ai
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-black/5 dark:border-[#25282D]">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 dark:bg-[#22252A] flex items-center justify-center text-zinc-800 dark:text-[#E5E7EB] shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-[#E5E7EB]">
                    GitHub Issues
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-[#8B9099]">
                    Open-source issue tracker & feedback
                  </p>
                </div>
              </div>
            </div>

            {/* Operational Info Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] shadow-xs flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-[#8B9099]">
                Office & Hours
              </h3>
              <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-[#8B9099]">
                <Clock size={14} className="text-zinc-500 shrink-0" />
                <span>Mon – Fri: 9:00 AM – 6:00 PM PST</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-[#8B9099]">
                <Globe size={14} className="text-zinc-500 shrink-0" />
                <span>San Francisco, CA &bull; Global Remote Team</span>
              </div>
            </div>

            {/* Quick FAQs */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] shadow-xs flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-[#8B9099]">
                Frequently Asked Questions
              </h3>
              <div className="flex flex-col gap-2">
                {FAQS.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-black/5 dark:border-[#25282D] rounded-2xl p-3 bg-zinc-50/60 dark:bg-[#111316] transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="flex w-full items-center justify-between text-left text-xs font-bold text-zinc-900 dark:text-[#E5E7EB] cursor-pointer"
                    >
                      <span className="pr-2">{faq.q}</span>
                      <ChevronDown
                        size={14}
                        className={`text-zinc-500 transition-transform duration-200 shrink-0 ${
                          expandedFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedFaq === idx && (
                      <p className="mt-2 text-[11px] text-zinc-600 dark:text-[#8B9099] leading-relaxed">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#16191D] border border-black/5 dark:border-[#25282D] shadow-xs flex flex-col gap-6">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-950 dark:text-[#E5E7EB]">
                    Message Sent Successfully!
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-[#8B9099] max-w-md leading-relaxed">
                    Thank you for reaching out, <strong>{name}</strong>. A pedagogical engineer has received your message regarding{' '}
                    <strong>{inquiryType}</strong> and will get back to you at <strong>{email}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-6 rounded-2xl bg-zinc-900 hover:bg-black dark:bg-[#1D4ED8] dark:hover:bg-[#2563EB] text-white font-semibold text-xs px-6 py-3 shadow-xs transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-base font-bold text-zinc-950 dark:text-[#E5E7EB]">
                      Send Us a Message
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-[#8B9099] mt-0.5">
                      Fill out the details below and we'll route your request to the right specialist.
                    </p>
                  </div>

                  {/* Inquiry Type Pills */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-800 dark:text-[#8B9099]">
                      Inquiry Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INQUIRY_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setInquiryType(type)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer
                            ${
                              inquiryType === type
                                ? 'bg-zinc-900 text-white dark:bg-[#1E3A8A] font-semibold shadow-2xs'
                                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-[#111316] dark:text-[#8B9099] dark:hover:bg-[#22252A] dark:hover:text-[#E5E7EB] border border-black/5 dark:border-[#25282D]'
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-800 dark:text-[#8B9099]">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Jordan Lee"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-2xl bg-zinc-50 dark:bg-[#111316] border border-zinc-200 dark:border-[#25282D] px-4 py-2.5 text-xs text-zinc-900 dark:text-[#E5E7EB] outline-none focus:border-zinc-400 dark:focus:border-[#3B82F6] transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-800 dark:text-[#8B9099]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jordan.lee@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-2xl bg-zinc-50 dark:bg-[#111316] border border-zinc-200 dark:border-[#25282D] px-4 py-2.5 text-xs text-zinc-900 dark:text-[#E5E7EB] outline-none focus:border-zinc-400 dark:focus:border-[#3B82F6] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Subject & Urgency */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-800 dark:text-[#8B9099]">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Issue generating Quantum Computing Phase 3"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-2xl bg-zinc-50 dark:bg-[#111316] border border-zinc-200 dark:border-[#25282D] px-4 py-2.5 text-xs text-zinc-900 dark:text-[#E5E7EB] outline-none focus:border-zinc-400 dark:focus:border-[#3B82F6] transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-800 dark:text-[#8B9099]">
                        Priority
                      </label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="w-full rounded-2xl bg-zinc-50 dark:bg-[#111316] border border-zinc-200 dark:border-[#25282D] px-3.5 py-2.5 text-xs text-zinc-900 dark:text-[#E5E7EB] outline-none cursor-pointer"
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical Issue</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-800 dark:text-[#8B9099]">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Please describe your question or issue in detail. Include any relevant syllabus names or error messages..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-2xl bg-zinc-50 dark:bg-[#111316] border border-zinc-200 dark:border-[#25282D] p-4 text-xs text-zinc-900 dark:text-[#E5E7EB] outline-none focus:border-zinc-400 dark:focus:border-[#3B82F6] transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-[#8B9099]">
                      <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                      <span>End-to-end encrypted academic support</span>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-2xl bg-zinc-900 hover:bg-black dark:bg-[#1D4ED8] dark:hover:bg-[#2563EB] text-white font-semibold text-xs px-6 py-3 shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send size={13} />
                      <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

