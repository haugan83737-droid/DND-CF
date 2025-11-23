
import { AppSettings } from '../types';

const BASE_URL = 'https://api.polza.ai/api/v1';

export const PolzaService = {
  
  // --- Chat Completions ---
  chatCompletion: async (settings: AppSettings, systemPrompt: string, userPrompt: string): Promise<string> => {
    if (!settings.apiKey) return "Ошибка: API Key не настроен.";

    try {
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: settings.textModel || 'openai/gpt-4o',
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        if (response.status === 402) throw new Error("Недостаточно средств на балансе Polza AI.");
        if (response.status === 401) throw new Error("Неверный API ключ.");
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "Нет ответа от модели.";
    } catch (e: any) {
      console.error("Polza Chat Error:", e);
      return `Ошибка генерации: ${e.message}`;
    }
  },

  // --- JSON Generation Wrapper ---
  generateJSON: async (settings: AppSettings, systemPrompt: string, userPrompt: string): Promise<any> => {
    const jsonSystemPrompt = `${systemPrompt}\nВАЖНО: Твой ответ должен быть СТРОГО валидным JSON объектом без markdown разметки (без \`\`\`json).`;
    
    const text = await PolzaService.chatCompletion(settings, jsonSystemPrompt, userPrompt);
    
    try {
      // Clean up potential markdown code blocks just in case
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("JSON Parse Error", text);
      return {};
    }
  },

  // --- Image Generation (Async) ---
  generateImage: async (settings: AppSettings, prompt: string): Promise<string | null> => {
    if (!settings.apiKey) return null;

    try {
      // 1. Start Task
      const startResponse = await fetch(`${BASE_URL}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: settings.imageModel || 'seedream-v4',
          prompt: prompt,
          size: "1:1",
          imageResolution: "2K"
        })
      });

      if (!startResponse.ok) {
        const err = await startResponse.json();
        throw new Error(err.message || startResponse.statusText);
      }

      const { requestId } = await startResponse.json();
      if (!requestId) throw new Error("No requestId returned");

      // 2. Poll Status
      let attempts = 0;
      const maxAttempts = 30; // 60 seconds timeout roughly

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s

        const statusResponse = await fetch(`${BASE_URL}/images/${requestId}`, {
          headers: { 'Authorization': `Bearer ${settings.apiKey}` }
        });

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          
          // Check for completion (Polza API specific structure might vary, adapting to common patterns)
          // Assuming statusData contains { status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED', url: string }
          
          if (statusData.status === 'COMPLETED' || statusData.status === 'SUCCESS') {
            return statusData.url || statusData.output?.[0] || null;
          }
          
          if (statusData.status === 'FAILED') {
            throw new Error("Image generation failed on server.");
          }
        }
        attempts++;
      }
      
      throw new Error("Timeout waiting for image.");

    } catch (e: any) {
      console.error("Polza Image Error:", e);
      return null;
    }
  }
};
