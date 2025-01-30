export const analyticsService = {
  calculateProgress: (history) => {
    const last10Sessions = history.slice(-10);
    
    const progressBySkill = {
      reading: {
        accuracy: [],
        fluency: [],
        pronunciation: [],
        comprehension: []
      },
      writing: {
        grammar: [],
        vocabulary: [],
        coherence: [],
        taskAchievement: []
      },
      speaking: {
        pronunciation: [],
        fluency: [],
        grammar: [],
        vocabulary: []
      }
    };

    // Populate progress arrays
    last10Sessions.forEach(session => {
      Object.entries(session.score).forEach(([criterion, score]) => {
        if (progressBySkill[session.type]?.[criterion]) {
          progressBySkill[session.type][criterion].push(score);
        }
      });
    });

    // Calculate trends
    const trends = {};
    Object.entries(progressBySkill).forEach(([skill, criteria]) => {
      trends[skill] = {};
      Object.entries(criteria).forEach(([criterion, scores]) => {
        if (scores.length >= 2) {
          const firstAvg = scores.slice(0, Math.ceil(scores.length/2))
            .reduce((a, b) => a + b, 0) / Math.ceil(scores.length/2);
          const secondAvg = scores.slice(-Math.floor(scores.length/2))
            .reduce((a, b) => a + b, 0) / Math.floor(scores.length/2);
          trends[skill][criterion] = secondAvg - firstAvg;
        }
      });
    });

    return {
      progressBySkill,
      trends,
      totalSessions: history.length,
      recentProgress: last10Sessions
    };
  },

  generateInsights: (history) => {
    const progress = analyticsService.calculateProgress(history);
    const insights = [];

    // Generate general insights
    if (history.length >= 3) {
      Object.entries(progress.trends).forEach(([skill, criteria]) => {
        Object.entries(criteria).forEach(([criterion, trend]) => {
          if (Math.abs(trend) >= 5) {
            insights.push({
              type: trend > 0 ? 'improvement' : 'decline',
              skill,
              criterion,
              message: trend > 0 
                ? `Your ${criterion} in ${skill} has improved by ${trend.toFixed(1)}%`
                : `Your ${criterion} in ${skill} needs attention (${trend.toFixed(1)}% decline)`
            });
          }
        });
      });
    }

    // Generate recommendations
    const recommendations = analyticsService.generateRecommendations(progress);
    
    return {
      insights,
      recommendations,
      progress
    };
  },

  generateRecommendations: (progress) => {
    const recommendations = [];
    const skillRecommendations = {
      reading: {
        accuracy: [
          'Practice reading aloud more frequently',
          'Focus on pronunciation of difficult words',
          'Take your time to read carefully'
        ],
        fluency: [
          'Read more English content daily',
          'Practice speed reading exercises',
          'Join a reading club'
        ],
        pronunciation: [
          'Use pronunciation apps',
          'Record yourself reading',
          'Practice tongue twisters'
        ],
        comprehension: [
          'Summarize what you read',
          'Answer comprehension questions',
          'Practice inference skills'
        ]
      },
      writing: {
        grammar: [
          'Review basic grammar rules',
          'Use grammar checking tools',
          'Practice specific grammar patterns'
        ],
        vocabulary: [
          'Learn new words in context',
          'Use a vocabulary app',
          'Read more advanced texts'
        ],
        coherence: [
          'Practice using transition words',
          'Create detailed outlines',
          'Study text organization'
        ],
        taskAchievement: [
          'Read task requirements carefully',
          'Practice time management',
          'Create response templates'
        ]
      },
      speaking: {
        pronunciation: [
          'Use pronunciation apps',
          'Practice with native speakers',
          'Record and analyze your speech'
        ],
        fluency: [
          'Practice speaking daily',
          'Join conversation groups',
          'Do speaking exercises'
        ],
        grammar: [
          'Practice speaking with correct grammar',
          'Record and correct your mistakes',
          'Study common speech patterns'
        ],
        vocabulary: [
          'Learn topic-specific vocabulary',
          'Practice using new words',
          'Study collocations'
        ]
      }
    };

    Object.entries(progress.trends).forEach(([skill, criteria]) => {
      Object.entries(criteria).forEach(([criterion, trend]) => {
        if (trend < 0) {
          const recommendationList = skillRecommendations[skill][criterion];
          const recommendation = recommendationList[
            Math.floor(Math.random() * recommendationList.length)
          ];
          recommendations.push({
            skill,
            criterion,
            recommendation
          });
        }
      });
    });

    return recommendations;
  }
}; 