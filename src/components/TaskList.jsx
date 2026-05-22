import { Inbox } from 'lucide-react'
import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggleComplete, onDelete, onUpdate, categories }) {
  // empty state
  if (tasks.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-3" />
        <p className="text-sm text-zinc-400 dark:text-zinc-500">No tasks here yet.</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">
          Add one above or try adjusting your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task, idx) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onUpdate={onUpdate}
          categories={categories}
        />
      ))}
    </div>
  )
}