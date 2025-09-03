require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
const spellsRouter = require('./routes/spells');
app.use('/api/spells', spellsRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Prompt Wizard API is running' });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Prompt Wizard API', 
    version: '1.0.0',
    endpoints: {
      health: '/health',
      spellEvaluation: '/api/spells/evaluate'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Prompt Wizard backend running on port ${PORT}`);
});