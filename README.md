# Prompt Wizard

An interactive web-based RPG that teaches AI literacy to high school students (Years 7-10) through magical spell crafting powered by prompt engineering.

## 🎮 Game Overview

Students learn AI literacy by crafting text prompts (spells) to battle mystical creatures in a fantasy RPG setting. The effectiveness of their magic depends on how well they communicate with an AI system, teaching core concepts of prompt engineering and responsible AI interaction.

## ✨ Features

- **Multiple Creatures**: Battle through various creatures with different vulnerabilities and mechanics
- **World Progression**: Navigate through stages with story integration and a world map
- **AI-Powered Combat**: OpenAI models evaluate spell effectiveness based on prompt clarity and specificity
- **Content Moderation**: Built-in safety checks for appropriate content
- **Educational Tooltips**: Learn AI concepts while playing

## 🏗️ Tech Stack

- **Frontend**: React with Create React App
- **Backend**: Node.js + Express API
- **AI Integration**: OpenAI API for prompt evaluation and content moderation
- **Deployment Target**: Vercel (frontend) + Railway (backend)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm
- OpenAI API key

### Installation

1. Clone the repository and install all dependencies:
```bash
npm run install:all
```

2. Set up environment variables:
   - Create `.env` file in the `backend` directory
   - Add your OpenAI API key: `OPENAI_API_KEY=your_key_here`

3. Start the development environment:
```bash
npm run dev
```

This runs both the frontend (React on port 3000) and backend (Express on port 3001) concurrently.

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run frontend:dev` - Start only the React frontend
- `npm run backend:dev` - Start only the Node.js backend  
- `npm run frontend:build` - Build the frontend for production
- `npm run backend:start` - Start the backend in production mode

## 🎯 Educational Objectives

- **Prompt Engineering**: Learn how specific, clear instructions yield better AI responses
- **AI Probabilistic Nature**: Understand that AI outputs vary and aren't always predictable  

## 🛡️ Safety & Moderation

- All player prompts filtered through OpenAI's moderation API
- Structured AI responses prevent inappropriate content generation
- Educational reflection moments built into gameplay
- Error handling for API failures and inappropriate input
