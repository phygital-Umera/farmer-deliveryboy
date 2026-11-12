import { useEffect, useState } from 'react';
import scooterImg from '@/assets/splash-scooter.png';
import '@/assets/css/splash.css';
import { useT } from '@/i18n/LanguageContext';

type Phase = 'enter' | 'idle' | 'exit' | 'hiding' | 'done';

// Timings (ms) — total ≈ 3s
const ENTER_MS = 800;
const IDLE_MS = 1600;
const EXIT_MS = 600;
const FADE_MS = 350;

/**
 * Shown once when the app starts: the delivery scooter rides in, runs in
 * place for a moment, then rides off and the app appears underneath.
 */
const SplashScreen = () => {
  const [phase, setPhase] = useState<Phase>('enter');
  const t = useT();

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, p: Phase) => timers.push(setTimeout(() => setPhase(p), ms));

    if (reduced) {
      at(1200, 'hiding');
      at(1200 + FADE_MS, 'done');
    } else {
      at(ENTER_MS, 'idle');
      at(ENTER_MS + IDLE_MS, 'exit');
      at(ENTER_MS + IDLE_MS + EXIT_MS, 'hiding');
      at(ENTER_MS + IDLE_MS + EXIT_MS + FADE_MS, 'done');
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      className={`splash-root ${phase === 'hiding' ? 'is-hiding' : ''}`}
      data-phase={phase === 'hiding' ? 'exit' : phase}
      role="status"
      aria-label="Loading Farmer Delivery"
    >
      <div className="splash-stage">
        <div className="splash-rider">
          <div className="splash-bob">
            <img src={scooterImg} alt="" draggable={false} />
            <div className="splash-smoke" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <div className="splash-speed" aria-hidden>
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </div>
      <div className="splash-road" aria-hidden />
      <div className="splash-title">Farmer Delivery</div>
      <div className="splash-subtitle">
        {t('splash.subtitle')}<span className="splash-dots" />
      </div>
    </div>
  );
};

export default SplashScreen;
