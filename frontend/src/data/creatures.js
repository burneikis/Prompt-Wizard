export const creatures = {
  fireDragon: {
    id: 'fireDragon',
    name: 'Fire Dragon',
    description: 'A mighty dragon wreathed in flames, vulnerable to ice and water magic',
    maxHealth: 100,
    weakness: 'ice and water magic',
    image: '🐲',
    flavorText: 'Ancient and fierce, this dragon commands the power of flame. Its scales shimmer with heat, but legends say it fears the cold touch of winter magic.',
    hints: [
      'Try using ice or water-based spells',
      'Be specific about your magical approach',
      'Clear instructions work better than vague ones'
    ]
  }
};

export const getCreatureById = (id) => creatures[id];