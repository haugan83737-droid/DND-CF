import { Race, ClassType, Background } from '../types';

const KEYS = {
  RACES: 'dnd_forge_races',
  CLASSES: 'dnd_forge_classes',
  BACKGROUNDS: 'dnd_forge_backgrounds',
};

export const StorageService = {
  getHomebrewRaces: (): Race[] => {
    const stored = localStorage.getItem(KEYS.RACES);
    return stored ? JSON.parse(stored) : [];
  },
  
  saveHomebrewRace: (race: Race) => {
    const current = StorageService.getHomebrewRaces();
    const updated = [...current, race];
    localStorage.setItem(KEYS.RACES, JSON.stringify(updated));
  },

  getHomebrewClasses: (): ClassType[] => {
    const stored = localStorage.getItem(KEYS.CLASSES);
    return stored ? JSON.parse(stored) : [];
  },

  saveHomebrewClass: (cls: ClassType) => {
    const current = StorageService.getHomebrewClasses();
    const updated = [...current, cls];
    localStorage.setItem(KEYS.CLASSES, JSON.stringify(updated));
  },

  // Generic clearer for demo purposes
  clearHomebrew: () => {
    localStorage.removeItem(KEYS.RACES);
    localStorage.removeItem(KEYS.CLASSES);
    localStorage.removeItem(KEYS.BACKGROUNDS);
  }
};