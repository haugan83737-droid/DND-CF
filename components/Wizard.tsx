
import React, { useState, useEffect } from 'react';
import { DND_SU_RACES, DND_SU_CLASSES, DND_SU_SUBCLASSES, DND_SU_BACKGROUNDS, DND_SU_SPELLS, DND_SU_FEATS, DND_ITEMS, DND_SU_FIGHTING_STYLES, DND_SU_METAMAGIC, DND_SU_INVOCATIONS, LEVEL_PROGRESSION, SPELL_LIMITS, SUBCLASS_LEVELS, getLevelFromXP, getXPForLevel } from '../services/dndData';
import { StorageService } from '../services/storage';
import { PolzaService } from '../services/polza';
import { Character, Race, ClassType, Subclass, Background, AbilityScores, Ability, Spell, Feat, Item, AppSettings } from '../types';
import { ArrowRight, ArrowLeft, Wand2, Sparkles, Dice5, Search, User, BookOpen, Briefcase, Crown, Zap, Book, ShoppingCart, Coins, PlusCircle, MinusCircle, Database, PenTool, Package, Shield, Star, Swords, Calculator, RefreshCcw } from 'lucide-react';

const ABILITY_KEY_MAP: Record<Ability, keyof AbilityScores> = {
  [Ability.STR]: 'STR',
  [Ability.DEX]: 'DEX',
  [Ability.CON]: 'CON',
  [Ability.INT]: 'INT',
  [Ability.WIS]: 'WIS',
  [Ability.CHA]: 'CHA'
};

interface WizardProps {
  onComplete: (char: Character) => void;
  onCancel: () => void;
  settings: AppSettings;
}

const STEPS = ['Раса', 'Личность', 'Класс', 'Архетип', 'Характеристики', 'Развитие', 'Заклинания', 'Предыстория', 'Магазин', 'Финал'];

const EYE_COLORS = ['Карие', 'Голубые', 'Зеленые', 'Серые', 'Черные', 'Янтарные', 'Ореховые', 'Фиолетовые', 'Красные', 'Золотые', 'Серебряные', 'Разные'];
const HAIR_COLORS = ['Черные', 'Каштановые', 'Русые', 'Блонд', 'Рыжие', 'Седые', 'Белые', 'Синие', 'Зеленые', 'Розовые', 'Без волос'];
const SKIN_COLORS = ['Светлая', 'Смуглая', 'Темная', 'Бледная', 'Оливковая', 'Медная', 'Зеленоватая', 'Красноватая', 'Серая', 'Синяя', 'Чешуйчатая'];

const POINT_BUY_COSTS: Record<number, number> = {
    8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};

export const Wizard: React.FC<WizardProps> = ({ onComplete, onCancel, settings }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiAdvice, setAiAdvice] = useState<string>('');
  
  // Shop Mode state
  const [shopMode, setShopMode] = useState<'standard' | 'buy'>('standard');

  // Stats Mode
  const [statsMethod, setStatsMethod] = useState<'manual' | 'standard' | 'roll' | 'pointbuy'>('manual');
  const [pointsRemaining, setPointsRemaining] = useState(27);

  // Level state
  const [level, setLevel] = useState(1);

  // ASI Selection State (Step 5)
  const [asiChoices, setAsiChoices] = useState<Record<number, 'feat' | 'score'>>({});
  const [scoreIncreases, setScoreIncreases] = useState<Record<number, Partial<AbilityScores>>>({});

  // Data sources
  const [races, setRaces] = useState<Race[]>([]);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [subclasses, setSubclasses] = useState<Subclass[]>([]);
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [spells, setSpells] = useState<Spell[]>([]);
  const [feats, setFeats] = useState<Feat[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  // Character State
  const [char, setChar] = useState<Character>({
    name: '',
    playerName: '',
    race: null,
    classType: null,
    subclass: null,
    background: null,
    stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    levelingStats: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    spells: [],
    feats: [],
    inventory: [],
    hp: { max: 0, current: 0, temp: 0, hitDice: '', failures: 0, successes: 0 },
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    xp: 0,
    inspiration: false,
    proficiencyBonus: 2,
    skills: [],
    languages: ['Общий'],
    tools: [],
    backstory: '',
    personalityTraits: '',
    ideals: '',
    bonds: '',
    flaws: '',
    portraitUrl: '',
    level: 1,
    alignment: 'Истинно-нейтральный',
    // Bio
    gender: 'Мужской',
    age: '25',
    height: '180',
    weight: '80',
    eyes: 'Карие',
    skin: 'Светлая',
    hair: 'Каштановые',
    // Class Features
    fightingStyle: null,
    metamagic: [],
    invocations: [],
    expertise: []
  });

  useEffect(() => {
    setRaces([...DND_SU_RACES, ...StorageService.getHomebrewRaces()]);
    setClasses([...DND_SU_CLASSES, ...StorageService.getHomebrewClasses()]);
    setSubclasses(DND_SU_SUBCLASSES);
    setBackgrounds(DND_SU_BACKGROUNDS);
    setSpells(DND_SU_SPELLS);
    setFeats(DND_SU_FEATS);
    setItems(DND_ITEMS);
  }, []);

  useEffect(() => {
    setSearchTerm('');
    setAiAdvice('');
  }, [step]);

  // Calculate Total Stats including Leveling
  const calculateTotalStats = () => {
      const total = { ...char.stats };
      Object.keys(total).forEach(k => {
          const key = k as keyof AbilityScores;
          // Base + Leveling
          total[key] = (total[key] || 0) + (char.levelingStats[key] || 0);
      });
      return total;
  }

  // Recalculate derived stats when basics change
  useEffect(() => {
    if (char.classType && char.stats) {
        const totalStats = calculateTotalStats();
        
        // Race bonuses for HP calc
        const raceBonus = char.race?.bonuses?.CON || 0;
        const finalCon = (totalStats.CON || 10) + raceBonus;
        const finalConMod = Math.floor((finalCon - 10) / 2);

        const avgHitDie = (char.classType.hitDie / 2) + 1;
        const maxHp = (char.classType.hitDie + finalConMod) + ((level - 1) * (avgHitDie + finalConMod));
        
        const prof = LEVEL_PROGRESSION.getProficiencyBonus(level);

        const bgSkills = char.background?.skills || [];
        const allSkills = Array.from(new Set([...bgSkills]));

        setChar(prev => ({
            ...prev,
            level: level,
            proficiencyBonus: prof,
            hp: { ...prev.hp, max: maxHp, current: maxHp, hitDice: `${level}к${char.classType!.hitDie}` },
            skills: allSkills
        }));
    }
  }, [char.stats, char.levelingStats, char.classType, char.background, level, char.race]);

  const updateStats = (key: keyof AbilityScores, value: number) => {
    setChar(prev => ({ ...prev, stats: { ...prev.stats, [key]: value } }));
  };

  // Point Buy Logic
  const handlePointBuyChange = (key: keyof AbilityScores, delta: number) => {
      const currentVal = char.stats[key];
      const newVal = currentVal + delta;

      if (newVal < 8 || newVal > 15) return;

      const costDiff = POINT_BUY_COSTS[newVal] - POINT_BUY_COSTS[currentVal];
      
      if (pointsRemaining - costDiff < 0) return;

      setPointsRemaining(prev => prev - costDiff);
      updateStats(key, newVal);
  };

  const resetPointBuy = () => {
      setChar(prev => ({ ...prev, stats: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 } }));
      setPointsRemaining(27);
  };

  const applyStandardArray = () => {
      setChar(prev => ({ ...prev, stats: { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 } }));
  };

  const updateLevelingStats = () => {
      const newLeveling: AbilityScores = { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 };
      Object.values(scoreIncreases).forEach(inc => {
          Object.entries(inc).forEach(([key, val]) => {
              newLeveling[key as keyof AbilityScores] += (val || 0);
          });
      });
      setChar(prev => ({ ...prev, levelingStats: newLeveling }));
  };

  const rollStats = () => {
    const newStats = { ...char.stats };
    Object.keys(newStats).forEach((k) => {
        const rolls = Array.from({length: 4}, () => Math.floor(Math.random() * 6) + 1);
        rolls.sort((a, b) => a - b).shift();
        const sum = rolls.reduce((a, b) => a + b, 0);
        newStats[k as keyof AbilityScores] = sum;
    });
    setChar(prev => ({ ...prev, stats: newStats }));
  };

  // Logic to handle XP and Level dependency
  const handleLevelChange = (newLevel: number) => {
      if (isNaN(newLevel) || newLevel < 1) newLevel = 1;
      if (newLevel > 20) newLevel = 20;
      
      setLevel(newLevel);
      // Automatically set XP to the minimum for this level
      setChar(prev => ({ ...prev, xp: getXPForLevel(newLevel) }));
  };

  const handleXPChange = (newXP: number) => {
      if (isNaN(newXP) || newXP < 0) newXP = 0;
      
      const newLevel = getLevelFromXP(newXP);
      setLevel(newLevel);
      setChar(prev => ({ ...prev, xp: newXP }));
  };

  // --- AI Integrations with PolzaService ---

  const generateName = async () => {
    if (!char.race) return;
    setLoading(true);
    const prompt = `Сгенерируй ОДНО уникальное фэнтези имя для расы ${char.race.name} в D&D 5e. Пол: ${char.gender}. Верни ТОЛЬКО имя.`;
    const name = await PolzaService.chatCompletion(settings, "Ты генератор имен для D&D.", prompt);
    setChar(c => ({ ...c, name: name.replace(/["']/g, "") }));
    setLoading(false);
  };

  const getStatAdvice = async () => {
    if (!char.classType || !char.race) return;
    setLoading(true);
    const prompt = `
      Дай краткий совет (макс 2 предложения) по распределению характеристик (Stats) 
      для персонажа: Раса ${char.race.name}, Класс ${char.classType.name}. 
      Что качать в первую очередь?
    `;
    const advice = await PolzaService.chatCompletion(settings, "Ты опытный мастер D&D 5e.", prompt);
    setAiAdvice(advice);
    setLoading(false);
  };

  const generatePersonality = async () => {
    if (!char.race || !char.classType || !char.background) return;
    setLoading(true);
    
    const prompt = `
      Создай личность для D&D персонажа:
      Раса: ${char.race.name}
      Класс: ${char.classType.name}
      Предыстория: ${char.background.name}
      
      Верни JSON с полями:
      {
        "traits": "2 черты характера",
        "ideals": "1 идеал",
        "bonds": "1 привязанность",
        "flaws": "1 слабость"
      }
      Язык: Русский.
    `;

    const p = await PolzaService.generateJSON(settings, "Ты помощник для D&D.", prompt);
    setChar(c => ({ 
        ...c, 
        personalityTraits: p.traits || "-", 
        ideals: p.ideals || "-", 
        bonds: p.bonds || "-", 
        flaws: p.flaws || "-" 
    }));
    setLoading(false);
  };

  const generateBackstoryAndArt = async () => {
    if(!settings.apiKey) {
        alert("Введите API ключ Polza AI в настройках (иконка шестеренки вверху).");
        return;
    }
    setLoading(true);
    try {
      // Backstory
      const storyPrompt = `
        Напиши короткую, захватывающую предысторию (максимум 3 абзаца) для персонажа:
        Имя: ${char.name || 'Безымянный'}
        Раса: ${char.race?.name}
        Класс: ${char.classType?.name}
        Предыстория: ${char.background?.name}
        Мировоззрение: ${char.alignment}
        Используй богатый литературный язык, добавь драматизма и привязку к миру Забытых Королевств.
      `;
      const story = await PolzaService.chatCompletion(settings, "Ты писатель фэнтези.", storyPrompt);

      // Image
      const imagePrompt = `
        High fantasy portrait of a Dungeons and Dragons character.
        Race: ${char.race?.name}, Class: ${char.classType?.name}, Gender: ${char.gender}.
        Background: ${char.background?.name}.
        Appearance: ${char.eyes} eyes, ${char.skin} skin, ${char.hair} hair.
        Style: Oil painting, highly detailed, dramatic lighting, concept art style like Baldur's Gate 3.
      `;
      const imgUrl = await PolzaService.generateImage(settings, imagePrompt);

      setChar(prev => ({ ...prev, backstory: story, portraitUrl: imgUrl || prev.portraitUrl }));
    } catch (e) {
      console.error(e);
      alert("Ошибка генерации. Проверьте консоль и баланс API.");
    } finally {
      setLoading(false);
    }
  };

  // --- Shop Logic ---
  const getStartingGold = () => 100 + (level * 100); 

  const applyStandardEquipment = () => {
     if (!char.classType || !char.background) return;
     
     const classItems = char.classType.startingEquipment || [];
     const bgItems = char.background.startingEquipment || [];
     const allIds = [...classItems, ...bgItems];
     
     const resolvedItems = allIds.map(id => items.find(i => i.id === id)).filter(i => i !== undefined) as Item[];
     
     setChar(prev => ({ ...prev, inventory: resolvedItems }));
  };

  const applyGoldBuy = () => {
      setChar(prev => ({ ...prev, inventory: [] }));
  };

  useEffect(() => {
     if (step === 8 && shopMode === 'standard' && char.inventory.length === 0) {
         applyStandardEquipment();
     }
  }, [step, shopMode]);
  
  const buyItem = (item: Item) => {
    const currentSpent = char.inventory.reduce((acc, i) => acc + i.cost, 0);
    const budget = getStartingGold();
    if (shopMode === 'buy' && currentSpent + item.cost > budget) {
        alert("Недостаточно золота!");
        return;
    }
    setChar(prev => ({ ...prev, inventory: [...prev.inventory, item] }));
  };

  const removeItem = (index: number) => {
    const newInv = [...char.inventory];
    newInv.splice(index, 1);
    setChar(prev => ({ ...prev, inventory: newInv }));
  };

  const SourceBadge = ({ source }: { source: 'dnd.su' | 'homebrew' }) => (
    <span className={`text-[9px] px-1 rounded border ml-2 ${source === 'homebrew' ? 'border-purple-500 text-purple-400' : 'border-stone-600 text-stone-500'}`}>
        {source === 'homebrew' ? 'HB' : 'D&D.SU'}
    </span>
  );

  // --- Filtering ---
  const filteredRaces = races.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredClasses = classes.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredBackgrounds = backgrounds.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- Step Renderer ---
  const renderStepContent = () => {
    switch (step) {
      case 0: // Race
        return (
          <div className="space-y-4 animate-fade-in">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-stone-300">Выберите происхождение</h3>
                <div className="relative w-1/3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500" size={16} />
                    <input 
                        type="text" placeholder="Поиск..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 p-2 bg-stone-900 border border-stone-700 rounded text-white focus:border-amber-500 outline-none"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {filteredRaces.map(r => (
                <div 
                  key={r.id} onClick={() => setChar({ ...char, race: r })}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition hover:bg-stone-800 ${char.race?.id === r.id ? 'border-amber-500 bg-stone-800' : 'border-stone-700'}`}
                >
                  <div className="flex justify-between items-center">
                      <h3 className="font-bold text-amber-500">{r.name}</h3>
                      <SourceBadge source={r.source} />
                  </div>
                  <p className="text-sm text-stone-400 mt-2 line-clamp-3">{r.description}</p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                      {Object.entries(r.bonuses).map(([k, v]) => (
                          <span key={k} className="text-xs bg-stone-900 px-2 py-1 rounded text-stone-300 border border-stone-600">{k} +{v}</span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 1: // Identity (Updated inputs)
        return (
             <div className="flex flex-col gap-6 animate-fade-in h-[450px] overflow-y-auto pr-2 scrollbar-thin">
                <div className="text-center mb-4">
                    <h2 className="text-3xl font-serif text-amber-500">Личность Героя</h2>
                    <p className="text-stone-500 text-sm">Создайте основу для вашего персонажа</p>
                    {char.race && <div className="mt-2 text-stone-400 text-xs">Выбранная раса: <span className="text-white font-bold">{char.race.name}</span></div>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-800 p-6 rounded border border-stone-600">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-stone-400 mb-1 text-xs uppercase font-bold">Имя персонажа</label>
                            <div className="flex gap-2">
                                <input 
                                    value={char.name} 
                                    onChange={e => setChar({...char, name: e.target.value})} 
                                    className="w-full bg-stone-900 border border-stone-600 p-2 rounded text-white focus:border-amber-500 outline-none"
                                    placeholder="Например: Валериус"
                                />
                                <button onClick={generateName} disabled={loading || !char.race} className="bg-stone-700 hover:bg-stone-600 text-white p-2 rounded border border-stone-500" title="Сгенерировать имя">
                                    <Sparkles size={18} className={loading ? 'animate-spin' : ''}/>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-stone-400 mb-1 text-xs uppercase font-bold">Имя Игрока</label>
                            <input 
                                value={char.playerName} 
                                onChange={e => setChar({...char, playerName: e.target.value})} 
                                className="w-full bg-stone-900 border border-stone-600 p-2 rounded text-white focus:border-amber-500 outline-none"
                                placeholder="Ваше имя"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-stone-400 mb-1 text-xs uppercase font-bold">Пол</label>
                                <select value={char.gender} onChange={e => setChar({...char, gender: e.target.value})} className="w-full bg-stone-900 border border-stone-600 p-2 rounded text-white outline-none cursor-pointer">
                                    <option value="Мужской">Мужской</option>
                                    <option value="Женский">Женский</option>
                                    <option value="Небинарный">Небинарный</option>
                                    <option value="Иное">Иное</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-stone-400 mb-1 text-xs uppercase font-bold">Возраст</label>
                                <input 
                                    type="number" min="1" max="1000" 
                                    value={char.age} 
                                    onChange={e => setChar({...char, age: e.target.value})} 
                                    className="w-full bg-stone-900 border border-stone-600 p-2 rounded text-white outline-none" 
                                    placeholder="25"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-stone-400 mb-1 text-xs uppercase font-bold">Мировоззрение</label>
                            <select value={char.alignment} onChange={e => setChar({...char, alignment: e.target.value})} className="w-full bg-stone-900 border border-stone-600 p-2 rounded text-white outline-none cursor-pointer">
                                <option value="Законопослушный добрый">Законопослушный добрый</option>
                                <option value="Нейтральный добрый">Нейтральный добрый</option>
                                <option value="Хаотичный добрый">Хаотичный добрый</option>
                                <option value="Законопослушный нейтральный">Законопослушный нейтральный</option>
                                <option value="Истинно-нейтральный">Истинно-нейтральный</option>
                                <option value="Хаотичный нейтральный">Хаотичный нейтральный</option>
                                <option value="Законопослушный злой">Законопослушный злой</option>
                                <option value="Нейтральный злой">Нейтральный злой</option>
                                <option value="Хаотичный злой">Хаотичный злой</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-stone-400 mb-1 text-xs uppercase font-bold">Рост (см)</label>
                                <input type="number" min="50" max="300" value={char.height} onChange={e => setChar({...char, height: e.target.value})} className="w-full bg-stone-900 border border-stone-600 p-2 rounded text-white outline-none" placeholder="180"/>
                            </div>
                            <div>
                                <label className="block text-stone-400 mb-1 text-xs uppercase font-bold">Вес (кг)</label>
                                <input type="number" min="10" max="500" value={char.weight} onChange={e => setChar({...char, weight: e.target.value})} className="w-full bg-stone-900 border border-stone-600 p-2 rounded text-white outline-none" placeholder="80"/>
                            </div>
                        </div>
                         <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-stone-400 mb-1 text-[10px] uppercase font-bold">Глаза</label>
                                <select value={char.eyes} onChange={e => setChar({...char, eyes: e.target.value})} className="w-full bg-stone-900 border border-stone-600 p-2 rounded text-white outline-none text-sm cursor-pointer">
                                    {EYE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-stone-400 mb-1 text-[10px] uppercase font-bold">Кожа</label>
                                <select value={char.skin} onChange={e => setChar({...char, skin: e.target.value})} className="w-full bg-stone-900 border border-stone-600 p-2 rounded text-white outline-none text-sm cursor-pointer">
                                    {SKIN_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-stone-400 mb-1 text-[10px] uppercase font-bold">Волосы</label>
                                <select value={char.hair} onChange={e => setChar({...char, hair: e.target.value})} className="w-full bg-stone-900 border border-stone-600 p-2 rounded text-white outline-none text-sm cursor-pointer">
                                    {HAIR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-stone-400 mb-2 text-xs uppercase font-bold">Уровень персонажа</label>
                                <div className="flex items-center gap-2 bg-stone-900 p-2 rounded border border-stone-700">
                                    <input 
                                        type="number" min="1" max="20" 
                                        value={level} 
                                        onChange={e => handleLevelChange(parseInt(e.target.value))}
                                        className="w-full bg-transparent text-white font-bold outline-none text-center"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-stone-400 mb-2 text-xs uppercase font-bold">Опыт (XP)</label>
                                <div className="flex items-center gap-2 bg-stone-900 p-2 rounded border border-stone-700">
                                    <input 
                                        type="number" min="0" 
                                        value={char.xp} 
                                        onChange={e => handleXPChange(parseInt(e.target.value))}
                                        className="w-full bg-transparent text-white font-bold outline-none text-center"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        );

      case 2: // Class
        return (
          <div className="space-y-4 animate-fade-in">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-stone-300">Выберите призвание</h3>
                <div className="relative w-1/3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500" size={16} />
                    <input 
                        type="text" placeholder="Поиск..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 p-2 bg-stone-900 border border-stone-700 rounded text-white focus:border-amber-500 outline-none"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {filteredClasses.map(c => (
                <div 
                  key={c.id} onClick={() => setChar({ ...char, classType: c, subclass: null })}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition hover:bg-stone-800 ${char.classType?.id === c.id ? 'border-dnd-red bg-stone-800' : 'border-stone-700'}`}
                >
                  <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <h3 className="font-bold text-amber-500">{c.name}</h3>
                        <SourceBadge source={c.source} />
                      </div>
                      <span className="text-xs text-stone-500 border border-stone-600 rounded px-1">1к{c.hitDie}</span>
                  </div>
                  <p className="text-sm text-stone-400 mt-2">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 3: // Subclass
        const unlockLevel = char.classType ? (SUBCLASS_LEVELS[char.classType.id] || 3) : 99;
        
        if (level < unlockLevel) {
            return (
                <div className="text-center py-20 text-stone-500 animate-fade-in">
                    <Shield size={48} className="mx-auto mb-4 opacity-50"/>
                    <h3 className="text-xl font-bold">Архетип недоступен</h3>
                    <p>Ваш класс выбирает специализацию на {unlockLevel} уровне.</p>
                    <p>Текущий уровень: {level}</p>
                    <button onClick={() => setStep(s => s + 1)} className="mt-8 text-amber-500 underline">Пропустить</button>
                </div>
            );
        }

        const availableSubclasses = subclasses.filter(s => s.classId === char.classType?.id);

        return (
             <div className="space-y-4 animate-fade-in">
                <div className="bg-stone-800 p-4 rounded border border-stone-700">
                    <h3 className="text-lg font-bold text-amber-500">Выберите Архетип</h3>
                    <p className="text-sm text-stone-400">На этом уровне ваш персонаж выбирает специализацию.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[350px] overflow-y-auto pr-2 scrollbar-thin">
                    {availableSubclasses.length > 0 ? availableSubclasses.map(s => (
                        <div 
                            key={s.id} onClick={() => setChar({ ...char, subclass: s })}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition hover:bg-stone-800 ${char.subclass?.id === s.id ? 'border-amber-500 bg-stone-800' : 'border-stone-700'}`}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-stone-200">{s.name}</h3>
                                <SourceBadge source={s.source} />
                            </div>
                            <p className="text-sm text-stone-400 mt-2">{s.description}</p>
                            <div className="mt-2 text-xs text-stone-500 italic">
                                {s.features.join(' • ')}
                            </div>
                        </div>
                    )) : <div className="col-span-2 text-center text-stone-500 py-10">Нет доступных архетипов для этого класса в базе данных.</div>}
                </div>
             </div>
        );

      case 4: // Stats
        return (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Method Selector */}
            <div className="flex justify-center gap-2 bg-stone-800 p-2 rounded-lg border border-stone-700">
                <button 
                    onClick={() => setStatsMethod('manual')}
                    className={`px-3 py-1 rounded text-sm font-bold ${statsMethod === 'manual' ? 'bg-amber-700 text-white' : 'text-stone-500 hover:text-white'}`}
                >Ручной</button>
                <button 
                    onClick={() => { setStatsMethod('standard'); applyStandardArray(); }}
                    className={`px-3 py-1 rounded text-sm font-bold ${statsMethod === 'standard' ? 'bg-amber-700 text-white' : 'text-stone-500 hover:text-white'}`}
                >Стандартный</button>
                <button 
                    onClick={() => { setStatsMethod('roll'); rollStats(); }}
                    className={`px-3 py-1 rounded text-sm font-bold ${statsMethod === 'roll' ? 'bg-amber-700 text-white' : 'text-stone-500 hover:text-white'}`}
                >Бросок 4d6</button>
                <button 
                    onClick={() => { setStatsMethod('pointbuy'); resetPointBuy(); }}
                    className={`px-3 py-1 rounded text-sm font-bold ${statsMethod === 'pointbuy' ? 'bg-amber-700 text-white' : 'text-stone-500 hover:text-white'}`}
                >Point Buy</button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap justify-center gap-4 bg-stone-800 p-4 rounded-lg border border-stone-700 min-h-[80px] items-center">
                {statsMethod === 'manual' && <p className="text-stone-400 text-sm">Введите значения характеристик вручную.</p>}
                {statsMethod === 'standard' && <p className="text-stone-400 text-sm">Стандартный набор: 15, 14, 13, 12, 10, 8. Распределите значения.</p>}
                {statsMethod === 'roll' && (
                    <button onClick={rollStats} className="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded transition">
                        <Dice5 size={18} /> Перебросить
                    </button>
                )}
                {statsMethod === 'pointbuy' && (
                    <div className="flex items-center gap-4">
                        <button onClick={resetPointBuy} className="flex items-center gap-2 text-stone-400 hover:text-white text-sm">
                            <RefreshCcw size={14} /> Сброс
                        </button>
                        <div className="text-lg">
                            Бюджет: <span className={`font-bold ${pointsRemaining < 0 ? 'text-red-500' : 'text-green-400'}`}>{pointsRemaining}</span> / 27
                        </div>
                    </div>
                )}
                <button onClick={getStatAdvice} disabled={loading} className="flex items-center gap-2 bg-stone-700 hover:bg-stone-600 text-white px-4 py-2 rounded transition text-sm ml-auto border border-stone-500">
                    <Sparkles size={16} /> Совет AI
                </button>
            </div>

            {aiAdvice && <div className="bg-blue-900/30 border border-blue-500/50 p-3 rounded text-blue-200 text-sm italic text-center">{aiAdvice}</div>}
            
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto w-full">
              {Object.entries(char.stats).map(([key, v]) => {
                  const val = v as number;
                  const statKey = key as keyof AbilityScores;
                  const raceBonus = char.race?.bonuses[statKey] || 0;
                  const total = val + raceBonus;
                  
                  return (
                    <div key={key} className="flex flex-col items-center bg-stone-800 p-4 rounded border border-stone-600 relative">
                        <label className="font-bold text-amber-500 mb-2">{Ability[statKey]}</label>
                        
                        {/* Input Area */}
                        <div className="flex items-center gap-2">
                            {statsMethod === 'pointbuy' ? (
                                <div className="flex items-center bg-stone-900 rounded border border-stone-700">
                                    <button 
                                        onClick={() => handlePointBuyChange(statKey, -1)}
                                        disabled={val <= 8}
                                        className="px-2 text-stone-400 hover:text-white disabled:opacity-30"
                                    >-</button>
                                    <span className="w-8 text-center text-white font-bold">{val}</span>
                                    <button 
                                        onClick={() => handlePointBuyChange(statKey, 1)}
                                        disabled={val >= 15 || pointsRemaining <= 0}
                                        className="px-2 text-stone-400 hover:text-white disabled:opacity-30"
                                    >+</button>
                                </div>
                            ) : (
                                <input 
                                    type="number" 
                                    value={val} 
                                    readOnly={statsMethod === 'roll'}
                                    onChange={(e) => updateStats(statKey, parseInt(e.target.value) || 0)}
                                    className={`w-14 text-center bg-stone-900 text-xl p-2 rounded border border-stone-700 text-white outline-none focus:border-amber-500 ${statsMethod === 'roll' ? 'cursor-not-allowed opacity-80' : ''}`}
                                />
                            )}
                            
                            {raceBonus > 0 && <span className="text-green-500 font-bold text-sm" title="Расовый бонус">+{raceBonus}</span>}
                        </div>
                        
                        {/* Modifier Display */}
                        <div className="mt-2 text-xl font-bold text-stone-300 bg-stone-900/50 px-3 py-1 rounded">
                            {Math.floor((total - 10) / 2) > 0 ? '+' : ''}{Math.floor((total - 10) / 2)}
                        </div>
                        <div className="text-[10px] text-stone-500 mt-1">Итого: {total}</div>
                    </div>
                  );
              })}
            </div>
          </div>
        );

      case 5: // Development
        const cid = char.classType?.id || 'fighter';
        const milestones = LEVEL_PROGRESSION.getASIMilestones(cid).filter(m => m <= level);
        const hasFightingStyle = (cid === 'fighter' && level >= 1) || (cid === 'paladin' && level >= 2) || (cid === 'ranger' && level >= 2) || (cid === 'blood_hunter' && level >= 2);
        const hasMetamagic = cid === 'sorcerer' && level >= 3;
        const hasInvocations = cid === 'warlock' && level >= 2;
        const hasExpertise = (cid === 'rogue' && level >= 1) || (cid === 'bard' && level >= 3);

        // Calculate expertise counts
        const expertiseCount = (cid === 'rogue' && level >= 6) ? 4 : (cid === 'rogue' ? 2 : (cid === 'bard' && level >= 10 ? 4 : 2));
        const metamagicCount = level >= 17 ? 4 : (level >= 10 ? 3 : 2);
        const invocationCount = level >= 18 ? 8 : (level >= 15 ? 7 : (level >= 12 ? 6 : (level >= 9 ? 5 : (level >= 7 ? 4 : (level >= 5 ? 3 : 2)))));

        return (
             <div className="space-y-6 animate-fade-in h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                
                {/* ASI / Feats Section */}
                {milestones.length > 0 && (
                    <div className="bg-stone-800/50 p-4 rounded border border-stone-700">
                        <h3 className="text-lg font-bold text-amber-500 mb-4 flex items-center gap-2"><Crown size={20}/> Повышение Характеристик</h3>
                        <div className="space-y-6">
                            {milestones.map(m => (
                                <div key={m} className="p-3 bg-stone-900 rounded border border-stone-800">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-bold text-stone-300">Уровень {m}</span>
                                        <div className="flex bg-stone-800 rounded p-1">
                                            <button 
                                                onClick={() => setAsiChoices({...asiChoices, [m]: 'score'})}
                                                className={`px-3 py-1 rounded text-xs ${(!asiChoices[m] || asiChoices[m] === 'score') ? 'bg-amber-700 text-white' : 'text-stone-500'}`}
                                            >Характеристики</button>
                                            <button 
                                                onClick={() => setAsiChoices({...asiChoices, [m]: 'feat'})}
                                                className={`px-3 py-1 rounded text-xs ${asiChoices[m] === 'feat' ? 'bg-amber-700 text-white' : 'text-stone-500'}`}
                                            >Черта</button>
                                        </div>
                                    </div>

                                    {(!asiChoices[m] || asiChoices[m] === 'score') ? (
                                        <div className="flex gap-4 items-center justify-center">
                                            <select 
                                                onChange={(e) => {
                                                    const k = e.target.value as keyof AbilityScores;
                                                    setScoreIncreases(prev => ({...prev, [m]: {...prev[m], [k]: 2}}));
                                                    updateLevelingStats();
                                                }}
                                                className="bg-stone-800 text-white p-2 rounded text-sm border border-stone-600"
                                            >
                                                <option value="">+2 к одной</option>
                                                {Object.keys(Ability).map(k => <option key={k} value={k}>{Ability[k as keyof typeof Ability]}</option>)}
                                            </select>
                                            <span className="text-stone-500 text-xs">или</span>
                                            <div className="flex gap-2">
                                                <select className="bg-stone-800 text-white p-2 rounded text-sm border border-stone-600 w-24">
                                                    <option>+1</option>
                                                    {Object.keys(Ability).map(k => <option key={k} value={k}>{Ability[k as keyof typeof Ability]}</option>)}
                                                </select>
                                                <select className="bg-stone-800 text-white p-2 rounded text-sm border border-stone-600 w-24">
                                                    <option>+1</option>
                                                    {Object.keys(Ability).map(k => <option key={k} value={k}>{Ability[k as keyof typeof Ability]}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    ) : (
                                        <select 
                                            onChange={(e) => {
                                                const f = feats.find(f => f.id === e.target.value);
                                                if(f && !char.feats.find(x=>x.id===f.id)) setChar(prev => ({...prev, feats: [...prev.feats, f]}));
                                            }}
                                            className="w-full bg-stone-800 text-white p-2 rounded text-sm border border-stone-600"
                                        >
                                            <option value="">Выберите черту...</option>
                                            {feats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                        </select>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Fighting Style */}
                {hasFightingStyle && (
                    <div className="bg-stone-800/50 p-4 rounded border border-stone-700">
                        <h3 className="text-lg font-bold text-amber-500 mb-2 flex items-center gap-2"><Swords size={20}/> Боевой Стиль</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {DND_SU_FIGHTING_STYLES.map(fs => (
                                <div 
                                    key={fs.id}
                                    onClick={() => setChar({...char, fightingStyle: fs.name})}
                                    className={`p-2 border rounded cursor-pointer text-xs transition ${char.fightingStyle === fs.name ? 'bg-amber-900 border-amber-500' : 'bg-stone-900 border-stone-700'}`}
                                >
                                    <div className="font-bold text-stone-200">{fs.name}</div>
                                    <div className="text-stone-500">{fs.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Metamagic */}
                {hasMetamagic && (
                    <div className="bg-stone-800/50 p-4 rounded border border-stone-700">
                        <div className="flex justify-between mb-2">
                            <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2"><Zap size={20}/> Метамагия</h3>
                            <span className="text-xs text-stone-400">{char.metamagic.length} / {metamagicCount}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {DND_SU_METAMAGIC.map(mm => {
                                const isSelected = char.metamagic.includes(mm.name);
                                return (
                                    <div 
                                        key={mm.id}
                                        onClick={() => {
                                            if(isSelected) setChar({...char, metamagic: char.metamagic.filter(x => x !== mm.name)});
                                            else if(char.metamagic.length < metamagicCount) setChar({...char, metamagic: [...char.metamagic, mm.name]});
                                        }}
                                        className={`p-2 border rounded cursor-pointer text-xs transition ${isSelected ? 'bg-purple-900 border-purple-500' : 'bg-stone-900 border-stone-700'}`}
                                    >
                                        <div className="font-bold text-stone-200">{mm.name}</div>
                                        <div className="text-stone-500">{mm.description}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Invocations */}
                {hasInvocations && (
                    <div className="bg-stone-800/50 p-4 rounded border border-stone-700">
                        <div className="flex justify-between mb-2">
                            <h3 className="text-lg font-bold text-dnd-red flex items-center gap-2"><Star size={20}/> Воззвания</h3>
                            <span className="text-xs text-stone-400">{char.invocations.length} / {invocationCount}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {DND_SU_INVOCATIONS.map(inv => {
                                const isSelected = char.invocations.includes(inv.name);
                                return (
                                    <div 
                                        key={inv.id}
                                        onClick={() => {
                                            if(isSelected) setChar({...char, invocations: char.invocations.filter(x => x !== inv.name)});
                                            else if(char.invocations.length < invocationCount) setChar({...char, invocations: [...char.invocations, inv.name]});
                                        }}
                                        className={`p-2 border rounded cursor-pointer text-xs transition ${isSelected ? 'bg-red-900/40 border-red-500' : 'bg-stone-900 border-stone-700'}`}
                                    >
                                        <div className="font-bold text-stone-200">{inv.name}</div>
                                        <div className="text-stone-500">{inv.description}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Expertise */}
                {hasExpertise && (
                    <div className="bg-stone-800/50 p-4 rounded border border-stone-700">
                        <div className="flex justify-between mb-2">
                            <h3 className="text-lg font-bold text-green-400 flex items-center gap-2"><BookOpen size={20}/> Компетентность</h3>
                            <span className="text-xs text-stone-400">{char.expertise.length} / {expertiseCount}</span>
                        </div>
                        <p className="text-xs text-stone-500 mb-2">Выберите навыки, в которых вы уже владеете, чтобы удвоить бонус мастерства.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {char.skills.map(skill => {
                                const isSelected = char.expertise.includes(skill);
                                return (
                                    <div 
                                        key={skill}
                                        onClick={() => {
                                            if(isSelected) setChar({...char, expertise: char.expertise.filter(x => x !== skill)});
                                            else if(char.expertise.length < expertiseCount) setChar({...char, expertise: [...char.expertise, skill]});
                                        }}
                                        className={`p-2 border rounded cursor-pointer text-xs transition text-center ${isSelected ? 'bg-green-900/40 border-green-500 text-green-200' : 'bg-stone-900 border-stone-700 text-stone-400'}`}
                                    >
                                        {skill}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
             </div>
        );

      case 6: // Spells
        if (!char.classType?.spellcastingAbility) {
             return <div className="text-center py-20 text-stone-500">Нет магии у этого класса.<br/><button onClick={() => setStep(s => s + 1)} className="text-amber-500 underline mt-4">Далее</button></div>;
        }

        const classId = char.classType.id;
        const spellConfig = SPELL_LIMITS[classId];
        
        // Check access for Half-Casters
        const isHalfCaster = ['paladin', 'ranger', 'blood_hunter'].includes(classId);
        if (isHalfCaster && level < 2) {
             return (
                <div className="text-center py-20 text-stone-500 animate-fade-in">
                    <Wand2 size={48} className="mx-auto mb-4 opacity-50"/>
                    <h3 className="text-xl font-bold">Магия недоступна</h3>
                    <p>Ваш класс получает способность к заклинаниям на 2-м уровне.</p>
                    <button onClick={() => setStep(s => s + 1)} className="mt-8 text-amber-500 underline">Пропустить</button>
                </div>
             );
        }
        
        // Calculate Limits
        let maxCantrips = 0;
        let maxSpells = 0;
        let limitType = 'known';

        if (spellConfig) {
            limitType = spellConfig.type;
            // Cantrips
            if (spellConfig.cantrips && level <= 20) {
                maxCantrips = spellConfig.cantrips[level - 1] || 0;
            }

            // Spells Known/Prepared
            if (spellConfig.type === 'known' && spellConfig.known) {
                 maxSpells = spellConfig.known[level - 1] || 0;
            } else if (spellConfig.type === 'prepared' || spellConfig.type === 'book') {
                 // Prepared = Mod + Level
                 const abilityKey = char.classType!.spellcastingAbility!;
                 const scoreKey = ABILITY_KEY_MAP[abilityKey];
                 const abilityScore = calculateTotalStats()[scoreKey];
                 const mod = Math.floor((abilityScore - 10) / 2);
                 
                 if (classId === 'paladin') maxSpells = Math.max(1, mod + Math.floor(level / 2));
                 else if (classId === 'artificer') maxSpells = Math.max(1, mod + Math.floor(level / 2));
                 else if (classId === 'wizard') maxSpells = 6 + (Math.max(0, level - 1) * 2); // Spells in book
                 else maxSpells = Math.max(1, mod + level); // Cleric, Druid
            }
        }

        const currentCantrips = char.spells.filter(s => s.level === 0).length;
        const currentSpells = char.spells.filter(s => s.level > 0).length;

        // Unlock Level logic
        let maxSpellLevel = 0;
        if (classId === 'warlock') {
             maxSpellLevel = Math.min(5, Math.ceil(level / 2));
        } else if (['paladin', 'ranger', 'artificer', 'alchemist-hb', 'blood_hunter'].includes(classId)) {
             maxSpellLevel = Math.ceil(level / 4);
        } else {
             maxSpellLevel = Math.min(9, Math.ceil(level / 2));
        }

        const availableSpells = spells.filter(s => s.level <= maxSpellLevel && (s.classes.includes(char.classType!.id)));
        const groupedSpells: Record<number, Spell[]> = {};
        availableSpells.forEach(s => {
            if (!groupedSpells[s.level]) groupedSpells[s.level] = [];
            groupedSpells[s.level].push(s);
        });

        return (
            <div className="space-y-6 animate-fade-in h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                <div className="bg-stone-800 p-4 rounded border border-stone-700 sticky top-0 z-10 flex justify-between items-center shadow-lg">
                    <div>
                        <h3 className="text-lg font-bold text-amber-500">Книга заклинаний</h3>
                        <p className="text-sm text-stone-400">Доступны круги: 0 - {maxSpellLevel}</p>
                    </div>
                    <div className="text-right text-sm space-y-1">
                        <div className={`${currentCantrips > maxCantrips ? 'text-red-500' : 'text-stone-400'}`}>
                            Заговоры: <span className="font-bold text-white">{currentCantrips}</span> / {maxCantrips}
                        </div>
                        <div className={`${currentSpells > maxSpells ? 'text-red-500' : 'text-stone-400'}`}>
                            {limitType === 'prepared' ? 'Подготовлено' : limitType === 'book' ? 'В книге' : 'Известно'}: <span className="font-bold text-white">{currentSpells}</span> / {maxSpells}
                        </div>
                    </div>
                </div>
                
                {Object.entries(groupedSpells).sort((a,b) => Number(a[0]) - Number(b[0])).map(([lvl, list]) => (
                    <div key={lvl} className="space-y-2">
                        <h4 className="font-bold text-stone-300 border-b border-stone-700 pb-1 sticky top-20 bg-[#1a1818] py-2 z-5">
                            {lvl === '0' ? 'Заговоры (0 круг)' : `${lvl} круг`}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {list.map(s => {
                                const isSelected = char.spells.some(x => x.id === s.id);
                                const isCantrip = s.level === 0;
                                const atLimit = isCantrip ? currentCantrips >= maxCantrips : currentSpells >= maxSpells;
                                
                                return (
                                <div 
                                    key={s.id}
                                    onClick={() => {
                                        if (isSelected) {
                                            setChar({...char, spells: char.spells.filter(x => x.id !== s.id)});
                                        } else {
                                            if (atLimit) return; // Prevent adding if at limit
                                            setChar({...char, spells: [...char.spells, s]});
                                        }
                                    }}
                                    className={`p-2 border rounded cursor-pointer text-xs transition relative group 
                                        ${isSelected ? 'bg-purple-900/40 border-purple-500' : 'bg-stone-900 border-stone-800'}
                                        ${!isSelected && atLimit ? 'opacity-50 cursor-not-allowed' : 'hover:border-stone-500'}
                                    `}
                                >
                                    <div className="font-bold flex justify-between">
                                        {s.name}
                                        {isSelected && <span className="text-purple-400">✓</span>}
                                    </div>
                                    <div className="text-stone-500 truncate">{s.description}</div>
                                </div>
                            )})}
                        </div>
                    </div>
                ))}
            </div>
        );

      case 7: // Background
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-64 overflow-y-auto pr-2 scrollbar-thin">
                    {filteredBackgrounds.map(b => (
                    <div 
                        key={b.id} onClick={() => setChar({ ...char, background: b })}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition hover:bg-stone-800 ${char.background?.id === b.id ? 'border-amber-500 bg-stone-800' : 'border-stone-700'}`}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-sm text-amber-500">{b.name}</h3>
                            <SourceBadge source={b.source} />
                        </div>
                        <p className="text-xs text-stone-400 mt-1">{b.feature}</p>
                    </div>
                    ))}
                </div>
                <div className="border-t border-stone-700 pt-4">
                     <div className="flex justify-between mb-2"><h3 className="font-bold text-stone-300">Характер</h3><button onClick={generatePersonality} className="text-xs text-purple-400 flex gap-1"><Sparkles size={12}/> AI (Polza)</button></div>
                     <div className="grid grid-cols-2 gap-2">
                        <textarea placeholder="Черты..." value={char.personalityTraits} onChange={e => setChar({...char, personalityTraits: e.target.value})} className="bg-stone-900 border border-stone-700 rounded p-2 text-xs text-stone-300 h-16"/>
                        <textarea placeholder="Идеалы..." value={char.ideals} onChange={e => setChar({...char, ideals: e.target.value})} className="bg-stone-900 border border-stone-700 rounded p-2 text-xs text-stone-300 h-16"/>
                     </div>
                </div>
            </div>
        );

      case 8: // Shop
        const budget = getStartingGold();
        const spent = char.inventory.reduce((acc, i) => acc + i.cost, 0);
        const remaining = budget - spent;
        
        const weapons = items.filter(i => i.type === 'weapon');
        const armor = items.filter(i => i.type === 'armor');
        const gear = items.filter(i => i.type === 'gear');

        return (
            <div className="h-[500px] flex gap-4 animate-fade-in">
                {/* Store Shelves */}
                <div className="w-2/3 flex flex-col gap-4">
                    <div className="flex justify-between items-center bg-stone-800 p-3 rounded border border-stone-700">
                        <h3 className="font-bold text-amber-500 flex items-center gap-2"><ShoppingCart size={20}/> Магазин</h3>
                        <div className="flex items-center bg-stone-900 rounded p-1 border border-stone-700">
                             <button 
                                onClick={() => { setShopMode('standard'); applyStandardEquipment(); }} 
                                className={`px-3 py-1 rounded text-xs transition ${shopMode === 'standard' ? 'bg-amber-700 text-white' : 'text-stone-500'}`}
                             >
                                 Стандарт
                             </button>
                             <button 
                                onClick={() => { setShopMode('buy'); applyGoldBuy(); }} 
                                className={`px-3 py-1 rounded text-xs transition ${shopMode === 'buy' ? 'bg-amber-700 text-white' : 'text-stone-500'}`}
                             >
                                 Покупка
                             </button>
                        </div>
                        
                        {shopMode === 'buy' && (
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-stone-400">Бюджет: <span className="text-white font-bold">{budget} зм</span></span>
                                <span className={`${remaining < 0 ? 'text-red-500' : 'text-green-400'}`}>{remaining.toFixed(1)} зм</span>
                            </div>
                        )}
                    </div>
                    
                    {shopMode === 'standard' ? (
                         <div className="flex flex-col items-center justify-center h-full text-stone-500">
                            <Package size={48} className="mb-4 opacity-50"/>
                            <p>Снаряжение выдано автоматически на основе вашего Класса и Предыстории.</p>
                            <p className="text-xs mt-2">Переключитесь в режим "Покупка", чтобы выбрать предметы вручную.</p>
                         </div>
                    ) : (
                        <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin space-y-6">
                            <div>
                                <h4 className="font-bold text-stone-400 mb-2 border-b border-stone-700">Оружие</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {weapons.map(item => (
                                        <div key={item.id} className="flex justify-between items-center bg-stone-900 p-2 rounded border border-stone-800 text-xs">
                                            <div>
                                                <div className="font-bold text-stone-200">{item.name}</div>
                                                <div className="text-stone-500">{item.damage} • {item.cost} зм</div>
                                            </div>
                                            <button onClick={() => buyItem(item)} className="text-green-500 hover:text-green-400"><PlusCircle size={18}/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-stone-400 mb-2 border-b border-stone-700">Доспехи</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {armor.map(item => (
                                        <div key={item.id} className="flex justify-between items-center bg-stone-900 p-2 rounded border border-stone-800 text-xs">
                                            <div>
                                                <div className="font-bold text-stone-200">{item.name}</div>
                                                <div className="text-stone-500">КД {item.ac} • {item.cost} зм</div>
                                            </div>
                                            <button onClick={() => buyItem(item)} className="text-green-500 hover:text-green-400"><PlusCircle size={18}/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-stone-400 mb-2 border-b border-stone-700">Снаряжение</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {gear.map(item => (
                                        <div key={item.id} className="flex justify-between items-center bg-stone-900 p-2 rounded border border-stone-800 text-xs">
                                            <div>
                                                <div className="font-bold text-stone-200">{item.name}</div>
                                                <div className="text-stone-500">{item.cost} зм</div>
                                            </div>
                                            <button onClick={() => buyItem(item)} className="text-green-500 hover:text-green-400"><PlusCircle size={18}/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Cart */}
                <div className="w-1/3 bg-stone-800 rounded border border-stone-700 flex flex-col">
                    <div className="p-3 border-b border-stone-600 font-bold text-stone-300">Инвентарь</div>
                    <div className="flex-grow overflow-y-auto p-2 space-y-2">
                        {char.inventory.length === 0 && <div className="text-stone-500 text-center text-sm mt-10">Пусто</div>}
                        {char.inventory.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-stone-900 p-2 rounded border border-stone-800 text-xs group">
                                <span>{item.name}</span>
                                {shopMode === 'buy' && (
                                    <button onClick={() => removeItem(idx)} className="text-stone-600 group-hover:text-red-500"><MinusCircle size={14}/></button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

      case 9: // Finalize
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-dnd-red border-b border-stone-700 pb-2 flex items-center gap-2"><Wand2 /> Ритуал Призыва</h3>
                    <p className="text-sm text-stone-400">Генерация истории и портрета (Polza AI).</p>
                    <button onClick={generateBackstoryAndArt} disabled={loading} className={`w-full flex items-center justify-center gap-2 p-6 rounded-lg font-bold text-white text-lg transition shadow-lg ${loading ? 'bg-stone-600' : 'bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 border border-purple-500'}`}>
                        {loading ? <span className="animate-pulse">Магия...</span> : <><Sparkles size={24}/> Оживить Героя</>}
                    </button>
                    {char.portraitUrl && <img src={char.portraitUrl} alt="Character" className="w-full rounded-lg border-4 border-stone-800 shadow-2xl" />}
                </div>
                <textarea value={char.backstory} onChange={(e) => setChar({...char, backstory: e.target.value})} className="w-full p-4 bg-stone-900 border border-stone-700 rounded text-stone-300 font-serif text-sm min-h-[300px] outline-none" placeholder="История..."/>
            </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#151414] min-h-screen border-x border-stone-900 shadow-2xl">
        {/* Steps Header */}
        <div className="mb-6 overflow-x-auto pb-2">
             <div className="flex justify-between min-w-[800px]">
                {STEPS.map((label, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => idx <= step ? setStep(idx) : null}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border transition ${idx === step ? 'border-amber-500 bg-amber-900 text-white' : 'border-stone-700 bg-stone-800 text-stone-500'}`}>
                            {idx + 1}
                        </div>
                        <span className={`text-[10px] uppercase font-bold ${idx === step ? 'text-amber-500' : 'text-stone-600'}`}>{label}</span>
                    </div>
                ))}
             </div>
        </div>

        <div className="min-h-[550px] mb-8 bg-[#1a1818] p-6 rounded-lg border border-stone-800 shadow-inner">
            {renderStepContent()}
        </div>

        <div className="flex justify-between pt-6 border-t border-stone-800">
             {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-stone-500 hover:text-white"><ArrowLeft size={16}/> Назад</button>}
             <button 
                onClick={() => step === STEPS.length - 1 ? onComplete(char) : setStep(s => s + 1)}
                disabled={
                    (step === 0 && !char.race) ||
                    (step === 1 && !char.name) ||
                    (step === 2 && !char.classType)
                }
                className={`flex items-center gap-2 px-8 py-2 rounded font-bold transition ml-auto ${
                    ((step === 0 && !char.race) || (step === 1 && !char.name) || (step === 2 && !char.classType))
                    ? 'bg-stone-700 text-stone-500' : 'bg-dnd-red hover:bg-red-800 text-white'}`}
            >
                {step === STEPS.length - 1 ? 'Завершить' : 'Далее'} <ArrowRight size={16} />
            </button>
        </div>
    </div>
  );
};
