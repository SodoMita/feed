import { createContext, useContext } from 'react';

export type Lang = 'ru' | 'en';

const LANG_KEY = 'feed_lang';

export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'ru') return saved;
  } catch { /* ignore */ }
  const nav = navigator.language?.toLowerCase() ?? '';
  if (nav.startsWith('ru') || nav.startsWith('uk') || nav.startsWith('be')) return 'ru';
  return 'en';
}

export function saveLang(lang: Lang): void {
  try { localStorage.setItem(LANG_KEY, lang); } catch { /* ignore */ }
}

export const LangContext = createContext<Lang>('ru');

export function useLang(): Lang {
  return useContext(LangContext);
}

// ─── UI strings ──────────────────────────────────────────────────────────────

export type UIStrings = {
  title: string;
  subtitle: string;
  metricReach: string;
  metricSoul: string;
  metricMoney: string;
  metricEnergy: string;
  metricFollowers: string;
  metricLikes: string;
  metricDislikes: string;
  metricHype: string;
  metricReachDesc: string;
  metricSoulDesc: string;
  metricMoneyDesc: string;
  metricEnergyDesc: string;
  swipeHint: string;
  createAccount: string;
  newGame: string;
  continueGame: string;
  restart: string;
  journal: string;
  journalTitle: string;
  back: string;
  observations: string;
  notMet: string;
  tapToContinue: string;
  feedEmpty: string;
  startOver: string;
  errorTitle: string;
  errorDesc: string;
  errorReload: string;
  stage1: string;
  stage2: string;
  stage3: string;
  stageStart: string;
  stageGrowth: string;
  stagePeak: string;
  progressStart: string;
  progressDev: string;
  progressFinal: string;
  card: string;
  victory: string;
  defeat: string;
  radioSignal: string;
  conspiracy: string;
  settingsTitle: string;
  language: string;
  feedTitle: string;
  feedNew: string;
  feedClose: string;
  // Agree/disagree choice UI: green = agree (✓), red = disagree (✕)
  agree: string;
  disagree: string;
};

const ru: UIStrings = {
  title: 'FEED',
  subtitle: 'Кем ты станешь в ленте?',
  metricReach: 'Охват',
  metricSoul: 'Душа',
  metricMoney: '₽',
  metricEnergy: 'Энергия',
  metricFollowers: 'Подписчики',
  metricLikes: 'Лайки',
  metricDislikes: 'Дизлайки',
  metricHype: 'Хайп',
  metricReachDesc: 'Тебя видят',
  metricSoulDesc: 'Ты настоящий',
  metricMoneyDesc: 'Ты в деньгах',
  metricEnergyDesc: 'У тебя силы',
  swipeHint: 'Каждая карточка — предложение. Свайп ← влево (красное ✕) — отказаться. Свайп вправо → (зелёное ✓) — согласиться. Держи метрики в балансе.',
  createAccount: '✨ Создать аккаунт',
  newGame: '🔄 Новая игра',
  continueGame: '▶ Продолжить',
  restart: '🔄 Начать заново',
  journal: '📖 Журнал персонажей',
  journalTitle: '📖 Журнал персонажей',
  back: '← Назад',
  observations: 'наблюдений',
  notMet: 'Не встречен',
  tapToContinue: 'нажми чтобы продолжить',
  feedEmpty: 'Лента опустела.',
  startOver: 'Начать заново',
  errorTitle: 'Что-то сломалось',
  errorDesc: 'Не волнуйся, твой прогресс сохранён',
  errorReload: '🔄 Перезагрузить',
  stage1: '🌱 Этап 1',
  stage2: '📈 Этап 2',
  stage3: '🔮 Этап 3',
  stageStart: '🌱 Старт',
  stageGrowth: '📈 Рост',
  stagePeak: '🔮 Вершина',
  progressStart: 'Начало',
  progressDev: 'Развитие',
  progressFinal: 'Финал близко',
  card: 'Карта',
  victory: '🏆',
  defeat: '💀',
  radioSignal: 'Радиосигнал',
  conspiracy: 'Заговор',
  settingsTitle: '⚙️ Настройки',
  language: 'Язык',
  feedTitle: '📱 Лента',
  feedNew: 'новое',
  feedClose: 'Закрыть',
  agree: 'Да',
  disagree: 'Нет',
};

const en: UIStrings = {
  title: 'FEED',
  subtitle: 'Who will you become in the feed?',
  metricReach: 'Reach',
  metricSoul: 'Soul',
  metricMoney: '$',
  metricEnergy: 'Energy',
  metricFollowers: 'Followers',
  metricLikes: 'Likes',
  metricDislikes: 'Dislikes',
  metricHype: 'Hype',
  metricReachDesc: 'They see you',
  metricSoulDesc: 'You\'re real',
  metricMoneyDesc: 'You have cash',
  metricEnergyDesc: 'You have strength',
  swipeHint: 'Every card is a proposal. Swipe ← left (red ✕) to refuse. Swipe right → (green ✓) to agree. Keep all metrics balanced.',
  createAccount: '✨ Create Account',
  newGame: '🔄 New Game',
  continueGame: '▶ Continue',
  restart: '🔄 Start Over',
  journal: '📖 Character Journal',
  journalTitle: '📖 Character Journal',
  back: '← Back',
  observations: 'observations',
  notMet: 'Not met yet',
  tapToContinue: 'tap to continue',
  feedEmpty: 'The feed is empty.',
  startOver: 'Start over',
  errorTitle: 'Something broke',
  errorDesc: 'Don\'t worry, your progress is saved',
  errorReload: '🔄 Reload',
  stage1: '🌱 Stage 1',
  stage2: '📈 Stage 2',
  stage3: '🔮 Stage 3',
  stageStart: '🌱 Start',
  stageGrowth: '📈 Growth',
  stagePeak: '🔮 Peak',
  progressStart: 'Beginning',
  progressDev: 'Growing',
  progressFinal: 'Finale soon',
  card: 'Card',
  victory: '🏆',
  defeat: '💀',
  radioSignal: 'Radio signal',
  conspiracy: 'Conspiracy',
  settingsTitle: '⚙️ Settings',
  language: 'Language',
  feedTitle: '📱 Feed',
  feedNew: 'new',
  feedClose: 'Close',
  agree: 'Yes',
  disagree: 'No',
};

const UI_STRINGS: Record<Lang, UIStrings> = { ru, en };

export function getUI(lang: Lang): UIStrings {
  return UI_STRINGS[lang];
}
