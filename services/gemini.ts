import { GoogleGenAI } from "@google/genai";
import { Character } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const GeminiService = {
  // Utility to check API key
  checkApiKey: () => !!apiKey,

  generateName: async (raceName: string, gender: string = 'fantasy'): Promise<string> => {
    if (!apiKey) return "Nameless One";
    const prompt = `Generate a single unique, fantasy name for a D&D 5e ${raceName}. Gender hint: ${gender}. Return ONLY the name.`;
    try {
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      return response.text?.trim().replace(/["']/g, "") || "Unknown";
    } catch (e) { return "Hero"; }
  },

  suggestStats: async (className: string, raceName: string): Promise<string> => {
    if (!apiKey) return "Советы недоступны без API ключа.";
    const prompt = `
      Ты опытный мастер D&D 5e. Дай краткий совет (макс 2 предложения) по распределению характеристик (Stats) 
      для персонажа: Раса ${raceName}, Класс ${className}. 
      Что качать в первую очередь?
    `;
    try {
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      return response.text || "Нет совета.";
    } catch (e) { return "Ошибка получения совета."; }
  },

  generatePersonality: async (char: Character): Promise<{traits: string, ideals: string, bonds: string, flaws: string}> => {
    if (!apiKey) return { traits: "-", ideals: "-", bonds: "-", flaws: "-" };
    
    const prompt = `
      Создай личность для D&D персонажа:
      Раса: ${char.race?.name}
      Класс: ${char.classType?.name}
      Предыстория: ${char.background?.name}
      
      Верни JSON (без markdown форматирования) с полями:
      - traits (2 черты характера)
      - ideals (1 идеал)
      - bonds (1 привязанность)
      - flaws (1 слабость/изъян)
      Все на русском языке.
    `;

    try {
      const response = await ai.models.generateContent({ 
        model: 'gemini-2.5-flash', 
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error(e);
      return { traits: "Ошибка", ideals: "Ошибка", bonds: "Ошибка", flaws: "Ошибка" };
    }
  },

  describeItem: async (itemName: string): Promise<string> => {
    if (!apiKey) return "Обычный предмет.";
    const prompt = `Describe the appearance of a fantasy ${itemName} in one vivid sentence. Russian language.`;
    try {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text || itemName;
    } catch (e) { return itemName; }
  },

  generateBackstory: async (char: Character): Promise<string> => {
    if (!apiKey) return "API Key missing. Please configure process.env.API_KEY.";

    const prompt = `
      Ты опытный мастер подземелий D&D 5e.
      Напиши короткую, захватывающую предысторию (максимум 3 абзаца) для персонажа:
      Имя: ${char.name || 'Безымянный'}
      Раса: ${char.race?.name}
      Класс: ${char.classType?.name}
      Предыстория: ${char.background?.name}
      Мировоззрение: ${char.alignment}
      Черты: ${char.personalityTraits}
      
      Используй богатый литературный язык, добавь драматизма и привязку к миру Забытых Королевств.
      Ответ дай на русском языке.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "Не удалось сгенерировать историю.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Ошибка генерации. Проверьте API ключ или соединение.";
    }
  },

  generatePortrait: async (char: Character): Promise<string | null> => {
    if (!apiKey) return null;

    const prompt = `
      High fantasy portrait of a Dungeons and Dragons character.
      Race: ${char.race?.name}, Class: ${char.classType?.name}, Gender: Neutral/Androgynous/Male/Female.
      Background: ${char.background?.name}.
      Equipment: ${char.inventory.slice(0, 2).join(", ")}.
      Style: Oil painting, highly detailed, dramatic lighting, concept art style like Baldur's Gate 3.
      Looking heroic.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt,
        config: {
             imageConfig: { aspectRatio: '1:1' }
        }
      });
      
       for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
       }
       return null;

    } catch (error) {
      console.error("Gemini Image Error:", error);
      return null;
    }
  }
};