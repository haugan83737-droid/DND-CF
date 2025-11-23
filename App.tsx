
import React, { useState, useEffect } from 'react';
import { Wizard } from './components/Wizard';
import { Sheet } from './components/Sheet';
import { HomebrewEditor } from './components/Homebrew';
import { SettingsModal } from './components/Settings';
import { Character, AppView, AppSettings } from './types';
import { Sword, Scroll, FlaskConical, Github, Settings } from 'lucide-react';

function App() {
  const [view, setView] = useState<AppView>('wizard');
  const [character, setCharacter] = useState<Character | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    textModel: 'openai/gpt-4o',
    imageModel: 'seedream-v4'
  });

  // Load settings on mount
  useEffect(() => {
    const stored = localStorage.getItem('dnd_forge_settings');
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) { console.error("Settings parse error", e); }
    }
  }, []);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('dnd_forge_settings', JSON.stringify(newSettings));
  };

  const handleWizardComplete = (char: Character) => {
    setCharacter(char);
    setView('sheet');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-stone-200 font-sans selection:bg-dnd-red selection:text-white">
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings} 
        onSave={handleSaveSettings} 
      />

      {/* Header */}
      <header className="bg-[#1a1818] border-b border-stone-800 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-dnd-red cursor-pointer" onClick={() => setView('wizard')}>
            <Sword className="rotate-90" size={28} />
            <h1 className="text-xl font-bold tracking-wider text-stone-100">
              D&D <span className="text-dnd-red">CHARACTER FORGE</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex gap-6 text-sm font-bold text-stone-400 uppercase tracking-widest items-center">
            <button 
                onClick={() => setView('wizard')} 
                className={`hover:text-amber-500 transition ${view === 'wizard' ? 'text-amber-500' : ''}`}
            >
                Создание
            </button>
            <button 
                onClick={() => setView('homebrew')} 
                className={`hover:text-amber-500 transition flex items-center gap-1 ${view === 'homebrew' ? 'text-amber-500' : ''}`}
            >
                <FlaskConical size={16} /> Homebrew
            </button>
            <button
                onClick={() => setIsSettingsOpen(true)}
                className="hover:text-white transition text-stone-500 flex items-center gap-1"
                title="Настройки AI"
            >
                <Settings size={18} />
            </button>
          </nav>

          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="text-stone-500 hover:text-white transition"
          >
            <Github size={24} />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {view === 'wizard' && (
            <div className="animate-fade-in">
                <div className="text-center py-12 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] border-b border-stone-800 mb-6">
                    <h2 className="text-4xl font-serif text-amber-500 mb-2">Кузница Героев</h2>
                    <p className="text-stone-400 max-w-xl mx-auto">
                        Используйте данные <b>dnd.su</b> для создания легального персонажа 5-й редакции, 
                        или добавьте свой контент через <b>Homebrew</b>. 
                        Используйте <span className="text-white font-bold cursor-pointer hover:underline" onClick={() => setIsSettingsOpen(true)}>Polza AI</span> для генерации истории и портрета.
                    </p>
                </div>
                <Wizard 
                    settings={settings}
                    onComplete={handleWizardComplete} 
                    onCancel={() => window.location.reload()} 
                />
            </div>
        )}

        {view === 'sheet' && character && (
            <Sheet character={character} onBack={() => setView('wizard')} />
        )}

        {view === 'homebrew' && (
            <HomebrewEditor onBack={() => setView('wizard')} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0f0e0e] text-stone-600 py-8 mt-12 border-t border-stone-900 text-center">
        <p>Данные контента основаны на OGL и dnd.su. Приложение для личного использования.</p>
      </footer>
    </div>
  );
}

export default App;
