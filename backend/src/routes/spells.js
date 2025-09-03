const express = require('express');
const router = express.Router();
const openaiService = require('../services/openaiService');

// POST /api/spells/evaluate
router.post('/evaluate', async (req, res) => {
  try {
    const { spell, creatureType = 'Fire Dragon', creatureWeakness = 'ice and water magic' } = req.body;

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
        return res.status(400).json({
          error: 'Inappropriate content detected',
          flaggedCategories: moderation.categories
        });
      };
    }
    console.log("Spell passed moderation");

    // Evaluate the spell
    console.log("Evaluating spell:", spell);
    const evaluation = await openaiService.evaluateSpell(spell, creatureType, creatureWeakness);
    console.log("Evaluation result:", evaluation);

    res.json({
      spell,
      creatureType,
      evaluation
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