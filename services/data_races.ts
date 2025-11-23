
import { Race } from '../types';

export const RACES: Race[] = [
  // --- PHB Common ---
  { id: 'dragonborn', name: 'Драконорожденный', description: 'Рожденные от драконов, эти гордые воины обладают дыхательным оружием.', speed: 30, bonuses: { STR: 2, CHA: 1 }, features: ['Наследие драконов', 'Оружие дыхания', 'Сопротивление урону'], source: 'dnd.su' },
  { id: 'dwarf-hill', name: 'Дварф (Холмовой)', description: 'Выносливые и мудрые жители холмов.', speed: 25, bonuses: { CON: 2, WIS: 1 }, features: ['Темное зрение', 'Дварфская устойчивость', 'Дварфская выдержка (+1 ХП/уровень)'], source: 'dnd.su' },
  { id: 'dwarf-mountain', name: 'Дварф (Горный)', description: 'Сильные и суровые жители горных твердынь.', speed: 25, bonuses: { CON: 2, STR: 2 }, features: ['Темное зрение', 'Дварфская устойчивость', 'Владение доспехами'], source: 'dnd.su' },
  { id: 'elf-high', name: 'Эльф (Высший)', description: 'Магические и утонченные эльфы.', speed: 30, bonuses: { DEX: 2, INT: 1 }, features: ['Темное зрение', 'Транс', 'Заговор (волшебник)'], source: 'dnd.su' },
  { id: 'elf-wood', name: 'Эльф (Лесной)', description: 'Быстрые и скрытные обитатели лесов.', speed: 35, bonuses: { DEX: 2, WIS: 1 }, features: ['Темное зрение', 'Транс', 'Быстрые ноги', 'Маскировка в дикой местности'], source: 'dnd.su' },
  { id: 'elf-drow', name: 'Эльф (Дроу)', description: 'Темные эльфы из Подземья.', speed: 30, bonuses: { DEX: 2, CHA: 1 }, features: ['Улучшенное темное зрение', 'Чувствительность к солнцу', 'Магия дроу'], source: 'dnd.su' },
  { id: 'gnome-forest', name: 'Гном (Лесной)', description: 'Природные иллюзионисты.', speed: 25, bonuses: { INT: 2, DEX: 1 }, features: ['Темное зрение', 'Гномья хитрость', 'Природный иллюзионист'], source: 'dnd.su' },
  { id: 'gnome-rock', name: 'Гном (Скальный)', description: 'Изобретатели и инженеры.', speed: 25, bonuses: { INT: 2, CON: 1 }, features: ['Темное зрение', 'Гномья хитрость', 'Знание ремесленника', 'Жестянщик'], source: 'dnd.su' },
  { id: 'half-elf', name: 'Полуэльф', description: 'Обаятельные дипломаты.', speed: 30, bonuses: { CHA: 2, DEX: 1, CON: 1 }, features: ['Темное зрение', 'Наследие фей', 'Универсальность навыков'], source: 'dnd.su' },
  { id: 'halfling-lightfoot', name: 'Полурослик (Легконогий)', description: 'Скрытные и удачливые.', speed: 25, bonuses: { DEX: 2, CHA: 1 }, features: ['Везучий', 'Храбрый', 'Естественная скрытность'], source: 'dnd.su' },
  { id: 'halfling-stout', name: 'Полурослик (Коренастый)', description: 'Более крепкие полурослики.', speed: 25, bonuses: { DEX: 2, CON: 1 }, features: ['Везучий', 'Храбрый', 'Устойчивость коренастых'], source: 'dnd.su' },
  { id: 'half-orc', name: 'Полуорк', description: 'Свирепые воины.', speed: 30, bonuses: { STR: 2, CON: 1 }, features: ['Темное зрение', 'Непоколебимая стойкость', 'Свирепые атаки'], source: 'dnd.su' },
  { id: 'human', name: 'Человек', description: 'Амбициозные и разнообразные.', speed: 30, bonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 }, features: ['Дополнительный язык'], source: 'dnd.su' },
  { id: 'human-variant', name: 'Человек (Альт.)', description: 'Человек с талантом.', speed: 30, bonuses: { DEX: 1, WIS: 1 }, features: ['Дополнительный навык', 'Черта'], source: 'dnd.su' },
  { id: 'tiefling', name: 'Тифлинг', description: 'Наследники инфернального пакта.', speed: 30, bonuses: { CHA: 2, INT: 1 }, features: ['Темное зрение', 'Адское сопротивление', 'Дьявольское наследие'], source: 'dnd.su' },
  
  // --- Mordenkainen / Volo / Monsters of the Multiverse ---
  { id: 'aarakocra', name: 'Ааракокра', description: 'Птицелюди, способные летать.', speed: 25, bonuses: { DEX: 2, WIS: 1 }, features: ['Полет (50 фт)', 'Когти'], source: 'dnd.su' },
  { id: 'aasimar', name: 'Аасимар', description: 'Носители небесной искры.', speed: 30, bonuses: { CHA: 2 }, features: ['Темное зрение', 'Небесное сопротивление', 'Исцеляющие руки'], source: 'dnd.su' },
  { id: 'bugbear', name: 'Багбир', description: 'Крупные гоблиноиды, рожденные для битвы.', speed: 30, bonuses: { STR: 2, DEX: 1 }, features: ['Темное зрение', 'Длинные руки', 'Внезапное нападение', 'Мощное телосложение'], source: 'dnd.su' },
  { id: 'centaur', name: 'Кентавр', description: 'Наполовину люди, наполовину лошади.', speed: 40, bonuses: { STR: 2, WIS: 1 }, features: ['Копыта', 'Рывок', 'Телосложение лошади', 'Склонность к природе'], source: 'dnd.su' },
  { id: 'changeling', name: 'Чейнджлинг', description: 'Меняющие облик.', speed: 30, bonuses: { CHA: 2 }, features: ['Смена облика', 'Инстинкты оборотня'], source: 'dnd.su' },
  { id: 'deep-gnome', name: 'Глубинный гном (Свирфнеблин)', description: 'Гномы из Подземья.', speed: 25, bonuses: { INT: 2, DEX: 1 }, features: ['Улучшенное темное зрение', 'Гномья хитрость', 'Каменный камуфляж'], source: 'dnd.su' },
  { id: 'duergar', name: 'Дуэргар', description: 'Темные дварфы.', speed: 25, bonuses: { CON: 2, STR: 1 }, features: ['Улучшенное темное зрение', 'Магия дуэргаров', 'Устойчивость дуэргаров', 'Чувствительность к солнцу'], source: 'dnd.su' },
  { id: 'eladrin', name: 'Эладрин', description: 'Эльфы из Страны Фей, меняющиеся с сезонами.', speed: 30, bonuses: { CHA: 2, DEX: 1 }, features: ['Темное зрение', 'Наследие фей', 'Шаг фей'], source: 'dnd.su' },
  { id: 'elf-sea', name: 'Эльф (Морской)', description: 'Эльфы, живущие в океанских глубинах.', speed: 30, bonuses: { DEX: 2, CON: 1 }, features: ['Темное зрение', 'Дитя моря', 'Друг моря'], source: 'dnd.su' },
  { id: 'elf-shadarkai', name: 'Эльф (Шадар-кай)', description: 'Эльфы из Царства Теней, слуги Королевы Воронов.', speed: 30, bonuses: { DEX: 2, CON: 1 }, features: ['Темное зрение', 'Сопротивление некротике', 'Благословление Королевы Воронов (Телепорт)'], source: 'dnd.su' },
  { id: 'fairy', name: 'Фея', description: 'Маленькие волшебные существа с крыльями.', speed: 30, bonuses: { DEX: 1, CHA: 1, INT: 1 }, features: ['Полет', 'Магия фей'], source: 'dnd.su' },
  { id: 'firbolg', name: 'Фирболг', description: 'Добродушные великаны-хранители леса.', speed: 30, bonuses: { WIS: 2, STR: 1 }, features: ['Магия фирболгов', 'Мощное телосложение', 'Речь зверя и листа'], source: 'dnd.su' },
  { id: 'genasi-air', name: 'Генази (Воздух)', description: 'Потомки джиннов воздуха.', speed: 35, bonuses: { CON: 2, DEX: 1 }, features: ['Бесконечное дыхание', 'Слияние с ветром'], source: 'dnd.su' },
  { id: 'genasi-earth', name: 'Генази (Земля)', description: 'Потомки дао земли.', speed: 30, bonuses: { CON: 2, STR: 1 }, features: ['Хождение по земле', 'Слияние с камнем'], source: 'dnd.su' },
  { id: 'genasi-fire', name: 'Генази (Огонь)', description: 'Потомки ифритов огня.', speed: 30, bonuses: { CON: 2, INT: 1 }, features: ['Темное зрение', 'Сопротивление огню', 'Достижение пламени'], source: 'dnd.su' },
  { id: 'genasi-water', name: 'Генази (Вода)', description: 'Потомки маридов воды.', speed: 30, bonuses: { CON: 2, WIS: 1 }, features: ['Сопротивление кислоте', 'Амфибия', 'Зов волн'], source: 'dnd.su' },
  { id: 'githyanki', name: 'Гитьянки', description: 'Астральные воины.', speed: 30, bonuses: { STR: 2, INT: 1 }, features: ['Псипионика гитьянки', 'Астральное знание'], source: 'dnd.su' },
  { id: 'githzerai', name: 'Гитцерай', description: 'Монахи из Лимбо.', speed: 30, bonuses: { WIS: 2, INT: 1 }, features: ['Псипионика гитцераев', 'Ментальная дисциплина'], source: 'dnd.su' },
  { id: 'goblin', name: 'Гоблин', description: 'Маленькие, злобные и хитрые.', speed: 30, bonuses: { DEX: 2, CON: 1 }, features: ['Темное зрение', 'Ярость маленького', 'Шустрое бегство'], source: 'dnd.su' },
  { id: 'goliath', name: 'Голиаф', description: 'Могучие горные кочевники.', speed: 30, bonuses: { STR: 2, CON: 1 }, features: ['Каменная выносливость', 'Мощное телосложение', 'Рожденный в горах'], source: 'dnd.su' },
  { id: 'harengon', name: 'Харенгон', description: 'Кроликолюди из Страны Фей.', speed: 30, bonuses: { DEX: 1, WIS: 1, CHA: 1 }, features: ['Кроличий прыжок', 'Заячьи чувства', 'Счастливая работа ног'], source: 'dnd.su' },
  { id: 'hobgoblin', name: 'Хобгоблин', description: 'Дисциплинированные воины.', speed: 30, bonuses: { CON: 2, INT: 1 }, features: ['Темное зрение', 'Воинская тренировка', 'Спасение лица'], source: 'dnd.su' },
  { id: 'kenku', name: 'Кенку', description: 'Вороноподобные, лишенные крыльев и голоса.', speed: 30, bonuses: { DEX: 2, WIS: 1 }, features: ['Экспертная подделка', 'Мимикрия', 'Навыки кенку'], source: 'dnd.su' },
  { id: 'kobold', name: 'Кобольд', description: 'Маленькие рептилии, почитающие драконов.', speed: 30, bonuses: { DEX: 2 }, features: ['Темное зрение', 'Смирение (или Рев Дракона)', 'Тактика стаи'], source: 'dnd.su' },
  { id: 'lizardfolk', name: 'Людоящер', description: 'Первобытные рептилии.', speed: 30, bonuses: { CON: 2, WIS: 1 }, features: ['Укус', 'Натуральная броня', 'Хитрость охотника'], source: 'dnd.su' },
  { id: 'minotaur', name: 'Минотавр', description: 'Могучие быкоголовые воины.', speed: 30, bonuses: { STR: 2, CON: 1 }, features: ['Рога', 'Бодающий рывок', 'Удар рогами'], source: 'dnd.su' },
  { id: 'orc', name: 'Орк', description: 'Сильные и агрессивные.', speed: 30, bonuses: { STR: 2, CON: 1 }, features: ['Темное зрение', 'Агрессивный', 'Мощное телосложение'], source: 'dnd.su' },
  { id: 'satyr', name: 'Сатир', description: 'Веселые обитатели лесов.', speed: 35, bonuses: { CHA: 2, DEX: 1 }, features: ['Бодание', 'Веселье', 'Сопротивление магии'], source: 'dnd.su' },
  { id: 'shifter', name: 'Шифтер', description: 'Люди с звериными чертами.', speed: 30, bonuses: { DEX: 1 }, features: ['Темное зрение', 'Смещение'], source: 'dnd.su' },
  { id: 'tabaxi', name: 'Табакси', description: 'Любопытные кошколюди.', speed: 30, bonuses: { DEX: 2, CHA: 1 }, features: ['Темное зрение', 'Кошачья ловкость', 'Кошачьи когти'], source: 'dnd.su' },
  { id: 'tortle', name: 'Тортл', description: 'Мудрые черепахоподобные.', speed: 30, bonuses: { STR: 2, WIS: 1 }, features: ['Когти', 'Задержка дыхания', 'Природный доспех (КД 17)'], source: 'dnd.su' },
  { id: 'triton', name: 'Тритон', description: 'Защитники глубин.', speed: 30, bonuses: { STR: 1, CON: 1, CHA: 1 }, features: ['Амфибия', 'Управление воздухом и водой', 'Темное зрение'], source: 'dnd.su' },
  { id: 'yuan-ti', name: 'Юань-ти', description: 'Змеелюди.', speed: 30, bonuses: { CHA: 2, INT: 1 }, features: ['Темное зрение', 'Врожденное колдовство', 'Сопротивление магии', 'Иммунитет к яду'], source: 'dnd.su' },

  // --- Eberron ---
  { id: 'kalashtar', name: 'Калаштар', description: 'Связанные с духами снов.', speed: 30, bonuses: { WIS: 2, CHA: 1 }, features: ['Двойной разум', 'Ментальная дисциплина', 'Связь разумов'], source: 'dnd.su' },
  { id: 'warforged', name: 'Кованый', description: 'Живые конструкты, созданные для войны.', speed: 30, bonuses: { CON: 2, STR: 1 }, features: ['Устойчивость конструкта', 'Защита часового', 'Встроенная защита'], source: 'dnd.su' },

  // --- Ravnica / Theros / Strixhaven ---
  { id: 'leonin', name: 'Леонинец', description: 'Гордые львиные кочевники.', speed: 35, bonuses: { CON: 2, STR: 1 }, features: ['Темное зрение', 'Когти', 'Устрашающий рык'], source: 'dnd.su' },
  { id: 'loxodon', name: 'Локсодон', description: 'Слоноподобные существа, ценящие покой.', speed: 30, bonuses: { CON: 2, WIS: 1 }, features: ['Мощное телосложение', 'Хобот', 'Безмятежность', 'Природная броня (12+CON)'], source: 'dnd.su' },
  { id: 'owlin', name: 'Овлин', description: 'Совонарод из Стриксхейвена.', speed: 30, bonuses: { DEX: 1, WIS: 1, CHA: 1 }, features: ['Полет', 'Темное зрение', 'Бесшумные перья'], source: 'dnd.su' },
  { id: 'simic-hybrid', name: 'Гибрид Симиков', description: 'Мутанты, созданные магией биомантии.', speed: 30, bonuses: { CON: 2, INT: 1 }, features: ['Темное зрение', 'Животные улучшения'], source: 'dnd.su' },
  { id: 'vedalken', name: 'Ведалкен', description: 'Рациональные и стремящиеся к совершенству.', speed: 30, bonuses: { INT: 2, WIS: 1 }, features: ['Бесстрастие ведалкенов', 'Неустанная точность'], source: 'dnd.su' },
  { id: 'verdan', name: 'Вердан', description: 'Гоблиноиды, мутировавшие от энтропии.', speed: 30, bonuses: { CHA: 2, CON: 1 }, features: ['Черная кровь', 'Ограниченная телепатия', 'Телепатическая интуиция'], source: 'dnd.su' },

  // --- Ravenloft ---
  { id: 'dhampir', name: 'Дампир', description: 'Балансирующие между жизнью и смертью.', speed: 35, bonuses: { CON: 1, CHA: 1, DEX: 1 }, features: ['Темное зрение', 'Вампирский укус', 'Паучье лазание'], source: 'dnd.su' },
  { id: 'hexblood', name: 'Гексблад (Ведьмина кровь)', description: 'Пропитанные магией фей и карг.', speed: 30, bonuses: { WIS: 1, CHA: 1, INT: 1 }, features: ['Темное зрение', 'Наследие фей', 'Волшебный жетон', 'Маскировка'], source: 'dnd.su' },
  { id: 'reborn', name: 'Возрожденный', description: 'Вернувшиеся к жизни, но не ставшие нежитью.', speed: 30, bonuses: { CON: 1, STR: 1, DEX: 1 }, features: ['Смертельная природа', 'Знания из прошлой жизни'], source: 'dnd.su' },

  // --- Spelljammer ---
  { id: 'astral-elf', name: 'Астральный эльф', description: 'Эльфы, живущие в Астральном море.', speed: 30, bonuses: { DEX: 1, CHA: 1, INT: 1 }, features: ['Звездный огонь', 'Астральный транс', 'Звездный шаг (телепорт)'], source: 'dnd.su' },
  { id: 'autognome', name: 'Автогном', description: 'Механические гномы.', speed: 30, bonuses: { CON: 1, INT: 1, DEX: 1 }, features: ['Бронированный корпус', 'Создан для успеха', 'Механическая природа', 'Исцеляющая машина'], source: 'dnd.su' },
  { id: 'giff', name: 'Гифф', description: 'Бегемотоподобные космические наемники.', speed: 30, bonuses: { STR: 2, CON: 1 }, features: ['Владение огнестрелом', 'Бегемотовое сложение', 'Астральная искра'], source: 'dnd.su' },
  { id: 'hadozee', name: 'Хадози', description: 'Обезьяноподобные путешественники.', speed: 30, bonuses: { DEX: 2, CON: 1 }, features: ['Ловкие ноги', 'Скольжение (планирование)'], source: 'dnd.su' },
  { id: 'plasmoid', name: 'Плазмоид', description: 'Разумные аморфные слизни.', speed: 30, bonuses: { STR: 1, CON: 1, INT: 1 }, features: ['Аморфный', 'Задержка дыхания', 'Ложноножка', 'Изменение формы'], source: 'dnd.su' },
  { id: 'thri-kreen', name: 'Три-крин', description: 'Насекомоподобные существа с четырьмя руками.', speed: 30, bonuses: { DEX: 2, WIS: 1 }, features: ['Панцирь хамелеона', 'Вторичные руки', 'Бессонные'], source: 'dnd.su' },

  // --- Dragonlance / Others ---
  { id: 'kender', name: 'Кендер', description: 'Бесстрашные и любопытные.', speed: 30, bonuses: { DEX: 2, CHA: 1 }, features: ['Бесстрашие', 'Насмешка кендера'], source: 'dnd.su' },
  { id: 'grung', name: 'Грунг', description: 'Древолазы-лягушки с ядовитой кожей.', speed: 25, bonuses: { DEX: 2, CON: 1 }, features: ['Древолаз', 'Амфибия', 'Ядовитая кожа', 'Иммунитет к яду'], source: 'dnd.su' },
  { id: 'locathah', name: 'Локата', description: 'Рыболюди.', speed: 30, bonuses: { STR: 2, DEX: 1 }, features: ['Натуральная броня', 'Амфибия', 'Левиафанова воля'], source: 'dnd.su' },

  // --- HOMEBREW CONTENT ---
  { id: 'hb-mousefolk', name: 'Мышиный народ', description: 'Маленькие, но отважные защитники своих нор.', speed: 25, bonuses: { DEX: 2, INT: 1 }, features: ['Темное зрение', 'Пронырливость', 'Язык грызунов'], source: 'homebrew' },
  { id: 'hb-vulpin', name: 'Вульпин (Лисоид)', description: 'Хитрые и проворные лисоподобные гуманоиды.', speed: 30, bonuses: { INT: 2, DEX: 1 }, features: ['Темное зрение', 'Плутовство', 'Острый слух'], source: 'homebrew' },
  { id: 'hb-ursine', name: 'Урсин (Медведь)', description: 'Могучие медвежеподобные воины севера.', speed: 30, bonuses: { STR: 2, CON: 1 }, features: ['Мощное телосложение', 'Когти', 'Толстая шкура (КД 12+ЛОВ)', 'Обоняние'], source: 'homebrew' },
  { id: 'hb-dryad', name: 'Дриада', description: 'Духи деревьев, обретшие плоть.', speed: 30, bonuses: { WIS: 2, CHA: 1 }, features: ['Фотосинтез', 'Разговор с растениями', 'Древесная кожа', 'Магия друидов'], source: 'homebrew' },
  { id: 'hb-half-dragon', name: 'Полудракон', description: 'Более драконоподобные, чем драконорожденные, часто с крыльями или хвостом.', speed: 30, bonuses: { STR: 2, CON: 1 }, features: ['Истинное дыхание', 'Крылья (полет 30)', 'Чешуя (КД 13+ЛОВ)'], source: 'homebrew' },
  { id: 'hb-skeleton', name: 'Скелет (Пробужденный)', description: 'Нежить, сохранившая разум.', speed: 30, bonuses: { DEX: 2, CON: 1 }, features: ['Природа нежити', 'Иммунитет к яду', 'Разборный', 'Темное зрение'], source: 'homebrew' },
  { id: 'hb-automaton', name: 'Автоматон', description: 'Древние механизмы, работающие на магии.', speed: 30, bonuses: { INT: 2, CON: 1 }, features: ['Конструкт', 'Встроенный инструмент', 'Защитная обшивка'], source: 'homebrew' },
  { id: 'hb-slime', name: 'Слизнелюд', description: 'Разумная слизь, принявшая форму гуманоида.', speed: 30, bonuses: { CON: 2, STR: 1 }, features: ['Аморфность', 'Кислотное касание', 'Устойчивость к дробящему'], source: 'homebrew' },
  { id: 'hb-harpy', name: 'Гарпия', description: 'Крылатые существа с прекрасным голосом.', speed: 20, bonuses: { CHA: 2, DEX: 1 }, features: ['Полет (40)', 'Завораживающая песня', 'Когти'], source: 'homebrew' },
  { id: 'hb-gnoll', name: 'Гнолл', description: 'Гиеноподобные падальщики и охотники.', speed: 30, bonuses: { STR: 2, DEX: 1 }, features: ['Темное зрение', 'Ярость', 'Укус', 'Нюх'], source: 'homebrew' },
  { id: 'hb-ratfolk', name: 'Крысолюд', description: 'Крысоподобный мародёр с острыми чувствами.', speed: 25, bonuses: { DEX: 2, CHA: 1 }, features: ['Острое обоняние', 'Хвостовая атака', 'Копание'], source: 'homebrew' }
];
