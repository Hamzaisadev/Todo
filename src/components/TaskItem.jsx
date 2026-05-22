import { useState } from 'react';
import { Check, Trash2, Pencil, X, Calendar } from 'lucide-react';

const PRIORITY_DOT = {
  high: 'bg-red-500',
  medium: 'bg-orange-400',
  low: 'bg-emerald-500',
};

const inputClass = 'w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/30';
const smallSelect = 'bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer';

export default function TaskItem({ task, onToggleComplete, onDelete, onUpdate, categories }) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  // compute once, not as a function called 3x in the render
  let overdue = false;
  if (!task.completed && task.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    overdue = due < today;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const startEditing = () => {
    setEditData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate || '',
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditData(null);
    setEditing(false);
  };

  const saveEdit = () => {
    if (!editData.title.trim()) return;
    onUpdate(task.id, {
      title: editData.title.trim(),
      description: editData.description.trim(),
      priority: editData.priority,
      category: editData.category,
      dueDate: editData.dueDate || null,
    });
    setEditData(null);
    setEditing(false);
  };

  const updateEdit = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (editing && editData) {
    return (
      <div className="border border-orange-300 dark:border-orange-700 rounded-lg p-4 bg-white dark:bg-zinc-900">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => updateEdit('title', e.target.value)}
            className={inputClass}
            placeholder="Task title"
          />

          <textarea
            value={editData.description}
            onChange={(e) => updateEdit('description', e.target.value)}
            className={`${inputClass} resize-none`}
            rows={2}
            placeholder="Description"
          />

          <div className="flex flex-wrap gap-2">
            <select value={editData.priority} onChange={(e) => updateEdit('priority', e.target.value)} className={smallSelect}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select value={editData.category} onChange={(e) => updateEdit('category', e.target.value)} className={smallSelect}>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <input
              type="date"
              value={editData.dueDate}
              onChange={(e) => updateEdit('dueDate', e.target.value)}
              className={smallSelect}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={cancelEditing}
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
    );
  }

  return (
    <div className={`group border rounded-lg p-4 bg-white dark:bg-zinc-900 transition-colors ${
      task.completed
        ? 'border-zinc-100 dark:border-zinc-800 opacity-60'
        : overdue
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
            <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[task.priority]}`} title={`${task.priority} priority`} />
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{task.category}</span>
            {task.dueDate && (
              <span className={`flex items-center gap-1 text-[11px] ${
                overdue ? 'text-red-500' : 'text-zinc-400 dark:text-zinc-500'
              }`}>
                <Calendar className="w-3 h-3" />
                {formatDate(task.dueDate)}
                {overdue && ' · overdue'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={startEditing}
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
  );
}
