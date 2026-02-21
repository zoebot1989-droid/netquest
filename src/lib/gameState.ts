export interface GameState {
  level: number;
  xp: number;
  completedMissions: string[];
  achievements: string[];
  streak: number;
  lives: number;
  maxLives: number;
  lastPlayed: string;
  lastLifeRegen: number;
}

const DEFAULT_STATE: GameState = {
  level: 1,
  xp: 0,
  completedMissions: [],
  achievements: [],
  streak: 0,
  lives: 5,
  maxLives: 5,
  lastPlayed: '',
  lastLifeRegen: Date.now(),
};

const STORAGE_KEY = 'netquest-state';
const LIFE_REGEN_MS = 30 * 60 * 1000; // 30 min per life

export const LEVELS = [
  { name: 'Noob', minXP: 0 },
  { name: 'Script Kiddie', minXP: 100 },
  { name: 'Jr. Admin', minXP: 300 },
  { name: 'Sysadmin', minXP: 600 },
  { name: 'Network Engineer', minXP: 1000 },
  { name: 'Architect', minXP: 1500 },
];

export function getLevelInfo(xp: number) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }
  return { current, next, levelIndex: LEVELS.indexOf(current) + 1 };
}

export function loadState(): GameState {
  if (typeof window === 'undefined') return { ...DEFAULT_STATE };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const state = { ...DEFAULT_STATE, ...JSON.parse(raw) };
    // Regen lives
    const now = Date.now();
    if (state.lives < state.maxLives) {
      const elapsed = now - state.lastLifeRegen;
      const regened = Math.floor(elapsed / LIFE_REGEN_MS);
      if (regened > 0) {
        state.lives = Math.min(state.maxLives, state.lives + regened);
        state.lastLifeRegen = now;
      }
    }
    // Streak
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (state.lastPlayed !== today && state.lastPlayed !== yesterday) {
      state.streak = 0;
    }
    return state;
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state: GameState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function completeMission(missionId: string, xpReward: number): GameState {
  const state = loadState();
  if (state.completedMissions.includes(missionId)) return state;
  state.completedMissions.push(missionId);
  state.xp += xpReward;
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastPlayed !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    state.streak = state.lastPlayed === yesterday ? state.streak + 1 : 1;
  }
  state.lastPlayed = today;
  const { levelIndex } = getLevelInfo(state.xp);
  state.level = levelIndex;
  saveState(state);
  return state;
}

export function loseLife(): GameState {
  const state = loadState();
  if (state.lives > 0) state.lives--;
  saveState(state);
  return state;
}

export function addAchievement(id: string): GameState {
  const state = loadState();
  if (!state.achievements.includes(id)) {
    state.achievements.push(id);
    saveState(state);
  }
  return state;
}
