import React from 'react';

const ProgressTracker = ({ 
  score, 
  defeatedCreatures, 
  spellHistory, 
  totalCreatures = 4 
}) => {
  const totalSpells = spellHistory.length;
  const averageEffectiveness = spellHistory.length > 0 
    ? Math.round(spellHistory.reduce((sum, spell) => sum + spell.effectiveness, 0) / spellHistory.length)
    : 0;
  
  const totalDamageDealt = spellHistory.reduce((sum, spell) => sum + spell.damage, 0);
  const highestDamage = spellHistory.reduce((max, spell) => Math.max(max, spell.damage), 0);
  
  const progressPercentage = (defeatedCreatures.length / totalCreatures) * 100;
  
  const achievements = [];
  if (defeatedCreatures.length >= 1) achievements.push({ name: "First Victory", emoji: "🏆", description: "Defeated your first creature" });
  if (defeatedCreatures.length >= totalCreatures / 2) achievements.push({ name: "Half Way", emoji: "⚡", description: "Defeated half of all creatures" });
  if (defeatedCreatures.length >= totalCreatures) achievements.push({ name: "Master Wizard", emoji: "🎖️", description: "Defeated all creatures" });
  if (totalSpells >= 10) achievements.push({ name: "Spell Caster", emoji: "✨", description: "Cast 10+ spells" });
  if (averageEffectiveness >= 7) achievements.push({ name: "Effective Wizard", emoji: "🔮", description: "High average effectiveness" });
  if (highestDamage >= 30) achievements.push({ name: "Heavy Hitter", emoji: "💥", description: "Dealt massive damage in one spell" });

  return (
    <div className="progress-tracker">
      <h3>Your Progress</h3>
      
      {/* Overall Progress Bar */}
      <div className="overall-progress">
        <div className="progress-label">
          <span>Campaign Progress</span>
          <span>{defeatedCreatures.length}/{totalCreatures}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{score}</div>
          <div className="stat-label">Total Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalSpells}</div>
          <div className="stat-label">Spells Cast</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{averageEffectiveness}/10</div>
          <div className="stat-label">Avg Effectiveness</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalDamageDealt}</div>
          <div className="stat-label">Total Damage</div>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="achievements-section">
          <h4>Achievements</h4>
          <div className="achievements-list">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-badge">
                <span className="achievement-emoji">{achievement.emoji}</span>
                <div className="achievement-details">
                  <div className="achievement-name">{achievement.name}</div>
                  <div className="achievement-description">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Milestone */}
      {defeatedCreatures.length < totalCreatures && (
        <div className="next-milestone">
          <div className="milestone-icon">🎯</div>
          <div className="milestone-text">
            Next: Defeat {totalCreatures - defeatedCreatures.length} more creature{totalCreatures - defeatedCreatures.length !== 1 ? 's' : ''} to become a Master Wizard!
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;