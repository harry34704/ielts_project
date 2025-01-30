const API_URL = process.env.REACT_APP_AI_API_URL || 'http://localhost:5000/api';

export const aiService = {
  // Enhanced Reading analysis
  async analyzeReading(audioBlob, text) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('text', text);

      const response = await fetch(`${API_URL}/analyze-reading`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      // Process detailed analysis
      return {
        ...result,
        detailedAnalysis: {
          wordAccuracy: result.wordAccuracy || {},
          speedAnalysis: result.speedAnalysis || {},
          pronunciationDetails: result.pronunciationDetails || {},
          comprehensionScore: result.comprehensionScore || {}
        },
        recommendations: result.recommendations || []
      };
    } catch (error) {
      console.error('Reading analysis error:', error);
      throw error;
    }
  },

  // Enhanced Writing analysis
  async analyzeWriting(originalText, userText) {
    try {
      const response = await fetch(`${API_URL}/analyze-writing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          original: originalText,
          submission: userText
        })
      });

      const result = await response.json();

      // Process detailed analysis
      return {
        ...result,
        detailedAnalysis: {
          grammarErrors: result.grammarErrors || [],
          vocabularyUsage: result.vocabularyUsage || {},
          coherenceAnalysis: result.coherenceAnalysis || {},
          styleAnalysis: result.styleAnalysis || {}
        },
        improvements: result.improvements || [],
        suggestions: result.suggestions || []
      };
    } catch (error) {
      console.error('Writing analysis error:', error);
      throw error;
    }
  },

  // Enhanced Speaking analysis
  async analyzeSpeaking(audioBlob, task) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('task', JSON.stringify(task));

      const response = await fetch(`${API_URL}/analyze-speaking`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      // Process detailed analysis
      return {
        ...result,
        detailedAnalysis: {
          pronunciationDetails: result.pronunciationDetails || {},
          fluencyMetrics: result.fluencyMetrics || {},
          grammarAnalysis: result.grammarAnalysis || {},
          vocabularyAssessment: result.vocabularyAssessment || {}
        },
        feedback: result.feedback || {},
        improvements: result.improvements || []
      };
    } catch (error) {
      console.error('Speaking analysis error:', error);
      throw error;
    }
  },

  // New method for generating personalized study plans
  async generateStudyPlan(userHistory) {
    try {
      const response = await fetch(`${API_URL}/generate-study-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ history: userHistory })
      });

      return await response.json();
    } catch (error) {
      console.error('Study plan generation error:', error);
      throw error;
    }
  }
}; 