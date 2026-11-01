import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverEnvPath = path.resolve(__dirname, '../../.env');

export class AIServiceNotConfiguredError extends Error {
  constructor(message = 'AI service is not configured') {
    super(message);
    this.name = 'AIServiceNotConfiguredError';
    this.statusCode = 503;
    this.status = 503;
  }
}

/**
 * Service to execute conversational AI queries via configured external LLM provider.
 * Keeps all API keys strictly on the server side.
 */
export class AIService {
  /**
   * Checks whether an AI provider API key is present in environment variables.
   * Dynamically reloads server/.env if process.env lacks keys (e.g. edited at runtime).
   * @returns {{ configured: boolean, provider: string|null }}
   */
  getStatus() {
    let geminiKey = process.env.GEMINI_API_KEY;
    let openaiKey = process.env.OPENAI_API_KEY;

    // Reload from server/.env if keys are missing from process.env (only outside automated test mode)
    if (process.env.NODE_ENV !== 'test' && (!geminiKey || geminiKey.trim().length === 0) && (!openaiKey || openaiKey.trim().length === 0)) {
      dotenv.config({ path: serverEnvPath, override: true });
      geminiKey = process.env.GEMINI_API_KEY;
      openaiKey = process.env.OPENAI_API_KEY;
    }

    if (geminiKey && geminiKey.trim().length > 0) {
      return { configured: true, provider: 'gemini' };
    }
    if (openaiKey && openaiKey.trim().length > 0) {
      return { configured: true, provider: 'openai' };
    }
    return { configured: false, provider: null };
  }

  /**
   * Sends a user query to the active AI provider with optional FitShift profile context.
   * 
   * @param {string} userQuery
   * @param {object} [context]
   * @returns {Promise<{ reply: string, response: string, provider: string, timestamp: string }>}
   */
  async generateResponse(userQuery, context = null) {
    if (!userQuery || typeof userQuery !== 'string' || userQuery.trim() === '') {
      throw new Error('Query must be a non-empty string');
    }

    const { configured, provider } = this.getStatus();
    if (!configured) {
      throw new AIServiceNotConfiguredError('AI service is not configured. GEMINI_API_KEY or OPENAI_API_KEY is required.');
    }

    const systemPrompt = `You are FitShift AI, an evidence-based fitness and Indian whole-food nutrition coach.
You specialize in budget-realistic Indian nutrition (sattu, kala chana, moong dal, paneer, dahi, eggs, soya) and progressive overload training (home calisthenics and gym).
Provide clear, practical, structured, and encouraging advice. Keep answers actionable and avoid expensive Western supplements unless requested.
${context ? `Active User Context: Goal: ${context.goal || 'General'}, Environment: ${context.environment || 'Home'}, Diet: ${context.diet || 'Vegetarian'}, Daily Budget: ₹${context.dailyBudget || 65}/day, Session: ${context.durationMinutes || 45} mins.` : ''}`;

    let result;
    if (provider === 'gemini') {
      result = await this._callGemini(userQuery.trim(), systemPrompt);
    } else {
      result = await this._callOpenAI(userQuery.trim(), systemPrompt);
    }

    return {
      reply: result.reply,
      response: result.reply,
      provider: result.provider,
      timestamp: new Date().toISOString()
    };
  }

  async _callGemini(prompt, systemInstruction) {
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey) {
      throw new AIServiceNotConfiguredError('GEMINI_API_KEY is missing or empty.');
    }

    // Prioritized model fallback list (handles high-demand spikes and API migrations seamlessly)
    const candidateModels = [
      'gemini-3.6-flash',
      'gemini-3.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.8-flash',
      'gemini-flash-latest'
    ];

    let lastError = null;

    for (const model of candidateModels) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const payload = {
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      };

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const json = await res.json();
          const reply = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply && reply.trim().length > 0) {
            return { reply: reply.trim(), provider: 'gemini' };
          }
        } else {
          const errBody = await res.json().catch(() => ({}));
          const msg = errBody.error?.message || `HTTP ${res.status}`;
          lastError = new Error(`Gemini API (${model}): ${msg}`);

          // If demand spike (503) or model unavailable (404), fall back to next candidate model
          if (res.status === 503 || res.status === 404) {
            continue;
          }
          // For auth errors (400, 403), stop immediately and throw informative error
          throw lastError;
        }
      } catch (err) {
        lastError = err;
        if (err.message && err.message.includes('API key not valid')) {
          throw err;
        }
      }
    }

    throw lastError || new Error('All Gemini model endpoints failed to respond. Please try again in a few moments.');
  }

  async _callOpenAI(prompt, systemInstruction) {
    const apiKey = (process.env.OPENAI_API_KEY || '').trim();
    if (!apiKey) {
      throw new AIServiceNotConfiguredError('OPENAI_API_KEY is missing or empty.');
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const msg = errBody.error?.message || `OpenAI API error (HTTP ${res.status})`;
      throw new Error(`AI Provider Error: ${msg}`);
    }

    const json = await res.json();
    const reply = json.choices?.[0]?.message?.content;
    if (!reply) {
      throw new Error('Invalid or empty response structure from OpenAI API');
    }

    return { reply: reply.trim(), provider: 'openai' };
  }
}

export const aiService = new AIService();
export default aiService;
