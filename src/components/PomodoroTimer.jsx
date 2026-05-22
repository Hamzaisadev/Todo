import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

const DURATIONS = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

const MODE_LABELS = {
  work: 'Focus',
  break: 'Break',
  longBreak: 'Long Break',
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const playBeep = () => {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      [0, 0.3, 0.6].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 660;
        gain.gain.setValueAtTime(0.06, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.2);
      });
    } catch {
      /* audio not available */
    }
  };

  // tick down every second while running
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  // when the timer reaches zero, advance to the next mode
  // (setState here is intentional — reacting to an async interval, not a synchronous derivation)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (timeLeft > 0 || !isRunning) return;

    playBeep();

    if (mode === 'work') {
      const nextSession = sessions + 1;
      setSessions(nextSession);
      switchMode(nextSession % 4 === 0 ? 'longBreak' : 'break');
    } else {
      switchMode('work');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  const progress = DURATIONS[mode] > 0
    ? ((DURATIONS[mode] - timeLeft) / DURATIONS[mode]) * 100
    : 0;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-900">
      <div className="flex gap-1 mb-5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
        {Object.keys(DURATIONS).map((key) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              mode === key
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            {MODE_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="text-center mb-5">
        <p className="font-mono text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 tabular-nums">
          {minutes}:{seconds}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
          Session {sessions + 1} · {MODE_LABELS[mode]}
        </p>
      </div>

      <div className="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            mode === 'work' ? 'bg-orange-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-2 justify-center">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            isRunning
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>

        <button
          onClick={reset}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {isRunning && (
          <button
            onClick={() => setTimeLeft(0)}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Skip to next"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
