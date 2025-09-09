# Prompt Wizard - Development Plan

## Phase 1: Setup & Basic Prototype

### 1.1 Project Setup
- [x] Create React app and Node.js backend
- [x] Set up OpenAI API integration (gpt-5-nano)
- [x] Basic project structure and git repository

### 1.2 Single Encounter Prototype
- [x] Create simple creature (e.g., Fire Dragon)
- [x] Build basic prompt input interface
- [x] Implement OpenAI API call to evaluate prompt effectiveness
- [x] Display simple battle result (hit/miss/critical)
- [x] Add basic creature health/damage system

## Phase 2: Core Game Loop

### 2.1 Expand Encounter System
- [x] Add 2-3 more creatures with different weaknesses
- [x] Implement creature selection/progression
- [x] Basic win/lose conditions
- [x] Simple scoring system
- [x] Spell casting history log

## Phase 3: Polish & Safety

### 3.1 User Experience
- [x] Improve UI/UX
- [x] Add simple animations for battles
- [x] Basic progress tracking

### 3.2 Content Moderation
- [x] Implement simple safety checks
- [x] Error handling for API failures

### 3.3 Fail Condition
- [x] Player Health bar (underneath the creature, above our casting box area)
- [x] After every spell (that isnt moderated) a third of the players health is taken
- [x] If health reaches 0, display encounter failed, and we can restart the fight or fight a different creature
- [x] Animations for the creatures attacking, and our health going down

### Phase 3.4: Game improvement
- [x] Stages, Progression
- [x] Map, Story
- [x] New Enemies
- [x] Final Boss

## Phase 4: Deploy & Test

### 4.1 Deployment
- [x] Deploy frontend (Vercel)
- [x] Deploy backend (Railway)
- [x] Test full system works online

- [ ] local storage saving (isnt working rn)

### 4.2 Basic Testing
- [x] Test with a few users
- [x] Fix major bugs (hopefully)
- [x] Ensure game is playable end-to-end

## Phase 5: Competition Deliverables

### 5.1 Documentation
- [ ] Create 3-minute demo video
- [x] Write technical writeup PDF
- [x] Clean up code repository
- [ ] Submit all materials

## Future Enhancements (Post-Competition)
- More creatures and spell types
- Advanced prompt evaluation
- Multiplayer features
- Teacher dashboard
- Detailed analytics

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js + Express
- **AI**: OpenAI gpt-5-nano and omni-moderation
- **Deployment**: Vercel + Railway
- **Database**: Start with JSON files, upgrade to MongoDB later if needed

## MVP Features for Prototype
1. One creature encounter
2. Text input for spells
3. AI evaluation of spell effectiveness
4. Basic battle resolution
5. Simple win/lose feedback

Keep it simple, make it work, then iterate!