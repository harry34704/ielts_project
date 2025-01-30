const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class AnalyticsService {
  generateInsights(results) {
    try {
      const insights = {
        trends: this.analyzeTrends(results),
        weakAreas: this.identifyWeakAreas(results),
        recommendations: this.generateRecommendations(results),
        progress: this.calculateProgress(results)
      };

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  }

  analyzeTrends(results) {
    const trends = {
      reading: this.calculateSkillTrend(results, 'reading'),
      writing: this.calculateSkillTrend(results, 'writing'),
      speaking: this.calculateSkillTrend(results, 'speaking')
    };

    return trends;
  }

  calculateSkillTrend(results, skillType) {
    const skillResults = results.filter(r => r.type === skillType)
      .sort((a, b) => a.timestamp - b.timestamp);

    if (skillResults.length < 2) return null;

    const trendData = {};
    const criteriaKeys = Object.keys(skillResults[0].scores);

    criteriaKeys.forEach(criterion => {
      const scores = skillResults.map(r => r.scores[criterion]);
      trendData[criterion] = this.calculateTrendLine(scores);
    });

    return trendData;
  }

  calculateTrendLine(scores) {
    const n = scores.length;
    if (n < 2) return 0;

    // Simple linear regression
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    scores.forEach((score, index) => {
      sumX += index;
      sumY += score;
      sumXY += index * score;
      sumXX += index * index;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  identifyWeakAreas(results) {
    const weakAreas = [];
    const recentResults = results.slice(-3);

    recentResults.forEach(result => {
      Object.entries(result.scores).forEach(([criterion, score]) => {
        if (score < 70) {
          weakAreas.push({
            skill: result.type,
            criterion,
            score,
            priority: this.calculatePriority(score),
            recommendation: this.getRecommendation(result.type, criterion)
          });
        }
      });
    });

    return weakAreas.sort((a, b) => b.priority - a.priority);
  }

  calculatePriority(score) {
    if (score < 50) return 3; // High priority
    if (score < 60) return 2; // Medium priority
    return 1; // Low priority
  }

  async generateRecommendations(results) {
    try {
      const weakAreas = this.identifyWeakAreas(results);
      
      const prompt = `Generate specific IELTS improvement recommendations for:
        Weak areas: ${JSON.stringify(weakAreas)}
        Recent results: ${JSON.stringify(results.slice(-3))}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an IELTS expert providing personalized recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      return this.parseRecommendations(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getDefaultRecommendations();
    }
  }

  parseRecommendations(aiResponse) {
    // Parse and structure AI recommendations
    return {
      immediate: this.extractImmediateActions(aiResponse),
      shortTerm: this.extractShortTermGoals(aiResponse),
      longTerm: this.extractLongTermGoals(aiResponse)
    };
  }

  calculateProgress(results) {
    const progress = {
      overall: this.calculateOverallProgress(results),
      bySkill: {
        reading: this.calculateSkillProgress(results, 'reading'),
        writing: this.calculateSkillProgress(results, 'writing'),
        speaking: this.calculateSkillProgress(results, 'speaking')
      }
    };

    return progress;
  }

  calculateOverallProgress(results) {
    if (results.length < 2) return 0;

    const firstResults = results.slice(0, 3);
    const lastResults = results.slice(-3);

    const firstAvg = this.calculateAverageScore(firstResults);
    const lastAvg = this.calculateAverageScore(lastResults);

    return ((lastAvg - firstAvg) / firstAvg) * 100;
  }

  calculateSkillProgress(results, skillType) {
    const skillResults = results.filter(r => r.type === skillType);
    return this.calculateOverallProgress(skillResults);
  }

  calculateAverageScore(results) {
    if (!results.length) return 0;

    const totalScore = results.reduce((sum, result) => {
      const scores = Object.values(result.scores);
      return sum + (scores.reduce((a, b) => a + b, 0) / scores.length);
    }, 0);

    return totalScore / results.length;
  }

  getDefaultRecommendations() {
    return {
      immediate: [
        "Review recent test materials",
        "Practice weak areas daily",
        "Use provided study resources"
      ],
      shortTerm: [
        "Complete practice tests weekly",
        "Focus on improvement areas",
        "Track progress regularly"
      ],
      longTerm: [
        "Aim for consistent practice",
        "Build vocabulary gradually",
        "Develop test strategies"
      ]
    };
  }
}

module.exports = new AnalyticsService(); 