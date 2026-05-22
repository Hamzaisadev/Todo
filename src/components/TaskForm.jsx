import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

const PRIORITIES = ['low', 'medium', 'high'];

const PRIORITY_ACTIVE = {
  high: 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800',
  medium: 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
  low: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
};

const inputClass = 'w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500';
const selectClass = 'w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer';

const BLANK_FORM = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'Personal',
  customCategory: '',
  dueDate: '',
};

export default function TaskForm({ onAddTask, categories }) {
  const [form, setForm] = useState(BLANK_FORM);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError('Please enter a task title.');
      return;
    }

    const finalCategory = form.category === '_custom'
      ? (form.customCategory.trim() || 'General')
      : form.category;

    onAddTask({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      category: finalCategory,
      dueDate: form.dueDate || null,
    });

    setForm(BLANK_FORM);
    setError('');
    setExpanded(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 p-4"
    >
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="task-title" className="sr-only">Task title</label>
          <input
            id="task-title"
            type="text"
            value={form.title}
            onChange={(e) => { updateField('title', e.target.value); setError(''); }}
            onFocus={() => setExpanded(true)}
            placeholder="What needs to be done?"
            className={`${inputClass} ${error ? 'border-red-400 dark:border-red-600' : ''}`}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer self-start"
          aria-label={expanded ? 'Collapse form' : 'Expand form'}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 flex flex-col gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <div>
            <label htmlFor="task-desc" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Description
            </label>
            <textarea
              id="task-desc"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Add details (optional)"
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Priority</span>
              <div className="flex gap-1">
                {PRIORITIES.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateField('priority', level)}
                    className={`flex-1 text-xs py-1.5 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                      form.priority === level
                        ? PRIORITY_ACTIVE[level]
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="task-category" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                Category
              </label>
              <select
                id="task-category"
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                className={selectClass}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="_custom">+ New category</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-due" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                Due date
              </label>
              <input
                id="task-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => updateField('dueDate', e.target.value)}
                className={selectClass}
              />
            </div>
          </div>

          {form.category === '_custom' && (
            <div>
              <label htmlFor="custom-cat" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                New category name
              </label>
              <input
                id="custom-cat"
                type="text"
                value={form.customCategory}
                onChange={(e) => updateField('customCategory', e.target.value)}
                placeholder="e.g. Fitness, Study, Errands..."
                className={inputClass}
              />
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add task
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
