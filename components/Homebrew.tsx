import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { Race } from '../types';
import { Save, Plus } from 'lucide-react';

export const HomebrewEditor: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [raceName, setRaceName] = useState('');
  const [raceDesc, setRaceDesc] = useState('');
  const [speed, setSpeed] = useState(30);
  const [message, setMessage] = useState('');

  const handleSaveRace = () => {
    if (!raceName) return;
    
    const newRace: Race = {
      id: `hb-${Date.now()}`,
      name: raceName,
      description: raceDesc,
      speed: speed,
      bonuses: { STR: 1 }, // Simplified for demo
      features: ['Кастомная особенность'],
      source: 'homebrew'
    };

    StorageService.saveHomebrewRace(newRace);
    setMessage('Раса успешно сохранена! Теперь она доступна в Мастере Создания.');
    setRaceName('');
    setRaceDesc('');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-stone-900 min-h-screen">
      <button onClick={onBack} className="mb-6 text-stone-400 hover:text-white">← Назад</button>
      
      <h1 className="text-3xl font-bold text-amber-500 mb-6">Мастерская Homebrew</h1>
      <p className="text-stone-400 mb-8 border-b border-stone-700 pb-4">
        Здесь вы можете создавать свои собственные расы и классы, если официального контента dnd.su недостаточно.
        Данные сохраняются локально в вашем браузере.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Race Creator */}
        <div className="bg-stone-800 p-6 rounded border border-stone-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             <Plus size={20} className="text-green-500"/> Создать Расу
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-stone-400">Название Расы</label>
              <input 
                className="w-full bg-stone-900 border border-stone-600 rounded p-2 text-white"
                value={raceName}
                onChange={e => setRaceName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400">Описание</label>
              <textarea 
                className="w-full bg-stone-900 border border-stone-600 rounded p-2 text-white h-24"
                value={raceDesc}
                onChange={e => setRaceDesc(e.target.value)}
              />
            </div>
             <div>
              <label className="block text-sm text-stone-400">Скорость (футы)</label>
              <input 
                type="number"
                className="w-full bg-stone-900 border border-stone-600 rounded p-2 text-white"
                value={speed}
                onChange={e => setSpeed(parseInt(e.target.value))}
              />
            </div>
            
            <button 
                onClick={handleSaveRace}
                className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded font-bold flex justify-center items-center gap-2 mt-4"
            >
                <Save size={18} /> Сохранить в базу
            </button>
            
            {message && <div className="text-green-400 text-sm text-center mt-2">{message}</div>}
          </div>
        </div>

        {/* Placeholder for Class Creator */}
        <div className="bg-stone-800/50 p-6 rounded border border-stone-700 border-dashed flex flex-col items-center justify-center text-stone-500">
            <h2 className="text-xl font-bold mb-2">Конструктор Классов</h2>
            <p className="text-center">В разработке...<br/>(Логика аналогична созданию рас)</p>
        </div>
      </div>
    </div>
  );
};