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
  },
  riddleSphinx: {
    id: 'riddleSphinx',
    name: 'Riddle Sphinx',
    description: 'An ancient sphinx that guards secrets, vulnerable to logical reasoning and clever wordplay',
    maxHealth: 120,
    weakness: 'logical reasoning and clever solutions',
    image: '🦁',
    flavorText: 'This enigmatic creature speaks in riddles and values wit above brute force. It respects those who can think clearly and present logical arguments.',
    hints: [
      'Use logical reasoning in your spells',
      'Try clever wordplay or riddles',
      'Think step-by-step and explain your reasoning'
    ]
  },
  shadowWraith: {
    id: 'shadowWraith',
    name: 'Shadow Wraith',
    description: 'A creature of darkness and fear, vulnerable to light magic and positive emotions',
    maxHealth: 80,
    weakness: 'light magic and positive emotions',
    image: '👻',
    flavorText: 'Born from nightmares and despair, this wraith feeds on fear. But it cannot withstand the power of hope, joy, and brilliant light.',
    hints: [
      'Use light-based spells or healing magic',
      'Try spells that invoke positive emotions',
      'Focus on hope, courage, or happiness'
    ]
  },
  earthGolem: {
    id: 'earthGolem',
    name: 'Earth Golem',
    description: 'A massive creature of stone and earth, vulnerable to erosion and plant magic',
    maxHealth: 150,
    weakness: 'erosion, plant magic, and weathering',
    image: '⛰️',
    flavorText: 'Ancient and sturdy, this golem is nearly indestructible. However, like all earthen things, it can be worn down by water, wind, and the persistent growth of nature.',
    hints: [
      'Try spells involving water erosion or weathering',
      'Use plant magic to crack through stone',
      'Think about how nature breaks down rock over time'
    ]
  }
};

export const getCreatureById = (id) => creatures[id];