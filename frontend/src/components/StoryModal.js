import React from 'react';

const StoryModal = ({ isOpen, onClose, world, stage, storyType = 'world' }) => {
  if (!isOpen || (!world && !stage)) return null;

  const getStoryContent = () => {
    if (storyType === 'world' && world) {
      return {
        title: `Welcome to ${world.name}`,
        content: world.storyIntro,
        image: world.image
      };
    }
    
    if (storyType === 'stage' && stage) {
      return {
        title: `${stage.name}`,
        content: stage.storyText || `You have entered ${stage.name}. ${stage.description}`,
        image: '⭐'
      };
    }
    
    if (storyType === 'victory' && stage) {
      return {
        title: `${stage.name} Complete!`,
        content: `Congratulations! You have mastered all challenges in ${stage.name}. Your understanding of prompt magic grows stronger.`,
        image: '🏆'
      };
    }

    if (storyType === 'world_complete' && world) {
      return {
        title: `${world.name} Mastered!`,
        content: `Incredible! You have conquered all stages in ${world.name}. You have proven your mastery over these magical realms and unlocked new challenges ahead.`,
        image: '👑'
      };
    }

    return {
      title: 'Story',
      content: 'Your journey continues...',
      image: '📜'
    };
  };

  const story = getStoryContent();

  return (
    <div className="modal-overlay">
      <div className="modal-content story-modal">
        <div className="story-header">
          <div className="story-image">{story.image}</div>
          <h2>{story.title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="story-body">
          <p>{story.content}</p>
          
          {storyType === 'world' && world && (
            <div className="world-details">
              <h3>What Awaits You:</h3>
              <ul>
                {world.stages.map((stage, index) => (
                  <li key={stage.id}>
                    <strong>Stage {index + 1}:</strong> {stage.name} - {stage.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {storyType === 'victory' && (
            <div className="victory-details">
              <div className="victory-stats">
                <div className="stat">
                  <span className="stat-label">Stage Mastered</span>
                  <span className="stat-value">✅</span>
                </div>
                <div className="stat">
                  <span className="stat-label">New Areas</span>
                  <span className="stat-value">🗺️ Unlocked</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="story-footer">
          <button className="continue-button" onClick={onClose}>
            Continue Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;