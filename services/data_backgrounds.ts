
import { Background } from '../types';

export const BACKGROUNDS: Background[] = [
  // PHB
  { id: 'acolyte', name: 'Прислужник', description: 'Вы провели жизнь в служении храму.', skills: ['Проницательность', 'Религия'], feature: 'Приют верующих', startingEquipment: ['holy_symbol', 'clothes_common'], source: 'dnd.su' },
  { id: 'charlatan', name: 'Шарлатан', description: 'Вы умеете манипулировать людьми.', skills: ['Обман', 'Ловкость рук'], feature: 'Фальшивая личность', startingEquipment: ['clothes_fine', 'tools_disguise'], source: 'dnd.su' },
  { id: 'criminal', name: 'Преступник', description: 'Вы опытный преступник.', skills: ['Обман', 'Скрытность'], feature: 'Криминальные связи', startingEquipment: ['clothes_common'], source: 'dnd.su' },
  { id: 'entertainer', name: 'Артист', description: 'Вы живете, чтобы выступать.', skills: ['Акробатика', 'Выступление'], feature: 'Популярность', startingEquipment: ['clothes_common'], source: 'dnd.su' },
  { id: 'folk-hero', name: 'Народный герой', description: 'Вы выходец из простого народа.', skills: ['Выживание', 'Уход за животными'], feature: 'Гостеприимство народа', startingEquipment: ['clothes_common', 'tools_artisan'], source: 'dnd.su' },
  { id: 'guild-artisan', name: 'Ремесленник', description: 'Вы член гильдии мастеров.', skills: ['Проницательность', 'Убеждение'], feature: 'Членство в гильдии', startingEquipment: ['clothes_traveler', 'tools_artisan'], source: 'dnd.su' },
  { id: 'hermit', name: 'Отшельник', description: 'Вы жили в уединении.', skills: ['Медицина', 'Религия'], feature: 'Открытие', startingEquipment: ['clothes_common', 'scroll_case'], source: 'dnd.su' },
  { id: 'noble', name: 'Благородный', description: 'Вы принадлежите к элите.', skills: ['История', 'Убеждение'], feature: 'Привилегия', startingEquipment: ['clothes_fine', 'signet_ring'], source: 'dnd.su' },
  { id: 'outlander', name: 'Чужеземец', description: 'Вы выросли в дикой местности.', skills: ['Атлетика', 'Выживание'], feature: 'Странник', startingEquipment: ['clothes_traveler', 'staff'], source: 'dnd.su' },
  { id: 'sage', name: 'Мудрец', description: 'Вы потратили годы на учебу.', skills: ['Магия', 'История'], feature: 'Исследователь', startingEquipment: ['clothes_common', 'ink_pen'], source: 'dnd.su' },
  { id: 'sailor', name: 'Моряк', description: 'Вы плавали на кораблях.', skills: ['Атлетика', 'Внимательность'], feature: 'Поездка на корабле', startingEquipment: ['clothes_common', 'rope_silk'], source: 'dnd.su' },
  { id: 'soldier', name: 'Солдат', description: 'Война была вашей профессией.', skills: ['Атлетика', 'Запугивание'], feature: 'Воинское звание', startingEquipment: ['clothes_common', 'gaming_set'], source: 'dnd.su' },
  { id: 'urchin', name: 'Беспризорник', description: 'Вы выросли на улицах.', skills: ['Скрытность', 'Ловкость рук'], feature: 'Знание улиц', startingEquipment: ['clothes_common', 'knife'], source: 'dnd.su' },

  // Non-PHB (SCAG, Curse of Strahd, etc)
  { id: 'city_watch', name: 'Городской дозор', description: 'Вы служили закону в городе.', skills: ['Атлетика', 'Проницательность'], feature: 'Глаз стражника', startingEquipment: ['clothes_common', 'manacles'], source: 'dnd.su' },
  { id: 'clan_crafter', name: 'Член клана', description: 'Дварфийские традиции ремесла.', skills: ['История', 'Проницательность'], feature: 'Уважение дварфов', startingEquipment: ['tools_artisan', 'clothes_traveler'], source: 'dnd.su' },
  { id: 'far_traveler', name: 'Дальний путешественник', description: 'Вы прибыли из далеких земель.', skills: ['Внимательность', 'Проницательность'], feature: 'Внимание окружающих', startingEquipment: ['clothes_traveler', 'map'], source: 'dnd.su' },
  { id: 'haunted_one', name: 'Проклятый', description: 'Вас преследует ужас прошлого.', skills: ['Аркана', 'Выживание'], feature: 'Сердце тьмы', startingEquipment: ['clothes_common', 'monster_hunter_pack'], source: 'dnd.su' },
  { id: 'mercenary_veteran', name: 'Наемник-ветеран', description: 'Вы сражались за деньги.', skills: ['Атлетика', 'Убеждение'], feature: 'Жизнь наемника', startingEquipment: ['clothes_traveler', 'gaming_set'], source: 'dnd.su' },
  { id: 'investigator', name: 'Расследователь', description: 'Ищет правду там, где другие боятся смотреть.', skills: ['Анализ', 'Проницательность'], feature: 'Несконченное дело', startingEquipment: ['clothes_common', 'map'], source: 'dnd.su' },
  { id: 'marine', name: 'Морпех', description: 'Солдат, служащий на кораблях.', skills: ['Атлетика', 'Выживание'], feature: 'Амфибийная подготовка', startingEquipment: ['clothes_common', 'spear'], source: 'dnd.su' },
  { id: 'smuggler', name: 'Контрабандист', description: 'Перевозил запрещённые товары.', skills: ['Атлетика', 'Обман'], feature: 'Тайные тропы', startingEquipment: ['clothes_common', 'rope_silk'], source: 'dnd.su' },
  { id: 'gladiator', name: 'Гладиатор', description: 'Сражался за зрелище и славу.', skills: ['Атлетика', 'Выступление'], feature: 'Поклонники', startingEquipment: ['clothes_common', 'weapon_plus_one'], source: 'dnd.su' },
  { id: 'inheritor', name: 'Наследник', description: 'Унаследовал нечто важное.', skills: ['Выживание', 'История'], feature: 'Наследство', startingEquipment: ['clothes_traveler'], source: 'dnd.su' },
  
  // HB
  { id: 'hb-master-shadows', name: 'Мастер теней (HB)', description: 'Мастер скрытности и обмана.', skills: ['Обман', 'Скрытность'], feature: 'Теневой контакт', startingEquipment: ['clothes_dark'], source: 'homebrew' },
  { id: 'hb-treasure-hunter', name: 'Охотник за сокровищами (HB)', description: 'Ищет древние артефакты.', skills: ['Анализ', 'Выживание'], feature: 'Жажда сокровищ', startingEquipment: ['clothes_traveler', 'map'], source: 'homebrew' }
];
