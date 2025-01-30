const { OpenAI } = require('openai');
const { processAudio } = require('../services/audioService');
const { saveResult, getProgress } = require('../services/databaseService');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.analyzeReading = async (req, res) => {
  try {
    const { file } = req;
    const { text } = req.body;

    if (!file || !text) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Process audio file
    const transcription = await processAudio(file.path);

    // Analyze reading using OpenAI
    const analysis = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an IELTS examiner analyzing reading performance."
        },
        {
          role: "user",
          content: `Compare the following text with the transcription and provide detailed analysis:
            Original text: ${text}
            Transcription: ${transcription}`
        }
      ]
    });

    // Process and structure the analysis
    const result = {
      scores: {
        accuracy: calculateAccuracy(text, transcription),
        pronunciation: analyzePronunciation(analysis.choices[0].message.content),
        fluency: analyzeFluency(transcription),
        comprehension: analyzeComprehension(analysis.choices[0].message.content)
      },
      feedback: analysis.choices[0].message.content,
      detailedAnalysis: extractDetailedAnalysis(analysis.choices[0].message.content)
    };

    res.json(result);
  } catch (error) {
    console.error('Reading analysis error:', error);
    res.status(500).json({ error: 'Error analyzing reading' });
  }
};

exports.getReadingTasks = async (req, res) => {
  try {
    // Implement fetching reading tasks from database
    const tasks = [
      {
        id: 1,
        title: "Basic Reading - Beginner",
        text: "Sample text for beginner level...",
        level: "beginner",
        timeLimit: 2
      },
      // Add more tasks...
    ];
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reading tasks' });
  }
};

exports.saveReadingResult = async (req, res) => {
  try {
    const result = await saveResult('reading', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error saving reading result' });
  }
};

exports.getReadingProgress = async (req, res) => {
  try {
    const progress = await getProgress('reading');
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reading progress' });
  }
};

// Helper functions
function calculateAccuracy(original, transcription) {
  // Implement accuracy calculation logic
  return 85; // Placeholder
}

function analyzePronunciation(analysis) {
  // Implement pronunciation analysis logic
  return 80; // Placeholder
}

function analyzeFluency(transcription) {
  // Implement fluency analysis logic
  return 75; // Placeholder
}

function analyzeComprehension(analysis) {
  // Implement comprehension analysis logic
  return 82; // Placeholder
}

function extractDetailedAnalysis(analysis) {
  // Implement detailed analysis extraction
  return {
    wordAccuracy: {},
    speedAnalysis: {},
    pronunciationDetails: {},
    comprehensionScore: {}
  };
} 