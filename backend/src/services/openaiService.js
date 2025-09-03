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

    Creature: ${creatureType}
    Creature's Weakness: ${creatureWeakness}
    Student's Spell: "${spell}".
    `.trim();

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'system',
            content:
              `
            You are a helpful game master evaluating student prompts in an educational RPG about AI literacy. You are evaluating a magical spell cast by a student learning prompt engineering. Evaluate the spell's effectiveness based on:
            1. Clarity and specificity of the instruction
            2. How well it targets the creature's weakness
            3. Appropriate tone and structure

            Respond with ONLY a valid JSON object (no additional text) containing:
            {
              "effectiveness": number (1-10),
              "damage": number (0-100),
              "feedback": "Brief explanation of why it worked/didn't work",
              "success": boolean
            }

            Be encouraging but honest in your evaluation. Return only the JSON, nothing else.
            `
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      if (!response.choices || !response.choices[0] || !response.choices[0].message) {
        throw new Error('Invalid API response structure');
      }

      const result = response.choices[0].message.content;

      if (!result || result.trim() === '') {
        throw new Error('Empty response from AI');
      }

      const trimmedResult = result.trim();

      // Try to extract JSON if there's extra text
      let jsonStr = trimmedResult;
      const jsonMatch = trimmedResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      try {
        const parsed = JSON.parse(jsonStr);

        // Validate the required fields
        if (typeof parsed.effectiveness !== 'number' ||
          typeof parsed.damage !== 'number' ||
          typeof parsed.feedback !== 'string' ||
          typeof parsed.success !== 'boolean') {
          throw new Error('Invalid response format - missing required fields');
        }

        return parsed;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Raw response:', trimmedResult);
        console.error('Extracted JSON string:', jsonStr);

        // Fallback if JSON parsing fails
        throw new Error('Invalid JSON response from AI');
      }
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
        model: 'omni-moderation-latest' // Use the latest available model
      });

      return response.results[0];
    } catch (error) {
      console.error('Content moderation error:', error);
      // Return safe default if moderation fails
      return { flagged: false, categories: {} };
    }
  }
}

module.exports = new OpenAIService();