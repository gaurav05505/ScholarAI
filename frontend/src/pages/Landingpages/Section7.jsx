import React, { useState, useEffect, useRef } from 'react'
import { ArrowRight, Monitor, Plus, Minus } from 'lucide-react'

const FAQ_CATEGORIES = [
  {
    id: 'overview',
    label: 'Overview',
    questions: [
      {
        q: 'What is the platform?',
        a: 'Avora is an intelligent multi-agent learning workspace that transforms complex research papers, syllabi, and documentation into personalized roadmaps, interactive study notes, and active recall quiz loops.',
      },
      {
        q: 'How does Avora personalize my study roadmaps?',
        a: 'Our agent breaks down your target learning goals, analyzes your current background knowledge, and structures dynamic step-by-step topic paths with adaptive pacing.',
      },
      {
        q: 'Can I use Avora for free?',
        a: 'Yes! The Standard plan is 100% free forever and includes 3 active knowledge trees per month with standard roadmap generation and markdown study notes.',
      },
      {
        q: 'What file formats are supported for document upload?',
        a: 'Avora supports PDF documents, Markdown files, LaTeX papers, DOCX files, and plain text notes with full semantic vector search and RAG extraction.',
      },
      {
        q: 'How do the adaptive quiz loops work?',
        a: 'Whenever you finish studying a topic, our agent generates active recall questions. If you get stuck, it automatically creates a sub-branch to clarify prerequisite concepts.',
      },
    ],
  },
  {
    id: 'ai',
    label: 'Our AI',
    questions: [
      {
        q: 'Which AI models power Avora?',
        a: 'We leverage an ensemble of state-of-the-art models including Claude 3.5 Sonnet, OpenAI GPT-4o, and Gemini 1.5 Pro to deliver deep domain reasoning and fast responses.',
      },
      {
        q: 'How does the RAG vector search work?',
        a: 'Your uploaded documents are chunked and embedded into high-dimensional vector spaces, allowing the agent to retrieve exact citations and context in real-time.',
      },
      {
        q: 'Is my uploaded data and research private?',
        a: 'Absolutely. Your data is isolated in secure encrypted tenants and is never used to train public AI foundation models.',
      },
      {
        q: 'Can Avora explain formulas and complex diagrams?',
        a: 'Yes, our multi-modal processing interprets formulas, charts, diagrams, and research tables directly within the study interface.',
      },
      {
        q: 'What is the AI Chat mode with the 3D neural core?',
        a: 'AI Chat provides an interactive conversational assistant for open-ended queries, paper debates, and real-time concept breakdown with tool-assisted execution.',
      },
    ],
  },
  {
    id: 'research',
    label: 'Research & Learning',
    questions: [
      {
        q: 'How do knowledge trees work?',
        a: 'Knowledge trees map interconnected concepts hierarchically so you can visually traverse dependencies from fundamental principles to advanced applications.',
      },
      {
        q: 'Can I import full academic research papers?',
        a: 'Yes, upload ArXiv papers or conference preprints, and the Researcher agent will synthesize literature reviews, extract methodology, and generate flashcard decks.',
      },
      {
        q: 'Can I export my study notes to Obsidian or Notion?',
        a: 'Yes, all notes and roadmaps can be exported in clean Markdown, PDF, or JSON format with full LaTeX equation preservation.',
      },
      {
        q: 'What is active recall sub-branching?',
        a: 'When you struggle with a quiz question, the agent creates a sub-branch explaining the prerequisite topic before returning to the main track.',
      },
      {
        q: 'Does it support team or collaborative learning?',
        a: 'Collaborative workspaces and shared knowledge trees are supported on our Researcher and Team tiers.',
      },
    ],
  },
  {
    id: 'account',
    label: 'Account & Platform',
    questions: [
      {
        q: 'How do I upgrade or cancel my subscription?',
        a: 'You can upgrade, downgrade, or cancel your subscription at any time with one click from your workspace settings page.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards, Apple Pay, Google Pay, and PayPal via Stripe secure checkout.',
      },
      {
        q: 'Do you offer student or academic discounts?',
        a: 'Yes, verified students and university faculty receive an additional 30% discount on the Pro and Researcher plans.',
      },
      {
        q: 'Can I self-host Avora on private cloud servers?',
        a: 'Enterprise and institutional plans support dedicated VPC deployment with custom API keys and SLA guarantees.',
      },
      {
        q: 'How do I contact customer support?',
        a: 'Our priority support team is available 24/7 via the in-app chat widget or by emailing support@avora.ai.',
      },
    ],
  },
]

const Section7 = () => {
  const [activeCategory, setActiveCategory] = useState('overview')
  const [openIndex, setOpenIndex] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const currentCategory = FAQ_CATEGORIES.find((c) => c.id === activeCategory) || FAQ_CATEGORIES[0]

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className="relative w-full min-h-screen bg-[#e5e5e5] text-black font-sans overflow-hidden flex flex-col justify-between pt-20 sm:pt-28 lg:pt-32 pb-32 sm:pb-40"
    >
      {/* Main Content Container with Spacious Max Width & Responsive Gaps */}
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-20 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* ================= LEFT COLUMN: Headline & CTA ================= */}
          <div
            className={`lg:col-span-5 flex flex-col space-y-12 sm:space-y-16 lg:space-y-20 self-start transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Top Heading Group */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-4">
                FAQ
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-[58px] font-bold text-zinc-950 tracking-tight leading-[1.05]">
                Common<br />inquiries
              </h2>
            </div>

            {/* Description & Contact Button */}
            <div className="max-w-sm">
              <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mb-8 font-normal">
                Find answers to common questions about the platform, its features, and how it can support your learning and research.
              </p>

              <button
                type="button"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#18181b] text-white hover:bg-black text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer group"
              >
                <span>Contact Us</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Category Tabs & Accordions ================= */}
          <div
            className={`lg:col-span-7 flex flex-col transition-all duration-700 delay-100 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Category Tabs Header */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border border-zinc-300 bg-[#e0e0e0]/40 overflow-hidden mb-8">
              {FAQ_CATEGORIES.map((category) => {
                const isActive = activeCategory === category.id
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category.id)
                      setOpenIndex(null)
                    }}
                    className={`py-3.5 px-3 sm:px-4 text-[11px] sm:text-xs font-medium transition-all cursor-pointer border-r border-b sm:border-b-0 last:border-r-0 border-zinc-300 flex items-center justify-center text-center ${
                      isActive
                        ? 'bg-[#18181b] text-white font-semibold shadow-sm'
                        : 'bg-transparent text-zinc-600 hover:text-black hover:bg-black/[0.04]'
                    }`}
                  >
                    {category.label}
                  </button>
                )
              })}
            </div>

            {/* Accordion Questions List with Balanced Vertical Spacing */}
            <div className="border-t border-zinc-300">
              {currentCategory.questions.map((item, index) => {
                const isOpen = openIndex === index

                return (
                  <div
                    key={index}
                    className="border-b border-zinc-300 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleQuestion(index)}
                      className="w-full py-4 sm:py-5 flex items-center justify-between text-left gap-4 cursor-pointer group"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Monitor
                          size={18}
                          className="text-zinc-800 flex-shrink-0"
                          strokeWidth={2}
                        />
                        <span className="text-xs sm:text-sm font-medium text-zinc-800 group-hover:text-black transition-colors">
                          {item.q}
                        </span>
                      </div>

                      <div className="w-5 h-5 rounded-full border border-zinc-400 flex items-center justify-center text-zinc-600 group-hover:border-zinc-800 group-hover:text-zinc-900 transition-colors flex-shrink-0">
                        {isOpen ? <Minus size={11} strokeWidth={2.2} /> : <Plus size={11} strokeWidth={2.2} />}
                      </div>
                    </button>

                    {/* Collapsible Answer Panel */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-48 opacity-100 pb-5' : 'max-h-0 opacity-0 pb-0'
                      }`}
                    >
                      <p className="text-xs sm:text-[13px] text-zinc-600 pl-8 sm:pl-9 pr-4 leading-relaxed font-normal">
                        {item.a}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM GEOMETRIC SKYLINE SILHOUETTE ================= */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 flex items-end justify-between pointer-events-none overflow-hidden select-none">
        <div className="flex items-end w-full h-full">
          <div className="w-[12%] h-[65%] bg-black relative" />
          <div className="w-[8%] h-[35%] bg-black relative" />
          <div className="w-[10%] h-[50%] bg-black relative" />
          <div className="w-[14%] h-[75%] bg-black relative flex items-center justify-center">
            <div className="w-[60%] h-[35%] bg-[#e5e5e5]" />
          </div>
          <div className="w-[16%] h-[40%] bg-black relative" />
          <div className="w-[18%] h-[80%] bg-black relative" />
          <div className="w-[12%] h-[55%] bg-black relative" />
          <div className="w-[10%] h-[90%] bg-black relative flex items-center justify-center">
            <div className="w-[65%] h-[30%] bg-[#e5e5e5]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Section7
