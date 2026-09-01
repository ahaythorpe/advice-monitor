import { demoItems, getDemoStats } from '@/lib/demoData'

const toggles = [
  {
    label: 'Email digest',
    value: 'Off by default',
    detail: 'Sends a summary only when you explicitly enable the email path and a working SMTP credential is available.',
  },
  {
    label: 'AI summariser',
    value: 'Off by default',
    detail: 'Uses a paid API only when opted in and prepaid. The tool is designed to require an explicit approval step.',
  },
  {
    label: 'Content intake',
    value: 'Free-first only',
    detail: 'Only public sources, newsletters you already received, and approved free feeds are eligible for automation.',
  },
]

const sourceSummary = [
  { label: 'ACT', value: 'Regulatory changes and deadlines' },
  { label: 'KNOW', value: 'Useful policy and market context' },
  { label: 'NOTE', value: 'Background and reference material' },
]

const stats = getDemoStats()

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          <span className="font-medium">Demo mode</span>
          <span className="text-emerald-100/80">No Gmail, no secrets, no live backend</span>
        </div>

        <header className="mb-10 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">Advice Monitor</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">Demo digest dashboard</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            This is a safe, publishable demo of the monitoring concept: public-source ready, free-first by design,
            and intentionally disconnected from Gmail, databases, and paid APIs until the user adds a working setup.
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
          {sourceSummary.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
              <div className="text-lg font-semibold text-white">{item.value}</div>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <h2 className="text-2xl font-semibold text-white">Latest items</h2>
          <div className="mt-6 space-y-5">
            {demoItems.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
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
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          {toggles.map((toggle) => (
            <div key={toggle.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="text-sm uppercase tracking-[0.2em] text-sky-300">{toggle.label}</div>
              <div className="mt-3 text-2xl font-semibold text-white">{toggle.value}</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{toggle.detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-semibold text-white">Current status</h2>
          <ul className="mt-6 space-y-3 text-slate-300">
            <li>• The project is safe by default: no paid content, no login flows, no paywall bypass.</li>
            <li>• This demo intentionally avoids Gmail and database secrets so it remains publishable on GitHub.</li>
            <li>• Live email sending remains optional and requires a working provider credential.</li>
            <li>• AI summarisation is off until the user explicitly enables and pre-pays for it.</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
