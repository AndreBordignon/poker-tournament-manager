'use client';

import { useEffect, useRef } from 'react';
import { useTournamentStore } from '@/store/tournament-store';

// Função melhorada para tocar som de alerta
const playAlertSound = (type: 'warning' | 'critical') => {
  try {
    // Usando Web Audio API para criar um beep
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Resume o contexto se estiver suspenso (política de navegador)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    const playBeep = (frequency: number, duration: number, volume: number, delay: number = 0) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine'; // Onda senoidal para som mais suave
        
        // Envelope ADSR para evitar clicks
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + duration - 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
        
        console.log(`🔊 Beep tocado: ${frequency}Hz, ${volume} volume`);
      }, delay);
    };
    
    if (type === 'warning') {
      // 5 minutos: beep duplo médio
      console.log('🔔 Tocando alerta de 5 minutos');
      playBeep(440, 0.3, 0.8, 0);
      playBeep(440, 0.3, 0.8, 400);
    } else {
      // 1 minuto: beep triplo agudo e forte
      console.log('🚨 Tocando alerta de 1 minuto');
      playBeep(880, 0.25, 1.0, 0);
      playBeep(880, 0.25, 1.0, 350);
      playBeep(880, 0.25, 1.0, 700);
    }
  } catch (error) {
    console.error('❌ Erro ao tocar som:', error);
    
    // Fallback: tentar com beep do sistema
    try {
      const beep = new Audio('data:audio/wav;base64,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');
      beep.volume = type === 'critical' ? 1.0 : 0.8;
      beep.play().catch(e => console.error('Fallback beep failed:', e));
    } catch (fallbackError) {
      console.error('❌ Fallback também falhou:', fallbackError);
    }
  }
};

export function useTournamentTimer() {
  const { isRunning, isPaused, tick, timeRemaining } = useTournamentStore();
  
  // Refs para controlar se já tocou o som (evitar tocar múltiplas vezes)
  const fiveMinAlertPlayed = useRef(false);
  const oneMinAlertPlayed = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Inicializa AudioContext na primeira interação do usuário
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        try {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          console.log('✅ AudioContext inicializado');
        } catch (error) {
          console.error('❌ Erro ao inicializar AudioContext:', error);
        }
      }
    };

    // Tenta inicializar no primeiro click/touch
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
  }, []);

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