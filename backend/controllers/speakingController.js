const { OpenAI } = require('openai');
const { processAudio } = require('../services/audioService');
const { saveResult, getProgress } = require('../services/databaseService');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.analyzeSpeaking = async (req, res) => {
  try {
    const { file } = req;
    const task = JSON.parse(req.body.task);

    if (!file || !task) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Process audio file
    const transcription = await processAudio(file.path);

    // Analyze speaking using OpenAI
    const analysis = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an IELTS examiner analyzing speaking performance."
        },
        {
          role: "user",
          content: `Analyze the following speaking response based on IELTS criteria:
            Task: ${JSON.stringify(task)}
            Transcription: ${transcription}`
        }
      ]
    });

    // Process and structure the analysis
    const result = {
      scores: {
        pronunciation: analyzePronunciation(analysis.choices[0].message.content),
        fluency: analyzeFluency(analysis.choices[0].message.content),
        grammar: analyzeGrammar(analysis.choices[0].message.content),
        vocabulary: analyzeVocabulary(analysis.choices[0].message.content)
      },
      feedback: analysis.choices[0].message.content,
      detailedAnalysis: {
        pronunciationDetails: analyzePronunciationDetails(transcription),
        fluencyMetrics: analyzeFluencyMetrics(transcription),
        grammarAnalysis: analyzeGrammarUsage(transcription),
        vocabularyAssessment: assessVocabulary(transcription)
      }
    };

    res.json(result);
  } catch (error) {
    console.error('Speaking analysis error:', error);
    res.status(500).json({ error: 'Error analyzing speaking' });
  }
};

exports.getSpeakingTasks = async (req, res) => {
  try {
    // Implement fetching speaking tasks from database
    const tasks = [
      {
        id: 1,
        title: "Personal Introduction",
        questions: ["Tell me about yourself", "What do you do?"],
        level: "beginner",
        timeLimit: 5
      },
      // Add more tasks...
    ];
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching speaking tasks' });
  }
};

exports.saveSpeakingResult = async (req, res) => {
  try {
    const result = await saveResult('speaking', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error saving speaking result' });
  }
};

exports.getSpeakingProgress = async (req, res) => {
  try {
    const progress = await getProgress('speaking');
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching speaking progress' });
  }
};

// Helper functions
function analyzePronunciation(analysis) {
  // Implement pronunciation analysis logic
  return 85;
}

function analyzeFluency(analysis) {
  // Implement fluency analysis logic
  return 80;
}

function analyzeGrammar(analysis) {
  // Implement grammar analysis logic
  return 75;
}

function analyzeVocabulary(analysis) {
  // Implement vocabulary analysis logic
  return 82;
}

function analyzePronunciationDetails(transcription) {
  // Implement detailed pronunciation analysis
  return {};
}

function analyzeFluencyMetrics(transcription) {
  // Implement fluency metrics analysis
  return {};
}

function analyzeGrammarUsage(transcription) {
  // Implement grammar usage analysis
  return {};
}

function assessVocabulary(transcription) {
  // Implement vocabulary assessment
  return {};
} 