import alarmUrl from '@/assets/sounds/order_alarm.wav';

/**
 * Looping alarm sound for the browser / in-app.
 *
 * Browsers block sound until the user has interacted with the page, so we
 * "unlock" the audio element on the first tap/click/key press after load.
 */

const MAX_RING_MS = 2 * 60 * 1000;

let audio: HTMLAudioElement | null = null;
let unlocked = false;
let stopTimer: ReturnType<typeof setTimeout> | null = null;
let vibrateTimer: ReturnType<typeof setInterval> | null = null;

const getAudio = () => {
  if (!audio) {
    audio = new Audio(alarmUrl);
    audio.loop = true;
    audio.preload = 'auto';
  }
  return audio;
};

/** Call once at app start; unlocks audio on the first user gesture. */
export const setupAlarmUnlock = () => {
  if (unlocked || typeof window === 'undefined') return;
  const unlock = () => {
    const a = getAudio();
    a.muted = true;
    a.play()
      .then(() => {
        a.pause();
        a.currentTime = 0;
        a.muted = false;
        unlocked = true;
        events.forEach((e) => window.removeEventListener(e, unlock, true));
      })
      .catch(() => {
        a.muted = false; // try again on the next gesture
      });
  };
  const events = ['pointerdown', 'keydown', 'touchstart'];
  events.forEach((e) => window.addEventListener(e, unlock, true));
};

export const isAlarmPlaying = () => !!audio && !audio.paused;

export const startAlarm = () => {
  const a = getAudio();
  a.currentTime = 0;
  a.play().catch((err) => {
    // Blocked: the user has not tapped the page yet. The banner still shows.
    console.warn('Alarm sound blocked by browser until the page is tapped', err);
  });

  // Vibrate on phones that support it (Android Chrome).
  if (navigator.vibrate) {
    navigator.vibrate([800, 400, 800]);
    if (vibrateTimer) clearInterval(vibrateTimer);
    vibrateTimer = setInterval(() => navigator.vibrate?.([800, 400, 800]), 2400);
  }

  if (stopTimer) clearTimeout(stopTimer);
  stopTimer = setTimeout(stopAlarm, MAX_RING_MS);
};

export const stopAlarm = () => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  if (stopTimer) clearTimeout(stopTimer);
  if (vibrateTimer) clearInterval(vibrateTimer);
  stopTimer = null;
  vibrateTimer = null;
  navigator.vibrate?.(0);
};
