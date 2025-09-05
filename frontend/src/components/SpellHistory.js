import React from 'react';

const SpellHistory = ({ spellHistory }) => {
  if (!spellHistory || spellHistory.length === 0) {
    return (
      <div className="spell-history">
        <h3>📜 Spell History</h3>
        <div className="no-history">
          <p>No spells cast yet</p>
          <p>Your successful spells will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="spell-history">
      <h3>📜 Spell History</h3>
      <div className="history-list">
        {spellHistory.map((spell, index) => (
          <div key={index} className={`spell-entry ${spell.damage > 0 ? 'damage' : spell.healing > 0 ? 'healing' : 'ineffective'}`}>
            <div className="spell-text">
              "{spell.spell}"
            </div>
            <div className="spell-details">
              <div className="spell-target">vs {spell.creature}</div>
              <div className="spell-stats">
                {spell.damage > 0 && (
                  <span className="damage-stat">⚔️ {spell.damage} dmg</span>
                )}
                {spell.healing > 0 && (
                  <span className="healing-stat">💚 +{spell.healing} HP</span>
                )}
                <span className="effectiveness-stat">
                  ✨ {spell.effectiveness}/10
                </span>
              </div>
              <div className="spell-time">{spell.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpellHistory;