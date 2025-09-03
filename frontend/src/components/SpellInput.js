import React, { useState } from 'react';

const SpellInput = ({ onSpellCast, isLoading, disabled }) => {
  const [spellText, setSpellText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleInputChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setSpellText(text);
      setCharCount(text.length);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (spellText.trim() && !isLoading && !disabled) {
      onSpellCast(spellText.trim());
      setSpellText('');
      setCharCount(0);
    }
  };

  return (
    <div className="spell-input">
      <h3>🪄 Cast Your Spell</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <textarea
            value={spellText}
            onChange={handleInputChange}
            placeholder="Describe your magical attack in detail... (e.g., 'I summon a powerful ice storm to freeze the dragon's flames')"
            rows={4}
            disabled={isLoading || disabled}
            className="spell-textarea"
          />
          <div className="char-counter">
            {charCount}/{maxChars} characters
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={!spellText.trim() || isLoading || disabled}
          className="cast-button"
        >
          {isLoading ? 'Casting Spell...' : 'Cast Spell ⚡'}
        </button>
      </form>
      
    </div>
  );
};

export default SpellInput;