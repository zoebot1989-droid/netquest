export interface SubscriptionState {
  tier: 'free' | 'pro';
  expiresAt: string | null; // ISO date for pro expiry
}

const STORAGE_KEY = 'netquest-subscription';

const DEFAULT_SUB: SubscriptionState = {
  tier: 'free',
  expiresAt: null,
};

export function loadSubscription(): SubscriptionState {
  if (typeof window === 'undefined') return { ...DEFAULT_SUB };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SUB };
    const sub: SubscriptionState = { ...DEFAULT_SUB, ...JSON.parse(raw) };
    // Check expiry
    if (sub.tier === 'pro' && sub.expiresAt) {
      if (new Date(sub.expiresAt) < new Date()) {
        sub.tier = 'free';
        sub.expiresAt = null;
        saveSubscription(sub);
      }
    }
    return sub;
  } catch {
    return { ...DEFAULT_SUB };
  }
}

export function saveSubscription(sub: SubscriptionState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sub));
}

export function startFreeTrial(): SubscriptionState {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const sub: SubscriptionState = { tier: 'pro', expiresAt };
  saveSubscription(sub);
  return sub;
}

export function setPro(months: number = 1): SubscriptionState {
  const expiresAt = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString();
  const sub: SubscriptionState = { tier: 'pro', expiresAt };
  saveSubscription(sub);
  return sub;
}

export function setFree(): SubscriptionState {
  const sub: SubscriptionState = { tier: 'free', expiresAt: null };
  saveSubscription(sub);
  return sub;
}

export function isPro(): boolean {
  return loadSubscription().tier === 'pro';
}

/**
 * Check if a chapter is accessible based on subscription tier.
 * Free users get first 2 chapters of every path.
 */
export function isChapterLocked(chapterIndex: number, tier: 'free' | 'pro'): boolean {
  if (tier === 'pro') return false;
  return chapterIndex >= 2; // 0-indexed: chapters 0,1 are free
}

/** Subscription-aware life config */
export function getLifeConfig(tier: 'free' | 'pro') {
  if (tier === 'pro') {
    return { maxLives: 10, regenMs: 15 * 60 * 1000 }; // 15 min
  }
  return { maxLives: 3, regenMs: 60 * 60 * 1000 }; // 1 hr
}
