import React from 'react';

const CreatureDisplay = ({ creature, gameState }) => {
  const healthPercentage = (creature.currentHealth / creature.maxHealth) * 100;
  
  const getHealthColor = () => {
    if (healthPercentage > 60) return '#4ade80'; // green
    if (healthPercentage > 30) return '#fbbf24'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="creature-display">
      <div className="creature-info">
        <div className="creature-avatar">
          <span className="creature-emoji">{creature.image}</span>
          {gameState === 'victory' && <span className="defeat-overlay">💀</span>}
        </div>
        
        <div className="creature-details">
          <h2>{creature.name}</h2>
          <p className="creature-description">{creature.description}</p>
          
          <div className="health-bar-container">
            <div className="health-label">
              Health: {creature.currentHealth}/{creature.maxHealth}
            </div>
            <div className="health-bar">
              <div 
                className="health-fill"
                style={{ 
                  width: `${healthPercentage}%`,
                  backgroundColor: getHealthColor()
                }}
              />
            </div>
          </div>
          
          <div className="weakness-info">
            <strong>Weakness:</strong> {creature.weakness}
          </div>
          
          <p className="flavor-text">{creature.flavorText}</p>
        </div>
      </div>
    </div>
  );
};

export default CreatureDisplay;