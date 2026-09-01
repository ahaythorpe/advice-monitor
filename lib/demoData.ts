export type DemoFlag = 'ACT' | 'KNOW' | 'NOTE'

export type DemoItem = {
  id: string
  title: string
  teaser: string
  link: string
  source_name: string
  flag: DemoFlag
  topic: string
  is_read: boolean
  created_at: string
  ai_summary?: string | null
}

export const demoItems: DemoItem[] = [
  {
    id: 'demo-1',
    title: 'ASIC updates adviser conduct guidance',
    teaser: 'The regulator has published a refreshed reminder on adviser record-keeping and client communications.',
    link: 'https://www.asic.gov.au/regulatory-resources/find-a-document/regulatory-guides/rg-105-financial-hardship/',
    source_name: 'ASIC',
    flag: 'ACT',
    topic: 'Compliance',
    is_read: false,
    created_at: '2026-08-28T09:00:00Z',
    ai_summary: 'Regulatory guidance that may affect adviser process changes and client communication habits.'
  },
  {
    id: 'demo-2',
    title: 'AFCA publishes key determination on complaint handling',
    teaser: 'A recent determination highlights how firms should respond to client concerns without delaying fair remediation.',
    link: 'https://www.afca.org.au/news-and-resources/latest-news/afca-releases-determination-financial-complaints',
    source_name: 'AFCA',
    flag: 'ACT',
    topic: 'Compliance',
    is_read: false,
    created_at: '2026-08-30T10:30:00Z',
    ai_summary: 'Useful for understanding how complaints risk and remediation expectations are being applied in practice.'
  },
  {
    id: 'demo-3',
    title: 'Treasury consultation on super reform timing',
    teaser: 'Industry stakeholders are reviewing the implementation timeline and expected adviser operational impacts.',
    link: 'https://treasury.gov.au/consultation/superannuation-retirement-income-reforms',
    source_name: 'Treasury',
    flag: 'KNOW',
    topic: 'Policy',
    is_read: true,
    created_at: '2026-08-26T12:00:00Z',
    ai_summary: 'This appears to be context-setting information rather than an immediate compliance action.'
  },
  {
    id: 'demo-4',
    title: 'ABS releases financial wellbeing benchmark',
    teaser: 'The latest data point highlights the broader market context around household financial resilience and adviser demand.',
    link: 'https://www.abs.gov.au/statistics/people/household-income-and-wealth/personal-wellbeing-financial-wellbeing',
    source_name: 'ABS',
    flag: 'NOTE',
    topic: 'Market',
    is_read: true,
    created_at: '2026-08-24T07:00:00Z',
    ai_summary: 'Background data that helps explain broader industry context without requiring immediate action.'
  },
  {
    id: 'demo-5',
    title: 'Financial Standard looks at adviser education pressure',
    teaser: 'The publication examines how ongoing learning obligations and market complexity are affecting new entrants.',
    link: 'https://www.financialstandard.com.au/news/adviser-education-compliance-training-mandatory',
    source_name: 'Financial Standard',
    flag: 'KNOW',
    topic: 'Training',
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
  dateRange?: 'week' | 'month' | 'year' | 'all'
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

  if (options?.dateRange && options.dateRange !== 'all') {
    const now = new Date()
    const itemDate = (item: DemoItem) => new Date(item.created_at)

    if (options.dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      items = items.filter((item) => itemDate(item) >= weekAgo)
    } else if (options.dateRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      items = items.filter((item) => itemDate(item) >= monthAgo)
    } else if (options.dateRange === 'year') {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      items = items.filter((item) => itemDate(item) >= yearAgo)
    }
  }

  if (options?.limit) {
    items = items.slice(0, options.limit)
  }

  return items
}

export function getItemsByDate(items: DemoItem[]): Map<string, DemoItem[]> {
  const grouped = new Map<string, DemoItem[]>()

  items.forEach((item) => {
    const date = new Date(item.created_at)
    const dateStr = date.toISOString().split('T')[0]

    if (!grouped.has(dateStr)) {
      grouped.set(dateStr, [])
    }
    grouped.get(dateStr)!.push(item)
  })

  return grouped
}

export function getCalendarDates(dateRange: 'week' | 'month' | 'year' | 'all'): Date[] {
  const now = new Date()
  const dates: Date[] = []

  if (dateRange === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    for (let d = new Date(weekAgo); d <= now; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }
  } else if (dateRange === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    for (let d = new Date(monthAgo); d <= now; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }
  } else if (dateRange === 'year') {
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    for (let d = new Date(yearAgo); d <= now; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }
  } else {
    dates.push(...demoItems.map((item) => new Date(item.created_at)))
  }

  return dates
}
