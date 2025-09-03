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

    // Check content moderation first
    const moderation = await openaiService.moderateContent(spell);
    if (moderation.flagged) {
      return res.status(400).json({
        error: 'Inappropriate content detected',
        flaggedCategories: moderation.categories
      });
    }

    // Evaluate the spell
    const evaluation = await openaiService.evaluateSpell(spell, creatureType, creatureWeakness);

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