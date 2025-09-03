
const VictoryModal = ({ isOpen, onClose, onReset }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="victory-modal">
          <div className="victory-header">
            <h2>🏆 Victory!</h2>
          </div>
          <div className="victory-body">
            <p>You have defeated the Fire Dragon!</p>
            <p>Your magical prowess has proven victorious in battle!</p>
          </div>
          <button onClick={onReset} className="reset-button">
            Face Another Dragon
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;