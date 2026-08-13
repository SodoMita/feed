/**
 * Applies language overlays to game data.
 * Russian = base data (no overlay needed).
 * English = overlay from locales/en.ts.
 */

import type { Lang } from './i18n';
import type { Card, Perk, Ending, JournalEntry } from './gameData';
import { CARDS_EN, PERKS_EN, ENDINGS_EN, JOURNAL_EN } from './locales/en';

// ─── Cards ──────────────────────────────────────────────────────────────────

export function localizeCard(card: Card, lang: Lang): Card {
  if (lang === 'ru') return card;
  const tr = CARDS_EN[card.id];
  if (!tr) return card;
  return {
    ...card,
    characterName: tr.cn,
    text: tr.t,
    leftChoice: {
      ...card.leftChoice,
      label: tr.ll,
      text: tr.lt,
    },
    rightChoice: {
      ...card.rightChoice,
      label: tr.rl,
      text: tr.rt,
    },
  };
}

// ─── Perks ──────────────────────────────────────────────────────────────────

export function localizePerk(perk: Perk, lang: Lang): Perk {
  if (lang === 'ru') return perk;
  const tr = PERKS_EN[perk.id];
  if (!tr) return perk;
  return {
    ...perk,
    name: tr.name,
    description: tr.description,
  };
}

// ─── Endings ────────────────────────────────────────────────────────────────

export function localizeEnding(ending: Ending, lang: Lang): Ending {
  if (lang === 'ru') return ending;
  const tr = ENDINGS_EN[ending.id];
  if (!tr) return ending;
  return {
    ...ending,
    title: tr.title,
    text: tr.text,
    achievement: tr.achievement,
  };
}

// ─── Journal ────────────────────────────────────────────────────────────────

export function localizeJournal(entries: JournalEntry[], lang: Lang): JournalEntry[] {
  if (lang === 'ru') return entries;
  return entries.map((entry, i) => {
    const tr = JOURNAL_EN[i];
    if (!tr) return entry;
    return {
      ...entry,
      characterName: tr.characterName,
      comments: tr.comments,
    };
  });
}
