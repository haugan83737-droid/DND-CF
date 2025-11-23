
import React, { useState } from 'react';
import { Character, Ability, AbilityScores, Spell, Item } from '../types';
import { ALL_SKILLS, DND_SU_FIGHTING_STYLES, DND_SU_METAMAGIC, DND_SU_INVOCATIONS } from '../services/dndData';
import { Printer, ArrowLeft, Download, Loader2 } from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import jsPDF from 'jspdf';

interface SheetProps {
  character: Character;
  onBack: () => void;
}

const ABILITY_TO_KEY: Record<string, keyof AbilityScores> = {
  'Сила': 'STR',
  'Ловкость': 'DEX',
  'Телосложение': 'CON',
  'Интеллект': 'INT',
  'Мудрость': 'WIS',
  'Харизма': 'CHA'
};

export const Sheet: React.FC<SheetProps> = ({ character, onBack }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // --- Calculation Helpers ---
  const getTotalScore = (key: keyof AbilityScores) => {
      const base = character.stats[key];
      const race = character.race?.bonuses[key] || 0;
      const leveling = character.levelingStats[key] || 0;
      return base + race + leveling;
  };

  const getModNum = (score: number) => Math.floor((score - 10) / 2);
  
  const getModStr = (score: number) => {
    const mod = getModNum(score);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const pb = character.proficiencyBonus;
  const strScore = getTotalScore('STR');
  const dexScore = getTotalScore('DEX');
  const conScore = getTotalScore('CON');
  const intScore = getTotalScore('INT');
  const wisScore = getTotalScore('WIS');
  const chaScore = getTotalScore('CHA');

  // Skills & Perception
  const isPercProf = character.skills.includes('Внимательность');
  const isPercExpert = character.expertise.includes('Внимательность');
  const percBonus = (isPercProf ? pb : 0) + (isPercExpert ? pb : 0);
  const passivePerc = 10 + getModNum(wisScore) + percBonus;

  // Senses
  const hasDarkvision = character.race?.features.some(f => f.toLowerCase().includes('темное зрение') || f.toLowerCase().includes('darkvision'));
  const sensesString = hasDarkvision ? 'Темное зрение (60 фт)' : '—';

  // Carrying Capacity
  const totalWeight = character.inventory.reduce((acc, item) => acc + (item.weight || 0), 0);
  const carryingCapacity = strScore * 15;

  // AC Calculation
  const equippedArmor = character.inventory.find(i => i.type === 'armor' && i.id !== 'shield');
  const equippedShield = character.inventory.find(i => i.id === 'shield');
  
  let ac = 10 + getModNum(dexScore); // Unarmored base

  if (equippedArmor && equippedArmor.ac) {
      // Wearing Armor
      const isHeavy = equippedArmor.name.includes('Латы') || equippedArmor.name.includes('Кольчуга') || equippedArmor.name.includes('Наборный');
      const isMedium = equippedArmor.name.includes('Кираса') || equippedArmor.name.includes('Чешуйчатый') || equippedArmor.name.includes('Шкурный') || equippedArmor.name.includes('Кольчужная рубаха');

      if (isHeavy) {
          ac = equippedArmor.ac;
      } else if (isMedium) {
          ac = equippedArmor.ac + Math.min(2, getModNum(dexScore));
      } else {
          ac = equippedArmor.ac + getModNum(dexScore);
      }
      
      if (character.fightingStyle === 'Оборона') ac += 1;
      if (equippedShield) ac += 2;

  } else {
      // Unarmored
      if (character.classType?.id === 'barbarian') {
          // Unarmored Defense (Barbarian): 10 + Dex + Con. Shields allowed.
          ac = 10 + getModNum(dexScore) + getModNum(conScore);
          if (equippedShield) ac += 2;
      } else if (character.classType?.id === 'monk') {
          // Unarmored Defense (Monk): 10 + Dex + Wis. No shields.
          ac = 10 + getModNum(dexScore) + getModNum(wisScore);
          // Monk loses this if using a shield, logic handles it by not adding shield bonus here,
          // but strictly Monk AC doesn't work with shield at all.
          // If shield is equipped, fall back to 10 + Dex + 2
          if (equippedShield) {
              ac = 10 + getModNum(dexScore) + 2; 
          }
      } else {
          // Standard unarmored
          if (equippedShield) ac += 2;
          // Draconic Sorcerer? (Not fully implemented, but usually 13 + Dex)
          if (character.subclass?.id === 'sorc-draconic') ac = 13 + getModNum(dexScore) + (equippedShield ? 2 : 0);
      }
  }

  // Speed Calculation
  let speed = character.race?.speed || 30;
  
  // Monk Unarmored Movement (No armor, no shield)
  if (character.classType?.id === 'monk' && !equippedArmor && !equippedShield) {
      if (character.level >= 2) speed += 10;
      if (character.level >= 6) speed += 5; // Total +15
      if (character.level >= 10) speed += 5; // Total +20
      if (character.level >= 14) speed += 5; // Total +25
      if (character.level >= 18) speed += 5; // Total +30
  }

  // Barbarian Fast Movement (No heavy armor)
  if (character.classType?.id === 'barbarian' && character.level >= 5) {
      const isHeavy = equippedArmor?.name.includes('Латы') || equippedArmor?.name.includes('Кольчуга') || equippedArmor?.name.includes('Наборный');
      if (!isHeavy) speed += 10;
  }


  // Descriptions
  const getFightingStyleDesc = (name: string | null) => DND_SU_FIGHTING_STYLES.find(fs => fs.name === name)?.description;
  
  const armorProfs = character.classType?.id === 'monk' || character.classType?.id === 'sorcerer' || character.classType?.id === 'wizard' ? 'Нет' : 'Лёгкие, Средние, Щиты';
  const weaponProfs = character.classType?.id === 'wizard' || character.classType?.id === 'sorcerer' ? 'Кинжалы, дротики, пращи, посохи, арбалеты' : 'Простое, Боевое';
  
  // Group Spells
  const groupedSpells: Record<number, Spell[]> = {};
  character.spells.forEach(s => {
      if (!groupedSpells[s.level]) groupedSpells[s.level] = [];
      groupedSpells[s.level].push(s);
  });

  // Resources
  const getClassResources = () => {
      const level = character.level;
      const cid = character.classType?.id;
      const resources = [];

      if (cid === 'barbarian') {
          const rages = level < 3 ? 2 : level < 6 ? 3 : level < 12 ? 4 : level < 17 ? 5 : level < 20 ? 6 : '∞';
          const rageDmg = level < 9 ? '+2' : level < 16 ? '+3' : '+4';
          resources.push({ name: 'Ярость', total: rages, restore: 'Длинный отдых' });
          resources.push({ name: 'Урон ярости', total: rageDmg, restore: 'Пассивное' });
      }
      if (cid === 'bard') {
          const die = level < 5 ? 'd6' : level < 10 ? 'd8' : level < 15 ? 'd10' : 'd12';
          resources.push({ name: 'Вдохновение', total: Math.max(1, getModNum(chaScore)), restore: level >= 5 ? 'Короткий отдых' : 'Длинный отдых', note: die });
      }
      if (cid === 'cleric' || cid === 'paladin') {
          if (level >= 2) resources.push({ name: 'Бож. канал', total: cid === 'paladin' ? 1 : (level < 6 ? 1 : level < 18 ? 2 : 3), restore: 'Короткий отдых' });
      }
      if (cid === 'druid' && level >= 2) {
          resources.push({ name: 'Дикий облик', total: 2, restore: 'Короткий отдых' });
      }
      if (cid === 'fighter') {
          resources.push({ name: 'Второе дыхание', total: 1, restore: 'Короткий отдых' });
          if (level >= 2) resources.push({ name: 'Всплеск действий', total: level < 17 ? 1 : 2, restore: 'Короткий отдых' });
      }
      if (cid === 'monk') {
          resources.push({ name: 'Ци', total: level, restore: 'Короткий отдых' });
      }
      if (cid === 'paladin') {
          resources.push({ name: 'Наложение рук', total: level * 5, restore: 'Длинный отдых' });
      }
      if (cid === 'sorcerer' && level >= 2) {
          resources.push({ name: 'Очки чародейства', total: level, restore: 'Длинный отдых' });
      }
      if (cid === 'warlock') {
          const slots = level < 2 ? 1 : level < 11 ? 2 : level < 17 ? 3 : 4;
          const slotLvl = level < 3 ? 1 : level < 5 ? 2 : level < 7 ? 3 : level < 9 ? 4 : 5;
          resources.push({ name: 'Ячейки пакта', total: slots, restore: 'Короткий отдых', note: `${slotLvl} круг` });
      }

      return resources;
  };

  const resources = getClassResources();

  // Spell Slots Calculation (Standard Full Caster for simplicity, Warlock handled in resources)
  const getSlots = (lvl: number) => {
      const level = character.level;
      // Full caster progression
      const slots = [
          [2,0,0,0,0,0,0,0,0], // 1
          [3,0,0,0,0,0,0,0,0], // 2
          [4,2,0,0,0,0,0,0,0], // 3
          [4,3,0,0,0,0,0,0,0], // 4
          [4,3,2,0,0,0,0,0,0], // 5
          [4,3,3,0,0,0,0,0,0], // 6
          [4,3,3,1,0,0,0,0,0], // 7
          [4,3,3,2,0,0,0,0,0], // 8
          [4,3,3,3,1,0,0,0,0], // 9
          [4,3,3,3,2,0,0,0,0], // 10
          [4,3,3,3,2,1,0,0,0], // 11
          [4,3,3,3,2,1,0,0,0], // 12
          [4,3,3,3,2,1,1,0,0], // 13
          [4,3,3,3,2,1,1,0,0], // 14
          [4,3,3,3,2,1,1,1,0], // 15
          [4,3,3,3,2,1,1,1,0], // 16
          [4,3,3,3,2,1,1,1,1], // 17
          [4,3,3,3,3,1,1,1,1], // 18
          [4,3,3,3,3,2,1,1,1], // 19
          [4,3,3,3,3,2,2,1,1]  // 20
      ];
      
      // Half casters (Paladin, Ranger, Artificer) - Artificer rounds up, Pal/Rgr round up for slots in single class
      if (character.classType?.id === 'paladin' || character.classType?.id === 'ranger' || character.classType?.id === 'artificer') {
          if (character.classType?.id !== 'artificer' && character.level < 2) return 0;
          
          const effLvl = Math.ceil(character.level / 2);
          if (effLvl < 1) return 0;
          return slots[effLvl-1][lvl-1] || 0;
      }
      
      // Warlock has special slots
      if (character.classType?.id === 'warlock') return 0; // Handled in resources

      return slots[character.level - 1][lvl - 1] || 0;
  };

  // Spellcasting Stats for Header
  let spellSaveDC = 0;
  let spellAttackMod = 0;
  let spellAbilityName = '-';

  if (character.classType?.spellcastingAbility) {
      spellAbilityName = character.classType.spellcastingAbility; // 'Интеллект' etc.
      const key = ABILITY_TO_KEY[spellAbilityName];
      if (key) {
          const score = getTotalScore(key);
          const mod = getModNum(score);
          spellSaveDC = 8 + pb + mod;
          spellAttackMod = pb + mod;
      }
  }

  // --- PDF Generation ---
  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
        const pages = document.querySelectorAll('.print-page');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i] as HTMLElement;
            // Use html2canvas to capture the element
            const canvas = await html2canvas(page, {
                scale: 2, // Higher scale for better quality
                useCORS: true, // Important for loading images
                logging: false,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }
        
        pdf.save(`${character.name || 'Character'}_Sheet.pdf`);
    } catch (error) {
        console.error('PDF Generation failed:', error);
        alert('Ошибка создания PDF. Попробуйте стандартную печать (Ctrl+P).');
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#333] py-8 font-sans">
      
      {/* Controls */}
      <div className="fixed top-0 left-0 right-0 bg-[#1a1818] p-4 shadow-md z-50 no-print flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-300 hover:text-white transition">
            <ArrowLeft size={20} /> Назад
        </button>
        <div className="flex gap-4">
            <button 
                onClick={handleDownloadPDF} 
                disabled={isGeneratingPdf}
                className="flex items-center gap-2 bg-dnd-red hover:bg-red-800 px-4 py-2 rounded text-white shadow transition disabled:opacity-50"
            >
                {isGeneratingPdf ? <Loader2 className="animate-spin" size={20}/> : <Download size={20} />} 
                {isGeneratingPdf ? 'Создание...' : 'Скачать PDF'}
            </button>
            <button 
                onClick={() => window.print()} 
                className="flex items-center gap-2 bg-stone-700 hover:bg-stone-600 px-4 py-2 rounded text-white shadow transition border border-stone-500"
            >
                <Printer size={20} /> Печать
            </button>
        </div>
      </div>

      {/* Spacing for fixed header */}
      <div className="h-20 no-print"></div>

      <div id="sheet-content" className="flex flex-col items-center gap-8 pb-20">
        
        {/* --- PAGE 1: MECHANICS --- */}
        <div className="print-page bg-white shadow-2xl text-sm text-black relative overflow-hidden mx-auto border border-stone-300">
            
            {/* HEADER */}
            <div className="flex justify-between items-start border-b-4 border-black pb-2 mb-4">
                <div className="w-1/3 flex flex-col justify-end pr-2">
                    <div className="text-3xl font-bold uppercase truncate font-serif tracking-tighter leading-none">{character.name || 'ИМЯ'}</div>
                    <div className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">Имя Персонажа</div>
                </div>
                <div className="w-2/3 grid grid-cols-3 gap-x-3 gap-y-2 bg-stone-100/50 p-3 rounded border border-stone-200 text-[10px]">
                    <div className="border-b border-stone-300">
                        <span className="block font-bold truncate">{character.classType?.name} {character.level}</span>
                        <span className="text-[8px] text-stone-400 uppercase">Класс и Уровень</span>
                    </div>
                    <div className="border-b border-stone-300">
                        <span className="block font-bold truncate">{character.background?.name}</span>
                        <span className="text-[8px] text-stone-400 uppercase">Предыстория</span>
                    </div>
                    <div className="border-b border-stone-300">
                        <span className="block font-bold truncate">{character.playerName || '—'}</span>
                        <span className="text-[8px] text-stone-400 uppercase">Имя Игрока</span>
                    </div>
                    <div className="border-b border-stone-300">
                        <span className="block font-bold truncate">{character.race?.name}</span>
                        <span className="text-[8px] text-stone-400 uppercase">Раса</span>
                    </div>
                    <div className="border-b border-stone-300">
                        <span className="block font-bold truncate">{character.alignment}</span>
                        <span className="text-[8px] text-stone-400 uppercase">Мировоззрение</span>
                    </div>
                    <div className="border-b border-stone-300">
                        <span className="block font-bold truncate">{character.xp || 0}</span>
                        <span className="text-[8px] text-stone-400 uppercase">Опыт (XP)</span>
                    </div>
                </div>
            </div>

            {/* 3 COLUMNS */}
            <div className="grid grid-cols-12 gap-4 h-[92%]">
                
                {/* === LEFT COL (Stats) === */}
                <div className="col-span-4 flex flex-col gap-3">
                    
                    {/* ATTRIBUTES */}
                    <div className="flex flex-col gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200">
                        {Object.keys(character.stats).map((k) => {
                            const key = k as keyof AbilityScores;
                            const score = getTotalScore(key);
                            const mod = getModNum(score);
                            return (
                                <div key={key} className="flex items-center justify-between bg-white border border-stone-300 rounded px-2 py-1 shadow-sm relative overflow-visible h-12">
                                    <div className="flex flex-col items-center w-8">
                                        <span className="font-bold text-[9px] text-stone-400 uppercase">{key}</span>
                                        <span className="font-bold text-sm text-stone-800">{score}</span>
                                    </div>
                                    <div className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center bg-white absolute -right-3 top-1/2 transform -translate-y-1/2 shadow-md z-10">
                                        <span className="font-bold text-lg">{mod >= 0 ? `+${mod}` : mod}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* INSPIRATION & PB */}
                    <div className="flex gap-2">
                        <div className="border-2 border-stone-400 rounded-lg p-1 flex items-center gap-2 w-1/2 bg-white shadow-sm">
                            <div className={`w-7 h-7 rounded-full border-2 border-stone-300 flex items-center justify-center ${character.inspiration ? 'bg-dnd-red text-white' : 'bg-white'}`}>
                                {character.inspiration && '★'}
                            </div>
                            <span className="text-[8px] font-bold uppercase leading-tight text-stone-500">Вдохновение</span>
                        </div>
                        <div className="border-2 border-black rounded-lg p-1 flex items-center gap-2 w-1/2 bg-white shadow-sm">
                            <div className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center font-bold text-sm bg-white">
                                +{pb}
                            </div>
                            <span className="text-[8px] font-bold uppercase leading-tight text-black">Мастерство</span>
                        </div>
                    </div>

                    {/* SAVING THROWS */}
                    <div className="border border-stone-300 rounded-lg p-2 bg-white shadow-sm">
                        <h3 className="text-center text-[9px] font-bold uppercase tracking-wider border-b border-stone-200 mb-1 text-stone-500">Спасброски</h3>
                        {Object.keys(Ability).map(k => {
                            const key = k as keyof AbilityScores;
                            const isProf = character.classType?.saves.includes(Ability[key]);
                            const mod = getModNum(getTotalScore(key)) + (isProf ? pb : 0);
                            return (
                                <div key={key} className="flex items-center gap-2 text-[10px] mb-0.5">
                                    <div className={`w-3 h-3 rounded-full border border-black flex items-center justify-center ${isProf ? 'bg-black' : 'bg-white'}`}>
                                    </div>
                                    <span className="w-6 text-center font-mono border-b border-stone-300">{mod >= 0 ? `+${mod}` : mod}</span>
                                    <span className={isProf ? 'font-bold text-black' : 'text-stone-500'}>{Ability[key]}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* SKILLS */}
                    <div className="border border-stone-300 rounded-lg p-2 flex-grow bg-white shadow-sm">
                        <h3 className="text-center text-[9px] font-bold uppercase tracking-wider border-b border-stone-200 mb-1 text-stone-500">Навыки</h3>
                        <div className="space-y-[2px]">
                            {Object.entries(ALL_SKILLS).map(([skill, ab]) => {
                                const key = Object.keys(Ability).find(k => Ability[k as keyof typeof Ability] === ab) as keyof AbilityScores;
                                const isProf = character.skills.includes(skill);
                                const isExp = character.expertise.includes(skill);
                                const mod = getModNum(getTotalScore(key)) + (isProf ? pb : 0) + (isExp ? pb : 0);
                                
                                return (
                                    <div key={skill} className="flex items-center gap-2 text-[10px]">
                                        <div className={`w-3 h-3 rounded-full border border-black flex items-center justify-center ${isProf ? 'bg-black' : 'bg-white'} relative`}>
                                            {isExp && <div className="w-1.5 h-1.5 bg-white rounded-full absolute"/>}
                                        </div>
                                        <span className="w-6 text-center font-mono border-b border-stone-300 text-stone-700">{mod >= 0 ? `+${mod}` : mod}</span>
                                        <span className={`${isProf ? 'font-bold text-black' : 'text-stone-500'} truncate w-full`}>
                                            {skill} <span className="text-[7px] text-stone-300 ml-1">({key})</span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* PASSIVE PERC & SENSES */}
                    <div className="space-y-1">
                        <div className="border border-stone-300 rounded-full p-1 flex items-center justify-between bg-stone-50 shadow-inner">
                            <div className="w-8 h-8 rounded-full bg-white border border-stone-300 flex items-center justify-center font-bold text-sm">{passivePerc}</div>
                            <span className="text-[9px] uppercase font-bold text-stone-500 pr-3">Пассивная Внимательность</span>
                        </div>
                        <div className="border border-stone-300 rounded p-1 bg-white text-[9px] flex justify-between px-2 shadow-sm">
                            <span className="text-stone-500 font-bold">Чувства:</span>
                            <span className="text-black truncate ml-1">{sensesString}</span>
                        </div>
                    </div>

                    {/* PROFS */}
                    <div className="border border-stone-300 rounded-lg p-2 min-h-[80px] bg-white shadow-sm">
                        <h3 className="text-[8px] font-bold uppercase text-stone-400 mb-1 border-b border-stone-100 pb-1">Прочие владения</h3>
                        <div className="text-[9px] leading-tight space-y-1">
                            <p><strong className="text-black">Доспехи:</strong> <span className="text-stone-600">{armorProfs}</span></p>
                            <p><strong className="text-black">Оружие:</strong> <span className="text-stone-600">{weaponProfs}</span></p>
                            <p><strong className="text-black">Инструменты:</strong> <span className="text-stone-600">{character.tools.join(', ') || 'Нет'}</span></p>
                            <p><strong className="text-black">Языки:</strong> <span className="text-stone-600">{character.languages.join(', ')}</span></p>
                        </div>
                    </div>
                </div>

                {/* === CENTER COL (Combat) === */}
                <div className="col-span-4 flex flex-col gap-3">
                    {/* Vitals Row */}
                    <div className="grid grid-cols-3 gap-3 bg-stone-100 p-3 rounded-xl border border-stone-300 shadow-inner">
                        <div className="bg-white border-2 border-black p-2 text-center rounded-t-lg rounded-b-[20px] shadow-sm">
                            <div className="text-[8px] uppercase font-bold text-stone-400">Класс Брони</div>
                            <div className="text-3xl font-bold text-black leading-none mt-1">{ac}</div>
                        </div>
                        <div className="bg-white border-2 border-black p-2 text-center rounded-lg shadow-sm">
                            <div className="text-[8px] uppercase font-bold text-stone-400">Инициатива</div>
                            <div className="text-3xl font-bold text-black leading-none mt-1">{getModStr(getTotalScore('DEX'))}</div>
                        </div>
                        <div className="bg-white border-2 border-black p-2 text-center rounded-lg shadow-sm">
                            <div className="text-[8px] uppercase font-bold text-stone-400">Скорость</div>
                            <div className="text-3xl font-bold text-black leading-none mt-1">{speed}</div>
                        </div>
                    </div>

                    {/* HP */}
                    <div className="border rounded-lg p-1 bg-stone-200">
                        <div className="bg-white border border-stone-300 rounded-lg p-2">
                            <div className="flex justify-between text-[8px] uppercase text-stone-400 border-b border-stone-200 pb-1 mb-1">
                                <span>Максимум ХП: {character.hp.max}</span>
                            </div>
                            <div className="h-12 text-4xl text-center flex items-center justify-center font-mono text-stone-300">
                                {character.hp.current}
                            </div>
                            <div className="text-center text-[8px] uppercase font-bold text-black mt-1">Текущие Хиты</div>
                        </div>
                    </div>

                    <div className="border border-stone-300 rounded-lg p-2 bg-white shadow-sm">
                        <div className="h-6 mb-1 text-xl text-center font-mono text-stone-300">
                            {character.hp.temp > 0 ? character.hp.temp : ''}
                        </div>
                        <div className="text-center text-[8px] uppercase font-bold text-stone-500">Временные Хиты</div>
                    </div>

                    {/* Dice & Saves */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="border border-stone-300 rounded-lg p-2 bg-white shadow-sm">
                            <div className="text-[8px] uppercase text-stone-400 text-center mb-1">Кость Хитов</div>
                            <div className="flex justify-between items-center text-[10px] px-2">
                                <span>Всего: {character.level}</span>
                                <span>{character.classType?.hitDie}</span>
                            </div>
                            <div className="h-4 border-t border-stone-200 mt-1"></div>
                            <div className="text-[8px] text-center text-stone-300">Остаток</div>
                        </div>
                        <div className="border border-stone-300 rounded-lg p-2 bg-white shadow-sm">
                            <div className="text-[8px] uppercase text-stone-400 text-center mb-1">Спасброски смерти</div>
                            <div className="flex justify-between items-center text-[9px] px-1 mb-1">
                                <span className="font-bold text-stone-500">УСП</span>
                                <div className="flex gap-1">
                                    {[1,2,3].map(i => <div key={i} className="w-3 h-3 border border-stone-300 rounded-full"></div>)}
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-[9px] px-1">
                                <span className="font-bold text-stone-500">ПРВ</span>
                                <div className="flex gap-1">
                                    {[1,2,3].map(i => <div key={i} className="w-3 h-3 border border-stone-300 rounded-full"></div>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attacks */}
                    <div className="border border-stone-300 rounded-lg p-2 shadow-sm min-h-[200px] bg-white">
                        <div className="grid grid-cols-12 gap-1 bg-stone-100 p-1 text-[8px] uppercase font-bold text-stone-500 mb-2 rounded">
                            <div className="col-span-5 pl-1">Атака</div>
                            <div className="col-span-3 text-center">Бонус</div>
                            <div className="col-span-4 text-right pr-1">Урон/Тип</div>
                        </div>
                        <div className="space-y-2">
                            {character.inventory.filter(i => i.type === 'weapon').slice(0, 5).map((w, i) => {
                                const isFinesse = w.properties?.includes('Фехтовальное');
                                const strMod = getModNum(getTotalScore('STR'));
                                const dexMod = getModNum(getTotalScore('DEX'));
                                const usedMod = isFinesse ? Math.max(strMod, dexMod) : strMod;
                                const atk = usedMod + pb;
                                const archeryBonus = (character.fightingStyle === 'Стрельба' && (w.name.includes('лук') || w.name.includes('арбалет'))) ? 2 : 0;
                                const dmgBonus = (character.fightingStyle === 'Дуэлянт' && w.damage && !w.properties?.includes('Двуручное')) ? 2 : 0;

                                return (
                                    <div key={i} className="grid grid-cols-12 gap-1 text-[10px] items-center border-b border-stone-100 pb-1">
                                        <div className="col-span-5 font-bold truncate pl-1">{w.name}</div>
                                        <div className="col-span-3 text-center font-mono text-stone-700">+{atk + archeryBonus}</div>
                                        <div className="col-span-4 text-right truncate text-stone-600 pr-1 text-[9px]">{w.damage} {dmgBonus > 0 ? `+${dmgBonus}` : ''}</div>
                                    </div>
                                );
                            })}
                            {/* Empty slots lines */}
                            {Array.from({length: Math.max(0, 4 - character.inventory.filter(i => i.type === 'weapon').length)}).map((_, i) => (
                                <div key={`e-${i}`} className="border-b border-stone-100 h-6 bg-stone-50/30"></div>
                            ))}
                        </div>
                        <div className="mt-2 p-2 border border-stone-200 rounded h-20 bg-stone-50">
                            <div className="text-[8px] text-stone-400 uppercase mb-1 text-center">Заклинания / Боеприпасы</div>
                            <div className="h-full w-full"></div>
                        </div>
                    </div>

                    {/* RESOURCES (NEW) */}
                    <div className="border border-stone-300 rounded-lg p-2 bg-white flex-grow shadow-sm">
                        <div className="text-[9px] text-center font-bold uppercase text-stone-500 mb-1 border-b pb-1">Ресурсы Класса</div>
                        <div className="space-y-1">
                            {resources.map((res, i) => (
                                <div key={i} className="flex justify-between items-center text-[10px] bg-stone-50 p-1 rounded border border-stone-100">
                                    <span className="font-bold text-stone-700 truncate max-w-[50%]">{res.name} {res.note && <span className="font-normal text-[8px] text-stone-400">({res.note})</span>}</span>
                                    <div className="flex gap-2 items-center">
                                        <span className="text-[7px] text-stone-400 uppercase">{res.restore}</span>
                                        <div className="border border-stone-400 px-2 rounded bg-white font-mono font-bold min-w-[24px] text-center">{res.total}</div>
                                    </div>
                                </div>
                            ))}
                            {resources.length === 0 && <div className="text-[9px] text-stone-400 text-center italic py-4">Нет ресурсов для отслеживания</div>}
                        </div>
                    </div>

                    {/* Equipment & Currency */}
                    <div className="border border-stone-300 rounded-lg p-2 shadow-sm flex gap-2 h-[220px] bg-white">
                        <div className="flex flex-col gap-1 w-10">
                            {['ММ', 'СМ', 'ЭМ', 'ЗМ', 'ПМ'].map((coin) => {
                                const val = coin === 'ЗМ' ? character.currency.gp : 0;
                                return (
                                    <div key={coin} className="border border-stone-300 rounded p-0.5 text-center bg-stone-50 h-7 flex flex-col justify-center">
                                        <div className="text-[6px] text-stone-400 font-bold">{coin}</div>
                                        <div className="text-[9px] font-bold">{val}</div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="flex-grow flex flex-col">
                            <h3 className="text-center text-[9px] font-bold uppercase border-b border-stone-200 mb-1 pb-1 text-stone-500">Снаряжение</h3>
                            <div className="text-[9px] space-y-0.5 flex-grow overflow-hidden">
                                {character.inventory.filter(i => i.type !== 'weapon').slice(0, 12).map((item, i) => (
                                    <div key={i} className="flex justify-between border-b border-stone-100">
                                        <span className="truncate w-3/4">{item.name}</span>
                                        {item.weight && <span className="text-stone-400 text-[8px]">{item.weight} фнт.</span>}
                                    </div>
                                ))}
                            </div>
                            {/* Encumbrance */}
                            <div className="border-t border-stone-200 mt-1 pt-1 flex justify-between text-[9px]">
                                <span className="text-stone-500">Вес: <span className="text-black font-bold">{totalWeight.toFixed(1)}</span></span>
                                <span className="text-stone-500">Макс: <span className="text-black font-bold">{carryingCapacity}</span></span>
                            </div>
                            
                            {/* Attunement */}
                            <div className="mt-2 bg-stone-50 p-1 rounded border border-stone-200">
                                <div className="text-[7px] text-center text-stone-400 uppercase font-bold mb-1">Настройка (Attunement)</div>
                                <div className="flex justify-center gap-3">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="w-3 h-3 rounded-full border border-stone-300 bg-white"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === RIGHT COL (Features) === */}
                <div className="col-span-4 flex flex-col gap-3">
                    {/* Traits Box */}
                    <div className="bg-stone-100 p-3 rounded-lg border border-stone-300 text-[10px] space-y-3 shadow-inner">
                        <div className="bg-white p-2 rounded border border-stone-200 shadow-sm">
                            <div className="font-bold uppercase text-stone-400 text-[8px] mb-1">Черты характера</div>
                            <p className="italic leading-tight text-stone-800">{character.personalityTraits || '—'}</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-stone-200 shadow-sm">
                            <div className="font-bold uppercase text-stone-400 text-[8px] mb-1">Идеалы</div>
                            <p className="italic leading-tight text-stone-800">{character.ideals || '—'}</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-stone-200 shadow-sm">
                            <div className="font-bold uppercase text-stone-400 text-[8px] mb-1">Привязанности</div>
                            <p className="italic leading-tight text-stone-800">{character.bonds || '—'}</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-stone-200 shadow-sm">
                            <div className="font-bold uppercase text-stone-400 text-[8px] mb-1">Слабости</div>
                            <p className="italic leading-tight text-stone-800">{character.flaws || '—'}</p>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="border border-stone-300 rounded-lg p-3 shadow-sm flex-grow flex flex-col bg-white">
                        <h3 className="text-center text-[9px] font-bold uppercase border-b border-stone-200 mb-2 pb-1 text-stone-500">Умения и Особенности</h3>
                        <div className="flex-grow space-y-3 overflow-hidden">
                            {/* Class Features */}
                            <div>
                                <div className="text-[8px] uppercase font-bold text-dnd-red mb-1">Классовые умения</div>
                                {character.classType?.features.map(f => (
                                    <div key={f} className="text-[10px] leading-tight mb-1 border-l-2 border-stone-300 pl-1">
                                        <strong className="text-stone-800">{f}</strong>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Subclass */}
                            {character.subclass && (
                                <div>
                                    <div className="text-[8px] uppercase font-bold text-dnd-red mb-1">{character.subclass.name}</div>
                                    {character.subclass.features.map(f => (
                                        <div key={f} className="text-[10px] leading-tight mb-1 border-l-2 border-stone-300 pl-1">
                                            <strong className="text-stone-800">{f}</strong>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Race */}
                            <div>
                                <div className="text-[8px] uppercase font-bold text-dnd-red mb-1">Расовые черты</div>
                                {character.race?.features.map(f => (
                                    <div key={f} className="text-[10px] leading-tight mb-1 border-l-2 border-stone-300 pl-1">
                                        <strong className="text-stone-800">{f}</strong>
                                    </div>
                                ))}
                            </div>

                            {/* Feats */}
                            {character.feats.length > 0 && (
                                <div>
                                    <div className="text-[8px] uppercase font-bold text-dnd-red mb-1">Черты</div>
                                    {character.feats.map(f => (
                                        <div key={f.id} className="text-[10px] leading-tight mb-1 border-l-2 border-stone-300 pl-1">
                                            <strong className="block text-black">{f.name}</strong>
                                            <p className="text-stone-600 text-[9px]">{f.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Fighting Style */}
                            {character.fightingStyle && (
                                <div>
                                    <div className="text-[8px] uppercase font-bold text-dnd-red mb-1">Боевой стиль</div>
                                    <div className="text-[10px] leading-tight border-l-2 border-stone-300 pl-1">
                                        <strong className="block text-black">{character.fightingStyle}</strong>
                                        <p className="text-stone-600 text-[9px]">{getFightingStyleDesc(character.fightingStyle)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- PAGE 2: SPELLS & BACKSTORY --- */}
        <div className="print-page bg-white shadow-2xl text-sm text-black mx-auto border border-stone-300">
            
            {/* Grimoire */}
            <div className="mb-6">
                <div className="flex justify-between items-center border-b-2 border-black mb-4 pb-1">
                    <h3 className="text-xl font-bold uppercase font-serif">Гримуар</h3>
                    {character.classType?.spellcastingAbility ? (
                        <div className="text-xs text-stone-500 flex gap-4">
                            <span>Базовая хар-ка: <strong className="text-black">{spellAbilityName}</strong></span>
                            <span>Сл спасброска: <strong className="text-black text-sm border border-stone-300 px-1 rounded">{spellSaveDC}</strong></span>
                            <span>Бонус атаки: <strong className="text-black text-sm border border-stone-300 px-1 rounded">+{spellAttackMod}</strong></span>
                        </div>
                    ) : (
                        <span className="text-xs text-stone-400">Не владеет магией</span>
                    )}
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    {Object.keys(groupedSpells).length === 0 && <p className="col-span-3 text-stone-400 italic text-center py-10">Книга заклинаний пуста.</p>}
                    
                    {Object.entries(groupedSpells).sort((a,b) => Number(a[0]) - Number(b[0])).map(([lvl, list]) => (
                        <div key={lvl} className="mb-4 break-inside-avoid">
                            <div className="font-bold bg-stone-100 border border-stone-300 px-2 py-1 mb-2 text-center text-xs uppercase rounded flex justify-between items-center">
                                <span>{lvl === '0' ? 'Заговоры' : `${lvl} круг`}</span>
                                {lvl !== '0' && (
                                    <div className="flex gap-1">
                                        {Array.from({length: getSlots(Number(lvl))}).map((_, i) => (
                                            <div key={i} className="w-3 h-3 border border-stone-500 bg-white rounded-sm"></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                {list.map(s => (
                                    <div key={s.id} className="text-[10px] border-b border-stone-100 pb-2 break-inside-avoid">
                                        <div className="font-bold text-dnd-red flex justify-between items-center">
                                            <span>{s.name}</span>
                                            {s.source === 'homebrew' && <span className="text-[8px] text-stone-400 border rounded px-1">HB</span>}
                                        </div>
                                        <div className="text-[9px] text-stone-500 mb-1 italic">
                                            {s.school} • {s.castingTime} • {s.range} • {s.components} • {s.duration}
                                        </div>
                                        <div className="text-stone-800 leading-tight text-justify">
                                            {s.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Backstory & Bio */}
            <div className="grid grid-cols-2 gap-6 border-t-4 border-double border-stone-300 pt-6">
                <div>
                    <h3 className="font-bold text-lg mb-2 uppercase text-stone-700 font-serif border-b border-stone-200 pb-1">Предыстория</h3>
                    <p className="text-xs leading-relaxed text-justify whitespace-pre-wrap text-stone-800 font-serif">
                        {character.backstory || "История персонажа не написана..."}
                    </p>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2 uppercase text-stone-700 font-serif border-b border-stone-200 pb-1">Портрет</h3>
                    <div className="border-4 border-stone-200 rounded-lg bg-stone-100 h-[350px] flex items-center justify-center overflow-hidden mb-4 shadow-inner">
                        {character.portraitUrl ? (
                            <img src={character.portraitUrl} alt="Character" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-stone-400 italic">Нет изображения</span>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] bg-stone-50 p-3 rounded border border-stone-200">
                        <div className="border-b border-stone-200 pb-1">
                            <span className="text-stone-400 uppercase block text-[8px] font-bold">Возраст</span>
                            <strong>{character.age}</strong>
                        </div>
                        <div className="border-b border-stone-200 pb-1">
                            <span className="text-stone-400 uppercase block text-[8px] font-bold">Рост / Вес</span>
                            <strong>{character.height} см / {character.weight} кг</strong>
                        </div>
                        <div className="border-b border-stone-200 pb-1">
                            <span className="text-stone-400 uppercase block text-[8px] font-bold">Глаза</span>
                            <strong>{character.eyes}</strong>
                        </div>
                        <div className="border-b border-stone-200 pb-1">
                            <span className="text-stone-400 uppercase block text-[8px] font-bold">Кожа</span>
                            <strong>{character.skin}</strong>
                        </div>
                        <div className="border-b border-stone-200 pb-1">
                            <span className="text-stone-400 uppercase block text-[8px] font-bold">Волосы</span>
                            <strong>{character.hair}</strong>
                        </div>
                        <div className="border-b border-stone-200 pb-1">
                            <span className="text-stone-400 uppercase block text-[8px] font-bold">Пол</span>
                            <strong>{character.gender}</strong>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
