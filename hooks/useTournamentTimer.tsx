'use client';

import { useEffect } from 'react';
import { useTournamentStore } from '@/store/tournament-store';

export function useTournamentTimer() {
  const { isRunning, isPaused, tick } = useTournamentStore();

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, tick]);

  return useTournamentStore();
}
