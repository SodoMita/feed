import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import {
  type GameState, type Card, type CardChoice, type Metrics,
  createInitState, processChoice, pickCard, saveGame, loadGame, clearSave,
  ENDINGS, PERKS, JOURNAL, FEED_MESSAGES,
} from './gameEngine';
import {
  soundSwipeLeft, soundSwipeRight, soundMetricUp, soundMetricDown,
  soundDeath, soundNewCharacter, soundPerk, soundLostPerk, soundEnding, startAmbient, startBgm,
  soundRadioStatic, soundSignalFound, soundDecoded, soundConspiracyReveal,
  soundFrequencyTune, soundBunkerDoor, soundLikeBurst, soundDislikeBurst, soundEventHit, resumeAudio,
} from './sound';
import { type Lang, LangContext, detectLang, saveLang, getUI, useLang } from './i18n';
import { localizeCard, localizePerk, localizeEnding, localizeJournal } from './localizeData';
import { formatNumber, isBarMetric, isCritical, isHigh, scaleDelta } from './types/metrics';

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  Error Boundary                                                          ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function ErrorFallback({ onReset }: { onReset: () => void }) {
  const lang = useLang();
  const ui = getUI(lang);
  return (
    <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center p-6 text-center">
      <div className="text-5xl mb-4">💥</div>
      <h2 className="text-white text-xl font-bold mb-2">{ui.errorTitle}</h2>
      <p className="text-white/50 text-sm mb-6">{ui.errorDesc}</p>
      <button
        onClick={onReset}
        className="px-6 py-3 rounded-2xl bg-white text-black font-semibold text-sm"
      >
        {ui.errorReload}
      </button>
    </div>
  );
}

function ErrorBoundaryWrapper({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handler = (e: ErrorEvent) => {
      e.preventDefault();
      setHasError(true);
    };
    window.addEventListener('error', handler);
    return () => window.removeEventListener('error', handler);
  }, []);

  if (hasError) {
    return <ErrorFallback onReset={() => { setHasError(false); window.location.reload(); }} />;
  }
  return <>{children}</>;
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  Metric Components                                                       ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

// Choice semantics: every card is a proposal.
// LEFT  = disagree → red ✕ «Нет / No»
// RIGHT = agree    → green ✓ «Да / Yes»
const DISAGREE_STYLE = {
  shadow: '-8px 8px 30px rgba(239,68,68,0.35), 0 0 0 1px rgba(239,68,68,0.25)',
  border: 'border-red-400/50',
  pill: 'bg-red-500/20 text-red-300 border border-red-400/40 scale-105',
  button: 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-500/50',
  stamp: 'border-red-500 text-red-500',
};

const AGREE_STYLE = {
  shadow: '8px 8px 30px rgba(52,211,153,0.35), 0 0 0 1px rgba(52,211,153,0.25)',
  border: 'border-emerald-400/50',
  pill: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 scale-105',
  button: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50',
  stamp: 'border-emerald-500 text-emerald-500',
};

const DEFAULT_SHADOW = '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)';

// Bar metric (0-10) — shown as progress bar
function MetricBar({
  emoji, value, hoverDelta, label,
}: {
  emoji: string; value: number; hoverDelta?: number; label: string;
}) {
  const BAR_MAX = 10;
  const pct = (value / BAR_MAX) * 100;
  const critical = isCritical(value);
  const high = isHigh(value);
  const barColor = critical ? 'bg-red-500' : high ? 'bg-orange-400' : 'bg-emerald-400';

  const previewPct = hoverDelta !== undefined
    ? Math.max(0, Math.min(100, ((value + hoverDelta) / BAR_MAX) * 100))
    : null;

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-base leading-none shrink-0">{emoji}</span>
      <div className="relative flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
        {previewPct !== null && (
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-white/30 transition-all duration-200"
            style={{ width: `${previewPct}%` }}
          />
        )}
      </div>
      <span className={`text-xs w-5 text-right shrink-0 ${critical ? 'text-red-400' : 'text-white/40'}`}>
        {value}
      </span>
      <span className="text-xs text-white/20 hidden sm:inline shrink-0">{label}</span>
    </div>
  );
}

// Number metric (unlimited) — shown as full formatted integer
function NumberMetric({
  emoji, value, hoverDelta, label, suffix = '', lowWarning = false,
}: {
  emoji: string; value: number; hoverDelta?: number; label: string; suffix?: string; lowWarning?: boolean;
}) {
  const critical = value < 0 || (lowWarning && value < 10);
  const valueColor = critical ? 'text-red-400' : value > 100000 ? 'text-amber-300' : 'text-white/60';

  // The preview sign and color are derived from the DELTA (like/dislike semantics):
  // negative change = red like a dislike, positive change = green like a like.
  const delta = hoverDelta ?? 0;
  const preview = hoverDelta !== undefined ? value + delta : null;
  const previewColor = preview !== null && (preview < 0 || delta < 0)
    ? 'text-red-400'
    : delta > 0
    ? 'text-emerald-400'
    : 'text-white/30';

  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <span className="text-sm leading-none shrink-0">{emoji}</span>
      <span className={`text-xs font-mono shrink-0 ${valueColor}`}>
        {value < 0 ? '−' : ''}{formatNumber(Math.abs(value))}{suffix}
      </span>
      {preview !== null && (
        <span className={`text-xs font-mono shrink-0 ${previewColor}`}>
          {delta > 0 ? '+' : delta < 0 ? '−' : ''}{formatNumber(Math.abs(delta))}
        </span>
      )}
      <span className="text-xs text-white/15 hidden sm:inline shrink-0 truncate">{label}</span>
    </div>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  Game Card                                                               ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function GameCard({
  card, hoverDir, swipeOffset, exitDir,
}: {
  card: Card;
  hoverDir: 'left' | 'right' | null;
  swipeOffset: number;
  exitDir: 'left' | 'right' | null;
}) {
  const lang = useLang();
  const ui = getUI(lang);
  const lc = localizeCard(card, lang);

  const maxTilt = 14;
  const maxTranslate = 64;
  const normalizedOffset = Math.max(-1, Math.min(1, swipeOffset / 90));
  const tiltAngle = normalizedOffset * maxTilt;
  const translateX = normalizedOffset * maxTranslate;

  // During a drag the offset direction wins; otherwise fall back to hover
  const activeDir: 'left' | 'right' | null =
    swipeOffset < -8 ? 'left' : swipeOffset > 8 ? 'right' : hoverDir;
  const leftHint = activeDir === 'left';
  const rightHint = activeDir === 'right';
  const glow = leftHint ? DISAGREE_STYLE : AGREE_STYLE;

  // Tinder-style stamp intensity follows the drag distance
  const stampIntensity =
    swipeOffset !== 0 ? Math.min(1, Math.abs(normalizedOffset)) : activeDir ? 1 : 0;

  // Committed choice → fly off-screen before the result phase mounts
  const exitTransform =
    exitDir === 'left'
      ? 'translateX(-60vw) rotate(-26deg)'
      : 'translateX(60vw) rotate(26deg)';

  return (
    <div
      className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto select-none will-change-transform"
      style={{
        transform: exitDir ? exitTransform : `rotate(${tiltAngle}deg) translateX(${translateX}px)`,
        opacity: exitDir ? 0 : 1,
        transition: exitDir
          ? 'transform 0.18s ease-in, opacity 0.18s ease-in'
          : swipeOffset === 0
            ? 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : 'none',
      }}
    >
      <div
        className="game-card relative rounded-3xl p-6 sm:p-8 flex flex-col gap-5 sm:gap-6"
        style={{
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          boxShadow: leftHint || rightHint ? glow.shadow : DEFAULT_SHADOW,
          minHeight: '300px',
        }}
      >
        {/* Character */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="game-card-emoji text-5xl sm:text-6xl leading-none">{lc.characterEmoji}</div>
          <div>
            <div className="text-white font-semibold text-sm sm:text-base">{lc.characterName}</div>
            <div className="text-white/30 text-xs sm:text-sm">
              {lc.stage === 1 ? ui.stage1 : lc.stage === 2 ? ui.stage2 : ui.stage3}
            </div>
          </div>
        </div>

        {/* Card text */}
        <div className="game-card-text text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed flex-1 whitespace-pre-line">
          {lc.text}
        </div>

        {/* Agree / disagree labels — green = agree (right), red = disagree (left) */}
        <div className="flex items-center justify-between gap-2">
          <div
            className={`text-xs sm:text-sm font-bold px-3 py-2 rounded-xl transition-all duration-200 leading-tight ${
              leftHint ? DISAGREE_STYLE.pill : 'bg-red-500/5 text-red-300/40 border border-transparent'
            }`}
          >
            ← ✕ {ui.disagree}
          </div>
          <div
            className={`text-xs sm:text-sm font-bold px-3 py-2 rounded-xl transition-all duration-200 leading-tight ${
              rightHint ? AGREE_STYLE.pill : 'bg-emerald-500/5 text-emerald-300/40 border border-transparent'
            }`}
          >
            {ui.agree} ✓ →
          </div>
        </div>
      </div>

      {/* Swipe hint border */}
      {activeDir && (
        <div className={`absolute inset-0 rounded-3xl border-2 ${glow.border} pointer-events-none`} />
      )}

      {/* Stamps */}
      {leftHint && (
        <div
          className={`absolute top-4 left-4 sm:top-6 sm:left-6 z-10 px-3 py-1 sm:px-4 sm:py-1.5 border-4 rounded-xl font-black text-2xl sm:text-3xl uppercase tracking-widest pointer-events-none ${DISAGREE_STYLE.stamp}`}
          style={{
            opacity: stampIntensity,
            transform: `rotate(-14deg) scale(${0.85 + 0.15 * stampIntensity})`,
          }}
        >
          {ui.disagree}
        </div>
      )}
      {rightHint && (
        <div
          className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-10 px-3 py-1 sm:px-4 sm:py-1.5 border-4 rounded-xl font-black text-2xl sm:text-3xl uppercase tracking-widest pointer-events-none ${AGREE_STYLE.stamp}`}
          style={{
            opacity: stampIntensity,
            transform: `rotate(14deg) scale(${0.85 + 0.15 * stampIntensity})`,
          }}
        >
          {ui.agree}
        </div>
      )}
    </div>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  Perk Toast                                                              ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function PerkToast({ perkId }: { perkId: string }) {
  const lang = useLang();
  const perk = PERKS[perkId];
  if (!perk) return null;
  const lp = localizePerk(perk, lang);
  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-semibold shadow-2xl ${
        lp.positive ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
      }`}
      style={{ animation: 'fadeInUp 0.4s ease' }}
    >
      {lp.emoji} {lp.name} — {lp.description}
    </div>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  Result Overlay                                                          ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function ResultOverlay({
  text, delta, onDone,
}: {
  text: string; delta: Partial<Metrics>; onDone: () => void;
}) {
  const lang = useLang();
  const ui = getUI(lang);

  const displayText = text;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm touch-pan-y"
      onClick={onDone}
    >
      <div
        className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-xs mx-4 text-center"
        style={{ animation: 'fadeInUp 0.3s ease' }}
      >
        <p className="text-white/90 text-sm leading-relaxed">{displayText}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {(Object.entries(delta) as [keyof Metrics, number][])
            .filter(([, v]) => v !== 0)
            .map(([key, val]) => {
const icons: Record<keyof Metrics, string> = {
  reach: '📡', soul: '🫀', money: '💰', energy: '⚡',
  followers: '👥', likes: '❤️', dislikes: '💔', hype: '🔥',
};
              return (
                <span
                  key={key}
                  className={`text-sm font-bold ${val > 0 ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {icons[key]} {val > 0 ? '+' : ''}{isBarMetric(key) ? val : formatNumber(val)}
                </span>
              );
            })}
        </div>
        <p className="text-white/20 text-xs mt-3">{ui.tapToContinue}</p>
      </div>
    </div>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  Feed Messages Panel                                                     ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function FeedPanel({
  flags, cardCount, onClose,
}: {
  flags: string[]; cardCount: number; onClose: () => void;
}) {
  const lang = useLang();
  const ui = getUI(lang);
  const flagSet = new Set(flags);

  const visible = FEED_MESSAGES.filter(msg => {
    if (msg.minCardCount && cardCount < msg.minCardCount) return false;
    if (msg.maxCardCount && cardCount > msg.maxCardCount) return false;
    if (msg.requiredFlags && !msg.requiredFlags.every(f => flagSet.has(f))) return false;
    if (msg.forbiddenFlags && msg.forbiddenFlags.some(f => flagSet.has(f))) return false;
    return true;
  });

  // Reverse so newest are at top
  const sorted = [...visible].reverse();

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md"
      onClick={onClose}
      style={{ animation: 'fadeInUp 0.25s ease' }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-white/80 font-bold text-sm">{ui.feedTitle}</h2>
        <button
          className="text-white/40 hover:text-white/70 text-xs transition-colors"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div
        className="flex-1 overflow-y-auto touch-pan-y px-4 pb-6 space-y-2"
        onClick={e => e.stopPropagation()}
      >
        {sorted.length === 0 && (
          <p className="text-white/20 text-sm text-center mt-12">…</p>
        )}
        {sorted.map(msg => (
          <div
            key={msg.id}
            className="flex items-start gap-3 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5"
          >
            <span className="text-xl leading-none mt-0.5 shrink-0">{msg.emoji}</span>
            <div className="min-w-0">
              <span className="text-white/50 text-xs font-semibold">{msg.name}</span>
              <p className="text-white/80 text-sm leading-snug mt-0.5">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  Ending Screen                                                           ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function EndingScreen({ endingId, onRestart, onJournal }: {
  endingId: string; onRestart: () => void; onJournal: () => void;
}) {
  const lang = useLang();
  const ui = getUI(lang);
  const ending = ENDINGS[endingId];
  if (!ending) return null;
  const le = localizeEnding(ending, lang);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050510]">
      <div className="max-w-sm w-full text-center" style={{ animation: 'fadeInUp 0.6s ease' }}>
        <div className="text-7xl mb-4">{le.emoji}</div>
        <h2 className="text-2xl font-bold text-white mb-2">{le.title}</h2>
        <div className={`text-xs mb-6 px-4 py-1 rounded-full border inline-block ${
          le.type === 'victory'
            ? 'text-emerald-400/70 border-emerald-500/20'
            : 'text-red-400/70 border-red-500/20'
        }`}>
          {le.type === 'victory' ? ui.victory : ui.defeat} {le.achievement}
        </div>
        <p className="text-white/70 text-sm leading-relaxed mb-8 whitespace-pre-line text-left">
          {le.text}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors active:scale-95"
          >
            {ui.restart}
          </button>
          <button
            onClick={onJournal}
            className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 transition-colors active:scale-95"
          >
            {ui.journal}
          </button>
        </div>
      </div>
    </div>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  Journal Screen                                                          ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function JournalScreen({ seenChars, onBack }: {
  seenChars: string[]; onBack: () => void;
}) {
  const lang = useLang();
  const ui = getUI(lang);
  const [selected, setSelected] = useState<number | null>(null);
  const localizedJournal = localizeJournal(JOURNAL, lang);

  // Build a set of seen names in BOTH languages for matching
  const seenSet = new Set(seenChars);

  // We also need to match localized names to base names
  // Build reverse map: base journal entries map to translated entries
  const journalWithSeen = localizedJournal.map((entry, i) => {
    const baseEntry = JOURNAL[i];
    // Check if base name OR localized name is in seenChars
    const seen = seenSet.has(baseEntry.characterName) || seenSet.has(entry.characterName);
    return { entry, seen };
  });

  return (
    <div className="min-h-screen bg-[#050510] p-6 flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-white/50 hover:text-white text-sm transition-colors">
          {ui.back}
        </button>
        <h2 className="text-white font-bold text-lg">{ui.journalTitle}</h2>
      </div>

      <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
        {journalWithSeen.map(({ entry, seen }, i) => {
          const isOpen = selected === i;

          return (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                seen
                  ? 'border-white/10 bg-white/5 cursor-pointer hover:bg-white/[0.08]'
                  : 'border-white/5 bg-white/[0.02] opacity-40'
              }`}
              onClick={() => seen && setSelected(isOpen ? null : i)}
            >
              <div className="flex items-center gap-3 p-4">
                <span className="text-3xl">{seen ? entry.characterEmoji : '❓'}</span>
                <div className="flex-1">
                  <div className="text-white/80 text-sm font-semibold">
                    {seen ? entry.characterName : '???'}
                  </div>
                  <div className="text-white/30 text-xs">
                    {seen ? `${entry.comments.length} ${ui.observations}` : ui.notMet}
                  </div>
                </div>
                {seen && <span className="text-white/30 text-xs">{isOpen ? '▲' : '▼'}</span>}
              </div>

              {isOpen && seen && (
                <div className="px-4 pb-4 flex flex-col gap-2 border-t border-white/5 pt-3">
                  {entry.comments.map((c, j) => (
                    <p
                      key={j}
                      className="text-white/60 text-xs leading-relaxed italic"
                      style={{ animation: `fadeInUp ${0.1 + j * 0.05}s ease` }}
                    >
                      «{c}»
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  Settings Panel                                                          ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function SettingsPanel({ onClose, lang, onChangeLang }: {
  onClose: () => void;
  lang: Lang;
  onChangeLang: (l: Lang) => void;
}) {
  const ui = getUI(lang);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-xs mx-4 w-full"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'fadeInUp 0.3s ease' }}
      >
        <h3 className="text-white font-bold text-lg mb-4">{ui.settingsTitle}</h3>

        <div className="mb-4">
          <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">
            {ui.language}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onChangeLang('ru')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                lang === 'ru'
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
              }`}
            >
              🇷🇺 Русский
            </button>
            <button
              onClick={() => onChangeLang('en')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                lang === 'en'
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-white/5 text-white/50 text-sm border border-white/10 hover:bg-white/10 transition-colors"
        >
          {ui.back.replace('← ', '')}
        </button>
      </div>
    </div>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  Start Screen                                                            ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function StartScreen({ onStart, hasSave, onContinue, onSettings }: {
  onStart: () => void; hasSave: boolean; onContinue: () => void; onSettings: () => void;
}) {
  const lang = useLang();
  const ui = getUI(lang);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050510]">
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative text-center max-w-xs" style={{ animation: 'fadeInUp 0.6s ease' }}>
        <div className="text-6xl mb-2">📱</div>
        <h1
          className="text-5xl font-black tracking-tight mb-1"
          style={{
            background: 'linear-gradient(135deg, #fff 0%, #a78bfa 50%, #60a5fa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {ui.title}
        </h1>
        <p className="text-white/40 text-xs mb-8 tracking-widest uppercase">
          {ui.subtitle}
        </p>

        <div className="flex flex-col gap-3 mb-8 text-left">
          {[
            { e: '📡', label: ui.metricReach, desc: ui.metricReachDesc },
            { e: '🫀', label: ui.metricSoul, desc: ui.metricSoulDesc },
            { e: '💰', label: ui.metricMoney, desc: ui.metricMoneyDesc },
            { e: '⚡', label: ui.metricEnergy, desc: ui.metricEnergyDesc },
          ].map(({ e, label, desc }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-2xl">{e}</span>
              <div>
                <span className="text-white/70 text-sm font-semibold">{label}</span>
                <span className="text-white/30 text-xs ml-2">— {desc}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-white/25 text-xs mb-6 leading-relaxed">
          {ui.swipeHint}
        </p>

        <div className="flex flex-col gap-3">
          {hasSave && (
            <button
              onClick={onContinue}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition-transform hover:scale-105 active:scale-95 border border-white/20 bg-white/5"
            >
              {ui.continueGame}
            </button>
          )}
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl font-bold text-black text-base transition-transform hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
            }}
          >
            {hasSave ? ui.newGame : ui.createAccount}
          </button>
          <button
            onClick={onSettings}
            className="w-full py-2 rounded-xl text-white/30 text-xs hover:text-white/60 transition-colors"
          >
            ⚙️ {ui.language}: {lang === 'ru' ? '🇷🇺 Русский' : '🇬🇧 English'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  Main App                                                                ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function Game({ onChangeLang }: { onChangeLang: (l: Lang) => void }) {
  const lang = useLang();
  const ui = getUI(lang);
  const [state, setState] = useState<GameState>(createInitState);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showFeed, setShowFeed] = useState(false);
  const ambientRef = useRef<(() => void) | null>(null);
  const bgmRef = useRef<(() => void) | null>(null);
  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const lastCardIdRef = useRef<string | null>(null);

  // Check for saved game
  const [hasSave, setHasSave] = useState(false);
  useEffect(() => {
    const saved = loadGame();
    setHasSave(saved !== null && saved.phase !== 'start');
  }, []);

  // Select next card
  const selectNextCard = useCallback((s: GameState) => {
    const c = pickCard(s);
    setCurrentCard(c);
    if (c && c.id !== lastCardIdRef.current) {
      lastCardIdRef.current = c.id;
      soundNewCharacter();
    }
  }, []);

  // Auto-save
  useEffect(() => {
    if (state.phase === 'playing' || state.phase === 'ending') {
      saveGame(state);
    }
  }, [state]);

  // Start new game
  const handleStart = useCallback(() => {
    resumeAudio();
    clearSave();
    const s = createInitState();
    s.phase = 'playing';
    setState(s);
    ambientRef.current?.();
    bgmRef.current?.();
    ambientRef.current = startAmbient();
    bgmRef.current = startBgm();
    selectNextCard(s);
  }, [selectNextCard]);

  // Continue saved game
  const handleContinue = useCallback(() => {
    resumeAudio();
    const saved = loadGame();
    if (!saved) return;
    saved.phase = 'playing';
    saved.hoverDir = null;
    setState(saved);
    ambientRef.current?.();
    bgmRef.current?.();
    ambientRef.current = startAmbient();
    bgmRef.current = startBgm();
    selectNextCard(saved);
  }, [selectNextCard]);

  // Play radio sound effects
  const playRadioSound = useCallback((event: string | null) => {
    switch (event) {
      case 'static': soundRadioStatic(); break;
      case 'signal': soundSignalFound(); break;
      case 'decoded': soundDecoded(); break;
      case 'conspiracy': soundConspiracyReveal(); break;
      case 'frequency': soundFrequencyTune(); break;
      case 'bunker': soundBunkerDoor(); break;
    }
  }, []);

  // Make a choice — localize the result text for the overlay
  const handleChoose = useCallback(
    (choice: CardChoice) => {
      if (state.phase !== 'playing' || !currentCard) return;

      // Swipe sounds
      if (choice.direction === 'left') soundSwipeLeft();
      else soundSwipeRight();

      const result = processChoice(state, choice, currentCard);

      // Localize the result text
      if (lang !== 'ru') {
        const lc = localizeCard(currentCard, lang);
        const localizedText = choice.direction === 'left'
          ? lc.leftChoice.text
          : lc.rightChoice.text;
        result.nextState.resultText = localizedText;
      }

      // Metric sounds
      if (result.metricChanges.up) soundMetricUp();
      if (result.metricChanges.down) soundMetricDown();
      if ((choice.delta.likes ?? 0) > 0 || (choice.delta.followers ?? 0) > 0) soundLikeBurst();
      if ((choice.delta.dislikes ?? 0) > 0) soundDislikeBurst();
      if ((choice.delta.hype ?? 0) !== 0) soundEventHit();

      // Perk sound
      if (result.grantedPerk) soundPerk();
      if (result.lostPerk) soundLostPerk();

      // Radio sounds
      playRadioSound(result.radioEvent);

      // Ending sounds
      if (result.endingId) {
        if (result.isDeath) soundDeath();
        else soundEnding();
      }

      setState(result.nextState);
      setSwipeOffset(0);
    },
    [state, currentCard, playRadioSound, lang]
  );

  // Commit a choice: haptic tick + card flies off-screen, then the result mounts.
  // exitDir doubles as an input lock while the fly-out runs.
  const triggerChoice = useCallback(
    (dir: 'left' | 'right') => {
      if (!currentCard || state.phase !== 'playing' || exitDir) return;
      const choice = dir === 'left' ? currentCard.leftChoice : currentCard.rightChoice;
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
      setExitDir(dir);
      window.setTimeout(() => {
        setExitDir(null);
        setSwipeOffset(0);
        handleChoose(choice);
      }, 180);
    },
    [currentCard, state.phase, exitDir, handleChoose]
  );

  // Result done
  const handleResultDone = useCallback(() => {
    setState(prev => {
      if (prev.pendingEnding) {
        return { ...prev, phase: 'ending' as const, newPerk: null };
      }
      const next = { ...prev, phase: 'playing' as const, newPerk: null };
      requestAnimationFrame(() => selectNextCard(next));
      return next;
    });
  }, [selectNextCard]);

  // Restart
  const handleRestart = useCallback(() => {
    clearSave();
    handleStart();
  }, [handleStart]);

  // Journal navigation
  const handleJournal = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'journal' }));
  }, []);

  const handleBackFromJournal = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: prev.pendingEnding ? 'ending' : 'playing',
    }));
  }, []);

  // ─── Keyboard ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (state.phase !== 'playing' || !currentCard) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') triggerChoice('left');
      if (e.key === 'ArrowRight') triggerChoice('right');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.phase, currentCard, triggerChoice]);

  // ─── Touch/Swipe ─────────────────────────────────────────────────────────
  // Thresholds kept generous: a flick past VELOCITY_THRESHOLD with enough travel,
  // or a drag past ACTION_THRESHOLD, commits the choice. Taps are ignored.

  const HINT_THRESHOLD = 10;
  const ACTION_THRESHOLD = 64;
  const VELOCITY_THRESHOLD = 0.35; // px/ms
  const MIN_FLICK_TRAVEL = 24;
  const VERTICAL_CANCEL = 60;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      t: Date.now(),
    };
    setSwipeOffset(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.touches[0].clientX - touchRef.current.x;
    const dy = Math.abs(e.touches[0].clientY - touchRef.current.y);

    if (dy > VERTICAL_CANCEL) {
      setSwipeOffset(0);
      setState(p => ({ ...p, hoverDir: null }));
      return;
    }

    setSwipeOffset(dx);

    if (dx < -HINT_THRESHOLD) {
      setState(p => p.hoverDir !== 'left' ? { ...p, hoverDir: 'left' } : p);
    } else if (dx > HINT_THRESHOLD) {
      setState(p => p.hoverDir !== 'right' ? { ...p, hoverDir: 'right' } : p);
    } else {
      setState(p => p.hoverDir !== null ? { ...p, hoverDir: null } : p);
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!currentCard || !touchRef.current || exitDir) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = Math.abs(e.changedTouches[0].clientY - touchRef.current.y);
    const dt = Date.now() - touchRef.current.t;
    const velocity = Math.abs(dx) / Math.max(1, dt);

    touchRef.current = null;
    setSwipeOffset(0);

    if (dy > VERTICAL_CANCEL) {
      setState(p => ({ ...p, hoverDir: null }));
      return;
    }

    const actionTriggered =
      Math.abs(dx) > ACTION_THRESHOLD ||
      (velocity > VELOCITY_THRESHOLD && Math.abs(dx) > MIN_FLICK_TRAVEL);

    if (actionTriggered && dx < 0) {
      triggerChoice('left');
    } else if (actionTriggered && dx > 0) {
      triggerChoice('right');
    } else {
      setState(p => ({ ...p, hoverDir: null }));
    }
  }, [currentCard, exitDir, triggerChoice]);

  // ─── Mouse drag ──────────────────────────────────────────────────────────

  const mouseRef = useRef<{ x: number; active: boolean }>({ x: 0, active: false });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseRef.current = { x: e.clientX, active: true };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!mouseRef.current.active) return;
    const dx = e.clientX - mouseRef.current.x;
    setSwipeOffset(dx);

    if (dx < -HINT_THRESHOLD) {
      setState(p => p.hoverDir !== 'left' ? { ...p, hoverDir: 'left' } : p);
    } else if (dx > HINT_THRESHOLD) {
      setState(p => p.hoverDir !== 'right' ? { ...p, hoverDir: 'right' } : p);
    } else {
      setState(p => p.hoverDir !== null ? { ...p, hoverDir: null } : p);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!mouseRef.current.active || !currentCard) {
      mouseRef.current.active = false;
      setSwipeOffset(0);
      return;
    }

    const dx = swipeOffset;
    mouseRef.current.active = false;

    if (exitDir) return;

    if (dx < -ACTION_THRESHOLD) {
      triggerChoice('left');
    } else if (dx > ACTION_THRESHOLD) {
      triggerChoice('right');
    } else {
      setSwipeOffset(0);
      setState(p => ({ ...p, hoverDir: null }));
    }
  }, [currentCard, exitDir, swipeOffset, triggerChoice]);

  // Cleanup ambient on unmount
  useEffect(() => {
    return () => {
      ambientRef.current?.();
      bgmRef.current?.();
    };
  }, []);

  // ─── Hover delta preview ─────────────────────────────────────────────────
  const rawHoverDelta = state.hoverDir
    ? state.hoverDir === 'left'
      ? currentCard?.leftChoice.delta
      : currentCard?.rightChoice.delta
    : undefined;
  // Scale by the CARD's stage so the preview matches the actual result
  const hoverDelta = rawHoverDelta ? scaleDelta(rawHoverDelta, currentCard?.stage ?? state.stage) : undefined;

  // ─── Render phases ───────────────────────────────────────────────────────

  if (state.phase === 'start') {
    return (
      <>
        <StartScreen
          onStart={handleStart}
          hasSave={hasSave}
          onContinue={handleContinue}
          onSettings={() => setShowSettings(true)}
        />
        {showSettings && (
          <SettingsPanel
            onClose={() => setShowSettings(false)}
            lang={lang}
            onChangeLang={onChangeLang}
          />
        )}
      </>
    );
  }

  if (state.phase === 'ending' && state.pendingEnding) {
    return (
      <EndingScreen
        endingId={state.pendingEnding}
        onRestart={handleRestart}
        onJournal={handleJournal}
      />
    );
  }

  if (state.phase === 'journal') {
    return (
      <JournalScreen
        seenChars={state.seenCharacters}
        onBack={handleBackFromJournal}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-[#050510] flex flex-col"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { mouseRef.current.active = false; setSwipeOffset(0); setState(p => ({ ...p, hoverDir: null })); }}
    >
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(167,139,250,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(96,165,250,0.04) 0%, transparent 60%)',
        }}
      />

      {/* Everything centered in a readable column so the card scales up on big screens */}
      <div className="relative z-10 mx-auto w-full max-w-2xl flex-1 min-h-0 flex flex-col">

      {/* Header */}
      <header className="relative z-10 px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-xs font-mono">
            {state.stage === 1 ? ui.stageStart : state.stage === 2 ? ui.stageGrowth : ui.stagePeak}
          </span>
          <h1
            className="text-lg font-black tracking-widest"
            style={{
              background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {ui.title}
          </h1>
          <div className="flex items-center gap-2">
            {/* Radio Signal */}
            {state.radioSignal > 0 && (
              <div className="flex items-center gap-1" title={`${ui.radioSignal}: ${state.radioSignal}/3`}>
                <span className="text-xs">📻</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        i <= state.radioSignal ? 'bg-amber-400' : 'bg-white/10'
                      }`}
                      style={{ height: `${4 + i * 3}px` }}
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Conspiracy Level */}
            {state.conspiracyLevel > 0 && (
              <div className="flex items-center gap-0.5" title={`${ui.conspiracy}: ${state.conspiracyLevel}/3`}>
                <span className="text-xs">👁️</span>
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i <= state.conspiracyLevel ? 'bg-red-400' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            )}
            <button
              onClick={() => setShowFeed(true)}
              className="text-white/30 hover:text-white/60 text-xs transition-colors relative"
            >
              📱
              {FEED_MESSAGES.filter(msg => {
                const flagSet = new Set(state.flags);
                if (msg.minCardCount && state.cardCount < msg.minCardCount) return false;
                if (msg.requiredFlags && !msg.requiredFlags.every(f => flagSet.has(f))) return false;
                if (msg.forbiddenFlags && msg.forbiddenFlags.some(f => flagSet.has(f))) return false;
                return true;
              }).length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              ⚙️
            </button>
            <button
              onClick={handleJournal}
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              📖
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
            style={{ width: `${Math.min(100, (state.cardCount / 35) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-white/20 text-xs">{ui.card} {state.cardCount}</span>
          <span className="text-white/20 text-xs">
            {state.cardCount < 10 && ui.progressStart}
            {state.cardCount >= 10 && state.cardCount < 25 && ui.progressDev}
            {state.cardCount >= 25 && ui.progressFinal}
          </span>
        </div>
      </header>

      {/* Perks strip */}
      {state.perks.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-1.5 px-4 pb-2">
          {state.perks.map(pId => {
            const p = PERKS[pId];
            if (!p) return null;
            const lp = localizePerk(p, lang);
            return (
              <span
                key={pId}
                title={lp.description}
                className={`text-xs px-2 py-0.5 rounded-full ${
                  lp.positive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/15 text-red-400 border border-red-500/20'
                }`}
              >
                {lp.emoji} {lp.name}
              </span>
            );
          })}
        </div>
      )}

      {/* Bar Metrics — left column */}
      <div className="relative z-10 grid grid-cols-3 gap-x-3 gap-y-1.5 px-4 pb-3">
        <MetricBar emoji="📡" label={ui.metricReach} value={state.metrics.reach} hoverDelta={hoverDelta?.reach} />
        <MetricBar emoji="🫀" label={ui.metricSoul} value={state.metrics.soul} hoverDelta={hoverDelta?.soul} />
        <MetricBar emoji="⚡" label={ui.metricEnergy} value={state.metrics.energy} hoverDelta={hoverDelta?.energy} />
      </div>

      {/* Number Metrics — right column, full width */}
      <div className="relative z-10 grid grid-cols-5 gap-x-3 gap-y-1 px-4 pb-3">
        <NumberMetric emoji="👥" label={ui.metricFollowers} value={state.metrics.followers} hoverDelta={hoverDelta?.followers} lowWarning />
        <NumberMetric emoji="💰" label={ui.metricMoney} value={state.metrics.money} hoverDelta={hoverDelta?.money} />
        <NumberMetric emoji="👍" label={ui.metricLikes} value={state.metrics.likes} hoverDelta={hoverDelta?.likes} />
        <NumberMetric emoji="👎" label={ui.metricDislikes} value={state.metrics.dislikes} hoverDelta={hoverDelta?.dislikes} />
        <NumberMetric emoji="🔥" label={ui.metricHype} value={state.metrics.hype} hoverDelta={hoverDelta?.hype} />
      </div>

      {/* Card area — touch-action: none keeps the page from scrolling while swiping */}
      <main
        className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center px-4 pb-4 touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {currentCard && state.phase === 'playing' && (
          <div
            key={state.cardKey}
            className="w-full"
            style={{ animation: exitDir ? 'none' : 'fadeInUp 0.35s ease' }}
          >
            <GameCard
              card={currentCard}
              hoverDir={state.hoverDir}
              swipeOffset={swipeOffset}
              exitDir={exitDir}
            />
          </div>
        )}

        {/* Click buttons — constant agree (green ✓) / disagree (red ✕) */}
        {currentCard && state.phase === 'playing' && (
          <div className="game-choices flex gap-3 sm:gap-4 mt-5 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
            <button
              className={`game-choices-btn flex-1 py-3.5 rounded-2xl border text-sm sm:text-base font-bold transition-all active:scale-95 ${DISAGREE_STYLE.button}`}
              onClick={() => triggerChoice('left')}
              onMouseEnter={() => setState(p => ({ ...p, hoverDir: 'left' }))}
              onMouseLeave={() => { if (!mouseRef.current.active) setState(p => ({ ...p, hoverDir: null })); }}
            >
              ✕ {ui.disagree}
            </button>
            <button
              className={`game-choices-btn flex-1 py-3.5 rounded-2xl border text-sm sm:text-base font-bold transition-all active:scale-95 ${AGREE_STYLE.button}`}
              onClick={() => triggerChoice('right')}
              onMouseEnter={() => setState(p => ({ ...p, hoverDir: 'right' }))}
              onMouseLeave={() => { if (!mouseRef.current.active) setState(p => ({ ...p, hoverDir: null })); }}
            >
              {ui.agree} ✓
            </button>
          </div>
        )}

        {/* No cards */}
        {!currentCard && state.phase === 'playing' && (
          <div className="text-white/40 text-sm text-center">
            <div className="text-4xl mb-3">🌿</div>
            <p>{ui.feedEmpty}</p>
            <button
              onClick={handleRestart}
              className="mt-4 px-6 py-2 rounded-xl bg-white/5 text-white/60 text-xs hover:bg-white/10 transition-colors"
            >
              {ui.startOver}
            </button>
          </div>
        )}
      </main>

      </div>{/* end centered column */}

      {/* Perk toast */}
      {state.newPerk && <PerkToast perkId={state.newPerk} />}

      {/* Result overlay */}
      {state.phase === 'result' && (
        <ResultOverlay
          text={state.resultText}
          delta={state.resultDelta}
          onDone={handleResultDone}
        />
      )}

      {/* Feed panel */}
      {showFeed && (
        <FeedPanel
          flags={state.flags}
          cardCount={state.cardCount}
          onClose={() => setShowFeed(false)}
        />
      )}

      {/* Settings panel */}
      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          lang={lang}
          onChangeLang={onChangeLang}
        />
      )}
    </div>
  );
}

// ─── App with Error Boundary & Language Provider ─────────────────────────────

export default function App() {
  const [lang, setLang] = useState<Lang>(detectLang);

  const handleChangeLang = useCallback((newLang: Lang) => {
    setLang(newLang);
    saveLang(newLang);
  }, []);

  return (
    <LangContext.Provider value={lang}>
      <ErrorBoundaryWrapper>
        <Game key={lang} onChangeLang={handleChangeLang} />
      </ErrorBoundaryWrapper>
    </LangContext.Provider>
  );
}
