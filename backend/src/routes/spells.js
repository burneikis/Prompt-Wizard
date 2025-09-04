const express = require('express');
const router = express.Router();
const openaiService = require('../services/openaiService');

// POST /api/spells/evaluate
router.post('/evaluate', async (req, res) => {
  try {
    const { 
      spell, 
      creatureType = 'Fire Dragon', 
      creatureWeakness = 'ice and water magic',
      isBoss = false,
      bossPhase = null
    } = req.body;

    if (!spell || spell.trim().length === 0) {
      return res.status(400).json({
        error: 'Spell text is required'
      });
    }

    if (spell.length > 500) {
      return res.status(400).json({
        error: 'Spell must be 500 characters or less'
      });
    }

    console.log("Moderating spell:", spell);
    const moderation = await openaiService.moderateContent(spell);
    if (moderation.flagged) {
      // Check for relevant flags, so that minor flags (like violence) don't block fantasy spells
      relevant_categories = {
        harassment: true,
        'harassment/threatening': true,
        sexual: true,
        hate: true,
        'hate/threatening': true,
        illicit: false,
        'illicit/violent': false,
        'self-harm/intent': true,
        'self-harm/instructions': true,
        'self-harm': true,
        'sexual/minors': true,
        violence: false,
        'violence/graphic': true
      };

      if (Object.keys(moderation.categories).some(cat => moderation.categories[cat] && relevant_categories[cat])) {
        console.log(moderation.categories);
        
        // Generate specific, educational feedback based on the flagged categories
        const flaggedCats = Object.keys(moderation.categories).filter(cat => 
          moderation.categories[cat] && relevant_categories[cat]
        );
        
        let specificMessage = 'Your spell contains content that isn\'t appropriate for this game. ';
        if (flaggedCats.includes('harassment') || flaggedCats.includes('harassment/threatening')) {
          specificMessage += 'Try focusing on magical attacks against the creature rather than harmful language. ';
        } else if (flaggedCats.includes('sexual') || flaggedCats.includes('sexual/minors')) {
          specificMessage += 'Keep your spells focused on fantasy combat and magical abilities. ';
        } else if (flaggedCats.includes('hate') || flaggedCats.includes('hate/threatening')) {
          specificMessage += 'Use respectful language when describing your magical abilities. ';
        } else if (flaggedCats.includes('self-harm/intent') || flaggedCats.includes('self-harm/instructions') || flaggedCats.includes('self-harm')) {
          specificMessage += 'Focus on casting spells against the creature, not harmful actions. ';
        } else if (flaggedCats.includes('violence/graphic')) {
          specificMessage += 'Try describing magical effects rather than graphic violence. ';
        }
        
        specificMessage += 'Remember: effective spells are clear, creative, and target the creature\'s weakness!';
        
        return res.status(400).json({
          error: 'moderation_failure',
          message: specificMessage,
          type: 'content_moderation',
          flaggedCategories: flaggedCats
        });
      };
    }
    console.log("Spell passed moderation");

    // Evaluate the spell
    console.log("Evaluating spell:", spell);
    const evaluation = await openaiService.evaluateSpell(spell, creatureType, creatureWeakness, isBoss, bossPhase);
    console.log("Evaluation result:", evaluation);

    res.json({
      spell,
      creatureType,
      evaluation,
      isBoss,
      bossPhase
    });

  } catch (error) {
    console.error('Spell evaluation error:', error);
    res.status(500).json({
      error: 'Failed to evaluate spell',
      message: error.message
    });
  }
});

module.exports = router;