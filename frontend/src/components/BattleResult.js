import React from 'react';

const BattleResult = ({ result, gameState }) => {
  const { evaluation } = result;
  
  const getResultIcon = () => {
    if (gameState === 'victory') return '🏆';
    if (evaluation.success && evaluation.damage > 70) return '💥'; // Critical hit
    if (evaluation.success && evaluation.damage > 30) return '⚔️'; // Hit
    if (evaluation.damage > 0) return '✨'; // Weak hit
    return '💨'; // Miss
  };

  const getResultText = () => {
    if (gameState === 'victory') return 'Victory!';
    if (evaluation.success && evaluation.damage > 70) return 'Critical Hit!';
    if (evaluation.success && evaluation.damage > 30) return 'Direct Hit!';
    if (evaluation.damage > 0) return 'Glancing Blow';
    return 'Spell Fizzled';
  };

  const getResultClass = () => {
    if (gameState === 'victory') return 'result-victory';
    if (evaluation.success && evaluation.damage > 50) return 'result-critical';
    if (evaluation.success) return 'result-hit';
    if (evaluation.damage > 0) return 'result-weak';
    return 'result-miss';
  };

  return (
    <div className={`battle-result ${getResultClass()}`}>
      <div className="result-header">
        <h3><span className="result-icon">{getResultIcon()} </span>
        {getResultText()}</h3>
      </div>
      
      <div className="result-stats">
        <div className="stat">
          <span className="stat-label">Effectiveness:</span>
          <span className="stat-value">{evaluation.effectiveness}/10</span>
        </div>
        <div className="stat">
          <span className="stat-label">Damage Dealt:</span>
          <span className="stat-value">{evaluation.damage}</span>
        </div>
      </div>
      
      <div className="result-feedback">
        <h4>🎯 Feedback:</h4>
        <p>{evaluation.feedback}</p>
      </div>
      
      {evaluation.effectiveness <= 3 && (
        <div className="improvement-tips">
          <h4>💡 Try to improve by:</h4>
          <ul>
            <li>Being more specific about your magical technique</li>
            <li>Directly targeting the creature's weakness</li>
            <li>Adding more detail to your spell description</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BattleResult;