import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import PomodoroTimer from './components/PomodoroTimer';
import StatsDashboard from './components/StatsDashboard';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';

const DEFAULT_CATEGORIES = ['Personal', 'Work', 'Shopping', 'Health'];
const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function getInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [tasks, setTasks] = useState(() => loadFromStorage('tasks', []));
  const [categories, setCategories] = useState(() => loadFromStorage('categories', DEFAULT_CATEGORIES));
  const [theme, setTheme] = useState(getInitialTheme);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('created-desc');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addTask = (data) => {
    const task = {
      id: crypto.randomUUID(),
      ...data,
      completed: false,
      createdDate: new Date().toISOString(),
    };
    setTasks(prev => [task, ...prev]);

    if (data.category && !categories.includes(data.category)) {
      setCategories(prev => [...prev, data.category]);
    }
  };

  const toggleComplete = (id) => {
    setTasks(prev =>
      prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task)
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTask = (id, fields) => {
    setTasks(prev =>
      prev.map(task => task.id === id ? { ...task, ...fields } : task)
    );
    if (fields.category && !categories.includes(fields.category)) {
      setCategories(prev => [...prev, fields.category]);
    }
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => !task.completed));
  };

  const query = searchQuery.toLowerCase();

  const visibleTasks = tasks
    .filter(task => {
      if (query) {
        const inTitle = task.title.toLowerCase().includes(query);
        const inDesc = task.description?.toLowerCase().includes(query);
        if (!inTitle && !inDesc) return false;
      }
      if (statusFilter === 'active' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;
      if (selectedCategory !== 'All' && task.category !== selectedCategory) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created-asc':
          return new Date(a.createdDate) - new Date(b.createdDate);
        case 'due-asc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'due-desc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        case 'priority-desc':
          return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
        case 'priority-asc':
          return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
        default:
          return new Date(b.createdDate) - new Date(a.createdDate);
      }
    });

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">My Tasks</h1>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              {tasks.length} total · {completedCount} done
            </p>
          </div>
          <ThemeToggle theme={theme} toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} />
        </header>

        <section className="mb-8">
          <StatsDashboard tasks={tasks} />
        </section>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar: Timer & Task Form */}
          <aside className="lg:col-span-5 flex flex-col gap-6 w-full">
            <PomodoroTimer />
            <TaskForm onAddTask={addTask} categories={categories} />
          </aside>

          {/* Main Content: Filters & Task List */}
          <main className="lg:col-span-7 flex flex-col gap-6 w-full">
            <TaskFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              sortBy={sortBy}
              setSortBy={setSortBy}
              tasks={tasks}
            />

            <TaskList
              tasks={visibleTasks}
              onToggleComplete={toggleComplete}
              onDelete={deleteTask}
              onUpdate={updateTask}
              categories={categories}
            />

            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="self-center flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-500 transition-colors cursor-pointer mt-2"
              >
                <Trash2 className="w-3 h-3" />
                Clear {completedCount} completed
              </button>
            )}
          </main>
        </div>

        <footer className="mt-16 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            crafted by Hamza ☕
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1 italic">
            "First, solve the problem. Then, write the code."
          </p>
        </footer>
      </div>
    </div>
  );
}
