'use client'

import { Item } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { useState } from 'react'

const flagColors: Record<string, string> = {
  ACT: 'bg-red-100 text-red-800',
  KNOW: 'bg-orange-100 text-orange-800',
  NOTE: 'bg-green-100 text-green-800',
}

const flagEmojis: Record<string, string> = {
  ACT: '🔴',
  KNOW: '🟠',
  NOTE: '🟢',
}

export default function ItemCard({ item, onToggleRead }: { item: Item; onToggleRead: (id: string) => void }) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    await onToggleRead(item.id)
    setLoading(false)
  }

  return (
    <div className={`p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow ${item.is_read ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={item.is_read}
          onChange={handleToggle}
          disabled={loading}
          className="mt-1 h-5 w-5 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{flagEmojis[item.flag]}</span>
            <span className={`px-2 py-1 rounded text-sm font-medium ${flagColors[item.flag]}`}>
              {item.flag}
            </span>
            <span className="text-xs text-gray-500">{item.source_name}</span>
            <span className="text-xs text-gray-400">{formatDate(item.created_at)}</span>
          </div>
          <h3 className={`font-semibold text-lg mb-1 ${item.is_read ? 'text-gray-600' : 'text-gray-900'}`}>
            {item.title}
          </h3>
          {item.teaser && (
            <p className={`text-sm mb-2 ${item.is_read ? 'text-gray-500' : 'text-gray-600'}`}>
              {item.teaser}
            </p>
          )}
          {item.ai_summary && (
            <details className="mt-2 text-sm text-gray-700 cursor-pointer">
              <summary className="font-medium hover:text-gray-900">AI Summary</summary>
              <p className="mt-1 text-gray-600">{item.ai_summary}</p>
            </details>
          )}
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            Read Source →
          </a>
        </div>
      </div>
    </div>
  )
}
