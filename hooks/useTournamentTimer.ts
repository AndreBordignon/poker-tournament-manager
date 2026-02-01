'use client';

import { useEffect, useRef } from 'react';
import { useTournamentStore } from '@/store/tournament-store';

// Função para tocar som de alerta
const playAlertSound = (type: 'warning' | 'critical') => {
  // Usando Web Audio API para criar um beep
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Configurações do som
  if (type === 'warning') {
    // 5 minutos: som mais suave (440Hz - nota A)
    oscillator.frequency.value = 440;
    gainNode.gain.value = 0.3;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  } else {
    // 1 minuto: som mais urgente (880Hz - nota A oitava acima)
    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.4;
    
    // Beep triplo para criar urgência
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15);
    
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 880;
      gain2.gain.value = 0.4;
      osc2.start();
      osc2.stop(audioContext.currentTime + 0.15);
    }, 200);
    
    setTimeout(() => {
      const osc3 = audioContext.createOscillator();
      const gain3 = audioContext.createGain();
      osc3.connect(gain3);
      gain3.connect(audioContext.destination);
      osc3.frequency.value = 880;
      gain3.gain.value = 0.4;
      osc3.start();
      osc3.stop(audioContext.currentTime + 0.15);
    }, 400);
  }
};

export function useTournamentTimer() {
  const { isRunning, isPaused, tick, timeRemaining } = useTournamentStore();
  
  // Refs para controlar se já tocou o som (evitar tocar múltiplas vezes)
  const fiveMinAlertPlayed = useRef(false);
  const oneMinAlertPlayed = useRef(false);

  // Effect para o timer
  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, tick]);

  // Effect para alertas sonoros
  useEffect(() => {
    if (!isRunning || isPaused) return;

    // Alerta de 5 minutos (300 segundos)
    if (timeRemaining === 300 && !fiveMinAlertPlayed.current) {
      playAlertSound('warning');
      fiveMinAlertPlayed.current = true;
      console.log('🔔 Alerta: 5 minutos restantes!');
    }

    // Alerta de 1 minuto (60 segundos)
    if (timeRemaining === 60 && !oneMinAlertPlayed.current) {
      playAlertSound('critical');
      oneMinAlertPlayed.current = true;
      console.log('🚨 Alerta CRÍTICO: 1 minuto restante!');
    }

    // Reset dos flags quando muda de nível ou tempo aumenta
    if (timeRemaining > 300) {
      fiveMinAlertPlayed.current = false;
      oneMinAlertPlayed.current = false;
    } else if (timeRemaining > 60) {
      oneMinAlertPlayed.current = false;
    }
  }, [timeRemaining, isRunning, isPaused]);

  return useTournamentStore();
}