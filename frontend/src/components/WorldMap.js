import React, { useState } from 'react';
import { worlds, getAvailableStages, getCreaturesByStage } from '../data/creatures';

const WorldMap = ({ 
  completedStages = [],
  defeatedCreatures = [],
  score,
  onSelectCreature,
  onShowStory
}) => {
  const [selectedWorld, setSelectedWorld] = useState(null);
  const availableStages = getAvailableStages(completedStages);

  const isCreatureDefeated = (creatureId) => {
    return defeatedCreatures.includes(creatureId);
  };

  const isStageCompleted = (stageId) => {
    return completedStages.includes(stageId);
  };

  const getStageProgress = (worldId, stageId) => {
    const creatures = getCreaturesByStage(worldId, stageId);
    const defeatedCount = creatures.filter(creature => isCreatureDefeated(creature.id)).length;
    return `${defeatedCount}/${creatures.length}`;
  };

  const isStageAvailable = (stage) => {
    return availableStages.some(availStage => availStage.id === stage.id);
  };

  const renderWorldOverview = () => (
    <div className="world-map-container">
      <div className="world-map-header">
        <h1>Prompt Wizard</h1>
        <div className="game-stats">
          <div className="score">Total Score: {score}</div>
          <div className="progress">Stages Completed: {completedStages.length}</div>
        </div>
      </div>

      <div className="world-selection">
        <h2>Choose Your Realm</h2>
        <div className="worlds-grid">
          {Object.values(worlds).map((world) => {
            const worldStages = world.stages;
            const completedWorldStages = worldStages.filter(stage => isStageCompleted(stage.id)).length;
            const availableWorldStages = worldStages.filter(stage => isStageAvailable(stage)).length;
            const isWorldUnlocked = availableWorldStages > 0;

            return (
              <div
                key={world.id}
                className={`world-card ${!isWorldUnlocked ? 'locked' : ''} ${completedWorldStages === worldStages.length ? 'completed' : ''}`}
                onClick={() => isWorldUnlocked && setSelectedWorld(world)}
              >
                <div className="world-image">{world.image}</div>
                <h3>{world.name}</h3>
                <p>{world.description}</p>
                <div className="world-progress">
                  Progress: {completedWorldStages}/{worldStages.length}
                </div>
                {!isWorldUnlocked && (
                  <div className="locked-overlay">
                    🔒 Complete previous stages to unlock
                  </div>
                )}
                {completedWorldStages === worldStages.length && (
                  <div className="completed-overlay">
                    ✅ MASTERED
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="legend-icon">🌍</span>
          <span>Available Realm</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🔒</span>
          <span>Locked Realm</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">✅</span>
          <span>Mastered Realm</span>
        </div>
      </div>
    </div>
  );

  const renderWorldDetails = (world) => (
    <div className="world-details-container">
      <div className="world-details-header">
        <button 
          className="back-button"
          onClick={() => setSelectedWorld(null)}
        >
          ← Back to World Map
        </button>
        <div className="world-info">
          <h2>{world.image} {world.name}</h2>
          <p>{world.description}</p>
        </div>
        <button 
          className="story-button"
          onClick={() => onShowStory && onShowStory(world)}
        >
          📖 Read Lore
        </button>
      </div>

      <div className="stages-container">
        <h3>Stages</h3>
        <div className="stages-grid">
          {world.stages.map((stage) => {
            const stageAvailable = isStageAvailable(stage);
            const stageCompleted = isStageCompleted(stage.id);
            const creatures = getCreaturesByStage(world.id, stage.id);

            return (
              <div
                key={stage.id}
                className={`stage-card ${!stageAvailable ? 'locked' : ''} ${stageCompleted ? 'completed' : ''}`}
              >
                <div className="stage-header">
                  <h4>{stage.name}</h4>
                  <div className="stage-progress">{getStageProgress(world.id, stage.id)}</div>
                </div>
                <p>{stage.description}</p>
                
                <div className="stage-creatures">
                  {creatures.map((creature) => (
                    <div
                      key={creature.id}
                      className={`creature-mini ${isCreatureDefeated(creature.id) ? 'defeated' : ''} ${!stageAvailable && !stageCompleted ? 'locked' : ''}`}
                      onClick={() => (stageAvailable || stageCompleted) && onSelectCreature(creature.id)}
                      title={creature.name}
                    >
                      <div className="creature-mini-image">{creature.image}</div>
                      <div className="creature-mini-name">{creature.name}</div>
                      {isCreatureDefeated(creature.id) && (
                        <div className="defeated-badge">✅</div>
                      )}
                    </div>
                  ))}
                </div>

                {!stageAvailable && !stageCompleted && (
                  <div className="stage-locked-overlay">
                    🔒 Complete required stages first
                  </div>
                )}

                {stageCompleted && (
                  <div className="stage-completed-overlay">
                    <div>
                      ⭐ STAGE COMPLETE
                      <br />
                      <div className="replay-hint">Click creatures to replay</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (selectedWorld) {
    return renderWorldDetails(selectedWorld);
  }

  return renderWorldOverview();
};

export default WorldMap;