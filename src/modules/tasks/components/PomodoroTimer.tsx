'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { recordPomodoroSession } from '../services/tasks.service';

const workSeconds = 25 * 60;
const breakSeconds = 5 * 60;

export function PomodoroTimer() {
  const [seconds, setSeconds] = useState(workSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((current) => {
        if (current > 1) {
          return current - 1;
        }

        recordPomodoroSession(null, mode, true).catch(() => undefined);
        const nextMode = mode === 'work' ? 'break' : 'work';
        setMode(nextMode);
        setIsRunning(false);
        return nextMode === 'work' ? workSeconds : breakSeconds;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const reset = () => {
    setIsRunning(false);
    setMode('work');
    setSeconds(workSeconds);
  };

  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remainingSeconds = String(seconds % 60).padStart(2, '0');

  return (
    <section className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#accfb3]">Pomodoro</p>
          <h2 className="mt-1 text-xl font-semibold">{mode === 'work' ? 'Deep work' : 'Recovery break'}</h2>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-mono">{mode === 'work' ? '25/5' : '5 min'}</span>
      </div>

      <div className="my-8 text-center font-mono text-6xl font-bold tracking-normal">
        {minutes}:{remainingSeconds}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#accfb3] transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Reset pomodoro"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setIsRunning((running) => !running)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary shadow-lg shadow-secondary/20 transition-colors hover:bg-secondary-fixed"
          aria-label={isRunning ? 'Pause pomodoro' : 'Start pomodoro'}
        >
          {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 translate-x-0.5" />}
        </button>
      </div>
    </section>
  );
}
