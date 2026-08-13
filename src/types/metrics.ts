/**
 * Metric system for FEED
 * 
 * Two types of metrics:
 * - BAR (0-10 scale): reach, soul, energy — displayed as bars
 * - NUMBER (unlimited): followers, money, likes, dislikes, hype — displayed as full formatted integers
 */

import type { Metrics } from '../gameData';

// Bar metrics — 0-10 scale, shown as progress bars
export const BAR_METRICS = ['reach', 'soul', 'energy'] as const;
export type BarMetric = typeof BAR_METRICS[number];

// Number metrics — unlimited, shown as formatted integers
export const NUMBER_METRICS = ['followers', 'money', 'likes', 'dislikes', 'hype'] as const;
export type NumberMetric = typeof NUMBER_METRICS[number];

// All metrics
export const ALL_METRICS = [...BAR_METRICS, ...NUMBER_METRICS] as const;
export type AnyMetric = typeof ALL_METRICS[number];

// Is this a bar metric?
export function isBarMetric(m: string): m is BarMetric {
  return (BAR_METRICS as readonly string[]).includes(m);
}

// Format a number metric for display (full number, no abbreviation)
export function formatNumber(n: number, currency = false): string {
  const formatted = Math.floor(n).toLocaleString('ru-RU');
  return currency ? `${formatted} ₽` : formatted;
}

// Get emoji for a metric
export const METRIC_EMOJI: Record<AnyMetric, string> = {
  reach: '📡',
  soul: '🫀',
  energy: '⚡',
  followers: '👥',
  money: '💰',
  likes: '❤️',
  dislikes: '💔',
  hype: '🔥',
};

// Get display label for a metric
export const METRIC_LABEL_KEY: Record<AnyMetric, string> = {
  reach: 'metricReach',
  soul: 'metricSoul',
  energy: 'metricEnergy',
  followers: 'metricFollowers',
  money: 'metricMoney',
  likes: 'metricLikes',
  dislikes: 'metricDislikes',
  hype: 'metricHype',
};

// ─── Scaling system for NUMBER metrics ────────────────────────────────────
//
// Cards are authored with small deltas (money: 1, followers: 2, etc.)
// The engine scales these to realistic numbers based on the current stage.
// Stage 1 = micro-influencer, Stage 2 = growing, Stage 3 = established
//
// Scale factors per number metric per stage: [stage1, stage2, stage3]

export const NUMBER_SCALE: Record<NumberMetric, [number, number, number]> = {
  followers: [30,   300,   3000],   // +1 → +30 / +300 / +3000 подписчиков
  money:     [800,  5000,  40000],  // +1 → +800 / +5000 / +40000 ₽
  likes:     [50,   400,   3000],   // +1 → +50 / +400 / +3000 лайков
  dislikes:  [10,   80,    600],    // +1 → +10 / +80 / +600 дизлайков
  hype:      [2,    8,     30],     // +1 → +2 / +8 / +30 хайп
};

// Scale a single number-metric delta for the given stage
export function scaleNumberDelta(
  rawDelta: number,
  metric: NumberMetric,
  stage: 1 | 2 | 3,
): number {
  const scale = NUMBER_SCALE[metric][stage - 1];
  return rawDelta * scale;
}

// Scale an entire Partial<Metrics> delta — bar metrics pass through unchanged
export function scaleDelta(
  raw: Partial<Metrics>,
  stage: 1 | 2 | 3,
): Partial<Metrics> {
  const result: Partial<Metrics> = {};
  for (const [key, val] of Object.entries(raw)) {
    if (val === undefined || val === 0) continue;
    const k = key as keyof Metrics;
    if (isBarMetric(k)) {
      result[k] = val;
    } else {
      result[k] = scaleNumberDelta(val, k as NumberMetric, stage);
    }
  }
  return result;
}

// Realistic starting values for a new influencer
export const INIT_METRICS: Metrics = {
  reach: 5,         // 5/10 — начинающий
  soul: 5,          // 5/10 — нормальное состояние
  energy: 5,        // 5/10 — достаточно энергии
  followers: 147,   // 147 подписчиков — реалистично для нового блогера
  money: 3200,      // 3 200 ₽ — пара недель работы
  likes: 892,       // 892 лайков — получено за все посты
  dislikes: 12,     // 12 дизлайков — минимальные
  hype: 2,          // 2 — хайп низкий, только начинаем
};

// Bar metric limits
export const BAR_MIN = 0;
export const BAR_MAX = 10;

// Clamp bar metrics to 0-10, leave number metrics unlimited
export function clampMetrics(m: Metrics): Metrics {
  return {
    ...m,
    reach: Math.max(BAR_MIN, Math.min(BAR_MAX, m.reach)),
    soul: Math.max(BAR_MIN, Math.min(BAR_MAX, m.soul)),
    energy: Math.max(BAR_MIN, Math.min(BAR_MAX, m.energy)),
    // Number metrics are NOT clamped — they can grow or shrink indefinitely
  };
}

// Check if a bar metric is critical (low)
export function isCritical(metric: number): boolean {
  return metric <= 2;
}

// Check if a bar metric is high (for danger color)
export function isHigh(metric: number): boolean {
  return metric >= 8;
}

// ─── Game-over thresholds for number metrics ──────────────────────────────

export const NUMBER_DEATH: Record<NumberMetric, number> = {
  followers: 0,     // 0 followers → banned
  money:     0,     // 0 money → sold
  likes:     -Infinity, // likes don't kill
  dislikes:  Infinity,  // dislikes don't kill (high = bad but not death)
  hype:      -Infinity, // hype doesn't kill
};

export function getNumberDeath(m: Metrics): string | null {
  if (m.followers <= 0) return 'banned';
  if (m.money <= 0) return 'sold';
  return null;
}
