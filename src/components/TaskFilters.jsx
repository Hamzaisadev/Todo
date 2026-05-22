import { Search } from 'lucide-react'

// styles pulled out to keep JSX cleaner
const cls = {
  search: 'w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500',
  sortSelect: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer min-w-[180px]',
  pillOn: 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900',
  pillOff: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700',
}

const STATUS_TABS = ['all', 'active', 'completed']

export default function TaskFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  selectedCategory,
  setSelectedCategory,
  categories,
  sortBy,
  setSortBy,
  tasks
}) {
  // count per tab - recalculated every render but it's fine
  const tabCounts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <label htmlFor="task-search" className="sr-only">Search tasks</label>
          <input
            id="task-search"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className={cls.search}
          />
        </div>

        <div>
          <label htmlFor="sort-select" className="sr-only">Sort tasks</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className={cls.sortSelect}
          >
            <option value="created-desc">Newest first</option>
            <option value="created-asc">Oldest first</option>
            <option value="due-asc">Due: earliest</option>
            <option value="due-desc">Due: latest</option>
            <option value="priority-desc">Priority: high → low</option>
            <option value="priority-asc">Priority: low → high</option>
          </select>
        </div>
      </div>

      {/* status tabs */}
      <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800">
        {STATUS_TABS.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`pb-2 text-sm font-medium capitalize transition-colors cursor-pointer border-b-2 -mb-px ${
              statusFilter === s
                ? 'border-orange-500 text-zinc-900 dark:text-zinc-100'
                : 'border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400'
            }`}
          >
            {s}
            <span className="ml-1.5 text-xs text-zinc-400 dark:text-zinc-500">
              {tabCounts[s]}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {['All', ...categories].map((cat, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === cat ? cls.pillOn : cls.pillOff
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}