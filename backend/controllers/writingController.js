const { OpenAI } = require('openai');
const { saveResult, getProgress } = require('../services/databaseService');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.analyzeWriting = async (req, res) => {
  try {
    const { original, submission } = req.body;

    if (!original || !submission) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Analyze writing using OpenAI
    const analysis = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an IELTS examiner analyzing writing performance."
        },
        {
          role: "user",
          content: `Analyze the following writing submission based on IELTS criteria:
            Task: ${original}
            Submission: ${submission}`
        }
      ]
    });

    // Process and structure the analysis
    const result = {
      scores: {
        grammar: analyzeGrammar(analysis.choices[0].message.content),
        vocabulary: analyzeVocabulary(analysis.choices[0].message.content),
        coherence: analyzeCoherence(analysis.choices[0].message.content),
        taskAchievement: analyzeTaskAchievement(analysis.choices[0].message.content)
      },
      feedback: analysis.choices[0].message.content,
      detailedAnalysis: {
        grammarErrors: extractGrammarErrors(submission),
        vocabularyUsage: analyzeVocabularyUsage(submission),
        coherenceAnalysis: analyzeTextCoherence(submission),
        styleAnalysis: analyzeWritingStyle(submission)
      }
    };

    res.json(result);
  } catch (error) {
    console.error('Writing analysis error:', error);
    res.status(500).json({ error: 'Error analyzing writing' });
  }
};

exports.getWritingTasks = async (req, res) => {
  try {
    // Implement fetching writing tasks from database
    const tasks = [
      {
        id: 1,
        title: "Essay Writing - Academic",
        description: "Write an essay discussing the advantages and disadvantages...",
        level: "intermediate",
        timeLimit: 40
      },
      // Add more tasks...
    ];
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching writing tasks' });
  }
};

exports.saveWritingResult = async (req, res) => {
  try {
    const result = await saveResult('writing', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error saving writing result' });
  }
};

exports.getWritingProgress = async (req, res) => {
  try {
    const progress = await getProgress('writing');
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching writing progress' });
  }
};

// Helper functions
function analyzeGrammar(analysis) {
  // Implement grammar analysis logic
  return 85;
}

function analyzeVocabulary(analysis) {
  // Implement vocabulary analysis logic
  return 80;
}

function analyzeCoherence(analysis) {
  // Implement coherence analysis logic
  return 75;
}

function analyzeTaskAchievement(analysis) {
  // Implement task achievement analysis logic
  return 82;
}

function extractGrammarErrors(text) {
  // Implement grammar error detection
  return [];
}

function analyzeVocabularyUsage(text) {
  // Implement vocabulary usage analysis
  return {};
}

function analyzeTextCoherence(text) {
  // Implement coherence analysis
  return {};
}

function analyzeWritingStyle(text) {
  // Implement writing style analysis
  return {};
} 