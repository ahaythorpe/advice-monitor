'use client'

import { useState } from 'react'
import { demoItems, getDemoStats } from '@/lib/demoData'

const sourceSummary = [
  { label: 'ACT', value: 'Regulatory changes and deadlines', color: 'rose' },
  { label: 'KNOW', value: 'Useful policy and market context', color: 'sky' },
  { label: 'NOTE', value: 'Background and reference material', color: 'slate' },
]

const colorMap = {
  rose: { border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-300', label: 'text-red-400', dot: 'bg-red-600' },
  sky: { border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-300', label: 'text-orange-400', dot: 'bg-orange-600' },
  slate: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-300', label: 'text-green-400', dot: 'bg-green-600' },
}

const stats = getDemoStats()

export default function Home() {
  const [emailDigest, setEmailDigest] = useState(false)
  const [aiSummariser, setAiSummariser] = useState(false)
  const [contentIntake, setContentIntake] = useState(true)
  const [selectedFlag, setSelectedFlag] = useState<'ACT' | 'KNOW' | 'NOTE' | null>(null)
  const [whatsappPhone, setWhatsappPhone] = useState('')
  const [whatsappLoading, setWhatsappLoading] = useState(false)
  const [whatsappMessage, setWhatsappMessage] = useState('')

  const filteredItems = selectedFlag ? demoItems.filter((item) => item.flag === selectedFlag) : demoItems
  
  // Group items by topic
  const itemsByTopic = new Map<string, typeof demoItems>()
  filteredItems.forEach((item) => {
    if (!itemsByTopic.has(item.topic)) {
      itemsByTopic.set(item.topic, [])
    }
    itemsByTopic.get(item.topic)!.push(item)
  })

  const handleWhatsappSend = async () => {
    if (!whatsappPhone.trim()) {
      setWhatsappMessage('Please enter a WhatsApp number')
      return
    }

    setWhatsappLoading(true)
    setWhatsappMessage('')

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: whatsappPhone, selectedFlag }),
      })

      const data = await response.json()

      if (data.success) {
        setWhatsappMessage(data.demo ? '✓ Demo mode: Message preview generated (configure Twilio to send)' : '✓ Digest sent to WhatsApp!')
        setWhatsappPhone('')
      } else {
        setWhatsappMessage(data.error || 'Failed to send')
      }
    } catch (error) {
      setWhatsappMessage('Error sending digest')
    } finally {
      setWhatsappLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">Advice Monitor</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">Digest dashboard</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Track advice and regulatory updates across your favorite public sources. Free-first monitoring with optional AI summarization and email digests.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Total</div>
            <div className="mt-3 text-3xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Unread</div>
            <div className="mt-3 text-3xl font-bold text-white">{stats.unread}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-400">ACT</div>
            <div className="mt-3 text-3xl font-bold text-white">{stats.act}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-400">KNOW</div>
            <div className="mt-3 text-3xl font-bold text-white">{stats.know}</div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {sourceSummary.map((item) => {
            const colors = colorMap[item.color as keyof typeof colorMap]
            return (
              <div key={item.label} className={`rounded-2xl border ${colors.border} ${colors.bg} bg-slate-900/40 p-5`}>
                <div className={`mb-3 text-sm font-semibold uppercase tracking-[0.2em] ${colors.label}`}>{item.label}</div>
                <div className={`text-lg font-semibold ${colors.text}`}>{item.value}</div>
              </div>
            )
          })}
        </section>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Latest items</h2>
            <div className="flex gap-2">
              {(['ACT', 'KNOW', 'NOTE'] as const).map((flag) => (
                <button
                  key={flag}
                  onClick={() => setSelectedFlag(selectedFlag === flag ? null : flag)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.1em] transition-all ${
                    selectedFlag === flag
                      ? flag === 'ACT'
                        ? 'bg-red-600 text-white border border-red-500'
                        : flag === 'KNOW'
                          ? 'bg-orange-600 text-white border border-orange-500'
                          : 'bg-green-600 text-white border border-green-500'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {flag}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-8">
            {Array.from(itemsByTopic.entries()).map(([topic, items]) => (
              <div key={topic}>
                <h3 className="mb-4 text-lg font-semibold text-slate-300">{topic}</h3>
                <div className="space-y-4">
                  {items.map((item) => {
                    const flagColor = item.flag === 'ACT' ? 'red' : item.flag === 'KNOW' ? 'orange' : 'green'
                    const colorClass =
                      flagColor === 'red'
                        ? 'border-red-500/40 bg-red-500/10 text-red-300'
                        : flagColor === 'orange'
                          ? 'border-orange-500/40 bg-orange-500/10 text-orange-300'
                          : 'border-green-500/40 bg-green-500/10 text-green-300'

                    return (
                      <article key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <span className={`rounded-full border ${colorClass} px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em]`}>
                            {item.flag}
                          </span>
                          <span className="text-xs text-slate-400">{item.source_name}</span>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{item.teaser}</p>
                        <div className="mt-3 text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString()}</div>
                        {item.ai_summary ? (
                          <p className="mt-3 rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200">
                            {item.ai_summary}
                          </p>
                        ) : null}
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-block text-sm font-medium text-sky-300 underline underline-offset-4"
                        >
                          Read at source
                        </a>
                      </article>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm uppercase tracking-[0.2em] text-sky-300">Email digest</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">Sends a summary only when you explicitly enable the email path and a working SMTP credential is available.</p>
              </div>
              <button
                onClick={() => setEmailDigest(!emailDigest)}
                className={`ml-4 flex h-8 w-14 items-center rounded-full px-1 transition-all ${
                  emailDigest ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`h-6 w-6 transform rounded-full bg-white transition-transform ${
                    emailDigest ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="mt-4 text-sm font-medium text-slate-400">{emailDigest ? 'Enabled' : 'Disabled'}</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm uppercase tracking-[0.2em] text-sky-300">AI summariser</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">Uses a paid API only when opted in and prepaid. The tool is designed to require an explicit approval step.</p>
              </div>
              <button
                onClick={() => setAiSummariser(!aiSummariser)}
                className={`ml-4 flex h-8 w-14 items-center rounded-full px-1 transition-all ${
                  aiSummariser ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`h-6 w-6 transform rounded-full bg-white transition-transform ${
                    aiSummariser ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="mt-4 text-sm font-medium text-slate-400">{aiSummariser ? 'Enabled' : 'Disabled'}</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm uppercase tracking-[0.2em] text-sky-300">Content intake</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">Only public sources, newsletters you already received, and approved free feeds are eligible for automation.</p>
              </div>
              <button
                onClick={() => setContentIntake(!contentIntake)}
                className={`ml-4 flex h-8 w-14 items-center rounded-full px-1 transition-all ${
                  contentIntake ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`h-6 w-6 transform rounded-full bg-white transition-transform ${
                    contentIntake ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="mt-4 text-sm font-medium text-slate-400">{contentIntake ? 'Enabled' : 'Disabled'}</div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-semibold text-white">How it works</h2>
          <ul className="mt-6 space-y-3 text-slate-300">
            <li>• Free-first by design: only public sources and free feeds are monitored.</li>
            <li>• No paywalls: content is never scraped behind login or subscription walls.</li>
            <li>• Optional features: email digests and AI summaries are disabled by default and require setup.</li>
            <li>• Privacy-focused: your data and credentials remain under your control.</li>
          </ul>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-semibold text-white">📱 Send Digest via WhatsApp</h2>
          <p className="mt-2 text-sm text-slate-400">Get your latest digest sent directly to WhatsApp</p>
          <div className="mt-6 space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter WhatsApp number (e.g., +61412345678)"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-green-500 focus:outline-none"
              />
              <button
                onClick={handleWhatsappSend}
                disabled={whatsappLoading}
                className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {whatsappLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
            {whatsappMessage && (
              <div className={`rounded-lg px-4 py-3 text-sm ${whatsappMessage.includes('✓') ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                {whatsappMessage}
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-semibold text-white">Bibliography</h2>
          <p className="mt-2 text-sm text-slate-400">All sources referenced in this digest</p>
          <div className="mt-6 space-y-2">
            {Array.from(new Set(demoItems.map((item) => `${item.source_name}|${item.link}`))).map((entry) => {
              const [name, link] = entry.split('|')
              const count = demoItems.filter((item) => item.source_name === name).length
              return (
                <div key={entry} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3">
                  <div>
                    <div className="font-medium text-white">{name}</div>
                    <div className="text-xs text-slate-500">{count} item{count !== 1 ? 's' : ''}</div>
                  </div>
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-sky-400 underline underline-offset-2 hover:text-sky-300"
                  >
                    Visit →
                  </a>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
