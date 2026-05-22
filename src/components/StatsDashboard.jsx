import { TrendingUp, Clock, AlertCircle } from 'lucide-react'

export default function StatsDashboard({ tasks }) {
  const total = tasks.length
  const done = tasks.filter(t => t.completed).length
  const remaining = total - done

  // only count incomplete high priority ones
  const urgent = tasks.filter(t => t.priority === 'high' && t.completed == false).length

  const items = [
    { label: 'Total', value: total, icon: Clock, color: 'text-zinc-600 dark:text-zinc-400' },
    { label: 'Done', value: done, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Active', value: remaining, icon: Clock, color: 'text-orange-600 dark:text-orange-400' },
    {
      label: 'Urgent',
      value: urgent,
      icon: AlertCircle,
      color: urgent > 0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-400 dark:text-zinc-600'
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
      {items.map(function(item) {
        return (
          <div
            key={item.label}
            className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900"
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{item.label}</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-mono tabular-nums">
              {item.value}
            </p>
          </div>
        )
      })}
    </div>
  )
}