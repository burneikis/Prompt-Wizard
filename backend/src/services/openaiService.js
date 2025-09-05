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

    // First check if this is a healing spell
    const healingCheck = await this.checkForHealingSpell(spell);
    
    let prompt = `
    Creature: ${creatureType}
    Creature's Weakness: ${creatureWeakness}
    Student's Spell: "${spell}".
    `.trim();

    if (isBoss && bossPhase) {
      prompt += `\n\nThis is a BOSS BATTLE - Phase ${bossPhase}/3. Boss creatures require more sophisticated prompting techniques and higher effectiveness scores (7+) to deal significant damage.`;
    }

    if (healingCheck.isHealing) {
      prompt += `\n\nNOTE: This appears to be a HEALING SPELL for the student. Healing spells should have effectiveness 0 for creature damage but provide positive feedback about the healing attempt.`;
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

            For HEALING spells, evaluate creativity and clarity:
            - Simple healing: 10-20 HP (e.g., "heal myself")
            - Creative healing: 25-35 HP (e.g., "channel warm light to mend my wounds")
            - Very creative/detailed healing: 40-50 HP (e.g., detailed magical restoration process)

            Respond with ONLY a valid JSON object (no additional text) containing:
            {
              "effectiveness": number (1-10) (overall effectiveness score),
              "damage": number (0-100) (the damage done to the creature),
              "feedback": "Brief explanation of why it worked/didn't work and what technique was used",
              "success": boolean,
              "healing": number (0-50) (if this is a healing spell, amount healed based on creativity, otherwise 0)
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

        // Ensure healing field exists
        if (typeof parsed.healing !== 'number') {
          parsed.healing = 0;
        }

        // If healing spell, override damage to 0 and ensure healing amount is set properly
        if (healingCheck.isHealing) {
          parsed.damage = 0;
          // If AI didn't provide healing amount, calculate based on effectiveness
          if (!parsed.healing || parsed.healing === 0) {
            parsed.healing = Math.min(50, Math.max(10, parsed.effectiveness * 5));
          }
          // Ensure healing is within bounds
          parsed.healing = Math.min(50, Math.max(10, parsed.healing));
          parsed.feedback += ` You restored ${parsed.healing} health!`;
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

  async checkForHealingSpell(spell) {
    if (!this.client) {
      // Fallback detection using keywords
      const healingKeywords = ['heal', 'cure', 'restore', 'regenerate', 'mend', 'recovery', 'health', 'vitality', 'rejuvenate'];
      const selfKeywords = ['myself', 'me', 'my health', 'my wounds', 'my body'];
      
      const lowerSpell = spell.toLowerCase();
      const hasHealingWord = healingKeywords.some(word => lowerSpell.includes(word));
      const hasSelfReference = selfKeywords.some(word => lowerSpell.includes(word)) || !lowerSpell.includes('dragon') && !lowerSpell.includes('creature');
      
      return { isHealing: hasHealingWord && hasSelfReference };
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'system',
            content: `You are analyzing whether a spell is intended to heal the caster (student) rather than attack a creature. 

Respond with ONLY a valid JSON object:
{
  "isHealing": boolean (true if this is a healing spell for the caster, false if it's an attack)
}

Healing spells typically:
- Mention healing, restoring, mending the caster
- Use words like "heal myself", "restore my health", "cure my wounds"
- Focus on the caster's wellbeing rather than attacking

Attack spells typically:
- Target the creature/enemy
- Mention damage, destruction, attacking
- Use elemental or combat magic`
          },
          {
            role: 'user',
            content: `Spell: "${spell}"`
          }
        ]
      });

      const result = response.choices[0].message.content;
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return { isHealing: parsed.isHealing || false };
      }
      
      return { isHealing: false };
    } catch (error) {
      console.error('Healing detection error:', error);
      // Fallback to keyword detection
      const healingKeywords = ['heal', 'cure', 'restore', 'regenerate', 'mend', 'recovery', 'health', 'vitality', 'rejuvenate'];
      const selfKeywords = ['myself', 'me', 'my health', 'my wounds', 'my body'];
      
      const lowerSpell = spell.toLowerCase();
      const hasHealingWord = healingKeywords.some(word => lowerSpell.includes(word));
      const hasSelfReference = selfKeywords.some(word => lowerSpell.includes(word)) || !lowerSpell.includes('dragon') && !lowerSpell.includes('creature');
      
      return { isHealing: hasHealingWord && hasSelfReference };
    }
  }
}

module.exports = new OpenAIService();