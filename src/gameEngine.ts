/**
 * Game Engine — state machine for FEED
 *
 * NO safety nets. Deaths happen. The game is meant to be hard.
 * Radio/conspiracy content unlocks through exploration, not safety.
 *
 * Number-metric deltas are SCALED by stage:
 *   Cards author money:1 → engine applies money:+800 (stage1) / +5000 (stage2) / +40000 (stage3)
 */

import {
  CARDS,
  type Metrics, type Flag, type Card, type CardChoice, type FeedMessage,
} from './gameData';
import { shuffleArray } from './balancer';
import {
  INIT_METRICS, clampMetrics, BAR_MIN, BAR_MAX,
  scaleDelta, getNumberDeath,
} from './types/metrics';

// ─── Types ───────────────────────────────────────────────────────────────────

export type GamePhase = 'start' | 'playing' | 'result' | 'ending' | 'journal';

export type GameState = {
  phase: GamePhase;
  metrics: Metrics;
  flags: Flag[];
  perks: string[];
  stage: 1 | 2 | 3;
  cardIndex: number;
  usedCards: string[];
  pendingEnding: string | null;
  resultText: string;
  resultDelta: Partial<Metrics>;  // SCALED delta for display
  hoverDir: 'left' | 'right' | null;
  cardKey: number;
  newPerk: string | null;
  seenCharacters: string[];
  cardCount: number;
  radioSignal: number;
  conspiracyLevel: number;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const STAGE_THRESHOLDS = [10, 25] as const;
const CARD_RECYCLE_KEEP = 6;
const SAVE_KEY = 'feed_game_save';

// ─── Pure helpers ────────────────────────────────────────────────────────────

export function clamp(v: number): number {
  return Math.max(BAR_MIN, Math.min(BAR_MAX, v));
}

/**
 * Apply delta with number-metric scaling.
 * Returns both the new metrics AND the scaled delta (for UI display).
 */
export function applyDelta(
  m: Metrics,
  rawDelta: Partial<Metrics>,
  stage: 1 | 2 | 3,
): { metrics: Metrics; scaledDelta: Partial<Metrics> } {
  const scaled = scaleDelta(rawDelta, stage);
  return {
    scaledDelta: scaled,
    metrics: clampMetrics({
      reach: m.reach + (scaled.reach ?? 0),
      soul: m.soul + (scaled.soul ?? 0),
      energy: m.energy + (scaled.energy ?? 0),
      followers: m.followers + (scaled.followers ?? 0),
      money: m.money + (scaled.money ?? 0),
      likes: m.likes + (scaled.likes ?? 0),
      dislikes: m.dislikes + (scaled.dislikes ?? 0),
      hype: m.hype + (scaled.hype ?? 0),
    }),
  };
}

export function stageForCount(count: number): 1 | 2 | 3 {
  if (count < STAGE_THRESHOLDS[0]) return 1;
  if (count < STAGE_THRESHOLDS[1]) return 2;
  return 3;
}

export function getDeathEnding(m: Metrics): string | null {
  // Bar metrics die at 0
  if (m.reach <= BAR_MIN) return 'banned';
  if (m.soul <= BAR_MIN) return 'bot';
  if (m.energy <= BAR_MIN) return 'burnout';
  // Number metrics die at realistic thresholds
  const numDeath = getNumberDeath(m);
  if (numDeath) return numDeath;
  return null;
}

export function checkVictoryEnding(_m: Metrics, flags: Flag[], _cardCount: number): string | null {
  if (flags.includes('trigger_balance_ending')) return 'balance';
  if (flags.includes('trigger_radio_ending')) return 'truth_frequency';
  return null;
}

// ─── Card selection — NO SAFETY NETS ─────────────────────────────────────────

export function pickCard(state: GameState): Card | null {
  const { flags, usedCards, stage, metrics } = state;
  const flagSet = new Set(flags);
  const usedSet = new Set(usedCards);

  const metricsMatch = (card: Card) => {
    if (card.minMetrics) {
      for (const [k, v] of Object.entries(card.minMetrics)) {
        if (metrics[k as keyof Metrics] < v) return false;
      }
    }
    if (card.maxMetrics) {
      for (const [k, v] of Object.entries(card.maxMetrics)) {
        if (metrics[k as keyof Metrics] > v) return false;
      }
    }
    return true;
  };

  const flagsMatch = (card: Card) => {
    if (card.requiredFlags && !card.requiredFlags.every(f => flagSet.has(f))) return false;
    if (card.forbiddenFlags && card.forbiddenFlags.some(f => flagSet.has(f))) return false;
    return true;
  };

  // 1. Story cards first (never recycled) — sorted by priority
  const storyCards = CARDS.filter(
    c => c.isStory && c.stage <= stage && !usedSet.has(c.id) && flagsMatch(c) && metricsMatch(c)
  );
  if (storyCards.length > 0) {
    storyCards.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    return storyCards[0];
  }

  // 2. Regular cards not yet used — RANDOM selection, no bias
  let eligible = CARDS.filter(
    c => !c.isStory && c.stage <= stage && !usedSet.has(c.id) && flagsMatch(c) && metricsMatch(c)
  );

  // 3. If pool exhausted, recycle (skip last N used)
  if (eligible.length === 0) {
    const recentCards = new Set(usedCards.slice(-CARD_RECYCLE_KEEP));
    eligible = CARDS.filter(
      c => !c.isStory && !c.isEnding && c.stage <= stage &&
        !recentCards.has(c.id) && flagsMatch(c) && metricsMatch(c)
    );
  }

  if (eligible.length === 0) return null;

  // 4. Drama king perk: more hater cards
  const perks = state.perks;
  if (perks.includes('drama_king')) {
    const haterCards = eligible.filter(c => c.characterName === 'Хейтер' || c.characterName === 'Скандал');
    if (haterCards.length > 0 && state.cardCount % 3 === 0) {
      return haterCards[0];
    }
  }

  // 5. Simple shuffled selection — high priority cards float up, rest random
  eligible.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  // Pick from top 5 candidates, rotating by card count for variety
  const topCount = Math.min(5, eligible.length);
  const topCards = eligible.slice(0, topCount);
  // Shuffle top cards for variety
  const shuffled = shuffleArray(topCards, state.cardCount * 7 + 13);
  return shuffled[0];
}

// ─── State factory ───────────────────────────────────────────────────────────

export function createInitState(): GameState {
  return {
    phase: 'start',
    metrics: { ...INIT_METRICS },
    flags: [],
    perks: [],
    stage: 1,
    cardIndex: 0,
    usedCards: [],
    pendingEnding: null,
    resultText: '',
    resultDelta: {},
    hoverDir: null,
    cardKey: 0,
    newPerk: null,
    seenCharacters: [],
    cardCount: 0,
    radioSignal: 0,
    conspiracyLevel: 0,
  };
}

// ─── Save/Load ───────────────────────────────────────────────────────────────

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed.metrics || typeof parsed.cardCount !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}

// ─── Process choice — pure state transition ──────────────────────────────────

export type ChoiceResult = {
  nextState: GameState;
  endingId: string | null;
  isDeath: boolean;
  isVictory: boolean;
  grantedPerk: string | null;
  lostPerk: string | null;
  radioEvent: 'static' | 'signal' | 'decoded' | 'conspiracy' | 'frequency' | 'bunker' | null;
  metricChanges: { up: boolean; down: boolean };
};

export function processChoice(
  state: GameState,
  choice: CardChoice,
  currentCardId: string | null,
  currentCharName: string | null,
): ChoiceResult {
  const currentStage = stageForCount(state.cardCount);

  // Apply delta with scaling
  const { metrics: newMetrics, scaledDelta } = applyDelta(state.metrics, choice.delta, currentStage);
  const newCardCount = state.cardCount + 1;

  // Flags
  const newFlags = [...state.flags];
  if (choice.setFlags) {
    for (const f of choice.setFlags) {
      if (!newFlags.includes(f)) newFlags.push(f);
    }
  }
  if (choice.clearFlags) {
    for (const f of choice.clearFlags) {
      const idx = newFlags.indexOf(f);
      if (idx >= 0) newFlags.splice(idx, 1);
    }
  }

  // Perks
  const newPerks = [...state.perks];
  let grantedPerk: string | null = null;
  let lostPerk: string | null = null;
  if (choice.grantPerk && !newPerks.includes(choice.grantPerk)) {
    newPerks.push(choice.grantPerk);
    grantedPerk = choice.grantPerk;
  }
  if (choice.clearPerk) {
    const idx = newPerks.indexOf(choice.clearPerk);
    if (idx >= 0) {
      newPerks.splice(idx, 1);
      lostPerk = choice.clearPerk;
    }
  }

  // Perk effects (apply AFTER main delta)
  if (newPerks.includes('machine') && newCardCount % 5 === 0) {
    newMetrics.energy = clamp(newMetrics.energy + 1);
  }
  if (newPerks.includes('paranoid') && newCardCount % 3 === 0) {
    newMetrics.energy = clamp(newMetrics.energy - 1);
  }
  if (newPerks.includes('shadow_banned')) {
    if ((scaledDelta.reach ?? 0) > 0) {
      const halved = Math.floor((scaledDelta.reach ?? 0) / 2);
      newMetrics.reach = clamp(state.metrics.reach + halved);
    }
  }
  if (newPerks.includes('algo_slave') && currentCharName === 'Алгоритм (А.)') {
    newMetrics.soul = clamp(newMetrics.soul - 1);
  }

  // Seen characters
  const seenChars = [...state.seenCharacters];
  if (currentCharName && !seenChars.includes(currentCharName)) {
    seenChars.push(currentCharName);
  }

  // Used cards
  const usedCards = [...state.usedCards];
  if (currentCardId) usedCards.push(currentCardId);

  const newStage = stageForCount(newCardCount);

  // Radio/Conspiracy tracking
  let newRadioSignal = state.radioSignal;
  if (newFlags.includes('radio_freq_1')) newRadioSignal = Math.max(newRadioSignal, 1);
  if (newFlags.includes('radio_freq_2')) newRadioSignal = Math.max(newRadioSignal, 2);
  if (newFlags.includes('radio_freq_3')) newRadioSignal = 3;

  let newConspiracyLevel = state.conspiracyLevel;
  if (newFlags.includes('conspiracy_aware')) newConspiracyLevel = Math.max(newConspiracyLevel, 1);
  if (newFlags.includes('conspiracy_deep')) newConspiracyLevel = Math.max(newConspiracyLevel, 2);
  if (newFlags.includes('conspiracy_full')) newConspiracyLevel = 3;

  // Radio sound events
  let radioEvent: ChoiceResult['radioEvent'] = null;
  if (choice.setFlags) {
    if (choice.setFlags.includes('radio_found')) radioEvent = 'static';
    else if (choice.setFlags.includes('radio_freq_1') || choice.setFlags.includes('radio_freq_2') || choice.setFlags.includes('radio_freq_3')) radioEvent = 'signal';
    else if (choice.setFlags.includes('radio_decoded')) radioEvent = 'decoded';
    else if (choice.setFlags.includes('conspiracy_full')) radioEvent = 'conspiracy';
    else if (choice.setFlags.includes('frequency_master')) radioEvent = 'frequency';
    else if (choice.setFlags.includes('signal_traced')) radioEvent = 'bunker';
  }

  // Metric changes for sound
  const metricChanges = {
    up: Object.values(scaledDelta).some(v => (v ?? 0) > 0),
    down: Object.values(scaledDelta).some(v => (v ?? 0) < 0),
  };

  // Check endings — NO protection, deaths happen
  let endingId = choice.endingId ?? null;
  if (!endingId) endingId = getDeathEnding(newMetrics);
  if (!endingId) endingId = checkVictoryEnding(newMetrics, newFlags, newCardCount);

  const isDeath = endingId != null && ['banned', 'bot', 'sold', 'burnout'].includes(endingId);
  const isVictory = endingId != null && !isDeath;

  const nextState: GameState = {
    ...state,
    metrics: newMetrics,
    flags: newFlags,
    perks: newPerks,
    usedCards,
    seenCharacters: seenChars,
    cardCount: newCardCount,
    stage: newStage,
    resultText: choice.text,
    resultDelta: scaledDelta,  // SCALED delta for display
    phase: 'result',
    pendingEnding: endingId,
    hoverDir: null,
    cardKey: state.cardKey + 1,
    newPerk: grantedPerk,
    radioSignal: newRadioSignal,
    conspiracyLevel: newConspiracyLevel,
  };

  return {
    nextState,
    endingId,
    isDeath,
    isVictory,
    grantedPerk,
    lostPerk,
    radioEvent,
    metricChanges,
  };
}

// ─── Re-exports ──────────────────────────────────────────────────────────────
export { CARDS, ENDINGS, PERKS, CARDS as AllCards, FEED_MESSAGES } from './gameData';
export type { Metrics, Flag, Card, CardChoice, FeedMessage };
export { JOURNAL } from './gameData';
