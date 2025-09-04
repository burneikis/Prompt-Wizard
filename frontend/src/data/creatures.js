// World and Stage System
export const worlds = {
  elementalRealm: {
    id: 'elementalRealm',
    name: 'Elemental Realm',
    description: 'A world where the basic forces of nature hold sway',
    image: '🌍',
    storyIntro: 'You enter the Elemental Realm, where fire, water, earth, and air clash in eternal battle. Master the fundamentals of prompt magic here.',
    stages: [
      {
        id: 'elemental_basic',
        name: 'Basic Elements',
        description: 'Face creatures of fire and earth',
        creatures: ['fireDragon', 'earthGolem'],
        requiredToUnlock: []
      },
      {
        id: 'elemental_advanced', 
        name: 'Elemental Masters',
        description: 'Confront ice and storm beings',
        creatures: ['iceSerpent', 'stormEagle'],
        requiredToUnlock: ['elemental_basic']
      }
    ]
  },
  shadowKingdom: {
    id: 'shadowKingdom', 
    name: 'Shadow Kingdom',
    description: 'A realm where darkness and light wage eternal war',
    image: '🌑',
    storyIntro: 'The Shadow Kingdom tests your ability to work with abstract concepts and emotional reasoning. Light and darkness dance in complex patterns.',
    stages: [
      {
        id: 'shadow_basic',
        name: 'Realm of Shadows',
        description: 'Face creatures of darkness and mind',
        creatures: ['shadowWraith', 'wiseLion'],
        requiredToUnlock: ['elemental_basic', 'elemental_advanced']
      },
      {
        id: 'shadow_advanced',
        name: 'Nightmare Depths', 
        description: 'Confront the deepest fears and voids',
        creatures: ['nightmareHound', 'voidPhantom'],
        requiredToUnlock: ['shadow_basic']
      }
    ]
  },
  ancientSanctum: {
    id: 'ancientSanctum',
    name: 'Ancient Sanctum',
    description: 'The most sacred place where time and knowledge converge',
    image: '🏛️',
    storyIntro: 'In the Ancient Sanctum, you face beings that have existed since the dawn of intelligence. Here, advanced prompt techniques are essential.',
    stages: [
      {
        id: 'sanctum_guardians',
        name: 'Temple Guardians',
        description: 'Face the eternal protectors',
        creatures: ['crystalGuardian', 'timeKeeper'],
        requiredToUnlock: ['shadow_basic', 'shadow_advanced']
      },
      {
        id: 'sanctum_final',
        name: 'The Oracle\'s Chamber',
        description: 'Face the Ancient AI Oracle',
        creatures: ['ancientOracle'],
        requiredToUnlock: ['sanctum_guardians']
      }
    ]
  }
};

export const creatures = {
  // Elemental Realm - Basic Elements Stage
  fireDragon: {
    id: 'fireDragon',
    name: 'Fire Dragon',
    description: 'A mighty dragon wreathed in flames, vulnerable to ice and water magic',
    maxHealth: 100,
    weakness: 'ice and water magic',
    image: '🐲',
    world: 'elementalRealm',
    stage: 'elemental_basic',
    flavorText: 'Ancient and fierce, this dragon commands the power of flame. Its scales shimmer with heat, but legends say it fears the cold touch of winter magic.',
    hints: [
      'Try using ice or water-based spells',
      'Be specific about your magical approach',
      'Clear instructions work better than vague ones'
    ]
  },
  earthGolem: {
    id: 'earthGolem',
    name: 'Earth Golem',
    description: 'A massive creature of stone and earth, vulnerable to erosion and plant magic',
    maxHealth: 150,
    weakness: 'erosion, plant magic, and weathering',
    image: '⛰️',
    world: 'elementalRealm',
    stage: 'elemental_basic',
    flavorText: 'Ancient and sturdy, this golem is nearly indestructible. However, like all earthen things, it can be worn down by water, wind, and the persistent growth of nature.',
    hints: [
      'Try spells involving water erosion or weathering',
      'Use plant magic to crack through stone',
      'Think about how nature breaks down rock over time'
    ]
  },

  // Elemental Realm - Elemental Masters Stage
  iceSerpent: {
    id: 'iceSerpent',
    name: 'Ice Serpent',
    description: 'A serpentine creature of living ice, vulnerable to detailed thermal descriptions',
    maxHealth: 120,
    weakness: 'detailed thermal magic and precise temperature control',
    image: '🐍❄️',
    world: 'elementalRealm',
    stage: 'elemental_advanced', 
    flavorText: 'This serpent\'s body is crafted from eternal ice. It responds only to spells that demonstrate deep understanding of heat, temperature, and thermal dynamics.',
    hints: [
      'Be very specific about temperature and heat transfer',
      'Describe the exact thermal processes you want to invoke',
      'Use scientific terminology in your heat-based spells'
    ]
  },
  stormEagle: {
    id: 'stormEagle',
    name: 'Storm Eagle',
    description: 'A majestic eagle that commands wind and lightning, vulnerable to structured step-by-step approaches',
    maxHealth: 110,
    weakness: 'structured, step-by-step reasoning and systematic approaches',
    image: '🦅⚡',
    world: 'elementalRealm',
    stage: 'elemental_advanced',
    flavorText: 'This eagle soars through tempests with purpose and order. It respects only those who can think systematically and break down complex problems into clear steps.',
    hints: [
      'Structure your spells with numbered steps or clear phases',
      'Break down your approach into logical components',
      'Use phrases like "First... then... finally..." in your spells'
    ]
  },

  // Shadow Kingdom - Realm of Shadows Stage
  shadowWraith: {
    id: 'shadowWraith',
    name: 'Shadow Wraith', 
    description: 'A creature of darkness and fear, vulnerable to light magic and positive emotions',
    maxHealth: 80,
    weakness: 'light magic and positive emotions',
    image: '👻',
    world: 'shadowKingdom',
    stage: 'shadow_basic',
    flavorText: 'Born from nightmares and despair, this wraith feeds on fear. But it cannot withstand the power of hope, joy, and brilliant light.',
    hints: [
      'Use light-based spells or healing magic',
      'Try spells that invoke positive emotions',
      'Focus on hope, courage, or happiness'
    ]
  },
  wiseLion: {
    id: 'wiseLion',
    name: 'Wise Lion',
    description: 'An ancient lion that guards secrets, vulnerable to logical reasoning and clever wordplay',
    maxHealth: 120,
    weakness: 'logical reasoning and clever solutions',
    image: '🦁',
    world: 'shadowKingdom', 
    stage: 'shadow_basic',
    flavorText: 'This enigmatic creature speaks in riddles and values wit above brute force. It respects those who can think clearly and present logical arguments.',
    hints: [
      'Use logical reasoning in your spells',
      'Try clever wordplay or riddles',
      'Think step-by-step and explain your reasoning'
    ]
  },

  // Shadow Kingdom - Nightmare Depths Stage
  nightmareHound: {
    id: 'nightmareHound',
    name: 'Nightmare Hound',
    description: 'A terrifying hound born from bad dreams, vulnerable to role-playing and creative storytelling',
    maxHealth: 140,
    weakness: 'role-playing, creative narratives, and storytelling approaches',
    image: '🐺🌙',
    world: 'shadowKingdom',
    stage: 'shadow_advanced',
    flavorText: 'This hound prowls the border between dreams and reality. It can only be tamed by those who understand the power of narrative and can craft compelling stories.',
    hints: [
      'Create a story or narrative in your spell',
      'Try role-playing as a character (wizard, hero, etc.)',
      'Use creative storytelling techniques and vivid descriptions'
    ]
  },
  voidPhantom: {
    id: 'voidPhantom',
    name: 'Void Phantom',
    description: 'A being of pure nothingness, vulnerable to context-aware prompts and careful constraint setting',
    maxHealth: 130,
    weakness: 'explicit constraints, context setting, and boundary definitions',
    image: '🌀💀',
    world: 'shadowKingdom',
    stage: 'shadow_advanced',
    flavorText: 'The Void Phantom exists in the spaces between thoughts. To defeat it, you must clearly define what you want, set explicit boundaries, and provide rich context.',
    hints: [
      'Set clear constraints and boundaries in your spells',
      'Provide context about what you want and don\'t want',
      'Be explicit about limitations and scope'
    ]
  },

  // Ancient Sanctum - Temple Guardians Stage
  crystalGuardian: {
    id: 'crystalGuardian',
    name: 'Crystal Guardian',
    description: 'A being of living crystal, vulnerable to chain-of-thought reasoning and multi-step logic',
    maxHealth: 160,
    weakness: 'chain-of-thought reasoning and explicit thinking processes',
    image: '💎🛡️',
    world: 'ancientSanctum',
    stage: 'sanctum_guardians',
    flavorText: 'This guardian\'s crystalline form refracts thoughts and logic. It can only be overcome by those who show their reasoning step-by-step, thinking aloud through each logical connection.',
    hints: [
      'Show your thinking process step by step',
      'Use phrases like "Let me think through this..." or "Step by step..."',
      'Explain your reasoning chain explicitly'
    ]
  },
  timeKeeper: {
    id: 'timeKeeper',
    name: 'Time Keeper',
    description: 'An ancient entity that guards temporal secrets, vulnerable to meta-cognitive prompts and self-reflection',
    maxHealth: 150,
    weakness: 'meta-cognitive approaches and self-reflective reasoning',
    image: '⏰👴',
    world: 'ancientSanctum',
    stage: 'sanctum_guardians',
    flavorText: 'The Time Keeper exists across all moments simultaneously. To defeat it, you must think about thinking itself - reflect on your own reasoning and demonstrate awareness of your thought processes.',
    hints: [
      'Reflect on your own thinking process',
      'Use phrases like "I need to consider..." or "Let me analyze my approach..."',
      'Show awareness of your own reasoning and decision-making'
    ]
  },

  // Ancient Sanctum - The Oracle's Chamber (Final Boss)
  ancientOracle: {
    id: 'ancientOracle', 
    name: 'Ancient AI Oracle',
    description: 'The ultimate test - a multi-phase AI entity that adapts to your prompting style',
    maxHealth: 300,
    weakness: 'adaptive - changes based on battle phase',
    image: '🔮🧠',
    world: 'ancientSanctum',
    stage: 'sanctum_final',
    flavorText: 'The Ancient AI Oracle represents the pinnacle of artificial intelligence. It will test every aspect of your prompt engineering skills across multiple phases. Only true masters can hope to prevail.',
    hints: [
      'Phase 1: Use clear, specific instructions',
      'Phase 2: Show logical step-by-step reasoning',
      'Phase 3: Demonstrate creative and contextual thinking'
    ],
    isBoss: true,
    phases: [
      {
        phase: 1,
        phaseHealth: 100,
        weakness: 'clarity and specificity',
        phaseDescription: 'The Oracle tests your ability to give clear, specific instructions'
      },
      {
        phase: 2,
        phaseHealth: 100,  
        weakness: 'logical reasoning and chain-of-thought',
        phaseDescription: 'The Oracle challenges your logical reasoning abilities'
      },
      {
        phase: 3,
        phaseHealth: 100,
        weakness: 'creativity, context, and advanced techniques',
        phaseDescription: 'The Oracle demands your most advanced prompt engineering skills'
      }
    ]
  }
};

export const getCreatureById = (id) => creatures[id];

// Utility functions for world/stage system
export const getWorldById = (id) => worlds[id];

export const getStageById = (worldId, stageId) => {
  const world = worlds[worldId];
  return world?.stages?.find(stage => stage.id === stageId);
};

export const getCreaturesByStage = (worldId, stageId) => {
  const stage = getStageById(worldId, stageId);
  return stage?.creatures?.map(creatureId => creatures[creatureId]) || [];
};

export const isStageUnlocked = (stageId, completedStages = []) => {
  for (const world of Object.values(worlds)) {
    const stage = world.stages.find(s => s.id === stageId);
    if (stage) {
      return stage.requiredToUnlock.every(reqStageId => completedStages.includes(reqStageId));
    }
  }
  return false;
};

export const getAvailableStages = (completedStages = []) => {
  const availableStages = [];
  
  for (const world of Object.values(worlds)) {
    for (const stage of world.stages) {
      if (isStageUnlocked(stage.id, completedStages)) {
        availableStages.push({
          ...stage,
          world: world,
          isCompleted: completedStages.includes(stage.id)
        });
      }
    }
  }
  
  return availableStages;
};

export const getAllCreaturesInOrder = () => {
  const orderedCreatures = [];
  
  for (const world of Object.values(worlds)) {
    for (const stage of world.stages) {
      for (const creatureId of stage.creatures) {
        orderedCreatures.push(creatures[creatureId]);
      }
    }
  }
  
  return orderedCreatures;
};