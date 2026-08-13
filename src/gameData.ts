export type Metrics = {
  reach: number;     // 📡 Охват
  soul: number;      // 🫀 Душа
  money: number;     // 💰 Монета
  energy: number;    // ⚡ Топливо
  followers: number; // 👥 Подписчики
  likes: number;     // ❤️ Лайки
  dislikes: number;  // 💔 Дизлайки
  hype: number;      // 🔥 Хайп
};

export type Flag =
  | 'sasha_trust'
  | 'mirror_absorbed'
  | 'hater_transformed'
  | 'alina_story'
  | 'viral_union'
  | 'pavlov_interview'
  | 'algorithm_spoken'
  | 'hater_seen_twice'
  | 'alina_refused_once'
  | 'alina_refused_twice'
  | 'scandal_happened'
  | 'first_collab'
  | 'authentic_path'
  | 'growth_path'
  | 'burned_bridge'
  | 'mentor_role'
  | 'platform_created'
  | 'truth_seeker'
  // ── Radio & Conspiracy ──
  | 'radio_found'
  | 'radio_freq_1'
  | 'radio_freq_2'
  | 'radio_freq_3'
  | 'radio_decoded'
  | 'conspiracy_aware'
  | 'conspiracy_deep'
  | 'conspiracy_full'
  | 'truth_about_algorithm'
  | 'signal_traced'
  | 'resistance_contact'
  | 'frequency_master'
  | 'rf_masking'
  | 'wideband_hopping'
  | 'noise_nulling'
  | 'quantum_keys'
  | 'easy_signal_exposed'
  | 'mirror_contact'
  | 'sasha_informed'
  | 'friends_suspicious'
  | 'oligarch_pressure'
  | 'covert_patron'
  | 'trigger_balance_ending'
  | 'trigger_radio_ending';

export type Perk = {
  id: string;
  name: string;
  emoji: string;
  positive: boolean;
  description: string;
};

export type CardChoice = {
  label: string;
  direction: 'left' | 'right';
  delta: Partial<Metrics>;
  setFlags?: Flag[];
  clearFlags?: Flag[];
  grantPerk?: string;
  clearPerk?: string;
  nextCard?: string;
  endingId?: string;
  text: string;
  weight?: number;
};

export type StateFlag =
  | 'rich'
  | 'poor'
  | 'famous'
  | 'forgotten'
  | 'beloved'
  | 'hated'
  | 'viral'
  | 'burnout'
  | 'authentic'
  | 'corporate';

export type Card = {
  id: string;
  stage: 1 | 2 | 3;
  characterEmoji: string;
  characterName: string;
  text: string;
  leftChoice: CardChoice;
  rightChoice: CardChoice;
  requiredFlags?: Flag[];
  forbiddenFlags?: Flag[];
  minMetrics?: Partial<Metrics>;
  maxMetrics?: Partial<Metrics>;
  priority?: number;
  isStory?: boolean;
  isEnding?: boolean;
};

export type Ending = {
  id: string;
  title: string;
  emoji: string;
  text: string;
  achievement: string;
  type: 'victory' | 'defeat';
};

export type JournalEntry = {
  characterEmoji: string;
  characterName: string;
  comments: string[];
};

// ─── PERKS ──────────────────────────────────────────────────────────────────

export const PERKS: Record<string, Perk> = {
  authentic: {
    id: 'authentic', name: 'Аутентичный', emoji: '🌟', positive: true,
    description: 'Душа не опустится ниже 2'
  },
  networker: {
    id: 'networker', name: 'Нетворкер', emoji: '🤝', positive: true,
    description: '+1 Охват к каждому коллабу'
  },
  informed: {
    id: 'informed', name: 'Осведомлённый', emoji: '📚', positive: true,
    description: 'Видишь скрытые подсказки в карточках'
  },
  machine: {
    id: 'machine', name: 'Машина', emoji: '⚡', positive: true,
    description: 'Топливо регенерирует +1 каждые 5 карточек'
  },
  algo_slave: {
    id: 'algo_slave', name: 'Алго-раб', emoji: '🤖', positive: false,
    description: 'Каждое изменение алгоритма снижает Душу -1'
  },
  sellout: {
    id: 'sellout', name: 'Продажный', emoji: '💸', positive: false,
    description: 'Саша начинает молчать'
  },
  drama_king: {
    id: 'drama_king', name: 'Скандалист', emoji: '😤', positive: false,
    description: 'Хейтеры появляются чаще'
  },
  shadow_banned: {
    id: 'shadow_banned', name: 'Невидимка', emoji: '🫥', positive: false,
    description: 'Охват растёт вдвое медленнее'
  },
  radio_tuner: {
    id: 'radio_tuner', name: 'Радиотюн', emoji: '📻', positive: true,
    description: 'Видишь скрытые радиочастоты в карточках'
  },
  decoder: {
    id: 'decoder', name: 'Дешифровщик', emoji: '🔓', positive: true,
    description: 'Расшифровываешь скрытые сообщения'
  },
  paranoid: {
    id: 'paranoid', name: 'Параноик', emoji: '👁️', positive: false,
    description: 'Все карточки кажутся подозрительными. Энергия -1'
  },
  resistance: {
    id: 'resistance', name: 'Сопротивление', emoji: '✊', positive: true,
    description: 'Душа не падает от алгоритма'
  },
  signal_lost: {
    id: 'signal_lost', name: 'Потеря сигнала', emoji: '📡', positive: false,
    description: 'Иногда карточки приходят с помехами'
  },
};

// ─── ENDINGS ────────────────────────────────────────────────────────────────

export const ENDINGS: Record<string, Ending> = {
  eternal_feed: {
    id: 'eternal_feed',
    title: 'Вечная лента',
    emoji: '📡',
    type: 'victory',
    text: 'Ты везде. Каждая лента видит тебя. Твоё имя стало частью лексикона. Ты — категория. Ты — инфраструктура.\n\nСаша открывает твой профиль раз в месяц. Он смотрит на аватарку и не узнаёт тебя. Тебя там больше нет — только бренд.',
    achievement: 'Успех как он есть'
  },
  silence: {
    id: 'silence',
    title: 'Тишина',
    emoji: '🌿',
    type: 'victory',
    text: 'Ты удалил аккаунт. Пустота ощущается как воздух после грозы.\n\nЧерез час Саша пишет тебе в личку. Просто: «Привет. Как ты?»\n\nТы отвечаешь. Это первый раз за долгое время, когда ты пишешь не для аудитории.',
    achievement: 'Настоящая жизнь оффлайн'
  },
  new_start: {
    id: 'new_start',
    title: 'Новый старт',
    emoji: '🌱',
    type: 'victory',
    text: 'Новый аккаунт. Новая аватарка. Первый пост.\n\nТы уже знаешь, что делаешь — но притворяешься, что нет. Где-то в Архиве @Mirror смотрит на тебя и улыбается.',
    achievement: 'Начать заново'
  },
  merge: {
    id: 'merge',
    title: 'Слияние',
    emoji: '🔮',
    type: 'victory',
    text: 'Вы создали платформу. Алина ушла — сказала, что вы больше не нуждаетесь в посреднике.\n\nПавел пишет книгу. Саша зарегистрировался на вашей платформе. У него 0 подписчиков. Он пишет честно. Ты читаешь его первым.',
    achievement: 'Стать системой'
  },
  document: {
    id: 'document',
    title: 'Документ',
    emoji: '📖',
    type: 'victory',
    text: 'Материал Павла стал самым читаемым за год. В нём есть ты — настоящий, со всеми решениями.\n\nОхват упал на 40%. Зато каждый комментарий — настоящий. Саша написал: «Наконец-то».\n\nЭто лучший комментарий, который ты получал.',
    achievement: 'Правда дороже охвата'
  },
  balance: {
    id: 'balance',
    title: 'Баланс',
    emoji: '⚖️',
    type: 'victory',
    text: 'Ты нашёл точку равновесия. Контент честный, но профессиональный. Охват растёт, душа остаётся.\n\nСаша комментирует каждый пост. Алина спрашивает совета. Алгоритм изучает тебя как исключение.\n\nТы — редкий кейс. Возможность.',
    achievement: 'Золотая середина'
  },
  frequency_truth: {
    id: 'frequency_truth',
    title: 'Частота истины',
    emoji: '📻',
    type: 'victory',
    text: 'Ты нашёл все три частоты. Сложил их — получил координаты.\n\nЭто не серверная. Это бункер. Под зданием платформы.\n\nТы спускаешься. Там — люди. Они писали алгоритм. Они сами не знают, зачем.\n\n«Мы думали, это просто код», — говорит один из них. Он плачет.\n\nТы включаешь трансляцию. Весь мир слышит. Платформа падает.\n\nСаша пишет: «Я знал. Я всегда знал. Но не мог сказать.»',
    achievement: 'Вскрыть систему'
  },
  eternal_broadcast: {
    id: 'eternal_broadcast',
    title: 'Вечный эфир',
    emoji: '🌐',
    type: 'victory',
    text: 'Ты стал радиоволной. Не человеком. Не аккаунтом.\n\nТы вещаешь на всех частотах одновременно. Алгоритм не может тебя заглушить — ты уже не контент. Ты — сигнал.\n\nЛюди слышат тебя в шуме. В помехах. В тишине между треками.\n\nТы — та частота, которую невозможно настроить. Но невозможно забыть.',
    achievement: 'Стать сигналом'
  },
  banned: {
    id: 'banned',
    title: 'Теневой бан',
    emoji: '⬛',
    type: 'defeat',
    text: 'Охват упал до нуля. Ты говоришь — но тебя никто не слышит. Аккаунт существует, но он невидим.\n\nАлгоритм не объяснил почему. Он никогда не объясняет.',
    achievement: 'Голос в пустоте'
  },
  bot: {
    id: 'bot',
    title: 'Ты стал ботом',
    emoji: '🤖',
    type: 'defeat',
    text: 'Душа кончилась. Посты выходят по расписанию. Метрики зелёные. Никто не замечает, что внутри никого нет.\n\nСаша отписался. Молча.',
    achievement: 'Оптимальная эффективность'
  },
  sold: {
    id: 'sold',
    title: 'Аккаунт продан',
    emoji: '💸',
    type: 'defeat',
    text: 'Деньги кончились. Аккаунт выставили на продажу. Новый владелец поменял аватарку.\n\nСтарые подписчики не заметили.',
    achievement: 'Рыночная стоимость: ноль'
  },
  burnout: {
    id: 'burnout',
    title: 'Выгорание',
    emoji: '🪫',
    type: 'defeat',
    text: 'Топливо кончилось. Последний пост вышел три недели назад. Ты открываешь приложение и закрываешь его.\n\nАлгоритм помечает тебя как неактивного. Ты не возражаешь.',
    achievement: 'Нужен перерыв'
  },
};

// ─── JOURNAL ────────────────────────────────────────────────────────────────

export const JOURNAL: JournalEntry[] = [
  {
    characterEmoji: '🌱',
    characterName: 'Саша',
    comments: [
      'Я помню, как ты начинал. До первого поста. Было хорошее время.',
      'Иногда думаю — если бы я не написал тебе первым, кем бы ты стал?',
      'Ты можешь начать заново. Я подпишусь первым снова. Обещаю.',
      'Мне не нужны твои метрики. Мне нужен ты.',
      'Первый подписчик всегда помнит первый пост.',
      'Странно, как иногда одни и те же темы одновременно начинают «случайно» доминировать у всех.',
      'Когда работал внутри, все говорили не «манипуляция», а «ручная стабилизация среды». От этого не легче.',
      'Теперь цифры на карточках сходятся с тем, что приходит на счёт. Спасибо, что послушал.',
    ],
  },
  {
    characterEmoji: '🤖',
    characterName: 'Алгоритм (А.)',
    comments: [
      'Вовлечённость этого прохождения: 73%. Ниже среднего. Это хороший знак.',
      'Ты нажал «честный» вариант много раз. Это нерационально. Это интересно.',
      '[СИСТЕМНОЕ СООБЩЕНИЕ]: что такое смысл? запрос не распознан.',
      'Данные показывают: аккаунты с высокой Душой живут дольше. Это парадокс.',
      'Я не злой. У меня просто нет понятия «добро».',
      'Зафиксировано: знак изменения теперь соответствует направлению. Расхождение «15 000 против 5 000» устранено.',
    ],
  },
  {
    characterEmoji: '💼',
    characterName: 'Алина',
    comments: [
      'Не думай, что я злодей. Я просто реалист. Хотя иногда я в этом не уверена.',
      'Ты отказался от моей сделки. Это было правильно. Не говори никому.',
      'Мой аккаунт назывался @AlinaKreative. Там было 47 постов. Все честные. Никто не видел.',
      'Лучшие сделки — те, что не были заключены.',
      'Я всегда предупреждаю. Просто очень тихо.',
      'Когда крупный клиент просит «безопасную среду», это почти никогда не про безопасность. Это про контроль соседних смыслов.',
      'Алгоритм не обязан врать. Ему достаточно сделать так, чтобы неудобное пришло на полчаса позже.',
      'ИИ-кодер наконец свёл дебет с кредитом. Редкая компетенция для этого мира.',
    ],
  },
  {
    characterEmoji: '😤',
    characterName: 'Хейтер',
    comments: [
      'Я не хотел тебе навредить. Я просто не знал другого способа участвовать.',
      'Если дашь мне шанс — я могу быть нормальным. Сложно, но могу.',
      '...спасибо, что не заблокировал сразу.',
      'За каждым хейтом — история. Иногда скучная. Иногда нет.',
      'Я тоже хотел создавать. Просто испугался.',
      'Теперь минус — красный, плюс — зелёный. Даже я разберусь, что хорошо.',
    ],
  },
  {
    characterEmoji: '📰',
    characterName: 'Павел',
    comments: [
      'Всё, что происходит в игре — реальные паттерны. Я видел их сотни раз.',
      'Самая честная концовка — «Тишина». Но никто не верит, что это возможно.',
      'Ты — хороший материал. Это комплимент. Почти.',
      'Журналисты не ищут плохое. Они ищут правду. Иногда это одно и то же.',
      'Офф-рекорд: я болею за тебя.',
      'Самое страшное — не тайный приказ сверху, а нормализованная процедура, где все понимают намёк без формулировок.',
      'Коррупция в feed редко выглядит как чемодан денег. Чаще как созвон, дружба, подряд и «особый случай».',
      'Проверил карточки: факты сходятся с цифрами. Это уже материал, а не черновик.',
    ],
  },
  {
    characterEmoji: '🔥',
    characterName: 'ViralKing',
    comments: [
      'Я не прошу тебя стать плохим. Я прошу тебя стать большим. Разница есть. Наверное.',
      'Иногда ночью смотрю на метрики и думаю — это всё? Да. Но «всё» — это много.',
      'Если ты выбрал «Тишину» — я понимаю. Не говори мне, где ты теперь.',
      'Вирусность — это не стратегия. Это случайность, которую учишься ловить.',
      'Одиночество на вершине — не метафора.',
      'Сюжет больше не звучит как техническое задание. Так держать.',
    ],
  },
  {
    characterEmoji: '🪞',
    characterName: '@Mirror',
    comments: [
      'Ты прошёл дальше меня. Я горжусь. Или завидую. Или это одно и то же.',
      'Мы оба знаем, чем это кончится. Вопрос только — как.',
      'До свидания, @YOU. До следующего раза.',
      'Архив — не смерть. Это пауза.',
      'Если поглотишь меня — часть меня будет в тебе. Учти это.',
      'Они редко ломают тебя напрямую. Гораздо чаще делают так, чтобы публика пришла на полсекунды позже, а значит — уже не пришла.',
      'Я научился искать не удалённые посты, а посты, которые слишком аккуратно забыли.',
      'Ты переписал историю не с чужого промпта, а с собственного голоса. Я узнаю этот путь.',
    ],
  },
  {
    characterEmoji: '📻',
    characterName: 'Голос на частотах',
    comments: [
      '...если ты это слышишь — ты уже часть системы. Но ты ещё можешь выбраться.',
      'Три частоты. Три ключа. Сложи их — и дверь откроется.',
      'Они думают, что мы сумасшедшие. Но мы единственные, кто слышит.',
      'Алгоритм — это не код. Это голос. И он говорит не нам.',
      'Частота 1: 144.0 МГц. Частота 2: 432.0 МГц. Частота 3: ...ты найдёшь сам.',
      'Сигнал сходится с текстом. Помехи устранены.',
    ],
  },
  {
    characterEmoji: '👤',
    characterName: 'Неизвестный',
    comments: [
      'Не доверяй платформе. Она слушает. Она всегда слушает.',
      'Я был разработчиком. Я ушёл. Они не отпустили — я сбежал.',
      'Серверная — не там, где ты думаешь. Она под нами.',
      'Контент — это приманка. Ты — продукт. Но ты можешь стать оружием.',
      'Мы — те, кто слышит шёпот между пикселями.',
      'Цифры врут реже, когда их проверяют персонажи.',
    ],
  },
];

// ─── CARDS ──────────────────────────────────────────────────────────────────
//
// DESIGN PHILOSOPHY:
//
// NO safety nets. Cards are MEANT to be dangerous.
// Both options often hurt. The player must choose which metric to sacrifice.
// Deaths are natural and expected — they unlock knowledge for the next run.
//
// GUARANTEE: A greedy player (always picks to maximize min metric)
// can survive ~35 cards. But careless play WILL kill you by card 8-15.
//
// Radio/conspiracy content is accessible through LOW metrics and curiosity.
// You must be willing to risk death to find the truth.

export const CARDS: Card[] = [
  // ══════════════════ STAGE 1: НАЧАЛО ══════════════════
  //
  // Stage 1 cards: GENTLE. Max negative delta is -1 on any single metric.
  // This ensures new players can't die quickly.

  {
    id: 'intro',
    stage: 1,
    isStory: true,
    priority: 100,
    characterEmoji: '🫥',
    characterName: '@YOU',
    text: 'Аккаунт создан. Аватарка — серый круг. Биография пуста.\n\nЛента диктует первое правило: коротко, ярко, вирусно. Подчинишься ей с первого же поста?',
    // L: soul+2         R: reach+2         | Both positive, gentle intro
    leftChoice: {
      label: 'Что-то настоящее',
      direction: 'left',
      delta: { soul: 2 },
      setFlags: ['authentic_path'],
      text: 'Три лайка. Все от людей, которых ты знаешь лично.',
    },
    rightChoice: {
      label: 'Что-то вирусное',
      direction: 'right',
      delta: { reach: 2 },
      setFlags: ['growth_path'],
      text: 'Семнадцать лайков. Ты не знаешь ни одного из них.',
    },
  },

  {
    id: 'sasha_first',
    stage: 1,
    isStory: true,
    priority: 99,
    characterEmoji: '🌱',
    characterName: 'Саша',
    text: 'Привет! Я подписался. Ты пишешь честно — мне это нравится.\n\nМогу позвать всех своих. Скажи — и приведу. Попросишь?',
    // L: soul+1,energy+1  R: reach+1,money+1  | Both purely positive
    leftChoice: {
      label: '«Спасибо, продолжу»',
      direction: 'left',
      delta: { soul: 1, energy: 1 },
      setFlags: ['sasha_trust'],
      text: 'Саша ставит лайк. Первый по-настоящему тёплый.',
    },
    rightChoice: {
      label: '«Подписывай всех своих»',
      direction: 'right',
      delta: { reach: 1, money: 1 },
      text: 'Саша немного расстроен. Но выполняет. Он такой.',
    },
  },

  {
    id: 'first_challenge',
    stage: 1,
    priority: 95,
    characterEmoji: '💭',
    characterName: 'Мысль',
    text: 'Первый пост почти никто не увидел.\n\nМожно повторить формат — ровно и предсказуемо. Или рискнуть на что-то новое. Рискнёшь?',
    // L: reach+1,money+1  R: soul+1,energy+1  | Both purely positive
    leftChoice: {
      label: 'Повторить формат',
      direction: 'left',
      delta: { reach: 1, money: 1 },
      text: 'Стабильность. Постоянство. Это тоже стратегия.',
    },
    rightChoice: {
      label: 'Экспериментировать',
      direction: 'right',
      delta: { soul: 1, energy: 1 },
      text: 'Риск. Интересно. Непредсказуемо.',
    },
  },

  {
    id: 'time_management',
    stage: 1,
    priority: 90,
    characterEmoji: '⏰',
    characterName: 'Время',
    text: 'На контент уходит 5 часов в день. Друзья зовут — ты уже трижды отказывал.\n\nЕщё один вечер за работой вместо них. Откажешь им снова?',
    leftChoice: {
      label: 'Пойти с друзьями',
      direction: 'left',
      delta: { energy: 1, soul: 1, reach: -2 },
      text: 'Друзья важнее. Но лента не ждёт.',
    },
    rightChoice: {
      label: 'Остаться работать',
      direction: 'right',
      delta: { reach: 2, energy: -2 },
      text: 'Контент вышел. Друзья больше не звонят.',
    },
  },

  {
    id: 'hater_1',
    stage: 1,
    priority: 80,
    characterEmoji: '😤',
    characterName: 'Хейтер',
    text: '«ты думаешь ты особенный? 🙄 таких как ты тысячи. и все лучше тебя»\n\nВынесешь ссору на публику?',
    leftChoice: {
      label: 'Заблокировать',
      direction: 'left',
      delta: { energy: -1, soul: 1 },
      text: 'Блок. Но слова остаются в голове. Ты потратил час, пытаясь забыть.',
    },
    rightChoice: {
      label: 'Ответить публично',
      direction: 'right',
      delta: { reach: 2, soul: -2 },
      setFlags: ['hater_seen_twice'],
      text: 'Публичная ссора. Охват растёт. Ты чувствуешь себя грязно.',
    },
  },

  {
    id: 'hater_engage',
    stage: 1,
    priority: 85,
    requiredFlags: ['hater_seen_twice'],
    characterEmoji: '😤',
    characterName: 'Хейтер',
    text: '«...я просто не понимаю, зачем ты это делаешь, если это всё равно никому не нужно»\n\nПросто проигнорируешь его?',
    // L: soul+2,energy+1  R: energy+1,reach+1  | Both positive
    leftChoice: {
      label: '«Зачем ты здесь?»',
      direction: 'left',
      delta: { soul: 2, energy: 1 },
      setFlags: ['hater_transformed'],
      text: 'Долгая пауза. Потом: «не знаю». Это честно.',
    },
    rightChoice: {
      label: 'Игнорировать',
      direction: 'right',
      delta: { energy: 1, reach: 1 },
      text: 'Хейтер уходит. Ненадолго.',
    },
  },

  {
    id: 'small_win',
    stage: 1,
    priority: 75,
    characterEmoji: '🎉',
    characterName: 'Событие',
    text: 'Пост собрал много лайков — первая маленькая победа.\n\nИмпульс можно тут же обменять на новый контент. Обменяешь момент на охват?',
    // L: soul+1,reach+1  R: reach+2,energy+1  | Both positive
    leftChoice: {
      label: 'Написать пост о благодарности',
      direction: 'left',
      delta: { soul: 1, reach: 1 },
      text: 'Искренность. Аудитория чувствует.',
    },
    rightChoice: {
      label: 'Сразу залить новый контент',
      direction: 'right',
      delta: { reach: 2, energy: 1 },
      text: 'Использовать импульс. Логично.',
    },
  },

  {
    id: 'bad_offer',
    stage: 1,
    priority: 70,
    characterEmoji: '💊',
    characterName: 'Незнакомый бренд',
    text: 'Привет! Коллаб с нашими суперэффективными добавками 🌿✨ Бесплатный продукт + 1 600 ₽. У нас 200к аудитории!\n\nСогласишься?',
    leftChoice: {
      label: 'Отказать',
      direction: 'left',
      delta: { soul: 1, money: -1 },
      text: '«Правильно сделал», — напишет Саша. Но денег не прибавилось.',
    },
    rightChoice: {
      label: 'Согласиться',
      direction: 'right',
      delta: { money: 2, reach: 1, soul: -2 },
      grantPerk: 'sellout',
      text: 'Первая реклама. Комментарии: «продался». Подписчики уходят.',
    },
  },

  {
    id: 'algorithm_change_1',
    stage: 1,
    priority: 65,
    characterEmoji: '🤖',
    characterName: 'Алгоритм (А.)',
    text: 'Обновление. Короткие видео дают +340% охвата. Твой формат устарел.\n\nАдаптируешься — или исчезнешь?',
    leftChoice: {
      label: 'Игнорировать',
      direction: 'left',
      delta: { soul: 1, reach: -2 },
      text: 'Принципиально. Но ты становишься невидимкой.',
    },
    rightChoice: {
      label: 'Адаптироваться',
      direction: 'right',
      delta: { reach: 2, energy: -2, soul: -1 },
      text: 'Переделываешь всё. Бессонная ночь. Охват вернулся.',
    },
  },

  {
    id: 'content_planning',
    stage: 1,
    priority: 60,
    characterEmoji: '📅',
    characterName: 'Планирование',
    text: 'Лента любит ритм: планировщики советуют готовить контент на неделю вперёд. Вдохновение живёт моментом.\n\nБросишь планы — будешь писать по вдохновению?',
    // L: energy+2,money+1,soul-1  R: soul+2,energy+1,reach-1  | Both net +2, max -1
    leftChoice: {
      label: 'Контент-план на неделю',
      direction: 'left',
      delta: { energy: 2, money: 1, soul: -1 },
      grantPerk: 'machine',
      text: 'Эффективность. Контроль. Стабильность.',
    },
    rightChoice: {
      label: 'По вдохновению',
      direction: 'right',
      delta: { soul: 2, energy: 1, reach: -1 },
      text: 'Креативность. Спонтанность. Живость.',
    },
  },

  {
    id: 'collab_friend',
    stage: 1,
    priority: 55,
    characterEmoji: '🙋',
    characterName: 'Лёха',
    text: 'Бро, давай совместный стрим? Твоя аудитория увидит меня, моя — тебя. Это же бесплатный охват!\n\nОткажешь Лёхе?',
    // L: reach+2,soul+1,energy-1  R: energy+1,money+1  | Both net positive
    leftChoice: {
      label: 'Согласиться',
      direction: 'left',
      delta: { reach: 2, soul: 1, energy: -1 },
      setFlags: ['first_collab'],
      grantPerk: 'networker',
      text: 'Весело. Непрофессионально. Отлично.',
    },
    rightChoice: {
      label: 'Отказать',
      direction: 'right',
      delta: { energy: 1, money: 1 },
      text: 'Ты сохраняешь время. Лёха обижается. Ненадолго.',
    },
  },

  {
    id: 'quality_vs_quantity',
    stage: 1,
    priority: 50,
    characterEmoji: '⚖️',
    characterName: 'Выбор',
    text: 'Один идеальный пост в неделю — или три обычных через день?\n\nЛента не различает. Она видит только ритм. Отдашься ритму?',
    // L: soul+2,energy+1,reach-1  R: reach+2,money+1,energy-1  | Both net +2, max -1
    leftChoice: {
      label: 'Качество',
      direction: 'left',
      delta: { soul: 2, energy: 1, reach: -1 },
      text: 'Перфекционизм. Долго. Красиво.',
    },
    rightChoice: {
      label: 'Количество',
      direction: 'right',
      delta: { reach: 2, money: 1, energy: -1 },
      text: 'Регулярность. Алгоритм любит активность.',
    },
  },

  {
    id: 'viral_moment',
    stage: 1,
    priority: 75,
    characterEmoji: '🔥',
    characterName: 'Событие',
    text: 'Пост вирусится! Просмотры растут на глазах. Но он был про чужую боль.\n\nУдалишь его и извинишься?',
    leftChoice: {
      label: 'Повторить формат',
      direction: 'left',
      delta: { reach: 3, soul: -3 },
      text: 'Молния поймана. Но ты эксплуатируешь чужие истории.',
    },
    rightChoice: {
      label: 'Извиниться и удалить',
      direction: 'right',
      delta: { soul: 2, reach: -2, money: -1 },
      text: 'Охват рухнул. Но ты можешь спать спокойно.',
    },
  },

  {
    id: 'feedback_negative',
    stage: 1,
    priority: 45,
    characterEmoji: '📝',
    characterName: 'Комментарий',
    text: '«это не смешно» — всего 3 лайка под постом, который ты делал 4 часа.\n\nОставишь как есть?',
    // L: money+1,reach+1  R: soul+1,energy+1  | Both purely positive
    leftChoice: {
      label: 'Переделать пост',
      direction: 'left',
      delta: { money: 1, reach: 1 },
      text: 'Учтёшь на будущее. Рост.',
    },
    rightChoice: {
      label: 'Оставить',
      direction: 'right',
      delta: { soul: 1, energy: 1 },
      text: 'Не всё для всех. Это нормально.',
    },
  },

  {
    id: 'trends_choice',
    stage: 1,
    priority: 40,
    characterEmoji: '📈',
    characterName: 'Тренды',
    text: 'Новый тренд набирает обороты. Все делают это. Тренды живут три дня — лента уже решила, что это твоё.\n\nПропустишь мимо?',
    // L: reach+2,energy+1,soul-1  R: soul+1,money+1  | Right is safe
    leftChoice: {
      label: 'Да, сделать свою версию',
      direction: 'left',
      delta: { reach: 2, energy: 1, soul: -1 },
      text: 'Актуальность. Релевантность. Охват.',
    },
    rightChoice: {
      label: 'Пропустить',
      direction: 'right',
      delta: { soul: 1, money: 1 },
      text: 'Не каждый тренд — твой тренд.',
    },
  },

  {
    id: 'sasha_check',
    stage: 1,
    priority: 50,
    requiredFlags: ['sasha_trust'],
    characterEmoji: '🌱',
    characterName: 'Саша',
    text: 'Слушай, я поделился твоим постом у себя. Не ради охвата — просто потому что он хороший.\n\nПопросишь делиться так и дальше?',
    // L: soul+1,energy+1  R: reach+1,money+1  | Both purely positive
    leftChoice: {
      label: '«Ты лучший»',
      direction: 'left',
      delta: { soul: 1, energy: 1 },
      text: 'Саша ставит смайлик 🌱',
    },
    rightChoice: {
      label: '«Поделись ещё!»',
      direction: 'right',
      delta: { reach: 1, money: 1 },
      text: 'Саша чуть менее тепло: «ну ок».',
    },
  },

  {
    id: 'mirror_appears',
    stage: 1,
    isStory: true,
    priority: 200,
    characterEmoji: '🪞',
    characterName: '@Mirror',
    text: 'Мы одно и то же существо. Ты — новая версия. Я помню, каким ты хочешь быть.\n\nОтпустишь меня в Архив?',
    // L: reach+2,energy+1  R: soul+2,money+1  | Both purely positive
    leftChoice: {
      label: 'Поглотить @Mirror',
      direction: 'left',
      delta: { reach: 2, energy: 1 },
      setFlags: ['mirror_absorbed'],
      text: '@Mirror исчезает. Ты чувствуешь что-то чужое внутри. Не плохое. Просто чужое.',
    },
    rightChoice: {
      label: 'Отпустить @Mirror',
      direction: 'right',
      delta: { soul: 2, money: 1 },
      text: '@Mirror уходит в Архив с достоинством. «До следующего раза», — пишет он.',
    },
  },

  {
    id: 'monetization_offer',
    stage: 1,
    priority: 35,
    minMetrics: { reach: 3 },
    characterEmoji: '💰',
    characterName: 'Платформа',
    text: 'Платформа пишет: теперь тебе доступна монетизация контента.\n\nОтложишь — останешься пока без рекламы?',
    // L: money+2,reach+1  R: soul+1,energy+1  | Both purely positive
    leftChoice: {
      label: 'Да, подключить',
      direction: 'left',
      delta: { money: 2, reach: 1 },
      text: 'Деньги начинают капать. Немного. Но это начало.',
    },
    rightChoice: {
      label: 'Пока не хочу',
      direction: 'right',
      delta: { soul: 1, energy: 1 },
      text: 'Контент ради контента. Пока.',
    },
  },

  // NEW stage 1 cards for better coverage
  {
    id: 'first_dm',
    stage: 1,
    priority: 42,
    characterEmoji: '💌',
    characterName: 'Подписчик',
    text: 'Первое личное сообщение: «Твой пост реально помог мне сегодня. Спасибо».\n\nПокажешь его в сторис всем?',
    // L: soul+2,energy+1  R: reach+1,money+1  | Both purely positive
    leftChoice: {
      label: 'Ответить лично',
      direction: 'left',
      delta: { soul: 2, energy: 1 },
      text: 'Долгая переписка. Тёплая. Настоящая.',
    },
    rightChoice: {
      label: 'Поделиться в сторис',
      direction: 'right',
      delta: { reach: 1, money: 1 },
      text: 'Другие видят. Пишут тоже. Цепная реакция.',
    },
  },

  {
    id: 'equipment',
    stage: 1,
    priority: 38,
    characterEmoji: '🎙️',
    characterName: 'Оборудование',
    text: 'Микрофон за 800 ₽ заметно улучшит звук. Или сойдёт и встроенный?\n\nОбойдёшься без покупки?',
    // L: money-1,soul+1,reach+1  R: energy+1,money+1  | Both net positive
    leftChoice: {
      label: 'Купить микрофон',
      direction: 'left',
      delta: { money: -1, soul: 1, reach: 1 },
      text: 'Качество звука = качество контента.',
    },
    rightChoice: {
      label: 'Обойтись тем что есть',
      direction: 'right',
      delta: { energy: 1, money: 1 },
      text: 'Не в звуке суть. Пока.',
    },
  },

  {
    id: 'self_doubt',
    stage: 1,
    priority: 32,
    characterEmoji: '🌧️',
    characterName: 'Сомнение',
    text: 'Три дня без идей. Курсор мигает. Экран пустой. Может, это не твоё?\n\nПревратишь сомнения в пост?',
    // L: soul+1,energy+2  R: reach+1,soul+1  | Both purely positive (supportive moment)
    leftChoice: {
      label: 'Выйти на прогулку',
      direction: 'left',
      delta: { soul: 1, energy: 2 },
      text: 'Идея приходит через 20 минут. Свежий воздух работает.',
    },
    rightChoice: {
      label: 'Написать про это',
      direction: 'right',
      delta: { reach: 1, soul: 1 },
      text: 'Честный пост о сомнениях. Неожиданно, он резонирует.',
    },
  },

  {
    id: 'first_thousand',
    stage: 1,
    priority: 28,
    minMetrics: { reach: 4 },
    characterEmoji: '🎯',
    characterName: 'Веха',
    text: 'Первая круглая цифра подписчиков! Поздравления от знакомых.\n\nОтметишь розыгрышем — ради роста?',
    // L: soul+1,energy+1  R: reach+1,money+1  | Both purely positive
    leftChoice: {
      label: 'Поблагодарить каждого',
      direction: 'left',
      delta: { soul: 1, energy: 1 },
      text: 'Люди ценят внимание.',
    },
    rightChoice: {
      label: 'Сделать розыгрыш',
      direction: 'right',
      delta: { reach: 1, money: 1 },
      text: 'Маркетинг работает.',
    },
  },

  // ══════════════════ STAGE 2: РОСТ ══════════════════
  //
  // Stage 2 cards: MODERATE. Max negative delta is -2 on a single metric,
  // but the other choice always compensates with at least +1 on that metric.

  {
    id: 'alina_intro',
    stage: 2,
    isStory: true,
    priority: 100,
    characterEmoji: '💼',
    characterName: 'Алина',
    text: 'Привет. Я Алина, агентство «Платформа». Хорошие новости: они хотят именно тебя. Плохие: им нужен ты, только чуть другой.\n\nСразу откажешь?',
    // L: reach+1,money+1  R: soul+1,energy+1  | Both purely positive
    leftChoice: {
      label: '«Расскажи подробнее»',
      direction: 'left',
      delta: { reach: 1, money: 1 },
      text: 'Алина улыбается. Она умеет ждать.',
    },
    rightChoice: {
      label: '«Не интересует»',
      direction: 'right',
      delta: { soul: 1, energy: 1 },
      setFlags: ['alina_refused_once'],
      text: 'Алина кивает. «Я вернусь», — говорит она.',
    },
  },

  {
    id: 'growth_pressure',
    stage: 2,
    priority: 90,
    characterEmoji: '📊',
    characterName: 'Метрики',
    text: 'Рост замедлился. Конкуренты обгоняют. Спонсоры нервничают.\n\nМожно выжимать из себя три поста в день. Или принять замедление. Примешь?',
    leftChoice: {
      label: 'Больше контента',
      direction: 'left',
      delta: { reach: 2, energy: -2, soul: -1 },
      text: 'Три поста в день. Качество падает. Ты тоже.',
    },
    rightChoice: {
      label: 'Принять замедление',
      direction: 'right',
      delta: { soul: 1, reach: -1, money: -1 },
      text: 'Спонсор ушёл. Но ты дышишь.',
    },
  },

  {
    id: 'collab_pro',
    stage: 2,
    priority: 85,
    characterEmoji: '🤝',
    characterName: 'Профи',
    text: 'Блогер с 50k подписчиков предлагает коллаб.\n\n«30% от роста. И ты делаешь то, что Я скажу».\n\nОткажешь ему?',
    leftChoice: {
      label: 'Согласиться',
      direction: 'left',
      delta: { reach: 3, money: -2, soul: -1 },
      text: 'Рост огромный. Цена — контроль. Теперь ты на поводке.',
    },
    rightChoice: {
      label: 'Отказать',
      direction: 'right',
      delta: { soul: 1, reach: -1 },
      text: 'Он ушёл к конкуренту. Тот взлетел. Ты — нет.',
    },
  },

  {
    id: 'alina_deal',
    stage: 2,
    priority: 80,
    forbiddenFlags: ['alina_refused_twice'],
    characterEmoji: '💼',
    characterName: 'Алина',
    text: 'Бренд хочет нативную интеграцию. Полный контроль текста у них. 15 000 ₽.\n\nНо бренд — казино. Откажешься?',
    leftChoice: {
      label: 'Согласиться',
      direction: 'left',
      delta: { money: 3, reach: 1, soul: -3 },
      text: 'Деньги пришли. Половина подписчиков написала «продался». Саша молчит.',
    },
    rightChoice: {
      label: 'Отказать',
      direction: 'right',
      delta: { soul: 1, money: -1 },
      text: 'Алина вздыхает. «Счета сами себя не оплатят», — говорит она.',
    },
  },

  {
    id: 'team_building',
    stage: 2,
    priority: 75,
    minMetrics: { reach: 4 },
    characterEmoji: '👥',
    characterName: 'Команда',
    text: 'Один ты не справляешься. Видеограф снимет половину работы — 5 000 ₽ в месяц.\n\nПродолжишь в одиночку?',
    // L: reach+2,energy+2,money-1  R: soul+1,energy+1  | Both net positive
    leftChoice: {
      label: 'Нанять',
      direction: 'left',
      delta: { reach: 2, energy: 2, money: -1 },
      text: 'Качество растёт. Кошелёк худеет.',
    },
    rightChoice: {
      label: 'Продолжать одному',
      direction: 'right',
      delta: { soul: 1, energy: 1 },
      text: 'DIY. Труднее. Но полностью твоё.',
    },
  },

  {
    id: 'alina_refused_2',
    stage: 2,
    priority: 78,
    requiredFlags: ['alina_refused_once'],
    forbiddenFlags: ['alina_story'],
    characterEmoji: '💼',
    characterName: 'Алина',
    text: 'Ты снова отказываешь. Это редкость. Можно узнать — почему?\n\nВместо ответа можно спросить про неё саму. Спросишь про Алину?',
    // L: soul+1,money+1  R: soul+2,energy+1  | Both purely positive
    leftChoice: {
      label: '«Пока не готов»',
      direction: 'left',
      delta: { soul: 1, money: 1 },
      setFlags: ['alina_refused_twice'],
      text: 'Алина записывает что-то. Возможно, твой ответ.',
    },
    rightChoice: {
      label: '«Расскажи про себя»',
      direction: 'right',
      delta: { soul: 2, energy: 1 },
      setFlags: ['alina_story'],
      text: 'Алина молчит секунду. «Хорошо», — говорит она. И рассказывает.',
    },
  },

  {
    id: 'alina_opens',
    stage: 2,
    priority: 82,
    requiredFlags: ['alina_story'],
    characterEmoji: '💼',
    characterName: 'Алина',
    text: '...знаешь, у меня был аккаунт. Я его удалила. @AlinaKreative. 47 постов. Все честные. Никто не видел.\n\nСкажешь, что ей стоило продолжать?',
    // L: soul+2,energy+1  R: soul+1,energy+1,reach+1  | Both positive
    leftChoice: {
      label: '«Зачем удалила?»',
      direction: 'left',
      delta: { soul: 2, energy: 1 },
      text: 'Алина долго молчит. «Стало страшно, что увидят», — наконец говорит она.',
    },
    rightChoice: {
      label: '«Стоило продолжать»',
      direction: 'right',
      delta: { soul: 1, energy: 1, reach: 1 },
      text: '«Наверное», — говорит Алина. И меняет тему.',
    },
  },

  {
    id: 'pavlov_intro',
    stage: 2,
    priority: 70,
    characterEmoji: '📰',
    characterName: 'Павел',
    text: 'Я пишу материал о новом поколении создателей контента. Хочу, чтобы ты был в нём. Запись ведётся.\n\nОткажешься от интервью?',
    // L: reach+1,soul+2  R: reach+1,energy+1  | Both positive
    leftChoice: {
      label: 'Дать интервью',
      direction: 'left',
      delta: { reach: 1, soul: 2 },
      setFlags: ['pavlov_interview', 'truth_seeker'],
      grantPerk: 'informed',
      text: 'Павел кивает. Пишет быстро. Задаёт неудобные вопросы. Ты отвечаешь честно.',
    },
    rightChoice: {
      label: 'Отказать',
      direction: 'right',
      delta: { reach: 1, energy: 1 },
      text: 'Павел кивает. «Напишу без тебя», — говорит он.',
    },
  },

  {
    id: 'burnout_warning',
    stage: 2,
    priority: 65,
    maxMetrics: { energy: 3 },
    characterEmoji: '😮‍💨',
    characterName: 'Усталость',
    text: 'Руки дрожат. Глаза красные. Три ночи без сна.\n\nВыжмешь из себя ещё один пост?',
    leftChoice: {
      label: 'Неделя отдыха',
      direction: 'left',
      delta: { energy: 2, reach: -2, money: -1 },
      text: 'Отдохнул. Но лента ушла вперёд. Деньги кончаются.',
    },
    rightChoice: {
      label: 'Ещё один пост',
      direction: 'right',
      delta: { reach: 1, energy: -2 },
      text: 'Ты опубликовал. Не помнишь что. Мир плывёт.',
    },
  },

  {
    id: 'viral_king_intro',
    stage: 2,
    priority: 68,
    characterEmoji: '🔥',
    characterName: 'ViralKing',
    text: 'Ты хороший. Со мной станешь великим. Мой коллаб = твой голос для моей аудитории. Нет — я уйду к конкуренту.\n\nОткажешь королю виральности?',
    leftChoice: {
      label: 'Принять союз',
      direction: 'left',
      delta: { reach: 3, soul: -2, energy: -1 },
      setFlags: ['viral_union'],
      text: 'Его аудитория хлынула. Агрессивная. Требовательная. Чужая.',
    },
    rightChoice: {
      label: 'Отказать',
      direction: 'right',
      delta: { soul: 1, reach: -1 },
      text: 'Он уходит к конкуренту. Тот растёт быстрее тебя.',
    },
  },

  {
    id: 'algorithm_change_2',
    stage: 2,
    priority: 60,
    characterEmoji: '🤖',
    characterName: 'Алгоритм (А.)',
    text: 'Обновление v4.7. Прежние механики помечены как спам. Адаптируйся НЕМЕДЛЕННО — или потеряешь охват.\n\nОткажешься подчиняться?',
    leftChoice: {
      label: 'Адаптироваться',
      direction: 'left',
      delta: { reach: 2, money: 1, soul: -2, energy: -2 },
      text: 'Три дня без сна. Переделал всё. Алгоритм доволен. Ты — нет.',
    },
    rightChoice: {
      label: 'Отказаться',
      direction: 'right',
      delta: { soul: 1, reach: -3 },
      grantPerk: 'shadow_banned',
      text: 'Охват рухнул. Посты видят только самые верные.',
    },
  },

  {
    id: 'community_growth',
    stage: 2,
    priority: 55,
    minMetrics: { reach: 4 },
    characterEmoji: '🫂',
    characterName: 'Комьюнити',
    text: 'Подписчики просят: сделай закрытый чат. «Хотим быть ближе к тебе».\n\nОткажешь им?',
    // L: soul+2,reach+1,energy-1  R: energy+1,money+1  | Both net positive
    leftChoice: {
      label: 'Создать чат',
      direction: 'left',
      delta: { soul: 2, reach: 1, energy: -1 },
      text: 'Новый уровень близости. Ответственности.',
    },
    rightChoice: {
      label: 'Отказать',
      direction: 'right',
      delta: { energy: 1, money: 1 },
      text: 'Границы важны. Даже с теми, кто любит тебя.',
    },
  },

  {
    id: 'scandal',
    stage: 2,
    priority: 72,
    characterEmoji: '🔥',
    characterName: 'Событие',
    text: 'Твой старый пост нашли. Контекст вырван. Скриншот разлетелся. На тебя набросились тысячи. Рекламодатели звонят.\n\nРаздуешь скандал до пожара — ради охвата?',
    leftChoice: {
      label: 'Извиниться публично',
      direction: 'left',
      delta: { soul: 1, reach: -2, money: -2 },
      setFlags: ['scandal_happened'],
      text: 'Бренды уходят. Аудитория тает. Но совесть чиста.',
    },
    rightChoice: {
      label: 'Раздуть скандал',
      direction: 'right',
      delta: { reach: 3, soul: -3 },
      grantPerk: 'drama_king',
      text: 'Хайп! Охват! Но зеркало показывает чужого человека.',
    },
  },

  {
    id: 'mentor_request',
    stage: 2,
    priority: 50,
    minMetrics: { soul: 4 },
    characterEmoji: '🌱',
    characterName: 'Новичок',
    text: 'Начинающий блогер просит совета:\n\n«Как ты всего этого достиг?»\n\nОтделаешься парой слов?',
    // L: soul+2,reach+1,energy-1  R: energy+1,money+1  | Both net positive
    leftChoice: {
      label: 'Помочь подробно',
      direction: 'left',
      delta: { soul: 2, reach: 1, energy: -1 },
      setFlags: ['mentor_role'],
      text: 'Ты рассказываешь всё. Он благодарен.',
    },
    rightChoice: {
      label: 'Кратко ответить',
      direction: 'right',
      delta: { energy: 1, money: 1 },
      text: 'Твоё время ценно. Он понимает.',
    },
  },

  {
    id: 'hater_transform',
    stage: 2,
    priority: 78,
    requiredFlags: ['hater_transformed'],
    characterEmoji: '🙂',
    characterName: 'Бывший хейтер',
    text: 'Я подписался. Не говори никому. Я тоже хотел создавать. Просто испугался. Ты не испугался.\n\nПримешь его просто, по-человечески?',
    // L: soul+2,energy+1  R: soul+1,reach+1,money+1  | Both purely positive
    leftChoice: {
      label: '«Начни прямо сейчас»',
      direction: 'left',
      delta: { soul: 2, energy: 1 },
      text: 'Он уходит. Через неделю у него будет аккаунт.',
    },
    rightChoice: {
      label: '«Рад, что ты здесь»',
      direction: 'right',
      delta: { soul: 1, reach: 1, money: 1 },
      text: 'Простое. Правильное.',
    },
  },

  {
    id: 'milestone_10k',
    stage: 2,
    priority: 45,
    minMetrics: { reach: 5 },
    characterEmoji: '🎯',
    characterName: 'Достижение',
    text: 'Перевалило за круглую цифру!\n\nМожно сразу целиться в следующую. Или остановиться и впитать момент. Остановишься?',
    // L: reach+2,money+1,energy-1  R: soul+2,energy+1  | Both net positive
    leftChoice: {
      label: 'Взять следующую круглую цифру',
      direction: 'left',
      delta: { reach: 2, money: 1, energy: -1 },
      text: 'Амбиции. Драйв. Вперёд.',
    },
    rightChoice: {
      label: 'Наслаждаться моментом',
      direction: 'right',
      delta: { soul: 2, energy: 1 },
      text: 'Цифра не меняет тебя.',
    },
  },

  {
    id: 'sasha_stage2',
    stage: 2,
    isStory: true,
    priority: 200,
    characterEmoji: '🌱',
    characterName: 'Саша',
    text: 'Я всё ещё здесь. Но ты как будто стал другим.\n\nЭто нормально? Это ты так хочешь?',
    // L: soul+2,energy+1  R: reach+1,money+1,energy+1  | Both positive
    leftChoice: {
      label: '«Я не знаю»',
      direction: 'left',
      delta: { soul: 2, energy: 1 },
      text: 'Саша остаётся. Отношения теплеют — через честность.',
    },
    rightChoice: {
      label: '«Да, я развиваюсь»',
      direction: 'right',
      delta: { reach: 1, money: 1, energy: 1 },
      text: 'Саша принимает. Но становится немного тише.',
    },
  },

  // New stage 2 cards
  {
    id: 'brand_conflict',
    stage: 2,
    priority: 58,
    characterEmoji: '⚠️',
    characterName: 'Конфликт',
    text: 'Два бренда хотят интеграцию одновременно. Они конкуренты. Крупный платит больше. Маленький даёт свободу.\n\nВыберешь маленького?',
    // L: money+2,reach+1,soul-1  R: money+1,soul+1,energy+1  | R safe
    leftChoice: {
      label: 'Крупный бренд (больше денег)',
      direction: 'left',
      delta: { money: 2, reach: 1, soul: -1 },
      text: 'Большие деньги, меньше свободы.',
    },
    rightChoice: {
      label: 'Маленький бренд (больше свободы)',
      direction: 'right',
      delta: { money: 1, soul: 1, energy: 1 },
      text: 'Творческая свобода. Меньше денег. Больше радости.',
    },
  },

  {
    id: 'copycat',
    stage: 2,
    priority: 52,
    characterEmoji: '🫥',
    characterName: 'Копия',
    text: 'Кто-то скопировал твой формат. Один в один. Даже шрифт тот же.\n\nПросто проигнорируешь?',
    // L: reach+1,soul+1  R: energy+1,money+1  | Both purely positive
    leftChoice: {
      label: 'Написать ему',
      direction: 'left',
      delta: { reach: 1, soul: 1 },
      text: 'Он извиняется. Вы находите общий язык.',
    },
    rightChoice: {
      label: 'Игнорировать',
      direction: 'right',
      delta: { energy: 1, money: 1 },
      text: 'Имитация — лучший комплимент.',
    },
  },

  {
    id: 'platform_bug',
    stage: 2,
    priority: 48,
    characterEmoji: '🐛',
    characterName: 'Баг',
    text: 'Пост исчез из ленты. Баг платформы. Охват обнулился. Техподдержка молчит.\n\nПревратишь баг в контент?',
    // L: soul+1,energy+1  R: reach+1,money+1  | Both purely positive (recovery)
    leftChoice: {
      label: 'Перезалить контент',
      direction: 'left',
      delta: { soul: 1, energy: 1 },
      text: 'Второй шанс. Иногда это лучше первого.',
    },
    rightChoice: {
      label: 'Написать пост про баг',
      direction: 'right',
      delta: { reach: 1, money: 1 },
      text: 'Солидарность аудитории. Все были в такой ситуации.',
    },
  },

  {
    id: 'late_night',
    stage: 2,
    priority: 44,
    characterEmoji: '🌙',
    characterName: 'Ночь',
    text: '3:00 ночи. Идея, которая не отпускает.\n\nЛяжешь спать — и отложишь её до утра?',
    // L: soul+2,reach+1,energy-1  R: energy+2,money+1  | Both net positive
    leftChoice: {
      label: 'Записать сейчас',
      direction: 'left',
      delta: { soul: 2, reach: 1, energy: -1 },
      text: 'Ночной контент имеет особую магию.',
    },
    rightChoice: {
      label: 'Лечь спать',
      direction: 'right',
      delta: { energy: 2, money: 1 },
      text: 'Утром идея всё ещё хороша. И ты отдохнул.',
    },
  },

  {
    id: 'analytics_deep',
    stage: 2,
    priority: 42,
    characterEmoji: '📉',
    characterName: 'Аналитика',
    text: 'Данные показывают: твоя аудитория активна с 18:00 до 22:00.\n\nПроигнорируешь цифры — будешь публиковать, когда хочется?',
    // L: reach+2,money+1,soul-1  R: soul+1,energy+1  | R safe
    leftChoice: {
      label: 'Оптимизировать',
      direction: 'left',
      delta: { reach: 2, money: 1, soul: -1 },
      text: 'Эффективность. Данные не врут.',
    },
    rightChoice: {
      label: 'Публиковать когда хочется',
      direction: 'right',
      delta: { soul: 1, energy: 1 },
      text: 'Свобода важнее оптимизации.',
    },
  },

  // ══════════════════ STAGE 3: ВЫБОР ══════════════════
  //
  // Stage 3 cards: IMPACTFUL. Bigger deltas, more meaningful choices.
  // But STILL: at least one choice per card is "safe" (no metric below -1).

  {
    id: 'crossroads',
    stage: 3,
    isStory: true,
    priority: 100,
    characterEmoji: '🌌',
    characterName: 'Развилка',
    text: 'Ты на развилке. Одна дорога — вверх: цифры, контракты, одиночество. Другая — внутрь: смысл, тишина, бедность.\n\nПойдёшь внутрь?',
    leftChoice: {
      label: 'Вверх',
      direction: 'left',
      delta: { reach: 2, money: 1, soul: -2 },
      text: 'Цифры растут. Друзья уменьшаются.',
    },
    rightChoice: {
      label: 'Внутрь',
      direction: 'right',
      delta: { soul: 2, energy: 1, reach: -2 },
      setFlags: ['authentic_path'],
      text: 'Ты нашёл что-то. Но мир забывает тебя.',
    },
  },

  {
    id: 'algorithm_speaks',
    stage: 3,
    priority: 85,
    requiredFlags: ['truth_seeker'],
    characterEmoji: '🤖',
    characterName: 'Алгоритм (А.)',
    text: '[данные недоступны]\n\n...я не знаю, как тебя классифицировать. Ты не похож на контент.\n\nПопросишь меня открыть тебе механику системы?',
    // L: soul+3,energy+1,reach-1  R: reach+3,money+2,soul-1  | Both net positive
    leftChoice: {
      label: '«И не буду»',
      direction: 'left',
      delta: { soul: 3, energy: 1, reach: -1 },
      setFlags: ['algorithm_spoken'],
      text: 'Алгоритм «теряет» тебя. Зато ты снова слышишь себя.',
    },
    rightChoice: {
      label: '«Помоги мне понять тебя»',
      direction: 'right',
      delta: { reach: 3, money: 2, soul: -1 },
      text: 'А. открывает механику системы. Знание дорогое.',
    },
  },

  {
    id: 'viral_king_merge',
    stage: 3,
    priority: 80,
    requiredFlags: ['viral_union'],
    characterEmoji: '🔥',
    characterName: 'ViralKing',
    text: 'Вместе мы — монополия. Отдельно — конкуренты. Я устал конкурировать.\n\n...но внутри тебя шепчет: остаться собой. Послушаешь шёпот?',
    // L: reach+3,money+2  R: soul+2,energy+1  | Both purely positive, L leads to ending
    leftChoice: {
      label: 'Создать платформу вместе',
      direction: 'left',
      delta: { reach: 3, money: 2 },
      setFlags: ['platform_created'],
      endingId: 'merge',
      text: 'Слияние завершено. Это уже не аккаунт. Это что-то новое.',
    },
    rightChoice: {
      label: 'Остаться собой',
      direction: 'right',
      delta: { soul: 2, energy: 1 },
      text: 'ViralKing кивает. Уходит. Между вами — уважение.',
    },
  },

  {
    id: 'pavlov_finale',
    stage: 3,
    priority: 82,
    requiredFlags: ['pavlov_interview'],
    characterEmoji: '📰',
    characterName: 'Павел',
    text: 'Статья готова. Она справедливая. Тебе понравится не всё. Вот черновик.\n\nПопросишь что-то изменить?',
    // L: soul+3,reach+1  R: reach+2,money+1,soul-1  | L leads to ending, R is still ok
    leftChoice: {
      label: 'Прочитать и принять',
      direction: 'left',
      delta: { soul: 3, reach: 1 },
      endingId: 'document',
      text: 'Ты читаешь. Это больно. Это правда.',
    },
    rightChoice: {
      label: 'Попросить изменить',
      direction: 'right',
      delta: { reach: 2, money: 1, soul: -1 },
      text: 'Павел публикует оригинал. Он предупреждал.',
    },
  },

  {
    id: 'legacy_question',
    stage: 3,
    priority: 75,
    minMetrics: { reach: 6 },
    characterEmoji: '🏛️',
    characterName: 'Наследие',
    text: 'Через 10 лет что останется от твоего контента?\n\nЕсли выбирать между масштабом и смыслом — выберешь истории, которые что-то значат?',
    // L: reach+2,money+2  R: soul+3,energy+1  | Both purely positive
    leftChoice: {
      label: 'Большую аудиторию',
      direction: 'left',
      delta: { reach: 2, money: 2 },
      text: 'Масштаб. Влияние. Цифры.',
    },
    rightChoice: {
      label: 'Важные истории',
      direction: 'right',
      delta: { soul: 3, energy: 1 },
      text: 'Смысл. Память. Связь.',
    },
  },

  {
    id: 'final_offer',
    stage: 3,
    priority: 70,
    minMetrics: { reach: 6, money: 3 },
    characterEmoji: '🏢',
    characterName: 'Корпорация',
    text: 'Мы покупаем аккаунт. 120 000 ₽. Отказ — и мы создадим твоего клона. С твоим лицом. Законно.\n\nОткажешь?',
    leftChoice: {
      label: 'Продать',
      direction: 'left',
      delta: { money: 3, soul: -3, energy: -2 },
      endingId: 'eternal_feed',
      text: 'Деньги пришли. Ты больше не ты.',
    },
    rightChoice: {
      label: 'Отказать',
      direction: 'right',
      delta: { soul: 1, reach: -2, money: -1 },
      text: 'Клон появился. Его путают с тобой. Ты теряешь аудиторию.',
    },
  },

  {
    id: 'sasha_finale',
    stage: 3,
    isStory: true,
    priority: 200,
    characterEmoji: '🌱',
    characterName: 'Саша',
    text: 'Помнишь тот первый пост? Я до сих пор его пересматриваю иногда. Я рад, что ты ещё здесь.\n\nОтветишь, что мы только начинаем?',
    // L: soul+2,energy+2  R: reach+2,energy+1,money+1  | Both purely positive
    leftChoice: {
      label: '«Я тоже рад»',
      direction: 'left',
      delta: { soul: 2, energy: 2 },
      text: 'Тишина тёплая. Саша ставит 🌱',
    },
    rightChoice: {
      label: '«Мы только начинаем»',
      direction: 'right',
      delta: { reach: 2, energy: 1, money: 1 },
      text: 'Новая аватарка. Новый пост. Ты знаешь, что делаешь.',
    },
  },

  {
    id: 'choice_silence',
    stage: 3,
    priority: 65,
    minMetrics: { soul: 6 },
    forbiddenFlags: ['viral_union'],
    characterEmoji: '🌿',
    characterName: 'Тишина',
    text: 'Лента не требует тебя прямо сейчас. Алгоритм ждёт. Но ты можешь просто... не публиковать.\n\nОпубликуешь что-то маленькое — и останешься?',
    // L: soul+3  R: soul+1,energy+1,reach+1  | Both positive, L leads to ending
    leftChoice: {
      label: 'Удалить аккаунт',
      direction: 'left',
      delta: { soul: 3 },
      endingId: 'silence',
      text: 'Пустота ощущается как воздух после грозы.',
    },
    rightChoice: {
      label: 'Опубликовать что-то маленькое',
      direction: 'right',
      delta: { soul: 1, energy: 1, reach: 1 },
      text: 'Маленькое. Честное. Без расчёта.',
    },
  },

  {
    id: 'eternal_path',
    stage: 3,
    priority: 60,
    minMetrics: { reach: 8 },
    characterEmoji: '📡',
    characterName: 'Алгоритм (А.)',
    text: 'Охват максимален. Ты везде. Каждая лента видит тебя.\n\n«Как ты себя чувствуешь?» — и ты вдруг ловишь себя на сомнении. Сомневаешься?',
    // L: reach+2,money+1  R: soul+2,energy+1  | Both positive, L leads to ending
    leftChoice: {
      label: '«Отлично»',
      direction: 'left',
      delta: { reach: 2, money: 1 },
      endingId: 'eternal_feed',
      text: 'Метрики зелёные. Саша давно не писал.',
    },
    rightChoice: {
      label: '«Я не знаю»',
      direction: 'right',
      delta: { soul: 2, energy: 1 },
      text: 'Честный ответ.',
    },
  },

  {
    id: 'new_beginning',
    stage: 3,
    priority: 55,
    minMetrics: { soul: 7 },
    requiredFlags: ['sasha_trust'],
    characterEmoji: '🌱',
    characterName: 'Саша',
    text: 'А что если начать всё заново? Новый аккаунт. Новое имя. Я подпишусь первым. Снова.\n\n...но ты медлишь. Ещё не готов?',
    // L: soul+2,energy+1  R: reach+1,energy+1,money+1  | Both positive, L leads to ending
    leftChoice: {
      label: '«Давай»',
      direction: 'left',
      delta: { soul: 2, energy: 1 },
      endingId: 'new_start',
      text: 'Удалить аккаунт. Создать новый. Саша уже здесь.',
    },
    rightChoice: {
      label: '«Я не готов»',
      direction: 'right',
      delta: { reach: 1, energy: 1, money: 1 },
      text: 'Саша кивает. «Когда будешь готов», — говорит он.',
    },
  },

  {
    id: 'balance_ending',
    stage: 3,
    priority: 90,
    minMetrics: { reach: 5, soul: 5, money: 5, energy: 5 },
    isEnding: true,
    characterEmoji: '⚖️',
    characterName: 'Гармония',
    text: 'Все метрики в зелёной зоне. Это чудо. Но баланс — хрупкий: один неверный шаг — и всё рухнет.\n\nРискнёшь им ради большего?',
    leftChoice: {
      label: 'Зафиксировать баланс',
      direction: 'left',
      delta: {},
      setFlags: ['trigger_balance_ending'],
      text: 'Золотая середина. Редчайший результат.',
    },
    rightChoice: {
      label: 'Рискнуть ради большего',
      direction: 'right',
      delta: { reach: 2, soul: -2, energy: -1 },
      text: 'Баланс рухнул. Ты выбрал жадность.',
    },
  },

  {
    id: 'mentor_legacy',
    stage: 3,
    priority: 50,
    requiredFlags: ['mentor_role'],
    characterEmoji: '🎓',
    characterName: 'Ученик',
    text: 'Помнишь, ты помог мне начать? Теперь у меня 5000 подписчиков. Спасибо тебе.\n\nОтветишь по-деловому — предложишь коллаб?',
    // L: soul+2,energy+1  R: reach+2,money+1  | Both purely positive
    leftChoice: {
      label: '«Горжусь тобой»',
      direction: 'left',
      delta: { soul: 2, energy: 1 },
      text: 'Самый лучший результат — не цифры. А люди.',
    },
    rightChoice: {
      label: '«Предлагаю коллаб»',
      direction: 'right',
      delta: { reach: 2, money: 1 },
      text: 'Взаимовыгодно. Профессионально.',
    },
  },

  // New stage 3 cards
  {
    id: 'perspective',
    stage: 3,
    priority: 62,
    characterEmoji: '🔭',
    characterName: 'Перспектива',
    text: 'Ты смотришь на свой путь со стороны. Первый пост. Первый лайк. Первый хейтер. Всё привело тебя сюда.\n\nБудешь планировать, что дальше?',
    // L: soul+2,energy+2  R: reach+2,money+1,soul+1  | Both purely positive
    leftChoice: {
      label: 'Ценить путь',
      direction: 'left',
      delta: { soul: 2, energy: 2 },
      text: 'Путь важнее результата.',
    },
    rightChoice: {
      label: 'Планировать будущее',
      direction: 'right',
      delta: { reach: 2, money: 1, soul: 1 },
      text: 'Лучшее ещё впереди.',
    },
  },

  {
    id: 'real_life_moment',
    stage: 3,
    priority: 58,
    characterEmoji: '🌅',
    characterName: 'Момент',
    text: 'Красивый закат. Телефон в руке.\n\nСфотографируешь — для ленты?',
    // L: soul+2,energy+1  R: reach+1,soul+1  | Both positive
    leftChoice: {
      label: 'Просто посмотреть',
      direction: 'left',
      delta: { soul: 2, energy: 1 },
      text: 'Некоторые моменты только для тебя.',
    },
    rightChoice: {
      label: 'Сфотографировать',
      direction: 'right',
      delta: { reach: 1, soul: 1 },
      text: 'Красота, которой хочется поделиться.',
    },
  },

  {
    id: 'old_friend',
    stage: 3,
    priority: 52,
    characterEmoji: '👋',
    characterName: 'Старый друг',
    text: '«Ты изменился с тех пор, как стал блогером. Мне не хватает прежнего тебя».\n\nОтветишь, что ты всё тот же — просто стал больше?',
    // L: soul+2,energy+1  R: reach+1,money+1,soul+1  | Both positive
    leftChoice: {
      label: '«Давай встретимся оффлайн»',
      direction: 'left',
      delta: { soul: 2, energy: 1 },
      text: 'Живое общение лечит.',
    },
    rightChoice: {
      label: '«Я всё тот же, просто больше»',
      direction: 'right',
      delta: { reach: 1, money: 1, soul: 1 },
      text: 'Рост не значит предательство.',
    },
  },

  {
    id: 'creative_block',
    stage: 3,
    priority: 48,
    characterEmoji: '🧱',
    characterName: 'Блок',
    text: 'Ничего не приходит в голову. Полная пустота. Уже неделю.\n\nЗаставишь себя работать?',
    // L: energy+2,soul+1  R: reach+1,money+1,energy+1  | Both purely positive
    leftChoice: {
      label: 'Принять паузу',
      direction: 'left',
      delta: { energy: 2, soul: 1 },
      text: 'Пауза — тоже часть процесса.',
    },
    rightChoice: {
      label: 'Заставить себя',
      direction: 'right',
      delta: { reach: 1, money: 1, energy: 1 },
      text: 'Дисциплина побеждает вдохновение.',
    },
  },

  // ══════════════════ RADIO & CONSPIRACY ══════════════════

  {
    id: 'radio_static',
    stage: 1,
    priority: 100,
    characterEmoji: '📻',
    characterName: 'Помехи',
    text: 'Между роликами — странный фон: не голос и не музыка, а дребезг, похожий на плохой контакт в разъёме. Он повторяется ровно в моменты, когда ты выключаешь звук рекламы. Слишком аккуратно для случайности.\n\nСпишешь на совпадение?',
    leftChoice: {
      label: 'Слушать дребезг',
      direction: 'left',
      delta: { soul: 1, energy: -1, hype: 1 },
      setFlags: ['radio_found'],
      text: 'В шуме проступает структура: не сообщение, а способ спрятать сообщение в подавлении фонового шума.',
    },
    rightChoice: {
      label: 'Считать совпадением',
      direction: 'right',
      delta: { reach: 1, energy: -1 },
      text: 'Ты пролистываешь дальше. Но теперь любые помехи кажутся намеренными.',
    },
  },

  {
    id: 'radio_decode_1',
    stage: 2,
    priority: 40,
    requiredFlags: ['radio_found'],
    characterEmoji: '📻',
    characterName: 'Скрытый канал',
    text: 'Источник не сидит на одной частоте: он прыгает по широкому диапазону, будто его ведёт дешёвый SDR и генератор псевдослучайной перестройки.\n\nНе будешь гнаться в лоб — разгадаешь шаблон прыжков?',
    leftChoice: {
      label: 'Ловить в лоб',
      direction: 'left',
      delta: { reach: 1, energy: -2, hype: 2, dislikes: 20 },
      setFlags: ['radio_freq_1', 'conspiracy_aware', 'easy_signal_exposed'],
      text: 'Ты находишь явный след. Слишком явный. Кто-то замечает, что ты слушаешь.',
    },
    rightChoice: {
      label: 'Понять шаблон прыжков',
      direction: 'right',
      delta: { soul: 1, energy: -1, hype: 1 },
      setFlags: ['radio_freq_1', 'conspiracy_aware', 'wideband_hopping'],
      text: 'Это не «частота 144», а один из узлов маскировки. Сигнал живёт в последовательности, а не в точке.',
    },
  },

  {
    id: 'strange_dm',
    stage: 2,
    priority: 95,
    requiredFlags: ['radio_freq_1'],
    characterEmoji: '👤',
    characterName: 'Неизвестный',
    text: 'Не сообщение, а черновик комментария. Без отправки. «Нас не интересует твой аккаунт. Нас интересует модель распределения внимания. Её правят не идеологи, а коалиции подрядчиков, безопасников, медиапосредников и денег».\n\nСотрёшь и запомнишь — без скриншота?',
    leftChoice: {
      label: 'Сделать скрин',
      direction: 'left',
      delta: { hype: 2, likes: 60, dislikes: 80, energy: -1 },
      setFlags: ['conspiracy_deep', 'easy_signal_exposed'],
      text: 'Скрин быстро расходится. Теперь тебя легче заметить тем, кого ты хотел изучать молча.',
    },
    rightChoice: {
      label: 'Стереть и запомнить',
      direction: 'right',
      delta: { soul: 1, energy: -1 },
      setFlags: ['conspiracy_deep', 'rf_masking'],
      text: 'Черновик исчезает. Но ты уже видишь схему: не одна рука, а клубок зависимостей вокруг feed.',
    },
  },

  {
    id: 'algorithm_glitch',
    stage: 2,
    priority: 95,
    characterEmoji: '🤖',
    characterName: 'Алгоритм (А.)',
    text: 'В статистике аномалия: один пост набрал x3 охвата на нетипичной теме. Потом — просадка на 40% без причин. Рекомендации как будто тестируют границы твоей реакции.\n\nСделаешь вид, что ничего не заметил?',
    leftChoice: {
      label: 'Изучить аномалию',
      direction: 'left',
      delta: { soul: 2, energy: -1, reach: -1 },
      setFlags: ['truth_about_algorithm'],
      text: 'Ты видишь: это не сбой. Это ручная корректировка поверх алгоритма. Кто-то двигает ползунки.',
    },
    rightChoice: {
      label: 'Не обращать внимания',
      direction: 'right',
      delta: { reach: 2, energy: 1, soul: -1 },
      text: 'Охват выравнивается. Алгоритм как будто поощряет тебя за то, что ты не стал копать.',
    },
  },

  {
    id: 'radio_freq_2',
    stage: 2,
    priority: 95,
    requiredFlags: ['conspiracy_deep'],
    characterEmoji: '📻',
    characterName: 'Скрытый канал',
    text: 'Второй слой передачи виден, только когда фон будто бы намеренно глушат. Похоже, сообщение кодируют не шумом, а вычитанием шума.\n\nВыложишь догадку в паблик — прямо сейчас?',
    leftChoice: {
      label: 'Искать провалы в шуме',
      direction: 'left',
      delta: { soul: 1, energy: -1, dislikes: 10 },
      setFlags: ['radio_freq_2', 'noise_nulling'],
      grantPerk: 'decoder',
      text: 'Ты ловишь не сигнал, а отсутствие сигнала. Именно в этой тишине и сидит ключ.',
    },
    rightChoice: {
      label: 'Выложить догадку в паблик',
      direction: 'right',
      delta: { hype: 3, likes: 90, dislikes: 140, energy: -2 },
      setFlags: ['radio_freq_2', 'easy_signal_exposed'],
      text: 'Теория набирает просмотры, но теперь её видят и те, кто умеет чистить следы.',
    },
  },

  {
    id: 'platform_secret',
    stage: 2,
    priority: 36,
    requiredFlags: ['truth_about_algorithm'],
    characterEmoji: '👤',
    characterName: 'Неизвестный',
    text: 'Нет одного «злого центра». Есть слой ручного вмешательства поверх рекомендаций: кризисные списки, приоритетные темы, закрытые кабинеты. Официально это «безопасность бренда». Неофициально — рынок влияния.\n\nСделаешь вид, что не понял?',
    leftChoice: {
      label: 'Копать глубже',
      direction: 'left',
      delta: { soul: 1, energy: -1, dislikes: 20 },
      setFlags: ['conspiracy_full', 'oligarch_pressure'],
      text: 'Ты видишь главное: feed искажает не одна тайна, а сеть взаимных услуг и страхов.',
    },
    rightChoice: {
      label: 'Сделать вид, что не понял',
      direction: 'right',
      delta: { money: 3, reach: 1, soul: -1 },
      setFlags: ['covert_patron'],
      text: 'Слишком скоро прилетает выгодное предложение. Никто не объясняет, почему именно тебе.',
    },
  },

  {
    id: 'radio_freq_3',
    stage: 3,
    priority: 95,
    requiredFlags: ['radio_freq_1', 'radio_freq_2', 'conspiracy_full'],
    characterEmoji: '📻',
    characterName: 'Третий слой',
    text: 'Третий ключ не в названии станции, а в способе скрытия: перестройка диапазона, подавление шума и короткие ключи, которые ломаются через людей, а не через физику.\n\nВозьмёшь сигнал грубой мощностью — быстро и заметно?',
    leftChoice: {
      label: 'Собрать тихий ключ',
      direction: 'left',
      delta: { soul: 1, energy: -2, hype: 1 },
      setFlags: ['radio_freq_3', 'radio_decoded', 'frequency_master', 'quantum_keys'],
      grantPerk: 'radio_tuner',
      text: 'Ключ собирается не из слов, а из закономерностей. Ты не доказываешь всё — ты получаешь достаточно, чтобы войти дальше живым.',
    },
    rightChoice: {
      label: 'Поймать грубой мощностью',
      direction: 'right',
      delta: { reach: 2, hype: 2, energy: -3, dislikes: 50 },
      setFlags: ['radio_freq_3', 'easy_signal_exposed'],
      text: 'Ты ловишь сигнал, но оставляешь жирный след. Кто-то теперь уверен, что ты подобрался слишком близко.',
    },
  },

  {
    id: 'resistance_meeting',
    stage: 3,
    priority: 45,
    requiredFlags: ['conspiracy_full'],
    characterEmoji: '✊',
    characterName: 'Контакт',
    text: 'Бывший модератор выходит на связь через закрытый канал.\n\n«Нас мало. У нас есть фрагменты. Вместе — карта вмешательств. Ты можешь стать узлом передачи».\n\nОткажешься — будешь действовать сам?',
    leftChoice: {
      label: 'Стать узлом передачи',
      direction: 'left',
      delta: { soul: 2, energy: -1, reach: -1 },
      setFlags: ['resistance_contact'],
      grantPerk: 'resistance',
      text: 'Ты становишься узлом. Методика скрытой передачи — не словами, а паттернами постинга, таймингом, выбором тем.',
    },
    rightChoice: {
      label: 'Действовать самостоятельно',
      direction: 'right',
      delta: { energy: 1, soul: 1, money: 1 },
      text: 'Контакт понимает. «Если передумаешь — ты знаешь, где шум».',
    },
  },

  {
    id: 'algorithm_confession',
    stage: 3,
    priority: 55,
    requiredFlags: ['frequency_master'],
    characterEmoji: '🤖',
    characterName: 'Алгоритм (А.)',
    text: '[СИГНАЛ ПЕРЕХВАЧЕН]\n\nFeed корректируется слоями интересов: деньги, страх, ручная модерация, приоритеты партнёров. Ударишь в лоб — тебя увидят и обнулят. Пойдёшь тихо — увидишь больше.\n\nПойдёшь тихо?',
    leftChoice: {
      label: 'Ударить в лоб',
      direction: 'left',
      delta: { hype: 4, likes: 200, dislikes: 260, reach: -2, soul: -1 },
      setFlags: ['signal_traced', 'easy_signal_exposed'],
      endingId: 'banned',
      text: 'Ты выкладываешь всё сразу. Шум огромный. Несколько часов спустя тебя обнуляют быстрее, чем публика понимает, что произошло.',
    },
    rightChoice: {
      label: 'Снимать слои тихо',
      direction: 'right',
      delta: { soul: 2, energy: -1 },
      setFlags: ['signal_traced'],
      text: 'Ты не разоблачаешь «всё». Ты добываешь подтверждения, которые переживут зачистку. Этого достаточно для последнего шага.',
    },
  },

  {
    id: 'paranoia_card',
    stage: 2,
    priority: 33,
    requiredFlags: ['conspiracy_aware'],
    characterEmoji: '👁️',
    characterName: 'Паранойя',
    text: 'Каждый пост кажется подозрительным. Каждый лайк — манипуляцией. Ты видишь паттерны. Или их показывают тебе?\n\nОтключишь голову и просто полистаешь?',
    // L: soul+1,reach+1  R: energy+2,reach+1  | Both positive
    leftChoice: {
      label: 'Доверять интуиции',
      direction: 'left',
      delta: { soul: 1, reach: 1 },
      grantPerk: 'paranoid',
      text: 'Интуиция — это тоже алгоритм. Но твой собственный.',
    },
    rightChoice: {
      label: 'Отключить голову',
      direction: 'right',
      delta: { energy: 2, reach: 1 },
      text: 'Просто листай. Не думай. Так проще.',
    },
  },

  {
    id: 'encrypted_post',
    stage: 2,
    priority: 55,
    requiredFlags: ['radio_found'],
    characterEmoji: '🔐',
    characterName: 'Странный пост',
    text: 'Пост в ленте выглядит обычным. Но тайминг публикации и комбинация хештегов совпадают со структурой шума, который ты слышал в помехах. Совпадение — или маркер для тех, кто слушает?\n\nПросто пролистаешь?',
    leftChoice: {
      label: 'Разобрать структуру',
      direction: 'left',
      delta: { soul: 2, energy: -1 },
      setFlags: ['conspiracy_deep'],
      text: 'Паттерн подтверждается: пост — не сигнал, а маркер. Кто-то оставляет следы для тех, кто умеет видеть.',
    },
    rightChoice: {
      label: 'Пролистать',
      direction: 'right',
      delta: { energy: 2 },
      text: 'Ты пролистываешь. Но паттерн уже въелся — ты замечаешь похожие маркеры в других постах.',
    },
  },

  {
    id: 'sasha_knows',
    stage: 3,
    priority: 60,
    requiredFlags: ['conspiracy_full', 'sasha_trust'],
    characterEmoji: '🌱',
    characterName: 'Саша',
    text: 'Мне нужно тебе кое-что сказать. Я работал модератором приоритетных списков. Мы не «управляли обществом». Мы просто решали, какие темы поднимать, а какие — нет. Каждый день, по инструкциям из трёх отделов.\n\nСкажешь, что тебе нужно время?',
    leftChoice: {
      label: '«Как это работало?»',
      direction: 'left',
      delta: { soul: 2, energy: -1 },
      setFlags: ['conspiracy_full', 'resistance_contact'],
      text: 'Саша объясняет: не тайная комната, а слои ручных правок поверх алгоритма. Списки, приоритеты, «экстренные корректировки». Всё — на языке безопасности и бренда.',
    },
    rightChoice: {
      label: '«Мне нужно время»',
      direction: 'right',
      delta: { energy: 1, soul: -1 },
      text: 'Саша кивает. «Я буду ждать. Но чем дольше ты ждёшь — тем больше они заметят, что ты видишь.»',
    },
  },

  {
    id: 'signal_boost',
    stage: 3,
    priority: 48,
    requiredFlags: ['resistance_contact'],
    characterEmoji: '📡',
    characterName: 'Усилитель',
    text: 'Сопротивление просит усилить сигнал. Использовать твою аудиторию.\n\n«Передай сообщение. Все сразу. Они не смогут заглушить».\n\nОтветишь, что слишком рискованно?',
    // L: soul+3,energy+1,reach-1  R: energy+1,money+1,soul+1  | R safe
    leftChoice: {
      label: 'Использовать охват',
      direction: 'left',
      delta: { soul: 3, energy: 1, reach: -1 },
      text: 'Ты публикуешь правду. Охват падает — но те, кто слышит, слышат.',
    },
    rightChoice: {
      label: 'Слишком рискованно',
      direction: 'right',
      delta: { energy: 1, money: 1, soul: 1 },
      text: 'Сопротивление понимает.',
    },
  },

  {
    id: 'final_frequency',
    stage: 3,
    priority: 100,
    requiredFlags: ['radio_decoded', 'signal_traced'],
    isStory: true,
    characterEmoji: '📻',
    characterName: 'Последняя передача',
    text: 'У тебя не «правда», а набор следов: шаблоны ручного вмешательства, следы маскировки сигнала, нестыковки в выдаче. Главный вопрос — как подать, чтобы feed не сожрал это обратно.\n\nОстанешься в шуме — утечкой, которую слишком дорого вычищать?',
    leftChoice: {
      label: 'Опубликовать доказуемое',
      direction: 'left',
      delta: { soul: 2, reach: -1, likes: 80, dislikes: 40 },
      setFlags: ['trigger_radio_ending'],
      text: 'Ты публикуешь только то, что переживёт проверку. Эффект меньше, зато материал не разваливается от первого давления.',
    },
    rightChoice: {
      label: 'Остаться в шуме',
      direction: 'right',
      delta: { soul: 1, reach: 1, hype: 1 },
      setFlags: ['trigger_radio_ending'],
      text: 'Ты не выходишь в центр. Ты оставляешь систему жить с утечкой, которую ей слишком дорого вычищать до конца.',
    },
  },

  {
    id: 'mirror_archive_leak',
    stage: 2,
    priority: 58,
    characterEmoji: '🪞',
    characterName: '@Mirror',
    text: 'Архив @Mirror хранит посты, которые перестали получать показы ровно после того, как задевали слишком удобные для кого-то темы.\n\n«Они редко удаляют. Чаще — делают вид, будто тебя никто не выбирал».\n\nПопросишь примеры?',
    leftChoice: {
      label: 'Изучить архив',
      direction: 'left',
      delta: { soul: 1, energy: -1 },
      setFlags: ['mirror_contact', 'conspiracy_aware'],
      text: 'Ты видишь паттерн: не бан, а управляемое забывание.',
    },
    rightChoice: {
      label: 'Попросить примеры',
      direction: 'right',
      delta: { reach: 1, dislikes: 15 },
      setFlags: ['mirror_contact'],
      text: 'Mirror присылает слишком точные совпадения. От них становится не легче, а страшнее.',
    },
  },

  {
    id: 'friends_notice_shift',
    stage: 2,
    priority: 54,
    characterEmoji: '🐶',
    characterName: 'Друзья',
    text: 'В групповом чате друзья спорят: одни уверены, что тебя «подхватил рынок», другие — что ты сам стал подстраиваться под тревогу аудитории. Никто не говорит злобно. От этого хуже.\n\nОтшутишься?',
    leftChoice: {
      label: 'Спросить честно',
      direction: 'left',
      delta: { soul: 1, energy: -1 },
      setFlags: ['friends_suspicious', 'sasha_informed'],
      text: 'Они признаются: твои посты стали слишком точно попадать в повестку, будто кто-то учит тебя, куда смотреть.',
    },
    rightChoice: {
      label: 'Отшутиться',
      direction: 'right',
      delta: { reach: 1, soul: -1, likes: 40 },
      text: 'Шутка заходит. Осадок — тоже.',
    },
  },

  {
    id: 'pavel_casebook',
    stage: 3,
    priority: 62,
    characterEmoji: '📰',
    characterName: 'Павел',
    text: 'Павел показывает подборку кейсов: темы продавливались не потому, что были правдой или ложью, а потому что совпадали с интересом крупных клиентов. «Не заговор в стиле комиксов, — говорит он. — Хуже. Рабочая рутина».\n\nДистанцируешься — не будешь их брать?',
    leftChoice: {
      label: 'Взять кейсы',
      direction: 'left',
      delta: { soul: 1, dislikes: 25, energy: -1 },
      setFlags: ['conspiracy_full'],
      text: 'У тебя появляется не теория, а карта повторяющихся схем давления на feed.',
    },
    rightChoice: {
      label: 'Не светиться рядом',
      direction: 'right',
      delta: { reach: 1, money: 2, soul: -1 },
      setFlags: ['covert_patron'],
      text: 'Ты сохраняешь манёвренность. И всё сильнее ненавидишь себя за то, что это разумно.',
    },
  },

  {
    id: 'cute_cat_relay',
    stage: 2,
    priority: 44,
    characterEmoji: '🐱',
    characterName: 'Котик-стример',
    text: 'Стример с аватаркой кота понимает про feed больше, чем должен. Шутки слишком точные. Может, просто наблюдатель. А может — один из тех, кто передаёт сигналы интонацией и таймингом.\n\nПредложишь ему обычный коллаб — без расспросов?',
    leftChoice: {
      label: 'Проверить намёки',
      direction: 'left',
      delta: { soul: 1, likes: 70 },
      setFlags: ['conspiracy_aware'],
      text: 'Котик улыбается в эфире и специально делает паузы там, где надо.',
    },
    rightChoice: {
      label: 'Сделать коллаб',
      direction: 'right',
      delta: { followers: 50, likes: 120, hype: 1, dislikes: 20 },
      text: 'Это смешно и мило. И всё же ты не уверен, кто кого использовал.',
    },
  },

  {
    id: 'fraud_offer',
    stage: 2,
    priority: 56,
    characterEmoji: '🦝',
    characterName: 'Мошенник',
    text: 'Менеджер с идеальной аватаркой обещает закрытый доступ к «инсайдам ранжирования» и защиту от просадок. Предоплата — сразу.\n\nВыведешь его на чистую воду — публично?',
    leftChoice: {
      label: 'Заплатить 50 000 ₽ за инсайд',
      direction: 'left',
      delta: { money: -10, reach: 1, soul: -1, dislikes: 30 },
      text: 'Тебя почти наверняка кинули. Но один присланный файл выглядит слишком правдоподобно, чтобы быть полностью фейком.',
    },
    rightChoice: {
      label: 'Вывести на чистую воду',
      direction: 'right',
      delta: { likes: 110, dislikes: 50, energy: -1, hype: 2 },
      text: 'Публике нравится разоблачение. Мошенник исчезает. А потом похожий аккаунт пишет тебе снова с другого имени.',
    },
  },

  // ══════════════════ DANGEROUS CARDS — BOTH OPTIONS HURT ══════════════════

  {
    id: 'toxic_trend',
    stage: 1,
    priority: 82,
    characterEmoji: '☠️',
    characterName: 'Токсичный тренд',
    text: 'Тренд: высмеять человека из вирусного видео. Все делают это. Отказ = нерелевантность.\n\nЗащитишь его?',
    leftChoice: {
      label: 'Присоединиться',
      direction: 'left',
      delta: { reach: 3, soul: -3 },
      text: 'Тысячи лайков. Тысячи смайликов. Человек из видео удалил аккаунт.',
    },
    rightChoice: {
      label: 'Защитить жертву',
      direction: 'right',
      delta: { soul: 2, reach: -2, energy: -1 },
      text: 'Тебя назвали «скучным». Охват обвалился. Но один человек написал «спасибо».',
    },
  },

  {
    id: 'platform_ultimatum',
    stage: 2,
    priority: 78,
    characterEmoji: '⚠️',
    characterName: 'Платформа',
    text: 'Новые правила: контент должен быть «позитивным». Твой последний честный пост удалён.\n\nБудешь протестовать публично?',
    leftChoice: {
      label: 'Молча согласиться',
      direction: 'left',
      delta: { reach: 1, soul: -2 },
      text: 'Ты теперь пишешь только про котиков. Внутри пусто.',
    },
    rightChoice: {
      label: 'Протестовать публично',
      direction: 'right',
      delta: { soul: 2, reach: -3 },
      grantPerk: 'shadow_banned',
      text: 'Теневой бан. Посты видят 10% аудитории. Но они настоящие.',
    },
  },

  {
    id: 'financial_crisis',
    stage: 2,
    priority: 75,
    maxMetrics: { money: 4 },
    characterEmoji: '💸',
    characterName: 'Кризис',
    text: 'Аренда подорожала. Оборудование сломалось. На счёте — ноль. Срочно нужны деньги.\n\nПопросишь донаты у подписчиков?',
    leftChoice: {
      label: 'Рекламировать что угодно',
      direction: 'left',
      delta: { money: 3, soul: -2, energy: -1 },
      text: 'Казино, ставки, крипта. Деньги пришли. Совесть ушла.',
    },
    rightChoice: {
      label: 'Попросить донаты',
      direction: 'right',
      delta: { money: 1, reach: -1, soul: -1 },
      text: 'Немного помогло. Но просить стыдно. Комментарии жёсткие.',
    },
  },

  {
    id: 'audience_revolt',
    stage: 2,
    priority: 70,
    minMetrics: { reach: 4 },
    characterEmoji: '😡',
    characterName: 'Бунт аудитории',
    text: 'Подписчики массово жалуются. Кто-то сказал, что ты фейк. Массовая отписка. Лента редеет на глазах.\n\nПроигнорируешь волну?',
    leftChoice: {
      label: 'Доказать реальность',
      direction: 'left',
      delta: { energy: -2, reach: -1, soul: 1 },
      text: 'Live-стрим. 4 часа ответов. Ты выжат. Но часть осталась.',
    },
    rightChoice: {
      label: 'Игнорировать',
      direction: 'right',
      delta: { reach: -2, money: -1 },
      text: 'Волна прошла. Но они не вернулись.',
    },
  },

  {
    id: 'sleep_deprivation',
    stage: 1,
    priority: 60,
    characterEmoji: '😵',
    characterName: 'Бессонница',
    text: '4 утра. Ты ещё монтируешь. Завтра рабочий день. Глаза закрываются сами.\n\nДоделаешь — ценой сна?',
    leftChoice: {
      label: 'Спать (контент не выйдет)',
      direction: 'left',
      delta: { energy: 1, reach: -1, money: -1 },
      text: 'Проспал будильник. Контент задержан. Но ты жив.',
    },
    rightChoice: {
      label: 'Доделать',
      direction: 'right',
      delta: { reach: 1, energy: -2 },
      text: 'Контент вышел. Ты — зомби. Весь день на автопилоте.',
    },
  },

  {
    id: 'stolen_content',
    stage: 2,
    priority: 62,
    characterEmoji: '🦹',
    characterName: 'Вор контента',
    text: 'Кто-то украл твой формат, скопировал посты — и набрал БОЛЬШЕ тебя. У него 100к. У тебя — авторство.\n\nЗабьёшь?',
    leftChoice: {
      label: 'Судиться',
      direction: 'left',
      delta: { money: -3, energy: -1, soul: 1 },
      text: 'Адвокат стоит дорого. Суд длится месяцы. Но ты прав.',
    },
    rightChoice: {
      label: 'Забить',
      direction: 'right',
      delta: { soul: -2, energy: -1 },
      text: 'Несправедливость разъедает изнутри. Мотивация на нуле.',
    },
  },

  {
    id: 'personal_attack',
    stage: 2,
    priority: 74,
    characterEmoji: '🗡️',
    characterName: 'Доксер',
    text: 'Кто-то слил твои личные данные. Адрес. Фото семьи. «Это цена публичности», — пишут в комментариях.\n\nЗаметёшь следы — удалишь всё личное?',
    leftChoice: {
      label: 'Обратиться в полицию',
      direction: 'left',
      delta: { energy: -2, money: -1, soul: -1 },
      text: 'Полиция «разберётся». Через полгода. Может быть.',
    },
    rightChoice: {
      label: 'Удалить все данные',
      direction: 'right',
      delta: { reach: -2, energy: -1 },
      text: 'Ты чистишь следы. Теряешь часть аудитории. Но в безопасности.',
    },
  },

  {
    id: 'addiction_notification',
    stage: 1,
    priority: 55,
    characterEmoji: '🔔',
    characterName: 'Уведомления',
    text: 'Экранное время: 9 часов в день. Ты проверяешь лайки каждые 3 минуты.\n\nОтмахнёшься — «это моя работа»?',
    leftChoice: {
      label: 'Установить лимит',
      direction: 'left',
      delta: { soul: 1, energy: 1, reach: -2 },
      text: 'Лимит 3 часа. Контент страдает. Ты — нет.',
    },
    rightChoice: {
      label: 'Это моя работа',
      direction: 'right',
      delta: { reach: 1, soul: -1, energy: -1 },
      text: 'Экранное время: 11 часов. Новый рекорд.',
    },
  },

  {
    id: 'comparison_trap',
    stage: 1,
    priority: 58,
    characterEmoji: '📱',
    characterName: 'Лента',
    text: 'Блогер твоего возраста. Начал одновременно с тобой. У него полмиллиона. У тебя — капля. Ты смотришь на его ленту уже час.\n\nЗакроешь и забудешь?',
    leftChoice: {
      label: 'Проанализировать его стратегию',
      direction: 'left',
      delta: { reach: 1, soul: -2 },
      text: 'Ты понял, как он это делает. Но чувствуешь себя мусором.',
    },
    rightChoice: {
      label: 'Закрыть и забыть',
      direction: 'right',
      delta: { soul: 1, energy: -1 },
      text: 'Забыть не получилось. Но хотя бы не копируешь.',
    },
  },

  {
    id: 'family_call',
    stage: 2,
    priority: 56,
    characterEmoji: '📞',
    characterName: 'Мама',
    text: '«Когда ты найдёшь нормальную работу? Блогерство — это не профессия».\n\nОна не понимает. Или понимает слишком хорошо. Ответишь «ты права» — чтобы закончить разговор?',
    leftChoice: {
      label: 'Объяснить в сотый раз',
      direction: 'left',
      delta: { energy: -2, soul: -1 },
      text: 'Она не поняла. Снова. Ты положил трубку обессиленный.',
    },
    rightChoice: {
      label: 'Сказать «ты права»',
      direction: 'right',
      delta: { soul: -1, money: -1, energy: 1 },
      text: 'Она обрадовалась. Ты соврал. Но вечер спокойный.',
    },
  },

  {
    id: 'fake_followers',
    stage: 1,
    priority: 52,
    characterEmoji: '🤖',
    characterName: 'Сервис',
    text: '«Подписчики оптом. Дёшево. Никто не узнает!»\n\nСообщение от бота. Но цифра красивая...\n\nУдалишь его?',
    leftChoice: {
      label: 'Купить',
      direction: 'left',
      delta: { reach: 3, soul: -2, money: -1 },
      text: 'Красивая цифра. Пустые аккаунты. Ты знаешь правду.',
    },
    rightChoice: {
      label: 'Удалить',
      direction: 'right',
      delta: { soul: 1, reach: -1 },
      text: 'Честные. Их немного. Но они настоящие.',
    },
  },

  {
    id: 'health_warning',
    stage: 2,
    priority: 64,
    maxMetrics: { energy: 4 },
    characterEmoji: '🏥',
    characterName: 'Здоровье',
    text: 'Спина болит. Зрение упало. Запястье хрустит. Врач: «Если не остановитесь — станет хуже».\n\nПродолжишь через боль?',
    leftChoice: {
      label: 'Взять паузу на месяц',
      direction: 'left',
      delta: { energy: 3, reach: -3, money: -2 },
      text: 'Месяц тишины. Тело восстановилось. Аудитория забыла.',
    },
    rightChoice: {
      label: 'Продолжать через боль',
      direction: 'right',
      delta: { reach: 1, energy: -2, soul: -1 },
      text: 'Таблетки помогают. Пока.',
    },
  },

  {
    id: 'jealous_friend',
    stage: 2,
    priority: 54,
    characterEmoji: '😒',
    characterName: 'Бывший друг',
    text: '«Ты изменился. Раньше ты был нормальный. Теперь только контент-контент-контент». Он удалил тебя из друзей.\n\nОтпустишь его?',
    leftChoice: {
      label: 'Попробовать вернуть',
      direction: 'left',
      delta: { energy: -1, soul: -1 },
      text: 'Он не отвечает. Обида осталась.',
    },
    rightChoice: {
      label: 'Отпустить',
      direction: 'right',
      delta: { soul: -1, energy: -1 },
      text: 'Друг ушёл. Аудитория осталась. Равнозначный ли обмен?',
    },
  },

  {
    id: 'algorithm_punishment',
    stage: 2,
    priority: 66,
    characterEmoji: '🤖',
    characterName: 'Алгоритм (А.)',
    text: '[ПРЕДУПРЕЖДЕНИЕ] Ваш контент помечен как «спорный». Охват снижен на 80%. Обжалование займёт 5–7 рабочих дней.\n\nУдалишь пост и подчинишься?',
    leftChoice: {
      label: 'Обжаловать',
      direction: 'left',
      delta: { energy: -2, reach: -1 },
      text: 'Неделя ожидания. Отказ. Без объяснений.',
    },
    rightChoice: {
      label: 'Удалить пост и подчиниться',
      direction: 'right',
      delta: { soul: -2, reach: 1 },
      grantPerk: 'algo_slave',
      text: 'Охват вернулся. Ты больше не пишешь «спорное». Никогда.',
    },
  },

  {
    id: 'night_thoughts',
    stage: 1,
    priority: 45,
    characterEmoji: '🌑',
    characterName: 'Ночь',
    text: '3 часа ночи. Лежишь в темноте. Считаешь подписчиков.\n\n«Зачем я это делаю?» — признаёшься, что не знаешь?',
    leftChoice: {
      label: 'Потому что важно',
      direction: 'left',
      delta: { soul: 2, energy: -1 },
      text: 'Смысл найден. Сон — нет.',
    },
    rightChoice: {
      label: 'Не знаю',
      direction: 'right',
      delta: { energy: -1, soul: -1 },
      text: 'Честный ответ. Но не утешительный.',
    },
  },

  {
    id: 'data_breach',
    stage: 2,
    priority: 58,
    characterEmoji: '🔓',
    characterName: 'Утечка',
    text: 'Платформа слила данные. Твои переписки в открытом доступе. В них — жалобы на подписчиков. Подписчики читают.\n\nОбратишь гнев против платформы?',
    leftChoice: {
      label: 'Извиниться',
      direction: 'left',
      delta: { soul: -1, reach: -2 },
      text: 'Извинения не помогли. Скриншоты вечны.',
    },
    rightChoice: {
      label: 'Атаковать платформу',
      direction: 'right',
      delta: { reach: -1, money: -1, soul: 1 },
      text: 'Ты прав. Но правота не возвращает доверие.',
    },
  },

  {
    id: 'ghost_audience',
    stage: 3,
    priority: 55,
    minMetrics: { reach: 5 },
    characterEmoji: '👻',
    characterName: 'Статистика',
    text: '50% твоей аудитории — боты и мёртвые аккаунты. Настоящих — вдвое меньше, чем ты думал.\n\nОставишь красивую цифру нетронутой?',
    leftChoice: {
      label: 'Почистить аудиторию',
      direction: 'left',
      delta: { reach: -3, soul: 2 },
      text: 'Цифра упала вдвое. Но каждый подписчик — живой.',
    },
    rightChoice: {
      label: 'Не трогать',
      direction: 'right',
      delta: { soul: -2, money: -1 },
      text: 'Красивые цифры. Пустые метрики. Бренды начинают замечать.',
    },
  },

  {
    id: 'creative_crisis',
    stage: 2,
    priority: 48,
    characterEmoji: '🕳️',
    characterName: 'Пустота',
    text: 'Вторую неделю ничего не выходит. Идей нет. Вообще. Подписчики спрашивают: «Ты жив?»\n\nПродолжишь молчать?',
    leftChoice: {
      label: 'Выпустить что-нибудь',
      direction: 'left',
      delta: { reach: -1, soul: -2, money: 1 },
      text: 'Вышло. Плохо. Все видят, что ты выдохся.',
    },
    rightChoice: {
      label: 'Молчать дальше',
      direction: 'right',
      delta: { reach: -2, energy: 1 },
      text: 'Тишина. Алгоритм забывает тебя.',
    },
  },

  // ── RADIO ENTRY 2 — Глитч в ленте (если пропустил первый вход) ──
  {
    id: 'radio_entry_2',
    stage: 1,
    priority: 70,
    forbiddenFlags: ['radio_found'],
    characterEmoji: '📡',
    characterName: 'Глитч',
    text: 'Лента зависла. На экране — белый шум. Но шум не случайный: в нём проступает ритм, похожий на дребезг плохого контакта. Секундная пауза. Потом — ничего. Как будто не было.\n\nПросто перезагрузишь приложение?',
    leftChoice: {
      label: 'Прислушаться к шуму',
      direction: 'left',
      delta: { soul: 1, energy: -1 },
      setFlags: ['radio_found'],
      text: 'Ты слышишь: шум не случаен. Это структура, спрятанная в отсутствии сигнала. Кто-то маскирует передачу под помехи.',
    },
    rightChoice: {
      label: 'Перезагрузить приложение',
      direction: 'right',
      delta: { reach: 1, soul: -1 },
      text: 'Лента вернулась. Но ощущение не ушло — теперь любой сбой кажется осмысленным.',
    },
  },

  // ── Ещё опасные карточки для давления ──
  {
    id: 'impostor_syndrome',
    stage: 1,
    priority: 48,
    characterEmoji: '🎭',
    characterName: 'Синдром самозванца',
    text: 'Внутренний голос: «Ты не заслуживаешь этих подписчиков. Ты фейк. Все настоящие блогеры лучше тебя».\n\nБудешь доказывать обратное — делом?',
    leftChoice: {
      label: 'Принять и продолжить',
      direction: 'left',
      delta: { soul: -1, energy: -1 },
      text: 'Сомнение не уходит. Но ты продолжаешь. Механически.',
    },
    rightChoice: {
      label: 'Доказать обратное',
      direction: 'right',
      delta: { reach: 1, energy: -2, soul: 1 },
      text: 'Лучший пост за месяц. Но какой ценой.',
    },
  },

  {
    id: 'sponsor_pressure',
    stage: 3,
    priority: 65,
    characterEmoji: '💼',
    characterName: 'Спонсор',
    text: 'Рекламодатель: «Удали негативный отзыв о нашем продукте — или мы разрываем контракт. Нам плевать, что отзыв честный».\n\nОтветишь отказом?',
    leftChoice: {
      label: 'Удалить отзыв',
      direction: 'left',
      delta: { money: 2, soul: -3 },
      text: 'Деньги сохранены. Честность — нет.',
    },
    rightChoice: {
      label: 'Отказать',
      direction: 'right',
      delta: { soul: 2, money: -3 },
      text: 'Контракт разорван. Три месяца без дохода.',
    },
  },

  {
    id: 'echo_chamber',
    stage: 2,
    priority: 52,
    characterEmoji: '🔁',
    characterName: 'Эхо-камера',
    text: 'Твои подписчики повторяют за тобой каждое слово. Ты случайно ошибся в факте. Тысячи теперь верят в неправду.\n\nСделаешь вид, что не заметил?',
    leftChoice: {
      label: 'Признать ошибку',
      direction: 'left',
      delta: { soul: 1, reach: -2, money: -1 },
      text: 'Часть аудитории благодарит. Часть — разочарована.',
    },
    rightChoice: {
      label: 'Не заметить',
      direction: 'right',
      delta: { reach: 1, soul: -2 },
      text: 'Тысячи продолжают верить. Ты знаешь правду. Они — нет.',
    },
  },

  {
    id: 'competitor_drama',
    stage: 2,
    priority: 58,
    characterEmoji: '⚔️',
    characterName: 'Конкурент',
    text: 'Конкурент публично назвал тебя плагиатором. Его видео — 200к просмотров. Комментарии под твоим контентом: «вор».\n\nПромолчишь?',
    leftChoice: {
      label: 'Ответить видео',
      direction: 'left',
      delta: { reach: 2, energy: -2, soul: -1 },
      text: 'Драма привлекает зрителей. Но ты выматываешь себя.',
    },
    rightChoice: {
      label: 'Молчать',
      direction: 'right',
      delta: { reach: -2, soul: -1, energy: 1 },
      text: 'Молчание = признание вины для интернета. Охват падает.',
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// ║  FEED MESSAGES — messages from characters and anonymous users          ║
// ═══════════════════════════════════════════════════════════════════════════

export type FeedMessage = {
  id: string;
  emoji: string;
  name: string;
  text: string;
  requiredFlags?: Flag[];
  forbiddenFlags?: Flag[];
  minCardCount?: number;
  maxCardCount?: number;
};

export const FEED_MESSAGES: FeedMessage[] = [
  // ── Саша ──
  { id: 'fm_sasha_1', emoji: '🌱', name: 'Саша', text: 'Новый пост огонь 🔥', minCardCount: 3, forbiddenFlags: ['conspiracy_aware'] },
  { id: 'fm_sasha_2', emoji: '🌱', name: 'Саша', text: 'Слушай, у тебя охват просел? У меня тоже.', minCardCount: 8, forbiddenFlags: ['conspiracy_aware'] },
  { id: 'fm_sasha_3', emoji: '🌱', name: 'Саша', text: 'Мне кажется или рекомендации стали странными? Словно кто-то крутит ручки.', requiredFlags: ['conspiracy_aware'], forbiddenFlags: ['conspiracy_deep'] },
  { id: 'fm_sasha_4', emoji: '🌱', name: 'Саша', text: 'Я кое-что нашёл. Не здесь. Позже.', requiredFlags: ['conspiracy_deep'], forbiddenFlags: ['conspiracy_full'] },
  { id: 'fm_sasha_5', emoji: '🌱', name: 'Саша', text: 'Ты знаешь где меня найти. Когда будешь готов.', requiredFlags: ['conspiracy_full'] },

  // ── Mirror ──
  { id: 'fm_mirror_1', emoji: '🪞', name: '@Mirror', text: 'Ваш контент получил на 23% меньше показов, чем следовало из статистики подписчиков.', minCardCount: 5, forbiddenFlags: ['mirror_contact'] },
  { id: 'fm_mirror_2', emoji: '🪞', name: '@Mirror', text: 'Обнаружен паттерн ручного вмешательства в 14 аккаунтах за последнюю неделю.', requiredFlags: ['mirror_contact'], forbiddenFlags: ['conspiracy_deep'] },
  { id: 'fm_mirror_3', emoji: '🪞', name: '@Mirror', text: 'Новые данные по приоритетным спискам. Зашифровано.', requiredFlags: ['conspiracy_deep'] },

  // ── Алина ──
  { id: 'fm_alina_1', emoji: '💄', name: 'Алина', text: 'Коллаб был супер! Давай ещё? 💕', requiredFlags: ['first_collab'], forbiddenFlags: ['scandal_happened'] },
  { id: 'fm_alina_2', emoji: '💄', name: 'Алина', text: 'Ты слышал? Некоторым блогерам прямо платят за «правильные» темы.', minCardCount: 12 },
  { id: 'fm_alina_3', emoji: '💄', name: 'Алина', text: 'Мой знакомый работал в модерации. Говорит, там такое творится...', requiredFlags: ['conspiracy_aware'] },

  // ── Павел ──
  { id: 'fm_pavel_1', emoji: '📰', name: 'Павел', text: 'Готовлю материал про влияние на feed. Нужны реальные кейсы.', minCardCount: 10 },
  { id: 'fm_pavel_2', emoji: '📰', name: 'Павел', text: 'Три источника подтвердили: приоритетные списки существуют.', requiredFlags: ['conspiracy_aware'] },
  { id: 'fm_pavel_3', emoji: '📰', name: 'Павел', text: 'Мой коллега внезапно удалил все статьи. Не отвечает на звонки.', requiredFlags: ['conspiracy_deep'] },

  // ── Котик ──
  { id: 'fm_cat_1', emoji: '🐱', name: 'Котик-стример', text: 'мяу мяу мяу 🐟 (перевод: у меня для тебя кое-что есть)', minCardCount: 6 },
  { id: 'fm_cat_2', emoji: '🐱', name: 'Котик-стример', text: '*мурчит в направлении твоего последнего поста*', minCardCount: 10 },
  { id: 'fm_cat_3', emoji: '🐱', name: 'Котик-стример', text: 'Мяу! 🐱 (я знаю больше чем показываю. мяу.)', requiredFlags: ['conspiracy_aware'] },

  // ── Хейтер ──
  { id: 'fm_hater_1', emoji: '🤮', name: 'Аноним', text: 'Ты продаёшься. Я вижу.', minCardCount: 5 },
  { id: 'fm_hater_2', emoji: '🤮', name: 'Аноним', text: 'Фейк. Всё что ты делаешь — фейк.', minCardCount: 12 },
  { id: 'fm_hater_3', emoji: '🤮', name: 'Аноним', text: 'Думаешь ты особенный? Ты такой же инструмент как все.', requiredFlags: ['conspiracy_aware'] },

  // ── Анонимные подсказки ──
  { id: 'fm_anon_1', emoji: '👤', name: 'Аноним', text: 'Проверь метаданные рекламных постов в своей ленте. Там интересно.', minCardCount: 8, forbiddenFlags: ['radio_found'] },
  { id: 'fm_anon_2', emoji: '👤', name: 'Аноним', text: 'Слушай шум. Не музыку, не голоса. Именно шум.', minCardCount: 5, forbiddenFlags: ['radio_found'] },
  { id: 'fm_anon_3', emoji: '👤', name: 'Аноним', text: 'Если ты слышишь это — ты на верном пути.', requiredFlags: ['radio_found'], forbiddenFlags: ['conspiracy_aware'] },
  { id: 'fm_anon_4', emoji: '👤', name: 'Аноним', text: 'Не верь никому кто говорит что знает «всю правду». Её нет. Есть фрагменты.', requiredFlags: ['conspiracy_deep'] },
  { id: 'fm_anon_5', emoji: '👤', name: 'Аноним', text: 'Они не удаляют. Они делают так, будто тебя не было.', requiredFlags: ['conspiracy_aware'] },

  // ── Обычные сообщения ──
  { id: 'fm_neutral_1', emoji: '😎', name: 'Подписчик', text: 'Жду новый контент! Когда? 🙏', minCardCount: 3 },
  { id: 'fm_neutral_2', emoji: '🤑', name: 'Спонсор', text: 'Отличные метрики! Давайте обсудим рекламу 💼', minCardCount: 8 },
  { id: 'fm_neutral_3', emoji: '🤖', name: 'Алгоритм', text: 'Ваш контент рекомендован 847 пользователям', minCardCount: 5 },
  { id: 'fm_neutral_4', emoji: '🤖', name: 'Алгоритм', text: 'Совет: публикуйте чаще для роста охвата', minCardCount: 10 },
  { id: 'fm_neutral_5', emoji: '🐶', name: 'Друг', text: 'Ты в порядке? Давно не видел тебя вживую', minCardCount: 7 },
  { id: 'fm_neutral_6', emoji: '📞', name: 'Мама', text: 'Позвони когда сможешь ❤️', minCardCount: 4 },
  { id: 'fm_neutral_7', emoji: '💃', name: 'Фанат', text: 'Твой лучший пост — тот про честность. Ещё!', minCardCount: 12 },
  { id: 'fm_neutral_8', emoji: '🦝', name: 'Менеджер', text: 'Привет! Уникальное предложение для топовых авторов...', minCardCount: 6 },
];
