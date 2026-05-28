'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

export function PomodoroWidget() {
  const [seconds, setSeconds] = useState(WORK_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            setIsRunning(false);
            setIsBreak((b) => !b);
            return isBreak ? WORK_MINUTES * 60 : BREAK_MINUTES * 60;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isBreak]);

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setSeconds(WORK_MINUTES * 60);
  };

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <div className="bg-primary rounded-xl p-6 flex flex-col h-full">
      {/* Header */}
      <p className="text-xs font-mono tracking-widest text-[#accfb3] uppercase mb-4">
        {isBreak ? 'Break Time' : 'Deep Work Focus'}
      </p>

      {/* Timer display */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <span className="font-mono text-6xl font-bold text-primary-foreground tracking-tight">
          {mins}:{secs}
        </span>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#accfb3] hover:text-primary-foreground hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsRunning((r) => !r)}
            className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-primary hover:bg-secondary-fixed transition-all shadow-lg shadow-secondary/20"
          >
            {isRunning
              ? <Pause className="w-6 h-6" />
              : <Play className="w-6 h-6 translate-x-0.5" />
            }
          </button>
        </div>
      </div>

      {/* Current task indicator */}
      <div className="mt-4 rounded-lg bg-white/5 px-4 py-3 flex items-center gap-2">
        <span className={cn('w-2 h-2 rounded-full shrink-0', isRunning ? 'bg-secondary animate-pulse' : 'bg-[#accfb3]')} />
        <div>
          <p className="text-[10px] font-mono text-[#accfb3] uppercase tracking-widest">Current Priority</p>
          <p className="text-sm text-primary-foreground font-medium truncate">Finalize Q4 Strategy Deck</p>
        </div>
      </div>
    </div>
  );
}
