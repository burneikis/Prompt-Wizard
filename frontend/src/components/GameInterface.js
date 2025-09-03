import React, { useState } from 'react';
import { creatures } from '../data/creatures';
import SpellInput from './SpellInput';
import BattleResult from './BattleResult';
import VictoryModal from './VictoryModal';
import SpellTips from './SpellTips';

const GameInterface = () => {
  const [currentCreature, setCurrentCreature] = useState({
    ...creatures.fireDragon,
    currentHealth: creatures.fireDragon.maxHealth
  });
  const [battleResult, setBattleResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState('ready'); // ready, battle, victory, defeat
  const [showVictoryModal, setShowVictoryModal] = useState(false);

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

      // Calculate new creature health
      const damage = result.evaluation.damage;
      const newHealth = Math.max(0, currentCreature.currentHealth - damage);
      
      setCurrentCreature(prev => ({
        ...prev,
        currentHealth: newHealth
      }));

      // Check win/lose conditions
      if (newHealth <= 0) {
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
    setCurrentCreature({
      ...creatures.fireDragon,
      currentHealth: creatures.fireDragon.maxHealth
    });
    setBattleResult(null);
    setGameState('ready');
    setShowVictoryModal(false);
  };

  const closeVictoryModal = () => {
    setShowVictoryModal(false);
  };

  return (
    <div className="game-interface">
      <div className="simple-layout">
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
          {/* Dragon in center */}
          <div className="dragon-center">
            <div className="dragon-emoji">
              🐉
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
        />
      </div>
    </div>
  );
};

export default GameInterface;