import React, { useState } from 'react';
import { creatures } from '../data/creatures';
import SpellInput from './SpellInput';
import BattleResult from './BattleResult';
import VictoryModal from './VictoryModal';
import SpellTips from './SpellTips';
import ProgressTracker from './ProgressTracker';

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
  const [battleAnimation, setBattleAnimation] = useState('');
  const [spellEffect, setSpellEffect] = useState('');
  const [playerHealth, setPlayerHealth] = useState(100);
  const [maxPlayerHealth] = useState(100);
  const [playerTakingDamage, setPlayerTakingDamage] = useState(false);

  const selectCreature = (creatureId) => {
    const creature = creatures[creatureId];
    setCurrentCreature({
      ...creature,
      currentHealth: creature.maxHealth
    });
    setSelectedCreatureId(creatureId);
    setGameState('ready');
    setBattleResult(null);
    setBattleAnimation('creature-idle');
    setSpellEffect('');
    setPlayerHealth(maxPlayerHealth); // Reset player health when selecting creature
    setPlayerTakingDamage(false);
  };

  const handleSpellCast = async (spellText) => {
    setIsLoading(true);
    setBattleResult(null);
    setBattleAnimation('creature-casting');
    setSpellEffect('🔮');

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
        const errorData = await response.json();
        
        // Handle moderation failures specifically
        if (errorData.type === 'content_moderation') {
          setBattleResult({
            evaluation: {
              effectiveness: 0,
              damage: 0,
              feedback: errorData.message,
              success: false
            },
            moderated: true
          });
          setBattleAnimation('creature-idle');
          setIsLoading(false);
          return;
        }
        
        throw new Error(errorData.message || 'Failed to evaluate spell');
      }

      const result = await response.json();
      setBattleResult(result);

      // Add spell effect animation
      const effectiveness = result.evaluation.effectiveness;
      let effectEmoji = '✨';
      if (effectiveness >= 8) effectEmoji = '⚡';
      else if (effectiveness >= 6) effectEmoji = '🔥';
      else if (effectiveness >= 4) effectEmoji = '💫';
      else effectEmoji = '💨';
      
      setSpellEffect(effectEmoji);
      setTimeout(() => setSpellEffect(''), 1000);

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
      
      // Animate creature based on damage
      if (damage > 0) {
        if (effectiveness >= 8 || damage >= currentCreature.maxHealth * 0.3) {
          setBattleAnimation('creature-critical-hit');
        } else {
          setBattleAnimation('creature-hit');
        }
        setTimeout(() => {
          if (newHealth <= 0) {
            setBattleAnimation('creature-defeated');
          } else {
            setBattleAnimation('creature-idle');
          }
        }, 800);
      } else {
        setBattleAnimation('creature-idle');
      }
      
      setCurrentCreature(prev => ({
        ...prev,
        currentHealth: newHealth
      }));

      // Reduce player health after each spell (creature counter-attacks)
      const playerDamage = Math.floor(maxPlayerHealth / 3); // 1/3 of max health
      const newPlayerHealth = Math.max(0, playerHealth - playerDamage);
      
      // Animate creature attack and player taking damage
      setTimeout(() => {
        setBattleAnimation('creature-attack');
        setPlayerTakingDamage(true);
        // Update health after attack animation starts
        setTimeout(() => {
          setPlayerHealth(newPlayerHealth);
        }, 400); // Update health mid-attack
        setTimeout(() => {
          setBattleAnimation('creature-idle');
          setPlayerTakingDamage(false);
        }, 800);
      }, 1000);

      // Check win/lose conditions
      if (newPlayerHealth <= 1) {
        // Player is defeated
        setGameState('defeat');
      } else if (newHealth <= 0) {
        // Calculate score based on effectiveness and creature difficulty
        const baseScore = currentCreature.maxHealth;
        const effectivenessBonus = result.evaluation.effectiveness * 10;
        const earnedScore = baseScore + effectivenessBonus;
        
        setScore(prev => prev + earnedScore);
        setLastEarnedScore(earnedScore);
        setDefeatedCreatures(prev => [...prev, currentCreature.id]);
        setGameState('victory');
        setTimeout(() => setShowVictoryModal(true), 1200);
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
      setBattleAnimation('creature-idle');
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
    setPlayerHealth(maxPlayerHealth); // Reset player health
  };

  const backToSelection = () => {
    setCurrentCreature(null);
    setSelectedCreatureId(null);
    setBattleResult(null);
    setGameState('selection');
    setShowVictoryModal(false);
    setPlayerHealth(maxPlayerHealth); // Reset player health
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

          <ProgressTracker 
            score={score}
            defeatedCreatures={defeatedCreatures}
            spellHistory={spellHistory}
            totalCreatures={Object.keys(creatures).length}
          />

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
            <div className={`creature-emoji ${battleAnimation}`}>
              {currentCreature.image}
            </div>
            {isLoading && battleAnimation === 'creature-casting' && (
              <div className="casting-particles">
                <div className="particle" style={{ left: '20%', animationDelay: '0s' }}></div>
                <div className="particle" style={{ left: '40%', animationDelay: '0.3s' }}></div>
                <div className="particle" style={{ left: '60%', animationDelay: '0.6s' }}></div>
                <div className="particle" style={{ left: '80%', animationDelay: '0.9s' }}></div>
                <div className="particle" style={{ left: '30%', animationDelay: '1.2s' }}></div>
                <div className="particle" style={{ left: '70%', animationDelay: '1.5s' }}></div>
              </div>
            )}
            {spellEffect && (
              <div className="spell-cast-effect">
                {spellEffect}
              </div>
            )}
            {gameState === 'victory' && (
              <div className="victory-overlay">
                💀
              </div>
            )}
            {gameState === 'defeat' && (
              <div className="defeat-overlay">
                ⚰️
              </div>
            )}
          </div>
        </div>

        {/* Player health bar */}
        <div className="player-health-section">
          <div className="player-health-label">Your Health</div>
          <div className={`player-health-bar ${playerTakingDamage ? 'taking-damage' : ''}`}>
            <div 
              className="player-health-fill"
              style={{
                width: `${(playerHealth / maxPlayerHealth) * 100}%`,
                backgroundColor: playerHealth > maxPlayerHealth * 0.5 ? '#22c55e' : 
                                playerHealth > maxPlayerHealth * 0.2 ? '#fbbf24' : '#ef4444'
              }}
            ></div>
          </div>
        </div>

        {/* Spell input and tips/feedback section */}
        <div className="spell-section-bottom">
          <div className="spell-input-container">
            <SpellInput 
              onSpellCast={handleSpellCast}
              isLoading={isLoading}
              disabled={gameState === 'victory' || gameState === 'defeat'}
            />
          </div>
          <div className="spell-tips-container">
            {gameState === 'defeat' ? (
              <div className="defeat-message">
                <h3>Encounter Failed!</h3>
                <p>Your magical energy has been depleted. The {currentCreature.name} has overwhelmed you!</p>
                <div className="defeat-buttons">
                  <button className="retry-button" onClick={resetGame}>
                    Retry Fight
                  </button>
                  <button className="choose-different-button" onClick={backToSelection}>
                    Choose Different Creature
                  </button>
                </div>
              </div>
            ) : battleResult ? (
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