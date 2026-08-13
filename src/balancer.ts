/**
 * Deck Balancer — MINIMAL version.
 *
 * NO safety nets. NO relief cards. NO survival filter.
 * The game is meant to be DANGEROUS. Deaths are part of gameplay.
 *
 * The only guarantee: for the full deck, there EXISTS one specific
 * sequence of L/R choices that keeps all metrics in [1,9].
 * Finding that path is the PLAYER'S job.
 */

import { type Metrics, type Card } from './gameData';

export type MetricKey = keyof Metrics;
const METRIC_KEYS: MetricKey[] = ['reach', 'soul', 'money', 'energy'];

// ─── Simple shuffle with seed ────────────────────────────────────────────────

export function shuffleArray<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ─── Deck validation (for development) ──────────────────────────────────────

/**
 * Verify that a GREEDY player (always picks the choice that helps
 * the weakest metric) can survive N cards from the deck.
 */
export function validateDeckGreedy(cards: Card[], maxCards = 40): {
  survivable: boolean;
  survivedCards: number;
  finalMetrics: Metrics;
  deathMetric: MetricKey | null;
} {
  const metrics: Metrics = { reach: 5, soul: 5, money: 5, energy: 5, followers: 5, likes: 5, dislikes: 0, hype: 3 };

  for (let i = 0; i < Math.min(maxCards, cards.length); i++) {
    const card = cards[i];

    // Greedy: pick the choice that maximizes the minimum metric after applying
    const leftResult = applyRaw(metrics, card.leftChoice.delta);
    const rightResult = applyRaw(metrics, card.rightChoice.delta);

    const leftMin = Math.min(...METRIC_KEYS.map(k => leftResult[k]));
    const rightMin = Math.min(...METRIC_KEYS.map(k => rightResult[k]));

    const chosen = leftMin >= rightMin ? leftResult : rightResult;
    Object.assign(metrics, chosen);

    // Check death
    for (const k of METRIC_KEYS) {
      if (metrics[k] <= 0) {
        return { survivable: false, survivedCards: i + 1, finalMetrics: { ...metrics }, deathMetric: k };
      }
      if (metrics[k] >= 10) {
        // Cap at 10 but don't die from high metrics in this model
        metrics[k] = 10;
      }
    }
  }

  return { survivable: true, survivedCards: Math.min(maxCards, cards.length), finalMetrics: { ...metrics }, deathMetric: null };
}

function applyRaw(m: Metrics, delta: Partial<Metrics>): Metrics {
  return {
    reach: Math.max(0, Math.min(10, m.reach + (delta.reach ?? 0))),
    soul: Math.max(0, Math.min(10, m.soul + (delta.soul ?? 0))),
    money: Math.max(0, Math.min(10, m.money + (delta.money ?? 0))),
    energy: Math.max(0, Math.min(10, m.energy + (delta.energy ?? 0))),
    followers: Math.max(0, Math.min(10, m.followers + (delta.followers ?? 0))),
    likes: Math.max(0, Math.min(10, m.likes + (delta.likes ?? 0))),
    dislikes: Math.max(0, Math.min(10, m.dislikes + (delta.dislikes ?? 0))),
    hype: Math.max(0, Math.min(10, m.hype + (delta.hype ?? 0))),
  };
}
