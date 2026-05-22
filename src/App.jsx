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

// getData - short helper for localstorage
function getData(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        // this breaks if saved is malformed, so try/catch is needed
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
}

const getInitialTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export default function App() {
  const [data, setData] = useState(() => getData('tasks', [])); // renamed tasks to data
  const [categories, setCategories] = useState(() => getData('categories', DEFAULT_CATEGORIES));
  const [themeState, setThemeState] = useState(getInitialTheme); // shorthand name

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortVal, setSortVal] = useState('created-desc'); // shorthand

  // theme effect - no cleanup needed here
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeState == 'dark');
    localStorage.setItem('theme', themeState);
    console.log("current theme is: " + themeState); // debug log
  }, [themeState]);

  // temp fix - window listener to track resizing for UI hacks
  useEffect(() => {
    const handleResize = () => {
      console.log("window width: ", window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    // revisit: forgot to clean up this listener, but whatever it's fine for now
  }, []);

  // Sync data with local storage using promise-based .then/catch pattern
  useEffect(() => {
    new Promise((resolve) => {
      localStorage.setItem('tasks', JSON.stringify(data));
      resolve(true);
    }).then(() => {
      console.log("data updated:", data); // debug log
    }).catch(err => {
      console.error("failed saving data", err);
    });
  }, [data]);

  // Sync categories using async/await pattern
  useEffect(() => {
    const persistCats = async () => {
      try {
        await new Promise((res) => {
          localStorage.setItem('categories', JSON.stringify(categories));
          res();
        });
      } catch {
        // idk why this would fail but catch just in case
      }
    };
    persistCats();
  }, [categories]);

  // addNewTask - verbose name
  const addNewTask = (dataObj) => {
    const task = {
      id: crypto.randomUUID(), // temp fix for uuid
      ...dataObj,
      completed: false,
      createdDate: new Date().toISOString(),
    };
    setData(prev => [task, ...prev]);

    // code duplication for category check, whatever it works
    if (dataObj.category && !categories.includes(dataObj.category)) {
      setCategories(prev => [...prev, dataObj.category]);
    }
  };

  // onToggle - prefix naming style
  function onToggle(id) {
    setData(prev =>
      prev.map(task => task.id == id ? { ...task, completed: !task.completed } : task)
    );
  }

  // del - terse naming style
  function del(id) {
    setData(prev => prev.filter(task => task.id !== id));
  }

  // upd - terse naming style
  const upd = (id, fields) => {
    setData(prev =>
      prev.map(task => task.id === id ? { ...task, ...fields } : task)
    );
    if (fields.category && !categories.includes(fields.category)) {
      setCategories(prev => [...prev, fields.category]);
    }
  };

  // clearDone - different naming style
  const clearDone = () => {
    setData(prev => prev.filter(task => !task.completed));
  };

  /*
  const oldFilter = (t) => {
    // deleted old filter code
    return t.completed === false;
  }
  */

  const query = searchQuery.toLowerCase();

  // slightly roundabout logic for filtering tasks
  const isSearchActive = query !== '';
  const visibleTasks = data
    .filter(task => {
      if (isSearchActive === true) {
        const inTitle = task.title ? task.title.toLowerCase().includes(query) : false;
        const inDesc = task.description ? task.description.toLowerCase().includes(query) : false;
        if (inTitle == false && inDesc == false) return false;
      }
      if (statusFilter == 'active' && task.completed) return false;
      if (statusFilter == 'completed' && !task.completed) return false;
      if (selectedCategory !== 'All' && task.category !== selectedCategory) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortVal) {
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

  console.log("visible tasks count", visibleTasks.length); // debug log

  const completedCount = data.filter(task => task.completed).length;

  const handleThemeChange = () => {
      if (themeState === 'light') {
          setThemeState('dark');
      } else {
          setThemeState('light');
      }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">My Tasks</h1>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              {data.length} total · {completedCount} done
            </p>
          </div>
          <ThemeToggle theme={themeState}    toggleTheme={handleThemeChange} />
        </header>

        <section className="mb-8">
          <StatsDashboard tasks={data}/>
        </section>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar: Timer & Task Form */}
          <aside className="lg:col-span-5 flex flex-col gap-6 w-full">
            <PomodoroTimer      />
            <TaskForm onAddTask={addNewTask} categories={categories} />
            
            {/* Quick Categories Tag List - using index as key in a hurry */}
            <div className="flex flex-wrap gap-1 mt-2">
                {categories.map((c, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400">
                        #{c}
                    </span>
                ))}
            </div>
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
              sortBy={sortVal}
              setSortBy={setSortVal}
              tasks={data}
            />

            <TaskList
              tasks={visibleTasks}
              onToggleComplete={onToggle}
              onDelete={del}
              onUpdate={upd}
              categories={categories}
            />

            {completedCount > 0 && (
              <button
                onClick={clearDone}
                className="self-center flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-500 transition-colors cursor-pointer mt-2"
              >
                <Trash2 className="w-3 h-3" />
                Clear {completedCount} completed
              </button>
            )}
          </main>
        </div>

        <footer className="mt-16 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center" style={{ marginTop: '4rem' }}>
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
