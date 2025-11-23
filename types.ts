
export enum Ability {
  STR = 'Сила',
  DEX = 'Ловкость',
  CON = 'Телосложение',
  INT = 'Интеллект',
  WIS = 'Мудрость',
  CHA = 'Харизма'
}

export interface AbilityScores {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

export interface Currency {
  cp: number; // Медные
  sp: number; // Серебряные
  ep: number; // Электрумовые
  gp: number; // Золотые
  pp: number; // Платиновые
}

export interface HitPoints {
  max: number;
  current: number;
  temp: number;
  hitDice: string;
  failures: number; // Death saves
  successes: number;
}

export type ItemType = 'weapon' | 'armor' | 'gear' | 'tool';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  cost: number; // in gp
  weight?: number;
  damage?: string; // "1d8 slashing"
  ac?: number; // Base AC for armor
  properties?: string[];
  description?: string;
  source: 'dnd.su' | 'homebrew';
}

export interface Race {
  id: string;
  name: string;
  description: string;
  speed: number;
  bonuses: Partial<AbilityScores>;
  features: string[];
  source: 'dnd.su' | 'homebrew';
}

export interface ClassType {
  id: string;
  name: string;
  description: string;
  hitDie: number;
  primaryAbility: Ability[];
  saves: Ability[];
  features: string[];
  startingEquipment: string[]; // List of Item IDs
  spellcastingAbility?: Ability; 
  source: 'dnd.su' | 'homebrew';
}

export interface Subclass {
  id: string;
  name: string;
  classId: string;
  description: string;
  features: string[];
  source: 'dnd.su' | 'homebrew';
}

export interface Background {
  id: string;
  name: string;
  description: string;
  skills: string[];
  feature: string;
  startingEquipment: string[]; // List of Item IDs
  source: 'dnd.su' | 'homebrew';
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  classes: string[];
  description: string;
  source: 'dnd.su' | 'homebrew';
}

export interface Feat {
  id: string;
  name: string;
  description: string;
  source: 'dnd.su' | 'homebrew';
}

export interface ClassFeatureOption {
    id: string;
    name: string;
    description: string;
    type: 'fighting_style' | 'metamagic' | 'invocation' | 'pact_boon';
}

export interface Character {
  name: string;
  playerName: string; // New field
  race: Race | null;
  classType: ClassType | null;
  subclass: Subclass | null;
  background: Background | null;
  
  stats: AbilityScores; // Base stats (rolled/point buy)
  levelingStats: AbilityScores; // Stats gained from ASIs

  spells: Spell[];
  feats: Feat[];
  inventory: Item[]; 
  
  // Class Choices
  fightingStyle: string | null;
  metamagic: string[];
  invocations: string[];
  expertise: string[]; // List of skill names
  
  // Stats derived or extended
  hp: HitPoints;
  currency: Currency;
  xp: number;
  inspiration: boolean;
  proficiencyBonus: number;
  
  // Proficiencies
  skills: string[];
  languages: string[];
  tools: string[];
  
  // Fluff / Roleplay
  backstory: string;
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  
  // Biometrics
  gender: string;
  age: string;
  height: string;
  weight: string;
  eyes: string;
  skin: string;
  hair: string;
  alignment: string;

  portraitUrl: string;
  level: number;
}

export type AppView = 'wizard' | 'sheet' | 'homebrew';

// --- Polza AI Settings ---

export interface AppSettings {
  apiKey: string;
  textModel: string;
  imageModel: string;
}

export const AVAILABLE_TEXT_MODELS = [
  { id: 'openai/gpt-4o', name: 'GPT-4o (OpenAI)' },
  { id: 'anthropic/claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B' }
];

export const AVAILABLE_IMAGE_MODELS = [
  { id: 'seedream-v4', name: 'Seedream 4.0 (High Quality)' },
  { id: 'nano-banana', name: 'Nano-Banana (Fast/Edit)' },
  { id: 'midjourney-v6', name: 'Midjourney v6' },
  { id: 'flux-pro', name: 'Flux Pro' }
];
