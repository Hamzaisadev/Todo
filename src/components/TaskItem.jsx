import { useState } from 'react'
import { Check, Trash2, Pencil, X, Calendar } from 'lucide-react'

const PRI_DOT = {
  high: 'bg-red-500',
  medium: 'bg-orange-400',
  low: 'bg-emerald-500',
}

const inputCls = 'w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/30'
const smallSel = 'bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer'

export default function TaskItem({ task, onToggleComplete, onDelete, onUpdate, categories }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)

  // check overdue status - only matters for incomplete tasks
  let isOverdue = false
  if (task.completed == false && task.dueDate) {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const due = new Date(task.dueDate)
    due.setHours(0, 0, 0, 0)
    isOverdue = due < now
  }

  function fmtDate(str) {
    if (!str) return ''
    return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const startEdit = () => {
    setDraft({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate || '',
    })
    setEditing(true)
  }

  function cancelEdit() {
    setDraft(null)
    setEditing(false)
  }

  const saveEdit = () => {
    if (!draft.title.trim()) return // don't save empty title
    onUpdate(task.id, {
      title: draft.title.trim(),
      description: draft.description.trim(),
      priority: draft.priority,
      category: draft.category,
      dueDate: draft.dueDate || null,
    })
    setDraft(null)
    setEditing(false)
  }

  const setDraftField = (k, v) => {
    setDraft(prev => ({ ...prev, [k]: v }))
  }

  if (editing && draft) {
    return (
      <div className="border border-orange-300 dark:border-orange-700 rounded-lg p-4 bg-white dark:bg-zinc-900">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={draft.title}
            onChange={e => setDraftField('title', e.target.value)}
            placeholder="Task title"
            className={inputCls}
          />

          <textarea
            value={draft.description}
            onChange={e => setDraftField('description', e.target.value)}
            placeholder="Description"
            rows={2}
            className={`${inputCls} resize-none`}
          />

          <div className="flex flex-wrap gap-2">
            <select
              value={draft.priority}
              onChange={e => setDraftField('priority', e.target.value)}
              className={smallSel}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={draft.category}
              onChange={e => setDraftField('category', e.target.value)}
              className={smallSel}
            >
              {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>

            <input
              type="date"
              value={draft.dueDate}
              onChange={e => setDraftField('dueDate', e.target.value)}
              className={smallSel}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={cancelEdit}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
            <button
              onClick={saveEdit}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors cursor-pointer"
            >
              <Check className="w-3 h-3" /> Save
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`group border rounded-lg p-4 bg-white dark:bg-zinc-900 transition-colors ${
      task.completed
        ? 'border-zinc-100 dark:border-zinc-800 opacity-60'
        : isOverdue
        ? 'border-red-200 dark:border-red-900'
        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
    }`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
            task.completed
              ? 'bg-orange-500 border-orange-500 text-white'
              : 'border-zinc-300 dark:border-zinc-600 hover:border-orange-400'
          }`}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium text-zinc-900 dark:text-zinc-100 break-words ${
            task.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : ''
          }`}>
            {task.title}
          </p>

          {task.description && (
            <p className={`text-xs text-zinc-500 dark:text-zinc-400 mt-1 break-words line-clamp-2 ${
              task.completed ? 'line-through' : ''
            }`}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span
              className={`w-2 h-2 rounded-full ${PRI_DOT[task.priority]}`}
              title={task.priority + ' priority'}
            />
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{task.category}</span>
            {task.dueDate && (
              <span className={`flex items-center gap-1 text-[11px] ${
                isOverdue ? 'text-red-500' : 'text-zinc-400 dark:text-zinc-500'
              }`}>
                <Calendar className="w-3 h-3" />
                {fmtDate(task.dueDate)}
                {isOverdue && ' · overdue'}
              </span>
            )}
          </div>
        </div>

        {/* action buttons - show on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={startEdit}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Edit task"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}