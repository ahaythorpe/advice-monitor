'use client'

import { DemoItem } from '@/lib/demoData'

interface CalendarProps {
  items: DemoItem[]
  dateRange: 'week' | 'month' | 'year' | 'all'
  selectedDate: string | null
  onDateSelect: (date: string) => void
}

export function Calendar({ items, dateRange, selectedDate, onDateSelect }: CalendarProps) {
  const now = new Date()
  const itemsByDate = new Map<string, DemoItem[]>()

  items.forEach((item) => {
    const dateStr = new Date(item.created_at).toISOString().split('T')[0]
    if (!itemsByDate.has(dateStr)) {
      itemsByDate.set(dateStr, [])
    }
    itemsByDate.get(dateStr)!.push(item)
  })

  const getFlagColor = (flag: string) => {
    switch (flag) {
      case 'ACT':
        return 'bg-red-600'
      case 'KNOW':
        return 'bg-orange-600'
      case 'NOTE':
        return 'bg-green-600'
      default:
        return 'bg-slate-600'
    }
  }

  const getDateRange = () => {
    const dates: Date[] = []
    let startDate: Date

    if (dateRange === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (dateRange === 'month') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    } else if (dateRange === 'year') {
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    } else {
      startDate = new Date(Math.min(...items.map((i) => new Date(i.created_at).getTime())))
    }

    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }

    return dates
  }

  const dates = getDateRange()

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
      <h2 className="mb-6 text-2xl font-semibold text-white">Timeline</h2>

      <div className="space-y-3">
        {dates.length > 0 ? (
          dates.map((date) => {
            const dateStr = date.toISOString().split('T')[0]
            const dayItems = itemsByDate.get(dateStr) || []
            const isSelected = selectedDate === dateStr

            return (
              <button
                key={dateStr}
                onClick={() => onDateSelect(isSelected ? '' : dateStr)}
                className={`w-full text-left transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-500/10 ring-1 ring-sky-500/30'
                    : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                } rounded-2xl border px-4 py-3`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-white">{date.toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    {dayItems.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {dayItems.map((item, idx) => (
                          <span
                            key={idx}
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${getFlagColor(item.flag)}`}
                          >
                            {item.flag[0]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-400">{dayItems.length} item{dayItems.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </button>
            )
          })
        ) : (
          <div className="rounded-2xl border border-slate-700 bg-slate-800/30 p-4 text-center text-slate-400">No items in this period</div>
        )}
      </div>
    </div>
  )
}
