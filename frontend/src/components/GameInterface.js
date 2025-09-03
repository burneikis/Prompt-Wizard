import React, { useState } from 'react';
import { creatures } from '../data/creatures';
import SpellInput from './SpellInput';
import BattleResult from './BattleResult';

const GameInterface = () => {
  const [currentCreature, setCurrentCreature] = useState({
    ...creatures.fireDragon,
    currentHealth: creatures.fireDragon.maxHealth
  });
  const [battleResult, setBattleResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState('ready'); // ready, battle, victory, defeat

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
  };

  return (
    <div className="game-interface">
      <div className="simple-layout">
        {/* Health bar above dragon */}
        <div className="health-section">
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
        </div>

        {/* Main content row */}
        <div className="main-content">
          {/* Empty left space for balance */}
          <div className="left-spacer"></div>

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

          {/* Feedback on the right */}
          <div className="feedback-section">
            {battleResult && (
              <BattleResult 
                result={battleResult} 
                gameState={gameState}
              />
            )}
          </div>
        </div>

        {/* Spell input below dragon */}
        <div className="spell-section-bottom">
          <SpellInput 
            onSpellCast={handleSpellCast}
            isLoading={isLoading}
            disabled={gameState === 'victory'}
          />
        </div>

        {gameState === 'victory' && (
          <div className="victory-section">
            <h2>Victory!</h2>
            <p>You have defeated the Fire Dragon!</p>
            <button onClick={resetGame} className="reset-button">
              Face Another Dragon
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameInterface;