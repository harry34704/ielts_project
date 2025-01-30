const { OpenAI } = require('openai');
const { getProgress, getAllResults } = require('../services/databaseService');
const { generateInsights } = require('../services/analyticsService');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.getOverview = async (req, res) => {
  try {
    const results = await getAllResults();
    const insights = generateInsights(results);

    const overview = {
      totalSessions: results.length,
      skillBreakdown: {
        reading: calculateSkillMetrics(results, 'reading'),
        writing: calculateSkillMetrics(results, 'writing'),
        speaking: calculateSkillMetrics(results, 'speaking')
      },
      recentProgress: results.slice(-5),
      insights: insights
    };

    res.json(overview);
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ error: 'Error generating analytics overview' });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const progress = {
      reading: await getProgress('reading'),
      writing: await getProgress('writing'),
      speaking: await getProgress('speaking')
    };

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching progress data' });
  }
};

exports.generateStudyPlan = async (req, res) => {
  try {
    const results = await getAllResults();
    const insights = generateInsights(results);

    // Generate personalized study plan using OpenAI
    const planResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an IELTS tutor creating personalized study plans."
        },
        {
          role: "user",
          content: `Create a study plan based on these insights: ${JSON.stringify(insights)}`
        }
      ]
    });

    const studyPlan = {
      overview: planResponse.choices[0].message.content,
      tasks: generateTaskList(insights),
      recommendations: generateRecommendations(insights),
      timeEstimate: calculateTimeEstimate(insights)
    };

    res.json(studyPlan);
  } catch (error) {
    res.status(500).json({ error: 'Error generating study plan' });
  }
};

exports.getInsights = async (req, res) => {
  try {
    const results = await getAllResults();
    const insights = generateInsights(results);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: 'Error generating insights' });
  }
};

// Helper functions
function calculateSkillMetrics(results, skillType) {
  const skillResults = results.filter(r => r.type === skillType);
  if (!skillResults.length) return null;

  return {
    averageScore: calculateAverage(skillResults.map(r => r.overallScore)),
    totalSessions: skillResults.length,
    improvement: calculateImprovement(skillResults),
    recentScores: skillResults.slice(-3).map(r => r.overallScore)
  };
}

function calculateAverage(scores) {
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function calculateImprovement(results) {
  if (results.length < 2) return 0;
  const first = results[0].overallScore;
  const last = results[results.length - 1].overallScore;
  return ((last - first) / first) * 100;
}

function generateTaskList(insights) {
  // Generate personalized task list based on insights
  return insights.weakAreas.map(area => ({
    type: area.skill,
    title: `Improve ${area.criterion}`,
    description: `Focus on ${area.recommendation}`,
    duration: 30,
    priority: area.priority
  }));
}

function generateRecommendations(insights) {
  return insights.recommendations.map(rec => ({
    skill: rec.skill,
    focus: rec.focus,
    exercises: rec.exercises,
    timeframe: rec.timeframe
  }));
}

function calculateTimeEstimate(insights) {
  // Calculate estimated study time based on weak areas
  return insights.weakAreas.length * 30; // 30 minutes per weak area
} 