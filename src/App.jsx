import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  CalendarClock,
  Check,
  ChevronRight,
  Clock3,
  Gift,
  House,
  Leaf,
  Menu,
  MessageSquareText,
  Plus,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Wind,
  X,
  Zap,
} from 'lucide-react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Companion', icon: MessageSquareText },
  { to: '/tasks', label: 'My tasks', icon: CalendarClock },
  { to: '/insights', label: 'Impact', icon: BarChart3 },
  { to: '/rewards', label: 'Green points', icon: Gift },
]

const PROMPTS = [
  'Summarise 120 product reviews',
  'Create embeddings for our policy docs',
  'Run a long market research task',
]

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    role: 'assistant',
    text: 'I can find a cleaner time and model for your next AI task—while keeping your deadline and quality target intact.',
  },
  {
    id: 'user-request',
    role: 'user',
    text: 'Summarise a set of 120 customer interviews by tomorrow morning.',
  },
  {
    id: 'recommendation',
    role: 'assistant',
    text: 'I found a lower-carbon route that keeps your delivery on track.',
    plan: {
      title: 'Interview synthesis · 120 files',
      model: 'Powerhouse Small · balanced quality',
      window: 'Tonight, 1:30 – 2:20 AM',
      intensity: '126 gCO₂e/kWh',
      avoided: '61%',
      points: 48,
      energy: '0.74 kWh',
      scheduled: false,
    },
  },
]

const TASKS = [
  { name: 'Knowledge base embeddings', time: 'Runs in 38 min', state: 'Scheduled', tone: 'mint' },
  { name: 'Q4 feedback clustering', time: 'Completed today', state: 'Saved 0.9 kg', tone: 'blue' },
  { name: 'Design-system audit', time: 'Waiting for approval', state: 'Draft', tone: 'gold' },
]

const REWARDS = [
  { name: '₹100 learning credit', points: 200, note: 'Use on a course or conference ticket.', icon: Sparkles, gradient: 'violet' },
  { name: 'Plant a native tree', points: 300, note: 'A verified restoration project in your name.', icon: Leaf, gradient: 'green' },
  { name: '₹250 team lunch fund', points: 500, note: 'Celebrate a team-wide green sprint.', icon: Gift, gradient: 'sun' },
]

function App() {
  const location = useLocation()
  const [points, setPoints] = useState(370)
  const [notice, setNotice] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const celebrate = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(null), 4200)
    confetti({
      particleCount: 90,
      spread: 64,
      startVelocity: 32,
      origin: { y: 0.73 },
      colors: ['#67e8a5', '#f5d05d', '#f7faf8', '#4eb995'],
    })
  }

  const scheduleTask = (plan) => {
    setPoints((current) => current + plan.points)
    celebrate(`Scheduled for the clean window. +${plan.points} Green Points`)
  }

  const redeemReward = (reward) => {
    if (points < reward.points) {
      setNotice(`You need ${reward.points - points} more Green Points for that reward.`)
      return
    }
    setPoints((current) => current - reward.points)
    celebrate(`${reward.name} is ready to claim.`)
  }

  return (
    <div className="app-shell">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            className="mobile-scrim"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><Leaf size={19} strokeWidth={2.6} /></div>
          <div className="brand-copy">
            <span>Powerhouse</span>
            <strong>CarbonShield</strong>
          </div>
          <button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}>
            <X size={19} />
          </button>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              end={to === '/'}
              to={to}
              key={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="grid-status">
            <span className="pulse-dot" aria-hidden="true" />
            <div>
              <small>India West grid</small>
              <strong>Cleaner window in 2h</strong>
            </div>
          </div>
          <NavLink to="/settings" className={({ isActive }) => `nav-link nav-link--settings ${isActive ? 'nav-link--active' : ''}`}>
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
          <div className="profile-row">
            <div className="avatar">AK</div>
            <div>
              <strong>Abilash K.</strong>
              <span>Powerhouse team</span>
            </div>
            <ChevronRight size={16} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>
            <Menu size={21} />
          </button>
          <div className="topbar-path">
            <span>Carbon-aware workspace</span>
            <strong>{pageTitle(location.pathname)}</strong>
          </div>
          <div className="topbar-actions">
            <div className="points-pill" aria-label={`${points} Green Points, worth ₹${points * 0.5}`}>
              <Leaf size={15} />
              <strong>{points}</strong>
              <span>Green Points</span>
            </div>
            <div className="avatar avatar--top">AK</div>
          </div>
        </header>

        <div className="page-container">
          <Routes>
            <Route path="/" element={<CompanionPage onSchedule={scheduleTask} />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/rewards" element={<RewardsPage points={points} onRedeem={redeemReward} />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<CompanionPage onSchedule={scheduleTask} />} />
          </Routes>
        </div>
      </main>

      <AnimatePresence>
        {notice && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
          >
            <Check size={18} />
            <span>{notice}</span>
            <button aria-label="Dismiss notification" onClick={() => setNotice(null)}><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CompanionPage({ onSchedule }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)

  const sendMessage = (message = input) => {
    const trimmed = message.trim()
    if (!trimmed || thinking) return

    setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'user', text: trimmed }])
    setInput('')
    setThinking(true)

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: 'That looks flexible. I can defer it to the upcoming wind-rich window and preserve the result quality.',
          plan: {
            title: 'New carbon-aware AI task',
            model: 'Powerhouse Small · balanced quality',
            window: 'Tonight, 1:30 – 2:20 AM',
            intensity: '126 gCO₂e/kWh',
            avoided: '58%',
            points: 42,
            energy: '0.68 kWh',
            scheduled: false,
          },
        },
      ])
      setThinking(false)
    }, 900)
  }

  const schedulePlan = (id) => {
    const selected = messages.find((message) => message.id === id)?.plan
    if (!selected || selected.scheduled) return
    setMessages((current) => current.map((message) => (
      message.id === id ? { ...message, plan: { ...message.plan, scheduled: true } } : message
    )))
    onSchedule(selected)
  }

  return (
    <div className="companion-layout">
      <section className="chat-panel">
        <div className="hero-copy">
          <motion.div className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Sparkles size={15} /> Your low-carbon AI co-pilot
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
            Good morning, Abilash.
            <span> What can we make cleaner?</span>
          </motion.h1>
          <p>Tell CarbonShield what you need to run. It finds a lower-emission plan before the work starts.</p>
        </div>

        <div className="conversation" aria-live="polite">
          {messages.map((message, index) => (
            <motion.article
              key={message.id}
              className={`message message--${message.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index < 3 ? index * 0.06 : 0 }}
            >
              {message.role === 'assistant' && <div className="bot-avatar"><Bot size={17} /></div>}
              <div className="message-content">
                {message.role === 'assistant' && <span className="message-label">CarbonShield</span>}
                <p>{message.text}</p>
                {message.plan && <PlanCard plan={message.plan} onSchedule={() => schedulePlan(message.id)} />}
              </div>
            </motion.article>
          ))}
          <AnimatePresence>
            {thinking && (
              <motion.div className="message message--assistant" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bot-avatar"><Bot size={17} /></div>
                <div className="typing" aria-label="CarbonShield is thinking"><i /><i /><i /></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="chat-composer">
          <div className="prompt-row" aria-label="Suggested requests">
            {PROMPTS.map((prompt) => (
              <button key={prompt} className="prompt-chip" onClick={() => sendMessage(prompt)}>{prompt}</button>
            ))}
          </div>
          <label className="composer-field">
            <span className="sr-only">Describe your AI task</span>
            <textarea
              rows="1"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Ask CarbonShield to plan an AI task..."
            />
            <button className="send-button" aria-label="Send request" disabled={!input.trim() || thinking} onClick={() => sendMessage()}>
              <Send size={18} />
            </button>
          </label>
          <p className="composer-note"><ShieldCheck size={13} /> Your task details stay within Powerhouse.</p>
        </div>
      </section>

      <aside className="insight-rail">
        <GridCard />
        <ImpactCard />
        <TaskList />
      </aside>
    </div>
  )
}

function PlanCard({ plan, onSchedule }) {
  return (
    <motion.div className="plan-card" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="plan-card__header">
        <div>
          <span className="card-kicker"><Zap size={14} /> Recommended route</span>
          <h3>{plan.title}</h3>
        </div>
        <div className="savings-pill"><TrendingDown size={14} /> {plan.avoided} less CO₂e</div>
      </div>
      <div className="plan-details">
        <div><span>Run time</span><strong>{plan.window}</strong></div>
        <div><span>Grid forecast</span><strong>{plan.intensity}</strong></div>
        <div><span>Energy use</span><strong>{plan.energy}</strong></div>
        <div><span>Model</span><strong>{plan.model}</strong></div>
      </div>
      <div className="plan-card__footer">
        <div className="earn-points"><Leaf size={15} /><strong>+{plan.points}</strong> points <span>· ₹{plan.points * 0.5} value</span></div>
        <button className={`primary-button ${plan.scheduled ? 'primary-button--done' : ''}`} onClick={onSchedule} disabled={plan.scheduled}>
          {plan.scheduled ? <><Check size={16} /> Scheduled</> : <>Schedule clean run <ChevronRight size={16} /></>}
        </button>
      </div>
    </motion.div>
  )
}

function GridCard() {
  const bars = [45, 70, 55, 34, 23, 19, 28, 46, 65]
  return (
    <section className="rail-card grid-card">
      <div className="card-heading">
        <div><span className="card-kicker"><Wind size={14} /> Grid now</span><h2>India West</h2></div>
        <span className="live-tag"><i /> Live</span>
      </div>
      <div className="grid-reading">
        <strong>184</strong><span>gCO₂e / kWh</span>
        <div className="reading-trend"><TrendingDown size={14} /> 24% cleaner than average</div>
      </div>
      <div className="mini-chart" aria-label="Grid carbon intensity forecast. The lowest point is at 2 AM.">
        {bars.map((height, index) => <span key={index} className={index === 5 ? 'bar bar--best' : 'bar'} style={{ height: `${height}%` }} />)}
      </div>
      <div className="chart-labels"><span>Now</span><span>2 AM</span><span>6 AM</span></div>
      <div className="clean-window"><Clock3 size={15} /><span>Next clean window</span><strong>1:30 AM</strong></div>
    </section>
  )
}

function ImpactCard() {
  return (
    <section className="rail-card impact-card">
      <div className="card-heading">
        <div><span className="card-kicker"><Leaf size={14} /> Your impact</span><h2>This month</h2></div>
        <ArrowUpRight size={17} className="muted-icon" />
      </div>
      <div className="impact-number"><strong>12.4</strong><span>kg CO₂e avoided</span></div>
      <div className="impact-progress"><span style={{ width: '68%' }} /></div>
      <p>You are <strong>68%</strong> of the way to your October goal.</p>
    </section>
  )
}

function TaskList() {
  return (
    <section className="rail-card task-card">
      <div className="card-heading">
        <div><span className="card-kicker"><CalendarClock size={14} /> Activity</span><h2>Your tasks</h2></div>
        <button className="quiet-button">View all</button>
      </div>
      <div className="task-list">
        {TASKS.map((task) => (
          <div className="task-item" key={task.name}>
            <span className={`task-dot task-dot--${task.tone}`} />
            <div><strong>{task.name}</strong><span>{task.time}</span></div>
            <small>{task.state}</small>
          </div>
        ))}
      </div>
      <button className="new-task-button"><Plus size={17} /> New task</button>
    </section>
  )
}

function TasksPage() {
  return (
    <PageIntro eyebrow="WORK QUEUE" title="Your carbon-aware tasks" copy="Every flexible task is matched with its cleanest practical run window.">
      <section className="wide-card">
        <div className="task-table-heading"><span>Task</span><span>Scheduled for</span><span>Projected impact</span><span>Status</span></div>
        {TASKS.map((task, index) => (
          <div className="task-table-row" key={task.name}>
            <div><strong>{task.name}</strong><small>{index === 0 ? 'Embedding · flexible' : 'AI workflow'}</small></div>
            <div><strong>{index === 0 ? 'Today · 11:40 PM' : 'Completed'}</strong><small>{task.time}</small></div>
            <div className="green-copy"><Leaf size={15} /> {index === 0 ? '0.7 kg CO₂e saved' : '0.9 kg CO₂e saved'}</div>
            <span className={`status status--${task.tone}`}>{task.state}</span>
          </div>
        ))}
      </section>
    </PageIntro>
  )
}

function InsightsPage() {
  return (
    <PageIntro eyebrow="PERSONAL IMPACT" title="A quieter footprint, task by task" copy="Small choices about timing add up quickly across a Powerhouse team.">
      <div className="impact-dashboard">
        <section className="wide-card metric-feature">
          <div><span className="card-kicker"><Leaf size={14} /> CarbonShield since October 1</span><h2>12.4 kg CO₂e avoided</h2><p>That is the impact of charging about 1,500 smartphones.</p></div>
          <div className="ring-progress"><strong>61%</strong><span>lower than<br />your baseline</span></div>
        </section>
        <section className="wide-card">
          <div className="card-heading"><div><span className="card-kicker"><BarChart3 size={14} /> Weekly trend</span><h2>Cleaner run windows</h2></div><span className="green-copy">+18% this week</span></div>
          <div className="trend-bars">
            {[36, 50, 42, 68, 63, 82, 74].map((height, index) => <div key={index}><i style={{ height: `${height}%` }} /><span>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span></div>)}
          </div>
        </section>
      </div>
    </PageIntro>
  )
}

function RewardsPage({ points, onRedeem }) {
  return (
    <PageIntro eyebrow="REWARD STUDIO" title="Turn cleaner choices into good things" copy="100 Green Points are worth ₹50. Earn them when you schedule flexible work in cleaner grid windows.">
      <section className="points-hero">
        <div><span>Your balance</span><strong>{points}</strong><p>Green Points <b>· ₹{points * 0.5} value</b></p></div>
        <div className="points-hero__goal"><span>Next reward</span><strong>{Math.max(0, 500 - points)} points to ₹250 team lunch</strong><div><i style={{ width: `${Math.min((points / 500) * 100, 100)}%` }} /></div></div>
      </section>
      <section className="rewards-grid">
        {REWARDS.map((reward) => {
          const Icon = reward.icon
          return (
            <article className="reward-card" key={reward.name}>
              <div className={`reward-icon reward-icon--${reward.gradient}`}><Icon size={21} /></div>
              <span className="reward-cost"><Leaf size={14} /> {reward.points} points</span>
              <h2>{reward.name}</h2>
              <p>{reward.note}</p>
              <button className="secondary-button" onClick={() => onRedeem(reward)}>{points >= reward.points ? 'Redeem reward' : `Need ${reward.points - points} more`}</button>
            </article>
          )
        })}
      </section>
    </PageIntro>
  )
}

function SettingsPage() {
  const [enabled, setEnabled] = useState(true)
  return (
    <PageIntro eyebrow="PREFERENCES" title="Make clean choices automatic" copy="CarbonShield only shifts flexible work and always preserves your stated deadline.">
      <section className="wide-card settings-card">
        <div><h2>Offer cleaner run windows</h2><p>Show a lower-carbon option whenever an AI task can safely wait.</p></div>
        <button className={`toggle ${enabled ? 'toggle--on' : ''}`} role="switch" aria-checked={enabled} aria-label="Offer cleaner run windows" onClick={() => setEnabled(!enabled)}><i /></button>
        <div className="settings-divider" />
        <div><h2>Default quality preference</h2><p>Balanced quality uses efficient models where outcome quality is unchanged.</p></div>
        <button className="settings-choice">Balanced <ChevronRight size={16} /></button>
      </section>
    </PageIntro>
  )
}

function PageIntro({ eyebrow, title, copy, children }) {
  return (
    <div className="standard-page">
      <div className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div>
      {children}
    </div>
  )
}

function pageTitle(pathname) {
  if (pathname === '/tasks') return 'My tasks'
  if (pathname === '/insights') return 'Impact'
  if (pathname === '/rewards') return 'Green Points'
  if (pathname === '/settings') return 'Settings'
  return 'Companion'
}

export default App
