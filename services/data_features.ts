
import { ClassFeatureOption } from '../types';

export const FIGHTING_STYLES: ClassFeatureOption[] = [
    { id: 'fs_archery', name: 'Стрельба', description: '+2 к броскам атаки дальнобойным оружием.', type: 'fighting_style' },
    { id: 'fs_defense', name: 'Оборона', description: '+1 к КД, если надет доспех.', type: 'fighting_style' },
    { id: 'fs_dueling', name: 'Дуэлянт', description: '+2 к урону, если в одной руке оружие ближнего боя, а другая свободна (или щит).', type: 'fighting_style' },
    { id: 'fs_gwf', name: 'Сражение большим оружием', description: 'Переброс 1 или 2 на кости урона двуручным оружием.', type: 'fighting_style' },
    { id: 'fs_protection', name: 'Защита', description: 'Помеха атаке по союзнику в 5 футах (нужен щит).', type: 'fighting_style' },
    { id: 'fs_twf', name: 'Сражение двумя оружиями', description: 'Добавляет модификатор к урону второй атаки.', type: 'fighting_style' },
    { id: 'fs_blind_fighting', name: 'Слепой бой (Tasha)', description: 'Слепое зрение 10 футов.', type: 'fighting_style' },
    { id: 'fs_interception', name: 'Перехват (Tasha)', description: 'Уменьшение урона по союзнику на 1d10 + БМ.', type: 'fighting_style' },
    { id: 'fs_thrown', name: 'Метание оружия (Tasha)', description: '+2 к урону метательным оружием.', type: 'fighting_style' },
    { id: 'fs_unarmed', name: 'Безоружный бой (Tasha)', description: 'Урон 1d6 + СИЛ безоружным, +1d4 урона при захвате.', type: 'fighting_style' },
];

export const METAMAGIC_OPTIONS: ClassFeatureOption[] = [
    { id: 'mm_careful', name: 'Аккуратное заклинание', description: 'Союзники автоматически преуспевают в спасброске.', type: 'metamagic' },
    { id: 'mm_distant', name: 'Далекое заклинание', description: 'Удваивает дальность заклинания.', type: 'metamagic' },
    { id: 'mm_empowered', name: 'Усиленное заклинание', description: 'Переброс костей урона (до модификатора ХАР).', type: 'metamagic' },
    { id: 'mm_extended', name: 'Продленное заклинание', description: 'Удваивает длительность заклинания.', type: 'metamagic' },
    { id: 'mm_heightened', name: 'Повышенное заклинание', description: 'Помеха на первый спасбросок цели.', type: 'metamagic' },
    { id: 'mm_quickened', name: 'Ускоренное заклинание', description: 'Сотворение заклинания (Действие -> Бонусное действие).', type: 'metamagic' },
    { id: 'mm_subtle', name: 'Неуловимое заклинание', description: 'Сотворение без вербальных и соматических компонентов.', type: 'metamagic' },
    { id: 'mm_twinned', name: 'Удвоенное заклинание', description: 'Нацеливание на второе существо.', type: 'metamagic' },
    { id: 'mm_seeking', name: 'Ищущее заклинание (Tasha)', description: 'Переброс промаха заклинанием.', type: 'metamagic' },
    { id: 'mm_transmuted', name: 'Измененное заклинание (Tasha)', description: 'Смена типа урона (кислота, холод, огонь, электричество, яд, гром).', type: 'metamagic' },
];

export const ELDRITCH_INVOCATIONS: ClassFeatureOption[] = [
    { id: 'ei_agonizing', name: 'Мучительный взрыв', description: '+ХАР к урону Мистического заряда.', type: 'invocation' },
    { id: 'ei_armor_shadows', name: 'Броня теней', description: 'Доспехи мага на себя неограниченно.', type: 'invocation' },
    { id: 'ei_beast_speech', name: 'Речь зверя', description: 'Разговор с животными неограниченно.', type: 'invocation' },
    { id: 'ei_beguiling', name: 'Влияние обманщика', description: 'Владение Обманом и Убеждением.', type: 'invocation' },
    { id: 'ei_devil_sight', name: 'Дьявольский взгляд', description: 'Видит в магической тьме (120 фт).', type: 'invocation' },
    { id: 'ei_eldritch_sight', name: 'Мистическое зрение', description: 'Обнаружение магии неограниченно.', type: 'invocation' },
    { id: 'ei_eyes_rune', name: 'Глаз хранителя рун', description: 'Чтение любой письменности.', type: 'invocation' },
    { id: 'ei_fiendish_vigor', name: 'Дьявольская бодрость', description: 'Ложная жизнь (1 уровень) неограниченно.', type: 'invocation' },
    { id: 'ei_gaze_two_minds', name: 'Взгляд двух умов', description: 'Использовать чувства гуманоида.', type: 'invocation' },
    { id: 'ei_mask_many', name: 'Маска многих лиц', description: 'Маскировка неограниченно.', type: 'invocation' },
    { id: 'ei_misty_visions', name: 'Туманные видения', description: 'Безмолвный образ неограниченно.', type: 'invocation' },
    { id: 'ei_repelling', name: 'Отталкивающий взрыв', description: 'Мистический заряд отталкивает на 10 фт.', type: 'invocation' },
    { id: 'ei_book_secrets', name: 'Книга древних секретов', description: '(Пакт гримуара) Запись ритуалов.', type: 'invocation' },
    { id: 'ei_thirsting_blade', name: 'Жачущий клинок', description: '(5 ур, Пакт клинка) Вторая атака.', type: 'invocation' },
    { id: 'ei_one_shadows', name: 'Един с тенями', description: '(5 ур) Невидимость в темноте если не двигаться.', type: 'invocation' },
];
