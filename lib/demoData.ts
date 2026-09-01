export type DemoFlag = 'ACT' | 'KNOW' | 'NOTE'

export type DemoItem = {
  id: string
  title: string
  teaser: string
  link: string
  source_name: string
  flag: DemoFlag
  is_read: boolean
  created_at: string
  ai_summary?: string | null
}

export const demoItems: DemoItem[] = [
  {
    id: 'demo-1',
    title: 'ASIC updates adviser conduct guidance',
    teaser: 'The regulator has published a refreshed reminder on adviser record-keeping and client communications.',
    link: 'https://www.asic.gov.au',
    source_name: 'ASIC',
    flag: 'ACT',
    is_read: false,
    created_at: '2026-08-28T09:00:00Z',
    ai_summary: 'Regulatory guidance that may affect adviser process changes and client communication habits.'
  },
  {
    id: 'demo-2',
    title: 'AFCA publishes key determination on complaint handling',
    teaser: 'A recent determination highlights how firms should respond to client concerns without delaying fair remediation.',
    link: 'https://www.afca.org.au',
    source_name: 'AFCA',
    flag: 'ACT',
    is_read: false,
    created_at: '2026-08-30T10:30:00Z',
    ai_summary: 'Useful for understanding how complaints risk and remediation expectations are being applied in practice.'
  },
  {
    id: 'demo-3',
    title: 'Treasury consultation on super reform timing',
    teaser: 'Industry stakeholders are reviewing the implementation timeline and expected adviser operational impacts.',
    link: 'https://treasury.gov.au',
    source_name: 'Treasury',
    flag: 'KNOW',
    is_read: true,
    created_at: '2026-08-26T12:00:00Z',
    ai_summary: 'This appears to be context-setting information rather than an immediate compliance action.'
  },
  {
    id: 'demo-4',
    title: 'ABS releases financial wellbeing benchmark',
    teaser: 'The latest data point highlights the broader market context around household financial resilience and adviser demand.',
    link: 'https://www.abs.gov.au',
    source_name: 'ABS',
    flag: 'NOTE',
    is_read: true,
    created_at: '2026-08-24T07:00:00Z',
    ai_summary: 'Background data that helps explain broader industry context without requiring immediate action.'
  },
  {
    id: 'demo-5',
    title: 'Financial Standard looks at adviser education pressure',
    teaser: 'The publication examines how ongoing learning obligations and market complexity are affecting new entrants.',
    link: 'https://www.financialstandard.com.au',
    source_name: 'Financial Standard',
    flag: 'KNOW',
    is_read: false,
    created_at: '2026-08-29T15:20:00Z',
    ai_summary: 'Useful context for understanding the ongoing skills burden in a dynamic regulatory environment.'
  }
]

export function getDemoStats() {
  const total = demoItems.length
  const unread = demoItems.filter((item) => !item.is_read).length
  const act = demoItems.filter((item) => item.flag === 'ACT').length
  const know = demoItems.filter((item) => item.flag === 'KNOW').length
  const note = demoItems.filter((item) => item.flag === 'NOTE').length

  return {
    total,
    unread,
    act,
    know,
    note,
    unreadAct: demoItems.filter((item) => item.flag === 'ACT' && !item.is_read).length,
  }
}

export function getDemoItems(options?: {
  flag?: string
  source?: string
  limit?: number
  query?: string
}) {
  let items = [...demoItems]

  if (options?.flag) {
    items = items.filter((item) => item.flag === options.flag)
  }

  if (options?.source) {
    const source = options.source.toLowerCase()
    items = items.filter((item) => item.source_name.toLowerCase() === source)
  }

  if (options?.query) {
    const query = options.query.toLowerCase()
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.teaser.toLowerCase().includes(query) ||
        item.source_name.toLowerCase().includes(query)
    )
  }

  if (options?.limit) {
    items = items.slice(0, options.limit)
  }

  return items
}
