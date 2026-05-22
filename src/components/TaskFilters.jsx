import { Search } from 'lucide-react';

const styles = {
  search: 'w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500',
  sort: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer min-w-[180px]',
  pillActive: 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900',
  pill: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700',
};

export default function TaskFilters({
  searchQuery, setSearchQuery,
  statusFilter, setStatusFilter,
  selectedCategory, setSelectedCategory,
  categories, sortBy, setSortBy, tasks,
}) {
  const counts = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <label htmlFor="search-tasks" className="sr-only">Search tasks</label>
          <input
            id="search-tasks"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className={styles.search}
          />
        </div>

        <label htmlFor="sort-tasks" className="sr-only">Sort tasks</label>
        <select
          id="sort-tasks"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.sort}
        >
          <option value="created-desc">Newest first</option>
          <option value="created-asc">Oldest first</option>
          <option value="due-asc">Due: earliest</option>
          <option value="due-desc">Due: latest</option>
          <option value="priority-desc">Priority: high → low</option>
          <option value="priority-asc">Priority: low → high</option>
        </select>
      </div>

      <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800">
        {['all', 'active', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`pb-2 text-sm font-medium capitalize transition-colors cursor-pointer border-b-2 -mb-px ${
              statusFilter === status
                ? 'border-orange-500 text-zinc-900 dark:text-zinc-100'
                : 'border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400'
            }`}
          >
            {status}
            <span className="ml-1.5 text-xs text-zinc-400 dark:text-zinc-500">{counts[status]}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === cat ? styles.pillActive : styles.pill
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
