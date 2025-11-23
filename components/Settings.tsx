
import React from 'react';
import { AppSettings, AVAILABLE_TEXT_MODELS, AVAILABLE_IMAGE_MODELS } from '../types';
import { X, Save, Key, MessageSquare, Image as ImageIcon } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState<AppSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border-2 border-stone-700 rounded-lg w-full max-w-md p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-500 hover:text-white">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center gap-2">
          <Key size={24} /> Настройки AI
        </h2>

        <div className="space-y-6">
          
          {/* API KEY */}
          <div>
            <label className="block text-stone-400 text-xs uppercase font-bold mb-2">Polza AI API Key</label>
            <input 
              type="password" 
              value={localSettings.apiKey}
              onChange={(e) => setLocalSettings({...localSettings, apiKey: e.target.value})}
              placeholder="sk-..."
              className="w-full bg-stone-800 border border-stone-600 rounded p-3 text-white focus:border-amber-500 outline-none"
            />
            <p className="text-[10px] text-stone-500 mt-1">Ключ сохраняется только в вашем браузере.</p>
          </div>

          {/* Text Model */}
          <div>
            <label className="block text-stone-400 text-xs uppercase font-bold mb-2 flex items-center gap-2">
                <MessageSquare size={14}/> Текстовая Модель
            </label>
            <select 
                value={localSettings.textModel}
                onChange={(e) => setLocalSettings({...localSettings, textModel: e.target.value})}
                className="w-full bg-stone-800 border border-stone-600 rounded p-3 text-white focus:border-amber-500 outline-none cursor-pointer"
            >
                {AVAILABLE_TEXT_MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                ))}
            </select>
          </div>

          {/* Image Model */}
          <div>
            <label className="block text-stone-400 text-xs uppercase font-bold mb-2 flex items-center gap-2">
                <ImageIcon size={14}/> Графическая Модель
            </label>
            <select 
                value={localSettings.imageModel}
                onChange={(e) => setLocalSettings({...localSettings, imageModel: e.target.value})}
                className="w-full bg-stone-800 border border-stone-600 rounded p-3 text-white focus:border-amber-500 outline-none cursor-pointer"
            >
                {AVAILABLE_IMAGE_MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                ))}
            </select>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
                onClick={handleSave}
                className="flex-1 bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded flex justify-center items-center gap-2"
            >
                <Save size={18} /> Сохранить
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
