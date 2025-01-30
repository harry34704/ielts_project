export const speakingTasks = [
  {
    id: 1,
    title: 'Describe Your Hometown',
    description: 'Talk about your hometown and what makes it special.',
    parts: [
      'Describe where your hometown is located',
      'Talk about the weather and climate',
      'Discuss what you like most about it',
      'Explain any changes you have seen'
    ],
    expectedKeywords: [
      'located', 'city', 'town', 'weather', 'climate', 'people',
      'community', 'changes', 'development', 'favorite'
    ],
    sampleAnswer: `My hometown is located in the heart of the city. 
                  The weather is generally mild throughout the year. 
                  What I like most about it is the strong sense of community. 
                  Over the years, I've seen significant development in infrastructure.`
  },
  {
    id: 2,
    title: 'Your Daily Routine',
    description: 'Describe your typical daily routine.',
    parts: [
      'What time do you usually wake up',
      'Describe your morning activities',
      'Talk about your work or study schedule',
      'What do you usually do in the evening'
    ],
    expectedKeywords: [
      'morning', 'wake', 'breakfast', 'work', 'study',
      'evening', 'routine', 'schedule', 'activities', 'daily'
    ],
    sampleAnswer: `I usually wake up early in the morning. 
                  After breakfast, I start my daily activities. 
                  My work schedule keeps me busy throughout the day. 
                  In the evening, I enjoy some relaxation time.`
  },
  {
    id: 3,
    title: 'Favorite Hobby',
    description: 'Talk about your favorite hobby or leisure activity.',
    parts: [
      'What is your hobby',
      'When did you start this hobby',
      'Why do you enjoy it',
      'How often do you practice it'
    ],
    expectedKeywords: [
      'hobby', 'enjoy', 'practice', 'started', 'interest',
      'favorite', 'leisure', 'time', 'activity', 'passionate'
    ],
    sampleAnswer: `My favorite hobby is photography. 
                  I started this hobby five years ago. 
                  I enjoy capturing special moments. 
                  I practice photography whenever I have free time.`
  }
]; 