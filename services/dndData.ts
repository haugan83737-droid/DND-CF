
import { Ability } from '../types';
import { RACES } from './data_races';
import { CLASSES } from './data_classes';
import { SUBCLASSES } from './data_subclasses';
import { BACKGROUNDS } from './data_backgrounds';
import { ITEMS } from './data_items';
import { FEATS } from './data_feats';
import { SPELLS } from './data_spells';
import { FIGHTING_STYLES, METAMAGIC_OPTIONS, ELDRITCH_INVOCATIONS } from './data_features';

export const ALL_SKILLS: Record<string, Ability> = {
  'Акробатика': Ability.DEX,
  'Анализ': Ability.INT,
  'Атлетика': Ability.STR,
  'Внимательность': Ability.WIS,
  'Выживание': Ability.WIS,
  'Выступление': Ability.CHA,
  'Запугивание': Ability.CHA,
  'История': Ability.INT,
  'Ловкость рук': Ability.DEX,
  'Магия': Ability.INT,
  'Медицина': Ability.WIS,
  'Обман': Ability.CHA,
  'Природа': Ability.INT,
  'Проницательность': Ability.WIS,
  'Религия': Ability.INT,
  'Скрытность': Ability.DEX,
  'Убеждение': Ability.CHA,
  'Уход за животными': Ability.WIS,
};

export const XP_TABLE: Record<number, number> = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000
};

export const getLevelFromXP = (xp: number): number => {
  let level = 1;
  for (let i = 20; i >= 1; i--) {
    if (xp >= XP_TABLE[i]) {
      level = i;
      break;
    }
  }
  return level;
};

export const getXPForLevel = (level: number): number => {
  return XP_TABLE[level] || 0;
};

export const LEVEL_PROGRESSION = {
  getProficiencyBonus: (level: number) => Math.ceil(level / 4) + 1,
  getASIMilestones: (classId: string) => {
     const standard = [4, 8, 12, 16, 19];
     if (classId === 'fighter') return [4, 6, 8, 12, 14, 16, 19];
     if (classId === 'rogue') return [4, 8, 10, 12, 16, 19];
     return standard;
  }
};

export const SUBCLASS_LEVELS: Record<string, number> = {
  'cleric': 1,
  'warlock': 1,
  'sorcerer': 1,
  'wizard': 2,
  'druid': 2,
  'bard': 3,
  'fighter': 3,
  'ranger': 3,
  'rogue': 3,
  'paladin': 3,
  'monk': 3,
  'barbarian': 3,
  'artificer': 3,
  'blood_hunter': 3,
  'mystic': 1
};

export const SPELL_LIMITS: Record<string, { cantrips: number[], known?: number[], type: 'known' | 'prepared' | 'book' }> = {
    'bard': { cantrips: [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4], known: [4,5,6,7,8,9,10,11,12,14,15,15,16,18,19,19,20,22,22,22], type: 'known' },
    'cleric': { cantrips: [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5], type: 'prepared' },
    'druid': { cantrips: [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4], type: 'prepared' },
    'paladin': { cantrips: Array(20).fill(0), type: 'prepared' },
    'ranger': { cantrips: Array(20).fill(0), known: [0,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11], type: 'known' },
    'sorcerer': { cantrips: [4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6], known: [2,3,4,5,6,7,8,9,10,11,12,12,13,13,14,14,15,15,15,15], type: 'known' },
    'warlock': { cantrips: [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4], known: [2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15], type: 'known' },
    'wizard': { cantrips: [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5], type: 'book' },
    'artificer': { cantrips: [2,2,2,2,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,4], type: 'prepared' }
};

// Re-export data from shards
export const DND_SU_RACES = RACES;
export const DND_SU_CLASSES = CLASSES;
export const DND_SU_SUBCLASSES = SUBCLASSES;
export const DND_SU_BACKGROUNDS = BACKGROUNDS;
export const DND_ITEMS = ITEMS;
export const DND_SU_FEATS = FEATS;
export const DND_SU_SPELLS = SPELLS;
export const DND_SU_FIGHTING_STYLES = FIGHTING_STYLES;
export const DND_SU_METAMAGIC = METAMAGIC_OPTIONS;
export const DND_SU_INVOCATIONS = ELDRITCH_INVOCATIONS;
