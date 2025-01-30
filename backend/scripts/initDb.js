const mongoose = require('mongoose');
const Task = require('../models/Task');
const logger = require('../config/logger');

const sampleTasks = [
  {
    type: 'reading',
    title: 'Academic Reading Practice - Technology',
    description: 'Read about artificial intelligence and answer questions',
    level: 'intermediate',
    timeLimit: 20,
    content: {
      text: 'Artificial Intelligence has transformed...',
      questions: [
        'What are the main applications of AI?',
        'How has AI impacted daily life?'
      ]
    }
  },
  {
    type: 'writing',
    title: 'Task 2 Essay - Environment',
    description: 'Write an essay about environmental protection',
    level: 'advanced',
    timeLimit: 40,
    content: {
      prompt: 'Some people believe that environmental problems are too big for individuals to solve...'
    }
  },
  {
    type: 'speaking',
    title: 'Part 2 - Describe a Place',
    description: 'Describe a place you like to visit',
    level: 'beginner',
    timeLimit: 2,
    content: {
      prompt: 'Describe a place you like to visit. You should say:',
      points: [
        'where it is',
        'when you go there',
        'what you do there',
        'and explain why you like it'
      ]
    }
  }
];

const initializeDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB');

    // Clear existing tasks
    await Task.deleteMany({});
    logger.info('Cleared existing tasks');

    // Insert sample tasks
    await Task.insertMany(sampleTasks);
    logger.info('Inserted sample tasks');

    logger.info('Database initialization completed');
    process.exit(0);
  } catch (error) {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initializeDb(); 