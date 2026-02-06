'use client';

import { useState } from 'react';
import ModeSelection from '@/components/ChangeMode';
import TournamentSetup from '@/components/TournamentSetup';
import TimerDisplay from '@/components/TimerDisplay';
import CashGameDisplay from '@/components/CashgameDisplay';
import { useTournamentStore } from '@/store/tournament-store';

type AppState = 'mode-selection' | 'tournament-setup' | 'game';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('mode-selection');
  const { gameMode } = useTournamentStore();

  const handleBackToMenu = () => {
    setAppState('mode-selection');
  };

  const handleTournamentSetup = () => {
    setAppState('tournament-setup');
  };

  const handleSetupComplete = () => {
    setAppState('game');
  };

  const handleCashGameStart = () => {
    setAppState('game');
  };

  if (appState === 'mode-selection') {
    return (
      <ModeSelection 
        onModeSelected={handleCashGameStart}
        onTournamentSetup={handleTournamentSetup}
      />
    );
  }

  if (appState === 'tournament-setup') {
    return (
      <TournamentSetup 
        onComplete={handleSetupComplete}
        onBack={handleBackToMenu}
      />
    );
  }

  if (gameMode === 'cashgame') {
    return <CashGameDisplay onBackToMenu={handleBackToMenu} />;
  }

  return <TimerDisplay onBackToMenu={handleBackToMenu} />;
}