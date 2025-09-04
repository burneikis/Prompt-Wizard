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

  async evaluateSpell(spell, creatureType, creatureWeakness, isBoss = false, bossPhase = null) {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Please check your API key.');
    }

    let prompt = `
    Creature: ${creatureType}
    Creature's Weakness: ${creatureWeakness}
    Student's Spell: "${spell}".
    `.trim();

    if (isBoss && bossPhase) {
      prompt += `\n\nThis is a BOSS BATTLE - Phase ${bossPhase}/3. Boss creatures require more sophisticated prompting techniques and higher effectiveness scores (7+) to deal significant damage.`;
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'system',
            content:
              `
            You are a helpful game master evaluating student prompts in an educational RPG about AI literacy. You are evaluating a magical spell cast by a student learning prompt engineering. 

            CREATURE WEAKNESS EVALUATION GUIDELINES:
            - "ice and water magic" = basic elemental spells
            - "logical reasoning and clever solutions" = step-by-step reasoning, problem-solving
            - "light magic and positive emotions" = hope, joy, healing spells
            - "erosion, plant magic, and weathering" = natural processes, time-based magic
            - "detailed thermal magic and precise temperature control" = scientific precision, exact temperatures
            - "structured, step-by-step reasoning and systematic approaches" = numbered steps, methodical thinking
            - "role-playing, creative narratives, and storytelling approaches" = story elements, character roleplay
            - "explicit constraints, context setting, and boundary definitions" = clear limitations, specific context
            - "chain-of-thought reasoning and explicit thinking processes" = showing work, thinking aloud
            - "meta-cognitive approaches and self-reflective reasoning" = thinking about thinking

            DAMAGE SCALING:
            - Effectiveness 1-3: 0-20 damage (poor targeting of weakness)
            - Effectiveness 4-6: 20-50 damage (partial targeting)
            - Effectiveness 7-8: 50-80 damage (good targeting)
            - Effectiveness 9-10: 80-100 damage (excellent targeting)

            For BOSS battles, be challenging but fair - effectiveness 5+ should deal reasonable damage (30+). Recognize partial attempts at the required technique.

            Respond with ONLY a valid JSON object (no additional text) containing:
            {
              "effectiveness": number (1-10) (overall effectiveness score),
              "damage": number (0-100) (the damage done to the creature),
              "feedback": "Brief explanation of why it worked/didn't work and what technique was used",
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