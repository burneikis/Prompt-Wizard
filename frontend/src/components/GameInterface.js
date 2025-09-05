import React, { useState, useEffect } from 'react';
import { creatures, worlds, getAvailableStages, getAllCreaturesInOrder } from '../data/creatures';
import SpellInput from './SpellInput';
import BattleResult from './BattleResult';
import VictoryModal from './VictoryModal';
import SpellTips from './SpellTips';
import WorldMap from './WorldMap';
import StoryModal from './StoryModal';
import SpellHistory from './SpellHistory';

const API_URL = process.env.REACT_APP_API_URL 
  ? `https://${process.env.REACT_APP_API_URL}`
  : 'http://localhost:3001';

const GameInterface = () => {
  const [currentCreature, setCurrentCreature] = useState(null);
  const [selectedCreatureId, setSelectedCreatureId] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState('worldMap'); // worldMap, ready, battle, victory, defeat
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [defeatedCreatures, setDefeatedCreatures] = useState([]);
  const [completedStages, setCompletedStages] = useState([]);
  const [score, setScore] = useState(0);
  const [spellHistory, setSpellHistory] = useState([]);
  const [lastEarnedScore, setLastEarnedScore] = useState(0);
  const [battleAnimation, setBattleAnimation] = useState('');
  const [spellEffect, setSpellEffect] = useState('');
  const [playerHealth, setPlayerHealth] = useState(100);
  const [maxPlayerHealth] = useState(100);
  const [playerTakingDamage, setPlayerTakingDamage] = useState(false);
  const [showDefeatModal, setShowDefeatModal] = useState(false);
  
  // New story and progression state
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [storyData, setStoryData] = useState({ world: null, stage: null, storyType: 'world' });
  const [currentBossPhase, setCurrentBossPhase] = useState(1);
  const [bossPhaseHealth, setBossPhaseHealth] = useState(100);
  const [isReplaying, setIsReplaying] = useState(false);

  // Load game progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('promptWizardProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setDefeatedCreatures(progress.defeatedCreatures || []);
        setCompletedStages(progress.completedStages || []);
        setScore(progress.score || 0);
        setSpellHistory(progress.spellHistory || []);
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever key state changes
  useEffect(() => {
    const progress = {
      defeatedCreatures,
      completedStages,
      score,
      spellHistory
    };
    localStorage.setItem('promptWizardProgress', JSON.stringify(progress));
  }, [defeatedCreatures, completedStages, score, spellHistory]);

  // Check for stage completion whenever creatures are defeated
  useEffect(() => {
    checkStageCompletion();
  }, [defeatedCreatures]);

  // Console command for development - skip to final boss
  useEffect(() => {
    window.skipToFinalBoss = () => {
      console.log('Skipping to final boss...');
      // Set all creatures as defeated except the final boss
      const allCreatures = getAllCreaturesInOrder();
      const finalBossId = 'ancientOracle';
      const allExceptFinalBoss = allCreatures.filter(c => c.id !== finalBossId).map(c => c.id);
      
      // Complete all stages except the final one
      const allStages = [];
      Object.values(worlds).forEach(world => {
        world.stages.forEach(stage => {
          if (stage.id !== 'sanctum_final') {
            allStages.push(stage.id);
          }
        });
      });
      
      setDefeatedCreatures(allExceptFinalBoss);
      setCompletedStages(allStages);
      console.log('Progress updated! You can now access the final boss.');
    };
    
    console.log('Console command available: skipToFinalBoss()');
    
    // Cleanup
    return () => {
      delete window.skipToFinalBoss;
    };
  }, [maxPlayerHealth]);

  const checkStageCompletion = () => {
    for (const world of Object.values(worlds)) {
      for (const stage of world.stages) {
        if (!completedStages.includes(stage.id)) {
          const stageCreatures = stage.creatures;
          const allDefeated = stageCreatures.every(creatureId => defeatedCreatures.includes(creatureId));
          
          if (allDefeated && stageCreatures.length > 0) {
            setCompletedStages(prev => [...prev, stage.id]);
            // Show stage completion story
            setTimeout(() => {
              setStoryData({ world, stage, storyType: 'victory' });
              setShowStoryModal(true);
            }, 1500);
          }
        }
      }
    }
  };

  const selectCreature = (creatureId, replay = false) => {
    const creature = creatures[creatureId];
    
    // Determine if this is a replay (creature already defeated)
    const isReplay = replay || defeatedCreatures.includes(creatureId);
    setIsReplaying(isReplay);
    
    // Handle boss mechanics
    if (creature.isBoss) {
      setCurrentBossPhase(1);
      setBossPhaseHealth(creature.phases[0].phaseHealth);
      setCurrentCreature({
        ...creature,
        currentHealth: creature.maxHealth,
        currentPhase: 1,
        currentWeakness: creature.phases[0].weakness
      });
    } else {
      setCurrentCreature({
        ...creature,
        currentHealth: creature.maxHealth
      });
    }
    
    setSelectedCreatureId(creatureId);
    setGameState('ready');
    setBattleResult(null);
    setBattleAnimation('creature-idle');
    setSpellEffect('');
    setPlayerHealth(maxPlayerHealth);
    setPlayerTakingDamage(false);
  };

  const handleStoryShow = (world) => {
    setStoryData({ world, stage: null, storyType: 'world' });
    setShowStoryModal(true);
  };

  const handleStoryClose = () => {
    setShowStoryModal(false);
  };

  const backToWorldMap = () => {
    setCurrentCreature(null);
    setSelectedCreatureId(null);
    setBattleResult(null);
    setGameState('worldMap');
    setShowVictoryModal(false);
    setShowDefeatModal(false);
    setPlayerHealth(maxPlayerHealth);
    setCurrentBossPhase(1);
    setBossPhaseHealth(100);
  };

  const handleSpellCast = async (spellText) => {
    setIsLoading(true);
    setBattleResult(null);
    setBattleAnimation('creature-casting');
    setSpellEffect('🔮');

    try {
      const response = await fetch(`${API_URL}/api/spells/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spell: spellText,
          creatureType: currentCreature.name,
          creatureWeakness: currentCreature.isBoss ? currentCreature.currentWeakness : currentCreature.weakness,
          isBoss: currentCreature.isBoss || false,
          bossPhase: currentCreature.isBoss ? currentBossPhase : null
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

      // Add to spell history (only if not moderated)
      if (!result.moderated) {
        const spellRecord = {
          spell: spellText,
          creature: currentCreature.name,
          damage: result.evaluation.damage,
          healing: result.evaluation.healing || 0,
          effectiveness: result.evaluation.effectiveness,
          timestamp: new Date().toLocaleTimeString()
        };
        setSpellHistory(prev => [spellRecord, ...prev].slice(0, 10)); // Keep last 10 spells
      }

      // Handle healing first
      const healing = result.evaluation.healing || 0;
      if (healing > 0) {
        const newPlayerHealth = Math.min(maxPlayerHealth, playerHealth + healing);
        setPlayerHealth(newPlayerHealth);
        
        // Show healing effect
        setSpellEffect('💚');
        setTimeout(() => setSpellEffect(''), 1500);
      }

      // Calculate damage and handle boss phases
      const damage = result.evaluation.damage;
      let newHealth = currentCreature.currentHealth;
      let phaseCompleted = false;

      if (currentCreature.isBoss) {
        // Boss phase-based damage calculation
        const newPhaseHealth = Math.max(0, bossPhaseHealth - damage);
        setBossPhaseHealth(newPhaseHealth);
        
        // Calculate overall health based on phases completed + current phase damage
        let totalHealthLost = 0;
        for (let i = 0; i < currentBossPhase - 1; i++) {
          totalHealthLost += currentCreature.phases[i].phaseHealth;
        }
        totalHealthLost += (currentCreature.phases[currentBossPhase - 1].phaseHealth - newPhaseHealth);
        newHealth = currentCreature.maxHealth - totalHealthLost;
        
        if (newPhaseHealth <= 0 && currentBossPhase < currentCreature.phases.length) {
          // Phase completed, move to next phase
          phaseCompleted = true;
          const nextPhase = currentBossPhase + 1;
          setCurrentBossPhase(nextPhase);
          
          if (nextPhase <= currentCreature.phases.length) {
            const phaseData = currentCreature.phases[nextPhase - 1];
            setBossPhaseHealth(phaseData.phaseHealth);
            setCurrentCreature(prev => ({
              ...prev,
              currentPhase: nextPhase,
              currentWeakness: phaseData.weakness,
              currentHealth: newHealth
            }));
          }
        } else {
          // Update current health
          setCurrentCreature(prev => ({
            ...prev,
            currentHealth: newHealth
          }));
        }
      } else {
        // Regular creature damage
        newHealth = Math.max(0, currentCreature.currentHealth - damage);
        setCurrentCreature(prev => ({
          ...prev,
          currentHealth: newHealth
        }));
      }
      
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
          } else if (phaseCompleted && currentCreature.isBoss) {
            setBattleAnimation('boss-phase-transition');
          } else {
            setBattleAnimation('creature-idle');
          }
        }, 800);
      } else {
        setBattleAnimation('creature-idle');
      }

      // Check win condition FIRST - if creature is defeated, it can't attack back
      if (newHealth <= 0) {
        let earnedScore = 0;
        
        // Only give points if this is not a replay
        if (!isReplaying) {
          // Calculate score based on effectiveness and creature difficulty
          const baseScore = currentCreature.maxHealth;
          const effectivenessBonus = result.evaluation.effectiveness * 10;
          earnedScore = baseScore + effectivenessBonus;
          
          setScore(prev => prev + earnedScore);
          // Only add to defeated creatures if not already defeated
          if (!defeatedCreatures.includes(currentCreature.id)) {
            setDefeatedCreatures(prev => [...prev, currentCreature.id]);
          }
        }
        
        setLastEarnedScore(earnedScore);
        setGameState('victory');
        setTimeout(() => setShowVictoryModal(true), 1200);
      } else {
        // Creature is still alive - it can counter-attack (unless it was just a healing spell with no damage)
        const shouldCounterAttack = damage > 0 || healing === 0; // Counter-attack if damage was dealt OR if it wasn't a healing spell
        
        if (shouldCounterAttack) {
          let playerDamage;
          if (currentCreature.isBoss) {
            // Boss damage depends on effectiveness - reward good attempts
            if (effectiveness >= 7) {
              playerDamage = Math.ceil(maxPlayerHealth / 8); // 12.5% damage for good attempts
            } else if (effectiveness >= 4) {
              playerDamage = Math.ceil(maxPlayerHealth / 5); // 20% damage for decent attempts
            } else {
              playerDamage = Math.ceil(maxPlayerHealth / 4); // 25% damage for poor attempts
            }
          } else {
            // Regular creatures do 1/3 damage
            playerDamage = Math.ceil(maxPlayerHealth / 3);
          }
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

          // Check if player is defeated AFTER creature attacks
          if (newPlayerHealth <= 0) {
            // Player is defeated - show modal after health animation completes
            setGameState('defeat');
            setTimeout(() => {
              setShowDefeatModal(true);
            }, 2000); // Wait for health bar animation to complete
          } else if (damage === 0 && result.evaluation.effectiveness <= 3) {
            // If spell was very ineffective, just continue battle
            setGameState('ready');
          }
        }
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
      if (creature.isBoss) {
        setCurrentBossPhase(1);
        setBossPhaseHealth(creature.phases[0].phaseHealth);
        setCurrentCreature({
          ...creature,
          currentHealth: creature.maxHealth,
          currentPhase: 1,
          currentWeakness: creature.phases[0].weakness
        });
      } else {
        setCurrentCreature({
          ...creature,
          currentHealth: creature.maxHealth
        });
      }
    }
    setBattleResult(null);
    setGameState('ready');
    setShowVictoryModal(false);
    setShowDefeatModal(false);
    setPlayerHealth(maxPlayerHealth);
  };

  const closeVictoryModal = () => {
    setShowVictoryModal(false);
  };

  if (gameState === 'worldMap') {
    return (
      <div className="game-interface">
        <WorldMap
          completedStages={completedStages}
          defeatedCreatures={defeatedCreatures}
          score={score}
          onSelectCreature={selectCreature}
          onShowStory={handleStoryShow}
        />
        
        <StoryModal
          isOpen={showStoryModal}
          onClose={handleStoryClose}
          world={storyData.world}
          stage={storyData.stage}
          storyType={storyData.storyType}
        />
      </div>
    );
  }

  return (
    <div className="game-interface">
      <div className="simple-layout">
        {/* Header with back button and score */}
        <div className="game-header">
          <button className="back-button" onClick={backToWorldMap}>
            ← Back to World Map
          </button>
          <div className="game-stats">
            <div className="score">Score: {score}</div>
            <div className="defeated">Defeated: {defeatedCreatures.length}/{getAllCreaturesInOrder().length}</div>
          </div>
        </div>

        {/* Creature info and health bar */}
        <div className="health-section">
          <div className="creature-name">
            <h2>{currentCreature.name}</h2>
          </div>
          
          {/* Show phase health bar for bosses, regular health bar for normal creatures */}
          {currentCreature.isBoss ? (
            <div className="phase-health-section">
              <div className="phase-health-bar">
                <div 
                  className="phase-health-fill"
                  style={{
                    width: `${(bossPhaseHealth / currentCreature.phases[currentBossPhase - 1].phaseHealth) * 100}%`,
                    backgroundColor: '#8b5cf6'
                  }}
                ></div>
              </div>
              <div className="health-text">
                Phase {currentBossPhase}: {bossPhaseHealth}/{currentCreature.phases[currentBossPhase - 1].phaseHealth} HP
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}

          <div className="weakness-info">
            {currentCreature.isBoss ? (
              <div>
                <strong>Phase {currentBossPhase}/3:</strong> {currentCreature.phases[currentBossPhase - 1].phaseDescription}
                <br />
                <strong>Current Weakness:</strong> {currentCreature.currentWeakness}
              </div>
            ) : (
              <div>
                <strong>Known Weakness:</strong> {currentCreature.weakness}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Spell History on the left side */}
        <div className="spell-history-fixed">
          <SpellHistory spellHistory={spellHistory} />
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
          onBackToSelection={backToWorldMap}
          earnedScore={lastEarnedScore}
          isReplaying={isReplaying}
        />

        {/* Defeat Modal */}
        {showDefeatModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="defeat-modal">
                <div className="defeat-header">
                  <h2>Encounter Failed!</h2>
                </div>
                <div className="defeat-body">
                  <p>Your magical energy has been depleted. The {currentCreature.name} has overwhelmed you!</p>
                </div>
                <div className="defeat-actions">
                  <button className="retry-button" onClick={resetGame}>
                    Retry Fight
                  </button>
                  <button className="choose-different-button" onClick={backToWorldMap}>
                    Choose Different Creature
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameInterface;