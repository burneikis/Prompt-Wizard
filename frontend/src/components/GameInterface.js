import React, { useState } from 'react';
import { creatures } from '../data/creatures';
import SpellInput from './SpellInput';
import BattleResult from './BattleResult';
import VictoryModal from './VictoryModal';
import SpellTips from './SpellTips';

const GameInterface = () => {
  const [currentCreature, setCurrentCreature] = useState(null);
  const [selectedCreatureId, setSelectedCreatureId] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState('selection'); // selection, ready, battle, victory, defeat
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [defeatedCreatures, setDefeatedCreatures] = useState([]);
  const [score, setScore] = useState(0);
  const [spellHistory, setSpellHistory] = useState([]);
  const [lastEarnedScore, setLastEarnedScore] = useState(0);

  const selectCreature = (creatureId) => {
    const creature = creatures[creatureId];
    setCurrentCreature({
      ...creature,
      currentHealth: creature.maxHealth
    });
    setSelectedCreatureId(creatureId);
    setGameState('ready');
    setBattleResult(null);
  };

  const handleSpellCast = async (spellText) => {
    setIsLoading(true);
    setBattleResult(null);

    try {
      const response = await fetch('http://localhost:3001/api/spells/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spell: spellText,
          creatureType: currentCreature.name,
          creatureWeakness: currentCreature.weakness
        })
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate spell');
      }

      const result = await response.json();
      setBattleResult(result);

      // Add to spell history
      const spellRecord = {
        spell: spellText,
        creature: currentCreature.name,
        damage: result.evaluation.damage,
        effectiveness: result.evaluation.effectiveness,
        timestamp: new Date().toLocaleTimeString()
      };
      setSpellHistory(prev => [spellRecord, ...prev].slice(0, 10)); // Keep last 10 spells

      // Calculate new creature health
      const damage = result.evaluation.damage;
      const newHealth = Math.max(0, currentCreature.currentHealth - damage);
      
      setCurrentCreature(prev => ({
        ...prev,
        currentHealth: newHealth
      }));

      // Check win/lose conditions
      if (newHealth <= 0) {
        // Calculate score based on effectiveness and creature difficulty
        const baseScore = currentCreature.maxHealth;
        const effectivenessBonus = result.evaluation.effectiveness * 10;
        const earnedScore = baseScore + effectivenessBonus;
        
        setScore(prev => prev + earnedScore);
        setLastEarnedScore(earnedScore);
        setDefeatedCreatures(prev => [...prev, currentCreature.id]);
        setGameState('victory');
        setShowVictoryModal(true);
      } else if (damage === 0 && result.evaluation.effectiveness <= 3) {
        // If spell was very ineffective, creature might counter-attack
        setGameState('ready');
      }

    } catch (error) {
      console.error('Error evaluating spell:', error);
      setBattleResult({
        evaluation: {
          effectiveness: 1,
          damage: 0,
          feedback: 'Failed to connect to the magical evaluation system. Try again!',
          success: false
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    if (selectedCreatureId) {
      const creature = creatures[selectedCreatureId];
      setCurrentCreature({
        ...creature,
        currentHealth: creature.maxHealth
      });
    }
    setBattleResult(null);
    setGameState('ready');
    setShowVictoryModal(false);
  };

  const backToSelection = () => {
    setCurrentCreature(null);
    setSelectedCreatureId(null);
    setBattleResult(null);
    setGameState('selection');
    setShowVictoryModal(false);
  };

  const closeVictoryModal = () => {
    setShowVictoryModal(false);
  };

  if (gameState === 'selection') {
    return (
      <div className="game-interface">
        <div className="creature-selection">
          <div className="header-section">
            <h1>Prompt Wizard</h1>
            <div className="game-stats">
              <div className="score">Score: {score}</div>
              <div className="defeated">Defeated: {defeatedCreatures.length}/4</div>
            </div>
          </div>
          
          <h2>Choose Your Opponent</h2>
          
          <div className="creatures-grid">
            {Object.values(creatures).map((creature) => (
              <div 
                key={creature.id}
                className={`creature-card ${defeatedCreatures.includes(creature.id) ? 'defeated' : ''}`}
                onClick={() => selectCreature(creature.id)}
              >
                <div className="creature-image">{creature.image}</div>
                <h3>{creature.name}</h3>
                <p>{creature.description}</p>
                <div className="creature-stats">
                  <div>Health: {creature.maxHealth}</div>
                  <div>Weakness: {creature.weakness}</div>
                </div>
                {defeatedCreatures.includes(creature.id) && (
                  <div className="defeated-overlay">✅ DEFEATED</div>
                )}
              </div>
            ))}
          </div>

          {spellHistory.length > 0 && (
            <div className="spell-history-section">
              <h3>Recent Spell History</h3>
              <div className="spell-history">
                {spellHistory.slice(0, 5).map((spell, index) => (
                  <div key={index} className="spell-record">
                    <div className="spell-text">"{spell.spell}"</div>
                    <div className="spell-details">
                      vs {spell.creature} | Damage: {spell.damage} | Effectiveness: {spell.effectiveness}/10 | {spell.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="game-interface">
      <div className="simple-layout">
        {/* Header with back button and score */}
        <div className="game-header">
          <button className="back-button" onClick={backToSelection}>
            ← Back to Selection
          </button>
          <div className="game-stats">
            <div className="score">Score: {score}</div>
            <div className="defeated">Defeated: {defeatedCreatures.length}/4</div>
          </div>
        </div>

        {/* Creature info and health bar */}
        <div className="health-section">
          <div className="creature-name">
            <h2>{currentCreature.name}</h2>
          </div>
          <div className="health-bar">
            <div 
              className="health-fill"
              style={{
                width: `${(currentCreature.currentHealth / currentCreature.maxHealth) * 100}%`,
                backgroundColor: currentCreature.currentHealth > currentCreature.maxHealth * 0.5 ? '#22c55e' : 
                                currentCreature.currentHealth > currentCreature.maxHealth * 0.2 ? '#fbbf24' : '#ef4444'
              }}
            ></div>
          </div>
          <div className="health-text">
            {currentCreature.currentHealth}/{currentCreature.maxHealth} HP
          </div>
          <div className="weakness-info">
            <strong>Known Weakness:</strong> {currentCreature.weakness}
          </div>
        </div>

        {/* Main content row */}
        <div className="main-content">
          {/* Creature in center */}
          <div className="creature-center">
            <div className="creature-emoji">
              {currentCreature.image}
            </div>
            {gameState === 'victory' && (
              <div className="victory-overlay">
                💀
              </div>
            )}
          </div>
        </div>

        {/* Spell input and tips/feedback section */}
        <div className="spell-section-bottom">
          <div className="spell-input-container">
            <SpellInput 
              onSpellCast={handleSpellCast}
              isLoading={isLoading}
              disabled={gameState === 'victory'}
            />
          </div>
          <div className="spell-tips-container">
            {battleResult ? (
              <BattleResult 
                result={battleResult} 
                gameState={gameState}
              />
            ) : (
              <SpellTips />
            )}
          </div>
        </div>

        <VictoryModal 
          isOpen={showVictoryModal}
          onClose={closeVictoryModal}
          onReset={resetGame}
          creatureName={currentCreature?.name}
          onBackToSelection={backToSelection}
          earnedScore={lastEarnedScore}
        />
      </div>
    </div>
  );
};

export default GameInterface;