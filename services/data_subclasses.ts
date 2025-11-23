
import { Subclass } from '../types';

export const SUBCLASSES: Subclass[] = [
  // --- BARD ---
  { id: 'bard-creation', name: 'Колледж создания', classId: 'bard', description: 'Создаёт магические эффекты через песню.', features: ['Дар творца', 'Магия творения'], source: 'dnd.su' },
  { id: 'bard-eloquence', name: 'Колледж красноречия', classId: 'bard', description: 'Мастер слов и убеждения.', features: ['Закалённый духом', 'Искусное красноречие'], source: 'dnd.su' },
  { id: 'bard-glamour', name: 'Колледж обаяния', classId: 'bard', description: 'Чарует аудиторию и врагов.', features: ['Искусство очарования', 'Усиление чар'], source: 'dnd.su' },
  { id: 'bard-glory', name: 'Колледж славы', classId: 'bard', description: 'Герой, воспетый богами.', features: ['Слава герою', 'Божественная карма'], source: 'dnd.su' },
  { id: 'bard-spirits', name: 'Колледж духа', classId: 'bard', description: 'Призывает духов умерших.', features: ['Связь с духами', 'Духовный инструмент'], source: 'dnd.su' },
  { id: 'bard-swords', name: 'Колледж мечей', classId: 'bard', description: 'Мастер клинков и двойных атак.', features: ['Приём мечника', 'Энергия меча'], source: 'dnd.su' },
  { id: 'bard-valor', name: 'Колледж доблести', classId: 'bard', description: 'Рыцарь-бард, воин и поэт.', features: ['Энергия доблести', 'Клинок доблести'], source: 'dnd.su' },
  { id: 'bard-whispers', name: 'Колледж шепотов', classId: 'bard', description: 'Черпает силу из темных секретов.', features: ['Молва', 'Зловещее предсказание'], source: 'dnd.su' },

  // --- BARBARIAN ---
  { id: 'barb-ancestral', name: 'Путь Ангела-хранителя', classId: 'barbarian', description: 'Защищает союзников своей плотью.', features: ['Покровительство предков', 'Защитный дух'], source: 'dnd.su' },
  { id: 'barb-beast', name: 'Путь зверя', classId: 'barbarian', description: 'Принимает облик животного.', features: ['Тело зверя', 'Дикий зверь'], source: 'dnd.su' },
  { id: 'barb-giant', name: 'Путь гиганта', classId: 'barbarian', description: 'Черпает силу великанов.', features: ['Сила великана', 'Громовой шаг'], source: 'dnd.su' },
  { id: 'barb-juggernaut', name: 'Путь джаггернаута', classId: 'barbarian', description: 'Несгибаемый таран битвы.', features: ['Устойчивость', 'Неудержимый натиск'], source: 'dnd.su' },
  { id: 'barb-storm', name: 'Путь буревестника', classId: 'barbarian', description: 'Носитель стихийной энергии.', features: ['Аура буревестника', 'Стена ветра'], source: 'dnd.su' },
  { id: 'barb-zealot', name: 'Путь фанатика', classId: 'barbarian', description: 'Одержимый религиозным экстазом.', features: ['Исступление', 'Божественный фанатизм'], source: 'dnd.su' },
  { id: 'barb-totem', name: 'Путь тотема', classId: 'barbarian', description: 'Связан с духом тотемного животного.', features: ['Дух тотема', 'Аспект тотема'], source: 'dnd.su' },
  { id: 'barb-wild', name: 'Путь дикой магии', classId: 'barbarian', description: 'Мастер нестабильной магической энергии.', features: ['Дикие скачки', 'Управление хаосом'], source: 'dnd.su' },

  // --- FIGHTER ---
  { id: 'fighter-arcane', name: 'Арканый лучник', classId: 'fighter', description: 'Стрелок, использующий магию для стрел.', features: ['Магическая стрела', 'Усиленный выстрел'], source: 'dnd.su' },
  { id: 'fighter-banneret', name: 'Барон-стража', classId: 'fighter', description: 'Защитник, дающий преимущество союзникам.', features: ['Защита', 'Прикрытие'], source: 'dnd.su' },
  { id: 'fighter-champion', name: 'Чемпион', classId: 'fighter', description: 'Классический мастер боя.', features: ['Критическое совершенство'], source: 'dnd.su' },
  { id: 'fighter-drakewarden', name: 'Драковарден', classId: 'fighter', description: 'Связан с душой дракона.', features: ['Душа дракона', 'Дыхание дракона'], source: 'dnd.su' },
  { id: 'fighter-echo', name: 'Рыцарь эха', classId: 'fighter', description: 'Мастер пространственных разрывов.', features: ['Эфирный разлом', 'Прыжок сквозь'], source: 'dnd.su' },
  { id: 'fighter-psi', name: 'Пси-воин', classId: 'fighter', description: 'Использует псионическую энергию.', features: ['Пси-энергия', 'Пси-атаки'], source: 'dnd.su' },
  { id: 'fighter-samurai', name: 'Самурай', classId: 'fighter', description: 'Рыцарь чести с быстрой атакой.', features: ['Идеал самурая', 'Цветущий цвет'], source: 'dnd.su' },
  { id: 'fighter-rune', name: 'Рунный рыцарь', classId: 'fighter', description: 'Использует древние руны.', features: ['Руническая сила', 'Рунический щит'], source: 'dnd.su' },

  // --- WIZARD ---
  { id: 'wiz-abjuration', name: 'Абъюрация', classId: 'wizard', description: 'Мастер защиты и нейтрализации магии.', features: ['Абъюрационная защита', 'Повышение абъюрации'], source: 'dnd.su' },
  { id: 'wiz-conjuration', name: 'Конъюнкция', classId: 'wizard', description: 'Создаёт объекты и существ.', features: ['Искусный конъюнкт', 'Расширение конъюнкции'], source: 'dnd.su' },
  { id: 'wiz-divination', name: 'Гадание', classId: 'wizard', description: 'Читает будущее и распознаёт магию.', features: ['Прозрение', 'Расширение гадания'], source: 'dnd.su' },
  { id: 'wiz-illusion', name: 'Иллюзия', classId: 'wizard', description: 'Мастер обмана и иллюзий.', features: ['Иллюзионист', 'Расширение иллюзии'], source: 'dnd.su' },
  { id: 'wiz-necromancy', name: 'Некромантия', classId: 'wizard', description: 'Оживляет мёртвых и управляет жизненной силой.', features: ['Некромант', 'Расширение некромантии'], source: 'dnd.su' },
  { id: 'wiz-transmutation', name: 'Трансмутация', classId: 'wizard', description: 'Изменяет форму и свойства вещей.', features: ['Трансмутатор', 'Расширение трансмутации'], source: 'dnd.su' },
  { id: 'wiz-war', name: 'Магия войны', classId: 'wizard', description: 'Воин-волшебник с усиленными заклинаниями.', features: ['Магическая техника', 'Усиление заклинания'], source: 'dnd.su' },
  { id: 'wiz-scribes', name: 'Орден писцов', classId: 'wizard', description: 'Мастер магических книг.', features: ['Перенос заклинаний', 'Книга заклинаний'], source: 'dnd.su' },
  { id: 'wiz-chronurgy', name: 'Хронургия', classId: 'wizard', description: 'Владеет временем и судьбой.', features: ['Контроль времени', 'Предопределение'], source: 'dnd.su' },
  { id: 'wiz-graviturgy', name: 'Гравитургия', classId: 'wizard', description: 'Управляет гравитацией.', features: ['Гравитационный импульс', 'Массивность'], source: 'dnd.su' },

  // --- DRUID ---
  { id: 'druid-dreams', name: 'Круг грёз', classId: 'druid', description: 'Связан с царством фей.', features: ['Иллюзорный сон', 'Оазис снов'], source: 'dnd.su' },
  { id: 'druid-spores', name: 'Круг спор', classId: 'druid', description: 'Сливается с грибной сетью.', features: ['Споровая аура', 'Грибной телепорт'], source: 'dnd.su' },
  { id: 'druid-stars', name: 'Круг звёзд', classId: 'druid', description: 'Черпает силу из созвездий.', features: ['Звёздная форма', 'Падающая звезда'], source: 'dnd.su' },
  { id: 'druid-shepherd', name: 'Круг пастуха', classId: 'druid', description: 'Покровитель животных.', features: ['Спутник пастуха', 'Защита стада'], source: 'dnd.su' },
  { id: 'druid-wildfire', name: 'Круг огня', classId: 'druid', description: 'Носитель пламени и возрождения.', features: ['Огонь возрождения', 'Светлое пламя'], source: 'dnd.su' },

  // --- CLERIC ---
  { id: 'cleric-arcana', name: 'Домен арканы', classId: 'cleric', description: 'Изучает магию как науку.', features: ['Тайны арканы', 'Арканическое знание'], source: 'dnd.su' },
  { id: 'cleric-death', name: 'Домен смерти', classId: 'cleric', description: 'Служит смерти и тьме.', features: ['Инструмент смерти', 'Поражение смертью'], source: 'dnd.su' },
  { id: 'cleric-forge', name: 'Домен кузни', classId: 'cleric', description: 'Кузнец и создатель предметов.', features: ['Кузнечное дело', 'Дух кузни'], source: 'dnd.su' },
  { id: 'cleric-grave', name: 'Домен могил', classId: 'cleric', description: 'Защищает от мёртвых.', features: ['Сторож могил', 'Покой вечный'], source: 'dnd.su' },
  { id: 'cleric-knowledge', name: 'Домен знаний', classId: 'cleric', description: 'Хранитель всех знаний.', features: ['Домены знаний', 'Область истинного взгляда'], source: 'dnd.su' },
  { id: 'cleric-life', name: 'Домен жизни', classId: 'cleric', description: 'Мастер исцеления.', features: ['Защита жизни', 'Исцеляющие касания'], source: 'dnd.su' },
  { id: 'cleric-light', name: 'Домен света', classId: 'cleric', description: 'Носитель чистого света.', features: ['Вспышка света', 'Сияние'], source: 'dnd.su' },
  { id: 'cleric-nature', name: 'Домен природы', classId: 'cleric', description: 'Покровитель дикой природы.', features: ['Дары природы', 'Тотем природы'], source: 'dnd.su' },
  { id: 'cleric-order', name: 'Домен порядка', classId: 'cleric', description: 'Защитник законов и гармонии.', features: ['Правосудие', 'Законопослушный удар'], source: 'dnd.su' },
  { id: 'cleric-peace', name: 'Домен мира', classId: 'cleric', description: 'Дипломат и миротворец.', features: ['Мирный дух', 'Гармония'], source: 'dnd.su' },
  { id: 'cleric-tempest', name: 'Домен бури', classId: 'cleric', description: 'Повелитель гроз и молний.', features: ['Гнев бури', 'Штормовое зрение'], source: 'dnd.su' },
  { id: 'cleric-trickery', name: 'Домен хитрости', classId: 'cleric', description: 'Мастер обмана и ловушек.', features: ['Божественные ловушки', 'Карманная работа'], source: 'dnd.su' },
  { id: 'cleric-twilight', name: 'Домен сумерек', classId: 'cleric', description: 'Служит границе между светом и тьмой.', features: ['Сумеречное зрение', 'Защита сумерек'], source: 'dnd.su' },
  { id: 'cleric-war', name: 'Домен войны', classId: 'cleric', description: 'Бог войны и битвы.', features: ['Божественный воин', 'Оружие войны'], source: 'dnd.su' },

  // --- ARTIFICER ---
  { id: 'art-alchemist', name: 'Алхимик', classId: 'artificer', description: 'Создаёт зелья и напитки.', features: ['Алхимические снаряды', 'Алхимический путь'], source: 'dnd.su' },
  { id: 'art-armorer', name: 'Бронник', classId: 'artificer', description: 'Создаёт боевые доспехи.', features: ['Боевые доспехи', 'Улучшение доспехов'], source: 'dnd.su' },
  { id: 'art-artillerist', name: 'Артиллерист', classId: 'artificer', description: 'Мастер дальнобойного оружия.', features: ['Магическое орудие', 'Улучшение орудия'], source: 'dnd.su' },
  { id: 'art-battlesmith', name: 'Боевой кузнец', classId: 'artificer', description: 'Создаёт боевого помощника.', features: ['Боевой товарищ', 'Улучшение товарища'], source: 'dnd.su' },

  // --- WARLOCK ---
  { id: 'warlock-archfey', name: 'Архифея', classId: 'warlock', description: 'Пакт с повелителем фей.', features: ['Трюки фей', 'Изменение формы'], source: 'dnd.su' },
  { id: 'warlock-celestial', name: 'Небожитель', classId: 'warlock', description: 'Пакт с ангелом.', features: ['Небесное происхождение', 'Излучение света'], source: 'dnd.su' },
  { id: 'warlock-fathomless', name: 'Бездна', classId: 'warlock', description: 'Пакт с существом из Бездны.', features: ['Глубины бездны', 'Теневой панцирь'], source: 'dnd.su' },
  { id: 'warlock-fiend', name: 'Бестия', classId: 'warlock', description: 'Пакт с демоном.', features: ['Слуга беса', 'Дьявольский язык'], source: 'dnd.su' },
  { id: 'warlock-genie', name: 'Джинн', classId: 'warlock', description: 'Пакт с духом элементаля.', features: ['Дары джинна', 'Призыв джинна'], source: 'dnd.su' },
  { id: 'warlock-goo', name: 'Великий Древний', classId: 'warlock', description: 'Пакт с древними существами.', features: ['Таинственные глаза', 'Безумие'], source: 'dnd.su' },
  { id: 'warlock-undead', name: 'Нежить', classId: 'warlock', description: 'Пакт с личом или вампиром.', features: ['Слуга нежити', 'Ночная форма'], source: 'dnd.su' },
  { id: 'warlock-undying', name: 'Бессмертный', classId: 'warlock', description: 'Пакт с духом прошлого.', features: ['Дух-наставник', 'Связь с духом'], source: 'dnd.su' },

  // --- MONK ---
  { id: 'monk-mercy', name: 'Путь Милосердия', classId: 'monk', description: 'Исцеляющий монах.', features: ['Ки милосердия', 'Лечение ки'], source: 'dnd.su' },
  { id: 'monk-shadow', name: 'Путь Тени', classId: 'monk', description: 'Мастер скрытности.', features: ['Теневой образ', 'Исчезновение'], source: 'dnd.su' },
  { id: 'monk-ascendant', name: 'Драконий аскет', classId: 'monk', description: 'Связан с духом дракона.', features: ['Дыхание дракона', 'Когти дракона'], source: 'dnd.su' },
  { id: 'monk-astral', name: 'Астральное "Я"', classId: 'monk', description: 'Призывает энергию извне.', features: ['Звёздная форма', 'Астральное тело'], source: 'dnd.su' },
  { id: 'monk-cobalt', name: 'Кобальтовая душа', classId: 'monk', description: 'Мастер псионики и знаний.', features: ['Кобальтовая связь', 'Пси-удар'], source: 'dnd.su' },
  { id: 'monk-drunken', name: 'Пьяный мастер', classId: 'monk', description: 'Стиль, имитирующий пьяного.', features: ['Пьяная ловкость', 'Пьяная атака'], source: 'dnd.su' },
  { id: 'monk-kensei', name: 'Кенсей', classId: 'monk', description: 'Мастер клинков.', features: ['Оружие кенсей', 'Владение оружием'], source: 'dnd.su' },
  { id: 'monk-longdeath', name: 'Долгая смерть', classId: 'monk', description: 'Наводит страх смерти.', features: ['Призрак смерти', 'Жатва душ'], source: 'dnd.su' },
  { id: 'monk-openhand', name: 'Открытая ладонь', classId: 'monk', description: 'Классический стиль.', features: ['Поток открытой ладони', 'Непробиваемость'], source: 'dnd.su' },
  { id: 'monk-sun', name: 'Солнечная душа', classId: 'monk', description: 'Испускает свет и огонь.', features: ['Сияние солнца', 'Пламя солнца'], source: 'dnd.su' },

  // --- PALADIN ---
  { id: 'pal-devotion', name: 'Клятва верности', classId: 'paladin', description: 'Клятва чести.', features: ['Клятва верности', 'Аура преданности'], source: 'dnd.su' },
  { id: 'pal-ancients', name: 'Клятва древних', classId: 'paladin', description: 'Защитник природы.', features: ['Клятва света', 'Аура древних'], source: 'dnd.su' },
  { id: 'pal-vengeance', name: 'Клятва мщения', classId: 'paladin', description: 'Охотник на зло.', features: ['Клятва мстителя', 'Аура мщения'], source: 'dnd.su' },
  { id: 'pal-conquest', name: 'Клятва завоевания', classId: 'paladin', description: 'Покоритель и тиран.', features: ['Аура подавления', 'Порабощение'], source: 'dnd.su' },
  { id: 'pal-glory', name: 'Клятва славы', classId: 'paladin', description: 'Герой, любимый богами.', features: ['Аура славы', 'Божественное одобрение'], source: 'dnd.su' },
  { id: 'pal-redemption', name: 'Клятва искупления', classId: 'paladin', description: 'Исправляющий свои ошибки.', features: ['Аура покаяния', 'Защита от порчи'], source: 'dnd.su' },
  { id: 'pal-watchers', name: 'Клятва наблюдателей', classId: 'paladin', description: 'Охотник на потустороннее.', features: ['Аура наблюдателя', 'Истребление угрозы'], source: 'dnd.su' },
  { id: 'pal-oathbreaker', name: 'Клятвопреступник', classId: 'paladin', description: 'Служит тьме.', features: ['Аура ненависти', 'Контроль нежити'], source: 'dnd.su' },

  // --- RANGER ---
  { id: 'ranger-beast', name: 'Повелитель зверей', classId: 'ranger', description: 'Охотится вместе с животным.', features: ['Спутник', 'Улучшение спутника'], source: 'dnd.su' },
  { id: 'ranger-drakewarden', name: 'Драковарден', classId: 'ranger', description: 'Связан с душой дракона.', features: ['Душа дракона', 'Дыхание дракона'], source: 'dnd.su' },
  { id: 'ranger-fey', name: 'Фейский странник', classId: 'ranger', description: 'Связан с фейским миром.', features: ['Фейская хитрость', 'Фейский шаг'], source: 'dnd.su' },
  { id: 'ranger-gloom', name: 'Мракостраж', classId: 'ranger', description: 'Охотник на чудовищ Подземья.', features: ['Слепое чутьё', 'Преследование теней'], source: 'dnd.su' },
  { id: 'ranger-horizon', name: 'Предел горизонта', classId: 'ranger', description: 'Путешественник между мирами.', features: ['Предел горизонта', 'Межплановый след'], source: 'dnd.su' },
  { id: 'ranger-hunter', name: 'Охотник', classId: 'ranger', description: 'Классический следопыт.', features: ['Охотничий стиль', 'Убийца колоссов'], source: 'dnd.su' },
  { id: 'ranger-swarm', name: 'Хранитель роя', classId: 'ranger', description: 'Призывает облако насекомых.', features: ['Рой-защитник', 'Рой-охотник'], source: 'dnd.su' },
  { id: 'ranger-monster', name: 'Убийца монстров', classId: 'ranger', description: 'Эксперт по уничтожению чудовищ.', features: ['Чутье охотника', 'Убийца магов'], source: 'dnd.su' },

  // --- ROGUE ---
  { id: 'rogue-arcane', name: 'Мистический ловкач', classId: 'rogue', description: 'Плут-заклинатель.', features: ['Кантикрепы', 'Магическая хитрость'], source: 'dnd.su' },
  { id: 'rogue-assassin', name: 'Убийца', classId: 'rogue', description: 'Мастер скрытных убийств.', features: ['Незаметное убийство', 'Устрашение'], source: 'dnd.su' },
  { id: 'rogue-inquisitive', name: 'Сыщик', classId: 'rogue', description: 'Детектив и следопыт.', features: ['Следствие', 'Анализ поведения'], source: 'dnd.su' },
  { id: 'rogue-mastermind', name: 'Повелитель', classId: 'rogue', description: 'Мастер манипуляций.', features: ['Помощь', 'Хитрость повелителя'], source: 'dnd.su' },
  { id: 'rogue-phantom', name: 'Фантом', classId: 'rogue', description: 'Мастер невидимости и теней.', features: ['Призрачное присутствие', 'Призрачная атака'], source: 'dnd.su' },
  { id: 'rogue-scout', name: 'Скаут', classId: 'rogue', description: 'Разведчик и следопыт.', features: ['Скоростной бег', 'Уклонение'], source: 'dnd.su' },
  { id: 'rogue-swashbuckler', name: 'Дуэлянт', classId: 'rogue', description: 'Мастер фехтования.', features: ['Элегантность', 'Удар шпаги'], source: 'dnd.su' },
  { id: 'rogue-thief', name: 'Вор', classId: 'rogue', description: 'Классический взломщик.', features: ['Быстрые руки', 'Форточник'], source: 'dnd.su' },

  // --- SORCERER ---
  { id: 'sorc-draconic', name: 'Драконья кровь', classId: 'sorcerer', description: 'Сила от предков-драконов.', features: ['Драконья кровь', 'Дыхание дракона'], source: 'dnd.su' },
  { id: 'sorc-wild', name: 'Дикая магия', classId: 'sorcerer', description: 'Нестабильная сила.', features: ['Дикая магия', 'Взрыв дикой магии'], source: 'dnd.su' },
  { id: 'sorc-divine', name: 'Божественная душа', classId: 'sorcerer', description: 'Небесное происхождение.', features: ['Божественная магия', 'Божественный характер'], source: 'dnd.su' },
  { id: 'sorc-shadow', name: 'Теневая магия', classId: 'sorcerer', description: 'Потомок теней.', features: ['Теневое происхождение', 'Теневой клинок'], source: 'dnd.su' },
  { id: 'sorc-aberrant', name: 'Разум аберрации', classId: 'sorcerer', description: 'Псионически одарённый.', features: ['Ментальный разум', 'Пси-кантикрепы'], source: 'dnd.su' },
  { id: 'sorc-clockwork', name: 'Механическая душа', classId: 'sorcerer', description: 'Магия порядка.', features: ['Механизированный разум', 'Конструктная магия'], source: 'dnd.su' },
  { id: 'sorc-lunar', name: 'Лунная магия', classId: 'sorcerer', description: 'Связан с лунами.', features: ['Лунные фазы', 'Лунное превращение'], source: 'dnd.su' }
];
