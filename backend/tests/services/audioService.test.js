const audioService = require('../../services/audioService');
const fs = require('fs');
const path = require('path');

describe('Audio Service', () => {
  const testAudioPath = path.join(__dirname, '../fixtures/test-audio.mp3');
  
  beforeAll(() => {
    // Create test audio file if it doesn't exist
    if (!fs.existsSync(testAudioPath)) {
      // Create a simple audio file for testing
      const sampleRate = 44100;
      const duration = 2; // seconds
      const audioData = Buffer.alloc(sampleRate * duration * 2);
      fs.writeFileSync(testAudioPath, audioData);
    }
  });

  afterAll(() => {
    // Cleanup test files
    if (fs.existsSync(testAudioPath)) {
      fs.unlinkSync(testAudioPath);
    }
  });

  test('processAudio converts and transcribes audio', async () => {
    const result = await audioService.processAudio(testAudioPath);
    expect(typeof result).toBe('string');
  });

  test('convertAudio creates mp3 file', async () => {
    const outputPath = await audioService.convertAudio(testAudioPath);
    expect(fs.existsSync(outputPath)).toBe(true);
    fs.unlinkSync(outputPath);
  });

  test('analyzeAudio returns correct metrics', async () => {
    const analysis = await audioService.analyzeAudio(testAudioPath);
    
    expect(analysis).toHaveProperty('duration');
    expect(analysis).toHaveProperty('waveform');
    expect(analysis).toHaveProperty('metrics');
  });
}); 