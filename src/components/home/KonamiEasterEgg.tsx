'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KonamiEasterEgg() {
  const router = useRouter();

  useEffect(() => {
    // Secret pattern: B, A, B, A, SELECT, START (inspired by Konami code)
    const secretPattern = ['B', 'A', 'B', 'A', 'SELECT', 'START'];
    let currentPattern: string[] = [];
    let lastPressTime = 0;
    const timeout = 6000; // Reset pattern after 6 seconds of inactivity

    // Visual feedback
    function flashButton(button: Element) {
      button.classList.add('pressed');
      setTimeout(() => button.classList.remove('pressed'), 200);
    }

    // Success animation
    function triggerSuccess() {
      const dock = document.getElementById('controllerDock');
      if (dock) {
        dock.classList.add('success-glow');
      }

      // Play a success sound if you want
      console.log('🎮 SECRET UNLOCKED! Redirecting to admin...');

      setTimeout(() => {
        router.push('/admin/login');
      }, 1000);
    }

    // Button click handler
    function handleButtonClick(e: Event) {
      e.preventDefault();
      
      const button = e.currentTarget as HTMLElement;
      const buttonValue = button.dataset.button;
      if (!buttonValue) return;
      
      const currentTime = Date.now();

      // Flash visual feedback
      flashButton(button);

      // Reset pattern if too much time passed
      if (currentTime - lastPressTime > timeout) {
        currentPattern = [];
      }

      lastPressTime = currentTime;
      currentPattern.push(buttonValue);

      // Check if pattern matches
      if (currentPattern.length === secretPattern.length) {
        if (JSON.stringify(currentPattern) === JSON.stringify(secretPattern)) {
          triggerSuccess();
        }
        // Reset after checking
        currentPattern = [];
      } else if (currentPattern.length > secretPattern.length) {
        // Too many inputs, reset
        currentPattern = [buttonValue];
      }

      // Debug log (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('Pattern progress:', currentPattern.join(' → '));
      }
    }

    // Initialize after a short delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      const buttons = document.querySelectorAll('.nes-button');
      
      buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
      });
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(initTimeout);
      const buttons = document.querySelectorAll('.nes-button');
      buttons.forEach(button => {
        button.removeEventListener('click', handleButtonClick);
      });
    };
  }, [router]);

  return null; // This component doesn't render anything
}
