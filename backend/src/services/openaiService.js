const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not found in environment variables');
      this.client = null;
      return;
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async evaluateSpell(spell, creatureType, creatureWeakness) {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Please check your API key.');
    }

    const prompt = `
You are evaluating a magical spell cast by a student learning prompt engineering.

Creature: ${creatureType}
Creature's Weakness: ${creatureWeakness}
Student's Spell: "${spell}"

Evaluate the spell's effectiveness based on:
1. Clarity and specificity of the instruction
2. How well it targets the creature's weakness
3. Appropriate tone and structure

Respond with a JSON object containing:
{
  "effectiveness": number (1-10),
  "damage": number (0-100),
  "feedback": "Brief explanation of why it worked/didn't work",
  "success": boolean
}

Be encouraging but honest in your evaluation.
    `.trim();

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini', // Using gpt-4o-mini as gpt-5-nano isn't available yet
        messages: [
          {
            role: 'system',
            content: 'You are a helpful game master evaluating student prompts in an educational RPG about AI literacy.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      const result = response.choices[0].message.content;
      return JSON.parse(result);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Fallback evaluation for demo purposes
      return {
        effectiveness: Math.floor(Math.random() * 10) + 1,
        damage: Math.floor(Math.random() * 100),
        feedback: "Unable to connect to AI evaluation service. This is a demo result.",
        success: Math.random() > 0.5
      };
    }
  }

  async moderateContent(text) {
    if (!this.client) {
      return { flagged: false, categories: {} };
    }

    try {
      const response = await this.client.moderations.create({
        input: text,
      });

      return response.results[0];
    } catch (error) {
      console.error('Content moderation error:', error);
      return { flagged: false, categories: {} };
    }
  }
}

module.exports = new OpenAIService();