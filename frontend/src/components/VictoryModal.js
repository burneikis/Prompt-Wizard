
const VictoryModal = ({ isOpen, onClose, onReset, creatureName, onBackToSelection, earnedScore }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="victory-modal">
          <div className="victory-header">
            <h2>🏆 Victory!</h2>
          </div>
          <div className="victory-body">
            <p>You have defeated the {creatureName}!</p>
            <p>Your magical prowess has proven victorious in battle!</p>
            {earnedScore && <p><strong>You earned {earnedScore} points!</strong></p>}
          </div>
          <div className="victory-actions">
            <button onClick={onReset} className="reset-button">
              Fight Again
            </button>
            <button onClick={onBackToSelection} className="reset-button">
              Choose Another Creature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;